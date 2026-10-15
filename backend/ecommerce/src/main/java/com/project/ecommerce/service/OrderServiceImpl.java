package com.project.ecommerce.service;

import com.project.ecommerce.dao.OrderRepository;
import com.project.ecommerce.entity.Order;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class OrderServiceImpl implements OrderService{

    private OrderRepository orderRepository;

    @Autowired
    public OrderServiceImpl(OrderRepository orderRepository){
        this.orderRepository = orderRepository;
    }
    @Override
    public Page<Order> findOrderByCustomerEmail(String email, Pageable pageable) {
        return this.orderRepository.findByCustomerEmailOrderByCreatedDateDesc(email, pageable);
    }
}
