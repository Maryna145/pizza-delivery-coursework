package com.pizza.app.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Entity
@Table(name = "orders")
@Data
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_id")
    private Long id;

    // Один клієнт може мати багато замовлень
    @ManyToOne
    @JoinColumn(name = "client_id", nullable = true)
    private User client;
    @Column(name = "guest_name")
    private String guestName;
    @Column(name = "guest_phone")
    private String guestPhone;
    @Column(name = "payment_method")
    private String paymentMethod;
    // Одна машина може везти багато замовлень
    @ManyToOne
    @JoinColumn(name = "car_id")
    private Car car;

    @Column(name = "order_date")
    private LocalDate date = LocalDate.now(); // За замовчуванням - поточна дата

    @Column(name = "delivery_time")
    private LocalTime deliveryTime;

    @Column(name = "delivery_address", nullable = false)
    private String deliveryAddress;

    @Column(name = "total_amount")
    private BigDecimal totalAmount = BigDecimal.ZERO;

    // Тут автоматично працює OrderStatusConverter
    @Column(name = "order_status", nullable = true)
    private OrderStatus status;
    @Column(name = "order_items", length = 2000)
    private String items;
    public enum OrderStatus {
        new_order, being_cooked, being_delivered, delivered
    }
}