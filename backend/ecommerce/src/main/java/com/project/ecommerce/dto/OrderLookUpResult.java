package com.project.ecommerce.dto;

public record OrderLookUpResult(boolean found, String message, OrderResponseDto order) {
}
