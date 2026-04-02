package se.dykservice.controller;

import jakarta.validation.Valid;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import se.dykservice.dto.CreateBookingRequest;
import se.dykservice.service.BookingService;

@RestController
@RequestMapping("/v1/bookings")
@RequiredArgsConstructor
public class BookingController {

  private final BookingService bookingService;

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  Map<String, String> createBooking(@Valid @RequestBody CreateBookingRequest request) {
    var orderId = bookingService.createBooking(request);
    return Map.of("orderId", orderId);
  }
}
