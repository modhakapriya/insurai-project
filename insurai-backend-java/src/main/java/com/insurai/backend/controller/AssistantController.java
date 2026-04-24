package com.insurai.backend.controller;

import com.insurai.backend.dto.AssistantRequest;
import com.insurai.backend.dto.AssistantResponse;
import com.insurai.backend.service.AssistantService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/assistant")
public class AssistantController {
    private final AssistantService assistantService;

    public AssistantController(AssistantService assistantService) {
        this.assistantService = assistantService;
    }

    @PostMapping("/chat")
    public AssistantResponse chat(@RequestBody AssistantRequest request) {
        return assistantService.chat(request.message());
    }
}
