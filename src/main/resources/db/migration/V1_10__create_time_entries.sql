CREATE TABLE time_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id VARCHAR(20) NOT NULL REFERENCES service_orders(id),
  description TEXT NOT NULL DEFAULT '',
  minutes INT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_time_entries_order ON time_entries(order_id);
