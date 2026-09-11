package com.project.ecommerce.service;

import com.project.ecommerce.entity.Product;
import org.springframework.stereotype.Service;

import java.util.List;

public interface ProductService {

    List<Product> findAllProducts();

    Product findProductById(int id);

}
