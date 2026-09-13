import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductPage } from '../models/product-page';
import { ProductCategory } from '../common/product-category/product-category';

@Service()
export class ProductService {

    private baseUrl = "http://localhost:8080/api/products";
    private categoryBaseUrl = "http://localhost:8080/api/product-category"
    private httpClient = inject(HttpClient);
    // service class does not support constructor injection.
    // constructor(private httpClient : HttpClient){

    // }

    getProductList(categoryId: number): Observable<ProductPage> {
        const searchUrl = `${this.baseUrl}/category/${categoryId}`;
        return this.httpClient.get<ProductPage>(searchUrl);
    }

    getCategoryList():Observable<ProductCategory[]>{
        const categoryUrl = `${this.baseUrl}/categories`;
        return this.httpClient.get<ProductCategory[]>(categoryUrl);
    }
}
