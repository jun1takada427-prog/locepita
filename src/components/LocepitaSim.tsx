"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useSpring, useTransform } from "framer-motion";

// ─────────────────────────────────────────────
// 型定義
// ─────────────────────────────────────────────
interface WardSim {
  area_name: string;
  id: string;
  accent: string;
  rent_tsubo: number;        // 事業用坪単価（円）
  deposit_months: number;
  subsidy_max: number;
  finance_rate: string;
  official_url: string;
  analysis: {
    needs: string;           // Excelの「隠れたニーズ/戦略」を反映
    avg_spend: string;
    strategy: string;
    hidden_gem: string;
  };
  todo: string[];
  alert: { headline: string; body: string } | null;
}

// ─────────────────────────────────────────────
// 全23区データ（Excel統合・完全版）
// ─────────────────────────────────────────────
const WARDS: WardSim[] = [
  {
    area_name: "千代田区", id: "chiyoda", accent: "#1e40af",
    rent_tsubo: 55000, deposit_months: 12, subsidy_max: 4000000, finance_rate: "0.4〜1.0%",
    official_url: "https://www.city.chiyoda.lg.jp/shigoto/index.html",
    analysis: {
      needs: "官公庁・大企業集積地でランチ需要が断トツ。高単価のビジネスランチや接待向け弁当の需要が特に強い。",
      avg_spend: "昼 1,500〜2,500円 / 夜 6,000〜10,000円",
      strategy: "ランチ特化で高回転を狙うか、夜の接待需要を取り込む2段階モデルが有効。TOKYO創業ステーション（丸の内）との連携で補助金申請の近道ができる。",
      hidden_gem: "九段下・神保町エリアは千代田区内でも賃料が比較的抑えられる。書店・出版関係者向けの落ち着いた業態が刺さります。"
    },
    todo: [
      "千代田区保健所（九段南）への開業前相談",
      "TOKYO創業ステーション（丸の内）への来館予約",
      "千代田区産業振興課で創業支援セミナーを確認",
      "丸の内エリアの昼間人口・オフィス動線を現地調査"
    ],
    alert: null
  },
  {
    area_name: "中央区", id: "chuo", accent: "#b45309",
    rent_tsubo: 60000, deposit_months: 11, subsidy_max: 4000000, finance_rate: "0.4〜1.0%",
    official_url: "https://www.city.chuo.lg.jp/a0027/shigoto/index.html",
    analysis: {
      needs: "「手土産・贈答品」。日本橋の老舗層に向けた、極小物件での物販併設店が刺さる。手土産文化が根強く、高品質な食の体験に惜しみなく投資する客層が多い。",
      avg_spend: "昼 1,200〜2,000円 / 夜 5,000〜8,000円",
      strategy: "築地場外市場との仕入れ連携が他区にはない強み。「素材の物語」を語れるコンセプトで、手土産需要と日常使いの両方を取り込む。",
      hidden_gem: "月島・佃エリアは中央区内でも家賃が抑えられる穴場。もんじゃ以外の業態は競合が少なく、地元客のリピート性が高い。"
    },
    todo: [
      "中央区保健所（月島）への営業許可事前相談",
      "中央区産業振興課でHP作成補助金の申請要件確認",
      "築地場外市場の卸業者リサーチ・仕入れ交渉",
      "日本橋商店街連盟の空き店舗情報を問い合わせ"
    ],
    alert: null
  },
  {
    area_name: "港区", id: "minato", accent: "#1e3a8a",
    rent_tsubo: 55000, deposit_months: 12, subsidy_max: 4600000, finance_rate: "0.4〜1.0%",
    official_url: "https://www.city.minato.tokyo.jp/sangyo-keizai/index.html",
    analysis: {
      needs: "「エグゼクティブ朝食」。赤坂・虎ノ門での早朝会議弁当や高級デリに強い需要。高単価を厭わない外国人駐在員・経営者層が多く、品質に見合う価格設定が通りやすい。",
      avg_spend: "昼 1,500〜2,500円 / 夜 8,000〜15,000円",
      strategy: "港区独自の賃料補助（月最大5万円×12ヶ月）を活用して初年度の固定費負担を大幅軽減。白金台・高輪エリアは六本木より家賃が低く、落ち着いた雰囲気を好む層に刺さる。",
      hidden_gem: "白金台・高輪エリアは大使館が多くインバウンド需要も取り込める。賃料は六本木の7〜8割水準で、質の高いコアな客層が育ちやすい。"
    },
    todo: [
      "港区保健所（三田）への事前相談予約",
      "港区産業振興センターで新規開業賃料補助の申請手順を確認",
      "港区特定創業支援セミナー（東京商工会議所港支部）に参加",
      "赤坂・虎ノ門エリアの早朝・深夜帯の需要を現地調査"
    ],
    alert: null
  },
  {
    area_name: "新宿区", id: "shinjuku", accent: "#d97706",
    rent_tsubo: 45000, deposit_months: 10, subsidy_max: 5000000, finance_rate: "実質0.2%",
    official_url: "https://www.city.shinjuku.lg.jp/jigyo/sangyo01_000110.html",
    analysis: {
      needs: "「高回転・特化型専門店」。補助金をフル活用し1年での短期投資回収を狙う。インバウンド需要も復活し、ヴィーガン対応や高単価な夜のバー・日本酒専門店への需要が急増。",
      avg_spend: "昼 1,000〜1,500円 / 夜 5,000〜7,000円",
      strategy: "商店街の空き店舗に出店すれば利子・保証料が全額補助される「新宿スキーム」を活用。補助金も23区トップクラスで、融資コストをほぼゼロにできる。",
      hidden_gem: "商店街の空き店舗に出店すれば、利子・保証料が全額補助される制度あり。融資コストをゼロにして高い家賃を相殺するのが新宿流の合理的な開業戦略。"
    },
    todo: [
      "新宿区産業振興課（BIZ新宿）で創業面談を予約（利子0.2%融資の説明を受ける）",
      "新宿区保健所（四谷）への事前相談",
      "商店街空き店舗活用支援資金の申請要件を確認",
      "新宿ビジネスプランコンテストへのエントリーを検討"
    ],
    alert: { headline: "23区最強の融資条件", body: "実質金利0.2%、商店街空き店舗なら利子・保証料を全額補助。まずBIZ新宿に相談するのが最速の近道です。" }
  },
  {
    area_name: "文京区", id: "bunkyo", accent: "#6d28d9",
    rent_tsubo: 22000, deposit_months: 8, subsidy_max: 4000000, finance_rate: "0.4〜1.0%",
    official_url: "https://www.city.bunkyo.lg.jp/sangyoushigoto/chuushou/sougyou/index.html",
    analysis: {
      needs: "「アカデミック・サロン」。大学・病院関係者向けの、静かで知的な喫茶・食事への需要が高い。読書やPC作業に適したカフェは慢性的に不足しているエリア。",
      avg_spend: "昼 900〜1,400円 / 夜 2,500〜4,000円",
      strategy: "「文の京」ブランドを活かした知的コンセプト店が刺さる。本郷・湯島エリアは東大関係者の往来が多く、ランチの安定収益が見込める。",
      hidden_gem: "小石川・白山エリアは文京区内でも賃料が低め。地元密着で丁寧な仕事をする業態には、長く通い続けるリピーターがつきやすいエリア。"
    },
    todo: [
      "文京区保健所（本駒込）への営業許可事前相談",
      "文京区産業振興課で創業相談・セミナー予約",
      "本郷・湯島エリアの大学関係者の動線を現地調査",
      "東京商工会議所文京支部で融資相談"
    ],
    alert: null
  },
  {
    area_name: "台東区", id: "taito", accent: "#b45309",
    rent_tsubo: 30000, deposit_months: 8, subsidy_max: 4000000, finance_rate: "0.4〜1.0%",
    official_url: "https://www.city.taito.lg.jp/bunka_kanko/jigyoukeiei/index.html",
    analysis: {
      needs: "「ネオ・観光食」。浅草・蔵前での、伝統とモダンを掛け合わせた食べ歩きに強い需要。外国人観光客向けの体験型・映え重視の和食コンセプトが特に人気。",
      avg_spend: "昼 1,000〜1,800円 / 夜 3,500〜6,000円",
      strategy: "浅草観光連盟との連携やインバウンド向け多言語対応補助を活用。観光需要に依存しすぎないよう、地元客向けの平日業態も組み合わせると安定する。",
      hidden_gem: "谷中・根津エリアは下町情緒が残り散策客に人気。賃料が低く個人店らしい雰囲気を演出しやすい。蔵前はクリエイター系住民が多い穴場。"
    },
    todo: [
      "台東区保健所（東上野）への事前相談",
      "台東区産業振興課で産業振興補助金の要件確認",
      "浅草観光連盟への加入と連携可能性を問い合わせ",
      "インバウンド客の動線・滞在時間を現地調査"
    ],
    alert: null
  },
  {
    area_name: "墨田区", id: "sumida", accent: "#0e7490",
    rent_tsubo: 25000, deposit_months: 7, subsidy_max: 4000000, finance_rate: "0.4〜1.0%",
    official_url: "https://www.city.sumida.lg.jp/sangyo_nogyo/sangyo_shinko/index.html",
    analysis: {
      needs: "「スカイツリー周辺・工芸併設」。すみだの職人技と食を繋ぐ、体験型の出店スタイルが注目されている。観光客に「東京の本物の手仕事」を見せながら食を提供する業態が刺さる。",
      avg_spend: "昼 900〜1,300円 / 夜 2,800〜4,500円",
      strategy: "「すみだブランド」認定を取得すると、区の公式PRサイトへの掲載や観光プログラムへの参加が可能。観光客と地元民の両方を集客できる。",
      hidden_gem: "向島・曳舟エリアは墨田区内でも特に賃料が低い穴場。下町情緒を好むコアなファンが多く、口コミで広がりやすい土壌がある。"
    },
    todo: [
      "墨田区保健所（向島）への事前相談",
      "墨田区産業振興センターで創業融資相談",
      "「すみだブランド」認定制度の申請要件を確認",
      "錦糸町・押上エリアの商店街に空き店舗情報を問い合わせ"
    ],
    alert: null
  },
  {
    area_name: "江東区", id: "koto", accent: "#0369a1",
    rent_tsubo: 28000, deposit_months: 7, subsidy_max: 4000000, finance_rate: "0.4〜1.0%",
    official_url: "https://www.city.koto.lg.jp/sangyoshigoto/chusho/index.html",
    analysis: {
      needs: "「ベイエリア・ファミリー」。豊洲・清澄白河での、家族で通える本格イタリアン等の需要が急増。湾岸新住民の「毎日使える上質な食事」への需要を掘り起こす。",
      avg_spend: "昼 900〜1,400円 / 夜 3,000〜5,000円",
      strategy: "豊洲市場の近接性を活かした鮮魚・海産物業態は差別化要因になりやすい。清澄白河はコーヒー・クラフト系の集積で感度高い客層が育っている。",
      hidden_gem: "門前仲町エリアは下町情緒が残り、地元住民の外食頻度が高い。深川めしなど地域食文化との連携も面白い。"
    },
    todo: [
      "江東区保健所（東陽）への事前相談（豊洲エリアは城東保健相談所を確認）",
      "江東ビジネス創造センターで創業相談",
      "豊洲市場の仲卸業者リサーチ・仕入れ可能性確認",
      "湾岸エリアのマンション住民動線を現地調査"
    ],
    alert: null
  },
  {
    area_name: "品川区", id: "shinagawa", accent: "#0f766e",
    rent_tsubo: 32000, deposit_months: 8, subsidy_max: 4000000, finance_rate: "0.4〜1.0%",
    official_url: "https://www.city.shinagawa.tokyo.jp/PC/sangyo/index.html",
    analysis: {
      needs: "「武蔵小山アーケード近接」。日本最長級の商店街の活気を取り込む対面販売が有効。品川駅周辺の再開発・オフィス集積でランチ需要も急増中。",
      avg_spend: "昼 1,000〜1,600円 / 夜 3,500〜5,500円",
      strategy: "品川駅周辺は高い家賃を高回転ランチで相殺する戦略が有効。商店街エリアは地元客との関係を作りながら安定収益を狙うモデルが向いている。",
      hidden_gem: "戸越銀座は全長約1.3kmの長い商店街で端部に近いほど空き物件が出やすく交渉余地が大きい。武蔵小山は再開発後の新住民が増加中。"
    },
    todo: [
      "品川区保健所（広町）への事前相談",
      "品川区産業振興センターで融資・補助金相談",
      "戸越銀座・武蔵小山商店街の空き店舗情報を確認",
      "品川駅直結エリアの昼間人口・オフィス数をリサーチ"
    ],
    alert: null
  },
  {
    area_name: "目黒区", id: "meguro", accent: "#7c3aed",
    rent_tsubo: 35000, deposit_months: 9, subsidy_max: 8440000, finance_rate: "0.4〜1.0%",
    official_url: "https://www.city.meguro.tokyo.jp/gyosei/keizai/index.html",
    analysis: {
      needs: "「感度高めのペアリング」。自由が丘・中目黒でのストーリー性ある専門店が刺さる。InstagramやTikTokでの話題性が集客に直結するエリア。",
      avg_spend: "昼 1,200〜2,000円 / 夜 4,500〜7,000円",
      strategy: "39歳以下または女性の開業なら「若手・女性リーダー応援プログラム」（最大844万円）が使える。ブランディングに投資して話題性を作るのが目黒流の開業戦略。",
      hidden_gem: "自由が丘は東急グループのチャレンジショップ「創の実」で試験出店できる。本格開業前の市場テストとして活用すれば、リスクを最小化できる。"
    },
    todo: [
      "目黒区保健所（中目黒）への事前相談",
      "目黒区産業経済・雇用課で若手・女性リーダー応援プログラムの要件確認",
      "自由が丘チャレンジショップ「創の実」への問い合わせ",
      "中目黒・自由が丘のトレンド店舗リサーチ（SNS動向確認）"
    ],
    alert: null
  },
  {
    area_name: "大田区", id: "ota", accent: "#1d4ed8",
    rent_tsubo: 20000, deposit_months: 7, subsidy_max: 4000000, finance_rate: "0.4〜1.0%",
    official_url: "https://www.city.ota.tokyo.jp/sangyo/index.html",
    analysis: {
      needs: "「蒲田ハイブリッド」。町工場の職人と羽田関係者が入り交じるガッツリ飯の需要が根強い。家賃が低く、補助金活用で初期費用を大幅に抑えられる穴場エリア。",
      avg_spend: "昼 800〜1,200円 / 夜 2,500〜4,000円",
      strategy: "大田区産業振興協会（PiO PARK）での専門家派遣・融資サポートが充実。蒲田の商店街に出店してから羽田インバウンド需要の取り込みを狙うステップアップ戦略が有効。",
      hidden_gem: "蒲田西口・東口で客層が異なる（西口=呑み需要、東口=買い物客）。事前の現地調査で業態との相性を確認するのが重要。"
    },
    todo: [
      "大田区保健所（蒲田）への事前相談（羽田エリアは出張所を確認）",
      "大田区産業振興協会（PiO PARK）での創業相談予約",
      "ゴミ分別ルール（紙パック・食品トレイの個別分別）を事前確認",
      "蒲田商店街の空き店舗情報を商店街事務局に問い合わせ"
    ],
    alert: { headline: "開業前にゴミ分別ルールを確認しよう", body: "大田区は分別が23区最厳格クラス。食品トレイ・紙パック・廃食油の個別ルールを把握しておくと、開業後のオペレーションがスムーズになります。" }
  },
  {
    area_name: "世田谷区", id: "setagaya", accent: "#16a34a",
    rent_tsubo: 25000, deposit_months: 8, subsidy_max: 4000000, finance_rate: "0.4〜1.0%",
    official_url: "https://www.city.setagaya.lg.jp/shigotosangyou/kigyousougyoushien/11916.html",
    analysis: {
      needs: "団地・UR層の「高品質日常食」。経堂・千歳船橋などのURエリアは実はテイクアウトの宝庫。住民の8割近くが「近所に惣菜を気軽に買える店が足りない」と感じており、リモートワーカー向けのランチ需要も圧倒的に不足している。",
      avg_spend: "昼 1,200〜1,600円 / 夜 3,500〜4,800円",
      strategy: "商店街のメイン通りから一本入った「路地裏1F」が狙い目。賃料を2〜3割抑えつつ、テイクアウト窓口の設置とInstagram集客を組み合わせるのが世田谷での勝ち筋。",
      hidden_gem: "下北沢・三軒茶屋は競合過多ですが、経堂・千歳烏山は優良商圏のわりに空き物件が残っている穴場。補助金でテイクアウト設備に投資すれば、固定費を抑えたまま利益率を高めることができる。"
    },
    todo: [
      "世田谷保健所の管轄支所を確認（5支所：世田谷・北沢・玉川・砧・烏山）",
      "世田谷区産業振興公社で創業面談を予約",
      "世田谷信用金庫または昭和信用金庫で開業融資の事前相談",
      "経堂・千歳烏山エリアの路地裏物件を現地調査"
    ],
    alert: { headline: "申請前に保健所の管轄支所を確認しよう", body: "世田谷区は保健所が5支所に分かれています。店舗の住所エリアを確認してから申請窓口へ行くと、スムーズに手続きが進みます。" }
  },
  {
    area_name: "渋谷区", id: "shibuya", accent: "#7c3aed",
    rent_tsubo: 50000, deposit_months: 11, subsidy_max: 4000000, finance_rate: "0.4〜1.0%",
    official_url: "https://www.city.shibuya.tokyo.jp/sangyo/index.html",
    analysis: {
      needs: "「次世代体験型」。代々木上原周辺の、SNS映えを超えた本物志向のコミュニティ形成に需要がある。スタートアップ関連のネットワークが豊富でフードテック・サブスク型業態にも向いたエリア。",
      avg_spend: "昼 1,200〜2,000円 / 夜 5,000〜9,000円",
      strategy: "「渋谷スタートアップデッキ」との連携支援が充実。渋谷駅周辺ではなく、恵比寿・代官山・代々木上原に1〜2駅離れた立地を狙うのがコスパの良い戦略。",
      hidden_gem: "恵比寿・代官山エリアは渋谷より家賃が低いケースがあり、落ち着いた高単価業態に最適。渋谷駅周辺ではなく近隣駅狙いが鉄則。"
    },
    todo: [
      "渋谷区保健所（広尾）への事前相談",
      "渋谷区産業観光・文化振興課で特定創業支援セミナーに参加",
      "渋谷スタートアップデッキへの問い合わせ・ネットワーク活用",
      "恵比寿・代官山エリアの空き物件情報を不動産会社に照会"
    ],
    alert: null
  },
  {
    area_name: "中野区", id: "nakano", accent: "#0f766e",
    rent_tsubo: 28000, deposit_months: 7, subsidy_max: 4000000, finance_rate: "0.4〜1.0%",
    official_url: "https://www.city.nakano.tokyo.jp/sangyo/index.html",
    analysis: {
      needs: "「サブカル・深夜メシ」。中野ブロードウェイ周辺の、24時間稼働する専門料理への需要がある。再開発エリアの新住民と長年の地元住民が混在し、多様な業態が試せるエリア。",
      avg_spend: "昼 900〜1,300円 / 夜 2,800〜4,000円",
      strategy: "中野駅前は賃料が上昇中。1〜2駅ずらした野方・鷺ノ宮エリアが賃料コスパ最高水準。地域密着で固定客を着実に積み上げるモデルが安定収益につながる。",
      hidden_gem: "中野区は2026年以降の再開発でテナント需要が急増見込み。今のうちに低賃料で入居し、開発後の集客増を享受できる「先乗り戦略」が使える。"
    },
    todo: [
      "中野区保健所（中野）への事前相談",
      "中野区産業振興センターで創業融資相談",
      "野方・鷺ノ宮エリアの空き店舗を現地調査",
      "中野再開発計画の進捗を区のホームページで確認"
    ],
    alert: null
  },
  {
    area_name: "杉並区", id: "suginami", accent: "#065f46",
    rent_tsubo: 20000, deposit_months: 7, subsidy_max: 4500000, finance_rate: "0.4〜1.0%",
    official_url: "https://www.city.suginami.tokyo.jp/sangyo/index.html",
    analysis: {
      needs: "「偏愛・趣味人の店」。西荻窪周辺のコアなファンを掴むサブスク型経営が有望。チェーン店では満たせない「手作り感・個性・物語」のある飲食業態への需要が高い。",
      avg_spend: "昼 900〜1,300円 / 夜 2,500〜4,000円",
      strategy: "杉並区独自の家賃補助（最大30万円）とWeb制作補助（最大20万円）の組み合わせが初期費用削減に有効。商店街の「顔」になるような個性的なコンセプトが長続きの秘訣。",
      hidden_gem: "西荻窪は杉並区内でも特に家賃が低く、ミュージシャン・作家・アーティストなどクリエイター系住民が多い。SNSで自然に広がる傾向がある。"
    },
    todo: [
      "杉並区保健所（荻窪）への事前相談（高円寺〜西荻窪まで同一窓口）",
      "杉並区産業振興センターで創業スタートアップ助成事業の申請方法を確認",
      "高円寺・阿佐ケ谷・荻窪の商店街空き店舗情報を照会",
      "杉並区ビジネスチャレンジ補助金の申請スケジュールを確認"
    ],
    alert: null
  },
  {
    area_name: "豊島区", id: "toshima", accent: "#9333ea",
    rent_tsubo: 35000, deposit_months: 8, subsidy_max: 4000000, finance_rate: "0.4〜1.0%",
    official_url: "https://www.city.toshima.lg.jp/sangyo/index.html",
    analysis: {
      needs: "「池袋ハブ戦略」。多国籍な客層をターゲットにした、本格エスニック専門店への需要がある。アニメ・マンガ・コスプレ文化が集まり、テーマ型・体験型の飲食業態への需要も全国有数。",
      avg_spend: "昼 900〜1,400円 / 夜 3,000〜5,000円",
      strategy: "コンセプトカフェ・キャラクター系業態は豊島区が最も刺さるエリア。女性・若者向け業態なら「若手・女性リーダー応援プログラム」との組み合わせで最大844万円の支援が受けられる。",
      hidden_gem: "サンシャインシティ動線上の東池袋・南池袋エリアは観光客が多いが賃料が池袋駅前より低い。立地の良さと家賃のバランスが取れた出店候補エリア。"
    },
    todo: [
      "豊島区保健所（雑司が谷）への事前相談",
      "豊島区産業振興課で特定創業支援等事業の証明書取得手順を確認",
      "池袋商店街・サンシャイン周辺の空き店舗情報を照会",
      "アニメ・マンガ系イベントの集客動線を現地調査"
    ],
    alert: null
  },
  {
    area_name: "北区", id: "kita", accent: "#b45309",
    rent_tsubo: 18000, deposit_months: 6, subsidy_max: 4200000, finance_rate: "0.4〜1.0%",
    official_url: "https://www.city.kita.tokyo.jp/kankyo-sangyo/index.html",
    analysis: {
      needs: "「赤羽・昼飲み進化系」。既存の飲み屋街と差別化する、清潔感あるバルへの需要がある。昔ながらの商店街文化が根強く、コスパに優れた店は強力なリピーターを獲得できる。",
      avg_spend: "昼 800〜1,200円 / 夜 2,500〜3,800円",
      strategy: "北区は不動産業団体との包括連携で物件マッチングを公的にサポート。物件探しから補助金申請まで行政と連携しながら進められるため、初めての開業でも安心のエリア。",
      hidden_gem: "赤羽の商店街は空き物件のオーナーが高齢化しており、条件交渉がしやすい物件が増えている。23区でも珍しい「物件マッチング公的支援」を最大限活用しよう。"
    },
    todo: [
      "北区保健所（王子）への事前相談",
      "北区産業振興公社で空き店舗活用支援事業の申請要件を確認",
      "全日本不動産協会城北支部または東京都宅建業協会第九ブロックに物件情報を問い合わせ",
      "赤羽・十条・王子商店街の空き店舗現地調査"
    ],
    alert: { headline: "物件探しから公的サポートを活用できます", body: "北区は不動産業団体との包括連携協定があり、商店街の空き店舗物件を行政と連携しながら紹介してもらえます。まず区の産業振興窓口に相談してみましょう。" }
  },
  {
    area_name: "荒川区", id: "arakawa", accent: "#0369a1",
    rent_tsubo: 16000, deposit_months: 6, subsidy_max: 4000000, finance_rate: "0.4〜1.0%",
    official_url: "https://www.city.arakawa.tokyo.jp/a048/sangyo/index.html",
    analysis: {
      needs: "「下町リノベカフェ」。三ノ輪・町屋周辺の古い長屋を活かした低コスト出店が有望。長年の地元住民が多く、毎日通える「飽きない日常食」への需要が根強い。",
      avg_spend: "昼 800〜1,100円 / 夜 2,500〜3,600円",
      strategy: "区独自の賃料補助制度を活用して初期コストを下げつつ、日暮里繊維街など地域資源と連携したユニークな業態で差別化するのが荒川区での勝ち筋。",
      hidden_gem: "日暮里は外国人観光客の動線上にあり、インバウンド向け業態の伸びしろが意外に大きい穴場エリア。観光×地元の2軸で集客できる立地。"
    },
    todo: [
      "荒川区保健所（荒川）への事前相談",
      "荒川区産業振興センター（日暮里）で賃料補助制度の要件確認",
      "日暮里繊維街との連携可能性をリサーチ",
      "あらかわ産業フェアへの出展で認知度を高める計画を検討"
    ],
    alert: null
  },
  {
    area_name: "板橋区", id: "itabashi", accent: "#1d4ed8",
    rent_tsubo: 17000, deposit_months: 6, subsidy_max: 4000000, finance_rate: "0.4〜1.0%",
    official_url: "https://www.city.itabashi.tokyo.jp/sangyo/index.html",
    analysis: {
      needs: "「ハッピーロード生活圏」。圧倒的な通行量を背景にした、圧倒的なコスパ店への需要がある。大山・ときわ台エリアは子育て世代が多く、テイクアウト惣菜や家族向けダイニングへの需要も高い。",
      avg_spend: "昼 800〜1,100円 / 夜 2,500〜3,800円",
      strategy: "ハッピーロード大山商店街は集客力が高く空き物件も出やすい。商店街との関係を作りながら入居すると、イベント連携で集客の底上げが自然に狙える。",
      hidden_gem: "板橋区のビジネスグランプリに入賞すると、東京都の創業助成事業への申請要件を満たせる。コンテスト参加が補助金への近道になる珍しい区。"
    },
    todo: [
      "板橋区保健所（板橋）への事前相談",
      "板橋区産業振興公社で創業融資相談",
      "板橋ビジネスグランプリへのエントリーを検討（創業助成金申請要件を満たせる）",
      "ハッピーロード大山商店街の空き店舗情報を商店街事務局に問い合わせ"
    ],
    alert: null
  },
  {
    area_name: "練馬区", id: "nerima", accent: "#15803d",
    rent_tsubo: 18000, deposit_months: 6, subsidy_max: 4000000, finance_rate: "0.4〜1.0%",
    official_url: "https://www.city.nerima.tokyo.jp/sangyo/index.html",
    analysis: {
      needs: "「農家直送・地産地消」。練馬野菜を主役にした、産地直結型のレストランへの需要が高まっている。23区内で人口最多、大泉学園・石神井公園エリアは地域密着型飲食店の安定収益が見込める。",
      avg_spend: "昼 800〜1,200円 / 夜 2,500〜3,800円",
      strategy: "練馬区の豊富な農地を活用した「農と食の連携」業態は他区にはない差別化要素。区の地産地消助成プログラムとセットで活用すれば、コスト削減とブランディングを同時に実現できる。",
      hidden_gem: "光が丘エリアは大規模団地群があり安定した地元需要がある。競合が少なく「近所の頼れる一軒」として定着しやすいエリア。"
    },
    todo: [
      "練馬区保健所（豊玉）への事前相談（光が丘・石神井エリアは各保健相談所を確認）",
      "練馬区産業振興センターで農と食の連携助成プログラムの要件確認",
      "練馬区の農家・農産物直売所とのネットワーク構築",
      "ゴミ分別ルール（古布・廃食油の個別分別）を事前確認"
    ],
    alert: { headline: "分別ルールと保健所の両方を事前チェック", body: "練馬区はゴミ分別が最厳格クラス、かつ保健所が3か所に分かれています。開業前にルールを把握しておくと、オペレーション設計がスムーズになります。" }
  },
  {
    area_name: "足立区", id: "adachi", accent: "#0c4a6e",
    rent_tsubo: 15000, deposit_months: 5, subsidy_max: 4000000, finance_rate: "0.4〜1.0%",
    official_url: "https://www.city.adachi.tokyo.jp/sangyo/index.html",
    analysis: {
      needs: "「北千住・学生ターゲット」。5大学が集まるエリアでの、ボリューム満点ランチへの需要が急増。手頃な価格で満足度の高い食事を求めるニーズが強い。",
      avg_spend: "昼 700〜1,000円 / 夜 2,000〜3,500円",
      strategy: "23区最安クラスの家賃で広い物件を確保し、フードデリバリーとの併用で売上の柱を2本立てにする戦略が最適。固定費を抑えた分を商品品質に全振りできる。",
      hidden_gem: "ゴミ分別がシンプルで開業後のオペレーション管理が楽。仕込みや接客に集中できる環境を整えたい料理人に特に向いているエリア。"
    },
    todo: [
      "足立区保健所（中央本町）への事前相談（竹の塚エリアは竹の塚保健センターを確認）",
      "足立区産業振興センター（北千住）で創業融資・補助金相談",
      "「あだちビジネスチャンス補助金」の申請要件を確認",
      "北千住エリアの学生動線・大学キャンパス位置を現地調査"
    ],
    alert: null
  },
  {
    area_name: "葛飾区", id: "katsushika", accent: "#9a3412",
    rent_tsubo: 15000, deposit_months: 5, subsidy_max: 4000000, finance_rate: "0.4〜1.0%",
    official_url: "https://www.city.katsushika.lg.jp/business/index.html",
    analysis: {
      needs: "「柴又・昭和レトロ」。観光客と地元民が交差する、懐かしくも新しい甘味・郷土食への需要がある。製造業従事者向けのランチ需要も底堅い。",
      avg_spend: "昼 700〜1,000円 / 夜 2,000〜3,500円",
      strategy: "葛飾区は23区内でも家賃が最安クラス。観光地・柴又の近くで「東京の昔ながらの味」を打ち出すと、観光客と地元客の両方を取り込みやすい。",
      hidden_gem: "葛飾区はものづくり産業の集積地で、工場従事者向けのボリューム感ある定食業態が根強い需要を持っている。工場密集エリアの近くは競合が少ない穴場。"
    },
    todo: [
      "葛飾区保健所（立石）への事前相談（金町エリアは金町保健センターを確認）",
      "葛飾商工会議所での創業相談・融資サポートを活用",
      "柴又観光協会との連携可能性を問い合わせ",
      "亀有・柴又エリアの観光客動線を現地調査"
    ],
    alert: null
  },
  {
    area_name: "江戸川区", id: "edogawa", accent: "#0f4c81",
    rent_tsubo: 16000, deposit_months: 5, subsidy_max: 4000000, finance_rate: "0.4〜1.0%",
    official_url: "https://www.city.edogawa.tokyo.jp/business/index.html",
    analysis: {
      needs: "「葛西・多国籍カレー」。インド人コミュニティがあるエリアでの本格料理への需要がある。インド・中国・韓国系居住者が多く、エスニック系飲食業態での差別化出店に有利。",
      avg_spend: "昼 700〜1,000円 / 夜 2,000〜3,500円",
      strategy: "23区内でも家賃水準が低く広い物件を確保しやすい。多文化コミュニティを活かしたエスニック・フュージョン業態や本格派料理の専門店が差別化の軸になる。",
      hidden_gem: "事業系一般廃棄物の清掃工場への自己搬入が可能な区。少量なら自分で運ぶことで廃棄物処理コストを削減できる開業者に優しい制度が整っている。"
    },
    todo: [
      "江戸川保健所（中央）への事前相談（小岩・葛西・篠崎エリアは各健康サポートセンターを確認）",
      "東京商工会議所江戸川支部で創業融資・補助金相談",
      "エスニック系食材の仕入れルート（近隣のインド・アジア食材店）をリサーチ",
      "葛西・小岩エリアの多文化コミュニティとのネットワーク構築方法を確認"
    ],
    alert: null
  }
];

// デフォルト区（エラー時のフォールバック）
const DEFAULT_WARD = WARDS.find(w => w.id === "setagaya")!;

// ─────────────────────────────────────────────
// useSpring カウントアップ
// ─────────────────────────────────────────────
function SpringNum({ value, size = 28, color = "#1e293b" }: { value: number; size?: number; color?: string }) {
  const spring = useSpring(value, { stiffness: 55, damping: 18, mass: 0.9 });
  const display = useTransform(spring, v => Math.round(v).toLocaleString());
  useEffect(() => { spring.set(value); }, [value, spring]);
  return (
    <motion.span style={{ fontSize: size, fontWeight: 900, color,
      fontFamily: "'Noto Serif JP', serif", letterSpacing: "-0.02em",
      display: "inline-block" }}>
      {display}
    </motion.span>
  );
}

// ─────────────────────────────────────────────
// Grain
// ─────────────────────────────────────────────
const Grain = ({ opacity = 0.05 }: { opacity?: number }) => (
  <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%",
    opacity, pointerEvents: "none" }} xmlns="http://www.w3.org/2000/svg">
    <filter id="grn">
      <feTurbulence type="fractalNoise" baseFrequency="0.82" numOctaves="4" stitchTiles="stitch" />
      <feColorMatrix type="saturate" values="0" />
    </filter>
    <rect width="100%" height="100%" filter="url(#grn)" />
  </svg>
);

// ─────────────────────────────────────────────
// 定数
// ─────────────────────────────────────────────
const INK = "#1e293b";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400;700;900&family=Zen+Kaku+Gothic+New:wght@400;500;700&display=swap');
  * { box-sizing: border-box; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 2px; }
  .sidebar-scroll::-webkit-scrollbar { width: 3px; }
  .sidebar-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 2px; }
  input[type=range] { -webkit-appearance: none; height: 4px; background: #e2e8f0; border-radius: 2px; outline: none; cursor: pointer; width: 100%; }
  input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 18px; height: 18px; border-radius: 50%; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.2); }
  .ward-btn { transition: all 0.12s ease; }
  .ward-btn:hover { transform: translateX(2px); }
  .todo-li:hover { background: rgba(255,255,255,0.07) !important; }
  .ext-link:hover { opacity: 0.85; }
  @media (max-width: 900px) {
    .main-grid { grid-template-columns: 1fr !important; }
    .result-nums { grid-template-columns: 1fr !important; }
    .bottom-grid { grid-template-columns: 1fr !important; }
    .header-row { flex-direction: column !important; align-items: flex-start !important; gap: 10px !important; }
    .pad { padding: 16px !important; }
    .sim-card { padding: 16px !important; }
  }
  @media (max-width: 768px) {
    .ward-scroll { max-height: 180px !important; }
    .sticky-bar { display: flex !important; }
  }
  @media (min-width: 769px) {
    .sticky-bar { display: none !important; }
  }
`;

// ─────────────────────────────────────────────
// メインアプリ
// ─────────────────────────────────────────────
export default function LocepitaSim() {
  const [ward, setWard] = useState<WardSim>(DEFAULT_WARD);
  const [tsubo, setTsubo] = useState(12);
  const [stickyOn, setStickyOn] = useState(false);
  const [search, setSearch] = useState("");
  const resultRef = useRef<HTMLDivElement>(null);

  // URLパラメータ → 初期区設定（エラーハンドリング付き）
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const p = new URLSearchParams(window.location.search);
      const a = p.get("area");
      if (a) {
        const found = WARDS.find(w =>
          w.area_name === a ||
          w.id === a ||
          w.area_name.includes(a)
        );
        // 見つからない場合はデフォルト（世田谷区）のまま
        if (found) setWard(found);
      }
    } catch {
      // パラメータ解析失敗時もデフォルトで継続
      setWard(DEFAULT_WARD);
    }
  }, []);

  // スクロール監視 → Sticky表示
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => setStickyOn(!e.isIntersecting),
      { threshold: 0.15 }
    );
    if (resultRef.current) obs.observe(resultRef.current);
    return () => obs.disconnect();
  }, []);

  // アクセントカラーをスライダーのthumbに反映
  useEffect(() => {
    document.documentElement.style.setProperty("--accent", ward.accent);
  }, [ward.accent]);

  // 計算
  const monthlyRent   = ward.rent_tsubo * tsubo;
  const deposit       = monthlyRent * ward.deposit_months;
  const agencyFee     = monthlyRent * 1.1;
  const frontRent     = monthlyRent;
  const initialCost   = deposit + agencyFee + frontRent;
  const subsidyAmount = Math.min(ward.subsidy_max, Math.floor(initialCost * 0.66));
  const realCost      = initialCost - subsidyAmount;
  const coverPct      = Math.round((subsidyAmount / initialCost) * 100);

  // 検索フィルタ
  const filteredWards = search
    ? WARDS.filter(w => w.area_name.includes(search) || w.analysis.needs.includes(search))
    : WARDS;

  return (
    <>
      <style>{CSS + `
        input[type=range]::-webkit-slider-thumb { background: ${ward.accent}; }
        input[type=range] { accent-color: ${ward.accent}; }
      `}</style>
      <div style={{ minHeight: "100vh", background: "#f8fafc",
        fontFamily: "'Zen Kaku Gothic New', 'Noto Sans JP', sans-serif",
        paddingBottom: 80 }}>

        {/* ─── ヘッダー ─── */}
        <header style={{ background: INK, position: "relative", overflow: "hidden",
          borderBottom: `3px solid ${ward.accent}`,
          transition: "border-color 0.5s ease" }}>
          <Grain opacity={0.05} />
          <div className="header-row" style={{ position: "relative", zIndex: 1,
            maxWidth: 1240, margin: "0 auto", padding: "24px 32px",
            display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 4 }}>
                <h1 style={{ fontSize: 22, fontWeight: 900, color: "white", margin: 0,
                  fontFamily: "'Noto Serif JP', serif", letterSpacing: "-0.02em" }}>ロケピタ</h1>
                <motion.span animate={{ color: ward.accent }} transition={{ duration: 0.5 }}
                  style={{ fontSize: 20, display: "inline-block" }}>.</motion.span>
                <span style={{ fontSize: 9, color: "rgba(255,255,255,0.25)",
                  marginLeft: 6, letterSpacing: "0.15em", fontFamily: "monospace" }}>SIM v5</span>
              </div>
              <AnimatePresence mode="wait">
                <motion.p key={ward.area_name}
                  initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }} transition={{ duration: 0.22 }}
                  style={{ margin: 0, fontSize: 11, color: "rgba(255,255,255,0.45)", fontWeight: 500 }}>
                  {ward.area_name}での成功確率を最大化するシミュレーター
                </motion.p>
              </AnimatePresence>
            </div>
            <motion.a className="ext-link"
              animate={{ borderColor: ward.accent + "55" }} transition={{ duration: 0.5 }}
              href={ward.official_url} target="_blank" rel="noopener noreferrer"
              style={{ padding: "8px 16px", borderRadius: 99,
                background: "rgba(255,255,255,0.06)",
                border: `1.5px solid ${ward.accent}44`,
                color: "rgba(255,255,255,0.7)", textDecoration: "none",
                fontSize: 10, fontWeight: 600, letterSpacing: "0.04em",
                transition: "all 0.2s", whiteSpace: "nowrap" }}>
              区の公式支援制度を見る ↗
            </motion.a>
          </div>
        </header>

        {/* ─── メインコンテンツ ─── */}
        <div className="pad" style={{ maxWidth: 1240, margin: "0 auto", padding: "20px 32px" }}>
          <div className="main-grid" style={{ display: "grid",
            gridTemplateColumns: "200px 1fr", gap: 20, alignItems: "flex-start" }}>

            {/* ─── 左サイドバー ─── */}
            <aside style={{ display: "flex", flexDirection: "column", gap: 10 }}>

              {/* 区選択（検索＋スクロール） */}
              <div style={{ background: "white", border: "1px solid #f1f5f9",
                borderRadius: 14, overflow: "hidden",
                boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                {/* 検索バー */}
                <div style={{ padding: "10px 10px 6px",
                  borderBottom: "1px solid #f8fafc" }}>
                  <input
                    type="text"
                    placeholder="区を検索…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{ width: "100%", padding: "6px 10px",
                      border: "1px solid #e2e8f0", borderRadius: 7,
                      fontSize: 11, color: INK, outline: "none",
                      background: "#f8fafc", fontFamily: "inherit" }}
                  />
                </div>
                {/* スクロール可能な区リスト */}
                <div className="ward-scroll sidebar-scroll"
                  style={{ maxHeight: 420, overflowY: "auto", padding: "6px 8px 8px" }}>
                  {filteredWards.length === 0 ? (
                    <p style={{ fontSize: 11, color: "#94a3b8", textAlign: "center",
                      padding: "12px 0", margin: 0 }}>該当なし</p>
                  ) : filteredWards.map(w => (
                    <button key={w.id} className="ward-btn"
                      onClick={() => { setWard(w); setSearch(""); }} style={{
                        width: "100%", padding: "8px 10px", borderRadius: 7,
                        textAlign: "left", cursor: "pointer", border: "none",
                        background: ward.id === w.id ? INK : "transparent",
                        color: ward.id === w.id ? w.accent : "#475569",
                        fontSize: 11, fontWeight: ward.id === w.id ? 700 : 400,
                        display: "flex", alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 1, position: "relative", overflow: "hidden"
                      }}>
                      {ward.id === w.id && <Grain opacity={0.06} />}
                      <span style={{ position: "relative", zIndex: 1 }}>{w.area_name}</span>
                      <span style={{ position: "relative", zIndex: 1, fontSize: 8,
                        color: ward.id === w.id ? `${w.accent}88` : "#cbd5e1",
                        fontFamily: "monospace" }}>
                        {(w.rent_tsubo / 10000).toFixed(1)}万
                      </span>
                    </button>
                  ))}
                </div>
                <div style={{ padding: "6px 10px 8px", borderTop: "1px solid #f8fafc" }}>
                  <p style={{ margin: 0, fontSize: 9, color: "#94a3b8", textAlign: "center" }}>
                    {WARDS.length}区収録 · 坪単価は事業用目安
                  </p>
                </div>
              </div>

              {/* スライダー */}
              <div style={{ background: "white", border: "1px solid #f1f5f9",
                borderRadius: 14, padding: "14px",
                boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                <p style={{ margin: "0 0 10px", fontSize: 9, fontWeight: 700,
                  color: "#94a3b8", letterSpacing: "0.12em" }}>希望の広さ</p>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <input type="range" min="5" max="40" step="1" value={tsubo}
                    onChange={e => setTsubo(Number(e.target.value))} />
                  <div style={{ flexShrink: 0, textAlign: "right" }}>
                    <span style={{ fontSize: 20, fontWeight: 900, color: INK,
                      fontFamily: "'Noto Serif JP', serif" }}>{tsubo}</span>
                    <span style={{ fontSize: 9, color: "#64748b", marginLeft: 2 }}>坪</span>
                  </div>
                </div>
                <p style={{ margin: 0, fontSize: 10, color: "#475569", lineHeight: 1.5 }}>
                  {tsubo <= 8 && "テイクアウト・スタンド形式"}
                  {tsubo >= 9  && tsubo <= 14 && "カフェ・小料理屋（個人店の標準）"}
                  {tsubo >= 15 && tsubo <= 22 && "落ち着いたダイニング・ビストロ"}
                  {tsubo >= 23 && tsubo <= 30 && "ファミリーレストラン・宴会対応"}
                  {tsubo >= 31 && "大型店舗・複合業態"}
                </p>
              </div>

              {/* 融資条件 */}
              <div style={{ background: INK, borderRadius: 12, padding: "12px 14px",
                position: "relative", overflow: "hidden" }}>
                <Grain opacity={0.05} />
                <div style={{ position: "relative", zIndex: 1 }}>
                  <p style={{ margin: "0 0 3px", fontSize: 9, fontWeight: 700,
                    color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em" }}>融資条件</p>
                  <motion.p animate={{ color: ward.accent }} transition={{ duration: 0.5 }}
                    style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 900,
                      fontFamily: "'Noto Serif JP', serif" }}>
                    {ward.finance_rate}
                  </motion.p>
                  <p style={{ margin: 0, fontSize: 9, color: "rgba(255,255,255,0.35)",
                    lineHeight: 1.5 }}>
                    特定創業支援証明書取得で金利優遇。登録免許税も半減。
                  </p>
                </div>
              </div>
            </aside>

            {/* ─── 右：結果エリア ─── */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

              {/* シム結果カード */}
              <div ref={resultRef} className="sim-card"
                style={{ background: "white", borderRadius: 16, padding: "20px",
                  borderTop: `3px solid ${ward.accent}`,
                  border: `1px solid ${ward.accent}22`,
                  transition: "border-color 0.5s ease",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.04)" }}>

                <div style={{ paddingBottom: 12, marginBottom: 14,
                  borderBottom: "1px solid #f8fafc" }}>
                  <AnimatePresence mode="wait">
                    <motion.h2 key={`${ward.id}-${tsubo}`}
                      initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
                      style={{ margin: "0 0 2px", fontSize: 11, fontWeight: 800,
                        color: "#94a3b8", letterSpacing: "0.08em" }}>
                      {ward.area_name} · {tsubo}坪 の挑戦コスト
                    </motion.h2>
                  </AnimatePresence>
                  <p style={{ margin: 0, fontSize: 9, color: "#cbd5e1" }}>
                    保証金{ward.deposit_months}ヶ月 + 仲介料1.1ヶ月 + 前家賃1ヶ月で試算
                  </p>
                </div>

                {/* 数値2カラム */}
                <div className="result-nums"
                  style={{ display: "grid", gridTemplateColumns: "1fr 1fr",
                    gap: 12, marginBottom: 14 }}>
                  <div style={{ padding: "14px", background: "#f8fafc",
                    borderRadius: 12, border: "1px solid #e2e8f0" }}>
                    <p style={{ margin: "0 0 4px", fontSize: 9, fontWeight: 700,
                      color: "#94a3b8", letterSpacing: "0.08em" }}>物件取得費（参考）</p>
                    <div>
                      <span style={{ fontSize: 10, color: "#94a3b8" }}>¥ </span>
                      <SpringNum value={initialCost} size={22} color={INK} />
                    </div>
                    <p style={{ margin: "3px 0 0", fontSize: 9, color: "#94a3b8" }}>
                      月額 {monthlyRent.toLocaleString()}円
                    </p>
                  </div>
                  <div style={{ padding: "14px", borderRadius: 12,
                    background: `${ward.accent}10`,
                    border: `1.5px solid ${ward.accent}30`,
                    transition: "all 0.5s ease",
                    position: "relative", overflow: "hidden" }}>
                    <Grain opacity={0.04} />
                    <div style={{ position: "relative", zIndex: 1 }}>
                      <p style={{ margin: "0 0 4px", fontSize: 9, fontWeight: 700,
                        color: ward.accent, letterSpacing: "0.08em",
                        transition: "color 0.5s" }}>補助金活用後の実質負担</p>
                      <div>
                        <span style={{ fontSize: 10, color: ward.accent }}>¥ </span>
                        <SpringNum value={realCost} size={22} color={ward.accent} />
                      </div>
                      <motion.p key={coverPct}
                        initial={{ scale: 1.1 }} animate={{ scale: 1 }}
                        style={{ margin: "4px 0 0", fontSize: 11, fontWeight: 800,
                          color: ward.accent, display: "inline-block",
                          transition: "color 0.5s" }}>
                        約 {coverPct}% をカバー
                      </motion.p>
                    </div>
                  </div>
                </div>

                {/* バー */}
                <div style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between",
                    fontSize: 10, marginBottom: 5 }}>
                    <span style={{ fontWeight: 700, color: "#64748b" }}>補助金による負担軽減</span>
                    <motion.span key={coverPct}
                      initial={{ scale: 1.2 }} animate={{ scale: 1 }}
                      style={{ fontWeight: 900, color: ward.accent,
                        display: "inline-block", transition: "color 0.5s" }}>
                      {coverPct}% ダウン
                    </motion.span>
                  </div>
                  <div style={{ height: 6, background: "#f1f5f9",
                    borderRadius: 3, overflow: "hidden" }}>
                    <motion.div key={`bar-${ward.id}-${tsubo}`}
                      initial={{ width: 0 }} animate={{ width: `${coverPct}%` }}
                      transition={{ duration: 0.9, ease: "circOut" }}
                      style={{ height: "100%", borderRadius: 3,
                        background: ward.accent, transition: "background 0.5s" }} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between",
                    marginTop: 4, fontSize: 9, color: "#94a3b8" }}>
                    <span>補助金：¥{subsidyAmount.toLocaleString()}</span>
                    <span>月額：¥{monthlyRent.toLocaleString()}</span>
                  </div>
                </div>

                {/* 内訳 */}
                <div style={{ background: "#f8fafc", borderRadius: 10, padding: "10px 12px" }}>
                  <p style={{ margin: "0 0 6px", fontSize: 9, fontWeight: 700,
                    color: "#94a3b8", letterSpacing: "0.1em" }}>費用内訳</p>
                  {([
                    ["月額家賃（想定）", monthlyRent],
                    [`保証金（${ward.deposit_months}ヶ月）`, deposit],
                    ["仲介手数料（1.1ヶ月）", agencyFee],
                    ["前家賃（1ヶ月）", frontRent],
                  ] as [string, number][]).map(([label, val]) => (
                    <div key={label} style={{ display: "flex",
                      justifyContent: "space-between",
                      padding: "4px 0", borderBottom: "1px solid #f1f5f9",
                      fontSize: 11 }}>
                      <span style={{ color: "#64748b" }}>{label}</span>
                      <span style={{ fontWeight: 700, color: INK }}>¥{val.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* アラート */}
              <AnimatePresence>
                {ward.alert && (
                  <motion.div initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    style={{ background: "#f0fdf4", border: "1px solid #bbf7d0",
                      borderRadius: 12, padding: "12px 14px",
                      display: "flex", gap: 10 }}>
                    <span style={{ fontSize: 12, color: "#16a34a", flexShrink: 0 }}>✓</span>
                    <div>
                      <p style={{ margin: "0 0 3px", fontSize: 12, fontWeight: 700,
                        color: "#166534" }}>{ward.alert.headline}</p>
                      <p style={{ margin: 0, fontSize: 11, color: "#14532d",
                        lineHeight: 1.7 }}>{ward.alert.body}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 下部グリッド */}
              <AnimatePresence mode="wait">
                <motion.div key={ward.id}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }} transition={{ duration: 0.26 }}>
                  <div className="bottom-grid"
                    style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>

                    {/* エリア戦略 */}
                    <div style={{ background: "white", border: "1px solid #f1f5f9",
                      borderRadius: 14, padding: "16px",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.03)" }}>
                      <p style={{ margin: "0 0 8px", fontSize: 9, fontWeight: 700,
                        color: "#94a3b8", letterSpacing: "0.08em" }}>エリアの需要と戦略</p>
                      <p style={{ margin: "0 0 10px", fontSize: 12, color: "#334155",
                        lineHeight: 1.8 }}>{ward.analysis.needs}</p>
                      <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: 10 }}>
                        <p style={{ margin: "0 0 3px", fontSize: 9, fontWeight: 700,
                          color: "#94a3b8" }}>想定客単価</p>
                        <p style={{ margin: "0 0 8px", fontSize: 13, fontWeight: 800,
                          color: ward.accent, fontFamily: "'Noto Serif JP', serif",
                          transition: "color 0.5s" }}>
                          {ward.analysis.avg_spend}
                        </p>
                        <p style={{ margin: 0, fontSize: 11, color: "#475569",
                          lineHeight: 1.7 }}>{ward.analysis.strategy}</p>
                      </div>
                    </div>

                    {/* ToDoリスト */}
                    <div style={{ background: INK, borderRadius: 14, padding: "16px",
                      position: "relative", overflow: "hidden",
                      borderTop: `3px solid ${ward.accent}`,
                      transition: "border-color 0.5s" }}>
                      <Grain opacity={0.05} />
                      <div style={{ position: "relative", zIndex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center",
                          gap: 8, marginBottom: 12 }}>
                          <p style={{ margin: 0, fontSize: 9, fontWeight: 700,
                            color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em" }}>
                            明日すべきこと
                          </p>
                          <motion.span animate={{ background: ward.accent }}
                            transition={{ duration: 0.5 }}
                            style={{ fontSize: 9, fontWeight: 700, color: "white",
                              padding: "2px 7px", borderRadius: 10 }}>
                            {ward.todo.length}件
                          </motion.span>
                        </div>
                        <ul style={{ padding: 0, margin: "0 0 12px",
                          listStyle: "none", display: "flex",
                          flexDirection: "column", gap: 4 }}>
                          {ward.todo.map((item, i) => (
                            <motion.li key={item}
                              initial={{ opacity: 0, x: 8 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.05 }}
                              className="todo-li"
                              style={{ fontSize: 11, color: "rgba(255,255,255,0.6)",
                                lineHeight: 1.6, display: "flex",
                                alignItems: "flex-start", gap: 8,
                                padding: "4px 6px", borderRadius: 6 }}>
                              <motion.span animate={{ color: ward.accent }}
                                transition={{ duration: 0.5 }}
                                style={{ flexShrink: 0, fontSize: 9,
                                  marginTop: 3, fontWeight: 700 }}>
                                {String(i + 1).padStart(2, "0")}
                              </motion.span>
                              <span>{item}</span>
                            </motion.li>
                          ))}
                        </ul>
                        <a href={ward.official_url} target="_blank"
                          rel="noopener noreferrer" className="ext-link"
                          style={{ display: "block", padding: "8px 12px",
                            borderRadius: 8, textAlign: "center",
                            textDecoration: "none", fontSize: 11,
                            fontWeight: 700, color: "white",
                            background: `${ward.accent}33`,
                            border: `1px solid ${ward.accent}55`,
                            transition: "all 0.2s" }}>
                          公式の助成金詳細を確認する ↗
                        </a>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* ─── モバイル Sticky Footer ─── */}
        <div className="sticky-bar"
          style={{ background: INK, borderTop: `3px solid ${ward.accent}`,
            padding: "10px 20px", alignItems: "center",
            justifyContent: "space-between", gap: 12,
            boxShadow: "0 -4px 20px rgba(0,0,0,0.2)",
            position: "fixed", bottom: 0, left: 0, right: 0,
            zIndex: 200, display: stickyOn ? "flex" : "none",
            transition: "border-color 0.5s" }}>
          <Grain opacity={0.04} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <p style={{ margin: "0 0 1px", fontSize: 9,
              color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em" }}>
              実質負担
            </p>
            <div style={{ display: "flex", alignItems: "baseline", gap: 2 }}>
              <span style={{ fontSize: 10, color: ward.accent }}>¥</span>
              <SpringNum value={realCost} size={19} color={ward.accent} />
            </div>
          </div>
          <div style={{ position: "relative", zIndex: 1, textAlign: "right" }}>
            <p style={{ margin: "0 0 3px", fontSize: 9,
              color: "rgba(255,255,255,0.35)" }}>{coverPct}% カバー</p>
            <div style={{ height: 3, width: 64,
              background: "rgba(255,255,255,0.1)",
              borderRadius: 2, overflow: "hidden" }}>
              <motion.div animate={{ width: `${coverPct}%` }}
                transition={{ duration: 0.6, ease: "circOut" }}
                style={{ height: "100%", background: ward.accent,
                  transition: "background 0.5s", borderRadius: 2 }} />
            </div>
          </div>
        </div>

        {/* フッター */}
        <footer style={{ background: INK, marginTop: 40, padding: "14px 32px",
          position: "relative", overflow: "hidden",
          borderTop: `2px solid ${ward.accent}22`,
          transition: "border-color 0.5s" }}>
          <Grain opacity={0.04} />
          <div style={{ position: "relative", zIndex: 1, maxWidth: 1240, margin: "0 auto",
            display: "flex", justifyContent: "space-between",
            alignItems: "center", flexWrap: "wrap", gap: 10 }}>
            <p style={{ margin: 0, fontSize: 10, color: "rgba(255,255,255,0.22)",
              lineHeight: 1.9, maxWidth: 560 }}>
              本シミュレーションは参考値です。実際の坪単価・保証金・補助金額は物件・条件によって異なります。開業前に必ず各区の公式サイト・産業振興窓口でご確認ください。
            </p>
            <span style={{ fontSize: 9, color: "rgba(255,255,255,0.2)",
              fontFamily: "monospace", letterSpacing: "0.15em", flexShrink: 0 }}>
              LOCEPITA SIM v5.0
            </span>
          </div>
        </footer>
      </div>
    </>
  );
}
