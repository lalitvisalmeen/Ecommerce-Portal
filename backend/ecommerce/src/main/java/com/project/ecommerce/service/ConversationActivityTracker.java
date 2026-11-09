package com.project.ecommerce.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.Instant;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class ConversationActivityTracker {

    private final Map<String, Instant> activityMap = new ConcurrentHashMap<>();

    @Value("${chat,nenory.idle-minutes}")
    private int conversationIdleMinutes;

    public void recordActivity(String conversationId){

        activityMap.put(conversationId, Instant.now());
    }

    public Set<String> getExpiredConversationIds(){
        Set<String> conversationIds = new HashSet<>();
        Instant timeNow = Instant.now();

        for(Map.Entry<String, Instant> entry : activityMap.entrySet()){
            if(Duration.between(entry.getValue(), timeNow).compareTo(Duration.ofMinutes(conversationIdleMinutes)) >= 0){
                    conversationIds.add(entry.getKey());
            }
        }

        return conversationIds;
    }

    public boolean isExpired(String conversationId){
        Instant lastActivity = activityMap.get(conversationId);

        if(lastActivity == null){
            return false;
        }
        // check whether the conversation is idle within the 15 minutes period.
        return Duration.between(lastActivity, Instant.now()).compareTo(Duration.ofMinutes(conversationIdleMinutes)) >= 0;
    }

    public void removeConversation(String conversationId){
        this.activityMap.remove(conversationId);
    }

}
