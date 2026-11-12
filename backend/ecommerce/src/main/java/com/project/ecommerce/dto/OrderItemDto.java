package com.project.ecommerce.dto;

import lombok.Data;

@Data
public class OrderItemDto {

    private final String productName;
    private final float unitPrice;
    private final int quantity;
}
