import {
  Boxes,
  CheckCircle2,
  ClipboardList,
  Clock3,
  Package,
  TriangleAlert,
  XCircle,
} from 'lucide-react'

import { useMemo } from 'react'

import AdminLayout from '../../components/layout/AdminLayout'

import { useBarangStore } from '../../stores/barangStore'
import { usePermintaanStore } from '../../stores/permintaanStore'

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

export default function Dashboard() {
  const {
    daftarBarang,
  } = useBarangStore()

  const {
    daftarPermintaan,
  } = usePermintaanStore()

  const totalJenisBarang =
    daftarBarang.length

  const totalStok =
    daftarBarang.reduce(
      (
        total,
        barang,
      ) =>
        total +
        barang.stok,
      0,
    )

  const jumlahMenunggu =
    daftarPermintaan.filter(
      (item) =>
        item.status ===
        'Menunggu',
    ).length

  const barangHampirHabis =
    daftarBarang.filter(
      (barang) =>
        barang.stok > 0 &&
        barang.stok <=
          barang.stokMinimum,
    )

  const barangHabis =
    daftarBarang.filter(
      (barang) =>
        barang.stok === 0,
    )

  const permintaanTerbaru =
    useMemo(() => {
      return [
        ...daftarPermintaan,
      ]
        .sort(
          (a, b) =>
            new Date(
              b.tanggalPengajuan,
            ).getTime() -
            new Date(
              a.tanggalPengajuan,
            ).getTime(),
        )
        .slice(0, 5)
    }, [daftarPermintaan])

  return (
    <AdminLayout>
      <div className="min-w-0">
        {/* HEADER */}
        <div>
          <p className="text-sm font-bold text-emerald-700">
            Ringkasan Sistem
          </p>

          <h1 className="mt-1 text-2xl font-extrabold text-stone-950">
            Dashboard
          </h1>

          <p className="mt-1 text-sm font-medium text-stone-500">
            Pantau persediaan barang dan
            permintaan ATK perusahaan.
          </p>
        </div>

        {/* STATISTIK */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {/* TOTAL JENIS */}
          <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-stone-500">
                  Total Jenis Barang
                </p>

                <p className="mt-2 text-3xl font-extrabold text-stone-950">
                  {totalJenisBarang}
                </p>
              </div>

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <Boxes size={21} />
              </div>
            </div>
          </div>

          {/* TOTAL STOK */}
          <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-stone-500">
                  Total Stok
                </p>

                <p className="mt-2 text-3xl font-extrabold text-stone-950">
                  {totalStok}
                </p>
              </div>

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <Package
                  size={21}
                />
              </div>
            </div>
          </div>

          {/* MENUNGGU */}
          <div className="rounded-2xl border border-amber-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-stone-500">
                  Permintaan Menunggu
                </p>

                <p className="mt-2 text-3xl font-extrabold text-stone-950">
                  {jumlahMenunggu}
                </p>
              </div>

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                <Clock3
                  size={21}
                />
              </div>
            </div>
          </div>

          {/* STOK MENIPIS */}
          <div className="rounded-2xl border border-red-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-stone-500">
                  Stok Perlu Perhatian
                </p>

                <p className="mt-2 text-3xl font-extrabold text-stone-950">
                  {barangHampirHabis.length +
                    barangHabis.length}
                </p>
              </div>

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
                <TriangleAlert
                  size={21}
                />
              </div>
            </div>
          </div>
        </div>

        {/* GRID BAWAH */}
        <div className="mt-6 grid min-w-0 gap-6 xl:grid-cols-[1.7fr_1fr]">
          {/* PERMINTAAN TERBARU */}
          <section className="min-w-0 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-emerald-100 bg-emerald-50 px-5 py-4">
              <div>
                <h2 className="font-extrabold text-emerald-950">
                  Permintaan Terbaru
                </h2>

                <p className="mt-1 text-xs font-medium text-emerald-700">
                  Permintaan ATK terbaru dari
                  karyawan.
                </p>
              </div>

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <ClipboardList
                  size={19}
                />
              </div>
            </div>

            {/*
              PENTING:
              hanya bagian ini yang boleh
              horizontal scroll di mobile.
            */}
            <div className="w-full overflow-x-auto">
              <table className="w-full min-w-[720px]">
                <thead>
                  <tr className="border-b border-stone-200 bg-stone-50 text-left text-[11px] font-bold uppercase tracking-wide text-stone-500">
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
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {permintaanTerbaru.map(
                    (item) => (
                      <tr
                        key={item.id}
                        className="border-b border-stone-100 last:border-0"
                      >
                        <td className="px-5 py-4">
                          <p className="text-sm font-bold text-stone-900">
                            {
                              item.namaKaryawan
                            }
                          </p>

                          <p className="mt-1 text-xs font-medium text-stone-500">
                            {item.divisi}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <p className="text-sm font-semibold text-stone-800">
                            {
                              item.namaBarang
                            }
                          </p>

                          <p className="mt-1 text-xs text-stone-400">
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

                        <td className="px-5 py-4">
                          {item.status ===
                          'Diterima' ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-700">
                              <CheckCircle2
                                size={13}
                              />
                              Diterima
                            </span>
                          ) : item.status ===
                            'Ditolak' ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-3 py-1.5 text-xs font-bold text-red-700">
                              <XCircle
                                size={13}
                              />
                              Ditolak
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1.5 text-xs font-bold text-amber-700">
                              <Clock3
                                size={13}
                              />
                              Menunggu
                            </span>
                          )}
                        </td>
                      </tr>
                    ),
                  )}

                  {permintaanTerbaru.length ===
                    0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-5 py-12 text-center"
                      >
                        <ClipboardList
                          size={34}
                          className="mx-auto text-stone-300"
                        />

                        <p className="mt-3 text-sm font-bold text-stone-600">
                          Belum ada permintaan
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* PETUNJUK MOBILE */}
            {permintaanTerbaru.length >
              0 && (
              <div className="border-t border-stone-100 bg-stone-50 px-5 py-2 text-center text-[10px] font-medium text-stone-400 md:hidden">
                Geser tabel ke samping untuk
                melihat data lainnya
              </div>
            )}
          </section>

          {/* STOK HAMPIR HABIS */}
          <section className="min-w-0 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-emerald-100 bg-emerald-50 px-5 py-4">
              <div>
                <h2 className="font-extrabold text-emerald-950">
                  Stok Perlu Perhatian
                </h2>

                <p className="mt-1 text-xs font-medium text-emerald-700">
                  Barang yang perlu ditambah.
                </p>
              </div>

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                <TriangleAlert
                  size={19}
                />
              </div>
            </div>

            <div className="divide-y divide-stone-100">
              {[
                ...barangHabis,
                ...barangHampirHabis,
              ]
                .slice(0, 5)
                .map(
                  (barang) => (
                    <div
                      key={
                        barang.id
                      }
                      className="flex items-center justify-between gap-4 px-5 py-4"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-stone-900">
                          {
                            barang.nama
                          }
                        </p>

                        <p className="mt-1 text-xs font-medium text-stone-500">
                          Minimum{' '}
                          {
                            barang.stokMinimum
                          }{' '}
                          {
                            barang.satuan
                          }
                        </p>
                      </div>

                      <div className="shrink-0 text-right">
                        <p
                          className={`text-sm font-extrabold ${
                            barang.stok ===
                            0
                              ? 'text-red-600'
                              : 'text-amber-600'
                          }`}
                        >
                          {
                            barang.stok
                          }{' '}
                          {
                            barang.satuan
                          }
                        </p>

                        <p className="mt-1 text-[11px] font-bold text-stone-400">
                          {barang.stok ===
                          0
                            ? 'Habis'
                            : 'Hampir habis'}
                        </p>
                      </div>
                    </div>
                  ),
                )}

              {barangHabis.length ===
                0 &&
                barangHampirHabis.length ===
                  0 && (
                  <div className="px-5 py-12 text-center">
                    <CheckCircle2
                      size={34}
                      className="mx-auto text-emerald-300"
                    />

                    <p className="mt-3 text-sm font-bold text-stone-700">
                      Stok aman
                    </p>

                    <p className="mt-1 text-xs font-medium text-stone-400">
                      Tidak ada barang yang
                      perlu perhatian.
                    </p>
                  </div>
                )}
            </div>
          </section>
        </div>
      </div>
    </AdminLayout>
  )
}