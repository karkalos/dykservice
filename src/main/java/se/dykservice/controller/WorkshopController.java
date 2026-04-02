package se.dykservice.controller;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import se.dykservice.dto.WorkshopResponse;
import se.dykservice.repository.ServiceItemRepository;
import se.dykservice.repository.WorkshopRepository;

@RestController
@RequestMapping("/v1/workshops")
@RequiredArgsConstructor
public class WorkshopController {

  private final WorkshopRepository workshopRepository;
  private final ServiceItemRepository serviceItemRepository;

  @GetMapping
  List<WorkshopResponse> listWorkshops() {
    return workshopRepository.findAll().stream()
        .map(ws -> WorkshopResponse.from(ws, serviceItemRepository.findByWorkshopId(ws.id())))
        .toList();
  }

  @GetMapping("/{id}")
  WorkshopResponse getWorkshop(@PathVariable String id) {
    var ws = workshopRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Workshop not found: " + id));
    return WorkshopResponse.from(ws, serviceItemRepository.findByWorkshopId(id));
  }
}
