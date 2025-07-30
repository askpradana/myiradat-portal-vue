<template>
  <div class="w-full">
    <div class="flex items-center justify-between">
      <div v-for="(step, index) in steps" :key="index" class="flex items-center">
        <!-- Step Circle -->
        <div
          :class="[
            'flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-200',
            {
              'bg-primary border-primary text-primary-foreground': index < currentStep,
              'bg-primary border-primary text-primary-foreground': index === currentStep,
              'bg-muted border-muted-foreground text-muted-foreground': index > currentStep,
            },
          ]"
        >
          <span v-if="index < currentStep" class="text-sm">✓</span>
          <span v-else class="text-sm font-medium">{{ index + 1 }}</span>
        </div>

        <!-- Step Label -->
        <div class="ml-3">
          <p
            :class="[
              'text-sm font-medium transition-colors duration-200',
              {
                'text-primary': index <= currentStep,
                'text-muted-foreground': index > currentStep,
              },
            ]"
          >
            {{ step.title }}
          </p>
          <p
            v-if="step.description"
            :class="[
              'text-xs transition-colors duration-200',
              {
                'text-muted-foreground': index <= currentStep,
                'text-muted-foreground/60': index > currentStep,
              },
            ]"
          >
            {{ step.description }}
          </p>
        </div>

        <!-- Connector Line -->
        <div
          v-if="index < steps.length - 1"
          :class="[
            'w-16 h-0.5 mx-4 transition-all duration-200',
            {
              'bg-primary': index < currentStep,
              'bg-muted': index >= currentStep,
            },
          ]"
        />
      </div>
    </div>

    <!-- Step Content -->
    <div class="mt-8">
      <slot :current-step="currentStep" :steps="steps" />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Step {
  title: string
  description?: string
}

interface Props {
  steps: Step[]
  currentStep: number
}

defineProps<Props>()
</script>
