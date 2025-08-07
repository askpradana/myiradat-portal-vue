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
    :compliance="profilesData?.iprob?.compliance"
    :dominant="profilesData?.iprob?.dominant"
    :influence="profilesData?.iprob?.influence"
    :steadiness="profilesData?.iprob?.steadiness"
    :is-loading="isLoading"
  />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import IproTable from '@/components/custom/tables/IproTable.vue'
import IprosTable from '@/components/custom/tables/IprosTable.vue'
import IpropTable from '@/components/custom/tables/IpropTable.vue'
import { getProfile } from '@/api/users/getProfile'
import type { UserDataInterface } from '@/types/userType'

const profilesData = ref<UserDataInterface>()
const isLoading = ref(false)

onMounted(async () => {
  isLoading.value = true
  const data = await getProfile()

  if (data) {
    if (data.ipro || data.iprob || data.ipros) {
      const processedData: UserDataInterface = {
        ...data,
        ipro: typeof data.ipro === 'string' ? JSON.parse(data.ipro) : data.ipro,
        iprob: typeof data.iprob === 'string' ? JSON.parse(data.iprob) : data.iprob,
        ipros: typeof data.ipros === 'string' ? JSON.parse(data.ipros) : data.ipros,
        last_analyzed:
          typeof data.last_analyzed === 'string'
            ? JSON.parse(data.last_analyzed)
            : data.last_analyzed,
      }
      profilesData.value = processedData
    }
  }
  isLoading.value = false
})
</script>
