CREATE TABLE service_orders (
  id VARCHAR(20) PRIMARY KEY,
  workshop_id VARCHAR(50) NOT NULL REFERENCES workshops(id),
  customer_id UUID NOT NULL REFERENCES customers(id),
  booking_type VARCHAR(20) NOT NULL DEFAULT 'drop_in',
  status VARCHAR(20) NOT NULL DEFAULT 'created',
  suit_type VARCHAR(50) NOT NULL,
  suit_brand VARCHAR(100) NOT NULL,
  items TEXT NOT NULL DEFAULT '[]',
  urgency VARCHAR(20) NOT NULL DEFAULT 'standard',
  estimated_price INT NOT NULL DEFAULT 0,
  final_price INT,
  notes TEXT DEFAULT '',
  payment_method VARCHAR(20) NOT NULL DEFAULT 'swish',
  payment_status VARCHAR(20) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_orders_workshop ON service_orders(workshop_id);
CREATE INDEX idx_orders_status ON service_orders(status);
