package travel.agency.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import travel.agency.entities.Client;

public interface ClientRepository extends JpaRepository<Client, Long> {
}