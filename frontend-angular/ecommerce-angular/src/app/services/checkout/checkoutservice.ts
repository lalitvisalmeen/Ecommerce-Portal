import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Purchase } from '../../common/purchase/purchase';
import { Observable } from 'rxjs';

@Service()
export class Checkoutservice {
    private purchaseUrl = "http://localhost:8080/api/checkout/purchase"
    private httpClient = inject(HttpClient);

    placeOrder(purchase: Purchase): Observable<any> {
        return this.httpClient.post<Purchase>(this.purchaseUrl, purchase);
    }
}
