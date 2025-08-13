export interface OrganizationInterface {
  id: string
  name: string
  description: string
  industry: string
  size_category: 'small' | 'medium' | 'large'
  email: string
  phone: string
  website_url: string
  logo_url: string
  address: AddressOfOrganizationInterface | string
  status: string
  created_at: string
  updated_at: string
  last_changed_by: string
  member_count: number
}

export interface AddressOfOrganizationInterface {
  city: string
  state: string
  street: string
  country: string
  postal_code: string
}

export interface ResponseAPIGetOrganizations {
  susscess: boolean
  message: string
  data: {
    organizations: OrganizationInterface[]
    page: number
    page_size: number
    total: number
    total_pages: number
  }
  timestamp: string
}

export interface ResponseAPIGetOrganizationsData {
  organizations: OrganizationInterface[]
  page: number
  page_size: number
  total: number
  total_pages: number
}
