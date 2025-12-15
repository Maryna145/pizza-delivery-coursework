package com.pizza.app.repository;

import com.pizza.app.entity.Ingredient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IngredientRepository extends JpaRepository<Ingredient, Long> {
    // Використовуємо стандартні методи CRUD(поки ніяких додаткових)
}