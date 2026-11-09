package com.project.ecommerce.service;

import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.stereotype.Service;

@Service
public class ConversationLifeCycleService {

    private final ChatMemory chatMemory;

    private final ConversationActivityTracker activityTracker;

    public ConversationLifeCycleService(ChatMemory chatMemory, ConversationActivityTracker activityTracker){
        this.chatMemory = chatMemory;
        this.activityTracker = activityTracker;
    }

    public void clearConversationMemory(String conversationId){
        this.chatMemory.clear(conversationId);
        this.activityTracker.removeConversation(conversationId);
    }
}
