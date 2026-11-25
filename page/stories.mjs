// The day's stories. Every one happened, or was first reported, on Tuesday 24 November 2026.
// at: [latitude, longitude] for the map. src: the outlet the line was checked against.

export const DAY = { weekday: 'Tuesday', date: '24 November 2026' };

export const REGIONS = [
  { key: 'Europe', colour: '#23589c' },
  { key: 'Asia', colour: '#b8431f' },
  { key: 'Middle East', colour: '#946504' },
  { key: 'Americas', colour: '#6b3a9c' },
  { key: 'Africa', colour: '#23763f' },
  { key: 'Oceania', colour: '#0b7a75' },
  { key: 'Global', colour: '#4b5059' },
];

export const LEADS = [
  {
    n: 1, region: 'Asia', place: 'Taipei to New York', field: 'markets', src: 'CNA, CNBC', scene: 'chipRide',
    chip: 'Chip rally fades', at: [25, 121.5],
    head: 'Taiwan’s biggest points gain ever; hours later, Nvidia falls 6%',
    text: 'Seoul jumped 6.3%, then the Nasdaq closed 1.5% down.',
  },
  {
    n: 2, region: 'Middle East', place: 'Riyadh', field: 'war', src: 'Reuters, AFP', scene: 'riyadhTower',
    chip: 'Riyadh tower hit', at: [24.7, 46.7],
    head: 'Houthi drone hits Saudi capital’s tallest tower; 11 hurt',
    text: 'Second hit in a week on the state wealth fund’s offices.',
  },
  {
    n: 3, region: 'Asia', place: 'Shanghai', field: 'politics', src: 'Xinhua, Reuters', scene: 'shanghai',
    chip: 'Shanghai probe', at: [31.2, 121.5],
    head: 'China investigates Shanghai’s Communist Party chief',
    text: 'Chen Jining is the 4th Politburo member hit since 2025.',
  },
];

export const TILES = [
  {
    n: 4, region: 'Europe', place: 'Zaporizhzhia', field: 'war', src: 'AP, Reuters', scene: 'apartmentStrike',
    chip: 'Ukraine city hit', at: [47.8, 35.1],
    head: 'Russian strike kills 2, hurts 40+; Putin vows reprisals',
  },
  {
    n: 5, region: 'Middle East', place: 'Tehran', field: 'war', src: 'AP', scene: 'hormuz',
    chip: 'Hormuz mines', at: [26.6, 56.3],
    head: 'Iran says 3 tankers struck; no US talks till 7 terms met',
  },
  {
    n: 6, region: 'Americas', place: 'New York', field: 'courts', src: 'AP, Reuters', scene: 'verdict',
    chip: 'Huawei guilty', at: [40.7, -74],
    head: 'US jury convicts Huawei of plot to steal trade secrets',
  },
  {
    n: 7, region: 'Africa', place: 'Dakar', field: 'football', src: 'AP, BBC', scene: 'africaCup',
    chip: 'Senegal reinstated', at: [14.7, -17.4],
    head: 'Court restores Senegal’s Africa Cup, strips Morocco',
  },
  {
    n: 8, region: 'Middle East', place: 'Gaza City', field: 'war', src: 'BBC', scene: 'gaza',
    chip: 'Gaza air strikes', at: [31.5, 34.4],
    head: 'Israel kills Hamas’s internal security chief; 7 dead',
  },
  {
    n: 9, region: 'Asia', place: 'South Korea', field: 'security', src: 'Yonhap', scene: 'airAlert',
    chip: 'Korea air alert', at: [37.5, 130.9],
    head: 'Russian warplanes near; Ulleung island told to shelter',
  },
  {
    n: 10, region: 'Americas', place: 'Colombia', field: 'crime', src: 'Reuters', scene: 'siege',
    chip: '25 taken hostage', at: [10.4, -75.5],
    head: 'Gunmen seize Cartagena store after botched robbery',
  },
  {
    n: 11, region: 'Africa', place: 'DR Congo', field: 'health', src: 'AFP', scene: 'ebola',
    chip: 'Ebola evacuation', at: [1.6, 30.2],
    head: 'WHO evacuates staff trapped 3 days by fighting in Ituri',
  },
  {
    n: 12, region: 'Europe', place: 'London', field: 'climate', src: 'Guardian, BBC', scene: 'heat',
    chip: '5,258 heat deaths', at: [51.5, -0.1],
    head: 'England’s summer heat toll is the highest on record',
  },
  {
    n: 13, region: 'Oceania', place: 'Canberra', field: 'tech law', src: 'Reuters', scene: 'canberra',
    chip: 'Big Tech: 5% fines', at: [-35.3, 149.1],
    head: 'Australia plans fines of up to 5% of sales for online harm',
  },
  {
    n: 14, region: 'Global', place: 'United Nations', field: 'rights', src: 'UN', scene: 'femicide',
    chip: 'Femicide: 5 an hour', at: null,
    head: 'Partners or family killed 47,000 women, girls in 2025',
  },
  {
    n: 15, region: 'Global', place: 'Deep space', field: 'science', src: 'ESA, Reuters', scene: 'quasar',
    chip: 'Farthest quasar', at: null,
    head: 'Euclid telescope sees light 13.1 billion years old',
  },
];

export const BRIEFS = [
  { n: 16, region: 'Asia', place: 'Hanoi', head: 'Gas blast at hotpot restaurant kills 7', src: 'VnExpress', at: [21, 105.8] },
  { n: 17, region: 'Asia', place: 'Dhaka', head: 'Ousted PM Hasina sets 16 December return', src: 'Reuters', at: [23.8, 90.4] },
  { n: 18, region: 'Asia', place: 'Gazipur', head: 'Pay protests halt 481 garment factories', src: 'TBS', at: [24, 90.4] },
  { n: 19, region: 'Asia', place: 'Kuala Lumpur', head: '6,803 to be sent back to Myanmar', src: 'AFP', at: [3.1, 101.7] },
  { n: 20, region: 'Asia', place: 'Tokyo', head: 'Japan to pay ICC early after US sanctions', src: 'Straits Times', at: [35.7, 139.7] },
  { n: 21, region: 'Middle East', place: 'Aden', head: 'Houthis 60 km off; strike on buses kills 26', src: 'AFP', at: [12.8, 45] },
  { n: 22, region: 'Middle East', place: 'Baghdad', head: 'Iraq to take over Kurdish-held oilfields', src: 'Reuters', at: [33.3, 44.4] },
  { n: 23, region: 'Middle East', place: 'Ras Al Khaimah', head: 'Bus hits parked truck; 13 dead', src: 'Gulf News', at: [25.7, 55.9] },
  { n: 24, region: 'Middle East', place: 'Eskişehir', head: 'Turkish air force helicopter crash kills 5', src: 'AP', at: [39.8, 30.5] },
  { n: 25, region: 'Europe', place: 'Berehove', head: 'Zelensky meets Hungary’s new PM Magyar', src: 'DW', at: [48.2, 22.6] },
  { n: 26, region: 'Europe', place: 'Moscow', head: 'Duma passes record military budget', src: 'Moscow Times', at: [55.8, 37.6] },
  { n: 27, region: 'Europe', place: 'Paris', head: 'Sarkozy, Carla Bruni to be tried in 2027', src: 'BBC', at: [48.9, 2.4] },
  { n: 28, region: 'Europe', place: 'Paris', head: 'Sanofi to buy US firm Insmed for $41bn', src: 'CNBC', at: [48.9, 2.4] },
  { n: 29, region: 'Europe', place: 'Vatican City', head: 'Pope Francis’s private diary is published', src: 'AP', at: [41.9, 12.5] },
  { n: 30, region: 'Europe', place: 'Madrid', head: 'Real beat PSV 5–1 in Champions League', src: 'AFP', at: [40.4, -3.7] },
  { n: 31, region: 'Americas', place: 'Washington', head: 'CIA system hit by cyber breach', src: 'Independent', at: [38.9, -77] },
  { n: 32, region: 'Americas', place: 'Brasília', head: 'Envoy to Argentina pulled in poll row', src: 'BA Times', at: [-15.8, -47.9] },
  { n: 33, region: 'Americas', place: 'Miami', head: 'US named host of the 2028 Copa América', src: 'AP', at: [25.8, -80.2] },
  { n: 34, region: 'Africa', place: 'Kinshasa', head: 'DR Congo to halt cobalt exports', src: 'Africanews', at: [-4.3, 15.3] },
  { n: 35, region: 'Africa', place: 'South Africa', head: 'Man guilty of bid to fight for Russia', src: 'AP', at: [-26.1, 28.2] },
  { n: 36, region: 'Oceania', place: 'Gold Coast', head: 'England beat Australia, level T20 series', src: 'ABC', at: [-28, 153.4] },
  { n: 37, region: 'Global', place: 'Geneva', head: 'Landmine casualties hit 5-year high: 6,929', src: 'AP', at: null },
];

// Big stories of the days before, kept off the page on purpose.
export const LEFT_OUT = [
  ['23 Nov', ['Nvidia rehiring Huang', 'UK sanctions on Myanmar generals', 'Puigdemont’s amnesty', 'the Villavicencio car bomb']],
  ['22 Nov', ['COP31’s collapse', 'Ukraine sinking a Russian warship off Libya']],
  ['21 Nov', ['BepiColombo reaching Mercury']],
];

export const ALL = [...LEADS, ...TILES, ...BRIEFS];
