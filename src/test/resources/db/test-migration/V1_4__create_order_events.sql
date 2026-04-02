CREATE TABLE order_events (
  id UUID DEFAULT random_uuid() PRIMARY KEY,
  order_id VARCHAR(20) NOT NULL REFERENCES service_orders(id),
  status VARCHAR(20) NOT NULL,
  message TEXT NOT NULL DEFAULT '',
  created_by VARCHAR(50) NOT NULL DEFAULT 'system',
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_events_order ON order_events(order_id);
