<template>
  <ServicePageLayout :service="evaluationAssessmentService" :icon-component="ClipboardCheck" />
</template>

<script setup lang="ts">
import { ClipboardCheck, Search, BarChart, Users, CheckCircle, Target } from 'lucide-vue-next'
import ServicePageLayout from '@/components/custom/navigation/ServicePageLayout.vue'

const evaluationAssessmentService = {
  title: 'Evaluation Selection & Assessment',
  description: 'Comprehensive assessment solutions for talent evaluation, selection, and performance measurement to make informed hiring and development decisions',
  features: [
    {
      icon: Search,
      title: 'Talent Assessment',
      description: 'In-depth evaluation of candidate skills, competencies, and cultural fit'
    },
    {
      icon: BarChart,
      title: 'Psychometric Testing',
      description: 'Scientific psychological assessments to understand personality traits and cognitive abilities'
    },
    {
      icon: Users,
      title: 'Interview Evaluation',
      description: 'Structured interview processes with standardized evaluation criteria'
    },
    {
      icon: CheckCircle,
      title: 'Competency Mapping',
      description: 'Detailed analysis of required competencies for specific roles and positions'
    },
    {
      icon: Target,
      title: 'Performance Prediction',
      description: 'Data-driven insights to predict candidate success and job performance'
    },
    {
      icon: ClipboardCheck,
      title: 'Comprehensive Reports',
      description: 'Detailed assessment reports with actionable insights and recommendations'
    }
  ],
  benefits: [
    {
      title: 'Better Hiring Decisions',
      description: 'Reduce hiring mistakes with comprehensive candidate evaluation and assessment'
    },
    {
      title: 'Reduced Turnover',
      description: 'Improve employee retention by selecting candidates who are the right fit'
    },
    {
      title: 'Objective Selection',
      description: 'Eliminate bias with standardized, scientific assessment methodologies'
    },
    {
      title: 'Time Efficiency',
      description: 'Streamline the selection process with efficient and reliable assessment tools'
    },
    {
      title: 'Quality Workforce',
      description: 'Build a high-performing team with candidates who match your requirements'
    }
  ]
}
</script>