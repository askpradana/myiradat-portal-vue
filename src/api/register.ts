import { toast } from 'vue-sonner'
import { useUserStore } from '@/stores/userStores'


export interface NewUserInterface {
  name: string
  phone: string
  email: string
  password: string
  role?: string
}

export const registerNewUser = async (newUserData: NewUserInterface, role?: number) => {
  try {
    const userStore = useUserStore()
    const token = userStore.token
    const newData = {
      name: newUserData.name,
      phone: newUserData.phone,
      email: newUserData.email,
      password: newUserData.password,
      role_type: newUserData.role === '1' ? 'admin' : '',
    }

    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
      method: 'POST',
      body: role === 1 ? JSON.stringify(newData) : JSON.stringify(newUserData),
      headers: {
        Authorization: role === 1 ? `bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`HTTP error! status: ${response.status}`)
      } else if (response.status === 401) {
        throw new Error(`Please check email & password`)
      } else if (response.status === 400) {
        throw new Error(`Data already exist`)
      } else {
        throw new Error(`Internal server error`)
      }
    }

    const data = await response.json()

    return data
  } catch (error) {
    console.error('Error:', error)
    toast('Error', {
      description: `${error}`,
    })
  }
}
