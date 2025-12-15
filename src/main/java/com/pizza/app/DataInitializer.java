package com.pizza.app;

import com.pizza.app.entity.Pizza;
import com.pizza.app.repository.PizzaRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;

@Component
public class DataInitializer implements CommandLineRunner {

    private final PizzaRepository pizzaRepository;

    public DataInitializer(PizzaRepository pizzaRepository) {
        this.pizzaRepository = pizzaRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        // Перевіряємо, чи база порожня, щоб не дублювати піци при кожному перезапуску
        if (pizzaRepository.count() == 0) {

            Pizza p1 = new Pizza();
            p1.setName("Пепероні");
            p1.setDescription("Моцарела, подвійна порція пепероні, томатний соус");
            p1.setPrice(new BigDecimal("210"));
            p1.setImageUrl("https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80");
            pizzaRepository.save(p1);

            Pizza p2 = new Pizza();
            p2.setName("Чотири сири");
            p2.setDescription("Моцарела, пармезан, дорблю, чеддер, вершковий соус");
            p2.setPrice(new BigDecimal("245"));
            p2.setImageUrl("https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80");
            pizzaRepository.save(p2);

            Pizza p3 = new Pizza();
            p3.setName("М'ясна");
            p3.setDescription("Бекон, шинка, курка, мисливські ковбаски");
            p3.setPrice(new BigDecimal("280"));
            p3.setImageUrl("https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80");
            pizzaRepository.save(p3);

        }
    }
}