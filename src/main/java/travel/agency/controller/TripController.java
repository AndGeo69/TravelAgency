package travel.agency.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import travel.agency.resources.TripResource;
import travel.agency.service.TripService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/trip")
public class TripController {
    private final TripService tripService;

    @PostMapping(path = "addTrip")
    public ResponseEntity<TripResource> addTrip(@Validated @RequestBody TripResource tripResource) {
        return ResponseEntity.ok(tripService.addTrip(tripResource));
    }

}
