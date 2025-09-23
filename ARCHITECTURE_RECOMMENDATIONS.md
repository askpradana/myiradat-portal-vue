# Architecture Recommendations for Future Development

## Overview
Based on the recent mobile optimization and internationalization work, here are strategic recommendations for improving the Vue 3 + TypeScript architecture.

## 🌍 Internationalization (i18n) Implementation

### Current State
- Hard-coded Indonesian text in components
- No centralized translation management
- Mixed language approach

### Recommended Implementation

1. **Install Vue I18n**
```bash
bun add vue-i18n@9
```

2. **Create Translation Structure**
```typescript
// /src/i18n/locales/id.ts
export default {
  quiz: {
    likert: {
      strongly_disagree: 'Sangat Tidak Setuju',
      disagree: 'Tidak Setuju',
      neutral: 'Netral',
      agree: 'Setuju',
      strongly_agree: 'Sangat Setuju'
    },
    navigation: {
      previous: 'Sebelumnya',
      next: 'Selanjutnya',
      submit: 'Kirim',
      back_to_quizzes: 'Kembali ke Pilihan Quiz'
    }
  }
}

// /src/i18n/locales/en.ts
export default {
  quiz: {
    likert: {
      strongly_disagree: 'Strongly Disagree',
      disagree: 'Disagree',
      neutral: 'Neutral',
      agree: 'Agree',
      strongly_agree: 'Strongly Agree'
    },
    navigation: {
      previous: 'Previous',
      next: 'Next',
      submit: 'Submit',
      back_to_quizzes: 'Back to Quizzes'
    }
  }
}
```

3. **Setup I18n Configuration**
```typescript
// /src/i18n/index.ts
import { createI18n } from 'vue-i18n'
import id from './locales/id'
import en from './locales/en'

export default createI18n({
  locale: 'id',
  fallbackLocale: 'en',
  messages: { id, en }
})
```

4. **Component Usage**
```vue
<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const options = computed(() => [
  { value: 1, label: t('quiz.likert.strongly_disagree') },
  // ...
])
</script>
```

## 📱 Responsive Architecture Enhancement

### Current Issues
- Duplicate layouts (mobile/desktop)
- Props drilling for mobile mode
- Inconsistent responsive detection

### Recommended Approach

1. **Create Unified Responsive Composable**
```typescript
// /src/composables/ui/useBreakpoints.ts
import { useBreakpoints } from '@vueuse/core'

export const useAppBreakpoints = () => {
  const breakpoints = useBreakpoints({
    mobile: 0,
    tablet: 640,
    desktop: 1024,
    wide: 1280
  })

  return {
    isMobile: breakpoints.smaller('tablet'),
    isTablet: breakpoints.between('tablet', 'desktop'),
    isDesktop: breakpoints.greaterOrEqual('desktop'),
    current: breakpoints.current()
  }
}
```

2. **Component Layout Strategy**
```vue
<script setup lang="ts">
import { useAppBreakpoints } from '@/composables/ui/useBreakpoints'

const { isMobile } = useAppBreakpoints()

// Single component with conditional rendering
const layoutConfig = computed(() => ({
  containerClass: isMobile.value ? 'mobile-layout' : 'desktop-layout',
  gridCols: isMobile.value ? 2 : 5,
  spacing: isMobile.value ? 'gap-3' : 'gap-6'
}))
</script>

<template>
  <div :class="layoutConfig.containerClass">
    <!-- Single unified template -->
  </div>
</template>
```

## 🎨 Design System Enhancement

### Component Variant System
```typescript
// /src/components/ui/LikertScale/types.ts
export interface LikertVariant {
  size: 'compact' | 'default' | 'large'
  layout: 'grid' | 'linear' | 'card'
  theme: 'default' | 'minimal' | 'colorful'
}

// /src/components/ui/LikertScale/LikertScale.vue
interface Props {
  scale: 'likert4' | 'likert5'
  variant?: LikertVariant
  value?: number | null
}

const variantConfig = computed(() => ({
  compact: { circleSize: 'w-12 h-12', textSize: 'text-sm' },
  default: { circleSize: 'w-16 h-16', textSize: 'text-base' },
  large: { circleSize: 'w-20 h-20', textSize: 'text-lg' }
}))
```

## ⚡ Performance Optimization

### 1. Component Lazy Loading
```typescript
// /src/components/quiz/index.ts
export const QuizComponents = {
  LikertScale: defineAsyncComponent(() => import('./taking/LikertScale.vue')),
  QuestionCard: defineAsyncComponent(() => import('./taking/QuestionCard.vue')),
  QuizNavigation: defineAsyncComponent(() => import('./taking/QuizNavigation.vue'))
}
```

### 2. Virtual Scrolling for Long Quizzes
```vue
<script setup lang="ts">
import { VirtualList } from '@tanstack/vue-virtual'

// For quizzes with 50+ questions
const useVirtualization = computed(() => questions.length > 50)
</script>
```

### 3. Optimized State Management
```typescript
// /src/stores/quiz.ts
export const useQuizStore = defineStore('quiz', () => {
  const answers = ref<Map<number, number>>(new Map())

  // Batch updates for better performance
  const updateAnswers = (updates: Array<{questionId: number, value: number}>) => {
    updates.forEach(({ questionId, value }) => {
      answers.value.set(questionId, value)
    })
  }

  return { answers, updateAnswers }
})
```

## 🛡️ Type Safety Improvements

### Enhanced Quiz Types
```typescript
// /src/types/quiz.ts
export interface QuizQuestion<T = unknown> {
  id: number
  content: string
  type: QuizQuestionType
  metadata: T
}

export interface LikertQuestion extends QuizQuestion<{
  scale: 'likert4' | 'likert5'
  reverse_scored?: boolean
}> {
  type: 'likert'
}

export interface YesNoQuestion extends QuizQuestion<{
  positive_answer?: 'yes' | 'no'
}> {
  type: 'yesno'
}

export type TypedQuizQuestion = LikertQuestion | YesNoQuestion

// Type guards for runtime safety
export const isLikertQuestion = (q: QuizQuestion): q is LikertQuestion =>
  q.type === 'likert'
```

## 🧪 Testing Strategy

### Component Testing
```typescript
// /src/components/quiz/taking/__tests__/LikertScale.test.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import LikertScale from '../LikertScale.vue'

const i18n = createI18n({
  locale: 'id',
  messages: { id: { quiz: { likert: { /* ... */ } } } }
})

describe('LikertScale', () => {
  it('renders correct number of options for likert4', () => {
    const wrapper = mount(LikertScale, {
      props: { scale: 'likert4' },
      global: { plugins: [i18n] }
    })

    expect(wrapper.findAll('[data-testid="likert-option"]')).toHaveLength(4)
  })
})
```

## 📋 Migration Roadmap

### Phase 1: Foundation (Week 1-2)
- [ ] Setup Vue I18n
- [ ] Create translation files
- [ ] Implement unified breakpoint composable

### Phase 2: Component Refactoring (Week 3-4)
- [ ] Update LikertScale with i18n
- [ ] Implement variant system
- [ ] Add comprehensive testing

### Phase 3: Performance & Polish (Week 5-6)
- [ ] Implement lazy loading
- [ ] Add virtual scrolling for long quizzes
- [ ] Performance audit and optimization

## 🎯 Quick Wins (Immediate)

1. **Replace hardcoded text with translation keys**
2. **Extract common responsive logic to composable**
3. **Add prop validation with Zod schemas**
4. **Implement error boundaries for quiz components**

## 🔄 Long-term Architecture Goals

1. **Micro-frontend preparation** - Component isolation for scalability
2. **PWA enhancement** - Offline quiz capabilities
3. **Analytics integration** - User interaction tracking
4. **Accessibility compliance** - WCAG 2.1 AA certification

This roadmap balances immediate improvements with strategic long-term planning for the quiz system architecture.