import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useStoreImages = create(
    persist((set, get) => ({
        blobs: {},
        setBlob: (key, value) => set((state) => ({ blobs: { ...state.blobs, [key]: value } })),
        getBlob: (key) => get().blobs[key],
        removeBlob: (key) => set((state) => {
            const { [key]: removed, ...rest } = state.blobs;
            return { blobs: rest };
        }),
        setBlobs: (blobs) => set({ blobs })
    }), { name: 'blobState' })
)
