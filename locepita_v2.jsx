"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─────────────────────────────────────────────
// 全23区データ
// ─────────────────────────────────────────────
const WARD_DATA = [
  {
    area_name: "千代田区",
    tags: ["都心", "オフィス街", "インバウンド", "高単価"],
    rent_level: 5, customer_flow: 5, subsidy_strength: 3, garbage_ease: 3,
    subsidy: {
      name: "東京都創業助成事業 + 専門家派遣",
      max_amount: 4000000,
      description: "東京都「創業助成事業」（最大400万円、助成率2/3）が主軸。区独自では専門家無料派遣・セミナー支援が充実。対象：人件費・賃借料・広告費・設備費など。",
      merit: "官公庁・大企業集積地で法人設立コスト優遇あり。TOKYO創業ステーションへのアクセス良好。ランチ需要・インバウンド需要ともに旺盛",
      demerit: "物件賃料が23区内最高水準。飲食向け特化補助金は少なく競合多数"
    },
    finance: {
      rate_display: "0.4〜1.0%",
      interest_subsidy_rate: "本人負担 約0.4〜1.0%",
      detail: "特定創業支援等事業の証明書取得で都制度融資「創業」金利0.4%優遇。登録免許税半減（法人設立時）あり"
    },
    unique_policy: "起業家支援事業による専門家無料派遣。大手町・丸の内エリアはインバウンド需要が旺盛。TOKYO創業ステーション（丸の内）との連携が強い。",
    garbage_rule: "事業系一般廃棄物は原則、許可業者と個別契約必須。少量排出事業者は有料ごみ処理券（コンビニ等で購入）で区収集委託可。廃食油は専門業者委託必須。",
    health_center: { name: "千代田区保健所", branches: ["千代田保健所（九段南）"], note: "区全域を1保健所で管轄。飲食店営業許可申請の窓口は千代田保健所のみ" },
    alert: null
  },
  {
    area_name: "中央区",
    tags: ["都心", "食文化", "インバウンド", "市場近接"],
    rent_level: 5, customer_flow: 4, subsidy_strength: 3, garbage_ease: 3,
    subsidy: {
      name: "東京都創業助成事業 + HP作成補助",
      max_amount: 4000000,
      description: "東京都「創業助成事業」（最大400万円）に加え、区独自でホームページ作成補助（上限10万円程度）あり。",
      merit: "築地・日本橋エリアは食文化の集積地。食品卸・市場との連携しやすい立地メリットあり",
      demerit: "銀座・日本橋は賃料が最高水準。飲食特化の区独自大型補助金は少ない"
    },
    finance: {
      rate_display: "0.4〜1.0%",
      interest_subsidy_rate: "本人負担 約0.4〜1.0%",
      detail: "中央区特定創業支援等事業を活用することで登録免許税半減・融資金利優遇を取得可能"
    },
    unique_policy: "築地場外市場周辺は食品関連創業の誘致に注力。日本橋商店街連盟との連携支援プログラムあり。東京都「商店街空き店舗活用事業」と連動。",
    garbage_rule: "事業系ごみは許可業者との個別契約が原則。少量排出の場合は有料ごみ処理券を活用し区収集委託可。銀座・築地エリアは深夜のごみ出し禁止（近隣対応が厳格）。",
    health_center: { name: "中央区保健所", branches: ["中央区保健所（月島）"], note: "区全域を1保健所が管轄。食品営業許可申請窓口は保健所食品衛生係" },
    alert: null
  },
  {
    area_name: "港区",
    tags: ["高単価", "インバウンド", "賃料補助あり", "高所得層"],
    rent_level: 5, customer_flow: 4, subsidy_strength: 4, garbage_ease: 3,
    subsidy: {
      name: "港区新規開業賃料補助 + 東京都創業助成事業",
      max_amount: 4600000,
      description: "東京都「創業助成事業」（最大400万円）に加え、港区独自の「新規開業賃料補助」（月額賃料の1/3・上限月5万円×最大12ヶ月＝最大60万円）が特徴的。",
      merit: "区独自の賃料補助が最大12ヶ月利用可能。高所得者層が多いエリアで客単価設定しやすい",
      demerit: "賃料水準が非常に高く、補助額を差し引いても自己負担が大きい"
    },
    finance: {
      rate_display: "0.4〜1.0%",
      interest_subsidy_rate: "本人負担 約0.4〜1.0%",
      detail: "港区産業振興センター・東京商工会議所港支部が実施する特定創業支援等事業修了で各種優遇措置取得可能"
    },
    unique_policy: "港区産業振興センターによる無料創業相談・専門家派遣。「みなとモデル」商店街活性化事業あり。麻布・六本木・赤坂エリアへの飲食出店に有利な立地環境。",
    garbage_rule: "事業系ごみは許可業者との契約が基本。六本木・麻布地区は深夜・早朝のごみ出し規制が厳しい（地域ルールを事前確認必須）。",
    health_center: { name: "港区保健所", branches: ["港区保健所（三田）"], note: "区全域を1保健所が管轄。麻布・芝・高輪の各地区担当窓口あり" },
    alert: null
  },
  {
    area_name: "新宿区",
    tags: ["超低金利", "空き店舗補助", "商店街", "繁華街"],
    rent_level: 4, customer_flow: 5, subsidy_strength: 5, garbage_ease: 3,
    subsidy: {
      name: "新宿区経営力強化支援事業補助金 + 東京都創業助成事業",
      max_amount: 5000000,
      description: "新宿区独自「経営力強化支援事業補助金」（最大500万円、2025年度）に加え東京都「創業助成事業」（最大400万円）を活用可能。",
      merit: "区独自の最大500万円補助金は23区内でも高水準。商店街空き店舗向け融資は利子・保証料全額補助という破格の条件",
      demerit: "競争率高く採択審査が厳しい。歌舞伎町周辺は深夜営業規制に注意が必要"
    },
    finance: {
      rate_display: "実質0.2%",
      interest_subsidy_rate: "本人負担 実質0.2%（区が1.6%補給）",
      detail: "新宿区の創業資金融資は本人負担金利が実質0.2%と23区最安水準。商店街空き店舗活用支援資金は利子・保証料全額補助。特定創業支援証明書で登録免許税が15万→7.5万に半減"
    },
    unique_policy: "「商店街空き店舗活用支援資金」で商店街の空き店舗に出店する創業者は利子・保証料が全額補助。新宿ビジネスプランコンテスト（入賞で創業助成事業の申請要件を満たせる）。BIZ新宿での無料創業面談。",
    garbage_rule: "事業系ごみは許可業者との契約が原則。歌舞伎町・新宿三丁目は飲食店密集地のため収集時間の規制が厳格（近隣住民との調整が重要）。",
    health_center: { name: "新宿区保健所", branches: ["新宿区保健所（四谷）"], note: "区全域を1保健所で管轄。食品営業許可は保健所衛生課食品衛生係が担当" },
    alert: { type: "success", message: "💴 23区最強クラス！実質金利0.2%。商店街空き店舗なら利子・保証料を全額補助。融資コスト圧縮を最優先するなら新宿区は有力候補。" }
  },
  {
    area_name: "文京区",
    tags: ["文教", "学生需要", "ランチ需要", "比較的安価"],
    rent_level: 3, customer_flow: 3, subsidy_strength: 3, garbage_ease: 4,
    subsidy: {
      name: "東京都創業助成事業 + 創業相談支援",
      max_amount: 4000000,
      description: "東京都「創業助成事業」（最大400万円）が主軸。文京区独自の創業相談・セミナー支援あり。",
      merit: "大学・文教施設が多くランチ・学生向け業態に向く。賃料が山手線内側比較で比較的抑えられる",
      demerit: "夜の繁華街が少なくディナー業態の集客には工夫が必要"
    },
    finance: {
      rate_display: "0.4〜1.0%",
      interest_subsidy_rate: "本人負担 約0.4〜1.0%",
      detail: "文京区特定創業支援等事業修了で各種融資優遇・登録免許税軽減の恩恵あり"
    },
    unique_policy: "「文の京」ブランドを活用した商店街活性化事業あり。本郷・湯島・小石川エリアの商店街活性化事業への参加で補助金申請要件を満たしやすい。プラ一括回収への対応が先進的。",
    garbage_rule: "事業系ごみは許可業者との個別契約が基本。少量排出事業者は有料ごみ処理券で区収集委託可。プラ一括回収への対応が先進的。",
    health_center: { name: "文京区保健所", branches: ["文京区保健所（本駒込）"], note: "区全域を1保健所で管轄" },
    alert: null
  },
  {
    area_name: "台東区",
    tags: ["インバウンド", "浅草", "観光", "下町"],
    rent_level: 3, customer_flow: 4, subsidy_strength: 3, garbage_ease: 3,
    subsidy: {
      name: "台東区産業振興事業補助金 + 東京都創業助成事業",
      max_amount: 4000000,
      description: "東京都「創業助成事業」（最大400万円）に加え、台東区独自の産業振興補助金あり。観光業種に特化した支援プログラムが充実。",
      merit: "浅草・上野エリアはインバウンド需要が旺盛。観光業・飲食業に手厚い支援施策",
      demerit: "観光客依存のリスクあり。繁忙期・閑散期の差が大きい"
    },
    finance: {
      rate_display: "0.4〜1.0%",
      interest_subsidy_rate: "本人負担 約0.4〜1.0%",
      detail: "台東区産業振興公社・東京商工会議所台東支部との連携による創業融資サポート"
    },
    unique_policy: "浅草観光連盟・台東区商店街連合会との連携による「下町飲食店開業支援」プログラム。インバウンド向けの多言語メニュー作成補助あり。浅草エリアの空き店舗活用に特化した支援あり。",
    garbage_rule: "事業系ごみは許可業者との契約が基本。浅草エリアは観光地のため深夜・早朝のごみ出し規制が比較的厳格。少量排出事業者は有料ごみ処理券活用可。",
    health_center: { name: "台東区保健所", branches: ["台東区保健所（東上野）"], note: "区全域を1保健所で管轄。浅草・上野エリアの飲食店許可申請を集中管理" },
    alert: null
  },
  {
    area_name: "墨田区",
    tags: ["スカイツリー", "インバウンド", "ブランド支援", "錦糸町"],
    rent_level: 2, customer_flow: 3, subsidy_strength: 3, garbage_ease: 4,
    subsidy: {
      name: "墨田区創業支援補助金 + 東京都創業助成事業",
      max_amount: 4000000,
      description: "東京都「創業助成事業」（最大400万円）に加え、墨田区独自の展示会出展補助金あり。「すみだブランド」認定制度で地域密着型飲食店のPR支援も可能。",
      merit: "スカイツリー周辺の観光需要。区独自の「すみだブランド」認定でPR効果大",
      demerit: "都心と比べ交通アクセス面でやや不利。繁華街エリアは限定的"
    },
    finance: {
      rate_display: "0.4〜1.0%",
      interest_subsidy_rate: "本人負担 約0.4〜1.0%",
      detail: "墨田区産業振興センター（錦糸町）での創業相談・融資サポートあり"
    },
    unique_policy: "「すみだビジネスサポートセンター」による無料創業相談。錦糸町・押上エリアの商店街空き店舗活用支援。東京都「商店街空き店舗活用事業」との連動。",
    garbage_rule: "事業系ごみは許可業者との契約が基本。少量排出事業者は有料ごみ処理券で区収集委託可。錦糸町繁華街周辺は深夜のごみ排出規制あり。",
    health_center: { name: "墨田区保健所", branches: ["墨田区保健所（向島）"], note: "区全域を1保健所で管轄" },
    alert: null
  },
  {
    area_name: "江東区",
    tags: ["湾岸", "再開発", "豊洲", "オフィス需要"],
    rent_level: 2, customer_flow: 3, subsidy_strength: 3, garbage_ease: 3,
    subsidy: {
      name: "江東区産業振興補助金 + 東京都創業助成事業",
      max_amount: 4000000,
      description: "東京都「創業助成事業」（最大400万円）が主軸。江東区独自の産業振興・商店街支援補助金あり。",
      merit: "湾岸エリアの開発に伴い新規テナント需要が急増。豊洲・木場エリアでの飲食需要が高い",
      demerit: "エリアにより人口密度の差が大きく、立地選定が重要"
    },
    finance: {
      rate_display: "0.4〜1.0%",
      interest_subsidy_rate: "本人負担 約0.4〜1.0%",
      detail: "江東区産業振興公社による創業支援。東京商工会議所城東支部との連携サポートあり"
    },
    unique_policy: "豊洲・有明の湾岸開発エリアへの出店支援。「江東ビジネス創造センター」での創業相談。深川・門前仲町の商店街活性化事業との連動。",
    garbage_rule: "事業系ごみは許可業者との契約が基本。豊洲市場周辺は廃棄物処理の規制が特に厳格（市場関連廃棄物の分別徹底が求められる）。",
    health_center: { name: "江東区保健所", branches: ["江東区保健所（東陽）", "城東保健相談所"], note: "深川・城東の2エリアに分かれて食品営業許可等を担当" },
    alert: null
  },
  {
    area_name: "品川区",
    tags: ["再開発", "ランチ需要", "商店街", "戸越銀座"],
    rent_level: 3, customer_flow: 4, subsidy_strength: 3, garbage_ease: 4,
    subsidy: {
      name: "品川区創業支援事業補助金 + 東京都創業助成事業",
      max_amount: 4000000,
      description: "東京都「創業助成事業」（最大400万円）が主軸。品川区独自の創業相談・専門家派遣支援あり。",
      merit: "品川駅周辺の再開発・オフィス集積でランチ需要が非常に高い。武蔵小山・戸越銀座商店街での飲食出店支援が充実",
      demerit: "品川駅周辺の賃料は高騰傾向。商店街エリアと品川駅周辺で客層が大きく異なる"
    },
    finance: {
      rate_display: "0.4〜1.0%",
      interest_subsidy_rate: "本人負担 約0.4〜1.0%",
      detail: "品川区産業振興センターによる融資相談サポートあり"
    },
    unique_policy: "戸越銀座・武蔵小山商店街での空き店舗活用支援が活発。東京都「商店街空き店舗活用事業」との連動。品川区「起業家支援事業」による専門家無料派遣。",
    garbage_rule: "事業系ごみは許可業者との契約が基本。少量排出事業者は有料ごみ処理券で区収集委託可。",
    health_center: { name: "品川区保健所", branches: ["品川区保健所（広町）"], note: "区全域を1保健所で管轄。大崎・品川・荏原の各地区に出張窓口あり" },
    alert: null
  },
  {
    area_name: "目黒区",
    tags: ["トレンド", "中目黒", "自由が丘", "高単価"],
    rent_level: 4, customer_flow: 4, subsidy_strength: 4, garbage_ease: 4,
    subsidy: {
      name: "東京都創業助成事業 + 若手・女性リーダー応援",
      max_amount: 8440000,
      description: "東京都「創業助成事業」（最大400万円）に加え、商店街出店なら「若手・女性リーダー応援プログラム」（最大844万円）との組み合わせが可能。",
      merit: "中目黒・自由が丘エリアはトレンド飲食の激戦区で集客力が高い。「若手・女性リーダー応援プログラム」との連動で商店街出店が有利",
      demerit: "中目黒・代官山の賃料は都内でも最高水準。競合が非常に多い"
    },
    finance: {
      rate_display: "0.4〜1.0%",
      interest_subsidy_rate: "本人負担 約0.4〜1.0%",
      detail: "目黒区産業経済・雇用課での創業融資相談あり"
    },
    unique_policy: "目黒区商店街連合会と連携した空き店舗活用支援。自由が丘商店街（東京都チャレンジショップ「創の実」出店実績あり）での試験開業後の本格開業支援が充実。",
    garbage_rule: "事業系ごみは許可業者との契約が基本。分別はシンプルで比較的わかりやすい。少量排出事業者は有料ごみ処理券で区収集委託可。",
    health_center: { name: "目黒区保健所", branches: ["目黒区保健所（中目黒）"], note: "区全域を1保健所で管轄" },
    alert: null
  },
  {
    area_name: "大田区",
    tags: ["羽田", "インバウンド", "蒲田", "低賃料"],
    rent_level: 2, customer_flow: 3, subsidy_strength: 3, garbage_ease: 2,
    subsidy: {
      name: "大田区産業振興協会支援 + 東京都創業助成事業",
      max_amount: 4000000,
      description: "東京都「創業助成事業」（最大400万円）が主軸。大田区産業振興協会（PiO PARK）による独自支援・専門家派遣あり。",
      merit: "蒲田エリアの商店街に空き店舗が多く出店コストを抑えやすい。羽田空港インバウンド需要を取り込める立地",
      demerit: "大田区はゴミ分別が23区内でも厳格（紙パック・食品トレイの個別分別必須）"
    },
    finance: {
      rate_display: "0.4〜1.0%",
      interest_subsidy_rate: "本人負担 約0.4〜1.0%",
      detail: "大田区産業振興協会（PiO PARK）での創業融資相談・専門家派遣"
    },
    unique_policy: "蒲田・西蒲田商店街の空き店舗活用支援が活発。羽田空港近接エリアのインバウンド飲食需要取り込み支援。「大田区ビジネスプランコンテスト」入賞で創業助成事業の申請要件を満たせる。",
    garbage_rule: "⚠️ 23区内でも分別が最も細かい区のひとつ。紙パック・食品トレイを個別分別必須。廃食油は廃油収集専門業者への委託が特に重要。",
    health_center: { name: "大田区保健所", branches: ["大田区保健所（蒲田）", "糀谷・羽田特別出張所", "雪谷特別出張所"], note: "広域区のため出張窓口が複数あり。食品営業許可は本所または最寄りの出張窓口で" },
    alert: { type: "warning", message: "♻️ ゴミ分別が23区最厳格クラス。食品トレイ・紙パック・廃食油の個別分別が必須。開業前に分別ルールを徹底確認すること。" }
  },
  {
    area_name: "世田谷区",
    tags: ["下北沢", "三軒茶屋", "多商圏", "高所得層"],
    rent_level: 3, customer_flow: 4, subsidy_strength: 3, garbage_ease: 3,
    subsidy: {
      name: "世田谷区産業振興公社 創業支援 + 東京都創業助成事業",
      max_amount: 4000000,
      description: "東京都「創業助成事業」（最大400万円）が主軸。世田谷区産業振興公社・世田谷信用金庫・昭和信用金庫との8機関連携による創業支援体制が充実。",
      merit: "三軒茶屋・下北沢・二子玉川など多彩な商圏。区民所得が高く客単価を設定しやすい",
      demerit: "区が広大（23区最大）で商圏によって客層が全く異なる。保健所の支所ごとの管轄確認が必要"
    },
    finance: {
      rate_display: "0.4〜1.0%",
      interest_subsidy_rate: "本人負担 約0.4〜1.0%（地域信金との組み合わせ可）",
      detail: "世田谷信用金庫・昭和信用金庫の独自低利融資との組み合わせ可。駒澤大学・フリー株式会社との連携による財務・経営サポートプログラムが充実"
    },
    unique_policy: "8機関連携の創業支援ネットワーク（区内最大規模）。商店街の空き店舗活用に注力（三軒茶屋・下北沢・烏山エリア）。東京都チャレンジショップとの連動で試験開業が可能。",
    garbage_rule: "事業系ごみは許可業者との契約が基本。下北沢・三軒茶屋繁華街では早朝のごみ出し規制あり（近隣住民への配慮が重要）。",
    health_center: { name: "世田谷保健所", branches: ["世田谷", "北沢（下北沢）", "玉川（二子玉川）", "砧（成城）", "烏山（千歳烏山）"], note: "5支所体制。飲食店の食品営業許可は店舗所在地の支所管轄となる" },
    alert: { type: "danger", message: "🏥 保健所が5支所に分かれています。申請窓口を間違えると手続きが無効になる場合があります。開業前に必ず店舗の所在地エリアの管轄支所を確認してください。" }
  },
  {
    area_name: "渋谷区",
    tags: ["ブランド", "スタートアップ", "恵比寿", "代官山"],
    rent_level: 5, customer_flow: 5, subsidy_strength: 3, garbage_ease: 3,
    subsidy: {
      name: "渋谷区創業支援補助金 + 東京都創業助成事業",
      max_amount: 4000000,
      description: "東京都「創業助成事業」（最大400万円）が主軸。渋谷区独自の「スタートアップ支援」施策あり。",
      merit: "渋谷・恵比寿・代官山のブランド力は最高水準。スタートアップ関連のネットワーク・コミュニティが豊富",
      demerit: "渋谷駅周辺の賃料は23区内最高水準。出店競争が激しい"
    },
    finance: {
      rate_display: "0.4〜1.0%",
      interest_subsidy_rate: "本人負担 約0.4〜1.0%",
      detail: "渋谷区特定創業支援等事業修了で登録免許税半減・融資金利優遇"
    },
    unique_policy: "「渋谷スタートアップデッキ」との連携支援。恵比寿・代官山の商店街空き店舗活用支援。IT・クリエイティブ関連スタートアップ支援が最も手厚い。",
    garbage_rule: "事業系ごみは許可業者との契約が基本。渋谷駅周辺は繁華街・オフィス街が混在しており、ごみ出し時間帯の規制が厳格。",
    health_center: { name: "渋谷区保健所", branches: ["渋谷区保健所（広尾）"], note: "区全域を1保健所で管轄。代官山・恵比寿・原宿エリアすべてを同一窓口で対応" },
    alert: null
  },
  {
    area_name: "中野区",
    tags: ["再開発", "コスパ", "中野駅", "比較的安価"],
    rent_level: 2, customer_flow: 3, subsidy_strength: 3, garbage_ease: 4,
    subsidy: {
      name: "中野区創業支援補助金 + 東京都創業助成事業",
      max_amount: 4000000,
      description: "東京都「創業助成事業」（最大400万円）が主軸。中野区独自の商店街活性化支援あり。",
      merit: "中野駅周辺は再開発が進み新規テナント需要が急増中。賃料は渋谷・新宿比で抑えられる",
      demerit: "区独自の大型補助金は少なく、都の制度に依存する傾向"
    },
    finance: {
      rate_display: "0.4〜1.0%",
      interest_subsidy_rate: "本人負担 約0.4〜1.0%",
      detail: "中野区産業振興センターによる創業融資相談・専門家派遣あり"
    },
    unique_policy: "中野駅前再開発エリアの新規テナント誘致支援。中野・鷺ノ宮・野方商店街の空き店舗活用支援。",
    garbage_rule: "事業系ごみは許可業者との契約が基本。少量排出事業者は有料ごみ処理券で区収集委託可。",
    health_center: { name: "中野区保健所", branches: ["中野区保健所（中野）"], note: "区全域を1保健所で管轄" },
    alert: null
  },
  {
    area_name: "杉並区",
    tags: ["高円寺", "荻窪", "賃料補助あり", "商店街"],
    rent_level: 2, customer_flow: 3, subsidy_strength: 4, garbage_ease: 3,
    subsidy: {
      name: "杉並区創業スタートアップ助成事業 + 東京都創業助成事業",
      max_amount: 4500000,
      description: "東京都「創業助成事業」（最大400万円）に加え、杉並区独自の「創業スタートアップ助成事業」（事務所家賃助成：上限30万円、ホームページ作成助成：上限20万円）。",
      merit: "区独自の賃料補助とWeb制作補助の組み合わせが飲食店の初期費用軽減に有効",
      demerit: "助成額は他区比較で比較的少額。荻窪・高円寺エリアは家賃比較的安価だが集客力の差が大きい"
    },
    finance: {
      rate_display: "0.4〜1.0%",
      interest_subsidy_rate: "本人負担 約0.4〜1.0%",
      detail: "杉並区産業振興センター（阿佐ケ谷）での創業融資相談あり"
    },
    unique_policy: "高円寺・阿佐ケ谷・荻窪の各商店街と連携した空き店舗活用支援。「杉並区ビジネスチャレンジ補助金」で事業計画認定を受けた創業者に対する専門家派遣。",
    garbage_rule: "事業系ごみは許可業者との契約が基本。古布・使用済み食用油の分別回収が比較的厳格。",
    health_center: { name: "杉並区保健所", branches: ["杉並区保健所（荻窪）"], note: "区全域を1保健所で管轄。高円寺・荻窪・阿佐ケ谷・西荻窪は同一管轄" },
    alert: null
  },
  {
    area_name: "豊島区",
    tags: ["池袋", "大集客", "若者", "アニメ文化"],
    rent_level: 3, customer_flow: 5, subsidy_strength: 3, garbage_ease: 3,
    subsidy: {
      name: "豊島区中小企業支援補助金 + 東京都創業助成事業",
      max_amount: 4000000,
      description: "東京都「創業助成事業」（最大400万円）に加え、豊島区独自のホームページ作成補助金・専門家無料派遣あり。",
      merit: "池袋駅の圧倒的集客力（乗降客数全国上位）。女性・若者向け業態に有利。区の創業支援体制が充実",
      demerit: "池袋駅周辺の賃料は上昇傾向。繁華街エリアの競合が非常に多い"
    },
    finance: {
      rate_display: "0.4〜1.0%",
      interest_subsidy_rate: "本人負担 約0.4〜1.0%",
      detail: "豊島区特定創業支援等事業の専門相談員による個別面談（証明書取得で各種融資優遇・登録免許税半減）"
    },
    unique_policy: "「豊島区にぎわいづくり推進事業」との連動。サンシャインシティ周辺・池袋商店街の空き店舗活用支援。アニメ・マンガ文化との融合業態（コンセプトカフェ等）への支援実績あり。",
    garbage_rule: "事業系ごみは許可業者との契約が基本。池袋繁華街は深夜のごみ出し規制が厳格。",
    health_center: { name: "豊島区保健所", branches: ["豊島区保健所（雑司が谷）"], note: "区全域を1保健所で管轄" },
    alert: null
  },
  {
    area_name: "北区",
    tags: ["物件マッチング支援", "赤羽", "空き店舗", "低賃料"],
    rent_level: 2, customer_flow: 3, subsidy_strength: 4, garbage_ease: 4,
    subsidy: {
      name: "北区商店街空き店舗活用支援事業補助金 + 東京都創業助成事業",
      max_amount: 4200000,
      description: "東京都「創業助成事業」（最大400万円）に加え、北区独自「商店街空き店舗活用支援事業」（改修費の2/3・上限200万円＋家賃補助最大2年間）。",
      merit: "23区内でも独自の空き店舗活用補助金（改修費200万円上限）が充実。不動産業団体との包括連携で物件探しも公的に支援",
      demerit: "赤羽・王子エリアは賑わいがあるが、エリアによって客足の差が大きい"
    },
    finance: {
      rate_display: "0.4〜1.0%",
      interest_subsidy_rate: "本人負担 約0.4〜1.0%",
      detail: "北区産業振興公社による創業相談・融資サポート。地元信金との連携融資あり"
    },
    unique_policy: "区内不動産業団体（全日本不動産協会城北支部・東京都宅建業協会第九ブロック）との包括連携協定で空き店舗物件マッチングを公的に支援（23区内でも珍しい制度）。赤羽・十条・王子商店街の活性化事業が活発。",
    garbage_rule: "事業系ごみは許可業者との契約が基本。少量排出事業者は有料ごみ処理券で区収集委託可。",
    health_center: { name: "北区保健所", branches: ["北区保健所（王子）"], note: "区全域を1保健所で管轄。赤羽・滝野川・王子エリアすべて同一窓口" },
    alert: { type: "success", message: "🏠 物件マッチングを公的に支援！不動産業団体との包括連携協定により、商店街の空き店舗物件を公的に紹介。23区内でも珍しい手厚いサポート。" }
  },
  {
    area_name: "荒川区",
    tags: ["日暮里", "賃料補助あり", "低賃料", "下町"],
    rent_level: 2, customer_flow: 2, subsidy_strength: 3, garbage_ease: 4,
    subsidy: {
      name: "荒川区事務所賃料補助 + 東京都創業助成事業",
      max_amount: 4000000,
      description: "東京都「創業助成事業」（最大400万円）に加え、荒川区独自の「事務所賃料補助」（月額賃料の一部補助）あり。",
      merit: "荒川区独自の賃料補助が飲食店の初期コスト削減に直接効く。23区内でも家賃水準が比較的抑えられる",
      demerit: "繁華街・集客スポットが限定的。日暮里・町屋エリアに集中している"
    },
    finance: {
      rate_display: "0.4〜1.0%",
      interest_subsidy_rate: "本人負担 約0.4〜1.0%",
      detail: "荒川区産業振興センター（日暮里）での創業融資相談あり"
    },
    unique_policy: "日暮里繊維街・荒川商店街との連動支援。荒川区「あらかわ産業フェア」への飲食店出展補助。コミュニティビジネス支援事業あり。",
    garbage_rule: "事業系ごみは許可業者との契約が基本。少量排出事業者は有料ごみ処理券で区収集委託可。",
    health_center: { name: "荒川区保健所", branches: ["荒川区保健所（荒川）"], note: "区全域を1保健所で管轄" },
    alert: null
  },
  {
    area_name: "板橋区",
    tags: ["大山", "低賃料", "商店街", "住宅地"],
    rent_level: 2, customer_flow: 2, subsidy_strength: 3, garbage_ease: 4,
    subsidy: {
      name: "板橋区産業振興補助金 + 東京都創業助成事業",
      max_amount: 4000000,
      description: "東京都「創業助成事業」（最大400万円）が主軸。板橋区独自の産業振興補助金・商店街活性化支援あり。",
      merit: "大山・ときわ台・成増エリアの商店街は空き店舗が多く出店コストを抑えやすい。区全体の賃料水準が比較的低い",
      demerit: "都心へのアクセスで池袋乗り換えが必要なエリアが多く、集客に工夫が必要"
    },
    finance: {
      rate_display: "0.4〜1.0%",
      interest_subsidy_rate: "本人負担 約0.4〜1.0%",
      detail: "板橋区産業振興公社での創業相談・融資サポートあり"
    },
    unique_policy: "大山商店街（ハッピーロード）等の活性化事業に連動した飲食出店支援。「板橋ビジネスグランプリ」入賞で創業助成事業申請要件を満たせる。",
    garbage_rule: "事業系ごみは許可業者との契約が基本。少量排出事業者は有料ごみ処理券で区収集委託可。",
    health_center: { name: "板橋区保健所", branches: ["板橋区保健所（板橋）"], note: "区全域を1保健所で管轄" },
    alert: null
  },
  {
    area_name: "練馬区",
    tags: ["地産地消", "農地連携", "住宅地", "人口最多"],
    rent_level: 2, customer_flow: 2, subsidy_strength: 3, garbage_ease: 2,
    subsidy: {
      name: "練馬区創業支援補助金 + 東京都創業助成事業",
      max_amount: 4000000,
      description: "東京都「創業助成事業」（最大400万円）が主軸。練馬区独自の農と食の連携飲食事業支援あり。",
      merit: "23区内で人口最多。大泉学園・石神井公園エリアの住宅地は地域密着型飲食店の安定収益が見込める。農地連携で地産地消業態に有利",
      demerit: "練馬区はごみ分別が23区内で最も細かい。古着・古布・使用済み食用油の個別分別あり"
    },
    finance: {
      rate_display: "0.4〜1.0%",
      interest_subsidy_rate: "本人負担 約0.4〜1.0%",
      detail: "練馬区産業振興センターでの創業融資相談あり"
    },
    unique_policy: "練馬区の豊富な農地を活用した「農と食の連携」飲食事業支援（地産地消飲食店への助成プログラムあり）。大泉学園・石神井公園の商店街空き店舗活用支援。",
    garbage_rule: "⚠️ 23区内でも分別ルールが最も細かい区のひとつ。古着・古布・使用済み食用油を個別分別。廃食油は廃油収集業者への委託が特に重要。",
    health_center: { name: "練馬区保健所", branches: ["練馬区保健所（豊玉）", "光が丘保健相談所", "石神井保健相談所"], note: "練馬・光が丘・石神井の3エリアに分かれて管轄。店舗所在地に応じた担当保健相談所を確認すること" },
    alert: { type: "warning", message: "♻️ ゴミ分別が最厳格クラス + 保健所が3か所に分かれています。開業前に必ず店舗エリアの管轄保健相談所と分別ルールの両方を確認してください。" }
  },
  {
    area_name: "足立区",
    tags: ["低賃料", "北千住", "学生需要", "デリバリー向き"],
    rent_level: 1, customer_flow: 3, subsidy_strength: 3, garbage_ease: 5,
    subsidy: {
      name: "足立区産業振興補助金 + 東京都創業助成事業",
      max_amount: 4000000,
      description: "東京都「創業助成事業」（最大400万円）が主軸。足立区独自の商店街支援・産業振興補助金あり。",
      merit: "23区内で家賃・物件取得コストが最も安い水準。北千住エリアは学生・若年層向けに集客力が急増中",
      demerit: "区の北部エリアは集客力が限定的。フードデリバリー需要の活用を組み合わせるのが現実的"
    },
    finance: {
      rate_display: "0.4〜1.0%",
      interest_subsidy_rate: "本人負担 約0.4〜1.0%",
      detail: "足立区産業振興センター（北千住）での創業融資相談あり"
    },
    unique_policy: "北千住エリアの大学誘致に伴う学生向け飲食需要の拡大支援。足立区「あだちビジネスチャンス補助金」で飲食業も対象に。商店街の空き店舗を活用した出店支援が充実。",
    garbage_rule: "事業系ごみは許可業者との契約が基本。足立区は分別がシンプルで比較的わかりやすい（23区内でも管理しやすい部類）。",
    health_center: { name: "足立区保健所", branches: ["足立区保健所（中央本町）", "竹の塚保健センター"], note: "区の広さに応じて竹の塚方面に保健センターあり" },
    alert: null
  },
  {
    area_name: "葛飾区",
    tags: ["低賃料", "柴又", "観光", "地域密着"],
    rent_level: 1, customer_flow: 2, subsidy_strength: 3, garbage_ease: 4,
    subsidy: {
      name: "葛飾区産業振興補助金 + 東京都創業助成事業",
      max_amount: 4000000,
      description: "東京都「創業助成事業」（最大400万円）が主軸。葛飾区独自の産業振興補助金・商店街活性化支援あり。",
      merit: "23区内でも家賃が安く初期費用を大幅に抑えられる。葛飾区商工会議所による創業支援が充実",
      demerit: "繁華街・集客スポットが少なく、地域密着型業態に適した立地選定が必要"
    },
    finance: {
      rate_display: "0.4〜1.0%",
      interest_subsidy_rate: "本人負担 約0.4〜1.0%",
      detail: "葛飾区産業経済課・葛飾商工会議所との連携サポートあり"
    },
    unique_policy: "柴又・亀有エリアの観光資源（「こち亀」・帝釈天）を活用した飲食出店支援。葛飾区「ものづくり産業特区」で近隣の製造業従事者向けランチ需要の取り込みが可能。",
    garbage_rule: "事業系ごみは許可業者との契約が基本。少量排出事業者は有料ごみ処理券で区収集委託可。",
    health_center: { name: "葛飾区保健所", branches: ["葛飾区保健所（立石）", "金町保健センター"], note: "立石エリアと金町エリアに分かれて管轄。店舗所在地の担当を確認すること" },
    alert: null
  },
  {
    area_name: "江戸川区",
    tags: ["低賃料", "エスニック", "多文化", "広い物件"],
    rent_level: 1, customer_flow: 2, subsidy_strength: 3, garbage_ease: 4,
    subsidy: {
      name: "江戸川区産業振興補助金 + 東京都創業助成事業",
      max_amount: 4000000,
      description: "東京都「創業助成事業」（最大400万円）が主軸。江戸川区独自の産業振興補助金あり。",
      merit: "23区内でも家賃水準が低く、広い物件を確保しやすい。インド・中国・韓国系居住者が多くエスニック系飲食業態での差別化出店に有利",
      demerit: "都心へのアクセスがやや遠く、ランチ以外の集客に工夫が必要"
    },
    finance: {
      rate_display: "0.4〜1.0%",
      interest_subsidy_rate: "本人負担 約0.4〜1.0%",
      detail: "江戸川区産業振興課・東京商工会議所江戸川支部との連携サポートあり"
    },
    unique_policy: "小岩・篠崎・葛西商店街の空き店舗活用支援。インド・中国・韓国系居住者が多くエスニック系飲食業態での差別化出店に有利。事業系一般廃棄物の清掃工場自己搬入が可能。",
    garbage_rule: "事業系ごみは許可業者との契約が基本。少量排出事業者は有料ごみ処理券で区収集委託可。事業系一般廃棄物の清掃工場への自己搬入が可能（少量なら便利）。",
    health_center: { name: "江戸川区保健所", branches: ["江戸川保健所（中央）", "小岩健康サポートセンター", "葛西健康サポートセンター", "篠崎健康サポートセンター"], note: "広大な区域を複数の健康サポートセンターでカバー。食品営業許可は本所（中央）または担当センターへ" },
    alert: null
  }
];

// ─────────────────────────────────────────────
// 診断ロジック
// ─────────────────────────────────────────────
const DIAGNOSE_QUESTIONS = [
  {
    id: "budget",
    question: "初期費用の予算感は？",
    options: [
      { label: "300万円未満（最小限で）", value: "tight" },
      { label: "300〜700万円（標準的）", value: "normal" },
      { label: "700万円以上（しっかり投資）", value: "rich" },
    ]
  },
  {
    id: "style",
    question: "出したいお店のタイプは？",
    options: [
      { label: "地域密着・常連重視", value: "local" },
      { label: "トレンド・集客最大化", value: "trend" },
      { label: "インバウンド・観光客向け", value: "inbound" },
      { label: "テイクアウト・デリバリー主体", value: "delivery" },
    ]
  },
  {
    id: "rent",
    question: "家賃への許容度は？",
    options: [
      { label: "できるだけ安くしたい", value: "low" },
      { label: "相場なら許容できる", value: "mid" },
      { label: "高くても立地を優先", value: "high" },
    ]
  },
  {
    id: "garbage",
    question: "オペレーション管理の得意度は？",
    options: [
      { label: "シンプルに集中したい", value: "simple" },
      { label: "ルール厳しくても問題なし", value: "strict" },
    ]
  }
];

function diagnose(answers) {
  return WARD_DATA.map(w => {
    let score = 0;
    const { budget, style, rent, garbage } = answers;
    const maxM = w.subsidy.max_amount / 10000;

    // 予算
    if (budget === "tight")  score += maxM >= 400 ? 2 : 1;
    if (budget === "normal") score += w.subsidy_strength * 0.8;
    if (budget === "rich")   score += w.subsidy_strength;

    // スタイル
    if (style === "local")    score += (6 - w.rent_level) * 0.8;
    if (style === "trend")    score += w.customer_flow * 0.9;
    if (style === "inbound")  { if (w.tags.includes("インバウンド")) score += 3; }
    if (style === "delivery") { score += (6 - w.rent_level); if (w.tags.includes("低賃料")) score += 2; }

    // 家賃
    if (rent === "low")  score += (6 - w.rent_level) * 1.2;
    if (rent === "mid")  score += 3;
    if (rent === "high") score += w.customer_flow;

    // ゴミ
    if (garbage === "simple") score += w.garbage_ease;
    if (garbage === "strict") score += 3;

    return { ward: w, score };
  }).sort((a, b) => b.score - a.score).slice(0, 5);
}

// ─────────────────────────────────────────────
// スタイル定数
// ─────────────────────────────────────────────
const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E")`;

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400;700;900&family=Zen+Kaku+Gothic+New:wght@400;500;700&display=swap');
  * { box-sizing: border-box; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); }
  ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.12); border-radius: 2px; }

  .ward-btn { transition: all 0.15s ease; }
  .ward-btn:hover { transform: translateX(4px); }

  .tab-btn { transition: all 0.2s ease; }
  .tab-btn:hover { background: rgba(255,255,255,0.08) !important; }

  .opt-btn { transition: all 0.2s ease; }
  .opt-btn:hover { border-color: rgba(251,191,36,0.6) !important; background: rgba(251,191,36,0.08) !important; }

  @media (max-width: 768px) {
    .main-layout { flex-direction: column !important; }
    .sidebar { width: 100% !important; }
    .sidebar-inner { flex-direction: row !important; flex-wrap: wrap !important; gap: 6px !important; }
    .ward-btn { width: calc(33% - 4px) !important; font-size: 11px !important; padding: 7px 6px !important; }
    .cards-area { flex-direction: column !important; }
    .header-inner { padding: 14px 16px !important; flex-wrap: wrap; gap: 8px; }
    .header-btns { flex-wrap: wrap !important; gap: 6px; }
    .header-title h1 { font-size: 20px !important; }
    .main-pad { padding: 16px !important; }
    .compare-chart { grid-template-columns: 1fr !important; }
  }
  @media (max-width: 480px) {
    .ward-btn { width: calc(50% - 4px) !important; }
  }
`;

// ─────────────────────────────────────────────
// サブコンポーネント
// ─────────────────────────────────────────────

function AlertBanner({ alert }) {
  if (!alert) return null;
  const c = {
    success: { bg: "rgba(34,197,94,0.1)", border: "#22c55e", text: "#4ade80" },
    warning: { bg: "rgba(251,191,36,0.1)", border: "#fbbf24", text: "#fcd34d" },
    danger:  { bg: "rgba(239,68,68,0.1)",  border: "#ef4444", text: "#f87171" },
  }[alert.type];
  return (
    <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
      style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: 8,
        padding: "10px 14px", marginBottom: 14, color: c.text,
        fontSize: 12, lineHeight: 1.7, fontFamily: "'Zen Kaku Gothic New', sans-serif" }}>
      {alert.message}
    </motion.div>
  );
}

function StarBar({ value, max = 5, color = "#fbbf24" }) {
  return (
    <div style={{ display: "flex", gap: 3 }}>
      {Array.from({ length: max }).map((_, i) => (
        <div key={i} style={{
          width: 10, height: 10, borderRadius: 2,
          background: i < value ? color : "rgba(255,255,255,0.08)"
        }} />
      ))}
    </div>
  );
}

function DataCard({ ward, isCompare }) {
  const [openSection, setOpenSection] = useState(null);

  if (!ward) return (
    <div style={{ flex: 1, border: "1px dashed rgba(255,255,255,0.1)", borderRadius: 14,
      display: "flex", alignItems: "center", justifyContent: "center",
      color: "rgba(255,255,255,0.2)", fontSize: 13, minHeight: 420, padding: 24 }}>
      ← 比較する区を選択
    </div>
  );

  const maxM = Math.round(ward.subsidy.max_amount / 10000);
  const accentColor = isCompare ? "#60a5fa" : "#fbbf24";

  const toggle = (key) => setOpenSection(openSection === key ? null : key);

  const Section = ({ id, label, children }) => (
    <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <button onClick={() => toggle(id)} style={{
        width: "100%", background: "none", border: "none", cursor: "pointer",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "10px 0", color: "rgba(255,255,255,0.5)", fontSize: 10, letterSpacing: "0.12em"
      }}>
        <span>{label}</span>
        <span style={{ transition: "transform 0.2s", transform: openSection === id ? "rotate(180deg)" : "rotate(0)" }}>▾</span>
      </button>
      <AnimatePresence>
        {openSection === id && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}
            style={{ overflow: "hidden", paddingBottom: 12 }}>
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <motion.div key={ward.area_name}
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      style={{ flex: 1, background: "rgba(255,255,255,0.035)",
        border: `1px solid ${isCompare ? "rgba(96,165,250,0.25)" : "rgba(251,191,36,0.2)"}`,
        borderRadius: 14, padding: "18px 20px", display: "flex", flexDirection: "column", gap: 0,
        backdropFilter: "blur(10px)", minWidth: 0 }}>

      {/* ヘッダー */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 10, letterSpacing: "0.15em", color: "rgba(255,255,255,0.3)", marginBottom: 4 }}>
          {isCompare ? "◆ 比較区" : "◆ 選択区"}
        </div>
        <h3 style={{ fontSize: 24, fontWeight: 900, color: accentColor,
          fontFamily: "'Noto Serif JP', serif", margin: "0 0 8px" }}>
          {ward.area_name}
        </h3>
        {/* タグ */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 10 }}>
          {ward.tags.map(t => (
            <span key={t} style={{ fontSize: 9, padding: "2px 7px", borderRadius: 20,
              background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.5)", letterSpacing: "0.06em" }}>{t}</span>
          ))}
        </div>
        {/* スコアバー */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 16px" }}>
          {[["賃料水準", ward.rent_level, "#f87171"], ["集客力", ward.customer_flow, "#4ade80"],
            ["補助金力", ward.subsidy_strength, "#fbbf24"], ["ゴミ管理", ward.garbage_ease, "#60a5fa"]
          ].map(([label, val, col]) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", width: 52, flexShrink: 0 }}>{label}</span>
              <StarBar value={val} color={col} />
            </div>
          ))}
        </div>
      </div>

      <AlertBanner alert={ward.alert} />

      {/* 補助金メイン */}
      <div style={{ background: `rgba(${isCompare ? "96,165,250" : "251,191,36"},0.06)`,
        border: `1px solid rgba(${isCompare ? "96,165,250" : "251,191,36"},0.18)`,
        borderRadius: 10, padding: "14px", marginBottom: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
          <span style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em" }}>最大補助額</span>
          <span style={{ fontSize: 26, fontWeight: 900, color: accentColor, fontFamily: "'Noto Serif JP', serif" }}>
            {maxM}万円
          </span>
        </div>
        <div style={{ height: 3, background: "rgba(255,255,255,0.07)", borderRadius: 2, marginBottom: 10 }}>
          <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, maxM / 900 * 100)}%` }}
            transition={{ duration: 1.2, ease: "circOut" }}
            style={{ height: "100%", borderRadius: 2, background: `linear-gradient(90deg, ${accentColor}, ${accentColor}88)` }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
          <div style={{ background: "rgba(34,197,94,0.07)", border: "1px solid rgba(34,197,94,0.18)",
            borderRadius: 6, padding: "7px 8px" }}>
            <div style={{ fontSize: 9, color: "#4ade80", marginBottom: 3, letterSpacing: "0.08em" }}>✓ MERIT</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.65)", lineHeight: 1.6 }}>{ward.subsidy.merit}</div>
          </div>
          <div style={{ background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.18)",
            borderRadius: 6, padding: "7px 8px" }}>
            <div style={{ fontSize: 9, color: "#f87171", marginBottom: 3, letterSpacing: "0.08em" }}>✕ DEMERIT</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.65)", lineHeight: 1.6 }}>{ward.subsidy.demerit}</div>
          </div>
        </div>
      </div>

      {/* 融資 */}
      <div style={{ background: "rgba(96,165,250,0.06)", border: "1px solid rgba(96,165,250,0.2)",
        borderRadius: 10, padding: "12px", marginBottom: 10 }}>
        <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", marginBottom: 4, letterSpacing: "0.1em" }}>融資・利子補給</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#93c5fd", marginBottom: 4, fontFamily: "'Noto Serif JP', serif" }}>
          {ward.finance.interest_subsidy_rate}
        </div>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}>{ward.finance.detail}</div>
      </div>

      {/* アコーディオン詳細 */}
      <Section id="unique" label="── 独自施策">
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", lineHeight: 1.8 }}>{ward.unique_policy}</div>
      </Section>
      <Section id="garbage" label="── ゴミ出しルール（事業系）">
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", lineHeight: 1.8 }}>{ward.garbage_rule}</div>
      </Section>
      <Section id="health" label="── 保健所管轄">
        <div style={{ fontSize: 13, color: "#c4b5fd", fontWeight: 600, marginBottom: 6 }}>{ward.health_center.name}</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 6 }}>
          {ward.health_center.branches.map(b => (
            <span key={b} style={{ fontSize: 9, background: "rgba(167,139,250,0.12)",
              border: "1px solid rgba(167,139,250,0.22)", borderRadius: 4,
              padding: "2px 7px", color: "#e9d5ff" }}>{b}</span>
          ))}
        </div>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>{ward.health_center.note}</div>
      </Section>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// 診断パネル
// ─────────────────────────────────────────────
function DiagnosePanel({ onResult }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});

  const q = DIAGNOSE_QUESTIONS[step];
  const isLast = step === DIAGNOSE_QUESTIONS.length - 1;

  const choose = (val) => {
    const next = { ...answers, [q.id]: val };
    if (isLast) {
      onResult(diagnose(next));
    } else {
      setAnswers(next);
      setStep(s => s + 1);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      style={{ maxWidth: 560, margin: "0 auto", padding: "0 8px" }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 9, letterSpacing: "0.15em", color: "rgba(255,255,255,0.3)", marginBottom: 8 }}>
          STEP {step + 1} / {DIAGNOSE_QUESTIONS.length}
        </div>
        <div style={{ height: 2, background: "rgba(255,255,255,0.07)", borderRadius: 1, marginBottom: 20 }}>
          <motion.div animate={{ width: `${((step + 1) / DIAGNOSE_QUESTIONS.length) * 100}%` }}
            style={{ height: "100%", background: "linear-gradient(90deg,#fbbf24,#f59e0b)", borderRadius: 1 }} />
        </div>
        <AnimatePresence mode="wait">
          <motion.p key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}
            style={{ fontSize: 17, fontWeight: 700, color: "#e8d5a3",
              fontFamily: "'Noto Serif JP', serif", lineHeight: 1.6, margin: "0 0 18px" }}>
            {q.question}
          </motion.p>
        </AnimatePresence>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {q.options.map(opt => (
          <button key={opt.value} className="opt-btn" onClick={() => choose(opt.value)} style={{
            padding: "13px 18px", borderRadius: 9, textAlign: "left", cursor: "pointer",
            background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)",
            color: "rgba(255,255,255,0.8)", fontSize: 13, fontFamily: "'Zen Kaku Gothic New', sans-serif",
            lineHeight: 1.5
          }}>
            {opt.label}
          </button>
        ))}
      </div>
      {step > 0 && (
        <button onClick={() => setStep(s => s - 1)} style={{
          marginTop: 14, background: "none", border: "none", color: "rgba(255,255,255,0.3)",
          fontSize: 11, cursor: "pointer", letterSpacing: "0.1em"
        }}>← 前の質問に戻る</button>
      )}
    </motion.div>
  );
}

function DiagnoseResult({ results, onSelectWard, onReset }) {
  const medal = ["🥇", "🥈", "🥉", "4.", "5."];
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <h3 style={{ fontSize: 15, color: "#e8d5a3", fontFamily: "'Noto Serif JP', serif", margin: 0 }}>
          診断結果：あなたにおすすめの区
        </h3>
        <button onClick={onReset} style={{ fontSize: 11, color: "rgba(255,255,255,0.4)",
          background: "none", border: "none", cursor: "pointer" }}>もう一度</button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {results.map(({ ward, score }, i) => (
          <motion.div key={ward.area_name} initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
            onClick={() => onSelectWard(ward.area_name)}
            style={{ padding: "13px 16px", borderRadius: 10, cursor: "pointer",
              background: i === 0 ? "rgba(251,191,36,0.1)" : "rgba(255,255,255,0.04)",
              border: `1px solid ${i === 0 ? "rgba(251,191,36,0.4)" : "rgba(255,255,255,0.08)"}`,
              display: "flex", alignItems: "center", gap: 12, transition: "all 0.2s" }}>
            <span style={{ fontSize: 20, width: 28 }}>{medal[i]}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: i === 0 ? "#fbbf24" : "#e8d5a3",
                fontFamily: "'Noto Serif JP', serif", marginBottom: 3 }}>
                {ward.area_name}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {ward.tags.slice(0, 3).map(t => (
                  <span key={t} style={{ fontSize: 9, padding: "1px 6px", borderRadius: 10,
                    background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)" }}>{t}</span>
                ))}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: i === 0 ? "#fbbf24" : "#60a5fa" }}>{score.toFixed(0)}</div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)" }}>スコア</div>
            </div>
          </motion.div>
        ))}
      </div>
      <p style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", marginTop: 14, lineHeight: 1.8 }}>
        ✱ スコアは入力条件の重み付けによる参考値です。区名をクリックすると詳細カードが開きます。
      </p>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// 共通制度パネル
// ─────────────────────────────────────────────
function CommonPanel() {
  const items = [
    { icon: "💴", title: "東京都 創業助成事業", body: "最大400万円（助成率2/3）。人件費・賃借料・広告費・設備費などが対象。都内創業予定または創業5年未満が要件。TOKYO創業ステーションでの事業計画書策定支援修了が申請要件の一つ。" },
    { icon: "🏪", title: "若手・女性リーダー応援プログラム", body: "商店街に出店する39歳以下男性または女性が対象。最大844万円（工事費＋家賃3年補助）。商店街起業・承継支援事業（最大250万円）と組み合わせ可。都内商店街が前提条件。" },
    { icon: "📋", title: "特定創業支援等事業（全区共通）", body: "全区で実施するセミナー修了で「証明書」を取得。東京都制度融資「創業」の金利が0.4%優遇、法人設立時の登録免許税が半減（15万→7.5万円）。各区の産業振興窓口に相談を。" },
    { icon: "🗑️", title: "事業系ゴミ（全区共通ルール）", body: "23区すべてで事業系ごみは原則「許可業者との個別契約」。少量排出の飲食店は有料ごみ処理券（コンビニ等で購入）を使い区収集に委託可能。廃食油は専門業者への委託が全区共通で必須。" },
  ];
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      style={{ borderRadius: 12, overflow: "hidden", border: "1px solid rgba(251,191,36,0.2)",
        background: "rgba(251,191,36,0.04)", padding: "18px 20px" }}>
      <h3 style={{ fontSize: 12, color: "#fbbf24", margin: "0 0 14px", letterSpacing: "0.12em", fontFamily: "monospace" }}>
        全23区共通の支援制度・基礎知識
      </h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 10 }}>
        {items.map(it => (
          <div key={it.title} style={{ background: "rgba(0,0,0,0.2)", borderRadius: 8, padding: "12px 14px" }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#e8d5a3", marginBottom: 6,
              fontFamily: "'Noto Serif JP', serif" }}>{it.icon} {it.title}</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", lineHeight: 1.8 }}>{it.body}</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// メインアプリ
// ─────────────────────────────────────────────
export default function Locepita() {
  const [selected, setSelected] = useState(null);
  const [compare, setCompare] = useState(null);
  const [mode, setMode] = useState("single");
  const [tab, setTab] = useState("browse");  // "browse" | "diagnose" | "common"
  const [diagnoseResults, setDiagnoseResults] = useState(null);
  const [diagnoseKey, setDiagnoseKey] = useState(0);

  const selectedWard = WARD_DATA.find(w => w.area_name === selected) || null;
  const compareWard  = WARD_DATA.find(w => w.area_name === compare)  || null;

  const handleSelectWard = (name) => {
    if (mode === "single") {
      setSelected(name);
    } else {
      if (!selected) { setSelected(name); return; }
      if (name === selected) { setSelected(null); setCompare(null); return; }
      if (name === compare)  { setCompare(null); return; }
      if (!compare)          { setCompare(name); return; }
      setCompare(name);
    }
    // 診断から選択時はbrowseタブに移行
    setTab("browse");
  };

  const handleDiagnoseResult = (results) => setDiagnoseResults(results);
  const resetDiagnose = () => { setDiagnoseResults(null); setDiagnoseKey(k => k + 1); };

  const TabBtn = ({ id, label }) => (
    <button className="tab-btn" onClick={() => setTab(id)} style={{
      padding: "8px 16px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 12,
      letterSpacing: "0.06em", fontFamily: "'Zen Kaku Gothic New', sans-serif",
      background: tab === id ? "rgba(251,191,36,0.15)" : "rgba(255,255,255,0.04)",
      color: tab === id ? "#fbbf24" : "rgba(255,255,255,0.5)",
      borderBottom: tab === id ? "2px solid #fbbf24" : "2px solid transparent"
    }}>{label}</button>
  );

  return (
    <>
      <style>{css}</style>
      <div style={{
        minHeight: "100vh", background: "#0d1520",
        backgroundImage: `${GRAIN}, linear-gradient(160deg, #0d1520 0%, #132030 50%, #0a1018 100%)`,
        color: "#e8e0d0", fontFamily: "'Zen Kaku Gothic New', sans-serif",
      }}>
        {/* ヘッダー */}
        <header style={{
          position: "sticky", top: 0, zIndex: 100,
          background: "rgba(10,16,24,0.85)", backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(255,255,255,0.07)"
        }}>
          <div className="header-inner" style={{ padding: "16px 28px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div className="header-title">
              <h1 style={{ fontSize: 23, fontWeight: 900, margin: 0,
                fontFamily: "'Noto Serif JP', serif",
                background: "linear-gradient(135deg, #f0dfa8 0%, #fbbf24 60%, #d97706 100%)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                ロケピタ
              </h1>
              <p style={{ margin: 0, fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: "0.14em" }}>
                飲食店開業支援・規制 比較ナビ｜東京都23区
              </p>
            </div>
            <div className="header-btns" style={{ display: "flex", gap: 8, alignItems: "center" }}>
              {mode === "compare" && (
                <span style={{ fontSize: 10, color: "rgba(96,165,250,0.7)", letterSpacing: "0.1em" }}>
                  {selected && !compare ? "①選択済 → ②を選択" : selected && compare ? `比較中：${selected}×${compare}` : "区を選択"}
                </span>
              )}
              <button onClick={() => { setMode(m => m === "single" ? "compare" : "single"); setCompare(null); }} style={{
                padding: "7px 14px", borderRadius: 6, border: "1px solid rgba(255,255,255,0.12)",
                background: mode === "compare" ? "rgba(96,165,250,0.15)" : "rgba(255,255,255,0.04)",
                color: mode === "compare" ? "#93c5fd" : "rgba(255,255,255,0.55)",
                fontSize: 11, cursor: "pointer", letterSpacing: "0.06em"
              }}>
                {mode === "compare" ? "◆ 比較中" : "◇ 比較モード"}
              </button>
            </div>
          </div>
          {/* タブナビ */}
          <div style={{ padding: "0 28px", borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", gap: 4 }}>
            <TabBtn id="browse" label="🗾 エリアを探す" />
            <TabBtn id="diagnose" label="🔍 条件で診断" />
            <TabBtn id="common" label="📋 共通制度" />
          </div>
        </header>

        {/* メインコンテンツ */}
        <div className="main-pad" style={{ padding: "20px 28px" }}>
          <AnimatePresence mode="wait">

            {/* ── エリアブラウズタブ ── */}
            {tab === "browse" && (
              <motion.div key="browse" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="main-layout" style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
                  {/* サイドバー */}
                  <div className="sidebar" style={{ width: 200, flexShrink: 0 }}>
                    <div style={{ fontSize: 9, color: "rgba(255,255,255,0.25)", letterSpacing: "0.12em", marginBottom: 8 }}>
                      {mode === "compare" ? "① ② の順で2区を選択" : "区を選択"}
                    </div>
                    <div className="sidebar-inner" style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                      {WARD_DATA.map(w => {
                        const isSel = w.area_name === selected;
                        const isCmp = w.area_name === compare;
                        return (
                          <button key={w.area_name} className="ward-btn" onClick={() => handleSelectWard(w.area_name)} style={{
                            padding: "9px 12px", borderRadius: 7, textAlign: "left", cursor: "pointer",
                            background: isSel ? "rgba(251,191,36,0.12)" : isCmp ? "rgba(96,165,250,0.1)" : "rgba(255,255,255,0.025)",
                            border: `1px solid ${isSel ? "rgba(251,191,36,0.5)" : isCmp ? "rgba(96,165,250,0.4)" : "rgba(255,255,255,0.06)"}`,
                            color: isSel ? "#fbbf24" : isCmp ? "#93c5fd" : "rgba(255,255,255,0.6)",
                            fontSize: 12, display: "flex", alignItems: "center", justifyContent: "space-between",
                            fontFamily: "'Zen Kaku Gothic New', sans-serif"
                          }}>
                            <span>{w.area_name}</span>
                            <span style={{ fontSize: 9, opacity: 0.7 }}>
                              {isSel ? "①" : isCmp ? "②" : w.alert ? (w.alert.type === "success" ? "★" : w.alert.type === "warning" ? "⚠" : "🔴") : ""}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    {/* 凡例 */}
                    <div style={{ marginTop: 12, padding: "8px 10px", background: "rgba(0,0,0,0.2)",
                      borderRadius: 8, fontSize: 9, color: "rgba(255,255,255,0.3)", lineHeight: 2 }}>
                      ★ 特典制度あり<br />⚠ 要確認事項あり<br />🔴 管轄注意
                    </div>
                  </div>

                  {/* カードエリア */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {!selected ? (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        style={{ textAlign: "center", paddingTop: 80, color: "rgba(255,255,255,0.18)" }}>
                        <div style={{ fontSize: 52, marginBottom: 16, opacity: 0.5 }}>🏮</div>
                        <p style={{ fontSize: 14, fontFamily: "'Noto Serif JP', serif", letterSpacing: "0.12em" }}>
                          左から区を選択してください
                        </p>
                        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.12)" }}>
                          「条件で診断」タブから希望条件で絞り込むこともできます
                        </p>
                      </motion.div>
                    ) : (
                      <div>
                        <div className="cards-area" style={{ display: "flex", gap: 16 }}>
                          <AnimatePresence mode="wait">
                            <DataCard key={selected} ward={selectedWard} isCompare={false} />
                          </AnimatePresence>
                          {mode === "compare" && (
                            <AnimatePresence mode="wait">
                              <DataCard key={compare || "empty"} ward={compareWard} isCompare={true} />
                            </AnimatePresence>
                          )}
                        </div>

                        {/* 比較チャート */}
                        {mode === "compare" && selected && compare && (
                          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                            style={{ marginTop: 16, padding: "16px 20px",
                              background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)",
                              borderRadius: 12 }}>
                            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: "0.12em", marginBottom: 14 }}>
                              ── 5軸レーダー比較
                            </div>
                            <div className="compare-chart" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                              {[
                                ["賃料水準", "rent_level", "#f87171"],
                                ["集客力",   "customer_flow", "#4ade80"],
                                ["補助金力", "subsidy_strength", "#fbbf24"],
                                ["ゴミ管理", "garbage_ease", "#60a5fa"],
                              ].map(([label, key, color]) => (
                                <div key={key}>
                                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginBottom: 6 }}>{label}</div>
                                  {[selectedWard, compareWard].map((w, wi) => (
                                    <div key={wi} style={{ marginBottom: 5 }}>
                                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9,
                                        color: wi === 0 ? "#fbbf24" : "#93c5fd", marginBottom: 3 }}>
                                        <span>{w.area_name}</span>
                                        <span>{w[key]} / 5</span>
                                      </div>
                                      <div style={{ height: 5, background: "rgba(255,255,255,0.06)", borderRadius: 3 }}>
                                        <motion.div
                                          initial={{ width: 0 }} animate={{ width: `${(w[key] / 5) * 100}%` }}
                                          transition={{ duration: 0.8, ease: "circOut" }}
                                          style={{ height: "100%", borderRadius: 3,
                                            background: wi === 0 ? `linear-gradient(90deg,${color},${color}88)` : `linear-gradient(90deg,#60a5fa,#3b82f6)` }} />
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ))}
                            </div>
                            {/* 融資条件比較 */}
                            <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                              {[selectedWard, compareWard].map((w, i) => (
                                <div key={w.area_name} style={{
                                  background: i === 0 ? "rgba(251,191,36,0.06)" : "rgba(96,165,250,0.06)",
                                  border: `1px solid ${i === 0 ? "rgba(251,191,36,0.2)" : "rgba(96,165,250,0.2)"}`,
                                  borderRadius: 8, padding: "10px 12px" }}>
                                  <div style={{ fontSize: 10, color: i === 0 ? "#fbbf24" : "#93c5fd",
                                    fontWeight: 600, marginBottom: 4, fontFamily: "'Noto Serif JP', serif" }}>
                                    {w.area_name}の融資
                                  </div>
                                  <div style={{ fontSize: 14, color: "rgba(255,255,255,0.8)", fontWeight: 700, marginBottom: 3 }}>
                                    {w.finance.rate_display}
                                  </div>
                                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", lineHeight: 1.6 }}>
                                    {w.finance.detail.slice(0, 60)}…
                                  </div>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── 診断タブ ── */}
            {tab === "diagnose" && (
              <motion.div key="diagnose" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{ maxWidth: 680, margin: "20px auto" }}>
                <div style={{ marginBottom: 24, textAlign: "center" }}>
                  <h2 style={{ fontSize: 18, fontWeight: 900, color: "#e8d5a3",
                    fontFamily: "'Noto Serif JP', serif", margin: "0 0 6px" }}>
                    出店エリア診断
                  </h2>
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", margin: 0 }}>
                    4つの質問に答えると、条件に合う区を上位5位でご提案します
                  </p>
                </div>
                {!diagnoseResults ? (
                  <DiagnosePanel key={diagnoseKey} onResult={handleDiagnoseResult} />
                ) : (
                  <DiagnoseResult results={diagnoseResults}
                    onSelectWard={(name) => { setSelected(name); setTab("browse"); }}
                    onReset={resetDiagnose} />
                )}
              </motion.div>
            )}

            {/* ── 共通制度タブ ── */}
            {tab === "common" && (
              <motion.div key="common" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{ maxWidth: 900, margin: "0 auto" }}>
                <CommonPanel />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* フッター */}
        <footer style={{ borderTop: "1px solid rgba(255,255,255,0.05)",
          padding: "14px 28px", marginTop: 20,
          display: "flex", alignItems: "flex-start", justifyContent: "space-between",
          gap: 16, flexWrap: "wrap" }}>
          <p style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", lineHeight: 1.9, margin: 0, maxWidth: 600 }}>
            ⚠️ 免責事項：本データは2024〜2026年度の調査に基づく参考情報です。補助金・融資制度の内容・金額・申請期間は年度ごとに変更されます。開業前に必ず各区の公式サイト・産業振興窓口でご確認ください。本サービスの情報を元にした損害について弊社は責任を負いません。
          </p>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.15)", fontFamily: "monospace", flexShrink: 0 }}>
            LOCEPITA v0.2
          </div>
        </footer>
      </div>
    </>
  );
}
