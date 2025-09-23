<template>
  <Button @click="backToQuizHub" variant="ghost" size="sm">
    <ArrowLeft class="h-4 w-4 mr-2" />
    Kembali ke Pilihan Quiz
  </Button>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-vue-next'

const router = useRouter()

const backToQuizHub = () => {
  router.push('/quiz')
}
</script>
