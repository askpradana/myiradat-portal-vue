<template>
  <ServicePageLayout :service="lhhService" :icon-component="Building" />
</template>

<script setup lang="ts">
import { Building, Briefcase, Users, TrendingUp, Globe, Award } from 'lucide-vue-next'
import ServicePageLayout from '@/components/custom/navigation/ServicePageLayout.vue'

const lhhService = {
  title: 'LHH (Lee Hecht Harrison)',
  description: 'Global talent solutions and career transition services to help organizations and individuals navigate workforce transformation and career development',
  features: [
    {
      icon: Briefcase,
      title: 'Career Transition',
      description: 'Professional outplacement services to support employees during career transitions'
    },
    {
      icon: Users,
      title: 'Leadership Consulting',
      description: 'Strategic leadership development and executive coaching services'
    },
    {
      icon: TrendingUp,
      title: 'Talent Mobility',
      description: 'Internal talent movement and career progression planning solutions'
    },
    {
      icon: Globe,
      title: 'Global Network',
      description: 'Access to LHH\'s worldwide network of career transition and talent experts'
    },
    {
      icon: Award,
      title: 'Executive Search',
      description: 'Premium executive search and recruitment services for senior-level positions'
    },
    {
      icon: Building,
      title: 'Organizational Consulting',
      description: 'Strategic consulting to optimize organizational structure and performance'
    }
  ],
  benefits: [
    {
      title: 'Seamless Transitions',
      description: 'Smooth career transitions with minimal disruption to business operations'
    },
    {
      title: 'Enhanced Reputation',
      description: 'Maintain positive employer brand during organizational changes'
    },
    {
      title: 'Cost Optimization',
      description: 'Efficient workforce transition solutions that control costs and risks'
    },
    {
      title: 'Global Expertise',
      description: 'Leverage international best practices and proven methodologies'
    },
    {
      title: 'Strategic Alignment',
      description: 'Align talent strategies with business objectives and market demands'
    }
  ]
}
</script>