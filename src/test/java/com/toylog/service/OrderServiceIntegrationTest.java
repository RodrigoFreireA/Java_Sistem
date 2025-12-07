package com.toylog.service;

import com.toylog.domain.InventoryMovement;
import com.toylog.domain.Product;
import com.toylog.dto.CreateOrderRequest;
import com.toylog.dto.OrderItemRequest;
import com.toylog.repository.InventoryMovementRepository;
import com.toylog.repository.ProductRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class OrderServiceIntegrationTest {

    @Autowired
    private OrderService orderService;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private InventoryMovementRepository movementRepository;

    @Test
    void createOrder_shouldDecreaseStockAndPersistTotal() {
        Product p = new Product();
        p.setSku("SKU-INT-1");
        p.setName("Toy");
        p.setCostPrice(new BigDecimal("10.00"));
        p.setSalePrice(new BigDecimal("100.00"));
        p.setStockQuantity(10);
        p.setMinStockLevel(2);
        productRepository.save(p);

        OrderItemRequest item = new OrderItemRequest();
        item.productId = p.getId();
        item.quantity = 3;

        CreateOrderRequest req = new CreateOrderRequest();
        req.items = List.of(item);
        req.username = "vendedor";

        var order = orderService.createOrder(req);

        Product updated = productRepository.findById(p.getId()).orElseThrow();
        assertEquals(7, updated.getStockQuantity());
        assertEquals(new BigDecimal("300.00"), order.getTotal());
        assertNotNull(order.getId());

        assertEquals(1, movementRepository.count());
        InventoryMovement movement = movementRepository.findAll().get(0);
        assertEquals(InventoryMovement.MovementType.OUT, movement.getType());
        assertEquals(-3, movement.getQuantityChange());
    }
}
