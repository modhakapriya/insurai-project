package com.insurai.backend.dto;

public record ClaimAiResponse(String aiConfidence, String recommendedStatus, String processingNote, String rationale) {}
