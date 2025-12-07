-- Users table for authentication/roles
CREATE TABLE IF NOT EXISTS tb_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(30) NOT NULL,
    name VARCHAR(200),
    phone VARCHAR(100),
    email VARCHAR(200),
    address_line VARCHAR(255),
    city VARCHAR(150),
    state VARCHAR(100),
    postal_code VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
