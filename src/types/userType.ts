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
  openness: number | undefined | null
  neuroticism: number | undefined | null
  extraversion: number | undefined | null
  agreeableness: number | undefined | null
  conscientiousness: number | undefined | null
}

export interface IPROBInterface {
  dominant: number | undefined | null
  influence: number | undefined | null
  compliance: number | undefined | null
  steadiness: number | undefined | null
}

export interface IPROSInterface {
  driver: number | undefined | null
  amiable: number | undefined | null
  analytical: number | undefined | null
  expressive: number | undefined | null
}

export interface LastAnalyzedInterface {
  date: string
  score: number
  service: string
}

export interface UserDataInterface extends UserProfileInterface {
  ipro?: IPROInterface
  iprob?: IPROBInterface
  ipros?: IPROSInterface
  last_analyzed?: LastAnalyzedInterface
}
