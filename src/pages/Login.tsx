import {
  Mail,
  ShieldCheck,
  Smartphone,
} from 'lucide-react'

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import { useAuth } from '../context/AuthContext'

export default function Login() {
  const navigate = useNavigate()

  const {
    kirimOtp,
    verifikasiOtp,
  } = useAuth()

  const [identifier, setIdentifier] =
    useState('')

  const [otp, setOtp] =
    useState('')

  const [otpSent, setOtpSent] =
    useState(false)

  const [tujuanOtp, setTujuanOtp] =
    useState('')

  const handleKirimOtp = () => {
    if (!identifier.trim()) {
      toast.error(
        'Masukkan email atau nomor WhatsApp.',
      )
      return
    }

    const user =
      kirimOtp(identifier)

    if (!user) {
      toast.error(
        'Email atau nomor WhatsApp tidak terdaftar.',
      )
      return
    }

    setTujuanOtp(
      identifier.includes('@')
        ? user.email
        : user.whatsapp.replace(
            /(\d{4})\d+(\d{3})/,
            '$1******$2',
          ),
    )

    setOtpSent(true)

    toast.success(
      'Kode verifikasi telah dikirim.',
    )
  }

  const handleVerifikasiOtp = () => {
    if (!otp.trim()) {
      toast.error(
        'Masukkan kode OTP.',
      )
      return
    }

    const user =
      verifikasiOtp(otp)

    if (!user) {
      toast.error(
        'Kode OTP tidak valid.',
      )
      return
    }

    toast.success(
      'Login berhasil.',
    )

    navigate(
      user.role === 'admin'
        ? '/admin'
        : '/karyawan',
    )
  }

  const handleGantiAkun = () => {
    setOtpSent(false)
    setOtp('')
    setTujuanOtp('')
  }

  return (
    <main className="min-h-screen bg-stone-100">
      <div className="grid min-h-screen lg:grid-cols-2">

        {/* PANEL KIRI DESKTOP */}
        <section className="hidden bg-emerald-900 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="px-16 py-12">

            {/* BRAND */}
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-sm">
                <ShieldCheck
                  size={28}
                />
              </div>

              <div>
                <h1 className="text-3xl font-extrabold tracking-tight">
                  Sistem Persediaan ATK
                </h1>

                <p className="mt-1 text-sm font-medium text-emerald-100">
                  Sistem Persediaan Barang
                  Kantor
                </p>
              </div>
            </div>

            {/* DESKRIPSI */}
            <div className="mt-24 max-w-xl">
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-emerald-200">
                Persediaan Kantor
              </p>

              <h2 className="mt-6 text-5xl font-extrabold leading-tight">
                Kelola persediaan ATK
                dengan lebih mudah.
              </h2>

              <p className="mt-6 text-lg leading-8 text-emerald-100">
                Kelola stok barang,
                permintaan karyawan,
                persetujuan admin,
                riwayat pengambilan,
                serta laporan dalam satu
                sistem yang sederhana.
              </p>
            </div>
          </div>

          {/* FOOTER DESKTOP */}
          <div className="px-16 py-10">
            <p className="text-sm font-medium text-emerald-200">
              Sistem Persediaan ATK •
              Sistem simulasi untuk
              portofolio
            </p>
          </div>
        </section>

        {/* PANEL LOGIN */}
        <section className="flex min-h-screen items-center justify-center px-4 py-5 sm:px-6 sm:py-8 lg:px-10">
          <div className="w-full max-w-md">

            {/* HERO MOBILE */}
            <div className="mb-3 rounded-2xl bg-emerald-900 px-4 py-3 text-white shadow-sm lg:hidden">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-emerald-700">
                  <ShieldCheck
                    size={17}
                  />
                </div>

                <div className="min-w-0">
                  <h1 className="text-sm font-extrabold leading-tight text-white">
                    Sistem Persediaan ATK
                  </h1>

                  <p className="mt-0.5 text-[11px] font-medium leading-4 text-emerald-100">
                    Sistem Persediaan Barang
                    Kantor
                  </p>
                </div>
              </div>
            </div>

            {/* CARD LOGIN */}
            <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm sm:rounded-3xl">
              <div className="px-5 py-5 sm:px-8 sm:py-8">

                {/* ICON */}
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 sm:h-14 sm:w-14 sm:rounded-2xl">
                  <ShieldCheck
                    size={22}
                    className="sm:hidden"
                  />

                  <ShieldCheck
                    size={26}
                    className="hidden sm:block"
                  />
                </div>

                {/* TITLE */}
                <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-stone-900 sm:mt-6 sm:text-3xl">
                  Masuk ke Sistem
                </h2>

                <p className="mt-2 text-xs font-medium leading-6 text-stone-500 sm:mt-3 sm:text-sm sm:leading-7">
                  Gunakan email atau nomor
                  WhatsApp yang terdaftar
                  untuk menerima kode
                  verifikasi.
                </p>

                {!otpSent ? (
                  /* FORM IDENTIFIER */
                  <div className="mt-5 space-y-4 sm:mt-8 sm:space-y-5">

                    <div>
                      <label className="mb-2 block text-xs font-bold text-stone-700 sm:text-sm">
                        Email atau Nomor
                        WhatsApp
                      </label>

                      <div className="relative">
                        {identifier.includes(
                          '@',
                        ) ? (
                          <Mail
                            size={16}
                            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 sm:left-4 sm:size-[18px]"
                          />
                        ) : (
                          <Smartphone
                            size={16}
                            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 sm:left-4 sm:size-[18px]"
                          />
                        )}

                        <input
                          type="text"
                          value={identifier}
                          onChange={(
                            event,
                          ) =>
                            setIdentifier(
                              event.target
                                .value,
                            )
                          }
                          placeholder="nama@perusahaan.com atau 081234567890"
                          className="h-11 w-full rounded-xl border border-stone-300 bg-white pl-10 pr-3 text-xs font-medium text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 sm:h-12 sm:pl-11 sm:pr-4 sm:text-sm"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={
                        handleKirimOtp
                      }
                      className="w-full rounded-xl bg-emerald-700 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-800 sm:py-3 sm:text-sm"
                    >
                      Kirim Kode Verifikasi
                    </button>

                  </div>
                ) : (
                  /* FORM OTP */
                  <div className="mt-5 space-y-4 sm:mt-8 sm:space-y-5">

                    {/* INFO TUJUAN */}
                    <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 sm:rounded-2xl sm:py-4">
                      <p className="text-xs font-bold text-emerald-900 sm:text-sm">
                        Kode verifikasi telah
                        dikirim
                      </p>

                      <p className="mt-1 text-xs font-medium text-emerald-700 sm:text-sm">
                        Tujuan:{' '}
                        {tujuanOtp}
                      </p>
                    </div>

                    {/* INPUT OTP */}
                    <div>
                      <label className="mb-2 block text-xs font-bold text-stone-700 sm:text-sm">
                        Kode Verifikasi
                      </label>

                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        value={otp}
                        onChange={(
                          event,
                        ) =>
                          setOtp(
                            event.target.value.replace(
                              /\D/g,
                              '',
                            ),
                          )
                        }
                        placeholder="Masukkan 6 digit kode"
                        className="h-11 w-full rounded-xl border border-stone-300 bg-white px-4 text-sm font-semibold tracking-[0.25em] text-stone-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 sm:h-12"
                      />
                    </div>

                    {/* VERIFIKASI */}
                    <button
                      type="button"
                      onClick={
                        handleVerifikasiOtp
                      }
                      className="w-full rounded-xl bg-emerald-700 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-800 sm:py-3 sm:text-sm"
                    >
                      Verifikasi & Masuk
                    </button>

                    {/* GANTI AKUN */}
                    <button
                      type="button"
                      onClick={
                        handleGantiAkun
                      }
                      className="w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-xs font-bold text-stone-700 transition hover:bg-stone-100 sm:py-3 sm:text-sm"
                    >
                      Ganti Email / Nomor
                    </button>

                  </div>
                )}
              </div>
            </div>

          </div>
        </section>
      </div>
    </main>
  )
}