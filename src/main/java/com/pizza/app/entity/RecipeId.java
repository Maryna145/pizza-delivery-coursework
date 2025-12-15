package com.pizza.app.entity;

import jakarta.persistence.Embeddable;
import lombok.Data;
import java.io.Serializable;

@Embeddable //Дозволяємо використовувати цей клас як складений ключ
@Data
public class RecipeId implements Serializable {
    private Long pizzaId;       // Частина ключа ID піци
    private Long ingredientId;  // Частина ключа ID інградієнта
}