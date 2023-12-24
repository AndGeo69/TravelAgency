package travel.agency.exception;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler({UserAlreadyExistsException.class, UnknownUserException.class, UnknownUserTypeException.class,
            RequiredFieldsException.class})
    public ResponseEntity<Object> handleUserAlreadyExistsException(ApiException e) {
        ErrorMessage error = ErrorMessage.builder()
                .code(e.getApiError().getCode())
                .message(e.getMessage())
                .build();

        return ResponseEntity.status(e.getApiError().getStatus()).body(ResponseBody.of(error));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> handleException(Exception e) {
        e.printStackTrace();
        ErrorMessage error = ErrorMessage.builder()
                .code(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .message(e.getMessage())
                .build();

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR.value()).body(ResponseBody.of(error));
    }

    @Getter
    @Setter
    @Builder
    public static class ResponseBody {
        private ErrorMessage errors;

        static ResponseBody of(ErrorMessage error) {
            return ResponseBody.builder().errors(error).build();
        }
    }

    @Getter
    @Setter
    @Builder
    private static class ErrorMessage {
        private int code;
        private String message;
    }
}
