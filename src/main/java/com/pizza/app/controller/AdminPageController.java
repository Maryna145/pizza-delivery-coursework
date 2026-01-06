package com.pizza.app.controller;

import com.pizza.app.entity.Pizza;
import com.pizza.app.repository.OrderRepository;
import com.pizza.app.repository.PizzaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Controller
@RequiredArgsConstructor
public class AdminPageController {
    private final PizzaRepository pizzaRepository;
    private final OrderRepository orderRepository;
    @GetMapping("/admin-crud")
    public String adminPanel(Model model) {
        var pizzas = pizzaRepository.findAll();

        model.addAttribute("pizzaList", pizzas);
        return "admin-crud";
    }
    @GetMapping("/admin/add")
    public String addPage() {
        return "admin-add-dish";
    }
    @GetMapping("/admin/edit/{id}")
    public String editPage(@PathVariable Long id, Model model) {
        // Шукаємо піцу в базі
        Pizza pizza = pizzaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pizza not found"));

        // Кладемо її в модель, щоб HTML міг заповнити поля
        model.addAttribute("pizza", pizza);

        return "admin-edit";
    }
    @GetMapping("/admin/orders")
    public String adminOrders(Model model) {
        var orders = orderRepository.findAll();
        model.addAttribute("orders", orders);
        return "admin-orders";
    }
}
