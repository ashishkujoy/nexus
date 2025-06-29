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
    date TIMESTAMP NOT NULL,
    content TEXT NOT NULL,
    watchout BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS feedback (
    id SERIAL PRIMARY KEY,
    mentor_id INT NOT NULL,
    FOREIGN KEY (mentor_id) REFERENCES mentors(id),
    intern_id INT NOT NULL,
    FOREIGN KEY (intern_id) REFERENCES interns(id),
    batch_id INT NOT NULL,
    FOREIGN KEY (batch_id) REFERENCES batches(id),
    date TIMESTAMP NOT NULL,
    content TEXT NOT NULL,
    delivered BOOLEAN DEFAULT FALSE,
    delivered_at TIMESTAMP,
    notice BOOLEAN DEFAULT FALSE
    color_code VARCHAR(10)
);

-- NEXT AUTH

CREATE TABLE verification_token
(
  identifier TEXT NOT NULL,
  expires TIMESTAMPTZ NOT NULL,
  token TEXT NOT NULL,
 
  PRIMARY KEY (identifier, token)
);
 
CREATE TABLE accounts
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
 
CREATE TABLE sessions
(
  id SERIAL,
  "userId" INTEGER NOT NULL,
  expires TIMESTAMPTZ NOT NULL,
  "sessionToken" VARCHAR(255) NOT NULL,
 
  PRIMARY KEY (id)
);
 
CREATE TABLE users
(
  id SERIAL,
  name VARCHAR(255),
  email VARCHAR(255),
  "emailVerified" TIMESTAMPTZ,
  image TEXT,
 
  PRIMARY KEY (id)
);
 