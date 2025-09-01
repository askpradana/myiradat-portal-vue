export interface ContactMethod {
  id: string
  name: string
  description: string
  value: string
  icon: string
  color: string
  available: boolean
  hours?: string
}

export interface ContactAction {
  type: 'email' | 'phone' | 'chat' | 'external'
  value: string
  label: string
}

export interface ComingSoonFeature {
  id: string
  name: string
  description: string
  icon: string
  color: string
  estimatedLaunch?: string
}

export interface ContactPageData {
  methods: ContactMethod[]
  comingSoonFeatures: ComingSoonFeature[]
}