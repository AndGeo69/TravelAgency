package travel.agency.resources;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BookingResource {
    private Long userId;
    private Long tripId;
}
