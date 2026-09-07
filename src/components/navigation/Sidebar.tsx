import type { ElementType } from 'react'

import {
  Boxes,
  ClipboardList,
  FileSpreadsheet,
  LayoutDashboard,
  LogOut,
  PackageOpen,
  UserRound,
  Users,
  X,
} from 'lucide-react'

import {
  NavLink,
  useNavigate,
} from 'react-router-dom'

import { useAuth } from '../../context/AuthContext'

interface SidebarProps {
  terbuka: boolean
  tutupSidebar: () => void
}

interface MenuItem {
  label: string
  path: string
  icon: ElementType
}

export default function Sidebar({
  terbuka,
  tutupSidebar,
}: SidebarProps) {
  const navigate = useNavigate()

  const { logout } = useAuth()

  const menu: MenuItem[] = [
    {
      label: 'Dashboard',
      path: '/admin',
      icon: LayoutDashboard,
    },
    {
      label: 'Barang ATK',
      path: '/admin/barang',
      icon: Boxes,
    },
    {
      label: 'Karyawan',
      path: '/admin/karyawan',
      icon: Users,
    },
    {
      label: 'Permintaan',
      path: '/admin/permintaan',
      icon: ClipboardList,
    },
    {
      label: 'Riwayat',
      path: '/admin/riwayat',
      icon: PackageOpen,
    },
    {
      label: 'Laporan',
      path: '/admin/laporan',
      icon: FileSpreadsheet,
    },
    {
      label: 'Profil',
      path: '/admin/profil',
      icon: UserRound,
    },
  ]

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <>
      {/* OVERLAY MOBILE */}
      {terbuka && (
        <button
          type="button"
          aria-label="Tutup sidebar"
          onClick={tutupSidebar}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-72 flex-col bg-emerald-900 text-white shadow-xl transition-transform duration-300 lg:translate-x-0 ${
          terbuka
            ? 'translate-x-0'
            : '-translate-x-full'
        }`}
      >
        {/* HEADER */}
        <div className="flex h-20 items-center justify-between border-b border-emerald-800 px-6">
          <div>
            <h1 className="text-lg font-extrabold tracking-tight text-white">
              Sistem Persediaan ATK
            </h1>

            <p className="mt-1 text-xs font-medium text-emerald-200">
              Panel Administrator
            </p>
          </div>

          <button
            type="button"
            onClick={tutupSidebar}
            aria-label="Tutup sidebar"
            className="rounded-lg p-2 text-emerald-100 transition hover:bg-emerald-800 hover:text-white lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* MENU */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-6">
          {menu.map((item) => {
            const Icon = item.icon

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/admin'}
                onClick={tutupSidebar}
                className={({
                  isActive,
                }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                    isActive
                      ? 'bg-white text-emerald-900 shadow-sm'
                      : 'text-emerald-100 hover:bg-emerald-800 hover:text-white'
                  }`
                }
              >
                <Icon
                  size={19}
                  strokeWidth={2.2}
                />

                <span>
                  {item.label}
                </span>
              </NavLink>
            )
          })}
        </nav>

        {/* LOGOUT */}
        <div className="border-t border-emerald-800 p-4">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-800 hover:text-white"
          >
            <LogOut
              size={19}
              strokeWidth={2.2}
            />

            <span>
              Keluar
            </span>
          </button>
        </div>
      </aside>
    </>
  )
}