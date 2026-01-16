package com.pizza.app.controller;

import com.pizza.app.entity.Ingredient;
import com.pizza.app.repository.IngredientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ingredients")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class IngredientController {

    private final IngredientRepository ingredientRepository;
    @GetMapping
    public List<Ingredient> getAllIngredients() {
        return ingredientRepository.findAllByOrderByNameAsc();
    }

    @PostMapping
    public Ingredient addIngredient(@RequestBody Ingredient ingredient) {
        return ingredientRepository.save(ingredient);
    }
    @PutMapping("/{id}")
    public Ingredient updateIngredient(@PathVariable Long id, @RequestBody Ingredient ingredient) {
        // логіка оновлення
        return ingredientRepository.findById(id)
                .map(existing -> {
                    existing.setName(ingredient.getName());
                    existing.setCurrentStock(ingredient.getCurrentStock());
                    existing.setUnitOfMeasure(ingredient.getUnitOfMeasure());
                    return ingredientRepository.save(existing);
                })
                .orElseThrow(() -> new RuntimeException("Ingredient not found"));
    }

}