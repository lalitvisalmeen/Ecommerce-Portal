package com.project.ecommerce.rest;

import com.project.ecommerce.dto.PaymentInfo;
import com.project.ecommerce.dto.Purchase;
import com.project.ecommerce.dto.PurchaseResponse;
import com.project.ecommerce.service.CheckoutService;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.logging.Logger;

@RestController
@RequestMapping("/api/checkout")
public class CheckoutController {

    private CheckoutService checkoutService;

    @Value("${auth0.email.claim.namespace}")
    private String auth0EmailClaimsName;

    private Logger logger = Logger.getLogger(getClass().getName());

    @Autowired
    public CheckoutController(CheckoutService checkoutService){
        this.checkoutService = checkoutService;
    }

    // Spring Security provides the authenticated JWT through @AuthenticationPrincipal.
    // we need to rely on the authenticated sub rather than email id alone
    @PostMapping("/purchase")
    public PurchaseResponse placeOrder(@RequestBody Purchase purchase, @AuthenticationPrincipal Jwt jwt){

        String auth0UserId = jwt.getSubject();
        String email = jwt.getClaimAsString(auth0EmailClaimsName);
        String grantType = jwt.getClaimAsString("gty");

        if(auth0UserId == null || auth0UserId.isBlank() || email == null || email.isBlank()){
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Customer identity information is missing");
        }

        if ("client-credentials".equals(grantType)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Customer authentication is required"
            );
        }
        return checkoutService.placeOrder(purchase, auth0UserId, email);
    }

    @PostMapping("/payment-intent")
    public ResponseEntity<String> createPaymentIntent(@RequestBody PaymentInfo paymentInfo) throws StripeException{
        logger.info("Creating the payment intent with the payment amount " + paymentInfo.getAmount());
        PaymentIntent paymentIntent = this.checkoutService.createPaymentIntent(paymentInfo);
        String paymentIntentResponse = paymentIntent.toJson();
        return new ResponseEntity<>(paymentIntentResponse, HttpStatus.OK);
    }
}
