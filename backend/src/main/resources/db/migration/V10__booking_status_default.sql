-- Ensure status has default value and existing rows are set to PENDING
ALTER TABLE tb_bookings ALTER COLUMN status SET DEFAULT 'PENDING';
UPDATE tb_bookings SET status = 'PENDING' WHERE status IS NULL;
