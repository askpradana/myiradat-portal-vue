import type {
  GhostPostsResponse,
  GhostSinglePostResponse,
  ArticlesQueryParams,
  ArticleCardData,
  GhostPost
} from '@/types/articles'

export class GhostApiService {
  private baseUrl: string
  private apiKey: string

  constructor() {
    this.baseUrl = import.meta.env.VITE_GHOST_API_URL || ''
    this.apiKey = import.meta.env.VITE_GHOST_CONTENT_API_KEY || ''
  }

  private buildUrl(endpoint: string, params?: ArticlesQueryParams): string {
    const url = new URL(`${this.baseUrl}/ghost/api/content${endpoint}`)
    url.searchParams.append('key', this.apiKey)

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, value.toString())
        }
      })
    }

    return url.toString()
  }

  async getPosts(params?: ArticlesQueryParams): Promise<GhostPostsResponse | null> {
    try {
      const defaultParams: ArticlesQueryParams = {
        limit: 15,
        include: 'tags,authors',
        order: 'published_at DESC',
        ...params
      }

      const url = this.buildUrl('/posts/', defaultParams)
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`Ghost API error: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Failed to fetch posts from Ghost:', error)
      return null
    }
  }

  async getPostBySlug(slug: string): Promise<GhostPost | null> {
    try {
      const url = this.buildUrl(`/posts/slug/${slug}/`, {
        include: 'tags,authors'
      })

      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`Ghost API error: ${response.status}`)
      }

      const data: GhostSinglePostResponse = await response.json()
      return data.posts[0] || null
    } catch (error) {
      console.error('Failed to fetch post from Ghost:', error)
      return null
    }
  }

  async getFeaturedPosts(limit = 3): Promise<GhostPost[]> {
    const response = await this.getPosts({
      filter: 'featured:true',
      limit,
      include: 'tags,authors'
    })

    return response?.posts || []
  }

  transformToArticleCard(post: GhostPost): ArticleCardData {
    const primaryTag = post.primary_tag?.name || 'Article'

    return {
      id: post.id,
      title: post.title,
      excerpt: post.excerpt || post.custom_excerpt || '',
      category: primaryTag,
      author: post.primary_author.name,
      readTime: `${post.reading_time} min read`,
      featuredImage: post.feature_image,
      publishedAt: post.published_at || post.created_at,
      slug: post.slug
    }
  }
}

export const ghostApi = new GhostApiService()