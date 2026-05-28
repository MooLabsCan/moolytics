<script setup>
import { computed, ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import MarxVsGeorge from './MarxVsGeorge.vue'
import MarxVsGeorge2 from './MarxVsGeorge2.vue'
const props = defineProps({ lang: { type: String, default: 'en' }, id: { type: String, default: 'marx-george-intro' } })

const canonicalUrl = computed(() => `#/article/${props.id}`)
const fullUrl = computed(() => window.location.origin + window.location.pathname + canonicalUrl.value)
const shareTitle = 'The Great Debate: Marx vs. George — Introduction (The Standard, 1887)'
const shareText = 'An introduction to the fictional 1887 debate between Karl Marx and Henry George on land, labour, and the root of human misery — published in two accounts by The Standard.'

const showShareMenu = ref(false)
const shareMenuEl = ref(null)
const isOpen = ref(false)
const selectedVersion = ref(null)
const articleRef = ref(null)

function selectVersion(v) {
  selectedVersion.value = v
  nextTick(() => articleRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
}

function onDocumentClick(e) {
  if (!showShareMenu.value) return
  if (shareMenuEl.value && !shareMenuEl.value.contains(e.target)) showShareMenu.value = false
}
function handleKeydown(e) {
  if (selectedVersion.value) return
  if (e.key === 'ArrowRight' && !isOpen.value) isOpen.value = true
  if (e.key === 'ArrowLeft' && isOpen.value) isOpen.value = false
}
onMounted(() => {
  document.addEventListener('click', onDocumentClick)
  document.addEventListener('keydown', handleKeydown)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', onDocumentClick)
  document.removeEventListener('keydown', handleKeydown)
})

async function onShareClick() {
  try { if (navigator.share) { await navigator.share({ title: shareTitle, text: shareText, url: fullUrl.value }); return } } catch {}
  showShareMenu.value = true
}
async function copyLink() {
  try { await navigator.clipboard.writeText(fullUrl.value); alert('Link copied!') } catch { prompt('Copy the link:', fullUrl.value) }
}
const encodedUrl = computed(() => encodeURIComponent(fullUrl.value))
const encodedTitle = encodeURIComponent(shareTitle)
const encodedText = encodeURIComponent(shareText)
</script>

<template>
  <div class="np-wrapper">

    <!-- Digital chrome bar -->
    <div class="digital-bar" ref="shareMenuEl">
      <span class="digital-label">Moolytics &mdash; Historical Archive</span>
      <div style="position:relative;">
        <button class="share-btn" @click="onShareClick">Share</button>
        <div v-if="showShareMenu" class="share-menu" role="menu">
          <button class="share-item" role="menuitem" @click="copyLink">Copy link</button>
          <a class="share-item" role="menuitem" :href="`mailto:?subject=${encodedTitle}&body=${encodedText}%0A%0A${encodedUrl}`" target="_blank" rel="noopener">Email</a>
          <a class="share-item" role="menuitem" :href="`https://x.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`" target="_blank" rel="noopener">X / Twitter</a>
          <a class="share-item" role="menuitem" :href="`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`" target="_blank" rel="noopener">LinkedIn</a>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════ -->
    <!--                    SPREAD CONTAINER                     -->
    <!-- ═══════════════════════════════════════════════════════ -->
    <div class="spread-container" :class="{ 'is-open': isOpen }">

      <!-- ═══ PAGE LEFT — TITLE / COVER PAGE ═══ -->
      <article class="page page-left">

        <!-- ── MASTHEAD ── -->
        <div class="masthead">
          <div class="mast-top-row">
            <span>Vol. I. &mdash; No. 42</span>
            <span class="mast-orn">&#10022; &ensp; &#10022; &ensp; &#10022;</span>
            <span>Price: Two Cents</span>
          </div>
          <div class="mast-title">The Standard</div>
          <div class="mast-founded">Founded &amp; Conducted by Henry George</div>
          <div class="mast-motto">&ldquo;The Earth belongs in usufruct to the living.&rdquo; &mdash; Thomas Jefferson</div>
          <div class="mast-date">New York &amp; London &nbsp;&#9830;&nbsp; Saturday, the 13th of November, 1887</div>
          <div class="mast-supp">A Special Supplement &mdash; The London Debates of November, 1887</div>
        </div>

        <div class="rule-dbl"></div>

        <!-- ── HEADLINE ── -->
        <div class="hl-block">
          <div class="kicker">The Standard Presents &mdash; A Complete Transcript in Eleven Rounds</div>
          <div class="hl-super">A Great Debate Recalled</div>
          <div class="hl-main">Marx &amp; George</div>
          <div class="hl-deck-1">Karl Marx &amp; Henry George &mdash; London, November 1887</div>
          <div class="hl-rule"></div>
          <div class="hl-deck-2">Land, Labour, and the Root of Human Misery &mdash; Two Economists
            of Opposed Conviction Before Five Hundred Persons &mdash; Published in Two Separate Accounts</div>
          <div class="hl-deck-3">An Introduction by the Editors of The Standard, with Notes on the Participants,
            a Guide to the Rounds, and a Brief Word on Why Two Accounts Were Found Necessary</div>
        </div>

        <div class="rule-orn">&#10086; &ensp; &#8213;&#8213; &ensp; &#10086; &ensp; &#8213;&#8213; &ensp; &#10086;</div>

        <!-- ── NEWS BODY LEFT ── -->
        <div class="news-body news-body-left">

          <div class="col-labels col-labels-2">
            <span>Col. I</span><span>Col. II</span>
          </div>

          <figure class="news-figure">
            <img src="/9ede2c25-2dc5-48b3-93ef-00fc4c57ccfa.png"
                 alt="Mr. Karl Marx and Mr. Henry George in Public Debate at St. James's Hall, London" />
            <figcaption class="news-figure-cap">
              Mr. Karl Marx and Mr. Henry George in Public Debate at St. James&rsquo;s Hall,
              London. &mdash; <em>A Discussion on the True Source of Poverty and the Remedy
              for the Condition of Labour.</em> &mdash; Our Correspondent, November 1887.
            </figcaption>
          </figure>

          <p class="dispatch-lead"><span class="drop-cap">T</span><span class="place-date">here are moments</span> in the
            history of ideas when two thinkers who should have met are kept apart by circumstance, by pride, or by the
            simple geography of their respective urgencies. It has fallen to this journal &mdash; perhaps uniquely, given
            its position on both sides of the Atlantic &mdash; to correct one such absence.</p>

          <p>The debate here transcribed is a work of historical imagination. Its two participants &mdash; Mr. Karl Marx
            and Mr. Henry George &mdash; never, to the knowledge of this journal, shared a public platform. They were,
            however, the two men most directly concerned with the same problem in the same decade, and their theoretical
            disagreement was, and remains, among the most consequential in the literature of political economy. <em>(We
            note, for the scrupulous reader, that Mr. Marx departed this world in the spring of 1883. He is here restored
            to it for the purposes of the argument. No further apology is offered for this.)</em></p>

          <p>Mr. Marx had for thirty years been constructing the case that capitalism&rsquo;s capacity for exploitation
            was structural and fatal &mdash; embedded not in any individual institution but in the wage relationship
            itself. His analysis was genuinely acute: poverty and wealth did grow alongside each other; the working class
            was systematically impoverished; crisis was not exceptional but recurring. His remedy &mdash; the collective
            ownership of the means of production, the abolition of private capital, a transitional authority of
            sufficient power to remake the social order &mdash; was not modest, and he never intended it to be.</p>

          <p>Mr. George had arrived at many of the same observations by a different route and proposed a different
            explanation. The cause of poverty amid progress was not the wage relationship as such, but the monopolisation
            of land &mdash; the one factor of production that no man creates and no market can replicate. Tax the value
            of that land, return it to the community as an equal dividend to every citizen, and the great siphon that
            drains every advance of civilisation would at last be removed. What remained &mdash; markets, wages, private
            enterprise, the price system &mdash; was not the problem; it was, when properly grounded, the solution.</p>

          <p>These two men agreed on what was wrong. They disagreed, with uncommon sharpness, about where the knife had
            entered &mdash; and, consequently, about what would constitute a cure rather than an aggravation.</p>

          <h3 class="sec-head">A Note on Two Accounts</h3>

          <p>We publish this debate in two separate and distinct accounts, and we ask the reader&rsquo;s patience as we
            explain why.</p>

          <p>The first account imagines Mr. Marx as the interlocutor his finest arguments deserve &mdash; engaged,
            precise, willing in the end to concede what cannot honestly be denied. He is, in that account, occasionally
            volcanic, but always fundamentally present to the argument. The debate ends as one might hope such debates
            would end: with the closest thing to mutual recognition two proud men can manage.</p>

          <p>The second account follows, with greater fidelity to the historical record, the pattern of Mr. Marx&rsquo;s
            documented intellectual conduct. He was a man of extraordinary analytical power and, in personal exchange,
            of a particular and documented difficulty: when an opponent survived the first round of engagement, he was
            not re-engaged but reclassified. The argument was not refined; the arguer was categorised. By the fourth
            round, in our second account, Mr. Marx has stopped debating and begun prosecuting &mdash; and Mr. George,
            with remarkable composure, turns this observation itself into the evening&rsquo;s sharpest point.</p>

          <p>Both accounts are, in the end, arguments about the same thing: not merely land or capital, but what it means
            to hold a framework so tightly that evidence can no longer reach it &mdash; and what follows when such a
            framework acquires the power it seeks.</p>

          <p>The reader is invited to read both and to draw their own conclusions &mdash; not only about the economics,
            but about the man.</p>

          <p class="continued-notice"><em>(Continued overleaf &mdash; Col. III)</em></p>

        </div><!-- end news-body-left -->

        <div class="page-num">&#8212;&ensp;1&ensp;&#8212;</div>

        <button class="page-open-btn" @click="isOpen = true"
                :class="{ 'btn-hidden': isOpen }" aria-label="Open second page">
          Open &#10148;
        </button>

      </article>

      <!-- ═══ SPINE ═══ -->
      <div class="spine" aria-hidden="true"></div>

      <!-- ═══ PAGE RIGHT WRAPPER (animation clip) ═══ -->
      <div class="page-right-wrapper">
        <article class="page page-right">

          <!-- Running header (spread only) -->
          <div class="running-header">
            The Standard &mdash; Special Supplement &mdash; Saturday, 13th November, 1887
          </div>

          <div class="rule-sgl rule-sgl-rh"></div>

          <!-- ── NEWS BODY RIGHT ── -->
          <div class="news-body news-body-right">

            <div class="col-labels col-labels-2">
              <span>Col. III</span><span>Col. IV</span>
            </div>

            <h3 class="sec-head">The Participants</h3>

            <p><span class="bio-name">Mr. Karl Marx,</span> born 5th May 1818 in Trier, Prussia. Philosopher, economist,
              and author of <em>Das Kapital</em> (1867). Co-founder of the First International Working Men&rsquo;s
              Association. Lifelong correspondent with Friedrich Engels, without whose material support his theoretical
              work could not have continued. Spent the last decades of his life in London, revising unpublished manuscripts
              and watching the movement he had theorised struggle, imperfectly, toward realisation. His health, in the
              years before this imagined debate, was not good. His arguments, at their best, were formidable. Both things
              are true and neither should be forgotten.</p>

            <p><span class="bio-name">Mr. Henry George,</span> born 2nd September 1839 in Philadelphia. Journalist,
              economist, and author of <em>Progress and Poverty</em> (1879), which sold in quantities sufficient to
              embarrass most novelists and disturb most economists. Founder and editor of this journal, The Standard,
              established January 1887. Came within striking distance of the New York mayoralty in 1886, finishing second
              to Mr. Abram Hewitt and ahead of a young Mr. Theodore Roosevelt. Was, at the time of this imagined debate,
              at the height of his influence and in vigorous health. Died 29th October 1897, ten days before yet another
              mayoral election, essentially mid-sentence, still campaigning, still convinced that democracy could deliver
              what revolution cannot.</p>

            <h3 class="sec-head">Contents of This Supplement</h3>

            <div class="contents-table">
              <div class="ct-row"><span class="ct-title">Opening Statements</span><span class="ct-dots"></span><span class="ct-col">Column I</span></div>
              <div class="ct-row"><span class="ct-title">Round I &mdash; The Immigrant Experience</span><span class="ct-dots"></span><span class="ct-col">Column II</span></div>
              <div class="ct-row"><span class="ct-title">Round II &mdash; Surplus Value and the Land Question</span><span class="ct-dots"></span><span class="ct-col">Column III</span></div>
              <div class="ct-row"><span class="ct-title">Round III &mdash; Overproduction and the Outflow Valve</span><span class="ct-dots"></span><span class="ct-col">Column IV</span></div>
              <div class="ct-row"><span class="ct-title">Round IV &mdash; The Surgeon and the Executioner</span><span class="ct-dots"></span><span class="ct-col">Column V</span></div>
              <div class="ct-row"><span class="ct-title">Round V &mdash; Liberty, Property, and Real Ownership</span><span class="ct-dots"></span><span class="ct-col">Column VI</span></div>
              <div class="ct-row"><span class="ct-title">Round VI &mdash; Proportionality and Justice</span><span class="ct-dots"></span><span class="ct-col">Column VII</span></div>
              <div class="ct-row"><span class="ct-title">Round VII &mdash; Genius, Invention, and Free Minds</span><span class="ct-dots"></span><span class="ct-col">Column VIII</span></div>
              <div class="ct-row"><span class="ct-title">Round VIII &mdash; Terminal Contradictions</span><span class="ct-dots"></span><span class="ct-col">Column IX</span></div>
              <div class="ct-row"><span class="ct-title">Round IX &mdash; Scale, Bureaucracy, and Knowledge</span><span class="ct-dots"></span><span class="ct-col">Column X</span></div>
              <div class="ct-row"><span class="ct-title">Round X &mdash; What We Owe Each Other</span><span class="ct-dots"></span><span class="ct-col">Column XI</span></div>
              <div class="ct-row"><span class="ct-title">Round XI &mdash; Innovation and the Citizens&rsquo; Dividend</span><span class="ct-dots"></span><span class="ct-col">Column XII</span></div>
              <div class="ct-row ct-last"><span class="ct-title">Closing Statements</span><span class="ct-dots"></span><span class="ct-col">Column XIII</span></div>
            </div>

          </div><!-- end news-body-right -->

          <!-- ── VERSION SELECTION ── -->
          <div class="version-select-strip">
            <div class="vs-rule-top"></div>
            <div class="vs-head">Choose Your Account &mdash; Both Are Published in Full</div>
            <div class="vs-boxes">

              <div class="vs-box">
                <div class="vs-box-label">Version the First</div>
                <div class="vs-box-title">The Generous Account</div>
                <div class="vs-box-rule"></div>
                <p class="vs-box-desc">Mr. Marx is here portrayed as the interlocutor his finest arguments deserve
                  &mdash; engaged, exacting, and ultimately willing to concede what is true. The debate occasionally
                  grows heated; it never grows dishonest. The two men find, at the evening&rsquo;s close, that they
                  agree on more than either predicted.</p>
                <p class="vs-box-desc vs-box-note"><em>The debate as one might wish it had gone.</em></p>
                <div class="vs-actions">
                  <button class="vs-btn" :class="{ 'vs-btn-active': selectedVersion === 'v1' }" @click="selectVersion('v1')">Read &rarr;</button>
                </div>
              </div>

              <div class="vs-divider"></div>

              <div class="vs-box">
                <div class="vs-box-label">Version the Second</div>
                <div class="vs-box-title">The Historical Record</div>
                <div class="vs-box-rule"></div>
                <p class="vs-box-desc">Mr. Marx is here portrayed with greater fidelity to his documented temperament.
                  By the Fourth Round he has stopped engaging Mr. George&rsquo;s arguments and begun categorising the
                  man himself. Mr. George responds with a precision that grows, as the evening advances, into the
                  sharpest indictment of the night &mdash; not of Mr. Marx&rsquo;s economics, but of the style of
                  thought that produced them.</p>
                <p class="vs-box-desc vs-box-note"><em>One produced gulags. The other was never tried.</em></p>
                <div class="vs-actions">
                  <button class="vs-btn" :class="{ 'vs-btn-active': selectedVersion === 'v2' }" @click="selectVersion('v2')">Read &rarr;</button>
                </div>
              </div>

            </div>
            <div class="vs-rule-bot"></div>
          </div>

          <!-- Footer -->
          <div class="paper-footer">
            <div class="footer-hr"></div>
            <p class="footer-fn"><em>This is a work of speculative fiction. The Standard is reproduced here as a literary
              conceit. The historical setting is imagined; the arguments belong to the record of each man&rsquo;s
              published thought.</em></p>
            <div class="footer-hr"></div>
            <p class="footer-mast">The Standard &mdash; Henry George, Editor &mdash; New York, 1887</p>
          </div>

          <div class="page-num">&#8212;&ensp;2&ensp;&#8212;</div>

          <button class="page-close-btn" @click="isOpen = false" aria-label="Close second page">
            &#10148; Close
          </button>

        </article>
      </div><!-- end page-right-wrapper -->

    </div><!-- end spread-container -->

    <!-- Keyboard / interaction hint -->
    <div class="keyboard-hint">
      <span v-if="!isOpen">Press <kbd>&rarr;</kbd> or click <strong>Open</strong> to turn the page</span>
      <span v-else>Press <kbd>&larr;</kbd> or click <strong>Close</strong> to return to the cover</span>
    </div>

  </div><!-- end np-wrapper -->

  <div v-if="selectedVersion !== null" class="article-embed" ref="articleRef">
    <MarxVsGeorge v-if="selectedVersion === 'v1'" :lang="props.lang" :id="'marx-vs-george'" />
    <MarxVsGeorge2 v-else :lang="props.lang" :id="'marx-vs-george-2'" />
  </div>
</template>

<!-- ─────────────────────────────────────────────────────────── -->
<!-- Global: font imports (not scoped so @import works)         -->
<!-- ─────────────────────────────────────────────────────────── -->
<style>
@import url('https://fonts.googleapis.com/css2?family=IM+Fell+English+SC&family=Unna:ital,wght@0,400;0,700;1,400;1,700&display=swap');
</style>

<style scoped>
/* ═══════════════════════════════════════════════════════════════
   READING SURFACE — Dark mahogany table / museum vitrine
   ═══════════════════════════════════════════════════════════════ */
.np-wrapper {
  margin: 0;
  background: #1c1208;
  background-image:
    radial-gradient(ellipse 80% 65% at 50% 38%, #2c1a08 0%, #1c1208 68%);
  padding: 0.9rem 0.75rem 2.5rem;
  position: relative;
  min-height: 100vh;
  min-width: 100vw;
}

/* Glass overlay — faint diagonal highlight reads as "there is glass here" */
.np-wrapper::after {
  content: '';
  position: fixed;
  inset: 0;
  background: linear-gradient(
    138deg,
    rgba(255,255,255,0.025) 0%,
    rgba(255,255,255,0.005) 45%,
    transparent 60%,
    rgba(0,0,0,0.035) 100%
  );
  pointer-events: none;
  z-index: 999;
}

/* ═══════════════════════════════════════════════════════════════
   DIGITAL CHROME BAR
   ═══════════════════════════════════════════════════════════════ */
.digital-bar {
  max-width: 640px; margin: 0 auto 0.55rem;
  display: flex; justify-content: space-between; align-items: center;
  font-size: 0.68rem; color: rgba(155,125,72,0.7);
}
.digital-label { font-style: italic; opacity: 0.8; }
.share-btn {
  border: 1px solid rgba(155,125,72,0.4); background: transparent;
  border-radius: 3px; padding: 0.18rem 0.5rem; cursor: pointer;
  font-size: 0.68rem; color: rgba(155,125,72,0.8);
}
.share-menu {
  position: absolute; right: 0; top: calc(100% + 4px); min-width: 150px;
  border: 1px solid #c8a86a; background: #f5e8c0;
  border-radius: 4px; box-shadow: 0 4px 16px rgba(0,0,0,0.4); padding: 0.2rem; z-index: 50;
}
.share-item {
  display: block; width: 100%; text-align: left; padding: 0.38rem 0.5rem;
  background: transparent; border: none; color: #2e1e06;
  text-decoration: none; cursor: pointer; border-radius: 3px; font-size: 0.73rem;
}
.share-item:hover { background: rgba(74,48,16,0.1); }

/* ═══════════════════════════════════════════════════════════════
   SPREAD CONTAINER
   ═══════════════════════════════════════════════════════════════ */
.spread-container {
  display: block;
  max-width: 860px;
  margin: 0 auto;
}

/* ═══════════════════════════════════════════════════════════════
   PAGES — Shared paper styles
   ═══════════════════════════════════════════════════════════════ */
.page {
  /* Aged cream paper colour */
  background-color: #f4e6bb;
  /* SVG feTurbulence paper grain blended multiply into the cream */
  background-image:
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.38'/%3E%3C/svg%3E");
  background-blend-mode: multiply;
  background-size: 200px 200px;

  color: #0f0803;
  font-family: 'Unna', Georgia, 'Times New Roman', Times, serif;
  padding: 1.9rem 2rem 1.6rem;
  position: relative;

  /* Drop shadow lifts page off the table; inset shadow = vignette */
  box-shadow:
    0 12px 55px rgba(0,0,0,0.72),
    0 3px 12px rgba(0,0,0,0.38),
    inset 0 0 70px rgba(0,0,0,0.06);
}

/* Foxing / oxidation spots — very subtle, purely atmospheric */
.page::after {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 50% 42% at 7% 94%, rgba(115,72,12,0.07) 0%, transparent 65%),
    radial-gradient(ellipse 38% 32% at 96% 4%,  rgba(130,88,18,0.05) 0%, transparent 55%),
    radial-gradient(ellipse 120% 120% at 50% 50%, transparent 52%, rgba(0,0,0,0.1) 100%);
  pointer-events: none;
}

/* ═══════════════════════════════════════════════════════════════
   MASTHEAD
   ═══════════════════════════════════════════════════════════════ */
.masthead {
  text-align: center;
  padding-bottom: 0.55rem;
  border-bottom: 3px double #4a3010;
}
.mast-top-row {
  display: flex; justify-content: space-between;
  font-size: 0.63rem; font-variant: small-caps; letter-spacing: 0.08em;
  color: #5c3d10; margin-bottom: 0.38rem;
}
.mast-orn { color: #7a5c28; }
.mast-title {
  font-family: 'IM Fell English SC', Georgia, serif;
  font-size: clamp(2rem, 5.8vw, 4rem);
  letter-spacing: 0.22em;
  text-transform: uppercase; line-height: 1;
  margin: 0.1rem 0; color: #0a0600;
  text-shadow: 0 0 1.5px rgba(0,0,0,0.28);
}
.mast-founded {
  font-size: 0.67rem; font-variant: small-caps;
  letter-spacing: 0.12em; color: #5c3d10; margin: 0.15rem 0;
}
.mast-motto {
  font-size: 0.63rem; font-style: italic; color: #6b4c1a; margin: 0.14rem 0;
}
.mast-date {
  font-size: 0.67rem; font-variant: small-caps;
  letter-spacing: 0.1em; color: #2e1e06; margin: 0.18rem 0;
}
.mast-supp {
  font-size: 0.59rem; font-variant: small-caps; letter-spacing: 0.08em; color: #6b4c1a;
  border-top: 1px solid #9b7d48; border-bottom: 1px solid #9b7d48;
  padding: 0.14rem 0; margin-top: 0.32rem;
}

/* ═══════════════════════════════════════════════════════════════
   RULES & ORNAMENTS
   ═══════════════════════════════════════════════════════════════ */
.rule-dbl { border: none; border-top: 3px double #4a3010; margin: 0.48rem 0 0.28rem; }
.rule-sgl  { border: none; border-top: 1px solid #9b7d48; margin: 0.38rem 0; }
.rule-sgl-rh { margin: 0.25rem 0 0.45rem; }
.rule-orn {
  text-align: center; color: #9b7d48; font-size: 0.72rem;
  margin: 0.3rem 0 0; letter-spacing: 0.2em;
}

/* ═══════════════════════════════════════════════════════════════
   HEADLINE BLOCK
   ═══════════════════════════════════════════════════════════════ */
.hl-block { text-align: center; padding: 0.42rem 0 0.28rem; }
.kicker {
  font-size: 0.6rem; font-variant: small-caps;
  letter-spacing: 0.16em; color: #6b4c1a; margin-bottom: 0.18rem;
}
.hl-super {
  font-size: 0.92rem; font-variant: small-caps;
  letter-spacing: 0.14em; color: #4a3010; margin-bottom: 0.08rem;
}
.hl-main {
  font-family: 'IM Fell English SC', Georgia, serif;
  font-size: clamp(2.1rem, 6.5vw, 3.9rem);
  text-transform: uppercase; letter-spacing: 0.2em;
  line-height: 1.0; color: #0a0600; margin: 0.08rem 0;
  text-shadow: 0 0 1.5px rgba(0,0,0,0.32);
}
.hl-deck-1 {
  font-size: 0.88rem; font-variant: small-caps; letter-spacing: 0.06em;
  font-weight: 700; color: #2e1e06; margin: 0.28rem 0 0.18rem;
}
.hl-rule { width: 44%; margin: 0.28rem auto; border-top: 1px solid #9b7d48; }
.hl-deck-2 {
  font-size: 0.75rem; font-style: italic; color: #3a2608;
  line-height: 1.52; margin: 0.18rem auto; max-width: 92%;
}
.hl-deck-3 {
  font-size: 0.67rem; color: #5c3d10; line-height: 1.45;
  margin: 0.2rem auto 0; max-width: 88%;
}

/* ═══════════════════════════════════════════════════════════════
   COLUMN LABELS
   ═══════════════════════════════════════════════════════════════ */
.col-labels {
  display: none; /* shown only on desktop via media query */
  justify-content: space-around;
  font-size: 0.52rem; font-variant: small-caps; letter-spacing: 0.1em;
  color: #9b7d48; margin-bottom: 0.18rem;
  border-bottom: 0.5px solid #c8a86a; padding-bottom: 0.1rem;
  column-span: all;
}

/* ═══════════════════════════════════════════════════════════════
   NEWS BODY
   ═══════════════════════════════════════════════════════════════ */
.news-body {
  column-gap: 1.3rem;
  column-rule: 0.5px solid #c8a86a;
  text-align: justify; hyphens: auto; -webkit-hyphens: auto;
  font-size: 0.79rem; line-height: 1.6; color: #0f0803;
  margin-top: 0.5rem; orphans: 4; widows: 4;
  -webkit-font-smoothing: none; /* slight roughness — letterpress feel */
}
.news-body-left  { column-count: 3; }
.news-body-right { column-count: 2; }
.news-body p { margin: 0 0 0.42rem; }

/* Drop cap */
.drop-cap {
  float: left;
  font-family: 'IM Fell English SC', Georgia, serif;
  font-size: 3.9em; line-height: 0.69;
  margin: 0.07em 0.07em 0 0;
  color: #0a0600;
}
.place-date { font-variant: small-caps; font-weight: 700; letter-spacing: 0.05em; }
.dispatch-lead { margin-bottom: 0.48rem; }

/* Illustration */
.news-figure {
  column-span: all;
  margin: 0 0 0.52rem;
  padding: 0.4rem 0 0.42rem;
  border-top: 3px double #4a3010;
  border-bottom: 3px double #4a3010;
  text-align: center;
}
.news-figure img {
  max-width: 100%; height: auto; display: block; margin: 0 auto;
  opacity: 0.88;
  filter: sepia(0.55) contrast(0.95) brightness(0.94);
  mix-blend-mode: multiply;
}
.news-figure-cap {
  font-size: 0.59rem; font-style: italic; color: #5c3d10;
  margin-top: 0.24rem; line-height: 1.42; text-align: center;
  max-width: 88%; margin-left: auto; margin-right: auto;
}

/* Section headings */
.sec-head {
  font-size: 0.73rem; font-variant: small-caps; font-weight: 700; letter-spacing: 0.16em;
  text-align: center; color: #2e1e06;
  border-top: 2px solid #4a3010; border-bottom: 1px solid #9b7d48;
  padding: 0.17rem 0; margin: 0.65rem 0 0.34rem;
  column-span: all;
}
.bio-name { font-variant: small-caps; font-weight: 700; letter-spacing: 0.07em; }
.continued-notice {
  text-align: right; font-size: 0.6rem; color: #9b7d48;
  margin-top: 0.25rem; column-span: all;
}

/* Running header (right page, spread only) */
.running-header {
  display: none;
  text-align: center; font-size: 0.59rem; font-variant: small-caps;
  letter-spacing: 0.1em; color: #9b7d48; margin-bottom: 0.28rem;
}

/* ═══════════════════════════════════════════════════════════════
   CONTENTS TABLE
   ═══════════════════════════════════════════════════════════════ */
.contents-table {
  border: 1px solid #9b7d48; padding: 0.32rem 0.52rem; margin: 0.28rem 0 0.4rem;
  background: rgba(74,48,16,0.03);
  column-span: all;
}
.ct-row {
  display: flex; align-items: baseline; font-size: 0.69rem;
  border-bottom: 1px dotted #c8a86a; padding: 0.11rem 0;
}
.ct-last { border-bottom: none; }
.ct-title { flex-shrink: 0; font-variant: small-caps; font-size: 0.66rem; color: #2e1e06; }
.ct-dots { flex: 1; border-bottom: 1px dotted #9b7d48; margin: 0 0.28rem; position: relative; top: -0.14rem; }
.ct-col  { flex-shrink: 0; font-variant: small-caps; font-size: 0.62rem; color: #6b4c1a; letter-spacing: 0.05em; }

/* ═══════════════════════════════════════════════════════════════
   VERSION SELECTION
   ═══════════════════════════════════════════════════════════════ */
.version-select-strip { margin-top: 1rem; }
.vs-rule-top { border-top: 3px double #4a3010; margin-bottom: 0.52rem; }
.vs-rule-bot { border-top: 3px double #4a3010; margin-top: 0.52rem; }
.vs-head {
  font-family: 'IM Fell English SC', Georgia, serif;
  text-align: center; font-variant: small-caps; font-size: 0.88rem;
  letter-spacing: 0.16em; color: #0a0600; font-weight: 700; margin-bottom: 0.7rem;
  border-bottom: 1px solid #9b7d48; padding-bottom: 0.35rem;
}
.vs-boxes { display: flex; gap: 0; align-items: stretch; }
.vs-box {
  flex: 1; padding: 0.85rem 0.88rem 0.95rem;
  border: 1.5px solid #7a5c28; background: rgba(74,48,16,0.04);
  display: flex; flex-direction: column;
}
.vs-divider { width: 1.5px; background: #7a5c28; flex-shrink: 0; }
.vs-box-label {
  font-variant: small-caps; font-size: 0.62rem; letter-spacing: 0.1em;
  color: #6b4c1a; margin-bottom: 0.2rem;
}
.vs-box-title {
  font-family: 'IM Fell English SC', Georgia, serif;
  font-size: 1.05rem; font-variant: small-caps; letter-spacing: 0.09em;
  color: #0a0600; margin-bottom: 0.28rem;
}
.vs-box-rule { border-top: 1px solid #9b7d48; margin-bottom: 0.38rem; }
.vs-box-desc {
  font-size: 0.72rem; line-height: 1.52; color: #2e1e06;
  margin-bottom: 0.3rem; text-align: justify; hyphens: auto;
}
.vs-box-note { font-size: 0.67rem; color: #6b4c1a; }
.vs-btn {
  display: inline-block; margin-top: auto; padding: 0.38rem 0.9rem;
  border: 1.5px solid #4a3010; color: #0a0600; text-decoration: none;
  font-variant: small-caps; letter-spacing: 0.1em; font-size: 0.71rem; font-weight: 700;
  font-family: 'Unna', Georgia, 'Times New Roman', Times, serif;
  background: rgba(74,48,16,0.06); align-self: flex-start;
  transition: background 0.15s; cursor: pointer;
}
.vs-btn:hover, .vs-btn-active { background: rgba(74,48,16,0.2); }

.article-embed :deep(.np-wrapper) { margin: 0; }

/* ═══════════════════════════════════════════════════════════════
   VERSION BOX ACTIONS
   ═══════════════════════════════════════════════════════════════ */
.vs-actions {
  display: flex; gap: 0.45rem; align-items: center; margin-top: auto; flex-wrap: wrap;
}
.vs-listen-btn {
  display: inline-block; padding: 0.38rem 0.75rem;
  border: 1.5px solid rgba(74,48,16,0.45); color: #4a3010;
  font-variant: small-caps; letter-spacing: 0.1em; font-size: 0.71rem; font-weight: 700;
  font-family: 'Unna', Georgia, 'Times New Roman', Times, serif;
  background: transparent; cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
}
.vs-listen-btn:hover  { background: rgba(74,48,16,0.1); border-color: #4a3010; }
.vs-listen-active     { background: rgba(74,48,16,0.18) !important; border-color: #4a3010 !important; }

/* ═══════════════════════════════════════════════════════════════
   TTS PLAYER BAR — fixed bottom
   ═══════════════════════════════════════════════════════════════ */
.tts-player {
  position: fixed; bottom: 0; left: 0; right: 0; z-index: 1100;
  background: #0f0703;
  border-top: 2px solid #9b7d48;
  padding: 0.5rem 1.25rem 0.6rem;
  font-family: 'Unna', Georgia, 'Times New Roman', Times, serif;
  display: flex; flex-direction: column; gap: 0.28rem;
  box-shadow: 0 -4px 24px rgba(0,0,0,0.55);
}
.tts-edition {
  font-size: 0.58rem; font-variant: small-caps; letter-spacing: 0.13em;
  color: rgba(155,125,72,0.65); text-align: center;
}
.tts-now {
  display: flex; align-items: baseline; gap: 0.55rem; flex-wrap: wrap;
  min-height: 1.3em;
}
.tts-spkr {
  font-size: 0.68rem; font-variant: small-caps; font-weight: 700;
  letter-spacing: 0.14em; flex-shrink: 0;
}
.tts-spkr.george { color: #c8a86a; }
.tts-spkr.marx   { color: #a06040; }
.tts-line-text {
  font-size: 0.71rem; font-style: italic; color: rgba(200,168,106,0.75);
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1;
}
.tts-controls {
  display: flex; align-items: center; gap: 0.6rem;
}
.tts-btn {
  font-family: 'Unna', Georgia, 'Times New Roman', Times, serif;
  font-variant: small-caps; font-size: 0.65rem; letter-spacing: 0.1em;
  background: transparent; border: 1px solid rgba(155,125,72,0.45);
  color: #c8a86a; padding: 0.22rem 0.65rem; cursor: pointer;
  transition: background 0.15s;
}
.tts-btn:hover { background: rgba(155,125,72,0.12); }
.tts-stop-btn { border-color: rgba(160,96,64,0.5); color: #a06040; }
.tts-stop-btn:hover { background: rgba(160,96,64,0.12); }
.tts-progress {
  font-size: 0.6rem; font-variant: small-caps; letter-spacing: 0.08em;
  color: rgba(155,125,72,0.5); margin-left: auto;
}

/* loading state */
.tts-loading {
  font-size: 0.68rem; font-style: italic; letter-spacing: 0.08em;
  color: rgba(200,168,106,0.6); animation: tts-pulse 1.4s ease-in-out infinite;
}
@keyframes tts-pulse { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }

/* disabled state */
.tts-btn:disabled { opacity: 0.4; cursor: default; }

/* error toast — sits just above player bar */
.tts-error-toast {
  position: fixed; bottom: 0; left: 0; right: 0; z-index: 1099;
  background: #3a1208;
  border-top: 1px solid rgba(160,64,48,0.6);
  color: #e07060; font-family: 'Unna', Georgia, 'Times New Roman', Times, serif;
  font-size: 0.71rem; font-style: italic; letter-spacing: 0.04em;
  padding: 0.5rem 1.25rem;
  display: flex; align-items: center; justify-content: space-between;
}
.tts-err-close {
  background: transparent; border: none; color: rgba(160,96,80,0.7);
  font-size: 0.75rem; cursor: pointer; padding: 0 0.2rem;
}

/* slide-up transition */
.tts-slide-enter-active, .tts-slide-leave-active { transition: transform 0.3s ease, opacity 0.3s ease; }
.tts-slide-enter-from, .tts-slide-leave-to { transform: translateY(100%); opacity: 0; }

@media (min-width: 640px) {
  .tts-player { flex-direction: row; align-items: center; gap: 1.2rem; flex-wrap: wrap; }
  .tts-edition { text-align: left; white-space: nowrap; }
  .tts-now { flex: 1; }
  .tts-controls { flex-shrink: 0; }
  .tts-progress { margin-left: 0; }
}

/* ═══════════════════════════════════════════════════════════════
   FOOTER
   ═══════════════════════════════════════════════════════════════ */
.paper-footer {
  padding-top: 0.58rem; font-size: 0.7rem; color: #4a3010;
  text-align: center; line-height: 1.5;
}
.paper-footer p { margin: 0 0 0.28rem; }
.footer-hr { border: none; border-top: 1px solid #9b7d48; width: 54%; margin: 0.32rem auto; }
.footer-fn   { font-style: italic; font-size: 0.63rem; color: #9b7d48; }
.footer-mast { font-variant: small-caps; letter-spacing: 0.11em; font-size: 0.63rem; color: #6b4c1a; }

/* ═══════════════════════════════════════════════════════════════
   PAGE NUMBER
   ═══════════════════════════════════════════════════════════════ */
.page-num {
  text-align: center; font-size: 0.6rem; font-variant: small-caps;
  color: #9b7d48; letter-spacing: 0.12em; margin-top: 0.65rem;
  border-top: 0.5px solid #c8a86a; padding-top: 0.28rem;
  display: none; /* shown on desktop only */
}

/* ═══════════════════════════════════════════════════════════════
   OPEN / CLOSE BUTTONS
   ═══════════════════════════════════════════════════════════════ */
.page-open-btn,
.page-close-btn {
  display: none; /* desktop only */
  position: absolute;
  bottom: 1.1rem;
  background: rgba(74,48,16,0.07);
  border: 1px solid rgba(155,125,72,0.55);
  color: #9b7d48;
  font-variant: small-caps;
  font-family: 'Unna', Georgia, serif;
  font-size: 0.62rem;
  letter-spacing: 0.14em;
  padding: 0.28rem 0.65rem;
  cursor: pointer;
  border-radius: 2px;
  transition: background 0.2s, opacity 0.35s, color 0.2s;
  z-index: 5;
}
.page-open-btn { right: 1rem; }
.page-close-btn { left: 1rem; }
.page-open-btn:hover,
.page-close-btn:hover {
  background: rgba(74,48,16,0.15);
  color: #5c3d10;
}
.btn-hidden { opacity: 0; pointer-events: none; }

/* ═══════════════════════════════════════════════════════════════
   KEYBOARD HINT
   ═══════════════════════════════════════════════════════════════ */
.keyboard-hint {
  display: none; /* shown on desktop only */
  text-align: center;
  font-size: 0.58rem; font-variant: small-caps;
  color: rgba(155,125,72,0.55); letter-spacing: 0.1em;
  margin-top: 0.65rem;
}
kbd {
  font-family: 'Unna', Georgia, serif;
  border: 1px solid rgba(155,125,72,0.38); border-radius: 2px;
  padding: 0.04rem 0.28rem; font-size: 0.58rem;
}

/* ═══════════════════════════════════════════════════════════════
   TABLET — single page, all content flows together (700–1099px)
   ═══════════════════════════════════════════════════════════════ */
@media (max-width: 1099px) {
  .spread-container { display: block; max-width: 860px; margin: 0 auto; }
  .page-left, .page-right { width: 100%; }
  .page-right { margin-top: 0; }
  .page-right-wrapper { display: block; }
  .news-body-left { column-count: 3; }
  .news-body-right { column-count: 2; }
}

@media (max-width: 700px) {
  .news-body-left, .news-body-right { column-count: 2; }
  .page { padding: 1.5rem 1.2rem; }
  .np-wrapper { padding: 0.5rem 0 2rem; }
  .vs-boxes { flex-direction: column; }
  .vs-divider { width: 100%; height: 1.5px; }
}
@media (max-width: 480px) {
  .news-body-left, .news-body-right { column-count: 1; text-align: left; hyphens: none; }
  .page { padding: 1rem 0.9rem; }
  .np-wrapper { padding: 0.3rem 0 1.5rem; }
}

/* ═══════════════════════════════════════════════════════════════
   DESKTOP SPREAD — two pages, book-open animation (≥1100px)
   ═══════════════════════════════════════════════════════════════ */
@media (min-width: 1100px) {
  .np-wrapper { padding: 1.4rem 2rem 3rem; }
  .digital-bar { max-width: none; }

  .spread-container {
    display: flex;
    justify-content: center;
    align-items: stretch;
    max-width: 1400px;
    margin: 0 auto;
  }

  /* Both pages same fluid width, capped at 580px */
  .page-left, .page-right {
    width: clamp(360px, 43vw, 580px);
    flex-shrink: 0;
  }

  /* Spine — grows in when opened */
  .spine {
    width: 0;
    flex-shrink: 0;
    overflow: hidden;
    align-self: stretch;
    transition: width 0.75s cubic-bezier(0.4, 0, 0.2, 1);
    background: linear-gradient(
      to right,
      #090501 0%, #1a0b03 12%, #321a06 38%,
      #251404 50%,
      #321a06 62%, #1a0b03 88%, #090501 100%
    );
    position: relative; z-index: 10;
  }
  .is-open .spine { width: 14px; }

  /* Right page wrapper — clips and reveals via max-width transition */
  .page-right-wrapper {
    overflow: hidden;
    max-width: 0;
    flex-shrink: 0;
    transition: max-width 0.78s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .is-open .page-right-wrapper {
    max-width: 640px;
  }

  /* Left page body: 2 columns on the narrower page */
  .news-body-left  { column-count: 2; }
  .news-body-right { column-count: 2; }

  /* Restore desktop-only elements */
  .running-header { display: block; }
  .col-labels     { display: flex; }
  .page-num       { display: block; }
  .page-open-btn,
  .page-close-btn { display: block; }
  .keyboard-hint  { display: block; }
}
</style>
