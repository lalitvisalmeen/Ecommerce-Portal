package com.project.ecommerce.dao;

import com.project.ecommerce.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {

    Page<Order> findByCustomerEmailOrderByCreatedDateDesc(String email, Pageable pageable);

    List<Order> findTop5ByCustomer_Auth0UserIdOrderByCreatedDateDesc(String auth0UserId);

    @Query("""
    Select distinct o
    from Order o
    left join fetch o.orderItems
    where o.orderTrackingNumber = :trackingNumber
    and o.customer.auth0UserId = :auth0UserId
    """)
    Optional<Order> findByOrderTrackingNumberAndCustomer_Auth0UserId(String trackingNumber, String auth0UserId);
}
