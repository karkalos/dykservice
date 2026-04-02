ALTER TABLE service_orders ADD COLUMN diagnosis_findings TEXT;
ALTER TABLE service_orders ADD COLUMN diagnosis_items TEXT;
ALTER TABLE service_orders ADD COLUMN diagnosis_price INT;
ALTER TABLE service_orders ADD COLUMN diagnosis_approved BOOLEAN DEFAULT false;
