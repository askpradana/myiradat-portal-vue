<script setup lang="ts">
import { ref, computed } from 'vue'
import { AlertDialogOverlay, AlertDialogPortal, AlertDialogRoot, AlertDialogTrigger } from 'reka-ui'
import {
  AlertDialogContent,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Upload, FileText, X } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import { Button } from '@/components/ui/button'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
// import { BatchRegisterCSVAPIResponse } from '@/api/users/createUserCSV'
import { RegisterUserByCSV } from '@/api/users/createUserCSV'

const open = ref(false)
const selectedFile = ref<File | null>(null)
const isDragOver = ref(false)
const fileInputRef = ref<HTMLInputElement | null>(null)

const queryClient = useQueryClient()

const { mutate: uploadCSV, isPending } = useMutation({
  mutationFn: RegisterUserByCSV,
  onSuccess: (response) => {
    if (response) {
      toast('Success', {
        description: `${response?.message}`,
      })
      queryClient.invalidateQueries({ queryKey: ['users'] })
      resetAndClose()
    }
  },
  onError: (error) => {
    toast('Error', {
      description: `Failed to upload CSV: ${error.message}`,
    })
  },
})

const fileSize = computed(() => {
  if (!selectedFile.value) return ''
  const size = selectedFile.value.size
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
  return `${(size / (1024 * 1024)).toFixed(1)} MB`
})

const isValidCSV = computed(() => {
  if (!selectedFile.value) return true
  return selectedFile.value.type === 'text/csv' || selectedFile.value.name.endsWith('.csv')
})

const handleDragEnter = (e: DragEvent) => {
  e.preventDefault()
  isDragOver.value = true
}

const handleDragLeave = (e: DragEvent) => {
  e.preventDefault()
  isDragOver.value = false
}

const handleDragOver = (e: DragEvent) => {
  e.preventDefault()
}

const handleDrop = (e: DragEvent) => {
  e.preventDefault()
  isDragOver.value = false

  const files = e.dataTransfer?.files
  if (files && files.length > 0) {
    handleFileSelect(files[0])
  }
}

const handleFileSelect = (file: File) => {
  if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
    selectedFile.value = file
  } else {
    toast.error('Please select a valid CSV file')
  }
}

const handleFileInputChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  const files = target.files
  if (files && files.length > 0) {
    handleFileSelect(files[0])
  }
}

const triggerFileInput = () => {
  fileInputRef.value?.click()
}

const removeFile = () => {
  selectedFile.value = null
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

const uploadFile = () => {
  if (!selectedFile.value) {
    toast.error('Please select a CSV file first')
    return
  }

  if (!isValidCSV.value) {
    toast.error('Please select a valid CSV file')
    return
  }

  uploadCSV(selectedFile.value)
}

const resetAndClose = () => {
  selectedFile.value = null
  isDragOver.value = false
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
  open.value = false
}

const closeDialog = () => {
  if (!isPending.value) {
    resetAndClose()
  }
}
</script>

<template>
  <AlertDialogRoot v-model:open="open">
    <AlertDialogTrigger>
      <Button variant="outline" class="flex items-center gap-2">
        <Upload :size="18" /> Import CSV
      </Button>
    </AlertDialogTrigger>
    <AlertDialogPortal>
      <AlertDialogOverlay
        class="bg-white/80 dark:bg-black/60 data-[state=open]:animate-overlayShow fixed inset-0 z-30"
      />
      <AlertDialogContent
        class="z-[100] text-sm data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-lg p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none"
      >
        <AlertDialogTitle class="text-black dark:text-white m-0 text-[17px] font-semibold">
          Import CSV File
        </AlertDialogTitle>
        <AlertDialogDescription class="mb-5 text-sm leading-normal text-gray-600">
          Upload a CSV file to import multiple users at once.
        </AlertDialogDescription>

        <!-- Hidden file input -->
        <input
          ref="fileInputRef"
          type="file"
          accept=".csv,text/csv"
          @change="handleFileInputChange"
          class="hidden"
        />

        <!-- Upload Area -->
        <div class="mb-6">
          <div
            @click="triggerFileInput"
            @dragenter="handleDragEnter"
            @dragleave="handleDragLeave"
            @dragover="handleDragOver"
            @drop="handleDrop"
            :class="[
              'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200',
              isDragOver
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800',
              !isValidCSV && selectedFile ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : '',
            ]"
          >
            <div class="flex flex-col items-center gap-3">
              <div
                :class="[
                  'w-12 h-12 rounded-full flex items-center justify-center',
                  isDragOver
                    ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/40'
                    : 'bg-gray-100 text-gray-500 dark:bg-gray-700',
                ]"
              >
                <Upload class="w-6 h-6" />
              </div>

              <div>
                <p class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ isDragOver ? 'Drop your CSV file here' : 'Click to upload or drag and drop' }}
                </p>
                <p class="text-xs text-gray-500 mt-1">CSV files only</p>
              </div>
            </div>
          </div>

          <!-- File validation error -->
          <div v-if="!isValidCSV && selectedFile" class="mt-2">
            <p class="text-sm text-red-600 flex items-center gap-1">
              <X class="w-4 h-4" />
              Please select a valid CSV file
            </p>
          </div>
        </div>

        <!-- Selected File Display -->
        <div v-if="selectedFile" class="mb-6">
          <div
            :class="[
              'flex items-center justify-between p-3 rounded-lg border',
              isValidCSV
                ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
                : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800',
            ]"
          >
            <div class="flex items-center gap-3">
              <div
                :class="[
                  'w-8 h-8 rounded flex items-center justify-center',
                  isValidCSV
                    ? 'bg-green-100 text-green-600 dark:bg-green-800/40'
                    : 'bg-red-100 text-red-600 dark:bg-red-800/40',
                ]"
              >
                <FileText class="w-4 h-4" />
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ selectedFile.name }}
                </p>
                <p class="text-xs text-gray-500">{{ fileSize }}</p>
              </div>
            </div>
            <button
              @click.stop="removeFile"
              :disabled="isPending"
              class="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
            >
              <X class="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end gap-4">
          <AlertDialogCancel
            v-if="!isPending"
            @click="closeDialog"
            class="text-gray-600 bg-gray-100 hover:bg-gray-200 focus:shadow-gray-300 inline-flex h-[35px] items-center justify-center rounded-md px-[15px] font-semibold leading-none outline-none focus:shadow-[0_0_0_2px] transition-colors"
          >
            Cancel
          </AlertDialogCancel>
          <Button
            @click="uploadFile"
            :disabled="isPending || !selectedFile || !isValidCSV"
            class="bg-primary inline-flex h-[35px] items-center justify-center rounded-md px-[15px] font-semibold leading-none outline-none focus:shadow-[0_0_0_2px] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <div v-if="isPending" class="flex items-center gap-2">
              <div
                class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
              ></div>
              Uploading...
            </div>
            <div v-else class="flex items-center gap-2">
              <Upload class="w-4 h-4" />
              Upload CSV
            </div>
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialogPortal>
  </AlertDialogRoot>
</template>
