import {
  CheckCircle2,
  ClipboardList,
  Download,
  FileSpreadsheet,
  FileText,
  Filter,
  Search,
  XCircle,
  Clock3,
} from 'lucide-react'

import {
  useMemo,
  useState,
} from 'react'

import { toast } from 'sonner'

import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

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

function formatTanggalLengkap(
  tanggal: string,
) {
  if (!tanggal) {
    return '-'
  }

  return new Intl.DateTimeFormat(
    'id-ID',
    {
      day: '2-digit',
      month: 'long',
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

export default function LaporanPage() {
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

  const daftarDivisi =
    useMemo(() => {
      return [
        'Semua',
        ...Array.from(
          new Set(
            daftarPermintaan
              .map(
                (item) =>
                  item.divisi,
              )
              .filter(Boolean),
          ),
        ),
      ]
    }, [daftarPermintaan])

  const dataLaporan =
    useMemo(() => {
      const keyword =
        pencarian
          .trim()
          .toLowerCase()

      return daftarPermintaan
        .filter((item) => {
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

          const cocokDivisi =
            filterDivisi ===
              'Semua' ||
            item.divisi ===
              filterDivisi

          const tanggal =
            item.tanggalPengajuan
              .split('T')[0]

          const cocokMulai =
            !tanggalMulai ||
            tanggal >=
              tanggalMulai

          const cocokSelesai =
            !tanggalSelesai ||
            tanggal <=
              tanggalSelesai

          return (
            cocokPencarian &&
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
      daftarPermintaan,
      pencarian,
      filterStatus,
      filterDivisi,
      tanggalMulai,
      tanggalSelesai,
    ])

  const jumlahMenunggu =
    dataLaporan.filter(
      (item) =>
        item.status ===
        'Menunggu',
    ).length

  const jumlahDiterima =
    dataLaporan.filter(
      (item) =>
        item.status ===
        'Diterima',
    ).length

  const jumlahDitolak =
    dataLaporan.filter(
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

  const validasiPeriode = () => {
    if (
      tanggalMulai &&
      tanggalSelesai &&
      tanggalMulai >
        tanggalSelesai
    ) {
      toast.error(
        'Tanggal mulai tidak boleh melebihi tanggal selesai.',
      )

      return false
    }

    return true
  }

  const handleExportExcel = () => {
    if (!validasiPeriode()) {
      return
    }

    if (
      dataLaporan.length === 0
    ) {
      toast.error(
        'Tidak ada data untuk diekspor.',
      )
      return
    }

    const dataExcel =
      dataLaporan.map(
        (
          item,
          index,
        ) => ({
          No: index + 1,

          'Tanggal Pengajuan':
            formatTanggalLengkap(
              item.tanggalPengajuan,
            ),

          'Nama Karyawan':
            item.namaKaryawan,

          Divisi:
            item.divisi,

          Barang:
            item.namaBarang,

          Jumlah:
            item.jumlah,

          Satuan:
            item.satuan,

          'Tanggal Pengambilan':
            formatTanggalLengkap(
              item.tanggalPengambilan,
            ),

          Status:
            item.status,

          Keterangan:
            item.keterangan ||
            '-',

          'Catatan Admin':
            item.catatanAdmin ||
            '-',
        }),
      )

    const worksheet =
      XLSX.utils.json_to_sheet(
        dataExcel,
      )

    worksheet['!cols'] = [
      { wch: 5 },
      { wch: 22 },
      { wch: 28 },
      { wch: 24 },
      { wch: 25 },
      { wch: 10 },
      { wch: 12 },
      { wch: 22 },
      { wch: 14 },
      { wch: 35 },
      { wch: 45 },
    ]

    const workbook =
      XLSX.utils.book_new()

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      'Laporan Permintaan ATK',
    )

    const namaFile = `Laporan-Persediaan-ATK-${
      new Date()
        .toISOString()
        .split('T')[0]
    }.xlsx`

    XLSX.writeFile(
      workbook,
      namaFile,
    )

    toast.success(
      'Laporan Excel berhasil dibuat.',
    )
  }

  const handleExportPdf = () => {
    if (!validasiPeriode()) {
      return
    }

    if (
      dataLaporan.length === 0
    ) {
      toast.error(
        'Tidak ada data untuk diekspor.',
      )
      return
    }

    const doc = new jsPDF({
      orientation:
        'landscape',
      unit: 'mm',
      format: 'a4',
    })

    doc.setFont(
      'helvetica',
      'bold',
    )

    doc.setFontSize(18)

    doc.text(
      'SISTEM PERSEDIAAN ATK',
      14,
      16,
    )

    doc.setFontSize(13)

    doc.text(
      'Laporan Permintaan Barang ATK',
      14,
      23,
    )

    doc.setFont(
      'helvetica',
      'normal',
    )

    doc.setFontSize(9)

    const periode =
      tanggalMulai ||
      tanggalSelesai
        ? `${
            tanggalMulai
              ? formatTanggalLengkap(
                  tanggalMulai,
                )
              : 'Awal'
          } s.d. ${
            tanggalSelesai
              ? formatTanggalLengkap(
                  tanggalSelesai,
                )
              : 'Sekarang'
          }`
        : 'Semua Periode'

    doc.text(
      `Periode: ${periode}`,
      14,
      30,
    )

    doc.text(
      `Status: ${filterStatus}`,
      14,
      35,
    )

    doc.text(
      `Divisi: ${filterDivisi}`,
      14,
      40,
    )

    doc.text(
      `Total Data: ${dataLaporan.length}`,
      14,
      45,
    )

    autoTable(doc, {
      startY: 51,

      head: [
        [
          'No',
          'Tanggal',
          'Karyawan',
          'Divisi',
          'Barang',
          'Jumlah',
          'Tgl Ambil',
          'Status',
        ],
      ],

      body:
        dataLaporan.map(
          (
            item,
            index,
          ) => [
            String(
              index + 1,
            ),

            formatTanggal(
              item.tanggalPengajuan,
            ),

            item.namaKaryawan,

            item.divisi,

            item.namaBarang,

            `${item.jumlah} ${item.satuan}`,

            formatTanggal(
              item.tanggalPengambilan,
            ),

            item.status,
          ],
        ),

      styles: {
        fontSize: 8,
        cellPadding: 3,
      },

      headStyles: {
        fillColor: [
          4,
          120,
          87,
        ],
        textColor: 255,
        fontStyle: 'bold',
      },

      alternateRowStyles: {
        fillColor: [
          248,
          250,
          252,
        ],
      },

      margin: {
        left: 14,
        right: 14,
      },
    })

    const namaFile = `Laporan-Persediaan-ATK-${
      new Date()
        .toISOString()
        .split('T')[0]
    }.pdf`

    doc.save(namaFile)

    toast.success(
      'Laporan PDF berhasil dibuat.',
    )
  }

  return (
    <AdminLayout>
      <div className="min-w-0">

        {/* HEADER */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between lg:gap-4">

          <div>
            <p className="text-xs font-bold text-emerald-700 sm:text-sm">
              Pelaporan
            </p>

            <h1 className="mt-1 text-xl font-extrabold text-stone-950 sm:text-2xl">
              Laporan Persediaan ATK
            </h1>

            <p className="mt-1 text-xs font-medium leading-5 text-stone-500 sm:text-sm">
              Filter dan ekspor data
              permintaan barang ATK.
            </p>
          </div>

          {/* EXPORT */}
          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-row">
            <button
              type="button"
              onClick={
                handleExportExcel
              }
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-[11px] font-bold text-emerald-700 transition hover:bg-emerald-100 sm:gap-2 sm:px-4 sm:py-3 sm:text-sm"
            >
              <FileSpreadsheet
                size={15}
                className="sm:hidden"
              />

              <FileSpreadsheet
                size={18}
                className="hidden sm:block"
              />

              Export Excel
            </button>

            <button
              type="button"
              onClick={
                handleExportPdf
              }
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-700 px-3 py-2.5 text-[11px] font-bold text-white transition hover:bg-emerald-800 sm:gap-2 sm:px-4 sm:py-3 sm:text-sm"
            >
              <FileText
                size={15}
                className="sm:hidden"
              />

              <FileText
                size={18}
                className="hidden sm:block"
              />

              Export PDF
            </button>
          </div>
        </div>

        {/* STATISTIK */}
        <div className="mt-4 grid grid-cols-2 gap-3 sm:mt-6 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">

          {/* TOTAL */}
          <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold text-stone-500 sm:text-sm">
                  Total Data
                </p>

                <p className="mt-1.5 text-2xl font-extrabold text-stone-950 sm:mt-2 sm:text-3xl">
                  {
                    dataLaporan.length
                  }
                </p>
              </div>

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-stone-100 text-stone-600 sm:h-11 sm:w-11">
                <ClipboardList
                  size={18}
                  className="sm:hidden"
                />

                <ClipboardList
                  size={21}
                  className="hidden sm:block"
                />
              </div>
            </div>
          </div>

          {/* MENUNGGU */}
          <div className="rounded-2xl border border-amber-100 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold text-stone-500 sm:text-sm">
                  Menunggu
                </p>

                <p className="mt-1.5 text-2xl font-extrabold text-amber-600 sm:mt-2 sm:text-3xl">
                  {jumlahMenunggu}
                </p>
              </div>

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700 sm:h-11 sm:w-11">
                <Clock3
                  size={18}
                  className="sm:hidden"
                />

                <Clock3
                  size={21}
                  className="hidden sm:block"
                />
              </div>
            </div>
          </div>

          {/* DITERIMA */}
          <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold text-stone-500 sm:text-sm">
                  Diterima
                </p>

                <p className="mt-1.5 text-2xl font-extrabold text-emerald-700 sm:mt-2 sm:text-3xl">
                  {jumlahDiterima}
                </p>
              </div>

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 sm:h-11 sm:w-11">
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
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold text-stone-500 sm:text-sm">
                  Ditolak
                </p>

                <p className="mt-1.5 text-2xl font-extrabold text-red-600 sm:mt-2 sm:text-3xl">
                  {jumlahDitolak}
                </p>
              </div>

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600 sm:h-11 sm:w-11">
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
        <section className="mt-4 rounded-2xl border border-stone-200 bg-white p-3 shadow-sm sm:mt-5 sm:p-5">

          <div className="flex items-center gap-2">
            <Filter
              size={16}
              className="text-emerald-700 sm:size-[18px]"
            />

            <h2 className="text-xs font-extrabold text-stone-800 sm:text-sm">
              Filter Laporan
            </h2>
          </div>

          <div className="mt-3 grid gap-3 md:grid-cols-2 sm:mt-4 sm:gap-4 xl:grid-cols-3">

            {/* CARI */}
            <div>
              <label className="mb-1.5 block text-xs font-bold text-stone-700 sm:mb-2 sm:text-sm">
                Pencarian
              </label>

              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 sm:left-4 sm:size-[18px]"
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
                  placeholder="Nama karyawan atau barang..."
                  className="h-10 w-full rounded-xl border border-stone-300 bg-white pl-9 pr-3 text-xs font-medium text-stone-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 sm:h-11 sm:pl-11 sm:pr-4 sm:text-sm"
                />
              </div>
            </div>

            {/* STATUS */}
            <div>
              <label className="mb-1.5 block text-xs font-bold text-stone-700 sm:mb-2 sm:text-sm">
                Status
              </label>

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

            {/* DIVISI */}
            <div>
              <label className="mb-1.5 block text-xs font-bold text-stone-700 sm:mb-2 sm:text-sm">
                Divisi
              </label>

              <select
                value={
                  filterDivisi
                }
                onChange={(
                  event,
                ) =>
                  setFilterDivisi(
                    event.target.value,
                  )
                }
                className="h-10 w-full rounded-xl border border-stone-300 bg-white px-3 text-xs font-semibold text-stone-700 outline-none focus:border-emerald-600 sm:h-11 sm:px-4 sm:text-sm"
              >
                {daftarDivisi.map(
                  (divisi) => (
                    <option
                      key={
                        divisi
                      }
                      value={
                        divisi
                      }
                    >
                      {divisi}
                    </option>
                  ),
                )}
              </select>
            </div>

            {/* TANGGAL MULAI */}
            <div>
              <label className="mb-1.5 block text-xs font-bold text-stone-700 sm:mb-2 sm:text-sm">
                Tanggal Mulai
              </label>

              <input
                type="date"
                value={
                  tanggalMulai
                }
                onChange={(
                  event,
                ) =>
                  setTanggalMulai(
                    event.target.value,
                  )
                }
                className="h-10 w-full rounded-xl border border-stone-300 bg-white px-3 text-xs font-semibold text-stone-700 outline-none focus:border-emerald-600 sm:h-11 sm:px-4 sm:text-sm"
              />
            </div>

            {/* TANGGAL SELESAI */}
            <div>
              <label className="mb-1.5 block text-xs font-bold text-stone-700 sm:mb-2 sm:text-sm">
                Tanggal Selesai
              </label>

              <input
                type="date"
                value={
                  tanggalSelesai
                }
                onChange={(
                  event,
                ) =>
                  setTanggalSelesai(
                    event.target.value,
                  )
                }
                className="h-10 w-full rounded-xl border border-stone-300 bg-white px-3 text-xs font-semibold text-stone-700 outline-none focus:border-emerald-600 sm:h-11 sm:px-4 sm:text-sm"
              />
            </div>

            {/* RESET */}
            <div className="flex items-end">
              <button
                type="button"
                onClick={
                  resetFilter
                }
                className="h-10 w-full rounded-xl border border-stone-300 bg-white px-4 text-xs font-bold text-stone-600 transition hover:bg-stone-100 sm:h-11 sm:text-sm"
              >
                Reset Filter
              </button>
            </div>

          </div>
        </section>

        {/* INFO HASIL */}
        <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 sm:mt-5 sm:px-5 sm:py-4">

          <div>
            <p className="text-xs font-bold text-emerald-900 sm:text-sm">
              Hasil Laporan
            </p>

            <p className="mt-1 text-[10px] font-medium text-emerald-700 sm:text-xs">
              Menampilkan{' '}
              {dataLaporan.length}{' '}
              data berdasarkan filter.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-1 text-[10px] font-bold text-emerald-700 sm:gap-2 sm:text-xs">
            <Download
              size={14}
              className="sm:size-[16px]"
            />
            Siap
          </div>
        </div>

        {/* MOBILE DATA */}
        <div className="mt-4 space-y-3 md:hidden">
          {dataLaporan.map(
            (
              item,
              index,
            ) => {
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
                  {/* HEADER */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold text-stone-400">
                        #{index + 1}
                      </p>

                      <p className="mt-1 truncate text-sm font-extrabold text-stone-950">
                        {
                          item.namaKaryawan
                        }
                      </p>

                      <p className="mt-1 text-[11px] font-semibold text-stone-500">
                        {
                          item.divisi
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

                  {/* BARANG */}
                  <div className="mt-3 rounded-xl bg-emerald-50 p-3">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-emerald-600">
                      Barang
                    </p>

                    <p className="mt-1 text-sm font-extrabold text-emerald-950">
                      {
                        item.namaBarang
                      }
                    </p>

                    <p className="mt-1 text-xs font-bold text-emerald-800">
                      {
                        item.jumlah
                      }{' '}
                      {
                        item.satuan
                      }
                    </p>
                  </div>

                  {/* TANGGAL */}
                  <div className="mt-3 grid grid-cols-2 gap-2.5">

                    <div className="rounded-xl bg-stone-50 p-3">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-stone-400">
                        Pengajuan
                      </p>

                      <p className="mt-1 text-xs font-bold text-stone-800">
                        {formatTanggal(
                          item.tanggalPengajuan,
                        )}
                      </p>
                    </div>

                    <div className="rounded-xl bg-stone-50 p-3">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-stone-400">
                        Ambil
                      </p>

                      <p className="mt-1 text-xs font-bold text-stone-800">
                        {formatTanggal(
                          item.tanggalPengambilan,
                        )}
                      </p>
                    </div>

                  </div>
                </div>
              )
            },
          )}

          {dataLaporan.length ===
            0 && (
            <div className="rounded-2xl border border-stone-200 bg-white px-5 py-10 text-center shadow-sm">
              <FileText
                size={34}
                className="mx-auto text-emerald-200"
              />

              <p className="mt-3 text-sm font-bold text-stone-700">
                Data laporan tidak ditemukan
              </p>

              <p className="mt-1 text-[11px] font-medium text-stone-500">
                Ubah filter atau periode
                untuk menampilkan data.
              </p>
            </div>
          )}
        </div>

        {/* DESKTOP TABLE */}
        <div className="mt-5 hidden overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm md:block">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px]">
              <thead>
                <tr className="border-b border-emerald-100 bg-emerald-50/70 text-left text-xs font-bold uppercase tracking-wide text-emerald-800">
                  <th className="px-5 py-4">
                    No
                  </th>

                  <th className="px-5 py-4">
                    Tanggal
                  </th>

                  <th className="px-5 py-4">
                    Karyawan
                  </th>

                  <th className="px-5 py-4">
                    Divisi
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
                </tr>
              </thead>

              <tbody>
                {dataLaporan.map(
                  (
                    item:
                      Permintaan,
                    index,
                  ) => {
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
                        className="border-b border-stone-100 last:border-0 hover:bg-emerald-50/30"
                      >
                        <td className="px-5 py-4 text-sm font-bold text-stone-500">
                          {index + 1}
                        </td>

                        <td className="px-5 py-4 text-sm font-semibold text-stone-700">
                          {formatTanggal(
                            item.tanggalPengajuan,
                          )}
                        </td>

                        <td className="px-5 py-4">
                          <p className="text-sm font-bold text-stone-950">
                            {
                              item.namaKaryawan
                            }
                          </p>
                        </td>

                        <td className="px-5 py-4 text-sm font-semibold text-stone-700">
                          {
                            item.divisi
                          }
                        </td>

                        <td className="px-5 py-4 text-sm font-bold text-stone-900">
                          {
                            item.namaBarang
                          }
                        </td>

                        <td className="px-5 py-4 text-sm font-bold text-stone-900">
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
                      </tr>
                    )
                  },
                )}

                {dataLaporan.length ===
                  0 && (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-6 py-16 text-center"
                    >
                      <FileText
                        size={40}
                        className="mx-auto text-emerald-200"
                      />

                      <p className="mt-3 font-bold text-stone-700">
                        Data laporan tidak ditemukan
                      </p>

                      <p className="mt-1 text-sm font-medium text-stone-500">
                        Ubah filter atau periode
                        untuk menampilkan data.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </AdminLayout>
  )
}