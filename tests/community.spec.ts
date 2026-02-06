import { test, expect } from "@playwright/test";
import { gotoAuth } from "./helpers/test-utils";

test.describe("커뮤니티 - 미인증", () => {
  test("미인증 시 잠금 화면 표시", async ({ page }) => {
    await page.goto("/community");
    await expect(page.locator("text=성인 인증 후 이용할 수 있습니다")).toBeVisible();
    await expect(page.locator("text=홈으로 이동")).toBeVisible();
  });
});

test.describe("커뮤니티 - 인증 후", () => {
  test("빈 게시글 목록 표시", async ({ page }) => {
    await gotoAuth(page, "/community");
    await expect(page.locator("h1:has-text('커뮤니티')")).toBeVisible();
    await expect(page.locator("text=새 글 쓰기")).toBeVisible();
    // Category tabs
    await expect(page.locator("text=전체")).toBeVisible();
    await expect(page.locator("text=상품 Q&A")).toBeVisible();
    await expect(page.locator("text=자유토론")).toBeVisible();
    await expect(page.locator("text=팁/추천")).toBeVisible();
  });

  test("글 작성 → 목록에 반영", async ({ page }) => {
    await gotoAuth(page, "/community/new");

    // Fill in post form
    await page.click("button:has-text('자유토론')");
    await page.fill("input[placeholder='제목을 입력하세요']", "테스트 게시글 제목");
    await page.fill("textarea[placeholder='내용을 입력하세요']", "테스트 게시글 내용입니다.");

    // Submit
    await page.click("button:has-text('익명으로 게시')");
    await page.waitForURL("**/community**");

    // Verify post appears in list
    await expect(page.locator("text=테스트 게시글 제목")).toBeVisible();
  });

  test("글 상세 + 댓글 작성", async ({ page }) => {
    // First create a post
    await gotoAuth(page, "/community/new");
    await page.click("button:has-text('자유토론')");
    await page.fill("input[placeholder='제목을 입력하세요']", "상세보기 테스트");
    await page.fill("textarea[placeholder='내용을 입력하세요']", "상세보기 내용입니다.");
    await page.click("button:has-text('익명으로 게시')");
    await page.waitForURL("**/community**");

    // Click on the post to see detail
    await page.click("text=상세보기 테스트");
    await expect(page.locator("h1:has-text('상세보기 테스트')")).toBeVisible();
    await expect(page.locator("text=상세보기 내용입니다.")).toBeVisible();
    await expect(page.locator("text=익명1")).toBeVisible();

    // Write a reply
    await page.fill("input[placeholder='익명으로 답변하기...']", "테스트 댓글입니다");
    await page.click("button:has-text('답변')");

    // Verify reply appears
    await expect(page.locator("text=테스트 댓글입니다")).toBeVisible();
    await expect(page.locator("text=답변 1개")).toBeVisible();
  });

  test("카테고리 필터링", async ({ page }) => {
    // Create posts in different categories
    await gotoAuth(page, "/community/new");
    await page.click("button:has-text('팁/추천')");
    await page.fill("input[placeholder='제목을 입력하세요']", "팁 카테고리 글");
    await page.fill("textarea[placeholder='내용을 입력하세요']", "팁 내용");
    await page.click("button:has-text('익명으로 게시')");
    await page.waitForURL("**/community**");

    // Filter by tips
    await page.click("button:has-text('팁/추천')");
    await expect(page.locator("text=팁 카테고리 글")).toBeVisible();
  });

  test("투표 기능", async ({ page }) => {
    // Create a post
    await gotoAuth(page, "/community/new");
    await page.click("button:has-text('자유토론')");
    await page.fill("input[placeholder='제목을 입력하세요']", "투표 테스트");
    await page.fill("textarea[placeholder='내용을 입력하세요']", "투표 내용");
    await page.click("button:has-text('익명으로 게시')");
    await page.waitForURL("**/community**");

    // Go to post detail
    await page.click("text=투표 테스트");
    await expect(page.locator("h1:has-text('투표 테스트')")).toBeVisible();

    // Click upvote
    await page.locator("button:has-text('+')").first().click();
    // Score should be 1
    await expect(page.locator("text=1").first()).toBeVisible();
  });
});
