export type SubscriptionPlan = {
  id: string;
  name: string;
  description: string;
  priceWLD: number;
  priceUSDC: number;
  interval: "monthly";
  items: string[];
  icon: string;
  popular?: boolean;
};

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: "sub-basic",
    name: "베이직 박스",
    description: "매월 엄선된 셀프케어 아이템 2-3종",
    priceWLD: 1.0,
    priceUSDC: 6,
    interval: "monthly",
    items: ["마사지 오일 또는 바디로션", "배스봄 1개", "랜덤 미니 아이템"],
    icon: "📦",
  },
  {
    id: "sub-premium",
    name: "프리미엄 박스",
    description: "매월 프리미엄 셀프케어 아이템 4-5종",
    priceWLD: 2.0,
    priceUSDC: 12,
    interval: "monthly",
    items: ["프리미엄 마사지 오일", "아로마 캔들", "배스 솔트", "바디 미스트", "서프라이즈 아이템"],
    icon: "🎁",
    popular: true,
  },
  {
    id: "sub-luxury",
    name: "럭셔리 박스",
    description: "매월 최고급 셀프케어 풀 세트",
    priceWLD: 3.5,
    priceUSDC: 20,
    interval: "monthly",
    items: ["럭셔리 마사지 세트", "프리미엄 캔들 컬렉션", "실크 아이마스크", "배스 키트", "한정판 아이템 2종"],
    icon: "👑",
  },
];
