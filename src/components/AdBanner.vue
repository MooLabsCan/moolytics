<script setup>
import { ref, onMounted } from 'vue'

const isMobile = ref(false)
const isDesktop = ref(false)
const bannerRef = ref(null)

onMounted(() => {
  const width = window.innerWidth
  isMobile.value = width <= 768
  isDesktop.value = width > 768

  requestAnimationFrame(() => {
    if (!bannerRef.value) return
    const script = document.createElement('script')
    script.type = 'text/javascript'

    if (isMobile.value) {
      script.textContent = `aclib.runBanner({ zoneId: '11280866' });`
    } else {
      script.textContent = `aclib.runBanner({ zoneId: '11280930', sub1: 'desktop' });`
    }

    bannerRef.value.appendChild(script)
  })
})
</script>

<template>
  <div ref="bannerRef" :class="isMobile ? 'ad-banner' : 'ad-skyscraper'"></div>
</template>

<style scoped>
.ad-banner {
  width: 100%;
  text-align: center;
  margin: 0.5rem 0;
}
.ad-skyscraper {
  width: 100%;
  text-align: center;
  margin: 0.5rem 0;
}
</style>
