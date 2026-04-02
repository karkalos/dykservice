CREATE TABLE invoices (
  id UUID DEFAULT random_uuid() PRIMARY KEY,
  order_id VARCHAR(20) NOT NULL REFERENCES service_orders(id),
  invoice_number VARCHAR(20) NOT NULL UNIQUE,
  customer_name VARCHAR(200) NOT NULL,
  customer_email VARCHAR(200) NOT NULL,
  customer_address TEXT,
  items TEXT NOT NULL,
  subtotal INT NOT NULL,
  vat_rate INT NOT NULL DEFAULT 25,
  vat_amount INT NOT NULL,
  total INT NOT NULL,
  payment_method VARCHAR(20) NOT NULL DEFAULT 'swish',
  payment_status VARCHAR(20) NOT NULL DEFAULT 'unpaid',
  due_date DATE,
  paid_at TIMESTAMP,
  notes TEXT DEFAULT '',
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_invoices_order ON invoices(order_id);
CREATE INDEX idx_invoices_payment_status ON invoices(payment_status);
