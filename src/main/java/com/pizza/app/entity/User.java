package com.pizza.app.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "users")
@Data
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id") // Зв'язок з колонкою user_id в таблиці
    private Long id;

    @Column(name = "user_login", unique = true, nullable = false)
    private String login;

    @Column(name = "user_password", nullable = false)
    private String password;

    //Зберігаємо роль як рядок, а не число
    @Enumerated(EnumType.STRING)
    @Column(name = "user_role", nullable = false)
    private Role role;

    @Column(name = "user_name")
    private String name;

    @Column(name = "user_phone")
    private String phone;

    @Column(name = "user_address")
    private String address;

    // Перелік можливих ролей у системі
    public enum Role {
        client, admin, driver
    }
}