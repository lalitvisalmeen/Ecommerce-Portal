import { environment } from "../../environments/environment.development";

export default {

    auth: {
        domain: "dev-oth6zrq2uiqa85uj.us.auth0.com",
        clientId: "oP9SV8ltxbgminz8YBg3H44B9y9VDSXJ",
        authorizationParams: {
            redirect_uri: "https://localhost:4200/login/callback",
            audience: environment.backendServer,
        },
        cacheLocation: 'localstorage' as const
    },
    httpInterceptor: {
        allowedList: [
            environment.backendApiUrl+'/orders/**',
            environment.backendApiUrl+'/checkout/purchase'
        ],
    }

}
