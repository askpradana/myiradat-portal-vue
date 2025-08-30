export interface CaseStudy {
  id: string
  title: string
  client: string
  industry: string
  publishedAt: string
  readTimeMinutes: number
  tags: string[]
  excerpt: string
  challenge: string
  solution: string
  results: CaseStudyResult[]
  testimonial: {
    quote: string
    author: string
    position: string
  }
}

export interface CaseStudyResult {
  metric: string
  value: string
  description: string
}