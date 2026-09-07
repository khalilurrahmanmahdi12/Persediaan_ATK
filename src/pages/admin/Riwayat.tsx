import {
  CheckCircle2,
  ClipboardList,
  Eye,
  Filter,
  Package,
  Search,
  X,
  XCircle,
} from 'lucide-react'

import {
  useMemo,
  useState,
} from 'react'

import AdminLayout from '../../components/layout/AdminLayout'
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
        'border border-emerald-200 bg-emerald-100 text-emerald-800',
      icon: CheckCircle2,
    }
  }

  return {
    className:
      'border border-red-200 bg-red-100 text-red-700',
    icon: XCircle,
  }
}

export default function RiwayatPage() {
  const {
    daftarPermintaan,
  } = usePermintaanStore()

  const [
    pencarian,
    setPencarian,
  ] = useState('')

  const [
    filterStatus,
    setFilterStatus,
  ] = useState('Semua')

  const [
    filterDivisi,
    setFilterDivisi,
  ] = useState('Semua')

  const [
    tanggalMulai,
    setTanggalMulai,
  ] = useState('')

  const [
    tanggalSelesai,
    setTanggalSelesai,
  ] = useState('')

  const [
    permintaanDetail,
    setPermintaanDetail,
  ] =
    useState<Permintaan | null>(
      null,
    )

  const riwayatSelesai =
    useMemo(() => {
      return daftarPermintaan.filter(
        (item) =>
          item.status ===
            'Diterima' ||
          item.status ===
            'Ditolak',
      )
    }, [daftarPermintaan])

  const daftarDivisi =
    useMemo(() => {
      return [
        'Semua',
        ...Array.from(
          new Set(
            riwayatSelesai.map(
              (item) =>
                item.divisi,
            ),
          ),
        ),
      ]
    }, [riwayatSelesai])

  const riwayatTampil =
    useMemo(() => {
      const keyword =
        pencarian
          .trim()
          .toLowerCase()

      return riwayatSelesai
        .filter((item) => {
          const cocokCari =
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

          const cocokDivisi =
            filterDivisi ===
              'Semua' ||
            item.divisi ===
              filterDivisi

          const tanggalItem =
            item.tanggalPengajuan
              .split('T')[0]

          const cocokMulai =
            !tanggalMulai ||
            tanggalItem >=
              tanggalMulai

          const cocokSelesai =
            !tanggalSelesai ||
            tanggalItem <=
              tanggalSelesai

          return (
            cocokCari &&
            cocokStatus &&
            cocokDivisi &&
            cocokMulai &&
            cocokSelesai
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
      riwayatSelesai,
      pencarian,
      filterStatus,
      filterDivisi,
      tanggalMulai,
      tanggalSelesai,
    ])

  const jumlahDiterima =
    riwayatSelesai.filter(
      (item) =>
        item.status ===
        'Diterima',
    ).length

  const jumlahDitolak =
    riwayatSelesai.filter(
      (item) =>
        item.status ===
        'Ditolak',
    ).length

  const resetFilter = () => {
    setPencarian('')
    setFilterStatus('Semua')
    setFilterDivisi('Semua')
    setTanggalMulai('')
    setTanggalSelesai('')
  }

  return (
    <AdminLayout>
      <div className="min-w-0">

        {/* HEADER */}
        <div>
          <p className="text-xs font-bold text-emerald-700 sm:text-sm">
            Riwayat Permintaan
          </p>

          <h1 className="mt-1 text-xl font-extrabold text-stone-950 sm:text-2xl">
            Riwayat Admin
          </h1>

          <p className="mt-1 text-xs font-medium leading-5 text-stone-500 sm:text-sm">
            Lihat seluruh permintaan ATK
            yang sudah diterima atau ditolak.
          </p>
        </div>

        {/* STATISTIK */}
        <div className="mt-4 grid grid-cols-1 gap-3 sm:mt-6 sm:grid-cols-3 sm:gap-4">

          {/* TOTAL */}
          <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm sm:p-5">
            <p className="text-xs font-semibold text-stone-500 sm:text-sm">
              Total Diproses
            </p>

            <p className="mt-1.5 text-2xl font-extrabold text-stone-950 sm:mt-2 sm:text-3xl">
              {riwayatSelesai.length}
            </p>
          </div>

          {/* DITERIMA */}
          <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-stone-500 sm:text-sm">
                  Diterima
                </p>

                <p className="mt-1.5 text-2xl font-extrabold text-emerald-700 sm:mt-2 sm:text-3xl">
                  {jumlahDiterima}
                </p>
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 sm:h-11 sm:w-11">
                <CheckCircle2
                  size={18}
                  className="sm:hidden"
                />

                <CheckCircle2
                  size={21}
                  className="hidden sm:block"
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

                <p className="mt-1.5 text-2xl font-extrabold text-red-600 sm:mt-2 sm:text-3xl">
                  {jumlahDitolak}
                </p>
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-100 text-red-600 sm:h-11 sm:w-11">
                <XCircle
                  size={18}
                  className="sm:hidden"
                />

                <XCircle
                  size={21}
                  className="hidden sm:block"
                />
              </div>
            </div>
          </div>
        </div>

        {/* FILTER */}
        <div className="mt-4 rounded-2xl border border-stone-200 bg-white p-3 shadow-sm sm:mt-5 sm:p-4">
          <div className="flex items-center gap-2">
            <Filter
              size={16}
              className="text-emerald-700 sm:size-[18px]"
            />

            <p className="text-xs font-bold text-stone-800 sm:text-sm">
              Filter Riwayat
            </p>
          </div>

          <div className="mt-3 grid gap-2.5 sm:mt-4 sm:gap-3 xl:grid-cols-[1fr_180px_220px_170px_170px_auto]">

            {/* SEARCH */}
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 sm:left-4 sm:size-[18px]"
              />

              <input
                type="text"
                value={pencarian}
                onChange={(event) =>
                  setPencarian(
                    event.target.value,
                  )
                }
                placeholder="Cari karyawan atau barang..."
                className="h-10 w-full rounded-xl border border-stone-300 bg-white pl-9 pr-3 text-xs font-medium text-stone-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 sm:h-11 sm:pl-11 sm:pr-4 sm:text-sm"
              />
            </div>

            {/* STATUS */}
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

              <option value="Diterima">
                Diterima
              </option>

              <option value="Ditolak">
                Ditolak
              </option>
            </select>

            {/* DIVISI */}
            <select
              value={filterDivisi}
              onChange={(event) =>
                setFilterDivisi(
                  event.target.value,
                )
              }
              className="h-10 w-full rounded-xl border border-stone-300 bg-white px-3 text-xs font-semibold text-stone-700 outline-none focus:border-emerald-600 sm:h-11 sm:px-4 sm:text-sm"
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

            {/* MULAI */}
            <input
              type="date"
              value={tanggalMulai}
              onChange={(event) =>
                setTanggalMulai(
                  event.target.value,
                )
              }
              className="h-10 w-full rounded-xl border border-stone-300 bg-white px-3 text-xs font-semibold text-stone-700 outline-none focus:border-emerald-600 sm:h-11 sm:text-sm"
            />

            {/* SELESAI */}
            <input
              type="date"
              value={tanggalSelesai}
              onChange={(event) =>
                setTanggalSelesai(
                  event.target.value,
                )
              }
              className="h-10 w-full rounded-xl border border-stone-300 bg-white px-3 text-xs font-semibold text-stone-700 outline-none focus:border-emerald-600 sm:h-11 sm:text-sm"
            />

            {/* RESET */}
            <button
              type="button"
              onClick={resetFilter}
              className="h-10 rounded-xl border border-stone-300 bg-white px-4 text-xs font-bold text-stone-600 transition hover:bg-stone-100 sm:h-11 sm:text-sm"
            >
              Reset
            </button>
          </div>
        </div>

        {/* MOBILE CARD */}
        <div className="mt-4 space-y-3 md:hidden">
          {riwayatTampil.map(
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
                        {item.namaKaryawan}
                      </p>

                      <p className="mt-1 text-[11px] font-semibold text-stone-500">
                        {item.divisi}
                      </p>
                    </div>

                    <span
                      className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold ${badge.className}`}
                    >
                      <Icon size={12} />
                      {item.status}
                    </span>
                  </div>

                  {/* BARANG */}
                  <div className="mt-3 flex items-center gap-3 rounded-xl bg-emerald-50 p-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                      <Package size={16} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-emerald-600">
                        Barang
                      </p>

                      <p className="mt-1 truncate text-sm font-extrabold text-emerald-950">
                        {item.namaBarang}
                      </p>
                    </div>
                  </div>

                  {/* INFO */}
                  <div className="mt-3 grid grid-cols-2 gap-2.5">
                    <div className="rounded-xl bg-stone-50 p-3">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-stone-400">
                        Jumlah
                      </p>

                      <p className="mt-1 text-xs font-extrabold text-stone-900">
                        {item.jumlah}{' '}
                        {item.satuan}
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

                  {/* TANGGAL PENGAJUAN */}
                  <div className="mt-2.5 rounded-xl bg-stone-50 px-3 py-2.5">
                    <p className="text-[10px] font-semibold text-stone-400">
                      Diajukan
                    </p>

                    <p className="mt-1 text-xs font-bold text-stone-700">
                      {formatTanggal(
                        item.tanggalPengajuan,
                      )}
                    </p>
                  </div>

                  {/* DETAIL */}
                  <button
                    type="button"
                    onClick={() =>
                      setPermintaanDetail(
                        item,
                      )
                    }
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-[11px] font-bold text-emerald-700 transition active:bg-emerald-100"
                  >
                    <Eye size={14} />
                    Lihat Detail
                  </button>
                </div>
              )
            },
          )}

          {riwayatTampil.length ===
            0 && (
            <div className="rounded-2xl border border-stone-200 bg-white px-5 py-10 text-center shadow-sm">
              <ClipboardList
                size={34}
                className="mx-auto text-emerald-200"
              />

              <p className="mt-3 text-sm font-bold text-stone-700">
                Riwayat tidak ditemukan
              </p>

              <p className="mt-1 text-[11px] font-medium text-stone-500">
                Belum ada permintaan yang
                sesuai dengan filter.
              </p>
            </div>
          )}
        </div>

        {/* DESKTOP TABLE */}
        <div className="mt-5 hidden overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm md:block">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px]">
              <thead>
                <tr className="border-b border-emerald-100 bg-emerald-50/70 text-left text-xs font-bold uppercase tracking-wide text-emerald-800">
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
                    Tanggal Pengajuan
                  </th>

                  <th className="px-5 py-4">
                    Tanggal Ambil
                  </th>

                  <th className="px-5 py-4">
                    Status
                  </th>

                  <th className="px-5 py-4 text-right">
                    Detail
                  </th>
                </tr>
              </thead>

              <tbody>
                {riwayatTampil.map(
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
                        <td className="px-5 py-4">
                          <p className="text-sm font-bold text-stone-950">
                            {item.namaKaryawan}
                          </p>

                          <p className="mt-1 text-xs font-semibold text-stone-500">
                            {item.divisi}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                              <Package
                                size={17}
                              />
                            </div>

                            <p className="text-sm font-bold text-stone-900">
                              {item.namaBarang}
                            </p>
                          </div>
                        </td>

                        <td className="px-5 py-4 text-sm font-bold text-stone-900">
                          {item.jumlah}{' '}
                          {item.satuan}
                        </td>

                        <td className="px-5 py-4 text-sm font-semibold text-stone-700">
                          {formatTanggal(
                            item.tanggalPengajuan,
                          )}
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

                            {item.status}
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
                            title="Lihat detail"
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-stone-200 text-stone-500 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                          >
                            <Eye
                              size={16}
                            />
                          </button>
                        </td>
                      </tr>
                    )
                  },
                )}

                {riwayatTampil.length ===
                  0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-16 text-center"
                    >
                      <ClipboardList
                        size={40}
                        className="mx-auto text-emerald-200"
                      />

                      <p className="mt-3 font-bold text-stone-700">
                        Riwayat tidak ditemukan
                      </p>

                      <p className="mt-1 text-sm font-medium text-stone-500">
                        Belum ada permintaan yang
                        sesuai dengan filter.
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
                  Detail Riwayat
                </h2>

                <p className="mt-1 text-[11px] font-semibold text-emerald-700 sm:text-sm">
                  Informasi permintaan ATK
                  yang telah diproses.
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
                <X size={18} />
              </button>
            </div>

            {/* BODY */}
            <div className="px-4 py-4 sm:p-6">
              <DetailItem
                label="Nama Karyawan"
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

              {permintaanDetail.catatanAdmin && (
                <div
                  className={`mt-4 rounded-xl border p-3 sm:mt-5 sm:rounded-2xl sm:p-4 ${
                    permintaanDetail.status ===
                    'Diterima'
                      ? 'border-emerald-200 bg-emerald-50'
                      : 'border-red-200 bg-red-50'
                  }`}
                >
                  <p
                    className={`text-[10px] font-extrabold uppercase tracking-wide sm:text-xs ${
                      permintaanDetail.status ===
                      'Diterima'
                        ? 'text-emerald-700'
                        : 'text-red-700'
                    }`}
                  >
                    Catatan Admin
                  </p>

                  <p
                    className={`mt-2 text-xs font-semibold leading-5 sm:text-sm sm:leading-6 ${
                      permintaanDetail.status ===
                      'Diterima'
                        ? 'text-emerald-950'
                        : 'text-red-900'
                    }`}
                  >
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
  status: StatusPermintaan
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