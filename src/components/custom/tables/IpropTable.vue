<template>
  <Card class="my-8">
    <CardHeader>
      <CardTitle class="text-foreground uppercase">Iprop</CardTitle>
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
              <TableCell class="font-medium">Compliance</TableCell>
              <TableCell class="text-center">{{
                props.compliance ? props.compliance : '-'
              }}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell class="font-medium">Dominant</TableCell>
              <TableCell class="text-center">{{ props.dominant ? props.dominant : '-' }}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell class="font-medium">Influence</TableCell>
              <TableCell class="text-center">{{
                props.influence ? props.influence : '-'
              }}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell class="font-medium">Steadiness</TableCell>
              <TableCell class="text-center">{{
                props.steadiness ? props.steadiness : '-'
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
import DataViewTableSkeleton from '../skeletons/DataViewTableSkeleton.vue'
import type { IPROBInterface } from '@/types/userType'

interface IprobInterface extends IPROBInterface {
  isLoading: boolean
}

const props = defineProps<IprobInterface>()
</script>
