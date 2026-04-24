package com.insurai.backend.dto;

public record PolicyAiRequest(String holder, String type, String premium, String coverage, String status) {}
