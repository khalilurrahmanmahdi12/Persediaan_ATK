import {
  Navigate,
  Route,
  Routes,
} from 'react-router-dom'

import ProtectedRoute from './components/ProtectedRoute'

import { useAuth } from './context/AuthContext'

import Login from './pages/Login'

import Dashboard from './pages/admin/Dashboard'
import BarangPage from './pages/admin/Barang'
import KaryawanPage from './pages/admin/Karyawan'
import PermintaanPage from './pages/admin/Permintaan'
import RiwayatPage from './pages/admin/Riwayat'
import LaporanPage from './pages/admin/Laporan'
import ProfilPage from './pages/admin/Profil'

import PermintaanBarang from './pages/karyawan/PermintaanBarang'

export default function App() {
  const { pengguna } = useAuth()

  return (
    <Routes>
      {/* LOGIN */}
      <Route
        path="/"
        element={
          pengguna ? (
            <Navigate
              to={
                pengguna.role === 'admin'
                  ? '/admin'
                  : '/karyawan'
              }
              replace
            />
          ) : (
            <Login />
          )
        }
      />

      {/* ADMIN DASHBOARD */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* ADMIN BARANG */}
      <Route
        path="/admin/barang"
        element={
          <ProtectedRoute role="admin">
            <BarangPage />
          </ProtectedRoute>
        }
      />

      {/* ADMIN KARYAWAN */}
      <Route
        path="/admin/karyawan"
        element={
          <ProtectedRoute role="admin">
            <KaryawanPage />
          </ProtectedRoute>
        }
      />

      {/* ADMIN PERMINTAAN */}
      <Route
        path="/admin/permintaan"
        element={
          <ProtectedRoute role="admin">
            <PermintaanPage />
          </ProtectedRoute>
        }
      />

      {/* ADMIN RIWAYAT */}
      <Route
        path="/admin/riwayat"
        element={
          <ProtectedRoute role="admin">
            <RiwayatPage />
          </ProtectedRoute>
        }
      />

      {/* ADMIN LAPORAN */}
      <Route
        path="/admin/laporan"
        element={
          <ProtectedRoute role="admin">
            <LaporanPage />
          </ProtectedRoute>
        }
      />

      {/* ADMIN PROFIL */}
      <Route
        path="/admin/profil"
        element={
          <ProtectedRoute role="admin">
            <ProfilPage />
          </ProtectedRoute>
        }
      />

      {/* KARYAWAN */}
      <Route
        path="/karyawan"
        element={
          <ProtectedRoute role="karyawan">
            <PermintaanBarang />
          </ProtectedRoute>
        }
      />

      {/* 404 */}
      <Route
        path="*"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />
    </Routes>
  )
}