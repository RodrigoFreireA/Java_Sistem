-- Add customer relation to bookings
ALTER TABLE tb_bookings
    ADD COLUMN IF NOT EXISTS customer_id UUID;

ALTER TABLE tb_bookings
    ADD CONSTRAINT fk_booking_customer FOREIGN KEY (customer_id) REFERENCES tb_users(id);
