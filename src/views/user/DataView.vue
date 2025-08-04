<template>
  <Card class="w-full">
    <CardHeader>
      <CardTitle class="text-foreground">User Data</CardTitle>
      <CardDescription class="text-muted-foreground"> A list of all user scores. </CardDescription>
    </CardHeader>
  </Card>

  <IproTable
    :openness="profilesData?.ipro.openness"
    :agreeableness="profilesData?.ipro?.agreeableness"
    :extraversion="profilesData?.ipro?.extraversion"
    :neuroticism="profilesData?.ipro?.neuroticism"
    :conscientiousness="profilesData?.ipro?.conscientiousness"
  />

  <IprosTable
    :driver="profilesData?.ipros?.driver"
    :amiable="profilesData?.ipros?.amiable"
    :analytical="profilesData?.ipros?.analytical"
    :expressive="profilesData?.ipros?.expressive"
  />

  <IpropTable
    :openness="profilesData?.iprob?.openness"
    :agreeableness="profilesData?.iprob?.agreeableness"
    :extraversion="profilesData?.iprob?.extraversion"
    :neuroticism="profilesData?.iprob?.neuroticism"
    :conscientiousness="profilesData?.iprob?.conscientiousness"
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

interface UserProfileInterface {
  id: string
  name: string
  ipro: IproScore
  iprob: IproScore
  ipros: IprosScore
  created_at: string
  updated_at: string
}

const profilesData = ref<UserProfileInterface>()

onMounted(async () => {
  const data = await getProfile()

  if (data) {
    const processedData: UserProfileInterface = {
      ...data,
      ipro: JSON.parse(data.ipro),
      iprob: JSON.parse(data.iprob),
      ipros: JSON.parse(data.ipros),
    }
    profilesData.value = processedData
  }
})
</script>
