<template>
  <div class="mb-8 grid gap-6 grid-cols-1 sm:grid-cols-2">
    <Card>
      <CardHeader>
        <CardTitle class="text-sm font-bold text-foreground">Ipro</CardTitle>
        <CardContent class="px-0">
          <div class="flex justify-between items-center w-full gap-2 mt-2">
            <a
              href="https://ipro-student.vercel.app/"
              target="_blank"
              class="flex items-center justify-center gap-2 text-sm text-slate-500 hover:underline hover:text-violet-500 dark:text-slate-300 dark:hover:text-white"
              ><SquareArrowOutUpRight :size="20" /> Visit website</a
            >

            <span class="bg-yellow-400/50 p-1.5 rounded">
              <Server />
            </span>
          </div>
        </CardContent>
      </CardHeader>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle class="text-sm font-bold text-foreground">Ipro Business</CardTitle>

        <CardContent class="px-0">
          <div class="flex justify-between items-center w-full gap-2 mt-2">
            <a
              href="https://iprob.iradatkonsultan.com/"
              target="_blank"
              class="flex items-center justify-center gap-2 text-sm text-slate-500 hover:underline hover:text-violet-500 dark:text-slate-300 dark:hover:text-white"
              ><SquareArrowOutUpRight :size="20" /> Visit website
            </a>

            <span class="bg-violet-400/50 p-1.5 rounded">
              <ClipboardCheck />
            </span>
          </div>
        </CardContent>
      </CardHeader>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle class="text-sm font-bold text-foreground">Ipro Student</CardTitle>

        <CardContent class="px-0">
          <div class="flex justify-between items-center w-full gap-2 mt-2">
            <a
              href="http://ipros.iradatkonsultan.com/"
              target="_blank"
              class="flex items-center justify-center gap-2 text-sm text-slate-500 hover:underline hover:text-violet-500 dark:text-slate-300 dark:hover:text-white"
              ><SquareArrowOutUpRight :size="20" /> Visit website</a
            >

            <span class="bg-green-400/50 p-1.5 rounded">
              <Hospital />
            </span>
          </div>
        </CardContent>
      </CardHeader>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle class="text-sm font-bold text-foreground">Improve Care</CardTitle>

        <CardContent class="px-0">
          <div class="flex justify-between items-center w-full gap-2 mt-2">
            <a
              href="https://improvecare.iradatkonsultan.com/"
              target="_blank"
              class="flex items-center justify-center gap-2 text-sm text-slate-500 hover:underline hover:text-violet-500 dark:text-slate-300 dark:hover:text-white"
              ><SquareArrowOutUpRight :size="20" /> Visit website</a
            >

            <span class="bg-blue-400/50 p-1.5 rounded">
              <ChartPie />
            </span>
          </div>
        </CardContent>
      </CardHeader>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import CardContent from '@/components/ui/card/CardContent.vue'
import { SquareArrowOutUpRight } from 'lucide-vue-next'
import { ChartPie, Hospital, ClipboardCheck, Server } from 'lucide-vue-next'
</script>
