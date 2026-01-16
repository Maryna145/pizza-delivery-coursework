package com.pizza.app.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Entity
@Table(name = "recipes")
@Data
public class Recipe {

    // Використовуємо наш складений ключ
    @EmbeddedId
    private RecipeId id = new RecipeId();

    @ManyToOne // Багато рецептів можуть посилатися на одну піцу
    @MapsId("pizzaId") //Зв'язуємо поле pizzaId з цим об'єктом
    @JsonIgnoreProperties("recipes")
    @JoinColumn(name = "pizza_id")
    private Pizza pizza;

    @ManyToOne // Багато рецептів можуть використовувати один інгредієнт
    @MapsId("ingredientId") //Зв'язуємо поле ingredient_id з ключа з цим об'єктом
    @JoinColumn(name = "ingredient_id")
    private Ingredient ingredient;

    //Скільки інгредієнта йде на цю піцу
    // precision=10, scale=3 означає число вигляду 1234567.890
    @Column(name = "ingredient_amount", nullable = false, precision = 10, scale = 3)
    private BigDecimal amount;
}