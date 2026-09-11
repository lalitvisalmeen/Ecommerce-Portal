import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../common/product';

@Service()
export class ProductService {

    private baseUrl = "http://localhost:8080/api/products";
    private httpClient = inject(HttpClient);
    // service class does not support constructor injection.
    // constructor(private httpClient : HttpClient){

    // }

    getProductList() : Observable<Product[]>{
        return this.httpClient.get<Product[]>(this.baseUrl);
    }
}
