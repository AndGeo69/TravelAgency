package travel.agency.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class InvalidPasswordException extends ApiException {
    public InvalidPasswordException() {
        super(APIError.INVALID_PASSWORD);
    }
}
