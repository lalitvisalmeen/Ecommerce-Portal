package com.project.ecommerce.tools;

import com.project.ecommerce.dto.ProductSearchDto;
import com.project.ecommerce.entity.Product;
import com.project.ecommerce.service.ProductService;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Component
public class ProductTool {

    private final ProductService productService;

    public ProductTool(ProductService productService){
        this.productService = productService;
    }

    @Tool(description = """
            Search the active product catalogue using optional product name, category name, maximum price, and stock availability preference.
            
            Use categoryName when customers want to browse or discover products by category (e.g., "Show me books" or "Find coffee mugs").

            Use productName when customers search for a specific product (e.g., "Find Clean Code").

            Both parameters can be provided when the customer specifies a product within a category.

            Use this tool for customer-facing product discovery, filtering, and comparison, not internal inventory analysis.
            """)
    public List<ProductSearchDto> searchProducts(String productName, String categoryName, BigDecimal maxPrice, Boolean inStock){

        //TODO use streams
//        return productResults.stream()
//                .map(product -> new ProductSearchDto(
//                        product.getName(),
//                        product.getDescription(),
//                        product.getUnitPrice(),
//                        product.getImageUrl(),
//                        product.getUnitsInStock()))
//                .toList();
        System.out.println("===== Product Search Tool Invoked =====");
        System.out.println("Name: " + productName);
        System.out.println("Category Name: " + categoryName);
        System.out.println("Max Price: " + maxPrice);
        System.out.println("In Stock: " + inStock);
        System.out.println("Tool call has been initiated");
        List<Product> productResults =  this.productService.searchProducts(productName, categoryName, maxPrice, inStock);
        // now we need to send the response back to model with the desired data not all data of a product
        List<ProductSearchDto> finalProductResults = new ArrayList<>();
        for(Product product : productResults){
            finalProductResults.add(new ProductSearchDto(product.getName(),
                    product.getDescription(),
                    product.getUnitPrice(),
                    product.getImageUrl(),
                    product.getUnitsInStock()));
        }
        System.out.println("Total products found "+finalProductResults.size());
        System.out.println("Sending the tool call response" + finalProductResults.toString());

        return finalProductResults;
    }
}
