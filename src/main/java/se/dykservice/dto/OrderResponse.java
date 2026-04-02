package se.dykservice.dto;

import se.dykservice.domain.ServiceOrder;

public record OrderResponse(
    String id, String workshopId, String bookingType, String status,
    String suitType, String suitBrand, String items, String urgency,
    int estimatedPrice, Integer finalPrice, String notes, String paymentStatus, String createdAt) {

  public static OrderResponse from(ServiceOrder o) {
    return new OrderResponse(o.id(), o.workshopId(), o.bookingType(), o.status(),
        o.suitType(), o.suitBrand(), o.items(), o.urgency(), o.estimatedPrice(),
        o.finalPrice(), o.notes(), o.paymentStatus(), o.createdAt().toString());
  }
}
