package com.project.ecommerce.service;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.Set;
import java.util.concurrent.locks.Lock;

@Component
public class ConversationCleanupScheduler {

    private final ConversationActivityTracker activityTracker;

    private final ConversationLifeCycleService conversationLifeCycleService;

    private final ConversationLockManager conversationLockManager;

    public ConversationCleanupScheduler(ConversationActivityTracker conversationActivityTracker, ConversationLifeCycleService conversationLifeCycleService, ConversationLockManager conversationLockManager){
        this.activityTracker = conversationActivityTracker;
        this.conversationLifeCycleService = conversationLifeCycleService;
        this.conversationLockManager = conversationLockManager;
    }

    @Scheduled(cron = "0 * * * * *", zone = "America/Toronto")
    public void cleanupExpiredConversations(){
        System.out.println("CleanupExpiredConversations schedule started : "+ Instant.now());
        // get the conversations that are inactive for 15 mins from activity tracker to remove
        Set<String> conversationIdsToRemove =  this.activityTracker.getExpiredConversationIds();
        // iterate through the conversation
        for(String conversationId : conversationIdsToRemove ){
            // acquire the lock for the current conversation id
            Lock lock = this.conversationLockManager.getLock(conversationId);
            lock.lock();
            try {
                // if the conversation id is really expired, then clear the chat memory.
                // if it is not expired, do nothing
                if (this.activityTracker.isExpired(conversationId)) {
                    // remove the conversation from chat memory and also from conversation activity tracker
                    this.conversationLifeCycleService.clearConversationMemory(conversationId);
                }
            }
            finally {
                lock.unlock();
            }
        }

    }
}
