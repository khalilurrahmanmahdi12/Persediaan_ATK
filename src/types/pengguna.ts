export type RolePengguna =
  | 'admin'
  | 'karyawan'

export interface Pengguna {
  id: number
  nama: string
  email: string
  whatsapp: string
  divisi: string
  jabatan: string
  role: RolePengguna
  aktif: boolean
}