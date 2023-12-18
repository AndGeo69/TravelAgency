package travel.agency.exception;

import lombok.Getter;

@Getter
public class ApiException extends RuntimeException {
    private final APIError apiError;

    public ApiException(APIError apiError) {
        super(apiError.getUserMessage());
        this.apiError = apiError;
    }
}