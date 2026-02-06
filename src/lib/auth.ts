// In-memory store for MVP (use DB in production)
const verifiedUsers = new Set<string>();
const sessions = new Map<string, { address: string; verified: boolean }>();
const paymentReferences = new Map<string, { amount: number; status: string; createdAt: Date }>();

export function setVerified(address: string) {
  verifiedUsers.add(address.toLowerCase());
}

export function isVerified(address: string): boolean {
  return verifiedUsers.has(address.toLowerCase());
}

export function setSession(address: string, verified: boolean) {
  sessions.set(address.toLowerCase(), { address, verified });
}

export function getSession(address: string) {
  return sessions.get(address.toLowerCase());
}

export function storePaymentReference(reference: string, amount: number) {
  paymentReferences.set(reference, { amount, status: "pending", createdAt: new Date() });
}

export function getPaymentReference(reference: string) {
  return paymentReferences.get(reference);
}

export function updatePaymentStatus(reference: string, status: string) {
  const ref = paymentReferences.get(reference);
  if (ref) {
    ref.status = status;
  }
}
