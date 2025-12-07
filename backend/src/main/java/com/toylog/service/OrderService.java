package com.toylog.service;

import com.toylog.domain.*;
import com.toylog.dto.CreateOrderRequest;
import com.toylog.dto.OrderItemRequest;
import com.toylog.repository.OrderRepository;
import com.toylog.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final ProductService productService;

    public OrderService(OrderRepository orderRepository, ProductRepository productRepository, ProductService productService) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.productService = productService;
    }

    @Transactional
    public Order createOrder(CreateOrderRequest req) {
        Order order = new Order();

        for (OrderItemRequest itemReq : req.items) {
            UUID productId = itemReq.productId;
            int qty = itemReq.quantity;

            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new IllegalArgumentException("Product not found: " + productId));

            if (product.getStockQuantity() < qty) {
                throw new InsufficientStockException("Insufficient stock for product " + product.getSku());
            }

            OrderItem orderItem = new OrderItem(order, product, qty, product.getSalePrice());
            order.getItems().add(orderItem);

            // decrease stock and record movement via ProductService
            productService.decreaseStock(productId, qty, req.username == null ? "system" : req.username);
        }

        order.setTotal(order.calculateTotal());
        return orderRepository.save(order);
    }
}
