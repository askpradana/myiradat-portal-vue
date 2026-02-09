import { defineStore } from 'pinia'
import { ref, computed, reactive } from 'vue'
import type { HomepageConfig, TrustPillar } from '@/types/homepage'

export const useHomepageStore = defineStore('homepage', () => {
  // State
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Animation preferences
  const animations = reactive({
    enabled: true,
    reducedMotion: false,
  })

  // Viewport tracking
  const viewport = reactive({
    width: 0,
    height: 0,
    breakpoint: 'lg',
  })

  // Trust Pillars for professional standards covering both psychology and HR
  const trustPillars = ref<TrustPillar[]>([
    {
      id: 'professional-standards',
      title: 'Standar Profesional Teruji',
      description:
        'Memenuhi kode etik psikologi HIMPSI dan standar HR Indonesia dengan dukungan organisasi profesi untuk aplikasi klinis dan organisasional',
      icon: 'shield-check',
      iconColor: 'text-primary',
      iconBgColor: 'bg-primary/10',
      badges: [
        { label: 'HIMPSI', color: 'primary' },
        { label: 'HR Standards', color: 'secondary' },
        { label: 'ISO Certified', color: 'green' },
      ],
    },
    {
      id: 'enterprise-security',
      title: 'Keamanan Data Enterprise',
      description:
        'Enkripsi end-to-end dan penyimpanan data sesuai regulasi Indonesia dengan audit trail lengkap untuk data karyawan dan klien',
      icon: 'lock',
      iconColor: 'text-green-600 dark:text-green-400',
      iconBgColor: 'bg-green-100 dark:bg-green-900/30',
      metrics: [
        { label: 'ISO 27001', value: 'Certified', icon: 'shield' },
        { label: 'Enkripsi', value: 'End-to-End', icon: 'key' },
      ],
      status: {
        label: 'Security Status',
        indicator: 'online',
        pulse: true,
      },
    },
    {
      id: 'expert-support',
      title: 'Dukungan Tim Ahli',
      description:
        'Tim support yang terdiri dari psikolog, HR specialist, dan technical expert untuk konsultasi profesional dan implementasi',
      icon: 'users',
      iconColor: 'text-blue-600 dark:text-blue-400',
      iconBgColor: 'bg-blue-100 dark:bg-blue-900/30',
      metrics: [
        { label: 'Expert Team', value: '50+', icon: 'user-check' },
        { label: 'Response Time', value: '< 30 menit', icon: 'clock' },
      ],
    },
  ])

  const config = ref<HomepageConfig>({
    hero: {
      title: 'Human Potential is The Only Limitless Resource We Have in This World',
      subtitle:
        'Kombinasi dari fleksibilitas, pertumbuhan bersama, dan komitmen dapat menciptakan lingkungan yang inklusif dan produktif, serta memperkuat hubungan di berbagai aspek kehidupan.',
      cta: {
        primary: { label: 'Mulai Uji Coba Gratis', href: '/register' },
        secondary: { label: 'Demo untuk Tim HR', href: '/book-demo' },
      },
      metrics: [
        {
          value: '95',
          suffix: '%',
          label: 'Tingkat Akurasi Assessment',
          animated: true,
          countUp: true,
        },
        {
          value: '500',
          suffix: '+',
          label: 'Organisasi & Praktik Terdaftar',
          animated: true,
          countUp: true,
        },
        {
          value: '75',
          suffix: 'K+',
          label: 'Profil Assessment Terkelola',
          animated: true,
          countUp: true,
        },
        { value: '24/7', label: 'Support Profesional', animated: false },
      ],
    },
    sections: {
      features: [
        {
          id: 'unified-assessment',
          title: 'Platform Assessment Terpadu',
          description:
            'Kelola assessment psikologi dan talent dalam satu platform untuk praktik klinis, rekrutmen, dan employee development dengan hasil yang konsisten dan akurat.',
          icon: 'user-circle',
          iconColor: 'text-primary',
          iconBgColor: 'bg-primary/20',
          gridArea: 'hero',
          size: 'xl',
          interactive: true,
          gradient: {
            from: 'from-primary/5',
            to: 'to-primary/10',
          },
          stats: [
            { label: 'Assessment Tools', value: '25+', trend: 'stable' },
            { label: 'Use Cases', value: 'Klinis & HR' },
          ],
        },
        {
          id: 'advanced-analytics',
          title: 'Analytics Organisasi & Praktik',
          description:
            'Dashboard komprehensif untuk HR analytics, practice management, dan organizational insights dengan laporan otomatis yang mendukung strategic decision making.',
          icon: 'bar-chart-3',
          iconColor: 'text-blue-600 dark:text-blue-400',
          iconBgColor: 'bg-blue-100 dark:bg-blue-900/30',
          gridArea: 'analytics',
          size: 'large',
          interactive: true,
          gradient: {
            from: 'from-blue-50/50',
            to: 'to-blue-100/30 dark:from-blue-900/20 dark:to-blue-800/10',
          },
          content: {
            type: 'metrics',
            metrics: [
              { value: '15+', label: 'Metrics Tersedia', suffix: '' },
              { value: '24/7', label: 'Real-time Data', suffix: '' },
            ],
          },
        },
        {
          id: 'multipurpose-tools',
          title: 'Tools Assessment Serbaguna',
          description:
            'Akses ke 25+ instrumen assessment tervalidasi untuk keperluan klinis, rekrutmen, performance review, dan talent development dengan scoring otomatis.',
          icon: 'clipboard-list',
          iconColor: 'text-green-600 dark:text-green-400',
          iconBgColor: 'bg-green-100 dark:bg-green-900/30',
          gridArea: 'security',
          size: 'medium',
          interactive: true,
          stats: [
            { label: 'Validitas', value: 'Teruji Indonesia' },
            { label: 'Aplikasi', value: 'Klinis & Organisasi' },
          ],
        },
        {
          id: 'professional-development',
          title: 'Pengembangan Profesional',
          description:
            'Pustaka resources, training materials, dan sertifikasi untuk psikolog dan HR professional dengan update konten terbaru dari expert.',
          icon: 'graduation-cap',
          iconColor: 'text-purple-600 dark:text-purple-400',
          iconBgColor: 'bg-purple-100 dark:bg-purple-900/30',
          gridArea: 'integration',
          size: 'medium',
          interactive: true,
          stats: [{ label: 'Target', value: 'Psikolog & HR Professional' }],
        },
      ],
      testimonials: [
        {
          id: '1',
          name: 'Sari Indrawati, M.Psi',
          role: 'Head of People & Culture',
          company: 'PT Teknologi Maju Jakarta',
          content:
            'IRADAT mengubah cara kami merekruit dan mengembangkan talent. Assessment yang objektif meningkatkan quality of hire 45% dan mengurangi turnover secara signifikan. ROI yang jelas untuk investment di people analytics.',
          metrics: {
            improvement: '45%',
            timeframe: '1 tahun',
            category: 'quality_of_hire',
          },
          rating: 5,
          industry: 'Technology/HR',
        },
        {
          id: '2',
          name: 'Dr. Ahmad Rahman, M.Psi., Psikolog',
          role: 'Direktor Psikologi',
          company: 'Klinik Terpadu Mentari',
          content:
            'Sebagai praktisi yang juga konsultan organisasi, IRADAT memberikan fleksibilitas tools yang sama powerful untuk kedua kebutuhan. Satu platform untuk semua assessment needs.',
          metrics: {
            improvement: '60%',
            timeframe: '8 bulan',
            category: 'efficiency',
          },
          rating: 5,
          industry: 'Clinical + Consulting',
        },
        {
          id: '3',
          name: 'Maya Kusuma, S.Psi., M.M',
          role: 'Learning & Development Manager',
          company: 'Bank Mandiri Regional',
          content:
            'Implementation IRADAT untuk leadership development program kami memberikan insight yang lebih mendalam tentang potensi leader. Analytics membantu personalisasi development plan.',
          metrics: {
            improvement: '50%',
            timeframe: '6 bulan',
            category: 'leadership_development',
          },
          rating: 5,
          industry: 'Banking/L&D',
        },
      ],
      useCases: [
        {
          id: 'hr-talent-management',
          title: 'Solusi HR & Talent Management',
          description:
            'Digitalisasi proses rekrutmen, employee assessment, dan performance management dengan tools psikologi terintegrasi untuk keputusan talent yang lebih objektif.',
          industry: 'Human Resources',
          image: '/use-cases/hr-talent.jpg',
          features: [
            'Pre-employment Screening',
            '360° Assessment',
            'Performance Analytics',
            'Talent Mapping',
            'Succession Planning',
            'Culture Fit Analysis',
          ],
          cta: { label: 'Lihat Case Study', action: '/case-studies/hr-talent' },
        },
        {
          id: 'organizational-development',
          title: 'Organizational Development & Change',
          description:
            'Assessment dan analytics untuk transformation initiatives, team dynamics, leadership development, dan culture assessment di era digital.',
          industry: 'Organizational Development',
          image: '/use-cases/org-dev.jpg',
          features: [
            'Culture Assessment',
            'Leadership 360°',
            'Team Dynamics',
            'Change Readiness',
            'Engagement Surveys',
            'OD Analytics',
          ],
          cta: { label: 'Lihat Case Study', action: '/case-studies/org-development' },
        },
        {
          id: 'clinical-practice',
          title: 'Praktik Psikologi Profesional',
          description:
            'Digitalisasi lengkap praktik klinis dengan manajemen pasien, clinical assessment, dan administrative support dalam satu platform terintegrasi.',
          industry: 'Praktik Psikologi',
          image: '/use-cases/clinical.jpg',
          features: [
            'Clinical Assessment',
            'Patient Management',
            'Progress Tracking',
            'Telehealth Ready',
            'Clinical Reports',
            'Supervision Tools',
          ],
          cta: { label: 'Lihat Case Study', action: '/case-studies/clinical-practice' },
        },
        {
          id: 'educational-institutions',
          title: 'Institusi Pendidikan & Training',
          description:
            'Platform assessment untuk academic counseling, student evaluation, dan professional training program dengan tracking progress yang komprehensif.',
          industry: 'Pendidikan',
          image: '/use-cases/education.jpg',
          features: [
            'Student Assessment',
            'Career Counseling',
            'Academic Analytics',
            'Training Management',
            'Competency Tracking',
            'Certification',
          ],
          cta: { label: 'Lihat Case Study', action: '/case-studies/education' },
        },
      ],
      pricing: [
        {
          id: 'individual',
          name: 'Individual Professional',
          price: { amount: 79, currency: 'IDR', period: 'ribu/bulan' },
          description: 'Ideal untuk psikolog praktik mandiri atau HR consultant',
          features: [
            'Hingga 50 profil assessment',
            'Tools assessment dasar',
            'Support email',
            'Cloud storage 5GB',
            'Mobile access',
          ],
          cta: { label: 'Mulai Uji Coba Gratis', action: '/register?plan=individual' },
        },
        {
          id: 'professional',
          name: 'Team & Small Organization',
          price: { amount: 149, currency: 'IDR', period: 'ribu/bulan' },
          description: 'Untuk tim HR, klinik, atau praktik grup dengan 2-10 user',
          features: [
            'Hingga 200 profil assessment',
            'Tools assessment lengkap',
            'Multi-user access',
            'Priority support',
            'Cloud storage 20GB',
            'HR & Clinical analytics',
          ],
          popular: true,
          cta: { label: 'Mulai Uji Coba Gratis', action: '/register?plan=pro' },
        },
        {
          id: 'enterprise',
          name: 'Enterprise Organization',
          price: { amount: 0, currency: 'IDR', period: 'custom' },
          description: 'Solusi enterprise untuk perusahaan, rumah sakit, atau institusi besar',
          features: [
            'Unlimited profil assessment',
            'Custom integrations & API',
            'Dedicated support team',
            'Training & onboarding program',
            'Advanced analytics & reporting',
            'Compliance & audit tools',
          ],
          enterprise: true,
          cta: { label: 'Hubungi Sales', action: '/contact' },
        },
      ],
      faq: [
        {
          id: '1',
          question: 'Bagaimana IRADAT dapat diintegrasikan dengan sistem HR yang sudah ada?',
          answer:
            'IRADAT dirancang untuk integrasi seamless dengan HRIS populer melalui API. Kami mendukung single sign-on, data synchronization, dan dapat dikustomisasi sesuai workflow HR yang sudah berjalan di organisasi Anda.',
          category: 'hr_integration',
        },
        {
          id: '2',
          question: 'Apa ROI yang bisa diharapkan untuk investasi assessment tools ini?',
          answer:
            'Klien kami melaporkan peningkatan quality of hire 40-60%, pengurangan turnover hingga 30%, dan efisiensi proses rekrutmen 50%. Platform ini menghemat cost per hire sambil meningkatkan akurasi keputusan talent.',
          category: 'roi',
        },
        {
          id: '3',
          question: 'Apakah assessment tools di IRADAT sudah tervalidasi untuk populasi Indonesia?',
          answer:
            'Ya, semua tools assessment telah melalui proses adaptasi dan validasi untuk populasi Indonesia bekerjasama dengan universitas terkemuka dan mengikuti standar internasional. Kami memiliki 25+ instrumen assessment yang telah teruji validitas dan reliabilitasnya.',
          category: 'assessment',
        },
        {
          id: '4',
          question: 'Apakah platform ini bisa scale untuk perusahaan dengan ribuan karyawan?',
          answer:
            'Ya, IRADAT dapat handle volume assessment dalam skala enterprise. Kami melayani organisasi dari 50 hingga 10,000+ karyawan dengan performa dan reliability yang konsisten.',
          category: 'scalability',
        },
        {
          id: '5',
          question: 'Bagaimana memastikan assessment sesuai dengan ethics dan legal compliance?',
          answer:
            'Semua tools assessment mengikuti kode etik HIMPSI dan best practices HR Indonesia. Kami provide guidelines untuk fair assessment, bias mitigation, dan documentation yang audit-ready.',
          category: 'compliance',
        },
        {
          id: '6',
          question: 'Bagaimana IRADAT memastikan keamanan data karyawan dan klien?',
          answer:
            'IRADAT menggunakan enkripsi end-to-end dengan standar ISO 27001 dan mematuhi regulasi perlindungan data Indonesia. Semua data disimpan di server lokal dengan backup terenkripsi dan audit trail lengkap.',
          category: 'security',
        },
      ],
      trustIndicators: [
        {
          id: 'himpsi',
          name: 'HIMPSI Endorsed',
          logo: '/certifications/himpsi.svg',
          category: 'professional',
          description:
            'Didukung oleh Himpunan Psikologi Indonesia untuk standar praktik profesional',
        },
        {
          id: 'iso27001',
          name: 'ISO 27001 Certified',
          logo: '/certifications/iso27001.svg',
          category: 'certification',
          description: 'Standar internasional untuk manajemen keamanan informasi enterprise',
        },
        {
          id: 'hr-compliance',
          name: 'HR Compliance Ready',
          logo: '/certifications/hr-standards.svg',
          category: 'compliance',
          description:
            'Kepatuhan penuh terhadap regulasi HR dan perlindungan data karyawan Indonesia',
        },
        {
          id: 'trusted-organizations',
          name: '500+ Trusted Organizations',
          logo: '/certifications/organizations.svg',
          category: 'client',
          description: 'Dipercaya oleh organisasi dan praktik psikologi di seluruh Indonesia',
        },
      ],
    },
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
    initializeAnimations,
  }
})
