export interface TeamMember {
  name: string
  email: string
  image: string
  position?: string
}

export interface TeamsData {
  director: TeamMember[]
  eap: TeamMember[]
  lhh: TeamMember[]
  lnd: TeamMember[]
  hr: TeamMember[]
  esas: TeamMember[]
}