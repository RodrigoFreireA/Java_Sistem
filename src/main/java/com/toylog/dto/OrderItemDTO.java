package com.toylog.dto;

import java.math.BigDecimal;
import java.util.UUID;

public class OrderItemDTO {
    public UUID productId;
    public String productName;
    public Integer quantity;
    public BigDecimal unitPrice;
}
