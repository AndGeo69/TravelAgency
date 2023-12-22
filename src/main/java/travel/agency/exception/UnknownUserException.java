package travel.agency.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class UnknownUserException extends ApiException{

    public UnknownUserException(APIError apiError) {
        super(APIError.ENTITY_NOT_FOUND);
    }
}
