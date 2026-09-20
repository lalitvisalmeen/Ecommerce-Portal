package com.project.ecommerce.rest;

import com.project.ecommerce.entity.Product;
import com.project.ecommerce.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.query.Param;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:4200")
public class ProductRestController {

    private ProductService productService;

    @Autowired
    public ProductRestController(ProductService productService){
        this.productService = productService;
    }

    @GetMapping("/products")
    public Page<Product> getProducts(Pageable pageable){

        return productService.findAllProducts(pageable);
    }

    @GetMapping("/products/{productId}")
    public Product getProductById(@PathVariable int productId){
        return productService.findProductById(productId);
    }

    @GetMapping("/products/category/{categoryId}")
    public Page<Product> findByCategoryId(@PathVariable int categoryId, Pageable pageable){
        return productService.findByCategoryId(categoryId, pageable);
    }

    @GetMapping("/products/search")
    public Page<Product> searchByName(@RequestParam String name, Pageable pageable){
        return productService.searchByProductName(name, pageable);
    }
}
