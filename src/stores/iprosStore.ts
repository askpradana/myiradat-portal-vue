import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ProcessedIPROSData } from '@/types/ipros'

export const useIPROSStore = defineStore('ipros', () => {
  // State
  const iprosData = ref<ProcessedIPROSData | null>(null)

  // Actions
  const setIPROSData = (data: ProcessedIPROSData) => {
    iprosData.value = data
    // Persist to localStorage
    localStorage.setItem('ipros_data', JSON.stringify(data))
  }

  const clearIPROSData = () => {
    iprosData.value = null
    localStorage.removeItem('ipros_data')
  }

  const initializeIPROSData = () => {
    try {
      const storedData = localStorage.getItem('ipros_data')
      if (storedData) {
        iprosData.value = JSON.parse(storedData)
        return true
      }
    } catch {
      // Invalid stored data, clear it
      localStorage.removeItem('ipros_data')
    }
    return false
  }

  return {
    // State
    iprosData,

    // Actions
    setIPROSData,
    clearIPROSData,
    initializeIPROSData
  }
})