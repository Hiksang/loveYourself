"use client";

import { useState } from "react";
import { MiniKit } from "@worldcoin/minikit-js";

type Props = {
  code: string;
  expiresAt?: string;
};

export function GiftCodeDisplay({ code, expiresAt }: Props) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareText = `Love Yourself 선물이 도착했어요! 코드: ${code}`;

    if (MiniKit.isInstalled()) {
      try {
        await MiniKit.commandsAsync.share({
          title: "Love Yourself 선물",
          text: shareText,
          url: `https://loveyourself-five.vercel.app/gift/redeem?code=${code}`,
        });
      } catch {
        // fallback
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {}
    }
  };

  return (
    <div className="rounded-2xl bg-surface p-6 shadow-sm text-center">
      <p className="mb-1 text-xs text-muted">선물 코드</p>
      <p className="mb-4 text-4xl font-bold tracking-widest text-primary">{code}</p>
      {expiresAt && (
        <p className="mb-4 text-xs text-muted">
          유효기간: {new Date(expiresAt).toLocaleDateString("ko-KR")}까지
        </p>
      )}
      <button
        onClick={handleShare}
        className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white transition-all hover:bg-primary-dark active:scale-[0.98]"
      >
        {copied ? "복사됨!" : "선물 코드 공유하기"}
      </button>
    </div>
  );
}
