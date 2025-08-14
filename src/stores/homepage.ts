import { defineStore } from 'pinia'
import { ref, computed, reactive } from 'vue'
import type {
  HomepageConfig,
  TrustPillar
} from '@/types/homepage'

export const useHomepageStore = defineStore('homepage', () => {
  // State
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  
  // Animation preferences
  const animations = reactive({
    enabled: true,
    reducedMotion: false
  })
  
  // Viewport tracking
  const viewport = reactive({
    width: 0,
    height: 0,
    breakpoint: 'lg'
  })
  
  // Homepage content configuration
  // Trust Pillars for modern card-based design
  const trustPillars = ref<TrustPillar[]>([
    {
      id: 'security-pillar',
      title: 'Enterprise Security',
      description: 'SOC 2 Type II, ISO 27001 certified with bank-level security standards',
      icon: 'shield-check',
      iconColor: 'text-primary',
      iconBgColor: 'bg-primary/10',
      badges: [
        { label: 'SOC 2', color: 'primary' },
        { label: 'ISO 27001', color: 'primary' }
      ]
    },
    {
      id: 'uptime-pillar',
      title: '99.9% Uptime SLA',
      description: 'Guaranteed availability with 24/7 monitoring and global infrastructure',
      icon: 'bar-chart-3',
      iconColor: 'text-green-600 dark:text-green-400',
      iconBgColor: 'bg-green-100 dark:bg-green-900/30',
      metrics: [
        { label: 'Live Status', value: '', icon: 'circle' },
        { label: 'Response', value: '< 50ms', icon: 'zap' }
      ],
      status: {
        label: 'Live Status',
        indicator: 'online',
        pulse: true
      }
    },
    {
      id: 'support-pillar',
      title: '24/7 Expert Support',
      description: 'Dedicated success managers and priority technical support for all plans',
      icon: 'users',
      iconColor: 'text-blue-600 dark:text-blue-400',
      iconBgColor: 'bg-blue-100 dark:bg-blue-900/30',
      metrics: [
        { label: 'Experts', value: '500+', icon: 'users' },
        { label: 'Live Chat', value: '', icon: 'message-circle' }
      ]
    }
  ])

  const config = ref<HomepageConfig>({
    hero: {
      title: 'Transform Your Business with IRADAT',
      subtitle: 'The all-in-one portal solution trusted by enterprises worldwide. Streamline operations, enhance security, and accelerate growth.',
      cta: {
        primary: { label: 'Start Free Trial', href: '/register' },
        secondary: { label: 'Book Demo', href: '/demo' }
      },
      metrics: [
        { value: '99.9', suffix: '%', label: 'Uptime Guarantee', animated: true, countUp: true },
        { value: '500', suffix: '+', label: 'Enterprise Clients', animated: true, countUp: true },
        { value: '2M', suffix: '+', label: 'Transactions Daily', animated: true, countUp: true },
        { value: '24/7', label: 'Expert Support', animated: false }
      ]
    },
    sections: {
      features: [
        {
          id: 'unified-platform',
          title: 'Unified Data Platform',
          description: 'Connect all your data sources in one secure, compliant platform. Real-time synchronization with advanced transformation capabilities.',
          icon: 'database',
          iconColor: 'text-primary',
          iconBgColor: 'bg-primary/20',
          gridArea: 'hero',
          size: 'xl',
          interactive: true,
          gradient: {
            from: 'from-primary/5',
            to: 'to-primary/10'
          },
          content: {
            type: 'animation',
            animation: {
              type: 'pulse',
              duration: 1500,
              repeat: true,
              elements: ['dataSources']
            }
          }
        },
        {
          id: 'security',
          title: 'Enterprise Security',
          description: 'SOC 2 Type II compliant with end-to-end encryption and advanced threat protection.',
          icon: 'shield-check',
          iconColor: 'text-green-600 dark:text-green-400',
          iconBgColor: 'bg-green-100 dark:bg-green-900/30',
          gridArea: 'security',
          size: 'medium',
          interactive: true,
          stats: [
            { label: 'Security Score', value: 'A+', trend: 'stable' },
            { label: 'Status', value: 'All systems operational' }
          ]
        },
        {
          id: 'analytics',
          title: 'Advanced Analytics',
          description: 'Real-time insights with customizable dashboards and automated reporting.',
          icon: 'bar-chart-3',
          iconColor: 'text-blue-600 dark:text-blue-400',
          iconBgColor: 'bg-blue-100 dark:bg-blue-900/30',
          gridArea: 'analytics',
          size: 'large',
          interactive: true,
          gradient: {
            from: 'from-blue-50/50',
            to: 'to-blue-100/30 dark:from-blue-900/20 dark:to-blue-800/10'
          },
          content: {
            type: 'metrics',
            metrics: [
              { value: '2.4M', label: 'Events/day', suffix: '' },
              { value: '15', label: 'Avg Response', suffix: 'ms' }
            ]
          }
        },
        {
          id: 'integration',
          title: '500+ Integrations',
          description: 'Seamlessly connect with your existing tools and workflows.',
          icon: 'puzzle',
          iconColor: 'text-purple-600 dark:text-purple-400',
          iconBgColor: 'bg-purple-100 dark:bg-purple-900/30',
          gridArea: 'integration',
          size: 'medium',
          interactive: true,
          stats: [
            { label: 'Popular', value: 'Salesforce, Slack, Google Workspace' }
          ]
        },
        {
          id: 'performance',
          title: 'Lightning Fast',
          description: 'Sub-50ms response times with 99.9% uptime guarantee.',
          icon: 'zap',
          iconColor: 'text-orange-600 dark:text-orange-400',
          iconBgColor: 'bg-orange-100 dark:bg-orange-900/30',
          gridArea: 'performance',
          size: 'medium',
          interactive: true,
          stats: [
            { label: 'Response Time', value: '< 50ms' },
            { label: 'Uptime SLA', value: '99.9%' }
          ]
        },
        {
          id: 'support',
          title: '24/7 Support',
          description: 'Expert technical support and dedicated success managers for enterprise clients.',
          icon: 'users',
          iconColor: 'text-indigo-600 dark:text-indigo-400',
          iconBgColor: 'bg-indigo-100 dark:bg-indigo-900/30',
          gridArea: 'support',
          size: 'medium',
          interactive: true,
          stats: [
            { label: 'Status', value: 'Support team online' }
          ]
        },
        {
          id: 'features-overview',
          title: 'Why Choose IRADAT?',
          description: 'Comprehensive platform features designed for modern enterprises.',
          icon: 'check-circle',
          iconColor: 'text-emerald-600 dark:text-emerald-400',
          iconBgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
          gridArea: 'features',
          size: 'large',
          interactive: true,
          stats: [
            { label: 'Trusted by', value: '500+ enterprises worldwide' }
          ]
        }
      ],
      testimonials: [
        {
          id: '1',
          name: 'Sarah Chen',
          role: 'CTO',
          company: 'TechCorp Solutions',
          content: 'IRADAT transformed our operations, reducing processing time by 75% and eliminating manual errors.',
          metrics: {
            improvement: '75%',
            timeframe: '6 months',
            category: 'efficiency'
          },
          rating: 5,
          industry: 'Technology'
        }
      ],
      useCases: [
        {
          id: 'financial',
          title: 'Financial Services Portal',
          description: 'Compliance management and risk assessment tools',
          industry: 'Financial Services',
          image: '/use-cases/financial.jpg',
          features: ['Regulatory Compliance', 'Risk Management', 'Audit Trails'],
          cta: { label: 'View Case Study', action: '/case-studies/financial' }
        }
      ],
      pricing: [
        {
          id: 'starter',
          name: 'Starter',
          price: { amount: 49, currency: 'USD', period: 'month' },
          description: 'Perfect for small teams getting started',
          features: ['Up to 10 users', 'Basic integrations', 'Email support'],
          cta: { label: 'Start Free Trial', action: '/register?plan=starter' }
        },
        {
          id: 'professional',
          name: 'Professional',
          price: { amount: 149, currency: 'USD', period: 'month' },
          description: 'Advanced features for growing businesses',
          features: ['Up to 100 users', 'Advanced integrations', 'Priority support', 'Custom dashboards'],
          popular: true,
          cta: { label: 'Start Free Trial', action: '/register?plan=pro' }
        },
        {
          id: 'enterprise',
          name: 'Enterprise',
          price: { amount: 0, currency: 'USD', period: 'custom' },
          description: 'Tailored solutions for large organizations',
          features: ['Unlimited users', 'Custom integrations', '24/7 support', 'Dedicated success manager'],
          enterprise: true,
          cta: { label: 'Contact Sales', action: '/contact-sales' }
        }
      ],
      faq: [
        {
          id: '1',
          question: 'How secure is IRADAT?',
          answer: 'IRADAT is SOC 2 Type II compliant with enterprise-grade security features including end-to-end encryption, multi-factor authentication, and regular security audits.',
          category: 'security'
        },
        {
          id: '2',
          question: 'Can IRADAT integrate with our existing systems?',
          answer: 'Yes, IRADAT supports 500+ integrations including popular CRM, ERP, and business intelligence tools. We also provide custom API development for unique requirements.',
          category: 'integration'
        }
      ],
      trustIndicators: [
        {
          id: 'soc2',
          name: 'SOC 2 Type II',
          logo: '/certifications/soc2.svg',
          category: 'certification',
          description: 'Audited for security, availability, and confidentiality'
        },
        {
          id: 'iso27001',
          name: 'ISO 27001',
          logo: '/certifications/iso27001.svg',
          category: 'certification',
          description: 'International standard for information security management'
        }
      ]
    }
  })
  
  // Computed properties
  const heroMetrics = computed(() => config.value.hero.metrics)
  const features = computed(() => config.value.sections.features)
  const testimonials = computed(() => config.value.sections.testimonials)
  const useCases = computed(() => config.value.sections.useCases)
  const pricing = computed(() => config.value.sections.pricing)
  const faq = computed(() => config.value.sections.faq)
  const trustIndicators = computed(() => config.value.sections.trustIndicators)
  const getTrustPillars = computed(() => trustPillars.value)
  
  // Actions
  const updateViewport = (width: number, height: number) => {
    viewport.width = width
    viewport.height = height
    
    // Update breakpoint based on Tailwind breakpoints
    if (width >= 1280) viewport.breakpoint = 'xl'
    else if (width >= 1024) viewport.breakpoint = 'lg'
    else if (width >= 768) viewport.breakpoint = 'md'
    else if (width >= 640) viewport.breakpoint = 'sm'
    else viewport.breakpoint = 'xs'
  }
  
  const setAnimationPreferences = (enabled: boolean, reducedMotion: boolean) => {
    animations.enabled = enabled
    animations.reducedMotion = reducedMotion
  }
  
  const setLoading = (loading: boolean) => {
    isLoading.value = loading
  }
  
  const setError = (errorMessage: string | null) => {
    error.value = errorMessage
  }
  
  // Initialize animation preferences based on user system preferences
  const initializeAnimations = () => {
    if (typeof window !== 'undefined') {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      setAnimationPreferences(true, prefersReducedMotion)
      
      // Listen for changes
      window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
        setAnimationPreferences(animations.enabled, e.matches)
      })
    }
  }
  
  return {
    // State
    isLoading,
    error,
    animations,
    viewport,
    config,
    trustPillars,
    
    // Computed
    heroMetrics,
    features,
    testimonials,
    useCases,
    pricing,
    faq,
    trustIndicators,
    getTrustPillars,
    
    // Actions
    updateViewport,
    setAnimationPreferences,
    setLoading,
    setError,
    initializeAnimations
  }
})