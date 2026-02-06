"use client";

import { LoginButton } from "@/components/LoginButton";
import { Header } from "@/components/Header";
import { useAuth } from "@/components/AuthContext";
import { useRouter } from "next/navigation";

export default function Home() {
  const { isLoggedIn, isVerified } = useAuth();
  const router = useRouter();
  const authenticated = isLoggedIn && isVerified;

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

        {/* Auth Card */}
        <div className="mb-8 space-y-4">
          <div className="rounded-2xl bg-surface p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-3">
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                  authenticated
                    ? "bg-green-100 text-green-700"
                    : "bg-primary/10 text-primary"
                }`}
              >
                {authenticated ? "✓" : "1"}
              </span>
              <div>
                <h3 className="font-semibold">World ID 인증</h3>
                <p className="text-xs text-muted">
                  한 번의 인증으로 로그인 + 성인 확인 완료
                </p>
              </div>
            </div>
            <LoginButton />
          </div>

          {/* Step 2: Shop */}
          <div className="rounded-2xl bg-surface p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-3">
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                  authenticated
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-muted"
                }`}
              >
                2
              </span>
              <div>
                <h3 className={`font-semibold ${!authenticated ? "text-muted" : ""}`}>
                  익명 쇼핑
                </h3>
                <p className="text-xs text-muted">
                  WLD/USDC 결제 · 편의점/무인택배함 수령
                </p>
              </div>
            </div>
            {authenticated ? (
              <button
                onClick={() => router.push("/products")}
                className="w-full rounded-2xl bg-primary px-6 py-4 text-lg font-semibold text-white transition-all hover:bg-primary-dark active:scale-[0.98]"
              >
                쇼핑 시작하기
              </button>
            ) : (
              <p className="text-xs text-muted">
                먼저 World ID 인증을 완료해주세요
              </p>
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
              icon="🌐"
              title="World ID"
              desc="한 번 인증으로 로그인 + 성인확인"
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
