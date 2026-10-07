import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  importProvidersFrom,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthHttpInterceptor, provideAuth0 } from '@auth0/auth0-angular';
import myAppConfig from './config/my-app-config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom(NgbModule),
    provideAuth0({
      ...myAppConfig.auth,
      httpInterceptor: {
        ...myAppConfig.httpInterceptor,
      },
    }),

    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: AuthHttpInterceptor,
    //   multi: true,
    // },
  ],
};
