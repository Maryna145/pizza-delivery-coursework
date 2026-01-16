package com.pizza.app.controller;

import com.pizza.app.entity.Order;
import com.pizza.app.entity.Pizza;
import com.pizza.app.entity.User;
import com.pizza.app.repository.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


@Controller
@RequiredArgsConstructor
public class AdminPageController {

    private final PizzaRepository pizzaRepository;
    private final OrderRepository orderRepository;
    private final CarRepository carRepository;
    @Autowired
    private IngredientRepository ingredientRepository;
    @Autowired
    private final UserRepository userRepository;

    @GetMapping("/admin/ingredients")
    public String adminIngredients(Model model) {
        var ingredients = ingredientRepository.findAllByOrderByNameAsc();
        model.addAttribute("ingredients", ingredients);
        return "admin-ingredients"; // Зараз ми створимо цей файл
    }
    @GetMapping("/admin/recipes")
    public String adminRecipes(Model model) {
        // Беремо всі страви (включно з напоями, салатами)
        model.addAttribute("products", pizzaRepository.findAll());
        // Беремо всі інгредієнти (щоб було з чого складати рецепт)
        model.addAttribute("ingredients", ingredientRepository.findAll());
        return "admin-recipes";
    }
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
        Pizza pizza = pizzaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pizza not found"));
        model.addAttribute("pizza", pizza);
        return "admin-edit";
    }

    @GetMapping("/admin/orders")
    public String adminOrders(Model model) {
        var orders = orderRepository.findAll();
        var cars = carRepository.findAll();

        model.addAttribute("orders", orders);
        model.addAttribute("cars", cars);
        return "admin-orders";
    }


    @GetMapping("/admin/stats")
    public String adminStats(Model model) {
        // 1. Загальна кількість замовлень і сума (це можна залишити)
        List<Order> allOrders = orderRepository.findAll();
        BigDecimal totalMoney = allOrders.stream()
                .map(Order::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        List<PizzaStatProjection> topDishes = pizzaRepository.findPopularPizzasFromDb();

        model.addAttribute("totalOrders", allOrders.size());
        model.addAttribute("totalMoney", totalMoney);
        model.addAttribute("topDishes", topDishes);

        return "admin-stats";
    }
    @GetMapping("/admin/cars")
    public String adminCars(Model model) {
        var cars = carRepository.findAll();

        var drivers = userRepository.findByRole(User.Role.driver);

        model.addAttribute("cars", cars);
        model.addAttribute("drivers", drivers); // Передаємо список у HTML
        return "admin-cars";
    }
    @GetMapping("/admin/profile")
    public String adminProfile() {
        return "admin-profile";
    }
    @Data
    @AllArgsConstructor
    static class DishStat {
        private String name;
        private int count;
    }
}