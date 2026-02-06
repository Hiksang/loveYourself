// In-memory referral store (MVP)
const referralCodes = new Map<string, { ownerAddress: string; uses: number; createdAt: Date }>();

export function generateReferralCode(address: string): string {
  // Generate from address hash
  const code = address.slice(2, 8).toUpperCase();
  if (!referralCodes.has(code)) {
    referralCodes.set(code, { ownerAddress: address, uses: 0, createdAt: new Date() });
  }
  return code;
}

export function useReferralCode(code: string): boolean {
  const ref = referralCodes.get(code.toUpperCase());
  if (ref) {
    ref.uses += 1;
    return true;
  }
  return false;
}

export function getReferralStats(code: string) {
  return referralCodes.get(code.toUpperCase());
}
