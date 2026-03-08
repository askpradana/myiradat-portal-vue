import type { BentoGridConfig } from '@/types/homepage'

export const bentoGridConfig: BentoGridConfig = {
  title: 'Semua yang Anda butuhkan dalam satu platform',
  subtitle: 'FITUR UNGGULAN',
  description:
    'IRADAT menggabungkan keamanan kelas enterprise, integrasi mulus, dan analitik canggih untuk merapikan operasional bisnis Anda.',
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
      title: 'Platform Data Terpadu',
      description:
        'Hubungkan semua sumber data Anda dalam satu platform yang aman dan patuh regulasi. Sinkronisasi real-time dengan kemampuan transformasi lanjutan.',
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
      title: 'Operasional Super Cepat',
      description: 'Performa terpadu di seluruh layanan Anda dengan optimasi cerdas.',
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
          'Perpindahan layanan sekali klik (< 200ms)',
          'Autentikasi cache lintas platform',
          'Konteks layanan siap pakai',
          'Alokasi sumber daya cerdas',
        ],
        metrics: [
          {
            value: '< 200ms',
            label: 'Perpindahan Layanan',
            animated: false,
          },
          {
            value: '99.9%',
            label: 'Ketersediaan Lintas Platform',
            animated: false,
          },
          {
            value: '5x',
            label: 'Alur Kerja Multi-layanan Lebih Cepat',
            suffix: ' lebih cepat',
            animated: false,
          },
        ],
      },
    },
    {
      id: 'security',
      title: 'Keamanan Enterprise',
      description:
        'Patuh SOC 2 Type II dengan enkripsi end-to-end dan perlindungan ancaman tingkat lanjut.',
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
            label: 'Semua sistem beroperasi normal',
            status: 'operational',
            color: 'green-500',
          },
          {
            label: 'Tersertifikasi SOC 2 Type II',
            status: 'verified',
            color: 'muted-foreground',
          },
          {
            label: 'Patuh ISO 27001',
            status: 'verified',
            color: 'muted-foreground',
          },
        ],
      },
    },
    {
      id: 'integrations',
      title: '500+ Integrasi',
      description: 'Hubungkan dengan mudah ke tools dan alur kerja yang sudah Anda gunakan.',
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
      title: 'Konsultasi dengan Psikolog',
      description:
        'Konsultasi dengan psikolog dari berbagai latar belakang dan spesialisasi kesehatan mental.',
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
          'Alokasi sumber daya dinamis',
          'Load balancing otomatis',
          'Algoritma optimasi biaya',
          'Skalabilitas prediktif',
        ],
        metrics: [
          {
            value: '40%',
            label: 'Pengurangan Biaya',
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
      title: 'Rute Cerdas',
      description:
        'Rekomendasi layanan cerdas dengan navigasi kontekstual dan optimasi alur kerja.',
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
          'Navigasi berbasis konteks',
          'Rekomendasi layanan cerdas',
          'Optimasi alur kerja',
          'Alur data lintas layanan',
        ],
        metrics: [
          {
            value: '60%',
            label: 'Efisiensi Navigasi',
            animated: false,
          },
          {
            value: '3.2s',
            label: 'Rata-rata Penyelesaian Tugas',
            animated: false,
          },
        ],
      },
    },
    {
      id: 'ai-insights',
      title: 'Insight Berbasis AI',
      description:
        'Analitik penggunaan layanan dengan rekomendasi optimasi dan skalabilitas prediktif.',
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
          title: 'Insight Berbasis AI',
          description:
            'Analitik lanjutan dan rekomendasi prediktif untuk optimasi layanan.',
          eta: 'Hadir Q1 2025',
        },
      },
    },
    {
      id: 'workflows',
      title: 'Workflow Kustom',
      description:
        'Otomasi drag-and-drop dengan pemicu lintas layanan dan optimasi proses bisnis.',
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
          title: 'Workflow Kustom',
          description: 'Builder workflow visual untuk otomasi proses bisnis yang kompleks.',
          eta: 'Dalam Pengembangan',
        },
      },
    },
  ],
}

export default bentoGridConfig
