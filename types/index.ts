export type UserRole = 'admin' | 'organizer' | 'club-head' | 'student'

export interface User {
  id: string
  firebase_uid: string
  email: string
  name: string
  name_slug: string
  role: UserRole
  enrollment?: string
  branch?: string
  year_batch?: number
  bio?: string
  linkedin?: string
  github?: string
  interests?: string[]
  avatar_url?: string
  created_at: string
}

export interface Club {
  id: string
  slug: string
  name: string
  tagline?: string
  description?: string
  head_id?: string
  member_count: number
  social_links?: {
    instagram?: string
    linkedin?: string
    twitter?: string
    website?: string
  }
  is_active: boolean
  created_at: string
}

export type EventStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
export type EventCategory = 'tech' | 'cultural' | 'academic' | 'placement'

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

export interface Event {
  id: string
  slug: string
  title: string
  description?: string
  club_id?: string
  club_slug?: string
  venue_name?: string
  geofence?: Geofence
  start_time: string
  end_time?: string
  status: EventStatus
  category?: EventCategory
  is_featured: boolean
  rsvp_count: number
  created_by?: string
  created_at: string
}

export type RSVPStatus = 'rsvped' | 'present' | 'absent'

export interface RSVP {
  id: string
  event_id: string
  user_id: string
  status: RSVPStatus
  marked_at?: string
  geo_verified: boolean
}

export interface TeamMember {
  id: string
  user_id?: string
  role: string
  role_slug: string
  year: number
  quote?: string
  events_led: number
  is_current: boolean
  mentor_id?: string
  name?: string
  name_slug?: string
  linkedin?: string
  github?: string
}

export type NewsCategory = 'events' | 'academic' | 'placement' | 'club-news' | 'general'

export interface News {
  id: string
  slug: string
  title: string
  excerpt?: string
  content?: string
  category?: NewsCategory
  author_id?: string
  is_pinned: boolean
  reading_time?: number
  published_at: string
  created_at: string
  author_name?: string
  author_avatar?: string
}

export type BulletinCategory = 'lost-found' | 'roommate' | 'book-exchange' | 'internship' | 'general'

export interface BulletinPost {
  id: string
  title: string
  description?: string
  category: BulletinCategory
  author_id: string
  expires_at?: string
  is_active: boolean
  created_at: string
  author_name?: string
  author_avatar?: string
}

export type ClubMembershipStatus = 'pending' | 'active' | 'rejected'

export interface ClubMembership {
  id: string
  club_id: string
  user_id: string
  status: ClubMembershipStatus
  joined_at: string
  user_name?: string
  user_avatar?: string
}

export interface Notification {
  id: string
  user_id: string
  title: string
  body?: string
  type?: string
  ref_id?: string
  is_read: boolean
  created_at: string
}

export interface EventTask {
  id: string
  event_id: string
  title: string
  assignee_id?: string
  deadline?: string
  is_done: boolean
  created_by?: string
  created_at: string
  assignee_name?: string
}

export interface Deal {
  id: string
  title: string
  company?: string
  discount?: string
  category?: string
  link?: string
  is_active: boolean
  expires_at?: string
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export interface FeedItem {
  type: 'event' | 'news' | 'bulletin'
  id: string
  title: string
  excerpt?: string
  relevanceScore: number
  imageUrl?: string
}

export interface AuthUser {
  uid: string
  email: string
  name: string
  role: UserRole
}