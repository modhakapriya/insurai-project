package com.insurai.backend.dto;

public record ClaimAiRequest(String claimant, String type, String amount, String status, String submitted, String processing) {}
