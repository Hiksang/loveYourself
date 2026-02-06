"use client";

import { useState, useEffect } from "react";
import { MiniKit } from "@worldcoin/minikit-js";
import { useAuth } from "@/components/AuthContext";

export function ReferralCard() {
  const { walletAddress } = useAuth();
  const [code, setCode] = useState<string | null>(null);
  const [uses, setUses] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!walletAddress) return;
    fetch("/api/referral", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address: walletAddress }),
    })
      .then((r) => r.json())
      .then((data) => {
        setCode(data.code);
        // Fetch stats
        return fetch(`/api/referral?code=${data.code}`);
      })
      .then((r) => r.json())
      .then((data) => setUses(data.uses || 0))
      .catch(() => {});
  }, [walletAddress]);

  const handleShare = async () => {
    const shareText = `Love Yourself에서 프라이버시 보호 쇼핑하세요! 추천 코드: ${code}`;

    if (MiniKit.isInstalled()) {
      try {
        await MiniKit.commandsAsync.share({
          title: "Love Yourself 추천",
          text: shareText,
          url: `https://loveyourself-five.vercel.app/?ref=${code}`,
        });
      } catch {
        // fallback
      }
    } else {
      // Browser fallback
      try {
        await navigator.clipboard.writeText(shareText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {}
    }
  };

  if (!code) return null;

  return (
    <div className="rounded-2xl bg-surface p-5 shadow-sm">
      <h3 className="mb-2 font-semibold">친구 추천</h3>
      <p className="mb-3 text-xs text-muted">
        친구를 초대하고 함께 혜택을 받으세요
      </p>

      <div className="mb-3 flex items-center gap-2 rounded-xl bg-primary/5 p-3">
        <span className="text-xs text-muted">추천 코드</span>
        <span className="flex-1 text-center text-lg font-bold tracking-widest text-primary">
          {code}
        </span>
        <span className="text-xs text-muted">{uses}명 사용</span>
      </div>

      <button
        onClick={handleShare}
        className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white transition-all hover:bg-primary-dark active:scale-[0.98]"
      >
        {copied ? "복사됨!" : "친구에게 공유하기"}
      </button>
    </div>
  );
}
