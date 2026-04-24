package com.insurai.backend.controller;

import com.insurai.backend.dto.ClaimAiRequest;
import com.insurai.backend.dto.PolicyAiRequest;
import com.insurai.backend.service.ClaimAiService;
import com.insurai.backend.service.PolicyAiService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ai")
public class AiController {
    private final PolicyAiService policyAiService;
    private final ClaimAiService claimAiService;

    public AiController(PolicyAiService policyAiService, ClaimAiService claimAiService) {
        this.policyAiService = policyAiService;
        this.claimAiService = claimAiService;
    }

    @PostMapping("/policy-recommendation")
    public Object policyRecommendation(@RequestBody PolicyAiRequest request) {
        return policyAiService.generate(request);
    }

    @PostMapping("/claim-analysis")
    public Object claimAnalysis(@RequestBody ClaimAiRequest request) {
        return claimAiService.analyze(request);
    }
}
