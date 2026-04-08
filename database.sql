-- Create reports table
CREATE TABLE IF NOT EXISTS reports (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  title VARCHAR(200),
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  category VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  confidence_score INTEGER DEFAULT 50,
  duplicate_of INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create report_votes table
CREATE TABLE IF NOT EXISTS report_votes (
  id SERIAL PRIMARY KEY,
  report_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  vote VARCHAR(10) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(report_id, user_id)
);

-- Create moderation_logs table
CREATE TABLE IF NOT EXISTS moderation_logs (
  id SERIAL PRIMARY KEY,
  event_type VARCHAR(20) NOT NULL,
  event_id INTEGER NOT NULL,
  performed_by INTEGER,
  action VARCHAR(50) NOT NULL,
  reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create report_comments table
CREATE TABLE IF NOT EXISTS report_comments (
  id SERIAL PRIMARY KEY,
  report_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  comment TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_reports_category ON reports(category);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_user_id ON reports(user_id);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON reports(created_at);
CREATE INDEX IF NOT EXISTS idx_report_votes_report_id ON report_votes(report_id);
CREATE INDEX IF NOT EXISTS idx_moderation_logs_event_id ON moderation_logs(event_id);

-- Foreign keys with delete behavior
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'fk_reports_user_id'
  ) THEN
    ALTER TABLE reports
      ADD CONSTRAINT fk_reports_user_id
      FOREIGN KEY (user_id) REFERENCES users(id)
      ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'fk_reports_duplicate_of'
  ) THEN
    ALTER TABLE reports
      ADD CONSTRAINT fk_reports_duplicate_of
      FOREIGN KEY (duplicate_of) REFERENCES reports(id)
      ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'fk_report_votes_report_id'
  ) THEN
    ALTER TABLE report_votes
      ADD CONSTRAINT fk_report_votes_report_id
      FOREIGN KEY (report_id) REFERENCES reports(id)
      ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'fk_report_votes_user_id'
  ) THEN
    ALTER TABLE report_votes
      ADD CONSTRAINT fk_report_votes_user_id
      FOREIGN KEY (user_id) REFERENCES users(id)
      ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'fk_report_comments_report_id'
  ) THEN
    ALTER TABLE report_comments
      ADD CONSTRAINT fk_report_comments_report_id
      FOREIGN KEY (report_id) REFERENCES reports(id)
      ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'fk_report_comments_user_id'
  ) THEN
    ALTER TABLE report_comments
      ADD CONSTRAINT fk_report_comments_user_id
      FOREIGN KEY (user_id) REFERENCES users(id)
      ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'fk_moderation_logs_performed_by'
  ) THEN
    ALTER TABLE moderation_logs
      ADD CONSTRAINT fk_moderation_logs_performed_by
      FOREIGN KEY (performed_by) REFERENCES users(id)
      ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;
