package com.travelagency.controller;

import com.travelagency.resources.RegisterCredentialsResource;
import com.travelagency.resources.UserResource;
import com.travelagency.service.AuthenticationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@CrossOrigin(origins = "*", allowedHeaders = "*")
@RestController("/api/v1")
public class AuthenticationController {

    private @Autowired AuthenticationService authenticationService;

    @PostMapping(path = "/signup")
    public ResponseEntity<UserResource> signUpUser(@RequestBody RegisterCredentialsResource registerResource) {
        return ResponseEntity.of(Optional.of(authenticationService.signUpUser(registerResource)));
    }

}
