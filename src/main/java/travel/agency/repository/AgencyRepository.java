package travel.agency.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import travel.agency.entities.Agency;

public interface AgencyRepository extends JpaRepository<Agency, Long> {
}