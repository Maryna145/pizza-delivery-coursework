package com.pizza.app.entity;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.util.stream.Stream;

@Converter(autoApply = true)
public class OrderStatusConverter implements AttributeConverter<Order.OrderStatus, String> {

    @Override
    public String convertToDatabaseColumn(Order.OrderStatus status) {
        if (status == null) {
            return null;
        }
        if (status == Order.OrderStatus.new_order) {
            return "new";
        }
        return status.name();
    }

    @Override
    public Order.OrderStatus convertToEntityAttribute(String dbData) {
        if (dbData == null) {
            return null;
        }
        if ("new".equals(dbData)) {
            return Order.OrderStatus.new_order;
        }
        return Stream.of(Order.OrderStatus.values())
                .filter(s -> s.name().equals(dbData))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Unknown status: " + dbData));
    }
}