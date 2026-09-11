package com.project.ecommerce.service;

import com.project.ecommerce.dao.ProductCategoryRepository;
import com.project.ecommerce.entity.ProductCategory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductCategoryServiceImpl implements ProductCategoryService {
    private ProductCategoryRepository categoryRepository;

    @Autowired
    public ProductCategoryServiceImpl(ProductCategoryRepository categoryRepository){
        this.categoryRepository = categoryRepository;
    }

    @Override
    public List<ProductCategory> findAllCategories() {
        return categoryRepository.findAll();
    }

    @Override
    public ProductCategory findCategoryById(int id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
    }
}
