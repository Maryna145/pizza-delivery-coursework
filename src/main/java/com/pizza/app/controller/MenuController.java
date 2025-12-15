package com.pizza.app.controller;
import com.pizza.app.repository.PizzaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
@RequiredArgsConstructor
public class MenuController {

    private final PizzaRepository pizzaRepository;

    @GetMapping("/") // Це означає головна сторінка сайту (localhost:8080/)
    public String home(Model model) {
        // 1. Беремо всі піци з бази
        var pizzas = pizzaRepository.findAll();

        // 2. Кладемо їх у "коробку" (Model), яку віддамо HTML-сторінці.
        // Називаємо цю коробочку "pizzaList"
        model.addAttribute("pizzaList", pizzas);

        // 3. Відкриваємо файл index.html (який лежить в templates)
        return "index";
    }
}