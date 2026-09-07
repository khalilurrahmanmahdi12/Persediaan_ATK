import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'

import { usePenggunaStore } from '../stores/penggunaStore'

import type {
  Pengguna,
} from '../types/pengguna'

interface AuthContextType {
  pengguna: Pengguna | null

  kirimOtp: (
    identifier: string,
  ) => Pengguna | null

  verifikasiOtp: (
    otp: string,
  ) => Pengguna | null

  logout: () => void
}

const AuthContext =
  createContext<
    AuthContextType | undefined
  >(undefined)

interface AuthProviderProps {
  children: ReactNode
}

const AUTH_STORAGE_KEY =
  'persediaan-atk-auth'

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const daftarPengguna =
    usePenggunaStore(
      (state) =>
        state.daftarPengguna,
    )

  const [
    pengguna,
    setPengguna,
  ] =
    useState<Pengguna | null>(
      null,
    )

  const [
    calonPengguna,
    setCalonPengguna,
  ] =
    useState<Pengguna | null>(
      null,
    )

  /*
    sessionStorage dipakai supaya:

    Tab 1 = Admin
    Tab 2 = Karyawan

    bisa login secara bersamaan.
  */
  useEffect(() => {
    const data =
      sessionStorage.getItem(
        AUTH_STORAGE_KEY,
      )

    if (!data) {
      return
    }

    try {
      const penggunaTersimpan =
        JSON.parse(
          data,
        ) as Pengguna

      const penggunaTerbaru =
        daftarPengguna.find(
          (item) =>
            item.id ===
            penggunaTersimpan.id,
        )

      if (
        !penggunaTerbaru ||
        !penggunaTerbaru.aktif
      ) {
        sessionStorage.removeItem(
          AUTH_STORAGE_KEY,
        )

        setPengguna(null)

        return
      }

      setPengguna(
        penggunaTerbaru,
      )
    } catch {
      sessionStorage.removeItem(
        AUTH_STORAGE_KEY,
      )

      setPengguna(null)
    }
  }, [daftarPengguna])

  const normalisasiNomor = (
    nomor: string,
  ) => {
    const angka =
      nomor.replace(
        /\D/g,
        '',
      )

    if (
      angka.startsWith('62')
    ) {
      return `0${angka.slice(2)}`
    }

    return angka
  }

  const kirimOtp = (
    identifier: string,
  ): Pengguna | null => {
    const input =
      identifier
        .trim()
        .toLowerCase()

    if (!input) {
      setCalonPengguna(null)

      return null
    }

    const ditemukan =
      daftarPengguna.find(
        (item) => {
          if (!item.aktif) {
            return false
          }

          const cocokEmail =
            item.email
              .toLowerCase() ===
            input

          const cocokWhatsapp =
            normalisasiNomor(
              item.whatsapp,
            ) ===
            normalisasiNomor(
              input,
            )

          return (
            cocokEmail ||
            cocokWhatsapp
          )
        },
      )

    if (!ditemukan) {
      setCalonPengguna(null)

      return null
    }

    setCalonPengguna(
      ditemukan,
    )

    return ditemukan
  }

  const verifikasiOtp = (
    otp: string,
  ): Pengguna | null => {
    if (!calonPengguna) {
      return null
    }

    /*
      OTP simulasi.
      Tidak ditampilkan di UI.
    */
    if (
      otp.trim() !==
      '123456'
    ) {
      return null
    }

    const userLogin =
      calonPengguna

    setPengguna(
      userLogin,
    )

    sessionStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify(
        userLogin,
      ),
    )

    setCalonPengguna(null)

    return userLogin
  }

  const logout = () => {
    setPengguna(null)

    setCalonPengguna(null)

    sessionStorage.removeItem(
      AUTH_STORAGE_KEY,
    )
  }

  return (
    <AuthContext.Provider
      value={{
        pengguna,
        kirimOtp,
        verifikasiOtp,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context =
    useContext(AuthContext)

  if (!context) {
    throw new Error(
      'useAuth harus digunakan di dalam AuthProvider',
    )
  }

  return context
}