package travel.agency.exception;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(UserAlreadyExistsException.class)
    public ResponseEntity<Object> handleUserAlreadyExistsException(ApiException e) {
        ErrorMessage error = ErrorMessage.builder()
                .code(e.getApiError().getCode())
                .message(e.getMessage())
                .build();

        return ResponseEntity.status(e.getApiError().getStatus()).body(ResponseBody.of(error));
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
