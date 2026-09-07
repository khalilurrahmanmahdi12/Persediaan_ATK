import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type {
  Barang,
  BarangInput,
} from '../types/barang'

interface BarangState {
  daftarBarang: Barang[]

  tambahBarang: (
    barang: BarangInput,
  ) => void

  editBarang: (
    id: string,
    barang: BarangInput,
  ) => void

  hapusBarang: (
    id: string,
  ) => void

  kurangiStok: (
    id: string,
    jumlah: number,
  ) => boolean
}

const dataAwal: Barang[] = [
  {
    id: 'BRG-001',
    nama: 'Kertas A4',
    kategori: 'Kertas',
    stok: 20,
    satuan: 'Rim',
    stokMinimum: 5,
    keterangan:
      'Kertas A4 80 GSM',
    dibuatPada:
      '2026-09-01T08:00:00.000Z',
  },
  {
    id: 'BRG-002',
    nama: 'Pulpen Hitam',
    kategori: 'Alat Tulis',
    stok: 50,
    satuan: 'Pcs',
    stokMinimum: 10,
    keterangan:
      'Pulpen tinta hitam',
    dibuatPada:
      '2026-09-01T08:00:00.000Z',
  },
  {
    id: 'BRG-003',
    nama: 'Map Folder',
    kategori: 'Arsip',
    stok: 15,
    satuan: 'Pcs',
    stokMinimum: 5,
    keterangan:
      'Map dokumen kantor',
    dibuatPada:
      '2026-09-01T08:00:00.000Z',
  },
  {
    id: 'BRG-004',
    nama: 'Stapler',
    kategori: 'Alat Tulis',
    stok: 3,
    satuan: 'Pcs',
    stokMinimum: 5,
    keterangan:
      'Stapler ukuran sedang',
    dibuatPada:
      '2026-09-01T08:00:00.000Z',
  },
  {
    id: 'BRG-005',
    nama: 'Tinta Printer',
    kategori: 'Printer',
    stok: 0,
    satuan: 'Botol',
    stokMinimum: 3,
    keterangan:
      'Tinta printer hitam',
    dibuatPada:
      '2026-09-01T08:00:00.000Z',
  },
]

export const useBarangStore =
  create<BarangState>()(
    persist(
      (set, get) => ({
        daftarBarang:
          dataAwal,

        tambahBarang: (
          barang: BarangInput,
        ) => {
          const daftarBarang =
            get().daftarBarang

          const nomorTerbesar =
            daftarBarang.reduce(
              (
                terbesar,
                item,
              ) => {
                const hasil =
                  item.id.match(
                    /BRG-(\d+)/,
                  )

                if (!hasil) {
                  return terbesar
                }

                const nomor =
                  Number(
                    hasil[1],
                  )

                return nomor >
                  terbesar
                  ? nomor
                  : terbesar
              },
              0,
            )

          const nomorBaru =
            nomorTerbesar + 1

          const idBaru =
            `BRG-${String(
              nomorBaru,
            ).padStart(
              3,
              '0',
            )}`

          const barangBaru: Barang = {
            id: idBaru,

            nama:
              barang.nama,

            kategori:
              barang.kategori,

            stok:
              barang.stok,

            satuan:
              barang.satuan,

            stokMinimum:
              barang.stokMinimum,

            keterangan:
              barang.keterangan,

            dibuatPada:
              new Date().toISOString(),
          }

          set((state) => ({
            daftarBarang: [
              barangBaru,
              ...state.daftarBarang,
            ],
          }))
        },

        editBarang: (
          id,
          barang,
        ) => {
          set((state) => ({
            daftarBarang:
              state.daftarBarang.map(
                (item) =>
                  item.id === id
                    ? {
                        ...item,

                        nama:
                          barang.nama,

                        kategori:
                          barang.kategori,

                        stok:
                          barang.stok,

                        satuan:
                          barang.satuan,

                        stokMinimum:
                          barang.stokMinimum,

                        keterangan:
                          barang.keterangan,
                      }
                    : item,
              ),
          }))
        },

        hapusBarang: (
          id,
        ) => {
          set((state) => ({
            daftarBarang:
              state.daftarBarang.filter(
                (item) =>
                  item.id !== id,
              ),
          }))
        },

        kurangiStok: (
          id,
          jumlah,
        ) => {
          if (
            jumlah <= 0
          ) {
            return false
          }

          const barang =
            get().daftarBarang.find(
              (item) =>
                item.id === id,
            )

          if (!barang) {
            return false
          }

          if (
            barang.stok <
            jumlah
          ) {
            return false
          }

          set((state) => ({
            daftarBarang:
              state.daftarBarang.map(
                (item) =>
                  item.id === id
                    ? {
                        ...item,
                        stok:
                          item.stok -
                          jumlah,
                      }
                    : item,
              ),
          }))

          return true
        },
      }),
      {
        name:
          'persediaan-atk-barang',
      },
    ),
  )