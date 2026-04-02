package se.dykservice.dto;

import se.dykservice.domain.OrderEvent;

public record OrderEventResponse(String status, String message, String createdBy, String createdAt) {
  public static OrderEventResponse from(OrderEvent e) {
    return new OrderEventResponse(e.status(), e.message(), e.createdBy(), e.createdAt().toString());
  }
}
