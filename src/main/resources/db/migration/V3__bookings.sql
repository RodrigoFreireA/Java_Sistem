-- Flyway migration: booking table for toy reservations
CREATE TABLE IF NOT EXISTS tb_bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name VARCHAR(200) NOT NULL,
    phone VARCHAR(100) NOT NULL,
    email VARCHAR(200),
    event_date DATE NOT NULL,
    product_id UUID NOT NULL,
    notes TEXT,
    status VARCHAR(30) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    CONSTRAINT fk_booking_product FOREIGN KEY (product_id) REFERENCES tb_products(id)
);
