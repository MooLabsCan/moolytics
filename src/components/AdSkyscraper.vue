<script setup>
import { ref, onMounted } from 'vue'

const isDesktop = ref(false)
const skyRef = ref(null)

onMounted(() => {
  isDesktop.value = window.innerWidth > 768

  if (isDesktop.value) {
    requestAnimationFrame(() => {
      if (!skyRef.value) return
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.textContent = `aclib.runBanner({ zoneId: '11280930', sub1: 'desktop' });`
      skyRef.value.appendChild(script)
    })
  }
})
</script>

<template>
  <div v-if="isDesktop" ref="skyRef" class="ad-skyscraper"></div>
</template>

<style scoped>
.ad-skyscraper {
  position: fixed;
  top: 60px;
  left: 0;
  width: calc((100vw - 860px) / 2);
  max-width: 200px;
  height: auto;
  z-index: 5;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 1rem;
}
</style>
