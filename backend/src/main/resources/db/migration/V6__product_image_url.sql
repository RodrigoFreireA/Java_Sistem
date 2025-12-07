-- Add image_url to products
ALTER TABLE tb_products
    ADD COLUMN IF NOT EXISTS image_url VARCHAR(500);
