import type { BentoGridConfig } from '@/types/homepage'

export const bentoGridConfig: BentoGridConfig = {
  title: 'Everything you need in one platform',
  subtitle: 'POWERFUL FEATURES',
  description:
    'IRADAT combines enterprise-grade security, seamless integrations, and powerful analytics to streamline your business operations.',
  animations: {
    enabled: true,
    reducedMotion: false,
  },
  layout: {
    desktop: [
      'hero hero hero lightning lightning lightning',
      'security security integration integration auto-scaling auto-scaling',
      'smart-routing smart-routing ai-insights ai-insights workflows workflows',
    ],
    tablet: [
      'hero hero hero hero',
      'hero hero hero hero',
      'lightning lightning security security',
      'integration integration auto-scaling auto-scaling',
      'smart-routing smart-routing ai-insights ai-insights',
      'workflows workflows workflows workflows',
    ],
    mobile: [
      'hero',
      'lightning',
      'security',
      'integration',
      'auto-scaling',
      'smart-routing',
      'ai-insights',
      'workflows',
    ],
  },
  cards: [
    {
      id: 'unified-data',
      title: 'Unified Data Platform',
      description:
        'Connect all your data sources in one secure, compliant platform. Real-time synchronization with advanced transformation capabilities.',
      icon: 'database',
      gridArea: 'hero',
      size: 'xl',
      type: 'hero',
      interactive: true,
      theme: {
        primary: 'hsl(var(--primary))',
        accent: 'bg-primary/10',
        background: 'bg-gradient-to-br from-primary/5 to-primary/10',
        hover: 'primary/20',
      },
      content: {
        animation: {
          type: 'data-sync',
          duration: 2000,
          repeat: true,
          data: ['CRM', 'ERP', 'Database', 'Analytics', 'API', 'Files'],
          interval: 2000,
        },
      },
    },
    {
      id: 'lightning-fast',
      title: 'Lightning Fast Operations',
      description: 'Unified performance across all your services with intelligent optimization.',
      icon: 'zap',
      gridArea: 'lightning',
      size: 'large',
      type: 'feature',
      interactive: true,
      theme: {
        primary: 'hsl(var(--muted-foreground))',
        accent: 'hsl(var(--muted))',
        background: 'bg-card',
        hover: 'muted-foreground/20',
      },
      content: {
        highlights: [
          'Single-click service switching (< 200ms)',
          'Cached authentication across platforms',
          'Pre-loaded service contexts',
          'Intelligent resource allocation',
        ],
        metrics: [
          {
            value: '< 200ms',
            label: 'Service Switching',
            animated: false,
          },
          {
            value: '99.9%',
            label: 'Cross-platform Availability',
            animated: false,
          },
          {
            value: '5x',
            label: 'Faster Multi-service Workflows',
            suffix: ' faster',
            animated: false,
          },
        ],
      },
    },
    {
      id: 'security',
      title: 'Enterprise Security',
      description:
        'SOC 2 Type II compliant with end-to-end encryption and advanced threat protection.',
      icon: 'shield-check',
      gridArea: 'security',
      size: 'medium',
      type: 'feature',
      interactive: true,
      theme: {
        primary: 'hsl(var(--muted-foreground))',
        accent: 'hsl(var(--muted))',
        background: 'bg-card',
        hover: 'muted-foreground/20',
      },
      content: {
        statusList: [
          {
            label: 'All systems operational',
            status: 'operational',
            color: 'green-500',
          },
          {
            label: 'SOC 2 Type II Certified',
            status: 'verified',
            color: 'muted-foreground',
          },
          {
            label: 'ISO 27001 Compliant',
            status: 'verified',
            color: 'muted-foreground',
          },
        ],
      },
    },
    {
      id: 'integrations',
      title: '500+ Integrations',
      description: 'Seamlessly connect with your existing tools and workflows.',
      icon: 'plug',
      gridArea: 'integration',
      size: 'medium',
      type: 'integration',
      interactive: true,
      theme: {
        primary: 'hsl(var(--muted-foreground))',
        accent: 'hsl(var(--muted))',
        background: 'bg-card',
        hover: 'muted-foreground/20',
      },
      content: {
        integrations: [
          { name: 'Salesforce', short: 'SF', color: '#00A1E0' },
          { name: 'Microsoft', short: 'MS', color: '#F35020' },
          { name: 'Google', short: 'GG', color: '#4285F4' },
          { name: 'Slack', short: 'SL', color: '#4A154B' },
          { name: 'Zoom', short: 'ZM', color: '#2D8CFF' },
        ],
      },
    },
    {
      id: 'improve-care',
      title: 'Consult with psycholog',
      description:
        'Consult with psycholog with various background and specialize in mental health.',
      icon: 'activity',
      gridArea: 'auto-scaling',
      size: 'medium',
      type: 'feature',
      interactive: true,
      theme: {
        primary: 'hsl(var(--muted-foreground))',
        accent: 'hsl(var(--muted))',
        background: 'bg-card',
        hover: 'muted-foreground/20',
      },
      content: {
        highlights: [
          'Dynamic resource allocation',
          'Automatic load balancing',
          'Cost optimization algorithms',
          'Predictive scaling',
        ],
        metrics: [
          {
            value: '40%',
            label: 'Cost Reduction',
            animated: false,
          },
          {
            value: '99.9%',
            label: 'Uptime SLA',
            animated: false,
          },
        ],
      },
    },
    {
      id: 'smart-routing',
      title: 'Smart Routing',
      description:
        'Intelligent service recommendations with context-aware navigation and workflow optimization.',
      icon: 'route',
      gridArea: 'smart-routing',
      size: 'medium',
      type: 'feature',
      interactive: true,
      theme: {
        primary: 'hsl(var(--muted-foreground))',
        accent: 'hsl(var(--muted))',
        background: 'bg-card',
        hover: 'muted-foreground/20',
      },
      content: {
        highlights: [
          'Context-aware navigation',
          'Intelligent service recommendations',
          'Workflow optimization',
          'Cross-service data flow',
        ],
        metrics: [
          {
            value: '60%',
            label: 'Navigation Efficiency',
            animated: false,
          },
          {
            value: '3.2s',
            label: 'Average Task Completion',
            animated: false,
          },
        ],
      },
    },
    {
      id: 'ai-insights',
      title: 'AI-Powered Insights',
      description:
        'Service usage analytics with optimization recommendations and predictive scaling.',
      icon: 'brain',
      gridArea: 'ai-insights',
      size: 'medium',
      type: 'placeholder',
      status: 'coming-soon',
      interactive: false,
      theme: {
        primary: 'hsl(var(--muted-foreground))',
        accent: 'hsl(var(--muted))',
        background: 'bg-muted/30',
        hover: 'muted-foreground/20',
      },
      content: {
        comingSoon: {
          title: 'AI-Powered Insights',
          description:
            'Advanced analytics and predictive recommendations for service optimization.',
          eta: 'Coming Q1 2025',
        },
      },
    },
    {
      id: 'workflows',
      title: 'Custom Workflows',
      description:
        'Drag-and-drop automation with cross-service triggers and business process optimization.',
      icon: 'workflow',
      gridArea: 'workflows',
      size: 'medium',
      type: 'placeholder',
      status: 'coming-soon',
      interactive: false,
      theme: {
        primary: 'hsl(var(--muted-foreground))',
        accent: 'hsl(var(--muted))',
        background: 'bg-muted/30',
        hover: 'muted-foreground/20',
      },
      content: {
        comingSoon: {
          title: 'Custom Workflows',
          description: 'Visual workflow builder for complex business process automation.',
          eta: 'In Development',
        },
      },
    },
  ],
}

export default bentoGridConfig
