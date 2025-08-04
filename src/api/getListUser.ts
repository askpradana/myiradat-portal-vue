import { toast } from 'vue-sonner'
import { useUserStore } from '@/stores/userStores'

export const getListUser = async () => {
  try {
    const userStore = useUserStore()
    const token = userStore.token

    // Periksa apakah token ada
    if (!token) {
      throw new Error('Authentication token not found.')
    }

    const response = await fetch(`${import.meta.env.VITE_API_URL}/user/list`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`HTTP error! status: ${response.status}`)
      } else if (response.status === 400) {
        throw new Error(`Bad Request`)
      } else {
        throw new Error(`Internal server error`)
      }
    }

    const data = await response.json()

    return data.data
  } catch (error) {
    console.error('Error:', error)
    toast('Error', {
      description: `${error}`,
    })
  }
}
