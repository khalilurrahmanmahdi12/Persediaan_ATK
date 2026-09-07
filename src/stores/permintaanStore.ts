import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type {
  Permintaan,
  PermintaanInput,
  StatusPermintaan,
} from '../types/permintaan'

interface PermintaanState {
  daftarPermintaan: Permintaan[]

  tambahPermintaan: (
    data: PermintaanInput,
  ) => void

  ubahStatusPermintaan: (
    id: string,
    status: StatusPermintaan,
    catatanAdmin?: string,
  ) => void

  hapusPermintaan: (
    id: string,
  ) => void
}

export const usePermintaanStore =
  create<PermintaanState>()(
    persist(
      (set) => ({
        daftarPermintaan: [],

        tambahPermintaan: (
          data: PermintaanInput,
        ) => {
          const sekarang =
            new Date()

          const nomor =
            Date.now()

          const permintaanBaru: Permintaan = {
            id: `REQ-${nomor}`,

            penggunaId:
              data.penggunaId,

            namaKaryawan:
              data.namaKaryawan,

            divisi:
              data.divisi,

            barangId:
              data.barangId,

            namaBarang:
              data.namaBarang,

            jumlah:
              data.jumlah,

            satuan:
              data.satuan,

            tanggalPengajuan:
              sekarang.toISOString(),

            tanggalPengambilan:
              data.tanggalPengambilan,

            keterangan:
              data.keterangan,

            status:
              'Menunggu',

            catatanAdmin: '',
          }

          set((state) => ({
            daftarPermintaan: [
              permintaanBaru,
              ...state.daftarPermintaan,
            ],
          }))
        },

        ubahStatusPermintaan: (
          id,
          status,
          catatanAdmin = '',
        ) => {
          set((state) => ({
            daftarPermintaan:
              state.daftarPermintaan.map(
                (item) =>
                  item.id === id
                    ? {
                        ...item,
                        status,
                        catatanAdmin,
                      }
                    : item,
              ),
          }))
        },

        hapusPermintaan: (
          id,
        ) => {
          set((state) => ({
            daftarPermintaan:
              state.daftarPermintaan.filter(
                (item) =>
                  item.id !== id,
              ),
          }))
        },
      }),
      {
        name:
          'persediaan-atk-permintaan',
      },
    ),
  )