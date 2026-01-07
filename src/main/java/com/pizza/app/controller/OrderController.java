package com.pizza.app.controller;

import com.pizza.app.entity.*;
import com.pizza.app.repository.*;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class OrderController {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final PizzaRepository pizzaRepository;
    // На майбутнє знадобиться репозиторій для деталей замовлення, щоб зберігати історію
    // private final OrderDetailRepository orderDetailRepository;

    @GetMapping
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @PostMapping
    public Order createOrder(@RequestBody OrderRequest request) {
        Order order = new Order();

        // 1. Логіка Клієнт vs Гість
        if (request.getClientId() != null) {
            // Якщо прийшов ID - шукаємо в базі
            User client = userRepository.findById(request.getClientId()).orElse(null);
            order.setClient(client);
            // Якщо це клієнт, беремо ім'я та телефон з його профілю (або з форми, якщо хочеш оновити)
            if (client != null) {
                order.setGuestName(request.getFullName()); // Зберігаємо ім'я з форми замовлення
                order.setGuestPhone(request.getPhone());
            }
        } else {
            // Це ГІСТЬ. Записуємо дані напряму
            order.setGuestName(request.getFullName());
            order.setGuestPhone(request.getPhone());
        }

        // 2. Збираємо адресу в один рядок
        String fullAddress = String.format("м. %s, вул. %s, буд. %s, кв. %s",
                request.getCity(), request.getStreet(), request.getHouse(), request.getApartment());
        order.setDeliveryAddress(fullAddress);

        // 3. Інші поля
        order.setPaymentMethod(request.getPaymentMethod());
        order.setStatus(Order.OrderStatus.new_order);

        // 4. Рахуємо суму і формуємо список (як і раніше)
        List<BigDecimal> prices = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;
        StringBuilder itemsDescription = new StringBuilder();

        for (Long pizzaId : request.getPizzaIds()) {
            Pizza pizza = pizzaRepository.findById(pizzaId).orElseThrow();
            prices.add(pizza.getPrice());
            total = total.add(pizza.getPrice());
            itemsDescription.append(pizza.getName()).append(", ");
        }

        // Акція 10+1
        if (prices.size() >= 11) {
            BigDecimal minPrice = prices.stream().min(BigDecimal::compareTo).orElse(BigDecimal.ZERO);
            total = total.subtract(minPrice);
        }

        order.setTotalAmount(total);
        order.setItems(itemsDescription.toString());

        return orderRepository.save(order);
    }

    // Оновлений DTO для прийому даних з форми
    @Data
    public static class OrderRequest {
        private Long clientId; // Може бути null
        private List<Long> pizzaIds;

        // Нові поля з форми
        private String fullName;
        private String phone;
        private String city;
        private String street;
        private String house;
        private String apartment;
        private String paymentMethod;
        private LocalDateTime deliveryTime;
    }


    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestParam String status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        try {
            // Перетворюємо текст (наприклад "being_cooked") у Enum
            order.setStatus(Order.OrderStatus.valueOf(status));
            orderRepository.save(order);
            return ResponseEntity.ok("Статус оновлено");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Невірний статус");
        }
    }
    // Отримати всі замовлення конкретного клієнта
    @GetMapping("/user/{clientId}")
    public List<Order> getOrdersByUser(@PathVariable Long clientId) {
        return orderRepository.findByClientIdOrderByDateDesc(clientId);
    }
}