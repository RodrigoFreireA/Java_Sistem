package com.toylog.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public class OrderItemRequest {
    @NotNull
    public UUID productId;

    @NotNull
    @Min(1)
    public Integer quantity;
}
