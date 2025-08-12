export interface UserProfileInterface {
  id: string
  email: string
  phone: string
  role_id: number
  role_name: string
  profile_id: string
  name: string
  avatar_picture: string | null
  date_of_birth: string | null
  organization_id: string | null
  verified_at: string
}

export interface IPROInterface {
  inisiatif: string
  kerjasama: string
  kepemimpinan: string
  fleksibilitas: string
  komitmenTugas: string
  kecerdasanUmum: string
  logikaBerpikir: string
  kelincahanPikir: string
  kepercayaanDiri: string
  penyesuaianDiri: string
  stabilitasEmosi: string
  sistematikaKerja: string
  dayaAnalisaSintesa: string
  dayaBerpikirAbtrak: string
  dayaTahanKerjaRutin: string
  motivasiBerprestasi: string
  dayaTahanKerjaStress: string
  pengambilanKeputusan: string
  hubunganInterpersonal: string
  perencanaanDanPerorganisasian: string
}

export interface IPROBInterface {
  inisiatif: string
  kerjasama: string
  kepemimpinan: string
  fleksibilitas: string
  komitmenTugas: string
  kecerdasanUmum: string
  logikaBerpikir: string
  kelincahanPikir: string
  kepercayaanDiri: string
  penyesuaianDiri: string
  stabilitasEmosi: string
  sistematikaKerja: string
  dayaAnalisaSintesa: string
  dayaBerpikirAbtrak: string
  dayaTahanKerjaRutin: string
  motivasiBerprestasi: string
  dayaTahanKerjaStress: string
  pengambilanKeputusan: string
  hubunganInterpersonal: string
  perencanaanDanPerorganisasian: string
}

export interface IPROSInterface {
  kemandirian: string
  ketangguhan: string
  kecerdasanUmum: string
  ketelitianKerja: string
  penalaranVerbal: string
  penyesuaianDiri: string
  penalaranNumerik: string
  sistematikaKerja: string
  penalaranNonVerbal: string
  kecepatanPerseptual: string
  motivasiBerprestasi: string
  hubunganInterpersonal: string
}

export interface LastAnalyzedInterface {
  comment: string
  analyzed_at: string
  last_analyzed: string
}

export interface UserDataInterface extends UserProfileInterface {
  ipro?: IPROInterface
  iprob?: IPROBInterface
  ipros?: IPROSInterface
  last_analyzed?: LastAnalyzedInterface
}
