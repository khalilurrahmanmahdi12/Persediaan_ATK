import {
  CheckCircle2,
  ClipboardList,
  Clock3,
  Eye,
  Package,
  Search,
  X,
  XCircle,
} from 'lucide-react'

import {
  useMemo,
  useState,
} from 'react'

import { toast } from 'sonner'

import AdminLayout from '../../components/layout/AdminLayout'

import { useBarangStore } from '../../stores/barangStore'
import { usePermintaanStore } from '../../stores/permintaanStore'

import type {
  Permintaan,
  StatusPermintaan,
} from '../../types/permintaan'

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
  status: StatusPermintaan,
) {
  if (status === 'Diterima') {
    return {
      className:
        'border border-emerald-200 bg-emerald-100 text-emerald-700',
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

export default function PermintaanPage() {
  const {
    daftarPermintaan,
    ubahStatusPermintaan,
  } = usePermintaanStore()

  const {
    daftarBarang,
    kurangiStok,
  } = useBarangStore()

  const [
    pencarian,
    setPencarian,
  ] = useState('')

  const [
    filterStatus,
    setFilterStatus,
  ] = useState('Menunggu')

  const [
    permintaanDetail,
    setPermintaanDetail,
  ] =
    useState<Permintaan | null>(
      null,
    )

  const [
    permintaanTerima,
    setPermintaanTerima,
  ] =
    useState<Permintaan | null>(
      null,
    )

  const [
    permintaanTolak,
    setPermintaanTolak,
  ] =
    useState<Permintaan | null>(
      null,
    )

  const [
    catatanPenolakan,
    setCatatanPenolakan,
  ] = useState('')

  const permintaanTampil =
    useMemo(() => {
      return daftarPermintaan
        .filter((item) => {
          const keyword =
            pencarian
              .trim()
              .toLowerCase()

          const cocokPencarian =
            !keyword ||
            item.namaKaryawan
              .toLowerCase()
              .includes(keyword) ||
            item.namaBarang
              .toLowerCase()
              .includes(keyword) ||
            item.divisi
              .toLowerCase()
              .includes(keyword)

          const cocokStatus =
            filterStatus ===
              'Semua' ||
            item.status ===
              filterStatus

          return (
            cocokPencarian &&
            cocokStatus
          )
        })
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
      pencarian,
      filterStatus,
    ])

  const jumlahMenunggu =
    daftarPermintaan.filter(
      (item) =>
        item.status ===
        'Menunggu',
    ).length

  const jumlahDiterima =
    daftarPermintaan.filter(
      (item) =>
        item.status ===
        'Diterima',
    ).length

  const jumlahDitolak =
    daftarPermintaan.filter(
      (item) =>
        item.status ===
        'Ditolak',
    ).length

  const handleTerima = () => {
    if (!permintaanTerima) {
      return
    }

    if (
      permintaanTerima.status !==
      'Menunggu'
    ) {
      toast.error(
        'Permintaan ini sudah diproses.',
      )

      setPermintaanTerima(null)
      return
    }

    const barang =
      daftarBarang.find(
        (item) =>
          item.id ===
          permintaanTerima.barangId,
      )

    if (!barang) {
      toast.error(
        'Barang tidak ditemukan.',
      )
      return
    }

    if (
      barang.stok <
      permintaanTerima.jumlah
    ) {
      toast.error(
        `Stok ${barang.nama} tidak mencukupi. Tersisa ${barang.stok} ${barang.satuan}.`,
      )
      return
    }

    const berhasil =
      kurangiStok(
        barang.id,
        permintaanTerima.jumlah,
      )

    if (!berhasil) {
      toast.error(
        'Stok tidak mencukupi.',
      )
      return
    }

    ubahStatusPermintaan(
      permintaanTerima.id,
      'Diterima',
      'Permintaan telah disetujui. Silakan mengambil barang sesuai tanggal yang dipilih.',
    )

    toast.success(
      'Permintaan berhasil diterima dan stok telah diperbarui.',
    )

    setPermintaanTerima(null)
  }

  const handleTolak = () => {
    if (!permintaanTolak) {
      return
    }

    if (
      !catatanPenolakan.trim()
    ) {
      toast.error(
        'Masukkan alasan penolakan.',
      )
      return
    }

    if (
      permintaanTolak.status !==
      'Menunggu'
    ) {
      toast.error(
        'Permintaan ini sudah diproses.',
      )

      setPermintaanTolak(null)
      return
    }

    ubahStatusPermintaan(
      permintaanTolak.id,
      'Ditolak',
      catatanPenolakan.trim(),
    )

    toast.success(
      'Permintaan berhasil ditolak.',
    )

    setPermintaanTolak(null)
    setCatatanPenolakan('')
  }

  const bukaModalTolak = (
    item: Permintaan,
  ) => {
    setPermintaanTolak(item)
    setCatatanPenolakan('')
  }

  return (
    <AdminLayout>
      <div className="min-w-0">

        {/* HEADER */}
        <div>
          <p className="text-sm font-bold text-emerald-700">
            Pengelolaan Permintaan
          </p>

          <h1 className="mt-1 text-2xl font-extrabold text-stone-950">
            Permintaan ATK
          </h1>

          <p className="mt-1 text-sm font-medium text-stone-500">
            Tinjau dan proses permintaan
            barang dari karyawan.
          </p>
        </div>

        {/* STATISTIK */}
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">

          {/* MENUNGGU */}
          <div className="rounded-2xl border border-amber-100 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-stone-500 sm:text-sm">
                  Menunggu
                </p>

                <p className="mt-2 text-2xl font-extrabold text-stone-950 sm:text-3xl">
                  {jumlahMenunggu}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700 sm:h-11 sm:w-11">
                <Clock3
                  size={20}
                />
              </div>
            </div>
          </div>

          {/* DITERIMA */}
          <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-stone-500 sm:text-sm">
                  Diterima
                </p>

                <p className="mt-2 text-2xl font-extrabold text-stone-950 sm:text-3xl">
                  {jumlahDiterima}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 sm:h-11 sm:w-11">
                <CheckCircle2
                  size={20}
                />
              </div>
            </div>
          </div>

          {/* DITOLAK */}
          <div className="rounded-2xl border border-red-100 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-stone-500 sm:text-sm">
                  Ditolak
                </p>

                <p className="mt-2 text-2xl font-extrabold text-stone-950 sm:text-3xl">
                  {jumlahDitolak}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-red-600 sm:h-11 sm:w-11">
                <XCircle
                  size={20}
                />
              </div>
            </div>
          </div>
        </div>

        {/* FILTER */}
        <div className="mt-5 rounded-2xl border border-stone-200 bg-white p-3 shadow-sm sm:p-4">
          <div className="grid gap-3 md:grid-cols-[1fr_200px]">

            <div className="relative">
              <Search
                size={17}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 sm:left-4 sm:size-[18px]"
              />

              <input
                type="text"
                value={pencarian}
                onChange={(event) =>
                  setPencarian(
                    event.target.value,
                  )
                }
                placeholder="Cari karyawan, divisi, atau barang..."
                className="h-10 w-full rounded-xl border border-stone-300 bg-white pl-10 pr-3 text-xs font-medium text-stone-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 sm:h-11 sm:pl-11 sm:pr-4 sm:text-sm"
              />
            </div>

            <select
              value={filterStatus}
              onChange={(event) =>
                setFilterStatus(
                  event.target.value,
                )
              }
              className="h-10 w-full rounded-xl border border-stone-300 bg-white px-3 text-xs font-semibold text-stone-700 outline-none focus:border-emerald-600 sm:h-11 sm:px-4 sm:text-sm"
            >
              <option value="Semua">
                Semua Status
              </option>

              <option value="Menunggu">
                Menunggu
              </option>

              <option value="Diterima">
                Diterima
              </option>

              <option value="Ditolak">
                Ditolak
              </option>
            </select>

          </div>
        </div>

        {/* MOBILE CARD */}
        <div className="mt-5 space-y-3 md:hidden">
          {permintaanTampil.map(
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
                  className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm"
                >
                  {/* HEADER CARD */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-extrabold text-stone-950">
                        {
                          item.namaKaryawan
                        }
                      </p>

                      <p className="mt-1 text-[11px] font-semibold text-stone-500">
                        {item.divisi}
                      </p>

                      <p className="mt-1 text-[10px] font-medium text-stone-400">
                        Diajukan{' '}
                        {formatTanggal(
                          item.tanggalPengajuan,
                        )}
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

                  {/* BARANG */}
                  <div className="mt-4 rounded-xl bg-emerald-50 p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                        <Package
                          size={17}
                        />
                      </div>

                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wide text-emerald-600">
                          Barang
                        </p>

                        <p className="mt-1 text-sm font-extrabold text-emerald-950">
                          {
                            item.namaBarang
                          }
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* INFORMASI */}
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-stone-50 p-3">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-stone-400">
                        Jumlah
                      </p>

                      <p className="mt-1 text-xs font-extrabold text-stone-900">
                        {
                          item.jumlah
                        }{' '}
                        {
                          item.satuan
                        }
                      </p>
                    </div>

                    <div className="rounded-xl bg-stone-50 p-3">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-stone-400">
                        Tanggal Ambil
                      </p>

                      <p className="mt-1 text-xs font-extrabold text-stone-900">
                        {formatTanggal(
                          item.tanggalPengambilan,
                        )}
                      </p>
                    </div>
                  </div>

                  {/* ACTION */}
                  <div
                    className={`mt-4 grid gap-2 ${
                      item.status ===
                      'Menunggu'
                        ? 'grid-cols-3'
                        : 'grid-cols-1'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setPermintaanDetail(
                          item,
                        )
                      }
                      className="flex items-center justify-center gap-1.5 rounded-xl border border-stone-200 bg-white px-2 py-2.5 text-[11px] font-bold text-stone-600 transition active:bg-stone-100"
                    >
                      <Eye
                        size={14}
                      />

                      Detail
                    </button>

                    {item.status ===
                      'Menunggu' && (
                      <>
                        <button
                          type="button"
                          onClick={() =>
                            setPermintaanTerima(
                              item,
                            )
                          }
                          className="flex items-center justify-center gap-1 rounded-xl bg-emerald-700 px-2 py-2.5 text-[11px] font-bold text-white transition active:bg-emerald-800"
                        >
                          <CheckCircle2
                            size={14}
                          />

                          Terima
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            bukaModalTolak(
                              item,
                            )
                          }
                          className="flex items-center justify-center gap-1 rounded-xl border border-red-200 bg-red-50 px-2 py-2.5 text-[11px] font-bold text-red-600 transition active:bg-red-100"
                        >
                          <XCircle
                            size={14}
                          />

                          Tolak
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )
            },
          )}

          {/* EMPTY MOBILE */}
          {permintaanTampil.length ===
            0 && (
            <div className="rounded-2xl border border-stone-200 bg-white px-5 py-12 text-center shadow-sm">
              <ClipboardList
                size={38}
                className="mx-auto text-emerald-200"
              />

              <p className="mt-3 text-sm font-bold text-stone-700">
                Tidak ada permintaan
              </p>

              <p className="mt-1 text-xs font-medium text-stone-400">
                Permintaan karyawan
                akan tampil di sini.
              </p>
            </div>
          )}
        </div>

        {/* DESKTOP TABLE */}
        <div className="mt-5 hidden overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm md:block">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px]">

              <thead>
                <tr className="border-b border-stone-200 bg-emerald-50/70 text-left text-xs font-bold uppercase tracking-wide text-emerald-800">
                  <th className="px-5 py-4">
                    Karyawan
                  </th>

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
                {permintaanTampil.map(
                  (item) => {
                    const badge =
                      badgeStatus(
                        item.status,
                      )

                    const Icon =
                      badge.icon

                    return (
                      <tr
                        key={item.id}
                        className="border-b border-stone-100 last:border-0 hover:bg-emerald-50/30"
                      >
                        {/* KARYAWAN */}
                        <td className="px-5 py-4">
                          <p className="text-sm font-bold text-stone-950">
                            {item.namaKaryawan}
                          </p>

                          <p className="mt-1 text-xs font-semibold text-stone-500">
                            {item.divisi}
                          </p>

                          <p className="mt-1 text-xs font-medium text-stone-400">
                            Diajukan{' '}
                            {formatTanggal(
                              item.tanggalPengajuan,
                            )}
                          </p>
                        </td>

                        {/* BARANG */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                              <Package
                                size={17}
                              />
                            </div>

                            <p className="text-sm font-bold text-stone-900">
                              {
                                item.namaBarang
                              }
                            </p>
                          </div>
                        </td>

                        {/* JUMLAH */}
                        <td className="px-5 py-4 text-sm font-bold text-stone-900">
                          {item.jumlah}{' '}
                          {item.satuan}
                        </td>

                        {/* TANGGAL */}
                        <td className="px-5 py-4 text-sm font-semibold text-stone-700">
                          {formatTanggal(
                            item.tanggalPengambilan,
                          )}
                        </td>

                        {/* STATUS */}
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

                        {/* AKSI */}
                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">

                            <button
                              type="button"
                              onClick={() =>
                                setPermintaanDetail(
                                  item,
                                )
                              }
                              title="Detail"
                              className="flex h-9 w-9 items-center justify-center rounded-lg border border-stone-200 text-stone-500 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                            >
                              <Eye
                                size={16}
                              />
                            </button>

                            {item.status ===
                              'Menunggu' && (
                              <>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setPermintaanTerima(
                                      item,
                                    )
                                  }
                                  className="rounded-lg bg-emerald-700 px-3 py-2 text-xs font-bold text-white transition hover:bg-emerald-800"
                                >
                                  Terima
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    bukaModalTolak(
                                      item,
                                    )
                                  }
                                  className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-100"
                                >
                                  Tolak
                                </button>
                              </>
                            )}

                          </div>
                        </td>
                      </tr>
                    )
                  },
                )}

                {permintaanTampil.length ===
                  0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-16 text-center"
                    >
                      <ClipboardList
                        size={40}
                        className="mx-auto text-emerald-200"
                      />

                      <p className="mt-3 font-bold text-stone-700">
                        Tidak ada permintaan
                      </p>

                      <p className="mt-1 text-sm font-medium text-stone-400">
                        Permintaan karyawan
                        akan tampil di sini.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>

            </table>
          </div>
        </div>

      </div>

      {/* MODAL DETAIL */}
      {permintaanDetail && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-3 backdrop-blur-[2px] sm:p-4">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-2xl sm:rounded-3xl">

            {/* HEADER */}
            <div className="flex items-start justify-between border-b border-emerald-100 bg-emerald-50 px-4 py-3 sm:px-6 sm:py-5">
              <div>
                <h2 className="text-lg font-extrabold text-emerald-950 sm:text-xl">
                  Detail Permintaan
                </h2>

                <p className="mt-1 text-[11px] font-semibold text-emerald-700 sm:text-sm">
                  Informasi permintaan ATK.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setPermintaanDetail(
                    null,
                  )
                }
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-stone-500 transition hover:bg-white sm:h-9 sm:w-9 sm:rounded-xl"
              >
                <X
                  size={18}
                />
              </button>
            </div>

            {/* BODY */}
            <div className="px-4 py-4 sm:px-6 sm:py-5">
              <DetailItem
                label="Nama"
                value={
                  permintaanDetail.namaKaryawan
                }
              />

              <DetailItem
                label="Divisi"
                value={
                  permintaanDetail.divisi
                }
              />

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

              <div className="flex items-center justify-between gap-4 border-b border-stone-200 py-3 sm:py-4">
                <p className="text-xs font-semibold text-stone-600 sm:text-sm">
                  Status
                </p>

                {(() => {
                  const badge =
                    badgeStatus(
                      permintaanDetail.status,
                    )

                  const Icon =
                    badge.icon

                  return (
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-bold sm:text-xs ${badge.className}`}
                    >
                      <Icon
                        size={13}
                      />

                      {
                        permintaanDetail.status
                      }
                    </span>
                  )
                })()}
              </div>

              {permintaanDetail.keterangan && (
                <DetailItem
                  label="Keterangan"
                  value={
                    permintaanDetail.keterangan
                  }
                />
              )}

              {permintaanDetail.catatanAdmin && (
                <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50 p-3 sm:mt-5 sm:rounded-2xl sm:p-4">
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
                className="w-full rounded-xl bg-emerald-700 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-800 sm:w-auto sm:text-sm"
              >
                Tutup
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL TERIMA */}
      {permintaanTerima && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 p-3 backdrop-blur-[2px] sm:p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl sm:rounded-3xl sm:p-6">

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 sm:h-14 sm:w-14">
              <CheckCircle2
                size={26}
              />
            </div>

            <div className="mt-4 text-center sm:mt-5">
              <h3 className="text-lg font-extrabold text-stone-950 sm:text-xl">
                Terima Permintaan?
              </h3>

              <p className="mt-2 text-xs font-medium leading-5 text-stone-500 sm:text-sm sm:leading-6">
                Permintaan{' '}
                <span className="font-bold text-stone-900">
                  {
                    permintaanTerima.namaBarang
                  }
                </span>{' '}
                sebanyak{' '}
                <span className="font-bold text-stone-900">
                  {
                    permintaanTerima.jumlah
                  }{' '}
                  {
                    permintaanTerima.satuan
                  }
                </span>{' '}
                akan disetujui.
              </p>

              {(() => {
                const barang =
                  daftarBarang.find(
                    (item) =>
                      item.id ===
                      permintaanTerima.barangId,
                  )

                return (
                  <div className="mt-4 rounded-xl bg-emerald-50 p-3 sm:rounded-2xl sm:p-4">
                    <p className="text-[10px] font-bold text-emerald-600 sm:text-xs">
                      Stok saat ini
                    </p>

                    <p className="mt-1 text-base font-extrabold text-emerald-950 sm:text-lg">
                      {barang
                        ? `${barang.stok} ${barang.satuan}`
                        : 'Barang tidak ditemukan'}
                    </p>

                    {barang && (
                      <p className="mt-1 text-[10px] font-medium text-emerald-700 sm:text-xs">
                        Setelah disetujui:{' '}
                        {barang.stok -
                          permintaanTerima.jumlah}{' '}
                        {barang.satuan}
                      </p>
                    )}
                  </div>
                )
              })()}
            </div>

            <div className="mt-5 flex gap-2 sm:mt-6 sm:gap-3">
              <button
                type="button"
                onClick={() =>
                  setPermintaanTerima(
                    null,
                  )
                }
                className="flex-1 rounded-xl border border-stone-300 bg-white px-3 py-2.5 text-xs font-bold text-stone-700 transition hover:bg-stone-100 sm:px-4 sm:text-sm"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={
                  handleTerima
                }
                className="flex-1 rounded-xl bg-emerald-700 px-3 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-800 sm:px-4 sm:text-sm"
              >
                Ya, Terima
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL TOLAK */}
      {permintaanTolak && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 p-3 backdrop-blur-[2px] sm:p-4">
          <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl sm:rounded-3xl">

            {/* HEADER */}
            <div className="border-b border-red-100 px-4 py-4 sm:px-6 sm:py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600 sm:h-11 sm:w-11">
                  <XCircle
                    size={20}
                  />
                </div>

                <div>
                  <h3 className="text-sm font-extrabold text-stone-950 sm:text-base">
                    Tolak Permintaan
                  </h3>

                  <p className="mt-1 text-[11px] font-medium text-stone-500 sm:text-sm">
                    Berikan alasan penolakan.
                  </p>
                </div>
              </div>
            </div>

            {/* BODY */}
            <div className="p-4 sm:p-6">

              <div className="rounded-xl bg-stone-50 p-3 sm:p-4">
                <p className="text-xs font-bold text-stone-950 sm:text-sm">
                  {
                    permintaanTolak.namaBarang
                  }
                </p>

                <p className="mt-1 text-[11px] font-semibold text-stone-500 sm:text-sm">
                  {
                    permintaanTolak.namaKaryawan
                  }{' '}
                  •{' '}
                  {
                    permintaanTolak.jumlah
                  }{' '}
                  {
                    permintaanTolak.satuan
                  }
                </p>
              </div>

              <div className="mt-4 sm:mt-5">
                <label className="mb-1.5 block text-xs font-bold text-stone-800 sm:mb-2 sm:text-sm">
                  Alasan Penolakan
                </label>

                <textarea
                  rows={3}
                  value={
                    catatanPenolakan
                  }
                  onChange={(event) =>
                    setCatatanPenolakan(
                      event.target.value,
                    )
                  }
                  placeholder="Contoh: Stok sedang dibatasi untuk kebutuhan operasional."
                  className="w-full resize-none rounded-xl border border-stone-300 px-3 py-2.5 text-xs font-medium text-stone-900 outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-100 sm:px-4 sm:py-3 sm:text-sm"
                />
              </div>

              <div className="mt-5 flex gap-2 sm:mt-6 sm:gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setPermintaanTolak(
                      null,
                    )

                    setCatatanPenolakan(
                      '',
                    )
                  }}
                  className="flex-1 rounded-xl border border-stone-300 px-3 py-2.5 text-xs font-bold text-stone-700 hover:bg-stone-100 sm:px-4 sm:text-sm"
                >
                  Batal
                </button>

                <button
                  type="button"
                  onClick={
                    handleTolak
                  }
                  className="flex-1 rounded-xl bg-red-600 px-3 py-2.5 text-xs font-bold text-white hover:bg-red-700 sm:px-4 sm:text-sm"
                >
                  Tolak
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </AdminLayout>
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
      <p className="text-xs font-semibold text-stone-600 sm:text-sm">
        {label}
      </p>

      <p className="max-w-[65%] text-right text-xs font-extrabold text-stone-950 sm:text-sm">
        {value}
      </p>
    </div>
  )
}