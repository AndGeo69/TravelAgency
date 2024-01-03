package travel.agency.resources;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.OffsetDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TripResource {
    private Long tripId;
    private Integer availableCapacity;
    private OffsetDateTime startDate;
    private OffsetDateTime endDate;
    private String startLocation;
    private String endLocation;
    private Long agencyId;
    private String schedule;
}
