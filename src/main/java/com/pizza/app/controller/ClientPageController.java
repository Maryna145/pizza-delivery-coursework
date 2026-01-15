package com.pizza.app.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ClientPageController {

    @GetMapping("/promo")
    public String promoPage() {
        return "page-promo";
    }

    @GetMapping("/delivery")
    public String deliveryPage() {
        return "page-delivery";
    }

    @GetMapping("/about")
    public String aboutPage() {
        return "page-about";
    }

    @GetMapping("/privacy")
    public String privacyPage() {
        return "page-privacy";
    }
}