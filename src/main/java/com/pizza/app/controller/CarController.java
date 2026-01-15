package com.pizza.app.controller;

import com.pizza.app.entity.Car;
import com.pizza.app.entity.User;
import com.pizza.app.repository.CarRepository;
import com.pizza.app.repository.UserRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;


@RestController
@RequestMapping("/api/cars")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CarController {

    private final CarRepository carRepository;
    private final UserRepository userRepository;

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
    @PostMapping
    public ResponseEntity<?> addCar(@RequestBody CarRequest request) {
        try {
            Car car = new Car();
            car.setModel(request.getModel());
            car.setLicensePlate(request.getLicensePlate());
            car.setStatus(Car.CarStatus.free);
            if (request.getDriverLogin() != null && !request.getDriverLogin().isEmpty()) {
                User driver = userRepository.findByLogin(request.getDriverLogin())
                        .orElseThrow(() -> new RuntimeException("Водія з таким логіном не знайдено"));
                car.setDriver(driver);
            }
            carRepository.save(car);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Помилка: " + e.getMessage());
        }
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCar(@PathVariable Long id) {
        try {
            carRepository.deleteById(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Не вдалося видалити: " + e.getMessage());
        }
    }
    @PutMapping("/{id}")
    public ResponseEntity<?> updateCar(@PathVariable Long id, @RequestBody CarRequest request) {
        try {
            Car car = carRepository.findById(id).orElseThrow(() -> new RuntimeException("Car not found"));

            car.setModel(request.getModel());
            car.setLicensePlate(request.getLicensePlate());

            // Оновлюємо водія, якщо передали нового
            if (request.getDriverLogin() != null && !request.getDriverLogin().isEmpty()) {
                User driver = userRepository.findByLogin(request.getDriverLogin())
                        .orElseThrow(() -> new RuntimeException("Водія не знайдено"));
                car.setDriver(driver);
            }

            carRepository.save(car);
            return ResponseEntity.ok("Машину оновлено");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Помилка: " + e.getMessage());
        }
    }

    // ЗМІНА СТАТУСУ (Вже має бути, але перевірте)
    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateCarStatus(@PathVariable Long id, @RequestParam String status) {
        Car car = carRepository.findById(id).orElseThrow();
        try {
            car.setStatus(Car.CarStatus.valueOf(status));
            carRepository.save(car);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Невірний статус");
        }
    }
    @Data
    static class CarRequest {
        private String model;
        private String licensePlate;
        private String driverLogin;
    }
}