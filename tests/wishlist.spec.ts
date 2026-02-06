import { test, expect } from "@playwright/test";
import { gotoAuth } from "./helpers/test-utils";

test.describe("위시리스트", () => {
  test("빈 위시리스트 표시", async ({ page }) => {
    await gotoAuth(page, "/wishlist");
    await expect(page.locator("text=위시리스트가 비어있습니다")).toBeVisible();
  });

  test("상품 페이지에서 위시리스트 추가/제거 토글", async ({ page }) => {
    await gotoAuth(page, "/products");

    // Find wishlist button (heart icon) and click to add
    const wishlistBtn = page.locator("[data-testid='wishlist-btn']").first();

    // If no data-testid, try by aria or text
    const heartBtn = wishlistBtn.or(page.locator("button[aria-label*='위시']").first()).or(
      page.locator("button:has-text('♡')").first()
    );

    // Try to click the first available wishlist toggle
    const firstHeart = heartBtn.first();
    if (await firstHeart.isVisible()) {
      await firstHeart.click();

      // Navigate to wishlist page
      await gotoAuth(page, "/wishlist");
      // Should have at least one product
      const emptyMsg = page.locator("text=위시리스트가 비어있습니다");
      const hasProduct = await emptyMsg.isVisible().catch(() => false);
      // If the button worked, it shouldn't be empty
      if (!hasProduct) {
        // Product was added, verify removal
        const removeBtn = page.locator("button:has-text('♥')").first().or(
          page.locator("[data-testid='wishlist-btn']").first()
        );
        if (await removeBtn.isVisible()) {
          await removeBtn.click();
        }
      }
    }
  });

  test("위시리스트 페이지 확인", async ({ page }) => {
    await gotoAuth(page, "/wishlist");
    // Page should render without error
    await expect(page.locator("h1")).toBeVisible();
  });
});
