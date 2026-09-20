package com.project.ecommerce.rest;

import com.project.ecommerce.entity.ProductCategory;
import com.project.ecommerce.service.ProductCategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/product-category")
@CrossOrigin(origins = "http://localhost:4200")
public class ProductCategoryRestController {

    private ProductCategoryService categoryService;

    @Autowired
    public ProductCategoryRestController(ProductCategoryService categoryService){
        this.categoryService = categoryService;
    }

    @GetMapping("/categories")
    public List<ProductCategory> findAllCategories(){
        return categoryService.findAllCategories();
    }

    @GetMapping("/categories/{categoryId}")
    public ProductCategory findCategoryById(@PathVariable int categoryId){
        return categoryService.findCategoryById(categoryId);
    }
}
