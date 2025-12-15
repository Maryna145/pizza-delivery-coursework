package com.pizza.app.repository;

import com.pizza.app.entity.Recipe;
import com.pizza.app.entity.RecipeId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RecipeRepository extends JpaRepository<Recipe, RecipeId> {
    // Отримати список всіх інгредієнтів (рецепт) для конкретної піци
    List<Recipe> findByPizzaId(Long pizzaId);
}