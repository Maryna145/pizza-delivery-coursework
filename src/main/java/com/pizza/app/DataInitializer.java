package com.pizza.app;

import com.pizza.app.entity.Car;
import com.pizza.app.entity.Pizza;
import com.pizza.app.entity.User;
import com.pizza.app.repository.CarRepository;
import com.pizza.app.repository.PizzaRepository;
import com.pizza.app.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;

@Component
public class DataInitializer implements CommandLineRunner {

    private final PizzaRepository pizzaRepository;
    private final UserRepository userRepository;
    private final CarRepository carRepository;

    public DataInitializer(PizzaRepository pizzaRepository, UserRepository userRepository, CarRepository carRepository) {
        this.pizzaRepository = pizzaRepository;
        this.userRepository = userRepository;
        this.carRepository = carRepository;
    }

    @Override
    public void run(String... args) throws Exception {

        //Створення адміна
        if (userRepository.findByLogin("admin").isEmpty()) {
            User admin = new User();
            admin.setName("Адмін-Дмитро");
            admin.setLogin("admin");
            admin.setPassword("admin");
            admin.setRole(User.Role.admin);
            admin.setPhone("0935746374");
            admin.setAddress("Київ, вул. Польова 21");
            userRepository.save(admin);
        }

        //Створення піц
        if (pizzaRepository.count() == 0) {
            Pizza p1 = new Pizza();
            p1.setName("Пепероні");
            p1.setDescription("Моцарела, подвійна порція пепероні, томатний соус");
            p1.setPrice(new BigDecimal("210"));
            p1.setCategory("pizza");
            p1.setImageUrl("https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80");
            pizzaRepository.save(p1);

            Pizza p2 = new Pizza();
            p2.setName("Чотири сири");
            p2.setDescription("Моцарела, пармезан, дорблю, чеддер, вершковий соус");
            p2.setPrice(new BigDecimal("245"));
            p2.setCategory("pizza");
            p2.setImageUrl("https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80");
            pizzaRepository.save(p2);

            Pizza p3 = new Pizza();
            p3.setName("М'ясна");
            p3.setDescription("Бекон, шинка, курка, мисливські ковбаски");
            p3.setPrice(new BigDecimal("280"));
            p3.setCategory("pizza");
            p3.setImageUrl("https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80");
            pizzaRepository.save(p3);
        }

        //Створення машин та водія
        if (carRepository.count() == 0) {

            // Спочатку створюємо користувача-водія
            User driver = new User();
            if (userRepository.findByLogin("driver1").isEmpty()) {
                driver.setName("Іван-Водій");
                driver.setLogin("driver1");
                driver.setPassword("1234");
                driver.setRole(User.Role.driver);
                driver.setPhone("099-000-00-00");
                driver.setAddress("Автопарк");
                userRepository.save(driver);
            } else {
                driver = userRepository.findByLogin("driver1").get();
            }
            User driver2 = new User();
            if (userRepository.findByLogin("driver2").isEmpty()) {
                driver2.setName(" Петро-Водій");
                driver2.setLogin("driver2");
                driver2.setPassword("1234");
                driver2.setRole(User.Role.driver);
                driver2.setPhone("099-000-00-00");
                driver2.setAddress("Автопарк");
                userRepository.save(driver2);
            } else {
                driver2 = userRepository.findByLogin("driver2").get();
            }

            // Машина 1 (Вільна, з водієм)
            Car car1 = new Car();
            car1.setModel("Daewoo Lanos");
            car1.setLicensePlate("AA 1111 AA");
            car1.setStatus(Car.CarStatus.free);
            car1.setDriver(driver);
            carRepository.save(car1);

            // Машина 2 (Зайнята, без водія поки що)
            Car car2 = new Car();
            car2.setModel("Renault Logan");
            car2.setLicensePlate("KA 2222 BB");
            car2.setStatus(Car.CarStatus.busy);
            // driver = null
            carRepository.save(car2);

            // Машина 3 (Ремонт)
            Car car3 = new Car();
            car3.setModel("Ford Transit");
            car3.setLicensePlate("AI 3333 CC");
            car3.setStatus(Car.CarStatus.at_repairs);
            carRepository.save(car3);
        }
    }
}