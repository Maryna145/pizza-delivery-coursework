package com.pizza.app.repository;

import com.pizza.app.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    // Історія замовлень конкретного юзера
    List<Order> findByClient_Id(Long clientId);
    // Замовлення для кухні (new) або водіїв
    List<Order> findByStatus(Order.OrderStatus status);
    List<Order> findByClientIdOrderByDateDesc(Long clientId);
}