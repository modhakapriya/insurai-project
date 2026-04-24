package com.insurai.backend.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.insurai.backend.dto.DocumentClassificationResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@Service
public class DocumentAiService {
    private static final List<String> ALLOWED_CATEGORIES = List.of(
            "Policy Document",
            "Claim Form",
            "Invoice",
            "Medical Record",
            "Accident Report",
            "Photo Evidence",
            "Inspection",
            "Identity Proof",
            "General Document"
    );

    private final ObjectMapper objectMapper;
    private final HttpClient httpClient;
    private final String apiKey;
    private final String model;

    public DocumentAiService(
            ObjectMapper objectMapper,
            @Value("${openai.api-key:}") String apiKey,
            @Value("${openai.model:gpt-5.4}") String model
    ) {
        this.objectMapper = objectMapper;
        this.httpClient = HttpClient.newHttpClient();
        this.apiKey = apiKey;
        this.model = model;
    }

    public DocumentClassificationResponse classify(MultipartFile file) {
        DocumentClassificationResponse fallback = fallbackClassify(file);
        if (apiKey == null || apiKey.isBlank()) {
            return fallback;
        }

        try {
            String outputText = requestOpenAi(file);
            if (outputText == null || outputText.isBlank()) {
                return fallback;
            }
            Map<String, Object> payload = objectMapper.readValue(outputText, new TypeReference<>() {});
            String category = normalizeCategory(asText(payload.get("category")), fallback.category());
            String confidence = normalizeConfidence(asText(payload.get("confidence")), fallback.confidence());
            String rationale = asText(payload.get("rationale"));
            if (rationale.isBlank()) {
                rationale = "OpenAI classified the document from the available upload metadata.";
            }
            return new DocumentClassificationResponse(category, confidence, rationale, "OpenAI");
        } catch (Exception ex) {
            return fallback;
        }
    }

    private String requestOpenAi(MultipartFile file) throws IOException, InterruptedException {
        String fileName = safeFileName(file.getOriginalFilename());
        String mimeType = file.getContentType() == null ? MediaType.APPLICATION_OCTET_STREAM_VALUE : file.getContentType();
        long sizeBytes = file.getSize();
        String preview = extractTextPreview(file);

        String userPrompt = """
                Classify this insurance-related document and reply as JSON.
                Use exactly these keys: category, confidence, rationale.
                category must be one of: %s
                confidence must be a percentage string like 94%%.

                Document metadata:
                - file_name: %s
                - mime_type: %s
                - size_bytes: %d
                - text_preview: %s
                """.formatted(String.join(", ", ALLOWED_CATEGORIES), fileName, mimeType, sizeBytes, preview);

        Map<String, Object> requestBody = Map.of(
                "model", model,
                "input", List.of(
                        Map.of(
                                "role", "system",
                                "content", List.of(
                                        Map.of(
                                                "type", "input_text",
                                                "text", "You classify insurance documents. Return valid JSON only."
                                        )
                                )
                        ),
                        Map.of(
                                "role", "user",
                                "content", List.of(
                                        Map.of(
                                                "type", "input_text",
                                                "text", userPrompt
                                        )
                                )
                        )
                ),
                "text", Map.of(
                        "format", Map.of("type", "json_object")
                )
        );

        HttpRequest request = HttpRequest.newBuilder(URI.create("https://api.openai.com/v1/responses"))
                .header("Authorization", "Bearer " + apiKey)
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(objectMapper.writeValueAsString(requestBody)))
                .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
        if (response.statusCode() < 200 || response.statusCode() >= 300) {
            throw new IllegalStateException("OpenAI request failed: " + response.statusCode());
        }

        JsonNode root = objectMapper.readTree(response.body());
        String outputText = root.path("output_text").asText("");
        if (!outputText.isBlank()) {
            return outputText;
        }

        JsonNode output = root.path("output");
        if (output.isArray()) {
            for (JsonNode item : output) {
                JsonNode content = item.path("content");
                if (!content.isArray()) continue;
                for (JsonNode part : content) {
                    String text = part.path("text").asText("");
                    if (text.isBlank() && part.path("text").isObject()) {
                        text = part.path("text").path("value").asText("");
                    }
                    if (!text.isBlank()) {
                        return text;
                    }
                }
            }
        }

        return "";
    }

    private DocumentClassificationResponse fallbackClassify(MultipartFile file) {
        String fileName = safeFileName(file.getOriginalFilename()).toLowerCase(Locale.ROOT);
        String mimeType = file.getContentType() == null ? "" : file.getContentType().toLowerCase(Locale.ROOT);
        String category;

        if (fileName.contains("policy")) {
            category = "Policy Document";
        } else if (fileName.contains("claim")) {
            category = "Claim Form";
        } else if (fileName.contains("invoice") || fileName.contains("bill")) {
            category = "Invoice";
        } else if (fileName.contains("medical") || fileName.contains("hospital") || fileName.contains("prescription")) {
            category = "Medical Record";
        } else if (fileName.contains("accident") || fileName.contains("incident")) {
            category = "Accident Report";
        } else if (mimeType.startsWith("image/")) {
            category = "Photo Evidence";
        } else if (fileName.contains("inspection")) {
            category = "Inspection";
        } else if (fileName.contains("id") || fileName.contains("aadhaar") || fileName.contains("passport") || fileName.contains("license")) {
            category = "Identity Proof";
        } else {
            category = "General Document";
        }

        String confidence = mimeType.startsWith("image/") ? "88%" : fileName.endsWith(".pdf") ? "95%" : "91%";
        String rationale = "Fallback classifier used file name, type, and MIME metadata because OpenAI was unavailable.";
        return new DocumentClassificationResponse(category, confidence, rationale, "Fallback");
    }

    private String extractTextPreview(MultipartFile file) {
        String mimeType = file.getContentType() == null ? "" : file.getContentType().toLowerCase(Locale.ROOT);
        String fileName = safeFileName(file.getOriginalFilename()).toLowerCase(Locale.ROOT);
        boolean textLike = mimeType.startsWith("text/")
                || mimeType.contains("json")
                || mimeType.contains("xml")
                || mimeType.contains("csv")
                || fileName.endsWith(".txt")
                || fileName.endsWith(".csv")
                || fileName.endsWith(".json")
                || fileName.endsWith(".xml");

        if (!textLike) {
            return "Binary document. No text preview available.";
        }

        try {
            byte[] bytes = file.getBytes();
            int length = Math.min(bytes.length, 1200);
            String preview = new String(bytes, 0, length, StandardCharsets.UTF_8)
                    .replaceAll("\\s+", " ")
                    .trim();
            return preview.isBlank() ? "Text preview was empty." : preview;
        } catch (IOException ex) {
            return "Failed to extract text preview.";
        }
    }

    private String normalizeCategory(String rawValue, String fallback) {
        if (rawValue == null || rawValue.isBlank()) return fallback;
        for (String category : ALLOWED_CATEGORIES) {
            if (category.equalsIgnoreCase(rawValue.trim())) {
                return category;
            }
        }
        return fallback;
    }

    private String normalizeConfidence(String rawValue, String fallback) {
        if (rawValue == null || rawValue.isBlank()) return fallback;
        String digits = rawValue.replaceAll("[^0-9.]", "");
        if (digits.isBlank()) return fallback;
        try {
            double value = Double.parseDouble(digits);
            if (value <= 1) value *= 100;
            value = Math.max(1, Math.min(100, value));
            return String.format(Locale.US, "%.0f%%", value);
        } catch (NumberFormatException ex) {
            return fallback;
        }
    }

    private String asText(Object value) {
        return value == null ? "" : String.valueOf(value).trim();
    }

    private String safeFileName(String value) {
        return value == null || value.isBlank() ? "upload.bin" : value;
    }
}
