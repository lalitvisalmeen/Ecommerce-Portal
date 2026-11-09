package com.project.ecommerce.dao;

import com.project.ecommerce.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Integer> {

    Page<Product> findByCategoryId(int id, Pageable pageable);

    Page<Product> findByNameContaining(String name, Pageable pageable);

    @Query(""" 
           SELECT p
           FROM Product p
           JOIN p.category c
           WHERE p.isActive = true
           AND (:productName IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :productName, '%')))
           AND (:categoryName IS NULL OR LOWER(c.categoryName) LIKE LOWER(CONCAT('%', :categoryName, '%')))
           AND (:maxPrice IS NULL OR p.unitPrice <= :maxPrice)
           AND (:inStock IS NULL OR (:inStock = true AND p.unitsInStock > 0)
                                     OR (:inStock = false))
        """
    )
    List<Product> searchProduct(@Param("productName") String productName,@Param("categoryName") String categoryName,  @Param("maxPrice") BigDecimal maxPrice,
                                @Param("inStock") Boolean inStock );
}
