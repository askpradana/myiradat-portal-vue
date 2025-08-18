import { ref, watch, onMounted, type Ref } from 'vue'
import { useAvatarStore } from '@/stores/avatarStore'
import type { UseAvatarOptions, UseAvatarReturn, PersonMetadata, CompanyMetadata } from '@/types/avatar'

export function useAvatar(
  identifier: string | Ref<string>,
  options: UseAvatarOptions & { metadata?: PersonMetadata | CompanyMetadata } = { type: 'person' }
): UseAvatarReturn {
  const avatarStore = useAvatarStore()
  
  const avatarUrl = ref<string>('')
  const isLoading = ref<boolean>(false)
  const error = ref<string | null>(null)

  const {
    type = 'person',
    fallbackUrl = '',
    metadata
  } = options

  const loadAvatar = async (id: string) => {
    if (!id.trim()) {
      avatarUrl.value = fallbackUrl
      return
    }

    try {
      isLoading.value = true
      error.value = null

      let url: string

      if (type === 'person') {
        url = await avatarStore.generatePersonAvatar(id, metadata as PersonMetadata)
      } else {
        url = await avatarStore.fetchCompanyLogo(id, metadata as CompanyMetadata)
      }

      avatarUrl.value = url
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load avatar'
      avatarUrl.value = fallbackUrl
    } finally {
      isLoading.value = false
    }
  }

  const retry = async () => {
    if (typeof identifier === 'string') {
      await loadAvatar(identifier)
    } else {
      await loadAvatar(identifier.value)
    }
  }

  const refresh = async () => {
    // Invalidate cache and reload
    const id = typeof identifier === 'string' ? identifier : identifier.value
    avatarStore.invalidateAvatar(id, type)
    await retry()
  }

  // Watch for identifier changes
  if (typeof identifier !== 'string') {
    watch(identifier, (newId) => {
      if (newId) {
        loadAvatar(newId)
      }
    }, { immediate: true })
  }

  // Load avatar on mount for string identifiers
  onMounted(() => {
    if (typeof identifier === 'string' && identifier.trim()) {
      loadAvatar(identifier)
    }
  })

  return {
    avatarUrl,
    isLoading,
    error,
    retry,
    refresh
  }
}