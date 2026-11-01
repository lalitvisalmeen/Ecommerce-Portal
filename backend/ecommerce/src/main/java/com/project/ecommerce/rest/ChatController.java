package com.project.ecommerce.rest;

import com.project.ecommerce.dto.Chat;
import com.project.ecommerce.service.ChatService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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


}
