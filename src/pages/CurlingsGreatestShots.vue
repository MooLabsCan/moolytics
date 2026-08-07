<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
const props = defineProps({ lang: { type: String, default: 'en' }, id: { type: String, default: 'curlings-greatest-shots' } })

const TITLES = {
  en: 'Curling’s Greatest Shots: Eight Throws That Decided Everything'
}
onMounted(() => { document.title = TITLES[props.lang] || TITLES.en })

const canonicalUrl = computed(() => `#/${['article', props.id, props.lang].filter(Boolean).join('/')}`)
const fullUrl = computed(() => window.location.origin + window.location.pathname + canonicalUrl.value)

const shareTitle = computed(() =>
    'Curling’s Greatest Shots: Eight Throws That Decided Everything'
)
const shareText = computed(() =>
    'From Al Hackner’s impossible double in the 1985 Brier to Niklas Edin’s “Super Spinner” in 2023 — eight verified, era-spanning curling shots that decided championships, and a few times just astonished the world anyway.'
)

const UI_STRINGS = {
  en: { share: 'Share', copyLink: 'Copy link', copied: 'Link copied!', promptCopy: 'Copy the link:', email: 'Email' }
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

const pubDate = new Date('2026-08-06T00:00:00Z')
const isoDate = '2026-08-06'
const LOCALES = {
  en: 'en-US'
}
const PUBLISHED_LABELS = {
  en: 'Published on'
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
        <h1>Curling’s Greatest Shots: Eight Throws That Decided Everything</h1>
        <div class="byline">
          <em>Moolytics — Sports History</em>
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

    <template>
<p>Curling looks, to the uninitiated, like a slow and gentle game: two teams sliding forty-pound stones down a sheet of ice toward a set of painted circles, brooms sweeping earnestly ahead of them. It is slow, in the way that chess is slow. It is gentle, in the way that a scalpel is gentle. Underneath the pleasantries — the handshakes, the “nice shot” murmured through gritted teeth — curling is a game of ruthless geometry, where a stone released a quarter-inch off line, or a half-second early on the release, misses by inches at the button and costs a championship.</p>
<p>A few terms will help. A team’s rocks stop, ideally, inside “the house,” the set of concentric painted rings; the stone closest to the exact center, the “button,” is lying shot rock and counts for a point (or several, if teammates are also closer than anything the other team has). A “guard” is a stone left in front of the house to shield rocks behind it from being hit. The team that doesn’t throw last in an end has “the hammer” on the next one — the enormous advantage of getting the final say. A “takeout” removes an opponent’s stone from play; a “draw” is a stone thrown with just enough weight to stop inside the rings without touching anything. Everything else — doubles, raises, freezes, in-offs — is a variation on those two ideas, played at the outer edge of what a human hand and a curved sheet of ice can be trusted to do.</p>
<p>Most competitive curling shots are not memorable. They are correct, which is a different thing. The shots that follow are the exceptions: the ones where a player looked at a nearly impossible geometry problem, under a championship’s worth of pressure, and solved it anyway. All eight are documented, dated, and attributable to a specific game — no folklore, no composite memories. They span thirty-eight years, four continents’ worth of curling nations, and both the men’s and women’s and mixed-doubles disciplines.</p>
<h2>1985: Al Hackner Finds the Sliver of Red</h2>
<p>The 1985 Labatt Brier — the Canadian men’s curling championship — came down to its final game in Moncton, New Brunswick, and it should not have been close. Pat Ryan’s Alberta rink led Al Hackner’s Northern Ontario team 5-3 heading into the tenth and final end, and Ryan had the hammer. In curling, that combination — a two-point lead and the other team throwing last — is close to a formality. Hackner’s team, from Thunder Bay, needed to score two just to survive into an extra end. With Ryan’s rocks guarding the house and almost no clean path to anything worth hitting, “just to survive” looked like wishful thinking.</p>
<p>What Hackner found, when it was his last rock, was a sliver — barely enough of an Alberta stone showing past a guard to be considered a target at all. He threaded his shooter through the opening, caught that exposed edge, and drove the front stone back into a second Alberta rock sitting well behind it, a double takeout that cleared both counters and scored Northern Ontario the two points it needed. It tied the game 5-5 and forced an extra end. Ryan, with a chance to win it outright on his last rock of the eleventh, came up heavy; Hackner’s team stole the point and the championship, 6-5.</p>
<p>Curling commentary still calls it simply “the Hackner double,” and it is routinely cited, four decades later, as the shot that changed how Canadians thought about what was makeable under pressure. Hackner, who curling people would later nickname “the Iceman” for the calm with which he played it, has said the shot required him to trust a read of the ice that he’d only half-believed himself.</p>
<h2>1997: Sandra Schmirler Banks One Off Her Own Rock</h2>
<p>A dozen years later, in Brandon, Manitoba, Sandra Schmirler faced a problem that had no direct solution. It was the final of the 1997 Canadian Olympic Curling Trials — the winner would represent Canada at the 1998 Nagano Games, the first Olympics ever to award full medals in curling — and Schmirler’s rink was down 4-3 to Shannon Kleibrink in the seventh end. Kleibrink’s shot rock sat buried in the four-foot, protected by a guard that left no straight line to it from anywhere on the sheet.</p>
<p>Schmirler’s answer was to stop looking for a straight line. She had a stone of her own already resting near the top of the twelve-foot ring, and she used it as a bank. She threw wide — well outside where the target actually sat — caught the inside edge of her own rock, and let the collision redirect her shooter sideways and back into the house, in behind the guard, where it struck Kleibrink’s counter out of the rings entirely. Her own shooter slid into the space it had just vacated. It scored three points off a shot that, from the moment she released it, was not aimed anywhere near where it needed to end up.</p>
<p>Schmirler’s team pulled away after that, winning 9-6 and punching their ticket to Nagano, where they beat Denmark for Canada’s first Olympic gold in women’s curling. Kleibrink herself would later say the opening was hers to give away — a guard set a fraction too casually — but what Schmirler did with the gap it left is the part curling still talks about. It is usually referred to, with a certain reverence, as simply “the shot.” Both her in-off and Hackner’s double are precise enough, geometrically, that a mobile curling simulator has since rebuilt them stone-for-stone as playable challenges, letting anyone try to find the same angles Schmirler and Hackner found live.</p>
<h2>2005: Jennifer Jones and “The Shot”</h2>
<p>Jennifer Jones’s rink had never won a Scotties Tournament of Hearts — the Canadian women’s championship — when they reached the 2005 final against Ontario’s Jenn Hanna. In the deciding end, Ontario’s shot rock sat buried behind a wall of guards, with no direct angle available to touch it. Jones’s read of the sheet turned a stone sitting well outside the rings, an unrelated corner guard, into the tool she needed: she sent her final rock into that guard at an angle, let it deflect off the collision, and rode the carom onto the button, bumping Hanna’s counter out of the rings on the way in. It was worth four points and Manitoba’s first Scotties title under Jones, who went on to become one of the most decorated skips in the sport’s history.</p>
<p>Curling broadcasters still refer to it, without qualification, as “the shot” — a title made almost inevitable by how often it has been replayed since.</p>
<h2>2009: Glenn Howard’s One-in-a-Million</h2>
<p>Not every legendary shot happens on the final rock of a championship. Glenn Howard’s came in a round-robin game at the 2009 Tim Hortons Brier in Calgary, against Saskatchewan’s Joel Jordison, and it was a shot that by any normal accounting shouldn’t have existed. Howard was down two points on his own last stone, staring at two Saskatchewan rocks positioned too far apart and too evenly weighted for a conventional double takeout to reach both.</p>
<p>His team’s third, Richard Hart, later described what Howard actually threw as an angle-raise double redirect: the shooter struck one of Howard’s own stones first, deflecting that Ontario rock into the nearer Saskatchewan counter and removing it, while the shooter itself caromed off the same collision onto the second Saskatchewan stone, removing that one too — and both of Howard’s rocks stayed in the house. Instead of conceding two, Howard scored three. He called it, without much argument from anyone who saw it, a one-in-a-million shot, and it won the Brier’s Shot of the Week award that year.</p>
<h2>2014: Mike McEwen’s Triple Raise</h2>
<p>Grand Slam of Curling events don’t carry Olympic or world-championship stakes, but they draw the same players, and in 2014, at the Masters event in Selkirk, Manitoba, Mike McEwen produced a shot that ESPN’s headline writers simply called the best curling shot they had ever seen. His Winnipeg rink trailed Brad Gushue’s St. John’s team 6-2 after Gushue had scored four in the fifth end. Facing a similarly lopsided end, McEwen instead played what Curling Canada described as a double raise in-out double — a chain of collisions in which his shooter and his own guard rocks redirected off one another to clear Gushue’s counters in sequence, a shot with enough moving parts that it is genuinely difficult to describe without watching it.</p>
<p>It scored McEwen four points and tied the game 6-6. Gushue’s rink ultimately won the final 8-6 — a reminder that the shots people remember longest are not always the ones that decide who lifts the trophy.</p>
<h2>2018: John Shuster’s Five-Ender in Korea</h2>
<p>American curling had never won an Olympic medal of any color before the 2018 Pyeongchang Games. In the gold-medal game against Sweden’s Niklas Edin, John Shuster’s rink found themselves tied 5-5 entering the eighth end, with Shuster holding his last rock and two Swedish stones sitting in position to blunt whatever he tried. He threw a double takeout that cleared both of them, leaving five American stones counting in a single end — a “five-ender,” a scoreline rare enough in championship curling that it had only happened once before in an Olympic final.</p>
<p>The five points put the United States up 10-5, and Shuster’s team closed it out 10-7 for the country’s first Olympic curling gold. It transformed a team that had, a few years earlier, nearly been dropped by USA Curling’s own high-performance program into national headlines.</p>
<h2>2022: Stefania Constantini Clears the House for Italy</h2>
<p>Mixed doubles curling — two players per team, a faster and stranger variant of the traditional game — had only been an Olympic event since 2018 when Italy’s Stefania Constantini and Amos Mosaner reached the gold-medal game at the 2022 Beijing Games against Norway’s Kristin Skaslien and Magnus Nedregotten. Italy led 7-5 in the final end, but Norway had two stones positioned to force extra ends if they survived Constantini’s last throw.</p>
<p>They didn’t survive it. Constantini’s final stone was a double takeout that removed both Norwegian rocks in one throw, with Mosaner sweeping it into exactly the weight it needed. Italy stole an additional point and won 8-5 — the country’s first Olympic medal in curling of any color, arriving as gold in only the second Olympic mixed doubles tournament ever held.</p>
<h2>2023: Niklas Edin’s “Super Spinner”</h2>
<p>The most technically outlandish shot on this list did not win a championship, or even a game. Sweden’s Niklas Edin, five years removed from his Olympic final loss to Shuster and by then the most decorated skip in modern men’s curling, was undefeated through the round robin of the 2023 World Men’s Championship in Ottawa when his team faced Norway’s Magnus Ramsfjell. Sweden needed two points to tie the score, but Norway’s counting stone was frozen — touching, with essentially zero gap — against a Swedish rock, with no conventional angle available to separate them without disturbing everything else on the sheet.</p>
<p>Edin’s solution was to throw an extreme amount of curl, far beyond what players normally attempt, spinning the rock hard enough that it ticked the frozen Norwegian stone off its resting spot by what commentators estimated at a few centimeters — promoting the Swedish rock to shot and scoring the second point — without touching, or even threatening, anything else in the house. Watching it happen live, broadcaster and former champion Russ Howard told viewers it was the best shot he had seen in his life. Sweden still lost the game 9-8; the shot, remarkable as it was, only tied one end, and Norway found the points to win it back. Curling media has called it the “Super Spinner” ever since, and it is now frequently cited as the single greatest shot in the sport’s history — proof that in curling, as in most things worth watching closely, the moment that gets remembered and the final score are not always telling the same story.</p>
<h2>What Connects Them</h2>
<p>Read together, these eight shots don’t share an era, a country, or even a gender division — they run from an Ontario-Alberta Brier final in 1985 to a Swedish spin experiment in 2023, by way of Manitoba, South Korea, and Beijing. What they share is the shape of the moment: a player looking at a sheet of ice that offered, on its face, no good option, and finding one anyway, using nothing but the physics of a stone sliding on pebbled ice and forty years of accumulated feel for how it behaves. That is the whole appeal of curling to the people who love it — not the brooms, not the shouting, but the fact that somewhere under all of it is a genuinely hard geometry problem, solved in real time, in front of everyone.</p>
<div style="margin-top:2.5rem;padding:1.25rem 1.5rem;border:1px solid var(--color-border);border-radius:8px;background:var(--color-background-soft);">
  <p style="margin:0;font-size:0.95rem;line-height:1.6;"><strong>Want to try these angles yourself?</strong> Curling Ice, a free physics-based curling simulator for Android, iOS, and web, has rebuilt several of the shots above, including Hackner’s double and Schmirler’s in-off, as playable challenges. <a href="https://curling.liap.ca/install" target="_blank" rel="noopener">Play free at curling.liap.ca →</a></p>
</div>
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
</style>
