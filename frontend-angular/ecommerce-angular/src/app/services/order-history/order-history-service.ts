import { HttpBackend, HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderHistoryPage } from '../../models/order-history';
import { environment } from '../../../environments/environment.development';

@Service()
export class OrderHistoryService {
    httpClient = inject(HttpClient);
    orderBaseUrl = environment.backendApiUrl+"/orders"

    getOrderHistory(email:string) :Observable<OrderHistoryPage>{
        const getOrdersUrl = `${this.orderBaseUrl}/search?email=${email}`;
        return this.httpClient.get<OrderHistoryPage>(getOrdersUrl)
    }
}
