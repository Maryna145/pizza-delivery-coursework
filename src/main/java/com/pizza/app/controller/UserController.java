package com.pizza.app.controller;

import com.pizza.app.entity.User;
import com.pizza.app.repository.UserRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Дозволяє фронтенду (на іншому порту) робити запити сюди
public class UserController {

    private final UserRepository userRepository;

    @PostMapping("/register")
    public User registerUser(@RequestBody User user) {
        return userRepository.save(user);
    }

    @PostMapping("/login")
    public User login(@RequestBody LoginRequest loginRequest) {
        User user = userRepository.findByLogin(loginRequest.getLogin())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getPassword().equals(loginRequest.getPassword())) {
            throw new RuntimeException("Wrong password");
        }
        return user;
    }
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody UserUpdateRequest request) {
        try {
            User user = userRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Користувача не знайдено"));

            // Оновлюємо основні поля
            user.setName(request.getName());
            user.setPhone(request.getPhone());
            user.setAddress(request.getAddress());

            // Оновлюємо пароль ТІЛЬКИ якщо він прийшов не пустий
            if (request.getPassword() != null && !request.getPassword().trim().isEmpty()) {
                user.setPassword(request.getPassword());
            }

            User updatedUser = userRepository.save(user);
            return ResponseEntity.ok(updatedUser);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Помилка оновлення: " + e.getMessage());
        }
    }
    @Data
    public static class LoginRequest {
        private String login;
        private String password;
    }
    @Data
    public static class UserUpdateRequest {
        private String name;
        private String phone;
        private String address;
        private String password;
    }
}