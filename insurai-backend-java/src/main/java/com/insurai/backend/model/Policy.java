package com.insurai.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

import java.time.Instant;

@Entity
@Table(name = "policies")
public class Policy {
    @Id
    private String id;
    @Column(nullable = false)
    private String holder;
    @Column(nullable = false)
    private String type;
    private String premium;
    private String coverage;
    private String status;
    @Column(name = "risk_score")
    private String riskScore;
    @Column(name = "ai_recommendation")
    private String aiRecommendation;
    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    public Policy() {}

    public Policy(String id, String holder, String type, String premium, String coverage, String status, String riskScore, String aiRecommendation) {
        this.id = id;
        this.holder = holder;
        this.type = type;
        this.premium = premium;
        this.coverage = coverage;
        this.status = status;
        this.riskScore = riskScore;
        this.aiRecommendation = aiRecommendation;
    }

    @PrePersist
    public void prePersist() {
        if (createdAt == null) createdAt = Instant.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getHolder() { return holder; }
    public void setHolder(String holder) { this.holder = holder; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getPremium() { return premium; }
    public void setPremium(String premium) { this.premium = premium; }
    public String getCoverage() { return coverage; }
    public void setCoverage(String coverage) { this.coverage = coverage; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getRiskScore() { return riskScore; }
    public void setRiskScore(String riskScore) { this.riskScore = riskScore; }
    public String getAiRecommendation() { return aiRecommendation; }
    public void setAiRecommendation(String aiRecommendation) { this.aiRecommendation = aiRecommendation; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
