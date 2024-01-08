package travel.agency.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "Trip")
@Entity
public class Trip {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(name = "startDate")
    private Date startDate;

    @Column(name = "endDate")
    private Date endDate;

    @Column(name = "startLocation")
    private String startLocation;

    @Column(name = "endLocation")
    private String endLocation;

    @Column(name = "schedule")
    private String schedule;

    @Column(name = "availableCapacity")
    private Integer availableCapacity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "agency_id", nullable = false)
    private Agency agency;

    @OneToMany(mappedBy = "trip")
    private List<ClientBooking> clientBookings = new ArrayList<>();

    public void addClientBooking(ClientBooking clientBooking) {
        clientBookings.add(clientBooking);
        clientBooking.setTrip(this);
    }

    public boolean hasValidCapacity() {
        return this.getAvailableCapacity() != 0;
    }

    public void decrementAvailableCapacity() {
        this.availableCapacity--;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Trip that)) return false;
        return id.equals(that.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
