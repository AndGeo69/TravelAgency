package travel.agency;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class EmailUtil {

    public static boolean isValidEmail(String email) {
        // Regular expression for a simple email validation
        String emailRegex = "^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}$";
        Pattern pattern = Pattern.compile(emailRegex);
        Matcher matcher = pattern.matcher(email);
        return matcher.matches();
    }
}
