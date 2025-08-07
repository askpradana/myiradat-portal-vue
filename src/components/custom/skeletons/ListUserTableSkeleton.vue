<template>
  <TableRow v-for="i in 10" :key="i">
    <TableCell class="font-medium">
      <Skeleton class="h-4 w-32" />
    </TableCell>
    <TableCell class="text-center">
      <Skeleton class="h-4 w-16 mx-auto" />
    </TableCell>
    <TableCell class="text-center">
      <Skeleton class="h-4 w-16 mx-auto" />
    </TableCell>
    <TableCell class="text-center">
      <Skeleton class="h-4 w-16 mx-auto" />
    </TableCell>
    <TableCell class="text-center">
      <Skeleton class="h-4 w-16 mx-auto" />
    </TableCell>
  </TableRow>
</template>

<script setup lang="ts">
import { Skeleton } from '@/components/ui/skeleton'
import { TableCell, TableRow } from '@/components/ui/table'
</script>
