package se.dykservice.service;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import se.dykservice.domain.OrderEvent;
import se.dykservice.domain.ServiceOrder;
import se.dykservice.dto.DiagnosisRequest;
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
  public void submitDiagnosis(String orderId, DiagnosisRequest request) {
    orderRepository.updateDiagnosis(orderId, request.findings(), request.recommendedItems(), request.updatedPrice());
    orderRepository.updateStatus(orderId, "diagnosed");
    eventRepository.insert(orderId, "diagnosed", "Diagnos: " + request.findings(), "workshop");

    var order = getOrder(orderId);
    customerRepository.findById(order.customerId()).ifPresent(customer ->
        emailService.sendDiagnosisApproval(customer.email(), customer.name(), orderId,
            request.findings(), request.updatedPrice())
    );
  }

  @Transactional
  public void approveDiagnosis(String orderId) {
    orderRepository.approveDiagnosis(orderId);
    orderRepository.updateStatus(orderId, "in_progress");
    eventRepository.insert(orderId, "in_progress", "Kunden godkände diagnosen", "customer");
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
