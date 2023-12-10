package com.travelagency.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.OffsetDateTime;
import java.util.ArrayList;
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
    private Long id;

    @Column(name = "startDate")
    private OffsetDateTime startDate;

    @Column(name = "endDate")
    private OffsetDateTime endDate;

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

    @OneToMany(mappedBy = "id.trip")
    private List<ClientBooking> clientBookings = new ArrayList<>();

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
