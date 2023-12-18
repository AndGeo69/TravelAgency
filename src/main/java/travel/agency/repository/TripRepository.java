package travel.agency.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import travel.agency.entities.Trip;

public interface TripRepository extends JpaRepository<Trip, Long> {
}