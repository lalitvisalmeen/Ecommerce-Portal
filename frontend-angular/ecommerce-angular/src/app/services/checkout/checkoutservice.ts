import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Purchase } from '../../common/purchase/purchase';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { PaymentInfo } from '../../common/payment-info/payment-info';

@Service()
export class Checkoutservice {
    private purchaseUrl = environment.backendApiUrl+"/checkout/purchase"
    private paymentIntentUrl = environment.backendApiUrl+"/checkout/payment-intent"
    private httpClient = inject(HttpClient);

    placeOrder(purchase: Purchase): Observable<any> {
        return this.httpClient.post<Purchase>(this.purchaseUrl, purchase);
    }

    createPaymentIntent(paymentInfo : PaymentInfo): Observable<any>{
        return this.httpClient.post<PaymentInfo>(this.paymentIntentUrl, paymentInfo );
    }
}
