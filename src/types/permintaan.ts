export type StatusPermintaan =
  | 'Menunggu'
  | 'Diterima'
  | 'Ditolak'

export interface Permintaan {
  id: string
  penggunaId: number
  namaKaryawan: string
  divisi: string

  barangId: string
  namaBarang: string
  jumlah: number
  satuan: string

  tanggalPengajuan: string
  tanggalPengambilan: string

  keterangan: string
  status: StatusPermintaan
  catatanAdmin: string
}

export interface PermintaanInput {
  penggunaId: number
  namaKaryawan: string
  divisi: string

  barangId: string
  namaBarang: string
  jumlah: number
  satuan: string

  tanggalPengambilan: string
  keterangan: string
}