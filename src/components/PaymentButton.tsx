"use client";

import { MiniKit, tokenToDecimals, Tokens } from "@worldcoin/minikit-js";
import { useState } from "react";

type Props = {
  amount: number;
  currency: "WLD" | "USDC";
  description: string;
  onSuccess: (result: { pickupCode: string; transactionId: string }) => void;
  onError: (error: string) => void;
  disabled?: boolean;
};

// TODO: Replace with actual merchant wallet address from Developer Portal
const MERCHANT_ADDRESS = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045";

export function PaymentButton({
  amount,
  currency,
  description,
  onSuccess,
  onError,
  disabled,
}: Props) {
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    setLoading(true);

    try {
      // Step 1: Get payment reference from backend
      const initRes = await fetch("/api/initiate-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      const { id: reference } = await initRes.json();

      if (!MiniKit.isInstalled()) {
        // Dev fallback: simulate payment
        const pickupCode = Math.random()
          .toString(36)
          .substring(2, 8)
          .toUpperCase();
        onSuccess({ pickupCode, transactionId: "dev_tx_" + reference });
        return;
      }

      // Step 2: Execute payment via MiniKit
      const token = currency === "WLD" ? Tokens.WLD : Tokens.USDC;
      const { finalPayload } = await MiniKit.commandsAsync.pay({
        reference,
        to: MERCHANT_ADDRESS,
        tokens: [
          {
            symbol: token,
            token_amount: tokenToDecimals(amount, token).toString(),
          },
        ],
        description,
      });

      if (finalPayload.status === "error") {
        onError("결제가 취소되었습니다");
        return;
      }

      // Step 3: Confirm payment on backend
      const confirmRes = await fetch("/api/confirm-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalPayload),
      });

      const result = await confirmRes.json();
      if (result.status === "success") {
        onSuccess({
          pickupCode: result.pickupCode,
          transactionId: result.transactionId,
        });
      } else {
        onError("결제 확인에 실패했습니다");
      }
    } catch (err) {
      console.error("Payment error:", err);
      onError("결제 중 오류가 발생했습니다");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePay}
      disabled={disabled || loading}
      className="w-full rounded-2xl bg-primary py-4 text-lg font-semibold text-white transition-all hover:bg-primary-dark active:scale-[0.98] disabled:opacity-50"
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          결제 처리 중...
        </span>
      ) : (
        `${amount.toFixed(2)} ${currency} 결제하기`
      )}
    </button>
  );
}
