package com.project.ecommerce.rest;

import com.project.ecommerce.entity.Order;
import com.project.ecommerce.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.query.Param;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private OrderService orderService;

    @Autowired
    public OrderController(OrderService orderService){
        this.orderService = orderService;
    }

    @GetMapping("/search")
    public Page<Order> getCustomerOrders(@RequestParam("email") String email, Pageable pageable){
        return this.orderService.findOrderByCustomerEmail(email, pageable);
    }


}
