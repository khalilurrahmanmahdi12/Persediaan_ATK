import {
  useState,
  type ReactNode,
} from 'react'

import Navbar from '../navigation/Navbar'
import Sidebar from '../navigation/Sidebar'

interface AdminLayoutProps {
  children: ReactNode
}

export default function AdminLayout({
  children,
}: AdminLayoutProps) {
  const [
    sidebarTerbuka,
    setSidebarTerbuka,
  ] = useState(false)

  return (
    <div className="min-h-screen overflow-x-hidden bg-stone-100">
      {/* SIDEBAR */}
      <Sidebar
        terbuka={sidebarTerbuka}
        tutupSidebar={() =>
          setSidebarTerbuka(false)
        }
      />

      {/* AREA UTAMA */}
      <div className="min-h-screen min-w-0 overflow-x-hidden lg:ml-72">
        {/* NAVBAR */}
        <Navbar
          bukaSidebar={() =>
            setSidebarTerbuka(true)
          }
        />

        {/* CONTENT */}
        <main className="min-w-0 overflow-x-hidden px-4 py-5 sm:px-5 sm:py-6 lg:px-7 lg:py-7">
          {children}
        </main>
      </div>
    </div>
  )
}