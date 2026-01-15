package com.pizza.app.repository;

import com.pizza.app.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByClient_Id(Long clientId);
    List<Order> findByStatus(Order.OrderStatus status);
    List<Order> findByClientIdOrderByDateDesc(Long clientId);
    boolean existsByDateAndDeliveryTime(LocalDate date, LocalTime deliveryTime);
    @Modifying
    @Transactional
    @Query(value = "CALL finish_order(:orderId)", nativeQuery = true)
    void callFinishOrder(@Param("orderId") Long orderId);
}