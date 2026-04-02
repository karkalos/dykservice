package se.dykservice.controller;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import se.dykservice.repository.ServiceOrderRepository;
import se.dykservice.repository.TimeEntryRepository;

@RestController
@RequiredArgsConstructor
public class DashboardController {

  private final TimeEntryRepository timeEntryRepository;
  private final ServiceOrderRepository orderRepository;

  @PostMapping("/v1/admin/orders/{orderId}/time")
  Map<String, String> addTimeEntry(@PathVariable String orderId, @RequestBody Map<String, Object> body) {
    String description = body.getOrDefault("description", "").toString();
    int minutes = ((Number) body.get("minutes")).intValue();
    timeEntryRepository.insert(orderId, description, minutes);
    return Map.of("status", "created");
  }

  @GetMapping("/v1/admin/dashboard/stats")
  Map<String, Object> getDashboardStats() {
    var stats = new LinkedHashMap<String, Object>();
    stats.put("ordersToday", orderRepository.countCreatedToday());
    stats.put("activeOrders", orderRepository.countByStatusNotIn(List.of("ready", "returned")));
    stats.put("ordersByStatus", orderRepository.countByStatus());
    stats.put("totalMinutesToday", timeEntryRepository.getTotalMinutesToday());
    return stats;
  }
}
