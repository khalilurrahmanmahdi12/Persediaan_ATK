import {
  BriefcaseBusiness,
  Building2,
  Mail,
  ShieldCheck,
  Smartphone,
  UserRound,
} from 'lucide-react'

import type {
  ElementType,
} from 'react'

import AdminLayout from '../../components/layout/AdminLayout'
import { useAuth } from '../../context/AuthContext'

export default function ProfilPage() {
  const {
    pengguna,
  } = useAuth()

  return (
    <AdminLayout>
      <div className="min-w-0">

        {/* HEADER */}
        <div>
          <p className="text-xs font-bold text-emerald-700 sm:text-sm">
            Informasi Akun
          </p>

          <h1 className="mt-1 text-xl font-extrabold text-stone-950 sm:text-2xl">
            Profil Administrator
          </h1>

          <p className="mt-1 max-w-2xl text-xs font-medium leading-5 text-stone-500 sm:text-sm">
            Informasi akun yang sedang
            digunakan untuk mengelola
            Sistem Persediaan ATK.
          </p>
        </div>

        {/* PROFIL UTAMA */}
        <div className="mt-4 overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm sm:mt-6 sm:rounded-3xl">

          {/* HERO PROFIL */}
          <div className="bg-emerald-900 px-4 py-4 text-white sm:px-8 sm:py-7">
            <div className="flex items-center gap-3 sm:gap-5">

              {/* AVATAR */}
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 sm:h-20 sm:w-20">
                <UserRound
                  size={27}
                  className="sm:hidden"
                />

                <UserRound
                  size={38}
                  className="hidden sm:block"
                />
              </div>

              {/* IDENTITAS */}
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">

                  <h2 className="truncate text-lg font-extrabold text-white sm:text-2xl">
                    {pengguna?.nama ??
                      'Admin Persediaan'}
                  </h2>

                  <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-extrabold text-emerald-800 sm:px-3 sm:text-xs">
                    Aktif
                  </span>
                </div>

                <p className="mt-1.5 text-[11px] font-semibold text-emerald-100 sm:mt-2 sm:text-sm">
                  Administrator Sistem
                  Persediaan ATK
                </p>

                <div className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-2.5 py-1.5 text-[10px] font-semibold text-emerald-50 sm:mt-3 sm:gap-2 sm:px-3 sm:py-2 sm:text-xs">
                  <ShieldCheck
                    size={13}
                    className="sm:hidden"
                  />

                  <ShieldCheck
                    size={15}
                    className="hidden sm:block"
                  />

                  Akses Administrator
                </div>
              </div>
            </div>
          </div>

          {/* DETAIL */}
          <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 sm:gap-5 sm:p-8">

            <InfoCard
              icon={UserRound}
              label="Nama Lengkap"
              value={
                pengguna?.nama ??
                'Admin Persediaan'
              }
            />

            <InfoCard
              icon={Mail}
              label="Email"
              value={
                pengguna?.email ??
                'admin@persediaanatk.id'
              }
            />

            <InfoCard
              icon={Smartphone}
              label="Nomor WhatsApp"
              value={
                pengguna?.whatsapp ??
                '081234567890'
              }
            />

            <InfoCard
              icon={Building2}
              label="Divisi"
              value={
                pengguna?.divisi ??
                'General Affair'
              }
            />

            <InfoCard
              icon={BriefcaseBusiness}
              label="Jabatan"
              value={
                pengguna?.jabatan ??
                'Administrator'
              }
            />

            <InfoCard
              icon={ShieldCheck}
              label="Hak Akses"
              value="Administrator"
            />
          </div>
        </div>

        {/* HAK AKSES */}
        <div className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 sm:mt-6 sm:rounded-3xl sm:p-6">
          <div className="flex items-start gap-3 sm:gap-4">

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 sm:h-11 sm:w-11">
              <ShieldCheck
                size={18}
                className="sm:hidden"
              />

              <ShieldCheck
                size={21}
                className="hidden sm:block"
              />
            </div>

            <div className="min-w-0">
              <h3 className="text-sm font-extrabold text-emerald-950 sm:text-base">
                Hak Akses Administrator
              </h3>

              <p className="mt-1.5 max-w-3xl text-[11px] font-medium leading-5 text-emerald-800 sm:mt-2 sm:text-sm sm:leading-6">
                Akun administrator dapat
                mengelola barang ATK,
                karyawan, memproses
                permintaan, melihat
                riwayat, serta membuat
                laporan Excel dan PDF.
              </p>
            </div>
          </div>
        </div>

      </div>
    </AdminLayout>
  )
}

interface InfoCardProps {
  icon: ElementType
  label: string
  value: string
}

function InfoCard({
  icon: Icon,
  label,
  value,
}: InfoCardProps) {
  return (
    <div className="rounded-xl border border-stone-200 bg-stone-50 p-3.5 sm:rounded-2xl sm:p-5">
      <div className="flex items-center gap-3 sm:items-start sm:gap-4">

        {/* ICON */}
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 sm:h-10 sm:w-10">
          <Icon
            size={17}
            className="sm:hidden"
          />

          <Icon
            size={19}
            className="hidden sm:block"
          />
        </div>

        {/* INFO */}
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wide text-stone-500 sm:text-xs">
            {label}
          </p>

          <p className="mt-1 break-all text-xs font-extrabold text-stone-950 sm:mt-2 sm:text-sm">
            {value}
          </p>
        </div>
      </div>
    </div>
  )
}