// ダンゴムシ(オカダンゴムシ)版の定義。クモ版と同じ構造で差し替えられる。
export const PILLBUG = {
  id: 'pillbug', label: 'ダンゴムシ', labelShort: 'ダンゴムシ', foodName: '落ち葉', foodVerb: '食べた', preyLabel: '落ち葉ログ',
  eggName: 'まるまり', defaultName: 'だんご',
  commons: { photos: ['Armadillidium vulgare filetype:bitmap', 'Armadillidium vulgare macro'], videos: ['Armadillidium vulgare filetype:video', 'pill bug filetype:video'] },
  ytSearch: { lv5: 'ダンゴムシ 歩く 丸まる', lv6: 'ダンゴムシ 手に乗せる' },
  safety: 'ダンゴムシ(オカダンゴムシ)は噛まない・刺さない・毒なし。触ると丸くなるだけ。植木鉢の下・石の下・落ち葉の下にいる。素手で触ったら手を洗う(それだけ)。',
  guideCare: '目的があると近づける。「落ち葉を入れる」「丸まるか見る」を口実にしよう。',
  levels: [
    { id:1, stage:1, title:'まるまり', short:'名前をつける', minutes:3,
      goal:'丸いデフォルメのダンゴムシ。まず名前をつけて、丸まった状態からひらいてもらう。',
      kind:'svgCute',
      fact:'ダンゴムシは昆虫ではなく甲殻類(エビ・カニの仲間)。だから脚が14本ある。噛まない・刺さない・毒なし。',
      predict:['転がってくる','ひらいて歩き出す','丸まったまま'], actual:1, actualText:'安全だと分かると、ゆっくりひらいて歩き出す。' },
    { id:2, stage:1, title:'子ダンゴ', short:'落ち葉をあげる', minutes:3,
      goal:'少しリアルなイラスト。落ち葉をドラッグして届ける。',
      kind:'svgReal',
      fact:'落ち葉や枯れ草を食べて土に戻す「分解者」。庭の掃除係で、生きた植物はほとんど食べない。',
      predict:['落ち葉に向かう','逃げる','無視する'], actual:0, actualText:'落ち葉に気づくとゆっくり向かい、端からかじる。' },
    { id:3, stage:1, title:'3Dモデル', short:'丸めてみる', minutes:4,
      goal:'リアルな3Dの静止モデル(落ち葉の上)。タップすると丸くなる。もう一回タップで戻る。スワイプでどいてもらう。',
      kind:'model3d',
      fact:'丸くなるのは身を守るため(オカダンゴムシだけ。ワラジムシは丸くなれない)。丸くなる=こちらを怖がっている、の合図。',
      predict:['タップすると飛びかかってくる','タップすると丸くなる','その場で回る'], actual:1, actualText:'触られると丸くなる。人に向かってくることはない。' },
    { id:4, stage:1, title:'実写写真', short:'写真を探す', minutes:5,
      goal:'本物の写真。遠くから始めて、自分の指でピンチして寄る。図鑑に登録する。',
      kind:'photos',
      fact:'日本でよく見るのはオカダンゴムシ(灰〜黒、体長10〜14mm)。明治以降に船で来た外来種で、今は全国の庭にいる。',
      predict:['写真でも気持ち悪さは変わらない','寄るほど気持ち悪くなる','寄ると意外と平気'], actual:-1, actualText:'答えは人それぞれ。SUDSの前後差が今日のデータ。' },
    { id:5, stage:1, title:'実写動画', short:'動く', minutes:5,
      goal:'歩く・丸まる動画。再生前に「どう動くか」を予想してから見る。',
      kind:'videos',
      fact:'歩く速さは秒に数cm。壁にぶつかると左右交互に曲がる「交替性転向反応」で、動きが読みやすい。',
      predict:['こちらに向かって走る','ゆっくり歩く','丸まる'], actual:-1, actualText:'動画ごとに違うが、ほとんどはゆっくり歩くか丸まるかのどちらか。' },
    { id:6, stage:1, title:'手の上', short:'モデリング', minutes:5,
      goal:'人の手の上にいる動画(一人称視点)。自分の手を画面の下に重ねて見る。',
      kind:'videos',
      fact:'手に乗せると最初は丸まり、数十秒でひらいて指の間をゆっくり歩く。落ちてもケガはしない。',
      predict:['手の上で走り回る','丸まってからひらく','手から落ちる'], actual:1, actualText:'多くの動画では、丸まる→ひらく→ゆっくり歩く。' },
    { id:7, stage:2, title:'AR 2.5m', short:'見つける', minutes:5,
      goal:'部屋の床、2.5m先に静止。カメラで見つけて名前を呼ぶ(タップ)。',
      kind:'ar', ar:{distance:2.5, behavior:'still', telegraph:true},
      fact:'東大の研究(2021)では、同じ虫でも室内背景で見ると屋外背景より嫌悪が強い。だから最初は仮想の落ち葉を敷く。',
      predict:['近づいてくる','動かない','消える'], actual:1, actualText:'このレベルでは動かない。' },
    { id:8, stage:2, title:'AR 1.5m', short:'落ち葉で誘導', minutes:6,
      goal:'1.5m。落ち葉を置いて誘導する。動きは自分が支配する。',
      kind:'ar', ar:{distance:1.5, behavior:'lure', telegraph:true},
      fact:'ダンゴムシは目がほとんど見えず、触角で匂いと湿り気をたどる。だから落ち葉へは「まっすぐ」ではなくジグザグに来る。',
      predict:['落ち葉に一直線','ジグザグに落ち葉へ','落ち葉に気づかない'], actual:1, actualText:'触角で探りながら、少し蛇行して落ち葉へ向かう。' },
    { id:9, stage:2, title:'AR テーブル', short:'道を作る', minutes:6,
      goal:'テーブルの上、画面の下側を歩く。指を画面に入れて道を作る。手元にファー付きの小物を置いて触りながら。',
      kind:'ar', ar:{distance:0.6, behavior:'walk', telegraph:true},
      fact:'触覚を足すとVR曝露の効果がほぼ倍になった(Hoffmanら 2003)。フワフワした物を触りながら見るのはそのため。',
      predict:['指に向かってくる','指を避けて歩く','止まって丸まる'], actual:1, actualText:'指(障害物)を避けて歩く。近すぎると丸まる。' },
    { id:10, stage:2, title:'AR 手の上', short:'30秒', minutes:5,
      goal:'自分の手の上に乗る。画面の下に手を出し、30秒乗せていられたらクリア。手のひらに小石か豆を乗せて重さを感じながら。',
      kind:'ar', ar:{distance:0.3, behavior:'hand', telegraph:false},
      fact:'手に乗せた直後は丸まる。じっとしていると数十秒でひらく。ひらいたら「安全だと判断した」ということ。',
      predict:['すぐ走り出す','丸まってからひらく','落ちる'], actual:1, actualText:'丸まってから、ゆっくりひらく。' },
    { id:11, stage:2, title:'AR 自由', short:'見ているだけ', minutes:6,
      goal:'複数匹、予告なし、室内背景のまま。なにもしないで見ているだけ。落ち葉ログがたまる。',
      kind:'ar', ar:{distance:1.0, behavior:'free', telegraph:false, count:3},
      fact:'嫌悪は恐怖より消えにくい(Olatunjiら 2007)。「気持ち悪い」が残っても、行動できれば卒業。',
      predict:['どれかがこちらに来る','互いにぶつかって丸まる','落ち葉を食べる'], actual:2, actualText:'落ち葉を見つけて食べる。人に向かって来ることはない。' },
  ],
  stage3: [
    { id:'s1', title:'ケース越しに見る', detail:'透明ケースの中のダンゴムシを30cmで観察。タイマー3分。名前クイズ: 何を食べる? 脚は何本?', minutes:3 },
    { id:'s2', title:'ケースを開けて落ち葉を入れる', detail:'落ち葉と湿らせたティッシュを入れる。世話タスクなので目的がある。', minutes:3 },
    { id:'s3', title:'軍手で一瞬触れて離す', detail:'デコピンのように一瞬。丸まったらそれが正常。3回繰り返す。', minutes:3 },
    { id:'s4', title:'軍手の手に乗るのを待つ', detail:'ケースの中に手を入れて待つ。乗ったら30秒。丸まってからひらくまで見る。', minutes:5 },
    { id:'s5', title:'素手で一瞬→乗せる→5秒→逃がす', detail:'素手で一瞬触れる。次に乗せて5秒。最後に庭や植木鉢の下へ逃がす(物語のエンディング)。手を洗う。', minutes:5 },
  ],
  bat: [
    '0: 部屋にダンゴムシがいると聞いただけで無理',
    '1: ケース入りのダンゴムシと同じ部屋にいられる',
    '2: ケースに3mまで近づける',
    '3: ケースに1mまで近づける',
    '4: ケースに触れる',
    '5: ケースのふたを開けられる',
    '6: 軍手でダンゴムシに触れる',
    '7: 素手でダンゴムシに触れる／手に乗せられる',
  ],
  svgCute(name, hatched) {
    const segs = [0,1,2,3,4,5,6].map(i => `<path d="M${52+i*13} 150 a${14} 40 0 0 1 0 -60" stroke="#6d6a75" stroke-width="2" fill="none" opacity=".7"/>`).join('');
    const legs = [0,1,2,3,4,5].map(i => `<path d="M${58+i*14} 152 q0 12 -6 18" stroke="#4d4a55" stroke-width="5" stroke-linecap="round" fill="none"/>`).join('');
    const body = `
      ${legs}
      <path d="M50 150 a50 60 0 0 1 100 0 z" fill="#8a8794"/>
      <path d="M50 150 a50 60 0 0 1 100 0" fill="none" stroke="#5f5c68" stroke-width="4"/>
      ${segs}
      <circle cx="140" cy="128" r="22" fill="#9a97a6"/>
      <circle cx="146" cy="122" r="7" fill="#1b1b1b"/><circle cx="148" cy="120" r="2.5" fill="#fff"/>
      <path d="M150 112 q14 -18 26 -16 M152 134 q14 6 22 18" stroke="#4d4a55" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M136 138 q6 4 12 0" stroke="#3a3842" stroke-width="3" fill="none" stroke-linecap="round"/>`;
    const ball = `
      <g class="egg">
        <circle cx="100" cy="120" r="48" fill="#8a8794" stroke="#5f5c68" stroke-width="3"/>
        ${[0,1,2,3,4].map(i=>`<path d="M${64+i*18} 76 q0 44 0 88" stroke="#6d6a75" stroke-width="2" fill="none" opacity=".7"/>`).join('')}
        <text x="100" y="205" text-anchor="middle" font-size="12" fill="#5f6b66">タップしてひらく</text>
      </g>`;
    return `<svg viewBox="0 0 200 220" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${name||'まるまり'}">
      <defs><linearGradient id="g1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e9e3d2"/><stop offset="1" stop-color="#c9b98f"/></linearGradient></defs>
      <rect width="200" height="220" fill="url(#g1)"/>
      <ellipse cx="100" cy="190" rx="80" ry="14" fill="#a89a6c" opacity=".6"/>
      ${hatched ? `<g class="spider-cute">${body}</g>` : ball}
    </svg>`;
  },
  svgReal() {
    const segs = [0,1,2,3,4,5,6].map(i => `<path d="M${58+i*12} 148 a${12} 34 0 0 1 0 -52" stroke="#2b2a30" stroke-width="2.5" fill="none" opacity=".8"/>`).join('');
    const legs = [0,1,2,3,4,5,6].map(i => `<path d="M${60+i*12} 150 l-2 10 l-6 8" stroke="#2b2a30" stroke-width="3" stroke-linecap="round" fill="none"/>`).join('');
    return `<svg viewBox="0 0 200 220" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="ダンゴムシ">
      <defs><linearGradient id="g2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e2dccb"/><stop offset="1" stop-color="#b9a97e"/></linearGradient>
      <radialGradient id="pb" cx=".45" cy=".3" r=".9"><stop offset="0" stop-color="#8b8a93"/><stop offset="1" stop-color="#3b3a42"/></radialGradient></defs>
      <rect width="200" height="220" fill="url(#g2)"/>
      <path d="M0 200 Q60 160 120 200 T200 190 L200 220 L0 220Z" fill="#9a8a5c" opacity=".7"/>
      <g class="spider-real">
        ${legs}
        <path d="M52 150 a48 54 0 0 1 96 0 z" fill="url(#pb)"/>
        ${segs}
        <path d="M52 150 a48 54 0 0 1 96 0" fill="none" stroke="#1f1e24" stroke-width="3"/>
        <circle cx="142" cy="128" r="4" fill="#0a0a0a"/>
        <path d="M150 116 q16 -18 30 -14 M152 136 q16 6 26 20" stroke="#2b2a30" stroke-width="3" fill="none" stroke-linecap="round"/>
      </g>
    </svg>`;
  },
  foodSvg: `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M6 30 Q10 8 34 6 Q32 30 6 30 Z" fill="#b8863b"/><path d="M8 29 Q20 20 32 8" stroke="#7a5a22" stroke-width="1.5" fill="none"/></svg>`,
};
