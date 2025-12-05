package com.toylog.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "tb_inventory_movements")
public class InventoryMovement {

    @Id
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @NotNull
    private Integer quantityChange;

    @NotNull
    @Enumerated(EnumType.STRING)
    private MovementType type;

    private String username;

    private Instant moment;

    public InventoryMovement() {
        this.id = UUID.randomUUID();
        this.moment = Instant.now();
    }

    public enum MovementType {IN, OUT}

    // Getters and setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }
    public Integer getQuantityChange() { return quantityChange; }
    public void setQuantityChange(Integer quantityChange) { this.quantityChange = quantityChange; }
    public MovementType getType() { return type; }
    public void setType(MovementType type) { this.type = type; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public Instant getMoment() { return moment; }
    public void setMoment(Instant moment) { this.moment = moment; }
}
