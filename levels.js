// レベル定義。研究知見: 段階的曝露 + 予期違反 + 知識 + 感情ラベリング + 触覚 + モデリング
export const LEVELS = [
  { id:1, stage:1, title:'たまご', short:'名前をつける', minutes:3,
    goal:'これから一緒に過ごす1匹のハエトリグモの「たまご」に名前をつけて、孵化させる。名前をつけると「虫」が「この子」になり、嫌悪が下がりやすい(克服した人の体験談で共通)。この子はLv11のARまで同じ個体として出てきて、最後に本物へバトンタッチする。',
    kind:'svgCute',
    fact:'ハエトリグモは巣を張らない。歩きまわって獲物を探す「徘徊性」のクモで、人を噛むことはまずない。',
    predict:['ぴょんと跳ねる','じっとしている','こっちを見る'], actual:1, actualText:'孵化したては、じっとしてこちらを見ている。' },
  { id:2, stage:1, title:'子グモ', short:'餌をあげる', minutes:3,
    goal:'少しリアルなイラスト。子グモに餌(コバエ)をドラッグして届ける。',
    kind:'svgReal',
    fact:'ハエトリグモはコバエ・蚊・ダニなど自分より小さい虫を食べる。家の中で「働いている」益虫。',
    predict:['餌に飛びつく','逃げる','無視する'], actual:0, actualText:'餌に気づくとゆっくり向きを変え、近づいて飛びつく。' },
  { id:3, stage:1, title:'3Dモデル', short:'どけてもらう', minutes:4,
    goal:'リアルな3Dの静止モデル(屋外の葉っぱ背景)。踏むと危ないので、スワイプでどいてもらう。',
    kind:'model3d',
    fact:'ハエトリグモの前の大きな目は「主眼」。人の顔を認識するほど視力が良く、こちらを見返すのはそのため。',
    predict:['スワイプすると飛びかかってくる','スワイプした方向とは逆に逃げる','その場で回る'], actual:1, actualText:'クモは指から離れる方向へ逃げる。人に向かってくることはない。' },
  { id:4, stage:1, title:'実写写真', short:'写真を探す', minutes:5,
    goal:'本物の写真。遠くから始めて、自分の指でピンチして寄る。図鑑に登録する。',
    kind:'photos',
    fact:'国内でよく見るのはアダンソンハエトリ(室内)、ネコハエトリ・シラヒゲハエトリ(屋外の塀や葉)。体長は5〜10mmほど。',
    predict:['写真でも気持ち悪さは変わらない','寄るほど気持ち悪くなる','寄ると意外と平気'], actual:-1, actualText:'答えは人それぞれ。SUDSの前後差が今日のデータ。' },
  { id:5, stage:1, title:'実写動画', short:'動く', minutes:5,
    goal:'歩く・跳ぶ動画。再生前に「どう動くか」を予想してから見る。最初は動きの予告つき。',
    kind:'videos',
    fact:'ジャンプは体長の数倍。跳ぶ前に必ず命綱の糸を出すので、落ちても自分で戻れる。',
    predict:['こちらに向かって跳ぶ','その場で向きを変える','画面外へ歩いて消える'], actual:-1, actualText:'動画ごとに違う。「予想→確認」を数回繰り返すと、動きが読めるようになる。' },
  { id:6, stage:1, title:'手の上', short:'モデリング', minutes:5,
    goal:'人の手の上にいる動画(一人称視点)。自分の手を画面の下に重ねて見る。',
    kind:'videos',
    fact:'手の上で落ち着いているクモは、体温を感じてじっとしていることが多い。急に走り出すときは糸を引いている。',
    predict:['手の上で走り回る','じっとしている','手から跳んで逃げる'], actual:-1, actualText:'多くの動画では、しばらくじっとしてから歩き出す。' },
  { id:7, stage:2, title:'AR 2.5m', short:'見つける', minutes:5,
    goal:'部屋の床、2.5m先に静止。カメラで見つけて名前を呼ぶ(タップ)。',
    kind:'ar', ar:{distance:2.5, behavior:'still', telegraph:true},
    fact:'東大の研究(2021)では、同じ虫でも室内背景で見ると屋外背景より嫌悪が強い。だから最初は仮想の草を敷く。',
    predict:['近づいてくる','動かない','消える'], actual:1, actualText:'このレベルでは動かない。' },
  { id:8, stage:2, title:'AR 1.5m', short:'餌で誘導', minutes:6,
    goal:'1.5m。餌(コバエ)を置いて誘導する。動きは自分が支配する。',
    kind:'ar', ar:{distance:1.5, behavior:'lure', telegraph:true},
    fact:'ハエトリグモは獲物を見つけると、まず向きを変えて「見る」。そのあとゆっくり距離を詰め、最後に跳ぶ。',
    predict:['餌に一直線','遠回りして餌へ','餌に気づかない'], actual:0, actualText:'餌の方へ歩く。ジャンプ先は点線で予告される。' },
  { id:9, stage:2, title:'AR テーブル', short:'道を作る', minutes:6,
    goal:'テーブルの上、画面の下側を歩く。指を画面に入れて道を作る。手元にファー付きの小物を置いて触りながら。',
    kind:'ar', ar:{distance:0.6, behavior:'walk', telegraph:true},
    fact:'触覚を足すとVR曝露の効果がほぼ倍になった(Hoffmanら 2003)。フワフワした物を触りながら見るのはそのため。',
    predict:['指に向かってくる','指を避けて歩く','止まる'], actual:1, actualText:'指(障害物)を避けて歩く。' },
  { id:10, stage:2, title:'AR 手の上', short:'30秒', minutes:5,
    goal:'自分の手の上に乗る。画面の下に手を出し、30秒乗せていられたらクリア。クモのフィギュアを手のひらに乗せて。',
    kind:'ar', ar:{distance:0.3, behavior:'hand', telegraph:false},
    fact:'手に乗ったクモが急に走り出すのは驚いたときだけ。ゆっくり動く手の上では、たいてい数十秒じっとしている。',
    predict:['すぐ走り出す','じっとしている','跳んで逃げる'], actual:1, actualText:'じっとしている。ときどき向きを変える。' },
  { id:11, stage:2, title:'AR 自由', short:'見ているだけ', minutes:6,
    goal:'複数匹、跳ぶ、予告なし、室内背景のまま。なにもしないで見ているだけ。捕食ログがたまる。',
    kind:'ar', ar:{distance:1.0, behavior:'free', telegraph:false, count:3},
    fact:'嫌悪は恐怖より消えにくい(Olatunjiら 2007)。「気持ち悪い」が残っても、行動できれば卒業。',
    predict:['どれかがこちらに跳ぶ','互いに近づく','コバエを捕まえる'], actual:2, actualText:'ときどきコバエを捕まえる。人に向かって跳ぶことはない。' },
];

export const STAGE3 = [
  { id:'s1', title:'ケース越しに見る', detail:'透明ケースの中のハエトリグモを30cmで観察。タイマー3分。名前クイズ: 何を食べる? どこにいた?', minutes:3 },
  { id:'s2', title:'ケースを開けて餌を入れる', detail:'コバエか小さな虫を入れる。世話タスクなので目的がある。体が大きくなったら記録。', minutes:3 },
  { id:'s3', title:'軍手で一瞬触れて離す', detail:'デコピンのように一瞬。触れたら手を引いてよい。3回繰り返す。', minutes:3 },
  { id:'s4', title:'軍手の手に乗るのを待つ', detail:'ケースの中に手を入れて待つ。乗ったら30秒。', minutes:5 },
  { id:'s5', title:'素手で一瞬→乗せる→5秒→逃がす', detail:'素手で一瞬触れる。次に乗せて5秒。最後に庭や窓の外へ逃がす(物語のエンディング)。', minutes:5 },
];

export const BAT_STEPS = [
  '0: 部屋にクモがいると聞いただけで無理',
  '1: ケース入りのクモと同じ部屋にいられる',
  '2: ケースに3mまで近づける',
  '3: ケースに1mまで近づける',
  '4: ケースに触れる',
  '5: ケースのふたを開けられる',
  '6: 軍手でクモに触れる',
  '7: 素手でクモに触れる／手に乗せられる',
];

// 既定のモデリング動画(YouTube)。lv6=手に乗せている / lv5=歩く・跳ぶ
export const DEFAULT_VIDEOS = {
  lv6: ['https://www.youtube.com/watch?v=YIn5jBGiCa8', 'https://www.youtube.com/watch?v=5tJhNCE2M0U', 'https://www.youtube.com/watch?v=MQBAIud6Twg', 'https://www.youtube.com/watch?v=z40UYe5oTsQ'],
  lv5: ['https://www.youtube.com/watch?v=RdmbhgKfqxA', 'https://www.youtube.com/watch?v=Do07I3HZKRs'],
};

export const AFFECT = ['ゾワゾワ','ドキドキ','ムズムズ','平気','ちょっと好奇心'];

// ---------- SVG art ----------
export function svgCute(name, hatched){
  const eyes = `
    <circle cx="86" cy="98" r="14" fill="#1b1b1b"/><circle cx="114" cy="98" r="14" fill="#1b1b1b"/>
    <circle cx="90" cy="93" r="5" fill="#fff"/><circle cx="118" cy="93" r="5" fill="#fff"/>
    <circle cx="68" cy="106" r="5" fill="#1b1b1b"/><circle cx="132" cy="106" r="5" fill="#1b1b1b"/>`;
  const legs = [[-1,0],[-1,1],[-1,2],[-1,3],[1,0],[1,1],[1,2],[1,3]].map(([s,i])=>{
    const y0 = 126 + i*7, x0 = 100 + s*30;
    const x1 = 100 + s*(58 + i*4), y1 = 100 + i*14;
    const x2 = 100 + s*(70 + i*3), y2 = 150 + i*10;
    return `<path d="M${x0} ${y0} Q${x1} ${y1} ${x2} ${y2}" stroke="#4a3b2e" stroke-width="7" stroke-linecap="round" fill="none"/>`;
  }).join('');
  const body = `
    <ellipse cx="100" cy="146" rx="34" ry="28" fill="#c58b5a"/>
    <ellipse cx="100" cy="146" rx="22" ry="16" fill="#e0a877"/>
    ${legs}
    <circle cx="100" cy="106" r="40" fill="#8b5e3c"/>
    <circle cx="100" cy="100" r="34" fill="#a97244"/>
    ${eyes}
    <path d="M92 118 q8 6 16 0" stroke="#3a2a1e" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  const egg = `
    <g class="egg">
      <ellipse cx="100" cy="120" rx="46" ry="58" fill="#f6f1e4" stroke="#d9cfb8" stroke-width="3"/>
      <ellipse cx="86" cy="98" rx="10" ry="16" fill="#fff" opacity=".7"/>
      <text x="100" y="205" text-anchor="middle" font-size="12" fill="#5f6b66">下で名前をつけると孵化する</text>
    </g>`;
  return `<svg viewBox="0 0 200 220" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${name||'たまご'}">
    <defs><linearGradient id="g1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#dff0e3"/><stop offset="1" stop-color="#b9dcc3"/></linearGradient></defs>
    <rect width="200" height="220" fill="url(#g1)"/>
    <ellipse cx="100" cy="190" rx="80" ry="14" fill="#8fbf9c" opacity=".6"/>
    ${hatched ? `<g class="spider-cute">${body}</g><text x="100" y="208" text-anchor="middle" font-size="12" font-weight="700" fill="#1f6f5f">${name||''}</text>` : egg}
  </svg>`;
}

export function svgReal(){
  // 少しリアル: 節のある脚、毛、体色。餌(コバエ)はapp側で重ねる
  const leg = (s,i)=>{
    const ay = 118 + i*8, ax = 100 + s*22;
    const kx = 100 + s*(46 + i*6), ky = ay - 22 + i*6;
    const ex = 100 + s*(58 + i*4), ey = ay + 20 + i*3;
    return `<path d="M${ax} ${ay} L${kx} ${ky} L${ex} ${ey}" stroke="#2e2118" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
            <path d="M${ax} ${ay} L${kx} ${ky} L${ex} ${ey}" stroke="#6b4b34" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" stroke-dasharray="3 5"/>`;
  };
  const legs = [0,1,2,3].map(i=>leg(-1,i)+leg(1,i)).join('');
  return `<svg viewBox="0 0 200 220" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="子グモ">
    <defs><linearGradient id="g2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d7e9d9"/><stop offset="1" stop-color="#9fc7a8"/></linearGradient>
    <radialGradient id="ab" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#7a5236"/><stop offset="1" stop-color="#2b1c12"/></radialGradient>
    <radialGradient id="ce" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#5a3d29"/><stop offset="1" stop-color="#1f140c"/></radialGradient></defs>
    <rect width="200" height="220" fill="url(#g2)"/>
    <path d="M0 200 Q60 150 120 200 T200 190 L200 220 L0 220Z" fill="#6f9f7a" opacity=".7"/>
    <g class="spider-real">
      ${legs}
      <ellipse cx="100" cy="150" rx="26" ry="30" fill="url(#ab)"/>
      <path d="M86 140 q14 -6 28 0" stroke="#c9b08c" stroke-width="2" fill="none" opacity=".8"/>
      <path d="M84 156 q16 -6 32 0" stroke="#c9b08c" stroke-width="2" fill="none" opacity=".6"/>
      <ellipse cx="100" cy="112" rx="30" ry="24" fill="url(#ce)"/>
      <circle cx="88" cy="102" r="9" fill="#0a0a0a"/><circle cx="112" cy="102" r="9" fill="#0a0a0a"/>
      <circle cx="91" cy="99" r="3" fill="#9fd" opacity=".9"/><circle cx="115" cy="99" r="3" fill="#9fd" opacity=".9"/>
      <circle cx="74" cy="108" r="4" fill="#0a0a0a"/><circle cx="126" cy="108" r="4" fill="#0a0a0a"/>
      <circle cx="80" cy="96" r="2.5" fill="#0a0a0a"/><circle cx="120" cy="96" r="2.5" fill="#0a0a0a"/>
      <path d="M92 124 l-4 10 M108 124 l4 10" stroke="#2e2118" stroke-width="3" stroke-linecap="round"/>
    </g>
  </svg>`;
}

export const FLY_SVG = `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><ellipse cx="20" cy="22" rx="6" ry="9" fill="#333"/><ellipse cx="13" cy="16" rx="7" ry="4" fill="#cfe8ff" opacity=".8" transform="rotate(-25 13 16)"/><ellipse cx="27" cy="16" rx="7" ry="4" fill="#cfe8ff" opacity=".8" transform="rotate(25 27 16)"/><circle cx="17" cy="14" r="2" fill="#b33"/><circle cx="23" cy="14" r="2" fill="#b33"/></svg>`;

export const GUIDE_LINES = {
  start:'今は見ているだけでOK。嫌さは0〜10で正直につけよう。',
  half:'半分過ぎた。呼吸はゆっくり。目をそらしても、また戻ればいい。',
  end:'おつかれ。予想は当たった? 答え合わせをしよう。',
  unlocked:'嫌さが下がった。次のレベルが開いた。',
  notyet:'まだ下がりきっていない。同じレベルをもう一回やるのが正解。',
};
