import { test, expect } from "@playwright/test";

test.describe("홈 페이지", () => {
  test("기본 렌더링 - 로고, 인증 버튼, 기능 카드 표시", async ({ page }) => {
    await page.goto("/");

    // 앱 제목 (Hero 섹션의 h2)
    await expect(page.locator("h2:has-text('Love')")).toBeVisible();
    await expect(page.locator("h2:has-text('Yourself')")).toBeVisible();

    // World ID 인증 버튼
    await expect(page.locator("text=World ID로 시작하기")).toBeVisible();

    // 프라이버시 기능 카드
    await expect(page.getByText("World ID", { exact: true })).toBeVisible();
    await expect(page.getByText("익명 결제", { exact: true })).toBeVisible();
    await expect(page.getByText("비대면 수령", { exact: true })).toBeVisible();
    await expect(page.getByText("기록 없음", { exact: true })).toBeVisible();

    // 하단 네비게이션
    await expect(page.locator("text=홈")).toBeVisible();
    await expect(page.locator("text=상품")).toBeVisible();
    await expect(page.locator("text=커뮤니티")).toBeVisible();
    await expect(page.locator("text=장바구니")).toBeVisible();
    await expect(page.locator("text=주문")).toBeVisible();
  });

  test("미인증 상태에서 쇼핑 시작 버튼 숨김", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("text=쇼핑 시작하기")).not.toBeVisible();
    await expect(page.locator("text=먼저 World ID 인증을 완료해주세요")).toBeVisible();
  });

  test("dev 모드로 자동 인증 후 쇼핑 시작 버튼 표시", async ({ page }) => {
    await page.goto("/?dev=true");

    // 인증 완료 표시
    await expect(page.locator("text=World ID 인증됨")).toBeVisible();

    // 쇼핑 시작 버튼
    await expect(page.locator("text=쇼핑 시작하기")).toBeVisible();
  });
});

test.describe("상품 페이지", () => {
  test("미인증 시 잠금 화면", async ({ page }) => {
    await page.goto("/products");
    await expect(page.locator("text=성인 인증이 필요합니다")).toBeVisible();
    await expect(page.locator("text=홈으로 이동")).toBeVisible();
  });

  test("인증 후 상품 목록 표시", async ({ page }) => {
    await page.goto("/products?dev=true");

    // 페이지 제목
    await expect(page.locator("h1:has-text('상품')")).toBeVisible();

    // 카테고리 탭
    await expect(page.locator("text=전체")).toBeVisible();
    await expect(page.locator("text=웰니스")).toBeVisible();
    await expect(page.locator("text=뷰티 & 케어")).toBeVisible();
    await expect(page.locator("text=건강보조")).toBeVisible();
    await expect(page.locator("text=스페셜")).toBeVisible();

    // 상품 카드 존재 확인
    await expect(page.locator("text=릴렉스 마사지 오일")).toBeVisible();
    await expect(page.locator("text=프리미엄 배스 솔트")).toBeVisible();

    // 가격 표시
    await expect(page.locator("text=0.5 WLD").first()).toBeVisible();

    // 담기 버튼 존재
    const addButtons = page.locator("button:has-text('담기')");
    await expect(addButtons.first()).toBeVisible();
    expect(await addButtons.count()).toBeGreaterThan(0);
  });

  test("카테고리 필터링", async ({ page }) => {
    await page.goto("/products?dev=true");

    // 웰니스 카테고리 클릭
    await page.click("button:has-text('웰니스')");
    await expect(page.locator("text=릴렉스 마사지 오일")).toBeVisible();
    await expect(page.locator("text=프리미엄 배스 솔트")).toBeVisible();

    // 스페셜 카테고리 클릭
    await page.click("button:has-text('스페셜')");
    await expect(page.locator("text=러브 키트 세트")).toBeVisible();
    await expect(page.locator("text=무드 캔들 컬렉션")).toBeVisible();
    // 웰니스 상품은 안 보여야 함
    await expect(page.locator("text=릴렉스 마사지 오일")).not.toBeVisible();
  });

  test("상품 카드에서 담기 클릭 시 장바구니 뱃지 업데이트", async ({ page }) => {
    await page.goto("/products?dev=true");

    // 담기 버튼 클릭
    await page.locator("button:has-text('담기')").first().click();

    // 하단 네비 장바구니 뱃지에 숫자 표시
    const badge = page.locator("nav span.rounded-full.bg-primary");
    await expect(badge).toBeVisible();
    await expect(badge).toHaveText("1");
  });
});

test.describe("상품 상세 페이지", () => {
  test("상품 클릭 시 상세 페이지로 이동", async ({ page }) => {
    await page.goto("/products?dev=true");

    // 상품 카드 클릭 (링크)
    await page.locator("a:has-text('릴렉스 마사지 오일')").click();

    // 상세 페이지 내용 확인
    await expect(page.locator("h1:has-text('릴렉스 마사지 오일')")).toBeVisible();
    await expect(page.locator("text=천연 아로마 에센셜 오일")).toBeVisible();
    await expect(page.locator("text=0.5 WLD")).toBeVisible();
    await expect(page.locator("text=장바구니에 담기")).toBeVisible();
    await expect(page.locator("text=← 뒤로")).toBeVisible();
  });
});

test.describe("장바구니", () => {
  test("빈 장바구니 표시", async ({ page }) => {
    await page.goto("/cart?dev=true");
    await expect(page.locator("text=장바구니가 비어있습니다")).toBeVisible();
    await expect(page.locator("text=쇼핑하러 가기")).toBeVisible();
  });

  test("상품 담기 → 장바구니 확인 → 수량 변경", async ({ page }) => {
    await page.goto("/products?dev=true");

    // 상품 담기
    await page.locator("button:has-text('담기')").first().click();

    // 장바구니로 이동
    await page.locator("nav a:has-text('장바구니')").click();
    await page.waitForURL("**/cart**");

    // 상품이 장바구니에 있는지 확인
    await expect(page.locator("text=1개 상품")).toBeVisible();

    // 총 결제금액 표시
    await expect(page.locator("text=총 결제금액")).toBeVisible();

    // 수량 증가 (+) 버튼 클릭
    await page.locator("button:has-text('+')").click();
    await expect(page.locator("text=2개 상품")).toBeVisible();

    // 수량 감소 (-) 버튼 클릭
    await page.locator("button:has-text('-')").click();
    await expect(page.locator("text=1개 상품")).toBeVisible();

    // 주문하기 버튼
    await expect(page.locator("text=주문하기")).toBeVisible();
  });

  test("상품 삭제", async ({ page }) => {
    await page.goto("/products?dev=true");
    await page.locator("button:has-text('담기')").first().click();

    await page.locator("nav a:has-text('장바구니')").click();
    await page.waitForURL("**/cart**");

    // × 삭제 버튼 클릭
    await page.locator("button:has-text('×')").click();
    await expect(page.locator("text=장바구니가 비어있습니다")).toBeVisible();
  });
});

test.describe("체크아웃", () => {
  test("장바구니 → 주문하기 → 체크아웃 페이지", async ({ page }) => {
    await page.goto("/products?dev=true");
    await page.locator("button:has-text('담기')").first().click();

    // 장바구니로
    await page.locator("nav a:has-text('장바구니')").click();
    await page.waitForURL("**/cart**");

    // 주문하기 클릭
    await page.click("button:has-text('주문하기')");
    await page.waitForURL("**/checkout**");

    // 체크아웃 페이지 내용 확인
    await expect(page.locator("h1:has-text('주문하기')")).toBeVisible();
    await expect(page.locator("text=주문 상품")).toBeVisible();
    await expect(page.locator("text=수령지 선택")).toBeVisible();
    await expect(page.locator("text=결제 수단")).toBeVisible();
    await expect(page.locator("text=프라이버시 보호")).toBeVisible();
  });

  test("수령지 선택 - 편의점/무인택배함 전환 및 검색", async ({ page }) => {
    await page.goto("/products?dev=true");
    await page.locator("button:has-text('담기')").first().click();
    await page.locator("nav a:has-text('장바구니')").click();
    await page.waitForURL("**/cart**");
    await page.click("button:has-text('주문하기')");
    await page.waitForURL("**/checkout**");

    // 편의점 탭 (기본)
    await expect(page.locator("text=CU 강남역점")).toBeVisible();

    // 무인택배함 탭 클릭
    await page.click("button:has-text('무인택배함')");
    await expect(page.locator("text=스마트택배함 강남역 2번출구")).toBeVisible();

    // 검색
    await page.fill("input[placeholder*='검색']", "홍대");
    await expect(page.locator("text=스마트택배함 홍대 메인거리")).toBeVisible();
  });

  test("수령지 미선택 시 결제 버튼 비활성화", async ({ page }) => {
    await page.goto("/products?dev=true");
    await page.locator("button:has-text('담기')").first().click();
    await page.locator("nav a:has-text('장바구니')").click();
    await page.waitForURL("**/cart**");
    await page.click("button:has-text('주문하기')");
    await page.waitForURL("**/checkout**");

    // 수령지 미선택 안내
    await expect(page.locator("text=수령지를 선택해주세요")).toBeVisible();

    // 결제 버튼 비활성화
    const payButton = page.locator("button:has-text('결제하기')");
    await expect(payButton).toBeDisabled();
  });
});

test.describe("주문 내역", () => {
  test("빈 주문 내역", async ({ page }) => {
    await page.goto("/orders?dev=true");
    await expect(page.locator("text=주문 내역이 없습니다")).toBeVisible();
    await expect(page.locator("text=쇼핑하러 가기")).toBeVisible();
  });
});

test.describe("네비게이션", () => {
  test("하단 탭으로 페이지 이동", async ({ page }) => {
    await page.goto("/?dev=true");

    // 상품 탭 클릭
    await page.locator("nav a:has-text('상품')").click();
    await page.waitForURL("**/products**");
    await expect(page.locator("h1:has-text('상품')")).toBeVisible();

    // 커뮤니티 탭 클릭
    await page.locator("nav a:has-text('커뮤니티')").click();
    await page.waitForURL("**/community**");
    await expect(page.locator("h1:has-text('커뮤니티')")).toBeVisible();

    // 장바구니 탭 클릭
    await page.locator("nav a:has-text('장바구니')").click();
    await page.waitForURL("**/cart**");

    // 주문 탭 클릭
    await page.locator("nav a:has-text('주문')").click();
    await page.waitForURL("**/orders**");

    // 홈 탭 클릭
    await page.locator("nav a:has-text('홈')").click();
    await page.waitForURL("**/");
  });
});
