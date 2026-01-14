package com.pizza.app.controller;

import com.pizza.app.entity.*;
import com.pizza.app.repository.*;
import lombok.Data;
import lombok.RequiredArgsConstructor;
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

        if (request.getClientId() != null) {
            User client = userRepository.findById(request.getClientId()).orElse(null);
            order.setClient(client);
            if (client != null) {
                order.setGuestName(request.getFullName());
                order.setGuestPhone(request.getPhone());
            }
        } else {
            order.setGuestName(request.getFullName());
            order.setGuestPhone(request.getPhone());
        }

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

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestParam String status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        try {
            order.setStatus(Order.OrderStatus.valueOf(status));
            orderRepository.save(order);
            return ResponseEntity.ok("Статус оновлено");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Невірний статус");
        }
    }
    @GetMapping("/user/{clientId}")
    public List<Order> getOrdersByUser(@PathVariable Long clientId) {
        return orderRepository.findByClientIdOrderByDateDesc(clientId);
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