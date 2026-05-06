<script setup>
import { ref, onMounted } from 'vue'

const isMobile = ref(false)
const bannerRef = ref(null)

onMounted(() => {
  isMobile.value = window.innerWidth <= 768

  if (isMobile.value) {
    requestAnimationFrame(() => {
      if (!bannerRef.value) return
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.textContent = `aclib.runBanner({ zoneId: '11280866' });`
      bannerRef.value.appendChild(script)
    })
  }
})
</script>

<template>
  <div v-if="isMobile" ref="bannerRef" class="ad-banner"></div>
</template>

<style scoped>
.ad-banner {
  width: 100%;
  text-align: center;
  margin: 0.5rem 0;
}
</style>
