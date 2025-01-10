package com.location.service;


import com.location.dto.ReservationDTO;
import com.location.mappers.ReservationMapperImpl;
import com.location.model.*;
import com.location.repository.InvoiceRepository;
import com.location.repository.ReservationRepository;
import com.location.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;


import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.*;

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

    @Autowired
    private EmailService emailService;


    @Override
    public List<Map<String, Object>> getReservations() {
        List<Object[]> reservations = reservationRepository.getReservations();
        List<Map<String, Object>> response = new ArrayList<>();
        for (Object[] reservation : reservations) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", reservation[0]);
            map.put("client", reservation[1] + " " + reservation[2]);
            map.put("startDate", reservation[3]);
            map.put("endDate", reservation[4]);
            map.put("vehicle", reservation[5] + " " + reservation[6]);
            map.put("deletedAt", reservation[7]);
            response.add(map);
        }
        return response;
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

    @Override
    public Map<String, String> getReservation(Long reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId).orElse(null);
        if (reservation == null) {
            throw new IllegalArgumentException("Reservation with id " + reservationId + " not found.");
        }

        Invoice invoice = invoiceRepository.findByReservationId(reservationId);
        if (invoice == null) {
            throw new IllegalArgumentException("Invoice for reservation with id " + reservationId + " not found.");
        }

        Map<String, String> response = new HashMap<>();
        response.put("id", String.valueOf(reservation.getId()));
        response.put("startTime", String.valueOf(reservation.getStartDate().toLocalTime()));
        response.put("endTime", String.valueOf(reservation.getEndDate().toLocalTime()));
        response.put("clientCIN", reservation.getClient().getCin());
        response.put("vehicleId", reservation.getVehicle().getLicensePlate());
        response.put("startDate", String.valueOf(reservation.getStartDate().toLocalDate()));
        response.put("endDate", String.valueOf(reservation.getEndDate().toLocalDate()));
        response.put("deletedAt", String.valueOf(reservation.getDeletedAt()));
        response.put("paidAt", String.valueOf(invoice.getPaymentDate()));
        response.put("totalPrice", String.valueOf(invoice.getAmount()));

        return response;
    }

    @Override
    public Map<String, Object> updateReservation(Long reservationId, ReservationDTO reservationDTO) {
        Reservation reservation = reservationRepository.findById(reservationId).orElse(null);
        if (reservation == null) {
            throw new IllegalArgumentException("Reservation with id " + reservationId + " not found.");
        }

        // Update reservation
        reservation.setStartDate(reservationDTO.getStartDate());
        reservation.setEndDate(reservationDTO.getEndDate());
        reservation.setDeletedAt(reservationDTO.getDeletedAt());

        // Save reservation
        reservation = reservationRepository.save(reservation);

        // Find client by CIN
        User client = userRepository.findByCin(reservationDTO.getClientCIN());
        if (client == null) {
            throw new IllegalArgumentException("Client with CIN " + reservationDTO.getClientCIN() + " not found.");
        }

        // modifier invoice exist
        Invoice invoice = invoiceRepository.findByReservationId(reservationId);
        if (invoice == null) {
            throw new IllegalArgumentException("Invoice for reservation with id " + reservationId + " not found.");
        }

        // Update invoice
        invoice.setAmount(reservationDTO.getTotal());
        invoice.setPaymentMethod(reservationDTO.getPaymentMethod());
        invoice.setPaymentStatus(reservationDTO.getPaymentStatus());
        invoice.setPaymentDate(reservationDTO.getPaidAt());

        // Save invoice
        Invoice newInvoice = invoiceRepository.save(invoice);

        // Prepare response
        Map<String, Object> response = new HashMap<>();
        response.put("client", client);
        response.put("reservation", reservation);
        response.put("invoice", newInvoice);

        // Log and return
        logger.info("Reservation updated with client info: {}", response);
        return response;
    }

    @Override
    public void archiveReservation(Long reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId).orElse(null);
        if (reservation != null) {
            reservation.setDeletedAt(LocalDateTime.now());
        }
        reservationRepository.save(reservation);
    }

    @Override
    public Map<String, Object> addReservationclient(ReservationDTO reservationDTO) {
        Reservation reservation = reservationMapper.fromReservationDTO(reservationDTO);

        // Save reservation
        reservation = reservationRepository.save(reservation);

        // Prepare response
        Map<String, Object> response = new HashMap<>();


        response.put("reservation", reservation);

        // Log and return
        logger.info("Reservation created with client info: {}", response);
        return response;
    }

    @Override
    public void cancelReservationForOthers(Long idreservation) {
        List<Object> clients = reservationRepository.getClientReservedSameVehicleInSamePeriod(idreservation);
        Vehicle vehicle = reservationRepository.getVehicleByReservationId(idreservation);

        for (Object client : clients) {
            Object[] clientData = (Object[]) client;

            String firstName = (String) clientData[0];
            String lastName = (String) clientData[1];
            String email = (String) clientData[2];
            Timestamp startDate = (Timestamp) clientData[3];
            Timestamp endDate = (Timestamp) clientData[4];

            // Convert Timestamp to String
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            String startDateAsString = sdf.format(startDate);
            String endDateAsString = sdf.format(endDate);

            // send email to the client
            String subject = "Reservation Cancellation Notice";
            String text = "Your reservation for the vehicle with license plate " + vehicle.getLicensePlate() +
                    ", Model: " + vehicle.getModel() + ", Brand: " + vehicle.getBrand() +
                    " between " + startDateAsString + " and " + endDateAsString + " is canceled Because another user has paid for it.";
            emailService.sendEmail(email, subject, text);

            // delete reservation for the user with this vehicle
            LocalDateTime startDateTime = reservationRepository.getStartDateByReservationId(idreservation);
            LocalDateTime endDateTime = reservationRepository.getEndDateByReservationId(idreservation);
            List<Reservation> reservations = reservationRepository.getReservationByVehicleIdAndDate(vehicle.getLicensePlate(), startDateTime, endDateTime);
            for (Reservation reservation : reservations) {
                reservation.setDeletedAt(LocalDateTime.now());
                reservationRepository.save(reservation);
            }
        }
    }
}


