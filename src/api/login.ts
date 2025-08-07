import { toast } from 'vue-sonner'

interface UserDataInterface {
  email: string
  password: string
}

export const login = async (userData: UserDataInterface) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
      method: 'POST',
      body: JSON.stringify(userData),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`HTTP error! status: ${response.status}`)
      } else if (response.status === 401) {
        throw new Error(`Please check email & password`)
      } else {
        throw new Error(`Internal server error`)
      }
    }

    const data = await response.json()
    console.log(data)

    return data
  } catch (error) {
    console.error('Error:', error)
    toast('Error', {
      description: `${error}`,
    })
  }
}
