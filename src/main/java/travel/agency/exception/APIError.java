package travel.agency.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum APIError {

    // HTTP_STATUS: 400
    PARAMS_REQUIRED(HttpStatus.BAD_REQUEST, 400001, "Request malformed, missing request param(s)"),
    PARAMS_TYPE_MISMATCH(HttpStatus.BAD_REQUEST, 400002, "The provided param(s) type is wrong"),
    INVALID_BODY(HttpStatus.BAD_REQUEST, 400003, "Invalid body request"),

    // HTTP_STATUS: 404
    ENTITY_NOT_FOUND(HttpStatus.NOT_FOUND, 404001, "The requested entity does not exist."),
    USER_EXISTS(HttpStatus.NOT_FOUND, 404002, "User already exists."),

    // HTTP_STATUS: 500
    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, 50001, "Internal Server Error");

    private final HttpStatus status;
    private final int code;
    private final String userMessage;
    private final String info;

    APIError(HttpStatus status, int code, String userMessage) {
        this(status, code, userMessage, userMessage);
    }
}
