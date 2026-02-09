import { ref, computed } from 'vue'
import type { Component } from 'vue'
import {
  Heart,
  Users,
  Shield,
  TrendingUp,
  Clock,
  Award,
  GraduationCap,
  BookOpen,
  Target,
  ClipboardCheck,
  Search,
  BarChart,
  CheckCircle,
  Building,
  Briefcase,
  Globe,
  Smartphone,
  Zap,
  User,
  Brain,
  FileText
} from 'lucide-vue-next'
import servicesData from '@/data/servicesData.json'
import type { Service, ServiceWithIcons, ServicesData } from '@/types/services'

const iconMap: Record<string, Component> = {
  Heart,
  Users,
  Shield,
  TrendingUp,
  Clock,
  Award,
  GraduationCap,
  BookOpen,
  Target,
  ClipboardCheck,
  Search,
  BarChart,
  CheckCircle,
  Building,
  Briefcase,
  Globe,
  Smartphone,
  Zap,
  User,
  Brain,
  FileText
}

export function useServicesData() {
  const data = ref<ServicesData>(servicesData as ServicesData)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const getIconComponent = (iconName: string): Component => {
    return iconMap[iconName] || Users
  }

  const services = computed<ServiceWithIcons[]>(() => {
    return data.value.services.map((service: Service) => ({
      ...service,
      icon: 'https://improvecare.iradatkonsultan.com/images/logo.png',
      features: service.features.map(feature => ({
        ...feature,
        icon: getIconComponent(feature.iconName)
      }))
    }))
  })

  const getServiceBySlug = (slug: string): ServiceWithIcons | undefined => {
    return services.value.find(service => service.slug === slug)
  }

  const getAllServices = (): ServiceWithIcons[] => {
    return services.value
  }

  const getServiceSlugs = (): string[] => {
    return services.value.map(service => service.slug)
  }

  const getServiceRoutes = () => {
    return services.value.map(service => ({
      path: `/services/${service.slug}`,
      name: `service-${service.slug}`,
      component: () => import('@/views/services/ServiceView.vue'),
      title: service.title
    }))
  }

  return {
    services,
    isLoading,
    error,
    getServiceBySlug,
    getAllServices,
    getServiceSlugs,
    getServiceRoutes
  }
}