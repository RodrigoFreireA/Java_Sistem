package com.toylog.service;

public class InsufficientStockException extends RuntimeException {
    public InsufficientStockException() { super(); }
    public InsufficientStockException(String message) { super(message); }
}
