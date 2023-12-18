package travel.agency.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class UserAlreadyExistsException extends ApiException {

    public UserAlreadyExistsException() {
        super(APIError.USER_EXISTS);
    }
}
