package com.toylog.service;

import com.toylog.domain.InventoryMovement;
import com.toylog.domain.Product;
import com.toylog.repository.InventoryMovementRepository;
import com.toylog.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentMatchers;
import org.mockito.Mockito;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

class ProductServiceTest {

    private ProductRepository productRepository;
    private InventoryMovementRepository movementRepository;
    private ProductService productService;

    @BeforeEach
    void setup() {
        productRepository = Mockito.mock(ProductRepository.class);
        movementRepository = Mockito.mock(InventoryMovementRepository.class);
        productService = new ProductService(productRepository, movementRepository);
    }

    @Test
    void decreaseStock_shouldThrow_whenInsufficientStock() {
        UUID id = UUID.randomUUID();
        Product p = new Product();
        p.setId(id);
        p.setSku("SKU-1");
        p.setName("Toy");
        p.setStockQuantity(2);
        p.setCostPrice(BigDecimal.valueOf(10));
        p.setSalePrice(BigDecimal.valueOf(15));

        when(productRepository.findById(id)).thenReturn(Optional.of(p));

        assertThrows(InsufficientStockException.class, () -> productService.decreaseStock(id, 3, "vendedor"));

        verify(productRepository, never()).save(ArgumentMatchers.any(Product.class));
        verify(movementRepository, never()).save(ArgumentMatchers.any(InventoryMovement.class));
    }
}
