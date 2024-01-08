package travel.agency.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import travel.agency.resources.BookedTripsCredsResource;
import travel.agency.resources.BookingResource;
import travel.agency.resources.TripResource;
import travel.agency.service.TripService;

import java.util.List;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "*", allowedHeaders = "*")
@RequestMapping("/trip/")
public class TripController {
    private final TripService tripService;

    @PostMapping(path = "addTrip")
    public ResponseEntity<TripResource> addTrip(@Validated @RequestBody TripResource tripResource) {
        return ResponseEntity.ok(tripService.addTrip(tripResource));
    }

    @GetMapping(path = "getAvailableTrips")
    public ResponseEntity<List<TripResource>> getAvailableTrips() {
        return ResponseEntity.ok(tripService.getAvailableTrips());
    }

    @PostMapping(path = "getBookedTrips")
    public ResponseEntity<List<TripResource>> getBookedTrips(@RequestBody BookedTripsCredsResource resource) {
        return ResponseEntity.ok(tripService.getBookedTrips(resource));
    }

    @PostMapping(path = "book")
    public ResponseEntity<TripResource> bookTrip(@RequestBody BookingResource bookingResource) {
        return ResponseEntity.ok(tripService.bookTrip(bookingResource));
    }

    @PostMapping(path = "search")
    public ResponseEntity<List<TripResource>> searchTrip(@RequestBody TripResource tripResource) {
        return ResponseEntity.ok(tripService.searchTrip(tripResource));
    }
}
