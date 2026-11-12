package com.project.ecommerce.rest;

import com.project.ecommerce.dto.Chat;
import com.project.ecommerce.service.ChatService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService){
        this.chatService = chatService;
    }

    @PostMapping("/chat")
    public String chatWithModel(@RequestBody Chat chat){
        return this.chatService.invokeAIModel(chat.getMessage(), chat.getConversationId());
    }

    @GetMapping("/test-auth")
    public String testAuthentication(
            @AuthenticationPrincipal Jwt jwt) {

        return jwt.getClaims().toString();
    }


}
