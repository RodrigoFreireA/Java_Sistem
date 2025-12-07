package com.toylog.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "tb_products")
public class Product {

    @Id
    private UUID id;

    @NotBlank
    @Column(nullable = false, unique = true)
    private String sku;

    @NotBlank
    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "text")
    private String description;

    @NotNull
    @PositiveOrZero
    @Column(name = "cost_price", nullable = false, precision = 14, scale = 2)
    private BigDecimal costPrice;

    @NotNull
    @PositiveOrZero
    @Column(name = "sale_price", nullable = false, precision = 14, scale = 2)
    private BigDecimal salePrice;

    @NotNull
    @Column(name = "stock_quantity", nullable = false)
    private Integer stockQuantity = 0;

    @NotNull
    @Column(name = "min_stock_level", nullable = false)
    private Integer minStockLevel = 0;

    private String category;

    @Version
    @Column(name = "version")
    private Long version;

    @Column(name = "image_url")
    private String imageUrl;

    public Product() {
        this.id = UUID.randomUUID();
    }

    @AssertTrue(message = "salePrice must be greater than or equal to costPrice")
    private boolean isSalePriceValid() {
        if (costPrice == null || salePrice == null) return true;
        return salePrice.compareTo(costPrice) >= 0;
    }

    // Getters and setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getSku() { return sku; }
    public void setSku(String sku) { this.sku = sku; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public BigDecimal getCostPrice() { return costPrice; }
    public void setCostPrice(BigDecimal costPrice) { this.costPrice = costPrice; }
    public BigDecimal getSalePrice() { return salePrice; }
    public void setSalePrice(BigDecimal salePrice) { this.salePrice = salePrice; }
    public Integer getStockQuantity() { return stockQuantity; }
    public void setStockQuantity(Integer stockQuantity) { this.stockQuantity = stockQuantity; }
    public Integer getMinStockLevel() { return minStockLevel; }
    public void setMinStockLevel(Integer minStockLevel) { this.minStockLevel = minStockLevel; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public Long getVersion() { return version; }
    public void setVersion(Long version) { this.version = version; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
}
