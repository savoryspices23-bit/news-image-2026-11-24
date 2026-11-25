// One drawn scene per pictured story. Lead scenes are 324 x 120, tile scenes 240 x 84.
// The top-left corner of every scene stays quiet: that is where the red label sits.

const LEAD = [324, 120];
const TILE = [240, 84];

let uid = 0;
const id = (name) => `${name}${++uid}`;

function frame([w, h], body) {
  return `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;
}

function sky([w, h], stops, to = h) {
  const g = id('sky');
  const marks = stops.map(([at, c]) => `<stop offset="${at}" stop-color="${c}"/>`).join('');
  return `<defs><linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1">${marks}</linearGradient></defs><rect width="${w}" height="${to}" fill="url(#${g})"/>`;
}

function glow(x, y, r, colour, strength = 0.9) {
  const g = id('glow');
  return `<defs><radialGradient id="${g}"><stop offset="0" stop-color="${colour}" stop-opacity="${strength}"/><stop offset="1" stop-color="${colour}" stop-opacity="0"/></radialGradient></defs><circle cx="${x}" cy="${y}" r="${r}" fill="url(#${g})"/>`;
}

// A plume built from overlapping puffs, dark at the base and paler as it rises.
function plume(x, y, steps, { dx = 2, dy = -7, r = 6, grow = 1.6, from = [52, 48, 50], to = [150, 145, 145], alpha = 0.85 } = {}) {
  let out = '';
  for (let i = steps - 1; i >= 0; i--) {
    const t = i / Math.max(1, steps - 1);
    const mix = from.map((c, k) => Math.round(c + (to[k] - c) * t));
    const sway = Math.sin(i * 1.7) * r * 0.45;
    out += `<circle cx="${(x + dx * i + sway).toFixed(1)}" cy="${(y + dy * i).toFixed(1)}" r="${(r + grow * i).toFixed(1)}" fill="rgb(${mix})" opacity="${(alpha * (1 - t * 0.45)).toFixed(2)}"/>`;
  }
  return out;
}

function flame(x, y, s) {
  return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-9 0C-12-9-5-12-6-20 0-16 0-12 2-9 4-13 4-17 3-22 11-15 13-6 9 0Z" fill="#f0621c"/><path d="M-5 0C-7-6-2-8-2-13 2-9 3-6 4-9 8-5 7-2 5 0Z" fill="#ffc93c"/></g>`;
}

function burst(x, y, r, spikes = 11) {
  const pts = [];
  for (let i = 0; i < spikes * 2; i++) {
    const a = (Math.PI * i) / spikes;
    const rr = i % 2 ? r * 0.52 : r * (0.86 + 0.14 * Math.sin(i * 2.3));
    pts.push(`${(x + Math.cos(a) * rr).toFixed(1)},${(y + Math.sin(a) * rr).toFixed(1)}`);
  }
  return `<polygon points="${pts.join(' ')}" fill="#f5701d"/><circle cx="${x}" cy="${y}" r="${r * 0.5}" fill="#ffd24a"/><circle cx="${x}" cy="${y}" r="${r * 0.26}" fill="#fff6d8"/>`;
}

function grid(x, y, cols, rows, dx, dy, w, h, fillFor) {
  let out = '';
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const fill = fillFor(c, r);
      if (fill) out += `<rect x="${x + c * dx}" y="${y + r * dy}" width="${w}" height="${h}" fill="${fill}"/>`;
    }
  }
  return out;
}

function star(x, y, r, fill, turn = -90) {
  const pts = [];
  for (let i = 0; i < 10; i++) {
    const a = ((turn + i * 36) * Math.PI) / 180;
    const rr = i % 2 ? r * 0.4 : r;
    pts.push(`${(x + Math.cos(a) * rr).toFixed(1)},${(y + Math.sin(a) * rr).toFixed(1)}`);
  }
  return `<polygon points="${pts.join(' ')}" fill="${fill}"/>`;
}

function officer(x, y, s, fill = '#0b1020') {
  return `<g transform="translate(${x} ${y}) scale(${s})" fill="${fill}"><circle cx="0" cy="-21" r="4"/><path d="M-5-22h10l-1-4h-8z"/><path d="M-6 0v-15q6-4 12 0V0h-4v-7h-4v7z"/></g>`;
}

// 1. Asia's chip rally, then Wall Street's slide.
function chipRide() {
  const up = [[0, 104], [20, 101], [38, 103], [58, 95], [80, 92], [100, 82], [122, 79], [146, 66], [168, 63], [192, 54]];
  const down = [[192, 54], [212, 66], [230, 62], [250, 78], [268, 80], [288, 94], [304, 96], [316, 106]];
  const path = (p) => 'M' + p.map((q) => q.join(' ')).join('L');
  const area = (p) => `${path(p)}L${p[p.length - 1][0]} 120L${p[0][0]} 120Z`;
  let pins = '';
  for (let i = 0; i < 5; i++) {
    const o = 6 + i * 7.5;
    pins += `<rect x="${268 + o}" y="5" width="3" height="54" fill="#d9c27a"/><rect x="263" y="${10 + o}" width="54" height="3" fill="#d9c27a"/>`;
  }
  let rules = '';
  for (let y = 24; y < 120; y += 19) rules += `<path d="M0 ${y}H324" stroke="#2c4f7c" stroke-width=".7"/>`;
  return frame(LEAD, `${sky(LEAD, [[0, '#08142b'], [1, '#143058']])}${rules}
    <path d="${area(up)}" fill="#23b26b" opacity=".38"/><path d="${area(down)}" fill="#e2353b" opacity=".4"/>
    <path d="M192 40V120" stroke="#cfd9ea" stroke-width="1.2" stroke-dasharray="3 3"/>
    <path d="${path(up)}" fill="none" stroke="#3fe08d" stroke-width="5" stroke-linejoin="round"/>
    <path d="${path(down)}" fill="none" stroke="#ff5a5f" stroke-width="5" stroke-linejoin="round"/>
    <polygon points="186,46 203,48 194,62" fill="#3fe08d"/><polygon points="322,116 304,111 318,98" fill="#ff5a5f"/>
    ${pins}<rect x="269" y="11" width="42" height="42" rx="3" fill="#1a2536" stroke="#d9c27a" stroke-width="1.5"/><rect x="278" y="20" width="24" height="24" fill="#76b900"/><path d="M283 27h14M283 32h14M283 37h9" stroke="#0d2a0a" stroke-width="2"/>
    <g font-family="DayBold" font-size="21" fill="#fff"><text x="8" y="66">TAIEX <tspan fill="#7df3b5">+8.99%</tspan></text><text x="200" y="116">NVIDIA <tspan fill="#ffd0d1">−6%</tspan></text></g>`);
}

// 2. The drone strike on the PIF tower in Riyadh.
function riyadhTower() {
  const dark = '#1b1430';
  const low = [[0, 92, 20], [18, 98, 18], [34, 88, 14], [47, 96, 22], [68, 84, 16], [83, 94, 14], [126, 96, 18], [143, 100, 10], [160, 90, 16], [175, 97, 20], [194, 86, 14], [207, 94, 18]];
  const blocks = low.map(([x, y, w]) => `<rect x="${x}" y="${y}" width="${w}" height="${120 - y}" fill="${dark}"/>`).join('');
  const lamps = low.map(([x, y, w], i) => grid(x + 3, y + 4, Math.floor(w / 6), 3, 5, 6, 2, 2.5, (c, r) => ((c + r + i) % 3 ? null : '#f7c56b'))).join('');
  return frame(LEAD, `${sky(LEAD, [[0, '#28205a'], [0.45, '#8d3f55'], [0.75, '#e2783c'], [1, '#f8c266']])}
    <circle cx="150" cy="98" r="22" fill="#ffd98a" opacity=".85"/>
    ${blocks}${lamps}
    <path d="M100 120V66q0-8 5-14l3 2q-3 9 5 9t5-9l3-2q5 6 5 14v54z" fill="${dark}"/><path d="M106 66h14" stroke="#f7c56b" stroke-width="1.4"/>
    <path d="M152 120l9-46 2-8 2 8 9 46z" fill="${dark}"/><circle cx="163" cy="80" r="3.6" fill="#ffcf5c"/>
    <polygon points="224,120 227,74 238,66 242,120" fill="#261c44"/><polygon points="294,120 296,62 308,70 311,120" fill="#261c44"/><polygon points="309,120 312,82 324,78 324,120" fill="${dark}"/>
    <polygon points="244,120 249,38 260,10 268,4 277,12 286,40 292,120" fill="#3b4b78"/>
    <polygon points="268,4 277,12 286,40 292,120 270,120" fill="#283563"/>
    <path d="M249 38L270 120M286 40L270 120M260 10L270 62L277 12M246 86L270 62L289 84" stroke="#93a6d6" stroke-width="1" fill="none" opacity=".75"/>
    ${plume(282, 50, 7, { dx: 5, dy: -8, r: 7, grow: 1.8, from: [38, 32, 40], to: [120, 100, 100] })}
    ${glow(274, 56, 38, '#ffb23e', 0.8)}${burst(274, 56, 17)}${flame(268, 74, 0.7)}
    <g transform="translate(206 62) rotate(8)"><path d="M0 0L-22-9-17 0-22 9Z" fill="#0c0a18"/><rect x="-27" y="-1.5" width="10" height="3" fill="#0c0a18"/></g>
    <path d="M176 57L150 53M178 62L146 61" stroke="#fff3d8" stroke-width="1.5" opacity=".7"/>`);
}

// 3. Shanghai's party boss under investigation.
function shanghai() {
  const ink = '#3a0a12';
  const low = [[150, 96, 16], [165, 90, 12], [176, 100, 12], [308, 92, 16], [262, 98, 12]];
  return frame(LEAD, `${sky(LEAD, [[0, '#8f1118'], [0.55, '#d63a26'], [1, '#f6b45a']])}
    ${star(44, 92, 30, '#ffdc5e')}
    ${low.map(([x, y, w]) => `<rect x="${x}" y="${y}" width="${w}" height="${120 - y}" fill="${ink}"/>`).join('')}
    <path d="M196 120V84l4-7 2-12 2 12 4 7v36z" fill="${ink}"/>
    <path d="M216 120V72l5-11h8l5 11v48z" fill="${ink}"/><path d="M221.500 64h7l1.500 5h-10z" fill="#e8662f"/>
    <path d="M242 120q-3-40 3-66q4-6 9-5q5 22 6 71z" fill="${ink}"/><path d="M246 112q0-30 5-58" stroke="#8d2a22" stroke-width="1.500" fill="none"/>
    <path d="M287 120l-9-.2L287 92l-1-28h4l-1 28 9 27.800z" fill="${ink}"/><circle cx="288" cy="86" r="10.500" fill="${ink}"/><circle cx="288" cy="56" r="7" fill="${ink}"/><circle cx="288" cy="42" r="3" fill="${ink}"/><rect x="287" y="8" width="2" height="36" fill="${ink}"/>
    <path d="M279 84q9 4 18 0M282.500 55q5.500 2.500 11 0" stroke="#e8662f" stroke-width="1.300" fill="none"/>
    <path d="M0 113q40-5 81 0t81 0 81 0 81 0v7H0z" fill="#5a1015"/>
    <path d="M140 106l20 12" stroke="#1a1a20" stroke-width="9" stroke-linecap="round"/>
    <circle cx="116" cy="82" r="31" fill="#fdf3dc" stroke="#1a1a20" stroke-width="6"/>
    <g fill="#22303f"><circle cx="116" cy="71" r="10"/><path d="M94 104q2-20 22-20t22 20a31 31 0 0 1-44 0z"/></g><path d="M112 85l4 18 4-18z" fill="#c4161c"/><path d="M106 69q1-9 10-9t10 9q-4-5-10-5t-10 5z" fill="#101820"/>
    <path d="M97 66q5-11 16-13" stroke="#fff" stroke-width="3.500" fill="none" stroke-linecap="round" opacity=".9"/>`);
}

// 4. The apartment block in Zaporizhzhia.
function apartmentStrike() {
  const lit = (c, r) => ((c * 3 + r * 5) % 7 === 0 ? '#ffd27a' : '#2b3550');
  return frame(TILE, `${sky(TILE, [[0, '#0f1730'], [0.6, '#36294a'], [1, '#b0512f']])}
    ${glow(176, 52, 60, '#ff8b2e', 0.75)}
    ${plume(188, 36, 7, { dx: 5, dy: -7, r: 9, grow: 1.5, from: [40, 34, 38], to: [98, 88, 92] })}
    <rect x="108" y="34" width="46" height="50" fill="#8a8f9c"/><rect x="198" y="34" width="38" height="50" fill="#7b808e"/>
    ${grid(112, 38, 5, 5, 8.600, 9, 5, 5.500, lit)}${grid(202, 38, 4, 5, 8.600, 9, 5, 5.500, lit)}
    <path d="M154 34l6 9-4 7 8 6-5 9 9 4 5 15h-19zM198 34l-5 10 5 8-9 5 3 9-10 6-4 12h20z" fill="#6f7482"/>
    <path d="M154 84h44l-3-9-9-4-7 5-8-6-9 5z" fill="#4b4550"/>
    ${flame(166, 72, 1.1)}${flame(183, 74, 1.4)}${flame(175, 60, 0.8)}
    <g transform="translate(14 58)"><path d="M0 22V6h34l10 8h14v8z" fill="#c4161c"/><path d="M36 8h8l6 6H36z" fill="#cfe4f7"/><rect x="4" y="9" width="26" height="4" fill="#fff" opacity=".85"/><circle cx="12" cy="23" r="5" fill="#10131c"/><circle cx="46" cy="23" r="5" fill="#10131c"/><path d="M20 5L84-11" stroke="#dfe5ee" stroke-width="3"/><path d="M20 5L84-11" stroke="#70798a" stroke-width="1" stroke-dasharray="2 4"/></g>
    <path d="M97 47q34-16 66 10" stroke="#bfe3ff" stroke-width="3" fill="none" opacity=".85"/>
    <rect y="81" width="240" height="3" fill="#1a1620"/>`);
}

// 5. Tankers and mines in the Strait of Hormuz.
function hormuz() {
  let horns = '';
  for (let i = 0; i < 10; i++) {
    const a = (Math.PI * 2 * i) / 10 + 0.2;
    horns += `<path d="M${46 + Math.cos(a) * 15} ${59 + Math.sin(a) * 15}L${46 + Math.cos(a) * 21} ${59 + Math.sin(a) * 21}" stroke="#14181d" stroke-width="4" stroke-linecap="round"/>`;
  }
  return frame(TILE, `${sky(TILE, [[0, '#f2d3a2'], [1, '#e79a5b']], 42)}
    <path d="M0 42V36l18-8 14 6 20-12 18 12 16-5 20 13zM168 42l16-9 12 5 18-12 26 10v6z" fill="#a8714c"/>
    <rect y="41" width="240" height="43" fill="#1f6d8c"/><path d="M0 41h240v9q-30 5-60 0t-60 0-60 0-60 0z" fill="#2f86a6"/>
    ${plume(176, 30, 6, { dx: 8, dy: -5, r: 8, grow: 1.8, from: [30, 28, 30], to: [110, 100, 96] })}
    <path d="M102 48h128l-7 17H112z" fill="#7d1a1c"/><path d="M102 48h128l-2 5H104z" fill="#1d2129"/><rect x="204" y="30" width="18" height="18" fill="#f4efe4"/><rect x="207" y="33" width="12" height="4" fill="#274156"/><rect x="210" y="23" width="6" height="8" fill="#c4161c"/>
    <path d="M114 45h80M124 45v-6M144 45v-6M164 45v-6" stroke="#d8d2c4" stroke-width="2"/>
    ${flame(168, 47, 1)}${flame(180, 47, 1.25)}
    ${horns}<circle cx="46" cy="59" r="16" fill="#2a3038"/><path d="M34 52q5-8 13-9" stroke="#7f8a96" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M30 59h32" stroke="#171b20" stroke-width="2"/>
    <path d="M14 70q16-6 32 0t32 0v14H14z" fill="#1f6d8c"/><path d="M10 70q18-6 36 0t36 0" stroke="#a9dcea" stroke-width="2" fill="none"/>
    <path d="M96 72q16-4 32 0t32 0 32 0 32 0" stroke="#6bb6cc" stroke-width="1.600" fill="none"/>`);
}

// 6. The Huawei verdict in New York.
function verdict() {
  let traces = '';
  [[0, 44, 40], [0, 56, 70], [0, 68, 46], [0, 78, 86]].forEach(([x, y, len], i) => {
    traces += `<path d="M${x} ${y}h${len}l8 ${i % 2 ? 6 : -6}h22" stroke="#3c8f74" stroke-width="1.600" fill="none"/><circle cx="${x + len + 30}" cy="${y + (i % 2 ? 6 : -6)}" r="2.500" fill="#7fe0bd"/>`;
  });
  return frame(TILE, `${sky(TILE, [[0, '#0f2c2a'], [1, '#174a43']])}${traces}
    <g transform="translate(20 40)"><rect width="24" height="40" rx="4" fill="#0a1114" stroke="#8fb8b0" stroke-width="2"/><rect x="4" y="5" width="16" height="28" fill="#2f6f86"/><path d="M8 26v-5M12 26v-9M16 26v-13" stroke="#fff" stroke-width="2.500"/></g>
    <rect x="118" y="68" width="92" height="12" rx="3" fill="#5a2f16"/><rect x="126" y="62" width="76" height="8" rx="3" fill="#7d4522"/>
    <g transform="rotate(-24 178 40)"><rect x="104" y="36" width="74" height="9" rx="4.500" fill="#9a5a2c"/><rect x="154" y="14" width="46" height="52" rx="5" fill="#8a4a20"/><rect x="154" y="20" width="46" height="5" fill="#e2b04a"/><rect x="154" y="55" width="46" height="5" fill="#e2b04a"/></g>
    <path d="M206 50l14-6M210 58l16 0M206 66l14 6" stroke="#ffe08a" stroke-width="2.500" stroke-linecap="round"/>
    <rect x="51" y="59" width="104" height="20" rx="2" fill="#fff3cf"/><text x="103" y="75" text-anchor="middle" font-family="DayBold" font-size="16.500" fill="#14302c">10 of 12 counts</text>`);
}

// 7. Senegal's restored title.
function africaCup() {
  let confetti = '';
  for (let i = 0; i < 34; i++) {
    const x = (i * 53) % 236;
    const y = 30 + ((i * 37) % 50);
    confetti += `<rect x="${x}" y="${y}" width="4" height="2.400" transform="rotate(${(i * 47) % 180} ${x} ${y})" fill="${['#fff', '#ffe36b', '#1c7c3f', '#e23a3a'][i % 4]}" opacity=".9"/>`;
  }
  return frame(TILE, `<rect width="80" height="84" fill="#14823f"/><rect x="80" width="80" height="84" fill="#fcd535"/><rect x="160" width="80" height="84" fill="#d8252d"/>
    ${star(120, 58, 20, '#14823f')}${confetti}
    <path d="M0 78h240v6H0z" fill="#0b5a2a"/>
    <g transform="translate(202 32) scale(.78)"><path d="M-14 4h28q1 24-9 32v10h6l4 8h-30l4-8h6V36q-10-8-9-32z" fill="#f2b92a" stroke="#8a5d0a" stroke-width="1.500"/><path d="M-14 8q-12-1-11 9t14 13M14 8q12-1 11 9t-14 13" fill="none" stroke="#f2b92a" stroke-width="3.500"/><path d="M-9 8q-1 15 4 23" stroke="#fff2b8" stroke-width="3" fill="none"/><rect x="-18" y="54" width="36" height="10" rx="2" fill="#3a2a12"/><rect x="-9" y="57" width="18" height="4" fill="#f2b92a"/></g>
    <g transform="translate(40 62)"><circle r="15" fill="#fff" stroke="#151515" stroke-width="1.500"/><polygon points="0,-6 6,-2 4,5 -4,5 -6,-2" fill="#151515"/><path d="M0-6V-14M6-2L13-6M4 5L9 12M-4 5L-9 12M-6-2L-13-6" stroke="#151515" stroke-width="1.600"/></g>`);
}

// 8. Strikes on Gaza.
function gaza() {
  return frame(TILE, `${sky(TILE, [[0, '#d8c6a4'], [0.7, '#e9d9b6'], [1, '#cfae7e']])}
    ${plume(196, 52, 8, { dx: 3, dy: -8, r: 11, grow: 2, from: [52, 46, 42], to: [132, 122, 112] })}
    ${plume(120, 58, 5, { dx: 4, dy: -5, r: 8, grow: 1.6, from: [80, 72, 66], to: [160, 148, 134] })}
    <path d="M0 84V50h14v-8h16v10l8 3v-9h14v38z" fill="#8d8272"/><path d="M50 84V60l8-5 4 6 10-12 8 9v26z" fill="#9b8f7d"/>
    <path d="M88 84V56h10l3-8 12 2v10l9 4v20z" fill="#857a6a"/><path d="M152 84V46l8 5 4-9 10 3v12l9 3v24z" fill="#8d8272"/><path d="M212 84V52l9-6 8 7 11-4v35z" fill="#7c7162"/>
    ${grid(5, 56, 5, 2, 10, 11, 5, 6, (c, r) => ((c + r) % 2 ? '#4f473c' : null))}${grid(157, 56, 3, 2, 9, 11, 5, 6, () => '#4f473c')}${grid(94, 62, 3, 1, 9, 9, 5, 6, () => '#4f473c')}
    ${glow(188, 60, 26, '#ff9a3d', 0.9)}${burst(188, 60, 11)}
    <path d="M0 84q20-12 40-6t36-3 34 4 40-6 40 6 50-5v10z" fill="#6b6152"/>
    <path d="M10 82l14-15 14 15zM44 82l12-13 12 13zM112 82l13-14 13 14z" fill="#e8e4da" stroke="#8d8a82" stroke-width="1"/><path d="M24 67v15M56 69v13M125 68v14" stroke="#b5b0a4" stroke-width="1.200"/>
    <g transform="translate(222 17)" fill="#2a2723"><rect x="-13" y="-1.500" width="26" height="4" rx="2"/><path d="M-3-1L-12-10h5l10 9zM-3 2l-9 9h5l10-9z"/><path d="M-13 0l-5-5v10z"/></g>`);
}

// 9. Russian aircraft near Ulleung Island.
function airAlert() {
  const jet = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s}) rotate(-14)"><path d="M-20 0L-4-3 6-16h6L6-3h10l5-6h5l-3 9 3 9h-5l-5-6H6l6 13H6L-4 3z" fill="#18202c"/></g>`;
  return frame(TILE, `${sky(TILE, [[0, '#8fb8d9'], [0.75, '#f3ddc0'], [1, '#f0b98e']], 62)}
    <rect y="60" width="240" height="24" fill="#1c5a7c"/><path d="M0 60h240v5q-30 4-60 0t-60 0-60 0-60 0z" fill="#3b85a8"/>
    <path d="M8 66q10-6 18-18l10-9 9 6 9-10 12 13 10 5 8 7 14 6z" fill="#3c5a3a"/><path d="M36 39l9 6-5 12zM54 35l12 13-8 10z" fill="#54784f"/>
    <path d="M46 35V22" stroke="#22262c" stroke-width="2.500"/>
    <g fill="none" stroke="#c4161c" stroke-width="3" stroke-linecap="round"><path d="M74 44q8 6 8 16"/><path d="M84 36q12 9 12 24"/><path d="M94 29q16 12 16 31"/></g>
    <path d="M0 68h114" stroke="#a7d2e4" stroke-width="1.500"/>
    <path d="M170 47h70M228 18h12M222 59h18" stroke="#fff" stroke-width="3" opacity=".75"/>
    ${jet(150, 52, 1.1)}${jet(214, 22, 0.8)}${jet(206, 63, 0.8)}`);
}

// 10. The supermarket siege in Cartagena.
function siege() {
  return frame(TILE, `${sky(TILE, [[0, '#0a1030'], [1, '#1c2a5c']])}
    ${glow(30, 66, 44, '#3d7bff', 0.8)}${glow(212, 66, 44, '#ff3b3b', 0.75)}
    <rect x="62" y="38" width="122" height="46" fill="#d9d3c3"/><rect x="60" y="33" width="126" height="15" fill="#e0b400"/>
    <text x="123" y="45" text-anchor="middle" font-family="DayBold" font-size="13" fill="#2a2100">SUPERMARKET</text>
    <rect x="68" y="50" width="32" height="28" fill="#ffeeb4"/><rect x="146" y="50" width="32" height="28" fill="#ffeeb4"/><rect x="106" y="50" width="34" height="34" fill="#7d8a96"/><path d="M106 57h34M106 64h34M106 71h34M106 78h34" stroke="#5c6873" stroke-width="1.600"/>
    <g fill="#3a3326"><circle cx="78" cy="64" r="4"/><path d="M71 78q0-9 7-9t7 9zM74 68l-3-9M82 68l3-9" stroke="#3a3326" stroke-width="2"/><circle cx="92" cy="66" r="3.600"/><path d="M86 78q0-8 6-8t6 8z"/><circle cx="156" cy="66" r="3.600"/><path d="M150 78q0-8 6-8t6 8z"/><circle cx="170" cy="64" r="4"/><path d="M163 78q0-9 7-9t7 9zM166 68l-3-9M174 68l3-9" stroke="#3a3326" stroke-width="2"/></g>
    <path d="M0 82h240v2H0z" fill="#0a0e1e"/>
    <g transform="translate(6 62)"><path d="M0 20V11l9-2 7-8h20l7 8 9 3v8z" fill="#f2f4f7"/><path d="M0 20v-6h52v6z" fill="#1d4fb8"/><path d="M12 9l5-6h8v6zM28 9V3h6l5 6z" fill="#26384f"/><rect x="20" y="-5" width="7" height="5" fill="#ff3b3b"/><rect x="27" y="-5" width="7" height="5" fill="#4f8cff"/><circle cx="11" cy="20" r="4.500" fill="#0b0f18"/><circle cx="41" cy="20" r="4.500" fill="#0b0f18"/></g>
    ${officer(196, 83, 1.25)}${officer(214, 83, 1.35)}${officer(231, 83, 1.2)}
    <path d="M204 60h7v18h-7zM222 60h7v18h-7z" fill="#24324e" stroke="#7f93bb" stroke-width="1"/>`);
}

// 11. The Ebola team leaving Ituri.
function ebola() {
  return frame(TILE, `${sky(TILE, [[0, '#cfe3ea'], [1, '#f1e6c4']], 60)}
    ${plume(214, 34, 6, { dx: 3, dy: -6, r: 6, grow: 1.4, from: [60, 54, 54], to: [150, 142, 138] })}${plume(186, 38, 4, { dx: 3, dy: -5, r: 5, grow: 1.2, from: [80, 74, 72], to: [165, 158, 152] })}
    <path d="M0 62q28-20 58-12t58-8 62 4 62-8v46H0z" fill="#4f8a4a"/><path d="M0 70q40-12 80-4t82-6 78 2v22H0z" fill="#3a6f3a"/>
    <path d="M0 84l70-12 170 2v10z" fill="#c89a62"/>
    <path d="M12 74V54l26-14 26 14v20z" fill="#f7f8f6" stroke="#aeb8b4" stroke-width="1.200"/><path d="M12 54l26-14 26 14z" fill="#dfe6e3"/><path d="M32 74V60h12v14z" fill="#7fa39a"/>
    <rect x="16" y="50" width="44" height="9" fill="#c4161c"/><text x="38" y="57.400" text-anchor="middle" font-family="DayBold" font-size="9" fill="#fff">EBOLA WARD</text>
    <g transform="translate(108 46)"><path d="M0 28V14l6-2 8-12h42l8 12 14 3v13z" fill="#fbfbfa" stroke="#8d9894" stroke-width="1.200"/><path d="M12 12l6-8h14v8zM36 12V4h16l6 8z" fill="#3b5568"/><path d="M0 20h78" stroke="#2f86c9" stroke-width="3.500"/><circle cx="17" cy="29" r="7.500" fill="#1a1d20"/><circle cx="17" cy="29" r="3" fill="#b9c2c4"/><circle cx="60" cy="29" r="7.500" fill="#1a1d20"/><circle cx="60" cy="29" r="3" fill="#b9c2c4"/><rect x="24" y="-4" width="14" height="4" fill="#2f86c9"/></g>
    <g fill="#e6cfa4" opacity=".95"><circle cx="198" cy="75" r="6"/><circle cx="209" cy="72" r="7"/><circle cx="222" cy="75" r="6"/><circle cx="233" cy="77" r="5"/></g>
    <g transform="translate(84 80)"><path d="M-7 0v-22q0-11 7-11t7 11V0z" fill="#f4f1d2" stroke="#a7a27c" stroke-width="1"/><rect x="-5" y="-29" width="10" height="6" rx="2" fill="#5f7f94"/><path d="M-7-18h14" stroke="#a7a27c" stroke-width="1"/></g>`);
}

// 12. England's record heat toll.
function heat() {
  const ink = '#5b1410';
  return frame(TILE, `${sky(TILE, [[0, '#d9361e'], [0.55, '#f47b2a'], [1, '#ffd257']])}
    ${glow(150, 46, 62, '#fff2a8', 0.95)}<circle cx="150" cy="46" r="22" fill="#fff6c9"/>
    <path d="M0 84V72h10v-5h12v8h12V62h9v10h14v6h16v6z" fill="${ink}"/>
    <path d="M70 84V44l5-12 5 12v40z" fill="${ink}"/><circle cx="75" cy="50" r="3.600" fill="#ffe08a"/><path d="M75 32v-4" stroke="${ink}" stroke-width="1.600"/>
    <circle cx="112" cy="62" r="17" fill="none" stroke="${ink}" stroke-width="2.400"/><path d="M95 62h34M112 45v34M100 50l24 24M124 50l-24 24" stroke="${ink}" stroke-width=".9"/><path d="M112 62l-8 22M112 62l8 22" stroke="${ink}" stroke-width="2"/>
    <path d="M150 84l9-50 9 50z" fill="${ink}"/><path d="M128 84V74h24v10zM168 84V70h12v-4h14v18z" fill="${ink}"/>
    <g transform="translate(226 4)"><rect x="-9" y="2" width="18" height="60" rx="9" fill="#fff" stroke="#3a0d0a" stroke-width="2.500"/><circle cy="66" r="13" fill="#d3141c" stroke="#3a0d0a" stroke-width="2.500"/><rect x="-4" y="14" width="8" height="48" rx="4" fill="#d3141c"/><path d="M9 18h6M9 28h6M9 38h6M9 48h6" stroke="#3a0d0a" stroke-width="2"/></g>`);
}

// 13. Australia's online-harm bill.
function canberra() {
  return frame(TILE, `${sky(TILE, [[0, '#3f95d6'], [1, '#d6eefa']])}
    <path d="M0 64q50-16 104-12t92-4 44 6v30H0z" fill="#6c9a4c"/><path d="M0 72q60-16 120-16t120 14v14H0z" fill="#86b35c"/>
    <path d="M18 72l20-8h86l20 8v8H18z" fill="#f4f1e8" stroke="#b7b09c" stroke-width="1"/><path d="M40 72v-8M56 72v-8M72 72v-8M88 72v-8M104 72v-8M120 72v-8" stroke="#8d8672" stroke-width="3"/>
    <path d="M58 64l22-28M104 64L82 36M70 64l11-28M92 64L81 36" stroke="#6b7683" stroke-width="2.200"/><path d="M81 64V32" stroke="#6b7683" stroke-width="2.600"/>
    <g transform="translate(82 33)"><rect width="32" height="17" fill="#12246b"/><rect width="14" height="8.500" fill="#1d3a9c"/><path d="M0 0l14 8.500M14 0L0 8.500" stroke="#fff" stroke-width="1.600"/><path d="M7 0v8.500M0 4.200h14" stroke="#fff" stroke-width="2.600"/><path d="M7 0v8.500M0 4.200h14" stroke="#d3141c" stroke-width="1.200"/>${star(7, 13, 2.8, '#fff')}${star(24, 4, 1.7, '#fff')}${star(24, 13.5, 1.7, '#fff')}${star(28.5, 8, 1.7, '#fff')}${star(20, 8.5, 1.7, '#fff')}</g>
    <g transform="translate(174 34) rotate(-5 26 24)"><rect width="54" height="46" rx="6" fill="#11151c"/><rect x="4" y="4" width="46" height="38" rx="2" fill="#fff"/><rect x="4" y="4" width="46" height="9" fill="#c4161c"/><path d="M27 5l4 7h-8z" fill="#fff"/><text x="27" y="38" text-anchor="middle" font-family="DayBold" font-size="27" fill="#11151c">5%</text></g>`);
}

// 14. Five women killed every hour.
function femicide() {
  const coats = ['#ff9d3c', '#ffd27a', '#f07f4e', '#ffbf5e', '#ff8f6b'];
  const woman = (x, coat) => `<g transform="translate(${x} 81)">
      <path d="M-4-10h3v10h-3zM1-10h3v10h-3z" fill="#ffe3c2"/>
      <path d="M-6.500-31Q0-34 6.500-31L9.500-17.500 7-16.500 4.500-25 3.800-20 10-7H-10L-3.800-20-4.500-25-7-16.500-9.500-17.500Z" fill="${coat}"/>
      <path d="M-5.800-38Q-6.500-46.500 0-46.500 6.500-46.500 5.800-38L6.800-29 3-30H-3L-6.800-29Z" fill="#40162c"/>
      <circle cy="-38.500" r="4" fill="#ffe3c2"/><rect x="-1.600" y="-35.500" width="3.200" height="4.500" fill="#ffe3c2"/></g>`;
  return frame(TILE, `${sky(TILE, [[0, '#2a1140'], [1, '#6a2a63']])}
    ${glow(90, 66, 84, '#ff9d4a', 0.6)}
    ${coats.map((coat, i) => woman(20 + i * 33, coat)).join('')}
    <path d="M0 81h240v3H0z" fill="#1b0a2a"/>
    <g transform="translate(206 56) scale(.84)"><circle r="29" fill="#fff8ea" stroke="#ff8a2a" stroke-width="4"/><path d="M0-24v5M24 0h-5M0 24v-5M-24 0h5M17-17l-3 3M17 17l-3-3M-17 17l3-3M-17-17l3 3" stroke="#2a1140" stroke-width="2.500"/><path d="M0 0V-18M0 0L12 7" stroke="#c4161c" stroke-width="3.500" stroke-linecap="round"/><circle r="3.200" fill="#2a1140"/></g>`);
}

// 15. The most distant quasar.
function quasar() {
  let stars = '';
  for (let i = 0; i < 70; i++) {
    const x = (i * 61.7) % 240;
    const y = (i * 29.3) % 84;
    stars += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${[0.6, 0.9, 1.3][i % 3]}" fill="#fff" opacity="${0.35 + (i % 4) * 0.18}"/>`;
  }
  const disc = id('disc');
  return frame(TILE, `${sky(TILE, [[0, '#05040f'], [1, '#150b2e']])}${stars}
    <defs><linearGradient id="${disc}" x1="0" x2="1"><stop offset="0" stop-color="#5a1d7a"/><stop offset=".35" stop-color="#ff7a2e"/><stop offset=".5" stop-color="#fff3c4"/><stop offset=".65" stop-color="#ff7a2e"/><stop offset="1" stop-color="#5a1d7a"/></linearGradient></defs>
    ${glow(150, 52, 70, '#ff8f3a', 0.55)}
    <g transform="rotate(-16 150 52)"><polygon points="146,52 139,-30 161,-30 154,52" fill="#7fc4ff" opacity=".45"/><polygon points="148.500,52 146,-30 154,-30 151.500,52" fill="#e8f6ff" opacity=".9"/><polygon points="146,52 139,130 161,130 154,52" fill="#7fc4ff" opacity=".45"/><polygon points="148.500,52 146,130 154,130 151.500,52" fill="#e8f6ff" opacity=".9"/>
    <ellipse cx="150" cy="52" rx="74" ry="17" fill="url(#${disc})"/><ellipse cx="150" cy="52" rx="46" ry="9" fill="#ffdf9a" opacity=".75"/><circle cx="150" cy="52" r="11" fill="#fffdf2"/><circle cx="150" cy="52" r="6.500" fill="#0a0612"/></g>
    <g transform="translate(26 62)"><rect x="-9" y="-8" width="18" height="16" rx="3" fill="#c9ced8"/><rect x="-5" y="-13" width="10" height="6" fill="#8c95a6"/><path d="M-9-5h-13v10h13zM9-5h13v10H9z" fill="#3565c9" stroke="#9db8f0" stroke-width="1"/><path d="M9 0l26-4" stroke="#8fd0ff" stroke-width="1.200" stroke-dasharray="3 3"/></g>`);
}

export const SCENES = {
  chipRide, riyadhTower, shanghai,
  apartmentStrike, hormuz, verdict, africaCup, gaza, airAlert,
  siege, ebola, heat, canberra, femicide, quasar,
};
