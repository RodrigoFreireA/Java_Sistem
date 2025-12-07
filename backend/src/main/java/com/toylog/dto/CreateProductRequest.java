package com.toylog.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public class CreateProductRequest {

    @NotBlank
    public String sku;

    @NotBlank
    public String name;

    public String description;

    @NotNull
    @PositiveOrZero
    public BigDecimal costPrice;

    @NotNull
    @PositiveOrZero
    public BigDecimal salePrice;

    @NotNull
    @Min(0)
    public Integer stockQuantity = 0;

    @NotNull
    @Min(0)
    public Integer minStockLevel = 0;

    public String category;

    public String imageUrl; // opcional; preenchido automaticamente se houver upload
}
