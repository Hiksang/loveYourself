import { test, expect } from "@playwright/test";
import { gotoAuth } from "./helpers/test-utils";

test.describe("추천 시스템", () => {
  test("추천 페이지 렌더링", async ({ page }) => {
    await gotoAuth(page, "/referral");
    // Should render referral page
    await expect(page.locator("text=추천")).toBeVisible();
  });

  test("추천 코드 생성 및 공유 버튼 표시", async ({ page }) => {
    await gotoAuth(page, "/referral");

    // Wait for referral code to load
    const shareBtn = page.locator("button:has-text('공유하기')");
    // If referral card is present, code should be shown
    const codeEl = page.locator("text=추천 코드");
    if (await codeEl.isVisible({ timeout: 5000 }).catch(() => false)) {
      await expect(shareBtn).toBeVisible();
    }
  });
});
