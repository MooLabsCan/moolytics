<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
const props = defineProps({ lang: { type: String, default: 'en' }, id: { type: String, default: 'tax-wage-ceiling' } })

const TITLES = {
  en: 'Six Countries, One Business: How Tax Systems Limit the Wages a Company Can Afford',
  pt: 'Seis Países, Uma Empresa: Como os Sistemas Tributários Limitam o Salário que uma Empresa Pode Pagar'
}
onMounted(() => { document.title = TITLES[props.lang] || TITLES.en })

const canonicalUrl = computed(() => `#/${['article', props.id, props.lang].filter(Boolean).join('/')}`)
const fullUrl = computed(() => window.location.origin + window.location.pathname + canonicalUrl.value)

const shareTitle = computed(() => TITLES[props.lang] || TITLES.en)
const shareText = computed(() =>
    props.lang==='en' ? 'Take six otherwise identical businesses and place them in Brazil, France, Italy, Finland, Denmark and Switzerland. Consumption taxes and employer-side charges alone produce very different ceilings on the gross salary each can afford to pay.' :
    'Pegue seis empresas idênticas e coloque-as no Brasil, na França, na Itália, na Finlândia, na Dinamarca e na Suíça. Só os impostos sobre consumo e os encargos do empregador já produzem tetos muito diferentes para o salário bruto que cada uma consegue pagar.'
)

const UI_STRINGS = {
  en: { share: 'Share', copyLink: 'Copy link', copied: 'Link copied!', promptCopy: 'Copy the link:', email: 'Email' },
  pt: { share: 'Compartilhar', copyLink: 'Copiar link', copied: 'Link copiado!', promptCopy: 'Copie o link:', email: 'Email' }
}
const ui = computed(() => UI_STRINGS[props.lang] || UI_STRINGS.en)

const showShareMenu = ref(false)
const shareMenuEl = ref(null)

function onDocumentClick(e) {
  if (!showShareMenu.value) return
  const el = shareMenuEl.value
  if (el && !el.contains(e.target)) showShareMenu.value = false
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
    console.warn('Native share failed or was cancelled, falling back to menu:', e)
  }
  showShareMenu.value = true
}

async function copyLink() {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(fullUrl.value)
      alert(ui.value.copied)
    } else {
      prompt(ui.value.promptCopy, fullUrl.value)
    }
  } catch (e) {
    console.error('Clipboard error', e)
    prompt(ui.value.promptCopy, fullUrl.value)
  }
}

const encodedUrl = computed(() => encodeURIComponent(fullUrl.value))
const encodedTitle = computed(() => encodeURIComponent(shareTitle.value))
const encodedText = computed(() => encodeURIComponent(shareText.value))

const pubDate = new Date('2026-10-28T00:00:00Z')
const isoDate = '2026-10-28'
const LOCALES = {
  en: 'en-US',
  pt: 'pt-BR'
}
const PUBLISHED_LABELS = {
  en: 'Published on',
  pt: 'Publicado em'
}
const formattedDate = computed(() => {
  const locale = LOCALES[props.lang] || 'en-US'
  const fmt = new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })
  return fmt.format(pubDate)
})
const publishedLabel = computed(() => PUBLISHED_LABELS[props.lang] || PUBLISHED_LABELS.en)
</script>

<template>
  <article class="article">
    <header style="display:flex;align-items:center;justify-content:space-between;gap:1rem; margin-bottom:0.75rem;">
      <div>
        <h1 v-if="props.lang==='en'">Six Countries, One Business: How Tax Systems Limit the Wages a Company Can Afford</h1>
        <h1 v-else>Seis Países, Uma Empresa: Como os Sistemas Tributários Limitam o Salário que uma Empresa Pode Pagar</h1>
        <div class="byline">
          <em v-if="props.lang==='en'">Moolytics — Tax Policy</em>
          <em v-else>Moolytics — Política Tributária</em>
        </div>
        <div class="pubdate">
          <small>{{ publishedLabel }} <time :datetime="isoDate">{{ formattedDate }}</time></small>
        </div>
      </div>
      <div class="share" ref="shareMenuEl" style="position:relative;">
        <button @click="onShareClick" :aria-expanded="showShareMenu ? 'true' : 'false'" aria-haspopup="menu" title="Share" style="border:1px solid var(--color-border);background:transparent;border-radius:6px;padding:0.35rem 0.5rem;cursor:pointer;display:inline-flex;align-items:center;gap:0.35rem;">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
          <span>{{ ui.share }}</span>
        </button>
        <div v-if="showShareMenu" class="share-menu" role="menu">
          <button class="share-item" role="menuitem" @click="copyLink">{{ ui.copyLink }}</button>
          <a class="share-item" role="menuitem" :href="`mailto:?subject=${encodedTitle}&body=${encodedText}%0A%0A${encodedUrl}`" target="_blank" rel="noopener">{{ ui.email }}</a>
          <a class="share-item" role="menuitem" :href="`https://api.whatsapp.com/send?text=${encodedTitle}%20-%20${encodedUrl}`" target="_blank" rel="noopener">WhatsApp</a>
          <a class="share-item" role="menuitem" :href="`https://x.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`" target="_blank" rel="noopener">X / Twitter</a>
          <a class="share-item" role="menuitem" :href="`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`" target="_blank" rel="noopener">LinkedIn</a>
        </div>
      </div>
    </header>

    <template v-if="props.lang === 'en'">
<p><em>The tax system does more than determine how much income the government collects. It also shapes how much a business can afford to pay its employees in the first place.</em></p>
<p>Imagine six otherwise identical companies. Each sells the same amount of goods or services, faces the same underlying business conditions, and seeks to retain a modest 1% profit margin. Each wants to direct as much of its remaining revenue as possible toward employee compensation.</p>
<p>Now place those companies in Brazil, France, Italy, Finland, Denmark and Switzerland.</p>
<p>Although the companies are economically identical, their tax systems produce different ceilings on the gross salaries they can afford to pay.</p>
<p>This is an illustration of a frequently overlooked economic consequence of taxation: <strong>the structure of a tax system can constrain wages before personal income tax is even considered.</strong></p>

<h2>The distinction between earning a wage and taking it home</h2>
<p>Discussions about taxation often focus on how much an employee retains after income tax and social contributions. That is an important question, but it is not the only one.</p>
<p>There are two separate stages:</p>
<ol>
  <li>The employer determines how much gross salary it can afford after accounting for revenue, consumption taxes, operating costs and employer-side employment charges.</li>
  <li>The employee receives that gross salary and pays any personal income taxes and employee-side contributions.</li>
</ol>
<p>These stages should not be confused.</p>
<p>A personal income tax generally reduces the employee’s take-home pay without directly increasing the employer’s cost of paying a given gross salary. Employer-side payroll taxes and social contributions, by contrast, increase the cost of employing someone beyond the gross salary itself.</p>
<p>If a business has limited revenue and cannot readily raise its prices, an additional employer-side charge leaves less money available for wages.</p>
<p>The OECD’s <em>Taxing Wages 2026</em> report distinguishes these components and explains that higher labour tax wedges can reduce incentives to hire by increasing employers’ labour costs. Its 2025 data show substantial differences in employer social contributions across countries. See <a href="https://www.oecd.org/en/publications/taxing-wages-2026_3a5169ef-en.html" target="_blank" rel="noopener">OECD, Taxing Wages 2026</a>.</p>

<h2>One business model, six tax systems</h2>
<p>Consider a simplified company with customer payments equivalent to 6,000 units of local currency, including consumption tax. It retains a 1% operating margin on revenue excluding that tax, with the remaining revenue available to pay one employee.</p>
<p>For Denmark, the illustrative business could instead use DKK 60,000 in customer payments, scaling the other monetary amounts proportionally. The absolute currency figures are not directly comparable across countries; the meaningful comparison is the percentage of customer revenue available for gross salary.</p>
<p>The model uses standard VAT rates and illustrative employer contribution estimates. For Finland, France, Italy, Denmark and Switzerland, the employer contribution shares are based on OECD figures for an average-wage worker. Brazil uses an illustrative employer payroll burden of 35.8% of gross salary and an assumed 28% consumption-tax rate.</p>

<div class="table-wrap">
<table class="data-table">
  <thead>
    <tr><th>Country</th><th>Assumed consumption-tax rate</th><th>Estimated maximum gross salary as a share of customer payments</th></tr>
  </thead>
  <tbody>
    <tr><td>Switzerland</td><td>8.1%</td><td>86.1%</td></tr>
    <tr><td>Denmark</td><td>25%</td><td>78.6%</td></tr>
    <tr><td>Finland</td><td>25.5%</td><td>65.5%</td></tr>
    <tr><td>Italy</td><td>22%</td><td>61.7%</td></tr>
    <tr><td>France</td><td>20%</td><td>60.5%</td></tr>
    <tr><td>Brazil</td><td>28%</td><td>57.0%</td></tr>
  </tbody>
</table>
</div>
<p class="note"><em>These are illustrative model outputs, not payroll quotations or estimates of typical wages. The figures depend on the stated assumptions, particularly the consumption-tax treatment and employer contributions.</em></p>

<p>The results show how the interaction of consumption taxes and employer-side employment charges can produce materially different salary ceilings for otherwise similar businesses.</p>
<p>In this example, Switzerland’s combination of a comparatively low standard VAT rate and lower employer contributions leaves a larger proportion of customer payments available for gross salary. Denmark also leaves a relatively large share available, despite its high personal income taxation. Finland, Italy and France produce lower salary ceilings under the assumptions used.</p>
<p>Brazil falls below France in this particular model.</p>
<p>That result deserves closer examination.</p>

<h2>Brazil: when the cost of formal employment becomes a constraint</h2>
<p>Brazil’s employment-cost structure illustrates why the headline tax rate is not enough to understand the burden on a small business.</p>
<p>Under the simplified assumptions, the employer pays more than the employee’s gross salary. The model includes illustrative charges for employer social security, workplace-risk contributions, third-party levies and FGTS, the mandatory severance fund contribution. Together, these are assumed to add 35.8% to gross salary.</p>
<p>The model also assumes a 28% consumption-tax rate. That is a prospective reference assumption for a fully implemented version of Brazil’s consumption-tax reform, not a claim that every Brazilian business currently pays that rate. The reform is transitioning into effect through 2033, and actual liabilities will depend on the applicable rules, credits, business activity and tax regime.</p>
<p>Under those assumptions, a company receiving 6,000 units of customer payments has 4,687.50 units in revenue excluding the assumed consumption tax. After preserving a 1% margin, the amount available for employment costs is approximately 4,640.63 units. Dividing that amount by 1.358—the gross salary plus the assumed employer charges—leaves approximately 3,417 units for gross salary.</p>
<p>That is around <strong>57% of the original customer payment</strong>.</p>
<p>The remaining amount is not all government revenue: it includes the consumption tax and employer contributions, while the 1% margin is retained by the business. Nor does the calculation include every possible cost of operating a real company.</p>

<figure class="infographic">
  <img src="/images/monthly-revenue-distribution.png" alt="Infographic in Portuguese titled “Distribuição da receita bruta mensal”: a pie chart splitting R$ 6.000 of monthly revenue, with a 28% consumption tax, between the employee’s gross salary, consumption tax, employer social security, 13th-salary and vacation provisions, FGTS and other charges, leaving the owner R$ 169,95 (2.8%)." loading="lazy" />
  <figcaption>A more detailed Brazilian scenario, in Portuguese: R$ 6,000 in monthly revenue (including a 28% consumption tax) supporting one formal CLT employee on a R$ 2,700 salary in São Paulo, with 13th-salary and vacation provisions and transport vouchers. Because it itemizes more charges than the simplified model above, it leaves the owner a residual of about 2.8% rather than 1%. It is an illustration, not a payroll quotation.</figcaption>
</figure>

<p>The two figures are consistent because they answer different questions. The 1% in the model is a margin the business is assumed to keep, with everything else going to the employee’s gross salary. The 2.8% in the infographic is what is left over for the owner once a fuller list of employment costs, including 13th-salary and vacation provisions and transport vouchers, has been paid on a R$ 2,700 salary. Both show the same thing: very little of the customer’s payment is left for the owner once consumption tax and formal employment costs are paid.</p>

<p>The implication is nevertheless important. A small business with limited pricing power may find that a substantial share of its customer revenue is unavailable for gross wages, even before considering the employee’s personal income tax.</p>
<p>Brazil’s actual position varies considerably by tax regime. Businesses under <em>Simples Nacional</em>, for example, can face different treatment of employer contributions, and sector-specific rules can materially change the calculation. A proper estimate for an individual business must account for those differences.</p>
<p>The broader policy question is whether the combined burden encourages businesses to remain small, avoid hiring, use informal arrangements or shift work toward contracting when those options are available. The model alone cannot prove that these responses occur or quantify their scale, but it identifies a mechanism worth investigating.</p>

<h2>Why gross salary matters for economic opportunity</h2>
<p>Suppose two employees perform equivalent work for businesses with similar revenue. In one country, the employer can afford to offer a gross salary equal to 80% of customer payments. In another, the same business model permits only 60%.</p>
<p>The employee’s personal income-tax rate does not explain that initial difference. The employer’s cost structure does.</p>
<p>This matters for economic opportunity. Gross salaries help determine the resources workers can use for housing, saving, investment and consumption. A tax that increases the cost of hiring may also affect whether a marginal job is created at all.</p>
<p>The economic incidence of a tax is not necessarily identical to the person legally required to remit it. Over time, employer-side taxes may be reflected in lower gross wages, higher prices, lower profits, reduced employment or some combination of these outcomes. The exact division depends on labour-market conditions and the ability of firms and workers to adjust.</p>
<p>That qualification matters: it would be too strong to claim that every unit of employer payroll tax translates into a unit of lost wages. But it is equally mistaken to assume that employer-side charges have no effect on what workers can earn.</p>

<h2>What the comparison does—and does not—show</h2>
<p>The model is a thought experiment, not a controlled empirical study.</p>
<p>It simplifies the treatment of VAT, assumes no input-tax credits, omits many business expenses and applies average-wage employer contribution shares to a hypothetical business. Brazil’s consumption-tax assumption is prospective, and the actual Brazilian payroll burden depends on the business’s circumstances. The model also excludes employee personal income tax by design, because the question is how much gross salary the employer can afford.</p>
<p>The comparison therefore does not establish that the tax system alone explains the differences in average wages among these countries. Productivity, capital investment, skills, industry composition, bargaining arrangements and working hours also influence wages.</p>
<p>What it does demonstrate is narrower, but still significant: <strong>tax systems can create different ceilings on the gross compensation that a given level of customer revenue can support.</strong></p>
<p>If a government wants to understand the effect of taxation on workers, it should look beyond take-home pay and headline income-tax rates. It should also examine how consumption taxes and employer-side charges interact to determine the amount businesses can afford to pay in the first place.</p>
<p>A tax system can redistribute income after it has been earned. It can also change the conditions under which that income is earned at all.</p>
<p>That distinction should be central to any serious discussion of wages, employment and tax policy.</p>
    </template>

    <template v-else>
<p><em>O sistema tributário não define apenas quanta renda o governo arrecada. Ele também molda quanto uma empresa consegue pagar a seus empregados, antes de qualquer outra coisa.</em></p>
<p>Imagine seis empresas idênticas em todos os outros aspectos. Cada uma vende a mesma quantidade de bens ou serviços, enfrenta as mesmas condições de negócio e busca preservar uma modesta margem de lucro de 1%. Cada uma quer destinar o máximo possível da receita restante à remuneração de seus empregados.</p>
<p>Agora coloque essas empresas no Brasil, na França, na Itália, na Finlândia, na Dinamarca e na Suíça.</p>
<p>Embora sejam economicamente idênticas, seus sistemas tributários produzem tetos diferentes para os salários brutos que elas conseguem pagar.</p>
<p>Esta é uma ilustração de uma consequência econômica da tributação que costuma passar despercebida: <strong>a estrutura de um sistema tributário pode limitar os salários antes mesmo de se considerar o imposto de renda da pessoa física.</strong></p>

<h2>A diferença entre ganhar um salário e levá-lo para casa</h2>
<p>As discussões sobre tributação costumam se concentrar em quanto o empregado retém depois do imposto de renda e das contribuições sociais. É uma pergunta importante, mas não é a única.</p>
<p>Há duas etapas distintas:</p>
<ol>
  <li>O empregador determina quanto de salário bruto consegue pagar, depois de considerar a receita, os impostos sobre consumo, os custos operacionais e os encargos trabalhistas a seu cargo.</li>
  <li>O empregado recebe esse salário bruto e paga o imposto de renda e as contribuições que lhe cabem.</li>
</ol>
<p>Essas etapas não devem ser confundidas.</p>
<p>O imposto de renda da pessoa física geralmente reduz o salário líquido do empregado sem aumentar diretamente o custo para o empregador de pagar determinado salário bruto. Já os impostos sobre a folha e as contribuições sociais a cargo do empregador aumentam o custo de empregar alguém para além do próprio salário bruto.</p>
<p>Se um negócio tem receita limitada e não consegue elevar seus preços com facilidade, um encargo adicional do lado do empregador deixa menos dinheiro disponível para salários.</p>
<p>O relatório <em>Taxing Wages 2026</em>, da OCDE, distingue esses componentes e explica que cunhas tributárias mais altas sobre o trabalho podem reduzir os incentivos à contratação ao elevar os custos de mão de obra para os empregadores. Seus dados de 2025 mostram diferenças substanciais nas contribuições sociais do empregador entre os países. Veja <a href="https://www.oecd.org/en/publications/taxing-wages-2026_3a5169ef-en.html" target="_blank" rel="noopener">OCDE, Taxing Wages 2026</a> (em inglês).</p>

<h2>Um modelo de negócio, seis sistemas tributários</h2>
<p>Considere uma empresa simplificada com pagamentos de clientes equivalentes a 6.000 unidades da moeda local, já incluído o imposto sobre consumo. Ela retém uma margem operacional de 1% sobre a receita sem esse imposto, e o restante da receita fica disponível para pagar um empregado.</p>
<p>Para a Dinamarca, o negócio ilustrativo poderia usar DKK 60.000 em pagamentos de clientes, com os demais valores monetários ajustados proporcionalmente. Os valores absolutos em moeda não são diretamente comparáveis entre países; a comparação que importa é o percentual da receita dos clientes disponível para o salário bruto.</p>
<p>O modelo usa alíquotas-padrão de IVA e estimativas ilustrativas de contribuição patronal. Para Finlândia, França, Itália, Dinamarca e Suíça, a participação das contribuições do empregador baseia-se em dados da OCDE para um trabalhador com salário médio. O Brasil usa um encargo patronal ilustrativo de 35,8% do salário bruto e uma alíquota de imposto sobre consumo de 28%, adotada como hipótese.</p>

<div class="table-wrap">
<table class="data-table">
  <thead>
    <tr><th>País</th><th>Alíquota de imposto sobre consumo adotada</th><th>Salário bruto máximo estimado como parcela dos pagamentos dos clientes</th></tr>
  </thead>
  <tbody>
    <tr><td>Suíça</td><td>8,1%</td><td>86,1%</td></tr>
    <tr><td>Dinamarca</td><td>25%</td><td>78,6%</td></tr>
    <tr><td>Finlândia</td><td>25,5%</td><td>65,5%</td></tr>
    <tr><td>Itália</td><td>22%</td><td>61,7%</td></tr>
    <tr><td>França</td><td>20%</td><td>60,5%</td></tr>
    <tr><td>Brasil</td><td>28%</td><td>57,0%</td></tr>
  </tbody>
</table>
</div>
<p class="note"><em>Estes são resultados ilustrativos de um modelo, não cotações de folha de pagamento nem estimativas de salários típicos. Os números dependem das hipóteses declaradas, em especial o tratamento do imposto sobre consumo e as contribuições do empregador.</em></p>

<p>Os resultados mostram como a combinação de impostos sobre consumo e encargos trabalhistas do lado do empregador pode produzir tetos salariais materialmente diferentes para negócios semelhantes.</p>
<p>Neste exemplo, a combinação de uma alíquota-padrão de IVA comparativamente baixa com contribuições patronais menores deixa à Suíça uma fatia maior dos pagamentos dos clientes disponível para o salário bruto. A Dinamarca também deixa uma parcela relativamente grande, apesar da alta tributação da renda pessoal. Finlândia, Itália e França produzem tetos salariais menores sob as hipóteses usadas.</p>
<p>O Brasil fica abaixo da França neste modelo específico.</p>
<p>Esse resultado merece uma análise mais atenta.</p>

<h2>Brasil: quando o custo do emprego formal vira uma restrição</h2>
<p>A estrutura de custos de emprego do Brasil ilustra por que a alíquota nominal não basta para entender o peso sobre uma pequena empresa.</p>
<p>Sob as hipóteses simplificadas, o empregador paga mais do que o salário bruto do empregado. O modelo inclui encargos ilustrativos de previdência patronal, contribuição para riscos do trabalho, contribuições a terceiros e FGTS, o fundo obrigatório de indenização. Juntos, presume-se que somem 35,8% ao salário bruto.</p>
<p>O modelo também adota uma alíquota de 28% de imposto sobre consumo. Trata-se de uma hipótese prospectiva de referência para uma versão plenamente implementada da reforma tributária do consumo no Brasil, e não uma afirmação de que toda empresa brasileira pague hoje essa alíquota. A reforma entra em vigor de forma gradual até 2033, e as obrigações efetivas dependerão das regras aplicáveis, dos créditos, da atividade da empresa e do regime tributário.</p>
<p>Sob essas hipóteses, uma empresa que recebe 6.000 unidades em pagamentos de clientes tem 4.687,50 unidades de receita sem o imposto sobre consumo presumido. Preservada a margem de 1%, o valor disponível para custos de emprego é de aproximadamente 4.640,63 unidades. Dividindo esse valor por 1,358 — o salário bruto mais os encargos patronais presumidos — restam cerca de 3.417 unidades para o salário bruto.</p>
<p>Isso equivale a cerca de <strong>57% do pagamento original do cliente</strong>.</p>
<p>O restante não é todo receita do governo: inclui o imposto sobre consumo e as contribuições patronais, enquanto a margem de 1% fica com o negócio. O cálculo também não inclui todos os custos possíveis de operar uma empresa real.</p>

<figure class="infographic">
  <img src="/images/monthly-revenue-distribution.png" alt="Infográfico “Distribuição da receita bruta mensal”: gráfico de pizza que divide R$ 6.000 de receita mensal, com imposto sobre consumo de 28%, entre o salário bruto do empregado, o imposto sobre consumo, o INSS patronal, as provisões de 13º salário e férias, o FGTS e outros encargos, deixando R$ 169,95 (2,8%) para o proprietário." loading="lazy" />
  <figcaption>Um cenário brasileiro mais detalhado: R$ 6.000 de receita mensal (com imposto sobre consumo de 28%) sustentando um empregado CLT com salário de R$ 2.700 em São Paulo, com provisões de 13º salário e férias e vale-transporte. Como detalha mais encargos do que o modelo simplificado acima, deixa ao proprietário um resíduo de cerca de 2,8% em vez de 1%. É uma ilustração, não uma cotação de folha de pagamento.</figcaption>
</figure>

<p>Os dois números são coerentes porque respondem a perguntas diferentes. O 1% do modelo é a margem que se presume que o negócio mantenha, com todo o restante indo para o salário bruto do empregado. Os 2,8% do infográfico são o que sobra para o proprietário depois de pagos os custos de emprego de uma lista mais completa, incluindo provisões de 13º salário e férias e vale-transporte, sobre um salário de R$ 2.700. Ambos mostram o mesmo: sobra muito pouco do pagamento do cliente para o proprietário depois do imposto sobre consumo e dos custos do emprego formal.</p>

<p>A implicação, no entanto, é importante. Uma pequena empresa com pouco poder de fixar preços pode descobrir que uma parcela substancial da receita de seus clientes não está disponível para salários brutos, mesmo antes de se considerar o imposto de renda do empregado.</p>
<p>A situação real do Brasil varia bastante conforme o regime tributário. Empresas do <em>Simples Nacional</em>, por exemplo, podem ter tratamento diferente das contribuições patronais, e regras setoriais podem alterar materialmente o cálculo. Uma estimativa adequada para uma empresa específica precisa levar essas diferenças em conta.</p>
<p>A questão de política pública mais ampla é se o peso combinado incentiva empresas a continuar pequenas, evitar contratações, recorrer à informalidade ou transferir o trabalho para a contratação de prestadores quando essas opções existem. O modelo, por si só, não prova que essas reações ocorrem nem quantifica sua escala, mas aponta um mecanismo que merece ser investigado.</p>

<h2>Por que o salário bruto importa para a oportunidade econômica</h2>
<p>Suponha que dois empregados executem trabalho equivalente em negócios de receita semelhante. Em um país, o empregador consegue oferecer um salário bruto equivalente a 80% dos pagamentos dos clientes. Em outro, o mesmo modelo de negócio permite apenas 60%.</p>
<p>A alíquota de imposto de renda do empregado não explica essa diferença inicial. A estrutura de custos do empregador, sim.</p>
<p>Isso importa para a oportunidade econômica. Os salários brutos ajudam a determinar os recursos que os trabalhadores podem usar para moradia, poupança, investimento e consumo. Um tributo que eleva o custo de contratar também pode afetar se um emprego marginal chega a ser criado.</p>
<p>A incidência econômica de um tributo não é necessariamente igual à da pessoa legalmente obrigada a recolhê-lo. Com o tempo, tributos do lado do empregador podem se refletir em salários brutos menores, preços mais altos, lucros menores, menos emprego ou alguma combinação desses resultados. A divisão exata depende das condições do mercado de trabalho e da capacidade de ajuste de empresas e trabalhadores.</p>
<p>Essa ressalva importa: seria forte demais afirmar que cada unidade de imposto patronal sobre a folha se traduz em uma unidade de salário perdido. Mas é igualmente equivocado presumir que os encargos do empregador não têm efeito sobre o que os trabalhadores conseguem ganhar.</p>

<h2>O que a comparação mostra — e o que não mostra</h2>
<p>O modelo é um experimento mental, não um estudo empírico controlado.</p>
<p>Ele simplifica o tratamento do IVA, pressupõe ausência de créditos de insumos, omite muitas despesas empresariais e aplica a participação das contribuições patronais do salário médio a um negócio hipotético. A hipótese de imposto sobre consumo do Brasil é prospectiva, e o encargo patronal efetivo no Brasil depende das circunstâncias da empresa. O modelo também exclui o imposto de renda do empregado por construção, porque a pergunta é quanto de salário bruto o empregador consegue pagar.</p>
<p>A comparação, portanto, não estabelece que o sistema tributário sozinho explica as diferenças de salário médio entre esses países. Produtividade, investimento em capital, qualificação, composição setorial, arranjos de negociação e jornada de trabalho também influenciam os salários.</p>
<p>O que ela demonstra é mais restrito, mas ainda significativo: <strong>os sistemas tributários podem criar tetos diferentes para a remuneração bruta que determinado nível de receita de clientes consegue sustentar.</strong></p>
<p>Se um governo quer entender o efeito da tributação sobre os trabalhadores, deve olhar além do salário líquido e das alíquotas nominais de imposto de renda. Deve também examinar como os impostos sobre consumo e os encargos do lado do empregador interagem para determinar quanto as empresas conseguem pagar em primeiro lugar.</p>
<p>Um sistema tributário pode redistribuir a renda depois que ela foi ganha. Ele também pode mudar as condições em que essa renda é ganha.</p>
<p>Essa distinção deveria ser central em qualquer discussão séria sobre salários, emprego e política tributária.</p>
    </template>
  </article>
</template>

<style scoped>
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

.table-wrap { overflow-x: auto; margin: 1rem 0 0.5rem; }
.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
}
.data-table th,
.data-table td {
  padding: 0.55rem 0.75rem;
  border: 1px solid var(--color-border);
  text-align: left;
}
.data-table th { background: var(--color-background-soft); font-weight: 600; }
.data-table td:nth-child(n+2),
.data-table th:nth-child(n+2) { text-align: right; }
.note { font-size: 0.9rem; color: var(--vt-c-text-light-2, #666); }

.infographic { margin: 1.5rem 0; }
.infographic img {
  display: block;
  width: 100%;
  height: auto;
  border: 1px solid var(--color-border);
  border-radius: 10px;
}
.infographic figcaption {
  margin-top: 0.5rem;
  font-size: 0.85rem;
  line-height: 1.5;
  color: var(--vt-c-text-light-2, #666);
}
</style>
