import {
  Bell,
  Menu,
  TriangleAlert,
  UserRound,
  X,
} from 'lucide-react'

import {
  useMemo,
  useState,
} from 'react'

import {
  useLocation,
  useNavigate,
} from 'react-router-dom'

import { useAuth } from '../../context/AuthContext'
import { useBarangStore } from '../../stores/barangStore'
import { usePermintaanStore } from '../../stores/permintaanStore'

interface NavbarProps {
  bukaSidebar: () => void
}

export default function Navbar({
  bukaSidebar,
}: NavbarProps) {
  const location = useLocation()
  const navigate = useNavigate()

  const { pengguna } = useAuth()

  const {
    daftarBarang,
  } = useBarangStore()

  const {
    daftarPermintaan,
  } = usePermintaanStore()

  const [
    notifikasiTerbuka,
    setNotifikasiTerbuka,
  ] = useState(false)

  const judulHalaman =
    useMemo(() => {
      const path =
        location.pathname

      if (path === '/admin') {
        return {
          judul: 'Dashboard',
          deskripsi:
            'Kelola persediaan dan permintaan ATK.',
        }
      }

      if (
        path ===
        '/admin/barang'
      ) {
        return {
          judul: 'Barang ATK',
          deskripsi:
            'Kelola data dan stok barang ATK.',
        }
      }

      if (
        path ===
        '/admin/karyawan'
      ) {
        return {
          judul: 'Karyawan',
          deskripsi:
            'Kelola data akun karyawan.',
        }
      }

      if (
        path ===
        '/admin/permintaan'
      ) {
        return {
          judul: 'Permintaan',
          deskripsi:
            'Tinjau dan proses permintaan ATK.',
        }
      }

      if (
        path ===
        '/admin/riwayat'
      ) {
        return {
          judul: 'Riwayat',
          deskripsi:
            'Lihat riwayat permintaan yang telah diproses.',
        }
      }

      if (
        path ===
        '/admin/laporan'
      ) {
        return {
          judul: 'Laporan',
          deskripsi:
            'Filter dan ekspor laporan persediaan ATK.',
        }
      }

      if (
        path ===
        '/admin/profil'
      ) {
        return {
          judul: 'Profil',
          deskripsi:
            'Informasi akun administrator.',
        }
      }

      return {
        judul:
          'Sistem Persediaan ATK',
        deskripsi:
          'Panel Administrator',
      }
    }, [location.pathname])

  const permintaanMenunggu =
    daftarPermintaan.filter(
      (item) =>
        item.status ===
        'Menunggu',
    )

  const barangHabis =
    daftarBarang.filter(
      (item) =>
        item.stok === 0,
    )

  const barangHampirHabis =
    daftarBarang.filter(
      (item) =>
        item.stok > 0 &&
        item.stok <=
          item.stokMinimum,
    )

  const totalNotifikasi =
    permintaanMenunggu.length +
    barangHabis.length +
    barangHampirHabis.length

  const handleProfil = () => {
    setNotifikasiTerbuka(
      false,
    )

    navigate(
      '/admin/profil',
    )
  }

  return (
    <header className="sticky top-0 z-30 border-b border-stone-200 bg-white">
      <div className="flex h-20 items-center justify-between px-3 sm:px-6 lg:px-7">

        {/* KIRI */}
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={
              bukaSidebar
            }
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-stone-200 text-stone-600 transition hover:bg-stone-100 lg:hidden"
            aria-label="Buka sidebar"
          >
            <Menu
              size={18}
            />
          </button>

          <div className="min-w-0">
            <h2 className="truncate text-sm font-extrabold text-stone-950 sm:text-base">
              {
                judulHalaman.judul
              }
            </h2>

            <p className="mt-1 hidden text-xs font-medium text-stone-500 sm:block">
              {
                judulHalaman.deskripsi
              }
            </p>
          </div>
        </div>

        {/* KANAN */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">

          {/* NOTIFIKASI */}
          <div className="relative">
            <button
              type="button"
              onClick={() =>
                setNotifikasiTerbuka(
                  !notifikasiTerbuka,
                )
              }
              className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-stone-200 bg-white text-stone-600 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 sm:h-10 sm:w-10"
              title="Notifikasi"
              aria-label="Notifikasi"
            >
              {notifikasiTerbuka ? (
                <X
                  size={17}
                />
              ) : (
                <Bell
                  size={17}
                />
              )}

              {totalNotifikasi >
                0 && (
                <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full border-2 border-white bg-red-500 px-1 text-[9px] font-extrabold text-white sm:text-[10px]">
                  {totalNotifikasi >
                  9
                    ? '9+'
                    : totalNotifikasi}
                </span>
              )}
            </button>

            {/* PANEL NOTIFIKASI */}
            {notifikasiTerbuka && (
              <div className="fixed left-3 right-3 top-[72px] z-50 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-2xl sm:absolute sm:left-auto sm:right-0 sm:top-12 sm:w-[380px]">

                {/* HEADER */}
                <div className="border-b border-emerald-100 bg-emerald-50 px-4 py-3 sm:px-5 sm:py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-extrabold text-emerald-950 sm:text-base">
                        Notifikasi
                      </h3>

                      <p className="mt-1 text-[10px] font-semibold text-emerald-700 sm:text-xs">
                        {
                          totalNotifikasi
                        }{' '}
                        informasi perlu
                        perhatian
                      </p>
                    </div>

                    <Bell
                      size={18}
                      className="text-emerald-700 sm:size-[20px]"
                    />
                  </div>
                </div>

                {/* LIST */}
                <div className="max-h-[320px] overflow-y-auto sm:max-h-[380px]">

                  {/* PERMINTAAN MENUNGGU */}
                  {permintaanMenunggu.map(
                    (item) => (
                      <button
                        type="button"
                        key={`req-${item.id}`}
                        onClick={() => {
                          setNotifikasiTerbuka(
                            false,
                          )

                          navigate(
                            '/admin/permintaan',
                          )
                        }}
                        className="flex w-full gap-3 border-b border-stone-100 px-4 py-3 text-left transition hover:bg-emerald-50/50 sm:px-5 sm:py-4"
                      >
                        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700 sm:h-9 sm:w-9 sm:rounded-xl">
                          <Bell
                            size={15}
                          />
                        </div>

                        <div className="min-w-0">
                          <p className="text-xs font-bold text-stone-900 sm:text-sm">
                            Permintaan baru
                          </p>

                          <p className="mt-1 text-[11px] font-medium leading-4 text-stone-500 sm:text-xs sm:leading-5">
                            {
                              item.namaKaryawan
                            }{' '}
                            meminta{' '}
                            {
                              item.jumlah
                            }{' '}
                            {
                              item.satuan
                            }{' '}
                            {
                              item.namaBarang
                            }.
                          </p>

                          <span className="mt-2 inline-block text-[10px] font-bold text-amber-700 sm:text-[11px]">
                            Menunggu
                            persetujuan
                          </span>
                        </div>
                      </button>
                    ),
                  )}

                  {/* STOK HABIS */}
                  {barangHabis.map(
                    (item) => (
                      <button
                        type="button"
                        key={`habis-${item.id}`}
                        onClick={() => {
                          setNotifikasiTerbuka(
                            false,
                          )

                          navigate(
                            '/admin/barang',
                          )
                        }}
                        className="flex w-full gap-3 border-b border-stone-100 px-4 py-3 text-left transition hover:bg-red-50/50 sm:px-5 sm:py-4"
                      >
                        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-600 sm:h-9 sm:w-9 sm:rounded-xl">
                          <TriangleAlert
                            size={15}
                          />
                        </div>

                        <div className="min-w-0">
                          <p className="text-xs font-bold text-stone-900 sm:text-sm">
                            Stok habis
                          </p>

                          <p className="mt-1 text-[11px] font-medium leading-4 text-stone-500 sm:text-xs sm:leading-5">
                            Stok{' '}
                            <span className="font-bold text-stone-700">
                              {
                                item.nama
                              }
                            </span>{' '}
                            sudah habis.
                          </p>

                          <span className="mt-2 inline-block text-[10px] font-bold text-red-600 sm:text-[11px]">
                            Perlu penambahan stok
                          </span>
                        </div>
                      </button>
                    ),
                  )}

                  {/* STOK HAMPIR HABIS */}
                  {barangHampirHabis.map(
                    (item) => (
                      <button
                        type="button"
                        key={`minimum-${item.id}`}
                        onClick={() => {
                          setNotifikasiTerbuka(
                            false,
                          )

                          navigate(
                            '/admin/barang',
                          )
                        }}
                        className="flex w-full gap-3 border-b border-stone-100 px-4 py-3 text-left transition hover:bg-amber-50/50 sm:px-5 sm:py-4"
                      >
                        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700 sm:h-9 sm:w-9 sm:rounded-xl">
                          <TriangleAlert
                            size={15}
                          />
                        </div>

                        <div className="min-w-0">
                          <p className="text-xs font-bold text-stone-900 sm:text-sm">
                            Stok hampir habis
                          </p>

                          <p className="mt-1 text-[11px] font-medium leading-4 text-stone-500 sm:text-xs sm:leading-5">
                            {
                              item.nama
                            }{' '}
                            tersisa{' '}
                            <span className="font-bold text-stone-700">
                              {
                                item.stok
                              }{' '}
                              {
                                item.satuan
                              }
                            </span>
                            .
                          </p>

                          <span className="mt-2 inline-block text-[10px] font-bold text-amber-700 sm:text-[11px]">
                            Stok minimum{' '}
                            {
                              item.stokMinimum
                            }{' '}
                            {
                              item.satuan
                            }
                          </span>
                        </div>
                      </button>
                    ),
                  )}

                  {/* KOSONG */}
                  {totalNotifikasi ===
                    0 && (
                    <div className="px-5 py-8 text-center sm:px-6 sm:py-10">
                      <Bell
                        size={30}
                        className="mx-auto text-emerald-200 sm:size-[34px]"
                      />

                      <p className="mt-3 text-xs font-bold text-stone-700 sm:text-sm">
                        Tidak ada notifikasi
                      </p>

                      <p className="mt-1 text-[11px] font-medium text-stone-400 sm:text-xs">
                        Semua kondisi saat
                        ini aman.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* PROFIL DESKTOP */}
          <button
            type="button"
            onClick={
              handleProfil
            }
            className="hidden items-center gap-3 rounded-xl px-2 py-1.5 text-left transition hover:bg-emerald-50 sm:flex"
          >
            <div>
              <p className="text-sm font-bold text-stone-950">
                {pengguna?.nama ??
                  'Admin Persediaan'}
              </p>

              <p className="mt-0.5 text-right text-xs font-medium text-stone-500">
                Administrator
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <UserRound
                size={19}
              />
            </div>
          </button>

          {/* PROFIL MOBILE */}
          <button
            type="button"
            onClick={
              handleProfil
            }
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 sm:hidden"
            aria-label="Profil"
          >
            <UserRound
              size={17}
            />
          </button>

        </div>
      </div>
    </header>
  )
}