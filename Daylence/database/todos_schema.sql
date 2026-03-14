-- ═══════════════════════════════════════════════
-- Daylence TodoList — PostgreSQL Schema
-- ═══════════════════════════════════════════════

-- ── Todos ──
CREATE TABLE IF NOT EXISTS todos (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  completed   BOOLEAN DEFAULT FALSE,
  priority    TEXT CHECK (priority IN ('low','medium','high')) DEFAULT 'medium',
  due_date    DATE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── Grocery list items ──
CREATE TABLE IF NOT EXISTS grocery_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  quantity    REAL DEFAULT 1,
  unit        TEXT DEFAULT 'pcs',
  price       REAL,
  aisle       TEXT NOT NULL DEFAULT 'Autres',
  checked     BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_grocery_user_aisle ON grocery_items(user_id, aisle);

-- ── Meal planner ──
CREATE TABLE IF NOT EXISTS meal_plans (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Lundi
  meal_type   TEXT NOT NULL CHECK (meal_type IN ('breakfast','lunch','dinner','snack')),
  title       TEXT NOT NULL,
  recipe_id   UUID, -- future FK to recipes table
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
CREATE UNIQUE INDEX idx_meal_plan_slot ON meal_plans(user_id, day_of_week, meal_type);

-- ── Fridge alerts ──
CREATE TABLE IF NOT EXISTS fridge_items (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  expiry_date   DATE NOT NULL,
  quantity      TEXT DEFAULT '1',
  consumed      BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_fridge_user_expiry ON fridge_items(user_id, expiry_date);

-- ── Habits ──
CREATE TABLE IF NOT EXISTS habits (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  icon        TEXT DEFAULT '✦',
  color       TEXT DEFAULT '#6c5ce7',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS habit_completions (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  habit_id  UUID NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
  date      DATE NOT NULL DEFAULT CURRENT_DATE,
  UNIQUE(habit_id, date)
);

-- ── Brain dump notes ──
CREATE TABLE IF NOT EXISTS brain_dump_notes (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title       TEXT NOT NULL DEFAULT '',
  content     TEXT NOT NULL DEFAULT '',
  color       TEXT DEFAULT '#fff',
  pinned      BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Migration: add title column if table already exists
ALTER TABLE brain_dump_notes ADD COLUMN IF NOT EXISTS title TEXT NOT NULL DEFAULT '';

-- ── Updated at trigger (reuse from budget schema if exists) ──
CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_todos_updated_at
  BEFORE UPDATE ON todos FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_brain_dump_updated_at
  BEFORE UPDATE ON brain_dump_notes FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
