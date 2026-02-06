// In-memory gift store (MVP)
import crypto from "crypto";

export type GiftStatus = "paid" | "redeemed" | "expired";

export type GiftItem = {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  priceUSDC: number;
};

export type Gift = {
  id: string;
  giftCode: string;
  senderNullifier: string;
  items: GiftItem[];
  totalWLD: number;
  totalUSDC: number;
  currency: "WLD" | "USDC";
  paymentReference: string;
  status: GiftStatus;
  message?: string;
  pickupCode?: string;
  pickupLocationId?: string;
  createdAt: string;
  expiresAt: string;
  redeemedAt?: string;
};

const gifts = new Map<string, Gift>(); // id -> gift
const giftsByCode = new Map<string, string>(); // code -> id

function generateGiftCode(): string {
  const code = crypto.randomBytes(4).toString("hex").toUpperCase();
  if (giftsByCode.has(code)) return generateGiftCode(); // retry on collision
  return code;
}

export function createGift(data: {
  senderNullifier: string;
  items: GiftItem[];
  totalWLD: number;
  totalUSDC: number;
  currency: "WLD" | "USDC";
  paymentReference: string;
  message?: string;
}): Gift {
  const id = Math.random().toString(36).substring(2, 10);
  const giftCode = generateGiftCode();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days

  const gift: Gift = {
    id,
    giftCode,
    senderNullifier: data.senderNullifier,
    items: data.items,
    totalWLD: data.totalWLD,
    totalUSDC: data.totalUSDC,
    currency: data.currency,
    paymentReference: data.paymentReference,
    status: "paid",
    message: data.message,
    createdAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
  };

  gifts.set(id, gift);
  giftsByCode.set(giftCode, id);
  return gift;
}

export function getGiftByCode(code: string): Gift | null {
  const id = giftsByCode.get(code.toUpperCase());
  if (!id) return null;
  const gift = gifts.get(id);
  if (!gift) return null;

  // Check expiration
  if (new Date(gift.expiresAt) < new Date() && gift.status === "paid") {
    gift.status = "expired";
  }
  return gift;
}

export function redeemGift(code: string, pickupLocationId: string): Gift | null {
  const gift = getGiftByCode(code);
  if (!gift || gift.status !== "paid") return null;

  gift.status = "redeemed";
  gift.redeemedAt = new Date().toISOString();
  gift.pickupLocationId = pickupLocationId;
  gift.pickupCode = Math.random().toString(36).substring(2, 8).toUpperCase();
  return gift;
}

export function getMyGifts(senderNullifier: string): Gift[] {
  const result: Gift[] = [];
  for (const gift of gifts.values()) {
    if (gift.senderNullifier === senderNullifier) {
      result.push(gift);
    }
  }
  return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}
