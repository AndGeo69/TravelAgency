package travel.agency.resources;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RegisterCredentialsResource {
    private Long id;
    private String name;
    private String email;
    private String password;
    private String userType;
}
