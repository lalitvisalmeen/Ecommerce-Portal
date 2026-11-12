package com.project.ecommerce.service;

import com.project.ecommerce.tools.OrderTool;
import com.project.ecommerce.tools.ProductTool;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.MessageChatMemoryAdvisor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.ai.chat.memory.ChatMemory;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.locks.Lock;

@Service
public class ChatServiceImpl implements ChatService {

    private final ChatClient chatClient;

    private final String systemPrompt;

    private final MessageChatMemoryAdvisor messageChatMemoryAdvisor;

    private final ConversationActivityTracker activityTracker;

    private final ConversationLifeCycleService conversationLifeCycleService;

    private final ConversationLockManager conversationLockManager;

    private final ProductTool productTool;

    private final OrderTool orderTool;

    public ChatServiceImpl(ChatClient.Builder chatBuilder,
                           @Value("${ecommerce.ai.chat.system-prompt}") String systemPrompt,
                           ChatMemory chatMemory,
                           ConversationActivityTracker activityTracker,
                           ConversationLifeCycleService conversationLifeCycleService,
                           ConversationLockManager conversationLockManager,
                           ProductTool productTool,
                           OrderTool orderTool){
        this.chatClient = chatBuilder.build();
        this.systemPrompt = systemPrompt;
        // this is to integrate memory with chatclient.
        this.messageChatMemoryAdvisor = MessageChatMemoryAdvisor.builder(chatMemory).build();
        this.activityTracker = activityTracker;
        this.conversationLifeCycleService = conversationLifeCycleService;
        this.conversationLockManager = conversationLockManager;
        this.productTool = productTool;
        this.orderTool = orderTool;

    }


    @Override
    public String invokeAIModel(String prompt, String conversationId) {

        // acquire the lock for the current conversation id
        Lock lock = this.conversationLockManager.getLock(conversationId);
        lock.lock();
        try {

            // check whether the conversation has expired
            boolean expiredConversation = this.activityTracker.isExpired(conversationId);
            if (expiredConversation) {
                System.out.println("Doing lazy expiration");
                this.conversationLifeCycleService.clearConversationMemory(conversationId);
            }
            // record the activity once user has sent the prompt before model invocation
            this.activityTracker.recordActivity(conversationId);
            // create the tool list
            List<Object> toolList = new ArrayList<>();
            toolList.add(productTool);
            // certain tools are bound to authentication. so use them only when the user is authenticated
            if(isAuthenticatedUser()){
                toolList.add(orderTool);
            }
            String response = this.chatClient.prompt()
                    .system(this.systemPrompt)
                    .user(prompt)
                    .advisors(spec ->
                            spec.advisors(List.of(this.messageChatMemoryAdvisor))
                                    .params(Map.of(ChatMemory.CONVERSATION_ID, conversationId)))
                    .tools(toolList.toArray())
                    .call()
                    .content();

            // Record the activity once model has responded
            this.activityTracker.recordActivity(conversationId);
            return response;
        }
        catch(Exception e){
            System.out.println(e.getStackTrace());
            throw e;
        }
        finally {
            // release the lock against the conversation id
            lock.unlock();
        }
    }

    private boolean isAuthenticatedUser(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        // check whether the authentication is based on jwt
        if(authentication instanceof JwtAuthenticationToken
                && authentication.isAuthenticated()){
            return true;
        }
        return false;
    }
}
