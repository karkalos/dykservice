CREATE TABLE workshops (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  address VARCHAR(300) NOT NULL,
  city VARCHAR(100) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(200) NOT NULL,
  website VARCHAR(300),
  priority_surcharge_pct INT NOT NULL DEFAULT 50,
  emergency_surcharge_pct INT NOT NULL DEFAULT 100,
  warranty_years INT NOT NULL DEFAULT 1,
  accepts_wet_suits BOOLEAN NOT NULL DEFAULT false,
  accepts_viking_hd BOOLEAN NOT NULL DEFAULT false,
  has_mail_in BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE service_items (
  id VARCHAR(100) PRIMARY KEY,
  workshop_id VARCHAR(50) NOT NULL REFERENCES workshops(id),
  category VARCHAR(50) NOT NULL,
  name VARCHAR(200) NOT NULL,
  name_sv VARCHAR(200) NOT NULL,
  base_price INT NOT NULL,
  notes VARCHAR(500) DEFAULT '',
  in_stock BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_service_items_workshop ON service_items(workshop_id);
CREATE INDEX idx_service_items_category ON service_items(category);
