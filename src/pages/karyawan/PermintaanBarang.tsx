import {
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  Clock3,
  LogOut,
  Package,
  PackageCheck,
  Send,
  UserRound,
  X,
  XCircle,
} from 'lucide-react'

import {
  useMemo,
  useState,
} from 'react'

import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import { useAuth } from '../../context/AuthContext'
import { useBarangStore } from '../../stores/barangStore'
import { usePermintaanStore } from '../../stores/permintaanStore'

import type { Permintaan } from '../../types/permintaan'

interface FormPermintaan {
  barangId: string
  jumlah: string
  tanggalPengambilan: string
  keterangan: string
}

const formAwal: FormPermintaan = {
  barangId: '',
  jumlah: '1',
  tanggalPengambilan: '',
  keterangan: '',
}

function formatTanggal(
  tanggal: string,
) {
  if (!tanggal) {
    return '-'
  }

  return new Intl.DateTimeFormat(
    'id-ID',
    {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    },
  ).format(
    new Date(tanggal),
  )
}

function badgeStatus(
  status: Permintaan['status'],
) {
  if (status === 'Diterima') {
    return {
      className:
        'border border-emerald-200 bg-emerald-100 text-emerald-800',
      icon: CheckCircle2,
    }
  }

  if (status === 'Ditolak') {
    return {
      className:
        'border border-red-200 bg-red-100 text-red-700',
      icon: XCircle,
    }
  }

  return {
    className:
      'border border-amber-200 bg-amber-100 text-amber-700',
    icon: Clock3,
  }
}

export default function PermintaanBarang() {
  const navigate = useNavigate()

  const {
    pengguna,
    logout,
  } = useAuth()

  const {
    daftarBarang,
  } = useBarangStore()

  const {
    daftarPermintaan,
    tambahPermintaan,
  } = usePermintaanStore()

  const [
    form,
    setForm,
  ] = useState<FormPermintaan>(
    formAwal,
  )

  const [
    permintaanDetail,
    setPermintaanDetail,
  ] =
    useState<Permintaan | null>(
      null,
    )

  const hariIni =
    new Date()
      .toISOString()
      .split('T')[0]

  const barangTersedia =
    useMemo(() => {
      return daftarBarang.filter(
        (barang) =>
          barang.stok > 0,
      )
    }, [daftarBarang])

  const barangDipilih =
    useMemo(() => {
      return daftarBarang.find(
        (barang) =>
          barang.id ===
          form.barangId,
      )
    }, [
      daftarBarang,
      form.barangId,
    ])

  const riwayatSaya =
    useMemo(() => {
      if (!pengguna) {
        return []
      }

      return daftarPermintaan
        .filter(
          (item) =>
            item.penggunaId ===
            pengguna.id,
        )
        .sort(
          (a, b) =>
            new Date(
              b.tanggalPengajuan,
            ).getTime() -
            new Date(
              a.tanggalPengajuan,
            ).getTime(),
        )
    }, [
      daftarPermintaan,
      pengguna,
    ])

  const handleKeluar = () => {
    logout()
    navigate('/')
  }

  const handleBarangBerubah = (
    barangId: string,
  ) => {
    setForm({
      ...form,
      barangId,
      jumlah: '1',
    })
  }

  const handleAjukan = () => {
    if (!pengguna) {
      toast.error(
        'Data pengguna tidak ditemukan.',
      )
      return
    }

    if (!form.barangId) {
      toast.error(
        'Pilih barang yang dibutuhkan.',
      )
      return
    }

    if (!barangDipilih) {
      toast.error(
        'Barang tidak ditemukan.',
      )
      return
    }

    if (!form.jumlah) {
      toast.error(
        'Masukkan jumlah barang.',
      )
      return
    }

    const jumlah =
      Number(form.jumlah)

    if (
      Number.isNaN(jumlah) ||
      jumlah <= 0
    ) {
      toast.error(
        'Jumlah barang tidak valid.',
      )
      return
    }

    if (
      jumlah >
      barangDipilih.stok
    ) {
      toast.error(
        `Jumlah melebihi stok yang tersedia (${barangDipilih.stok} ${barangDipilih.satuan}).`,
      )
      return
    }

    if (
      !form.tanggalPengambilan
    ) {
      toast.error(
        'Pilih tanggal pengambilan.',
      )
      return
    }

    if (
      form.tanggalPengambilan <
      hariIni
    ) {
      toast.error(
        'Tanggal pengambilan tidak boleh sebelum hari ini.',
      )
      return
    }

    tambahPermintaan({
      penggunaId:
        pengguna.id,

      namaKaryawan:
        pengguna.nama,

      divisi:
        pengguna.divisi,

      barangId:
        barangDipilih.id,

      namaBarang:
        barangDipilih.nama,

      jumlah,

      satuan:
        barangDipilih.satuan,

      tanggalPengambilan:
        form.tanggalPengambilan,

      keterangan:
        form.keterangan.trim(),
    })

    setForm(formAwal)

    toast.success(
      'Permintaan ATK berhasil diajukan.',
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-100/70">
      {/* NAVBAR */}
      <header className="border-b border-emerald-800 bg-emerald-900 text-white shadow-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-3 sm:h-20 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/15 text-white sm:h-11 sm:w-11 sm:rounded-xl">
              <Package
                size={18}
                className="sm:hidden"
              />

              <Package
                size={22}
                className="hidden sm:block"
              />
            </div>

            <div className="min-w-0">
              <h1 className="truncate text-sm font-extrabold text-white sm:text-base">
                Sistem Persediaan ATK
              </h1>

              <p className="hidden text-xs font-medium text-emerald-100 sm:block">
                Permintaan Barang Karyawan
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-bold text-white">
                {pengguna?.nama}
              </p>

              <p className="text-xs font-medium text-emerald-100">
                {pengguna?.divisi}
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 sm:h-10 sm:w-10 sm:rounded-xl">
              <UserRound
                size={17}
                className="sm:hidden"
              />

              <UserRound
                size={19}
                className="hidden sm:block"
              />
            </div>

            <button
              type="button"
              onClick={handleKeluar}
              title="Keluar"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 text-white transition hover:bg-white/10 sm:h-10 sm:w-10 sm:rounded-xl"
            >
              <LogOut
                size={16}
                className="sm:hidden"
              />

              <LogOut
                size={18}
                className="hidden sm:block"
              />
            </button>
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <div className="mx-auto max-w-7xl px-3 py-4 sm:px-6 sm:py-8 lg:px-8">

        {/* HERO */}
        <section className="mb-4 overflow-hidden rounded-2xl bg-emerald-900 text-white shadow-md sm:mb-6 sm:rounded-3xl sm:shadow-lg">
          <div className="px-4 py-4 sm:px-8 sm:py-7">
            <p className="text-[11px] font-bold text-emerald-200 sm:text-sm">
              Permintaan ATK
            </p>

            <h2 className="mt-1 text-xl font-extrabold leading-tight tracking-tight sm:mt-2 sm:text-4xl">
              Halo, {pengguna?.nama}
            </h2>

            <p className="mt-2 max-w-2xl text-[11px] font-medium leading-5 text-emerald-100 sm:mt-3 sm:text-base sm:leading-7">
              Ajukan kebutuhan ATK dengan cepat,
              pilih barang yang tersedia, tentukan
              jumlah, dan pantau status permintaan
              Anda dalam satu halaman.
            </p>
          </div>
        </section>

        {/* FORM */}
        <section className="overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm sm:rounded-3xl">

          {/* HEADER FORM */}
          <div className="border-b border-emerald-100 bg-emerald-50 px-4 py-3 sm:px-6 sm:py-5">
            <div className="flex items-center gap-2.5 sm:gap-3">

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 sm:h-11 sm:w-11 sm:rounded-xl">
                <PackageCheck
                  size={18}
                  className="sm:hidden"
                />

                <PackageCheck
                  size={21}
                  className="hidden sm:block"
                />
              </div>

              <div className="min-w-0">
                <h3 className="text-sm font-extrabold text-emerald-900 sm:text-base">
                  Form Permintaan ATK
                </h3>

                <p className="mt-0.5 text-[10px] font-medium leading-4 text-emerald-700 sm:mt-1 sm:text-sm">
                  Nama dan divisi terisi otomatis
                  sesuai akun.
                </p>
              </div>

            </div>
          </div>

          {/* BODY FORM */}
          <div className="p-4 sm:p-6">
            <div className="grid gap-3 sm:gap-5 md:grid-cols-2">

              {/* NAMA */}
              <div>
                <label className="mb-1.5 block text-xs font-bold text-stone-800 sm:mb-2 sm:text-sm">
                  Nama Karyawan
                </label>

                <div className="flex h-10 items-center rounded-xl border border-emerald-100 bg-emerald-50 px-3 text-xs font-semibold text-emerald-950 sm:h-12 sm:px-4 sm:text-sm">
                  {pengguna?.nama}
                </div>
              </div>

              {/* DIVISI */}
              <div>
                <label className="mb-1.5 block text-xs font-bold text-stone-800 sm:mb-2 sm:text-sm">
                  Divisi
                </label>

                <div className="flex h-10 items-center rounded-xl border border-emerald-100 bg-emerald-50 px-3 text-xs font-semibold text-emerald-950 sm:h-12 sm:px-4 sm:text-sm">
                  {pengguna?.divisi}
                </div>
              </div>

              {/* BARANG */}
              <div className="md:col-span-2">
                <label className="mb-1.5 block text-xs font-bold text-stone-800 sm:mb-2 sm:text-sm">
                  Barang
                </label>

                <div className="relative">
                  <select
                    value={
                      form.barangId
                    }
                    onChange={(
                      event,
                    ) =>
                      handleBarangBerubah(
                        event.target.value,
                      )
                    }
                    className="h-10 w-full appearance-none rounded-xl border border-emerald-200 bg-white px-3 pr-10 text-xs font-medium text-stone-800 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 sm:h-12 sm:px-4 sm:pr-12 sm:text-sm"
                  >
                    <option value="">
                      Pilih barang yang tersedia
                    </option>

                    {barangTersedia.map(
                      (barang) => (
                        <option
                          key={
                            barang.id
                          }
                          value={
                            barang.id
                          }
                        >
                          {barang.nama} — Stok {barang.stok} {barang.satuan}
                        </option>
                      ),
                    )}
                  </select>

                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500 sm:right-4 sm:size-[18px]"
                  />
                </div>
              </div>

              {/* JUMLAH */}
              <div>
                <label className="mb-1.5 block text-xs font-bold text-stone-800 sm:mb-2 sm:text-sm">
                  Jumlah
                </label>

                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max={
                      barangDipilih?.stok
                    }
                    disabled={
                      !barangDipilih
                    }
                    value={
                      form.jumlah
                    }
                    onChange={(
                      event,
                    ) =>
                      setForm({
                        ...form,
                        jumlah:
                          event.target.value,
                      })
                    }
                    className="h-10 w-full rounded-xl border border-emerald-200 bg-white px-3 pr-16 text-xs font-semibold text-stone-900 outline-none transition disabled:cursor-not-allowed disabled:bg-stone-100 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 sm:h-12 sm:px-4 sm:pr-20 sm:text-sm"
                  />

                  {barangDipilih && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-emerald-700 sm:right-4 sm:text-sm">
                      {barangDipilih.satuan}
                    </span>
                  )}
                </div>
              </div>

              {/* TANGGAL */}
              <div>
                <label className="mb-1.5 block text-xs font-bold text-stone-800 sm:mb-2 sm:text-sm">
                  Tanggal Pengambilan
                </label>

                <div className="relative">
                  <CalendarDays
                    size={16}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500 sm:left-4 sm:size-[18px]"
                  />

                  <input
                    type="date"
                    min={hariIni}
                    value={
                      form.tanggalPengambilan
                    }
                    onChange={(
                      event,
                    ) =>
                      setForm({
                        ...form,
                        tanggalPengambilan:
                          event.target.value,
                      })
                    }
                    className="h-10 w-full rounded-xl border border-emerald-200 bg-white pl-9 pr-3 text-xs font-semibold text-stone-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 sm:h-12 sm:pl-11 sm:pr-4 sm:text-sm"
                  />
                </div>
              </div>

              {/* KETERANGAN */}
              <div className="md:col-span-2">
                <label className="mb-1.5 block text-xs font-bold text-stone-800 sm:mb-2 sm:text-sm">
                  Keterangan
                  <span className="ml-1 font-medium text-stone-400">
                    (opsional)
                  </span>
                </label>

                <textarea
                  rows={2}
                  value={
                    form.keterangan
                  }
                  onChange={(
                    event,
                  ) =>
                    setForm({
                      ...form,
                      keterangan:
                        event.target.value,
                    })
                  }
                  placeholder="Contoh: Untuk kebutuhan administrasi divisi."
                  className="w-full resize-none rounded-xl border border-emerald-200 bg-white px-3 py-2.5 text-xs font-medium text-stone-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 sm:px-4 sm:py-3 sm:text-sm"
                />
              </div>
            </div>

            {/* BUTTON */}
            <div className="mt-4 flex justify-end sm:mt-6">
              <button
                type="button"
                onClick={
                  handleAjukan
                }
                disabled={
                  barangTersedia.length ===
                  0
                }
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-stone-300 sm:w-auto sm:px-6 sm:py-3 sm:text-sm"
              >
                <Send
                  size={15}
                  className="sm:hidden"
                />

                <Send
                  size={18}
                  className="hidden sm:block"
                />

                Ajukan Permintaan
              </button>
            </div>
          </div>
        </section>

        {/* RIWAYAT */}
        <section className="mt-4 overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm sm:mt-6 sm:rounded-3xl">

          {/* HEADER RIWAYAT */}
          <div className="flex items-center justify-between border-b border-emerald-100 bg-emerald-50 px-4 py-3 sm:px-6 sm:py-5">
            <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 sm:h-11 sm:w-11 sm:rounded-xl">
                <ClipboardList
                  size={18}
                  className="sm:hidden"
                />

                <ClipboardList
                  size={21}
                  className="hidden sm:block"
                />
              </div>

              <div className="min-w-0">
                <h3 className="text-sm font-extrabold text-emerald-900 sm:text-base">
                  Riwayat Permintaan Saya
                </h3>

                <p className="mt-0.5 text-[10px] font-medium leading-4 text-emerald-700 sm:mt-1 sm:text-sm">
                  Pantau status permintaan ATK
                  yang telah diajukan.
                </p>
              </div>
            </div>

            <span className="hidden rounded-full bg-white px-3 py-1 text-xs font-bold text-emerald-700 sm:inline-flex">
              {riwayatSaya.length}{' '}
              Permintaan
            </span>
          </div>

          {/* DESKTOP */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b border-emerald-100 bg-emerald-50/60 text-left text-xs font-bold uppercase tracking-wide text-emerald-800">
                  <th className="px-5 py-4">
                    Barang
                  </th>

                  <th className="px-5 py-4">
                    Jumlah
                  </th>

                  <th className="px-5 py-4">
                    Tanggal Ambil
                  </th>

                  <th className="px-5 py-4">
                    Status
                  </th>

                  <th className="px-5 py-4 text-right">
                    Aksi
                  </th>
                </tr>
              </thead>

              <tbody>
                {riwayatSaya.map(
                  (item) => {
                    const badge =
                      badgeStatus(
                        item.status,
                      )

                    const Icon =
                      badge.icon

                    return (
                      <tr
                        key={
                          item.id
                        }
                        className="border-b border-stone-100 last:border-0 hover:bg-emerald-50/40"
                      >
                        <td className="px-5 py-4">
                          <p className="text-sm font-bold text-stone-900">
                            {
                              item.namaBarang
                            }
                          </p>

                          <p className="mt-1 text-xs font-medium text-stone-500">
                            Diajukan{' '}
                            {formatTanggal(
                              item.tanggalPengajuan,
                            )}
                          </p>
                        </td>

                        <td className="px-5 py-4 text-sm font-bold text-stone-800">
                          {
                            item.jumlah
                          }{' '}
                          {
                            item.satuan
                          }
                        </td>

                        <td className="px-5 py-4 text-sm font-semibold text-stone-700">
                          {formatTanggal(
                            item.tanggalPengambilan,
                          )}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${badge.className}`}
                          >
                            <Icon
                              size={14}
                            />

                            {
                              item.status
                            }
                          </span>
                        </td>

                        <td className="px-5 py-4 text-right">
                          <button
                            type="button"
                            onClick={() =>
                              setPermintaanDetail(
                                item,
                              )
                            }
                            className="rounded-lg border border-emerald-200 px-3 py-2 text-xs font-bold text-emerald-700 transition hover:bg-emerald-50"
                          >
                            Detail
                          </button>
                        </td>
                      </tr>
                    )
                  },
                )}

                {riwayatSaya.length ===
                  0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-16 text-center"
                    >
                      <ClipboardList
                        size={38}
                        className="mx-auto text-emerald-200"
                      />

                      <p className="mt-3 font-bold text-stone-700">
                        Belum ada permintaan
                      </p>

                      <p className="mt-1 text-sm font-medium text-stone-500">
                        Permintaan yang Anda
                        ajukan akan tampil di sini.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* MOBILE */}
          <div className="divide-y divide-stone-100 md:hidden">
            {riwayatSaya.map(
              (item) => {
                const badge =
                  badgeStatus(
                    item.status,
                  )

                const Icon =
                  badge.icon

                return (
                  <div
                    key={item.id}
                    className="p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-extrabold text-stone-900">
                          {
                            item.namaBarang
                          }
                        </p>

                        <p className="mt-1 text-[11px] font-semibold text-stone-600">
                          {
                            item.jumlah
                          }{' '}
                          {
                            item.satuan
                          }
                        </p>
                      </div>

                      <span
                        className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold ${badge.className}`}
                      >
                        <Icon
                          size={12}
                        />

                        {
                          item.status
                        }
                      </span>
                    </div>

                    <div className="mt-3 flex items-end justify-between gap-3">
                      <div>
                        <p className="text-[10px] font-semibold text-stone-500">
                          Tanggal Pengambilan
                        </p>

                        <p className="mt-1 text-xs font-bold text-stone-800">
                          {formatTanggal(
                            item.tanggalPengambilan,
                          )}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setPermintaanDetail(
                            item,
                          )
                        }
                        className="shrink-0 rounded-lg border border-emerald-200 px-3 py-2 text-[10px] font-bold text-emerald-700 transition active:bg-emerald-50"
                      >
                        Detail
                      </button>
                    </div>
                  </div>
                )
              },
            )}

            {riwayatSaya.length ===
              0 && (
              <div className="px-5 py-10 text-center">
                <ClipboardList
                  size={32}
                  className="mx-auto text-emerald-200"
                />

                <p className="mt-3 text-sm font-bold text-stone-700">
                  Belum ada permintaan
                </p>

                <p className="mt-1 text-[11px] font-medium text-stone-500">
                  Permintaan yang Anda ajukan
                  akan tampil di sini.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* MODAL DETAIL */}
      {permintaanDetail && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-3 backdrop-blur-[2px] sm:p-4">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-2xl sm:rounded-3xl">

            {/* HEADER */}
            <div className="flex items-start justify-between border-b border-emerald-100 bg-emerald-50 px-4 py-3 sm:px-6 sm:py-5">
              <div>
                <h3 className="text-lg font-extrabold text-emerald-950 sm:text-xl">
                  Detail Permintaan
                </h3>

                <p className="mt-1 text-[11px] font-semibold text-emerald-700 sm:text-sm">
                  Informasi permintaan ATK
                  yang telah diajukan.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setPermintaanDetail(
                    null,
                  )
                }
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-stone-500 transition hover:bg-white hover:text-stone-800 sm:h-9 sm:w-9 sm:rounded-xl"
              >
                <X
                  size={18}
                />
              </button>
            </div>

            {/* BODY */}
            <div className="px-4 py-4 sm:p-6">
              <div>
                <DetailItem
                  label="Barang"
                  value={
                    permintaanDetail.namaBarang
                  }
                />

                <DetailItem
                  label="Jumlah"
                  value={`${permintaanDetail.jumlah} ${permintaanDetail.satuan}`}
                />

                <DetailItem
                  label="Tanggal Pengajuan"
                  value={formatTanggal(
                    permintaanDetail.tanggalPengajuan,
                  )}
                />

                <DetailItem
                  label="Tanggal Pengambilan"
                  value={formatTanggal(
                    permintaanDetail.tanggalPengambilan,
                  )}
                />

                {/* STATUS */}
                <div className="flex items-center justify-between gap-4 border-b border-stone-200 py-3 sm:gap-6 sm:py-4">
                  <p className="text-xs font-semibold text-stone-700 sm:text-sm">
                    Status
                  </p>

                  <StatusBadge
                    status={
                      permintaanDetail.status
                    }
                  />
                </div>

                {permintaanDetail.keterangan && (
                  <DetailItem
                    label="Keterangan"
                    value={
                      permintaanDetail.keterangan
                    }
                  />
                )}
              </div>

              {/* CATATAN ADMIN */}
              {permintaanDetail.catatanAdmin && (
                <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 sm:mt-5 sm:rounded-2xl sm:p-4">
                  <p className="text-[10px] font-extrabold uppercase tracking-wide text-emerald-700 sm:text-xs">
                    Catatan Admin
                  </p>

                  <p className="mt-2 text-xs font-semibold leading-5 text-emerald-950 sm:text-sm sm:leading-6">
                    {
                      permintaanDetail.catatanAdmin
                    }
                  </p>
                </div>
              )}
            </div>

            {/* FOOTER */}
            <div className="flex justify-end border-t border-emerald-100 bg-emerald-50 px-4 py-3 sm:px-6 sm:py-4">
              <button
                type="button"
                onClick={() =>
                  setPermintaanDetail(
                    null,
                  )
                }
                className="w-full rounded-xl bg-emerald-700 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-800 sm:w-auto sm:px-6 sm:text-sm"
              >
                Tutup
              </button>
            </div>

          </div>
        </div>
      )}
    </main>
  )
}

interface DetailItemProps {
  label: string
  value: string
}

function DetailItem({
  label,
  value,
}: DetailItemProps) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-stone-200 py-3 first:pt-0 sm:gap-6 sm:py-4">
      <p className="text-xs font-semibold text-stone-700 sm:text-sm">
        {label}
      </p>

      <p className="max-w-[65%] text-right text-xs font-bold text-stone-950 sm:text-sm">
        {value}
      </p>
    </div>
  )
}

function StatusBadge({
  status,
}: {
  status: Permintaan['status']
}) {
  const badge =
    badgeStatus(status)

  const Icon =
    badge.icon

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold sm:gap-1.5 sm:px-3 sm:py-1.5 sm:text-xs ${badge.className}`}
    >
      <Icon
        size={12}
        className="sm:hidden"
      />

      <Icon
        size={14}
        className="hidden sm:block"
      />

      {status}
    </span>
  )
}