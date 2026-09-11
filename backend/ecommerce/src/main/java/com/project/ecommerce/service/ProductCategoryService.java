package com.project.ecommerce.service;

import com.project.ecommerce.entity.ProductCategory;

import java.util.List;

public interface ProductCategoryService {

    List<ProductCategory> findAllCategories();

    ProductCategory findCategoryById(int id);
}
