export interface sessionInterface {
  session_id: string
  browser: string
  os: string
  device_type: string
  ip_address: string
  login_time: string
  last_activity: string
  is_active: boolean
  is_current: boolean
}

export interface SessionsDataFromAPIInterface {
  sessions: sessionInterface[]
  total_count: number
  active_count: number
}
