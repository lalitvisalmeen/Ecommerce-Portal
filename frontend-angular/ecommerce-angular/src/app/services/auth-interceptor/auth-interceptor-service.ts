import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { from, lastValueFrom, Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Service()
export class AuthInterceptorService implements HttpInterceptor{
    auth = inject(AuthService);

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // convert the promise to an observable
    return from(this.handleAccess(request, next));
  }

  private async handleAccess(request: HttpRequest<any>, next: HttpHandler): Promise<HttpEvent<any>> {
    
    const securedEndpoints = [environment.backendApiUrl + '/orders',environment.backendApiUrl+'/checkout/purchase', environment.backendApiUrl+'/checkout/payment-intent'];

    if (securedEndpoints.some((url) => request.urlWithParams.includes(url))) {
      await this.auth.getAccessTokenSilently().forEach((token) => {
        console.log('Access Token: ', token);
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        });
      });
    }
    // convert an observable to a promise
    return await lastValueFrom(next.handle(request));
  }
}
