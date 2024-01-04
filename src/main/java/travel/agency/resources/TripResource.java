package travel.agency.resources;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TripResource {
    private Long tripId;
    private Integer availableCapacity;
    private Date startDate;
    private Date endDate;
    private String startLocation;
    private String endLocation;
    private Long agencyId;
    private String agencyName;
    private String schedule;
}
