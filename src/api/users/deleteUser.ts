import { httpClient } from '@/lib/httpClient'

interface ResponseAPIDeleteUserInterface {
  success: boolean
  message: string
  data?: {
    deleted_by: string
    deleted_user_id: string
  }
  timestamp: string
}

export const deleteUser = async (userID: string): Promise<ResponseAPIDeleteUserInterface> => {
  try {
    const response = await httpClient.delete<ResponseAPIDeleteUserInterface>(`/admin/users/${userID}`)
    return response as ResponseAPIDeleteUserInterface
  } catch (error) {
    throw error
  }
}
