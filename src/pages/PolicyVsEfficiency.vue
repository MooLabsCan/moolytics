<script setup>
import { computed, ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
const props = defineProps({ lang: { type: String, default: 'en' }, id: { type: String, default: 'brazil-estonia' } })

const canonicalUrl = computed(() => {
  return `#/${['article', props.id, props.lang].filter(Boolean).join('/')}`
})

const fullUrl = computed(() => window.location.origin + window.location.pathname + canonicalUrl.value)

// Auto-sum helper for specific tables
const articleRoot = ref(null)

function parseCell(val) {
  if (val == null) return 0
  const s = String(val).trim()
  const m = s.match(/[-+]?\d+/)
  return m ? parseInt(m[0], 10) : 0
}
function formatSigned(n) {
  if (n > 0) return `+${n}`
  return String(n)
}
function computeTableSum(tableEl) {
  try {
    const tbody = tableEl.querySelector('tbody')
    const tfoot = tableEl.querySelector('tfoot')
    if (!tbody || !tfoot) return
    const rows = Array.from(tbody.querySelectorAll('tr'))
    if (!rows.length) return
    // Determine number of columns from the first data row
    const firstTds = Array.from(rows[0].querySelectorAll('td'))
    const colCount = firstTds.length
    if (colCount <= 1) return
    const sums = new Array(colCount - 1).fill(0)
    for (const tr of rows) {
      const tds = Array.from(tr.querySelectorAll('td'))
      for (let i = 1; i < tds.length; i++) {
        sums[i - 1] += parseCell(tds[i].textContent)
      }
    }
    const totalRow = tfoot.querySelector('tr') || document.createElement('tr')
    let cells = Array.from(totalRow.querySelectorAll('td'))
    // Ensure we have the correct number of cells
    const needed = colCount
    while (cells.length < needed) {
      const td = document.createElement('td')
      totalRow.appendChild(td)
      cells.push(td)
    }
    // Label cell
    const label = tableEl.getAttribute('data-total-label') || 'Net Indices'
    cells[0].innerHTML = `<strong>${label}</strong>`
    // Mark total row for styling
    totalRow.classList.add('net-total-row')
    // Write totals with sign-based classes
    for (let i = 0; i < sums.length; i++) {
      const td = cells[i + 1]
      td.textContent = formatSigned(sums[i])
      td.classList.remove('pos', 'neg', 'zero')
      if (sums[i] > 0) td.classList.add('pos')
      else if (sums[i] < 0) td.classList.add('neg')
      else td.classList.add('zero')
    }
    if (!tfoot.contains(totalRow)) tfoot.appendChild(totalRow)
  } catch (e) {
    console.warn('Auto-sum failed:', e)
  }
}
function computeAllSums() {
  const root = articleRoot.value
  if (!root) return
  const tables = root.querySelectorAll('table.auto-sum')
  tables.forEach(t => computeTableSum(t))
}

onMounted(async () => {
  // existing onMounted for share menu click is below; we also compute sums after mount
  await nextTick()
  computeAllSums()
})

watch(() => props.lang, async () => {
  // Recompute after language toggle (DOM changes)
  await nextTick()
  computeAllSums()
})

const shareTitle = computed(() => props.lang === 'pt' ? 'Brasil vs Estônia - Tributação de Dividendos' : 'Brazil vs Estonia - Dividend Taxation')
const shareText = computed(() => props.lang === 'pt' ? 'Análise sobre modelos de tributação de dividendos no Brasil e na Estônia.' : 'Analysis of dividend taxation models in Brazil and Estonia.')

const showShareMenu = ref(false)
const shareMenuEl = ref(null)

function toggleShareMenu() { showShareMenu.value = !showShareMenu.value }
function closeShareMenu() { showShareMenu.value = false }

function onDocumentClick(e) {
  if (!showShareMenu.value) return
  const el = shareMenuEl.value
  if (el && !el.contains(e.target)) {
    showShareMenu.value = false
  }
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
    // If user cancels native share, do nothing; otherwise fall through to menu
    console.warn('Native share failed or was cancelled, falling back to menu:', e)
  }
  // Fallback: open the menu
  showShareMenu.value = true
}

async function copyLink() {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(fullUrl.value)
      alert(props.lang === 'pt' ? 'Link copiado!' : 'Link copied!')
    } else {
      // Last resort
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

// Publication date (today), localized per language
const today = new Date()
const isoDate = today.toISOString().split('T')[0]
const formattedDate = computed(() => {
  const locale = props.lang === 'pt' ? 'pt-BR' : 'en-US'
  const fmt = new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'long', day: 'numeric' })
  return fmt.format(today)
})
</script>

<template>
  <article class="article" ref="articleRoot">
    <header style="display:flex;align-items:center;justify-content:space-between;gap:1rem; margin-bottom:0.75rem;">
    </header>
  <template v-if="props.lang === 'en'">
       <div>
        <h1>Policy vs Efficiency: a scoreboard of incentives</h1>
        <p>
          Evaluation of policy by administration and their microeconomic effect on market efficiency, social mobility, job creation, and wage growth.
          Market efficiency is good because it channels capital and talent toward their most productive uses, lowers prices through competition, and speeds up innovation —
          ultimately raising real wages and living standards.
        </p>
        <p class="table-legend">
          Reading the tables: each law is scored by its expected incentive effect. Positive numbers support efficient allocation and opportunity; negatives introduce frictions or misaligned incentives.
        </p>
        <h2 style="margin-top:1rem">Administration 2019–2022</h2>
         <table class="auto-sum policy-table">
           <thead>
           <tr>
             <th>Law</th>
             <th>Market Efficiency</th>
             <th>Social Mobility</th>
             <th>Job Creation</th>
             <th>Wage Growth</th>
           </tr>
           </thead>
           <tbody>
           <tr>
             <td>Emenda Constitucional nº 103/2019 (Pension Reform)</td>
             <td>+1</td>
             <td>-1</td>
             <td>+1</td>
             <td>0</td>
           </tr>
           <tr>
             <td>Lei nº 13.874/2019 (Economic Freedom Law)</td>
             <td>+2</td>
             <td>+1</td>
             <td>+1</td>
             <td>+1</td>
           </tr>
           <tr>
             <td>Lei nº 13.964/2019 (Pacote Anticrime)</td>
             <td>+1</td>
             <td>+1</td>
             <td>0</td>
             <td>0</td>
           </tr>
           <tr>
             <td>Lei nº 14.026/2020 (Sanitation Framework)</td>
             <td>+1</td>
             <td>+1</td>
             <td>+1</td>
             <td>0</td>
           </tr>
           <tr>
             <td>Lei Complementar nº 179/2021 (Central Bank Independence)</td>
             <td>+1</td>
             <td>0</td>
             <td>0</td>
             <td>0</td>
           </tr>
           <tr>
             <td>Lei nº 14.133/2021 (Public Procurement Law)</td>
             <td>+2</td>
             <td>+1</td>
             <td>+1</td>
             <td>0</td>
           </tr>
           <tr>
             <td>Lei nº 14.195/2021 (Business Environment Law)</td>
             <td>+2</td>
             <td>+1</td>
             <td>+1</td>
             <td>+1</td>
           </tr>
           <tr>
             <td>Lei nº 14.182/2021 (Eletrobras Privatization)</td>
             <td>+1</td>
             <td>0</td>
             <td>+1</td>
             <td>0</td>
           </tr>
           <tr>
             <td>Lei nº 14.273/2021 (Railways Framework)</td>
             <td>+1</td>
             <td>+1</td>
             <td>+2</td>
             <td>+1</td>
           </tr>
           <tr>
             <td>Lei nº 14.300/2022 (Distributed Generation Framework)</td>
             <td>+1</td>
             <td>+1</td>
             <td>+1</td>
             <td>0</td>
           </tr>
           <tr>
             <td>Lei nº 14.301/2022 (BR do Mar)</td>
             <td>+1</td>
             <td>+1</td>
             <td>+1</td>
             <td>+1</td>
           </tr>
           <tr>
             <td>CVM Resolution No. 30/2021 (Qualified Investor Certification Rules)</td>
             <td>+2</td>
             <td>+2</td>
             <td>+1</td>
             <td>+1</td>
           </tr>
           </tbody>
           <tfoot>
           <tr>
             <td><strong>Net Indices</strong></td>
             <td>+15</td>
             <td>+10</td>
             <td>+11</td>
             <td>+5</td>
           </tr>
           </tfoot>
         </table>
      </div>
  <h2 style="margin-top:1.25rem">Administration 2023–2025</h2>
  <table class="auto-sum policy-table">
    <thead>
    <tr>
      <th>Law</th>
      <th>Market Efficiency</th>
      <th>Social Mobility</th>
      <th>Job Creation</th>
      <th>Wage Growth</th>
    </tr>
    </thead>
    <tbody>
    <tr>
      <td>Emenda Constitucional nº 132/2023 (Tax Reform on Consumption)</td>
      <td>+2</td>
      <td>+1</td>
      <td>+1</td>
      <td>+1</td>
    </tr>
    <tr>
      <td>Lei Complementar nº 200/2023 (Fiscal Framework)</td>
      <td>+1</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
    </tr>
    <tr>
      <td>Lei nº 14.611/2023 (Equal Pay Law)</td>
      <td>-1</td>
      <td>+1</td>
      <td>0</td>
      <td>+1</td>
    </tr>
    <tr>
      <td>Lei nº 14.790/2023 (Sports Betting Regulation)</td>
      <td>+1</td>
      <td>+1</td>
      <td>+2</td>
      <td>+1</td>
    </tr>
    <tr>
      <td>Lei nº 14.754/2023 (Offshore Taxes)</td>
      <td>-1</td>
      <td>-1</td>
      <td>0</td>
      <td>-1</td>
    </tr>
    <tr>
      <td>Lei nº 14.901/2024 (Combustível do Futuro)</td>
      <td>+1</td>
      <td>+1</td>
      <td>+1</td>
      <td>+1</td>
    </tr>
    <tr>
      <td>Lei Complementar nº 214/2025 (Tax Reform Regulation)</td>
      <td>+1</td>
      <td>+1</td>
      <td>+1</td>
      <td>+1</td>
    </tr>
    <tr>
      <td>Lei nº 15.270/2025 (Personal Income Tax Reform)</td>
      <td>+1</td>
      <td>+1</td>
      <td>+1</td>
      <td>+1</td>
    </tr>
    <tr>
      <td>Lei 14.701/2023 (Reduction in Environmental Ministry Powers)</td>
      <td>+1</td>
      <td>-1</td>
      <td>-1</td>
      <td>0</td>
    </tr>
    <tr>
      <td>Lei 14.701/2023 (Minimum wage hike)</td>
      <td>-1</td>
      <td>0</td>
      <td>-1</td>
      <td>+1</td>
    </tr>
    <tr>
      <td>Payroll Tax Reintroduction (Lei nº 14.973/2024)</td>
      <td>-1</td>
      <td>-1</td>
      <td>-2</td>
      <td>-2</td>
    </tr>
    <tr>
      <td>High SELIC Rates (Debt-Financed Spending Policy)</td>
      <td>-2</td>
      <td>-1</td>
      <td>-2</td>
      <td>-1</td>
    </tr>
    <tr>
      <td>Tourism ban (friction to high income tourist)</td>
      <td>-1</td>
      <td>-1</td>
      <td>-1</td>
      <td>-1</td>
    </tr>
    </tbody>
    <tfoot>
    <tr>
      <td><strong>Net Indices</strong></td>
      <td>+5</td>
      <td>+8</td>
      <td>+5</td>
      <td>+2</td>
    </tr>
    </tfoot>
  </table>
</template>

    <template v-else>
      <div>
        <h1>Política vs Eficiência: um placar de incentivos</h1>
        <p>
          Avaliação de políticas por administração e seu efeito microeconômico sobre eficiência de mercado, mobilidade social, criação de empregos e crescimento salarial.
          A eficiência de mercado é benéfica porque direciona capital e talento para usos mais produtivos, reduz preços via competição e acelera a inovação — elevando salários reais e padrão de vida.
        </p>
        <p class="table-legend">
          Como ler as tabelas: cada lei recebe uma pontuação pelo efeito esperado de incentivos. Valores positivos favorecem alocação eficiente e oportunidade; negativos introduzem fricções ou incentivos desalinhados.
        </p>
        <h2 style="margin-top:1rem">Administração 2019–2022</h2>
        <table class="auto-sum policy-table" data-total-label="Índices Líquidos">
          <thead>
          <tr>
            <th>Lei</th>
            <th>Eficiência de Mercado</th>
            <th>Mobilidade Social</th>
            <th>Criação de Empregos</th>
            <th>Crescimento Salarial</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>Emenda Constitucional nº 103/2019 (Reforma da Previdência)</td>
            <td>+1</td>
            <td>-1</td>
            <td>+1</td>
            <td>0</td>
          </tr>
          <tr>
            <td>Lei nº 13.874/2019 (Lei da Liberdade Econômica)</td>
            <td>+2</td>
            <td>+1</td>
            <td>+1</td>
            <td>+1</td>
          </tr>
          <tr>
            <td>Lei nº 13.964/2019 (Pacote Anticrime)</td>
            <td>+1</td>
            <td>+1</td>
            <td>0</td>
            <td>0</td>
          </tr>
          <tr>
            <td>Lei nº 14.026/2020 (Marco do Saneamento)</td>
            <td>+1</td>
            <td>+1</td>
            <td>+1</td>
            <td>0</td>
          </tr>
          <tr>
            <td>Lei Complementar nº 179/2021 (Independência do Banco Central)</td>
            <td>+1</td>
            <td>0</td>
            <td>0</td>
            <td>0</td>
          </tr>
          <tr>
            <td>Lei nº 14.133/2021 (Nova Lei de Licitações)</td>
            <td>+2</td>
            <td>+1</td>
            <td>+1</td>
            <td>0</td>
          </tr>
          <tr>
            <td>Lei nº 14.195/2021 (Melhoria do Ambiente de Negócios)</td>
            <td>+2</td>
            <td>+1</td>
            <td>+1</td>
            <td>+1</td>
          </tr>
          <tr>
            <td>Lei nº 14.182/2021 (Privatização da Eletrobras)</td>
            <td>+1</td>
            <td>0</td>
            <td>+1</td>
            <td>0</td>
          </tr>
          <tr>
            <td>Lei nº 14.273/2021 (Marco das Ferrovias)</td>
            <td>+1</td>
            <td>+1</td>
            <td>+2</td>
            <td>+1</td>
          </tr>
          <tr>
            <td>Lei nº 14.300/2022 (Marco da Geração Distribuída)</td>
            <td>+1</td>
            <td>+1</td>
            <td>+1</td>
            <td>0</td>
          </tr>
          <tr>
            <td>Lei nº 14.301/2022 (BR do Mar)</td>
            <td>+1</td>
            <td>+1</td>
            <td>+1</td>
            <td>+1</td>
          </tr>
          <tr>
            <td>Resolução CVM nº 30/2021 (Regras de Certificação de Investidor Qualificado)</td>
            <td>+2</td>
            <td>+2</td>
            <td>+1</td>
            <td>+1</td>
          </tr>
          </tbody>
          <tfoot>
          <tr>
            <td><strong>Índices Líquidos</strong></td>
            <td>0</td>
            <td>0</td>
            <td>0</td>
            <td>0</td>
          </tr>
          </tfoot>
        </table>
      </div>
      <h2 style="margin-top:1.25rem">Administração 2023–2025</h2>
      <table class="auto-sum policy-table" data-total-label="Índices Líquidos">
        <thead>
        <tr>
          <th>Lei</th>
          <th>Eficiência de Mercado</th>
          <th>Mobilidade Social</th>
          <th>Criação de Empregos</th>
          <th>Crescimento Salarial</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td>Emenda Constitucional nº 132/2023 (Reforma Tributária sobre Consumo)</td>
          <td>+2</td>
          <td>+1</td>
          <td>+1</td>
          <td>+1</td>
        </tr>
        <tr>
          <td>Lei Complementar nº 200/2023 (Novo Arcabouço Fiscal)</td>
          <td>+1</td>
          <td>0</td>
          <td>0</td>
          <td>0</td>
        </tr>
        <tr>
          <td>Lei nº 14.611/2023 (Lei da Igualdade Salarial)</td>
          <td>-1</td>
          <td>+1</td>
          <td>0</td>
          <td>+1</td>
        </tr>
        <tr>
          <td>Lei nº 14.790/2023 (Regulamentação das Apostas Esportivas)</td>
          <td>+1</td>
          <td>+1</td>
          <td>+2</td>
          <td>+1</td>
        </tr>
        <tr>
          <td>Lei nº 14.754/2023 (Tributação de Offshores)</td>
          <td>-1</td>
          <td>-1</td>
          <td>0</td>
          <td>-1</td>
        </tr>
        <tr>
          <td>Lei nº 14.901/2024 (Combustível do Futuro)</td>
          <td>+1</td>
          <td>+1</td>
          <td>+1</td>
          <td>+1</td>
        </tr>
        <tr>
          <td>Lei Complementar nº 214/2025 (Regulamentação da Reforma Tributária)</td>
          <td>+1</td>
          <td>+1</td>
          <td>+1</td>
          <td>+1</td>
        </tr>
        <tr>
          <td>Lei nº 15.270/2025 (Reforma do Imposto de Renda da Pessoa Física)</td>
          <td>+1</td>
          <td>+1</td>
          <td>+1</td>
          <td>+1</td>
        </tr>
        <tr>
          <td>Lei 14.701/2023 (Redução de Poderes do Ministério do Meio Ambiente)</td>
          <td>+1</td>
          <td>-1</td>
          <td>-1</td>
          <td>0</td>
        </tr>
        <tr>
          <td>Lei 14.701/2023 (Aumento do salário mínimo)</td>
          <td>-1</td>
          <td>0</td>
          <td>-1</td>
          <td>+1</td>
        </tr>
        <tr>
          <td>Reintrodução de Imposto sobre Folha (Lei nº 14.973/2024)</td>
          <td>-1</td>
          <td>-1</td>
          <td>-2</td>
          <td>-2</td>
        </tr>
        <tr>
          <td>Taxa SELIC Elevada (Política de Gastos Financiados por Dívida)</td>
          <td>-2</td>
          <td>-1</td>
          <td>-2</td>
          <td>-1</td>
        </tr>
        <tr>
          <td>Proibições ao turismo (fricções a turistas de alta renda)</td>
          <td>-1</td>
          <td>-1</td>
          <td>-1</td>
          <td>-1</td>
        </tr>
        </tbody>
        <tfoot>
        <tr>
          <td><strong>Índices Líquidos</strong></td>
          <td>0</td>
          <td>0</td>
          <td>0</td>
          <td>0</td>
        </tr>
        </tfoot>
      </table>
    </template>
  </article>
</template>

<style scoped>
.article table { border-collapse: collapse; width: 100%; }
.article th, .article td { border: 1px solid var(--color-border); padding: 0.6rem 0.7rem; text-align: left; }

/* Policy table aesthetic enhancements */
.policy-table {
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  overflow: hidden; /* to apply rounded corners to header/body */
  box-shadow: 0 4px 18px rgba(0,0,0,0.06);
}
.policy-table thead th {
  background: linear-gradient(0deg, var(--color-background-soft), var(--color-background-soft));
  color: inherit;
  font-weight: 700;
}
.policy-table tbody tr:nth-child(odd) { background: rgba(0,0,0,0.02); }
.policy-table tbody tr:hover { background: rgba(0,0,0,0.04); }
.policy-table tfoot td { background: var(--color-background-soft); }

/* Legend paragraph */
.table-legend {
  font-size: 0.95rem;
  color: var(--vt-c-text-light-2);
  margin: 0.25rem 0 0.75rem;
}

/* Highlight totals row */
.article tfoot tr.net-total-row { background: #f5fbf6; font-weight: 700; }
.article tfoot tr.net-total-row td.pos { color: #188038; }
.article tfoot tr.net-total-row td.neg { color: #d93025; }
.article tfoot tr.net-total-row td.zero { color: inherit; }
.share-menu {
  position: absolute;
  right: 0;
  top: calc(100% + 6px);
  min-width: 180px;
  border: 1px solid var(--color-border);
  background: var(--color-background);
  border-radius: 8px;
  box-shadow: 0 6px 24px rgba(0,0,0,0.08);
  padding: 0.25rem;
  z-index: 20;
}
.share-item {
  display: block;
  width: 100%;
  text-align: left;
  padding: 0.5rem 0.6rem;
  background: transparent;
  border: none;
  color: inherit;
  text-decoration: none;
  cursor: pointer;
  border-radius: 6px;
}
.share-item:hover { background: var(--color-background-soft); }
</style>


<style scoped>
.image-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  margin: 0.5rem 0 1.5rem;
}
@media (min-width: 640px) {
  .image-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (min-width: 960px) {
  .image-grid { grid-template-columns: repeat(3, 1fr); }
}
.image-card {
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.06);
  display: flex;
  flex-direction: column;
}
.image-card img {
  display: block;
  width: 100%;
  height: auto;
  object-fit: contain;
  background: var(--color-background);
  margin: 0;
}
.image-card figcaption {
  padding: 0.5rem 0.75rem;
  border-top: 1px solid var(--color-border);
  font-size: 0.85rem;
  color: var(--vt-c-text-light-2);
}
</style>
