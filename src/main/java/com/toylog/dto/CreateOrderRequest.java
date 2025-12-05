package com.toylog.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public class CreateOrderRequest {

    @NotEmpty
    public List<@NotNull OrderItemRequest> items;

    public String username; // vendedor que realiza a venda
}
