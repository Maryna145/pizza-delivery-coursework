package com.pizza.app.repository;

import com.pizza.app.entity.Pizza;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PizzaRepository extends JpaRepository<Pizza, Long> {

    List<Pizza> findByAvailabilityTrue();

    @Query(value = "SELECT * FROM popular_pizzas", nativeQuery = true)
    List<PizzaStatProjection> findPopularPizzasFromDb();

}