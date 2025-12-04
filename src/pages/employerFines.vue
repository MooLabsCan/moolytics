<template>
  <article class="prose prose-lg max-w-5xl mx-auto px-6 py-12 lg:py-20">
    <h1 class="text-4xl lg:text-5xl font-bold text-center mb-12 text-gray-900 leading-tight">
      {{ props.lang==='pt' ? 'A Disputa Oculta:' : 'The Hidden Tug-of-War:' }}<br />
      {{ props.lang==='pt' ? 'Como Impostos sobre Folha Moldam o Crescimento Salarial no Mundo' : 'How Payroll Taxes Shape Wage Growth Worldwide' }}
    </h1>

    <p class="lead text-xl text-gray-700 mb-12">
      <span v-if="props.lang==='en'">In the grand theater of global economics, payroll taxes play the role of the unseen puppet master, pulling strings on everything from your paycheck to a nation’s job market. But here’s the twist: whether the tax burden falls heavily on employers or employees can dramatically alter the script. Recent studies reveal a fascinating divide — employer-side taxes often act as a stealthy wage suppressor, while employee-side ones might spark fiercer negotiations. Let’s unpack this economic drama, drawing from cross-country analyses that spotlight the real-world impacts.</span>
      <span v-else>No grande palco da economia global, os impostos sobre a folha atuam como um mestre de marionetes invisível, mexendo com tudo — do seu salário ao mercado de trabalho. Mas há um detalhe: quando o peso cai mais sobre o empregador do que sobre o empregado (ou vice‑versa), o enredo muda. Estudos recentes mostram um contraste nítido — encargos do lado do empregador tendem a conter reajustes salariais, enquanto os do lado do empregado podem estimular barganhas mais duras. Vamos destrinchar essa dinâmica com evidências entre países.</span>
    </p>

    <section class="space-y-10 text-lg leading-relaxed">
      <p>
        <span v-if="props.lang==='en'">Imagine Colombia in the 1990s, where a hike in employer payroll taxes led to a real-life experiment in wage dynamics. According to a landmark <cite>NBER working paper (2007)</cite>, a 10% increase in these taxes shaved off <strong>1.4% to 2.3%</strong> from workers’ wages and slashed formal employment by <strong>4% to 5%</strong> — a stark reminder that what hits the boss’s books often trickles down to the employee’s pocket. This shifting of burdens, economists argue, is more pronounced in rigid labor markets, where minimum wages or unions limit outright job cuts but cap salary hikes.</span>
        <span v-else>Imagine a Colômbia nos anos 1990: um aumento nos encargos patronais virou experimento real em dinâmica salarial. Um <cite>working paper do NBER (2007)</cite> estima que um aumento de 10% nesses encargos reduziu salários em <strong>1,4% a 2,3%</strong> e cortou emprego formal em <strong>4% a 5%</strong>. Em mercados mais rígidos, o repasse ocorre mais por conter reajustes do que por demissões.</span>
      </p>

      <p>
        <span v-if="props.lang==='en'">Zoom out to the OECD’s epic <cite>Taxing Wages</cite> saga, an annual blockbuster comparing 38 countries. In nations like Belgium or France, where employer social security contributions inflate the tax wedge beyond 50%, wage growth crawls at a snail’s pace — lagging <strong>1% to 2%</strong> behind low-tax havens like Chile. The culprit? Employers absorb 70% to 90% of the hit by restraining raises, turning payroll taxes into a silent wage growth assassin. Meanwhile, in employee-heavy setups like Denmark or Sweden, workers feel the pinch directly, often bargaining harder for compensations that keep paychecks buoyant.</span>
        <span v-else>Olhe para o <cite>Taxing Wages</cite> da OCDE, que compara 38 países. Onde a contribuição patronal infla a cunha tributária acima de 50% (como Bélgica e França), o crescimento salarial anda devagar — <strong>1% a 2%</strong> abaixo de países de baixa carga como o Chile. Por quê? Empregadores absorvem 70%–90% do choque contendo reajustes. Já em modelos com maior peso no empregado (Dinamarca, Suécia), o aperto direto incentiva barganha por compensação.</span>
      </p>

      <p>
        <span v-if="props.lang==='en'">Developing economies add spice to the plot. An <cite>IZA World of Labor (2024 update)</cite> paints a vivid picture: slashing employer-side taxes in places like Turkey or Colombia can turbocharge wage growth by <strong>0.25% to 0.5%</strong> per 1% cut, with ripple effects far stronger than tweaking employee contributions. Why? In these markets, heavy employer taxes push firms toward informal hiring, starving formal wage ladders of oxygen.</span>
        <span v-else>Economias em desenvolvimento trazem outro quadro: o <cite>IZA World of Labor (2024)</cite> mostra que reduzir encargos do empregador em países como Turquia ou Colômbia pode turbinar salários em <strong>0,25% a 0,5%</strong> por cada 1 p.p. de corte — efeito mais forte do que mexer no lado do empregado. Encargos pesados empurram empresas à informalidade, sufocando a escada salarial formal.</span>
      </p>

      <p>
        <span v-if="props.lang==='en'">Even in nimble economies like Singapore, a <cite>Journal of Public Economics (2022)</cite> study shows employer tax cuts flow straight to wages without job market hiccups — proving flexibility can blunt the deterrent. But flip to the <cite>Review of Economic Studies (2024)</cite>, and the real magic emerges: when taxes fund clear benefits like pensions, both sides of the payroll equation see full wage shifting. Without that link? Employer taxes become a growth-killer, slowing formal jobs by <strong>1% to 2%</strong> yearly in labor-intensive sectors.</span>
        <span v-else>Mesmo em economias ágeis como Cingapura, estudo no <cite>Journal of Public Economics (2022)</cite> mostra que cortes patronais viram salário sem transtornos no emprego — flexibilidade importa. E o <cite>Review of Economic Studies (2024)</cite> indica: quando a contribuição financia benefícios nítidos, o repasse salarial é completo em ambos os lados; sem esse vínculo, o encargo patronal vira freio de crescimento, reduzindo vagas formais em <strong>1% a 2%</strong> ao ano em setores intensivos em trabalho.</span>
      </p>
    </section>

    <!-- Formula Section -->
    <section class="my-20 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-3xl p-10 lg:p-16">
      <h2 class="text-3xl lg:text-4xl font-bold text-center mb-10 text-indigo-900">
        {{ props.lang==='pt' ? 'A Fórmula da Eficiência de Mercado' : 'The Market-Efficiency Formula' }}
      </h2>
      <p class="text-center text-lg mb-12 max-w-3xl mx-auto">
        <span v-if="props.lang==='en'">Using OECD, NBER, and IZA incidence estimates, we can quantify the annual <strong>wage growth reduction</strong>:</span>
        <span v-else>Usando estimativas de incidência da OCDE, NBER e IZA, podemos quantificar a <strong>redução anual do crescimento salarial</strong>:</span>
      </p>

      <div class="flex justify-center mb-12">
        <div class="bg-white shadow-2xl rounded-2xl p-10 border-4 border-indigo-300">
          <div class="text-4xl lg:text-5xl font-bold text-indigo-800 text-center leading-snug">
            ΔW<sub>g</sub> = − β × (SSC<sub>e</sub> / SSC<sub>t</sub>) × ΔSSC<sub>e</sub>
          </div>
          <dl class="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6 text-gray-700 text-sm lg:text-base">
            <div><strong>ΔW<sub>g</sub></strong>: Annual real wage growth reduction (%)</div>
            <div><strong>β</strong>: Shifting coefficient (0.7–0.9 employer-side, 0.5–0.7 employee-side)</div>
            <div><strong>SSC<sub>e</sub> / SSC<sub>t</sub></strong>: Employer share of total tax wedge</div>
            <div><strong>ΔSSC<sub>e</sub></strong>: Change in employer payroll tax rate (%)</div>
          </dl>
        </div>
      </div>

      <p class="text-center italic text-xl text-gray-800">
        <span v-if="props.lang==='en'"><strong>Example:</strong> France hikes employer SSC by 2% (β = 0.8, employer share = 60%) → <span class="font-bold text-red-600 text-2xl"> −0.96% </span> wage growth per year.</span>
        <span v-else><strong>Exemplo:</strong> A França eleva a contribuição patronal em 2% (β = 0,8; participação do empregador = 60%) → <span class="font-bold text-red-600 text-2xl"> −0,96% </span> de crescimento salarial ao ano.</span>
      </p>
    </section>

    <!-- Interactive Simulator trigger -->
    <section class="my-20">
      <h2 class="text-3xl lg:text-4xl font-bold text-center mb-6 text-gray-900">
        {{ t.simHeader }}
      </h2>
      <p class="text-center text-gray-700 mb-6">{{ t.simDesc }}</p>
      <div class="flex justify-center">
        <button @click="openSimulator" class="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 shadow">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
          {{ t.openSimulator }}
        </button>
      </div>
      <p class="text-center text-sm text-gray-600 mt-4">
        {{ t.sourceCaption }}
      </p>

      <!-- Always-on Chart + Country toggles -->
      <div class="mt-10 grid lg:grid-cols-4 gap-6 items-start">
        <!-- Toggle panel -->
        <aside class="lg:col-span-1 bg-white rounded-2xl border border-gray-200 p-4">
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-lg font-semibold">{{ t.countriesTitle }}</h3>
            <div class="flex items-center gap-2">
              <button class="text-xs px-2 py-1 rounded border" @click="selectAll()">{{ t.all }}</button>
              <button class="text-xs px-2 py-1 rounded border" @click="selectNone()">{{ t.none }}</button>
            </div>
          </div>
          <div class="max-h-64 overflow-auto pr-2 space-y-2">
            <label v-for="c in countries" :key="c.id" class="flex items-center gap-2 text-sm">
              <input type="checkbox" v-model="c.enabled" />
              <span>{{ c.label }}</span>
            </label>
          </div>
        </aside>

        <!-- Chart -->
        <div class="lg:col-span-3 bg-white rounded-2xl border border-gray-200 p-6 lg:p-8">
          <h4 class="text-xl font-semibold mb-6 text-center">{{ t.chartHeader }}</h4>
          <canvas ref="chart"></canvas>
          <p class="text-center text-sm text-gray-500 mt-4">
            {{ t.legendHypo }}
          </p>
        </div>
      </div>
    </section>

    <!-- Modal -->
    <div v-if="showSimulator" class="fixed inset-0 z-50">
      <div class="absolute inset-0 bg-black/50" @click="closeSimulator"></div>
      <div class="relative mx-auto mt-8 mb-8 max-w-5xl bg-white rounded-2xl shadow-2xl p-6 lg:p-8 overflow-y-auto" style="max-height: calc(100vh - 4rem);">
        <div class="flex items-start justify-between mb-4">
          <h3 class="text-2xl font-bold">{{ t.simHeader }}</h3>
          <button @click="closeSimulator" class="text-gray-500 hover:text-gray-700" aria-label="Close simulator">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <!-- Controls -->
        <div class="bg-white rounded-2xl border border-gray-200 p-6 lg:p-8 mb-8">
          <h4 class="text-xl font-semibold mb-6">{{ t.adjustHeader }}</h4>
          <div class="grid md:grid-cols-3 gap-8">
            <div>
              <label class="block font-medium mb-2">
                {{ t.betaLabel }}
              </label>
              <input v-model.number="beta" type="range" min="0.5" max="0.95" step="0.05" class="w-full" />
              <span class="text-sm text-gray-600">{{ beta.toFixed(2) }}</span>
            </div>
            <div>
              <label class="block font-medium mb-2">
                {{ t.employerShareLabel }}
              </label>
              <input v-model.number="employerShare" type="range" min="15" max="75" step="5" class="w-full" />
              <span class="text-sm text-gray-600">{{ employerShare }}%</span>
            </div>
            <div>
              <label class="block font-medium mb-2">
                {{ t.deltaSSCLabel }}
              </label>
              <input v-model.number="deltaSSC" type="range" min="-10" max="10" step="0.5" class="w-full" />
              <span class="text-sm text-gray-600">{{ deltaSSC > 0 ? '+' : ''}}{{ deltaSSC }} pp</span>
            </div>
          </div>

          <!-- Live Result -->
          <div class="mt-10 p-6 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl text-center">
            <p class="text-2xl lg:text-3xl font-bold text-indigo-900">
              {{ t.liveImpactTitle }}
              <span :class="result >= 0 ? 'text-green-600' : 'text-red-600'">
                {{ result > 0 ? '+' : '' }}{{ result.toFixed(2) }}%
              </span>
            </p>
            <p class="mt-2 text-lg">
              {{ result >= 0 ? t.wagesRise : t.wagesFall }}
            </p>
          </div>
        </div>

      </div>
    </div>

    <!-- Closing -->
    <footer class="mt-24 pt-12 border-t-4 border-indigo-200 text-center">
      <p class="text-2xl lg:text-3xl font-medium text-gray-800 leading-relaxed">
        <span v-if="props.lang==='en'">So, what’s the moral of this fiscal fable?<br />
        Payroll taxes aren’t just numbers — they’re forces shaping livelihoods.</span>
        <span v-else>Qual é a moral desta história fiscal?<br />
        Impostos sobre folha não são só números — moldam vidas e empregos.</span>
      </p>
      <p class="mt-8 text-3xl lg:text-4xl font-bold text-gray-900">
        <span v-if="props.lang==='en'">In a world racing for talent, countries leaning on employer burdens<br />
        might be scripting their own wage stagnation thriller.</span>
        <span v-else>Num mundo que disputa talentos, países que sobrecarregam o empregador<br />
        podem estar escrevendo seu próprio roteiro de estagnação salarial.</span>
      </p>
      <p class="mt-6 text-xl text-indigo-700 font-medium">
        <span v-if="props.lang==='en'">As policymakers tweak these levers, the studies whisper a clear message:<br />
        <span class="text-2xl">balance the load, or watch growth slip away.</span></span>
        <span v-else>Enquanto formuladores de políticas ajustam as alavancas, a evidência é clara:<br />
        <span class="text-2xl">equilibre o peso — ou veja o crescimento escapar.</span></span>
      </p>
    </footer>
  </article>
</template>

<script setup>
import { ref, onMounted, computed, onBeforeUnmount, watch, nextTick } from 'vue'
import { Chart } from 'chart.js/auto'
import { wageGrowthReduction } from '../utils/wageGrowth'

// Language and translations
const props = defineProps({ lang: { type: String, default: 'en' } })

const t = computed(() => props.lang === 'pt' ? {
  simHeader: 'Simulador do Impacto dos Impostos sobre Folha',
  simDesc: 'Experimente mudanças nos impostos patronais sobre a folha e veja o impacto no crescimento salarial.',
  openSimulator: 'Abrir simulador interativo',
  sourceCaption: 'Fonte: OECD Taxing Wages 2024, NBER, IZA World of Labor, Review of Economic Studies',
  countriesTitle: 'Países',
  all: 'Todos',
  none: 'Nenhum',
  chartHeader: 'Seu país vs. Mundo real',
  legendHypo: 'Seu país hipotético = estrela roxa',
  betaLabel: 'β – Coeficiente de repasse (0,50 = muito flexível, 0,95 = muito rígido)',
  employerShareLabel: 'Participação do empregador na cunha tributária (%)',
  deltaSSCLabel: 'Variação da contribuição patronal (ΔSSCₑ)',
  liveImpactTitle: 'Impacto anual no crescimento salarial:',
  wagesRise: 'Salários sobem! ',
  wagesFall: 'Salários caem — típico efeito de arrasto do lado do empregador',
  axisX: 'Participação do empregador na cunha tributária (%)',
  axisY: 'Impacto anual no crescimento salarial (%)',
  countriesDataset: 'Países',
  yourCountryDataset: 'Seu País',
  brazilWithLaw: 'Brasil (com Lei 14.784/202)',
  brazilWithoutLaw: 'Brasil (sem Lei 14.784/202)',
  adjustHeader: 'Ajuste o Seu País Hipotético'
} : {
  simHeader: 'Payroll Tax Impact Simulator',
  simDesc: 'Experiment with employer payroll tax changes and see the impact on wage growth.',
  openSimulator: 'Open interactive simulator',
  sourceCaption: 'Source: OECD Taxing Wages 2024, NBER, IZA World of Labor, Review of Economic Studies',
  countriesTitle: 'Countries',
  all: 'All',
  none: 'None',
  chartHeader: 'Your Country vs. Real World',
  legendHypo: 'Your hypothetical country = purple star',
  betaLabel: 'β – Shifting Coefficient (0.50 = very flexible, 0.95 = very rigid)',
  employerShareLabel: 'Employer Share of Tax Wedge (%)',
  deltaSSCLabel: 'Employer Payroll Tax Change (ΔSSCₑ)',
  liveImpactTitle: 'Annual Wage Growth Impact:',
  wagesRise: 'Wages rise!',
  wagesFall: 'Wages fall — classic employer-side drag',
  axisX: 'Employer Share of Tax Wedge (%)',
  axisY: 'Annual Wage Growth Impact (%)',
  countriesDataset: 'Countries',
  yourCountryDataset: 'Your Country',
  brazilWithLaw: 'Brazil (with Law 14.784/202)',
  brazilWithoutLaw: 'Brazil (without Law 14.784/202)',
  adjustHeader: 'Adjust Your Hypothetical Country'
})

// Page metadata
const pageTitle = computed(() => props.lang === 'pt'
  ? 'A Disputa Oculta: Como Impostos sobre Folha Moldam o Crescimento Salarial no Mundo'
  : 'The Hidden Tug-of-War: How Payroll Taxes Shape Wage Growth Worldwide'
)

onMounted(() => { document.title = pageTitle.value })
watch(() => props.lang, () => { document.title = pageTitle.value })

// Share button logic (aligned with other articles)
const fullUrl = computed(() => window.location.origin + window.location.pathname + window.location.hash)
const shareTitle = computed(() => pageTitle.value)
const shareText = computed(() => props.lang === 'pt'
  ? 'Como a incidência de impostos sobre a folha (empregador vs empregado) afeta o crescimento salarial — com evidências da OCDE, NBER e IZA.'
  : 'How employer vs employee payroll tax incidence shapes real wage growth across countries — with OECD, NBER and IZA evidence.'
)

const showShareMenu = ref(false)
const shareMenuEl = ref(null)
function toggleShareMenu() { showShareMenu.value = !showShareMenu.value }
function closeShareMenu() { showShareMenu.value = false }

function onDocumentClick(e) {
  if (!showShareMenu.value) return
  const el = shareMenuEl.value
  if (el && e.target instanceof Node && !el.contains(e.target)) {
    showShareMenu.value = false
  }
}

onMounted(() => document.addEventListener('click', onDocumentClick))
onBeforeUnmount(() => {
  document.removeEventListener('click', onDocumentClick)
  document.removeEventListener('keydown', onKeydown)
  if (myChart) {
    try { myChart.destroy() } catch (e) { /* ignore */ }
    myChart = null
  }
})

async function onShareClick() {
  try {
    if (navigator.share) {
      await navigator.share({ title: shareTitle.value, text: shareText.value, url: fullUrl.value })
      return
    }
  } catch (e) {
    console.warn('Native share failed or was cancelled, falling back to menu:', e)
  }
  showShareMenu.value = true
}

async function copyLink() {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(fullUrl.value)
      alert('Link copied!')
    } else {
      prompt('Copy the link:', fullUrl.value)
    }
  } catch (e) {
    console.error('Clipboard error', e)
    prompt('Copy the link:', fullUrl.value)
  }
}

const encodedUrl = computed(() => encodeURIComponent(fullUrl.value))
const encodedTitle = computed(() => encodeURIComponent(shareTitle.value))
const encodedText = computed(() => encodeURIComponent(shareText.value))

// Interactive simulator state and chart
const beta = ref(0.75) // medium rigidity
const employerShare = ref(50) // average OECD
const deltaSSC = ref(2) // +2 pp increase

const result = computed(() => wageGrowthReduction(beta.value, employerShare.value, deltaSSC.value))

// Modal state for simulator
const showSimulator = ref(false)
function openSimulator() {
  showSimulator.value = true
  document.addEventListener('keydown', onKeydown)
  updateChart()
}
function closeSimulator() {
  showSimulator.value = false
  document.removeEventListener('keydown', onKeydown)
  updateChart()
}

function onKeydown(e) {
  if (e.key === 'Escape' && showSimulator.value) {
    closeSimulator()
  }
}

// Country datasets (merged with enhanced set)
const countries = ref([
  { id: 'chile-low', x: 40, y: -0.30, label: 'Chile (Low Efficiency Drag)', enabled: true },
  { id: 'denmark-2', x: 38, y: -0.46, label: 'Denmark (#2 Efficiency)', enabled: true },
  { id: 'netherlands-3', x: 30, y: -0.38, label: 'Netherlands (#3)', enabled: true },
  { id: 'singapore-4', x: 17, y: -0.42, label: 'Singapore (#4)', enabled: true },
  { id: 'switzerland-1', x: 25, y: -0.35, label: 'Switzerland (#1)', enabled: true },
  { id: 'sweden', x: 45, y: -0.65, label: 'Sweden', enabled: true },
  { id: 'germany', x: 55, y: -0.88, label: 'Germany', enabled: true },
  { id: 'france', x: 60, y: -0.96, label: 'France', enabled: true },
  { id: 'belgium', x: 62, y: -1.15, label: 'Belgium (-1% Growth)', enabled: true },
  { id: 'colombia-1990s', x: 68, y: -1.40, label: 'Colombia (1990s)', enabled: true },
])

function selectAll() { countries.value.forEach(c => c.enabled = true) }
function selectNone() { countries.value.forEach(c => c.enabled = false) }

const filteredCountries = computed(() => countries.value.filter(c => c.enabled).map(c => ({ x: c.x, y: c.y, label: c.label })))

const chart = ref(null)
let myChart = null

const userPoint = computed(() => ({ x: employerShare.value, y: result.value, label: t.value.yourCountryDataset }))

onMounted(async () => {
  await nextTick()
  createChart()
})

// Update chart when inputs or toggles change
watch([beta, employerShare, deltaSSC], () => {
  updateChart()
})
watch(countries, () => updateChart(), { deep: true })
watch(showSimulator, () => updateChart())
watch(() => props.lang, () => updateChart())

function createChart() {
  myChart = new Chart(chart.value, {
    type: 'scatter',
    data: {
      datasets: [
        {
          label: t.value.countriesDataset,
          data: filteredCountries.value,
          backgroundColor: 'rgba(99, 102, 241, 0.7)',
          pointRadius: 8
        },
        {
          label: t.value.yourCountryDataset,
          data: showSimulator.value ? [userPoint.value] : [],
          backgroundColor: '#a855f7',
          pointBackgroundColor: '#a855f7',
          borderColor: '#6d28d9',
          pointBorderColor: '#6d28d9',
          borderWidth: 3,
          pointBorderWidth: 3,
          pointStyle: 'star',
          pointRadius: 20,
          pointHoverRadius: 24,
          order: 1000,
          rotation: 0
        },
        {
          label: t.value.brazilWithLaw,
          data: [{ x: 72, y: -1.10, label: t.value.brazilWithLaw }],
          backgroundColor: 'rgba(34, 197, 94, 0.9)',
          borderColor: 'rgb(22, 163, 74)',
          pointRadius: 12
        },
        {
          label: t.value.brazilWithoutLaw,
          data: [{ x: 72, y: -1.55, label: t.value.brazilWithoutLaw }],
          backgroundColor: 'rgba(239, 68, 68, 0.9)',
          borderColor: 'rgb(220, 38, 38)',
          pointRadius: 12
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        x: { title: { display: true, text: t.value.axisX }, min: 10, max: 80 },
        y: { title: { display: true, text: t.value.axisY }, min: -3, max: 1}
      },
      plugins: {
        tooltip: { callbacks: { label: (ctx) => {
          const raw = ctx.raw || {}
          const lbl = raw.label || 'Obs'
          const y = typeof raw.y === 'number' ? raw.y.toFixed(2) : ''
          return `${lbl}: ${y}%`
        } } },
        legend: { position: 'bottom' }
      }
    }
  })
}

function updateChart() {
  if (!myChart) return
  // Update countries dataset and labels per language
  myChart.data.datasets[0].label = t.value.countriesDataset
  myChart.data.datasets[0].data = filteredCountries.value
  // Update user point only when simulator is open
  myChart.data.datasets[1].label = t.value.yourCountryDataset
  myChart.data.datasets[1].data = showSimulator.value ? [userPoint.value] : []
  // Static Brazil scenario labels per language
  myChart.data.datasets[2].label = t.value.brazilWithLaw
  myChart.data.datasets[2].data = [{ x: 72, y: -1.10, label: t.value.brazilWithLaw }]
  myChart.data.datasets[3].label = t.value.brazilWithoutLaw
  myChart.data.datasets[3].data = [{ x: 72, y: -1.55, label: t.value.brazilWithoutLaw }]
  // Axes titles per language
  myChart.options.scales.x.title.text = t.value.axisX
  myChart.options.scales.y.title.text = t.value.axisY
  myChart.update()
}
</script>

<style scoped>
.prose cite { @apply italic text-indigo-700 font-medium; }
.prose .lead { @apply font-medium text-gray-800; }
</style>