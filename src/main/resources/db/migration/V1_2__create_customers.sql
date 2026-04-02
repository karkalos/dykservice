CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  email VARCHAR(200) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  street VARCHAR(300) DEFAULT '',
  postal_code VARCHAR(20) DEFAULT '',
  city VARCHAR(100) DEFAULT '',
  is_business BOOLEAN NOT NULL DEFAULT false,
  company VARCHAR(200),
  org_nr VARCHAR(20),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
