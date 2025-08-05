<template>
  <Card class="w-full">
    <CardHeader>
      <CardTitle class="text-foreground">User Data</CardTitle>
      <CardDescription class="text-muted-foreground"> A list of all user scores. </CardDescription>

      <!-- <p class="text-muted-foreground">{{ profilesData?.last_analyzed.date }}</p>
      <p class="text-muted-foreground">{{ profilesData?.last_analyzed.score }}</p>
      <p class="text-muted-foreground">{{ profilesData?.last_analyzed.service }}</p> -->
    </CardHeader>
  </Card>

  <IproTable
    :openness="profilesData?.ipro?.openness"
    :agreeableness="profilesData?.ipro?.agreeableness"
    :extraversion="profilesData?.ipro?.extraversion"
    :neuroticism="profilesData?.ipro?.neuroticism"
    :conscientiousness="profilesData?.ipro?.conscientiousness"
    :is-loading="isLoading"
  />

  <IprosTable
    :driver="profilesData?.ipros?.driver"
    :amiable="profilesData?.ipros?.amiable"
    :analytical="profilesData?.ipros?.analytical"
    :expressive="profilesData?.ipros?.expressive"
    :is-loading="isLoading"
  />

  <IpropTable
    :openness="profilesData?.iprob?.openness"
    :agreeableness="profilesData?.iprob?.agreeableness"
    :extraversion="profilesData?.iprob?.extraversion"
    :neuroticism="profilesData?.iprob?.neuroticism"
    :conscientiousness="profilesData?.iprob?.conscientiousness"
    :is-loading="isLoading"
  />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import IproTable from '@/components/custom/tables/IproTable.vue'
import IprosTable from '@/components/custom/tables/IprosTable.vue'
import IpropTable from '@/components/custom/tables/IpropTable.vue'
import { getProfile } from '@/api/getProfile'

interface IproScore {
  openness: number
  neuroticism: number
  extraversion: number
  agreeableness: number
  conscientiousness: number
}

interface IprosScore {
  driver: number
  amiable: number
  analytical: number
  expressive: number
}

interface AnalyzedInterface {
  date: Date
  score: number
  service: string
}

interface UserProfileInterface {
  id: string
  name: string
  ipro?: IproScore
  iprob?: IproScore
  ipros?: IprosScore
  last_analyzed: AnalyzedInterface
  created_at: string
  updated_at: string
}

const profilesData = ref<UserProfileInterface>()
const isLoading = ref(false)

onMounted(async () => {
  isLoading.value = true
  const data = await getProfile()

  if (data) {
    if (data.ipro || data.iprob || data.ipros) {
      const processedData: UserProfileInterface = {
        ...data,
        ipro: JSON.parse(data.ipro),
        iprob: JSON.parse(data.iprob),
        ipros: JSON.parse(data.ipros),
        last_analyzed: JSON.parse(data.last_analyzed),
      }
      profilesData.value = processedData
    }
  }
  isLoading.value = false
})
</script>
