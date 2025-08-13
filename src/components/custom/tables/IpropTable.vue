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
              <TableCell class="font-medium">Inisiatif</TableCell>
              <TableCell class="text-center">{{ props.inisiatif ? props.inisiatif : '-' }}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell class="font-medium">Kerjasama</TableCell>
              <TableCell class="text-center">{{ props.kerjasama ? props.kerjasama : '-' }}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell class="font-medium">Kepemimpinan</TableCell>
              <TableCell class="text-center">{{ props.kepemimpinan ? props.kepemimpinan : '-' }}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell class="font-medium">Fleksibilitas</TableCell>
              <TableCell class="text-center">{{ props.fleksibilitas ? props.fleksibilitas : '-' }}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell class="font-medium">Komitmen Tugas</TableCell>
              <TableCell class="text-center">{{ props.komitmenTugas ? props.komitmenTugas : '-' }}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell class="font-medium">Kecerdasan Umum</TableCell>
              <TableCell class="text-center">{{ props.kecerdasanUmum ? props.kecerdasanUmum : '-' }}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell class="font-medium">Logika Berpikir</TableCell>
              <TableCell class="text-center">{{ props.logikaBerpikir ? props.logikaBerpikir : '-' }}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell class="font-medium">Kelincahan Pikir</TableCell>
              <TableCell class="text-center">{{ props.kelincahanPikir ? props.kelincahanPikir : '-' }}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell class="font-medium">Kepercayaan Diri</TableCell>
              <TableCell class="text-center">{{ props.kepercayaanDiri ? props.kepercayaanDiri : '-' }}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell class="font-medium">Penyesuaian Diri</TableCell>
              <TableCell class="text-center">{{ props.penyesuaianDiri ? props.penyesuaianDiri : '-' }}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell class="font-medium">Stabilitas Emosi</TableCell>
              <TableCell class="text-center">{{ props.stabilitasEmosi ? props.stabilitasEmosi : '-' }}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell class="font-medium">Sistematika Kerja</TableCell>
              <TableCell class="text-center">{{ props.sistematikaKerja ? props.sistematikaKerja : '-' }}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell class="font-medium">Daya Analisa Sintesa</TableCell>
              <TableCell class="text-center">{{ props.dayaAnalisaSintesa ? props.dayaAnalisaSintesa : '-' }}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell class="font-medium">Daya Berpikir Abstrak</TableCell>
              <TableCell class="text-center">{{ props.dayaBerpikirAbtrak ? props.dayaBerpikirAbtrak : '-' }}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell class="font-medium">Daya Tahan Kerja Rutin</TableCell>
              <TableCell class="text-center">{{ props.dayaTahanKerjaRutin ? props.dayaTahanKerjaRutin : '-' }}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell class="font-medium">Motivasi Berprestasi</TableCell>
              <TableCell class="text-center">{{ props.motivasiBerprestasi ? props.motivasiBerprestasi : '-' }}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell class="font-medium">Daya Tahan Kerja Stress</TableCell>
              <TableCell class="text-center">{{ props.dayaTahanKerjaStress ? props.dayaTahanKerjaStress : '-' }}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell class="font-medium">Pengambilan Keputusan</TableCell>
              <TableCell class="text-center">{{ props.pengambilanKeputusan ? props.pengambilanKeputusan : '-' }}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell class="font-medium">Hubungan Interpersonal</TableCell>
              <TableCell class="text-center">{{ props.hubunganInterpersonal ? props.hubunganInterpersonal : '-' }}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell class="font-medium">Perencanaan Dan Perorganisasian</TableCell>
              <TableCell class="text-center">{{ props.perencanaanDanPerorganisasian ? props.perencanaanDanPerorganisasian : '-' }}</TableCell>
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

interface IprobInterface extends Partial<IPROBInterface> {
  isLoading: boolean
}

const props = defineProps<IprobInterface>()
</script>
