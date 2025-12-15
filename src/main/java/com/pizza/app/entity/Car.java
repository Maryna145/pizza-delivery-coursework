package com.pizza.app.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "cars")
@Data
public class Car {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "car_id")
    private Long id;

    // Один водій може бути закріплений тільки за однією машиною
    @OneToOne
    @JoinColumn(name = "car_driver", unique = true)
    private User driver;

    @Column(name = "car_license_plate", unique = true, nullable = false)
    private String licensePlate;

    @Column(name = "car_model", nullable = false)
    private String model;

    // Статуси машини (вільна/зайнята)
    @Enumerated(EnumType.STRING)
    @Column(name = "car_status", nullable = false)
    private CarStatus status;

    public enum CarStatus {
        free, busy, at_repairs
    }
}