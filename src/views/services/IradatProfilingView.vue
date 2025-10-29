<template>
  <ServicePageLayout :service="iradatProfilingService" :icon-component="User" />
</template>

<script setup lang="ts">
import { User, Brain, Target, BarChart, FileText, CheckCircle } from 'lucide-vue-next'
import ServicePageLayout from '@/components/custom/navigation/ServicePageLayout.vue'

const iradatProfilingService = {
  title: 'Iradat - Profiling',
  description: 'Advanced psychological profiling services that provide deep insights into personality traits, behavioral patterns, and professional competencies',
  features: [
    {
      icon: Brain,
      title: 'Psychological Analysis',
      description: 'Comprehensive psychological evaluation using scientifically validated assessment tools'
    },
    {
      icon: Target,
      title: 'Behavioral Profiling',
      description: 'Detailed analysis of behavioral patterns and personality characteristics'
    },
    {
      icon: BarChart,
      title: 'Competency Assessment',
      description: 'Evaluation of professional competencies and skill sets for specific roles'
    },
    {
      icon: FileText,
      title: 'Detailed Reports',
      description: 'Comprehensive profiling reports with actionable insights and recommendations'
    },
    {
      icon: CheckCircle,
      title: 'Validated Methods',
      description: 'Research-based assessment methodologies with proven reliability and validity'
    },
    {
      icon: User,
      title: 'Personal Development',
      description: 'Personalized development plans based on individual profiling results'
    }
  ],
  benefits: [
    {
      title: 'Self-Awareness',
      description: 'Enhanced understanding of personal strengths, weaknesses, and behavioral patterns'
    },
    {
      title: 'Career Guidance',
      description: 'Data-driven career recommendations aligned with personality and competencies'
    },
    {
      title: 'Team Optimization',
      description: 'Better team composition and dynamics through individual profiling insights'
    },
    {
      title: 'Performance Improvement',
      description: 'Targeted development strategies based on comprehensive personality analysis'
    },
    {
      title: 'Decision Support',
      description: 'Informed decision-making for recruitment, promotion, and development initiatives'
    }
  ]
}
</script>