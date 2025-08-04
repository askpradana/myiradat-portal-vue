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
          <TableRow>
            <TableCell class="font-medium">Openness</TableCell>
            <TableCell class="text-center">{{ props.openness }}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell class="font-medium">Neuroticism</TableCell>
            <TableCell class="text-center">{{ props.neuroticism }}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell class="font-medium">Extraversion</TableCell>
            <TableCell class="text-center">{{ props.extraversion }}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell class="font-medium">Agreeableness</TableCell>
            <TableCell class="text-center">{{ props.agreeableness }}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell class="font-medium">Conscientiousness</TableCell>
            <TableCell class="text-center">{{ props.conscientiousness }}</TableCell>
          </TableRow>
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

const props = defineProps<{
  openness: number | undefined
  neuroticism: number | undefined
  extraversion: number | undefined
  agreeableness: number | undefined
  conscientiousness: number | undefined
}>()
</script>
