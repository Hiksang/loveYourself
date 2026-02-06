# Love Yourself - World Mini App

## 프로젝트 개요
- **앱 이름**: Love Yourself
- **설명**: 프라이버시 보호 성인용품 미니앱 - World ID ZKP로 성인 인증, WLD/USDC 익명 결제
- **프레임워크**: Next.js 15 (App Router) + TypeScript + Tailwind CSS
- **SDK**: @worldcoin/minikit-js, @worldcoin/minikit-react
- **언어**: 한국어 우선
- **패키지 매니저**: pnpm

## 공식 문서 참조
- LLM 전체 문서: https://docs.world.org/llms-full.txt
- 미니앱 문서: https://docs.world.org/mini-apps
- Quick Start: https://docs.world.org/mini-apps/quick-start
- MiniKit GitHub: https://github.com/worldcoin/minikit-js

## 환경 변수
```
APP_ID=app_staging_xxxxx           # Developer Portal App ID
DEV_PORTAL_API_KEY=your_api_key    # Developer Portal API Key
NEXT_PUBLIC_APP_ID=app_staging_xxxxx  # 클라이언트에서 사용
```

## MiniKit SDK 전체 레퍼런스

### 초기화 & Install

MiniKit.install()로 초기화 (useEffect에서 호출):
```tsx
// components/Providers.tsx
"use client";
import { MiniKit } from '@worldcoin/minikit-js'
import { useEffect } from 'react'

export function Providers({ children }) {
  useEffect(() => {
    MiniKit.install(process.env.NEXT_PUBLIC_APP_ID)
  }, [])
  return <>{children}</>
}
```

참고: `@worldcoin/minikit-react`는 `useWaitForTransactionReceipt` 훅만 제공. Provider 없음.

설치 확인:
```tsx
import { MiniKit } from '@worldcoin/minikit-js'

if (!MiniKit.isInstalled()) {
  console.log("World App not detected")
}
```

두 가지 패턴:
- **Async Handlers** (권장): `const { finalPayload } = await MiniKit.commandsAsync.xxx(input)`
- **Event Listeners**: `MiniKit.subscribe(ResponseEvent.xxx, callback)`

### Wallet Auth (SIWE) - 인증

지갑 주소만으로 익명 로그인.

**WalletAuthInput 타입:**
```typescript
type WalletAuthInput = {
  nonce: string              // 서버에서 생성한 랜덤 nonce
  expirationTime?: Date      // 만료 시간
  statement?: string         // 서명 메시지
  requestId?: string         // 요청 ID
}
```

**프론트엔드 구현:**
```tsx
const signInWithWallet = async () => {
  // 1. 백엔드에서 nonce 가져오기
  const res = await fetch('/api/nonce')
  const { nonce } = await res.json()

  // 2. walletAuth 호출
  const { finalPayload } = await MiniKit.commandsAsync.walletAuth({
    nonce,
    expirationTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    statement: 'Love Yourself에 로그인합니다'
  })

  if (finalPayload.status === 'error') return

  // 3. 백엔드에서 서명 검증
  const response = await fetch('/api/complete-siwe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ payload: finalPayload, nonce })
  })
}
```

**백엔드 구현 (nonce):**
```typescript
// app/api/nonce/route.ts
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import crypto from 'crypto'

export async function GET() {
  const nonce = crypto.randomUUID()
  const cookieStore = await cookies()
  cookieStore.set('siwe-nonce', nonce, { httpOnly: true, secure: true })
  return NextResponse.json({ nonce })
}
```

**백엔드 구현 (SIWE 검증):**
```typescript
// app/api/complete-siwe/route.ts
import { MiniAppWalletAuthSuccessPayload, verifySiweMessage } from '@worldcoin/minikit-js'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { payload, nonce } = await req.json() as {
    payload: MiniAppWalletAuthSuccessPayload
    nonce: string
  }

  const cookieStore = await cookies()
  const storedNonce = cookieStore.get('siwe-nonce')?.value
  if (nonce !== storedNonce) {
    return NextResponse.json({ status: 'error', message: 'Invalid nonce' }, { status: 400 })
  }

  const validMessage = await verifySiweMessage(payload, nonce)
  if (!validMessage.isValid) {
    return NextResponse.json({ status: 'error', message: 'Invalid signature' }, { status: 400 })
  }

  // 세션 생성
  cookieStore.set('wallet-address', payload.address, { httpOnly: true, secure: true })
  return NextResponse.json({ status: 'success', address: payload.address })
}
```

**Success 페이로드:**
```typescript
type MiniAppWalletAuthSuccessPayload = {
  status: 'success'
  message: string
  signature: string
  address: string
  version: number
}
```

### Verify (World ID ZKP) - 성인 인증

ZKP(영지식증명)로 개인정보 노출 없이 성인 여부 증명.

**VerifyCommandInput 타입:**
```typescript
type VerifyCommandInput = {
  action: string                    // Developer Portal에서 생성한 액션 이름
  signal?: string                   // 추가 시그널 (선택)
  verification_level: VerificationLevel  // Orb | Device
}

enum VerificationLevel {
  Orb = 'orb',        // 홍채 인증 - 가장 강력
  Device = 'device'   // 디바이스 인증
}
```

**프론트엔드 구현:**
```tsx
import { MiniKit, VerificationLevel } from '@worldcoin/minikit-js'

const verifyAge = async () => {
  const { finalPayload } = await MiniKit.commandsAsync.verify({
    action: 'age-verify',
    verification_level: VerificationLevel.Orb
  })

  if (finalPayload.status === 'error') return

  const res = await fetch('/api/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      payload: finalPayload,
      action: 'age-verify'
    })
  })

  const result = await res.json()
  if (result.status === 'success') {
    // 인증 완료 - 상품 페이지로 이동
  }
}
```

**백엔드 구현:**
```typescript
// app/api/verify/route.ts
import { verifyCloudProof, IVerifyResponse, ISuccessResult } from '@worldcoin/minikit-js'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { payload, action } = await req.json() as {
    payload: ISuccessResult
    action: string
  }

  const app_id = process.env.APP_ID as `app_${string}`
  const verifyRes = await verifyCloudProof(payload, app_id, action) as IVerifyResponse

  if (verifyRes.success) {
    // nullifier_hash 저장으로 중복 인증 방지
    // 세션에 verified: true 저장
    return NextResponse.json({ status: 'success', verifyRes })
  }

  return NextResponse.json({ status: 'error', verifyRes }, { status: 400 })
}
```

**Success 페이로드:**
```typescript
type MiniAppVerifyActionSuccessPayload = {
  status: 'success'
  proof: string
  merkle_root: string
  nullifier_hash: string      // 고유 식별자 (개인정보 아님)
  verification_level: VerificationLevel
  version: number
}
```

### Pay - 결제

MiniKit Pay 명령어로 WLD/USDC 직접 전송. 커스텀 스마트 컨트랙트 불필요.

**PayCommandInput 타입:**
```typescript
type PayCommandInput = {
  reference: string          // 백엔드에서 생성한 UUID
  to: string                 // 수신 지갑 주소 (Developer Portal 화이트리스트)
  tokens: TokensPayload[]
  network?: Network
  description: string
}

type TokensPayload = {
  symbol: Tokens             // WLD | USDC
  token_amount: string       // tokenToDecimals로 변환된 금액
}

enum Tokens {
  WLD = 'WLD',
  USDC = 'USDC'
}
```

**tokenToDecimals 유틸리티:**
```typescript
import { tokenToDecimals, Tokens } from '@worldcoin/minikit-js'

// WLD: 18 decimals, USDC: 6 decimals
tokenToDecimals(1, Tokens.WLD)   // → 1000000000000000000n
tokenToDecimals(3, Tokens.USDC)  // → 3000000n
```

**3단계 플로우:**

1단계 - 결제 시작 (reference UUID 생성):
```typescript
// app/api/initiate-payment/route.ts
import { NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST() {
  const reference = crypto.randomUUID()
  // reference 저장 (메모리/DB)
  return NextResponse.json({ id: reference })
}
```

2단계 - 프론트에서 결제:
```tsx
import { MiniKit, tokenToDecimals, Tokens } from '@worldcoin/minikit-js'

const pay = async (amount: number) => {
  const res = await fetch('/api/initiate-payment', { method: 'POST' })
  const { id } = await res.json()

  const { finalPayload } = await MiniKit.commandsAsync.pay({
    reference: id,
    to: '0x가맹점지갑주소',
    tokens: [{
      symbol: Tokens.WLD,
      token_amount: tokenToDecimals(amount, Tokens.WLD).toString()
    }],
    description: 'Love Yourself 주문 결제'
  })

  if (finalPayload.status === 'success') {
    const confirmRes = await fetch('/api/confirm-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(finalPayload)
    })
    const result = await confirmRes.json()
    return result
  }
}
```

3단계 - 백엔드 결제 확인:
```typescript
// app/api/confirm-payment/route.ts
import { MiniAppPaymentSuccessPayload } from '@worldcoin/minikit-js'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const payload = await req.json() as MiniAppPaymentSuccessPayload

  // Developer Portal API로 트랜잭션 검증
  const response = await fetch(
    `https://developer.worldcoin.org/api/v2/minikit/transaction/${payload.transaction_id}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.DEV_PORTAL_API_KEY}`
      }
    }
  )
  const transaction = await response.json()

  if (transaction.reference === payload.reference && transaction.status !== 'failed') {
    // 결제 성공 → 수령 코드 발급
    const pickupCode = Math.random().toString(36).substring(2, 8).toUpperCase()
    return NextResponse.json({ status: 'success', pickupCode })
  }

  return NextResponse.json({ status: 'error' }, { status: 400 })
}
```

### Send Transaction - 스마트 컨트랙트

**SendTransactionInput 타입:**
```typescript
type SendTransactionInput = {
  transaction: Transaction[]
  permit2?: Permit2[]
  formatPayload?: boolean    // default: true
}

type Transaction = {
  address: string
  abi: Abi | readonly unknown[]
  functionName: string
  value?: string             // hex-encoded (payable)
  args: unknown[]
}
```

**트랜잭션 모니터링:**
```typescript
import { useWaitForTransactionReceipt } from '@worldcoin/minikit-react'

const { isLoading, isSuccess } = useWaitForTransactionReceipt({
  client: publicClient,
  appConfig: { app_id: '<app_id>' },
  transactionId: transactionId
})
```

### Sign Message (EIP-191)

```tsx
const { finalPayload } = await MiniKit.commandsAsync.signMessage({
  message: "메시지 내용"
})
// finalPayload: { status, signature, address, version }
```

### 기타 명령어

**Chat**: `MiniKit.commandsAsync.chat({ message, to? })`
**Share**: `MiniKit.commandsAsync.share({ title, text, url })`
**ShareContacts**: `MiniKit.commandsAsync.shareContacts({ isMultiSelectEnabled, inviteMessage })`
**HapticFeedback**: `MiniKit.commands.sendHapticFeedback({ hapticsType, style })`

**Permissions:**
```tsx
// 확인
const perms = await MiniKit.commandsAsync.getPermissions()
// 요청
await MiniKit.commandsAsync.requestPermission({ permission: Permission.Notifications })
```

**Notifications (서버):**
```typescript
await fetch('https://developer.worldcoin.org/api/v2/minikit/send-notification', {
  method: 'POST',
  headers: { Authorization: `Bearer ${API_KEY}` },
  body: JSON.stringify({
    app_id, wallet_addresses, localisations, mini_app_path
  })
})
```

## API 엔드포인트 참조

Base URL: `https://developer.worldcoin.org`

| Method | Path | Description |
|--------|------|-------------|
| POST | /api/v2/verify/{app_id} | World ID 증명 검증 |
| POST | /api/v2/create-action/{app_id} | 인코그니토 액션 생성 |
| GET | /public/v1/miniapps/prices | 토큰 가격 조회 |
| GET | /api/v2/minikit/transaction/{id} | 트랜잭션 상태 조회 |
| GET | /api/v2/minikit/transaction/debug | 디버그 URL 조회 |
| GET | /api/v2/minikit/user-grant-cycle | 그랜트 사이클 조회 |
| POST | /api/v2/minikit/send-notification | 알림 전송 |

## Worldchain 네트워크
- Public RPC: `https://worldchain-mainnet.g.alchemy.com/public`
- Block Explorer: `worldscan.org`
- Viem: `import { worldchain } from 'viem/chains'`
- 지갑: Safe 스마트 컨트랙트 계정 (ERC-4337)

## 디자인 가이드라인
- 모바일 퍼스트, 탭 네비게이션 (하단)
- 2-3초 내 초기 로드
- 사이드바/풋터 없음
- 기본 padding 24px, 헤더-콘텐츠 간격 16px
- 앱 아이콘: 정사각형, 비흰색 배경
- 한국어 UI, 은유적이고 세련된 디자인

## 에러 코드 참조

**Permissions**: `user_rejected`, `already_granted`, `already_requested`, `world_app_permission_not_enabled`
**Pay**: `input_error`, `payment_rejected`, `token_not_supported`, `invalid_receiver`
**Verify**: `verification_rejected`, `max_verifications_reached`, `credential_unavailable`

## 제한사항
- 결제: 인도네시아, 필리핀 불가
- sendTransaction: 일 500건 무료, 가스 한도 100만
- Permit2: 최대 1시간 유효
- 최소 결제: $0.10 USD 상당
- 알림: 미인증 앱 4시간당 40건
- 금지: 확률 기반 게임, 토큰 프리세일, 구독 수익 증대
