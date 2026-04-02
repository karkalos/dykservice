package se.dykservice.service;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import se.dykservice.IntegrationTest;
import se.dykservice.dto.PriceCalculationRequest;

@IntegrationTest
class PricingServiceTest {

  @Autowired PricingService pricingService;

  @Test
  void calculatesForBothWorkshops() {
    var request = new PriceCalculationRequest(
        List.of(new PriceCalculationRequest.ServiceSelection("Neck seal latex", 1)),
        "standard");
    var results = pricingService.calculateForAllWorkshops(request);
    assertThat(results).hasSize(2);
    var dv = results.stream().filter(r -> r.workshopId().equals("draktverkstan")).findFirst().orElseThrow();
    var sn = results.stream().filter(r -> r.workshopId().equals("subnautica")).findFirst().orElseThrow();
    assertThat(dv.total()).isEqualTo(1039);
    assertThat(sn.total()).isEqualTo(895);
  }

  @Test
  void appliesPrioritySurcharge() {
    var request = new PriceCalculationRequest(
        List.of(new PriceCalculationRequest.ServiceSelection("Pressure test", 1)),
        "priority");
    var results = pricingService.calculateForAllWorkshops(request);
    var sn = results.stream().filter(r -> r.workshopId().equals("subnautica")).findFirst().orElseThrow();
    assertThat(sn.subtotal()).isEqualTo(395);
    assertThat(sn.urgencySurcharge()).isEqualTo(158);
    assertThat(sn.total()).isEqualTo(553);
    var dv = results.stream().filter(r -> r.workshopId().equals("draktverkstan")).findFirst().orElseThrow();
    assertThat(dv.urgencySurcharge()).isEqualTo(198);
  }

  @Test
  void multipleServicesAddUp() {
    var request = new PriceCalculationRequest(
        List.of(
            new PriceCalculationRequest.ServiceSelection("Pressure test", 1),
            new PriceCalculationRequest.ServiceSelection("Wrist seal latex", 2)),
        "standard");
    var results = pricingService.calculateForAllWorkshops(request);
    var sn = results.stream().filter(r -> r.workshopId().equals("subnautica")).findFirst().orElseThrow();
    assertThat(sn.total()).isEqualTo(395 + 495 * 2);
  }
}
