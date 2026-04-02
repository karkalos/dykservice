package se.dykservice.service;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import se.dykservice.domain.OrderEvent;
import se.dykservice.domain.ServiceOrder;
import se.dykservice.repository.CustomerRepository;
import se.dykservice.repository.OrderEventRepository;
import se.dykservice.repository.ServiceOrderRepository;

@Service
@RequiredArgsConstructor
public class OrderService {

  private final ServiceOrderRepository orderRepository;
  private final OrderEventRepository eventRepository;
  private final CustomerRepository customerRepository;
  private final EmailService emailService;

  public ServiceOrder getOrder(String orderId) {
    return orderRepository.findById(orderId)
        .orElseThrow(() -> new IllegalArgumentException("Order not found: " + orderId));
  }

  public List<ServiceOrder> getAllOrders() {
    return orderRepository.findAll();
  }

  public List<OrderEvent> getOrderEvents(String orderId) {
    return eventRepository.findByOrderId(orderId);
  }

  @Transactional
  public void updateStatus(String orderId, String status, String message) {
    var order = getOrder(orderId);
    orderRepository.updateStatus(orderId, status);
    eventRepository.insert(orderId, status, message != null ? message : "", "workshop");

    customerRepository.findById(order.customerId()).ifPresent(customer ->
        emailService.sendStatusUpdate(customer.email(), customer.name(), orderId, status, message)
    );
  }
}
