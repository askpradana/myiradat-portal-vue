import { toast } from 'vue-sonner'
import { useUserStore } from '@/stores/userStores'

export const refreshToken = async () => {
  try {
    const userStore = useUserStore()
    const token = userStore.auth?.token

    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      userStore.clearAuthData()
      window.location.href = '/login'
      throw new Error('Token refresh failed')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error:', error)
    toast('Error', {
      description: `${error}`,
    })
    throw error
  }
}
