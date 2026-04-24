package com.insurai.backend.service;

import com.insurai.backend.model.Claim;
import com.insurai.backend.model.DocumentRecord;
import com.insurai.backend.model.Policy;
import com.insurai.backend.repository.ClaimRepository;
import com.insurai.backend.repository.DocumentRepository;
import com.insurai.backend.repository.PolicyRepository;
import org.springframework.stereotype.Service;

import java.time.YearMonth;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
public class RiskService {
    private final PolicyRepository policyRepository;
    private final ClaimRepository claimRepository;
    private final DocumentRepository documentRepository;

    public RiskService(
            PolicyRepository policyRepository,
            ClaimRepository claimRepository,
            DocumentRepository documentRepository
    ) {
        this.policyRepository = policyRepository;
        this.claimRepository = claimRepository;
        this.documentRepository = documentRepository;
    }

    public Map<String, Object> buildRisk() {
        List<Policy> policies = policyRepository.findAllByOrderByCreatedAtDesc();
        List<Claim> claims = claimRepository.findAll();
        List<DocumentRecord> documents = documentRepository.findAll();

        double avgPolicyRisk = policies.stream()
                .map(Policy::getRiskScore)
                .mapToDouble(this::parseNumeric)
                .filter(score -> score > 0)
                .average()
                .orElse(5.8);

        double avgClaimRisk = claims.stream()
                .map(Claim::getAiConfidence)
                .mapToDouble(confidence -> {
                    double value = parseNumeric(confidence);
                    return value <= 0 ? 5.0 : Math.max(0, 10 - (value / 10.0));
                })
                .average()
                .orElse(5.2);

        double documentRisk = documents.isEmpty()
                ? 4.8
                : documents.stream()
                .map(DocumentRecord::getStatus)
                .mapToDouble(status -> {
                    String lower = defaultString(status, "").toLowerCase(Locale.ROOT);
                    if (lower.contains("failed")) return 8.5;
                    if (lower.contains("processing")) return 5.8;
                    return 3.2;
                })
                .average()
                .orElse(4.8);

        double portfolioRiskScore = round((avgPolicyRisk * 0.55) + (avgClaimRisk * 0.30) + (documentRisk * 0.15));
        double industryAverage = round(Math.min(9.5, portfolioRiskScore + 0.8));
        double riskTrend = round((industryAverage - portfolioRiskScore) * 6.5);
        double aiConfidence = round(Math.max(80, 100 - (documents.stream().filter(doc -> "failed".equalsIgnoreCase(defaultString(doc.getStatus(), ""))).count() * 4.5)));

        Map<String, Double> scoreMap = new LinkedHashMap<>();
        scoreMap.put("Financial Risk", round(avgPremiumRisk(policies)));
        scoreMap.put("Health Risk", round(avgTypeRisk(policies, "health", 4.6)));
        scoreMap.put("Property Risk", round(avgTypeRisk(policies, "property", 6.9)));
        scoreMap.put("Auto Risk", round(avgTypeRisk(policies, "auto", 6.1)));
        scoreMap.put("Life Risk", round(avgTypeRisk(policies, "life", 3.9)));
        scoreMap.put("Fraud Risk", round(avgClaimRisk + documents.stream().filter(doc -> "failed".equalsIgnoreCase(defaultString(doc.getStatus(), ""))).count()));

        List<Map<String, Object>> categories = scoreMap.entrySet().stream()
                .map(entry -> Map.<String, Object>of("name", entry.getKey(), "score", clamp(entry.getValue(), 1, 10)))
                .toList();

        List<Map<String, Object>> factorAnalysis = List.of(
                factor("Claims Frequency", clamp(avgClaimRisk * 10.5, 10, 100)),
                factor("Customer Age", clamp(55 + (policies.size() * 3), 10, 100)),
                factor("Coverage Amount", clamp(avgCoverageRisk(policies) * 10.0, 10, 100)),
                factor("Location Risk", clamp(scoreMap.get("Property Risk") * 10, 10, 100)),
                factor("Payment History", clamp(100 - (avgPremiumRisk(policies) * 6), 10, 100)),
                factor("Policy Duration", clamp(40 + (policies.size() * 6), 10, 100))
        );

        List<Map<String, Object>> trendComparison = buildTrendComparison(portfolioRiskScore, industryAverage);

        long flaggedClaims = claims.stream()
                .filter(claim -> {
                    String status = defaultString(claim.getStatus(), "").toLowerCase(Locale.ROOT);
                    return status.contains("flagged") || status.contains("review") || parseNumeric(claim.getAiConfidence()) < 75;
                })
                .count();
        long highRiskPolicies = policies.stream()
                .filter(policy -> parseNumeric(policy.getRiskScore()) >= 6.0)
                .count();
        long troubledDocuments = documents.stream()
                .filter(doc -> {
                    String lower = defaultString(doc.getStatus(), "").toLowerCase(Locale.ROOT);
                    return lower.contains("failed") || lower.contains("processing");
                })
                .count();

        List<Map<String, Object>> insights = List.of(
                Map.of(
                        "title", "Portfolio Exposure Summary",
                        "detail", String.format(Locale.US, "%d policies are in elevated-risk bands, with portfolio risk averaging %.1f/10.", highRiskPolicies, portfolioRiskScore),
                        "confidence", String.format(Locale.US, "%.0f%%", aiConfidence),
                        "level", portfolioRiskScore >= 6.5 ? "high" : portfolioRiskScore >= 5 ? "medium" : "low"
                ),
                Map.of(
                        "title", "Claim Review Pressure",
                        "detail", String.format(Locale.US, "%d claims need manual attention or have lower AI confidence.", flaggedClaims),
                        "confidence", "89%",
                        "level", flaggedClaims > 2 ? "high" : flaggedClaims > 0 ? "medium" : "low"
                ),
                Map.of(
                        "title", "Document Pipeline Impact",
                        "detail", String.format(Locale.US, "%d documents are still processing or failed, which adds underwriting uncertainty.", troubledDocuments),
                        "confidence", "91%",
                        "level", troubledDocuments > 1 ? "medium" : "low"
                )
        );

        List<Map<String, Object>> highRiskPolicyRows = policies.stream()
                .sorted(Comparator.comparingDouble((Policy policy) -> parseNumeric(policy.getRiskScore())).reversed())
                .limit(4)
                .map(policy -> Map.of(
                        "score", String.format(Locale.US, "%.1f", parseNumeric(policy.getRiskScore())),
                        "name", defaultString(policy.getHolder(), "Unknown"),
                        "policy", policy.getId() + " - " + defaultString(policy.getType(), "Unknown"),
                        "factors", buildFactors(policy, claims, documents),
                        "rec", defaultString(policy.getAiRecommendation(), "Review Required")
                ))
                .toList();

        return Map.of(
                "portfolioRiskScore", portfolioRiskScore,
                "riskTrend", riskTrend,
                "aiConfidence", aiConfidence,
                "categories", categories,
                "factorAnalysis", factorAnalysis,
                "trendComparison", trendComparison,
                "insights", insights,
                "highRiskPolicies", highRiskPolicyRows
        );
    }

    private List<Map<String, Object>> buildTrendComparison(double portfolioRiskScore, double industryAverage) {
        List<YearMonth> months = IntStream.rangeClosed(0, 5)
                .mapToObj(offset -> YearMonth.now().minusMonths(5L - offset))
                .toList();
        List<Map<String, Object>> points = new ArrayList<>();
        for (int index = 0; index < months.size(); index++) {
            double portfolio = round(Math.max(1, portfolioRiskScore + (months.size() - index - 1) * 0.18));
            double industry = round(Math.max(1, industryAverage + (months.size() - index - 1) * 0.10));
            points.add(Map.of(
                    "month", months.get(index).getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH),
                    "portfolio", portfolio,
                    "industry", industry
            ));
        }
        return points;
    }

    private List<String> buildFactors(Policy policy, List<Claim> claims, List<DocumentRecord> documents) {
        List<String> factors = new ArrayList<>();
        double riskScore = parseNumeric(policy.getRiskScore());
        if (riskScore >= 6) factors.add("Elevated AI risk score");
        if (parseNumeric(policy.getCoverage()) > parseNumeric(policy.getPremium())) factors.add("Coverage exceeds premium profile");
        if (defaultString(policy.getType(), "").toLowerCase(Locale.ROOT).contains("property")) factors.add("Property exposure");
        if (defaultString(policy.getType(), "").toLowerCase(Locale.ROOT).contains("auto")) factors.add("Auto claim volatility");
        if (claims.stream().anyMatch(claim -> parseNumeric(claim.getAiConfidence()) < 75)) factors.add("Low-confidence claims present");
        if (documents.stream().anyMatch(doc -> "failed".equalsIgnoreCase(defaultString(doc.getStatus(), "")))) factors.add("Document quality issues in pipeline");
        if (factors.isEmpty()) factors.add("Routine monitoring");
        return factors.stream().limit(3).collect(Collectors.toList());
    }

    private Map<String, Object> factor(String label, double value) {
        return Map.of("label", label, "value", round(value));
    }

    private double avgTypeRisk(List<Policy> policies, String token, double fallback) {
        return policies.stream()
                .filter(policy -> defaultString(policy.getType(), "").toLowerCase(Locale.ROOT).contains(token))
                .map(Policy::getRiskScore)
                .mapToDouble(this::parseNumeric)
                .filter(score -> score > 0)
                .average()
                .orElse(fallback);
    }

    private double avgPremiumRisk(List<Policy> policies) {
        return policies.stream()
                .mapToDouble(policy -> {
                    double premium = parseNumeric(policy.getPremium());
                    double coverage = parseNumeric(policy.getCoverage());
                    if (premium <= 0 || coverage <= 0) return 5.0;
                    return clamp(coverage / premium, 1, 10);
                })
                .average()
                .orElse(5.0);
    }

    private double avgCoverageRisk(List<Policy> policies) {
        return policies.stream()
                .mapToDouble(policy -> {
                    double coverage = parseNumeric(policy.getCoverage());
                    if (coverage <= 0) return 5.0;
                    return clamp(coverage / 10000.0, 1, 10);
                })
                .average()
                .orElse(5.0);
    }

    private double parseNumeric(String value) {
        if (value == null || value.isBlank()) return 0;
        String cleaned = value.replaceAll("[^0-9.]", "");
        if (cleaned.isBlank()) return 0;
        try {
            return Double.parseDouble(cleaned);
        } catch (NumberFormatException ex) {
            return 0;
        }
    }

    private String defaultString(String value, String fallback) {
        return value == null || value.isBlank() ? fallback : value;
    }

    private double round(double value) {
        return Math.round(value * 10.0) / 10.0;
    }

    private double clamp(double value, double min, double max) {
        return Math.max(min, Math.min(max, value));
    }
}
