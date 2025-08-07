import type { UserDataInterface } from './userType'

export interface UserListInterface {
  page: number
  page_size: number
  total: number
  total_pages: number
  users: UserDataInterface[]
}
