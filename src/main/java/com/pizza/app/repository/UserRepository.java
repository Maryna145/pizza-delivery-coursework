package com.pizza.app.repository;

import com.pizza.app.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // Знайти користувача для входу в систему
    Optional<User> findByLogin(String login);
    // МАЄ БУТИ List, а не просто User
    List<User> findByRole(User.Role role);
}