package com.insurai.backend.service;

import com.insurai.backend.dto.ClaimAiRequest;
import com.insurai.backend.dto.ClaimAiResponse;
import org.springframework.stereotype.Service;

@Service
public class ClaimAiService {
    public ClaimAiResponse analyze(ClaimAiRequest request) {
        String type = request.type() == null ? "" : request.type().toLowerCase();
        double amount = parseAmount(request.amount());

        int confidence = 82;
        String recommendedStatus = "Pending";
        String processingNote = "Under AI review";

        if (type.contains("health")) {
            confidence = amount > 10000 ? 86 : 93;
            recommendedStatus = amount > 10000 ? "Reviewing" : "Approved";
            processingNote = amount > 10000 ? "Medical review recommended" : "Fast-track approval candidate";
        } else if (type.contains("auto")) {
            confidence = amount > 7000 ? 74 : 88;
            recommendedStatus = amount > 7000 ? "Reviewing" : "Pending";
            processingNote = amount > 7000 ? "Damage consistency review needed" : "Ready for standard assessment";
        } else if (type.contains("property")) {
            confidence = amount > 12000 ? 68 : 84;
            recommendedStatus = amount > 12000 ? "Flagged" : "Reviewing";
            processingNote = amount > 12000 ? "High-value property claim flagged for manual review" : "Property evidence review required";
        }

        String rationale = "AI confidence was estimated from claim type, amount, and review complexity for a consistent demo workflow.";
        return new ClaimAiResponse(confidence + "%", recommendedStatus, processingNote, rationale);
    }

    private double parseAmount(String amount) {
        if (amount == null || amount.isBlank()) return 0;
        String cleaned = amount.replaceAll("[^0-9.]", "");
        if (cleaned.isBlank()) return 0;
        try {
            return Double.parseDouble(cleaned);
        } catch (NumberFormatException ex) {
            return 0;
        }
    }
}
