package com.pizza.app.repository;

import com.pizza.app.entity.Pizza;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PizzaRepository extends JpaRepository<Pizza, Long> {
    // Показати клієнту тільки доступні піци (меню)
    List<Pizza> findByAvailabilityTrue();
}