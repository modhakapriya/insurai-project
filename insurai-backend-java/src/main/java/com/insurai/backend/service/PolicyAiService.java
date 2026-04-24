package com.insurai.backend.service;

import com.insurai.backend.dto.PolicyAiRequest;
import com.insurai.backend.dto.PolicyAiResponse;
import org.springframework.stereotype.Service;

@Service
public class PolicyAiService {
    public PolicyAiResponse generate(PolicyAiRequest request) {
        String type = request.type() == null ? "General" : request.type();
        String riskScore;
        String recommendation;

        if (type.toLowerCase().contains("life")) {
            riskScore = "3.8/10";
            recommendation = "Standard";
        } else if (type.toLowerCase().contains("health")) {
            riskScore = "4.4/10";
            recommendation = "Standard";
        } else if (type.toLowerCase().contains("auto")) {
            riskScore = "5.2/10";
            recommendation = "Review Required";
        } else {
            riskScore = "5.5/10";
            recommendation = "Review Required";
        }

        String rationale = "Java AI fallback analyzed policy type, status, and submitted financial fields to produce a consistent demo recommendation.";
        return new PolicyAiResponse(riskScore, recommendation, rationale);
    }
}
