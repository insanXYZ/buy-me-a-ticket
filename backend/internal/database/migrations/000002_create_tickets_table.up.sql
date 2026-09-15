BEGIN;

CREATE TABLE IF NOT EXISTS ticket_categories (
  id SERIAL,
  name VARCHAR(20) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ,
  PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS tickets (
  id SERIAL,
  user_id INTEGER NOT NULL,
  category_ticket_id INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ,
  PRIMARY KEY(id),
  FOREIGN KEY(user_id) REFERENCES users(id),
  FOREIGN KEY(category_ticket_id) REFERENCES ticket_categories(id)
);

CREATE TABLE IF NOT EXISTS ticket_details (
  id SERIAL,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  location VARCHAR(255) NOT NULL,
  line_ups VARCHAR(30) ARRAY NOT NULL,
  event_date DATE NOT NULL,
  event_start_time TIME NOT NULL,
  event_end_time TIME NOT NULL,
  term_and_condition TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ,
  PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS ticket_variants (
  id SERIAL,
  ticket_id INTEGER,
  name VARCHAR(50) NOT NULL,
  price BIGINT NOT NULL DEFAULT 0,
  perks VARCHAR(10) ARRAY NOT NULL,
  quota INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ,
  PRIMARY KEY(id),
  FOREIGN KEY(ticket_id) REFERENCES tickets(id)
);

CREATE UNIQUE INDEX ON ticket_details(slug);

CREATE TRIGGER set_updated_at_tickets
BEFORE UPDATE ON tickets
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_updated_at_ticket_details
BEFORE UPDATE ON ticket_details
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_updated_at_ticket_variants
BEFORE UPDATE ON ticket_variants
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_updated_at_ticket_variants
BEFORE UPDATE ON ticket_categories
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

COMMIT;
