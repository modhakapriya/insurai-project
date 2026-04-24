package com.insurai.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.insurai.backend.dto.AssistantResponse;
import com.insurai.backend.model.Claim;
import com.insurai.backend.model.DocumentRecord;
import com.insurai.backend.model.Policy;
import com.insurai.backend.repository.ClaimRepository;
import com.insurai.backend.repository.DocumentRepository;
import com.insurai.backend.repository.PolicyRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@Service
public class AssistantService {
    private final ObjectMapper objectMapper;
    private final HttpClient httpClient;
    private final PolicyRepository policyRepository;
    private final ClaimRepository claimRepository;
    private final DocumentRepository documentRepository;
    private final String apiKey;
    private final String model;

    public AssistantService(
            ObjectMapper objectMapper,
            PolicyRepository policyRepository,
            ClaimRepository claimRepository,
            DocumentRepository documentRepository,
            @Value("${openai.api-key:}") String apiKey,
            @Value("${openai.model:gpt-5.4}") String model
    ) {
        this.objectMapper = objectMapper;
        this.httpClient = HttpClient.newHttpClient();
        this.policyRepository = policyRepository;
        this.claimRepository = claimRepository;
        this.documentRepository = documentRepository;
        this.apiKey = apiKey;
        this.model = model;
    }

    public AssistantResponse chat(String message) {
        String cleanMessage = message == null ? "" : message.trim();
        if (cleanMessage.isBlank()) {
            return new AssistantResponse(
                    "Please ask a question about policies, claims, risk, fraud, or document processing.",
                    "fallback",
                    LocalDateTime.now().toString()
            );
        }

        String context = buildContextSummary();
        if (apiKey != null && !apiKey.isBlank()) {
            try {
                String text = requestOpenAi(cleanMessage, context);
                if (!text.isBlank()) {
                    return new AssistantResponse(text, "openai", LocalDateTime.now().toString());
                }
            } catch (Exception ignored) {
            }
        }

        return new AssistantResponse(buildFallbackReply(cleanMessage, context), "fallback", LocalDateTime.now().toString());
    }

    private String requestOpenAi(String message, String context) throws IOException, InterruptedException {
        String userPrompt = """
                You are an insurance operations assistant for InsurAI.
                Answer clearly and directly using the portfolio context below.
                Keep the answer practical and concise, around 4-6 sentences.
                If the question asks for a summary, include the most relevant counts.

                Portfolio context:
                %s

                User question:
                %s
                """.formatted(context, message);

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("model", model);
        body.put("input", List.of(
                Map.of(
                        "role", "system",
                        "content", List.of(
                                Map.of(
                                        "type", "input_text",
                                        "text", "You are InsurAI Assistant. Give helpful insurance operations guidance. Return valid JSON with keys text and source_summary."
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
        ));
        body.put("text", Map.of("format", Map.of("type", "json_object")));

        HttpRequest request = HttpRequest.newBuilder(URI.create("https://api.openai.com/v1/responses"))
                .header("Authorization", "Bearer " + apiKey)
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(objectMapper.writeValueAsString(body)))
                .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
        if (response.statusCode() < 200 || response.statusCode() >= 300) {
            throw new IllegalStateException("OpenAI request failed: " + response.statusCode());
        }

        String outputText = extractOutputText(response.body());
        if (outputText.isBlank()) {
            return "";
        }

        JsonNode parsed = objectMapper.readTree(outputText);
        String text = parsed.path("text").asText("");
        return text.isBlank() ? outputText : text;
    }

    private String extractOutputText(String responseBody) throws IOException {
        JsonNode root = objectMapper.readTree(responseBody);
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

    private String buildContextSummary() {
        List<Policy> policies = policyRepository.findAll();
        List<Claim> claims = claimRepository.findAll();
        List<DocumentRecord> documents = documentRepository.findAll();

        long activePolicies = policies.stream()
                .filter(policy -> "active".equalsIgnoreCase(String.valueOf(policy.getStatus())))
                .count();
        long reviewPolicies = policies.stream()
                .filter(policy -> String.valueOf(policy.getAiRecommendation()).toLowerCase(Locale.ROOT).contains("review"))
                .count();
        long approvedClaims = claims.stream()
                .filter(claim -> "approved".equalsIgnoreCase(String.valueOf(claim.getStatus())))
                .count();
        long flaggedClaims = claims.stream()
                .filter(claim -> {
                    String status = String.valueOf(claim.getStatus()).toLowerCase(Locale.ROOT);
                    return status.contains("flagged") || status.contains("review");
                })
                .count();
        long processedDocuments = documents.stream()
                .filter(doc -> "processed".equalsIgnoreCase(String.valueOf(doc.getStatus())))
                .count();

        double avgPolicyRisk = policies.stream()
                .map(Policy::getRiskScore)
                .mapToDouble(this::parseRiskScore)
                .filter(value -> value > 0)
                .average()
                .orElse(0.0);

        double avgClaimConfidence = claims.stream()
                .map(Claim::getAiConfidence)
                .mapToDouble(this::parsePercent)
                .filter(value -> value > 0)
                .average()
                .orElse(0.0);

        return """
                Policies: %d total, %d active, %d review-required, average policy risk %.1f/10.
                Claims: %d total, %d approved, %d flagged/review, average AI confidence %.1f%%.
                Documents: %d total, %d processed.
                """.formatted(
                policies.size(),
                activePolicies,
                reviewPolicies,
                avgPolicyRisk,
                claims.size(),
                approvedClaims,
                flaggedClaims,
                avgClaimConfidence,
                documents.size(),
                processedDocuments
        );
    }

    private String buildFallbackReply(String message, String context) {
        String lower = message.toLowerCase(Locale.ROOT);
        if (lower.contains("policy")) {
            return "Here is the current policy picture: " + firstSentence(context)
                    + " If you want, I can next help you narrow this to active policies, review-required policies, or high-risk policies.";
        }
        if (lower.contains("claim")) {
            return "From the current claims data, we can focus on approval flow and review load. "
                    + secondSentence(context)
                    + " If you want deeper help, ask for flagged claims, approval readiness, or a claim summary by status.";
        }
        if (lower.contains("risk")) {
            return "The current portfolio risk view is: " + firstSentence(context)
                    + " That suggests we should pay attention to policies marked for review and any claims with lower confidence.";
        }
        if (lower.contains("fraud") || lower.contains("compliance")) {
            return "A practical fraud/compliance starting point is to review flagged claims, low-confidence decisions, and documents still not processed. "
                    + secondSentence(context)
                    + " I can also help you phrase a fraud review summary.";
        }
        if (lower.contains("document")) {
            return "On the document side, " + thirdSentence(context)
                    + " If you want, I can help summarize document pipeline health or explain the latest uploads.";
        }
        return "I’m ready to help with policies, claims, risk, fraud, and documents. "
                + context.replace("\n", " ").trim()
                + " Ask me for a focused summary if you want a more specific answer.";
    }

    private String firstSentence(String context) {
        String[] lines = context.split("\\R");
        return lines.length > 0 ? lines[0].trim() : context;
    }

    private String secondSentence(String context) {
        String[] lines = context.split("\\R");
        return lines.length > 1 ? lines[1].trim() : context;
    }

    private String thirdSentence(String context) {
        String[] lines = context.split("\\R");
        return lines.length > 2 ? lines[2].trim() : context;
    }

    private double parseRiskScore(String value) {
        if (value == null) return 0;
        String digits = value.replaceAll("[^0-9.]", "");
        if (digits.isBlank()) return 0;
        try {
            return Double.parseDouble(digits);
        } catch (NumberFormatException ex) {
            return 0;
        }
    }

    private double parsePercent(String value) {
        if (value == null) return 0;
        String digits = value.replaceAll("[^0-9.]", "");
        if (digits.isBlank()) return 0;
        try {
            double parsed = Double.parseDouble(digits);
            return Math.max(0, Math.min(100, parsed));
        } catch (NumberFormatException ex) {
            return 0;
        }
    }
}
