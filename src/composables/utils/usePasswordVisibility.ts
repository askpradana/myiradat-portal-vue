import { ref } from 'vue'

/**
 * Composable for managing password field visibility state
 * Provides reactive state and toggle function for show/hide password functionality
 */
export function usePasswordVisibility(initialVisibility = false) {
  const isVisible = ref(initialVisibility)

  const toggle = () => {
    isVisible.value = !isVisible.value
  }

  const show = () => {
    isVisible.value = true
  }

  const hide = () => {
    isVisible.value = false
  }

  return {
    isVisible,
    toggle,
    show,
    hide
  }
}

/**
 * Composable for managing multiple password fields visibility state
 * Useful for forms with multiple password fields (password, confirm password, etc.)
 */
export function useMultiplePasswordVisibility() {
  const fields = ref<Record<string, boolean>>({})

  const isVisible = (fieldName: string): boolean => {
    return fields.value[fieldName] || false
  }

  const toggle = (fieldName: string) => {
    fields.value[fieldName] = !fields.value[fieldName]
  }

  const show = (fieldName: string) => {
    fields.value[fieldName] = true
  }

  const hide = (fieldName: string) => {
    fields.value[fieldName] = false
  }

  const showAll = () => {
    Object.keys(fields.value).forEach(key => {
      fields.value[key] = true
    })
  }

  const hideAll = () => {
    Object.keys(fields.value).forEach(key => {
      fields.value[key] = false
    })
  }

  return {
    isVisible,
    toggle,
    show,
    hide,
    showAll,
    hideAll
  }
}