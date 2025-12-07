-- Flyway migration: table for inventory movement audit log
CREATE TABLE IF NOT EXISTS tb_inventory_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL,
  quantity_change INTEGER NOT NULL,
  type VARCHAR(10) NOT NULL,
  username VARCHAR(150),
  moment TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT fk_prod_mov FOREIGN KEY (product_id) REFERENCES tb_products(id)
);
