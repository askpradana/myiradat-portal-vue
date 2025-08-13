export interface ServiceInterface {
  code: string
  name: string
  icon_url: string
  redirect_to: string
  created_at?: string
  updated_at?: string
}

export interface AdminServicesResponse {
  success: boolean
  message: string
  data: {
    services: ServiceInterface[]
  }
  timestamp: string
}
