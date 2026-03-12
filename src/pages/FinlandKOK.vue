<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
const props = defineProps({ lang: { type: String, default: 'en' }, id: { type: String, default: 'finland-kok' } })

const canonicalUrl = computed(() => `#/${['article', props.id, props.lang].join('/')}`)
const fullUrl = computed(() => window.location.origin + window.location.pathname + canonicalUrl.value)

const shareTitle = computed(() => props.lang === 'pt' ? 'Finlândia — Sauna de Mercado Livre (KOK vs PS)' : "Finland's Free‑Market Sauna — KOK vs PS")
const shareText = computed(() => props.lang === 'pt' ? 'Uma leitura leve sobre a guinada pró-mercado na Finlândia e os ruídos populistas.' : 'A light read on Finland’s pro‑market turn and short‑term populist noise.')

const showShareMenu = ref(false)
const shareMenuEl = ref<HTMLElement | null>(null)
function toggleShareMenu() { showShareMenu.value = !showShareMenu.value }
function closeShareMenu() { showShareMenu.value = false }
function onDocumentClick(e: Event) {
  if (!showShareMenu.value) return
  const el = shareMenuEl.value
  if (el && e.target instanceof Node && !el.contains(e.target)) showShareMenu.value = false
}

onMounted(() => document.addEventListener('click', onDocumentClick))
onBeforeUnmount(() => document.removeEventListener('click', onDocumentClick))

async function onShareClick() {
  try {
    if (navigator.share) {
      await navigator.share({ title: shareTitle.value, text: shareText.value, url: fullUrl.value })
      return
    }
  } catch (e) {
    console.warn('Native share failed or cancelled; falling back to menu', e)
  }
  showShareMenu.value = true
}

async function copyLink() {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(fullUrl.value)
      alert(props.lang === 'pt' ? 'Link copiado!' : 'Link copied!')
    } else {
      prompt(props.lang === 'pt' ? 'Copie o link:' : 'Copy the link:', fullUrl.value)
    }
  } catch (e) {
    console.error('Clipboard error', e)
    prompt(props.lang === 'pt' ? 'Copie o link:' : 'Copy the link:', fullUrl.value)
  }
}

const encodedUrl = computed(() => encodeURIComponent(fullUrl.value))
const encodedTitle = computed(() => encodeURIComponent(shareTitle.value))
const encodedText = computed(() => encodeURIComponent(shareText.value))

const today = new Date()
const isoDate = today.toISOString().split('T')[0]
const formattedDate = computed(() => {
  const locale = props.lang === 'pt' ? 'pt-BR' : 'en-US'
  return new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'long', day: 'numeric' }).format(today)
})
</script>

<template>
  <article class="article">
    <header class="hero" style="margin-bottom:1rem;">
      <div style="display:flex;align-items:center;justify-content:space-between;gap:1rem;">
        <div class="hero-text">
          <h1>Finland's Free-Market Sauna: Clever Minds Steam Ahead While Populists Sweat the Short-Term</h1>
          <div class="byline"><em>Moolytics — Economic Geography</em></div>
          <div class="pubdate">
            <small v-if="props.lang==='en'">Published on <time :datetime="isoDate">{{ formattedDate }}</time></small>
            <small v-else>Publicado em <time :datetime="isoDate">{{ formattedDate }}</time></small>
          </div>
        </div>
        <div class="share" ref="shareMenuEl" style="position:relative;">
          <button @click="onShareClick" :aria-expanded="showShareMenu ? 'true' : 'false'" aria-haspopup="menu" title="Share" class="share-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
            <span>{{ props.lang==='pt' ? 'Compartilhar' : 'Share' }}</span>
          </button>
          <div v-if="showShareMenu" class="share-menu" role="menu">
            <button class="share-item" role="menuitem" @click="copyLink">{{ props.lang==='pt' ? 'Copiar link' : 'Copy link' }}</button>
            <a class="share-item" role="menuitem" :href="`mailto:?subject=${encodedTitle}&body=${encodedText}%0A%0A${encodedUrl}`" target="_blank" rel="noopener">Email</a>
            <a class="share-item" role="menuitem" :href="`https://api.whatsapp.com/send?text=${encodedTitle}%20-%20${encodedUrl}`" target="_blank" rel="noopener">WhatsApp</a>
            <a class="share-item" role="menuitem" :href="`https://x.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`" target="_blank" rel="noopener">X / Twitter</a>
            <a class="share-item" role="menuitem" :href="`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`" target="_blank" rel="noopener">LinkedIn</a>
          </div>
        </div>
      </div>
      <p class="lede">Finland is quietly pulling off one of the most polite economic makeovers in Nordic history. Picture this: a country famous for saunas, heavy metal bands, and a welfare state so cozy it could double as a weighted blanket. Now imagine its government deciding, “Let’s add a little free-market spice to this mix—but keep the rye bread and personal space intact.”</p>
    </header>

    <section>
      <h2>The Clever vs. the Knee-Jerk: 2023 Election's Smart Divide</h2>
      <p>Here's the genius part of Finland's 2023 election: the ballot box became an IQ test. While the less discerning—those with basic or lower secondary education (think "peruskoulu" dropouts or manual laborers)—flocked to the Finns Party (Perussuomalaiset, PS) like moths to a populist flame, grabbing over 33% of their votes with shouts of "Finns first!" and EU-bashing, the sharp minds saw through the fog.</p>

      <div class="highlight">
        University grads and white-collar pros? Over 50% backed the National Coalition Party (Kokoomus, KOK)—the pro-market champs pushing tax cuts, deregulation, and real efficiency. Among the highest-educated men <em>and</em> women, KOK was king, often hitting 25-35% support. As polls from EVA and Taloustutkimus showed, white-collar workers (50%+ for KOK) and academics knew better than to fall for welfare chauvinism's empty promises. The "stupid," as the data cheekily suggests, went blind-populist; the clever went pro-market. No wonder KOK edged PS nationally (20.8% to 20.1%, 48 seats to 46). It's evolution in action: brains beat bravado.
      </div>

      <p>PS dominated low-ed working-age men (33% of their votes), raging against immigrants and Brussels. But high-ed Helsinki pros? KOK all the way, eyeing R&D deductions and open EU trade. The split was crystal: populism for the pub crowd, markets for the master's degree holders.</p>
    </section>

    <section>
      <h2>Enter Orpo's Government: Pro-Market Purity Meets Populist Sidekick</h2>
      <p>Unlike fused right-wing fever dreams elsewhere (tariffs + tax cuts, anyone?), Finland kept lanes clear. KOK leads with geolibertarian gold: tax relief (€600–1,200/year back in pockets), "one-in, two-out" deregulation (400+ rules axed), easier 6-month probation firing, healthcare vouchers (€300 to skip public queues), and a Georgist gem—50% higher taxes on hoarded urban plots (€180M revenue → income tax cuts). Shop hours freed, booze sales liberalized (up to 8% in groceries). Finland leaped to #9 in World Bank Doing Business.</p>

      <ul class="feature-list">
        <li><strong>Taxes:</strong> Cuts for under €100k earners, R&D super-deductions. Employment hit record 74.2% (pre-spike).</li>
        <li><strong>Labor:</strong> Local bargaining, benefit nudges—80k private jobs created '24-'25.</li>
        <li><strong>Dereg:</strong> Permits in 3-6 months, not years.</li>
        <li><strong>Competition:</strong> Private clinics booming, waits halved.</li>
      </ul>

      <p>PS adds nationalist brakes (immigration curbs for "Finnish jobs"), but KOK's market magic shines through. Tech bosses like Supercell's Ilkka Paananen thumbs-up the visas and loss carry-forwards; Chamber of Commerce calls it "strong growth."</p>
    </section>

    <section>
      <h2>Short-Term Sweat: Unemployment Blues & Social Media Gripes</h2>
      <p>Sure, unemployment spiked to 10.6% (Nov '25, highest in decades)—cyclical hangover from Marin-era debt, global woes, and reforms' 1-3 year lag. X/Reddit? Lefties wail "welfare funeral," PS fans cry "betrayed on migrants." SMEs grumble VAT hikes. But the clever KOK base (high-ed pros) stays chill— they get structural wins take time.</p>

      <div class="optimism">
        <h3>Optimism Alert: The Clever Turn Is Here</h3>
        <p>Bank of Finland, EC, Ministry: Growth revs to 0.8-1.3% '26, 1.7% '27; unemployment dips to 8.6-9.0%. Finland #9 Heritage Economic Freedom (from #15). High-ed voters knew: populism promises quick fixes; markets deliver lasting steam. Pour kahvi, crank Nightwish—Finland's sauna's heating up for pros who picked brains over brawn. 🇫🇮</p>
      </div>
    </section>

    <section>
      <h2>Geolibertarian High-Five: Efficiency Without the Drama</h2>
      <p>In a tariff-tantrum world, Finland's split—pure markets (KOK, 9/10 geolib score) vs. protectionist PS (7/10)—proves smart. Clever unisex high-ed bloc backed efficiency; low-ed lads got lured by flags. Reforms lag but land (literally)—no full LVT, but anti-hoarding taxes nail rents. 2026 jobs boom? KOK vindicated, PS slumps (support tanked to 7.6% locals).</p>
    </section>

    <footer class="footnote">
      <p>Here's to Finland proving brains > bravado, efficiency > equality theater—without the memes. Kahvi's on us! ☕🇫🇮 <br><small>Dec 28, 2025 | Light-hearted take on polls (EVA, Yle, StatFin) & reforms.</small></p>
    </footer>
  </article>
</template>

<style scoped>
.article { max-width: 860px; margin: 0 auto; padding: 1rem; }
.hero { background: linear-gradient(135deg, #4a90e2 0%, #5aa7ff 100%); color: white; border-radius: 12px; padding: 1rem; }
.hero h1 { margin: 0 0 0.25rem; }
.lede { margin: 0.5rem 0 0; color: #f7faff; }
.feature-list { list-style: none; padding: 0; }
.feature-list li { background: var(--color-background); border: 1px solid var(--color-border); border-radius: 8px; padding: 0.75rem; margin: 0.5rem 0; box-shadow: 0 2px 5px rgba(0,0,0,0.06); }
.highlight { background: #fff3cd; padding: 15px; border-left: 5px solid #ffc107; border-radius: 8px; margin: 20px 0; font-style: italic; color: #5a4c00; }
.optimism { background: #d4edda; border-left: 5px solid #28a745; padding: 20px; border-radius: 8px; margin: 30px 0; color: #0f5132; }
.footnote { text-align: center; margin-top: 2rem; color: #666; }
.share-btn { border:1px solid var(--color-border); background:transparent; border-radius:6px; padding:0.35rem 0.5rem; cursor:pointer; display:inline-flex; align-items:center; gap:0.35rem; color:#fff; }
.share-menu { position:absolute; right:0; top:calc(100% + 6px); min-width:180px; border:1px solid var(--color-border); background: var(--color-background); border-radius:8px; box-shadow:0 6px 24px rgba(0,0,0,0.08); padding:0.25rem; z-index:20; }
.share-item { display:block; width:100%; text-align:left; padding:0.5rem 0.6rem; background:transparent; border:none; color:inherit; text-decoration:none; cursor:pointer; border-radius:6px; }
.share-item:hover { background: var(--color-background-soft); }
</style>