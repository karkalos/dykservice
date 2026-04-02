package se.dykservice.controller;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import se.dykservice.domain.Customer;
import se.dykservice.dto.CustomerDetailResponse;
import se.dykservice.dto.OrderResponse;
import se.dykservice.repository.CustomerRepository;
import se.dykservice.repository.ServiceOrderRepository;

@RestController
@RequestMapping("/v1/admin/customers")
@RequiredArgsConstructor
public class CustomerController {

  private final CustomerRepository customerRepository;
  private final ServiceOrderRepository serviceOrderRepository;

  @GetMapping
  List<CustomerListResponse> listCustomers() {
    return customerRepository.findAll().stream()
        .map(c -> toListResponse(c))
        .toList();
  }

  @GetMapping("/search")
  List<CustomerListResponse> searchCustomers(@RequestParam("q") String query) {
    return customerRepository.search(query).stream()
        .map(c -> toListResponse(c))
        .toList();
  }

  @GetMapping("/{id}")
  CustomerDetailResponse getCustomer(@PathVariable UUID id) {
    var customer = customerRepository.findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Customer not found"));
    var orders = serviceOrderRepository.findByCustomerId(id);
    return CustomerDetailResponse.from(customer, orders);
  }

  @PutMapping("/{id}")
  Map<String, String> updateCustomer(@PathVariable UUID id, @RequestBody UpdateCustomerRequest request) {
    customerRepository.findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Customer not found"));
    customerRepository.update(Customer.builder()
        .id(id)
        .name(request.name())
        .email(request.email())
        .phone(request.phone())
        .street(request.street() != null ? request.street() : "")
        .postalCode(request.postalCode() != null ? request.postalCode() : "")
        .city(request.city() != null ? request.city() : "")
        .isBusiness(request.isBusiness())
        .company(request.company())
        .orgNr(request.orgNr())
        .notes(request.notes() != null ? request.notes() : "")
        .build());
    return Map.of("status", "updated");
  }

  @GetMapping("/{id}/orders")
  List<OrderResponse> getCustomerOrders(@PathVariable UUID id) {
    return serviceOrderRepository.findByCustomerId(id).stream()
        .map(OrderResponse::from)
        .toList();
  }

  private CustomerListResponse toListResponse(Customer c) {
    var orders = serviceOrderRepository.findByCustomerId(c.id());
    String lastOrderDate = orders.isEmpty() ? null : orders.getFirst().createdAt().toString();
    return new CustomerListResponse(
        c.id(), c.name(), c.email(), c.phone(),
        c.isBusiness(), c.company(),
        orders.size(), lastOrderDate);
  }

  record CustomerListResponse(
      UUID id, String name, String email, String phone,
      boolean isBusiness, String company,
      int orderCount, String lastOrderDate) {}

  record UpdateCustomerRequest(
      String name, String email, String phone,
      String street, String postalCode, String city,
      boolean isBusiness, String company, String orgNr, String notes) {}
}
