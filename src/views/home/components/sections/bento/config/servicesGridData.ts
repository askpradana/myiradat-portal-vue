import type { BentoGridConfig } from '@/types/homepage'
import servicesData from '@/data/servicesData.json'

// Service-specific content hooks and hints
const serviceContent = {
  'eap-improve': {
    hook: '24/7 Mental Wellness',
    hint: 'Professional support when your team needs it most',
    theme: {
      primary: 'hsl(var(--primary))',
      accent: 'bg-primary/10',
      background: 'bg-gradient-to-br from-primary/5 to-primary/10',
      hover: 'primary/20',
    },
    animation: {
      type: 'pulse' as const,
      duration: 2000,
      repeat: true,
    },
  },
  'learning-development': {
    hook: 'Unlock Potential',
    hint: 'Custom training that drives growth',
    theme: {
      primary: 'hsl(var(--muted-foreground))',
      accent: 'bg-muted/50',
      background: 'bg-card',
      hover: 'muted-foreground/20',
    },
    animation: {
      type: 'progress' as const,
      duration: 3000,
      repeat: true,
    },
  },
  'evaluation-assessment': {
    hook: 'Hire with Confidence',
    hint: 'Science-backed talent evaluation',
    theme: {
      primary: 'hsl(var(--muted-foreground))',
      accent: 'bg-muted/50',
      background: 'bg-card',
      hover: 'muted-foreground/20',
    },
    animation: {
      type: 'status' as const,
      duration: 2500,
      repeat: true,
    },
  },
  lhh: {
    hook: 'Global Talent Solutions',
    hint: 'Navigate change with world-class expertise',
    theme: {
      primary: 'hsl(var(--muted-foreground))',
      accent: 'bg-muted/50',
      background: 'bg-card',
      hover: 'muted-foreground/20',
    },
    animation: {
      type: 'fade' as const,
      duration: 3500,
      repeat: true,
    },
  },
  'iradat-go': {
    hook: 'Assessment in Your Pocket',
    hint: 'Mobile-first psychological insights',
    theme: {
      primary: 'hsl(var(--muted-foreground))',
      accent: 'bg-muted/50',
      background: 'bg-card',
      hover: 'muted-foreground/20',
    },
    animation: {
      type: 'slide' as const,
      duration: 2000,
      repeat: true,
    },
  },
  'iradat-profiling': {
    hook: 'Know Yourself Deeply',
    hint: 'Advanced psychological profiling',
    theme: {
      primary: 'hsl(var(--muted-foreground))',
      accent: 'bg-muted/50',
      background: 'bg-card',
      hover: 'muted-foreground/20',
    },
    animation: {
      type: 'rotate' as const,
      duration: 4000,
      repeat: true,
    },
  },
}

// Card size mapping based on importance and content
const cardSizes = {
  'eap-improve': 'xl' as const, // Hero card
  'learning-development': 'large' as const,
  'evaluation-assessment': 'large' as const,
  lhh: 'large' as const,
  'iradat-go': 'medium' as const,
  'iradat-profiling': 'large' as const,
}

// Icon name mapping from services data to Lucide icons
const iconMapping: Record<string, string> = {
  Heart: 'heart',
  GraduationCap: 'graduation-cap',
  ClipboardCheck: 'clipboard-check',
  Building: 'building',
  Smartphone: 'smartphone',
  User: 'user',
}

// Transform services data into bento cards
const createServiceCards = () => {
  return servicesData.services.map((service) => {
    const content = serviceContent[service.id as keyof typeof serviceContent]
    const size = cardSizes[service.id as keyof typeof cardSizes]

    return {
      id: service.id,
      title: content.hook,
      description: content.hint,
      icon: iconMapping[service.iconName] || 'user',
      gridArea: service.id,
      size,
      type: service.id === 'eap-improve' ? ('hero' as const) : ('feature' as const),
      interactive: true,
      theme: content.theme,
      content: {
        animation: content.animation,
        highlights: service.features.slice(0, 2).map((f) => f.title),
        // Add key benefits as teaser content
        metrics: service.benefits.slice(0, 2).map((benefit, index) => ({
          value: ['✓', '⚡', '🎯', '💡', '🚀'][index] || '✓',
          label: benefit.title,
          animated: false,
        })),
      },
    }
  })
}

export const servicesGridConfig: BentoGridConfig = {
  title: 'Our Services Portfolio',
  subtitle: 'COMPREHENSIVE SOLUTIONS',
  description:
    'Discover our range of professional services designed to elevate your organization and empower your people.',
  animations: {
    enabled: true,
    reducedMotion: false,
  },
  layout: {
    // 6 cards arranged optimally for different screen sizes
    desktop: [
      'eap-improve eap-improve learning-development learning-development evaluation-assessment evaluation-assessment',
      'lhh lhh iradat-go iradat-profiling . .',
      '. . . . . .',
    ],
    tablet: [
      'eap-improve eap-improve eap-improve eap-improve',
      'learning-development learning-development evaluation-assessment evaluation-assessment',
      'lhh lhh iradat-go iradat-profiling',
    ],
    mobile: [
      'eap-improve',
      'learning-development',
      'evaluation-assessment',
      'lhh',
      'iradat-go',
      'iradat-profiling',
    ],
  },
  cards: createServiceCards(),
}

export default servicesGridConfig
