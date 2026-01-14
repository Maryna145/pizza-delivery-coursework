package com.pizza.app.repository;

import com.pizza.app.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByClient_Id(Long clientId);
    List<Order> findByStatus(Order.OrderStatus status);
    List<Order> findByClientIdOrderByDateDesc(Long clientId);
    boolean existsByDateAndDeliveryTime(LocalDate date, LocalTime deliveryTime);
}