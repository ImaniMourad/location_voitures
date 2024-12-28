package com.location.service;

import com.paypal.api.payments.*;
import com.paypal.base.rest.APIContext;
import com.paypal.base.rest.PayPalRESTException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class PayPalService {
    private final APIContext apiContext;

    public PayPalService() {
        this.apiContext = new APIContext("AeSRLwYuuPE3vx2ZgA4T_FhPeLX2eQSuDVri5iidEDwojG82PMDcryP2VcA8hKTlef5ixoDEBIdfInWg", "EBDxR1EBGSfZWczuC7GwV5fEMSu3-MpV5DaZ-Gvl60O5bsBORPEbHW7tUZJZSvr72V5fRZMRq2YkUg22", "sandbox");
    }

    public Payment createPayment(Double total, String currency, String method, String intent, String description, String cancelUrl, String successUrl) throws PayPalRESTException, PayPalRESTException {
        Amount amount = new Amount();
        amount.setCurrency(currency);
        amount.setTotal(String.format("%.2f", total));

        Transaction transaction = new Transaction();
        transaction.setDescription(description);
        transaction.setAmount(amount);

        List<Transaction> transactions = new ArrayList<>();
        transactions.add(transaction);

        Payer payer = new Payer();
        payer.setPaymentMethod(method.toLowerCase());

        Payment payment = new Payment();
        payment.setIntent(intent.toLowerCase());
        payment.setPayer(payer);
        payment.setTransactions(transactions);
        RedirectUrls redirectUrls = new RedirectUrls();
        redirectUrls.setCancelUrl(cancelUrl);
        redirectUrls.setReturnUrl(successUrl);
        payment.setRedirectUrls(redirectUrls);

        return payment.create(apiContext);
    }

    public Payment executePayment(String paymentId, String payerId) throws PayPalRESTException {
        try {
            Payment payment = new Payment();
            payment.setId(paymentId);
            PaymentExecution paymentExecution = new PaymentExecution();
            paymentExecution.setPayerId(payerId);
            return payment.execute(apiContext, paymentExecution);
        } catch (PayPalRESTException e) {
            System.err.println("Error executing payment: " + e.getMessage());
            throw e;
        }
    }

}
