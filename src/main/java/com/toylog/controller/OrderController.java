package com.toylog.controller;

import com.toylog.domain.Order;
import com.toylog.dto.CreateOrderRequest;
import com.toylog.dto.OrderDTO;
import com.toylog.dto.OrderItemDTO;
import com.toylog.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<OrderDTO> createOrder(@Valid @RequestBody CreateOrderRequest req) {
        Order saved = orderService.createOrder(req);
        OrderDTO dto = toDTO(saved);
        return ResponseEntity.created(URI.create("/api/orders/" + saved.getId())).body(dto);
    }

    private OrderDTO toDTO(Order order) {
        OrderDTO dto = new OrderDTO();
        dto.id = order.getId();
        dto.moment = order.getMoment();
        dto.status = order.getStatus();
        dto.total = order.getTotal();
        dto.items = order.getItems().stream().map(i -> {
            OrderItemDTO it = new OrderItemDTO();
            it.productId = i.getProduct().getId();
            it.productName = i.getProduct().getName();
            it.quantity = i.getQuantity();
            it.unitPrice = i.getUnitPrice();
            return it;
        }).collect(Collectors.toList());
        return dto;
    }
}
