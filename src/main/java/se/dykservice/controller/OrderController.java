package se.dykservice.controller;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import se.dykservice.dto.OrderEventResponse;
import se.dykservice.dto.OrderResponse;
import se.dykservice.dto.UpdateStatusRequest;
import se.dykservice.service.OrderService;

@RestController
@RequestMapping("/v1/orders")
@RequiredArgsConstructor
public class OrderController {

  private final OrderService orderService;

  @GetMapping
  List<OrderResponse> listOrders() {
    return orderService.getAllOrders().stream().map(OrderResponse::from).toList();
  }

  @GetMapping("/{orderId}")
  OrderResponse getOrder(@PathVariable String orderId) {
    return OrderResponse.from(orderService.getOrder(orderId));
  }

  @GetMapping("/{orderId}/events")
  List<OrderEventResponse> getOrderEvents(@PathVariable String orderId) {
    return orderService.getOrderEvents(orderId).stream().map(OrderEventResponse::from).toList();
  }

  @PatchMapping("/{orderId}/status")
  Map<String, String> updateStatus(@PathVariable String orderId, @Valid @RequestBody UpdateStatusRequest request) {
    orderService.updateStatus(orderId, request.status(), request.message());
    return Map.of("status", "updated");
  }
}
