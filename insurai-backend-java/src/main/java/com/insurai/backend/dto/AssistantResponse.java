package com.insurai.backend.dto;

public record AssistantResponse(
        String text,
        String source,
        String timestamp
) {
}
