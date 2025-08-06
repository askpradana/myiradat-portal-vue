export interface UserProfileInterface {
  id: string
  email: string
  role_id: number
  name: string
  avatar_picture: string
  date_of_birth: string
  phone: string
  profile_id: string
  role_name: string
}

export interface IPROInterface {
  openness: number
  neuroticism: number
  extraversion: number
  agreeableness: number
  conscientiousness: number
}

export interface IPROBInterface {
  dominant: number
  influence: number
  compliance: number
  steadiness: number
}

export interface IPROSInterface {
  driver: number
  amiable: number
  analytical: number
  expressive: number
}

export interface LastAnalyzedInterface {
  date: string
  score: number
  service: string
}
