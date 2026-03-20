import { onMounted } from 'vue'

export function useAdcash(zoneId) {
  onMounted(() => {
    // Wait for aclib to be available
    const initAd = () => {
      if (window.aclib && typeof window.aclib.runAutoTag === 'function') {
        window.aclib.runAutoTag({ zoneId })
      } else {
        // Retry if library not loaded yet
        setTimeout(initAd, 100)
      }
    }
    
    initAd()
  })
}
