<template>
  <ServicePageLayout :service="learningDevelopmentService" :icon-component="GraduationCap" />
</template>

<script setup lang="ts">
import { GraduationCap, BookOpen, Target, Users, Award, TrendingUp } from 'lucide-vue-next'
import ServicePageLayout from '@/components/custom/navigation/ServicePageLayout.vue'

const learningDevelopmentService = {
  title: 'Learning & Development',
  description: 'Comprehensive training and skill development programs to enhance your workforce capabilities and drive organizational growth',
  features: [
    {
      icon: BookOpen,
      title: 'Customized Training Programs',
      description: 'Tailored learning solutions designed to meet your organization\'s specific needs and objectives'
    },
    {
      icon: Target,
      title: 'Skills Assessment',
      description: 'Comprehensive evaluation of current skill levels and identification of development opportunities'
    },
    {
      icon: Users,
      title: 'Team Building Workshops',
      description: 'Interactive sessions to enhance collaboration, communication, and team dynamics'
    },
    {
      icon: Award,
      title: 'Leadership Development',
      description: 'Specialized programs to develop effective leaders at all organizational levels'
    },
    {
      icon: TrendingUp,
      title: 'Performance Tracking',
      description: 'Continuous monitoring and evaluation of learning outcomes and skill development progress'
    },
    {
      icon: GraduationCap,
      title: 'Professional Certification',
      description: 'Industry-recognized certifications to validate and enhance employee credentials'
    }
  ],
  benefits: [
    {
      title: 'Enhanced Skills',
      description: 'Systematic development of technical and soft skills across your organization'
    },
    {
      title: 'Improved Performance',
      description: 'Measurable increases in employee productivity and job performance'
    },
    {
      title: 'Career Advancement',
      description: 'Clear pathways for employee growth and professional development'
    },
    {
      title: 'Innovation Culture',
      description: 'Foster a learning environment that encourages creativity and innovation'
    },
    {
      title: 'Competitive Advantage',
      description: 'Stay ahead of industry trends with cutting-edge training and development'
    }
  ]
}
</script>