<template>
  <Card class="my-8">
    <CardHeader>
      <CardTitle class="text-foreground uppercase">Ipros</CardTitle>
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
              <TableCell class="font-medium">Driver</TableCell>
              <TableCell class="text-center">{{ props.driver ? props.driver : '-' }}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell class="font-medium">Amiable</TableCell>
              <TableCell class="text-center">{{ props.amiable ? props.amiable : '-' }}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell class="font-medium">Analytical</TableCell>
              <TableCell class="text-center">{{
                props.analytical ? props.analytical : '-'
              }}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell class="font-medium">Expressive</TableCell>
              <TableCell class="text-center">{{
                props.expressive ? props.expressive : '-'
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
import type { IPROSInterface } from '@/types/userType'

interface IprosInterface extends IPROSInterface {
  isLoading: boolean
}
const props = defineProps<IprosInterface>()
</script>
