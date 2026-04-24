package com.insurai.backend.controller;

import com.insurai.backend.model.Policy;
import com.insurai.backend.repository.PolicyRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/policies")
public class PolicyController {
    private final PolicyRepository repository;

    public PolicyController(PolicyRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public Object list() {
        return repository.findAllByOrderByCreatedAtDesc();
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Policy policy) {
        if (policy.getHolder() == null || policy.getHolder().isBlank() || policy.getType() == null || policy.getType().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "holder and type are required"));
        }
        policy.setId("POL-2026-" + UUID.randomUUID().toString().replace("-", "").substring(0, 4).toUpperCase());
        if (policy.getPremium() == null) policy.setPremium("--");
        if (policy.getCoverage() == null) policy.setCoverage("--");
        if (policy.getStatus() == null) policy.setStatus("Active");
        if (policy.getRiskScore() == null) policy.setRiskScore("--");
        if (policy.getAiRecommendation() == null) policy.setAiRecommendation("--");
        return ResponseEntity.status(HttpStatus.CREATED).body(repository.save(policy));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable String id, @RequestBody Policy request) {
        return repository.findById(id).<ResponseEntity<?>>map(existing -> {
            if (request.getHolder() != null) existing.setHolder(request.getHolder());
            if (request.getType() != null) existing.setType(request.getType());
            if (request.getPremium() != null) existing.setPremium(request.getPremium());
            if (request.getCoverage() != null) existing.setCoverage(request.getCoverage());
            if (request.getStatus() != null) existing.setStatus(request.getStatus());
            if (request.getRiskScore() != null) existing.setRiskScore(request.getRiskScore());
            if (request.getAiRecommendation() != null) existing.setAiRecommendation(request.getAiRecommendation());
            return ResponseEntity.ok(repository.save(existing));
        }).orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Not found")));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        return repository.findById(id).<ResponseEntity<?>>map(existing -> {
            repository.delete(existing);
            return ResponseEntity.ok(existing);
        }).orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Not found")));
    }
}
