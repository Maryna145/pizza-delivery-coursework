package com.pizza.app.repository;

import com.pizza.app.entity.Car;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CarRepository extends JpaRepository<Car, Long> {
    // Шукаємо вільні машини для призначення на рейс
    List<Car> findByStatus(Car.CarStatus status);
}