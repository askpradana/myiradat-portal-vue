export interface GhostAuthor {
  id: string
  name: string
  slug: string
  profile_image?: string
  cover_image?: string
  bio?: string
  website?: string
  location?: string
  facebook?: string
  twitter?: string
  meta_title?: string
  meta_description?: string
}

export interface GhostTag {
  id: string
  name: string
  slug: string
  description?: string
  feature_image?: string
  visibility: 'public' | 'internal'
  og_image?: string
  og_title?: string
  og_description?: string
  twitter_image?: string
  twitter_title?: string
  twitter_description?: string
  meta_title?: string
  meta_description?: string
  codeinjection_head?: string
  codeinjection_foot?: string
  canonical_url?: string
  accent_color?: string
}

export interface GhostPost {
  id: string
  uuid: string
  title: string
  slug: string
  html: string
  comment_id?: string
  feature_image?: string
  featured: boolean
  visibility: 'public' | 'members' | 'paid'
  created_at: string
  updated_at: string
  published_at?: string
  custom_excerpt?: string
  codeinjection_head?: string
  codeinjection_foot?: string
  og_image?: string
  og_title?: string
  og_description?: string
  twitter_image?: string
  twitter_title?: string
  twitter_description?: string
  meta_title?: string
  meta_description?: string
  authors: GhostAuthor[]
  tags: GhostTag[]
  primary_author: GhostAuthor
  primary_tag?: GhostTag
  url: string
  excerpt: string
  reading_time: number
  access: boolean
  send_email_when_published?: boolean
  email_subject?: string
  plaintext: string
}

export interface GhostPostsResponse {
  posts: GhostPost[]
  meta: {
    pagination: {
      page: number
      limit: number
      pages: number
      total: number
      next?: number
      prev?: number
    }
  }
}

export interface GhostSinglePostResponse {
  posts: [GhostPost]
}

export interface ArticleCardData {
  id: string
  title: string
  excerpt: string
  category: string
  author: string
  readTime: string
  featuredImage?: string
  publishedAt: string
  slug: string
}

export interface ArticlesQueryParams {
  limit?: number
  page?: number
  filter?: string
  include?: string
  order?: string
  formats?: string
}