package com.toylog.exception;

import java.time.Instant;

public class ApiError {
    public Instant timestamp = Instant.now();
    public int status;
    public String error;
    public String message;
    public String path;

    public ApiError status(int status) {
        this.status = status;
        return this;
    }
    public ApiError error(String error) {
        this.error = error;
        return this;
    }
    public ApiError message(String message) {
        this.message = message;
        return this;
    }
    public ApiError path(String path) {
        this.path = path;
        return this;
    }
}
