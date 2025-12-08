package com.toylog.dto;

import java.math.BigDecimal;
import java.util.UUID;

public class ProductDTO {
    public UUID id;
    public String sku;
    public String name;
    public String description;
    public BigDecimal costPrice;
    public BigDecimal salePrice;
    public Integer stockQuantity;
    public Integer minStockLevel;
    public String category;
    public String size;
    public String ageRange;
    public String galleryUrls;
    public String imageUrl;
}
