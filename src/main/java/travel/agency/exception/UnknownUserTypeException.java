package travel.agency.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class UnknownUserTypeException extends ApiException {
    public UnknownUserTypeException() {
        super(APIError.UNKNOWN_USER_TYPE);
    }
}
