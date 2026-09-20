import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductPage } from '../models/product-page';
import { ProductCategory } from '../common/product-category/product-category';
import { Product } from '../common/product';

@Service()
export class ProductService {

    private baseUrl = "http://localhost:8080/api/products";
    private categoryBaseUrl = "http://localhost:8080/api/product-category"
    private httpClient = inject(HttpClient);
    // service class does not support constructor injection.
    // constructor(private httpClient : HttpClient){

    // }

    // Get the products based on the category id and it is paginated
    getProductList(page: number, size: number, categoryId: number): Observable<ProductPage> {
        //Build url to get the list of products for the category id using the parameters categoryId, page and size for pagination
        const searchUrl = `${this.baseUrl}/category/${categoryId}?page=${page}&size=${size}`;
        return this.getProducts(searchUrl);
    }

    private getProducts(searchUrl: string): Observable<ProductPage> {
        return this.httpClient.get<ProductPage>(searchUrl);
    }

    getCategoryList():Observable<ProductCategory[]>{
        const categoryUrl = `${this.categoryBaseUrl}/categories`;
        return this.httpClient.get<ProductCategory[]>(categoryUrl);
    }

    searchProducts(page: number, size: number, searchValue : string) : Observable<ProductPage>{
        const searchProductUrl = `${this.baseUrl}/search?name=${searchValue}&page=${page}&size=${size}`;
        return this.getProducts(searchProductUrl);
    }

    getProductDetails(productId : number) : Observable<Product>{
        const getProductUrl = `${this.baseUrl}/${productId}`;
        return this.httpClient.get<Product>(getProductUrl);
    }
}
