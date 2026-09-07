import {
  useEffect,
} from 'react'

import { useBarangStore } from '../stores/barangStore'
import { usePermintaanStore } from '../stores/permintaanStore'
import { usePenggunaStore } from '../stores/penggunaStore'

const STORAGE_BARANG =
  'persediaan-atk-barang'

const STORAGE_PERMINTAAN =
  'persediaan-atk-permintaan'

const STORAGE_PENGGUNA =
  'persediaan-atk-pengguna-data'

export default function StorageSync() {
  useEffect(() => {
    const handleStorage = (
      event: StorageEvent,
    ) => {
      if (
        event.key ===
        STORAGE_BARANG
      ) {
        void useBarangStore.persist.rehydrate()
      }

      if (
        event.key ===
        STORAGE_PERMINTAAN
      ) {
        void usePermintaanStore.persist.rehydrate()
      }

      if (
        event.key ===
        STORAGE_PENGGUNA
      ) {
        void usePenggunaStore.persist.rehydrate()
      }
    }

    window.addEventListener(
      'storage',
      handleStorage,
    )

    return () => {
      window.removeEventListener(
        'storage',
        handleStorage,
      )
    }
  }, [])

  return null
}