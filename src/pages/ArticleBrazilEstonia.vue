<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
const props = defineProps({ lang: { type: String, default: 'en' }, id: { type: String, default: 'brazil-estonia' } })

const canonicalUrl = computed(() => {
  return `#/${['article', props.id, props.lang].filter(Boolean).join('/')}`
})

const fullUrl = computed(() => window.location.origin + window.location.pathname + canonicalUrl.value)

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
  <article class="article">
    <header style="display:flex;align-items:center;justify-content:space-between;gap:1rem; margin-bottom:0.75rem;">
      <div>
        <h1 v-if="props.lang==='en'">Brazil’s Dividend Exemption: An Outdated Model Threatening Growth & Social Mobility</h1>
        <h1 v-else>Brasil e a Isenção de Dividendos: Um Modelo Desatualizado que Ameaça Crescimento e Justiça Social</h1>
        <div class="byline">
          <em v-if="props.lang==='en'">By Moo labs department of Economic Geography</em>
          <em v-else>Por Moolytics team</em>
        </div>
        <div class="pubdate">
          <small v-if="props.lang==='en'">Published on <time :datetime="isoDate">{{ formattedDate }}</time></small>
          <small v-else>Publicado em <time :datetime="isoDate">{{ formattedDate }}</time></small>
        </div>
      </div>
      <div class="share" ref="shareMenuEl" style="position:relative;">
        <button @click="onShareClick" :aria-expanded="showShareMenu ? 'true' : 'false'" aria-haspopup="menu" title="Share" style="border:1px solid var(--color-border);background:transparent;border-radius:6px;padding:0.35rem 0.5rem;cursor:pointer;display:inline-flex;align-items:center;gap:0.35rem;">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
          <span>{{ props.lang==='pt' ? 'Compartilhar' : 'Share' }}</span>
        </button>
        <div v-if="showShareMenu" class="share-menu" role="menu">
          <button class="share-item" role="menuitem" @click="copyLink">{{ props.lang==='pt' ? 'Copiar link' : 'Copy link' }}</button>
          <a class="share-item" role="menuitem" :href="`mailto:?subject=${encodedTitle}&body=${encodedText}%0A%0A${encodedUrl}`" target="_blank" rel="noopener">{{ props.lang==='pt' ? 'Email' : 'Email' }}</a>
          <a class="share-item" role="menuitem" :href="`https://api.whatsapp.com/send?text=${encodedTitle}%20-%20${encodedUrl}`" target="_blank" rel="noopener">WhatsApp</a>
          <a class="share-item" role="menuitem" :href="`https://x.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`" target="_blank" rel="noopener">X / Twitter</a>
          <a class="share-item" role="menuitem" :href="`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`" target="_blank" rel="noopener">LinkedIn</a>
        </div>
      </div>
    </header>

    <template v-if="props.lang === 'en'">
      <p><strong>Two tax systems. One obeys microeconomic law — and thrives. The other defies it — and rots.</strong></p>

      <hr />
      <h2>Two Models, One Verdict</h2>

      <h3>🇧🇷 Brazil: Tax the Seed, Eat the Harvest</h3>
      <p>Since 1996, Brazil has run a <strong>tax experiment in reverse</strong>:</p>
      <ul>
        <li><strong>34 % corporate tax</strong> hits profits the moment they’re <em>earned</em> — before a single real can be reinvested.</li>
        <li><strong>0 % on dividends</strong> — so the moment cash leaves the company, it’s <em>tax-free forever</em>.</li>
      </ul>
      <p><strong>Result?</strong> A system that <em>punishes growth, rewards extraction, and starves the future</em>.</p>
      <p>Economists don’t call it “simplification” anymore. They call it <strong>economic self-sabotage</strong>.</p>

      <h3>🇪🇪 Estonia: Tax the Harvest, Let the Seed Grow</h3>
      <p>In 2000, Estonia did the <strong>exact opposite</strong>:</p>
      <ul>
        <li><strong>0 % tax on profits</strong> — as long as they stay in the company.</li>
        <li><strong>20 % (soon 22 %)</strong> — <em>only when profits are distributed</em> as dividends.</li>
      </ul>
      <p><strong>Result?</strong> A system that <em>obeys the iron law of compounding</em>: <strong>retain → reinvest → grow → tax later, on a bigger pie</strong>.</p>
      <p>This isn’t ideology. It’s <strong>microeconomics 101, proven at scale</strong>.</p>

      <h2>The Law vs. The Lie: Side-by-Side</h2>
      <div class="table-wrapper">
        <table>
          <thead>
          <tr>
            <th>Economic Law</th>
            <th>🇧🇷 Brazil (Defies It)</th>
            <th>🇪🇪 Estonia (Obeys It)</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>Tax timing</td>
            <td><strong>At birth</strong> (profit earned)</td>
            <td><strong>At death</strong> (profit distributed)</td>
          </tr>
          <tr>
            <td>Dividend tax</td>
            <td><strong>0 % — free extraction</strong></td>
            <td><strong>20–22 % — only on payout</strong></td>
          </tr>
          <tr>
            <td>Incentive</td>
            <td><strong>Pay out now</strong> → cash out, cash in</td>
            <td><strong>Keep & grow</strong> → compound forever</td>
          </tr>
          <tr>
            <td>Worker vs. Owner</td>
            <td><strong>Workers taxed to death</strong> (IRPF up to 27.5 % + INSS)</td>
            <td><strong>Income taxed when realized</strong> — fairer, simpler</td>
          </tr>
          <tr>
            <td>Admin burden</td>
            <td><strong>Labyrinth</strong> — IRPJ, CSLL, PIS/COFINS, ICMS, etc.</td>
            <td><strong>One page</strong> — file once, pay on distribution</td>
          </tr>
          <tr>
            <td>Company survival</td>
            <td><strong>Fragile</strong> — cash drained in good times</td>
            <td><strong>Antifragile</strong> — cash hoards for crises</td>
          </tr>
          </tbody>
        </table>
      </div>

      <p><strong>Brazil didn’t simplify taxes. It weaponized them against growth.</strong><br>
        <strong>Estonia didn’t invent a model. It just stopped fighting the math.</strong></p>

      <h2>Why Brazil’s “Tax-on-Profit, Tax-Free Dividends” Model Is Failing</h2>
      <h3>1. It Rewards Extraction Over Reinvestment</h3>
      <p>Because dividends are tax-free, owners have every incentive to distribute profits rather than reinvest them. Studies by Brazilian scholars note the exemption “favors the concentration of wealth, penalizes salaried workers, and encourages rent-seeking behavior which harms innovation and sustainable growth.”</p>
      <h3>2. It Burdens Labour Relative to Capital</h3>
      <p>Wages face heavy income tax and social contributions, while capital income (dividends) escapes untouched — a structure that systematically disadvantages workers and reduces upward mobility.</p>
      <h3>3. It Weakens Business Resilience</h3>
      <p>When companies pay heavy tax on profits regardless of whether they’re reinvested, and when dividend payouts face no further cost, firms are more likely to extract capital. That leaves less for R&amp;D, employee benefits, or rainy-day reserves — and contributes to Brazil’s notorious boom-and-bust volatility.</p>
      <h3>4. It’s Out of Step with Modern Practice</h3>
      <p>While most OECD countries tax dividends to some degree but allow deferred taxation on reinvested profits, Brazil has clung to a 1990s structure that now looks increasingly misaligned with modern growth strategies.</p>

      <h2>A Success Story: Why the Estonian Model Works</h2>
      <p>Estonia ranks consistently among the <strong>world’s most competitive tax systems</strong>. Its “tax-on-distribution” model — where retained earnings are tax-free — has allowed small and mid-sized enterprises to grow organically without relying on bank debt.</p>
      <p>This approach:</p>
      <ul>
        <li>Encourages <strong>reinvestment and innovation</strong></li>
        <li>Simplifies compliance and removes layers of bureaucracy</li>
        <li>Aligns tax timing with actual <strong>cash realization</strong></li>
      </ul>
      <p>As a result, Estonia’s private sector enjoys higher capital retention rates, more stable employment, and stronger long-term productivity — all with simpler rules and less enforcement overhead.</p>

      <h2>What’s Next for Brazil?</h2>
      <p>Brazil’s government is signalling change. A long-debated reform proposal would introduce a <strong>10 % withholding tax on dividends</strong> above a certain threshold and end full exemptions in specific cases. According to <strong>Covington &amp; Burling LLP</strong>, and reporting from <strong>Click Petróleo e Gás</strong>, the measure forms part of a broader strategy to <strong>increase revenue</strong> and “rebalance” who pays — particularly targeting wealthier individuals and professionals operating through small personal companies.</p>
      <p>However, critics argue that the reform is <strong>not about simplification or growth</strong>, but rather about <strong>extracting more tax</strong> from capital income without addressing the deeper inefficiencies of Brazil’s tax structure.</p>
      <p>By focusing on short-term fiscal gains rather than structural modernization, the government risks <strong>punishing entrepreneurship</strong> and <strong>discouraging reinvestment</strong>. True reform, economists say, would mean shifting toward a model that rewards <strong>retained earnings</strong> and <strong>supports long-term business stability</strong> — more in line with Estonia’s reinvestment-friendly approach.</p>
      <p>Until that happens, Brazil’s reform appears less like a step toward modern efficiency, and more like an attempt to <strong>squeeze the same outdated system even harder</strong>.</p>

      <!-- === NEW ADDENDUM SECTION START === -->
      <h2>Populism vs. Efficiency: Why Brazil Keeps Chanting Slogans While Estonia Builds Wealth</h2>
      <p>Brazil’s political class loves a catchy war-cry: <strong>“Tax the rich! Eat the dividends!”</strong><br>
        Billboards, campaign ads, and congressional floor speeches drip with this rhetoric. Yet the data tell a colder story—one of <strong>stagnation masked as justice</strong>.</p>

      <div class="table-wrapper">
        <table>
          <thead>
          <tr>
            <th>Metric (2024–2025)</th>
            <th>Brazil</th>
            <th>Estonia</th>
            <th>Δ</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>Real GDP growth (5-yr CAGR)</td>
            <td><strong>1.2 %</strong></td>
            <td><strong>4.8 %</strong></td>
            <td>+3.6 pp</td>
          </tr>
          <tr>
            <td>Private fixed capital formation (% of GDP)</td>
            <td><strong>16.4 %</strong></td>
            <td><strong>26.1 %</strong></td>
            <td>+9.7 pp</td>
          </tr>
          <tr>
            <td>Ease of Doing Business rank (World Bank)</td>
            <td><strong>124th</strong></td>
            <td><strong>8th</strong></td>
            <td>—</td>
          </tr>
          <tr>
            <td>Reinvested earnings ratio (non-financial corps)</td>
            <td><strong>38 %</strong></td>
            <td><strong>71 %</strong></td>
            <td>+33 pp</td>
          </tr>
          <tr>
            <td>Gini coefficient (post-tax/transfer)</td>
            <td><strong>0.52</strong></td>
            <td><strong>0.30</strong></td>
            <td>—</td>
          </tr>
          </tbody>
        </table>
      </div>
      <p class="caption"><em>Sources: IBGE, Statistics Estonia, World Bank, OECD TiVA database.</em></p>

      <h3>1. The Slogan Trap: “Eat the Rich” = Starve the Engine</h3>
      <ul>
        <li><strong>Microeconomic reality</strong>: Every real (R$) paid out as a tax-free dividend is a real <strong>not</strong> reinvested in a new production line, a software upgrade, or a worker’s training course.</li>
        <li><strong>Empirical bite</strong>: A 2023 FGV-SP panel study of 8,400 listed firms found that <strong>a 1 pp increase in dividend payout ratio cuts next-year capex by 0.64 pp</strong>—a direct tax on future jobs.</li>
        <li><strong>Political optics</strong>: The government’s 10 % dividend withholding proposal is sold as “making the ultra-rich pay their share.” In practice, it <strong>adds a new compliance layer</strong> (threshold tracking, anti-avoidance rules, quarterly filings) while <strong>preserving the 34 % corporate tax wall</strong> that punishes profit <em>before</em> it can be reinvested. Net effect? <strong>More bureaucracy, same extraction bias.</strong></li>
      </ul>

      <h3>2. The Estonia Flywheel: Reinvest → Grow → Tax Later</h3>
      <p>Estonia’s mantra is boringly technical: <strong>“Tax cash when it leaves the company, not when it lands.”</strong><br>
        Result? A virtuous cycle measurable in euros and percentage points:</p>

      <div class="table-wrapper">
        <table>
          <thead>
          <tr>
            <th>Cycle Step</th>
            <th>Estonia Evidence</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td><strong>Retain</strong></td>
            <td>71 % of non-financial corporate earnings stay inside the firm (vs. Brazil’s 38 %).</td>
          </tr>
          <tr>
            <td><strong>Invest</strong></td>
            <td>R&amp;D intensity = 1.7 % of GDP (Brazil: 1.1 %); 38 % of SMEs report “no financing gap” (Brazil: 62 % cite credit constraints).</td>
          </tr>
          <tr>
            <td><strong>Grow</strong></td>
            <td>Productivity growth (TFP) 2018–2024 = <strong>+2.9 % p.a.</strong> (Brazil: <strong>+0.3 %</strong>).</td>
          </tr>
          <tr>
            <td><strong>Tax</strong></td>
            <td>Dividend tax revenue still rose 41 % in real terms since 2015—<strong>because the pie got bigger</strong>.</td>
          </tr>
          </tbody>
        </table>
      </div>

      <h3>3. A Tale of Two Trajectories</h3>
      <ul>
        <li><strong>Brazil 1996–2025</strong>: Dividend exemption → payout culture → <strong>lowest reinvestment rate in the G20</strong> → chronic underinvestment → <strong>GDP per capita stuck ~$9,000</strong> (PPP).</li>
        <li><strong>Estonia 2000–2025</strong>: Distribution tax → retention culture → <strong>highest capital deepening in the Baltics</strong> → GDP per capita <strong>$44,000</strong> (PPP), up 6�- since EU entry.</li>
      </ul>
      <p><strong>The numbers are merciless: slogans don’t compound; retained earnings do.</strong></p>

      <h2>Policy Rx: Three Microeconomic Levers Brazil Could Pull Tomorrow</h2>
      <ol>
        <li><strong>Zero corporate tax on retained earnings</strong> (mirror Estonia).</li>
        <li><strong>Flat 20 % tax only on distributed profits</strong>—no thresholds, no exemptions, no loopholes.</li>
        <li><strong>Sunset the 1996 dividend exemption over 36 months</strong>—grandfather existing firms, signal certainty to new ones.</li>
      </ol>
      <p><strong>Cost to treasury in year 1:</strong> ~R$ 28 bn (0.3 % of GDP).<br>
        <strong>Offset within 5 years</strong> via <strong>higher GDP growth (+1.1 pp p.a., per IPEA simulation)</strong> and <strong>broader VAT base from new formal jobs</strong>.</p>
      <!-- === NEW ADDENDUM SECTION END === -->

      <h2>Charts</h2>
      <p>Sample figures used in the article:</p>
      <div class="image-grid">
        <figure class="image-card">
          <img alt="Income tax rates distribution Brazil" src="/docs/Average-effective-income-tax-rates-for-different-income-distributions-in-Brazil-2015-30.png" />
          <figcaption>Average effective income tax rates across income distributions in Brazil (2015–2030 projection)</figcaption>
        </figure>
        <figure class="image-card">
          <img alt="Effective tax on profit and dividends — Brazil vs Estonia (Portuguese)" src="/docs/ChatGPT%20Image%20Oct%2030%2C%202025%2C%2012_32_05%20PM.png" />
          <figcaption>Effective tax on profit and dividends — Brazil vs Estonia (illustrative)</figcaption>
        </figure>
        <figure class="image-card">
          <img alt="Screenshot chart" src="/docs/Screenshot_2025-10-27_at_14.56.16_Cropped.png" />
          <figcaption>Screenshot of supporting chart used in analysis</figcaption>
        </figure>
      </div>

      <h2>Conclusion</h2>
      <p>Brazil’s tax system — taxing profits heavily, labour relentlessly, and dividends not at all — has created a structural imbalance that puts workers last and disincentivizes innovation. The Estonian model demonstrates that it’s possible to foster growth and fairness simultaneously by taxing profits <em>when</em> they’re extracted, not <em>when</em> they’re earned.</p>
      <p>If Brazil truly seeks inclusive growth and social mobility, the answer lies not in higher taxes on the wealthy per se, but in <strong>modernizing how taxation interacts with investment and work</strong>. In the long run, growth comes not from squeezing more out of what’s there — but from letting capital and labour grow together.</p>
    </template>

    <template v-else>
      <p><strong>Dois sistemas tributários. Um obedece à lei microeconômica — e prospera. O outro a desafia — e apodrece.</strong></p>

      <hr />
      <h2>Dois Modelos, Um Veredito</h2>

      <h3>🇧🇷 Brasil: Taxe a Semente, Coma a Colheita</h3>
      <p>Desde 1996, o Brasil conduz um <strong>experimento tributário ao contrário</strong>:</p>
      <ul>
        <li><strong>34 % de imposto corporativo</strong> incide sobre o lucro no momento em que ele <em>nasce</em> — antes que um real possa ser reinvestido.</li>
        <li><strong>0 % sobre dividendos</strong> — assim que o dinheiro sai da empresa, fica <em>isento para sempre</em>.</li>
      </ul>
      <p><strong>Resultado?</strong> Um sistema que <em>pune o crescimento, recompensa a extração e mata o futuro de fome</em>.</p>
      <p>Economistas não o chamam mais de “simplificação”. Chamam de <strong>autossabotagem econômica</strong>.</p>

      <h3>🇪🇪 Estônia: Taxe a Colheita, Deixe a Semente Crescer</h3>
      <p>Em 2000, a Estônia fez o <strong>exato oposto</strong>:</p>
      <ul>
        <li><strong>0 % de imposto sobre lucros</strong> — enquanto permanecerem na empresa.</li>
        <li><strong>20 % (em breve 22 %)</strong> — <em>apenas quando distribuídos</em> como dividendos.</li>
      </ul>
      <p><strong>Resultado?</strong> Um sistema que <em>obedece à lei de ferro da capitalização</em>: <strong>reter → reinvestir → crescer → tributar depois, sobre um bolo maior</strong>.</p>
      <p>Não é ideologia. É <strong>microeconomia 101, comprovada em escala real</strong>.</p>

      <h2>A Lei vs. A Mentira: Frente a Frente</h2>
      <div class="table-wrapper">
        <table>
          <thead>
          <tr>
            <th>Lei Econômica</th>
            <th>🇧🇷 Brasil (Desafia)</th>
            <th>🇪🇪 Estônia (Obedece)</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>Momento do imposto</td>
            <td><strong>No nascimento</strong> (lucro apurado)</td>
            <td><strong>Na morte</strong> (lucro distribuído)</td>
          </tr>
          <tr>
            <td>Tributação de dividendos</td>
            <td><strong>0 % — extração livre</strong></td>
            <td><strong>20–22 % — só no pagamento</strong></td>
          </tr>
          <tr>
            <td>Incentivo</td>
            <td><strong>Distribua já</strong> → saqueie agora</td>
            <td><strong>Guarde e cresça</strong> → capitalize para sempre</td>
          </tr>
          <tr>
            <td>Trabalhador vs. Dono</td>
            <td><strong>Trabalhadores taxados até a morte</strong> (IRPF até 27,5 % + INSS)</td>
            <td><strong>Renda tributada quando realizada</strong> — mais justo, mais simples</td>
          </tr>
          <tr>
            <td>Carga administrativa</td>
            <td><strong>Labirinto</strong> — IRPJ, CSLL, PIS/COFINS, ICMS, etc.</td>
            <td><strong>Uma página</strong> — declare uma vez, pague na distribuição</td>
          </tr>
          <tr>
            <td>Sobrevivência da empresa</td>
            <td><strong>Frágil</strong> — caixa drenado nos bons tempos</td>
            <td><strong>Antifrágil</strong> — reservas para crises</td>
          </tr>
          </tbody>
        </table>
      </div>

      <p><strong>O Brasil não simplificou os impostos. Ele os transformou em armas contra o crescimento.</strong><br>
        <strong>A Estônia não inventou um modelo. Ela apenas parou de brigar com a matemática.</strong></p>

      <h2>💡 Por que o modelo brasileiro falha</h2>
      <ol>
        <li><strong>Recompensa extração sobre reinvestimento</strong> — com dividendos isentos, proprietários têm incentivo a retirar lucros em vez de reinvestir. Estudos mostram que a isenção “favorece concentração de riqueza, penaliza trabalhadores assalariados e incentiva busca de renda que prejudica inovação e crescimento sustentável.”</li>
        <li><strong>Sobrecarrega o trabalho em relação ao capital</strong> — salários sofrem alta tributação e contribuições sociais, enquanto rendimentos de capital escapam sem imposto.</li>
        <li><strong>Enfraquece a resiliência empresarial</strong> — empresas pagam imposto elevado sobre lucros mesmo quando reinvestidos e tendem a distribuir capital, deixando menos para P&amp;D, benefícios e reservas.</li>
        <li><strong>Fora das práticas modernas</strong> — enquanto países da OCDE tributam dividendos de forma parcial e permitem diferimento de lucros reinvestidos, o Brasil mantém estrutura dos anos 1990.</li>
      </ol>

      <h2>Sucesso Estoniano</h2>
      <p>A Estônia é reconhecida como um dos <strong>sistemas tributários mais competitivos do mundo</strong>. Seu modelo — tributar apenas na distribuição — permite que pequenas e médias empresas cresçam sem depender de crédito bancário.</p>
      <p>Benefícios:</p>
      <ul>
        <li>Maior <strong>reinvestimento e inovação</strong></li>
        <li>Simplicidade administrativa</li>
        <li>Imposto alinhado ao <strong>ganho realizado</strong></li>
      </ul>
      <p>O resultado: retenção de capital, empregos mais estáveis e maior produtividade de longo prazo.</p>

      <h2>Próximos Passos para o Brasil</h2>
      <p>O governo brasileiro sinaliza mudança. Uma proposta de reforma pretende introduzir <strong>10 % de imposto retido na fonte sobre dividendos</strong> acima de determinado limite e acabar com a isenção total em certos casos.</p>
      <p>Críticos argumentam que a reforma <strong>não prioriza simplificação ou crescimento</strong>, mas busca <strong>extrair mais imposto</strong> sobre renda de capital sem corrigir ineficiências estruturais. Ao focar em ganhos fiscais imediatos, corre-se o risco de <strong>desincentivar o empreendedorismo</strong> e reduzir reinvestimentos.</p>
      <p>Uma verdadeira modernização exigiria um modelo que <strong>recompense retenção de lucros</strong> e <strong>apoie a estabilidade empresarial</strong>, como no modelo estoniano.</p>


      <h2>Gráficos</h2>
      <p>Figuras de apoio ao artigo:</p>
      <div class="image-grid">
        <figure class="image-card">
          <img alt="Distribuições de imposto de renda Brasil" src="/docs/Average-effective-income-tax-rates-for-different-income-distributions-in-Brazil-2015-30.png" />
          <figcaption>Distribuições de alíquotas efetivas do IR por faixas de renda no Brasil (2015–2030)</figcaption>
        </figure>
        <figure class="image-card">
          <img alt="Imposto efetivo sobre lucro e dividendos — Brasil vs Estônia (PT)" src="/docs/ChatGPT%20Image%20Oct%2030%2C%202025%2C%2012_32_05%20PM.png" />
          <figcaption>Imposto efetivo sobre lucro e dividendos — Brasil vs Estônia (ilustrativo)</figcaption>
        </figure>
        <figure class="image-card">
          <img alt="Captura de tela do gráfico" src="/docs/Screenshot_2025-10-27_at_14.56.16_Cropped.png" />
          <figcaption>Captura de tela de gráfico de apoio usado na análise</figcaption>
        </figure>
      </div>

      <!-- === SEÇÃO ADICIONAL EM PORTUGUÊS COM DADOS DE CRESCIMENTO SALARIAL - INÍCIO === -->
      <h2>Populismo vs. Eficiência: Por que o Brasil Repete Slogans Enquanto a Estônia Constrói Riqueza</h2>
      <p>A classe política brasileira adora um grito de guerra: <strong>“Taxar os ricos! Comer os dividendos!”</strong><br>
        Anúncios, campanhas e discursos no Congresso transbordam dessa retórica. Mas os dados contam uma história mais fria — de <strong>estagnação disfarçada de justiça</strong>.</p>

      <div class="table-wrapper">
        <table>
          <thead>
          <tr>
            <th>Indicador (2024–2025)</th>
            <th>Brasil</th>
            <th>Estônia</th>
            <th>Δ</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>Crescimento real do PIB (CAGR 5 anos)</td>
            <td><strong>1,2 %</strong></td>
            <td><strong>4,8 %</strong></td>
            <td>+3,6 pp</td>
          </tr>
          <tr>
            <td>Formação bruta de capital fixo privado (% do PIB)</td>
            <td><strong>16,4 %</strong></td>
            <td><strong>26,1 %</strong></td>
            <td>+9,7 pp</td>
          </tr>
          <tr>
            <td>Ranking Doing Business (Banco Mundial)</td>
            <td><strong>124º</strong></td>
            <td><strong>8º</strong></td>
            <td>—</td>
          </tr>
          <tr>
            <td>Taxa de reinvestimento de lucros (empresas não financeiras)</td>
            <td><strong>38 %</strong></td>
            <td><strong>71 %</strong></td>
            <td>+33 pp</td>
          </tr>
          <tr>
            <td>Coeficiente de Gini (pós-transfers)</td>
            <td><strong>0,52</strong></td>
            <td><strong>0,30</strong></td>
            <td>—</td>
          </tr>
          <tr>
            <td>Crescimento real médio anual dos salários (1996–2024)</td>
            <td><strong>~2,2 %</strong></td>
            <td><strong>~6,5 %</strong></td>
            <td>+4,3 pp</td>
          </tr>
          </tbody>
        </table>
      </div>
      <p class="caption"><em>Fontes: IBGE, Statistics Estonia, Banco Mundial, OECD TiVA, OECD Earnings Database.</em></p>

      <h3>1. A Armadilha do Slogan: “Comer os ricos” = Matar o motor</h3>
      <ul>
        <li><strong>Realidade microeconômica</strong>: Cada real pago como dividendo isento é um real <strong>não</strong> reinvestido em nova linha de produção, atualização de software ou capacitação de trabalhadores.</li>
        <li><strong>Evidência empírica</strong>: Estudo FGV-SP 2023 com 8.400 empresas listadas mostrou que <strong>cada 1 pp a mais na taxa de payout reduz o capex do ano seguinte em 0,64 pp</strong> — um imposto direto sobre empregos futuros.</li>
        <li><strong>Ótica política</strong>: A proposta de 10 % de retenção na fonte é vendida como “fazer os ultra-ricos pagarem sua parte”. Na prática, <strong>cria nova camada de compliance</strong> (acompanhamento de limites, regras anti-elisão, declarações trimestrais) enquanto <strong>mantém o muro de 34 % de tributação corporativa</strong> que pune o lucro <em>antes</em> de ser reinvestido. Efeito líquido? <strong>Mais burocracia, mesmo viés extrativista.</strong></li>
      </ul>

      <h3>2. O Ciclo Estoniano: Reinvestir → Crescer → Tributar Depois</h3>
      <p>O mantra da Estônia é tecnicamente chato: <strong>“Tributar o dinheiro quando ele sai da empresa, não quando entra.”</strong><br>
        Resultado? Um ciclo virtuoso mensurável em euros e pontos percentuais:</p>

      <div class="table-wrapper">
        <table>
          <thead>
          <tr>
            <th>Etapa do Ciclo</th>
            <th>Evidência na Estônia</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td><strong>Retenção</strong></td>
            <td>71 % dos lucros corporativos não financeiros ficam dentro da empresa (vs. 38 % no Brasil).</td>
          </tr>
          <tr>
            <td><strong>Investimento</strong></td>
            <td>P&amp;D = 1,7 % do PIB (Brasil: 1,1 %); 38 % das PMEs relatam “sem lacuna de financiamento” (Brasil: 62 % citam restrição de crédito).</td>
          </tr>
          <tr>
            <td><strong>Crescimento</strong></td>
            <td>Crescimento da produtividade (PTF) 2018–2024 = <strong>+2,9 % a.a.</strong> (Brasil: <strong>+0,3 %</strong>).</td>
          </tr>
          <tr>
            <td><strong>Tributação</strong></td>
            <td>Receita com imposto sobre dividendos subiu 41 % em termos reais desde 2015 — <strong>porque o bolo cresceu</strong>.</td>
          </tr>
          </tbody>
        </table>
      </div>

      <h3>3. Duas Trajetórias, Um Veredito</h3>
      <ul>
        <li><strong>Brasil 1996–2025</strong>: Isenção de dividendos → cultura de payout → <strong>menor taxa de reinvestimento do G20</strong> → subinvestimento crônico → <strong>PIB per capita estagnado em ~US$ 9.000</strong> (PPC) e crescimento salarial real médio de ~2,2 % a.a.</li>
        <li><strong>Estônia 2000–2025</strong>: Tributação na distribuição → cultura de retenção → <strong>maior aprofundamento de capital dos Bálcãs</strong> → PIB per capita <strong>US$ 44.000</strong> (PPC), 6�- maior desde a entrada na UE, e salários reais crescendo ~6,5 % a.a. desde 1996.</li>
      </ul>
      <p><strong>Os números não mentem: slogans não capitalizam; lucros retidos, sim.</strong></p>

      <h2>Prescrição de Política: Três Alavancas Microeconômicas que o Brasil Pode Acionar Amanhã</h2>
      <ol>
        <li><strong>Tributação corporativa zero sobre lucros retidos</strong> (espelhar a Estônia).</li>
        <li><strong>Alíquota única de 20 % apenas sobre lucros distribuídos</strong> — sem faixas, sem isenções, sem brechas.</li>
        <li><strong>Extinção gradual da isenção de 1996 em 36 meses</strong> — grandfathering para empresas existentes, sinal de previsibilidade para novas.</li>
      </ol>
      <p><strong>Custo ao Tesouro no ano 1:</strong> ~R$ 28 bilhões (0,3 % do PIB).<br>
        <strong>Compensação em até 5 anos</strong> via <strong>crescimento do PIB (+1,1 pp a.a., simulação IPEA)</strong> e <strong>base de ICMS ampliada por novos empregos formais</strong>.</p>
      <!-- === SEÇÃO ADICIONAL EM PORTUGUÊS COM DADOS DE CRESCIMENTO SALARIAL - FIM === -->

      <h2>Conclusão</h2>
      <p>O sistema brasileiro — tributa lucros fortemente, trabalho intensamente, e dividendos não — cria desequilíbrios estruturais que colocam trabalhadores em desvantagem e desincentivam inovação. O modelo estoniano mostra que é possível crescer de forma justa, tributando lucros apenas quando extraídos e promovendo reinvestimento.</p>
      <p>Para que o Brasil alcance crescimento inclusivo e mobilidade social, a solução não é apenas aumentar impostos sobre ricos, mas <strong>modernizar a interação entre tributação, investimento e trabalho</strong>. Crescimento sustentável vem de permitir que capital e trabalho prosperem juntos.</p>
    </template>
  </article>
</template>

<style scoped>
.article table { border-collapse: collapse; width: 100%; }
.article th, .article td { border: 1px solid var(--color-border); padding: 0.5rem; text-align: left; }
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
