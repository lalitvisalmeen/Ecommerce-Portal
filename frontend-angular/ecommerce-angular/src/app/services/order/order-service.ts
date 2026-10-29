import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from '../../common/order/order';
import { environment } from '../../../environments/environment.development';

@Service()
export class OrderService {

    httpClient = inject(HttpClient);
    
    getOrderDetails(orderId: number): Observable<Order>{
        return this.httpClient.get<Order>(environment.backendApiUrl+`/orders/${orderId}`);
    }

}
