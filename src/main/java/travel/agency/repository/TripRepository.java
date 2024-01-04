package travel.agency.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import travel.agency.entities.Trip;

import java.util.List;

public interface TripRepository extends JpaRepository<Trip, Long> {
    @Query("Select t from Trip t where startDate > CURDATE()")
    List<Trip> findAvailableTrips();
}