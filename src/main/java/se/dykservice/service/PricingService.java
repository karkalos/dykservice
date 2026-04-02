package se.dykservice.service;

import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import se.dykservice.domain.Workshop;
import se.dykservice.dto.PriceCalculationRequest;
import se.dykservice.dto.PriceResult;
import se.dykservice.repository.ServiceItemRepository;
import se.dykservice.repository.WorkshopRepository;

@Service
@RequiredArgsConstructor
public class PricingService {

  private final WorkshopRepository workshopRepository;
  private final ServiceItemRepository serviceItemRepository;

  public List<PriceResult> calculateForAllWorkshops(PriceCalculationRequest request) {
    var workshops = workshopRepository.findAll();
    return workshops.stream()
        .map(ws -> calculateForWorkshop(ws, request))
        .filter(r -> !r.items().isEmpty())
        .toList();
  }

  private PriceResult calculateForWorkshop(Workshop ws, PriceCalculationRequest request) {
    var workshopServices = serviceItemRepository.findByWorkshopId(ws.id());
    var lineItems = new ArrayList<PriceResult.LineItem>();

    for (var sel : request.services()) {
      workshopServices.stream()
          .filter(s -> s.name().equals(sel.serviceName()))
          .findFirst()
          .ifPresent(service -> lineItems.add(new PriceResult.LineItem(
              service.id(), service.nameSv(), sel.quantity(),
              service.basePrice(), service.basePrice() * sel.quantity())));
    }

    int subtotal = lineItems.stream().mapToInt(PriceResult.LineItem::lineTotal).sum();
    int surchargeRate = switch (request.urgency()) {
      case "priority" -> ws.prioritySurchargePct();
      case "emergency" -> ws.emergencySurchargePct();
      default -> 0;
    };
    int urgencySurcharge = (int) Math.round(subtotal * surchargeRate / 100.0);

    return new PriceResult(ws.id(), ws.name(), ws.city(), ws.warrantyYears(),
        lineItems, subtotal, urgencySurcharge, subtotal + urgencySurcharge);
  }
}
