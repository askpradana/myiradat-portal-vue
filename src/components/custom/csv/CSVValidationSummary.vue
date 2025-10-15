<template>
  <Card>
    <CardHeader>
      <CardTitle class="flex items-center justify-between">
        <span>CSV Review Summary</span>
        <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
          <FileText class="w-4 h-4" />
          {{ summary.file_name }}
        </div>
      </CardTitle>
    </CardHeader>

    <CardContent class="space-y-4">
      <!-- File Information -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
        <div class="text-center">
          <p class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ summary.total_rows }}</p>
          <p class="text-sm text-gray-600 dark:text-gray-300">Total Rows</p>
        </div>
        <div class="text-center">
          <p class="text-2xl font-bold text-green-600">{{ summary.valid_rows }}</p>
          <p class="text-sm text-gray-600 dark:text-gray-300">Valid</p>
        </div>
        <div class="text-center">
          <p class="text-2xl font-bold text-red-600">{{ summary.invalid_rows }}</p>
          <p class="text-sm text-gray-600 dark:text-gray-300">Invalid</p>
        </div>
        <div class="text-center">
          <p class="text-2xl font-bold text-yellow-600">{{ summary.warning_rows }}</p>
          <p class="text-sm text-gray-600 dark:text-gray-300">Warnings</p>
        </div>
      </div>

      <!-- File Details -->
      <div class="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
        <div class="flex items-center gap-1">
          <Clock class="w-3 h-3" />
          <span>Processed in {{ summary.processing_time }}</span>
        </div>
        <div class="flex items-center gap-1">
          <HardDrive class="w-3 h-3" />
          <span>{{ formatFileSize(summary.file_size_bytes) }}</span>
        </div>
        <div class="flex items-center gap-1">
          <FileType class="w-3 h-3" />
          <span>{{ summary.file_format.toUpperCase() }}</span>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-wrap gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button
          v-if="summary.invalid_rows > 0"
          variant="outline"
          size="sm"
          @click="$emit('select-invalid')"
          class="flex items-center gap-2"
        >
          <AlertTriangle class="w-4 h-4" />
          Select Invalid Rows
        </Button>

        <Button
          v-if="summary.valid_rows > 0"
          variant="outline"
          size="sm"
          @click="$emit('select-valid')"
          class="flex items-center gap-2"
        >
          <CheckCircle class="w-4 h-4" />
          Select Valid Rows
        </Button>

        <Button
          variant="outline"
          size="sm"
          @click="$emit('select-all')"
          class="flex items-center gap-2"
        >
          <CheckSquare class="w-4 h-4" />
          Select All
        </Button>

        <Button
          variant="outline"
          size="sm"
          @click="$emit('clear-selection')"
          class="flex items-center gap-2"
        >
          <Square class="w-4 h-4" />
          Clear Selection
        </Button>
      </div>

      <!-- Validation Status Alert -->
      <div v-if="summary.invalid_rows > 0" class="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <div class="flex items-start gap-2">
          <AlertTriangle class="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
          <div>
            <h4 class="text-sm font-medium text-red-800 dark:text-red-200">Validation Issues Found</h4>
            <p class="text-sm text-red-700 dark:text-red-300 mt-1">
              {{ summary.invalid_rows }} {{ summary.invalid_rows === 1 ? 'row has' : 'rows have' }} validation errors.
              Please review and fix the highlighted issues before proceeding with registration.
            </p>
          </div>
        </div>
      </div>

      <div v-else-if="summary.warning_rows > 0" class="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
        <div class="flex items-start gap-2">
          <AlertTriangle class="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
          <div>
            <h4 class="text-sm font-medium text-yellow-800 dark:text-yellow-200">Minor Issues Found</h4>
            <p class="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
              {{ summary.warning_rows }} {{ summary.warning_rows === 1 ? 'row has' : 'rows have' }} warnings.
              You can still proceed with registration, but please review the highlighted items.
            </p>
          </div>
        </div>
      </div>

      <div v-else class="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
        <div class="flex items-start gap-2">
          <CheckCircle class="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
          <div>
            <h4 class="text-sm font-medium text-green-800 dark:text-green-200">All Data Valid</h4>
            <p class="text-sm text-green-700 dark:text-green-300 mt-1">
              All rows have passed validation. You can proceed with batch registration.
            </p>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import {
  FileText,
  Clock,
  HardDrive,
  FileType,
  AlertTriangle,
  CheckCircle,
  CheckSquare,
  Square
} from 'lucide-vue-next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { BatchRegisterCSVData } from '@/api/users/createUserCSV'

interface Props {
  summary: BatchRegisterCSVData['summary']
}

defineProps<Props>()

defineEmits<{
  'select-invalid': []
  'select-valid': []
  'select-all': []
  'clear-selection': []
}>()

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}
</script>