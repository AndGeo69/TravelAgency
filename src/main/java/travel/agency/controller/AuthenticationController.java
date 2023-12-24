package travel.agency.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import travel.agency.resources.CredentialsResource;
import travel.agency.resources.UserResource;
import travel.agency.service.AuthenticationService;

import java.util.Optional;

@CrossOrigin(origins = "*", allowedHeaders = "*")
@RestController
public class AuthenticationController {

    private final AuthenticationService authenticationService;
    public AuthenticationController(AuthenticationService authenticationService) {
        this.authenticationService = authenticationService;
    }

    @PostMapping(path = "/signup")
    public ResponseEntity<UserResource> signUpUser(@RequestBody CredentialsResource registerResource) {
        return ResponseEntity.of(Optional.ofNullable(authenticationService.signUpUser(registerResource)));
    }

    @PostMapping(path = "/signin")
    public ResponseEntity<UserResource> singInUser(@RequestBody CredentialsResource loginResource) {
        return ResponseEntity.of(Optional.ofNullable(authenticationService.signInUser(loginResource)));
    }

}
