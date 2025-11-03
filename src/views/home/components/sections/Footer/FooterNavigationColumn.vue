<template>
  <div>
    <h3 class="text-sm font-semibold text-foreground uppercase tracking-wider mb-6">
      {{ title }}
    </h3>
    <ul class="space-y-4" :class="additionalListClasses">
      <li v-for="link in links" :key="link.label">
        <a
          :href="link.href"
          class="text-muted-foreground hover:text-foreground transition-colors text-sm"
        >
          {{ link.label }}
        </a>
      </li>
    </ul>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
interface NavigationLink {
  label: string
  href: string
}

interface Props {
  title: string
  links: NavigationLink[]
  additionalListClasses?: string
}

withDefaults(defineProps<Props>(), {
  additionalListClasses: ''
})
</script>