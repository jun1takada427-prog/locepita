"use client";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

// ─────────────────────────────────────────────
// 型定義
// ─────────────────────────────────────────────
type AlertType = "tip" | "caution" | "check";
interface Alert { type: AlertType; headline: string; message: string; }
interface WardData {
  area_name: string;
  tags: string[];
  rent_tsubo: number;
  rent_level: number;
  customer_flow: number;
  subsidy_strength: number;
  garbage_ease: number;
  subsidy: { name: string; max_amount: number; merit: string; demerit: string; detail: string; };
  finance: { rate_display: string; rate_short: string; detail: string; };
  unique_policy: string;
  garbage_rule: string;
  health_center: { name: string; branches: string[]; note: string; };
  alert: Alert | null;
}
interface DiagnoseAnswers { budget?: string; style?: string; rent?: string; garbage?: string; }
interface ResultItem { ward: WardData; score: number; }

type WardNumericKey = "rent_level" | "customer_flow" | "subsidy_strength" | "garbage_ease";

// ─────────────────────────────────────────────
// グレインSVG（藍色ヘッダー用）
// ─────────────────────────────────────────────
const Grain = ({ opacity = 0.045 }: { opacity?: number }) => (
  <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%",
    opacity, pointerEvents: "none" }} xmlns="http://www.w3.org/2000/svg">
    <filter id="grain">
      <feTurbulence type="fractalNoise" baseFrequency="0.78" numOctaves="4" stitchTiles="stitch" />
      <feColorMatrix type="saturate" values="0" />
    </filter>
    <rect width="100%" height="100%" filter="url(#grain)" />
  </svg>
);

// ─────────────────────────────────────────────
// 全23区データ（家賃相場追加）
// ─────────────────────────────────────────────
const WARD_DATA: WardData[] = [
  {
    area_name: "千代田区", tags: ["都心", "オフィス街", "インバウンド", "高単価"],
    rent_tsubo: 55000, rent_level: 5, customer_flow: 5, subsidy_strength: 3, garbage_ease: 3,
    subsidy: { name: "東京都創業助成事業 + 専門家派遣", max_amount: 4000000,
      merit: "官公庁・大企業集積地で法人設立コスト優遇あり。TOKYO創業ステーション（丸の内）へのアクセス良好",
      demerit: "物件賃料が23区内最高水準。飲食向け特化補助金は少なく競合多数",
      detail: "助成率2/3。人件費・賃借料・広告費・設備費などが対象。創業5年未満が要件。" },
    finance: { rate_display: "本人負担 約0.4〜1.0%", rate_short: "0.4〜1.0%",
      detail: "特定創業支援等事業の証明書取得で都制度融資「創業」金利0.4%優遇。登録免許税半減（法人設立時）あり" },
    unique_policy: "起業家支援事業による専門家無料派遣。大手町・丸の内エリアはインバウンド需要が旺盛。TOKYO創業ステーション（丸の内）との連携が強い。",
    garbage_rule: "事業系一般廃棄物は原則、許可業者と個別契約必須。少量排出事業者は有料ごみ処理券（コンビニ等で購入）で区収集委託可。廃食油は専門業者委託必須。",
    health_center: { name: "千代田区保健所", branches: ["千代田保健所（九段南）"], note: "区全域を1保健所で管轄。飲食店営業許可申請の窓口は千代田保健所のみ" },
    alert: null
  },
  {
    area_name: "中央区", tags: ["都心", "食文化", "インバウンド", "市場近接"],
    rent_tsubo: 48000, rent_level: 5, customer_flow: 4, subsidy_strength: 3, garbage_ease: 3,
    subsidy: { name: "東京都創業助成事業 + HP作成補助", max_amount: 4000000,
      merit: "築地・日本橋エリアは食文化の集積地。食品卸・市場との連携しやすい立地メリットあり",
      demerit: "銀座・日本橋は賃料が最高水準。飲食特化の区独自大型補助金は少ない",
      detail: "東京都「創業助成事業」（最大400万円）に加え、区独自でホームページ作成補助（上限10万円程度）あり。" },
    finance: { rate_display: "本人負担 約0.4〜1.0%", rate_short: "0.4〜1.0%",
      detail: "中央区特定創業支援等事業を活用することで登録免許税半減・融資金利優遇を取得可能" },
    unique_policy: "築地場外市場周辺は食品関連創業の誘致に注力。日本橋商店街連盟との連携支援プログラムあり。",
    garbage_rule: "事業系ごみは許可業者との個別契約が原則。銀座・築地エリアは深夜のごみ出し禁止（近隣対応が厳格）。",
    health_center: { name: "中央区保健所", branches: ["中央区保健所（月島）"], note: "区全域を1保健所が管轄。食品営業許可申請窓口は保健所食品衛生係" },
    alert: null
  },
  {
    area_name: "港区", tags: ["高単価", "インバウンド", "賃料補助あり", "高所得層"],
    rent_tsubo: 45000, rent_level: 5, customer_flow: 4, subsidy_strength: 4, garbage_ease: 3,
    subsidy: { name: "港区新規開業賃料補助 + 東京都創業助成事業", max_amount: 4600000,
      merit: "区独自の賃料補助が最大12ヶ月利用可能。高所得者層が多いエリアで客単価設定しやすい",
      demerit: "賃料水準が非常に高く、補助額を差し引いても自己負担が大きい",
      detail: "東京都「創業助成事業」（最大400万円）に加え、港区独自の「新規開業賃料補助」（月額賃料の1/3・上限月5万円×最大12ヶ月）。" },
    finance: { rate_display: "本人負担 約0.4〜1.0%", rate_short: "0.4〜1.0%",
      detail: "港区産業振興センター・東京商工会議所港支部が実施する特定創業支援等事業修了で各種優遇措置取得可能" },
    unique_policy: "港区産業振興センターによる無料創業相談・専門家派遣。麻布・六本木・赤坂エリアへの飲食出店に有利な立地環境。",
    garbage_rule: "事業系ごみは許可業者との契約が基本。六本木・麻布地区は深夜・早朝のごみ出し規制が厳しい（地域ルールを事前確認必須）。",
    health_center: { name: "港区保健所", branches: ["港区保健所（三田）"], note: "区全域を1保健所が管轄。麻布・芝・高輪の各地区担当窓口あり" },
    alert: null
  },
  {
    area_name: "新宿区", tags: ["超低金利", "空き店舗補助", "商店街", "繁華街"],
    rent_tsubo: 32000, rent_level: 4, customer_flow: 5, subsidy_strength: 5, garbage_ease: 3,
    subsidy: { name: "新宿区経営力強化支援事業補助金 + 東京都創業助成事業", max_amount: 5000000,
      merit: "区独自の最大500万円補助金は23区内でも高水準。商店街空き店舗向け融資は利子・保証料全額補助という破格の条件",
      demerit: "競争率高く採択審査が厳しい。歌舞伎町周辺は深夜営業規制に注意が必要",
      detail: "新宿区独自「経営力強化支援事業補助金」（最大500万円、2025年度）に加え東京都「創業助成事業」（最大400万円）を活用可能。" },
    finance: { rate_display: "本人負担 実質0.2%（区が1.6%補給）", rate_short: "実質0.2%",
      detail: "新宿区の創業資金融資は本人負担金利が実質0.2%と23区最安水準。商店街空き店舗活用支援資金は利子・保証料全額補助。特定創業支援証明書で登録免許税が15万→7.5万に半減" },
    unique_policy: "「商店街空き店舗活用支援資金」で商店街の空き店舗に出店する創業者は利子・保証料が全額補助。新宿ビジネスプランコンテスト入賞で創業助成事業の申請要件を満たせる。",
    garbage_rule: "事業系ごみは許可業者との契約が原則。歌舞伎町・新宿三丁目は飲食店密集地のため収集時間の規制が厳格（近隣住民との調整が重要）。",
    health_center: { name: "新宿区保健所", branches: ["新宿区保健所（四谷）"], note: "区全域を1保健所で管轄。食品営業許可は保健所衛生課食品衛生係が担当" },
    alert: { type: "tip", headline: "23区最強の融資条件", message: "実質金利0.2%、商店街空き店舗なら利子・保証料を全額補助。融資コスト圧縮を最優先するなら新宿区は最有力候補です。" }
  },
  {
    area_name: "文京区", tags: ["文教", "学生需要", "ランチ需要", "比較的安価"],
    rent_tsubo: 22000, rent_level: 3, customer_flow: 3, subsidy_strength: 3, garbage_ease: 4,
    subsidy: { name: "東京都創業助成事業 + 創業相談支援", max_amount: 4000000,
      merit: "大学・文教施設が多くランチ・学生向け業態に向く。賃料が山手線内側比較で比較的抑えられる",
      demerit: "夜の繁華街が少なくディナー業態の集客には工夫が必要",
      detail: "東京都「創業助成事業」（最大400万円）が主軸。文京区独自の創業相談・セミナー支援あり。" },
    finance: { rate_display: "本人負担 約0.4〜1.0%", rate_short: "0.4〜1.0%",
      detail: "文京区特定創業支援等事業修了で各種融資優遇・登録免許税軽減の恩恵あり" },
    unique_policy: "「文の京」ブランドを活用した商店街活性化事業あり。本郷・湯島・小石川エリアの商店街活性化事業への参加で補助金申請要件を満たしやすい。",
    garbage_rule: "事業系ごみは許可業者との個別契約が基本。少量排出事業者は有料ごみ処理券で区収集委託可。プラ一括回収への対応が先進的。",
    health_center: { name: "文京区保健所", branches: ["文京区保健所（本駒込）"], note: "区全域を1保健所で管轄" },
    alert: null
  },
  {
    area_name: "台東区", tags: ["インバウンド", "浅草", "観光", "下町"],
    rent_tsubo: 20000, rent_level: 3, customer_flow: 4, subsidy_strength: 3, garbage_ease: 3,
    subsidy: { name: "台東区産業振興事業補助金 + 東京都創業助成事業", max_amount: 4000000,
      merit: "浅草・上野エリアはインバウンド需要が旺盛。観光業・飲食業に手厚い支援施策",
      demerit: "観光客依存のリスクあり。繁忙期・閑散期の差が大きい",
      detail: "東京都「創業助成事業」（最大400万円）に加え、台東区独自の産業振興補助金あり。観光業種に特化した支援プログラムが充実。" },
    finance: { rate_display: "本人負担 約0.4〜1.0%", rate_short: "0.4〜1.0%",
      detail: "台東区産業振興公社・東京商工会議所台東支部との連携による創業融資サポート" },
    unique_policy: "浅草観光連盟・台東区商店街連合会との連携による「下町飲食店開業支援」プログラム。インバウンド向けの多言語メニュー作成補助あり。",
    garbage_rule: "事業系ごみは許可業者との契約が基本。浅草エリアは観光地のため深夜・早朝のごみ出し規制が比較的厳格。",
    health_center: { name: "台東区保健所", branches: ["台東区保健所（東上野）"], note: "区全域を1保健所で管轄。浅草・上野エリアの飲食店許可申請を集中管理" },
    alert: null
  },
  {
    area_name: "墨田区", tags: ["スカイツリー", "インバウンド", "ブランド支援", "錦糸町"],
    rent_tsubo: 14000, rent_level: 2, customer_flow: 3, subsidy_strength: 3, garbage_ease: 4,
    subsidy: { name: "墨田区創業支援補助金 + 東京都創業助成事業", max_amount: 4000000,
      merit: "スカイツリー周辺の観光需要。区独自の「すみだブランド」認定でPR効果大",
      demerit: "都心と比べ交通アクセス面でやや不利。繁華街エリアは限定的",
      detail: "東京都「創業助成事業」（最大400万円）に加え、墨田区独自の展示会出展補助金あり。「すみだブランド」認定制度で地域密着型飲食店のPR支援も可能。" },
    finance: { rate_display: "本人負担 約0.4〜1.0%", rate_short: "0.4〜1.0%",
      detail: "墨田区産業振興センター（錦糸町）での創業相談・融資サポートあり" },
    unique_policy: "「すみだビジネスサポートセンター」による無料創業相談。錦糸町・押上エリアの商店街空き店舗活用支援。",
    garbage_rule: "事業系ごみは許可業者との契約が基本。少量排出事業者は有料ごみ処理券で区収集委託可。錦糸町繁華街周辺は深夜のごみ排出規制あり。",
    health_center: { name: "墨田区保健所", branches: ["墨田区保健所（向島）"], note: "区全域を1保健所で管轄" },
    alert: null
  },
  {
    area_name: "江東区", tags: ["湾岸", "再開発", "豊洲", "オフィス需要"],
    rent_tsubo: 14000, rent_level: 2, customer_flow: 3, subsidy_strength: 3, garbage_ease: 3,
    subsidy: { name: "江東区産業振興補助金 + 東京都創業助成事業", max_amount: 4000000,
      merit: "湾岸エリアの開発に伴い新規テナント需要が急増。豊洲・木場エリアでの飲食需要が高い",
      demerit: "エリアにより人口密度の差が大きく、立地選定が重要",
      detail: "東京都「創業助成事業」（最大400万円）が主軸。江東区独自の産業振興・商店街支援補助金あり。" },
    finance: { rate_display: "本人負担 約0.4〜1.0%", rate_short: "0.4〜1.0%",
      detail: "江東区産業振興公社による創業支援。東京商工会議所城東支部との連携サポートあり" },
    unique_policy: "豊洲・有明の湾岸開発エリアへの出店支援。「江東ビジネス創造センター」での創業相談。深川・門前仲町の商店街活性化事業との連動。",
    garbage_rule: "事業系ごみは許可業者との契約が基本。豊洲市場周辺は廃棄物処理の規制が特に厳格（市場関連廃棄物の分別徹底が求められる）。",
    health_center: { name: "江東区保健所", branches: ["江東区保健所（東陽）", "城東保健相談所"], note: "深川・城東の2エリアに分かれて食品営業許可等を担当" },
    alert: null
  },
  {
    area_name: "品川区", tags: ["再開発", "ランチ需要", "商店街", "戸越銀座"],
    rent_tsubo: 21000, rent_level: 3, customer_flow: 4, subsidy_strength: 3, garbage_ease: 4,
    subsidy: { name: "品川区創業支援事業補助金 + 東京都創業助成事業", max_amount: 4000000,
      merit: "品川駅周辺の再開発・オフィス集積でランチ需要が非常に高い。武蔵小山・戸越銀座商店街での飲食出店支援が充実",
      demerit: "品川駅周辺の賃料は高騰傾向。商店街エリアと品川駅周辺で客層が大きく異なる",
      detail: "東京都「創業助成事業」（最大400万円）が主軸。品川区独自の創業相談・専門家派遣支援あり。" },
    finance: { rate_display: "本人負担 約0.4〜1.0%", rate_short: "0.4〜1.0%",
      detail: "品川区産業振興センターによる融資相談サポートあり" },
    unique_policy: "戸越銀座・武蔵小山商店街での空き店舗活用支援が活発。東京都「商店街空き店舗活用事業」との連動。品川区「起業家支援事業」による専門家無料派遣。",
    garbage_rule: "事業系ごみは許可業者との契約が基本。少量排出事業者は有料ごみ処理券で区収集委託可。",
    health_center: { name: "品川区保健所", branches: ["品川区保健所（広町）"], note: "区全域を1保健所で管轄。大崎・品川・荏原の各地区に出張窓口あり" },
    alert: null
  },
  {
    area_name: "目黒区", tags: ["トレンド", "中目黒", "自由が丘", "高単価"],
    rent_tsubo: 28000, rent_level: 4, customer_flow: 4, subsidy_strength: 4, garbage_ease: 4,
    subsidy: { name: "東京都創業助成事業 + 若手・女性リーダー応援", max_amount: 8440000,
      merit: "中目黒・自由が丘はトレンド飲食の激戦区で集客力が高い。若手・女性向けプログラムと組み合わせると大型支援が得られる",
      demerit: "中目黒・代官山の賃料は都内でも最高水準。競合が非常に多い",
      detail: "東京都「創業助成事業」（最大400万円）に加え、商店街出店なら「若手・女性リーダー応援プログラム」（最大844万円）との組み合わせが可能。" },
    finance: { rate_display: "本人負担 約0.4〜1.0%", rate_short: "0.4〜1.0%",
      detail: "目黒区産業経済・雇用課での創業融資相談あり" },
    unique_policy: "目黒区商店街連合会と連携した空き店舗活用支援。自由が丘商店街（東京都チャレンジショップ「創の実」出店実績あり）での試験開業後の本格開業支援が充実。",
    garbage_rule: "事業系ごみは許可業者との契約が基本。分別はシンプルで比較的わかりやすい。少量排出事業者は有料ごみ処理券で区収集委託可。",
    health_center: { name: "目黒区保健所", branches: ["目黒区保健所（中目黒）"], note: "区全域を1保健所で管轄" },
    alert: null
  },
  {
    area_name: "大田区", tags: ["羽田", "インバウンド", "蒲田", "低賃料"],
    rent_tsubo: 13000, rent_level: 2, customer_flow: 3, subsidy_strength: 3, garbage_ease: 2,
    subsidy: { name: "大田区産業振興協会支援 + 東京都創業助成事業", max_amount: 4000000,
      merit: "蒲田エリアの商店街に空き店舗が多く出店コストを抑えやすい。羽田空港インバウンド需要を取り込める立地",
      demerit: "ゴミ分別が23区内でも厳格（紙パック・食品トレイの個別分別必須）",
      detail: "東京都「創業助成事業」（最大400万円）が主軸。大田区産業振興協会（PiO PARK）による独自支援・専門家派遣あり。" },
    finance: { rate_display: "本人負担 約0.4〜1.0%", rate_short: "0.4〜1.0%",
      detail: "大田区産業振興協会（PiO PARK）での創業融資相談・専門家派遣" },
    unique_policy: "蒲田・西蒲田商店街の空き店舗活用支援が活発。羽田空港近接エリアのインバウンド飲食需要取り込み支援。「大田区ビジネスプランコンテスト」入賞で創業助成事業の申請要件を満たせる。",
    garbage_rule: "23区内でも分別が最も細かい区のひとつ。紙パック・食品トレイを個別分別必須。廃食油は廃油収集専門業者への委託が特に重要。",
    health_center: { name: "大田区保健所", branches: ["大田区保健所（蒲田）", "糀谷・羽田特別出張所", "雪谷特別出張所"], note: "広域区のため出張窓口が複数あり。食品営業許可は本所または最寄りの出張窓口で" },
    alert: { type: "caution", headline: "開業前にゴミ分別ルールを確認しよう", message: "大田区は分別が23区最厳格クラス。食品トレイ・紙パック・廃食油の個別ルールを事前に把握しておくと、開業後のオペレーションがスムーズになります。" }
  },
  {
    area_name: "世田谷区", tags: ["下北沢", "三軒茶屋", "多商圏", "高所得層"],
    rent_tsubo: 19000, rent_level: 3, customer_flow: 4, subsidy_strength: 3, garbage_ease: 3,
    subsidy: { name: "世田谷区産業振興公社 創業支援 + 東京都創業助成事業", max_amount: 4000000,
      merit: "三軒茶屋・下北沢・二子玉川など多彩な商圏。区民所得が高く客単価を設定しやすい",
      demerit: "区が広大（23区最大）で商圏によって客層が全く異なる。保健所の支所ごとの管轄確認が必要",
      detail: "東京都「創業助成事業」（最大400万円）が主軸。8機関連携による創業支援体制が充実。" },
    finance: { rate_display: "本人負担 約0.4〜1.0%（地域信金との組み合わせ可）", rate_short: "0.4〜1.0%",
      detail: "世田谷信用金庫・昭和信用金庫の独自低利融資との組み合わせ可。駒澤大学・フリー株式会社との連携による財務・経営サポートプログラムが充実" },
    unique_policy: "8機関連携の創業支援ネットワーク（区内最大規模）。商店街の空き店舗活用に注力（三軒茶屋・下北沢・烏山エリア）。東京都チャレンジショップとの連動で試験開業が可能。",
    garbage_rule: "事業系ごみは許可業者との契約が基本。下北沢・三軒茶屋繁華街では早朝のごみ出し規制あり（近隣住民への配慮が重要）。",
    health_center: { name: "世田谷保健所", branches: ["世田谷", "北沢（下北沢）", "玉川（二子玉川）", "砧（成城）", "烏山（千歳烏山）"], note: "5支所体制。飲食店の食品営業許可は店舗所在地の支所管轄となる" },
    alert: { type: "check", headline: "申請前に保健所の管轄支所を確認しよう", message: "世田谷区は保健所が5支所に分かれています。店舗の住所エリアを確認してから申請窓口へ行くと、スムーズに手続きが進みます。" }
  },
  {
    area_name: "渋谷区", tags: ["ブランド", "スタートアップ", "恵比寿", "代官山"],
    rent_tsubo: 38000, rent_level: 5, customer_flow: 5, subsidy_strength: 3, garbage_ease: 3,
    subsidy: { name: "渋谷区創業支援補助金 + 東京都創業助成事業", max_amount: 4000000,
      merit: "渋谷・恵比寿・代官山のブランド力は最高水準。スタートアップ関連のネットワーク・コミュニティが豊富",
      demerit: "渋谷駅周辺の賃料は23区内最高水準。出店競争が激しい",
      detail: "東京都「創業助成事業」（最大400万円）が主軸。渋谷区独自の「スタートアップ支援」施策あり。" },
    finance: { rate_display: "本人負担 約0.4〜1.0%", rate_short: "0.4〜1.0%",
      detail: "渋谷区特定創業支援等事業修了で登録免許税半減・融資金利優遇" },
    unique_policy: "「渋谷スタートアップデッキ」との連携支援。恵比寿・代官山の商店街空き店舗活用支援。IT・クリエイティブ関連スタートアップ支援が最も手厚い。",
    garbage_rule: "事業系ごみは許可業者との契約が基本。渋谷駅周辺は繁華街・オフィス街が混在しており、ごみ出し時間帯の規制が厳格。",
    health_center: { name: "渋谷区保健所", branches: ["渋谷区保健所（広尾）"], note: "区全域を1保健所で管轄。代官山・恵比寿・原宿エリアすべてを同一窓口で対応" },
    alert: null
  },
  {
    area_name: "中野区", tags: ["再開発", "コスパ", "中野駅", "比較的安価"],
    rent_tsubo: 16000, rent_level: 2, customer_flow: 3, subsidy_strength: 3, garbage_ease: 4,
    subsidy: { name: "中野区創業支援補助金 + 東京都創業助成事業", max_amount: 4000000,
      merit: "中野駅周辺は再開発が進み新規テナント需要が急増中。賃料は渋谷・新宿比で抑えられる",
      demerit: "区独自の大型補助金は少なく、都の制度に依存する傾向",
      detail: "東京都「創業助成事業」（最大400万円）が主軸。中野区独自の商店街活性化支援あり。" },
    finance: { rate_display: "本人負担 約0.4〜1.0%", rate_short: "0.4〜1.0%",
      detail: "中野区産業振興センターによる創業融資相談・専門家派遣あり" },
    unique_policy: "中野駅前再開発エリアの新規テナント誘致支援。中野・鷺ノ宮・野方商店街の空き店舗活用支援。",
    garbage_rule: "事業系ごみは許可業者との契約が基本。少量排出事業者は有料ごみ処理券で区収集委託可。",
    health_center: { name: "中野区保健所", branches: ["中野区保健所（中野）"], note: "区全域を1保健所で管轄" },
    alert: null
  },
  {
    area_name: "杉並区", tags: ["高円寺", "荻窪", "賃料補助あり", "商店街"],
    rent_tsubo: 15000, rent_level: 2, customer_flow: 3, subsidy_strength: 4, garbage_ease: 3,
    subsidy: { name: "杉並区創業スタートアップ助成事業 + 東京都創業助成事業", max_amount: 4500000,
      merit: "区独自の賃料補助とWeb制作補助の組み合わせが飲食店の初期費用軽減に有効",
      demerit: "助成額は他区比較で比較的少額。荻窪・高円寺エリアは家賃比較的安価だが集客力の差が大きい",
      detail: "東京都「創業助成事業」（最大400万円）に加え、杉並区独自の「創業スタートアップ助成事業」（事務所家賃助成：上限30万円、ホームページ作成助成：上限20万円）。" },
    finance: { rate_display: "本人負担 約0.4〜1.0%", rate_short: "0.4〜1.0%",
      detail: "杉並区産業振興センター（阿佐ケ谷）での創業融資相談あり" },
    unique_policy: "高円寺・阿佐ケ谷・荻窪の各商店街と連携した空き店舗活用支援。「杉並区ビジネスチャレンジ補助金」で事業計画認定を受けた創業者に対する専門家派遣。",
    garbage_rule: "事業系ごみは許可業者との契約が基本。古布・使用済み食用油の分別回収が比較的厳格。",
    health_center: { name: "杉並区保健所", branches: ["杉並区保健所（荻窪）"], note: "区全域を1保健所で管轄。高円寺・荻窪・阿佐ケ谷・西荻窪は同一管轄" },
    alert: null
  },
  {
    area_name: "豊島区", tags: ["池袋", "大集客", "若者", "アニメ文化"],
    rent_tsubo: 22000, rent_level: 3, customer_flow: 5, subsidy_strength: 3, garbage_ease: 3,
    subsidy: { name: "豊島区中小企業支援補助金 + 東京都創業助成事業", max_amount: 4000000,
      merit: "池袋駅の圧倒的集客力（乗降客数全国上位）。女性・若者向け業態に有利",
      demerit: "池袋駅周辺の賃料は上昇傾向。繁華街エリアの競合が非常に多い",
      detail: "東京都「創業助成事業」（最大400万円）に加え、豊島区独自のホームページ作成補助金・専門家無料派遣あり。" },
    finance: { rate_display: "本人負担 約0.4〜1.0%", rate_short: "0.4〜1.0%",
      detail: "豊島区特定創業支援等事業の専門相談員による個別面談（証明書取得で各種融資優遇・登録免許税半減）" },
    unique_policy: "「豊島区にぎわいづくり推進事業」との連動。サンシャインシティ周辺・池袋商店街の空き店舗活用支援。アニメ・マンガ文化との融合業態（コンセプトカフェ等）への支援実績あり。",
    garbage_rule: "事業系ごみは許可業者との契約が基本。池袋繁華街は深夜のごみ出し規制が厳格。",
    health_center: { name: "豊島区保健所", branches: ["豊島区保健所（雑司が谷）"], note: "区全域を1保健所で管轄" },
    alert: null
  },
  {
    area_name: "北区", tags: ["物件マッチング支援", "赤羽", "空き店舗", "低賃料"],
    rent_tsubo: 13000, rent_level: 2, customer_flow: 3, subsidy_strength: 4, garbage_ease: 4,
    subsidy: { name: "北区商店街空き店舗活用支援事業補助金 + 東京都創業助成事業", max_amount: 4200000,
      merit: "23区内でも独自の空き店舗活用補助金（改修費200万円上限）が充実。不動産業団体との包括連携で物件探しも公的に支援",
      demerit: "赤羽・王子エリアは賑わいがあるが、エリアによって客足の差が大きい",
      detail: "東京都「創業助成事業」（最大400万円）に加え、北区独自「商店街空き店舗活用支援事業」（改修費の2/3・上限200万円＋家賃補助最大2年間）。" },
    finance: { rate_display: "本人負担 約0.4〜1.0%", rate_short: "0.4〜1.0%",
      detail: "北区産業振興公社による創業相談・融資サポート。地元信金との連携融資あり" },
    unique_policy: "区内不動産業団体（全日本不動産協会城北支部・東京都宅建業協会第九ブロック）との包括連携協定で空き店舗物件マッチングを公的に支援（23区内でも珍しい制度）。",
    garbage_rule: "事業系ごみは許可業者との契約が基本。少量排出事業者は有料ごみ処理券で区収集委託可。",
    health_center: { name: "北区保健所", branches: ["北区保健所（王子）"], note: "区全域を1保健所で管轄。赤羽・滝野川・王子エリアすべて同一窓口" },
    alert: { type: "tip", headline: "物件探しも公的にサポートしてもらえる", message: "不動産業団体との包括連携協定で、商店街の空き店舗物件を公的に紹介してもらえます。23区内でも珍しい制度で、物件選びの手間を大幅に減らせます。" }
  },
  {
    area_name: "荒川区", tags: ["日暮里", "賃料補助あり", "低賃料", "下町"],
    rent_tsubo: 11000, rent_level: 2, customer_flow: 2, subsidy_strength: 3, garbage_ease: 4,
    subsidy: { name: "荒川区事務所賃料補助 + 東京都創業助成事業", max_amount: 4000000,
      merit: "荒川区独自の賃料補助が飲食店の初期コスト削減に直接効く。23区内でも家賃水準が比較的抑えられる",
      demerit: "繁華街・集客スポットが限定的。日暮里・町屋エリアに集中している",
      detail: "東京都「創業助成事業」（最大400万円）に加え、荒川区独自の「事務所賃料補助」（月額賃料の一部補助）あり。" },
    finance: { rate_display: "本人負担 約0.4〜1.0%", rate_short: "0.4〜1.0%",
      detail: "荒川区産業振興センター（日暮里）での創業融資相談あり" },
    unique_policy: "日暮里繊維街・荒川商店街との連動支援。荒川区「あらかわ産業フェア」への飲食店出展補助。コミュニティビジネス支援事業あり。",
    garbage_rule: "事業系ごみは許可業者との契約が基本。少量排出事業者は有料ごみ処理券で区収集委託可。",
    health_center: { name: "荒川区保健所", branches: ["荒川区保健所（荒川）"], note: "区全域を1保健所で管轄" },
    alert: null
  },
  {
    area_name: "板橋区", tags: ["大山", "低賃料", "商店街", "住宅地"],
    rent_tsubo: 11000, rent_level: 2, customer_flow: 2, subsidy_strength: 3, garbage_ease: 4,
    subsidy: { name: "板橋区産業振興補助金 + 東京都創業助成事業", max_amount: 4000000,
      merit: "大山・ときわ台・成増エリアの商店街は空き店舗が多く出店コストを抑えやすい。区全体の賃料水準が比較的低い",
      demerit: "都心へのアクセスで池袋乗り換えが必要なエリアが多く、集客に工夫が必要",
      detail: "東京都「創業助成事業」（最大400万円）が主軸。板橋区独自の産業振興補助金・商店街活性化支援あり。" },
    finance: { rate_display: "本人負担 約0.4〜1.0%", rate_short: "0.4〜1.0%",
      detail: "板橋区産業振興公社での創業相談・融資サポートあり" },
    unique_policy: "大山商店街（ハッピーロード）等の活性化事業に連動した飲食出店支援。「板橋ビジネスグランプリ」入賞で創業助成事業申請要件を満たせる。",
    garbage_rule: "事業系ごみは許可業者との契約が基本。少量排出事業者は有料ごみ処理券で区収集委託可。",
    health_center: { name: "板橋区保健所", branches: ["板橋区保健所（板橋）"], note: "区全域を1保健所で管轄" },
    alert: null
  },
  {
    area_name: "練馬区", tags: ["地産地消", "農地連携", "住宅地", "人口最多"],
    rent_tsubo: 11000, rent_level: 2, customer_flow: 2, subsidy_strength: 3, garbage_ease: 2,
    subsidy: { name: "練馬区創業支援補助金 + 東京都創業助成事業", max_amount: 4000000,
      merit: "23区内で人口最多。大泉学園・石神井公園エリアは地域密着型飲食店の安定収益が見込める。農地連携で地産地消業態に有利",
      demerit: "ごみ分別が23区内で最も細かい。古着・古布・使用済み食用油の個別分別あり",
      detail: "東京都「創業助成事業」（最大400万円）が主軸。練馬区独自の農と食の連携飲食事業支援あり。" },
    finance: { rate_display: "本人負担 約0.4〜1.0%", rate_short: "0.4〜1.0%",
      detail: "練馬区産業振興センターでの創業融資相談あり" },
    unique_policy: "練馬区の豊富な農地を活用した「農と食の連携」飲食事業支援（地産地消飲食店への助成プログラムあり）。大泉学園・石神井公園の商店街空き店舗活用支援。",
    garbage_rule: "23区内でも分別ルールが最も細かい区のひとつ。古着・古布・使用済み食用油を個別分別。廃食油は廃油収集業者への委託が特に重要。",
    health_center: { name: "練馬区保健所", branches: ["練馬区保健所（豊玉）", "光が丘保健相談所", "石神井保健相談所"], note: "練馬・光が丘・石神井の3エリアに分かれて管轄。店舗所在地に応じた担当保健相談所を確認すること" },
    alert: { type: "caution", headline: "分別ルールと保健所の両方を事前チェック", message: "練馬区はゴミ分別が最厳格クラス、かつ保健所が3か所に分かれています。開業前にルールを把握しておくと、オペレーション設計がスムーズになります。" }
  },
  {
    area_name: "足立区", tags: ["低賃料", "北千住", "学生需要", "デリバリー向き"],
    rent_tsubo: 9000, rent_level: 1, customer_flow: 3, subsidy_strength: 3, garbage_ease: 5,
    subsidy: { name: "足立区産業振興補助金 + 東京都創業助成事業", max_amount: 4000000,
      merit: "23区内で家賃・物件取得コストが最も安い水準。北千住エリアは学生・若年層向けに集客力が急増中",
      demerit: "区の北部エリアは集客力が限定的。フードデリバリー需要の活用を組み合わせるのが現実的",
      detail: "東京都「創業助成事業」（最大400万円）が主軸。足立区独自の商店街支援・産業振興補助金あり。" },
    finance: { rate_display: "本人負担 約0.4〜1.0%", rate_short: "0.4〜1.0%",
      detail: "足立区産業振興センター（北千住）での創業融資相談あり" },
    unique_policy: "北千住エリアの大学誘致に伴う学生向け飲食需要の拡大支援。足立区「あだちビジネスチャンス補助金」で飲食業も対象に。商店街の空き店舗を活用した出店支援が充実。",
    garbage_rule: "事業系ごみは許可業者との契約が基本。足立区は分別がシンプルで比較的わかりやすい（23区内でも管理しやすい部類）。",
    health_center: { name: "足立区保健所", branches: ["足立区保健所（中央本町）", "竹の塚保健センター"], note: "区の広さに応じて竹の塚方面に保健センターあり" },
    alert: null
  },
  {
    area_name: "葛飾区", tags: ["低賃料", "柴又", "観光", "地域密着"],
    rent_tsubo: 9000, rent_level: 1, customer_flow: 2, subsidy_strength: 3, garbage_ease: 4,
    subsidy: { name: "葛飾区産業振興補助金 + 東京都創業助成事業", max_amount: 4000000,
      merit: "23区内でも家賃が安く初期費用を大幅に抑えられる。葛飾区商工会議所による創業支援が充実",
      demerit: "繁華街・集客スポットが少なく、地域密着型業態に適した立地選定が必要",
      detail: "東京都「創業助成事業」（最大400万円）が主軸。葛飾区独自の産業振興補助金・商店街活性化支援あり。" },
    finance: { rate_display: "本人負担 約0.4〜1.0%", rate_short: "0.4〜1.0%",
      detail: "葛飾区産業経済課・葛飾商工会議所との連携サポートあり" },
    unique_policy: "柴又・亀有エリアの観光資源（「こち亀」・帝釈天）を活用した飲食出店支援。葛飾区「ものづくり産業特区」で近隣の製造業従事者向けランチ需要の取り込みが可能。",
    garbage_rule: "事業系ごみは許可業者との契約が基本。少量排出事業者は有料ごみ処理券で区収集委託可。",
    health_center: { name: "葛飾区保健所", branches: ["葛飾区保健所（立石）", "金町保健センター"], note: "立石エリアと金町エリアに分かれて管轄。店舗所在地の担当を確認すること" },
    alert: null
  },
  {
    area_name: "江戸川区", tags: ["低賃料", "エスニック", "多文化", "広い物件"],
    rent_tsubo: 9000, rent_level: 1, customer_flow: 2, subsidy_strength: 3, garbage_ease: 4,
    subsidy: { name: "江戸川区産業振興補助金 + 東京都創業助成事業", max_amount: 4000000,
      merit: "23区内でも家賃水準が低く、広い物件を確保しやすい。インド・中国・韓国系居住者が多くエスニック系飲食業態での差別化出店に有利",
      demerit: "都心へのアクセスがやや遠く、ランチ以外の集客に工夫が必要",
      detail: "東京都「創業助成事業」（最大400万円）が主軸。江戸川区独自の産業振興補助金あり。" },
    finance: { rate_display: "本人負担 約0.4〜1.0%", rate_short: "0.4〜1.0%",
      detail: "江戸川区産業振興課・東京商工会議所江戸川支部との連携サポートあり" },
    unique_policy: "小岩・篠崎・葛西商店街の空き店舗活用支援。インド・中国・韓国系居住者が多くエスニック系飲食業態での差別化出店に有利。事業系一般廃棄物の清掃工場自己搬入が可能。",
    garbage_rule: "事業系ごみは許可業者との契約が基本。少量排出事業者は有料ごみ処理券で区収集委託可。事業系一般廃棄物の清掃工場への自己搬入が可能（少量なら便利）。",
    health_center: { name: "江戸川区保健所", branches: ["江戸川保健所（中央）", "小岩健康サポートセンター", "葛西健康サポートセンター", "篠崎健康サポートセンター"], note: "広大な区域を複数の健康サポートセンターでカバー。食品営業許可は本所（中央）または担当センターへ" },
    alert: null
  }
];

// ─────────────────────────────────────────────
// 診断ロジック
// ─────────────────────────────────────────────
const DIAGNOSE_QS = [
  { id: "budget", q: "初期費用の予算感は？",
    opts: [{ l: "300万円未満で最小限に", v: "tight" }, { l: "300〜700万円（標準的）", v: "normal" }, { l: "700万円以上でしっかり投資", v: "rich" }] },
  { id: "style", q: "どんなお店を開きたいですか？",
    opts: [{ l: "地域に根ざした常連重視型", v: "local" }, { l: "トレンドを掴む集客最大化型", v: "trend" }, { l: "インバウンド・観光客向け", v: "inbound" }, { l: "テイクアウト・デリバリー主体", v: "delivery" }] },
  { id: "rent", q: "家賃コストへの考え方は？",
    opts: [{ l: "できるだけ抑えたい", v: "low" }, { l: "相場なら許容できる", v: "mid" }, { l: "立地を優先したい", v: "high" }] },
  { id: "garbage", q: "ゴミ・オペレーション管理の得意度は？",
    opts: [{ l: "シンプルにしたい", v: "simple" }, { l: "複雑なルールも対応できる", v: "strict" }] }
];

function diagnose(a: DiagnoseAnswers): ResultItem[] {
  return WARD_DATA.map(w => {
    let s = 0;
    const maxM = w.subsidy.max_amount / 10000;
    if (a.budget === "tight")  s += maxM >= 400 ? 2 : 1;
    if (a.budget === "normal") s += w.subsidy_strength * 0.8;
    if (a.budget === "rich")   s += w.subsidy_strength;
    if (a.style === "local")    s += (6 - w.rent_level) * 0.8;
    if (a.style === "trend")    s += w.customer_flow * 0.9;
    if (a.style === "inbound")  { if (w.tags.includes("インバウンド")) s += 3; }
    if (a.style === "delivery") { s += (6 - w.rent_level); if (w.tags.includes("低賃料")) s += 2; }
    if (a.rent === "low")  s += (6 - w.rent_level) * 1.2;
    if (a.rent === "mid")  s += 3;
    if (a.rent === "high") s += w.customer_flow;
    if (a.garbage === "simple") s += w.garbage_ease;
    if (a.garbage === "strict") s += 3;
    return { ward: w, score: s };
  }).sort((a, b) => b.score - a.score).slice(0, 5);
}

// ─────────────────────────────────────────────
// 定数・スタイル
// ─────────────────────────────────────────────
const INK = "#1e293b";
const AMBER = "#fbbf24";
const AMBER_DIM = "#d97706";

const ALERT_STYLE: Record<AlertType, { bg: string; border: string; icon: string; headCol: string; bodyCol: string }> = {
  tip:     { bg: "#fffbeb", border: "#fde68a", icon: "★", headCol: "#92400e", bodyCol: "#78350f" },
  caution: { bg: "#fff7ed", border: "#fed7aa", icon: "◎", headCol: "#9a3412", bodyCol: "#7c2d12" },
  check:   { bg: "#f0fdf4", border: "#bbf7d0", icon: "✓", headCol: "#166534", bodyCol: "#14532d" },
};

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400;700;900&family=Zen+Kaku+Gothic+New:wght@400;500;700&display=swap');
  * { box-sizing: border-box; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 2px; }
  .ward-btn:hover { background: rgba(255,255,255,0.12) !important; }
  .opt-btn:hover { border-color: ${AMBER} !important; background: #fffbeb !important; color: #92400e !important; }
  .tab-btn:hover { opacity: 0.85; }
  @media (max-width: 768px) {
    .root-layout { flex-direction: column !important; }
    .sidebar { width: 100% !important; min-width: 0 !important; }
    .ward-grid { display: grid !important; grid-template-columns: repeat(3,1fr) !important; gap: 4px !important; }
    .cards-wrap { flex-direction: column !important; }
    .header-row { flex-direction: column !important; align-items: flex-start !important; gap: 10px !important; }
    .pad { padding: 16px !important; }
    .tab-row { overflow-x: auto; }
    .cmp-grid { grid-template-columns: 1fr !important; }
    .metric-row { grid-template-columns: 1fr 1fr !important; }
  }
  @media (max-width: 480px) {
    .ward-grid { grid-template-columns: repeat(2,1fr) !important; }
  }
`;

// ─────────────────────────────────────────────
// AlertBanner
// ─────────────────────────────────────────────
function AlertBanner({ alert }: { alert: Alert | null }) {
  if (!alert) return null;
  const s = ALERT_STYLE[alert.type];
  return (
    <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
      style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: 10,
        padding: "12px 14px", marginBottom: 16, display: "flex", gap: 10 }}>
      <span style={{ fontSize: 13, color: s.headCol, flexShrink: 0 }}>{s.icon}</span>
      <div>
        <p style={{ margin: "0 0 3px", fontSize: 12, fontWeight: 700, color: s.headCol }}>{alert.headline}</p>
        <p style={{ margin: 0, fontSize: 11, color: s.bodyCol, lineHeight: 1.7 }}>{alert.message}</p>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// MetricBar（家賃 vs 補助金 視覚化）
// ─────────────────────────────────────────────
function MetricBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10,
        color: "rgba(255,255,255,0.5)", marginBottom: 4 }}>
        <span style={{ letterSpacing: "0.08em" }}>{label}</span>
        <span style={{ fontWeight: 600, color: "rgba(255,255,255,0.7)" }}>{value.toLocaleString()}</span>
      </div>
      <div style={{ height: 4, background: "rgba(255,255,255,0.1)", borderRadius: 2, overflow: "hidden" }}>
        <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }}
          transition={{ duration: 1.0, ease: "circOut" }}
          style={{ height: "100%", background: color, borderRadius: 2 }} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// DataCard
// ─────────────────────────────────────────────
function DataCard({ ward, isCompare }: { ward: WardData | null; isCompare: boolean }) {
  const [open, setOpen] = useState<string | null>(null);
  const toggle = (k: string) => setOpen(open === k ? null : k);

  if (!ward) return (
    <div style={{ flex: 1, background: "white", border: "1.5px dashed #e2e8f0",
      borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center",
      color: "#94a3b8", fontSize: 13, minHeight: 400, padding: 24 }}>
      比較する区を選択してください
    </div>
  );

  const maxM = Math.round(ward.subsidy.max_amount / 10000);
  const accentCol = isCompare ? "#3b82f6" : AMBER_DIM;
  const accentBg  = isCompare ? "#eff6ff" : "#fffbeb";
  const accentBrd = isCompare ? "#bfdbfe" : "#fde68a";

  const Sec = ({ id, label, children }: { id: string; label: string; children: React.ReactNode }) => (
    <div style={{ borderTop: "1px solid #f1f5f9" }}>
      <button onClick={() => toggle(id)} style={{
        width: "100%", background: "none", border: "none", cursor: "pointer",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "10px 0", color: "#64748b", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em"
      }}>
        <span>{label}</span>
        <motion.span animate={{ rotate: open === id ? 180 : 0 }} transition={{ duration: 0.2 }}
          style={{ display: "block", fontSize: 10 }}>▾</motion.span>
      </button>
      <AnimatePresence>
        {open === id && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }}
            style={{ overflow: "hidden", paddingBottom: 12 }}>
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <motion.div key={ward.area_name}
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      style={{ flex: 1, background: "white", borderRadius: 18, overflow: "hidden",
        border: `1.5px solid ${accentBrd}`, minWidth: 0,
        boxShadow: "0 2px 8px rgba(0,0,0,0.05), 0 8px 24px rgba(0,0,0,0.04)" }}>

      {/* インクヘッダー部分（藍色 + グレイン） */}
      <div style={{ background: INK, padding: "20px 22px", position: "relative", overflow: "hidden" }}>
        <Grain opacity={0.05} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "inline-block", fontSize: 9, fontWeight: 700, letterSpacing: "0.12em",
            color: isCompare ? "#93c5fd" : AMBER, marginBottom: 8 }}>
            {isCompare ? "▶ 比較対象" : "▶ 選択中"}
          </div>
          <h3 style={{ fontSize: 28, fontWeight: 900, color: "white", margin: "0 0 10px",
            fontFamily: "'Noto Serif JP', serif", letterSpacing: "-0.02em" }}>{ward.area_name}</h3>
          {/* タグ */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 14 }}>
            {ward.tags.map(t => (
              <span key={t} style={{ fontSize: 9, padding: "2px 7px", borderRadius: 20,
                background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.14)",
                color: "rgba(255,255,255,0.55)", letterSpacing: "0.04em" }}>{t}</span>
            ))}
          </div>
          {/* 家賃 vs 補助金バー */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <MetricBar label="想定坪単価（円）" value={ward.rent_tsubo} max={60000} color="rgba(248,113,113,0.7)" />
            <MetricBar label="最大補助額（万円）" value={maxM} max={900} color={isCompare ? "#60a5fa" : AMBER} />
          </div>
        </div>
      </div>

      {/* ホワイト本文部分 */}
      <div style={{ padding: "18px 22px" }}>
        <AlertBanner alert={ward.alert} />

        {/* 補助金サマリー */}
        <div style={{ background: accentBg, border: `1px solid ${accentBrd}`, borderRadius: 12,
          padding: "14px", marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: accentCol, letterSpacing: "0.08em" }}>最大補助額</span>
            <span style={{ fontSize: 26, fontWeight: 900, color: accentCol, letterSpacing: "-0.03em" }}>{maxM}万円</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <div style={{ background: "white", borderRadius: 8, padding: "9px 10px" }}>
              <p style={{ margin: "0 0 3px", fontSize: 9, fontWeight: 700, color: "#16a34a", letterSpacing: "0.06em" }}>STRATEGY</p>
              <p style={{ margin: 0, fontSize: 10, color: "#166534", lineHeight: 1.7 }}>{ward.subsidy.merit}</p>
            </div>
            <div style={{ background: "white", borderRadius: 8, padding: "9px 10px" }}>
              <p style={{ margin: "0 0 3px", fontSize: 9, fontWeight: 700, color: "#ea580c", letterSpacing: "0.06em" }}>CAUTION</p>
              <p style={{ margin: 0, fontSize: 10, color: "#9a3412", lineHeight: 1.7 }}>{ward.subsidy.demerit}</p>
            </div>
          </div>
        </div>

        {/* 融資 */}
        <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10,
          padding: "11px 13px", marginBottom: 12 }}>
          <p style={{ margin: "0 0 2px", fontSize: 9, fontWeight: 700, color: "#64748b", letterSpacing: "0.08em" }}>融資・利子補給</p>
          <p style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 800, color: "#2563eb" }}>{ward.finance.rate_display}</p>
          <p style={{ margin: 0, fontSize: 10, color: "#475569", lineHeight: 1.6 }}>{ward.finance.detail}</p>
        </div>

        {/* アコーディオン */}
        <Sec id="policy" label="独自施策">
          <p style={{ margin: 0, fontSize: 11, color: "#334155", lineHeight: 1.8 }}>{ward.unique_policy}</p>
        </Sec>
        <Sec id="garbage" label="ゴミ出しルール（事業系）">
          <p style={{ margin: 0, fontSize: 11, color: "#334155", lineHeight: 1.8 }}>{ward.garbage_rule}</p>
        </Sec>
        <Sec id="health" label="保健所管轄">
          <p style={{ margin: "0 0 6px", fontSize: 13, fontWeight: 700, color: "#1e293b" }}>{ward.health_center.name}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 6 }}>
            {ward.health_center.branches.map(b => (
              <span key={b} style={{ fontSize: 9, padding: "2px 7px", borderRadius: 4,
                background: "#f1f5f9", border: "1px solid #e2e8f0", color: "#475569" }}>{b}</span>
            ))}
          </div>
          <p style={{ margin: 0, fontSize: 10, color: "#64748b", lineHeight: 1.6 }}>{ward.health_center.note}</p>
        </Sec>
        <Link href={`/sim?area=${encodeURIComponent(ward.area_name)}`}
          style={{ display: "block", marginTop: 12, padding: "10px",
            background: "#fffbeb", border: "1px solid #fde68a",
            borderRadius: 8, textAlign: "center", fontSize: 12,
            fontWeight: 700, color: "#d97706", textDecoration: "none" }}>
          このエリアで費用をシミュレーションする →
        </Link>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// 診断
// ─────────────────────────────────────────────
function DiagnosePanel({ onResult }: { onResult: (r: ResultItem[]) => void }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<DiagnoseAnswers>({});
  const q = DIAGNOSE_QS[step];
  const isLast = step === DIAGNOSE_QS.length - 1;
  const choose = (v: string) => {
    const next = { ...answers, [q.id]: v };
    if (isLast) { onResult(diagnose(next)); }
    else { setAnswers(next); setStep(s => s + 1); }
  };
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ maxWidth: 520, margin: "0 auto" }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.12em" }}>
            STEP {step + 1} / {DIAGNOSE_QS.length}
          </span>
        </div>
        <div style={{ height: 3, background: "#f1f5f9", borderRadius: 2, overflow: "hidden", marginBottom: 20 }}>
          <motion.div animate={{ width: `${((step + 1) / DIAGNOSE_QS.length) * 100}%` }}
            style={{ height: "100%", background: AMBER, borderRadius: 2 }} />
        </div>
        <AnimatePresence mode="wait">
          <motion.p key={step} initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -14 }} transition={{ duration: 0.2 }}
            style={{ fontSize: 18, fontWeight: 800, color: INK, margin: "0 0 18px",
              fontFamily: "'Noto Serif JP', serif", lineHeight: 1.5, letterSpacing: "-0.02em" }}>
            {q.q}
          </motion.p>
        </AnimatePresence>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {q.opts.map(opt => (
          <motion.button key={opt.v} className="opt-btn" whileHover={{ x: 4 }} onClick={() => choose(opt.v)} style={{
            padding: "13px 18px", borderRadius: 10, textAlign: "left", cursor: "pointer",
            background: "white", border: "1.5px solid #e2e8f0",
            color: "#334155", fontSize: 14, fontWeight: 500, lineHeight: 1.5, transition: "all 0.15s"
          }}>
            {opt.l}
          </motion.button>
        ))}
      </div>
      {step > 0 && (
        <button onClick={() => setStep(s => s - 1)} style={{
          marginTop: 14, background: "none", border: "none", color: "#94a3b8", fontSize: 11, cursor: "pointer"
        }}>← 前の質問に戻る</button>
      )}
    </motion.div>
  );
}

function DiagnoseResult({ results, onSelect, onReset }: {
  results: ResultItem[]; onSelect: (n: string) => void; onReset: () => void;
}) {
  const medals = ["1st", "2nd", "3rd", "4th", "5th"];
  const colors  = [AMBER_DIM, "#94a3b8", "#b45309", "#64748b", "#64748b"];
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      style={{ maxWidth: 540, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <h3 style={{ fontSize: 16, fontWeight: 800, color: INK, margin: 0, fontFamily: "'Noto Serif JP', serif" }}>
          あなたにおすすめのエリア
        </h3>
        <button onClick={onReset} style={{ fontSize: 11, color: "#94a3b8", background: "none", border: "none", cursor: "pointer" }}>
          もう一度診断
        </button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {results.map(({ ward, score }, i) => (
          <motion.button key={ward.area_name} initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
            whileHover={{ x: 4 }} onClick={() => onSelect(ward.area_name)} style={{
              padding: "13px 16px", borderRadius: 12, cursor: "pointer", textAlign: "left",
              background: i === 0 ? "#fffbeb" : "white",
              border: `1.5px solid ${i === 0 ? "#fde68a" : "#f1f5f9"}`,
              display: "flex", alignItems: "center", gap: 12, transition: "all 0.15s"
            }}>
            <span style={{ fontSize: 10, fontWeight: 800, color: colors[i], width: 26, flexShrink: 0 }}>
              {medals[i]}
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 800, color: INK }}>{ward.area_name}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {ward.tags.slice(0, 3).map(t => (
                  <span key={t} style={{ fontSize: 9, padding: "1px 6px", borderRadius: 10,
                    background: "#f1f5f9", color: "#64748b" }}>{t}</span>
                ))}
              </div>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <p style={{ margin: 0, fontSize: 18, fontWeight: 900, color: i === 0 ? AMBER_DIM : "#94a3b8" }}>
                {Math.round(score)}
              </p>
              <p style={{ margin: 0, fontSize: 9, color: "#94a3b8" }}>score</p>
            </div>
          </motion.button>
        ))}
      </div>
      <p style={{ fontSize: 10, color: "#94a3b8", marginTop: 10, lineHeight: 1.8 }}>
        区名をクリックするとエリア詳細が開きます。スコアは入力条件の重み付けによる参考値です。
      </p>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// 共通制度パネル
// ─────────────────────────────────────────────
function CommonPanel() {
  const items = [
    { bg: "#fffbeb", bd: "#fde68a", hc: "#92400e", bc: "#78350f",
      title: "東京都 創業助成事業", sub: "全区共通・最大400万円",
      body: "助成率2/3。人件費・賃借料・広告費・設備費などが対象。都内創業予定または創業5年未満が要件。TOKYO創業ステーションでの事業計画書策定支援修了が申請要件の一つ。" },
    { bg: "#f0fdf4", bd: "#bbf7d0", hc: "#166534", bc: "#14532d",
      title: "若手・女性リーダー応援プログラム", sub: "商店街出店で最大844万円",
      body: "商店街に出店する39歳以下男性または女性が対象。店舗工事費＋家賃最大3年分を補助。商店街起業・承継支援事業（最大250万円）と組み合わせ可。都内商店街が前提条件。" },
    { bg: "#eff6ff", bd: "#bfdbfe", hc: "#1e40af", bc: "#1e3a8a",
      title: "特定創業支援等事業", sub: "全区共通・証明書取得で優遇",
      body: "各区のセミナー修了で「証明書」を取得すると、東京都制度融資「創業」の金利が0.4%優遇、法人設立時の登録免許税が半減（15万→7.5万円）される。" },
    { bg: "#fff7ed", bd: "#fed7aa", hc: "#9a3412", bc: "#7c2d12",
      title: "事業系ゴミ 共通ルール", sub: "全23区に共通する基礎知識",
      body: "23区すべてで事業系ごみは原則「許可業者との個別契約」。少量排出の飲食店は有料ごみ処理券（コンビニ等で購入）を使い区収集に委託可能。廃食油は専門業者への委託が全区共通で必須。" },
  ];
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      style={{ maxWidth: 900, margin: "0 auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
        {items.map(it => (
          <div key={it.title} style={{ background: it.bg, border: `1px solid ${it.bd}`, borderRadius: 12, padding: "15px 16px" }}>
            <p style={{ margin: "0 0 2px", fontSize: 13, fontWeight: 800, color: it.hc }}>{it.title}</p>
            <p style={{ margin: "0 0 8px", fontSize: 10, fontWeight: 600, color: it.bc, opacity: 0.65 }}>{it.sub}</p>
            <p style={{ margin: 0, fontSize: 11, color: it.bc, lineHeight: 1.85 }}>{it.body}</p>
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
  const [selected, setSelected] = useState<string | null>(null);
  const [compare, setCompare]   = useState<string | null>(null);
  const [mode, setMode]         = useState<"single" | "compare">("single");
  const [tab, setTab]           = useState<"browse" | "diagnose" | "common">("browse");
  const [diagResults, setDiagResults] = useState<ResultItem[] | null>(null);
  const [diagKey, setDiagKey]         = useState(0);

  const selWard = WARD_DATA.find(w => w.area_name === selected) || null;
  const cmpWard = WARD_DATA.find(w => w.area_name === compare)  || null;

  const pick = (name: string) => {
    if (mode === "single") { setSelected(name); }
    else {
      if (!selected)          { setSelected(name); return; }
      if (name === selected)  { setSelected(null); setCompare(null); return; }
      if (name === compare)   { setCompare(null); return; }
      if (!compare)           { setCompare(name); return; }
      setCompare(name);
    }
    setTab("browse");
  };

  const TabBtn = ({ id, label }: { id: "browse" | "diagnose" | "common"; label: string }) => (
    <button className="tab-btn" onClick={() => setTab(id)} style={{
      padding: "10px 16px", background: "none", border: "none", cursor: "pointer",
      fontSize: 12, fontWeight: tab === id ? 700 : 500,
      color: tab === id ? "white" : "rgba(255,255,255,0.45)",
      borderBottom: `2px solid ${tab === id ? AMBER : "transparent"}`,
      transition: "all 0.15s", whiteSpace: "nowrap"
    }}>{label}</button>
  );

  return (
    <>
      <style>{CSS}</style>
      <div style={{ minHeight: "100vh", background: "#f8fafc",
        fontFamily: "'Zen Kaku Gothic New', 'Noto Sans JP', sans-serif" }}>

        {/* ─── 藍色グレインヘッダー ─── */}
        <header style={{ background: INK, position: "sticky", top: 0, zIndex: 100,
          boxShadow: "0 4px 16px rgba(0,0,0,0.2)", overflow: "hidden" }}>
          <Grain opacity={0.045} />
          <div className="header-row" style={{ position: "relative", zIndex: 1,
            maxWidth: 1280, margin: "0 auto", padding: "16px 28px",
            display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                <h1 style={{ fontSize: 22, fontWeight: 900, color: "white",
                  fontFamily: "'Noto Serif JP', serif", margin: 0, letterSpacing: "-0.02em" }}>
                  ロケピタ
                </h1>
                <span style={{ fontSize: 20, color: AMBER, lineHeight: 1 }}>.</span>
              </div>
              <p style={{ margin: 0, fontSize: 10, color: "rgba(255,255,255,0.45)",
                letterSpacing: "0.1em", fontWeight: 500 }}>
                「家賃で諦めない」ための 23区出店戦略ナビ
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              {mode === "compare" && (
                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", letterSpacing: "0.06em" }}>
                  {!selected ? "① 区を選択" : !compare ? "② 比較区を選択" : `${selected} × ${compare}`}
                </span>
              )}
              <button onClick={() => { setMode(m => m === "single" ? "compare" : "single"); setCompare(null); }}
                style={{ padding: "7px 16px", borderRadius: 99,
                  background: mode === "compare" ? AMBER : "rgba(255,255,255,0.1)",
                  border: `1px solid ${mode === "compare" ? AMBER : "rgba(255,255,255,0.2)"}`,
                  color: mode === "compare" ? INK : "rgba(255,255,255,0.8)",
                  fontSize: 11, fontWeight: 700, cursor: "pointer", transition: "all 0.2s" }}>
                {mode === "compare" ? "比較を終了" : "区を比較する"}
              </button>
            </div>
          </div>
          {/* タブ */}
          <div className="tab-row" style={{ position: "relative", zIndex: 1, maxWidth: 1280, margin: "0 auto",
            padding: "0 28px", display: "flex", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            <TabBtn id="browse"   label="エリアを探す" />
            <TabBtn id="diagnose" label="条件で診断する" />
            <TabBtn id="common"   label="共通制度を見る" />
          </div>
        </header>

        {/* ─── コンテンツ ─── */}
        <div className="pad" style={{ maxWidth: 1280, margin: "0 auto", padding: "24px 28px" }}>
          <AnimatePresence mode="wait">

            {/* Browse */}
            {tab === "browse" && (
              <motion.div key="browse" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="root-layout" style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>

                  {/* サイドバー */}
                  <aside className="sidebar" style={{ width: 184, flexShrink: 0 }}>
                    <p style={{ fontSize: 9, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.12em",
                      margin: "0 0 8px" }}>
                      {mode === "compare" ? "① ② の順に2区選択" : "区を選択"}
                    </p>
                    <div className="ward-grid" style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      {WARD_DATA.map(w => {
                        const isSel = w.area_name === selected;
                        const isCmp = w.area_name === compare;
                        return (
                          <button key={w.area_name} className="ward-btn"
                            onClick={() => pick(w.area_name)} style={{
                              padding: "8px 12px", borderRadius: 7, textAlign: "left", cursor: "pointer",
                              background: isSel ? INK : isCmp ? "#1e3a5f" : "transparent",
                              border: `1px solid ${isSel ? "rgba(255,255,255,0.15)" : isCmp ? "rgba(96,165,250,0.3)" : "transparent"}`,
                              color: isSel ? AMBER : isCmp ? "#93c5fd" : "#475569",
                              fontSize: 12, fontWeight: isSel || isCmp ? 700 : 400,
                              display: "flex", alignItems: "center", justifyContent: "space-between",
                              transition: "all 0.12s", position: "relative", overflow: "hidden"
                            }}>
                            {(isSel || isCmp) && <Grain opacity={0.06} />}
                            <span style={{ position: "relative", zIndex: 1 }}>{w.area_name}</span>
                            <span style={{ fontSize: 9, fontWeight: 700, zIndex: 1 }}>
                              {isSel ? "①" : isCmp ? "②" : w.alert ? (w.alert.type === "tip" ? "★" : w.alert.type === "caution" ? "◎" : "✓") : ""}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    <div style={{ marginTop: 12, padding: "9px 11px",
                      background: "rgba(30,41,59,0.04)", border: "1px solid #f1f5f9",
                      borderRadius: 8, fontSize: 9, color: "#94a3b8", lineHeight: 2.1 }}>
                      ★ お得な制度あり<br />◎ 事前確認アドバイス<br />✓ 手続きチェックあり
                    </div>
                  </aside>

                  {/* カードエリア */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {!selected ? (
                      <div style={{ textAlign: "center", paddingTop: 80, color: "#cbd5e1" }}>
                        <div style={{ fontSize: 52, marginBottom: 16, opacity: 0.5 }}>🏮</div>
                        <p style={{ fontSize: 16, fontWeight: 700, color: "#94a3b8",
                          fontFamily: "'Noto Serif JP', serif", margin: "0 0 8px" }}>
                          出店を検討している区を選んでください
                        </p>
                        <p style={{ fontSize: 12, color: "#cbd5e1" }}>
                          「条件で診断する」タブから希望条件で絞り込むこともできます
                        </p>
                      </div>
                    ) : (
                      <div>
                        <div className="cards-wrap" style={{ display: "flex", gap: 16 }}>
                          <AnimatePresence mode="wait">
                            <DataCard key={`s-${selected}`} ward={selWard} isCompare={false} />
                          </AnimatePresence>
                          {mode === "compare" && (
                            <AnimatePresence mode="wait">
                              <DataCard key={`c-${compare}`} ward={cmpWard} isCompare={true} />
                            </AnimatePresence>
                          )}
                        </div>

                        {/* 比較チャート */}
                        {mode === "compare" && selWard && cmpWard && (
                          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                            style={{ marginTop: 16, background: INK, borderRadius: 14,
                              padding: "18px 20px", position: "relative", overflow: "hidden" }}>
                            <Grain opacity={0.04} />
                            <p style={{ position: "relative", zIndex: 1, margin: "0 0 14px",
                              fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.4)", letterSpacing: "0.12em" }}>
                              比較チャート
                            </p>
                            <div className="cmp-grid" style={{ position: "relative", zIndex: 1,
                              display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                              {([
                                ["賃料水準", "rent_level", "#f87171"],
                                ["集客力", "customer_flow", "#4ade80"],
                                ["補助金力", "subsidy_strength", AMBER],
                                ["ゴミ管理", "garbage_ease", "#60a5fa"],
                              ] as [string, WardNumericKey, string][]).map(([label, key, color]) => (
                                <div key={key}>
                                  <p style={{ margin: "0 0 8px", fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.5)" }}>{label}</p>
                                  {([selWard, cmpWard] as WardData[]).map((w, wi) => (
                                    <div key={wi} style={{ marginBottom: 6 }}>
                                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, marginBottom: 3 }}>
                                        <span style={{ color: wi === 0 ? AMBER : "#93c5fd", fontWeight: 600 }}>{w.area_name}</span>
                                        <span style={{ color: "rgba(255,255,255,0.35)" }}>{w[key]}/5</span>
                                      </div>
                                      <div style={{ height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 2 }}>
                                        <motion.div initial={{ width: 0 }}
                                          animate={{ width: `${(w[key] / 5) * 100}%` }}
                                          transition={{ duration: 0.8, ease: "circOut" }}
                                          style={{ height: "100%", borderRadius: 2,
                                            background: wi === 0 ? color : "#60a5fa" }} />
                                      </div>
                                    </div>
                                  ))}
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

            {/* Diagnose */}
            {tab === "diagnose" && (
              <motion.div key="diagnose" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{ paddingTop: 12 }}>
                <div style={{ textAlign: "center", marginBottom: 28 }}>
                  <h2 style={{ fontSize: 20, fontWeight: 900, color: INK, margin: "0 0 6px",
                    fontFamily: "'Noto Serif JP', serif", letterSpacing: "-0.02em" }}>
                    出店エリア診断
                  </h2>
                  <p style={{ fontSize: 12, color: "#64748b", margin: 0 }}>
                    4つの質問に答えると、あなたの条件に合う区を提案します
                  </p>
                </div>
                {!diagResults
                  ? <DiagnosePanel key={diagKey} onResult={setDiagResults} />
                  : <DiagnoseResult results={diagResults}
                      onSelect={n => { setSelected(n); setTab("browse"); }}
                      onReset={() => { setDiagResults(null); setDiagKey(k => k + 1); }} />
                }
              </motion.div>
            )}

            {/* Common */}
            {tab === "common" && (
              <motion.div key="common" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{ paddingTop: 12 }}>
                <div style={{ textAlign: "center", marginBottom: 24 }}>
                  <h2 style={{ fontSize: 20, fontWeight: 900, color: INK, margin: "0 0 6px",
                    fontFamily: "'Noto Serif JP', serif", letterSpacing: "-0.02em" }}>
                    全区に共通する支援制度
                  </h2>
                  <p style={{ fontSize: 12, color: "#64748b", margin: 0 }}>
                    どの区を選んでも使える、東京都レベルの補助金・制度の基礎知識
                  </p>
                </div>
                <CommonPanel />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* フッター */}
        <footer style={{ borderTop: "1px solid #f1f5f9", padding: "14px 28px", marginTop: 32,
          background: INK, position: "relative", overflow: "hidden" }}>
          <Grain opacity={0.04} />
          <div style={{ position: "relative", zIndex: 1, maxWidth: 1280, margin: "0 auto",
            display: "flex", justifyContent: "space-between", alignItems: "center",
            gap: 16, flexWrap: "wrap" }}>
            <p style={{ margin: 0, fontSize: 10, color: "rgba(255,255,255,0.3)", lineHeight: 1.9, maxWidth: 600 }}>
              本データは2024〜2026年度の調査に基づく参考情報です。補助金・融資制度の内容・金額・申請期間は年度ごとに変更されます。開業前に必ず各区の公式サイト・産業振興窓口でご確認ください。
            </p>
            <span style={{ fontSize: 9, color: "rgba(255,255,255,0.2)", fontFamily: "monospace", letterSpacing: "0.15em", flexShrink: 0 }}>
              LOCEPITA v0.4
            </span>
          </div>
        </footer>
      </div>
    </>
  );
}
