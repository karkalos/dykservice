package se.dykservice.dto;

import java.util.List;
import se.dykservice.domain.ServiceItem;
import se.dykservice.domain.Workshop;

public record WorkshopResponse(
    String id, String name, String address, String city, String phone, String email,
    String website, int prioritySurchargePct, int emergencySurchargePct, int warrantyYears,
    boolean acceptsWetSuits, boolean acceptsVikingHd, boolean hasMailIn,
    List<ServiceItemResponse> services) {

  public record ServiceItemResponse(String id, String category, String name, String nameSv, int basePrice, String notes) {}

  public static WorkshopResponse from(Workshop ws, List<ServiceItem> services) {
    return new WorkshopResponse(
        ws.id(), ws.name(), ws.address(), ws.city(), ws.phone(), ws.email(), ws.website(),
        ws.prioritySurchargePct(), ws.emergencySurchargePct(), ws.warrantyYears(),
        ws.acceptsWetSuits(), ws.acceptsVikingHd(), ws.hasMailIn(),
        services.stream().map(s -> new ServiceItemResponse(
            s.id(), s.category(), s.name(), s.nameSv(), s.basePrice(), s.notes())).toList());
  }
}
