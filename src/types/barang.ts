export interface Barang {
  id: string
  nama: string
  kategori: string
  stok: number
  satuan: string
  stokMinimum: number
  keterangan: string
  dibuatPada: string
}

export interface BarangInput {
  nama: string
  kategori: string
  stok: number
  satuan: string
  stokMinimum: number
  keterangan: string
}