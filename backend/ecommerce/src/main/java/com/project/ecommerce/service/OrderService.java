package com.project.ecommerce.service;

import com.project.ecommerce.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface OrderService {

    Page<Order> findOrderByCustomerEmail(String email, Pageable pageable);
}
