<template>
  <span 
    :class="badgeClasses"
  >
    <slot />
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline'
  size?: 'sm' | 'default' | 'lg'
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'default'
})

const badgeClasses = computed(() => {
  const baseClasses = 'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
  
  const variantClasses = {
    default: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
    secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
    destructive: 'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
    outline: 'text-foreground border-border'
  }
  
  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    default: 'text-xs px-2.5 py-0.5',
    lg: 'text-sm px-3 py-1'
  }
  
  return [
    baseClasses,
    variantClasses[props.variant],
    sizeClasses[props.size],
    props.class
  ].filter(Boolean).join(' ')
})
</script>