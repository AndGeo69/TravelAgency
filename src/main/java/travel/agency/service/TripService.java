package travel.agency.service;

import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.RequestBody;
import travel.agency.converter.TripConverter;
import travel.agency.entities.Agency;
import travel.agency.entities.Client;
import travel.agency.entities.ClientBooking;
import travel.agency.entities.Trip;
import travel.agency.exception.EmptyTripException;
import travel.agency.exception.TripIsFullException;
import travel.agency.exception.UnknownUserException;
import travel.agency.repository.AgencyRepository;
import travel.agency.repository.ClientRepository;
import travel.agency.repository.TripRepository;
import travel.agency.resources.BookedTripsCredsResource;
import travel.agency.resources.BookingResource;
import travel.agency.resources.TripResource;
import travel.agency.resources.UserTypeEnum;

import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@RequiredArgsConstructor
public class TripService {
    private final TripRepository tripRepository;
    private final ClientRepository clientRepository;
    private final AgencyRepository agencyRepository;
    private final TripConverter tripConverter;

    private final EntityManager entityManager;

    public TripResource addTrip(@Validated @RequestBody TripResource tripResource) {
        if (tripResource == null) {
            throw new EmptyTripException();
        }

        validateTrip(tripResource);

        Trip trip = tripConverter.convert(tripResource);
        if (trip == null) {
            throw new EmptyTripException();
        }
         tripRepository.save(trip);

        return tripConverter.convertToResource(trip);
    }

    private void validateTrip(TripResource tripResource) {
        if (tripResource.getAvailableCapacity() == null || tripResource.getAvailableCapacity() <= 0) {
            throw new RuntimeException("Trip's available capacity must be positive number");
        }

        if (tripResource.getAgencyId() == null) {
            throw new RuntimeException("Trip requires an agency");
        }

        if (tripResource.getStartLocation() == null || tripResource.getStartLocation().isEmpty()) {
            throw new RuntimeException("Trip's start location is missing");
        }

        if (tripResource.getEndLocation() == null || tripResource.getEndLocation().isEmpty()) {
            throw new RuntimeException("Trip's end location is missing");
        }

        Date startDate = tripResource.getStartDate();
        Date endDate = tripResource.getEndDate();

        if (startDate == null || endDate == null) {
            throw new RuntimeException("Start date and end date are required");
        }

//        if (!startDate.after(new Date().)) {
//            throw new RuntimeException("Start date must be in the future");
//        }

        if (startDate.after(endDate)) {
            throw new RuntimeException("End date must be after start date");
        }
    }

    @Transactional
    public List<TripResource> getAvailableTrips() {
        return tripRepository.findAvailableTrips()
                .stream().map(tripConverter::convertToResource).toList();
    }

    public List<TripResource> getBookedTrips(BookedTripsCredsResource resource) {
        if (resource == null) {
            return Collections.emptyList();
        }

        if (Objects.equals(resource.getUserType().toLowerCase(), UserTypeEnum.Client.name().toLowerCase())) {
            Client client = clientRepository.findById(resource.getId()).orElse(null);

            if (client == null) {
                return Collections.emptyList();
            }

            return client.getClientBookings()
                    .stream().map(ClientBooking::getTrip)
                    .map(tripConverter::convertToResource).toList();
        } else if (Objects.equals(resource.getUserType().toLowerCase(), UserTypeEnum.Agency.name().toLowerCase())) {
            Agency agency = agencyRepository.findById(resource.getId()).orElse(null);

            if (agency == null) {
                return Collections.emptyList();
            }

            return agency.getTrips()
                    .stream()
                    .map(tripConverter::convertToResource).toList();
        } else {
            return Collections.emptyList();
        }
    }

    @Transactional
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

        ClientBooking clientBooking = new ClientBooking();
        clientBooking.setClient(client);
        clientBooking.setTrip(trip);

        client.addClientBooking(clientBooking);
        trip.addClientBooking(clientBooking);

        clientRepository.save(client);

        return tripConverter.convertToResource(trip);
    }

    private Timestamp formatDate(Date date) {
        DateTimeFormatter inputFormatter = DateTimeFormatter.ofPattern("EEE MMM dd HH:mm:ss zzz yyyy", Locale.ENGLISH);
        ZonedDateTime zonedDateTime = ZonedDateTime.parse(date.toString(), inputFormatter);
        return Timestamp.from(zonedDateTime.toInstant());
    }

    @Transactional
    public List<TripResource> searchTrip(TripResource tripResource) {
        if (tripResource == null) {
            return getAvailableTrips();
        }

        HashMap<String, String> queryMap = new HashMap<>();

        List<String> queryParams = new ArrayList<>();

        if (tripResource.getStartDate() != null) {
            queryMap.put("start_date", String.valueOf(formatDate(tripResource.getStartDate())));

            queryParams.add(String.valueOf(tripResource.getStartDate()));
        }

        if (tripResource.getEndDate() != null) {
            queryMap.put("end_date", String.valueOf(formatDate(tripResource.getEndDate())));
            queryParams.add(String.valueOf(tripResource.getEndDate()));
        }

        if (!tripResource.getStartLocation().isEmpty()) {
            queryMap.put("start_location", String.valueOf(tripResource.getStartLocation()));
            queryParams.add(String.valueOf(tripResource.getStartLocation()));
        }

        if (!tripResource.getEndLocation().isEmpty()) {
            queryMap.put("end_location", String.valueOf(tripResource.getEndLocation()));
            queryParams.add(String.valueOf(tripResource.getEndLocation()));
        }

        if (tripResource.getAvailableCapacity() != null) {
            queryMap.put("available_capacity", String.valueOf(tripResource.getAvailableCapacity()));
            queryParams.add(String.valueOf(tripResource.getAvailableCapacity()));
        }

        if (queryParams.isEmpty()) {
            return getAvailableTrips();
        }

        StringBuilder sqlBuilder = new StringBuilder("Select * from trip where ");
        boolean isFirst = true;

        for (String key : queryMap.keySet()) {
            if (isFirst) {
                sqlBuilder.append(" ").append(key)
                        .append("= ").append("'").append(queryMap.get(key)).append("'");
            } else {
                sqlBuilder.append(" and ").append(key)
                        .append("= ").append("'").append(queryMap.get(key)).append("'");
            }
            isFirst = false;
        }

        List<Trip> queriedTrips = entityManager.createNativeQuery(sqlBuilder.toString(), Trip.class).getResultList();
        if (queriedTrips.isEmpty()) {
            return Collections.emptyList();
        }

        return queriedTrips.stream().map(tripConverter::convertToResource).toList();
    }
}
