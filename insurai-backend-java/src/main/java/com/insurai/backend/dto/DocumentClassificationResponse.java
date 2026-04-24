package com.insurai.backend.dto;

public record DocumentClassificationResponse(
        String category,
        String confidence,
        String rationale,
        String source
) {
}
