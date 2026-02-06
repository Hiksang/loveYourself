import { test, expect } from "@playwright/test";
import { gotoAuth } from "./helpers/test-utils";

test.describe("선물 허브", () => {
  test("선물 허브 페이지 렌더링", async ({ page }) => {
    await gotoAuth(page, "/gift");
    await expect(page.locator("h1:has-text('익명 선물하기')")).toBeVisible();
    await expect(page.locator("text=선물 만들기")).toBeVisible();
    await expect(page.locator("text=선물 받기")).toBeVisible();
  });

  test("미인증 시 잠금 화면", async ({ page }) => {
    await page.goto("/gift");
    await expect(page.locator("text=성인 인증 후 이용할 수 있습니다")).toBeVisible();
  });
});

test.describe("선물 만들기", () => {
  test("상품 선택 + 수량 조절", async ({ page }) => {
    await gotoAuth(page, "/gift/create");
    await expect(page.locator("h1:has-text('선물 만들기')")).toBeVisible();

    // Add a product
    const firstPlus = page.locator("button:has-text('+')").first();
    await firstPlus.click();

    // Should see quantity and total
    await expect(page.locator("text=선물 합계")).toBeVisible();
    await expect(page.locator("text=다음")).toBeVisible();
  });

  test("결제 후 선물 코드 표시 (dev mode)", async ({ page }) => {
    await gotoAuth(page, "/gift/create");

    // Select product
    await page.locator("button:has-text('+')").first().click();

    // Go to step 2
    await page.click("button:has-text('다음')");

    // Should see payment section
    await expect(page.locator("text=선물 상품")).toBeVisible();
    await expect(page.locator("text=결제 수단")).toBeVisible();

    // Click pay (dev mode will simulate)
    await page.click("button:has-text('결제하기')");

    // Should see gift code
    await expect(page.locator("text=선물 준비 완료!")).toBeVisible({ timeout: 10000 });
    await expect(page.locator("text=선물 코드")).toBeVisible();
    await expect(page.locator("text=선물 코드 공유하기")).toBeVisible();
  });
});

test.describe("선물 받기", () => {
  test("코드 입력 UI 표시", async ({ page }) => {
    await gotoAuth(page, "/gift/redeem");
    await expect(page.locator("h1:has-text('선물 받기')")).toBeVisible();
    await expect(page.locator("input[placeholder='선물 코드 8자리']")).toBeVisible();
    await expect(page.locator("button:has-text('확인')")).toBeVisible();
  });

  test("잘못된 코드 에러", async ({ page }) => {
    await gotoAuth(page, "/gift/redeem");

    await page.fill("input[placeholder='선물 코드 8자리']", "WRONGCOD");
    await page.click("button:has-text('확인')");

    await expect(page.locator("text=선물을 찾을 수 없습니다")).toBeVisible();
  });
});
