package com.pizza.app.controller;

import com.pizza.app.entity.*;
import com.pizza.app.repository.*;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
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
        User client = userRepository.findById(request.getClientId())
                .orElseThrow(() -> new RuntimeException("Client not found"));

        Order order = new Order();
        order.setClient(client);
        order.setDeliveryAddress(request.getAddress());
        order.setStatus(Order.OrderStatus.new_order);

        List<BigDecimal> prices = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;

        // --- НОВЕ: Будуємо рядок з назвами піц ---
        StringBuilder itemsDescription = new StringBuilder();

        for (Long pizzaId : request.getPizzaIds()) {
            Pizza pizza = pizzaRepository.findById(pizzaId).orElseThrow();

            prices.add(pizza.getPrice());
            total = total.add(pizza.getPrice());

            // Додаємо назву в чек (наприклад: "Маргарита, ")
            itemsDescription.append(pizza.getName()).append(", ");
        }

        // Логіка акції (залишаємо як було)
        if (prices.size() >= 11) {
            BigDecimal minPrice = prices.stream().min(BigDecimal::compareTo).orElse(BigDecimal.ZERO);
            total = total.subtract(minPrice);
        }

        order.setTotalAmount(total);
        // Зберігаємо список піц текстом
        order.setItems(itemsDescription.toString());

        return orderRepository.save(order);
    }
    @Data
    public static class OrderRequest {
        private Long clientId;
        private String address;
        private List<Long> pizzaIds;
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
}