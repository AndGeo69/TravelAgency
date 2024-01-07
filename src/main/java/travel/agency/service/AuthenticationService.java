package travel.agency.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import travel.agency.entities.Agency;
import travel.agency.entities.Client;
import travel.agency.exception.*;
import travel.agency.repository.AgencyRepository;
import travel.agency.repository.ClientRepository;
import travel.agency.resources.CredentialsResource;
import travel.agency.resources.UserResource;
import travel.agency.resources.UserTypeEnum;

import java.util.Objects;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final ClientRepository clientRepository;
    private final AgencyRepository agencyRepository;

    @Transactional
    public UserResource signUpUser(CredentialsResource resource) {
        if (resource != null &&
                resource.getId() != null &&
                resource.getName() != null &&
                resource.getEmail() != null &&
                resource.getPassword() != null &&
                resource.getUserType() != null) {

            if (Objects.equals(resource.getUserType().toLowerCase(), UserTypeEnum.Client.name().toLowerCase())) {
                Client client = clientRepository.findById(resource.getId()).orElse(null);
                if (client != null) {
                    throw new UserAlreadyExistsException();
                }

                client = new Client(resource.getId(), resource.getName(), resource.getEmail(), resource.getPassword(), null);

                clientRepository.save(client);
                return new UserResource(resource.getId(), resource.getName(), UserTypeEnum.Client);

            } else if (Objects.equals(resource.getUserType().toLowerCase(), UserTypeEnum.Agency.name().toLowerCase())) {
                Agency agency = agencyRepository.findById(resource.getId()).orElse(null);
                if (agency != null) {
                    throw new UserAlreadyExistsException();
                }

                agency = new Agency(resource.getId(), resource.getName(), resource.getEmail(), resource.getPassword(), null);

                agencyRepository.save(agency);
                return new UserResource(resource.getId(), resource.getName(), UserTypeEnum.Agency);
            } else {
                throw new UnknownUserTypeException();
            }
        }

        throw new RequiredFieldsException();
    }


    @Transactional
    public UserResource signInUser(CredentialsResource resource) {
        if (resource == null) {
            throw new RequiredFieldsException();
        }

        if (resource.getId() == null || resource.getPassword() == null) {
            throw new RequiredFieldsException();
        }

        if (Objects.equals(resource.getUserType().toLowerCase(), UserTypeEnum.Client.name().toLowerCase())) {
            Client client = clientRepository.findById(resource.getId()).orElse(null);
            if (client != null) {
                if (client.getPassword().equals(resource.getPassword())) {
                    return new UserResource(client.getId(), client.getName(), UserTypeEnum.Client);
                } else {
                    throw new InvalidPasswordException();
                }
            }

            throw new UnknownUserException();
        } else if (Objects.equals(resource.getUserType().toLowerCase(), UserTypeEnum.Agency.name().toLowerCase())) {
            Agency agency = agencyRepository.findById(resource.getId()).orElse(null);
            if (agency != null) {
                if (agency.getPassword().equals(resource.getPassword())) {
                    return new UserResource(agency.getId(), agency.getName(), UserTypeEnum.Agency);
                } else {
                    throw new InvalidPasswordException();
                }
            }

            throw new UnknownUserException();
        } else {
            throw new UnknownUserTypeException();
        }
    }

}
