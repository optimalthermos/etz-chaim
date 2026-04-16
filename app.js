import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

// ============================================================
// STATE
// ============================================================
const P = { rot: 0.12, rad: 3.5, pul: 1.0, hlx: 3, spd: 1.5, kint: 1.5, kwid: 0.8, bloom: 0.8, flow: 'both' };
const Ly = { man: true, hid: true, qlp: true, tun: true, kun: true };
const Lb = { nlab: true, plab: false, heb: false };

// Hover / selection state
let hoveredNode = null;   // sefirah data object
let selectedNode = null;  // locked selection

// ============================================================
// DATA
// ============================================================
const MA = [0, 2 * Math.PI / 3, 4 * Math.PI / 3];
const QA = [Math.PI / 3, Math.PI, 5 * Math.PI / 3];

const MAN = [
    { id: 0, nm: "Crown", hb: "Keter", hbh: "כתר", desc: "Divine will — the first emanation, the point before all points. Pure intention without form.", p: "c", y: 6.5, cl: 0xeeddff, chakra: "Sahasrara (Crown)", chcl: 0xcc88ff, pillar: "Middle" },
    { id: 1, nm: "Wisdom", hb: "Chokmah", hbh: "חכמה", desc: "The first flash of insight — undifferentiated creative force. The father principle, expansion without limit.", p: 0, y: 4.5, cl: 0x5588cc, pillar: "Right" },
    { id: 2, nm: "Understanding", hb: "Binah", hbh: "בינה", desc: "The receiving womb — form giving structure to the flash of Chokmah. The mother principle, restriction that creates.", p: 1, y: 4.5, cl: 0xbb2244, pillar: "Left" },
    { id: 3, nm: "Mercy", hb: "Chesed", hbh: "חסד", desc: "Boundless love and expansion — the generous outpouring of creative energy. Grace without condition.", p: 0, y: 1.5, cl: 0x3377bb, pillar: "Right" },
    { id: 4, nm: "Severity", hb: "Gevurah", hbh: "גבורה", desc: "Necessary limit — the power of judgment that gives form through constraint. Discipline and strength.", p: 1, y: 1.5, cl: 0xaa1133, pillar: "Left" },
    { id: 5, nm: "Beauty", hb: "Tiferet", hbh: "תפארת", desc: "Heart and harmony — the compassionate center where all forces balance. The seat of the soul.", p: "c", y: 0, cl: 0xccaa22, chakra: "Anahata (Heart)", chcl: 0x33cc55, pillar: "Middle" },
    { id: 6, nm: "Victory", hb: "Netzach", hbh: "נצח", desc: "Endurance and eternity — the force of nature, instinct, and desire. Raw emotional drive.", p: 0, y: -2.5, cl: 0x339944, pillar: "Right" },
    { id: 7, nm: "Splendor", hb: "Hod", hbh: "הוד", desc: "Form of thought — intellect, language, and the structure of communication. Mental clarity.", p: 1, y: -2.5, cl: 0xcc6622, pillar: "Left" },
    { id: 8, nm: "Foundation", hb: "Yesod", hbh: "יסוד", desc: "The channel — the astral bridge between the mental and physical planes. Dreams and the subconscious.", p: "c", y: -4.5, cl: 0x7744aa, chakra: "Svadhisthana (Sacral)", chcl: 0xff6622, pillar: "Middle" },
    { id: 9, nm: "Kingdom", hb: "Malkuth", hbh: "מלכות", desc: "Manifest world — the physical realm where all higher forces crystallize into matter.", p: "c", y: -6.5, cl: 0x446633, chakra: "Muladhara (Root)", chcl: 0xdd2222, pillar: "Middle" },
    { id: 10, nm: "Knowledge", hb: "Da'at", hbh: "דעת", desc: "The abyss — the hidden sephirah, gateway between the supernal triad and the lower tree. Gnosis.", p: "c", y: 3.0, cl: 0x888888, chakra: "Ajna (Third Eye)", chcl: 0x4444dd, pillar: "Middle" },
];

const HID = [
    { id: 11, nm: "Hidden Wisdom", hb: "Chokmah Stumah", hbh: "חכמה׳", desc: "Unseen knowing — wisdom that operates below the threshold of awareness.", p: 2, y: 4.5, cl: 0x335577, pillar: "Back" },
    { id: 12, nm: "Hidden Mercy", hb: "Chesed Stumah", hbh: "חסד׳", desc: "Silent grace — love that moves without being recognized or claimed.", p: 2, y: 1.5, cl: 0x224466, pillar: "Back" },
    { id: 13, nm: "Hidden Victory", hb: "Netzach Stumah", hbh: "נצח׳", desc: "Quiet endurance — the persistence that continues when all seems lost.", p: 2, y: -2.5, cl: 0x225533, pillar: "Back" },
];

const QLP = [
    { id: 20, nm: "Twin Gods", hb: "Thaumiel", hbh: "תאומיאל", desc: "Split unity — the duality that tears the crown in two.", qp: "qc", y: 6.5, cl: 0x771122 },
    { id: 21, nm: "Hindrance", hb: "Ghagiel", hbh: "עגיאל", desc: "Blocked insight — confusion masquerading as wisdom.", qp: 0, y: 4.5, cl: 0x551133 },
    { id: 22, nm: "Concealment", hb: "Satariel", hbh: "סתריאל", desc: "Veiled truth — understanding corrupted into obfuscation.", qp: 1, y: 4.5, cl: 0x441144 },
    { id: 23, nm: "Devouring", hb: "Gamchicoth", hbh: "גמחיכות", desc: "Consuming love — generosity twisted into possessiveness.", qp: 0, y: 1.5, cl: 0x441111 },
    { id: 24, nm: "Burning", hb: "Golachab", hbh: "גולחב", desc: "Purposeless fire — severity without wisdom, cruelty for its own sake.", qp: 1, y: 1.5, cl: 0x661100 },
    { id: 25, nm: "Disputers", hb: "Thagirion", hbh: "תגריון", desc: "Beauty as argument — harmony corrupted into endless conflict.", qp: "qc", y: 0, cl: 0x554400 },
    { id: 26, nm: "Ravens", hb: "A'arab Zaraq", hbh: "ערב זרק", desc: "Scattering force — victory that disperses rather than gathers.", qp: 0, y: -2.5, cl: 0x334411 },
    { id: 27, nm: "Poison of God", hb: "Samael", hbh: "סמאל", desc: "Toxic brilliance — intellect weaponized against its source.", qp: 1, y: -2.5, cl: 0x553300 },
    { id: 28, nm: "Obscene Ones", hb: "Gamaliel", hbh: "גמליאל", desc: "Corrupt dreams — the foundation poisoned by illusion.", qp: "qc", y: -4.5, cl: 0x440055 },
    { id: 29, nm: "Night Specter", hb: "Lilith", hbh: "לילית", desc: "World in exile — the kingdom estranged from its source.", qp: "qc", y: -6.5, cl: 0x330033 },
];

const PATHS_DATA = [
    { from: 0, to: 1, let: "א", nm: "Aleph", mn: "Breath" }, { from: 0, to: 2, let: "ב", nm: "Beth", mn: "House" },
    { from: 0, to: 5, let: "ג", nm: "Gimel", mn: "Camel" }, { from: 1, to: 2, let: "ד", nm: "Daleth", mn: "Door" },
    { from: 1, to: 5, let: "ה", nm: "Heh", mn: "Window" }, { from: 1, to: 3, let: "ו", nm: "Vav", mn: "Nail" },
    { from: 2, to: 5, let: "ז", nm: "Zayin", mn: "Sword" }, { from: 2, to: 4, let: "ח", nm: "Cheth", mn: "Fence" },
    { from: 3, to: 4, let: "ט", nm: "Teth", mn: "Serpent" }, { from: 3, to: 5, let: "י", nm: "Yod", mn: "Hand" },
    { from: 3, to: 6, let: "כ", nm: "Kaph", mn: "Palm" }, { from: 4, to: 5, let: "ל", nm: "Lamed", mn: "Ox-goad" },
    { from: 4, to: 7, let: "מ", nm: "Mem", mn: "Water" }, { from: 5, to: 6, let: "נ", nm: "Nun", mn: "Fish" },
    { from: 5, to: 8, let: "ס", nm: "Samekh", mn: "Support" }, { from: 5, to: 7, let: "ע", nm: "Ayin", mn: "Eye" },
    { from: 6, to: 7, let: "פ", nm: "Peh", mn: "Mouth" }, { from: 6, to: 8, let: "צ", nm: "Tzadi", mn: "Fishhook" },
    { from: 6, to: 9, let: "ק", nm: "Qoph", mn: "Back of head" }, { from: 7, to: 8, let: "ר", nm: "Resh", mn: "Head" },
    { from: 7, to: 9, let: "ש", nm: "Shin", mn: "Fire" }, { from: 8, to: 9, let: "ת", nm: "Tav", mn: "Mark" },
];

const HPTH = [[0, 11], [11, 12], [12, 5], [12, 13], [13, 8], [13, 9], [11, 1], [11, 2]];
const QPTH = [[20, 21], [20, 22], [20, 25], [21, 22], [21, 23], [21, 25], [22, 24], [22, 25], [23, 24], [23, 25], [23, 26], [24, 25], [24, 27], [25, 26], [25, 27], [25, 28], [26, 27], [26, 28], [26, 29], [27, 28], [27, 29], [28, 29]];
const TUNL = [[0, 20], [1, 21], [2, 22], [3, 23], [4, 24], [5, 25], [6, 26], [7, 27], [8, 28], [9, 29]];
const KUNDALINI_COLORS = [0xdd2222, 0xff6622, 0xccaa22, 0x33cc55, 0x4444dd, 0x6622aa, 0xcc88ff];

// Enriched path correspondences (Golden Dawn tradition)
const PATH_CORR = [
    { from: 0, to: 1, let: "א", nm: "Aleph", mn: "Ox", tarot: "The Fool", attr: "Air", type: "Mother", desc: "The breath before creation — pure potential leaping into the void. The path between Crown and Wisdom carries the silent exhalation that precedes all thought." },
    { from: 0, to: 2, let: "ב", nm: "Beth", mn: "House", tarot: "The Magician", attr: "Mercury", type: "Double", desc: "The architect's first line — consciousness organizing itself into structure. Mercury's swiftness bridges divine will and the womb of form." },
    { from: 0, to: 5, let: "ג", nm: "Gimel", mn: "Camel", tarot: "High Priestess", attr: "Moon", type: "Double", desc: "The longest path on the tree — crossing the Abyss from Crown to Beauty. The camel carries the soul across the desert of Da'at, guided by lunar intuition." },
    { from: 1, to: 2, let: "ד", nm: "Daleth", mn: "Door", tarot: "The Empress", attr: "Venus", type: "Double", desc: "The door between the supernal father and mother. Venus unites Wisdom and Understanding in the creative act that births all lower emanation." },
    { from: 1, to: 5, let: "ה", nm: "Heh", mn: "Window", tarot: "The Emperor", attr: "Aries", type: "Simple", desc: "A window from above — Wisdom's fire descends through martial structure to illuminate the Heart. Aries initiates the downward flash." },
    { from: 1, to: 3, let: "ו", nm: "Vav", mn: "Nail", tarot: "The Hierophant", attr: "Taurus", type: "Simple", desc: "The nail that joins — Wisdom fastened to Mercy along the right pillar. Taurus grounds the flash of insight into enduring grace." },
    { from: 2, to: 5, let: "ז", nm: "Zayin", mn: "Sword", tarot: "The Lovers", attr: "Gemini", type: "Simple", desc: "The sword of discrimination — Understanding cuts through illusion to reach the Heart. Gemini's duality resolved in the choice of the Lovers." },
    { from: 2, to: 4, let: "ח", nm: "Cheth", mn: "Fence", tarot: "The Chariot", attr: "Cancer", type: "Simple", desc: "The protective enclosure — Understanding's womb channels its restrictive power into Severity. Cancer's shell guards the warrior within." },
    { from: 3, to: 4, let: "ט", nm: "Teth", mn: "Serpent", tarot: "Strength", attr: "Leo", type: "Simple", desc: "The serpent coiled between Mercy and Severity. Leo's courage tames the beast — not by force but by the gentle hand of love meeting discipline." },
    { from: 3, to: 5, let: "י", nm: "Yod", mn: "Hand", tarot: "The Hermit", attr: "Virgo", type: "Simple", desc: "The hand of God — the smallest letter containing infinite power. Mercy reaches toward Beauty in solitary contemplation, lamp held high." },
    { from: 3, to: 6, let: "כ", nm: "Kaph", mn: "Palm", tarot: "Wheel of Fortune", attr: "Jupiter", type: "Double", desc: "The open palm of Jupiter — Mercy's abundance pours downward to Victory. The wheel turns, and what was given above manifests below." },
    { from: 4, to: 5, let: "ל", nm: "Lamed", mn: "Ox-goad", tarot: "Justice", attr: "Libra", type: "Simple", desc: "The ox-goad drives toward balance — Severity's judgment refined into the harmonious scales of the Heart. Libra weighs all things equally." },
    { from: 4, to: 7, let: "מ", nm: "Mem", mn: "Water", tarot: "The Hanged Man", attr: "Water", type: "Mother", desc: "The great waters — Severity dissolves into Splendor through sacrifice and surrender. The Hanged Man sees the world inverted, and in inversion finds truth." },
    { from: 5, to: 6, let: "נ", nm: "Nun", mn: "Fish", tarot: "Death", attr: "Scorpio", type: "Simple", desc: "The fish in deep waters — Beauty transforms through death into Victory's endurance. Scorpio strips away the false to reveal what cannot die." },
    { from: 5, to: 8, let: "ס", nm: "Samekh", mn: "Support", tarot: "Temperance", attr: "Sagittarius", type: "Simple", desc: "The tent-pole of the soul — the central column from Heart to Foundation. Sagittarius aims the arrow of aspiration straight down the middle pillar." },
    { from: 5, to: 7, let: "ע", nm: "Ayin", mn: "Eye", tarot: "The Devil", attr: "Capricorn", type: "Simple", desc: "The eye that sees bondage — Beauty confronts Splendor's intellectual traps. Capricorn's ambition can chain or liberate; the Devil laughs either way." },
    { from: 6, to: 7, let: "פ", nm: "Peh", mn: "Mouth", tarot: "The Tower", attr: "Mars", type: "Double", desc: "The mouth that speaks destruction — Mars shatters the false tower between Victory and Splendor. What lightning demolishes, truth rebuilds." },
    { from: 6, to: 8, let: "צ", nm: "Tzadi", mn: "Fishhook", tarot: "The Star", attr: "Aquarius", type: "Simple", desc: "The hook that draws up — Victory's endurance pulls from Foundation's deep waters. Aquarius pours starlight into the vessel of the soul." },
    { from: 6, to: 9, let: "ק", nm: "Qoph", mn: "Back of head", tarot: "The Moon", attr: "Pisces", type: "Simple", desc: "The back of the skull — what cannot be seen directly. Victory descends to the Kingdom through dreams, illusion, and the treacherous moonlit path." },
    { from: 7, to: 8, let: "ר", nm: "Resh", mn: "Head", tarot: "The Sun", attr: "Sun", type: "Double", desc: "The head illuminated — Splendor's mental clarity blazes into Foundation. The Sun reveals all; nothing hides in its light." },
    { from: 7, to: 9, let: "ש", nm: "Shin", mn: "Tooth/Fire", tarot: "Judgement", attr: "Fire", type: "Mother", desc: "The triple flame — Splendor's fire descends to awaken the Kingdom. Shin's three prongs are the three mother letters made manifest. The dead rise." },
    { from: 8, to: 9, let: "ת", nm: "Tav", mn: "Mark/Cross", tarot: "The World", attr: "Saturn", type: "Double", desc: "The final seal — Foundation crystallizes into Kingdom. Saturn marks the boundary between the astral and the physical. The dancer completes the circle." },
];

// Tunnel descriptions (Qliphothic mirror paths)
const TUNNEL_DESC = {
    '0-20': 'The mirror of Crown in the shells — unity split into warring duality. Where Keter radiates oneness, Thaumiel tears it apart.',
    '1-21': 'Wisdom\'s shadow — the flash of insight blocked, distorted into confusion. Ghagiel obstructs the flow of creative force.',
    '2-22': 'Understanding veiled — Satariel conceals what Binah reveals. The mother\'s womb becomes a tomb of hidden meaning.',
    '3-23': 'Mercy devoured — Gamchicoth corrupts generosity into possessive hunger. What Chesed gives freely, its shadow consumes.',
    '4-24': 'Severity\'s fire without purpose — Golachab burns without wisdom. Gevurah\'s necessary discipline becomes cruelty unmoored.',
    '5-25': 'Beauty in eternal argument — Thagirion disputes what Tiferet harmonizes. The heart\'s balance shattered into perpetual conflict.',
    '6-26': 'Victory scattered — A\'arab Zaraq disperses what Netzach gathers. The ravens of dispersion tear endurance apart.',
    '7-27': 'Splendor poisoned — Samael weaponizes Hod\'s intellect. Brilliant analysis becomes toxic when divorced from compassion.',
    '8-28': 'Foundation corrupted — Gamaliel pollutes Yesod\'s dreams with obscene illusion. The astral mirror darkens.',
    '9-29': 'Kingdom in exile — Lilith severs Malkuth from its source. The manifest world estranged, wandering in the night.',
};

// Pillar data
const PILLARS = [
    { name: 'Pillar of Mercy (Right)', alias: 'Expansion · Masculine · Chokmah Pillar', desc: 'The right pillar represents the outpouring force — unbounded generosity, creative expansion, and the active masculine principle. In yoga it corresponds to Pingala, the solar channel. It is the right hand of God extended to draw the faithful near.', nodes: [1, 3, 6], color: '#5588cc' },
    { name: 'Pillar of Severity (Left)', alias: 'Restriction · Feminine · Binah Pillar', desc: 'The left pillar represents the constraining force — necessary form, discipline, and the receptive feminine principle. In yoga it corresponds to Ida, the lunar channel. It is the left hand that shapes and limits, giving definition to the infinite.', nodes: [2, 4, 7], color: '#bb2244' },
    { name: 'Middle Pillar (Equilibrium)', alias: 'Balance · Non-duality · Sushumna', desc: 'The central column reconciles all opposites — the spine of the tree, the path of balance. From Keter through Da\'at, Tiferet, Yesod to Malkuth, it traces the direct route of consciousness. In yoga it is Sushumna, the channel through which Kundalini rises.', nodes: [0, 10, 5, 8, 9], color: '#ccaa22' },
    { name: 'Back Pillar (Hidden)', alias: 'The Unseen · The Unconscious', desc: 'The hidden pillar exists behind the manifest tree — the back of the body of God. These concealed sephirot operate below the threshold of awareness, representing wisdom, mercy, and victory that move without being seen or claimed.', nodes: [11, 12, 13], color: '#335577' },
];

// Hidden path descriptions
const HIDDEN_DESC = [
    { from: 0, to: 11, desc: 'Crown to Hidden Wisdom — the first emanation passes behind the veil, seeding unconscious knowing.' },
    { from: 11, to: 12, desc: 'Hidden Wisdom to Hidden Mercy — silent knowing descends into silent grace along the back pillar.' },
    { from: 12, to: 5, desc: 'Hidden Mercy to Beauty — the unseen grace surfaces at the Heart, where it can finally be felt.' },
    { from: 12, to: 13, desc: 'Hidden Mercy to Hidden Victory — grace flows downward into quiet persistence.' },
    { from: 13, to: 8, desc: 'Hidden Victory to Foundation — endurance in the dark connects to the astral bridge.' },
    { from: 13, to: 9, desc: 'Hidden Victory to Kingdom — the back pillar\'s lowest reach, persistence that touches the earth.' },
    { from: 11, to: 1, desc: 'Hidden Wisdom to Wisdom — the unconscious and conscious flash of insight are secretly linked.' },
    { from: 11, to: 2, desc: 'Hidden Wisdom to Understanding — what is known without knowing informs the structure of the mother.' },
];

// ============================================================
// CONNECTION MAP — which nodes connect to which, and via which paths
// ============================================================
function buildConnectionMap() {
    const map = {};
    const allNodes = [...MAN, ...HID, ...QLP];
    for (const n of allNodes) map[n.id] = { paths: [], connected: new Set() };

    for (const pd of PATHS_DATA) {
        if (map[pd.from]) { map[pd.from].paths.push(pd); map[pd.from].connected.add(pd.to); }
        if (map[pd.to]) { map[pd.to].paths.push(pd); map[pd.to].connected.add(pd.from); }
    }
    for (const h of HPTH) {
        if (map[h[0]]) map[h[0]].connected.add(h[1]);
        if (map[h[1]]) map[h[1]].connected.add(h[0]);
    }
    for (const q of QPTH) {
        if (map[q[0]]) map[q[0]].connected.add(q[1]);
        if (map[q[1]]) map[q[1]].connected.add(q[0]);
    }
    for (const t of TUNL) {
        if (map[t[0]]) map[t[0]].connected.add(t[1]);
        if (map[t[1]]) map[t[1]].connected.add(t[0]);
    }
    return map;
}
const connectionMap = buildConnectionMap();

// ============================================================
// HELPERS
// ============================================================
function allSefirot() {
    let a = [...MAN];
    if (Ly.hid) a.push(...HID);
    if (Ly.qlp) a.push(...QLP);
    return a;
}
function byId(id) { return [...MAN, ...HID, ...QLP].find(s => s.id === id); }
function pos3(s) {
    if (s.p !== undefined) {
        const r = s.p === "c" ? 0 : P.rad;
        const a = s.p === "c" ? 0 : MA[s.p];
        return new THREE.Vector3(r * Math.cos(a), s.y, r * Math.sin(a));
    }
    if (s.qp !== undefined) {
        const r = s.qp === "qc" ? P.rad * 0.35 : P.rad;
        const a = s.qp === "qc" ? Math.PI : QA[s.qp];
        return new THREE.Vector3(r * Math.cos(a), s.y, r * Math.sin(a));
    }
    return new THREE.Vector3(0, s.y, 0);
}

// ============================================================
// THREE.JS SETUP
// ============================================================
const container = document.getElementById('three-canvas');
const labelsEl = document.getElementById('labels-container');
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x06060a, 0.005);

const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 500);
const renderer = new THREE.WebGLRenderer({ canvas: container, antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x06060a);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(container.clientWidth, container.clientHeight),
    P.bloom, 0.4, 0.85
);
composer.addPass(bloomPass);

scene.add(new THREE.AmbientLight(0x111118, 0.6));
const pointLight = new THREE.PointLight(0xbbaa33, 0.5, 40);
pointLight.position.set(0, 2, 0);
scene.add(pointLight);

const group = new THREE.Group();
scene.add(group);
const clock = new THREE.Clock();

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2(-999, -999);

// ============================================================
// SCENE STATE
// ============================================================
let meshes = [], glows = [], nodeLabels = [], pathLabels = [];
let pathCurves = [], pathLines = [];
let pathPS, pathParts = [];
let helixPS, helixParts = [], serpPS, serpParts = [];
let tunPS, tunParts = [];
let fieldPS, fieldParts = [];
let kunPS, kunParts = [];
let kunGlowMeshes = [];
let helixCurve, serpCurve;
let tunnelLines = [];

let drag = false, pointerPrev = { x: 0, y: 0 };
let ry = 0.4, rx = 0.15, camDist = 24;
let tRy = 0.4, tRx = 0.15, tDist = 24;

// ============================================================
// PARTICLE HELPERS
// ============================================================
function makePS(count, size, opacity) {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(count * 3), 3));
    geo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(count * 3), 3));
    return new THREE.Points(geo, new THREE.PointsMaterial({
        size, vertexColors: true, transparent: true, opacity,
        blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true
    }));
}

function makeLine(a, b, color, opacity) {
    const line = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([a, b]),
        new THREE.LineBasicMaterial({ color, transparent: true, opacity })
    );
    group.add(line);
    return line;
}

function makeHelix(dir, rScale) {
    const pts = [];
    for (let i = 0; i < 500; i++) {
        const t = i / 500;
        const y = dir > 0 ? (-6.5 + t * 13) : (6.5 - t * 13);
        const a = dir * t * Math.PI * 2 * P.hlx;
        const r = P.rad * rScale * Math.sin(t * Math.PI);
        pts.push(new THREE.Vector3(r * Math.cos(a), y, r * Math.sin(a)));
    }
    return new THREE.CatmullRomCurve3(pts);
}

// ============================================================
// KUNDALINI
// ============================================================
function buildKundalini() {
    kunGlowMeshes = [];
    const N = 600;
    const kunPtsL = [], kunPtsR = [], kunPtsC = [];

    for (let i = 0; i < N; i++) {
        const t = i / N, y = -6.5 + t * 13;
        kunPtsC.push(new THREE.Vector3(0, y, 0));
        const angle = t * Math.PI * 2 * 3.5;
        const r = P.kwid * (0.3 + Math.sin(t * Math.PI) * 0.7);
        kunPtsL.push(new THREE.Vector3(r * Math.cos(angle), y, r * Math.sin(angle)));
        kunPtsR.push(new THREE.Vector3(r * Math.cos(angle + Math.PI), y, r * Math.sin(angle + Math.PI)));
    }

    // Sushumna
    group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(kunPtsC),
        new THREE.LineBasicMaterial({ color: 0xffffcc, transparent: true, opacity: 0.06 })));

    // Ida & Pingala with rainbow gradient
    for (const [pts, bias] of [[kunPtsL, [0.4, 0.4, 0.6]], [kunPtsR, [0.6, 0.4, 0.4]]]) {
        const colors = new Float32Array(N * 3);
        for (let i = 0; i < N; i++) {
            const t = i / N;
            const ci = Math.floor(t * (KUNDALINI_COLORS.length - 1));
            const ct = t * (KUNDALINI_COLORS.length - 1) - ci;
            const c1 = new THREE.Color(KUNDALINI_COLORS[ci]);
            const c2 = new THREE.Color(KUNDALINI_COLORS[Math.min(ci + 1, KUNDALINI_COLORS.length - 1)]);
            const c = c1.clone().lerp(c2, ct);
            colors[i * 3] = c.r * bias[0]; colors[i * 3 + 1] = c.g * bias[1]; colors[i * 3 + 2] = c.b * bias[2];
        }
        const geo = new THREE.BufferGeometry().setFromPoints(pts);
        geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        group.add(new THREE.Line(geo, new THREE.LineBasicMaterial({
            vertexColors: true, transparent: true, opacity: 0.25, blending: THREE.AdditiveBlending
        })));
    }

    // Chakra rings
    const chakras = [
        { y: -6.5, cl: 0xdd2222 }, { y: -4.5, cl: 0xff6622 }, { y: -1.5, cl: 0xddcc22 },
        { y: 0, cl: 0x33cc55 }, { y: 1.5, cl: 0x3388dd }, { y: 3.0, cl: 0x4422aa }, { y: 6.5, cl: 0xcc88ff },
    ];
    for (const ch of chakras) {
        const torus = new THREE.Mesh(
            new THREE.TorusGeometry(P.kwid * 1.2, 0.05, 8, 32),
            new THREE.MeshBasicMaterial({ color: ch.cl, transparent: true, opacity: 0.14, blending: THREE.AdditiveBlending })
        );
        torus.position.set(0, ch.y, 0); torus.rotation.x = Math.PI / 2;
        torus.userData = { chakra: ch }; group.add(torus); kunGlowMeshes.push(torus);

        const sph = new THREE.Mesh(
            new THREE.SphereGeometry(P.kwid * 0.6, 10, 10),
            new THREE.MeshBasicMaterial({ color: ch.cl, transparent: true, opacity: 0.03, side: THREE.BackSide })
        );
        sph.position.set(0, ch.y, 0); sph.userData = { chakra: ch }; group.add(sph); kunGlowMeshes.push(sph);
    }

    // Particles
    const kCount = 150;
    kunPS = makePS(kCount, 0.1, 0.9); group.add(kunPS);
    kunParts = [];
    for (let i = 0; i < kCount; i++) {
        kunParts.push({
            t: Math.random(), spd: (0.001 + Math.random() * 0.003) * P.spd,
            channel: Math.random() < 0.33 ? 'ida' : Math.random() < 0.5 ? 'pingala' : 'sushumna', idx: i
        });
    }
}

// ============================================================
// BUILD SCENE
// ============================================================
function rebuild() {
    while (group.children.length) group.remove(group.children[0]);
    labelsEl.innerHTML = '';
    meshes = []; glows = []; nodeLabels = []; pathLabels = [];
    pathCurves = []; pathLines = []; pathParts = []; helixParts = []; serpParts = [];
    tunParts = []; fieldParts = []; kunParts = []; kunGlowMeshes = [];
    tunnelLines = [];

    const sefs = allSefirot();

    // Pillar axes — very subtle
    for (let i = 0; i < 3; i++) {
        makeLine(
            new THREE.Vector3(P.rad * Math.cos(MA[i]), -8, P.rad * Math.sin(MA[i])),
            new THREE.Vector3(P.rad * Math.cos(MA[i]), 8, P.rad * Math.sin(MA[i])),
            [0x1a2244, 0x441122, 0x1a3322][i], 0.04
        );
    }
    makeLine(new THREE.Vector3(0, -8, 0), new THREE.Vector3(0, 8, 0), 0x222211, 0.03);

    if (Ly.qlp) {
        for (let i = 0; i < 3; i++) {
            makeLine(
                new THREE.Vector3(P.rad * Math.cos(QA[i]), -8, P.rad * Math.sin(QA[i])),
                new THREE.Vector3(P.rad * Math.cos(QA[i]), 8, P.rad * Math.sin(QA[i])),
                0x220808, 0.03
            );
        }
    }

    // Sefirot
    for (const s of sefs) {
        const p = pos3(s);
        const isQ = s.id >= 20, isH = s.id >= 11 && s.id < 20, isD = s.id === 10;
        const sz = s.id === 0 || s.id === 20 ? 0.38 : s.id === 9 || s.id === 29 ? 0.34 : isD ? 0.28 : isH ? 0.28 : isQ ? 0.28 : 0.30;

        const mesh = new THREE.Mesh(
            new THREE.SphereGeometry(sz, 28, 28),
            new THREE.MeshPhongMaterial({
                color: s.cl, emissive: s.cl,
                emissiveIntensity: 0.5,
                transparent: true, opacity: 0.95,
                shininess: 40
            })
        );
        mesh.position.copy(p); mesh.userData = s; group.add(mesh); meshes.push(mesh);

        // Smaller glows
        const glow = new THREE.Mesh(
            new THREE.SphereGeometry(sz * 2, 8, 8),
            new THREE.MeshBasicMaterial({ color: s.cl, transparent: true, opacity: 0.035, side: THREE.BackSide })
        );
        glow.position.copy(p); glow.userData = s; group.add(glow); glows.push(glow);

        // Label — name only, no description
        const cls = isQ ? 'node-label qlp' : isH ? 'node-label hid' : 'node-label';
        const div = document.createElement('div');
        div.className = cls;
        div.dataset.nodeId = s.id;
        const nameText = Lb.heb ? (s.hbh || s.hb) : s.nm;
        const subText = Lb.heb ? s.nm : s.hb;
        div.innerHTML = `<div class="nl-name">${nameText}</div><div class="nl-sub">${subText}</div>`;
        labelsEl.appendChild(div);
        nodeLabels.push({ div, s });
    }

    // Paths
    for (const pd of PATHS_DATA) {
        const s1 = byId(pd.from), s2 = byId(pd.to);
        if (!s1 || !s2) continue;
        const p1 = pos3(s1), p2 = pos3(s2);
        const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
        mid.x *= 0.88; mid.z *= 0.88;
        const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
        const line = new THREE.Line(
            new THREE.BufferGeometry().setFromPoints(curve.getPoints(24)),
            new THREE.LineBasicMaterial({
                color: new THREE.Color(s1.cl).lerp(new THREE.Color(s2.cl), 0.5),
                transparent: true, opacity: 0.12
            })
        );
        line.userData = { from: pd.from, to: pd.to };
        group.add(line);
        pathCurves.push({ curve, s1, s2, pd });
        pathLines.push(line);

        // Path label
        const ldiv = document.createElement('div');
        ldiv.className = 'path-label';
        ldiv.dataset.pathFrom = pd.from;
        ldiv.dataset.pathTo = pd.to;
        const pLabel = Lb.heb
            ? `<div class="pl-letter">${pd.let}</div><div class="pl-name">${pd.nm}</div>`
            : `<div class="pl-letter">${pd.mn}</div><div class="pl-name">${pd.nm}</div>`;
        ldiv.innerHTML = pLabel;
        labelsEl.appendChild(ldiv);
        pathLabels.push({ div: ldiv, curve, pd });
    }

    // Hidden paths
    if (Ly.hid) {
        for (const h of HPTH) {
            const s1 = byId(h[0]), s2 = byId(h[1]);
            if (!s1 || !s2) continue;
            const p1 = pos3(s1), p2 = pos3(s2);
            const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
            mid.x *= 0.88; mid.z *= 0.88;
            const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
            const line = new THREE.Line(
                new THREE.BufferGeometry().setFromPoints(curve.getPoints(20)),
                new THREE.LineBasicMaterial({ color: 0x334455, transparent: true, opacity: 0.06 })
            );
            line.userData = { from: h[0], to: h[1] };
            group.add(line);
            pathCurves.push({ curve, s1: byId(h[0]), s2: byId(h[1]) });
            pathLines.push(line);
        }
    }

    // Qliphoth paths
    if (Ly.qlp) {
        for (const q of QPTH) {
            const s1 = byId(q[0]), s2 = byId(q[1]);
            if (!s1 || !s2) continue;
            const p1 = pos3(s1), p2 = pos3(s2);
            const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
            mid.x *= 0.88; mid.z *= 0.88;
            const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
            const line = new THREE.Line(
                new THREE.BufferGeometry().setFromPoints(curve.getPoints(20)),
                new THREE.LineBasicMaterial({ color: 0x331111, transparent: true, opacity: 0.04 })
            );
            line.userData = { from: q[0], to: q[1] };
            group.add(line);
            pathCurves.push({ curve, s1: byId(q[0]), s2: byId(q[1]) });
            pathLines.push(line);
        }
    }

    // Tunnels
    if (Ly.tun && Ly.qlp) {
        for (const t of TUNL) {
            const s1 = byId(t[0]), s2 = byId(t[1]);
            if (!s1 || !s2) continue;
            const line = makeLine(pos3(s1), pos3(s2), 0x553322, 0.06);
            line.userData = { from: t[0], to: t[1] };
            tunnelLines.push(line);
        }
    }

    // Path particles
    const ppd = 6;
    pathPS = makePS(pathCurves.length * ppd, 0.07, 0.8); group.add(pathPS);
    for (let pi = 0; pi < pathCurves.length; pi++) {
        for (let i = 0; i < ppd; i++) {
            pathParts.push({ pi, t: Math.random(), dir: Math.random() > 0.5 ? 1 : -1, spd: (0.001 + Math.random() * 0.004) * P.spd, idx: pathParts.length });
        }
    }

    // Helices
    helixCurve = makeHelix(-1, 0.6);
    group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(helixCurve.getPoints(400)),
        new THREE.LineBasicMaterial({ color: 0xffcc33, transparent: true, opacity: 0.1, blending: THREE.AdditiveBlending })));
    helixPS = makePS(60, 0.09, 0.85); group.add(helixPS);
    for (let i = 0; i < 60; i++) helixParts.push({ t: Math.random(), spd: (0.001 + Math.random() * 0.003) * P.spd, idx: i });

    serpCurve = makeHelix(1, 0.5);
    group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(serpCurve.getPoints(400)),
        new THREE.LineBasicMaterial({ color: 0x8844cc, transparent: true, opacity: 0.08, blending: THREE.AdditiveBlending })));
    serpPS = makePS(60, 0.08, 0.75); group.add(serpPS);
    for (let i = 0; i < 60; i++) serpParts.push({ t: Math.random(), spd: (0.0008 + Math.random() * 0.0025) * P.spd, idx: i });

    // Tunnel particles
    if (Ly.tun && Ly.qlp) {
        tunPS = makePS(TUNL.length * 12, 0.06, 0.6); group.add(tunPS);
        for (let ti = 0; ti < TUNL.length; ti++) {
            for (let i = 0; i < 12; i++) {
                tunParts.push({ ti, t: Math.random(), dir: Math.random() > 0.5 ? 1 : -1, spd: (0.002 + Math.random() * 0.006) * P.spd, idx: tunParts.length });
            }
        }
    } else tunPS = null;

    // Field
    fieldPS = makePS(120, 0.035, 0.25); group.add(fieldPS);
    for (let i = 0; i < 120; i++) {
        fieldParts.push({
            theta: Math.random() * Math.PI * 2, phi: (Math.random() - 0.5) * Math.PI,
            r: P.rad * 0.5 + Math.random() * P.rad * 1.2,
            ts: (Math.random() - 0.5) * 0.008 * P.spd, ps: (Math.random() - 0.5) * 0.003 * P.spd,
            yO: (Math.random() - 0.5) * 14, ys: (Math.random() - 0.5) * 0.005 * P.spd, idx: i
        });
    }

    if (Ly.kun) buildKundalini();
    else kunPS = null;
}

// ============================================================
// HOVER / HIGHLIGHT SYSTEM
// ============================================================
function getActiveNode() { return hoveredNode || selectedNode; }

function isNodeHighlighted(nodeId) {
    const active = getActiveNode();
    if (!active) return false;
    if (nodeId === active.id) return true;
    const conn = connectionMap[active.id];
    return conn && conn.connected.has(nodeId);
}

function isPathHighlighted(fromId, toId) {
    const active = getActiveNode();
    if (!active) return false;
    return (fromId === active.id || toId === active.id);
}

function applyHighlightState() {
    const active = getActiveNode();
    const dimFactor = active ? 0.15 : 1;

    // 3D meshes
    for (let i = 0; i < meshes.length; i++) {
        const m = meshes[i], g = glows[i], s = m.userData;
        if (!active) {
            m.material.opacity = 0.95;
            g.material.opacity = 0.035;
        } else if (isNodeHighlighted(s.id)) {
            m.material.opacity = 1;
            g.material.opacity = 0.08;
        } else {
            m.material.opacity = 0.08;
            g.material.opacity = 0.005;
        }
    }

    // Path lines
    for (const line of pathLines) {
        const { from, to } = line.userData;
        if (!active) {
            line.material.opacity = 0.12;
        } else if (isPathHighlighted(from, to)) {
            line.material.opacity = 0.4;
        } else {
            line.material.opacity = 0.02;
        }
    }

    // Tunnel lines
    for (const line of tunnelLines) {
        const { from, to } = line.userData;
        if (!active) {
            line.material.opacity = 0.06;
        } else if (isPathHighlighted(from, to)) {
            line.material.opacity = 0.25;
        } else {
            line.material.opacity = 0.01;
        }
    }

    // HTML labels
    for (const ld of nodeLabels) {
        if (!active) {
            ld.div.classList.remove('dimmed', 'highlighted');
        } else if (isNodeHighlighted(ld.s.id)) {
            ld.div.classList.remove('dimmed');
            ld.div.classList.add('highlighted');
        } else {
            ld.div.classList.add('dimmed');
            ld.div.classList.remove('highlighted');
        }
    }

    // Path labels
    for (const pl of pathLabels) {
        if (!active) {
            pl.div.classList.remove('dimmed', 'highlighted');
        } else if (pl.pd && isPathHighlighted(pl.pd.from, pl.pd.to)) {
            pl.div.classList.remove('dimmed');
            pl.div.classList.add('highlighted');
        } else {
            pl.div.classList.add('dimmed');
            pl.div.classList.remove('highlighted');
        }
    }
}

// ============================================================
// DETAIL PANEL
// ============================================================
function showDetail(s) {
    document.getElementById('detail-empty').style.display = 'none';
    document.getElementById('detail-content').classList.remove('hidden');
    document.getElementById('detail-color-bar').style.background = '#' + s.cl.toString(16).padStart(6, '0');
    document.getElementById('detail-name').textContent = s.nm;
    document.getElementById('detail-hebrew').textContent = `${s.hbh || ''} — ${s.hb}`;
    document.getElementById('detail-desc').textContent = s.desc || '';
    document.getElementById('detail-chakra').textContent = s.chakra ? `Chakra: ${s.chakra}` : '';

    // Update knowledge drawer context
    if (typeof setDrawerContext === 'function') setDrawerContext(s);

    // Show connections
    const conn = connectionMap[s.id];
    if (conn && conn.connected.size > 0) {
        const names = [...conn.connected].map(id => {
            const n = byId(id);
            return n ? `<span data-node-id="${id}">${n.nm}</span>` : '';
        }).filter(Boolean).join(' ');
        document.getElementById('detail-connections').innerHTML = `Connected to: ${names}`;

        // Click on connection names
        document.querySelectorAll('#detail-connections span[data-node-id]').forEach(el => {
            el.addEventListener('click', () => {
                const n = byId(parseInt(el.dataset.nodeId));
                if (n) { selectedNode = n; hoveredNode = null; showDetail(n); applyHighlightState(); }
            });
        });
    } else {
        document.getElementById('detail-connections').innerHTML = '';
    }
}

function clearDetail() {
    document.getElementById('detail-empty').style.display = 'flex';
    document.getElementById('detail-content').classList.add('hidden');
    if (typeof setDrawerContext === 'function') setDrawerContext(null);
}

// ============================================================
// ANIMATION
// ============================================================
function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    if (!drag) tRy += P.rot * 0.008;
    ry += (tRy - ry) * 0.06;
    rx += (tRx - rx) * 0.06;
    camDist += (tDist - camDist) * 0.06;
    camera.position.set(Math.sin(ry) * Math.cos(rx) * camDist, Math.sin(rx) * camDist, Math.cos(ry) * Math.cos(rx) * camDist);
    camera.lookAt(0, 0, 0);

    // Pulse sefirot
    for (let i = 0; i < meshes.length; i++) {
        const m = meshes[i], g = glows[i], s = m.userData;
        const b = Math.sin(t * P.pul + s.id * 0.55) * 0.5 + 0.5;
        const isActive = getActiveNode() && s.id === getActiveNode().id;
        const pulseScale = isActive ? 1 + b * 0.4 : 1 + b * 0.15;
        m.scale.setScalar(pulseScale);
        g.scale.setScalar(1 + b * 0.3);
        m.material.emissiveIntensity = isActive ? 0.5 + b * 0.8 : 0.25 + b * 0.4;
    }

    // Path particles
    if (pathPS) {
        const pos = pathPS.geometry.attributes.position.array;
        const col = pathPS.geometry.attributes.color.array;
        for (const fp of pathParts) {
            fp.t += fp.spd * fp.dir; if (fp.t > 1) fp.t = 0; if (fp.t < 0) fp.t = 1;
            const pc = pathCurves[fp.pi]; if (!pc) continue;
            const pt = pc.curve.getPointAt(Math.max(0.001, Math.min(0.999, fp.t)));
            pos[fp.idx * 3] = pt.x; pos[fp.idx * 3 + 1] = pt.y; pos[fp.idx * 3 + 2] = pt.z;
            const c1 = new THREE.Color(pc.s1.cl), c2 = new THREE.Color(pc.s2.cl);
            const c = c1.clone().lerp(c2, fp.t);
            const f = Math.sin(fp.t * Math.PI);
            const active = getActiveNode();
            const dimmed = active && !isPathHighlighted(pc.s1.id, pc.s2.id);
            const mul = dimmed ? 0.1 : 1;
            col[fp.idx * 3] = c.r * f * mul; col[fp.idx * 3 + 1] = c.g * f * mul; col[fp.idx * 3 + 2] = c.b * f * mul;
        }
        pathPS.geometry.attributes.position.needsUpdate = true;
        pathPS.geometry.attributes.color.needsUpdate = true;
    }

    // Helix
    const showL = P.flow !== 'serp';
    if (helixPS) {
        const pos = helixPS.geometry.attributes.position.array, col = helixPS.geometry.attributes.color.array;
        for (const hp of helixParts) {
            hp.t += hp.spd; if (hp.t > 1) hp.t = 0;
            const pt = helixCurve.getPointAt(Math.max(0.001, Math.min(0.999, hp.t)));
            pos[hp.idx * 3] = pt.x; pos[hp.idx * 3 + 1] = pt.y; pos[hp.idx * 3 + 2] = pt.z;
            const f = showL ? Math.sin(hp.t * Math.PI) : 0;
            const p = 0.7 + Math.sin(t * 3 + hp.t * 20) * 0.3;
            col[hp.idx * 3] = f * p; col[hp.idx * 3 + 1] = 0.8 * f * p; col[hp.idx * 3 + 2] = 0.2 * f * p;
        }
        helixPS.geometry.attributes.position.needsUpdate = true; helixPS.geometry.attributes.color.needsUpdate = true;
    }

    const showS = P.flow !== 'light';
    if (serpPS) {
        const pos = serpPS.geometry.attributes.position.array, col = serpPS.geometry.attributes.color.array;
        for (const sp of serpParts) {
            sp.t += sp.spd; if (sp.t > 1) sp.t = 0;
            const pt = serpCurve.getPointAt(Math.max(0.001, Math.min(0.999, sp.t)));
            pos[sp.idx * 3] = pt.x; pos[sp.idx * 3 + 1] = pt.y; pos[sp.idx * 3 + 2] = pt.z;
            const f = showS ? Math.sin(sp.t * Math.PI) : 0;
            const p = 0.6 + Math.sin(t * 2.5 + sp.t * 15) * 0.4;
            col[sp.idx * 3] = 0.55 * f * p; col[sp.idx * 3 + 1] = 0.25 * f * p; col[sp.idx * 3 + 2] = 0.8 * f * p;
        }
        serpPS.geometry.attributes.position.needsUpdate = true; serpPS.geometry.attributes.color.needsUpdate = true;
    }

    // Tunnels
    if (tunPS) {
        const pos = tunPS.geometry.attributes.position.array, col = tunPS.geometry.attributes.color.array;
        for (const tp of tunParts) {
            tp.t += tp.spd * tp.dir;
            if (tp.t > 1) { tp.t = 1; tp.dir = -1; } if (tp.t < 0) { tp.t = 0; tp.dir = 1; }
            const tn = TUNL[tp.ti]; const s1 = byId(tn[0]), s2 = byId(tn[1]); if (!s1 || !s2) continue;
            const lp = new THREE.Vector3().lerpVectors(pos3(s1), pos3(s2), tp.t);
            const sp = Math.sin(tp.t * Math.PI * 4 + t * 3) * 0.3;
            const sa = tp.t * Math.PI * 6 + t * 2;
            lp.x += Math.cos(sa) * sp; lp.z += Math.sin(sa) * sp;
            pos[tp.idx * 3] = lp.x; pos[tp.idx * 3 + 1] = lp.y; pos[tp.idx * 3 + 2] = lp.z;
            const f = Math.sin(tp.t * Math.PI);
            const c1 = new THREE.Color(s1.cl), c2 = new THREE.Color(s2.cl), c = c1.clone().lerp(c2, tp.t);
            col[tp.idx * 3] = c.r * f * 0.5; col[tp.idx * 3 + 1] = c.g * f * 0.4; col[tp.idx * 3 + 2] = c.b * f * 0.5;
        }
        tunPS.geometry.attributes.position.needsUpdate = true; tunPS.geometry.attributes.color.needsUpdate = true;
    }

    // Field
    if (fieldPS) {
        const pos = fieldPS.geometry.attributes.position.array, col = fieldPS.geometry.attributes.color.array;
        for (const fp of fieldParts) {
            fp.theta += fp.ts; fp.phi += fp.ps; fp.yO += fp.ys;
            if (fp.yO > 7) { fp.yO = 7; fp.ys *= -1; } if (fp.yO < -7) { fp.yO = -7; fp.ys *= -1; }
            const x = fp.r * Math.cos(fp.theta) * Math.cos(fp.phi), z = fp.r * Math.sin(fp.theta) * Math.cos(fp.phi), y = fp.yO;
            pos[fp.idx * 3] = x; pos[fp.idx * 3 + 1] = y; pos[fp.idx * 3 + 2] = z;
            let mD = 999, nC = 0xffffff;
            for (const m of meshes) { const d = Math.sqrt((x - m.position.x) ** 2 + (y - m.position.y) ** 2 + (z - m.position.z) ** 2); if (d < mD) { mD = d; nC = m.userData.cl; } }
            const nc = new THREE.Color(nC), br = Math.max(0, 1 - mD / 6) * 0.4, fl = 0.4 + Math.sin(t * 2 + fp.idx * 0.1) * 0.3;
            col[fp.idx * 3] = nc.r * br * fl; col[fp.idx * 3 + 1] = nc.g * br * fl; col[fp.idx * 3 + 2] = nc.b * br * fl;
        }
        fieldPS.geometry.attributes.position.needsUpdate = true; fieldPS.geometry.attributes.color.needsUpdate = true;
    }

    // Kundalini
    if (kunPS && Ly.kun) {
        const pos = kunPS.geometry.attributes.position.array, col = kunPS.geometry.attributes.color.array;
        for (const kp of kunParts) {
            kp.t += kp.spd * P.kint * 0.7; if (kp.t > 1) kp.t = 0;
            const y = -6.5 + kp.t * 13;
            let x = 0, z = 0;
            const angle = kp.t * Math.PI * 2 * 3.5, r = P.kwid * (0.3 + Math.sin(kp.t * Math.PI) * 0.7);
            if (kp.channel === 'ida') { x = r * Math.cos(angle + t * 2); z = r * Math.sin(angle + t * 2); }
            else if (kp.channel === 'pingala') { x = r * Math.cos(angle + Math.PI + t * 2); z = r * Math.sin(angle + Math.PI + t * 2); }
            else { x = Math.sin(t * 3 + kp.t * 10) * 0.05; z = Math.cos(t * 3 + kp.t * 10) * 0.05; }
            pos[kp.idx * 3] = x; pos[kp.idx * 3 + 1] = y; pos[kp.idx * 3 + 2] = z;
            const ci = Math.floor(kp.t * (KUNDALINI_COLORS.length - 1));
            const ct = kp.t * (KUNDALINI_COLORS.length - 1) - ci;
            const c1 = new THREE.Color(KUNDALINI_COLORS[ci]);
            const c2 = new THREE.Color(KUNDALINI_COLORS[Math.min(ci + 1, KUNDALINI_COLORS.length - 1)]);
            const c = c1.clone().lerp(c2, ct);
            const fade = Math.sin(kp.t * Math.PI) * P.kint * 0.7;
            const pulse = 0.6 + Math.sin(t * 4 + kp.t * 15) * 0.4;
            col[kp.idx * 3] = c.r * fade * pulse; col[kp.idx * 3 + 1] = c.g * fade * pulse; col[kp.idx * 3 + 2] = c.b * fade * pulse;
        }
        kunPS.geometry.attributes.position.needsUpdate = true; kunPS.geometry.attributes.color.needsUpdate = true;
    }

    // Chakra glow
    for (const gm of kunGlowMeshes) {
        if (!gm.userData.chakra) continue;
        const idx = [-6.5, -4.5, -1.5, 0, 1.5, 3.0, 6.5].indexOf(gm.userData.chakra.y);
        const b = Math.sin(t * P.pul * 1.5 + idx * 0.8) * 0.5 + 0.5;
        gm.scale.setScalar(1 + b * 0.25 * P.kint);
        if (gm.geometry.type === 'TorusGeometry') gm.material.opacity = 0.08 + b * 0.1 * P.kint;
        else gm.material.opacity = 0.02 + b * 0.03 * P.kint;
    }

    // Labels
    const w = renderer.domElement.clientWidth, h = renderer.domElement.clientHeight;
    for (const ld of nodeLabels) {
        const p = pos3(ld.s).clone(); p.y += 0.5;
        group.localToWorld(p); p.project(camera);
        ld.div.style.left = (p.x * 0.5 + 0.5) * w + 'px';
        ld.div.style.top = (-p.y * 0.5 + 0.5) * h + 'px';
        const behind = p.z > 1;
        const d = camera.position.distanceTo(pos3(ld.s));
        const fade = Math.max(0, Math.min(1, 1 - (d - 8) / 28));
        const isQ = ld.s.id >= 20, isH = ld.s.id >= 11 && ld.s.id < 20, isD = ld.s.id === 10;
        const baseFade = 0.9;
        ld.div.style.opacity = Lb.nlab ? (behind ? 0 : fade * baseFade) : 0;
    }
    for (const pl of pathLabels) {
        const mp = pl.curve.getPointAt(0.5); group.localToWorld(mp); mp.project(camera);
        pl.div.style.left = (mp.x * 0.5 + 0.5) * w + 'px';
        pl.div.style.top = (-mp.y * 0.5 + 0.5) * h + 'px';
        pl.div.style.opacity = Lb.plab ? (mp.z > 1 ? 0 : 0.4) : 0;
    }

    bloomPass.strength = P.bloom;
    composer.render();
}

// ============================================================
// INTERACTION
// ============================================================
const canvasEl = renderer.domElement;
let pointerMoved = false;

canvasEl.addEventListener('mousedown', e => {
    drag = true; pointerMoved = false;
    pointerPrev = { x: e.clientX, y: e.clientY };
});
canvasEl.addEventListener('mousemove', e => {
    if (drag) {
        const dx = e.clientX - pointerPrev.x, dy = e.clientY - pointerPrev.y;
        if (Math.abs(dx) > 2 || Math.abs(dy) > 2) pointerMoved = true;
        tRy += dx * 0.005; tRx += dy * 0.005;
        tRx = Math.max(-1.5, Math.min(1.5, tRx));
        pointerPrev = { x: e.clientX, y: e.clientY };
    }

    // Hover detection
    const rect = canvasEl.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const hits = raycaster.intersectObjects(meshes);
    const prev = hoveredNode;
    hoveredNode = hits.length > 0 ? hits[0].object.userData : null;

    if (hoveredNode !== prev) {
        applyHighlightState();
        if (hoveredNode && !selectedNode) showDetail(hoveredNode);
        else if (!hoveredNode && !selectedNode) clearDetail();
        canvasEl.style.cursor = hoveredNode ? 'pointer' : 'grab';
    }
});
canvasEl.addEventListener('mouseup', e => {
    if (!pointerMoved) {
        // Click
        const rect = canvasEl.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        const hits = raycaster.intersectObjects(meshes);
        if (hits.length > 0) {
            selectedNode = hits[0].object.userData;
            hoveredNode = null;
            showDetail(selectedNode);
            applyHighlightState();
        } else {
            // Click on empty space — deselect
            selectedNode = null;
            hoveredNode = null;
            clearDetail();
            applyHighlightState();
        }
    }
    drag = false;
});
canvasEl.addEventListener('mouseleave', () => {
    drag = false;
    if (!selectedNode) {
        hoveredNode = null;
        applyHighlightState();
        clearDetail();
    }
});
canvasEl.addEventListener('wheel', e => {
    tDist += e.deltaY * 0.015; tDist = Math.max(6, Math.min(50, tDist));
});

// Touch
canvasEl.addEventListener('touchstart', e => {
    e.preventDefault(); drag = true; pointerMoved = false;
    pointerPrev = { x: e.touches[0].clientX, y: e.touches[0].clientY };
}, { passive: false });
canvasEl.addEventListener('touchmove', e => {
    e.preventDefault(); if (!drag) return;
    pointerMoved = true;
    tRy += (e.touches[0].clientX - pointerPrev.x) * 0.005;
    tRx += (e.touches[0].clientY - pointerPrev.y) * 0.005;
    tRx = Math.max(-1.5, Math.min(1.5, tRx));
    pointerPrev = { x: e.touches[0].clientX, y: e.touches[0].clientY };
}, { passive: false });
canvasEl.addEventListener('touchend', () => { drag = false; });

// ============================================================
// SIDEBAR CONTROLS
// ============================================================
document.querySelectorAll('[data-layer]').forEach(btn => {
    btn.addEventListener('click', () => {
        Ly[btn.dataset.layer] = !Ly[btn.dataset.layer];
        btn.classList.toggle('on', Ly[btn.dataset.layer]);
        rebuild(); applyHighlightState();
    });
});
document.querySelectorAll('[data-label]').forEach(btn => {
    btn.addEventListener('click', () => {
        Lb[btn.dataset.label] = !Lb[btn.dataset.label];
        btn.classList.toggle('on', Lb[btn.dataset.label]);
        rebuild(); applyHighlightState();
    });
});
document.querySelectorAll('[data-flow]').forEach(btn => {
    btn.addEventListener('click', () => {
        P.flow = btn.dataset.flow;
        document.querySelectorAll('[data-flow]').forEach(b => b.classList.toggle('on', b.dataset.flow === P.flow));
    });
});
document.querySelectorAll('[data-param]').forEach(input => {
    input.addEventListener('input', () => {
        P[input.dataset.param] = parseFloat(input.value);
        document.querySelector(`[data-display="${input.dataset.param}"]`).textContent = input.value;
        if (['rad', 'hlx', 'kwid'].includes(input.dataset.param)) { rebuild(); applyHighlightState(); }
    });
});
document.querySelectorAll('[data-view]').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('[data-view]').forEach(b => b.classList.toggle('on', b.dataset.view === btn.dataset.view));
        if (btn.dataset.view === 'top') { tRx = 1.5; tDist = 30; }
        else if (btn.dataset.view === 'sid') { tRx = 0; tDist = 24; }
        else { tRx = 0.15; tDist = 24; }
    });
});

// Collapsible sections
document.querySelectorAll('.section-toggle').forEach(el => {
    el.addEventListener('click', () => {
        const section = document.getElementById(el.dataset.toggle);
        if (section) section.classList.toggle('collapsed');
    });
});

// Mobile
document.getElementById('mobile-toggle').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
});

// ============================================================
// SEARCH
// ============================================================
const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');
const allNodes = [...MAN, ...HID, ...QLP];

searchInput.addEventListener('input', () => {
    const q = searchInput.value.trim().toLowerCase();
    if (!q) { searchResults.classList.add('hidden'); searchResults.innerHTML = ''; return; }

    const matches = allNodes.filter(n =>
        n.nm.toLowerCase().includes(q) || n.hb.toLowerCase().includes(q) ||
        (n.hbh && n.hbh.includes(q)) || (n.desc && n.desc.toLowerCase().includes(q))
    ).slice(0, 8);

    if (matches.length === 0) { searchResults.classList.add('hidden'); return; }

    searchResults.classList.remove('hidden');
    searchResults.innerHTML = matches.map(n =>
        `<div class="search-result" data-search-id="${n.id}"><span>${n.nm}</span><span class="sr-heb">${n.hb}</span></div>`
    ).join('');

    searchResults.querySelectorAll('.search-result').forEach(el => {
        el.addEventListener('click', () => {
            const node = byId(parseInt(el.dataset.searchId));
            if (node) {
                selectedNode = node; hoveredNode = null;
                showDetail(node); applyHighlightState();
                searchInput.value = '';
                searchResults.classList.add('hidden');
                searchResults.innerHTML = '';
            }
        });
    });
});

searchInput.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        searchInput.value = ''; searchResults.classList.add('hidden'); searchResults.innerHTML = '';
        searchInput.blur();
    }
});

// Resize
window.addEventListener('resize', () => {
    const w = container.clientWidth, h = container.clientHeight;
    camera.aspect = w / h; camera.updateProjectionMatrix();
    renderer.setSize(w, h); composer.setSize(w, h); bloomPass.resolution.set(w, h);
});

// ============================================================
// KNOWLEDGE DRAWER
// ============================================================
const drawer = document.getElementById('knowledge-drawer');
const drawerHandle = document.getElementById('drawer-handle');
const drawerTitle = document.getElementById('drawer-title');
const drawerContent = document.getElementById('drawer-content');
let activeTab = 'paths';
let drawerNodeContext = null; // which node to show context for

drawerHandle.addEventListener('click', () => {
    drawer.classList.toggle('collapsed');
});

document.querySelectorAll('.drawer-tab').forEach(btn => {
    btn.addEventListener('click', () => {
        activeTab = btn.dataset.tab;
        document.querySelectorAll('.drawer-tab').forEach(b => b.classList.toggle('active', b.dataset.tab === activeTab));
        renderDrawer();
    });
});

function setDrawerContext(node) {
    drawerNodeContext = node;
    if (node) {
        drawerTitle.textContent = `${node.nm} — Connections`;
    } else {
        drawerTitle.textContent = 'Connections & Correspondences';
    }
    renderDrawer();
}

function renderDrawer() {
    switch (activeTab) {
        case 'paths': renderPaths(); break;
        case 'pillars': renderPillars(); break;
        case 'tunnels': renderTunnels(); break;
        case 'hidden': renderHidden(); break;
        case 'overview': renderOverview(); break;
    }
}

function renderPaths() {
    let paths = PATH_CORR;
    let contextHTML = '';
    if (drawerNodeContext) {
        const id = drawerNodeContext.id;
        paths = PATH_CORR.filter(p => p.from === id || p.to === id);
        if (paths.length === 0) {
            drawerContent.innerHTML = `<div class="drawer-context">No manifest paths connect to <span class="ctx-accent">${drawerNodeContext.nm}</span></div><p style="font-size:11px;color:var(--color-text-faint)">Try the Tunnels or Hidden tabs for this node's connections.</p>`;
            return;
        }
        contextHTML = `<div class="drawer-context">Paths through <span class="ctx-accent">${drawerNodeContext.nm}</span></div>`;
    }
    drawerContent.innerHTML = contextHTML + paths.map(p => {
        const fromN = byId(p.from), toN = byId(p.to);
        return `<div class="path-card">
            <div><div class="path-letter">${p.let}</div><div class="path-letter-name">${p.nm}</div></div>
            <div class="path-info">
                <h4>${p.mn}<span class="path-connects">${fromN ? fromN.nm : '?'} → ${toN ? toN.nm : '?'}</span></h4>
                <div class="path-meta">
                    <span class="path-tag tarot">${p.tarot}</span>
                    <span class="path-tag element">${p.attr}</span>
                    <span class="path-tag type">${p.type}</span>
                </div>
                <p style="font-size:10px;color:var(--color-text-faint);line-height:1.55;margin-top:4px">${p.desc}</p>
            </div>
        </div>`;
    }).join('');
    wireDrawerNodeClicks();
}

function renderPillars() {
    let pillars = PILLARS;
    let contextHTML = '';
    if (drawerNodeContext) {
        const id = drawerNodeContext.id;
        pillars = PILLARS.filter(p => p.nodes.includes(id));
        if (pillars.length > 0) {
            contextHTML = `<div class="drawer-context"><span class="ctx-accent">${drawerNodeContext.nm}</span> belongs to:</div>`;
        }
    }
    drawerContent.innerHTML = contextHTML + pillars.map(p => {
        const nodeChips = p.nodes.map(nid => {
            const n = byId(nid);
            const c = n ? '#' + n.cl.toString(16).padStart(6, '0') : '#666';
            return `<span class="pillar-node" data-node-id="${nid}" style="color:${c};border-color:${c}33">${n ? n.nm : '?'}</span>`;
        }).join('');
        return `<div class="pillar-section">
            <div class="pillar-header" style="color:${p.color}">${p.name}</div>
            <div style="font-size:10px;color:var(--color-text-faint);margin-bottom:4px">${p.alias}</div>
            <div class="pillar-desc">${p.desc}</div>
            <div class="pillar-nodes">${nodeChips}</div>
        </div>`;
    }).join('');
    wireDrawerNodeClicks();
}

function renderTunnels() {
    let tunnels = TUNL;
    let contextHTML = '';
    if (drawerNodeContext) {
        const id = drawerNodeContext.id;
        tunnels = TUNL.filter(t => t[0] === id || t[1] === id);
        if (tunnels.length === 0) {
            drawerContent.innerHTML = `<div class="drawer-context">No tunnels connect to <span class="ctx-accent">${drawerNodeContext.nm}</span></div><p style="font-size:11px;color:var(--color-text-faint)">Tunnels link each Sephirah to its Qliphothic shadow (e.g. Keter ↔ Thaumiel).</p>`;
            return;
        }
        contextHTML = `<div class="drawer-context">Tunnels from <span class="ctx-accent">${drawerNodeContext.nm}</span></div>`;
    }
    drawerContent.innerHTML = contextHTML + tunnels.map(t => {
        const light = byId(t[0]), dark = byId(t[1]);
        const key = `${t[0]}-${t[1]}`;
        const desc = TUNNEL_DESC[key] || '';
        return `<div class="tunnel-card">
            <div class="tunnel-light"><span class="pillar-node" data-node-id="${t[0]}">${light ? light.nm : '?'}</span></div>
            <div class="tunnel-arrow">◇ tunnel ◇</div>
            <div class="tunnel-dark"><span class="pillar-node" data-node-id="${t[1]}" style="color:rgba(180,80,80,0.9);border-color:rgba(180,80,80,0.2)">${dark ? dark.nm : '?'}</span></div>
            ${desc ? `<div class="tunnel-desc">${desc}</div>` : ''}
        </div>`;
    }).join('');
    wireDrawerNodeClicks();
}

function renderHidden() {
    let paths = HIDDEN_DESC;
    let contextHTML = '';
    if (drawerNodeContext) {
        const id = drawerNodeContext.id;
        paths = HIDDEN_DESC.filter(h => h.from === id || h.to === id);
        if (paths.length === 0) {
            drawerContent.innerHTML = `<div class="drawer-context">No hidden paths connect to <span class="ctx-accent">${drawerNodeContext.nm}</span></div><p style="font-size:11px;color:var(--color-text-faint)">Hidden paths run along the back pillar, connecting the concealed sephirot.</p>`;
            return;
        }
        contextHTML = `<div class="drawer-context">Hidden paths through <span class="ctx-accent">${drawerNodeContext.nm}</span></div>`;
    }
    drawerContent.innerHTML = contextHTML + paths.map(h => {
        const fromN = byId(h.from), toN = byId(h.to);
        return `<div class="tunnel-card">
            <div class="tunnel-light"><span class="pillar-node" data-node-id="${h.from}">${fromN ? fromN.nm : '?'}</span></div>
            <div class="tunnel-arrow">· · ·</div>
            <div class="tunnel-dark" style="color:rgba(100,160,200,0.9)"><span class="pillar-node" data-node-id="${h.to}" style="color:rgba(100,160,200,0.9);border-color:rgba(100,160,200,0.2)">${toN ? toN.nm : '?'}</span></div>
            <div class="tunnel-desc">${h.desc}</div>
        </div>`;
    }).join('');
    wireDrawerNodeClicks();
}

function renderOverview() {
    drawerContent.innerHTML = `
        <div class="overview-section">
            <h4>The Tree of Life (Etz Chaim)</h4>
            <p>A diagram of divine emanation — ten sephirot (vessels of light) connected by twenty-two paths (Hebrew letters). Together they map the process by which the infinite becomes finite, the unmanifest becomes manifest. Every sephirah is a state of consciousness; every path is a transformation between states.</p>
        </div>
        <div class="overview-section">
            <h4>The 22 Paths</h4>
            <p>Each path corresponds to one of the 22 Hebrew letters, a Tarot Major Arcana card, and an astrological or elemental attribution. The three Mother letters (Aleph, Mem, Shin) carry the primal elements: Air, Water, Fire. The seven Double letters carry planetary forces. The twelve Simple letters carry zodiacal energies. Together they form the experiential bridges between states of being.</p>
        </div>
        <div class="overview-section">
            <h4>The Three Pillars</h4>
            <p>The tree divides into three vertical columns. The right Pillar of Mercy (Chokmah, Chesed, Netzach) represents expansion and the masculine principle — Pingala in yoga. The left Pillar of Severity (Binah, Gevurah, Hod) represents restriction and the feminine — Ida. The Middle Pillar (Keter, Da'at, Tiferet, Yesod, Malkuth) is Sushumna, the path of balance through which Kundalini rises.</p>
        </div>
        <div class="overview-section">
            <h4>The Qliphoth & Tunnels</h4>
            <p>The Tree of Night mirrors the Tree of Life — ten shells (Qliphoth) that represent the shadows and distortions of each sephirah. The Tunnels of Set are 22 dark paths connecting these shells, corresponding inversely to the paths of light. Named after the Egyptian god Set in the Typhonian tradition, they represent the unconscious, destructive, and transformative forces that exist behind the manifest tree.</p>
        </div>
        <div class="overview-section">
            <h4>The Hidden Sephirot</h4>
            <p>Behind the visible tree lies a fourth pillar — the Back Pillar. Three concealed sephirot (Chokmah Stumah, Chesed Stumah, Netzach Stumah) operate below the threshold of awareness. They represent the hidden aspects of wisdom, mercy, and endurance — forces that move through us without being recognized. Da'at, the hidden eleventh sephirah, marks the Abyss between the supernal triad and the lower tree.</p>
        </div>
        <div class="overview-section">
            <h4>Kundalini & the Central Pillar</h4>
            <p>The serpent fire (Kundalini) rises through the central channel — from Malkuth (Root/Muladhara) through Yesod (Sacral/Svadhisthana), Tiferet (Heart/Anahata), Da'at (Third Eye/Ajna), to Keter (Crown/Sahasrara). The twin helices of Ida and Pingala wind around this axis, mirroring the caduceus. Their union at each chakra activates the corresponding sephirah.</p>
        </div>
    `;
}

function wireDrawerNodeClicks() {
    drawerContent.querySelectorAll('.pillar-node[data-node-id]').forEach(el => {
        el.addEventListener('click', () => {
            const n = byId(parseInt(el.dataset.nodeId));
            if (n) {
                selectedNode = n; hoveredNode = null;
                showDetail(n); applyHighlightState();
                setDrawerContext(n);
            }
        });
    });
}

// ============================================================
// INIT
// ============================================================
rebuild();
animate();
renderDrawer();
