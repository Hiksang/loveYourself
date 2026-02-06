export type Product = {
  id: string;
  name: string;
  description: string;
  price: number; // WLD 기준
  priceUSDC: number;
  category: Category;
  image: string; // emoji placeholder
  tags: string[];
  inStock: boolean;
};

export type Category = "wellness" | "beauty" | "health" | "special";

export const categoryNames: Record<Category, string> = {
  wellness: "웰니스",
  beauty: "뷰티 & 케어",
  health: "건강보조",
  special: "스페셜",
};

export const products: Product[] = [
  {
    id: "wl-001",
    name: "릴렉스 마사지 오일",
    description: "천연 아로마 에센셜 오일 블렌드. 라벤더와 일랑일랑의 조화로운 향이 깊은 릴렉스를 선사합니다.",
    price: 0.5,
    priceUSDC: 3,
    category: "wellness",
    image: "🫧",
    tags: ["아로마", "릴렉스"],
    inStock: true,
  },
  {
    id: "wl-002",
    name: "프리미엄 배스 솔트",
    description: "히말라야 핑크솔트와 장미 꽃잎이 어우러진 럭셔리 입욕제. 피로 회복과 피부 케어를 동시에.",
    price: 0.3,
    priceUSDC: 2,
    category: "wellness",
    image: "🌸",
    tags: ["입욕", "릴렉스"],
    inStock: true,
  },
  {
    id: "wl-003",
    name: "실크 아이 마스크",
    description: "100% 천연 실크 소재의 수면 아이마스크. 빛 차단과 편안한 착용감.",
    price: 0.4,
    priceUSDC: 2.5,
    category: "wellness",
    image: "🌙",
    tags: ["수면", "실크"],
    inStock: true,
  },
  {
    id: "bt-001",
    name: "인티밋 클렌저",
    description: "pH 밸런스 포뮬러의 저자극 클렌저. 민감한 피부를 위한 순한 세정.",
    price: 0.4,
    priceUSDC: 2.5,
    category: "beauty",
    image: "💜",
    tags: ["클렌저", "저자극"],
    inStock: true,
  },
  {
    id: "bt-002",
    name: "실키 바디 로션",
    description: "시어버터와 히알루론산의 깊은 보습. 실크처럼 부드러운 피부결.",
    price: 0.35,
    priceUSDC: 2,
    category: "beauty",
    image: "✨",
    tags: ["보습", "바디케어"],
    inStock: true,
  },
  {
    id: "bt-003",
    name: "센슈얼 퍼퓸 미스트",
    description: "머스크와 바닐라 노트의 은은한 바디 미스트. 오래 지속되는 매력적인 향.",
    price: 0.6,
    priceUSDC: 3.5,
    category: "beauty",
    image: "🫐",
    tags: ["향수", "미스트"],
    inStock: true,
  },
  {
    id: "hl-001",
    name: "바이탈 서플먼트",
    description: "아연, 마카, 비타민E 복합 영양제. 활력과 에너지 충전.",
    price: 0.8,
    priceUSDC: 5,
    category: "health",
    image: "💊",
    tags: ["영양제", "활력"],
    inStock: true,
  },
  {
    id: "hl-002",
    name: "프로바이오틱스 플러스",
    description: "장 건강과 면역력을 위한 유산균. 100억 CFU 보장.",
    price: 0.5,
    priceUSDC: 3,
    category: "health",
    image: "🧬",
    tags: ["유산균", "면역"],
    inStock: true,
  },
  {
    id: "sp-001",
    name: "러브 키트 세트",
    description: "특별한 밤을 위한 올인원 키트. 캔들, 마사지 오일, 배스봄 포함.",
    price: 1.5,
    priceUSDC: 9,
    category: "special",
    image: "🎁",
    tags: ["기프트", "세트"],
    inStock: true,
  },
  {
    id: "sp-002",
    name: "무드 캔들 컬렉션",
    description: "소이왁스 아로마 캔들 3종 세트. 각각 다른 무드를 연출하는 향.",
    price: 0.7,
    priceUSDC: 4,
    category: "special",
    image: "🕯️",
    tags: ["캔들", "무드"],
    inStock: true,
  },
  {
    id: "sp-003",
    name: "시크릿 박스",
    description: "매월 다른 구성의 서프라이즈 박스. 이달의 베스트 셀프케어 아이템 랜덤 구성.",
    price: 2.0,
    priceUSDC: 12,
    category: "special",
    image: "🔮",
    tags: ["서프라이즈", "랜덤"],
    inStock: true,
  },
  {
    id: "wl-004",
    name: "웜 마사저",
    description: "온열 기능이 탑재된 미니 마사저. USB 충전식으로 언제 어디서나.",
    price: 1.2,
    priceUSDC: 7,
    category: "wellness",
    image: "🌡️",
    tags: ["마사지", "온열"],
    inStock: true,
  },
];

export function getProduct(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductsByCategory(category: Category): Product[] {
  return products.filter((p) => p.category === category);
}
