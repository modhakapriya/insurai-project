package com.insurai.backend.controller;

import com.insurai.backend.dto.DocumentClassificationResponse;
import com.insurai.backend.model.DocumentRecord;
import com.insurai.backend.repository.DocumentRepository;
import com.insurai.backend.service.DocumentAiService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/documents")
public class DocumentController {
    private final DocumentRepository repository;
    private final Path uploadDir;
    private final DocumentAiService documentAiService;

    public DocumentController(
            DocumentRepository repository,
            DocumentAiService documentAiService,
            @Value("${app.upload-dir}") String uploadDir
    ) {
        this.repository = repository;
        this.documentAiService = documentAiService;
        this.uploadDir = Paths.get(uploadDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.uploadDir);
        } catch (IOException e) {
            throw new IllegalStateException("Failed to initialize upload directory", e);
        }
    }

    @GetMapping
    public Object list() {
        return repository.findAllByOrderByCreatedAtDesc();
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody DocumentRecord document) {
        if (document.getName() == null || document.getName().isBlank() || document.getCategory() == null || document.getCategory().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "name and category are required"));
        }
        document.setId("DOC-" + UUID.randomUUID().toString().replace("-", "").substring(0, 5).toUpperCase());
        if (document.getSize() == null) document.setSize("--");
        if (document.getTimestamp() == null) document.setTimestamp(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")));
        if (document.getStatus() == null) document.setStatus("Processing");
        if (document.getConfidence() == null) document.setConfidence("--");
        if (document.getStoragePath() == null) document.setStoragePath("");
        if (document.getMimeType() == null) document.setMimeType("");
        return ResponseEntity.status(HttpStatus.CREATED).body(repository.save(document));
    }

    @PostMapping(value = "/classify", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> classify(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "file is required"));
        }
        return ResponseEntity.ok(documentAiService.classify(file));
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> upload(@RequestParam("file") MultipartFile file,
                                    @RequestParam(value = "status", required = false) String status) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "file is required"));
        }

        String id = "DOC-" + UUID.randomUUID().toString().replace("-", "").substring(0, 5).toUpperCase();
        String originalName = file.getOriginalFilename() == null ? "upload.bin" : file.getOriginalFilename();
        String mimeType = file.getContentType() == null ? MediaType.APPLICATION_OCTET_STREAM_VALUE : file.getContentType();
        DocumentClassificationResponse classification = documentAiService.classify(file);
        String storedName = id + "-" + originalName.replaceAll("[^a-zA-Z0-9._-]", "_");
        Path target = uploadDir.resolve(storedName);

        try {
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Failed to store uploaded file"));
        }

        DocumentRecord document = new DocumentRecord();
        document.setId(id);
        document.setName(originalName);
        document.setCategory(classification.category());
        document.setSize(formatSize(file.getSize()));
        document.setTimestamp(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")));
        document.setStatus(status == null || status.isBlank() ? "Processed" : status);
        document.setConfidence(classification.confidence());
        document.setStoragePath(target.toString());
        document.setMimeType(mimeType);

        DocumentRecord saved = repository.save(document);
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("id", saved.getId());
        response.put("name", saved.getName());
        response.put("category", saved.getCategory());
        response.put("size", saved.getSize());
        response.put("timestamp", saved.getTimestamp());
        response.put("status", saved.getStatus());
        response.put("confidence", saved.getConfidence());
        response.put("storagePath", saved.getStoragePath());
        response.put("mimeType", saved.getMimeType());
        response.put("aiSource", classification.source());
        response.put("aiRationale", classification.rationale());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable String id, @RequestBody DocumentRecord request) {
        return repository.findById(id).<ResponseEntity<?>>map(existing -> {
            if (request.getName() != null) existing.setName(request.getName());
            if (request.getCategory() != null) existing.setCategory(request.getCategory());
            if (request.getSize() != null) existing.setSize(request.getSize());
            if (request.getTimestamp() != null) existing.setTimestamp(request.getTimestamp());
            if (request.getStatus() != null) existing.setStatus(request.getStatus());
            if (request.getConfidence() != null) existing.setConfidence(request.getConfidence());
            if (request.getStoragePath() != null) existing.setStoragePath(request.getStoragePath());
            if (request.getMimeType() != null) existing.setMimeType(request.getMimeType());
            return ResponseEntity.ok(repository.save(existing));
        }).orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Not found")));
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<?> download(@PathVariable String id) {
        return repository.findById(id).<ResponseEntity<?>>map(document -> {
            if (document.getStoragePath() == null || document.getStoragePath().isBlank()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "No uploaded file found for this document"));
            }
            try {
                Path filePath = Paths.get(document.getStoragePath()).normalize();
                Resource resource = new UrlResource(filePath.toUri());
                if (!resource.exists()) {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Stored file not found"));
                }
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + document.getName() + "\"")
                        .contentType(MediaType.parseMediaType(document.getMimeType() == null || document.getMimeType().isBlank()
                                ? MediaType.APPLICATION_OCTET_STREAM_VALUE
                                : document.getMimeType()))
                        .body(resource);
            } catch (MalformedURLException e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Failed to load file"));
            }
        }).orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Not found")));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        return repository.findById(id).<ResponseEntity<?>>map(existing -> {
            if (existing.getStoragePath() != null && !existing.getStoragePath().isBlank()) {
                try {
                    Files.deleteIfExists(Paths.get(existing.getStoragePath()));
                } catch (IOException ignored) {
                }
            }
            repository.delete(existing);
            return ResponseEntity.ok(existing);
        }).orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Not found")));
    }

    private String formatSize(long bytes) {
        double kb = bytes / 1024.0;
        if (kb < 1024) {
            return String.format("%.1f KB", kb);
        }
        double mb = kb / 1024.0;
        if (mb < 1024) {
            return String.format("%.1f MB", mb);
        }
        return String.format("%.1f GB", mb / 1024.0);
    }
}
