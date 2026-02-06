"use client";

import { MiniKit, Permission } from "@worldcoin/minikit-js";
import { useState } from "react";

export function NotificationPermission() {
  const [granted, setGranted] = useState(false);
  const [loading, setLoading] = useState(false);

  const requestPermission = async () => {
    if (!MiniKit.isInstalled()) {
      setGranted(true); // dev fallback
      return;
    }

    setLoading(true);
    try {
      const perms = await MiniKit.commandsAsync.getPermissions();
      if ((perms?.finalPayload as Record<string, unknown>)?.notifications) {
        setGranted(true);
        return;
      }

      const { finalPayload } = await MiniKit.commandsAsync.requestPermission({
        permission: Permission.Notifications,
      });

      if (finalPayload.status === "success") {
        setGranted(true);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  if (granted) {
    return (
      <div className="flex items-center gap-2 rounded-xl bg-green-50 px-3 py-2 text-xs text-green-700">
        <span>🔔</span> 알림이 활성화되었습니다
      </div>
    );
  }

  return (
    <button
      onClick={requestPermission}
      disabled={loading}
      className="flex items-center gap-2 rounded-xl bg-surface px-4 py-2.5 text-sm font-medium shadow-sm transition-colors hover:bg-gray-50"
    >
      <span>🔔</span>
      {loading ? "설정 중..." : "주문 알림 받기"}
    </button>
  );
}
