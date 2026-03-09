-- ══════════════════════════════════════════════════════
-- Daylence Budget — PostgreSQL Schema
-- Multi-user priority-based budget management
-- ══════════════════════════════════════════════════════

-- Users
CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT UNIQUE NOT NULL,
  display_name  TEXT NOT NULL DEFAULT '',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Accounts (chèque, épargne, etc.)
CREATE TABLE IF NOT EXISTS accounts (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  balance       NUMERIC(12,2) NOT NULL DEFAULT 0,
  currency      TEXT NOT NULL DEFAULT 'EUR',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_accounts_user ON accounts(user_id);

-- Categories with priority ranking (1 = highest)
CREATE TABLE IF NOT EXISTS categories (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  emoji         TEXT NOT NULL DEFAULT '📌',
  color         TEXT NOT NULL DEFAULT '#6b7280',
  type          TEXT NOT NULL CHECK (type IN ('expense', 'income')),
  priority      INT NOT NULL DEFAULT 99,
  budget_target NUMERIC(12,2) NOT NULL DEFAULT 0,
  is_essential  BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, name)
);
CREATE INDEX idx_categories_user ON categories(user_id);
CREATE INDEX idx_categories_priority ON categories(user_id, priority);

-- Transactions (revenus & dépenses)
CREATE TABLE IF NOT EXISTS transactions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  account_id    UUID REFERENCES accounts(id) ON DELETE SET NULL,
  category_id   UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  type          TEXT NOT NULL CHECK (type IN ('expense', 'income')),
  amount        NUMERIC(12,2) NOT NULL CHECK (amount > 0),
  label         TEXT NOT NULL,
  date          DATE NOT NULL DEFAULT CURRENT_DATE,
  note          TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_transactions_user_date ON transactions(user_id, date DESC);
CREATE INDEX idx_transactions_category ON transactions(category_id);
CREATE INDEX idx_transactions_month ON transactions(user_id, date_trunc('month', date));

-- Monthly snapshots (historisation)
CREATE TABLE IF NOT EXISTS monthly_snapshots (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  month         DATE NOT NULL, -- first day of month (2026-03-01)
  total_income  NUMERIC(12,2) NOT NULL DEFAULT 0,
  total_expense NUMERIC(12,2) NOT NULL DEFAULT 0,
  balance       NUMERIC(12,2) NOT NULL DEFAULT 0,
  allocations   JSONB NOT NULL DEFAULT '[]', -- [{category_id, name, target, allocated, spent}]
  validated     BOOLEAN NOT NULL DEFAULT FALSE,
  validated_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, month)
);
CREATE INDEX idx_snapshots_user_month ON monthly_snapshots(user_id, month DESC);

-- ── Helper function: auto-update updated_at ──
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
