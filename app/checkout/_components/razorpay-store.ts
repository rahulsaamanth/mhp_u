"use client"

import { create } from "zustand"

interface RazorpayState {
  isRazorpayLoaded: boolean
  setIsRazorpayLoaded: (loaded: boolean) => void
}

export const useRazorpayStore = create<RazorpayState>((set) => ({
  isRazorpayLoaded: false,
  setIsRazorpayLoaded: (loaded) => set({ isRazorpayLoaded: loaded }),
}))
