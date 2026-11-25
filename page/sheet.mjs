// Lays the day out on one 1024 x 1024 sheet.
import { DAY, REGIONS, LEADS, TILES, BRIEFS, LEFT_OUT, ALL } from './stories.mjs';
import { SCENES } from './scenes.mjs';
import { projector, landPaths, spread } from './world.mjs';

const colourOf = Object.fromEntries(REGIONS.map((r) => [r.key, r.colour]));
const badge = (s) => `<b class="no" style="background:${colourOf[s.region]}">${s.n}</b>`;

function regionBar() {
  const count = (key) => ALL.filter((s) => s.region === key).length;
  return REGIONS.map((r) => `<span style="flex:${count(r.key) + 3};background:${r.colour}">${r.key} ${count(r.key)}</span>`).join('');
}

function picture(s, kind) {
  return `<figure class="${kind}"><div class="art">${SCENES[s.scene]()}<i class="chip">${s.chip}</i></div>
    <div class="kick">${badge(s)}<em style="color:${colourOf[s.region]}">${s.place} · ${s.field}</em><small>${s.src}</small></div>
    <h2>${s.head}</h2>${s.text ? `<p>${s.text}</p>` : ''}</figure>`;
}

const MAP = [284, 157];

function worldMap() {
  const place = projector(...MAP);
  const pins = ALL.filter((s) => s.at).map((s) => {
    const [x, y] = place(s.at);
    return { n: s.n, x, y, r: s.n <= 15 ? 7.4 : 3, colour: colourOf[s.region] };
  });
  const placed = spread(pins, (a, b) => (a.r + b.r) * 0.96);
  const dots = placed.filter((p) => p.n > 15).map((p) => `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${p.r}" fill="${p.colour}" stroke="#fff" stroke-width="1"/>`);
  const tags = placed.filter((p) => p.n <= 15).map((p) => `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${p.r}" fill="${p.colour}" stroke="#fff" stroke-width="1.2"/><text x="${p.x.toFixed(1)}" y="${(p.y + 3.9).toFixed(1)}" text-anchor="middle">${p.n}</text>`);
  return `<svg class="map" viewBox="0 0 ${MAP[0]} ${MAP[1]}"><rect width="${MAP[0]}" height="${MAP[1]}" fill="#d6e6ef"/>${landPaths(...MAP, '#c3b48f')}${dots.join('')}${tags.join('')}</svg>`;
}

function brief(s) {
  return `<li>${badge(s)}<span><strong style="color:${colourOf[s.region]}">${s.place}</strong> ${s.head} <small>${s.src}</small></span></li>`;
}

function dateCheck() {
  const gone = LEFT_OUT.map(([day, items]) => `<b>${day}</b> ${items.join(', ')}`).join(' · ');
  return `<div class="check"><b class="tick">DATE CHECK:</b> all ${ALL.length} stories happened, or were first reported, on <b>${DAY.weekday} ${DAY.date}</b>. Left out as older news: ${gone}.</div>`;
}

export function sheet(css) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${DAY.weekday} ${DAY.date}</title><style>${css}</style></head><body><main>
  <h1><span>${DAY.weekday} ${DAY.date}</span></h1>
  <div class="bar"><span class="first">The world in ${ALL.length} stories</span>${regionBar()}</div>
  <section class="leads">${LEADS.map((s) => picture(s, 'lead')).join('')}</section>
  <section class="tiles">${TILES.map((s) => picture(s, 'tile')).join('')}</section>
  <section class="foot"><div class="where"><h3>Where it happened</h3>${worldMap()}</div>
    <div class="also"><h3>Also on ${DAY.weekday} ${DAY.date}</h3><ol>${BRIEFS.map(brief).join('')}</ol></div></section>
  ${dateCheck()}
  </main><script>
    document.fonts.ready.then(() => {
      const line = document.querySelector('h1 span');
      const room = document.querySelector('h1').clientWidth;
      line.style.fontSize = (80 * room / line.getBoundingClientRect().width) + 'px';
      const spill = [...document.querySelectorAll('li, li span, .bar span, .kick em, h2, p, .chip')].filter((e) => e.scrollWidth > e.clientWidth + 1 || e.getBoundingClientRect().right > 1011);
      const tall = [...document.querySelectorAll('h2')].filter((e) => e.clientHeight > (e.closest('.lead') ? 55 : 43));
      console.log('LAYOUT', JSON.stringify({ size: line.style.fontSize, bottom: document.querySelector('.check').getBoundingClientRect().bottom, spill: spill.map((e) => e.textContent), tall: tall.map((e) => e.textContent) }));
    });
  </script></body></html>`;
}
