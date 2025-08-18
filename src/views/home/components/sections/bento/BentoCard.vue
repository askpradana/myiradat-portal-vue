<template>
  <Card
    :class="cardClasses"
    :style="cardStyles"
    role="article"
    :tabindex="card.interactive ? 0 : -1"
    :aria-describedby="`${card.id}-description`"
    :aria-disabled="!card.interactive"
    @click="handleCardClick"
    @keydown.enter="handleCardClick"
    @keydown.space.prevent="handleCardClick"
  >
    <CardContent :class="contentClasses">
      <BentoCardContent :card="card" />
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Card, CardContent } from '@/components/ui/card'
import type { BentoCard } from '@/types/homepage'
import BentoCardContent from './BentoCardContent.vue'

interface Props {
  card: BentoCard
}

const props = defineProps<Props>()

const emit = defineEmits<{
  click: [card: BentoCard]
}>()

const cardClasses = computed(() => {
  const baseClasses = [
    `${props.card.id}-card`,
    'group',
    'overflow-hidden',
    'border-border/50',
    'transition-all',
    'duration-300'
  ]

  if (props.card.interactive) {
    baseClasses.push(
      'cursor-pointer',
      `hover:border-${props.card.theme.hover}`,
      'hover:scale-[1.02]',
      'hover:shadow-xl'
    )
  }

  if (props.card.status === 'coming-soon') {
    baseClasses.push('opacity-70')
  }

  return baseClasses
})

const cardStyles = computed(() => {
  const styles: Record<string, string> = {
    'grid-area': props.card.gridArea
  }

  if (props.card.size === 'xl') {
    styles['min-height'] = '400px'
  } else if (props.card.size === 'large') {
    styles['min-height'] = '400px'
  } else {
    styles['min-height'] = '250px'
  }

  return styles
})

const contentClasses = computed(() => {
  const classes = ['h-full']
  
  if (props.card.type === 'hero') {
    classes.push('p-8')
  } else {
    classes.push('p-6')
  }

  if (props.card.theme.background) {
    classes.push(props.card.theme.background)
  }

  return classes
})

const handleCardClick = () => {
  if (props.card.interactive) {
    emit('click', props.card)
  }
}
</script>

<style scoped>
.group {
  will-change: transform, box-shadow;
  transform: translateZ(0);
}

.group:not(:hover):not(:focus) {
  will-change: auto;
}

@media (max-width: 768px) {
  .group:hover {
    transform: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .group {
    transition: none;
  }
  
  .group:hover {
    transform: none;
  }
}
</style>