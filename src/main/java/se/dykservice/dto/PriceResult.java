package se.dykservice.dto;

import java.util.List;

public record PriceResult(
    String workshopId,
    String workshopName,
    String city,
    int warrantyYears,
    List<LineItem> items,
    int subtotal,
    int urgencySurcharge,
    int total) {

  public record LineItem(String serviceId, String nameSv, int quantity, int unitPrice, int lineTotal) {}
}
