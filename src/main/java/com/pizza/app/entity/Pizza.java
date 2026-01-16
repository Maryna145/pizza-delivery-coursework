package com.pizza.app.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Entity
@Table(name = "pizzas")
@Data
public class Pizza {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "pizza_id")
    private Long id;

    @Column(name = "pizza_name", unique = true, nullable = false)
    private String name;
    @Column(name = "category", nullable = false)
    private String category;
    @Column(name = "pizza_description")
    private String description;

    @Column(name = "pizza_price", nullable = false)
    private BigDecimal price;

    @Column(name = "pizza_image_url", length = 2048)
    private String imageUrl;

    @Column(name = "pizza_availability")
    private Boolean availability = true;
    @OneToMany(mappedBy = "pizza", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<Recipe> recipes;
    public List<String> getIngredientNames() {
        if (recipes == null) return new ArrayList<>();

        return recipes.stream()
                .map(recipe -> recipe.getIngredient().getName()) // Беремо ім'я інгредієнта
                .collect(Collectors.toList());
    }
}