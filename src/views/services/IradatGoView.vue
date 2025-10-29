<template>
  <ServicePageLayout :service="iradatGoService" :icon-component="Smartphone" />
</template>

<script setup lang="ts">
import { Smartphone, Zap, Shield, BarChart, Clock, Users } from 'lucide-vue-next'
import ServicePageLayout from '@/components/custom/navigation/ServicePageLayout.vue'

const iradatGoService = {
  title: 'Iradat Go',
  description: 'Mobile-first assessment platform that brings psychological evaluation and testing capabilities directly to your smartphone for convenient, anytime access',
  features: [
    {
      icon: Smartphone,
      title: 'Mobile Assessment',
      description: 'Complete psychological assessments directly from your mobile device'
    },
    {
      icon: Zap,
      title: 'Instant Results',
      description: 'Real-time processing and immediate delivery of assessment results'
    },
    {
      icon: Shield,
      title: 'Secure Platform',
      description: 'Enterprise-grade security ensuring data privacy and confidentiality'
    },
    {
      icon: BarChart,
      title: 'Interactive Dashboards',
      description: 'Comprehensive analytics and visualization of assessment data'
    },
    {
      icon: Clock,
      title: '24/7 Availability',
      description: 'Access assessments anytime, anywhere with offline capability'
    },
    {
      icon: Users,
      title: 'Multi-user Support',
      description: 'Collaborative features for teams, managers, and HR professionals'
    }
  ],
  benefits: [
    {
      title: 'Increased Accessibility',
      description: 'Remove geographical barriers and enable remote assessment capabilities'
    },
    {
      title: 'Cost Efficiency',
      description: 'Reduce administrative costs with automated, digital assessment processes'
    },
    {
      title: 'Faster Processing',
      description: 'Accelerate assessment cycles with instant digital delivery and results'
    },
    {
      title: 'Better Engagement',
      description: 'Modern, user-friendly interface increases participant completion rates'
    },
    {
      title: 'Scalable Solution',
      description: 'Easily scale assessment programs across large organizations and multiple locations'
    }
  ]
}
</script>