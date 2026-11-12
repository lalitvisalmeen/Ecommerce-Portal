package com.project.ecommerce.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@Data
public class OrderResponseDto {

    private final String orderTrackingNumber;
    private final BigDecimal totalPrice;
    private final int totalQuantity;
    private final String status;
    private final Date createdDate;
    private final List<OrderItemDto> orderItems;
}
