import * as THREE from 'three';

// ---------- 手続き的ハエトリグモ ----------
export function createSpider({ style = 'real', size = 0.012 } = {}) {
  const g = new THREE.Group();
  const cute = style === 'cute';
  const bodyCol = cute ? 0xa97244 : 0x2b1c12;
  const abCol = cute ? 0xc58b5a : 0x4a3222;
  const legCol = cute ? 0x4a3b2e : 0x1d140d;
  const mBody = new THREE.MeshStandardMaterial({ color: bodyCol, roughness: .8 });
  const mAb = new THREE.MeshStandardMaterial({ color: abCol, roughness: .9 });
  const mLeg = new THREE.MeshStandardMaterial({ color: legCol, roughness: .7 });
  const mEye = new THREE.MeshStandardMaterial({ color: 0x050505, roughness: .2, metalness: .3 });
  const mHi = new THREE.MeshBasicMaterial({ color: 0xffffff });

  // 単位: 1 = 体長(cephalothorax+abdomen) 。最後に size 倍
  const ceph = new THREE.Mesh(new THREE.SphereGeometry(0.28, 24, 16), mBody);
  ceph.scale.set(1, 0.75, 1.05); ceph.position.set(0, 0.26, 0.12);
  const ab = new THREE.Mesh(new THREE.SphereGeometry(0.26, 24, 16), mAb);
  ab.scale.set(0.95, 0.8, 1.25); ab.position.set(0, 0.25, -0.34);
  g.add(ceph, ab);
  if (!cute) { // 腹部の模様
    const stripe = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.02, 6, 24), new THREE.MeshStandardMaterial({ color: 0xc9b08c, roughness: 1 }));
    stripe.rotation.x = Math.PI / 2; stripe.scale.set(1, 1.2, 1); stripe.position.copy(ab.position); stripe.position.y += 0.05; g.add(stripe);
  }
  // 目: 前中眼(大)2 + 前側眼2 + 後眼2
  const eyeR = cute ? 0.1 : 0.07;
  const eyes = [[-0.1, 0.34, 0.37, eyeR], [0.1, 0.34, 0.37, eyeR], [-0.22, 0.33, 0.3, eyeR * .5], [0.22, 0.33, 0.3, eyeR * .5], [-0.2, 0.44, 0.15, eyeR * .35], [0.2, 0.44, 0.15, eyeR * .35]];
  for (const [x, y, z, r] of eyes) {
    const e = new THREE.Mesh(new THREE.SphereGeometry(r, 12, 10), mEye); e.position.set(x, y, z); g.add(e);
    if (r >= eyeR) { const h = new THREE.Mesh(new THREE.SphereGeometry(r * .3, 8, 6), mHi); h.position.set(x + r * .35, y + r * .35, z + r * .7); g.add(h); }
  }
  // 触肢
  for (const s of [-1, 1]) {
    const p = new THREE.Mesh(new THREE.CapsuleGeometry(0.035, 0.18, 4, 8), mLeg);
    p.position.set(s * 0.09, 0.2, 0.42); p.rotation.x = Math.PI / 2 - 0.5; g.add(p);
  }
  // 脚: 4対。それぞれ hip(旋回) -> femur -> knee -> tibia
  const legs = [];
  const femurLen = cute ? 0.42 : 0.55, tibLen = cute ? 0.42 : 0.62, thick = cute ? 0.05 : 0.035;
  const baseAngles = [0.75, 0.35, -0.25, -0.7]; // 前脚は前向き、後脚は後ろ向き
  for (let i = 0; i < 4; i++) for (const s of [-1, 1]) {
    const hip = new THREE.Group(); hip.position.set(s * 0.2, 0.26, 0.22 - i * 0.14); g.add(hip);
    const yaw = s * (Math.PI / 2 - baseAngles[i]); hip.rotation.y = yaw; // 外向き
    const femur = new THREE.Group(); hip.add(femur); femur.rotation.z = s * -0.9; // 上へ
    const f = new THREE.Mesh(new THREE.CapsuleGeometry(thick, femurLen, 4, 8), mLeg); f.rotation.z = Math.PI / 2; f.position.x = femurLen / 2; femur.add(f);
    const knee = new THREE.Group(); knee.position.x = femurLen; femur.add(knee); knee.rotation.z = s * 1.9; // 下へ折れる
    const t = new THREE.Mesh(new THREE.CapsuleGeometry(thick * .8, tibLen, 4, 8), mLeg); t.rotation.z = Math.PI / 2; t.position.x = tibLen / 2; knee.add(t);
    legs.push({ hip, femur, knee, s, i, yaw, phase: ((i + (s > 0 ? 1 : 0)) % 2) * Math.PI });
  }
  g.scale.setScalar(size);

  let t = 0;
  const api = {
    group: g, legs,
    // state: {walking:boolean, speed:0..1}
    update(dt, state = {}) {
      t += dt;
      const walk = state.walking ? 1 : 0;
      const sp = 9 * (state.speed ?? 1);
      for (const L of legs) {
        const ph = t * sp + L.phase;
        const lift = walk ? Math.max(0, Math.sin(ph)) : 0;       // 上げ
        const swing = walk ? Math.cos(ph) * 0.35 : 0;             // 前後
        L.hip.rotation.y = L.yaw + swing * L.s;
        L.femur.rotation.z = L.s * (-0.9 - lift * 0.45);
        L.knee.rotation.z = L.s * (1.9 + lift * 0.35);
      }
      // 呼吸
      ab.scale.y = 0.8 + Math.sin(t * 2.2) * 0.02;
    }
  };
  return api;
}

// ---------- 手続き的ダンゴムシ(オカダンゴムシ) ----------
export function createPillbug({ size = 0.012 } = {}) {
  const g = new THREE.Group();
  const mShell = new THREE.MeshStandardMaterial({ color: 0x66656f, roughness: .5, metalness: .15 });
  const mEdge = new THREE.MeshStandardMaterial({ color: 0x2a2930, roughness: .8 });
  const mLeg = new THREE.MeshStandardMaterial({ color: 0x3a3942, roughness: .8 });
  const mEye = new THREE.MeshStandardMaterial({ color: 0x0a0a0a, roughness: .3 });
  // 体節: 7つの胸節 + 頭 + 尾。各節は半円筒の板。丸まりは pivot で回す
  const segs = []; const n = 9; const len = 1.0; const segL = len / n;
  const spine = new THREE.Group(); g.add(spine);
  let parent = spine; let prevPivot = null;
  for (let i = 0; i < n; i++) {
    const pivot = new THREE.Group(); pivot.position.z = i === 0 ? 0 : -segL; parent.add(pivot);
    const w = 0.5 * (i === 0 ? 0.75 : i === n - 1 ? 0.7 : 1 - Math.abs(i - 4) * 0.06);
    // 半ドーム(上半分の楕円体)を重ねて甲羅にする
    const plate = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2), i === 0 || i === n - 1 ? mEdge : mShell);
    plate.scale.set(w, 0.42, segL * 0.9); plate.position.set(0, 0.0, -segL / 2);
    pivot.add(plate);
    // 脚: 頭・尾以外の7節に1対ずつ
    if (i > 0 && i < n - 1) for (const sd of [-1, 1]) {
      const hip = new THREE.Group(); hip.position.set(sd * w * 0.7, 0.03, -segL / 2); pivot.add(hip);
      const leg = new THREE.Mesh(new THREE.CapsuleGeometry(0.02, 0.22, 3, 6), mLeg); leg.rotation.z = sd * 1.25; leg.position.x = sd * 0.1; leg.position.y = -0.06; hip.add(leg);
      segs.push({ hip, sd, i });
    }
    if (i === 0) { // 頭: 目と触角
      for (const sd of [-1, 1]) {
        const e = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 6), mEye); e.position.set(sd * 0.22, 0.12, 0.02); pivot.add(e);
        const a = new THREE.Mesh(new THREE.CapsuleGeometry(0.012, 0.3, 3, 6), mLeg); a.position.set(sd * 0.14, 0.08, 0.16); a.rotation.x = -1.1; a.rotation.z = sd * 0.5; pivot.add(a); segs.push({ ant: a, sd });
      }
    }
    pivot.userData.i = i; g.userData.pivots = g.userData.pivots || []; g.userData.pivots.push(pivot);
    parent = pivot;
  }
  g.scale.setScalar(size);
  let t = 0, roll = 0; // roll 0..1
  const api = {
    group: g, isPillbug: true,
    get rolled() { return roll > 0.5; },
    // state: {walking, speed, roll:boolean}
    update(dt, state = {}) {
      t += dt;
      const target = state.roll ? 1 : 0; roll += (target - roll) * Math.min(1, dt * 4);
      const pivots = g.userData.pivots; const per = (Math.PI * 2 / (n - 1)) * 0.92;
      pivots.forEach((p, i) => { if (i === 0) { p.rotation.x = -roll * per * 0.5; p.position.y = roll * 0.45; } else p.rotation.x = roll * per; });
      const walk = state.walking && roll < 0.3 ? 1 : 0; const sp = 14 * (state.speed ?? 1);
      for (const L of segs) {
        if (L.hip) { const ph = t * sp + L.i * 0.9 + (L.sd > 0 ? Math.PI : 0); L.hip.rotation.y = walk ? Math.sin(ph) * 0.45 * L.sd : 0; L.hip.rotation.x = walk ? Math.max(0, Math.cos(ph)) * 0.3 : 0; L.hip.scale.setScalar(1 - roll * 0.7); }
        if (L.ant) { L.ant.rotation.z = L.sd * (0.5 + Math.sin(t * 3 + L.sd) * 0.25); L.ant.rotation.x = -1.1 + Math.sin(t * 2.3) * 0.15; }
      }
    }
  };
  return api;
}
export function createCreature(species, opts = {}) { return species === 'pillbug' ? createPillbug(opts) : createSpider(opts); }

// ---------- 静止ビュー(Lv3): 葉っぱ背景、スワイプで逃げる ----------
export function mountStaticViewer(container, { onFlee, species = 'spider' } = {}) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  container.appendChild(renderer.domElement);
  const scene = new THREE.Scene(); scene.background = new THREE.Color(0xbfe0c6);
  const cam = new THREE.PerspectiveCamera(45, 1, 0.01, 50);
  cam.position.set(0.03, 0.038, 0.055); cam.lookAt(0, 0.006, 0);
  scene.add(new THREE.HemisphereLight(0xffffff, 0x557755, 1.1));
  const sun = new THREE.DirectionalLight(0xffffff, 1.6); sun.position.set(1, 2, 1); scene.add(sun);
  // 葉っぱの地面
  const leaf = new THREE.Mesh(new THREE.CircleGeometry(0.4, 48), new THREE.MeshStandardMaterial({ color: 0x5f9a63, roughness: .9 }));
  leaf.rotation.x = -Math.PI / 2; scene.add(leaf);
  for (let i = 0; i < 9; i++) { // 葉脈
    const v = new THREE.Mesh(new THREE.BoxGeometry(0.003, 0.0005, 0.35), new THREE.MeshStandardMaterial({ color: 0x8fc98f }));
    v.position.set(-0.16 + i * 0.04, 0.0003, 0); v.rotation.y = (i - 4) * 0.12; scene.add(v);
  }
  const spider = createCreature(species, { style: 'real', size: species === 'pillbug' ? 0.012 : 0.01 }); scene.add(spider.group);
  let state = { walking: false, speed: 1, roll: false }, target = null, fled = 0;
  const resize = () => { const w = container.clientWidth, h = container.clientHeight; renderer.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); };
  resize(); const ro = new ResizeObserver(resize); ro.observe(container);
  let last = performance.now(), raf;
  const tick = (now) => {
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    if (target) {
      const p = spider.group.position, d = target.clone().sub(p); d.y = 0;
      if (d.length() < 0.004) { target = null; state.walking = false; }
      else { d.normalize(); p.addScaledVector(d, 0.09 * dt); spider.group.rotation.y = Math.atan2(d.x, d.z); state.walking = true; }
    } else { spider.group.rotation.y += Math.sin(now / 900) * 0.002; }
    spider.update(dt, state); renderer.render(scene, cam); raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
  // スワイプ: 指の方向から逃げる
  let sx = 0, sy = 0;
  const down = (e) => { const p = e.touches ? e.touches[0] : e; sx = p.clientX; sy = p.clientY; };
  const up = (e) => {
    const p = e.changedTouches ? e.changedTouches[0] : e; const dx = p.clientX - sx, dy = p.clientY - sy;
    if (Math.hypot(dx, dy) < 20) { if (spider.isPillbug) { state.roll = !state.roll; target = null; } return; }
    if (spider.isPillbug && state.roll) state.roll = false;
    const dir = new THREE.Vector3(dx, 0, dy).normalize();
    const to = spider.group.position.clone().addScaledVector(dir, 0.06); to.x = THREE.MathUtils.clamp(to.x, -0.12, 0.12); to.z = THREE.MathUtils.clamp(to.z, -0.12, 0.08);
    target = to; fled++; onFlee && onFlee(fled);
  };
  container.addEventListener('pointerdown', down); container.addEventListener('pointerup', up);
  return { destroy() { cancelAnimationFrame(raf); ro.disconnect(); renderer.dispose(); container.innerHTML = ''; } };
}

// ---------- AR ランタイム(Lv7〜11) ----------
// WebXR(immersive-ar + hit-test) が使えればそれを、なければカメラ透過 + 端末の傾きで疑似AR
export class ARSession {
  constructor(root, { level, name, onEvent, species = 'spider' }) {
    this.root = root; this.level = level; this.name = name; this.species = species; this.pb = species === 'pillbug'; this.onEvent = onEvent || (() => {});
    this.cfg = level.ar; this.spiders = []; this.flies = []; this.prey = 0; this.placed = false; this.mode = 'none';
    this.fingers = [];
    this.tmp = new THREE.Vector3();
  }
  async start() {
    const r = this.root;
    this.video = document.createElement('video'); this.video.setAttribute('playsinline', ''); this.video.muted = true; r.appendChild(this.video);
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    this.renderer.setClearColor(0x000000, 0); r.appendChild(this.renderer.domElement);
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(60, 1, 0.01, 30);
    this.scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 1.2));
    const sun = new THREE.DirectionalLight(0xffffff, 1.2); sun.position.set(0.5, 2, 1); this.scene.add(sun);
    this.world = new THREE.Group(); this.scene.add(this.world);
    // 仮想の草(屋外化)。telegraph=true のレベルのみ
    if (this.cfg.telegraph) { this.grass = makeGrass(this.pb); this.world.add(this.grass); }
    this.telegraphLine = makeDots(); this.telegraphLine.visible = false; this.world.add(this.telegraphLine);
    this.reticle = new THREE.Mesh(new THREE.RingGeometry(0.06, 0.08, 32), new THREE.MeshBasicMaterial({ color: 0x8ff0c8, transparent: true, opacity: .9 }));
    this.reticle.rotation.x = -Math.PI / 2; this.reticle.visible = false; this.scene.add(this.reticle);

    const n = this.cfg.count || 1;
    const sz = Math.max(0.016, this.cfg.distance * 0.02);
    for (let i = 0; i < n; i++) { const s = createCreature(this.species, { style: 'real', size: this.pb ? Math.max(0.03, sz * 1.6) : sz }); s.group.visible = false; this.world.add(s.group); this.spiders.push({ api: s, target: null, jumpT: 0, wait: 1 + Math.random() * 2, vel: new THREE.Vector3() }); }

    let xr = false;
    try { xr = !!(navigator.xr && await navigator.xr.isSessionSupported('immersive-ar')); } catch { xr = false; }
    if (xr) { try { await this.startXR(); this.mode = 'webxr'; } catch (e) { console.warn('WebXR failed, fallback', e); xr = false; } }
    if (!xr) await this.startFallback();
    this.onEvent('mode', this.mode);
    this.last = performance.now();
    this.renderer.setAnimationLoop((t, frame) => this.frame(t, frame));
    this.resize(); this._ro = new ResizeObserver(() => this.resize()); this._ro.observe(r);
    r.addEventListener('pointerdown', this.onPointer = (e) => this.pointer(e));
    r.addEventListener('pointermove', this.onMove = (e) => this.move(e));
    r.addEventListener('pointerup', this.onUp = (e) => { this.fingers = this.fingers.filter(f => f.id !== e.pointerId); });
  }
  async startXR() {
    this.renderer.xr.enabled = true;
    const session = await navigator.xr.requestSession('immersive-ar', { requiredFeatures: ['hit-test'], optionalFeatures: ['dom-overlay'], domOverlay: { root: this.root } });
    this.session = session; await this.renderer.xr.setSession(session);
    this.refSpace = await session.requestReferenceSpace('local');
    const viewer = await session.requestReferenceSpace('viewer');
    this.hitSource = await session.requestHitTestSource({ space: viewer });
    session.addEventListener('end', () => this.onEvent('ended'));
    this.video.remove();
  }
  async startFallback() {
    this.mode = 'camera';
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 } }, audio: false });
      this.stream = stream; this.video.srcObject = stream; await this.video.play();
    } catch (e) { this.mode = 'nocamera'; this.root.style.background = '#2a3a33'; this.onEvent('nocamera', e); }
    // 疑似AR: カメラ高さ1.3m、下向き。傾きセンサーで見回せる
    const d0 = this.cfg.distance, camH = d0 >= 1.5 ? 1.3 : (d0 >= 0.5 ? 0.45 : 0.3);
    this.camera.position.set(0, camH, 0);
    this.pitch = -Math.atan2(camH, d0); this.yaw = 0;
    const onOri = (e) => {
      if (e.beta == null) return;
      // beta: 前後の傾き(90=直立)。gamma は左右。
      const beta = THREE.MathUtils.degToRad(e.beta), alpha = THREE.MathUtils.degToRad(e.alpha || 0);
      this.pitch = THREE.MathUtils.clamp(beta - Math.PI / 2, -1.4, 0.4); this.yaw = alpha;
      this.hasOri = true;
    };
    if (typeof DeviceOrientationEvent !== 'undefined' && DeviceOrientationEvent.requestPermission) {
      try { const s = await DeviceOrientationEvent.requestPermission(); if (s === 'granted') addEventListener('deviceorientation', onOri); } catch { }
    } else addEventListener('deviceorientation', onOri);
    this._onOri = onOri;
    this.placeAtDistance(this.cfg.distance);
  }
  placeAtDistance(d) {
    // 前方 d メートルの床(y=0)
    const yaw = this.yaw || 0;
    const base = new THREE.Vector3(-Math.sin(yaw) * d, 0, -Math.cos(yaw) * d);
    this.anchor = base.clone();
    if (this.grass) this.grass.position.copy(base);
    this.spiders.forEach((s, i) => { s.api.group.position.copy(base).add(new THREE.Vector3((i - 1) * 0.25, 0, (i % 2) * 0.2)); s.api.group.visible = true; s.api.group.rotation.y = Math.PI + (Math.random() - .5); });
    this.placed = true; this.onEvent('placed');
  }
  resize() { const w = this.root.clientWidth, h = this.root.clientHeight; if (!w || !h) return; this.renderer.setSize(w, h, false); this.camera.aspect = w / h; this.camera.updateProjectionMatrix(); }
  // 画面座標→床平面(y=0)
  screenToFloor(x, y) {
    const rect = this.root.getBoundingClientRect();
    const ndc = new THREE.Vector2(((x - rect.left) / rect.width) * 2 - 1, -((y - rect.top) / rect.height) * 2 + 1);
    const rc = new THREE.Raycaster(); rc.setFromCamera(ndc, this.camera);
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0); const p = new THREE.Vector3();
    return rc.ray.intersectPlane(plane, p) ? p : null;
  }
  pointer(e) {
    if (this.mode === 'webxr' && !this.placed) { if (this.reticle.visible) { this.anchor = this.reticle.position.clone(); this.placeXR(); } return; }
    const b = this.cfg.behavior;
    if (b === 'still') { this.onEvent('called'); return; }
    if (b === 'lure') { const p = this.screenToFloor(e.clientX, e.clientY); if (p) this.spawnFly(p, true); return; }
    if (b === 'walk') { this.fingers.push({ id: e.pointerId, x: e.clientX, y: e.clientY }); }
  }
  move(e) { const f = this.fingers.find(f => f.id === e.pointerId); if (f) { f.x = e.clientX; f.y = e.clientY; } }
  placeXR() {
    if (this.grass) this.grass.position.copy(this.anchor);
    this.spiders.forEach((s, i) => { s.api.group.position.copy(this.anchor).add(new THREE.Vector3((i - 1) * 0.25, 0, (i % 2) * 0.2)); s.api.group.visible = true; });
    this.reticle.visible = false; this.placed = true; this.onEvent('placed');
  }
  spawnFly(p, byUser) {
    let fly;
    if (this.pb) {
      fly = new THREE.Mesh(new THREE.CircleGeometry(0.025, 7), new THREE.MeshStandardMaterial({ color: 0xb8863b, roughness: 1, side: THREE.DoubleSide }));
      fly.rotation.x = -Math.PI / 2; fly.scale.set(1, 0.6, 1); fly.rotation.z = Math.random() * 3; fly.position.copy(p); fly.position.y = 0.002; this.world.add(fly);
    } else {
      fly = new THREE.Mesh(new THREE.SphereGeometry(0.008, 8, 6), new THREE.MeshStandardMaterial({ color: 0x222222 }));
      fly.position.copy(p); fly.position.y = 0.006; this.world.add(fly);
      const wing = new THREE.Mesh(new THREE.PlaneGeometry(0.02, 0.008), new THREE.MeshBasicMaterial({ color: 0xcfe8ff, transparent: true, opacity: .8, side: THREE.DoubleSide }));
      wing.rotation.x = -Math.PI / 2; wing.position.y = 0.01; fly.add(wing);
    }
    this.flies.push({ mesh: fly, t: 0, byUser });
    if (byUser) this.onEvent('fly');
  }
  frame(t, frame) {
    const dt = Math.min(0.05, (t - this.last) / 1000); this.last = t;
    if (this.mode === 'webxr' && frame && !this.placed) {
      const hits = frame.getHitTestResults(this.hitSource);
      if (hits.length) { const pose = hits[0].getPose(this.refSpace); this.reticle.visible = true; this.reticle.position.set(pose.transform.position.x, pose.transform.position.y, pose.transform.position.z); this.onEvent('reticle'); }
      else this.reticle.visible = false;
    }
    if (this.mode !== 'webxr') {
      this.camera.rotation.set(0, 0, 0, 'YXZ'); this.camera.rotation.y = this.yaw || 0; this.camera.rotation.x = this.pitch;
    }
    if (this.placed) this.simulate(dt);
    this.renderer.render(this.scene, this.camera);
  }
  simulate(dt) {
    const b = this.cfg.behavior;
    // 手の上: カメラ前方すぐ下に固定
    if (b === 'hand') {
      const s = this.spiders[0]; const off = new THREE.Vector3(0, -0.055, -0.19).applyQuaternion(this.camera.quaternion);
      s.api.group.position.copy(this.camera.position).add(off); s.api.group.quaternion.copy(this.camera.quaternion);
      s.api.group.rotateY(Math.sin(performance.now() / 1500) * 0.6 + Math.PI);
      this.handT = (this.handT || 0) + dt; // ダンゴムシ: 最初の8秒は丸まり、その後ひらく
      s.api.update(dt, { walking: false, roll: this.pb && this.handT < 8 }); return;
    }
    // ハエ: 自由行動レベルでは自然発生
    if (b === 'free' && Math.random() < dt * 0.15 && this.flies.length < 3) {
      const p = this.anchor.clone().add(new THREE.Vector3((Math.random() - .5) * 0.8, 0, (Math.random() - .5) * 0.8)); this.spawnFly(p, false);
    }
    for (const f of this.flies) { f.t += dt; if (!this.pb) f.mesh.position.y = 0.006 + Math.abs(Math.sin(f.t * 12)) * 0.004; }
    for (const s of this.spiders) {
      const g = s.api.group, p = g.position; let walking = false;
      if (b === 'still') { g.rotation.y += Math.sin(performance.now() / 1300) * 0.003; }
      else if (b === 'lure' || b === 'free') {
        // 最も近いハエへ
        let best = null, bd = 1e9; for (const f of this.flies) { const d = f.mesh.position.distanceTo(p); if (d < bd) { bd = d; best = f; } }
        if (best) {
          const dir = best.mesh.position.clone().sub(p); dir.y = 0; const dist = dir.length(); dir.normalize();
          if (this.pb) { // ジグザグで向かい、着いたらかじる
            s.zig += dt; const side = new THREE.Vector3(-dir.z, 0, dir.x).multiplyScalar(Math.sin(s.zig * 2.5) * 0.5);
            const d2 = dir.clone().add(side).normalize(); g.rotation.y = Math.atan2(d2.x, d2.z);
            if (dist > 0.035) { p.addScaledVector(d2, 0.045 * dt); walking = true; }
            else { s.eatT += dt; if (s.eatT > 2.5) { s.eatT = 0; this.world.remove(best.mesh); this.flies = this.flies.filter(f => f !== best); this.prey++; this.onEvent('prey', this.prey); } }
            s.api.update(dt, { walking, speed: 1 }); continue;
          }
          g.rotation.y = Math.atan2(dir.x, dir.z);
          if (dist > 0.18) { p.addScaledVector(dir, 0.10 * dt); walking = true; this.telegraphLine.visible = false; }
          else if (s.jumpT <= 0) { // 跳ぶ前の予告
            s.wait -= dt; if (this.cfg.telegraph) { setDots(this.telegraphLine, p, best.mesh.position); this.telegraphLine.visible = true; }
            if (s.wait <= 0) { s.jumpT = 0.35; s.jumpFrom = p.clone(); s.jumpTo = best.mesh.position.clone(); s.wait = 0.8 + Math.random(); this.telegraphLine.visible = false; }
          }
          if (s.jumpT > 0) { s.jumpT -= dt; const k = 1 - Math.max(0, s.jumpT) / 0.35; p.lerpVectors(s.jumpFrom, s.jumpTo, k); p.y = Math.sin(k * Math.PI) * 0.05;
            if (s.jumpT <= 0) { p.y = 0; this.world.remove(best.mesh); this.flies = this.flies.filter(f => f !== best); this.prey++; this.onEvent('prey', this.prey); } }
        } else if (b === 'free') { // ぶらぶら歩く
          s.wait -= dt; if (s.wait <= 0) { s.target = this.anchor.clone().add(new THREE.Vector3((Math.random() - .5) * 0.9, 0, (Math.random() - .5) * 0.9)); s.wait = 2 + Math.random() * 3; }
          if (s.target) { const d = s.target.clone().sub(p); d.y = 0; if (d.length() < 0.02) s.target = null; else { d.normalize(); p.addScaledVector(d, (this.pb ? 0.04 : 0.07) * dt); g.rotation.y = Math.atan2(d.x, d.z); walking = true; } }
        }
      } else if (b === 'walk') {
        // 画面下側(近く)を左右に歩く。指(障害物)を避ける
        if (!s.target) { s.dir = s.dir || 1; s.target = new THREE.Vector3(s.dir * 0.35, 0, this.anchor.z); }
        const d = s.target.clone().sub(p); d.y = 0;
        if (d.length() < 0.02) { s.dir = -s.dir; s.target = new THREE.Vector3(s.dir * 0.35, 0, this.anchor.z + (Math.random() - .5) * 0.1); }
        else {
          d.normalize();
          let tooClose = false;
          for (const f of this.fingers) { const fp = this.screenToFloor(f.x, f.y); if (fp) { const away = p.clone().sub(fp); away.y = 0; const L = away.length(); if (L < 0.12) { d.add(away.normalize().multiplyScalar((0.12 - L) * 12)); d.normalize(); this.onEvent('avoid'); } if (L < 0.05) tooClose = true; } }
          if (this.pb && tooClose) { s.rollT = 3; }
          if (s.rollT > 0) { s.rollT -= dt; s.api.update(dt, { walking: false, roll: true }); continue; }
          p.addScaledVector(d, (this.pb ? 0.04 : 0.08) * dt); g.rotation.y = Math.atan2(d.x, d.z); walking = true;
        }
      }
      s.api.update(dt, { walking, speed: 1 });
    }
  }
  stop() {
    this.renderer && this.renderer.setAnimationLoop(null);
    this._ro && this._ro.disconnect();
    this.root.removeEventListener('pointerdown', this.onPointer); this.root.removeEventListener('pointermove', this.onMove); this.root.removeEventListener('pointerup', this.onUp);
    this._onOri && removeEventListener('deviceorientation', this._onOri);
    if (this.session) { try { this.session.end(); } catch { } }
    if (this.stream) this.stream.getTracks().forEach(t => t.stop());
    this.renderer && this.renderer.dispose();
  }
}

function makeGrass(litter = false) {
  const c = document.createElement('canvas'); c.width = c.height = 256; const x = c.getContext('2d');
  if (litter) { // 落ち葉
    x.fillStyle = 'rgba(120,90,50,0.35)'; x.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 140; i++) { x.fillStyle = `rgba(${150 + Math.random() * 60},${90 + Math.random() * 50},${30 + Math.random() * 30},0.85)`; x.beginPath(); x.ellipse(Math.random() * 256, Math.random() * 256, 8 + Math.random() * 10, 4 + Math.random() * 5, Math.random() * 3, 0, Math.PI * 2); x.fill(); }
    const tex = new THREE.CanvasTexture(c);
    const m = new THREE.Mesh(new THREE.CircleGeometry(0.7, 48), new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: .85, depthWrite: false }));
    m.rotation.x = -Math.PI / 2; m.position.y = 0.001; return m;
  }
  x.fillStyle = 'rgba(70,140,80,0.35)'; x.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 900; i++) { x.strokeStyle = `rgba(${60 + Math.random() * 60},${130 + Math.random() * 80},${60 + Math.random() * 40},0.8)`; x.lineWidth = 1 + Math.random(); const px = Math.random() * 256, py = Math.random() * 256; x.beginPath(); x.moveTo(px, py); x.lineTo(px + (Math.random() - .5) * 6, py - 6 - Math.random() * 10); x.stroke(); }
  const tex = new THREE.CanvasTexture(c);
  const m = new THREE.Mesh(new THREE.CircleGeometry(0.7, 48), new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: .85, depthWrite: false }));
  m.rotation.x = -Math.PI / 2; m.position.y = 0.001; return m;
}
function makeDots() {
  const g = new THREE.Group(); for (let i = 0; i < 8; i++) { const d = new THREE.Mesh(new THREE.SphereGeometry(0.005, 6, 6), new THREE.MeshBasicMaterial({ color: 0xffe066 })); g.add(d); } return g;
}
function setDots(g, a, b) { g.children.forEach((d, i) => { const k = (i + 1) / 9; d.position.lerpVectors(a, b, k); d.position.y = Math.sin(k * Math.PI) * 0.05 + 0.005; }); }
