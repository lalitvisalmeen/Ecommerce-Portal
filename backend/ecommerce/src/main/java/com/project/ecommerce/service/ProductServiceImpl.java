package com.project.ecommerce.service;

import com.project.ecommerce.dao.ProductRepository;
import com.project.ecommerce.entity.Product;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductServiceImpl implements ProductService{

    private ProductRepository productRepository;

    @Autowired
    public ProductServiceImpl(ProductRepository productRepository){
        this.productRepository = productRepository;
    }

    @Override
    public List<Product> findAllProducts() {
        return productRepository.findAll();
    }

    @Override
    public Product findProductById(int id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product is not found"));
    }

    @Override
    public Page<Product> findByCategoryId(int id, Pageable pageable) {
        return productRepository.findByCategoryId(id, pageable);
    }

    @Override
    public Page<Product> searchByProductName(String name, Pageable pageable) {
        return productRepository.findByNameContaining(name, pageable);
    }


}
