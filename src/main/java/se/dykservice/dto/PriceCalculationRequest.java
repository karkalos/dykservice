package se.dykservice.dto;

import java.util.List;

public record PriceCalculationRequest(
    List<ServiceSelection> services,
    String urgency) {

  public record ServiceSelection(String serviceName, int quantity) {}
}
