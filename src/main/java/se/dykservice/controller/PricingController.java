package se.dykservice.controller;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import se.dykservice.dto.PriceCalculationRequest;
import se.dykservice.dto.PriceResult;
import se.dykservice.service.PricingService;

@RestController
@RequestMapping("/v1/pricing")
@RequiredArgsConstructor
public class PricingController {

  private final PricingService pricingService;

  @PostMapping("/calculate")
  List<PriceResult> calculate(@RequestBody PriceCalculationRequest request) {
    return pricingService.calculateForAllWorkshops(request);
  }
}
