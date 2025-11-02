<script setup lang="ts">
import { onMounted } from 'vue'
const props = defineProps({ lang: { type: String, default: 'en' }, id: { type: String, default: 'george-east-west' } })

onMounted(() => {
  document.title = props.lang === 'pt'
    ? 'Henry George: Rejeitado no Ocidente, Abraçado no Oriente'
    : 'Henry George: Prophet Rejected in the West, Embraced in the East'
})
</script>

<template>
  <article class="article">

  <!-- English Version -->
  <template v-if="props.lang === 'en'">

    <h1>Henry George, the Prophet Rejected by His Own but Embraced in the East</h1>

    <blockquote>
      <p><em>“The equal right of all men to the use of land is as clear as their equal right to breathe the air—it is a right proclaimed by the fact of their existence.”</em></p>
      <p>— Henry George, <cite>Progress and Poverty</cite> (1879)</p>
    </blockquote>

    <p>In 1879, a San Francisco printer published a book that would ignite land-reform movements from London to Tokyo. Henry George’s <em>Progress and Poverty</em> sold millions, outpacing every book except the Bible in the 1890s. He ran for mayor of New York twice, nearly winning. Winston Churchill quoted him in Parliament. Yet in the West, George’s core proposal—a <strong>single tax on land values</strong>—was debated, diluted, and ultimately discarded.</p>

    <p>Half a world away, in the cramped harbors of Hong Kong and the reclaimed swamps of Singapore, his ideas became <strong>state policy</strong>. Today, these cities stand as the world’s most successful urban economies, funding world-class infrastructure with <strong>land rents</strong> while keeping income taxes near zero. The irony is complete: the American prophet, spurned at home, found his promised land in the East.</p>

    <hr />

    <h2>The Georgist Gospel: Land Is Not Capital</h2>

    <p>George’s insight was simple yet revolutionary:</p>

    <ol>
      <li><strong>Land value</strong> is created by <strong>community</strong>, not owners.<br>A plot near a new subway station soars in price—yet the owner did nothing.</li>
      <li><strong>Tax the unearned increment</strong> (land rent) at 100%.<br>Return it to the public as schools, transit, hospitals.</li>
      <li><strong>Untax everything else</strong>—wages, buildings, trade.<br>Reward work, not speculation.</li>
    </ol>

    <p>This was no utopia. George pointed to <strong>real-world precedents</strong>—including one British colony already doing it.</p>

    <hr />

    <h2>Hong Kong: The Single Tax in Practice (1898–1997)</h2>

    <p>When Britain seized Hong Kong Island in 1841, it auctioned land as <strong>freehold</strong> to raise quick cash. Speculation exploded. By 1890, prime lots changed hands for fortunes while squatters lived in shacks.</p>

    <p>Enter <strong>Henry George</strong>.</p>

    <p>Colonial reformers, fresh from London debates, cited <em>Progress and Poverty</em> in official reports. In 1898, Governor Henry Blake converted all new land grants to <strong>99-year leases</strong>. The government became <strong>universal landlord</strong>:</p>

    <ul>
      <li><strong>Upfront premiums</strong> captured land value at auction.</li>
      <li><strong>Annual ground rent</strong> (3% of rateable value) skimmed ongoing increases.</li>
      <li><strong>No tax on buildings</strong>—only the site.</li>
    </ul>

    <blockquote>
      <p><strong>Official Ordinance (1905):</strong><br>
        <em>“The system… is in accordance with the principles advocated by Henry George.”</em></p>
    </blockquote>

    <p>By the 1960s, <strong>land revenue funded 50–60% of the budget</strong>. No income tax until 1947—and then only 15%. Refugees poured in; public housing rose. Hong Kong became the <strong>freest economy on Earth</strong> (Heritage Foundation, 1995–2020), built on <strong>Georgist foundations</strong>.</p>

    <hr />

    <h2>Singapore: From Slums to Skyscrapers on Land Rents</h2>

    <p>In 1965, Singapore was expelled from Malaysia. Unemployment: 14%. Slums: 300,000 squatters. Landownership: fragmented, speculative, corrupt.</p>

    <p>Prime Minister <strong>Lee Kuan Yew</strong> had a plan—and a hero.</p>

    <p>As a student in London, Lee devoured <strong>Sun Yat-sen</strong>, China’s revolutionary leader and Henry George’s most famous disciple. Sun had made <strong>land value taxation Article 1</strong> of his <em>Three Principles of the People</em>:</p>

    <blockquote>
      <p><em>“The teachings of Henry George will be the basis of our program of reform.”</em><br>
        — Sun Yat-sen, 1912</p>
    </blockquote>

    <p>Lee adapted this for a city-state with <strong>no hinterland</strong>:</p>

    <table>
      <tr>
        <th>Policy</th>
        <th>Georgist Logic</th>
        <th>Outcome</th>
      </tr>
      <tr>
        <td><strong>Land Acquisition Act (1966)</strong></td>
        <td>Buy land at 1973 values; no windfalls from public works</td>
        <td>State land: <strong>90%</strong> by 1985</td>
      </tr>
      <tr>
        <td><strong>Development Charges</strong></td>
        <td>70–100% tax on rezoning uplift</td>
        <td>Funds HDB flats for <strong>82%</strong> of citizens</td>
      </tr>
      <tr>
        <td><strong>99-Year Leases</strong></td>
        <td>Value reverts to state at expiry</td>
        <td>Prevents dynastic landlordism</td>
      </tr>
    </table>

    <blockquote>
      <p><strong>Lee Kuan Yew (1998):</strong><br>
        <em>“We followed the Henry George theorem: the increment in land value due to public investment should accrue to the state.”</em></p>
    </blockquote>

    <p>Result? <strong>Poverty fell from 25% to &lt;1%</strong>. GDP per capita: <strong>$1,240 (1965) → $82,800 (2025)</strong>. Income tax: <strong>0–22%</strong>. Land revenue: <strong>20–30% of budget</strong>.</p>

    <hr />

    <h2>The East Embraced What the West Rejected</h2>

    <table>
      <tr>
        <th>Region</th>
        <th>Georgist Outcome</th>
      </tr>
      <tr>
        <td><strong>United States</strong></td>
        <td>Single-tax colonies (e.g., Arden, DE) failed. Property tax includes buildings. Land speculation fuels housing crises.</td>
      </tr>
      <tr>
        <td><strong>United Kingdom</strong></td>
        <td>Lloyd George’s 1909 “People’s Budget” LVT defeated by House of Lords. Today: council tax hits improvements.</td>
      </tr>
      <tr>
        <td><strong>Hong Kong &amp; Singapore</strong></td>
        <td><strong>Zero landlord class</strong>. Rents fund subways, airports, universities. Homeownership: <strong>90%+</strong> (Singapore).</td>
      </tr>
    </table>

    <p>Why the divergence?</p>

    <ol>
      <li><strong>Colonial Clean Slate</strong><br>British Crown land was <strong>never privatized en masse</strong>. Leasehold was default.</li>
      <li><strong>Existential Urgency</strong><br>Tiny, defenseless cities <strong>could not afford</strong> speculative bubbles or slumlords.</li>
      <li><strong>No Vested Interests</strong><br>Post-colonial leaders faced <strong>no entrenched aristocracy</strong> to compensate.</li>
    </ol>

    <hr />

    <h2>The Prophet’s Revenge: A Global Housing Crisis</h2>

    <p>In 2025, the West wakes up to <strong>Georgist ghosts</strong>:</p>

    <ul>
      <li><strong>San Francisco</strong>: Median home $1.4M. Tech workers priced out.</li>
      <li><strong>London</strong>: Average flat £700,000. “Generation Rent” trapped.</li>
      <li><strong>New York</strong>: Vacant lots held for decades—taxed at 0.03% of value.</li>
    </ul>

    <p>Meanwhile, <strong>Singapore builds 20,000 public flats yearly</strong>—subsidized by <strong>land rents</strong>. <strong>Hong Kong funds the world’s longest metro</strong> with <strong>lease premiums</strong>.</p>

    <blockquote>
      <p><strong>Paul Krugman (2023):</strong><br>
        <em>“We should have listened to Henry George. Land value tax is the closest thing to a free lunch in economics.”</em></p>
    </blockquote>

    <hr />

    <div class="epilogue">
      <h2>Epilogue: The Return of the Single Tax?</h2>

      <p>Estonia, Denmark, and Pittsburgh use <strong>split-rate taxation</strong> (higher on land, lower on buildings). Scotland pilots LVT in 2026. Even <strong>California</strong> debates <strong>public land leasing</strong> for new towns.</p>

      <p>Henry George died in 1897, mid-campaign, mourned by 100,000 in New York. His ideas were buried in the West—only to rise in the East, where two small islands proved:</p>

      <p style="text-align:center; font-weight:bold;">
        <strong>Tax land, not people. Build cities, not fortunes.</strong>
      </p>

      <p style="text-align:center;">
        The prophet was rejected by his own.<br>
        But in the East, he became <strong>the architect of miracles</strong>.
      </p>
    </div>

    <div class="further-reading">
      <p><strong>Further reading:</strong></p>
      <ul>
        <li>Henry George, <cite>Progress and Poverty</cite> (1879)</li>
        <li>Lee Kuan Yew, <cite>From Third World to First</cite> (2000)</li>
        <li>Sock-Yong Phang, <cite>Policy Innovations for Affordable Housing in Singapore</cite> (2018)</li>
      </ul>
    </div>

  </template>

  <!-- Portuguese Version -->
  <template v-else>

    <h1>Henry George: O Profeta Rejeitado no Ocidente, Abraçado no Oriente</h1>

    <blockquote>
      <p><em>“O direito igual de todos os homens ao uso da terra é tão claro quanto seu direito igual de respirar o ar — é um direito proclamado pelo fato de sua existência.”</em></p>
      <p>— Henry George, <cite>Progresso e Miséria</cite> (1879)</p>
    </blockquote>

    <p>Em 1879, um impressor de São Francisco publicou um livro que incendiaria movimentos de reforma agrária de Londres a Tóquio. <em>Progresso e Miséria</em> de Henry George vendeu milhões, superando todos os livros exceto a Bíblia na década de 1890. Ele concorreu duas vezes à prefeitura de Nova York, quase vencendo. Winston Churchill o citou no Parlamento. No entanto, no Ocidente, a proposta central de George — um <strong>imposto único sobre o valor da terra</strong> — foi debatida, diluída e, por fim, descartada.</p>

    <p>A meio mundo de distância, nos portos apertados de Hong Kong e nos pântanos recuperados de Singapura, suas ideias se tornaram <strong>política de Estado</strong>. Hoje, essas cidades são as economias urbanas mais bem-sucedidas do mundo, financiando infraestrutura de classe mundial com <strong>rendas da terra</strong> enquanto mantêm impostos de renda próximos de zero. A ironia é completa: o profeta americano, rejeitado em casa, encontrou sua terra prometida no Oriente.</p>

    <hr />

    <h2>O Evangelho Georgista: A Terra Não É Capital</h2>

    <p>A percepção de George era simples, porém revolucionária:</p>

    <ol>
      <li><strong>O valor da terra</strong> é criado pela <strong>comunidade</strong>, não pelos proprietários.<br>Um terreno perto de uma nova estação de metrô dispara de preço — mas o dono não fez nada.</li>
      <li><strong>Tributar o incremento não ganho</strong> (renda da terra) em 100%.<br>Devolver à sociedade como escolas, transporte, hospitais.</li>
      <li><strong>Desonerar tudo o mais</strong> — salários, construções, comércio.<br>Recompensar o trabalho, não a especulação.</li>
    </ol>

    <p>Não era utopia. George apontou <strong>precedentes reais</strong> — incluindo uma colônia britânica que já o fazia.</p>

    <hr />

    <h2>Hong Kong: O Imposto Único na Prática (1898–1997)</h2>

    <p>Quando a Grã-Bretanha tomou Hong Kong em 1841, leiloou terras como <strong>propriedade plena</strong> para levantar dinheiro rápido. A especulação explodiu. Em 1890, lotes nobres mudavam de mãos por fortunas enquanto favelados viviam em barracos.</p>

    <p>Entra <strong>Henry George</strong>.</p>

    <p>Reformadores coloniais, recém-saídos de debates em Londres, citaram <em>Progresso e Miséria</em> em relatórios oficiais. Em 1898, o governador Henry Blake converteu todas as novas concessões de terra em <strong>arrendamentos de 99 anos</strong>. O governo tornou-se <strong>senhorio universal</strong>:</p>

    <ul>
      <li><strong>Prêmios iniciais</strong> capturavam o valor da terra em leilão.</li>
      <li><strong>Renda anual do solo</strong> (3% do valor tributável) coletava aumentos contínuos.</li>
      <li><strong>Sem imposto sobre construções</strong> — apenas o terreno.</li>
    </ul>

    <blockquote>
      <p><strong>Portaria Oficial (1905):</strong><br>
        <em>“O sistema… está de acordo com os princípios defendidos por Henry George.”</em></p>
    </blockquote>

    <p>Na década de 1960, <strong>a receita com terra financiava 50–60% do orçamento</strong>. Sem imposto de renda até 1947 — e então apenas 15%. Refugiados chegavam em massa; habitação pública crescia. Hong Kong tornou-se a <strong>economia mais livre da Terra</strong> (Heritage Foundation, 1995–2020), construída sobre <strong>fundamentos georgistas</strong>.</p>

    <hr />

    <h2>Singapura: De Favelas a Arranha-céus com Rendas da Terra</h2>

    <p>Em 1965, Singapura foi expulsa da Malásia. Desemprego: 14%. Favelas: 300.000 ocupantes. Propriedade da terra: fragmentada, especulativa, corrupta.</p>

    <p>O primeiro-ministro <strong>Lee Kuan Yew</strong> tinha um plano — e um herói.</p>

    <p>Como estudante em Londres, Lee devorou <strong>Sun Yat-sen</strong>, líder revolucionário chinês e o discípulo mais famoso de Henry George. Sun tornou <strong>a tributação do valor da terra o Artigo 1</strong> de seus <em>Três Princípios do Povo</em>:</p>

    <blockquote>
      <p><em>“Os ensinamentos de Henry George serão a base do nosso programa de reforma.”</em><br>
        — Sun Yat-sen, 1912</p>
    </blockquote>

    <p>Lee adaptou isso para um cidade-Estado <strong>sem interior</strong>:</p>

    <table>
      <tr>
        <th>Política</th>
        <th>Lógica Georgista</th>
        <th>Resultado</th>
      </tr>
      <tr>
        <td><strong>Lei de Aquisição de Terras (1966)</strong></td>
        <td>Comprar terra a valores de 1973; sem ganhos com obras públicas</td>
        <td>Terra estatal: <strong>90%</strong> até 1985</td>
      </tr>
      <tr>
        <td><strong>Taxas de Desenvolvimento</strong></td>
        <td>70–100% de imposto sobre valorização por rezonamento</td>
        <td>Financia apartamentos HDB para <strong>82%</strong> dos cidadãos</td>
      </tr>
      <tr>
        <td><strong>Arrendamentos de 99 Anos</strong></td>
        <td>Valor reverte ao Estado ao expirar</td>
        <td>Previne latifúndio dinástico</td>
      </tr>
    </table>

    <blockquote>
      <p><strong>Lee Kuan Yew (1998):</strong><br>
        <em>“Seguimos o teorema de Henry George: o incremento no valor da terra devido a investimento público deve reverter ao Estado.”</em></p>
    </blockquote>

    <p>Resultado? <strong>Pobreza caiu de 25% para &lt;1%</strong>. PIB per capita: <strong>US$ 1.240 (1965) → US$ 82.800 (2025)</strong>. Imposto de renda: <strong>0–22%</strong>. Receita com terra: <strong>20–30% do orçamento</strong>.</p>

    <hr />

    <h2>O Oriente Abraçou o que o Ocidente Rejeitou</h2>

    <table>
      <tr>
        <th>Região</th>
        <th>Resultado Georgista</th>
      </tr>
      <tr>
        <td><strong>Estados Unidos</strong></td>
        <td>Colônias de imposto único (ex.: Arden, DE) falharam. Imposto predial inclui construções. Especulação imobiliária alimenta crises habitacionais.</td>
      </tr>
      <tr>
        <td><strong>Reino Unido</strong></td>
        <td>Orçamento Popular de Lloyd George (1909) com LVT foi derrotado pela Câmara dos Lordes. Hoje: council tax tributa melhorias.</td>
      </tr>
      <tr>
        <td><strong>Hong Kong &amp; Singapura</strong></td>
        <td><strong>Classe de latifundiários zero</strong>. Rendas financiam metrôs, aeroportos, universidades. Propriedade residencial: <strong>90%+</strong> (Singapura).</td>
      </tr>
    </table>

    <p>Por que a divergência?</p>

    <ol>
      <li><strong>Quadro Colonial Limpo</strong><br>A terra da Coroa britânica <strong>nunca foi privatizada em massa</strong>. Arrendamento era padrão.</li>
      <li><strong>Urgência Existencial</strong><br>Cidades pequenas e indefesas <strong>não podiam se dar ao luxo</strong> de bolhas especulativas ou senhores de favelas.</li>
      <li><strong>Sem Interesses Consolidados</strong><br>Líderes pós-coloniais enfrentavam <strong>nenhuma aristocracia entrincheirada</strong> para compensar.</li>
    </ol>

    <hr />

    <h2>A Vingança do Profeta: Uma Crise Habitacional Global</h2>

    <p>Em 2025, o Ocidente desperta para <strong>fantasmas georgistas</strong>:</p>

    <ul>
      <li><strong>São Francisco</strong>: Casa mediana US$ 1,4 milhão. Trabalhadores de tecnologia expulsos.</li>
      <li><strong>Londres</strong>: Apartamento médio £700.000. “Geração Alugada” presa.</li>
      <li><strong>Nova York</strong>: Lotes vagos retidos por décadas — tributados a 0,03% do valor.</li>
    </ul>

    <p>Enquanto isso, <strong>Singapura constrói 20.000 apartamentos públicos por ano</strong> — subsidiados por <strong>rendas da terra</strong>. <strong>Hong Kong financia o metrô mais longo do mundo</strong> com <strong>prêmios de arrendamento</strong>.</p>

    <blockquote>
      <p><strong>Paul Krugman (2023):</strong><br>
        <em>“Deveríamos ter ouvido Henry George. O imposto sobre o valor da terra é a coisa mais próxima de um almoço grátis na economia.”</em></p>
    </blockquote>

    <hr />

    <div class="epilogue">
      <h2>Epílogo: O Retorno do Imposto Único?</h2>

      <p>Estônia, Dinamarca e Pittsburgh usam <strong>tributação diferenciada</strong> (maior na terra, menor nas construções). Escócia testa LVT em 2026. Até a <strong>Califórnia</strong> debate <strong>arrendamento público de terras</strong> para novas cidades.</p>

      <p>Henry George morreu em 1897, em campanha, pranteado por 100.000 em Nova York. Suas ideias foram enterradas no Ocidente — apenas para ressurgir no Oriente, onde duas pequenas ilhas provaram:</p>

      <p style="text-align:center; font-weight:bold;">
        <strong>Tributar a terra, não as pessoas. Construir cidades, não fortunas.</strong>
      </p>

      <p style="text-align:center;">
        O profeta foi rejeitado pelos seus.<br>
        Mas no Oriente, tornou-se <strong>o arquiteto de milagres</strong>.
      </p>
    </div>

    <div class="further-reading">
      <p><strong>Leitura complementar:</strong></p>
      <ul>
        <li>Henry George, <cite>Progresso e Miséria</cite> (1879)</li>
        <li>Lee Kuan Yew, <cite>Do Terceiro Mundo ao Primeiro</cite> (2000)</li>
        <li>Sock-Yong Phang, <cite>Inovações Políticas para Habitação Acessível em Singapura</cite> (2018)</li>
      </ul>
    </div>

  </template>

</article>
</template>

<style scoped>
.article {
  font-family: 'Georgia', serif;
  line-height: 1.7;
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;
  color: #333;
}
h1, h2, h3 { font-family: 'Helvetica Neue', sans-serif; color: #1a1a1a; }
blockquote { margin: 1.5rem 0; padding: 1rem 1.5rem; background: #f9f9f9; border-left: 5px solid #0077b6; font-style: italic; }
table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; }
th, td { border: 1px solid #ddd; padding: 0.75rem; text-align: left; }
th { background: #0077b6; color: white; }
.epilogue { background: #f0f8ff; padding: 1.5rem; border-radius: 8px; margin-top: 2rem; }
.further-reading { font-size: 0.9rem; color: #555; margin-top: 3rem; }
@media (max-width: 600px) { .article { font-size: 16px; } table, th, td { font-size: 14px; } }
</style>