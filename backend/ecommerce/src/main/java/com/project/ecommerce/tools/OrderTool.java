package com.project.ecommerce.tools;

import com.project.ecommerce.dto.OrderLookUpResult;
import com.project.ecommerce.dto.OrderResponseDto;
import com.project.ecommerce.service.OrderService;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class OrderTool {

    private OrderService orderService;

    public OrderTool(OrderService orderService){
        this.orderService = orderService;
    }

    private String getAuthUser(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if(!(authentication instanceof JwtAuthenticationToken jwtAuthenticationToken)
                || !jwtAuthenticationToken.isAuthenticated()){
            throw new AccessDeniedException("Authenticated user required");
        }

        String auth0UserId = jwtAuthenticationToken.getToken().getSubject();
        if(auth0UserId == null || auth0UserId.isBlank()){
            throw new AccessDeniedException("Authenticated user ID is missing");
        }

        return auth0UserId;
    }

    @Tool(description = """
            Retrieves an authenticated customer's order details
            using an order tracking number.
    
            Parameter:
            - orderTrackingNumber: The tracking number identifying the order.
    
            Returns:
            - OrderLookupResult containing whether the order was found,
              a result message, and the order details when available.
            """)
    public OrderLookUpResult findOrderByTrackingNumber(String orderTrackingNumber){

        System.out.println("findOrderByTrackingNumber tool is called");
        // get the authenticated user
        String auth0UserId = getAuthUser();
        // check whether the orderTracking number is null or blank
        if(orderTrackingNumber == null || orderTrackingNumber.isBlank()){
            return new OrderLookUpResult(false, "Please provide an order tracking number", null);
        }

        return this.orderService.findByTrackingNumberAndAuth0UserId(orderTrackingNumber.trim(), auth0UserId)
                .map(order -> new OrderLookUpResult(true,
                                                "Order retrieved successfully",
                                                        order))
                .orElseGet(() -> new OrderLookUpResult(false,
                                "Order not found for the given tracking number",
                            null));
    }

    @Tool(description = """
            This tool provides the list of recent orders made by the authenticated user.
            This tool is used when user asks for their recent orders
            
            Parameters:
            - None.

            Returns:
            - A list containing up to 5 orders, sorted by creation date
              in descending order (newest first).
            - An empty list if the customer has no orders.
            """)
    public List<OrderResponseDto> getCustomerRecentOrders(){

        System.out.println("getCustomerRecentOrders tool is called");
        // get the authenticated user's auth0 id
        String auth0UserId = getAuthUser();
        return this.orderService.findOrdersByAuth0UserId(auth0UserId);
    }
}
