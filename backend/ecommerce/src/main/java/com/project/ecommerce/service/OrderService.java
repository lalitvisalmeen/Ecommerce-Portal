package com.project.ecommerce.service;

import com.project.ecommerce.dto.OrderResponseDto;
import com.project.ecommerce.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface OrderService {

    Page<Order> findOrderByCustomerEmail(String email, Pageable pageable);

    Order findOrderById(Long id);

    Optional<OrderResponseDto> findByTrackingNumberAndAuth0UserId(String orderTrackingNumber, String auth0UserId);

    List<OrderResponseDto> findOrdersByAuth0UserId(String auth0UserId);
}
