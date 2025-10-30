<template>
  <ServicePageLayout :service="eapImproveService" :icon-component="Heart" />
</template>

<script setup lang="ts">
import { Heart, Users, Shield, TrendingUp, Clock, Award } from 'lucide-vue-next'
import ServicePageLayout from '@/components/custom/navigation/ServicePageLayout.vue'

const eapImproveService = {
  title: 'EAP Improve',
  description: 'Comprehensive Employee Assistance Program designed to support your workforce\'s mental health and well-being',
  features: [
    {
      icon: Heart,
      title: 'Mental Health Support',
      description: 'Professional counseling and psychological support for employees facing personal or work-related challenges'
    },
    {
      icon: Users,
      title: '24/7 Helpline',
      description: 'Round-the-clock access to trained counselors and mental health professionals'
    },
    {
      icon: Shield,
      title: 'Confidential Services',
      description: 'Complete privacy and confidentiality for all employee interactions and sessions'
    },
    {
      icon: TrendingUp,
      title: 'Performance Improvement',
      description: 'Proven strategies to enhance employee performance and workplace satisfaction'
    },
    {
      icon: Clock,
      title: 'Crisis Intervention',
      description: 'Immediate support and intervention services for employees in crisis situations'
    },
    {
      icon: Award,
      title: 'Expert Therapists',
      description: 'Access to certified and experienced mental health professionals across Indonesia'
    }
  ],
  benefits: [
    {
      title: 'Reduced Absenteeism',
      description: 'Significant decrease in sick days and unplanned absences through proactive mental health support'
    },
    {
      title: 'Improved Productivity',
      description: 'Enhanced focus and performance when employees feel supported and valued'
    },
    {
      title: 'Lower Turnover',
      description: 'Increased employee retention through comprehensive well-being programs'
    },
    {
      title: 'Cost Savings',
      description: 'Reduced healthcare costs and improved overall organizational efficiency'
    },
    {
      title: 'Better Workplace Culture',
      description: 'Creating a supportive environment that prioritizes employee mental health'
    }
  ]
}
</script>