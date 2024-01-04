package travel.agency.converter;

import lombok.RequiredArgsConstructor;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;
import travel.agency.entities.Agency;
import travel.agency.entities.Trip;
import travel.agency.repository.AgencyRepository;
import travel.agency.resources.TripResource;

@Component
@RequiredArgsConstructor
public class TripConverter implements Converter<TripResource, Trip> {

    private final AgencyRepository agencyRepository;

    @Override
    public Trip convert(TripResource source) {
        Trip trip = new Trip();
        trip.setStartDate(source.getStartDate());
        trip.setEndDate(source.getEndDate());
        trip.setStartLocation(source.getStartLocation());
        trip.setEndLocation(source.getEndLocation());
        trip.setAgency(getAgencyById(source.getAgencyId()));
        trip.setSchedule(source.getSchedule());
        trip.setAvailableCapacity(source.getAvailableCapacity());
        return trip;
    }

    private Agency getAgencyById(Long id) {
        return agencyRepository.findById(id).orElse(null);
    }

    public TripResource convertToResource(Trip trip) {
        TripResource tripResource = new TripResource();
        tripResource.setTripId(trip.getId());
        tripResource.setStartDate(trip.getStartDate());
        tripResource.setEndDate(trip.getEndDate());
        tripResource.setStartLocation(trip.getStartLocation());
        tripResource.setEndLocation(trip.getEndLocation());
        tripResource.setAgencyId(trip.getAgency().getId());
        tripResource.setAgencyName(trip.getAgency().getName());
        tripResource.setSchedule(trip.getSchedule());
        tripResource.setAvailableCapacity(trip.getAvailableCapacity());
        return tripResource;
    }
}
