package com.insurai.backend.controller;

import com.insurai.backend.service.FraudService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/fraud")
public class FraudController {
    private final FraudService fraudService;

    public FraudController(FraudService fraudService) {
        this.fraudService = fraudService;
    }

    @GetMapping
    public Map<String, Object> fraud() {
        return fraudService.buildFraud();
    }
}
