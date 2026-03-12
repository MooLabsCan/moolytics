<script setup lang="ts">
const props = defineProps({
  lang: { type: String, default: 'pt' }
})
</script>

<template>
  <article class="article">
    <h1>Infraestrutura pública, operação privada: o modelo que faz mais sentido para os trilhos de São Paulo</h1>

    <p>
      O debate entre transporte público estatal ou privado costuma ser apresentado como um dilema ideológico.
      Na prática, porém, a experiência internacional mostra que a pergunta correta não é <em>“público ou privado?”</em>,
      mas sim <strong>quem deve assumir cada risco e cada função</strong>.
    </p>

    <p>
      No caso de sistemas ferroviários urbanos — metrôs, trens metropolitanos e monotrilhos —
      o modelo que mais consistentemente entrega bons resultados é claro:
      <strong>infraestrutura pública, com construção e operação privada sob contrato</strong>.
      São Paulo já caminha nessa direção, e deveria aprofundá-la.
    </p>

    <h2>Por que trilhos urbanos não funcionam como um mercado comum</h2>

    <p>
      Diferentemente de ônibus ou do transporte de cargas, sistemas sobre trilhos têm características
      de <strong>monopólio natural</strong>:
    </p>

    <ul>
      <li>Não faz sentido duplicar linhas paralelas para gerar “concorrência”;</li>
      <li>O valor do sistema depende da integração da rede como um todo;</li>
      <li>Tarifas são inevitavelmente influenciadas por decisões políticas e sociais.</li>
    </ul>

    <p>
      Isso torna inviável tanto a estatização total sem incentivos de eficiência,
      quanto a privatização plena com risco de demanda transferido ao operador.
    </p>

    <h2>Onde a iniciativa privada agrega mais valor</h2>

    <p>
      A evidência internacional é consistente: o setor privado performa melhor
      quando é responsável por <strong>execução, operação e manutenção</strong>,
      enquanto o poder público retém o controle estratégico.
    </p>

    <h3>1. Construção e expansão mais rápidas</h3>

    <p>
      Projetos financiados ou cofinanciados por PPPs tendem a:
    </p>

    <ul>
      <li>Ser entregues mais rapidamente;</li>
      <li>Ter maior controle de custos;</li>
      <li>Reduzir o peso do investimento inicial sobre o orçamento público.</li>
    </ul>

    <p>
      <strong>Madrid</strong> é um exemplo clássico: grande parte da expansão do metrô
      foi realizada com contratos de parceria que aceleraram a entrega de dezenas de quilômetros de linhas.
    </p>

    <h3>2. Operação mais eficiente e previsível</h3>

    <p>
      Operadores privados contratados com metas claras de desempenho
      tendem a apresentar:
    </p>

    <ul>
      <li>Maior pontualidade;</li>
      <li>Melhor manutenção dos ativos;</li>
      <li>Menor custo por trem-quilômetro.</li>
    </ul>

    <p>
      <strong>Estocolmo</strong> é um bom exemplo: o metrô é público,
      mas a operação é concedida a empresas privadas,
      com indicadores rígidos de qualidade e fiscalização forte do Estado.
    </p>

    <h2>O caso japonês: a exceção que confirma a regra</h2>

    <p>
      O Japão é frequentemente citado como prova de que sistemas ferroviários
      podem ser totalmente privados — e isso é verdade.
      Mas o modelo japonês funciona por razões muito específicas:
    </p>

    <ul>
      <li>Altíssima densidade urbana;</li>
      <li>Integração entre transporte e desenvolvimento imobiliário;</li>
      <li>Captura do valor da terra ao redor das estações;</li>
      <li>Estabilidade regulatória de longo prazo.</li>
    </ul>

    <p>
      Em outras palavras, o sucesso japonês depende de mecanismos
      de <strong>captura de valorização fundiária</strong>,
      algo que poucos países replicaram plenamente.
    </p>

    <h2>São Paulo: concessão é pragmatismo, não ideologia</h2>

    <p>
      Em São Paulo, a experiência com linhas concedidas mostra que:
    </p>

    <ul>
      <li>A infraestrutura pode continuar sendo do Estado;</li>
      <li>A política tarifária permanece pública;</li>
      <li>O operador privado é remunerado por desempenho, não por sorte.</li>
    </ul>

    <p>
      Quando o risco de demanda fica com o poder público — que é quem decide tarifas,
      integrações e subsídios — o operador pode focar no que sabe fazer melhor:
      <strong>operar bem</strong>.
    </p>

    <h2>Conclusão: o modelo que funciona</h2>

    <p>
      A melhor evidência internacional aponta para um consenso pragmático:
    </p>

    <ul>
      <li>🚆 Trilhos urbanos devem ser <strong>ativos públicos</strong>;</li>
      <li>🏗️ Construção e operação devem ser <strong>contratadas ao setor privado</strong>;</li>
      <li>📜 Contratos devem alinhar incentivos, não transferir riscos políticos;</li>
      <li>🏙️ Sempre que possível, o Estado deve capturar parte da valorização da terra.</li>
    </ul>

    <p>
      São Paulo não precisa escolher entre “Estado” ou “mercado”.
      Precisa escolher <strong>bons contratos, bons incentivos e boa governança</strong>.
      O caminho das concessões bem desenhadas não é uma concessão ideológica —
      é uma decisão baseada em evidência.
    </p>
  </article>
</template>

<style scoped>
.article { max-width: 900px; margin: 0 auto; }
.article h1 { margin-bottom: 0.75rem; }
.article h2 { margin-top: 1rem; }
.article h3 { margin-top: 0.75rem; }
.article p { margin: 0.5rem 0; line-height: 1.6; }
.article ul { margin: 0.25rem 0 0.75rem 1.25rem; }
</style>