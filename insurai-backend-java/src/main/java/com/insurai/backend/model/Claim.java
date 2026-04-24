package com.insurai.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

import java.time.Instant;

@Entity
@Table(name = "claims")
public class Claim {
    @Id
    private String id;
    @Column(nullable = false)
    private String claimant;
    @Column(nullable = false)
    private String type;
    private String amount;
    private String status;
    @Column(name = "ai_confidence")
    private String aiConfidence;
    private String submitted;
    private String processing;
    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    public Claim() {}

    public Claim(String id, String claimant, String type, String amount, String status, String aiConfidence, String submitted, String processing) {
        this.id = id;
        this.claimant = claimant;
        this.type = type;
        this.amount = amount;
        this.status = status;
        this.aiConfidence = aiConfidence;
        this.submitted = submitted;
        this.processing = processing;
    }

    @PrePersist
    public void prePersist() {
        if (createdAt == null) createdAt = Instant.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getClaimant() { return claimant; }
    public void setClaimant(String claimant) { this.claimant = claimant; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getAmount() { return amount; }
    public void setAmount(String amount) { this.amount = amount; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getAiConfidence() { return aiConfidence; }
    public void setAiConfidence(String aiConfidence) { this.aiConfidence = aiConfidence; }
    public String getSubmitted() { return submitted; }
    public void setSubmitted(String submitted) { this.submitted = submitted; }
    public String getProcessing() { return processing; }
    public void setProcessing(String processing) { this.processing = processing; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
