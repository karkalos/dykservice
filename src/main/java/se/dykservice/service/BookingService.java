package se.dykservice.service;

import java.util.concurrent.ThreadLocalRandom;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import se.dykservice.domain.Customer;
import se.dykservice.domain.ServiceOrder;
import se.dykservice.dto.CreateBookingRequest;
import se.dykservice.repository.CustomerRepository;
import se.dykservice.repository.OrderEventRepository;
import se.dykservice.repository.ServiceOrderRepository;

@Service
@RequiredArgsConstructor
public class BookingService {

  private final CustomerRepository customerRepository;
  private final ServiceOrderRepository orderRepository;
  private final OrderEventRepository eventRepository;
  private final EmailService emailService;

  @Transactional
  public String createBooking(CreateBookingRequest req) {
    var customerId = customerRepository.insert(Customer.builder()
        .name(req.customerName())
        .email(req.customerEmail())
        .phone(req.customerPhone())
        .street(req.street() != null ? req.street() : "")
        .postalCode(req.postalCode() != null ? req.postalCode() : "")
        .city(req.city() != null ? req.city() : "")
        .isBusiness(req.isBusiness())
        .company(req.company())
        .orgNr(req.orgNr())
        .build());

    var orderId = "DS-%d-%04d".formatted(
        java.time.Year.now().getValue(),
        ThreadLocalRandom.current().nextInt(1, 10000));

    orderRepository.insert(ServiceOrder.builder()
        .id(orderId)
        .workshopId(req.workshopId())
        .customerId(customerId)
        .bookingType(req.bookingType() != null ? req.bookingType() : "drop_in")
        .status("created")
        .suitType(req.suitType() != null ? req.suitType() : "drysuit")
        .suitBrand(req.suitBrand() != null ? req.suitBrand() : "")
        .items(req.items() != null ? req.items() : "[]")
        .urgency(req.urgency() != null ? req.urgency() : "standard")
        .estimatedPrice(req.estimatedPrice())
        .notes(req.notes() != null ? req.notes() : "")
        .paymentMethod(req.paymentMethod() != null ? req.paymentMethod() : "swish")
        .paymentStatus("pending")
        .build());

    eventRepository.insert(orderId, "created", "Order skapad via webben", "system");
    emailService.sendBookingConfirmation(req.customerEmail(), req.customerName(), orderId);
    return orderId;
  }
}
