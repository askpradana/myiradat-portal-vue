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
              <TableCell class="font-medium">Kemandirian</TableCell>
              <TableCell class="text-center">{{ props.kemandirian ? props.kemandirian : '-' }}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell class="font-medium">Ketangguhan</TableCell>
              <TableCell class="text-center">{{ props.ketangguhan ? props.ketangguhan : '-' }}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell class="font-medium">Kecerdasan Umum</TableCell>
              <TableCell class="text-center">{{ props.kecerdasanUmum ? props.kecerdasanUmum : '-' }}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell class="font-medium">Ketelitian Kerja</TableCell>
              <TableCell class="text-center">{{ props.ketelitianKerja ? props.ketelitianKerja : '-' }}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell class="font-medium">Penalaran Verbal</TableCell>
              <TableCell class="text-center">{{ props.penalaranVerbal ? props.penalaranVerbal : '-' }}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell class="font-medium">Penyesuaian Diri</TableCell>
              <TableCell class="text-center">{{ props.penyesuaianDiri ? props.penyesuaianDiri : '-' }}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell class="font-medium">Penalaran Numerik</TableCell>
              <TableCell class="text-center">{{ props.penalaranNumerik ? props.penalaranNumerik : '-' }}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell class="font-medium">Sistematika Kerja</TableCell>
              <TableCell class="text-center">{{ props.sistematikaKerja ? props.sistematikaKerja : '-' }}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell class="font-medium">Penalaran Non Verbal</TableCell>
              <TableCell class="text-center">{{ props.penalaranNonVerbal ? props.penalaranNonVerbal : '-' }}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell class="font-medium">Kecepatan Perseptual</TableCell>
              <TableCell class="text-center">{{ props.kecepatanPerseptual ? props.kecepatanPerseptual : '-' }}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell class="font-medium">Motivasi Berprestasi</TableCell>
              <TableCell class="text-center">{{ props.motivasiBerprestasi ? props.motivasiBerprestasi : '-' }}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell class="font-medium">Hubungan Interpersonal</TableCell>
              <TableCell class="text-center">{{ props.hubunganInterpersonal ? props.hubunganInterpersonal : '-' }}</TableCell>
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

interface IprosInterface extends Partial<IPROSInterface> {
  isLoading: boolean
}
const props = defineProps<IprosInterface>()
</script>
