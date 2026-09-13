package com.project.ecommerce.service;

import com.project.ecommerce.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

public interface ProductService {

    List<Product> findAllProducts();

    Product findProductById(int id);

    Page<Product> findByCategoryId(int id, Pageable pageable);

}
