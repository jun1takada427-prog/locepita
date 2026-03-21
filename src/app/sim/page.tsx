import type { Metadata } from "next";
import LocepitaSim from "@/components/LocepitaSim";

export const metadata: Metadata = {
  title: "初期費用シミュレーター | ロケピタ",
  description: "東京23区の飲食店開業にかかる初期費用を坪数・エリアで即計算。補助金活用後の実質負担額をリアルタイムで確認できます。",
};

export default function SimPage() {
  return <LocepitaSim />;
}
