<template>
  <Button @click="backToDashboard" variant="default"> <ArrowLeft /> Back to dashboard </Button>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import Button from '@/components/ui/button/Button.vue'
import { ArrowLeft } from 'lucide-vue-next'

const router = useRouter()

const backToDashboard = () => {
  router.push('/dashboard')
}
</script>
