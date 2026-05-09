export type UserRole = 'student' | 'club-head' | 'organizer' | 'admin'

export type EventStatus = 'draft' | 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
export type EventCategory = 'tech' | 'cultural' | 'academic' | 'sports' | 'placement' | 'general'
export type RSVPStatus = 'going' | 'waitlisted' | 'cancelled' | 'present' | 'absent'
export type NewsCategory = 'events' | 'academic' | 'placement' | 'club-news' | 'general'
export type BulletinCategory = 'lost-found' | 'roommate' | 'book-exchange' | 'internship' | 'general'
export type ClubMembershipStatus = 'pending' | 'active' | 'rejected'
export type NotificationType =
  | 'general'
  | 'event-rsvp'
  | 'event-update'
  | 'attendance'
  | 'club-membership'
  | 'bulletin'
export type EventTaskStatus = 'todo' | 'in-progress' | 'done'
export type DealCategory = 'food' | 'travel' | 'fashion' | 'education' | 'software' | 'general'

export interface CircleGeofence {
  type: 'circle'
  center: [number, number]
  radius_meters: number
}

export interface PolygonGeofence {
  type: 'polygon'
  coordinates: [number, number][]
}

export type Geofence = CircleGeofence | PolygonGeofence

export interface User {
  id: string
  firebase_uid: string
  email: string
  name: string
  name_slug: string
  role: UserRole
  enrollment_number?: string
  branch?: string
  year_batch?: number
  bio?: string
  avatar_url?: string
  linkedin_url?: string
  github_url?: string
  phone?: string
  interests?: string[]
  created_at: string
  updated_at?: string
}

export interface Club {
  id: string
  slug: string
  name: string
  tagline?: string
  description?: string
  logo_url?: string
  banner_url?: string
  head_user_id?: string
  member_count: number
  instagram_url?: string
  linkedin_url?: string
  website_url?: string
  is_active: boolean
  created_at: string
  updated_at?: string
}

export interface Event {
  id: string
  slug: string
  title: string
  description?: string
  category: EventCategory
  status: EventStatus
  club_id?: string
  organizer_id?: string
  venue_name?: string
  geofence?: Geofence
  poster_url?: string
  cover_url?: string
  thumbnail_url?: string
  registration_url?: string
  start_time: string
  end_time?: string
  is_featured: boolean
  capacity?: number
  rsvp_count: number
  created_at: string
  updated_at?: string
}

export interface RSVP {
  id: string
  event_id: string
  user_id: string
  status: RSVPStatus
  geo_verified: boolean
  checked_in_at?: string
  created_at: string
  updated_at?: string
}

export interface TeamMember {
  id: string
  user_id?: string
  name: string
  name_slug: string
  role: string
  role_slug: string
  year: number
  club_slug?: string
  quote?: string
  bio?: string
  avatar_url?: string
  linkedin_url?: string
  github_url?: string
  mentor_id?: string
  events_led: number
  is_current: boolean
  created_at?: string
  updated_at?: string
}

export interface News {
  id: string
  slug: string
  title: string
  excerpt?: string
  content: string
  category: NewsCategory
  author_id?: string
  cover_url?: string
  is_pinned: boolean
  reading_time_minutes?: number
  published_at: string
  created_at: string
  updated_at?: string
}

export interface BulletinPost {
  id: string
  title: string
  description: string
  category: BulletinCategory
  author_id: string
  image_url?: string
  contact_label?: string
  contact_value?: string
  expires_at?: string
  is_active: boolean
  created_at: string
  updated_at?: string
}

export interface ClubMembership {
  id: string
  club_id: string
  user_id: string
  status: ClubMembershipStatus
  role_label?: string
  joined_at?: string
  created_at: string
  updated_at?: string
}

export interface Notification {
  id: string
  user_id: string
  type: NotificationType
  title: string
  body?: string
  ref_id?: string
  ref_type?: string
  is_read: boolean
  created_at: string
}

export interface EventTask {
  id: string
  event_id: string
  title: string
  description?: string
  assignee_id?: string
  status: EventTaskStatus
  deadline?: string
  created_by?: string
  created_at: string
  updated_at?: string
}

export interface Deal {
  id: string
  title: string
  brand_name: string
  description?: string
  category: DealCategory
  discount_text?: string
  code?: string
  link?: string
  image_url?: string
  is_active: boolean
  expires_at?: string
  created_at: string
  updated_at?: string
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: string
}

export interface FeedItem {
  id: string
  type: 'event' | 'news' | 'bulletin' | 'deal'
  title: string
  excerpt?: string
  image_url?: string
  href?: string
  relevance_score: number
  created_at?: string
}
