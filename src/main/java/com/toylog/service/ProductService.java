package com.toylog.service;

import com.toylog.domain.InventoryMovement;
import com.toylog.domain.Product;
import com.toylog.repository.InventoryMovementRepository;
import com.toylog.repository.ProductRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final InventoryMovementRepository movementRepository;

    public ProductService(ProductRepository productRepository, InventoryMovementRepository movementRepository) {
        this.productRepository = productRepository;
        this.movementRepository = movementRepository;
    }

    @Transactional
    public void decreaseStock(UUID productId, int quantity, String username) {
        Product product = productRepository.findByIdForUpdate(productId)
                .orElseThrow(() -> new EntityNotFoundException("Product not found: " + productId));

        if (quantity <= 0) throw new IllegalArgumentException("Quantity must be positive");

        if (product.getStockQuantity() < quantity) {
            throw new InsufficientStockException("Insufficient stock for product " + product.getSku());
        }

        int newQty = product.getStockQuantity() - quantity;
        product.setStockQuantity(newQty);
        productRepository.save(product);

        InventoryMovement movement = new InventoryMovement();
        movement.setProduct(product);
        movement.setQuantityChange(-quantity);
        movement.setType(InventoryMovement.MovementType.OUT);
        movement.setUsername(username);
        movementRepository.save(movement);
    }
}
