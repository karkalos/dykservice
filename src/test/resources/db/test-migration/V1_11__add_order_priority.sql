ALTER TABLE service_orders ADD COLUMN priority INT NOT NULL DEFAULT 0;
ALTER TABLE service_orders ADD COLUMN estimated_minutes INT;
