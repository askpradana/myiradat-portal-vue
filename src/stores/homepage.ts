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

  // Homepage content configuration
  // Trust Pillars for psychology practice focus
  const trustPillars = ref<TrustPillar[]>([
    {
      id: 'himpsi-compliance',
      title: 'Sesuai Standar HIMPSI',
      description: 'Memenuhi kode etik dan standar praktik psikologi Indonesia dengan dukungan organisasi profesi',
      icon: 'shield-check',
      iconColor: 'text-primary',
      iconBgColor: 'bg-primary/10',
      badges: [
        { label: 'HIMPSI', color: 'primary' },
        { label: 'Kode Etik', color: 'secondary' },
      ],
    },
    {
      id: 'data-security',
      title: 'Keamanan Data Pasien',
      description: 'Enkripsi end-to-end dan penyimpanan data sesuai regulasi kesehatan Indonesia dengan audit trail lengkap',
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
      id: 'professional-support',
      title: 'Dukungan Psikolog Ahli',
      description: 'Tim dukungan yang terdiri dari psikolog berpengalaman dan technical support khusus praktik psikologi',
      icon: 'users',
      iconColor: 'text-blue-600 dark:text-blue-400',
      iconBgColor: 'bg-blue-100 dark:bg-blue-900/30',
      metrics: [
        { label: 'Psikolog Expert', value: '50+', icon: 'user-check' },
        { label: 'Response Time', value: '< 30 menit', icon: 'clock' },
      ],
    },
  ])

  const config = ref<HomepageConfig>({
    hero: {
      title: 'Standar Baru Praktik Psikologi Indonesia',
      subtitle:
        'Platform edukasi psikologi terdepan yang mengintegrasikan assessment evidence-based dengan manajemen pasien terpusat. Tingkatkan standar praktik Anda bersama ribuan psikolog profesional Indonesia.',
      cta: {
        primary: { label: 'Mulai Uji Coba Gratis', href: '/register' },
        secondary: { label: 'Demo untuk Praktik', href: '/book-demo' },
      },
      metrics: [
        { value: '98.5', suffix: '%', label: 'Tingkat Akurasi Assessment', animated: true, countUp: true },
        { value: '300', suffix: '+', label: 'Psikolog Terdaftar', animated: true, countUp: true },
        { value: '50', suffix: 'K+', label: 'Profil Pasien Terkelola', animated: true, countUp: true },
        { value: '24/7', label: 'Support Profesional', animated: false },
      ],
    },
    sections: {
      features: [
        {
          id: 'patient-management',
          title: 'Manajemen Profil Pasien Terpusat',
          description:
            'Kelola semua data pasien dalam satu platform aman dengan akses terkontrol dan history lengkap untuk akurasi diagnosis yang lebih baik.',
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
          content: {
            type: 'animation',
            animation: {
              type: 'pulse',
              duration: 1500,
              repeat: true,
              elements: ['patientProfiles'],
            },
          },
        },
        {
          id: 'assessment-tools',
          title: 'Alat Assessment Psikologi Canggih',
          description:
            'Akses ke berbagai instrumen assessment tervalidasi dengan scoring otomatis dan interpretasi berbasis evidence untuk mendukung keputusan klinis.',
          icon: 'clipboard-list',
          iconColor: 'text-green-600 dark:text-green-400',
          iconBgColor: 'bg-green-100 dark:bg-green-900/30',
          gridArea: 'security',
          size: 'medium',
          interactive: true,
          stats: [
            { label: 'Assessment Tools', value: '25+', trend: 'stable' },
            { label: 'Validitas', value: 'Teruji Indonesia' },
          ],
        },
        {
          id: 'practice-analytics',
          title: 'Analytics Praktik Psikologi',
          description: 'Insight mendalam tentang performa praktik dengan dashboard khusus dan laporan otomatis untuk evaluasi berkelanjutan.',
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
              { value: '15+', label: 'Metrics Praktik', suffix: '' },
              { value: '24/7', label: 'Real-time Data', suffix: '' },
            ],
          },
        },
        {
          id: 'continuing-education',
          title: 'Edukasi Berkelanjutan',
          description: 'Akses pustaka jurnal, webinar, dan training materials terbaru untuk meningkatkan kompetensi profesional.',
          icon: 'graduation-cap',
          iconColor: 'text-purple-600 dark:text-purple-400',
          iconBgColor: 'bg-purple-100 dark:bg-purple-900/30',
          gridArea: 'integration',
          size: 'medium',
          interactive: true,
          stats: [{ label: 'Resources', value: 'Jurnal, Webinar, Course' }],
        },
        {
          id: 'data-security',
          title: 'Keamanan Data Medis',
          description: 'Enkripsi end-to-end dengan backup otomatis dan audit trail lengkap sesuai standar keamanan data medis.',
          icon: 'shield-check',
          iconColor: 'text-orange-600 dark:text-orange-400',
          iconBgColor: 'bg-orange-100 dark:bg-orange-900/30',
          gridArea: 'performance',
          size: 'medium',
          interactive: true,
          stats: [
            { label: 'Enkripsi', value: 'End-to-End' },
            { label: 'Compliance', value: 'ISO 27001' },
          ],
        },
        {
          id: 'professional-support',
          title: 'Dukungan Psikolog Ahli',
          description:
            'Tim support yang terdiri dari psikolog berpengalaman dan technical support khusus untuk kebutuhan praktik psikologi.',
          icon: 'users',
          iconColor: 'text-indigo-600 dark:text-indigo-400',
          iconBgColor: 'bg-indigo-100 dark:bg-indigo-900/30',
          gridArea: 'support',
          size: 'medium',
          interactive: true,
          stats: [{ label: 'Status', value: 'Tim psikolog online' }],
        },
        {
          id: 'psychology-platform',
          title: 'Mengapa Pilih IRADAT untuk Psikologi?',
          description: 'Platform komprehensif yang dirancang khusus untuk kebutuhan praktik psikologi modern di Indonesia.',
          icon: 'heart',
          iconColor: 'text-emerald-600 dark:text-emerald-400',
          iconBgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
          gridArea: 'features',
          size: 'large',
          interactive: true,
          stats: [{ label: 'Dipercaya', value: '300+ psikolog Indonesia' }],
        },
      ],
      testimonials: [
        {
          id: '1',
          name: 'Dr. Sari Wijayanti, M.Psi., Psikolog',
          role: 'Direktur Klinik',
          company: 'Klinik Psikologi Mentari Jakarta',
          content:
            'IRADAT mengubah cara kami mengelola pasien. Akurasi assessment meningkat 40% dan waktu administrasi berkurang drastis. Tim kami kini bisa fokus pada terapi, bukan paperwork.',
          metrics: {
            improvement: '40%',
            timeframe: '8 bulan',
            category: 'accuracy',
          },
          rating: 5,
          industry: 'Private Practice',
        },
        {
          id: '2',
          name: 'Prof. Dr. Ahmad Rizal, Sp.KJ., M.Kes',
          role: 'Kepala Departemen Psikiatri',
          company: 'RS Cipto Mangunkusumo Jakarta',
          content:
            'Implementasi IRADAT di departemen kami meningkatkan koordinasi antara psikiater dan psikolog klinis. Data terintegrasi membantu decision making yang lebih baik.',
          metrics: {
            improvement: '60%',
            timeframe: '1 tahun',
            category: 'coordination',
          },
          rating: 5,
          industry: 'Hospital',
        },
        {
          id: '3',
          name: 'Dra. Maya Kusuma, M.Si., Psikolog',
          role: 'Psikolog Konsultan',
          company: 'Praktik Mandiri Psychology Center',
          content:
            'Sebagai praktisi mandiri, IRADAT memberikan professional tools yang biasanya hanya tersedia di institusi besar. Sangat membantu meningkatkan kualitas layanan.',
          metrics: {
            improvement: '50%',
            timeframe: '6 bulan',
            category: 'service_quality',
          },
          rating: 5,
          industry: 'Individual Practice',
        },
      ],
      useCases: [
        {
          id: 'private-practice',
          title: 'Solusi Praktik Psikologi Mandiri',
          description: 'Digitalisasi lengkap praktik mandiri dengan manajemen pasien, assessment tools, dan administrative support dalam satu platform terintegrasi.',
          industry: 'Praktik Mandiri',
          image: '/use-cases/private-practice.jpg',
          features: ['Manajemen Appointment', 'E-Assessment Tools', 'Patient Records', 'Billing Integration', 'Telehealth Ready', 'Progress Tracking'],
          cta: { label: 'Lihat Case Study', action: '/case-studies/private-practice' },
        },
        {
          id: 'hospital-psychology',
          title: 'Sistem Psikologi Rumah Sakit',
          description: 'Integrasi penuh dengan sistem hospital untuk departemen psikologi dengan workflow yang disesuaikan untuk setting institusional.',
          industry: 'Rumah Sakit',
          image: '/use-cases/hospital.jpg',
          features: ['EMR Integration', 'Multi-User Access', 'Department Analytics', 'Quality Assurance', 'Compliance Tracking', 'Staff Management'],
          cta: { label: 'Lihat Case Study', action: '/case-studies/hospital' },
        },
        {
          id: 'patient-journey',
          title: 'Pengalaman Pasien Digital',
          description: 'Platform pasien untuk self-assessment awal, appointment booking, dan tracking progress dengan interface yang user-friendly.',
          industry: 'Patient-Centric',
          image: '/use-cases/patient.jpg',
          features: ['Self-Assessment Portal', 'Appointment Booking', 'Progress Tracking', 'Educational Resources', 'Secure Messaging', 'Mobile Access'],
          cta: { label: 'Lihat Demo', action: '/demo/patient-portal' },
        },
        {
          id: 'clinical-supervision',
          title: 'Platform Supervisi Akademik',
          description: 'Tools khusus untuk supervisor klinis dan program training dengan tracking kompetensi mahasiswa dan dokumentasi supervisi.',
          industry: 'Akademik/Training',
          image: '/use-cases/supervision.jpg',
          features: ['Student Progress Tracking', 'Supervision Notes', 'Competency Assessment', 'Case Review System', 'Training Materials', 'Evaluation Tools'],
          cta: { label: 'Lihat Case Study', action: '/case-studies/supervision' },
        },
      ],
      pricing: [
        {
          id: 'individual',
          name: 'Individual Practitioner',
          price: { amount: 79, currency: 'IDR', period: 'ribu/bulan' },
          description: 'Ideal untuk psikolog praktik mandiri atau konsultan',
          features: ['Hingga 50 profil pasien', 'Tools assessment dasar', 'Support email', 'Cloud storage 5GB', 'Telehealth ready'],
          cta: { label: 'Mulai Uji Coba Gratis', action: '/register?plan=individual' },
        },
        {
          id: 'professional',
          name: 'Professional Practice',
          price: { amount: 149, currency: 'IDR', period: 'ribu/bulan' },
          description: 'Untuk klinik atau praktik grup dengan 2-5 psikolog',
          features: [
            'Hingga 200 profil pasien',
            'Tools assessment lengkap',
            'Multi-user access',
            'Priority support',
            'Cloud storage 20GB',
            'Advanced analytics',
          ],
          popular: true,
          cta: { label: 'Mulai Uji Coba Gratis', action: '/register?plan=pro' },
        },
        {
          id: 'enterprise',
          name: 'Institution/Hospital',
          price: { amount: 0, currency: 'IDR', period: 'custom' },
          description: 'Solusi enterprise untuk rumah sakit atau institusi besar',
          features: [
            'Unlimited profil pasien',
            'Custom integrations',
            'Dedicated support',
            'Training program',
            'Advanced analytics',
            'Compliance reporting',
          ],
          enterprise: true,
          cta: { label: 'Hubungi Sales', action: '/contact-us' },
        },
      ],
      faq: [
        {
          id: '1',
          question: 'Bagaimana IRADAT memastikan keamanan data pasien sesuai regulasi?',
          answer:
            'IRADAT menggunakan enkripsi end-to-end dengan standar ISO 27001 dan mematuhi regulasi perlindungan data kesehatan Indonesia. Semua data disimpan di server lokal dengan backup terenkripsi dan audit trail lengkap untuk memastikan confidentiality pasien.',
          category: 'security',
        },
        {
          id: '2',
          question: 'Apakah assessment tools di IRADAT sudah tervalidasi untuk populasi Indonesia?',
          answer:
            'Ya, semua tools assessment telah melalui proses adaptasi dan validasi untuk populasi Indonesia bekerjasama dengan universitas terkemuka dan mengikuti standar internasional. Kami memiliki 25+ instrumen assessment yang telah teruji validitas dan reliabilitasnya.',
          category: 'assessment',
        },
        {
          id: '3',
          question: 'Bagaimana sistem integrasinya dengan workflow psikologi yang sudah ada?',
          answer:
            'IRADAT dirancang fleksibel untuk beradaptasi dengan berbagai workflow praktik psikologi. Kami menyediakan onboarding khusus dan training untuk memastikan transisi yang smooth tanpa mengganggu praktik yang sedang berjalan.',
          category: 'integration',
        },
        {
          id: '4',
          question: 'Apakah tersedia training dan sertifikasi untuk menggunakan platform?',
          answer:
            'Kami menyediakan comprehensive training program, webinar reguler, dan sertifikasi digital. Tim support kami juga terdiri dari psikolog berpengalaman yang dapat membantu konsultasi profesional dan technical support.',
          category: 'training',
        },
        {
          id: '5',
          question: 'Bisakah platform ini digunakan untuk telehealth dan konsultasi online?',
          answer:
            'Ya, IRADAT terintegrasi dengan fitur telehealth yang aman dengan video conferencing terenkripsi, sharing screen untuk assessment, dan dokumentasi sesi yang otomatis tersimpan sesuai standar praktik psikologi.',
          category: 'telehealth',
        },
        {
          id: '6',
          question: 'Bagaimana dukungan untuk psikolog yang belum terbiasa dengan teknologi digital?',
          answer:
            'Kami memahami tantangan adopsi teknologi dalam praktik psikologi. Tim kami menyediakan training personal, video tutorial step-by-step, dan support 24/7 dengan tim yang memahami workflow psikologi untuk memastikan transisi yang nyaman.',
          category: 'support',
        },
      ],
      trustIndicators: [
        {
          id: 'himpsi',
          name: 'HIMPSI Endorsed',
          logo: '/certifications/himpsi.svg',
          category: 'professional',
          description: 'Didukung oleh Himpunan Psikologi Indonesia untuk standar praktik profesional',
        },
        {
          id: 'iso27001',
          name: 'ISO 27001',
          logo: '/certifications/iso27001.svg',
          category: 'certification',
          description: 'Standar internasional untuk manajemen keamanan informasi medis',
        },
        {
          id: 'data-protection',
          name: 'Medical Data Protection',
          logo: '/certifications/medical-data.svg',
          category: 'compliance',
          description: 'Kepatuhan penuh terhadap regulasi perlindungan data kesehatan Indonesia',
        },
        {
          id: 'university-partner',
          name: '15+ University Partners',
          logo: '/certifications/university.svg',
          category: 'academic',
          description: 'Kerjasama dengan universitas terkemuka untuk validasi tools dan research',
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
