INSERT INTO users (
  firebase_uid,
  email,
  name,
  name_slug,
  role,
  branch,
  year_batch,
  bio,
  linkedin,
  github,
  interests
) VALUES (
  'seed-campus-mantri-2025',
  'campus.mantri@rdec.ac.in',
  'Campus Mantri 2025',
  'campus-mantri-2025',
  'admin',
  'Computer Science and Engineering',
  2025,
  'Seed profile for the current Campus Mantri.',
  'https://www.linkedin.com/school/rd-engineering-college/',
  NULL,
  ARRAY['events', 'leadership', 'campus']
) ON CONFLICT (firebase_uid) DO UPDATE SET
  email = EXCLUDED.email,
  name = EXCLUDED.name,
  name_slug = EXCLUDED.name_slug,
  role = EXCLUDED.role,
  branch = EXCLUDED.branch,
  year_batch = EXCLUDED.year_batch,
  bio = EXCLUDED.bio,
  linkedin = EXCLUDED.linkedin,
  interests = EXCLUDED.interests;

INSERT INTO clubs (slug, name, tagline, description, member_count, social_links)
VALUES
  ('gfg', 'GfG Student Community', 'Code. Compete. Collaborate.', 'Technical community for coding, interview preparation, and peer learning.', 120, '{"website":"https://www.geeksforgeeks.org/"}'::jsonb),
  ('nexora', 'Nexora', 'Build what comes next.', 'Innovation and product-building club for emerging technologies.', 85, '{}'::jsonb),
  ('mehfil', 'Mehfil', 'The cultural stage of RDEC.', 'Music, dance, theatre, and literary culture at RDEC.', 95, '{}'::jsonb),
  ('spotlight', 'Spotlight', 'Capture campus stories.', 'Media, photography, design, and storytelling collective.', 70, '{}'::jsonb),
  ('velocity', 'Velocity', 'Move faster together.', 'Sports, fitness, and high-energy campus competitions.', 110, '{}'::jsonb),
  ('sukham', 'Sukham', 'Wellbeing for every student.', 'Student wellbeing, mindfulness, and support initiatives.', 60, '{}'::jsonb),
  ('hottake', 'HotTake', 'Debate the ideas that matter.', 'Debate, opinions, podcasts, and editorial conversations.', 55, '{}'::jsonb)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  tagline = EXCLUDED.tagline,
  description = EXCLUDED.description,
  member_count = EXCLUDED.member_count,
  social_links = EXCLUDED.social_links,
  is_active = true;

UPDATE clubs
SET head_id = (SELECT id FROM users WHERE firebase_uid = 'seed-campus-mantri-2025')
WHERE slug = 'gfg';

INSERT INTO events (
  slug,
  title,
  description,
  club_id,
  venue_name,
  geofence,
  start_time,
  end_time,
  status,
  category,
  is_featured,
  rsvp_count,
  created_by
) VALUES (
  'syntaxis-2026',
  'Syntaxis 2026',
  'Annual RDEC tech fest featuring coding contests, product showcases, and community sessions.',
  (SELECT id FROM clubs WHERE slug = 'gfg'),
  'Main Auditorium',
  '{"type":"circle","center":[28.6750,77.4950],"radius_meters":150}'::jsonb,
  '2026-09-12 10:00:00+05:30',
  '2026-09-12 18:00:00+05:30',
  'upcoming',
  'tech',
  true,
  0,
  (SELECT id FROM users WHERE firebase_uid = 'seed-campus-mantri-2025')
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  club_id = EXCLUDED.club_id,
  venue_name = EXCLUDED.venue_name,
  geofence = EXCLUDED.geofence,
  start_time = EXCLUDED.start_time,
  end_time = EXCLUDED.end_time,
  status = EXCLUDED.status,
  category = EXCLUDED.category,
  is_featured = EXCLUDED.is_featured,
  created_by = EXCLUDED.created_by;

INSERT INTO news (
  slug,
  title,
  excerpt,
  content,
  category,
  author_id,
  is_pinned,
  reading_time
) VALUES (
  'syntaxis-2026-announced',
  'Syntaxis 2026 Announced',
  'RDEC Campus opens planning for the annual tech fest.',
  'Syntaxis 2026 will bring together coding contests, product showcases, workshops, and campus-wide collaboration.',
  'events',
  (SELECT id FROM users WHERE firebase_uid = 'seed-campus-mantri-2025'),
  true,
  2
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  category = EXCLUDED.category,
  author_id = EXCLUDED.author_id,
  is_pinned = EXCLUDED.is_pinned,
  reading_time = EXCLUDED.reading_time;

INSERT INTO bulletin_posts (
  title,
  description,
  category,
  author_id,
  expires_at
)
SELECT
  'Volunteers Needed for Syntaxis 2026',
  'Student volunteers can register interest for operations, hospitality, media, and technical tracks.',
  'general',
  users.id,
  '2026-09-13 23:59:59+05:30'
FROM users
WHERE users.firebase_uid = 'seed-campus-mantri-2025'
AND NOT EXISTS (
  SELECT 1
  FROM bulletin_posts
  WHERE title = 'Volunteers Needed for Syntaxis 2026'
);

INSERT INTO team_members (
  user_id,
  role,
  role_slug,
  year,
  quote,
  events_led,
  is_current
)
SELECT
  users.id,
  'Campus Mantri',
  'campus-mantri',
  2025,
  'Building a more connected campus.',
  4,
  true
FROM users
WHERE users.firebase_uid = 'seed-campus-mantri-2025'
AND NOT EXISTS (
  SELECT 1
  FROM team_members
  WHERE role_slug = 'campus-mantri'
  AND year = 2025
  AND is_current = true
);
