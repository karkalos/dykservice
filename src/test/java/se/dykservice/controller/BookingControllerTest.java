package se.dykservice.controller;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpStatus;
import se.dykservice.IntegrationTest;
import se.dykservice.dto.CreateBookingRequest;
import se.dykservice.dto.OrderResponse;

@IntegrationTest
class BookingControllerTest {

  @Autowired TestRestTemplate restTemplate;

  @Test
  void createAndRetrieveBooking() {
    var request = new CreateBookingRequest(
        "subnautica", "drop_in", "drysuit", "SANTI", "[]", "standard", 895,
        "Byt halstatning", "swish",
        "Test Testsson", "test@test.se", "0701234567",
        "", "", "", false, null, null);

    var createResponse = restTemplate.postForEntity("/v1/bookings", request, Map.class);
    assertThat(createResponse.getStatusCode()).isEqualTo(HttpStatus.CREATED);

    var orderId = (String) createResponse.getBody().get("orderId");
    assertThat(orderId).startsWith("DS-");

    var getResponse = restTemplate.getForEntity("/v1/orders/" + orderId, OrderResponse.class);
    assertThat(getResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
    assertThat(getResponse.getBody().workshopId()).isEqualTo("subnautica");
    assertThat(getResponse.getBody().status()).isEqualTo("created");
  }
}
