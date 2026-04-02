package se.dykservice.controller;

import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import se.dykservice.domain.ServiceItem;
import se.dykservice.repository.ServiceItemRepository;

@RestController
@RequestMapping("/v1/admin")
@RequiredArgsConstructor
public class AdminController {

    private final ServiceItemRepository serviceItemRepository;

    @GetMapping("/services")
    List<ServiceItem> listServices() {
        return serviceItemRepository.findByWorkshopId("subnautica");
    }

    @PatchMapping("/services/{id}/price")
    Map<String, String> updatePrice(@PathVariable String id, @RequestBody Map<String, Integer> body) {
        int newPrice = body.get("price");
        serviceItemRepository.updatePrice(id, newPrice);
        return Map.of("status", "updated");
    }

    @PostMapping("/services")
    Map<String, String> createService(@RequestBody CreateServiceRequest request) {
        var id = "sn-" + request.category() + "-" + System.currentTimeMillis();
        serviceItemRepository.insert(ServiceItem.builder()
            .id(id)
            .workshopId("subnautica")
            .category(request.category())
            .name(request.name())
            .nameSv(request.nameSv())
            .basePrice(request.basePrice())
            .notes(request.notes() != null ? request.notes() : "")
            .inStock(true)
            .build());
        return Map.of("id", id);
    }

    @DeleteMapping("/services/{id}")
    Map<String, String> deleteService(@PathVariable String id) {
        serviceItemRepository.deleteById(id);
        return Map.of("status", "deleted");
    }

    record CreateServiceRequest(String category, String name, String nameSv, int basePrice, String notes) {}
}
