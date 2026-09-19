import { AFFECT, GUIDE_LINES, getSpecies, SPECIES } from './levels.js';

// ---------- species ----------
const SPKEY = 'mushitomo.species';
let speciesId = (() => { try { return localStorage.getItem(SPKEY) || ''; } catch { return ''; } })();
let SP = getSpecies(speciesId);
let LEVELS = SP.levels, STAGE3 = SP.stage3, BAT_STEPS = SP.bat;
const svgCute = (...a) => SP.svgCute(...a), svgReal = () => SP.svgReal(); let FLY_SVG = SP.foodSvg;
function setSpecies(id) { speciesId = id; try { localStorage.setItem(SPKEY, id); } catch { } SP = getSpecies(id); LEVELS = SP.levels; STAGE3 = SP.stage3; BAT_STEPS = SP.bat; FLY_SVG = SP.foodSvg; S = load(); }

// ---------- state ----------
const KEY = () => 'mushitomo.v1' + (speciesId === 'spider' || !speciesId ? '' : '.' + speciesId);
const defaultState = () => ({
  name: '', hatched: false, baseline: null, final: null, sessions: [], maxUnlocked: 1,
  stage3: {}, videos: { lv5: [], lv6: [] }, prey: 0, voice: true, photos: [], commonsVideos: [], zukan: [], createdAt: Date.now()
});
let S = load();
function load() { try { const j = JSON.parse(localStorage.getItem(KEY())); return j ? { ...defaultState(), ...j } : defaultState(); } catch { return defaultState(); } }
function save() { try { localStorage.setItem(KEY(), JSON.stringify(S)); } catch (e) { toast('保存に失敗: ' + e.message); } }

// ---------- utils ----------
const app = document.getElementById('app');
const $ = (sel, el = document) => el.querySelector(sel);
const h = (s) => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
function toast(msg, ms = 2200) { const t = $('#toast'); t.textContent = msg; t.hidden = false; clearTimeout(t._t); t._t = setTimeout(() => t.hidden = true, ms); }
function speak(text) {
  if (!S.voice || !('speechSynthesis' in window)) return;
  try { speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(text); u.lang = 'ja-JP'; u.rate = 1.0; speechSynthesis.speak(u); } catch { }
}
const fmtDate = (t) => new Date(t).toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric' });
const spiderName = () => S.name || 'まだ名前がない子';
let cleanup = null; // 画面ごとの後始末
function render(html, after) { if (cleanup) { try { cleanup(); } catch { } cleanup = null; } app.innerHTML = `<div class="fade">${html}</div>`; window.scrollTo(0, 0); after && after(); }
function topbar(title, back = '#home') { return `<div class="topbar"><a class="btn sm ghost" href="${back}">‹ 戻る</a><div class="title">${h(title)}</div><a class="btn sm ghost" href="#settings">⚙</a></div>`; }
function guide(text) { return `<div class="guide"><div class="face">む</div><div class="bubble">${h(text)}</div></div>`; }
function scale(id, val, max = 10, labels = ['まったく嫌じゃない', '最悪']) {
  let b = ''; for (let i = 0; i <= max; i++) b += `<button type="button" data-v="${i}" class="${val === i ? 'on' : ''}">${i}</button>`;
  return `<div class="scale" id="${id}">${b}</div><div class="spread muted small"><span>${labels[0]}</span><span>${labels[1]}</span></div>`;
}
function bindScale(id, cb) { const el = $('#' + id); el.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; el.querySelectorAll('button').forEach(x => x.classList.remove('on')); b.classList.add('on'); cb(+b.dataset.v); }); }
function chips(id, items, on) { return `<div class="chips" id="${id}">${items.map(x => `<button type="button" class="chip ${on === x ? 'on' : ''}" data-v="${h(x)}">${h(x)}</button>`).join('')}</div>`; }
function bindChips(id, cb) { const el = $('#' + id); el.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; el.querySelectorAll('button').forEach(x => x.classList.remove('on')); b.classList.add('on'); cb(b.dataset.v); }); }
const levelDone = (id) => S.sessions.some(s => s.level === id && s.unlocked);
const lastSession = (id) => [...S.sessions].reverse().find(s => s.level === id);
function ytId(url) { const m = String(url).match(/(?:v=|youtu\.be\/|shorts\/|embed\/)([\w-]{11})/); return m ? m[1] : null; }

// ---------- router ----------
const routes = {};
function go(hash) { location.hash = hash; }
window.addEventListener('hashchange', route);
function route() {
  const [path, arg] = location.hash.replace('#', '').split('/');
  const fn = routes[path || 'home'] || routes.home; fn(arg);
}

// ---------- HOME ----------
routes.home = () => {
  if (!speciesId) return routes.species();
  const done = LEVELS.filter(l => levelDone(l.id)).length;
  const s3done = STAGE3.filter(s => S.stage3[s.id]?.done).length;
  const pct = Math.round(((done + s3done) / (LEVELS.length + STAGE3.length)) * 100);
  const tile = (l) => {
    const d = levelDone(l.id), locked = l.id > S.maxUnlocked, cur = l.id === S.maxUnlocked && !d;
    return `<a class="lv ${d ? 'done' : ''} ${locked ? 'locked' : ''} ${cur ? 'current' : ''}" href="#level/${l.id}"><span class="n">${d ? '✓' : ''}Lv${l.id}</span><span class="t">${h(l.short)}</span></a>`;
  };
  const last = S.sessions.at(-1);
  render(`
    <div class="spread"><h1>むしとも</h1><a class="btn sm ghost" href="#settings">⚙ 設定</a></div>
    <p class="muted">${S.hatched ? h(spiderName()) + ' の世話係見習い' : h(SP.label) + 'の世話係見習い'} · ${h(SP.preyLabel)} ${S.prey} <a class="small" href="#species">(${h(SP.labelShort)}を変更)</a></p>
    <div class="card">
      <div class="spread"><b>進捗</b><span class="pill">${pct}%</span></div>
      <div class="progress"><i style="width:${pct}%"></i></div>
      ${S.baseline ? `<p class="small muted">基準値 ${fmtDate(S.baseline.date)}: BAT ${S.baseline.bat}/7 · 怖い ${S.baseline.fear} · 気持ち悪い ${S.baseline.disgust}</p>` : `<div class="warn" style="margin-top:8px">最初に基準値(BAT・SUDS)を測ってから始める。<br><a class="btn sm primary" style="margin-top:8px" href="#baseline">基準値を測る</a></div>`}
    </div>
    <h2>ステージ1 · 画面 <span class="pill gray">Lv1〜6</span></h2>
    <div class="levels">${LEVELS.filter(l => l.stage === 1).map(tile).join('')}</div>
    <h2>ステージ2 · AR <span class="pill gray">Lv7〜11</span></h2>
    <div class="levels">${LEVELS.filter(l => l.stage === 2).map(tile).join('')}</div>
    <h2>ステージ3 · 実物 <span class="pill gray">${s3done}/${STAGE3.length}</span></h2>
    <a class="btn block" href="#stage3">実物チェックリストを開く</a>
    <div class="grid2" style="margin-top:12px">
      <a class="btn" href="#diary">📈 日記・グラフ</a>
      <a class="btn" href="#final">🎓 再計測・卒業</a>
    </div>
    ${last ? `<p class="small muted center" style="margin-top:14px">最後のセッション: ${fmtDate(last.date)} Lv${last.level} SUDS ${last.pre}→${last.post}</p>` : ''}
  `);
};

routes.species = () => {
  render(`<h1>むしとも</h1><p class="muted">まず、どの虫から始めるか選ぶ。あとから設定で切り替えられる(進捗は虫ごとに別)。</p>
    ${Object.values(SPECIES).map(sp => `<div class="card"><div class="spread"><b>${h(sp.label)}</b>${speciesId === sp.id ? '<span class="pill">選択中</span>' : ''}</div><p class="small muted">${h(sp.safety)}</p><button class="btn ${sp.id === 'pillbug' ? 'primary' : ''} block" data-sp="${sp.id}">${h(sp.label)}で始める</button></div>`).join('')}
    <p class="small muted center">迷ったらダンゴムシから。噛まない・刺さない・丸くなるだけで、動きが読みやすい。</p>`, () => {
    app.querySelectorAll('[data-sp]').forEach(b => b.onclick = () => { setSpecies(b.dataset.sp); toast(getSpecies(b.dataset.sp).label + 'にした'); go('home'); routes.home(); });
  });
};

// ---------- BASELINE / FINAL ----------
function measureScreen(kind) {
  const cur = S[kind] || { bat: null, fear: null, disgust: null, suds: null };
  const v = { ...cur };
  render(`
    ${topbar(kind === 'baseline' ? '基準値を測る' : '再計測・卒業')}
    ${guide(kind === 'baseline' ? '今のままを正直に。低くても高くても、ここが出発点。' : '連休の最後に、同じ物差しでもう一度。')}
    <div class="card"><h3>BAT(行動接近テスト)</h3><p class="small muted">実物の${h(SP.labelShort)}(ケース入り)に対して、今できると思う一番遠い段階を選ぶ。</p>
      <div class="choice" id="bat">${BAT_STEPS.map((s, i) => `<button type="button" data-v="${i}" class="${v.bat === i ? 'on' : ''}">${h(s)}</button>`).join('')}</div></div>
    <div class="card"><h3>${h(SP.labelShort)}を想像したときの「怖い」(0〜10)</h3>${scale('fear', v.fear)}</div>
    <div class="card"><h3>${h(SP.labelShort)}を想像したときの「気持ち悪い」(0〜10)</h3>${scale('disgust', v.disgust)}</div>
    <div class="card"><h3>今この瞬間の嫌さ SUDS(0〜10)</h3>${scale('suds', v.suds)}</div>
    <button class="btn primary block" id="save">保存する</button>
    ${kind === 'final' && S.baseline ? `<p class="small muted center" style="margin-top:10px">基準値: BAT ${S.baseline.bat} · 怖い ${S.baseline.fear} · 気持ち悪い ${S.baseline.disgust}</p>` : ''}
  `, () => {
    const bat = $('#bat'); bat.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; bat.querySelectorAll('button').forEach(x => x.classList.remove('on')); b.classList.add('on'); v.bat = +b.dataset.v; });
    bindScale('fear', x => v.fear = x); bindScale('disgust', x => v.disgust = x); bindScale('suds', x => v.suds = x);
    $('#save').onclick = () => {
      if ([v.bat, v.fear, v.disgust, v.suds].some(x => x == null)) return toast('全部選んでね');
      S[kind] = { ...v, date: Date.now() }; save(); toast('保存した');
      if (kind === 'final') go('graduate'); else go('home');
    };
  });
}
routes.baseline = () => measureScreen('baseline');
routes.final = () => measureScreen('final');
routes.graduate = () => {
  const b = S.baseline, f = S.final; if (!b || !f) return go('home');
  const up = f.bat - b.bat;
  render(`${topbar('結果')}
    <div class="card center"><div class="big">${up >= 0 ? '+' : ''}${up}</div><p>BATの到達段階の変化(${b.bat} → ${f.bat})</p>
    <p class="muted small">怖い ${b.fear}→${f.fear} · 気持ち悪い ${b.disgust}→${f.disgust}</p></div>
    ${f.bat >= 7 ? `<div class="card center"><h2>🎓 卒業</h2><p>${h(spiderName())}を手に乗せられた。ゴールは「好きになる」ではなく「困らない」。ここまでで十分。</p></div>` :
      `<div class="card"><p>まだ7には届いていない。到達段階を記録して、翌週に持ち越す。「怖い」だけ下がって「気持ち悪い」が残るなら、知識・文脈の仕掛け(名前・役割・屋外背景)を増やす。</p></div>`}
    <a class="btn block" href="#diary">日記・グラフを見る</a>`);
};

// ---------- LEVEL FLOW ----------
routes.level = (id) => {
  const L = LEVELS.find(l => l.id === +id); if (!L) return go('home');
  if (L.id > S.maxUnlocked) { toast('前のレベルで嫌さを半分にすると開く'); return go('home'); }
  const flow = { pre: null, affectPre: null, predict: null, post: null, affectPost: null, started: null, seconds: 0 };
  stepIntro(L, flow);
};
function stepIntro(L, flow) {
  const prev = lastSession(L.id);
  const vids = L.stage === 1 ? [] : (S.videos.lv6 || []);
  render(`${topbar(`Lv${L.id} ${L.title}`)}
    <div class="card"><div class="spread"><b>${h(L.short)}</b><span class="pill">${L.minutes}分</span></div><p>${h(L.goal)}</p>
    ${prev ? `<p class="small muted">前回: SUDS ${prev.pre}→${prev.post} (${fmtDate(prev.date)})</p>` : ''}</div>
    ${modelingBlock(L)}
    ${guide('最初に10秒だけ、平気な人が同じことをしている動画を見る。それから始めよう。')}
    <button class="btn primary block" id="next">準備OK、始める</button>`, () => { $('#next').onclick = () => stepPre(L, flow); });
}
function modelingBlock(L) {
  const urls = [...(S.videos.lv6 || []), ...(S.videos.lv5 || [])];
  const id = urls.map(ytId).find(Boolean);
  if (id) return `<div class="card"><h3>モデリング動画(10秒でOK)</h3><div class="stage tall"><iframe style="width:100%;height:100%;border:0" src="https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div></div>`;
  return `<div class="card"><h3>モデリング動画</h3><p class="small muted">「${h(SP.label)}を手に乗せている人」の動画を1本、設定から登録しておくと毎回ここに出る。</p><div class="row"><a class="btn sm" href="https://www.youtube.com/results?search_query=${encodeURIComponent(SP.ytSearch.lv6)}" target="_blank" rel="noopener">YouTubeで探す ↗</a><a class="btn sm" href="#settings">登録する</a></div></div>`;
}
function stepPre(L, flow) {
  render(`${topbar(`Lv${L.id} 開始前`)}
    ${guide(GUIDE_LINES.start)}
    <div class="card"><h3>今の嫌さ SUDS(0〜10)</h3>${scale('pre', flow.pre)}</div>
    <div class="card"><h3>今の気持ちにいちばん近いのは</h3>${chips('aff', AFFECT, flow.affectPre)}</div>
    <div class="card"><h3>予想: このあと${h(spiderName())}はどうする?</h3><div class="choice" id="pred">${L.predict.map((p, i) => `<button type="button" data-v="${i}">${h(p)}</button>`).join('')}</div></div>
    <button class="btn primary block" id="next">曝露を始める</button>`, () => {
    bindScale('pre', v => flow.pre = v); bindChips('aff', v => flow.affectPre = v);
    const pr = $('#pred'); pr.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; pr.querySelectorAll('button').forEach(x => x.classList.remove('on')); b.classList.add('on'); flow.predict = +b.dataset.v; });
    $('#next').onclick = () => { if (flow.pre == null) return toast('SUDSを選んでね'); if (flow.predict == null) return toast('予想を1つ選んでね'); speak(GUIDE_LINES.start); flow.started = Date.now(); stepExposure(L, flow); };
  });
}
function timerBar(L, flow, onDone) {
  const total = L.minutes * 60; let left = total, half = false;
  const el = $('#timer'), bar = $('#tbar');
  const iv = setInterval(() => {
    left--; flow.seconds = total - left; if (el) el.textContent = `${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')}`; if (bar) bar.style.width = `${(1 - left / total) * 100}%`;
    if (!half && left <= total / 2) { half = true; speak(GUIDE_LINES.half); toast(GUIDE_LINES.half, 3000); }
    if (left <= 0) { clearInterval(iv); speak(GUIDE_LINES.end); onDone(); }
  }, 1000);
  return () => clearInterval(iv);
}
function exposureShell(L, flow, inner, hint) {
  return `${topbar(`Lv${L.id} ${L.title}`, '#home')}
    <div class="spread"><span class="timer" id="timer">${L.minutes}:00</span><span class="muted small">${h(hint || '')}</span></div>
    <div class="progress" style="margin:6px 0 10px"><i id="tbar" style="width:0%"></i></div>
    ${inner}
    <div class="card"><h3>いま感じていることを一言(感情ラベリング)</h3>${chips('affNow', AFFECT, null)}<div id="affLog" class="small muted" style="margin-top:6px"></div></div>
    <div class="footer-nav row"><button class="btn block primary" id="finish">終わった／今日はここまで</button></div>`;
}
function stepExposure(L, flow) {
  const done = () => stepPost(L, flow);
  let stop = () => { };
  const finish = () => { stop(); done(); };
  const bindCommon = () => {
    const log = []; bindChips('affNow', v => { log.push(v); $('#affLog').textContent = log.join(' → '); flow.labels = log; });
    $('#finish').onclick = finish; const st = timerBar(L, flow, finish); cleanup = () => { st(); stop(); };
  };
  if (L.kind === 'svgCute') {
    render(exposureShell(L, flow, `<div class="stage" id="st">${svgCute(S.name, S.hatched)}</div>
      ${!S.hatched ? `<div class="card"><h3>名前をつける</h3><input type="text" id="nm" placeholder="例: ${h(SP.defaultName)}" value="${h(S.name)}"><button class="btn primary block" id="hatch" style="margin-top:8px">この名前で${SP.id === 'pillbug' ? 'ひらいてもらう' : '孵化させる'}</button></div>` : `<p class="center muted small">${h(spiderName())}はこちらを見ている。タップすると${SP.id === 'pillbug' ? '少し丸まる' : '跳ねる'}。</p>`}`, '見ているだけでOK'), () => {
      bindCommon();
      const st = $('#st');
      if (!S.hatched) { $('#hatch').onclick = () => { const n = $('#nm').value.trim(); if (!n) return toast('名前を入れてね'); S.name = n; S.hatched = true; save(); st.innerHTML = svgCute(n, true); $('#hatch').closest('.card').innerHTML = `<p class="center">${h(n)}が${SP.id === 'pillbug' ? 'ひらいた' : '生まれた'}。</p>`; speak(`${n}が${SP.id === 'pillbug' ? 'ひらいた' : '生まれた'}`); }; }
      st.addEventListener('click', () => { const sp = st.querySelector('.spider-cute'); if (!sp) return; sp.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(-18px)' }, { transform: 'translateY(0)' }], { duration: 380, easing: 'ease-out' }); });
    });
  } else if (L.kind === 'svgReal') {
    render(exposureShell(L, flow, `<div class="stage" id="st">${svgReal()}<div id="fly" style="position:absolute;width:44px;height:44px;left:12px;top:12px;touch-action:none;cursor:grab">${FLY_SVG}</div><div class="hint">${h(SP.foodName)}をドラッグして${h(spiderName())}に届ける</div></div><p class="center muted small" id="fed">${h(SP.foodName)}をあげた回数: 0</p>`, 'ドラッグ'), () => {
      bindCommon();
      const st = $('#st'), fly = $('#fly'); let drag = null, fed = 0;
      fly.addEventListener('pointerdown', e => { drag = { dx: e.clientX - fly.offsetLeft, dy: e.clientY - fly.offsetTop }; fly.setPointerCapture(e.pointerId); });
      fly.addEventListener('pointermove', e => { if (!drag) return; fly.style.left = (e.clientX - drag.dx) + 'px'; fly.style.top = (e.clientY - drag.dy) + 'px'; });
      fly.addEventListener('pointerup', () => {
        if (!drag) return; drag = null; const r = st.getBoundingClientRect(), f = fly.getBoundingClientRect();
        const cx = (f.left + f.width / 2 - r.left) / r.width, cy = (f.top + f.height / 2 - r.top) / r.height;
        if (cx > 0.3 && cx < 0.7 && cy > 0.35 && cy < 0.8) { fed++; $('#fed').textContent = `${SP.foodName}をあげた回数: ${fed}`; const sp = st.querySelector('.spider-real'); sp.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(-10px) scale(1.04)' }, { transform: 'translateY(0)' }], { duration: 300 }); fly.style.left = '12px'; fly.style.top = '12px'; toast('食べた!'); }
      });
    });
  } else if (L.kind === 'model3d') {
    render(exposureShell(L, flow, `<div class="stage" id="st"><div class="hint">${SP.id === 'pillbug' ? 'タップで丸まる/ひらく。スワイプで離れる' : 'スワイプすると指から離れる方向へ逃げる'}</div></div><p class="center muted small" id="fl">どいてもらった回数: 0</p>`, 'スワイプ'), async () => {
      bindCommon();
      const { mountStaticViewer } = await import('./spider3d.js');
      const v = mountStaticViewer($('#st'), { species: SP.id, onFlee: n => $('#fl').textContent = `どいてもらった回数: ${n}` });
      const prevStop = stop; stop = () => { prevStop(); v.destroy(); };
    });
  } else if (L.kind === 'photos') {
    render(exposureShell(L, flow, `<div class="card"><div class="stage" id="st"><div id="ph" style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#e6f2e9"><span class="muted">読み込み中…</span></div></div>
      <div class="row" style="margin-top:8px"><span class="small muted">遠い</span><input type="range" id="zoom" min="0.25" max="2.5" step="0.05" value="0.35" style="flex:1"><span class="small muted">近い</span></div>
      <div class="row" style="margin-top:6px"><button class="btn sm" id="prev">‹ 前</button><span class="small muted" id="cap" style="flex:1"></span><button class="btn sm" id="nextp">次 ›</button><button class="btn sm primary" id="reg">図鑑に登録</button></div></div>`, 'ピンチ/スライダーで寄る'), async () => {
      bindCommon();
      const photos = [...(S.userPhotos || []).map(u => ({ url: u, credit: '登録した写真' })), ...(await loadCommonsPhotos())];
      let i = 0, z = 0.35; const ph = $('#ph');
      const show = () => { if (!photos.length) { ph.innerHTML = `<div class="warn">写真を取得できなかった(オフライン?)。設定から写真URLを登録するか、通信を確認。</div>`; return; } const p = photos[i]; ph.innerHTML = `<img src="${p.url}" alt="" style="transform:scale(${z});transition:transform .2s;object-fit:contain;background:#fff">`; $('#cap').textContent = `${i + 1}/${photos.length} ${p.credit}`; };
      show();
      $('#zoom').oninput = e => { z = +e.target.value; const img = ph.querySelector('img'); if (img) img.style.transform = `scale(${z})`; };
      $('#prev').onclick = () => { i = (i - 1 + photos.length) % photos.length; show(); }; $('#nextp').onclick = () => { i = (i + 1) % photos.length; show(); };
      $('#reg').onclick = () => { const p = photos[i]; if (!p) return; if (!S.zukan.includes(p.url)) { S.zukan.push(p.url); save(); } toast('図鑑に登録した(' + S.zukan.length + '枚)'); };
    });
  } else if (L.kind === 'videos') {
    const key = L.id === 5 ? 'lv5' : 'lv6';
    render(exposureShell(L, flow, `<div class="card" id="vbox"><span class="muted">読み込み中…</span></div>
      <p class="small muted">再生ボタンを押す前に「どう動くか」を口に出して予想する。当たっても外れてもOK。</p>`, '予想→再生'), async () => {
      bindCommon();
      const box = $('#vbox'); const yts = (S.videos[key] || []).map(ytId).filter(Boolean);
      let html = '';
      for (const id of yts) html += `<div class="stage tall" style="margin-bottom:8px"><iframe style="width:100%;height:100%;border:0" src="https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;
      const cv = await loadCommonsVideos();
      for (const v of cv.slice(0, 4)) html += `<div class="stage tall" style="margin-bottom:8px"><video src="${v.url}" controls playsinline preload="metadata"></video></div><p class="small muted">${h(v.credit)}</p>`;
      if (!html) html = `<div class="warn">動画がまだない。設定からYouTubeのURLを登録するか、<a href="https://www.youtube.com/results?search_query=${encodeURIComponent(L.id === 5 ? SP.ytSearch.lv5 : SP.ytSearch.lv6)}" target="_blank" rel="noopener">YouTubeで探す ↗</a>(見つけたURLを登録するとここに出る)</div>`;
      box.innerHTML = html;
    });
  } else if (L.kind === 'ar') {
    startAR(L, flow, done);
  }
}
function stepPost(L, flow) {
  render(`${topbar(`Lv${L.id} 終了後`)}
    ${guide(GUIDE_LINES.end)}
    <div class="card"><h3>今の嫌さ SUDS(0〜10)</h3><p class="small muted">開始前は ${flow.pre}</p>${scale('post', flow.post)}</div>
    <div class="card"><h3>今の気持ち</h3>${chips('aff2', AFFECT, flow.affectPost)}</div>
    <div class="card"><h3>答え合わせ</h3><p>あなたの予想: <b>${h(L.predict[flow.predict])}</b></p><p>${L.actual >= 0 ? `実際: <b>${h(L.predict[L.actual])}</b>。` : ''}${h(L.actualText)}</p></div>
    <div class="fact">🔎 ${h(L.fact)}</div>
    <button class="btn primary block" id="save">記録して結果を見る</button>`, () => {
    bindScale('post', v => flow.post = v); bindChips('aff2', v => flow.affectPost = v);
    $('#save').onclick = () => {
      if (flow.post == null) return toast('SUDSを選んでね');
      const total = L.minutes * 60;
      const completed = (flow.seconds || 0) >= total - 5;              // 時間いっぱい居られた
      const lowEnough = flow.post <= Math.max(3, Math.floor(flow.pre / 2)); // 半減 or もともと低い
      const unlocked = completed || lowEnough;
      flow.unlockReason = completed && !lowEnough ? 'completed' : 'suds';
      S.sessions.push({ date: Date.now(), level: L.id, pre: flow.pre, post: flow.post, affectPre: flow.affectPre, affectPost: flow.affectPost, labels: flow.labels || [], predict: flow.predict, seconds: flow.seconds, unlocked, prey: flow.prey || 0 });
      if (unlocked && L.id === S.maxUnlocked && L.id < LEVELS.length) S.maxUnlocked = L.id + 1;
      save();
      const msg = !unlocked ? GUIDE_LINES.notyet : flow.unlockReason === 'completed' ? GUIDE_LINES.unlockedByTime : GUIDE_LINES.unlocked; speak(msg);
      render(`${topbar('結果')}
        <div class="card center"><div class="big">${flow.pre} → ${flow.post}</div><p>${h(msg)}</p>
        <p class="small muted">解鎖ルール: 時間いっぱい居られた、または終了後SUDSが開始前の半分以下(3以下ならOK)。SUDSが下がらなくても「予想と違った」ことが学習になる(Craskeら 2014)。</p></div>
        ${unlocked && L.id < LEVELS.length ? `<a class="btn primary block" href="#level/${L.id + 1}">Lv${L.id + 1}へ進む</a>` : `<a class="btn primary block" href="#level/${L.id}">もう一回やる</a>`}
        <a class="btn block" style="margin-top:8px" href="#home">ホームへ</a>`);
    };
  });
}

// ---------- AR ----------
async function startAR(L, flow, done) {
  const { ARSession } = await import('./spider3d.js');
  const wrap = document.createElement('div'); wrap.className = 'ar-wrap';
  wrap.innerHTML = `<div class="ar-top"><span class="pill">Lv${L.id} ${h(L.title)}</span><span class="timer" id="timer">${L.minutes}:00</span><button class="btn sm" id="close">終了</button></div>
    <div class="badge" id="badge">${h(SP.preyLabel)} 0</div>
    <div class="ar-ui"><div class="ar-msg" id="msg">起動中…</div>
      <div class="row" style="margin-bottom:8px"><span class="small">今の嫌さ</span>${[0, 2, 4, 6, 8, 10].map(v => `<button class="btn sm" data-s="${v}">${v}</button>`).join('')}</div>
      <div class="row" id="arActions"></div>
      <div class="progress" style="margin-top:8px;background:rgba(255,255,255,.25)"><i id="tbar" style="width:0%"></i></div></div>`;
  document.body.appendChild(wrap);
  const msg = $('#msg', wrap), badge = $('#badge', wrap), actions = $('#arActions', wrap);
  const b = L.ar.behavior;
  const pb = SP.id === 'pillbug';
  const hints = { still: `2.5m先の床に${spiderName()}がいる。見つけたら画面をタップして名前を呼ぶ。`, lure: pb ? '床をタップすると落ち葉を置ける。触角で探りながらジグザグに向かい、かじる。' : '床をタップすると餌(コバエ)を置ける。餌の方へ歩いて、最後に跳ぶ(点線で予告)。', walk: pb ? '画面の下側を歩く。指を画面に置くと避ける。近すぎると丸まる。手元にフワフワした物を。' : '画面の下側を歩く。指を画面に置くと、指を避けて歩く。手元にフワフワした物を。', hand: pb ? '画面の下に手を出して。最初は丸まり、じっとしているとひらく。30秒。' : '画面の下に手を出して。手のひらにフィギュアを乗せると触覚が足せる。30秒。', free: pb ? '何もしないで見ているだけ。ときどき落ち葉を食べる。' : '何もしないで見ているだけ。ときどきコバエを捕まえる。' };
  let called = 0, handStart = null, calls = 0;
  const ar = new ARSession(wrap, {
    level: L, name: spiderName(), species: SP.id, onEvent: (ev, v) => {
      if (ev === 'mode') { msg.textContent = (v === 'webxr' ? '床を映して、2.5m先の床をタップして置く。' : v === 'nocamera' ? 'カメラが使えない。緑背景で代替する。' : hints[b]); if (v === 'webxr') actions.innerHTML = ''; }
      if (ev === 'placed') { msg.textContent = hints[b]; if (b === 'hand') handStart = Date.now(); }
      if (ev === 'called') { calls++; msg.textContent = `${spiderName()}! (${calls}回目)`; speak(spiderName()); }
      if (ev === 'prey') { badge.textContent = `${SP.preyLabel} ${v}`; flow.prey = v; }
      if (ev === 'fly') msg.textContent = `${SP.foodName}を置いた。歩いてくるのを待とう。`;
      if (ev === 'ended') finish();
    }
  });
  wrap.addEventListener('click', e => { const s = e.target.closest('[data-s]'); if (s) { const v = +s.dataset.s; (flow.arSuds ||= []).push({ t: Date.now(), v }); toast('SUDS ' + v + ' を記録'); } });
  if (b !== 'hand') actions.innerHTML = `<button class="btn sm" id="replace">置き直す</button>`;
  let handTimer = null;
  if (b === 'hand') { handTimer = setInterval(() => { if (!handStart) return; const s = Math.floor((Date.now() - handStart) / 1000); msg.textContent = `手の上: ${s}秒 / 30秒 ` + (s >= 30 ? '— クリア。続けてもいい。' : ''); }, 500); }
  const finish = () => { clearInterval(handTimer); stopT(); ar.stop(); wrap.remove(); cleanup = null; S.prey += (flow.prey || 0); save(); done(); };
  $('#close', wrap).onclick = finish;
  const stopT = timerBar(L, flow, finish);
  cleanup = () => { clearInterval(handTimer); stopT(); ar.stop(); wrap.remove(); };
  try { await ar.start(); } catch (e) { msg.textContent = 'AR起動に失敗: ' + e.message; }
  $('#replace', wrap) && ($('#replace', wrap).onclick = () => { if (ar.mode === 'webxr') { ar.placed = false; msg.textContent = '床をタップして置き直す'; } else ar.placeAtDistance(L.ar.distance); });
}

// ---------- Wikimedia Commons(実写素材) ----------
async function commonsSearch(q, extra = '') {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(q)}&gsrnamespace=6&gsrlimit=24&prop=imageinfo&iiprop=url|extmetadata|mime&iiurlwidth=1100&format=json&origin=*${extra}`;
  const r = await fetch(url); const j = await r.json(); const pages = Object.values(j.query?.pages || {});
  return pages.map(p => { const ii = p.imageinfo?.[0]; if (!ii) return null; const m = ii.extmetadata || {}; const artist = (m.Artist?.value || '').replace(/<[^>]+>/g, ''); const lic = m.LicenseShortName?.value || ''; return { title: p.title, url: ii.thumburl || ii.url, full: ii.url, mime: ii.mime, credit: `${artist} / ${lic} (Wikimedia Commons)` }; }).filter(Boolean);
}
async function loadCommonsPhotos() {
  if (S.photos.length && Date.now() - (S.photosAt || 0) < 7 * 864e5) return S.photos;
  try {
    const a = await commonsSearch(SP.commons.photos[0]); const b = await commonsSearch(SP.commons.photos[1] || SP.commons.photos[0]);
    const list = [...a, ...b].filter(p => /image\/(jpeg|png)/.test(p.mime || 'image/jpeg')).slice(0, 24);
    if (list.length) { S.photos = list; S.photosAt = Date.now(); save(); }
    return list;
  } catch (e) { console.warn(e); return S.photos || []; }
}
async function loadCommonsVideos() {
  if (S.commonsVideos.length && Date.now() - (S.videosAt || 0) < 7 * 864e5) return S.commonsVideos;
  try {
    const a = await commonsSearch(SP.commons.videos[0]);
    const list = a.filter(v => /video\/(webm|mp4|ogg)/.test(v.mime || '')).map(v => ({ ...v, url: v.full })).slice(0, 6);
    if (list.length) { S.commonsVideos = list; S.videosAt = Date.now(); save(); }
    return list;
  } catch (e) { console.warn(e); return S.commonsVideos || []; }
}

// ---------- STAGE 3 ----------
routes.stage3 = () => {
  render(`${topbar('ステージ3 · 実物')}
    <div class="warn">${h(SP.safety)}</div>
    ${guide(SP.guideCare)}
    ${STAGE3.map((s, i) => { const d = S.stage3[s.id] || {}; return `<div class="card ${d.done ? '' : ''}"><div class="spread"><b>${i + 1}. ${h(s.title)}</b>${d.done ? `<span class="pill">✓ ${fmtDate(d.date)} SUDS ${d.pre}→${d.post}</span>` : `<span class="pill gray">${s.minutes}分</span>`}</div><p class="small">${h(s.detail)}</p><a class="btn sm ${d.done ? '' : 'primary'}" href="#s3/${s.id}">${d.done ? 'もう一回' : 'やる'}</a></div>`; }).join('')}
    ${STAGE3.every(s => S.stage3[s.id]?.done) ? `<a class="btn primary block" href="#final">再計測して卒業する</a>` : ''}`);
};
routes.s3 = (id) => {
  const s = STAGE3.find(x => x.id === id); if (!s) return go('stage3');
  const flow = { pre: null, post: null, note: '' };
  render(`${topbar(s.title, '#stage3')}
    <div class="card"><p>${h(s.detail)}</p></div>
    <div class="card"><h3>開始前の嫌さ SUDS</h3>${scale('pre', null)}</div>
    <div class="card"><div class="spread"><b>タイマー</b><span class="timer" id="timer">${s.minutes}:00</span></div><div class="progress" style="margin-top:6px"><i id="tbar" style="width:0%"></i></div><button class="btn block" id="start" style="margin-top:8px">開始</button></div>
    <div class="card"><h3>終了後の嫌さ SUDS</h3>${scale('post', null)}</div>
    <div class="card"><h3>メモ(体の大きさ、動き、気づき)</h3><textarea id="note" rows="3"></textarea></div>
    <button class="btn primary block" id="save">記録する</button>`, () => {
    bindScale('pre', v => flow.pre = v); bindScale('post', v => flow.post = v);
    $('#start').onclick = () => { $('#start').disabled = true; speak('開始。呼吸はゆっくり。'); cleanup = timerBar({ minutes: s.minutes }, {}, () => toast('時間になった。続けてもいいし、記録してもいい。')); };
    $('#save').onclick = () => { if (flow.pre == null || flow.post == null) return toast('SUDSを前後どちらも'); S.stage3[s.id] = { done: true, date: Date.now(), pre: flow.pre, post: flow.post, note: $('#note').value }; S.sessions.push({ date: Date.now(), level: 's3-' + s.id, pre: flow.pre, post: flow.post, unlocked: true }); save(); toast('記録した'); go('stage3'); };
  });
};

// ---------- DIARY ----------
routes.diary = () => {
  const ss = S.sessions;
  const w = 340, hh = 150, pad = 24;
  const pts = ss.map((s, i) => ({ x: pad + (ss.length > 1 ? i / (ss.length - 1) : 0.5) * (w - pad * 2), pre: s.pre, post: s.post }));
  const y = v => hh - pad - (v / 10) * (hh - pad * 2);
  const path = (k) => pts.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)} ${y(p[k]).toFixed(1)}`).join(' ');
  render(`${topbar('日記・グラフ')}
    <div class="card"><h3>SUDS 開始前(灰) → 終了後(緑)</h3>
    ${ss.length ? `<svg class="chart" viewBox="0 0 ${w} ${hh}"><line x1="${pad}" y1="${y(0)}" x2="${w - pad}" y2="${y(0)}" stroke="#ccc"/><line x1="${pad}" y1="${y(10)}" x2="${w - pad}" y2="${y(10)}" stroke="#eee"/><text x="4" y="${y(10) + 4}" font-size="10" fill="#888">10</text><text x="8" y="${y(0) + 4}" font-size="10" fill="#888">0</text>
      <path d="${path('pre')}" fill="none" stroke="#9aa" stroke-width="2"/><path d="${path('post')}" fill="none" stroke="#2f9c85" stroke-width="2.5"/>
      ${pts.map(p => `<circle cx="${p.x}" cy="${y(p.post)}" r="3.5" fill="#2f9c85"/><circle cx="${p.x}" cy="${y(p.pre)}" r="3" fill="#9aa"/>`).join('')}</svg>` : '<p class="muted">まだ記録がない。</p>'}</div>
    ${[...ss].reverse().map(s => `<div class="card small"><div class="spread"><b>${fmtDate(s.date)} · ${String(s.level).startsWith('s3') ? '実物 ' + s.level.slice(3) : 'Lv' + s.level}</b><span class="pill ${s.unlocked ? '' : 'amber'}">${s.pre} → ${s.post}</span></div>${s.labels?.length ? `<div class="muted">${h(s.labels.join(' → '))}</div>` : ''}${s.affectPre ? `<div class="muted">${h(s.affectPre)} → ${h(s.affectPost || '')}</div>` : ''}${s.seconds ? `<div class="muted">${Math.round(s.seconds / 60)}分</div>` : ''}</div>`).join('')}
    ${S.zukan.length ? `<h2>図鑑 (${S.zukan.length})</h2><div class="grid2">${S.zukan.map(u => `<img src="${u}" alt="" style="width:100%;border-radius:10px;aspect-ratio:1;object-fit:cover">`).join('')}</div>` : ''}`);
};

// ---------- SETTINGS ----------
routes.settings = () => {
  render(`${topbar('設定')}
    <div class="card"><h3>虫の種類</h3><p class="small muted">今: ${h(SP.label)}。進捗・記録は種類ごとに別に保存される。</p><a class="btn sm" href="#species">種類を切り替える</a></div>
    <div class="card"><h3>${h(SP.labelShort)}の名前</h3><input type="text" id="nm" value="${h(S.name)}"><button class="btn sm" id="nmSave" style="margin-top:8px">変更</button></div>
    <div class="card"><h3>モデリング動画(Lv6・各レベル冒頭): 手に乗せている動画のYouTube URL</h3><textarea id="v6" rows="3" placeholder="1行に1つ">${h((S.videos.lv6 || []).join('\n'))}</textarea>
      <h3>動く動画(Lv5): 歩く・跳ぶ動画のYouTube URL</h3><textarea id="v5" rows="3" placeholder="1行に1つ">${h((S.videos.lv5 || []).join('\n'))}</textarea>
      <h3>実写写真のURL(Lv4、Commonsが使えないとき用)</h3><textarea id="ph" rows="3" placeholder="1行に1つ">${h((S.userPhotos || []).join('\n'))}</textarea>
      <button class="btn sm" id="vSave" style="margin-top:8px">保存</button>
      <p class="small muted">探すときは「${h(SP.ytSearch.lv6)}」「${h(SP.ytSearch.lv5)}」。実写写真・動画はWikimedia Commonsから自動取得(通信が必要)。</p></div>
    <div class="card"><label class="check"><input type="checkbox" id="voice" ${S.voice ? 'checked' : ''}><span>ガイドの声(読み上げ)をオンにする</span></label></div>
    <div class="card"><h3>データ</h3><div class="row"><button class="btn sm" id="exp">JSONを書き出す</button><button class="btn sm danger" id="reset">全部消す</button></div>
      <p class="small muted">保存先はこの端末のブラウザ(localStorage)。</p></div>
    <p class="small muted center">むしとも v0.1 · 段階的曝露 + 嫌悪対策 + 触覚 + モデリング</p>`, () => {
    $('#nmSave').onclick = () => { S.name = $('#nm').value.trim(); save(); toast('変更した'); };
    $('#vSave').onclick = () => { S.videos.lv6 = $('#v6').value.split('\n').map(s => s.trim()).filter(Boolean); S.videos.lv5 = $('#v5').value.split('\n').map(s => s.trim()).filter(Boolean); S.userPhotos = $('#ph').value.split('\n').map(s => s.trim()).filter(Boolean); save(); toast('保存した'); };
    $('#voice').onchange = e => { S.voice = e.target.checked; save(); if (S.voice) speak('ガイドをオンにした'); };
    $('#exp').onclick = () => { const a = document.createElement('a'); a.href = 'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(S, null, 2)); a.download = 'mushitomo.json'; a.click(); };
    $('#reset').onclick = () => { if (confirm('本当に全部消す?')) { localStorage.removeItem(KEY()); S = load(); toast('消した'); go('home'); } };
  });
};

// ---------- boot ----------
if ('serviceWorker' in navigator && location.protocol === 'https:') { navigator.serviceWorker.register('sw.js').catch(() => { }); }
route();
