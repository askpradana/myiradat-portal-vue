<template>
  <div class="filter-chip-container inline-flex items-center gap-1 bg-muted/50 hover:bg-muted/70 transition-colors duration-200 rounded-full px-3 py-1.5 text-sm font-medium">
    <span class="filter-label text-muted-foreground">
      {{ label }}:
    </span>
    <span class="filter-value text-foreground">
      {{ value }}
    </span>
    <button
      @click="handleRemove"
      type="button"
      class="filter-remove-btn ml-1 rounded-full p-0.5 hover:bg-destructive/10 hover:text-destructive transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
      :aria-label="`Remove ${label} filter`"
    >
      <X :size="14" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { X } from 'lucide-vue-next'

interface Props {
  label: string
  value: string
  filterKey: string
}

interface Emits {
  remove: [filterKey: string]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const handleRemove = () => {
  emit('remove', props.filterKey)
}
</script>

<style scoped>
.filter-chip-container {
  /* Ensure consistent alignment */
  align-items: center;
  
  /* Smooth interactions */
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
}

.filter-remove-btn {
  /* Ensure perfect circle for close button */
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  /* Smooth hover effect */
  transition: all 150ms ease-in-out;
}

.filter-remove-btn:hover {
  transform: scale(1.1);
}

.filter-remove-btn:active {
  transform: scale(0.95);
}

/* Focus visible for accessibility */
.filter-remove-btn:focus-visible {
  outline: 2px solid hsl(var(--ring));
  outline-offset: 2px;
}

/* Responsive text sizing */
@media (max-width: 640px) {
  .filter-chip-container {
    font-size: 0.75rem;
    padding: 0.25rem 0.75rem;
  }
  
  .filter-remove-btn {
    width: 18px;
    height: 18px;
  }
}
</style>