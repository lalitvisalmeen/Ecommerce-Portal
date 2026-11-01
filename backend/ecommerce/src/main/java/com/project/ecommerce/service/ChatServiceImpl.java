package com.project.ecommerce.service;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.MessageChatMemoryAdvisor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.ai.chat.memory.ChatMemory;

import java.util.List;
import java.util.Map;

@Service
public class ChatServiceImpl implements ChatService {

    private final ChatClient chatClient;

    private final String systemPrompt;

    private final MessageChatMemoryAdvisor messageChatMemoryAdvisor;

    public ChatServiceImpl(ChatClient.Builder chatBuilder, @Value("${ecommerce.ai.chat.system-prompt}") String systemPrompt, ChatMemory chatMemory){
        this.chatClient = chatBuilder.build();
        this.systemPrompt = systemPrompt;
        // this is to integrate memory with chatclient.
        this.messageChatMemoryAdvisor = MessageChatMemoryAdvisor.builder(chatMemory).build();

    }


    @Override
    public String invokeAIModel(String prompt, String conversationId) {
        return this.chatClient.prompt()
                .system(this.systemPrompt)
                .user(prompt)
                .advisors(spec ->
                    spec.advisors(List.of(this.messageChatMemoryAdvisor))
                            .params(Map.of(ChatMemory.CONVERSATION_ID, conversationId)))
                .call()
                .content();
    }
}
