CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS owners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  rut VARCHAR(12) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  phone VARCHAR(20),
  password_hash TEXT NOT NULL,
  plan VARCHAR(20) DEFAULT 'basic',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID REFERENCES owners(id) ON DELETE CASCADE,
  address TEXT NOT NULL,
  commune VARCHAR(80) NOT NULL,
  region VARCHAR(80) DEFAULT 'Región Metropolitana',
  property_type VARCHAR(30) DEFAULT 'departamento',
  bedrooms INTEGER DEFAULT 1,
  bathrooms INTEGER DEFAULT 1,
  area_m2 INTEGER,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS contracts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  owner_id UUID REFERENCES owners(id) ON DELETE CASCADE,
  tenant_name VARCHAR(100) NOT NULL,
  tenant_rut VARCHAR(12) NOT NULL,
  tenant_email VARCHAR(150) NOT NULL,
  tenant_phone VARCHAR(20),
  rent_amount INTEGER NOT NULL,
  rent_currency VARCHAR(10) DEFAULT 'CLP',
  payment_day INTEGER NOT NULL DEFAULT 5,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  deposit_months INTEGER DEFAULT 1,
  deposit_amount INTEGER NOT NULL,
  status VARCHAR(30) DEFAULT 'pending_signature',
  owner_signed_at TIMESTAMPTZ,
  tenant_signed_at TIMESTAMPTZ,
  tenant_invite_token VARCHAR(100) UNIQUE,
  tenant_invite_expires TIMESTAMPTZ,
  contract_pdf_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contract_id UUID REFERENCES contracts(id) ON DELETE CASCADE,
  owner_id UUID REFERENCES owners(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  period_month INTEGER NOT NULL,
  period_year INTEGER NOT NULL,
  due_date DATE NOT NULL,
  paid_date TIMESTAMPTZ,
  status VARCHAR(30) DEFAULT 'pending',
  payment_method VARCHAR(30),
  khipu_payment_id VARCHAR(100),
  khipu_payment_url TEXT,
  receipt_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID REFERENCES owners(id) ON DELETE CASCADE,
  plan VARCHAR(20) NOT NULL,
  price INTEGER NOT NULL,
  status VARCHAR(30) DEFAULT 'active',
  flow_subscription_id VARCHAR(100),
  current_period_start DATE,
  current_period_end DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contracts_owner ON contracts(owner_id);
CREATE INDEX IF NOT EXISTS idx_contracts_token ON contracts(tenant_invite_token);
CREATE INDEX IF NOT EXISTS idx_payments_contract ON payments(contract_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
