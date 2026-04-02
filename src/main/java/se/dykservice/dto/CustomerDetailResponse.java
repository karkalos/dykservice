package se.dykservice.dto;

import java.util.List;
import java.util.UUID;
import se.dykservice.domain.Customer;
import se.dykservice.domain.ServiceOrder;

public record CustomerDetailResponse(
    UUID id, String name, String email, String phone,
    String street, String postalCode, String city,
    boolean isBusiness, String company, String orgNr, String notes,
    List<OrderResponse> orders) {

  public static CustomerDetailResponse from(Customer c, List<ServiceOrder> orders) {
    return new CustomerDetailResponse(
        c.id(), c.name(), c.email(), c.phone(),
        c.street(), c.postalCode(), c.city(),
        c.isBusiness(), c.company(), c.orgNr(), c.notes(),
        orders.stream().map(OrderResponse::from).toList());
  }
}
