export default {

    auth: {
        domain: "dev-oth6zrq2uiqa85uj.us.auth0.com",
        clientId: "oP9SV8ltxbgminz8YBg3H44B9y9VDSXJ",
        authorizationParams: {
            redirect_uri: "http://localhost:4200/login/callback",
            audience: "http://localhost:8080",
        },
    },
    httpInterceptor: {
        allowedList: [
            'http://localhost:8080/api/orders/**',
            'http://localhost:8080/api/checkout/purchase'
        ],
    },
}
