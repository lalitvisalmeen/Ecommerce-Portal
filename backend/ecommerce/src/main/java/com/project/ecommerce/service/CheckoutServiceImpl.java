package com.project.ecommerce.service;

import com.project.ecommerce.dao.CustomerRepository;
import com.project.ecommerce.dto.PaymentInfo;
import com.project.ecommerce.dto.Purchase;
import com.project.ecommerce.dto.PurchaseResponse;
import com.project.ecommerce.entity.Customer;
import com.project.ecommerce.entity.Order;
import com.project.ecommerce.entity.OrderItem;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class CheckoutServiceImpl implements CheckoutService{

    private CustomerRepository customerRepository;

    @Autowired
    public CheckoutServiceImpl(CustomerRepository customerRepository, @Value("${stripe.key.secret}") String stripeSecretKey){
        this.customerRepository = customerRepository;
        Stripe.apiKey = stripeSecretKey;
    }
    @Override
    @Transactional
    public PurchaseResponse placeOrder(Purchase purchase) {

        // retrieve order from dto
        Order order = purchase.getOrder();
        // generate order tracking number
        String orderTrackingNumber = generateOrderTrackingNumber();
        order.setOrderTrackingNumber(orderTrackingNumber);
        // populate order with order item
        Set<OrderItem> orderItems = purchase.getOrderItems();
        orderItems.forEach(item -> order.add(item));
        // Include shipping and billing address to order
        order.setBillingAddress(purchase.getBillingAddress());
        order.setShippingAddress(purchase.getShippingAddress());
        order.setStatus("Submitted");

        // Include customer to order
        Customer customer = purchase.getCustomer();
        // check if the customer is available in db
        Customer customerFromDB = customerRepository.findByEmail(customer.getEmail());
        if(customerFromDB != null){
            // if the customer exists in db, then replace customer with the existing customer
            customer = customerFromDB;
        }
        customer.add(order);

        // save the details to the db
        customerRepository.save(customer);
        return new PurchaseResponse(orderTrackingNumber);
    }

    @Override
    public PaymentIntent createPaymentIntent(PaymentInfo paymentInfo) throws StripeException {

        Map<String, Object> automaticPaymentMethods = new HashMap<>();
        automaticPaymentMethods.put("enabled", true);

        // now form a request to send to the stripe payment intent api
        Map<String, Object> params = new HashMap<>();
        params.put("amount", paymentInfo.getAmount());
        params.put("currency", paymentInfo.getCurrency());
        params.put("description", "Ecommerce Shopping");
        params.put("receipt_email", paymentInfo.getReceiptEmail());

        params.put("automatic_payment_methods", automaticPaymentMethods);

        return PaymentIntent.create(params);
    }

    private String generateOrderTrackingNumber(){
        // generate a random uuid number
        return "ORD-" + UUID.randomUUID().toString().substring(0, 10).toUpperCase();
    }
}
