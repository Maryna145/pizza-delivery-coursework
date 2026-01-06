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

    @GetMapping("/")
    public String home(Model model) {
        var pizzas = pizzaRepository.findAll();
        model.addAttribute("pizzaList", pizzas);
        return "client-menu";
    }

    @GetMapping("/cart")
    public String cartPage() {
        return "cart";
    }

    @GetMapping("/login")
    public String loginPage() {
        return "login";
    }

    @GetMapping("/register")
    public String registerPage() {
        return "register";
    }

}