-- Flyway migration: initial schema for ToyLog
-- Enable UUID generation (pgcrypto) if available
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS tb_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  cost_price NUMERIC(14,2) NOT NULL,
  sale_price NUMERIC(14,2) NOT NULL,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  min_stock_level INTEGER NOT NULL DEFAULT 0,
  category VARCHAR(100),
  version BIGINT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS tb_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  moment TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status VARCHAR(30) NOT NULL,
  total NUMERIC(14,2)
);

CREATE TABLE IF NOT EXISTS tb_order_items (
  order_id UUID NOT NULL,
  product_id UUID NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price NUMERIC(14,2) NOT NULL,
  PRIMARY KEY (order_id, product_id),
  CONSTRAINT fk_order FOREIGN KEY (order_id) REFERENCES tb_orders(id) ON DELETE CASCADE,
  CONSTRAINT fk_product FOREIGN KEY (product_id) REFERENCES tb_products(id)
);
