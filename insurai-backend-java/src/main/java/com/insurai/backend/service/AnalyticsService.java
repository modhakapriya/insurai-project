package com.insurai.backend.service;

import com.insurai.backend.model.Claim;
import com.insurai.backend.model.DocumentRecord;
import com.insurai.backend.model.Policy;
import com.insurai.backend.repository.ClaimRepository;
import com.insurai.backend.repository.DocumentRepository;
import com.insurai.backend.repository.PolicyRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.YearMonth;
import java.time.ZoneId;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.TreeMap;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
public class AnalyticsService {
    private final PolicyRepository policyRepository;
    private final ClaimRepository claimRepository;
    private final DocumentRepository documentRepository;

    public AnalyticsService(
            PolicyRepository policyRepository,
            ClaimRepository claimRepository,
            DocumentRepository documentRepository
    ) {
        this.policyRepository = policyRepository;
        this.claimRepository = claimRepository;
        this.documentRepository = documentRepository;
    }

    public Map<String, Object> buildAnalytics() {
        List<Policy> policies = policyRepository.findAll();
        List<Claim> claims = claimRepository.findAll();
        List<DocumentRecord> documents = documentRepository.findAll();

        double totalRevenue = policies.stream().mapToDouble(policy -> parseMoney(policy.getPremium())).sum();
        long activePolicies = policies.stream()
                .filter(policy -> "active".equalsIgnoreCase(String.valueOf(policy.getStatus())))
                .count();
        long pendingClaims = claims.stream()
                .filter(claim -> "pending".equalsIgnoreCase(String.valueOf(claim.getStatus())))
                .count();
        long newCustomers = policies.stream()
                .filter(policy -> isRecent(policy.getCreatedAt(), 30))
                .map(Policy::getHolder)
                .filter(holder -> holder != null && !holder.isBlank())
                .map(String::toLowerCase)
                .distinct()
                .count();

        if (newCustomers == 0) {
            newCustomers = policies.stream()
                    .map(Policy::getHolder)
                    .filter(holder -> holder != null && !holder.isBlank())
                    .map(String::toLowerCase)
                    .distinct()
                    .count();
        }

        List<YearMonth> months = IntStream.rangeClosed(0, 5)
                .mapToObj(offset -> YearMonth.now().minusMonths(5L - offset))
                .toList();

        Map<YearMonth, Double> revenueByMonth = groupPolicyRevenueByMonth(policies);
        Map<YearMonth, Double> claimsByMonth = groupClaimAmountByMonth(claims);

        List<String> monthLabels = months.stream()
                .map(month -> month.getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH))
                .toList();
        List<Double> revenueSeries = months.stream().map(month -> revenueByMonth.getOrDefault(month, 0.0)).toList();
        List<Double> claimSeries = months.stream().map(month -> claimsByMonth.getOrDefault(month, 0.0)).toList();

        Map<String, Long> claimsByType = claims.stream()
                .collect(Collectors.groupingBy(
                        claim -> defaultString(claim.getType(), "Other"),
                        LinkedHashMap::new,
                        Collectors.counting()
                ));
        List<Map<String, Object>> claimsDistribution = claimsByType.entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .map(entry -> Map.<String, Object>of(
                        "label", entry.getKey(),
                        "value", entry.getValue()
                ))
                .toList();

        Map<YearMonth, Long> newCustomersByMonth = policies.stream()
                .filter(policy -> policy.getCreatedAt() != null)
                .collect(Collectors.groupingBy(
                        policy -> YearMonth.from(policy.getCreatedAt().atZone(ZoneId.systemDefault())),
                        TreeMap::new,
                        Collectors.mapping(policy -> defaultString(policy.getHolder(), "Unknown").toLowerCase(), Collectors.toSet())
                ))
                .entrySet()
                .stream()
                .collect(Collectors.toMap(Map.Entry::getKey, entry -> (long) entry.getValue().size()));

        Map<YearMonth, Long> churnedByMonth = policies.stream()
                .filter(policy -> policy.getCreatedAt() != null)
                .filter(policy -> {
                    String status = defaultString(policy.getStatus(), "").toLowerCase(Locale.ROOT);
                    return status.contains("inactive") || status.contains("cancelled") || status.contains("expired");
                })
                .collect(Collectors.groupingBy(
                        policy -> YearMonth.from(policy.getCreatedAt().atZone(ZoneId.systemDefault())),
                        TreeMap::new,
                        Collectors.counting()
                ));

        List<Map<String, Object>> customerGrowth = new ArrayList<>();
        for (YearMonth month : months) {
            long fresh = newCustomersByMonth.getOrDefault(month, 0L);
            long churned = churnedByMonth.getOrDefault(month, 0L);
            customerGrowth.add(Map.of(
                    "month", month.getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH),
                    "newCustomers", fresh,
                    "churned", churned,
                    "net", Math.max(0, fresh - churned)
            ));
        }

        double avgClaimConfidence = claims.stream()
                .map(Claim::getAiConfidence)
                .mapToDouble(this::parsePercent)
                .filter(value -> value > 0)
                .average()
                .orElse(0.0);
        double processedDocsRate = documents.isEmpty()
                ? 0.0
                : documents.stream().filter(doc -> "processed".equalsIgnoreCase(defaultString(doc.getStatus(), ""))).count() * 100.0 / documents.size();
        double approvalRate = claims.isEmpty()
                ? 0.0
                : claims.stream().filter(claim -> "approved".equalsIgnoreCase(defaultString(claim.getStatus(), ""))).count() * 100.0 / claims.size();
        double avgRisk = policies.stream()
                .map(Policy::getRiskScore)
                .mapToDouble(this::parseRisk)
                .filter(value -> value > 0)
                .average()
                .orElse(0.0);

        List<Map<String, Object>> performance = List.of(
                Map.of("label", "Processing Speed", "value", scaleToHundred(10 - avgRisk)),
                Map.of("label", "Customer Satisfaction", "value", scaleToHundred(approvalRate)),
                Map.of("label", "Accuracy", "value", scaleToHundred(avgClaimConfidence)),
                Map.of("label", "Compliance", "value", scaleToHundred(processedDocsRate)),
                Map.of("label", "Cost Efficiency", "value", scaleToHundred(totalRevenue / Math.max(1, claims.size()) / 1000.0)),
                Map.of("label", "Automation Rate", "value", scaleToHundred((approvalRate + processedDocsRate) / 2))
        );

        Map<String, List<Policy>> policiesByType = policies.stream()
                .collect(Collectors.groupingBy(policy -> defaultString(policy.getType(), "Other")));
        List<Map<String, Object>> topPolicies = policiesByType.entrySet().stream()
                .map(entry -> {
                    long count = entry.getValue().size();
                    double revenue = entry.getValue().stream().mapToDouble(policy -> parseMoney(policy.getPremium())).sum();
                    double avgRiskScore = entry.getValue().stream().map(Policy::getRiskScore).mapToDouble(this::parseRisk).average().orElse(5.0);
                    double delta = Math.max(1.0, 18 - avgRiskScore);
                    return Map.<String, Object>of(
                            "name", entry.getKey(),
                            "policies", count,
                            "revenue", revenue,
                            "delta", delta
                    );
                })
                .sorted(Comparator.comparingDouble(entry -> -((Number) entry.get("revenue")).doubleValue()))
                .limit(4)
                .toList();

        return Map.of(
                "summary", Map.of(
                        "revenue", totalRevenue,
                        "activePolicies", activePolicies,
                        "pendingClaims", pendingClaims,
                        "newCustomers", newCustomers
                ),
                "revenueVsClaims", Map.of(
                        "months", monthLabels,
                        "revenue", revenueSeries,
                        "claims", claimSeries
                ),
                "claimsDistribution", claimsDistribution,
                "customerGrowth", customerGrowth,
                "performance", performance,
                "topPolicies", topPolicies
        );
    }

    private Map<YearMonth, Double> groupPolicyRevenueByMonth(List<Policy> policies) {
        return policies.stream()
                .filter(policy -> policy.getCreatedAt() != null)
                .collect(Collectors.groupingBy(
                        policy -> YearMonth.from(policy.getCreatedAt().atZone(ZoneId.systemDefault())),
                        TreeMap::new,
                        Collectors.summingDouble(policy -> parseMoney(policy.getPremium()))
                ));
    }

    private Map<YearMonth, Double> groupClaimAmountByMonth(List<Claim> claims) {
        return claims.stream()
                .filter(claim -> claim.getCreatedAt() != null)
                .collect(Collectors.groupingBy(
                        claim -> YearMonth.from(claim.getCreatedAt().atZone(ZoneId.systemDefault())),
                        TreeMap::new,
                        Collectors.summingDouble(claim -> parseMoney(claim.getAmount()))
                ));
    }

    private boolean isRecent(Instant createdAt, int days) {
        return createdAt != null && createdAt.isAfter(Instant.now().minusSeconds(days * 86400L));
    }

    private String defaultString(String value, String fallback) {
        return value == null || value.isBlank() ? fallback : value;
    }

    private double parseMoney(String value) {
        if (value == null) return 0.0;
        String digits = value.replaceAll("[^0-9.]", "");
        if (digits.isBlank()) return 0.0;
        try {
            return Double.parseDouble(digits);
        } catch (NumberFormatException ex) {
            return 0.0;
        }
    }

    private double parsePercent(String value) {
        return parseMoney(value);
    }

    private double parseRisk(String value) {
        return parseMoney(value);
    }

    private double scaleToHundred(double rawValue) {
        return Math.max(1, Math.min(100, rawValue));
    }
}
