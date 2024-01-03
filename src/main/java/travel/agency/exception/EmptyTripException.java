package travel.agency.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class EmptyTripException extends ApiException {
    public EmptyTripException() {
        super(APIError.USER_NOT_EXISTS);
    }
}
