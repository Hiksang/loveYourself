"use client";

import { LoginButton } from "@/components/LoginButton";
import { AgeVerification } from "@/components/AgeVerification";
import { Header } from "@/components/Header";
import { useAuth } from "@/components/AuthContext";
import { useRouter } from "next/navigation";

export default function Home() {
  const { isLoggedIn, isVerified } = useAuth();
  const router = useRouter();

  return (
    <div>
      <Header />
      <div className="px-6">
        {/* Hero */}
        <div className="mb-8 mt-4 text-center">
          <div className="mb-4 text-6xl">💜</div>
          <h2 className="mb-2 text-3xl font-bold tracking-tight">
            <span className="text-primary">Love</span> Yourself
          </h2>
          <p className="text-sm text-muted leading-relaxed">
            완벽한 프라이버시로 나를 위한 쇼핑
            <br />
            개인정보 없이, 기록 없이
          </p>
        </div>

        {/* Steps */}
        <div className="mb-8 space-y-4">
          {/* Step 1: Login */}
          <div className="rounded-2xl bg-surface p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-3">
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                  isLoggedIn
                    ? "bg-green-100 text-green-700"
                    : "bg-primary/10 text-primary"
                }`}
              >
                {isLoggedIn ? "✓" : "1"}
              </span>
              <div>
                <h3 className="font-semibold">익명 로그인</h3>
                <p className="text-xs text-muted">지갑 주소만으로 가입 · 이름 불필요</p>
              </div>
            </div>
            {!isLoggedIn && <LoginButton />}
          </div>

          {/* Step 2: Verify */}
          <div className="rounded-2xl bg-surface p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-3">
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                  isVerified
                    ? "bg-green-100 text-green-700"
                    : "bg-primary/10 text-primary"
                }`}
              >
                {isVerified ? "✓" : "2"}
              </span>
              <div>
                <h3 className="font-semibold">성인 인증</h3>
                <p className="text-xs text-muted">
                  World ID 영지식증명 · 개인정보 노출 없음
                </p>
              </div>
            </div>
            {isLoggedIn && !isVerified && <AgeVerification />}
            {!isLoggedIn && (
              <p className="text-xs text-muted">먼저 로그인을 완료해주세요</p>
            )}
          </div>

          {/* Step 3: Shop */}
          <div className="rounded-2xl bg-surface p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                3
              </span>
              <div>
                <h3 className="font-semibold">익명 쇼핑</h3>
                <p className="text-xs text-muted">
                  WLD/USDC 결제 · 편의점/무인택배함 수령
                </p>
              </div>
            </div>
            {isVerified && (
              <button
                onClick={() => router.push("/products")}
                className="w-full rounded-2xl bg-primary px-6 py-4 text-lg font-semibold text-white transition-all hover:bg-primary-dark active:scale-[0.98]"
              >
                쇼핑 시작하기
              </button>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="mb-8">
          <h3 className="mb-4 text-center text-sm font-semibold text-muted">
            어떻게 프라이버시를 보호하나요?
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <FeatureCard
              icon="🔒"
              title="영지식증명"
              desc="나이만 증명, 신분증 불필요"
            />
            <FeatureCard
              icon="💰"
              title="익명 결제"
              desc="WLD/USDC 토큰 결제"
            />
            <FeatureCard
              icon="📦"
              title="비대면 수령"
              desc="편의점 · 무인택배함"
            />
            <FeatureCard
              icon="🚫"
              title="기록 없음"
              desc="구매 이력 미저장"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-xl bg-surface p-4 shadow-sm text-center">
      <div className="mb-2 text-2xl">{icon}</div>
      <p className="text-sm font-semibold">{title}</p>
      <p className="mt-0.5 text-xs text-muted">{desc}</p>
    </div>
  );
}
