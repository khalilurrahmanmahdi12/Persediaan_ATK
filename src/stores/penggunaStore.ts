import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type {
  Pengguna,
  RolePengguna,
} from '../types/pengguna'

interface PenggunaInput {
  nama: string
  email: string
  whatsapp: string
  divisi: string
  jabatan: string
  role: RolePengguna
  aktif: boolean
}

interface PenggunaState {
  daftarPengguna: Pengguna[]

  tambahPengguna: (
    data: PenggunaInput,
  ) => void

  editPengguna: (
    id: number,
    data: PenggunaInput,
  ) => void

  hapusPengguna: (
    id: number,
  ) => void
}

const dataAwal: Pengguna[] = [
  {
    id: 1,
    nama:
      'Admin Persediaan',
    email:
      'admin@persediaanatk.id',
    whatsapp:
      '081234567890',
    divisi:
      'General Affair',
    jabatan:
      'Administrator',
    role:
      'admin',
    aktif:
      true,
  },
  {
    id: 2,
    nama:
      'Khalilurrahman Mahdi',
    email:
      'khalil@persediaanatk.id',
    whatsapp:
      '085236752566',
    divisi:
      'Teknologi Informasi',
    jabatan:
      'Staff IT',
    role:
      'karyawan',
    aktif:
      true,
  },
  {
    id: 3,
    nama:
      'Andi Pratama',
    email:
      'andi@persediaanatk.id',
    whatsapp:
      '081298765432',
    divisi:
      'Keuangan',
    jabatan:
      'Staff Finance',
    role:
      'karyawan',
    aktif:
      true,
  },
  {
    id: 4,
    nama:
      'Siti Rahma',
    email:
      'siti@persediaanatk.id',
    whatsapp:
      '081377788899',
    divisi:
      'Human Resources',
    jabatan:
      'Staff HR',
    role:
      'karyawan',
    aktif:
      true,
  },
  {
    id: 5,
    nama:
      'Rizky Maulana',
    email:
      'rizky@persediaanatk.id',
    whatsapp:
      '081355566677',
    divisi:
      'Operasional',
    jabatan:
      'Staff Operasional',
    role:
      'karyawan',
    aktif:
      true,
  },
]

export const usePenggunaStore =
  create<PenggunaState>()(
    persist(
      (set, get) => ({
        daftarPengguna:
          dataAwal,

        tambahPengguna: (
          data,
        ) => {
          const daftar =
            get().daftarPengguna

          const idBaru =
            daftar.length === 0
              ? 1
              : Math.max(
                  ...daftar.map(
                    (item) =>
                      item.id,
                  ),
                ) + 1

          const penggunaBaru: Pengguna = {
            id:
              idBaru,

            nama:
              data.nama,

            email:
              data.email,

            whatsapp:
              data.whatsapp,

            divisi:
              data.divisi,

            jabatan:
              data.jabatan,

            role:
              data.role,

            aktif:
              data.aktif,
          }

          set((state) => ({
            daftarPengguna: [
              ...state.daftarPengguna,
              penggunaBaru,
            ],
          }))
        },

        editPengguna: (
          id,
          data,
        ) => {
          set((state) => ({
            daftarPengguna:
              state.daftarPengguna.map(
                (item) =>
                  item.id === id
                    ? {
                        ...item,

                        nama:
                          data.nama,

                        email:
                          data.email,

                        whatsapp:
                          data.whatsapp,

                        divisi:
                          data.divisi,

                        jabatan:
                          data.jabatan,

                        role:
                          data.role,

                        aktif:
                          data.aktif,
                      }
                    : item,
              ),
          }))
        },

        hapusPengguna: (
          id,
        ) => {
          set((state) => ({
            daftarPengguna:
              state.daftarPengguna.filter(
                (item) =>
                  item.id !== id,
              ),
          }))
        },
      }),
      {
        name:
          'persediaan-atk-pengguna-data',
      },
    ),
  )