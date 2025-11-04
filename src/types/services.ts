import type { Component } from 'vue'

export interface ServiceFeature {
  iconName: string
  title: string
  description: string
}

export interface ServiceBenefit {
  title: string
  description: string
}

export interface Service {
  id: string
  slug: string
  title: string
  description: string
  iconName: string
  features: ServiceFeature[]
  benefits: ServiceBenefit[]
}

export interface ServicesData {
  services: Service[]
}

export interface ServiceWithIcons {
  id: string
  slug: string
  title: string
  description: string
  icon: Component
  features: Array<{
    icon: Component
    title: string
    description: string
  }>
  benefits: ServiceBenefit[]
}

export interface ServiceRouteConfig {
  path: string
  name: string
  component: Component
  title: string
}