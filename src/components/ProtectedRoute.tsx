import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'

import { useAuth } from '../context/AuthContext'
import type { RolePengguna } from '../types/pengguna'

interface ProtectedRouteProps {
  children: ReactNode
  role: RolePengguna
}

export default function ProtectedRoute({
  children,
  role,
}: ProtectedRouteProps) {
  const { pengguna } = useAuth()

  if (!pengguna) {
    return <Navigate to="/" replace />
  }

  if (pengguna.role !== role) {
    return (
      <Navigate
        to={
          pengguna.role === 'admin'
            ? '/admin'
            : '/karyawan'
        }
        replace
      />
    )
  }

  return children
}