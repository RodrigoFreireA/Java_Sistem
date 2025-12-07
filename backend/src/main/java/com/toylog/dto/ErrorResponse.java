package com.toylog.dto;

import java.time.Instant;
import java.util.List;

public class ErrorResponse {
    public Instant timestamp = Instant.now();
    public int status;
    public String error;
    public String message;
    public String path;
    public List<String> errors;

    public ErrorResponse() {}

    public ErrorResponse(int status, String error, String message, String path) {
        this.status = status;
        this.error = error;
        this.message = message;
        this.path = path;
    }
}
