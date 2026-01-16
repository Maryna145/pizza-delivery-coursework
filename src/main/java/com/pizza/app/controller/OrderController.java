package com.pizza.app.controller;

import com.pizza.app.entity.*;
import com.pizza.app.repository.*;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class OrderController {
    @Autowired // Переконайтесь, що CarRepository підключено
    private CarRepository carRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final PizzaRepository pizzaRepository;

    @GetMapping
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody OrderRequest request) {
        Order order = new Order();
        if (request.getDeliveryTime() != null) {
            LocalDate date = request.getDeliveryTime().toLocalDate();
            LocalTime time = request.getDeliveryTime().toLocalTime();

            boolean isTaken = orderRepository.existsByDateAndDeliveryTime(date, time);

            if (isTaken) {
                return ResponseEntity.badRequest()
                        .body("Вибачте, час " + time + " вже зайнятий! Будь ласка, оберіть інший.");
            }
            order.setDate(date);
            order.setDeliveryTime(time);
        }

        if (request.getClientId() != null && request.getClientId() > 0) {
            userRepository.findById(request.getClientId()).ifPresent(order::setClient);
        }

// Ім'я та телефон встановлюємо завжди (або з профілю, або з форми гостя)
        order.setGuestName(request.getFullName());
        order.setGuestPhone(request.getPhone());


        String fullAddress = String.format("м. %s, вул. %s, буд. %s, кв. %s",
                request.getCity(), request.getStreet(), request.getHouse(), request.getApartment());
        order.setDeliveryAddress(fullAddress);
        order.setPaymentMethod(request.getPaymentMethod());
        order.setStatus(Order.OrderStatus.new_order);
        List<BigDecimal> prices = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;
        StringBuilder itemsDescription = new StringBuilder();

        for (Long pizzaId : request.getPizzaIds()) {
            Pizza pizza = pizzaRepository.findById(pizzaId).orElseThrow();
            prices.add(pizza.getPrice());
            total = total.add(pizza.getPrice());
            itemsDescription.append(pizza.getName()).append(", ");
        }
        if (prices.size() >= 11) {
            BigDecimal minPrice = prices.stream().min(BigDecimal::compareTo).orElse(BigDecimal.ZERO);
            total = total.subtract(minPrice);
        }

        order.setTotalAmount(total);
        order.setItems(itemsDescription.toString());
        Order savedOrder = orderRepository.save(order);
        System.out.println("\n НОВЕ ЗАМОВЛЕННЯ #" + savedOrder.getId());
        System.out.println("Клієнт: " + savedOrder.getGuestName());
        System.out.println("Сума: " + savedOrder.getTotalAmount() + " грн");
        System.out.println("Час доставки: " + savedOrder.getDeliveryTime());
        System.out.println("------------------------------------------------\n");

        return ResponseEntity.ok(savedOrder);
    }

    @GetMapping("/user/{clientId}")
    public List<Order> getOrdersByUser(@PathVariable Long clientId) {
        return orderRepository.findByClientIdOrderByDateDesc(clientId);
    }
    // 1. ПРИЗНАЧЕННЯ МАШИНИ (З перевірками та авто-статусом)
    @PatchMapping("/{id}/assign-car")
    public ResponseEntity<?> assignCar(@PathVariable Long id, @RequestParam(required = false) Long carId) {
        try {
            Order order = orderRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Замовлення не знайдено"));

            // А. Якщо у замовлення ВЖЕ була інша машина, звільняємо її
            if (order.getCar() != null) {
                Car oldCar = order.getCar();
                oldCar.setStatus(Car.CarStatus.free);
                carRepository.save(oldCar);
            }

            // Б. Якщо ми призначаємо нову машину
            if (carId != null) {
                Car newCar = carRepository.findById(carId)
                        .orElseThrow(() -> new RuntimeException("Машину не знайдено"));

                // ГОЛОВНА ПЕРЕВІРКА: Чи вільна машина?
                // Дозволяємо призначити, тільки якщо вона free, АБО якщо це та сама машина (випадковий клік)
                if (newCar.getStatus() != Car.CarStatus.free && !newCar.getId().equals(order.getCar() != null ? order.getCar().getId() : -1)) {
                    return ResponseEntity.badRequest().body("Ця машина зараз зайнята або в ремонті!");
                }

                // Ставимо статус ЗАЙНЯТА
                newCar.setStatus(Car.CarStatus.busy);
                carRepository.save(newCar);

                order.setCar(newCar);
            } else {
                // Якщо вибрали "Не призначено" (зняли машину)
                order.setCar(null);
            }

            orderRepository.save(order);
            return ResponseEntity.ok("Машину призначено, статус оновлено");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Помилка: " + e.getMessage());
        }
    }

    // 2. ЗМІНА СТАТУСУ ЗАМОВЛЕННЯ (Авто-звільнення машини)
    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestParam String status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        try {
            Order.OrderStatus newStatus = Order.OrderStatus.valueOf(status);
            order.setStatus(newStatus);

            // АВТОМАТИКА: Якщо замовлення "Доставлено", звільняємо машину
            if (Order.OrderStatus.valueOf(status) == Order.OrderStatus.delivered) {
                // Замість простого save, викликаємо процедуру бази даних!
                orderRepository.callFinishOrder(id);
                return ResponseEntity.ok("Замовлення завершено процедурою БД!");
            }

            orderRepository.save(order);
            return ResponseEntity.ok("Статус оновлено");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Невірний статус");
        }
    }
    @Data
    public static class OrderRequest {
        private Long clientId;
        private List<Long> pizzaIds;
        private String fullName;
        private String phone;
        private String city;
        private String street;
        private String house;
        private String apartment;
        private String paymentMethod;
        private LocalDateTime deliveryTime;
    }
}