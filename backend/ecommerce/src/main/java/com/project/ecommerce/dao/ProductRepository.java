package com.project.ecommerce.dao;

import com.project.ecommerce.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Integer> {

    Page<Product> findByCategoryId(int id, Pageable pageable);

    Page<Product> findByNameContaining(String name, Pageable pageable);
}
