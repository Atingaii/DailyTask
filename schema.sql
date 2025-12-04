-- Daily Focus PostgreSQL schema (for Vercel Postgres)

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE,
  display_name VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  task_date DATE NOT NULL,
  title VARCHAR(255) NOT NULL,
  note TEXT,
  is_completed BOOLEAN DEFAULT FALSE,
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tasks_user_date ON tasks(user_id, task_date);
CREATE INDEX IF NOT EXISTS idx_tasks_date ON tasks(task_date);

CREATE TABLE IF NOT EXISTS daily_quotes (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  author VARCHAR(255),
  language VARCHAR(16) DEFAULT 'zh',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert initial quotes
INSERT INTO daily_quotes (content, author) VALUES
('不是因为有希望才坚持，而是坚持了才有希望。', '佚名'),
('不必等到明天，做你今天能做的事。', '佚名'),
('保持专注，比什么都重要。', '佚名')
ON CONFLICT DO NOTHING;
