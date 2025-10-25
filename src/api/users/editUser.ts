import { useUserStore } from '@/stores/userStores'
import { httpClient, type APIResponse } from '@/lib/httpClient'
import type { UserProfileInterface, UserDataInterface } from '@/types/userType'

export interface DataUserProps {
  name: string
  phone: string
  email: string
  date_of_birth?: string | null | undefined
  role_type?: string
  avatar_picture?: string | null
}

export interface EditUserResponseData {
  user: UserProfileInterface | UserDataInterface
}

export type EditUserAPIResponse = APIResponse<EditUserResponseData>

export interface EditUserOptions {
  userID?: string
  role?: number
  updateStore?: boolean
}

export const editUserData = async (
  newUserData: DataUserProps,
  options: EditUserOptions = {}
): Promise<EditUserAPIResponse> => {
  try {
    const { userID, role, updateStore = true } = options
    const userStore = useUserStore()

    // Determine endpoint based on role
    const endpoint = role === 1 ? `/admin/users/${userID}` : '/profile'

    const response: EditUserAPIResponse = await httpClient.put(endpoint, newUserData)

    // Only update store if requested and the current user is editing their own profile
    if (updateStore && response.data?.user && userStore.user?.id === response.data.user.id) {
      console.log('🔄 editUser: Updating store with new user data:', {
        userId: response.data.user.id,
        name: response.data.user.name,
        email: response.data.user.email
      })
      userStore.setUserProfileData(response.data.user)
    }

    return response
  } catch (error) {
    throw error
  }
}

// Convenience functions for backward compatibility and clarity
export const editUserProfile = async (userData: DataUserProps): Promise<EditUserAPIResponse> => {
  return editUserData(userData, { role: 0, updateStore: true })
}

export const editUserAsAdmin = async (
  userData: DataUserProps,
  userID: string,
  updateStore = false
): Promise<EditUserAPIResponse> => {
  return editUserData(userData, { userID, role: 1, updateStore })
}
