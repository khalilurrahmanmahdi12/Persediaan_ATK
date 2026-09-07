import {
  Boxes,
  Edit3,
  PackagePlus,
  Plus,
  Search,
  Trash2,
  TriangleAlert,
  X,
} from 'lucide-react'

import {
  useMemo,
  useState,
} from 'react'

import { toast } from 'sonner'

import AdminLayout from '../../components/layout/AdminLayout'
import { useBarangStore } from '../../stores/barangStore'

import type { Barang } from '../../types/barang'

interface FormBarang {
  nama: string
  kategori: string
  stok: string
  satuan: string
  stokMinimum: string
  keterangan: string
}

const formAwal: FormBarang = {
  nama: '',
  kategori: '',
  stok: '',
  satuan: '',
  stokMinimum: '',
  keterangan: '',
}

export default function BarangPage() {
  const {
    daftarBarang,
    tambahBarang,
    editBarang,
    hapusBarang,
  } = useBarangStore()

  const [
    pencarian,
    setPencarian,
  ] = useState('')

  const [
    filterKategori,
    setFilterKategori,
  ] = useState('Semua')

  const [
    filterStatus,
    setFilterStatus,
  ] = useState('Semua')

  const [
    modalTerbuka,
    setModalTerbuka,
  ] = useState(false)

  const [
    barangEdit,
    setBarangEdit,
  ] =
    useState<Barang | null>(
      null,
    )

  const [
    barangHapus,
    setBarangHapus,
  ] =
    useState<Barang | null>(
      null,
    )

  const [
    form,
    setForm,
  ] =
    useState<FormBarang>(
      formAwal,
    )

  const kategoriTersedia =
    useMemo(() => {
      return [
        'Semua',
        ...Array.from(
          new Set(
            daftarBarang.map(
              (barang) =>
                barang.kategori,
            ),
          ),
        ),
      ]
    }, [daftarBarang])

  const barangTampil =
    useMemo(() => {
      return daftarBarang.filter(
        (barang) => {
          const keyword =
            pencarian
              .trim()
              .toLowerCase()

          const cocokPencarian =
            !keyword ||
            barang.nama
              .toLowerCase()
              .includes(keyword) ||
            barang.kategori
              .toLowerCase()
              .includes(keyword)

          const cocokKategori =
            filterKategori ===
              'Semua' ||
            barang.kategori ===
              filterKategori

          const status =
            barang.stok === 0
              ? 'Habis'
              : 'Tersedia'

          const cocokStatus =
            filterStatus ===
              'Semua' ||
            status ===
              filterStatus

          return (
            cocokPencarian &&
            cocokKategori &&
            cocokStatus
          )
        },
      )
    }, [
      daftarBarang,
      pencarian,
      filterKategori,
      filterStatus,
    ])

  const bukaTambah = () => {
    setBarangEdit(null)
    setForm(formAwal)
    setModalTerbuka(true)
  }

  const bukaEdit = (
    barang: Barang,
  ) => {
    setBarangEdit(barang)

    setForm({
      nama: barang.nama,
      kategori:
        barang.kategori,
      stok: String(
        barang.stok,
      ),
      satuan:
        barang.satuan,
      stokMinimum:
        String(
          barang.stokMinimum,
        ),
      keterangan:
        barang.keterangan,
    })

    setModalTerbuka(true)
  }

  const tutupModal = () => {
    setModalTerbuka(false)
    setBarangEdit(null)
    setForm(formAwal)
  }

  const bukaModalHapus = (
    barang: Barang,
  ) => {
    setBarangHapus(barang)
  }

  const tutupModalHapus =
    () => {
      setBarangHapus(null)
    }

  const konfirmasiHapus =
    () => {
      if (!barangHapus) {
        return
      }

      hapusBarang(
        barangHapus.id,
      )

      toast.success(
        'Barang berhasil dihapus.',
      )

      setBarangHapus(null)
    }

  const handleSimpan = () => {
    if (
      !form.nama.trim() ||
      !form.kategori.trim() ||
      !form.satuan.trim() ||
      form.stok === '' ||
      form.stokMinimum === ''
    ) {
      toast.error(
        'Lengkapi data barang.',
      )
      return
    }

    const stok =
      Number(form.stok)

    const stokMinimum =
      Number(
        form.stokMinimum,
      )

    if (
      Number.isNaN(stok) ||
      stok < 0
    ) {
      toast.error(
        'Stok tidak valid.',
      )
      return
    }

    if (
      Number.isNaN(
        stokMinimum,
      ) ||
      stokMinimum < 0
    ) {
      toast.error(
        'Stok minimum tidak valid.',
      )
      return
    }

    const data = {
      nama:
        form.nama.trim(),

      kategori:
        form.kategori.trim(),

      stok,

      satuan:
        form.satuan.trim(),

      stokMinimum,

      keterangan:
        form.keterangan.trim(),
    }

    if (barangEdit) {
      editBarang(
        barangEdit.id,
        data,
      )

      toast.success(
        'Barang berhasil diperbarui.',
      )
    } else {
      tambahBarang(data)

      toast.success(
        'Barang berhasil ditambahkan.',
      )
    }

    tutupModal()
  }

  return (
    <AdminLayout>
      <div className="min-w-0">

        {/* HEADER */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold text-emerald-700">
              Persediaan Barang
            </p>

            <h1 className="mt-1 text-2xl font-extrabold text-stone-950">
              Barang ATK
            </h1>

            <p className="mt-1 text-sm font-medium text-stone-500">
              Kelola data dan stok
              barang ATK perusahaan.
            </p>
          </div>

          <button
            type="button"
            onClick={bukaTambah}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-800 sm:w-auto"
          >
            <Plus size={18} />
            Tambah Barang
          </button>
        </div>

        {/* FILTER */}
        <div className="mt-5 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
          <div className="grid gap-3 md:grid-cols-[1fr_200px_180px]">

            {/* SEARCH */}
            <div className="relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
              />

              <input
                type="text"
                value={pencarian}
                onChange={(
                  event,
                ) =>
                  setPencarian(
                    event.target.value,
                  )
                }
                placeholder="Cari barang..."
                className="h-11 w-full rounded-xl border border-stone-300 bg-white pl-11 pr-4 text-sm font-medium text-stone-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            {/* KATEGORI */}
            <select
              value={
                filterKategori
              }
              onChange={(
                event,
              ) =>
                setFilterKategori(
                  event.target.value,
                )
              }
              className="h-11 w-full rounded-xl border border-stone-300 bg-white px-3 text-sm font-semibold text-stone-700 outline-none focus:border-emerald-600"
            >
              {kategoriTersedia.map(
                (kategori) => (
                  <option
                    key={kategori}
                    value={kategori}
                  >
                    {kategori}
                  </option>
                ),
              )}
            </select>

            {/* STATUS */}
            <select
              value={
                filterStatus
              }
              onChange={(
                event,
              ) =>
                setFilterStatus(
                  event.target.value,
                )
              }
              className="h-11 w-full rounded-xl border border-stone-300 bg-white px-3 text-sm font-semibold text-stone-700 outline-none focus:border-emerald-600"
            >
              <option value="Semua">
                Semua Status
              </option>

              <option value="Tersedia">
                Tersedia
              </option>

              <option value="Habis">
                Habis
              </option>
            </select>
          </div>
        </div>

        {/* MOBILE CARD */}
        <div className="mt-5 space-y-3 md:hidden">
          {barangTampil.map(
            (barang) => {
              const habis =
                barang.stok === 0

              const hampirHabis =
                barang.stok > 0 &&
                barang.stok <=
                  barang.stokMinimum

              return (
                <div
                  key={barang.id}
                  className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm"
                >
                  {/* HEADER CARD */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                        <Boxes
                          size={18}
                        />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-extrabold text-stone-950">
                          {
                            barang.nama
                          }
                        </p>

                        <p className="mt-1 text-xs font-semibold text-stone-500">
                          {
                            barang.kategori
                          }
                        </p>
                      </div>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                        habis
                          ? 'bg-red-100 text-red-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {habis
                        ? 'Habis'
                        : 'Tersedia'}
                    </span>
                  </div>

                  {/* STOK */}
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-stone-50 p-3">
                      <p className="text-[11px] font-semibold text-stone-500">
                        Stok
                      </p>

                      <p className="mt-1 text-sm font-extrabold text-stone-950">
                        {
                          barang.stok
                        }{' '}
                        {
                          barang.satuan
                        }
                      </p>
                    </div>

                    <div className="rounded-xl bg-stone-50 p-3">
                      <p className="text-[11px] font-semibold text-stone-500">
                        Minimum
                      </p>

                      <p className="mt-1 text-sm font-extrabold text-stone-950">
                        {
                          barang.stokMinimum
                        }{' '}
                        {
                          barang.satuan
                        }
                      </p>
                    </div>
                  </div>

                  {/* WARNING */}
                  {hampirHabis && (
                    <div className="mt-3 flex items-center gap-2 rounded-xl bg-amber-50 px-3 py-2.5 text-amber-700">
                      <TriangleAlert
                        size={15}
                      />

                      <p className="text-xs font-bold">
                        Stok hampir habis
                      </p>
                    </div>
                  )}

                  {/* KETERANGAN */}
                  {barang.keterangan && (
                    <p className="mt-3 text-xs font-medium leading-5 text-stone-500">
                      {
                        barang.keterangan
                      }
                    </p>
                  )}

                  {/* ACTION */}
                  <div className="mt-4 flex gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        bukaEdit(
                          barang,
                        )
                      }
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-xs font-bold text-emerald-700 transition active:bg-emerald-100"
                    >
                      <Edit3
                        size={15}
                      />

                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        bukaModalHapus(
                          barang,
                        )
                      }
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-xs font-bold text-red-600 transition active:bg-red-100"
                    >
                      <Trash2
                        size={15}
                      />

                      Hapus
                    </button>
                  </div>
                </div>
              )
            },
          )}

          {barangTampil.length ===
            0 && (
            <div className="rounded-2xl border border-stone-200 bg-white px-5 py-12 text-center shadow-sm">
              <PackagePlus
                size={38}
                className="mx-auto text-emerald-200"
              />

              <p className="mt-3 font-bold text-stone-700">
                Barang tidak
                ditemukan
              </p>

              <p className="mt-1 text-xs font-medium text-stone-400">
                Coba ubah pencarian
                atau filter.
              </p>
            </div>
          )}
        </div>

        {/* DESKTOP TABLE */}
        <div className="mt-5 hidden overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm md:block">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">

              <thead>
                <tr className="border-b border-stone-200 bg-emerald-50/70 text-left text-xs font-bold uppercase tracking-wide text-emerald-800">
                  <th className="px-5 py-4">
                    Barang
                  </th>

                  <th className="px-5 py-4">
                    Kategori
                  </th>

                  <th className="px-5 py-4">
                    Stok
                  </th>

                  <th className="px-5 py-4">
                    Minimum
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
                {barangTampil.map(
                  (barang) => {
                    const habis =
                      barang.stok ===
                      0

                    const hampirHabis =
                      barang.stok >
                        0 &&
                      barang.stok <=
                        barang.stokMinimum

                    return (
                      <tr
                        key={
                          barang.id
                        }
                        className="border-b border-stone-100 last:border-0 hover:bg-emerald-50/30"
                      >
                        {/* BARANG */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                              <Boxes
                                size={
                                  19
                                }
                              />
                            </div>

                            <div>
                              <p className="text-sm font-bold text-stone-950">
                                {
                                  barang.nama
                                }
                              </p>

                              {barang.keterangan && (
                                <p className="mt-1 max-w-[250px] truncate text-xs font-medium text-stone-400">
                                  {
                                    barang.keterangan
                                  }
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* KATEGORI */}
                        <td className="px-5 py-4 text-sm font-semibold text-stone-700">
                          {
                            barang.kategori
                          }
                        </td>

                        {/* STOK */}
                        <td className="px-5 py-4">
                          <p className="text-sm font-extrabold text-stone-950">
                            {
                              barang.stok
                            }{' '}
                            {
                              barang.satuan
                            }
                          </p>

                          {hampirHabis && (
                            <p className="mt-1 text-xs font-bold text-amber-600">
                              Stok hampir
                              habis
                            </p>
                          )}
                        </td>

                        {/* MINIMUM */}
                        <td className="px-5 py-4 text-sm font-semibold text-stone-700">
                          {
                            barang.stokMinimum
                          }{' '}
                          {
                            barang.satuan
                          }
                        </td>

                        {/* STATUS */}
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full px-3 py-1.5 text-xs font-bold ${
                              habis
                                ? 'bg-red-100 text-red-700'
                                : 'bg-emerald-100 text-emerald-700'
                            }`}
                          >
                            {habis
                              ? 'Habis'
                              : 'Tersedia'}
                          </span>
                        </td>

                        {/* ACTION */}
                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                bukaEdit(
                                  barang,
                                )
                              }
                              title="Edit barang"
                              className="flex h-9 w-9 items-center justify-center rounded-lg border border-stone-200 text-stone-500 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                            >
                              <Edit3
                                size={
                                  16
                                }
                              />
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                bukaModalHapus(
                                  barang,
                                )
                              }
                              title="Hapus barang"
                              className="flex h-9 w-9 items-center justify-center rounded-lg border border-stone-200 text-stone-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                            >
                              <Trash2
                                size={
                                  16
                                }
                              />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  },
                )}

                {barangTampil.length ===
                  0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-16 text-center"
                    >
                      <PackagePlus
                        size={38}
                        className="mx-auto text-stone-300"
                      />

                      <p className="mt-3 font-bold text-stone-700">
                        Barang tidak
                        ditemukan
                      </p>

                      <p className="mt-1 text-sm font-medium text-stone-400">
                        Coba ubah
                        pencarian atau
                        filter.
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
        <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/45 p-3 pt-3 backdrop-blur-[2px] sm:items-center sm:p-4">
          <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-2xl sm:rounded-3xl">

            {/* HEADER MODAL */}
            <div className="flex items-start justify-between border-b border-stone-200 px-4 py-3 sm:px-6 sm:py-4">
              <div>
                <h2 className="text-lg font-extrabold text-stone-950 sm:text-xl">
                  {barangEdit
                    ? 'Edit Barang'
                    : 'Tambah Barang'}
                </h2>

                <p className="mt-1 text-[11px] font-medium text-stone-500 sm:text-sm">
                  {barangEdit
                    ? 'Perbarui informasi barang ATK.'
                    : 'Tambahkan barang baru ke persediaan ATK.'}
                </p>
              </div>

              <button
                type="button"
                onClick={
                  tutupModal
                }
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-stone-400 transition hover:bg-stone-100 hover:text-stone-700 sm:h-9 sm:w-9 sm:rounded-xl"
                title="Tutup"
              >
                <X
                  size={18}
                />
              </button>
            </div>

            {/* BODY */}
            <div className="px-4 py-4 sm:px-6 sm:py-5">
              <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">

                {/* NAMA */}
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-xs font-bold text-stone-700 sm:mb-2 sm:text-sm">
                    Nama Barang
                  </label>

                  <input
                    type="text"
                    value={
                      form.nama
                    }
                    onChange={(
                      event,
                    ) =>
                      setForm({
                        ...form,
                        nama:
                          event.target.value,
                      })
                    }
                    placeholder="Contoh: Kertas A4"
                    className="h-10 w-full rounded-xl border border-stone-300 bg-white px-3 text-xs font-medium text-stone-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 sm:h-11 sm:px-4 sm:text-sm"
                  />
                </div>

                {/* KATEGORI */}
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-stone-700 sm:mb-2 sm:text-sm">
                    Kategori
                  </label>

                  <select
                    value={
                      form.kategori
                    }
                    onChange={(
                      event,
                    ) =>
                      setForm({
                        ...form,
                        kategori:
                          event.target.value,
                      })
                    }
                    className="h-10 w-full rounded-xl border border-stone-300 bg-white px-3 text-xs font-medium text-stone-800 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 sm:h-11 sm:px-4 sm:text-sm"
                  >
                    <option value="">
                      Pilih kategori
                    </option>

                    <option value="Alat Tulis">
                      Alat Tulis
                    </option>

                    <option value="Kertas">
                      Kertas
                    </option>

                    <option value="Arsip">
                      Arsip
                    </option>

                    <option value="Printer">
                      Printer
                    </option>

                    <option value="Perlengkapan">
                      Perlengkapan
                    </option>
                  </select>
                </div>

                {/* SATUAN */}
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-stone-700 sm:mb-2 sm:text-sm">
                    Satuan
                  </label>

                  <select
                    value={
                      form.satuan
                    }
                    onChange={(
                      event,
                    ) =>
                      setForm({
                        ...form,
                        satuan:
                          event.target.value,
                      })
                    }
                    className="h-10 w-full rounded-xl border border-stone-300 bg-white px-3 text-xs font-medium text-stone-800 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 sm:h-11 sm:px-4 sm:text-sm"
                  >
                    <option value="">
                      Pilih satuan
                    </option>

                    <option value="Pcs">
                      Pcs
                    </option>

                    <option value="Rim">
                      Rim
                    </option>

                    <option value="Box">
                      Box
                    </option>

                    <option value="Pack">
                      Pack
                    </option>

                    <option value="Botol">
                      Botol
                    </option>
                  </select>
                </div>

                {/* STOK */}
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-stone-700 sm:mb-2 sm:text-sm">
                    Jumlah Stok
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={
                      form.stok
                    }
                    onChange={(
                      event,
                    ) =>
                      setForm({
                        ...form,
                        stok:
                          event.target.value,
                      })
                    }
                    placeholder="Contoh: 20"
                    className="h-10 w-full rounded-xl border border-stone-300 bg-white px-3 text-xs font-medium text-stone-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 sm:h-11 sm:px-4 sm:text-sm"
                  />
                </div>

                {/* STOK MINIMUM */}
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-stone-700 sm:mb-2 sm:text-sm">
                    Stok Minimum
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={
                      form.stokMinimum
                    }
                    onChange={(
                      event,
                    ) =>
                      setForm({
                        ...form,
                        stokMinimum:
                          event.target.value,
                      })
                    }
                    placeholder="Contoh: 5"
                    className="h-10 w-full rounded-xl border border-stone-300 bg-white px-3 text-xs font-medium text-stone-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 sm:h-11 sm:px-4 sm:text-sm"
                  />

                  <p className="mt-1 text-[10px] font-medium leading-4 text-stone-400 sm:mt-1.5 sm:text-xs">
                    Peringatan muncul
                    jika stok mencapai
                    jumlah ini.
                  </p>
                </div>

                {/* KETERANGAN */}
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-xs font-bold text-stone-700 sm:mb-2 sm:text-sm">
                    Keterangan
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
                    placeholder="Tambahkan keterangan barang jika diperlukan..."
                    className="w-full resize-none rounded-xl border border-stone-300 bg-white px-3 py-2.5 text-xs font-medium text-stone-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 sm:px-4 sm:py-3 sm:text-sm"
                  />
                </div>

              </div>
            </div>

            {/* FOOTER */}
            <div className="flex gap-2 border-t border-stone-200 bg-stone-50 px-4 py-3 sm:justify-end sm:gap-3 sm:px-6 sm:py-4">

              <button
                type="button"
                onClick={
                  tutupModal
                }
                className="flex-1 rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-xs font-bold text-stone-600 transition hover:bg-stone-100 sm:flex-none sm:px-5 sm:text-sm"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={
                  handleSimpan
                }
                className="flex-1 rounded-xl bg-emerald-700 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-800 sm:flex-none sm:px-5 sm:text-sm"
              >
                {barangEdit
                  ? 'Simpan Perubahan'
                  : 'Tambah Barang'}
              </button>

            </div>

          </div>
        </div>
      )}

      {/* MODAL HAPUS */}
      {barangHapus && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px]">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl sm:rounded-3xl sm:p-6">

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600 sm:h-14 sm:w-14">
              <TriangleAlert
                size={25}
              />
            </div>

            <div className="mt-4 text-center sm:mt-5">
              <h3 className="text-lg font-extrabold text-stone-950 sm:text-xl">
                Hapus Barang?
              </h3>

              <p className="mt-2 text-xs font-medium leading-5 text-stone-500 sm:text-sm sm:leading-6">
                Barang{' '}
                <span className="font-bold text-stone-900">
                  {
                    barangHapus.nama
                  }
                </span>{' '}
                akan dihapus dari
                persediaan.
              </p>

              <p className="mt-1 text-xs font-medium text-red-500">
                Tindakan ini tidak
                dapat dibatalkan.
              </p>
            </div>

            <div className="mt-5 flex gap-2 sm:mt-6 sm:gap-3">

              <button
                type="button"
                onClick={
                  tutupModalHapus
                }
                className="flex-1 rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-xs font-bold text-stone-700 transition hover:bg-stone-100 sm:text-sm"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={
                  konfirmasiHapus
                }
                className="flex-1 rounded-xl bg-red-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-red-700 sm:text-sm"
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