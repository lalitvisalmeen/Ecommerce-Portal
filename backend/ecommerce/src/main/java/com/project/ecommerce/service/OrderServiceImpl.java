package com.project.ecommerce.service;

import com.project.ecommerce.dao.OrderRepository;
import com.project.ecommerce.dto.OrderItemDto;
import com.project.ecommerce.dto.OrderResponseDto;
import com.project.ecommerce.entity.Order;
import com.project.ecommerce.entity.OrderItem;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.swing.text.html.Option;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;

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

    public Order findOrderById(Long id){
        return this.orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<OrderResponseDto> findByTrackingNumberAndAuth0UserId(String orderTrackingNumber, String auth0UserId) {
        return orderRepository
                .findByOrderTrackingNumberAndCustomer_Auth0UserId(
                        orderTrackingNumber,
                        auth0UserId
                )
                .map(this::mapOrderToDto);
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderResponseDto> findOrdersByAuth0UserId(String auth0UserId) {
        List<Order> orders =  this.orderRepository.findTop5ByCustomer_Auth0UserIdOrderByCreatedDateDesc(auth0UserId);
        return orders.stream().map(this::mapOrderToDto).toList();
    }

    private OrderResponseDto mapOrderToDto(Order order){

        List<OrderItemDto> orderItemsDto = new ArrayList<>();
        // get the order items from the order response

        Set<OrderItem> orderItems = order.getOrderItems();
        for(OrderItem orderItem : orderItems){
            OrderItemDto orderItemDto = new OrderItemDto(orderItem.getProductName(), orderItem.getUnitPrice(), orderItem.getQuantity());
            orderItemsDto.add(orderItemDto);
        }

        return new OrderResponseDto(order.getOrderTrackingNumber(),
                order.getTotalPrice(),
                order.getTotalQuantity(),
                order.getStatus(),
                order.getCreatedDate(),
                orderItemsDto);

    }
}
