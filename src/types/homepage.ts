export interface MetricData {
  value: string | number
  label: string
  suffix?: string
  prefix?: string
  animated?: boolean
  countUp?: boolean
}

export interface FeatureCard {
  id: string
  title: string
  description: string
  icon: string
  iconColor?: string
  iconBgColor?: string
  gridArea: string
  size: 'small' | 'medium' | 'large' | 'xl'
  interactive?: boolean
  image?: string
  gradient?: {
    from: string
    to: string
  }
  content?: {
    type: 'chart' | 'image' | 'video' | 'demo' | 'metrics' | 'animation'
    url?: string
    data?: unknown
    animation?: AnimationData
    metrics?: MetricData[]
  }
  stats?: {
    label: string
    value: string
    trend?: 'up' | 'down' | 'stable'
  }[]
}

export interface AnimationData {
  type: 'pulse' | 'slide' | 'fade' | 'scale' | 'rotate' | 'data-sync' | 'progress' | 'status'
  duration: number
  delay?: number
  repeat?: boolean
  elements?: string[]
  data?: string[]
  interval?: number
}

export interface TestimonialWithMetrics {
  id: string
  name: string
  role: string
  company: string
  avatar?: string // Made optional for dynamic avatar support
  content: string
  metrics?: {
    improvement: string
    timeframe: string
    category: string
  }
  rating: number
  industry?: string
}

export interface CarouselUseCase {
  id: string
  title: string
  description: string
  industry: string
  image: string
  features: string[]
  metrics?: {
    label: string
    value: string
  }[]
  cta: {
    label: string
    action: string
  }
}

export interface TrustIndicator {
  id: string
  name: string
  logo: string
  category: 'client' | 'certification' | 'partner' | 'award'
  description?: string
  icon?: string
  color?: string
  bgColor?: string
  verified?: boolean
  link?: string
  metrics?: {
    label: string
    value: string
    icon?: string
  }[]
}

export interface TrustPillar {
  id: string
  title: string
  description: string
  icon: string
  iconColor: string
  iconBgColor: string
  metrics?: {
    label: string
    value: string
    icon?: string
  }[]
  badges?: {
    label: string
    color: string
  }[]
  status?: {
    label: string
    indicator: 'online' | 'active' | 'verified'
    pulse?: boolean
  }
}

export interface PricingPlan {
  id: string
  name: string
  price: {
    amount: number
    currency: string
    period: string
  }
  description: string
  features: string[]
  popular?: boolean
  enterprise?: boolean
  cta: {
    label: string
    action: string
  }
}

export interface FAQItem {
  id: string
  question: string
  answer: string
  category?: string
}

export interface AnimationConfig {
  duration: number
  delay?: number
  easing: string
  stagger?: number
}

export interface ViewportIntersection {
  isVisible: boolean
  ratio: number
  element?: Element
}

export interface NavigationItem {
  label: string
  href: string
  external?: boolean
  children?: NavigationItem[]
}

export interface HomepageConfig {
  hero: {
    title: string
    subtitle: string
    cta: {
      primary: NavigationItem
      secondary?: NavigationItem
    }
    metrics: MetricData[]
  }
  sections: {
    features: FeatureCard[]
    testimonials: TestimonialWithMetrics[]
    useCases: CarouselUseCase[]
    pricing: PricingPlan[]
    faq: FAQItem[]
    trustIndicators: TrustIndicator[]
  }
}

// Bento Grid specific types
export interface BentoCardIntegration {
  name: string
  short: string
  color: string
}

export interface BentoCardTheme {
  primary: string
  accent: string
  background: string
  hover: string
}

export interface BentoCard extends Omit<FeatureCard, 'content'> {
  type: 'hero' | 'feature' | 'metric' | 'integration' | 'placeholder'
  theme: BentoCardTheme
  status?: 'active' | 'coming-soon' | 'beta'
  content: {
    metrics?: MetricData[]
    integrations?: BentoCardIntegration[]
    animation?: AnimationData
    progress?: {
      label: string
      value: number
      max: number
    }
    statusList?: {
      label: string
      status: 'active' | 'verified' | 'operational'
      color: string
    }[]
    highlights?: string[]
    comingSoon?: {
      title: string
      description: string
      eta: string
    }
  }
}

export interface BentoGridLayout {
  desktop: string[]
  tablet: string[]
  mobile: string[]
}

export interface BentoGridConfig {
  title: string
  subtitle: string
  description: string
  cards: BentoCard[]
  layout: BentoGridLayout
  animations: {
    enabled: boolean
    reducedMotion: boolean
  }
}