package se.dykservice.controller;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import se.dykservice.domain.InventoryItem;
import se.dykservice.repository.InventoryRepository;

@RestController
@RequestMapping("/v1/admin/inventory")
@RequiredArgsConstructor
public class InventoryController {

    private final InventoryRepository inventoryRepository;

    @GetMapping
    List<InventoryItem> listAll() {
        return inventoryRepository.findAll();
    }

    @GetMapping("/low-stock")
    List<InventoryItem> lowStock() {
        return inventoryRepository.findLowStock();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    InventoryItem create(@RequestBody Map<String, Object> body) {
        var id = UUID.randomUUID();
        var item = InventoryItem.builder()
            .id(id)
            .name((String) body.get("name"))
            .category((String) body.get("category"))
            .sku((String) body.get("sku"))
            .quantity(body.get("quantity") != null ? ((Number) body.get("quantity")).intValue() : 0)
            .minQuantity(body.get("minQuantity") != null ? ((Number) body.get("minQuantity")).intValue() : 2)
            .supplier((String) body.get("supplier"))
            .unitCost(body.get("unitCost") != null ? ((Number) body.get("unitCost")).intValue() : null)
            .notes((String) body.get("notes"))
            .build();
        inventoryRepository.insert(item);
        return inventoryRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR));
    }

    @PatchMapping("/{id}/quantity")
    InventoryItem adjustQuantity(@PathVariable UUID id, @RequestBody Map<String, Object> body) {
        if (body.containsKey("delta")) {
            int delta = ((Number) body.get("delta")).intValue();
            inventoryRepository.adjustQuantity(id, delta);
        } else if (body.containsKey("quantity")) {
            int quantity = ((Number) body.get("quantity")).intValue();
            inventoryRepository.updateQuantity(id, quantity);
        }
        return inventoryRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }

    @PutMapping("/{id}")
    InventoryItem update(@PathVariable UUID id, @RequestBody Map<String, Object> body) {
        var existing = inventoryRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        var item = InventoryItem.builder()
            .id(id)
            .name(body.containsKey("name") ? (String) body.get("name") : existing.name())
            .category(body.containsKey("category") ? (String) body.get("category") : existing.category())
            .sku(body.containsKey("sku") ? (String) body.get("sku") : existing.sku())
            .quantity(body.containsKey("quantity") ? ((Number) body.get("quantity")).intValue() : existing.quantity())
            .minQuantity(body.containsKey("minQuantity") ? ((Number) body.get("minQuantity")).intValue() : existing.minQuantity())
            .supplier(body.containsKey("supplier") ? (String) body.get("supplier") : existing.supplier())
            .unitCost(body.containsKey("unitCost") && body.get("unitCost") != null ? ((Number) body.get("unitCost")).intValue() : existing.unitCost())
            .notes(body.containsKey("notes") ? (String) body.get("notes") : existing.notes())
            .build();
        inventoryRepository.update(item);
        return inventoryRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    void delete(@PathVariable UUID id) {
        inventoryRepository.deleteById(id);
    }
}
