import {
  Edit3,
  Plus,
  Search,
  Trash2,
  UserRound,
  Users,
  X,
} from 'lucide-react'

import {
  useMemo,
  useState,
} from 'react'

import { toast } from 'sonner'

import AdminLayout from '../../components/layout/AdminLayout'
import { usePenggunaStore } from '../../stores/penggunaStore'

import type {
  Pengguna,
} from '../../types/pengguna'

interface FormKaryawan {
  nama: string
  email: string
  whatsapp: string
  divisi: string
  jabatan: string
  aktif: boolean
}

const formAwal: FormKaryawan = {
  nama: '',
  email: '',
  whatsapp: '',
  divisi: '',
  jabatan: '',
  aktif: true,
}

export default function KaryawanPage() {
  const {
    daftarPengguna,
    tambahPengguna,
    editPengguna,
    hapusPengguna,
  } = usePenggunaStore()

  const [
    pencarian,
    setPencarian,
  ] = useState('')

  const [
    filterDivisi,
    setFilterDivisi,
  ] = useState('Semua')

  const [
    modalTerbuka,
    setModalTerbuka,
  ] = useState(false)

  const [
    karyawanEdit,
    setKaryawanEdit,
  ] =
    useState<Pengguna | null>(
      null,
    )

  const [
    karyawanHapus,
    setKaryawanHapus,
  ] =
    useState<Pengguna | null>(
      null,
    )

  const [
    form,
    setForm,
  ] =
    useState<FormKaryawan>(
      formAwal,
    )

  const daftarKaryawan =
    useMemo(() => {
      return daftarPengguna.filter(
        (item) =>
          item.role ===
          'karyawan',
      )
    }, [daftarPengguna])

  const daftarDivisi =
    useMemo(() => {
      return [
        'Semua',
        ...Array.from(
          new Set(
            daftarKaryawan.map(
              (item) =>
                item.divisi,
            ),
          ),
        ),
      ]
    }, [daftarKaryawan])

  const dataTampil =
    useMemo(() => {
      const keyword =
        pencarian
          .trim()
          .toLowerCase()

      return daftarKaryawan.filter(
        (item) => {
          const cocokCari =
            !keyword ||
            item.nama
              .toLowerCase()
              .includes(keyword) ||
            item.email
              .toLowerCase()
              .includes(keyword) ||
            item.whatsapp
              .toLowerCase()
              .includes(keyword) ||
            item.divisi
              .toLowerCase()
              .includes(keyword) ||
            item.jabatan
              .toLowerCase()
              .includes(keyword)

          const cocokDivisi =
            filterDivisi ===
              'Semua' ||
            item.divisi ===
              filterDivisi

          return (
            cocokCari &&
            cocokDivisi
          )
        },
      )
    }, [
      daftarKaryawan,
      pencarian,
      filterDivisi,
    ])

  const bukaTambah = () => {
    setKaryawanEdit(null)
    setForm(formAwal)
    setModalTerbuka(true)
  }

  const bukaEdit = (
    item: Pengguna,
  ) => {
    setKaryawanEdit(item)

    setForm({
      nama: item.nama,
      email: item.email,
      whatsapp:
        item.whatsapp,
      divisi:
        item.divisi,
      jabatan:
        item.jabatan,
      aktif:
        item.aktif,
    })

    setModalTerbuka(true)
  }

  const tutupModal = () => {
    setModalTerbuka(false)
    setKaryawanEdit(null)
    setForm(formAwal)
  }

  const handleSimpan = () => {
    if (
      !form.nama.trim() ||
      !form.email.trim() ||
      !form.whatsapp.trim() ||
      !form.divisi.trim() ||
      !form.jabatan.trim()
    ) {
      toast.error(
        'Lengkapi data karyawan.',
      )
      return
    }

    if (
      !form.email.includes('@')
    ) {
      toast.error(
        'Email tidak valid.',
      )
      return
    }

    const emailSudahAda =
      daftarPengguna.some(
        (item) =>
          item.email
            .toLowerCase() ===
            form.email
              .trim()
              .toLowerCase() &&
          item.id !==
            karyawanEdit?.id,
      )

    if (emailSudahAda) {
      toast.error(
        'Email sudah digunakan.',
      )
      return
    }

    const nomorSudahAda =
      daftarPengguna.some(
        (item) =>
          item.whatsapp ===
            form.whatsapp.trim() &&
          item.id !==
            karyawanEdit?.id,
      )

    if (nomorSudahAda) {
      toast.error(
        'Nomor WhatsApp sudah digunakan.',
      )
      return
    }

    const data = {
      nama:
        form.nama.trim(),

      email:
        form.email
          .trim()
          .toLowerCase(),

      whatsapp:
        form.whatsapp.trim(),

      divisi:
        form.divisi.trim(),

      jabatan:
        form.jabatan.trim(),

      role:
        'karyawan' as const,

      aktif:
        form.aktif,
    }

    if (karyawanEdit) {
      editPengguna(
        karyawanEdit.id,
        data,
      )

      toast.success(
        'Data karyawan berhasil diperbarui.',
      )
    } else {
      tambahPengguna(data)

      toast.success(
        'Karyawan berhasil ditambahkan.',
      )
    }

    tutupModal()
  }

  const konfirmasiHapus = () => {
    if (!karyawanHapus) {
      return
    }

    hapusPengguna(
      karyawanHapus.id,
    )

    toast.success(
      'Karyawan berhasil dihapus.',
    )

    setKaryawanHapus(null)
  }

  return (
    <AdminLayout>
      <div className="min-w-0">

        {/* HEADER */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold text-emerald-700">
              Manajemen Pengguna
            </p>

            <h1 className="mt-1 text-2xl font-extrabold text-stone-950">
              Data Karyawan
            </h1>

            <p className="mt-1 text-sm font-medium text-stone-500">
              Kelola akun karyawan yang dapat
              mengakses Sistem Persediaan ATK.
            </p>
          </div>

          <button
            type="button"
            onClick={bukaTambah}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-800 sm:w-auto"
          >
            <Plus size={18} />
            Tambah Karyawan
          </button>
        </div>

        {/* STATISTIK */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-stone-500">
              Total Karyawan
            </p>

            <p className="mt-2 text-3xl font-extrabold text-stone-950">
              {daftarKaryawan.length}
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-stone-500">
              Aktif
            </p>

            <p className="mt-2 text-3xl font-extrabold text-emerald-700">
              {
                daftarKaryawan.filter(
                  (item) =>
                    item.aktif,
                ).length
              }
            </p>
          </div>

          <div className="rounded-2xl border border-red-100 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-stone-500">
              Nonaktif
            </p>

            <p className="mt-2 text-3xl font-extrabold text-red-600">
              {
                daftarKaryawan.filter(
                  (item) =>
                    !item.aktif,
                ).length
              }
            </p>
          </div>
        </div>

        {/* FILTER */}
        <div className="mt-5 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
          <div className="grid gap-3 md:grid-cols-[1fr_220px]">

            <div className="relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
              />

              <input
                type="text"
                value={pencarian}
                onChange={(event) =>
                  setPencarian(
                    event.target.value,
                  )
                }
                placeholder="Cari nama, email, WhatsApp, atau divisi..."
                className="h-11 w-full rounded-xl border border-stone-300 bg-white pl-11 pr-4 text-sm font-medium text-stone-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            <select
              value={filterDivisi}
              onChange={(event) =>
                setFilterDivisi(
                  event.target.value,
                )
              }
              className="h-11 w-full rounded-xl border border-stone-300 bg-white px-4 text-sm font-semibold text-stone-700 outline-none focus:border-emerald-600"
            >
              {daftarDivisi.map(
                (divisi) => (
                  <option
                    key={divisi}
                    value={divisi}
                  >
                    {divisi}
                  </option>
                ),
              )}
            </select>
          </div>
        </div>

        {/* MOBILE CARD */}
        <div className="mt-5 space-y-3 md:hidden">
          {dataTampil.map(
            (item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm"
              >
                {/* HEADER */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                      <UserRound
                        size={18}
                      />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-extrabold text-stone-950">
                        {item.nama}
                      </p>

                      <p className="mt-1 text-[11px] font-semibold text-stone-400">
                        ID #{item.id}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                      item.aktif
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {item.aktif
                      ? 'Aktif'
                      : 'Nonaktif'}
                  </span>
                </div>

                {/* DETAIL */}
                <div className="mt-4 space-y-3">
                  <div className="rounded-xl bg-stone-50 p-3">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-stone-400">
                      Kontak
                    </p>

                    <p className="mt-1 break-all text-xs font-bold text-stone-800">
                      {item.email}
                    </p>

                    <p className="mt-1 text-xs font-medium text-stone-500">
                      {item.whatsapp}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-stone-50 p-3">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-stone-400">
                        Divisi
                      </p>

                      <p className="mt-1 text-xs font-bold text-stone-800">
                        {item.divisi}
                      </p>
                    </div>

                    <div className="rounded-xl bg-stone-50 p-3">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-stone-400">
                        Jabatan
                      </p>

                      <p className="mt-1 text-xs font-bold text-stone-800">
                        {item.jabatan}
                      </p>
                    </div>
                  </div>
                </div>

                {/* ACTION */}
                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      bukaEdit(item)
                    }
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-xs font-bold text-emerald-700"
                  >
                    <Edit3 size={15} />
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setKaryawanHapus(
                        item,
                      )
                    }
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-xs font-bold text-red-600"
                  >
                    <Trash2 size={15} />
                    Hapus
                  </button>
                </div>
              </div>
            ),
          )}

          {dataTampil.length ===
            0 && (
            <div className="rounded-2xl border border-stone-200 bg-white px-5 py-12 text-center shadow-sm">
              <Users
                size={38}
                className="mx-auto text-emerald-200"
              />

              <p className="mt-3 font-bold text-stone-700">
                Karyawan tidak ditemukan
              </p>
            </div>
          )}
        </div>

        {/* DESKTOP TABLE */}
        <div className="mt-5 hidden overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm md:block">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <thead>
                <tr className="border-b border-emerald-100 bg-emerald-50/70 text-left text-xs font-bold uppercase tracking-wide text-emerald-800">
                  <th className="px-5 py-4">
                    Karyawan
                  </th>

                  <th className="px-5 py-4">
                    Kontak
                  </th>

                  <th className="px-5 py-4">
                    Divisi
                  </th>

                  <th className="px-5 py-4">
                    Jabatan
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
                {dataTampil.map(
                  (item) => (
                    <tr
                      key={item.id}
                      className="border-b border-stone-100 last:border-0 hover:bg-emerald-50/30"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                            <UserRound size={19} />
                          </div>

                          <div>
                            <p className="text-sm font-bold text-stone-950">
                              {item.nama}
                            </p>

                            <p className="mt-1 text-xs font-medium text-stone-400">
                              ID #{item.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold text-stone-800">
                          {item.email}
                        </p>

                        <p className="mt-1 text-xs font-medium text-stone-500">
                          {item.whatsapp}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-sm font-semibold text-stone-700">
                        {item.divisi}
                      </td>

                      <td className="px-5 py-4 text-sm font-semibold text-stone-700">
                        {item.jabatan}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1.5 text-xs font-bold ${
                            item.aktif
                              ? 'border border-emerald-200 bg-emerald-100 text-emerald-800'
                              : 'border border-red-200 bg-red-100 text-red-700'
                          }`}
                        >
                          {item.aktif
                            ? 'Aktif'
                            : 'Nonaktif'}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              bukaEdit(
                                item,
                              )
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-stone-200 text-stone-500 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                          >
                            <Edit3 size={16} />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              setKaryawanHapus(
                                item,
                              )
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-stone-200 text-stone-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ),
                )}

                {dataTampil.length ===
                  0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-16 text-center"
                    >
                      <Users
                        size={40}
                        className="mx-auto text-emerald-200"
                      />

                      <p className="mt-3 font-bold text-stone-700">
                        Karyawan tidak ditemukan
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODAL TAMBAH / EDIT */}
      {modalTerbuka && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/50 p-3 pt-3 backdrop-blur-[2px] sm:items-center sm:p-4">
          <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl sm:rounded-3xl">

            {/* HEADER */}
            <div className="flex items-start justify-between border-b border-emerald-100 bg-emerald-50 px-4 py-3 sm:px-6 sm:py-5">
              <div>
                <h2 className="text-lg font-extrabold text-emerald-950 sm:text-xl">
                  {karyawanEdit
                    ? 'Edit Karyawan'
                    : 'Tambah Karyawan'}
                </h2>

                <p className="mt-1 text-[11px] font-semibold text-emerald-700 sm:text-sm">
                  Kelola data akun karyawan.
                </p>
              </div>

              <button
                type="button"
                onClick={tutupModal}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-stone-500 hover:bg-white sm:h-9 sm:w-9 sm:rounded-xl"
              >
                <X size={18} />
              </button>
            </div>

            {/* BODY */}
            <div className="px-4 py-4 sm:px-6 sm:py-5">
              <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">

                {/* NAMA */}
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-xs font-bold text-stone-800 sm:mb-2 sm:text-sm">
                    Nama Lengkap
                  </label>

                  <input
                    type="text"
                    value={form.nama}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        nama:
                          event.target.value,
                      })
                    }
                    placeholder="Nama karyawan"
                    className="h-10 w-full rounded-xl border border-stone-300 px-3 text-xs font-medium outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 sm:h-11 sm:px-4 sm:text-sm"
                  />
                </div>

                {/* EMAIL */}
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-stone-800 sm:mb-2 sm:text-sm">
                    Email
                  </label>

                  <input
                    type="email"
                    value={form.email}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        email:
                          event.target.value,
                      })
                    }
                    placeholder="nama@perusahaan.com"
                    className="h-10 w-full rounded-xl border border-stone-300 px-3 text-xs font-medium outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 sm:h-11 sm:px-4 sm:text-sm"
                  />
                </div>

                {/* WHATSAPP */}
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-stone-800 sm:mb-2 sm:text-sm">
                    Nomor WhatsApp
                  </label>

                  <input
                    type="text"
                    value={form.whatsapp}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        whatsapp:
                          event.target.value.replace(
                            /\D/g,
                            '',
                          ),
                      })
                    }
                    placeholder="081234567890"
                    className="h-10 w-full rounded-xl border border-stone-300 px-3 text-xs font-medium outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 sm:h-11 sm:px-4 sm:text-sm"
                  />
                </div>

                {/* DIVISI */}
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-stone-800 sm:mb-2 sm:text-sm">
                    Divisi
                  </label>

                  <select
                    value={form.divisi}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        divisi:
                          event.target.value,
                      })
                    }
                    className="h-10 w-full rounded-xl border border-stone-300 bg-white px-3 text-xs font-medium outline-none focus:border-emerald-600 sm:h-11 sm:px-4 sm:text-sm"
                  >
                    <option value="">
                      Pilih divisi
                    </option>

                    <option value="Teknologi Informasi">
                      Teknologi Informasi
                    </option>

                    <option value="Keuangan">
                      Keuangan
                    </option>

                    <option value="Human Resources">
                      Human Resources
                    </option>

                    <option value="Operasional">
                      Operasional
                    </option>

                    <option value="Marketing">
                      Marketing
                    </option>

                    <option value="General Affair">
                      General Affair
                    </option>
                  </select>
                </div>

                {/* JABATAN */}
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-stone-800 sm:mb-2 sm:text-sm">
                    Jabatan
                  </label>

                  <input
                    type="text"
                    value={form.jabatan}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        jabatan:
                          event.target.value,
                      })
                    }
                    placeholder="Contoh: Staff IT"
                    className="h-10 w-full rounded-xl border border-stone-300 px-3 text-xs font-medium outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 sm:h-11 sm:px-4 sm:text-sm"
                  />
                </div>

                {/* STATUS */}
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-xs font-bold text-stone-800 sm:mb-2 sm:text-sm">
                    Status Akun
                  </label>

                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        setForm({
                          ...form,
                          aktif: true,
                        })
                      }
                      className={`rounded-xl border px-3 py-2.5 text-xs font-bold transition sm:px-4 sm:py-3 sm:text-sm ${
                        form.aktif
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                          : 'border-stone-200 bg-white text-stone-500'
                      }`}
                    >
                      Aktif
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setForm({
                          ...form,
                          aktif: false,
                        })
                      }
                      className={`rounded-xl border px-3 py-2.5 text-xs font-bold transition sm:px-4 sm:py-3 sm:text-sm ${
                        !form.aktif
                          ? 'border-red-500 bg-red-50 text-red-700'
                          : 'border-stone-200 bg-white text-stone-500'
                      }`}
                    >
                      Nonaktif
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* FOOTER */}
            <div className="flex gap-2 border-t border-stone-200 bg-stone-50 px-4 py-3 sm:justify-end sm:gap-3 sm:px-6 sm:py-4">
              <button
                type="button"
                onClick={tutupModal}
                className="flex-1 rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-xs font-bold text-stone-700 hover:bg-stone-100 sm:flex-none sm:px-5 sm:text-sm"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={handleSimpan}
                className="flex-1 rounded-xl bg-emerald-700 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-800 sm:flex-none sm:px-5 sm:text-sm"
              >
                {karyawanEdit
                  ? 'Simpan Perubahan'
                  : 'Tambah Karyawan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL HAPUS */}
      {karyawanHapus && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px]">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl sm:rounded-3xl sm:p-6">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600 sm:h-14 sm:w-14">
              <Trash2 size={25} />
            </div>

            <div className="mt-4 text-center sm:mt-5">
              <h3 className="text-lg font-extrabold text-stone-950 sm:text-xl">
                Hapus Karyawan?
              </h3>

              <p className="mt-2 text-xs font-medium leading-5 text-stone-500 sm:text-sm sm:leading-6">
                Akun{' '}
                <span className="font-bold text-stone-900">
                  {karyawanHapus.nama}
                </span>{' '}
                akan dihapus dari sistem.
              </p>
            </div>

            <div className="mt-5 flex gap-2 sm:mt-6 sm:gap-3">
              <button
                type="button"
                onClick={() =>
                  setKaryawanHapus(
                    null,
                  )
                }
                className="flex-1 rounded-xl border border-stone-300 px-4 py-2.5 text-xs font-bold text-stone-700 hover:bg-stone-100 sm:text-sm"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={
                  konfirmasiHapus
                }
                className="flex-1 rounded-xl bg-red-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-red-700 sm:text-sm"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}