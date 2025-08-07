<template>
  <Card class="my-8">
    <CardHeader>
      <CardTitle class="text-foreground uppercase">Ipro</CardTitle>
    </CardHeader>
    <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead class="w-[200px]">Category</TableHead>
            <TableHead class="text-center">Scores</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <template v-if="isLoading">
            <DataViewTableSkeleton />
          </template>

          <template v-else>
            <TableRow>
              <TableCell class="font-medium">Openness</TableCell>
              <TableCell class="text-center">{{ props.openness ? props.openness : '-' }}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell class="font-medium">Neuroticism</TableCell>
              <TableCell class="text-center">{{
                props.neuroticism ? props.neuroticism : '-'
              }}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell class="font-medium">Extraversion</TableCell>
              <TableCell class="text-center">{{
                props.extraversion ? props.extraversion : '-'
              }}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell class="font-medium">Agreeableness</TableCell>
              <TableCell class="text-center">{{
                props.agreeableness ? props.agreeableness : '-'
              }}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell class="font-medium">Conscientiousness</TableCell>
              <TableCell class="text-center">{{
                props.conscientiousness ? props.conscientiousness : '-'
              }}</TableCell>
            </TableRow>
          </template>
        </TableBody>
      </Table>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { IPROInterface } from '@/types/userType'
import DataViewTableSkeleton from '../skeletons/DataViewTableSkeleton.vue'

interface IproInterface extends IPROInterface {
  isLoading: boolean
}

const props = defineProps<IproInterface>()
</script>
