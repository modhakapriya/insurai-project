package com.insurai.backend.controller;

import com.insurai.backend.model.Claim;
import com.insurai.backend.repository.ClaimRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/claims")
public class ClaimController {
    private final ClaimRepository repository;

    public ClaimController(ClaimRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public Object list() {
        return repository.findAllByOrderByCreatedAtDesc();
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Claim claim) {
        if (claim.getClaimant() == null || claim.getClaimant().isBlank() || claim.getType() == null || claim.getType().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "claimant and type are required"));
        }
        claim.setId("CL-2026-" + UUID.randomUUID().toString().replace("-", "").substring(0, 4).toUpperCase());
        if (claim.getAmount() == null) claim.setAmount("--");
        if (claim.getStatus() == null) claim.setStatus("Pending");
        if (claim.getAiConfidence() == null) claim.setAiConfidence("--");
        if (claim.getSubmitted() == null) claim.setSubmitted(LocalDate.now().toString());
        if (claim.getProcessing() == null) claim.setProcessing("Under review");
        return ResponseEntity.status(HttpStatus.CREATED).body(repository.save(claim));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable String id, @RequestBody Claim request) {
        return repository.findById(id).<ResponseEntity<?>>map(existing -> {
            if (request.getClaimant() != null) existing.setClaimant(request.getClaimant());
            if (request.getType() != null) existing.setType(request.getType());
            if (request.getAmount() != null) existing.setAmount(request.getAmount());
            if (request.getStatus() != null) existing.setStatus(request.getStatus());
            if (request.getAiConfidence() != null) existing.setAiConfidence(request.getAiConfidence());
            if (request.getSubmitted() != null) existing.setSubmitted(request.getSubmitted());
            if (request.getProcessing() != null) existing.setProcessing(request.getProcessing());
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
