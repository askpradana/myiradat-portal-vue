import { toast } from 'vue-sonner'
import { httpClient, type APIResponse } from '@/lib/httpClient'
import type { UserDataInterface } from '@/types/userType'

export interface UpdateProfilePayload {
  name?: string
  phone?: string
  email?: string
  avatar_picture?: string
  date_of_birth?: string
}

export interface UpdateProfileResponse {
  user: UserDataInterface
}

export const updateProfile = async (payload: UpdateProfilePayload): Promise<UpdateProfileResponse> => {
  try {
    // Validate payload is not empty
    if (Object.keys(payload).length === 0) {
      throw new Error('No fields to update provided.')
    }

    const response: APIResponse<UpdateProfileResponse> = await httpClient.put('/profile', payload)

    console.log('✅ updateProfile: Profile update successful, data received:', {
      userId: response.data?.user?.id,
      name: response.data?.user?.name,
      email: response.data?.user?.email
    })

    toast.success('Profile Updated', {
      description: 'Your profile has been updated successfully',
    })

    return response.data!
  } catch (error) {
    const errorMessage = error && typeof error === 'object' && 'message' in error
      ? String(error.message)
      : 'An unexpected error occurred'

    toast.error('Update Failed', {
      description: errorMessage,
    })
    throw error
  }
}