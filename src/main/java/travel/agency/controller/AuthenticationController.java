package travel.agency.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import travel.agency.resources.RegisterCredentialsResource;
import travel.agency.resources.UserResource;
import travel.agency.service.AuthenticationService;

import java.util.Optional;

@CrossOrigin(origins = "*", allowedHeaders = "*")
@RestController
public class AuthenticationController {

    private @Autowired AuthenticationService authenticationService;

    @PostMapping(path = "/signup")
    public ResponseEntity<UserResource> signUpUser(@RequestBody RegisterCredentialsResource registerResource) {
        return ResponseEntity.of(Optional.of(authenticationService.signUpUser(registerResource)));
    }

}
