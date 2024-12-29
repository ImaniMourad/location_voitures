package com.location.service;


import com.location.dto.ReservationDTO;
import com.location.mappers.ReservationMapperImpl;
import com.location.model.Invoice;
import com.location.model.Reservation;
import com.location.model.User;
import com.location.repository.InvoiceRepository;
import com.location.repository.ReservationRepository;
import com.location.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;


import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional
public class ReservationServiceImpl implements ReservationService {

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private ReservationMapperImpl reservationMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private InvoiceRepository invoiceRepository;

    @Autowired
    private static final Logger logger = LoggerFactory.getLogger(ReservationServiceImpl.class);



    @Override
    public List<Map<String, Object>> getReservations() {
        return reservationMapper.fromObjetList(reservationRepository.getReservations());
    }

    @Override
    public List<Map<String, Object>> getReservationsByClientCin(String cin) {
        return reservationMapper.fromObjetList(reservationRepository.getReservationsByClientCin(cin));
    }

    @Override
    public Map<String, Object> addReservation(ReservationDTO reservationDTO) {
        // Map from DTO to entity
        Reservation reservation = reservationMapper.fromReservationDTO(reservationDTO);

        // Save reservation
        reservation = reservationRepository.save(reservation);

        // Find client by CIN
        User client = userRepository.findByCin(reservationDTO.getClientCIN());
        if (client == null) {
            throw new IllegalArgumentException("Client with CIN " + reservationDTO.getClientCIN() + " not found.");
        }

        // Create and associate invoice
        Invoice invoice = new Invoice();
        invoice.setAmount(reservationDTO.getTotal());
        invoice.setPaymentMethod(reservationDTO.getPaymentMethod());
        invoice.setPaymentStatus(reservationDTO.getPaymentStatus());
        invoice.setPaymentDate(reservationDTO.getPaidAt());
        invoice.setReservation(reservation);

        // Save invoice
        Invoice newInvoice = invoiceRepository.save(invoice);

        // Prepare response
        Map<String, Object> response = new HashMap<>();

        response.put("client", client);
        response.put("reservation", reservation);
        response.put("invoice", newInvoice);

        // Log and return
        logger.info("Reservation created with client info: {}", response);
        return response;
    }

}
