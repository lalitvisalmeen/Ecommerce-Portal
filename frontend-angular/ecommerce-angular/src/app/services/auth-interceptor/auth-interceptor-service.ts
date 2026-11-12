import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { Observable, switchMap, take } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Service()
export class AuthInterceptorService implements HttpInterceptor{
    private auth = inject(AuthService);

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    const securedEndpoints = [
      environment.backendApiUrl + '/orders',
      environment.backendApiUrl + '/checkout/purchase',
      environment.backendApiUrl + '/checkout/payment-intent'
    ];

    const chatEndpoint = environment.backendApiUrl + '/chat';

    // Protected endpoints always require an access token.
    if (securedEndpoints.some(url => request.url.startsWith(url))) {
      return this.attachAccessToken(request, next);
    }

    // Chat supports both guests and authenticated customers.
    if (request.url === chatEndpoint) {
      return this.auth.isAuthenticated$.pipe(
        take(1),
        switchMap(isAuthenticated => {
          if (isAuthenticated) {
            return this.attachAccessToken(request, next);
          }

          return next.handle(request);
        })
      );
    }

    return next.handle(request);
  }

  private attachAccessToken(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    return this.auth.getAccessTokenSilently().pipe(
      take(1),
      switchMap(token => {
        const authenticatedRequest = request.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });

        return next.handle(authenticatedRequest);
      })
    );
  }
}
