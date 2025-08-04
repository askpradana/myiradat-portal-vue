<template>
  <Card class="w-full">
    <CardHeader>
      <CardTitle class="text-foreground">User Data</CardTitle>
      <CardDescription class="text-muted-foreground"> A list of all user scores. </CardDescription>
    </CardHeader>
  </Card>

  <IproTable
    :openness="dataDummy.openness"
    :agreeableness="dataDummy.agreeableness"
    :extraversion="dataDummy.extraversion"
    :neuroticism="dataDummy.neuroticism"
    :conscientiousness="dataDummy.conscientiousness"
  />

  <IprosTable
    :openness="dataDummy.openness"
    :agreeableness="dataDummy.agreeableness"
    :extraversion="dataDummy.extraversion"
    :neuroticism="dataDummy.neuroticism"
    :conscientiousness="dataDummy.conscientiousness"
  />
  <IpropTable
    :openness="dataDummy.openness"
    :agreeableness="dataDummy.agreeableness"
    :extraversion="dataDummy.extraversion"
    :neuroticism="dataDummy.neuroticism"
    :conscientiousness="dataDummy.conscientiousness"
  />
</template>

<script setup lang="ts">
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import IproTable from '@/components/custom/tables/IproTable.vue'
import IprosTable from '@/components/custom/tables/IprosTable.vue'
import IpropTable from '@/components/custom/tables/IpropTable.vue'
import { useUserStore } from '@/stores/userStores'

const userStore = useUserStore()

console.log(userStore.token)

const dataDummy = {
  openness: 85,
  neuroticism: 25,
  extraversion: 78,
  agreeableness: 88,
  conscientiousness: 92,
}
</script>
