import { type Page, expect } from "@playwright/test";

/**
 * Navigate to a path with dev mode auto-authentication.
 */
export async function gotoAuth(page: Page, path: string) {
  const sep = path.includes("?") ? "&" : "?";
  await page.goto(`${path}${sep}dev=true`, { waitUntil: "networkidle" });
}

/**
 * Add the first product to cart from the products page
 */
export async function addProductToCart(page: Page) {
  await gotoAuth(page, "/products");
  await page.locator("button:has-text('담기')").first().click();
  // Verify badge appeared
  const badge = page.locator("nav span.rounded-full.bg-primary");
  await expect(badge).toBeVisible();
}
