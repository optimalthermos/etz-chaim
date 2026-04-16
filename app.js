import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

// ============================================================
// STATE
// ============================================================
const P = { rot: 0.12, rad: 3.5, pul: 1.0, hlx: 3, spd: 1.5, kint: 1.5, kwid: 0.8, bloom: 1.2, flow: 'both' };
const Ly = { man: true, hid: true, qlp: true, tun: true, kun: true };
const Lb = { nlab: true, plab: true, heb: false };

// ============================================================
// SEFIROT DATA
// ============================================================
const MA = [0, 2 * Math.PI / 3, 4 * Math.PI / 3];
const QA = [Math.PI / 3, Math.PI, 5 * Math.PI / 3];

const MAN = [
    { id: 0, nm: "Crown", hb: "Keter", hbh: "כתר", desc: "Divine will — the first emanation, the point before all points. Pure intention without form.", p: "c", y: 6.5, cl: 0xeeddff, chakra: "Sahasrara", chcl: 0xcc88ff },
    { id: 1, nm: "Wisdom", hb: "Chokmah", hbh: "חכמה", desc: "The first flash of insight — undifferentiated creative force, the father principle.", p: 0, y: 4.5, cl: 0x5588cc },
    { id: 2, nm: "Understanding", hb: "Binah", hbh: "בינה", desc: "The receiving womb — form giving structure to the flash of Chokmah.", p: 1, y: 4.5, cl: 0xbb2244 },
    { id: 3, nm: "Mercy", hb: "Chesed", hbh: "חסד", desc: "Boundless love and expansion — the generous outpouring of creative energy.", p: 0, y: 1.5, cl: 0x3377bb },
    { id: 4, nm: "Severity", hb: "Gevurah", hbh: "גבורה", desc: "Necessary limit — the power of judgment that gives form through constraint.", p: 1, y: 1.5, cl: 0xaa1133 },
    { id: 5, nm: "Beauty", hb: "Tiferet", hbh: "תפארת", desc: "Heart and harmony — the compassionate center where all forces balance.", p: "c", y: 0, cl: 0xccaa22, chakra: "Anahata", chcl: 0x33cc55 },
    { id: 6, nm: "Victory", hb: "Netzach", hbh: "נצח", desc: "Endurance and eternity — the force of nature, instinct, and desire.", p: 0, y: -2.5, cl: 0x339944 },
    { id: 7, nm: "Splendor", hb: "Hod", hbh: "הוד", desc: "Form of thought — intellect, language, and the structure of communication.", p: 1, y: -2.5, cl: 0xcc6622 },
    { id: 8, nm: "Foundation", hb: "Yesod", hbh: "יסוד", desc: "The channel — the astral bridge between the mental and physical planes.", p: "c", y: -4.5, cl: 0x7744aa, chakra: "Svadhisthana", chcl: 0xff6622 },
    { id: 9, nm: "Kingdom", hb: "Malkuth", hbh: "מלכות", desc: "Manifest world — the physical realm where all higher forces crystallize.", p: "c", y: -6.5, cl: 0x446633, chakra: "Muladhara", chcl: 0xdd2222 },
    { id: 10, nm: "Knowledge", hb: "Da'at", hbh: "דעת", desc: "The abyss — the hidden sephirah, gateway between the supernal and the manifest.", p: "c", y: 3.0, cl: 0x888888, chakra: "Ajna", chcl: 0x4444dd },
];

const HID = [
    { id: 11, nm: "Hidden Wisdom", hb: "Chokmah'", hbh: "חכמה׳", desc: "Unseen knowing — wisdom that operates below the threshold of awareness.", p: 2, y: 4.5, cl: 0x335577 },
    { id: 12, nm: "Hidden Mercy", hb: "Chesed'", hbh: "חסד׳", desc: "Silent grace — love that moves without being recognized or claimed.", p: 2, y: 1.5, cl: 0x224466 },
    { id: 13, nm: "Hidden Victory", hb: "Netzach'", hbh: "נצח׳", desc: "Quiet endurance — the persistence that continues when all seems lost.", p: 2, y: -2.5, cl: 0x225533 },
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

// Post-processing
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(container.clientWidth, container.clientHeight),
    P.bloom, 0.4, 0.85
);
composer.addPass(bloomPass);

// Lighting
scene.add(new THREE.AmbientLight(0x111118, 0.6));
const pointLight = new THREE.PointLight(0xbbaa33, 0.5, 40);
pointLight.position.set(0, 2, 0);
scene.add(pointLight);

const group = new THREE.Group();
scene.add(group);
const clock = new THREE.Clock();

// Raycaster for clicking nodes
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// ============================================================
// SCENE STATE
// ============================================================
let meshes = [], glows = [], nodeLabels = [], pathLabels = [];
let pathCurves = [];
let pathPS, pathParts = [];
let helixPS, helixParts = [], serpPS, serpParts = [];
let tunPS, tunParts = [];
let fieldPS, fieldParts = [];
let kunPS, kunParts = [];
let kunGlowMeshes = [];
let helixCurve, serpCurve;

let drag = false, pointerPrev = { x: 0, y: 0 };
let ry = 0.4, rx = 0.15, camDist = 24;
let tRy = 0.4, tRx = 0.15, tDist = 24;

// ============================================================
// PARTICLE SYSTEM
// ============================================================
function makePS(count, size, opacity) {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(count * 3), 3));
    geo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(count * 3), 3));
    const mat = new THREE.PointsMaterial({
        size, vertexColors: true, transparent: true, opacity,
        blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true
    });
    return new THREE.Points(geo, mat);
}

function makeLine(a, b, color, opacity) {
    group.add(new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([a, b]),
        new THREE.LineBasicMaterial({ color, transparent: true, opacity })
    ));
}

function makeHelix(dir, rScale) {
    const pts = [];
    const N = 500;
    for (let i = 0; i < N; i++) {
        const t = i / N;
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
    const yBot = -6.5, yTop = 6.5, span = yTop - yBot;

    for (let i = 0; i < N; i++) {
        const t = i / N;
        const y = yBot + t * span;
        kunPtsC.push(new THREE.Vector3(0, y, 0));
        const coils = 3.5;
        const angle = t * Math.PI * 2 * coils;
        const r = P.kwid * (0.3 + Math.sin(t * Math.PI) * 0.7);
        kunPtsL.push(new THREE.Vector3(r * Math.cos(angle), y, r * Math.sin(angle)));
        kunPtsR.push(new THREE.Vector3(r * Math.cos(angle + Math.PI), y, r * Math.sin(angle + Math.PI)));
    }

    // Sushumna
    group.add(new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(kunPtsC),
        new THREE.LineBasicMaterial({ color: 0xffffcc, transparent: true, opacity: 0.08 })
    ));

    // Ida (moon)
    const idaColors = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
        const t = i / N;
        const ci = Math.floor(t * (KUNDALINI_COLORS.length - 1));
        const ct = t * (KUNDALINI_COLORS.length - 1) - ci;
        const c1 = new THREE.Color(KUNDALINI_COLORS[ci]);
        const c2 = new THREE.Color(KUNDALINI_COLORS[Math.min(ci + 1, KUNDALINI_COLORS.length - 1)]);
        const c = c1.clone().lerp(c2, ct);
        idaColors[i * 3] = c.r * 0.4;
        idaColors[i * 3 + 1] = c.g * 0.4;
        idaColors[i * 3 + 2] = c.b * 0.6;
    }
    const idaGeo = new THREE.BufferGeometry().setFromPoints(kunPtsL);
    idaGeo.setAttribute('color', new THREE.BufferAttribute(idaColors, 3));
    group.add(new THREE.Line(idaGeo, new THREE.LineBasicMaterial({
        vertexColors: true, transparent: true, opacity: 0.3, blending: THREE.AdditiveBlending
    })));

    // Pingala (sun)
    const pingColors = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
        const t = i / N;
        const ci = Math.floor(t * (KUNDALINI_COLORS.length - 1));
        const ct = t * (KUNDALINI_COLORS.length - 1) - ci;
        const c1 = new THREE.Color(KUNDALINI_COLORS[ci]);
        const c2 = new THREE.Color(KUNDALINI_COLORS[Math.min(ci + 1, KUNDALINI_COLORS.length - 1)]);
        const c = c1.clone().lerp(c2, ct);
        pingColors[i * 3] = c.r * 0.6;
        pingColors[i * 3 + 1] = c.g * 0.4;
        pingColors[i * 3 + 2] = c.b * 0.4;
    }
    const pingGeo = new THREE.BufferGeometry().setFromPoints(kunPtsR);
    pingGeo.setAttribute('color', new THREE.BufferAttribute(pingColors, 3));
    group.add(new THREE.Line(pingGeo, new THREE.LineBasicMaterial({
        vertexColors: true, transparent: true, opacity: 0.3, blending: THREE.AdditiveBlending
    })));

    // Chakra rings & glows
    const chakras = [
        { y: -6.5, cl: 0xdd2222, nm: "Muladhara — Root" },
        { y: -4.5, cl: 0xff6622, nm: "Svadhisthana — Sacral" },
        { y: -1.5, cl: 0xddcc22, nm: "Manipura — Solar Plexus" },
        { y: 0, cl: 0x33cc55, nm: "Anahata — Heart" },
        { y: 1.5, cl: 0x3388dd, nm: "Vishuddha — Throat" },
        { y: 3.0, cl: 0x4422aa, nm: "Ajna — Third Eye" },
        { y: 6.5, cl: 0xcc88ff, nm: "Sahasrara — Crown" },
    ];
    for (const ch of chakras) {
        const tGeo = new THREE.TorusGeometry(P.kwid * 1.2, 0.06, 8, 32);
        const tMat = new THREE.MeshBasicMaterial({
            color: ch.cl, transparent: true, opacity: 0.18,
            blending: THREE.AdditiveBlending
        });
        const torus = new THREE.Mesh(tGeo, tMat);
        torus.position.set(0, ch.y, 0);
        torus.rotation.x = Math.PI / 2;
        torus.userData = { chakra: ch };
        group.add(torus);
        kunGlowMeshes.push(torus);

        const sGeo = new THREE.SphereGeometry(P.kwid * 0.8, 12, 12);
        const sMat = new THREE.MeshBasicMaterial({
            color: ch.cl, transparent: true, opacity: 0.05, side: THREE.BackSide
        });
        const sph = new THREE.Mesh(sGeo, sMat);
        sph.position.set(0, ch.y, 0);
        sph.userData = { chakra: ch };
        group.add(sph);
        kunGlowMeshes.push(sph);
    }

    // Kundalini particles
    const kCount = 180;
    kunPS = makePS(kCount, 0.12, 0.95);
    group.add(kunPS);
    kunParts = [];
    for (let i = 0; i < kCount; i++) {
        kunParts.push({
            t: Math.random(),
            spd: (0.001 + Math.random() * 0.003) * P.spd,
            channel: Math.random() < 0.33 ? 'ida' : Math.random() < 0.5 ? 'pingala' : 'sushumna',
            idx: i
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
    pathCurves = []; pathParts = []; helixParts = []; serpParts = [];
    tunParts = []; fieldParts = []; kunParts = []; kunGlowMeshes = [];

    const sefs = allSefirot();

    // Pillar axes
    for (let i = 0; i < 3; i++) {
        makeLine(
            new THREE.Vector3(P.rad * Math.cos(MA[i]), -8, P.rad * Math.sin(MA[i])),
            new THREE.Vector3(P.rad * Math.cos(MA[i]), 8, P.rad * Math.sin(MA[i])),
            [0x1a2244, 0x441122, 0x1a3322][i], 0.06
        );
    }
    if (Ly.qlp) {
        for (let i = 0; i < 3; i++) {
            makeLine(
                new THREE.Vector3(P.rad * Math.cos(QA[i]), -8, P.rad * Math.sin(QA[i])),
                new THREE.Vector3(P.rad * Math.cos(QA[i]), 8, P.rad * Math.sin(QA[i])),
                0x220808, 0.04
            );
        }
    }
    makeLine(new THREE.Vector3(0, -8, 0), new THREE.Vector3(0, 8, 0), 0x222211, 0.04);

    // Cross-braces
    if (Ly.qlp) {
        for (const yy of [6.5, 0, -6.5]) {
            for (let i = 0; i < 3; i++) {
                const j = (i + 1) % 3;
                makeLine(
                    new THREE.Vector3(P.rad * Math.cos(MA[i]), yy, P.rad * Math.sin(MA[i])),
                    new THREE.Vector3(P.rad * Math.cos(MA[j]), yy, P.rad * Math.sin(MA[j])),
                    0x1a2233, 0.03
                );
                makeLine(
                    new THREE.Vector3(P.rad * Math.cos(QA[i]), yy, P.rad * Math.sin(QA[i])),
                    new THREE.Vector3(P.rad * Math.cos(QA[j]), yy, P.rad * Math.sin(QA[j])),
                    0x331111, 0.03
                );
            }
        }
    }

    // Sefirot spheres + labels
    for (const s of sefs) {
        const p = pos3(s);
        const isQ = s.id >= 20, isH = s.id >= 11 && s.id < 20, isD = s.id === 10;
        const sz = s.id === 0 || s.id === 20 ? 0.42 : s.id === 9 || s.id === 29 ? 0.38 : isD ? 0.2 : isH ? 0.24 : isQ ? 0.28 : 0.33;

        const mesh = new THREE.Mesh(
            new THREE.SphereGeometry(sz, 28, 28),
            new THREE.MeshPhongMaterial({
                color: s.cl, emissive: s.cl,
                emissiveIntensity: isQ ? 0.4 : 0.6,
                transparent: true, opacity: isD ? 0.5 : isH ? 0.6 : isQ ? 0.6 : 1,
                shininess: 40
            })
        );
        mesh.position.copy(p);
        mesh.userData = s;
        group.add(mesh);
        meshes.push(mesh);

        const glow = new THREE.Mesh(
            new THREE.SphereGeometry(sz * 2.8, 10, 10),
            new THREE.MeshBasicMaterial({ color: s.cl, transparent: true, opacity: isQ ? 0.025 : 0.05, side: THREE.BackSide })
        );
        glow.position.copy(p);
        glow.userData = s;
        group.add(glow);
        glows.push(glow);

        // HTML label
        const cls = isQ ? 'node-label qlp' : isH ? 'node-label hid' : 'node-label';
        const div = document.createElement('div');
        div.className = cls;
        const line1 = Lb.heb ? (s.hbh || s.hb) : s.nm;
        const line2 = Lb.heb ? s.hb : s.hb;
        const line3 = s.desc ? s.desc.split('—')[0].trim() : '';
        div.innerHTML = `<div class="nl-name">${line1}</div><div class="nl-hebrew">${line2}</div><div class="nl-desc">${line3}</div>`;
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
        group.add(new THREE.Line(
            new THREE.BufferGeometry().setFromPoints(curve.getPoints(24)),
            new THREE.LineBasicMaterial({
                color: new THREE.Color(s1.cl).lerp(new THREE.Color(s2.cl), 0.5),
                transparent: true, opacity: 0.16
            })
        ));
        pathCurves.push({ curve, s1, s2, pd });

        const ldiv = document.createElement('div');
        ldiv.className = 'path-label';
        const pLabel = Lb.heb
            ? `<div class="pl-letter">${pd.let}</div><div class="pl-name">${pd.nm}</div>`
            : `<div class="pl-letter">${pd.mn}</div><div class="pl-name">${pd.nm}</div>`;
        ldiv.innerHTML = pLabel;
        labelsEl.appendChild(ldiv);
        pathLabels.push({ div: ldiv, curve });
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
            group.add(new THREE.Line(
                new THREE.BufferGeometry().setFromPoints(curve.getPoints(20)),
                new THREE.LineBasicMaterial({ color: 0x334455, transparent: true, opacity: 0.08 })
            ));
            pathCurves.push({ curve, s1: byId(h[0]), s2: byId(h[1]) });
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
            group.add(new THREE.Line(
                new THREE.BufferGeometry().setFromPoints(curve.getPoints(20)),
                new THREE.LineBasicMaterial({ color: 0x331111, transparent: true, opacity: 0.05 })
            ));
            pathCurves.push({ curve, s1: byId(q[0]), s2: byId(q[1]) });
        }
    }

    // Tunnels
    if (Ly.tun && Ly.qlp) {
        for (const t of TUNL) {
            const s1 = byId(t[0]), s2 = byId(t[1]);
            if (!s1 || !s2) continue;
            makeLine(pos3(s1), pos3(s2), 0x553322, 0.08);
        }
    }

    // Path particles
    const ppd = 8;
    pathPS = makePS(pathCurves.length * ppd, 0.08, 0.85);
    group.add(pathPS);
    for (let pi = 0; pi < pathCurves.length; pi++) {
        for (let i = 0; i < ppd; i++) {
            pathParts.push({ pi, t: Math.random(), dir: Math.random() > 0.5 ? 1 : -1, spd: (0.001 + Math.random() * 0.004) * P.spd, idx: pathParts.length });
        }
    }

    // Helix (lightning)
    helixCurve = makeHelix(-1, 0.6);
    group.add(new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(helixCurve.getPoints(400)),
        new THREE.LineBasicMaterial({ color: 0xffcc33, transparent: true, opacity: 0.14, blending: THREE.AdditiveBlending })
    ));
    const hpd = 80;
    helixPS = makePS(hpd, 0.1, 0.9);
    group.add(helixPS);
    for (let i = 0; i < hpd; i++) helixParts.push({ t: Math.random(), spd: (0.001 + Math.random() * 0.003) * P.spd, idx: i });

    // Serpent
    serpCurve = makeHelix(1, 0.5);
    group.add(new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(serpCurve.getPoints(400)),
        new THREE.LineBasicMaterial({ color: 0x8844cc, transparent: true, opacity: 0.12, blending: THREE.AdditiveBlending })
    ));
    serpPS = makePS(hpd, 0.09, 0.8);
    group.add(serpPS);
    for (let i = 0; i < hpd; i++) serpParts.push({ t: Math.random(), spd: (0.0008 + Math.random() * 0.0025) * P.spd, idx: i });

    // Tunnel particles
    if (Ly.tun && Ly.qlp) {
        const tpd = 15;
        tunPS = makePS(TUNL.length * tpd, 0.07, 0.7);
        group.add(tunPS);
        for (let ti = 0; ti < TUNL.length; ti++) {
            for (let i = 0; i < tpd; i++) {
                tunParts.push({ ti, t: Math.random(), dir: Math.random() > 0.5 ? 1 : -1, spd: (0.002 + Math.random() * 0.006) * P.spd, idx: tunParts.length });
            }
        }
    } else tunPS = null;

    // Field particles (ambient)
    const fpd = 180;
    fieldPS = makePS(fpd, 0.04, 0.35);
    group.add(fieldPS);
    for (let i = 0; i < fpd; i++) {
        fieldParts.push({
            theta: Math.random() * Math.PI * 2,
            phi: (Math.random() - 0.5) * Math.PI,
            r: P.rad * 0.5 + Math.random() * P.rad * 1.2,
            ts: (Math.random() - 0.5) * 0.008 * P.spd,
            ps: (Math.random() - 0.5) * 0.003 * P.spd,
            yO: (Math.random() - 0.5) * 14,
            ys: (Math.random() - 0.5) * 0.005 * P.spd,
            idx: i
        });
    }

    // Kundalini
    if (Ly.kun) buildKundalini();
    else { kunPS = null; }
}

// ============================================================
// ANIMATION LOOP
// ============================================================
function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    // Camera
    if (!drag) tRy += P.rot * 0.008;
    ry += (tRy - ry) * 0.06;
    rx += (tRx - rx) * 0.06;
    camDist += (tDist - camDist) * 0.06;
    camera.position.set(
        Math.sin(ry) * Math.cos(rx) * camDist,
        Math.sin(rx) * camDist,
        Math.cos(ry) * Math.cos(rx) * camDist
    );
    camera.lookAt(0, 0, 0);

    // Pulse sefirot
    for (let i = 0; i < meshes.length; i++) {
        const m = meshes[i], g = glows[i], s = m.userData;
        const b = Math.sin(t * P.pul + s.id * 0.55) * 0.5 + 0.5;
        m.scale.setScalar(1 + b * 0.25);
        g.scale.setScalar(1 + b * 0.5);
        m.material.emissiveIntensity = 0.3 + b * 0.6;
    }

    // Path particles
    if (pathPS) {
        const pos = pathPS.geometry.attributes.position.array;
        const col = pathPS.geometry.attributes.color.array;
        for (const fp of pathParts) {
            fp.t += fp.spd * fp.dir;
            if (fp.t > 1) fp.t = 0;
            if (fp.t < 0) fp.t = 1;
            const pc = pathCurves[fp.pi];
            if (!pc) continue;
            const pt = pc.curve.getPointAt(Math.max(0.001, Math.min(0.999, fp.t)));
            pos[fp.idx * 3] = pt.x;
            pos[fp.idx * 3 + 1] = pt.y;
            pos[fp.idx * 3 + 2] = pt.z;
            const c1 = new THREE.Color(pc.s1.cl), c2 = new THREE.Color(pc.s2.cl);
            const c = c1.clone().lerp(c2, fp.t);
            const f = Math.sin(fp.t * Math.PI);
            col[fp.idx * 3] = c.r * f;
            col[fp.idx * 3 + 1] = c.g * f;
            col[fp.idx * 3 + 2] = c.b * f;
        }
        pathPS.geometry.attributes.position.needsUpdate = true;
        pathPS.geometry.attributes.color.needsUpdate = true;
    }

    // Lightning helix
    const showL = P.flow !== 'serp';
    if (helixPS) {
        const pos = helixPS.geometry.attributes.position.array;
        const col = helixPS.geometry.attributes.color.array;
        for (const hp of helixParts) {
            hp.t += hp.spd;
            if (hp.t > 1) hp.t = 0;
            const pt = helixCurve.getPointAt(Math.max(0.001, Math.min(0.999, hp.t)));
            pos[hp.idx * 3] = pt.x;
            pos[hp.idx * 3 + 1] = pt.y;
            pos[hp.idx * 3 + 2] = pt.z;
            const f = showL ? Math.sin(hp.t * Math.PI) : 0;
            const p = 0.7 + Math.sin(t * 3 + hp.t * 20) * 0.3;
            col[hp.idx * 3] = f * p;
            col[hp.idx * 3 + 1] = 0.8 * f * p;
            col[hp.idx * 3 + 2] = 0.2 * f * p;
        }
        helixPS.geometry.attributes.position.needsUpdate = true;
        helixPS.geometry.attributes.color.needsUpdate = true;
    }

    // Serpent helix
    const showS = P.flow !== 'light';
    if (serpPS) {
        const pos = serpPS.geometry.attributes.position.array;
        const col = serpPS.geometry.attributes.color.array;
        for (const sp of serpParts) {
            sp.t += sp.spd;
            if (sp.t > 1) sp.t = 0;
            const pt = serpCurve.getPointAt(Math.max(0.001, Math.min(0.999, sp.t)));
            pos[sp.idx * 3] = pt.x;
            pos[sp.idx * 3 + 1] = pt.y;
            pos[sp.idx * 3 + 2] = pt.z;
            const f = showS ? Math.sin(sp.t * Math.PI) : 0;
            const p = 0.6 + Math.sin(t * 2.5 + sp.t * 15) * 0.4;
            col[sp.idx * 3] = 0.55 * f * p;
            col[sp.idx * 3 + 1] = 0.25 * f * p;
            col[sp.idx * 3 + 2] = 0.8 * f * p;
        }
        serpPS.geometry.attributes.position.needsUpdate = true;
        serpPS.geometry.attributes.color.needsUpdate = true;
    }

    // Tunnel particles
    if (tunPS) {
        const pos = tunPS.geometry.attributes.position.array;
        const col = tunPS.geometry.attributes.color.array;
        for (const tp of tunParts) {
            tp.t += tp.spd * tp.dir;
            if (tp.t > 1) { tp.t = 1; tp.dir = -1; }
            if (tp.t < 0) { tp.t = 0; tp.dir = 1; }
            const tn = TUNL[tp.ti];
            const s1 = byId(tn[0]), s2 = byId(tn[1]);
            if (!s1 || !s2) continue;
            const p1 = pos3(s1), p2 = pos3(s2);
            const lp = new THREE.Vector3().lerpVectors(p1, p2, tp.t);
            const sp = Math.sin(tp.t * Math.PI * 4 + t * 3) * 0.3;
            const sa = tp.t * Math.PI * 6 + t * 2;
            lp.x += Math.cos(sa) * sp;
            lp.z += Math.sin(sa) * sp;
            pos[tp.idx * 3] = lp.x;
            pos[tp.idx * 3 + 1] = lp.y;
            pos[tp.idx * 3 + 2] = lp.z;
            const f = Math.sin(tp.t * Math.PI);
            const c1 = new THREE.Color(s1.cl), c2 = new THREE.Color(s2.cl);
            const c = c1.clone().lerp(c2, tp.t);
            col[tp.idx * 3] = c.r * f * 0.7;
            col[tp.idx * 3 + 1] = c.g * f * 0.5;
            col[tp.idx * 3 + 2] = c.b * f * 0.7;
        }
        tunPS.geometry.attributes.position.needsUpdate = true;
        tunPS.geometry.attributes.color.needsUpdate = true;
    }

    // Field particles
    if (fieldPS) {
        const pos = fieldPS.geometry.attributes.position.array;
        const col = fieldPS.geometry.attributes.color.array;
        for (const fp of fieldParts) {
            fp.theta += fp.ts;
            fp.phi += fp.ps;
            fp.yO += fp.ys;
            if (fp.yO > 7) { fp.yO = 7; fp.ys *= -1; }
            if (fp.yO < -7) { fp.yO = -7; fp.ys *= -1; }
            const x = fp.r * Math.cos(fp.theta) * Math.cos(fp.phi);
            const z = fp.r * Math.sin(fp.theta) * Math.cos(fp.phi);
            const y = fp.yO;
            pos[fp.idx * 3] = x;
            pos[fp.idx * 3 + 1] = y;
            pos[fp.idx * 3 + 2] = z;
            let mD = 999, nC = 0xffffff;
            for (const m of meshes) {
                const d = Math.sqrt((x - m.position.x) ** 2 + (y - m.position.y) ** 2 + (z - m.position.z) ** 2);
                if (d < mD) { mD = d; nC = m.userData.cl; }
            }
            const nc = new THREE.Color(nC);
            const br = Math.max(0, 1 - mD / 6) * 0.5;
            const fl = 0.4 + Math.sin(t * 2 + fp.idx * 0.1) * 0.3;
            col[fp.idx * 3] = nc.r * br * fl;
            col[fp.idx * 3 + 1] = nc.g * br * fl;
            col[fp.idx * 3 + 2] = nc.b * br * fl;
        }
        fieldPS.geometry.attributes.position.needsUpdate = true;
        fieldPS.geometry.attributes.color.needsUpdate = true;
    }

    // Kundalini particles
    if (kunPS && Ly.kun) {
        const pos = kunPS.geometry.attributes.position.array;
        const col = kunPS.geometry.attributes.color.array;
        const kI = P.kint;
        for (const kp of kunParts) {
            kp.t += kp.spd * kI * 0.7;
            if (kp.t > 1) kp.t = 0;
            const y = -6.5 + kp.t * 13;
            let x = 0, z = 0;
            const coils = 3.5, angle = kp.t * Math.PI * 2 * coils;
            const r = P.kwid * (0.3 + Math.sin(kp.t * Math.PI) * 0.7);
            if (kp.channel === 'ida') {
                x = r * Math.cos(angle + t * 2); z = r * Math.sin(angle + t * 2);
            } else if (kp.channel === 'pingala') {
                x = r * Math.cos(angle + Math.PI + t * 2); z = r * Math.sin(angle + Math.PI + t * 2);
            } else {
                x = Math.sin(t * 3 + kp.t * 10) * 0.05; z = Math.cos(t * 3 + kp.t * 10) * 0.05;
            }
            pos[kp.idx * 3] = x;
            pos[kp.idx * 3 + 1] = y;
            pos[kp.idx * 3 + 2] = z;

            const ci = Math.floor(kp.t * (KUNDALINI_COLORS.length - 1));
            const ct = kp.t * (KUNDALINI_COLORS.length - 1) - ci;
            const c1 = new THREE.Color(KUNDALINI_COLORS[ci]);
            const c2 = new THREE.Color(KUNDALINI_COLORS[Math.min(ci + 1, KUNDALINI_COLORS.length - 1)]);
            const c = c1.clone().lerp(c2, ct);
            const fade = Math.sin(kp.t * Math.PI) * kI * 0.7;
            const pulse = 0.6 + Math.sin(t * 4 + kp.t * 15) * 0.4;
            col[kp.idx * 3] = c.r * fade * pulse;
            col[kp.idx * 3 + 1] = c.g * fade * pulse;
            col[kp.idx * 3 + 2] = c.b * fade * pulse;
        }
        kunPS.geometry.attributes.position.needsUpdate = true;
        kunPS.geometry.attributes.color.needsUpdate = true;
    }

    // Chakra glow animation
    for (const gm of kunGlowMeshes) {
        if (!gm.userData.chakra) continue;
        const ch = gm.userData.chakra;
        const idx = [-6.5, -4.5, -1.5, 0, 1.5, 3.0, 6.5].indexOf(ch.y);
        const b = Math.sin(t * P.pul * 1.5 + idx * 0.8) * 0.5 + 0.5;
        const sc = 1 + b * 0.3 * P.kint;
        gm.scale.setScalar(sc);
        if (gm.geometry.type === 'TorusGeometry') {
            gm.material.opacity = 0.1 + b * 0.14 * P.kint;
        } else {
            gm.material.opacity = 0.03 + b * 0.05 * P.kint;
        }
    }

    // Update labels
    const w = renderer.domElement.clientWidth, h = renderer.domElement.clientHeight;
    for (const ld of nodeLabels) {
        const p = pos3(ld.s).clone();
        p.y += 0.55;
        group.localToWorld(p);
        p.project(camera);
        ld.div.style.left = (p.x * 0.5 + 0.5) * w + 'px';
        ld.div.style.top = (-p.y * 0.5 + 0.5) * h + 'px';
        const behind = p.z > 1;
        const d = camera.position.distanceTo(pos3(ld.s));
        const fade = Math.max(0, Math.min(1, 1 - (d - 8) / 28));
        const isQ = ld.s.id >= 20, isH = ld.s.id >= 11 && ld.s.id < 20, isD = ld.s.id === 10;
        ld.div.style.opacity = Lb.nlab ? (behind ? 0 : fade * (isD ? 0.35 : isH ? 0.5 : isQ ? 0.4 : 0.85)) : 0;
    }
    for (const pl of pathLabels) {
        const mp = pl.curve.getPointAt(0.5);
        group.localToWorld(mp);
        mp.project(camera);
        pl.div.style.left = (mp.x * 0.5 + 0.5) * w + 'px';
        pl.div.style.top = (-mp.y * 0.5 + 0.5) * h + 'px';
        pl.div.style.opacity = Lb.plab ? (mp.z > 1 ? 0 : 0.5) : 0;
    }

    // Update bloom
    bloomPass.strength = P.bloom;

    composer.render();
}

// ============================================================
// INTERACTION
// ============================================================
const canvasEl = renderer.domElement;

canvasEl.addEventListener('mousedown', e => {
    drag = true;
    pointerPrev = { x: e.clientX, y: e.clientY };
});
canvasEl.addEventListener('mousemove', e => {
    if (!drag) return;
    tRy += (e.clientX - pointerPrev.x) * 0.005;
    tRx += (e.clientY - pointerPrev.y) * 0.005;
    tRx = Math.max(-1.5, Math.min(1.5, tRx));
    pointerPrev = { x: e.clientX, y: e.clientY };
});
canvasEl.addEventListener('mouseup', () => drag = false);
canvasEl.addEventListener('mouseleave', () => drag = false);
canvasEl.addEventListener('wheel', e => {
    tDist += e.deltaY * 0.015;
    tDist = Math.max(6, Math.min(50, tDist));
});

// Touch
canvasEl.addEventListener('touchstart', e => {
    e.preventDefault();
    drag = true;
    pointerPrev = { x: e.touches[0].clientX, y: e.touches[0].clientY };
}, { passive: false });
canvasEl.addEventListener('touchmove', e => {
    e.preventDefault();
    if (!drag) return;
    tRy += (e.touches[0].clientX - pointerPrev.x) * 0.005;
    tRx += (e.touches[0].clientY - pointerPrev.y) * 0.005;
    tRx = Math.max(-1.5, Math.min(1.5, tRx));
    pointerPrev = { x: e.touches[0].clientX, y: e.touches[0].clientY };
}, { passive: false });
canvasEl.addEventListener('touchend', () => drag = false);

// Click on nodes
let clickStart = { x: 0, y: 0 };
canvasEl.addEventListener('mousedown', e => { clickStart = { x: e.clientX, y: e.clientY }; });
canvasEl.addEventListener('mouseup', e => {
    const dx = e.clientX - clickStart.x, dy = e.clientY - clickStart.y;
    if (Math.sqrt(dx * dx + dy * dy) > 5) return; // was a drag
    const rect = canvasEl.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const hits = raycaster.intersectObjects(meshes);
    if (hits.length > 0) {
        showInfo(hits[0].object.userData);
    }
});

function showInfo(s) {
    const panel = document.getElementById('info-panel');
    document.getElementById('info-title').textContent = s.nm;
    document.getElementById('info-hebrew').textContent = `${s.hbh || ''} — ${s.hb}`;
    document.getElementById('info-desc').textContent = s.desc || '';
    document.getElementById('info-chakra').textContent = s.chakra ? `Chakra: ${s.chakra}` : '';
    panel.classList.remove('hidden');
}
document.getElementById('info-close').addEventListener('click', () => {
    document.getElementById('info-panel').classList.add('hidden');
});

// ============================================================
// SIDEBAR CONTROLS
// ============================================================

// Layers
document.querySelectorAll('[data-layer]').forEach(btn => {
    btn.addEventListener('click', () => {
        const k = btn.dataset.layer;
        Ly[k] = !Ly[k];
        btn.classList.toggle('on', Ly[k]);
        rebuild();
    });
});

// Labels
document.querySelectorAll('[data-label]').forEach(btn => {
    btn.addEventListener('click', () => {
        const k = btn.dataset.label;
        Lb[k] = !Lb[k];
        btn.classList.toggle('on', Lb[k]);
        rebuild();
    });
});

// Flow
document.querySelectorAll('[data-flow]').forEach(btn => {
    btn.addEventListener('click', () => {
        const m = btn.dataset.flow;
        P.flow = m;
        document.querySelectorAll('[data-flow]').forEach(b => b.classList.toggle('on', b.dataset.flow === m));
    });
});

// Parameters
document.querySelectorAll('[data-param]').forEach(input => {
    input.addEventListener('input', () => {
        const k = input.dataset.param;
        P[k] = parseFloat(input.value);
        document.querySelector(`[data-display="${k}"]`).textContent = input.value;
        if (k === 'rad' || k === 'hlx' || k === 'kwid') rebuild();
    });
});

// Views
document.querySelectorAll('[data-view]').forEach(btn => {
    btn.addEventListener('click', () => {
        const m = btn.dataset.view;
        document.querySelectorAll('[data-view]').forEach(b => b.classList.toggle('on', b.dataset.view === m));
        if (m === 'top') { tRx = 1.5; tDist = 30; }
        else if (m === 'sid') { tRx = 0; tDist = 24; }
        else { tRx = 0.15; tDist = 24; }
    });
});

// Mobile toggle
document.getElementById('mobile-toggle').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
});

// Resize
window.addEventListener('resize', () => {
    const w = container.clientWidth, h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    composer.setSize(w, h);
    bloomPass.resolution.set(w, h);
});

// ============================================================
// INIT
// ============================================================
rebuild();
animate();
