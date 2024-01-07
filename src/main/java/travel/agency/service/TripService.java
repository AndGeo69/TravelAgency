package travel.agency.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.RequestBody;
import travel.agency.converter.TripConverter;
import travel.agency.entities.Client;
import travel.agency.entities.ClientBooking;
import travel.agency.entities.Trip;
import travel.agency.entities.UserBookingId;
import travel.agency.exception.EmptyTripException;
import travel.agency.exception.TripIsFullException;
import travel.agency.exception.UnknownUserException;
import travel.agency.repository.ClientRepository;
import travel.agency.repository.TripRepository;
import travel.agency.resources.BookingResource;
import travel.agency.resources.TripResource;

import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TripService {
    private final TripRepository tripRepository;
    private final ClientRepository clientRepository;
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

        return tripConverter.convertToResource(trip);
    }

    public List<TripResource> getAvailableTrips() {
        return tripRepository.findAvailableTrips()
                .stream().map(tripConverter::convertToResource).toList();
    }

    public List<TripResource> getBookedTrips(Long userId) {
        Client client = clientRepository.findById(userId).orElse(null);
        if (client == null) {
            return Collections.emptyList();
        }
        return client.getClientBookings()
                .stream().map(clientBooking -> clientBooking.getId().getTrip())
                .map(tripConverter::convertToResource).toList();
    }

    public TripResource bookTrip(BookingResource resource) {
        if (resource == null) {
            throw new EmptyTripException();
        }

        Long userId = resource.getUserId();
        Long tripId = resource.getTripId();

        if (resource.getTripId() == null || resource.getUserId() == null) {
            throw new EmptyTripException();
        }

        Client client = clientRepository.findById(userId).orElse(null);
        if (client == null) {
            throw new UnknownUserException();
        }

        Trip trip = tripRepository.findById(tripId).orElse(null);
        if (trip == null) {
            throw new EmptyTripException();
        }

        if (trip.hasValidCapacity()) {
            trip.decrementAvailableCapacity();
        } else {
            throw new TripIsFullException();
        }

        ClientBooking clientBooking = new ClientBooking(new UserBookingId(client, trip));
        client.addClientBooking(clientBooking);
        trip.addClientBooking(clientBooking);

        clientRepository.save(client);

        return tripConverter.convertToResource(trip);
    }

}
