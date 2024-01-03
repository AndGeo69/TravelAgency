package travel.agency.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.RequestBody;
import travel.agency.converter.TripConverter;
import travel.agency.entities.Trip;
import travel.agency.exception.EmptyTripException;
import travel.agency.repository.TripRepository;
import travel.agency.resources.TripResource;

@Service
@RequiredArgsConstructor
public class TripService {
    private final TripRepository tripRepository;
    private final TripConverter tripConverter;

    public TripResource addTrip(@Validated @RequestBody TripResource tripResource) {
        if (tripResource == null) {
            throw new EmptyTripException();
        }

        Trip trip = tripConverter.convert(tripResource);
        if (trip == null) {
            throw new EmptyTripException();
        }
         tripRepository.save(trip);

        return tripResource;
    }

}
