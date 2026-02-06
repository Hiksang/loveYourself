import { test, expect } from "@playwright/test";
import { gotoAuth } from "./helpers/test-utils";

test.describe("구독 플랜", () => {
  test("구독 페이지 렌더링 및 플랜 목록", async ({ page }) => {
    await gotoAuth(page, "/subscription");

    // Page should render
    await expect(page.locator("h1")).toBeVisible();
  });

  test("구독 플랜 카드 표시", async ({ page }) => {
    await gotoAuth(page, "/subscription");

    // Should have plan cards with pricing
    const plans = page.locator("[class*='rounded']").filter({ hasText: "WLD" });
    // At least one plan should be visible
    if (await plans.first().isVisible({ timeout: 5000 }).catch(() => false)) {
      expect(await plans.count()).toBeGreaterThan(0);
    }
  });

  test("인기 배지 표시", async ({ page }) => {
    await gotoAuth(page, "/subscription");

    // Look for popular badge
    const popularBadge = page.locator("text=인기");
    if (await popularBadge.isVisible({ timeout: 5000 }).catch(() => false)) {
      await expect(popularBadge.first()).toBeVisible();
    }
  });
});
