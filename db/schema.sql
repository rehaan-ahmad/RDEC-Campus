CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  firebase_uid  TEXT        UNIQUE NOT NULL,
  email         TEXT        UNIQUE NOT NULL,
  name          TEXT        NOT NULL,
  name_slug     TEXT        NOT NULL,
  role          TEXT        NOT NULL DEFAULT 'student',
  enrollment    TEXT,
  branch        TEXT,
  year_batch    INTEGER,
  bio           TEXT,
  linkedin      TEXT,
  github        TEXT,
  interests     TEXT[],
  avatar_url    TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS clubs (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          TEXT        UNIQUE NOT NULL,
  name          TEXT        NOT NULL,
  tagline       TEXT,
  description   TEXT,
  head_id       UUID        REFERENCES users(id),
  member_count  INTEGER     NOT NULL DEFAULT 0,
  social_links  JSONB,
  is_active     BOOLEAN     NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS events (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          TEXT        UNIQUE NOT NULL,
  title         TEXT        NOT NULL,
  description   TEXT,
  club_id       UUID        REFERENCES clubs(id),
  venue_name    TEXT,
  geofence      JSONB,
  start_time    TIMESTAMPTZ NOT NULL,
  end_time      TIMESTAMPTZ,
  status        TEXT        NOT NULL DEFAULT 'upcoming',
  category      TEXT,
  is_featured   BOOLEAN     NOT NULL DEFAULT false,
  rsvp_count    INTEGER     NOT NULL DEFAULT 0,
  created_by    UUID        REFERENCES users(id),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS rsvps (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id      UUID        NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id       UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status        TEXT        NOT NULL DEFAULT 'rsvped',
  marked_at     TIMESTAMPTZ,
  geo_verified  BOOLEAN     NOT NULL DEFAULT false,
  UNIQUE(event_id, user_id)
);

CREATE TABLE IF NOT EXISTS team_members (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID        REFERENCES users(id),
  role          TEXT        NOT NULL,
  role_slug     TEXT        NOT NULL,
  year          INTEGER     NOT NULL,
  quote         TEXT,
  events_led    INTEGER     NOT NULL DEFAULT 0,
  is_current    BOOLEAN     NOT NULL DEFAULT false,
  mentor_id     UUID        REFERENCES team_members(id)
);

CREATE TABLE IF NOT EXISTS news (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          TEXT        UNIQUE NOT NULL,
  title         TEXT        NOT NULL,
  excerpt       TEXT,
  content       TEXT,
  category      TEXT,
  author_id     UUID        REFERENCES users(id),
  is_pinned     BOOLEAN     NOT NULL DEFAULT false,
  reading_time  INTEGER,
  published_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS bulletin_posts (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title         TEXT        NOT NULL,
  description   TEXT,
  category      TEXT        NOT NULL,
  author_id     UUID        NOT NULL REFERENCES users(id),
  expires_at    TIMESTAMPTZ,
  is_active     BOOLEAN     NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS club_memberships (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id       UUID        NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
  user_id       UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status        TEXT        NOT NULL DEFAULT 'pending',
  joined_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(club_id, user_id)
);

CREATE TABLE IF NOT EXISTS notifications (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title         TEXT        NOT NULL,
  body          TEXT,
  type          TEXT,
  ref_id        UUID,
  is_read       BOOLEAN     NOT NULL DEFAULT false,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS event_tasks (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id      UUID        NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  title         TEXT        NOT NULL,
  assignee_id   UUID        REFERENCES users(id),
  deadline      TIMESTAMPTZ,
  is_done       BOOLEAN     NOT NULL DEFAULT false,
  created_by    UUID        REFERENCES users(id),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS deals (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title         TEXT        NOT NULL,
  company       TEXT,
  discount      TEXT,
  category      TEXT,
  link          TEXT,
  is_active     BOOLEAN     NOT NULL DEFAULT true,
  expires_at    TIMESTAMPTZ
);
