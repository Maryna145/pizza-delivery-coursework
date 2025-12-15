package com.pizza.app.controller;

import com.pizza.app.entity.*;
import com.pizza.app.repository.*;
import lombok.Data;
import lombok.RequiredArgsConstructor;
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
        //Спочатку шукаємо клієнта в БД за ID
        //Якщо немає такого ID, кидаємо помилку "Client not found"
        User client = userRepository.findById(request.getClientId())
                .orElseThrow(() -> new RuntimeException("Client not found"));

        //Створюємо порожню сутність Order
        Order order = new Order();
        order.setClient(client);// Прив'язуємо замовлення до знайденого клієнта
        order.setDeliveryAddress(request.getAddress()); // Встановлюємо адресу доставки
        order.setStatus(Order.OrderStatus.new_order); // Ставимо статус "Нове", а саме в БД запишеться як "new"

        // Створюємо список, щоб зберігати ціну кожної піци окремо
        List<BigDecimal> prices = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO; //Змінна для загальної суми, починаємо з 0.00

        // Пробігаємось по списку ID піц, які прийшли з фронтенду
        for (Long pizzaId : request.getPizzaIds()) {
            Pizza pizza = pizzaRepository.findById(pizzaId).orElseThrow(); // Дістаємо реальну піцу з бази даних, щоб дізнатися її актуальну ціну
            prices.add(pizza.getPrice()); // Додаємо ціну цієї піци в список
            total = total.add(pizza.getPrice()); // Додаємо ціну до загального чеку
        }
        // Реалізація акції: "10 піц купуєш - 11-та (найдешевша) безкоштовно"
        if (prices.size() >= 11) {
            // Знаходимо мінімальну ціну серед усіх замовлених піц
            BigDecimal minPrice = prices.stream()
                    .min(BigDecimal::compareTo) // Порівнюємо ціни
                    .orElse(BigDecimal.ZERO); // Якщо раптом список пустий
            //Віднімаємо вартість найдешевшої піци від загальної суми
            total = total.subtract(minPrice);
            // Виводимо в консоль повідомлення, для перевірки
            System.out.println("Акція спрацювала! Знижка: " + minPrice);
        }
        order.setTotalAmount(total); // Записуємо фінальну суму в замовлення
        return orderRepository.save(order); // Зберігаємо замовлення в БД і повертаємо результат
    }
    @Data
    public static class OrderRequest {
        private Long clientId;
        private String address;
        private List<Long> pizzaIds;
    }
}