package travel.agency.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class RequiredFieldsException extends ApiException {

    public RequiredFieldsException() {
        super(APIError.REQUIRED_FIELDS);
    }
}