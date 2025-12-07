-- Seed catalog with 9 brinquedos (idempotente)
INSERT INTO tb_products (sku, name, description, cost_price, sale_price, stock_quantity, min_stock_level, category)
VALUES
('BRQ-001', 'Toboga Aquatico Tropical', 'Toboga inflavel com piscina pequena.', 300.00, 550.00, 3, 1, 'Brinquedos Aquaticos'),
('BRQ-002', 'Castelo Pula-Pula Gigante', 'Castelo inflavel colorido para festas.', 250.00, 520.00, 4, 1, 'Diversao'),
('BRQ-003', 'Cama Elastica com Rede', 'Cama elastica com rede de protecao.', 200.00, 400.00, 5, 2, 'Cama Elastica'),
('BRQ-004', 'Piscina de Bolinhas Gigante', 'Piscina de bolinhas de 4x4.', 180.00, 450.00, 2, 1, 'Diversao'),
('BRQ-005', 'Toboga Duplo Aquatico', 'Toboga duplo com area molhada.', 320.00, 620.00, 3, 1, 'Brinquedos Aquaticos'),
('BRQ-006', 'Cama Elastica Profissional', 'Cama elastica maior, para uso intenso.', 260.00, 520.00, 4, 2, 'Cama Elastica'),
('BRQ-007', 'Castelo das Princesas', 'Castelo inflavel tematico.', 240.00, 540.00, 3, 1, 'Diversao'),
('BRQ-008', 'Pista de Obstaculos', 'Pista inflavel com varios desafios.', 350.00, 700.00, 2, 1, 'Aventura'),
('BRQ-009', 'Mega Water Slide', 'Escorregador aquatico grande.', 330.00, 650.00, 3, 1, 'Brinquedos Aquaticos')
ON CONFLICT (sku) DO NOTHING;
