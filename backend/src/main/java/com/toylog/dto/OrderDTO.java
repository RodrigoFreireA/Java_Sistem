package com.toylog.dto;

import com.toylog.domain.OrderStatus;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public class OrderDTO {
    public UUID id;
    public Instant moment;
    public OrderStatus status;
    public BigDecimal total;
    public List<OrderItemDTO> items;
}
