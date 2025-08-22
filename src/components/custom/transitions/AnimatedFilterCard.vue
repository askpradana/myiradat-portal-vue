<template>
  <Transition
    name="filter-card"
    appear
    mode="out-in"
  >
    <div class="filter-card-wrapper">
      <slot />
    </div>
  </Transition>
</template>

<script setup lang="ts">
// Component is now self-contained with hardcoded animation settings
// Props can be added back if customization is needed in the future
</script>

<style scoped>
.filter-card-wrapper {
  /* Prepare for accordion animation */
  overflow: hidden;
  will-change: max-height, opacity;
}

/* Enter transition - Accordion style */
.filter-card-enter-active {
  transition: max-height 400ms cubic-bezier(0.4, 0, 0.2, 1),
              opacity 300ms ease-out;
  will-change: max-height, opacity;
}

.filter-card-enter-from {
  max-height: 0;
  opacity: 0;
}

.filter-card-enter-to {
  max-height: 1000px; /* Large enough value for any filter content */
  opacity: 1;
}

/* Leave transition - Accordion style */
.filter-card-leave-active {
  transition: max-height 300ms cubic-bezier(0.4, 0, 0.2, 1),
              opacity 250ms ease-in;
  overflow: hidden;
}

.filter-card-leave-from {
  max-height: 1000px;
  opacity: 1;
}

.filter-card-leave-to {
  max-height: 0;
  opacity: 0;
}

/* Animation complete - clean up will-change */
.filter-card-enter-active:not(.filter-card-enter-from):not(.filter-card-enter-to) {
  will-change: auto;
}

/* Accessibility: Respect reduced motion preferences */
@media (prefers-reduced-motion: reduce) {
  .filter-card-enter-active,
  .filter-card-leave-active {
    transition: opacity 200ms ease !important;
    max-height: unset !important;
  }
  
  .filter-card-enter-from,
  .filter-card-leave-to {
    max-height: unset !important;
  }
  
  .filter-card-enter-to,
  .filter-card-leave-from {
    max-height: unset !important;
  }
}

/* Disable animation when disabled prop is true */
.filter-card-wrapper[data-disabled="true"] {
  transition: none !important;
  max-height: unset !important;
  opacity: 1 !important;
}

/* Performance optimization for mobile */
@media (max-width: 768px) {
  .filter-card-enter-active {
    transition-duration: 300ms, 250ms;
  }
  
  .filter-card-leave-active {
    transition-duration: 250ms, 200ms;
  }
}
</style>