package com.travelagency.service;

import com.travelagency.UserTypeEnum;
import com.travelagency.entities.Agency;
import com.travelagency.entities.Client;
import com.travelagency.repository.AgencyRepository;
import com.travelagency.repository.ClientRepository;
import com.travelagency.resources.RegisterCredentialsResource;
import com.travelagency.resources.UserResource;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Objects;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final ClientRepository clientRepository;
    private final AgencyRepository agencyRepository;

    @Transactional
    public UserResource signUpUser(RegisterCredentialsResource resource) {
        UserResource userResource = null;

        if (resource != null &&
                resource.getId() != null &&
                resource.getName() != null &&
                resource.getEmail() != null &&
                resource.getPassword() != null &&
                resource.getUserType() != null) {

            if (Objects.equals(resource.getUserType(), UserTypeEnum.Client.name())) {
                Client client = clientRepository.findById(resource.getId()).orElse(null);
                if (client != null) {
                    throw new RuntimeException("User already register"); //TODO custom exception
                }

                client = new Client(resource.getId(), resource.getName(), resource.getEmail(), resource.getPassword(), null);

                clientRepository.save(client);
                return new UserResource(resource.getId(), resource.getName(), UserTypeEnum.Client);

            } else {
                Agency agency = agencyRepository.findById(resource.getId()).orElse(null);
                if (agency != null) {
                    throw new RuntimeException("User already register"); //TODO custom exception
                }

                agency = new Agency(resource.getId(), resource.getName(), resource.getEmail(), resource.getPassword(), null);

                agencyRepository.save(agency);
                return new UserResource(resource.getId(), resource.getName(), UserTypeEnum.Agency);
            }
        }

        return userResource;
    }

}
