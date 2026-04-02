CREATE TABLE inventory (
  id UUID DEFAULT random_uuid() PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  category VARCHAR(50) NOT NULL,
  sku VARCHAR(100),
  quantity INT NOT NULL DEFAULT 0,
  min_quantity INT NOT NULL DEFAULT 2,
  supplier VARCHAR(200),
  unit_cost INT,
  notes TEXT DEFAULT '',
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
