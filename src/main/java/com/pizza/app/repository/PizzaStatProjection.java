package com.pizza.app.repository;

public interface PizzaStatProjection {
    String getPizzaName();  // Spring автоматично перетворить pizza_name -> PizzaName
    Integer getTotalSold();
}
