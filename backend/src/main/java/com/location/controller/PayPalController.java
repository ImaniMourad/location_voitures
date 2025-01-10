package com.location.controller;

import com.location.service.PayPalService;
import com.paypal.api.payments.Payment;
import com.paypal.base.rest.PayPalRESTException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/paypal")
public class PayPalController {

    @Autowired
    private PayPalService payPalService;

    @PostMapping("/success")
    public ResponseEntity<?> successPayment(@RequestParam String paymentId, @RequestParam String PayerID, @RequestParam Long idreservation) {
        try {
            System.out.println("Succès du paiement - PaymentID : " + paymentId + ", PayerID : " + PayerID);

            Payment payment = payPalService.executePayment(paymentId, PayerID);
            if ("approved".equals(payment.getState())) {
                System.out.println("Paiement approuvé !");
                return ResponseEntity.ok(Map.of("status", "success", "message", "Paiement approuvé !"));
            }
            System.out.println("Paiement non approuvé.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("status", "error", "message", "Paiement non approuvé"));
        } catch (PayPalRESTException e) {
            System.err.println("Erreur lors de l'exécution du paiement : " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("status", "error", "message", "Erreur lors de l'exécution du paiement : " + e.getMessage()));
        }
    }

    @GetMapping("/cancel")
    public ResponseEntity<?> cancelPayment() {
        System.out.println("Paiement annulé par l'utilisateur.");
        return ResponseEntity.ok(Map.of("status", "cancelled", "message", "Paiement annulé"));
    }

    @PostMapping("/create-payment/{idreservation}")
    public ResponseEntity<?> createPayment(@PathVariable Long idreservation) {
        try {
            Payment payment = payPalService.createPayment(
                    1.0,
                    "USD",
                    "paypal",
                    "sale",
                    "Description du paiement",
                    "http://localhost:3000/client/vehicles/paiment/cancel",
                    "http://localhost:3000/client/vehicles/paiment/success?idreservation=" + idreservation
            );

            String approvalUrl = payment.getLinks().stream()
                    .filter(link -> "approval_url".equals(link.getRel()))
                    .findFirst()
                    .map(link -> link.getHref())
                    .orElse(null);

            if (approvalUrl != null) {
                return ResponseEntity.ok(Map.of("approvalUrl", approvalUrl));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("status", "error", "message", "Impossible de créer le paiement"));
        } catch (PayPalRESTException e) {
            System.err.println("Erreur lors de la création du paiement : " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("status", "error", "message", "Erreur lors de la création du paiement : " + e.getMessage()));
        }
    }
}

