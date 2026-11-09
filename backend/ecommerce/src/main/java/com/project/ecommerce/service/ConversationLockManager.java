package com.project.ecommerce.service;

import org.springframework.stereotype.Component;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

@Component
public class ConversationLockManager {

    private final ConcurrentHashMap<String, Lock> locks = new ConcurrentHashMap<>();

    public Lock getLock(String conversationId){
        // if the key is present, it will return that lock, otherwise, create a lock and store it in locks.
        // using reentrant lock, same thread that owns a lock can acquire the same lock more than once.
        return locks.computeIfAbsent(conversationId, key -> new ReentrantLock());
    }
}
