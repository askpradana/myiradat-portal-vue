import { ref } from 'vue'
import { useRouter } from 'vue-router'
import type { ContactAction } from '@/types/contact'

export function useContactActions() {
  const router = useRouter()
  const isProcessing = ref(false)

  const openEmail = (email: string = 'support@iradat.com') => {
    try {
      window.open(`mailto:${email}`, '_blank')
    } catch (error) {
      // eslint-disable-line @typescript-eslint/no-unused-vars
      // Error logged
    }
  }

  const openPhone = (phone: string = '+62-XXX-XXXX-XXXX') => {
    try {
      window.open(`tel:${phone}`, '_self')
    } catch (error) {
      // eslint-disable-line @typescript-eslint/no-unused-vars
      // Error logged
    }
  }

  const goToContactPage = () => {
    router.push('/contact')
  }

  const handleContactAction = (action: ContactAction) => {
    if (isProcessing.value) return

    isProcessing.value = true

    try {
      switch (action.type) {
        case 'email':
          openEmail(action.value)
          break
        case 'phone':
          openPhone(action.value)
          break
        case 'external':
          window.open(action.value, '_blank')
          break
        case 'chat':
          break
        default:
        // Warning logged
      }
    } finally {
      setTimeout(() => {
        isProcessing.value = false
      }, 1000)
    }
  }

  return {
    isProcessing,
    openEmail,
    openPhone,
    goToContactPage,
    handleContactAction,
  }
}
