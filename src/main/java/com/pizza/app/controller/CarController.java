package com.pizza.app.controller;

import com.pizza.app.entity.Car;
import com.pizza.app.repository.CarRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cars")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Дозволяє фронтенду (на іншому порту) робити запити сюди
public class CarController {

    private final CarRepository carRepository;

    @GetMapping
    public List<Car> getAllCars() {
        return carRepository.findAll();
    }

    @GetMapping("/available")
    public List<Car> getAvailableCars() {
        return carRepository.findByStatus(Car.CarStatus.free);
    }

    @PutMapping("/{id}/status")
    public Car updateCarStatus(@PathVariable Long id, @RequestParam Car.CarStatus status) {
        Car car = carRepository.findById(id).orElseThrow();
        car.setStatus(status);
        return carRepository.save(car);
    }
}