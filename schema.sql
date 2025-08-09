CREATE TABLE IF NOT EXISTS mentors (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    root BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS batches (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP
);

CREATE TABLE IF NOT EXISTS interns (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    color_code VARCHAR(10),
    notice BOOLEAN DEFAULT FALSE,
    batch_id INT NOT NULL,
    terminated BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (batch_id) REFERENCES batches(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    img_url TEXT NOT NULL ,
    UNIQUE (id, batch_id)
);

CREATE TABLE IF NOT EXISTS mentorship_assignments (
    id SERIAL PRIMARY KEY,
    mentor_id INT NOT NULL,
    FOREIGN KEY (mentor_id) REFERENCES mentors(id),
    batch_id INT NOT NULL,
    FOREIGN KEY (batch_id) REFERENCES batches(id),
    permissions JSONB NOT NULL,
    UNIQUE (mentor_id, batch_id)
);

CREATE TABLE IF NOT EXISTS observations (
    id SERIAL PRIMARY KEY,
    mentor_id INT NOT NULL,
    FOREIGN KEY (mentor_id) REFERENCES mentors(id),
    intern_id INT NOT NULL,
    FOREIGN KEY (intern_id) REFERENCES interns(id),
    batch_id INT NOT NULL,
    FOREIGN KEY (batch_id) REFERENCES batches(id),
    created_at TIMESTAMP NOT NULL,
    content TEXT NOT NULL,
    watchout BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS feedbacks (
    id SERIAL PRIMARY KEY,
    mentor_id INT NOT NULL,
    FOREIGN KEY (mentor_id) REFERENCES mentors(id),
    intern_id INT NOT NULL,
    FOREIGN KEY (intern_id) REFERENCES interns(id),
    batch_id INT NOT NULL,
    FOREIGN KEY (batch_id) REFERENCES batches(id),
    created_at TIMESTAMP NOT NULL,
    content TEXT NOT NULL,
    delivered BOOLEAN DEFAULT FALSE,
    delivered_at TIMESTAMP,
    notice BOOLEAN DEFAULT FALSE,
    color_code VARCHAR(10)
);

CREATE TABLE IF NOT EXISTS feedback_conversations (
  id SERIAL PRIMARY KEY,
  feedback_id INT NOT NULL,
  FOREIGN KEY (feedback_id) REFERENCES feedbacks(id),
  mentor_id INT NOT NULL,
  FOREIGN KEY (mentor_id) REFERENCES mentors(id),
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- NEXT AUTH

CREATE TABLE IF NOT EXISTS verification_token
(
  identifier TEXT NOT NULL,
  expires TIMESTAMPTZ NOT NULL,
  token TEXT NOT NULL,
 
  PRIMARY KEY (identifier, token)
);
 
CREATE TABLE IF NOT EXISTS accounts
(
  id SERIAL,
  "userId" INTEGER NOT NULL,
  type VARCHAR(255) NOT NULL,
  provider VARCHAR(255) NOT NULL,
  "providerAccountId" VARCHAR(255) NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  expires_at BIGINT,
  id_token TEXT,
  scope TEXT,
  session_state TEXT,
  token_type TEXT,
 
  PRIMARY KEY (id)
);
 
CREATE TABLE IF NOT EXISTS sessions
(
  id SERIAL,
  "userId" INTEGER NOT NULL,
  expires TIMESTAMPTZ NOT NULL,
  "sessionToken" VARCHAR(255) NOT NULL,
 
  PRIMARY KEY (id)
);
 
CREATE TABLE IF NOT EXISTS users
(
  id SERIAL,
  name VARCHAR(255),
  email VARCHAR(255),
  "emailVerified" TIMESTAMPTZ,
  image TEXT,
 
  PRIMARY KEY (id)
);

-- INDEXES FOR PERFORMANCE OPTIMIZATION
-- Critical indexes for batch activity queries
CREATE INDEX IF NOT EXISTS idx_observations_batch_created_at ON observations(batch_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_feedbacks_batch_created_at ON feedbacks(batch_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_feedbacks_batch_delivered_at ON feedbacks(batch_id, delivered_at DESC) WHERE delivered_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_interns_batch_created_at ON interns(batch_id, created_at DESC) WHERE notice = TRUE;

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_observations_intern_batch ON observations(intern_id, batch_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_feedbacks_intern_batch ON feedbacks(intern_id, batch_id, created_at DESC);

-- Additional performance indexes
CREATE INDEX IF NOT EXISTS idx_feedbacks_delivered ON feedbacks(delivered, delivered_at) WHERE delivered = TRUE;
CREATE INDEX IF NOT EXISTS idx_interns_notice ON interns(notice, created_at) WHERE notice = TRUE;

-- Indexes for mentorship assignments
CREATE INDEX IF NOT EXISTS idx_mentorship_assignments_batch ON mentorship_assignments(batch_id);
CREATE INDEX IF NOT EXISTS idx_mentorship_assignments_mentor ON mentorship_assignments(mentor_id);

-- Indexes for feedback conversations
CREATE INDEX IF NOT EXISTS idx_feedback_conversations_feedback ON feedback_conversations(feedback_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_feedback_conversations_mentor ON feedback_conversations(mentor_id, created_at DESC);
