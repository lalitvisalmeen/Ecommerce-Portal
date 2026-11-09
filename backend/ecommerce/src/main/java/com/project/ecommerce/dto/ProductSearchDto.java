package com.project.ecommerce.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProductSearchDto {

    private final String name;
    private final String description;
    private final BigDecimal unitPrice;
    private final String imageUrl;
    private final int unitsInStock;

}
