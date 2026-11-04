import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("research pilot landing page", () => {
  test("has correct metadata, content, links, and no serious accessibility violations", async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", message => { if (message.type() === "error") consoleErrors.push(message.text()); });
    await page.goto("/research-pilot");

    await expect(page).toHaveTitle("SD Standard Research Pilot 2027 | Sustainable Design Standard");
    await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /January–March 2027/);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://sdstandard.org/research-pilot");
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("sustainability became part");
    await expect(page.locator("#why-heading").locator("..")).toHaveClass(/pilot-heading-stacked/);
    await expect(page.locator("#principles-heading").locator("..")).toHaveClass(/pilot-heading-stacked/);
    await expect(page.locator(".pilot-output").filter({ hasText: "Project documentation using the Standard's framework" })).toBeVisible();
    await expect(page.getByText("Expression-of-interest deadline", { exact: true })).toBeVisible();
    await expect(page.getByText("December 6, 2026", { exact: true })).toBeVisible();
    await expect(page.getByText("Selected participants announced", { exact: true })).toBeVisible();
    await expect(page.getByText("December 18, 2026", { exact: true })).toBeVisible();
    await expect(page.locator(".pilot-facts > div")).toHaveCount(6);
    await expect(page.getByText("Expressions of interest close December 6, 2026.", { exact: true })).toBeVisible();
    await expect(page.getByRole("link", { name: "Explore an example Project Passport" })).toHaveAttribute("href", "/projects/abierto");
    const passportImage = page.getByAltText("Abierto de Diseño installation documented in the existing Project Passport");
    await passportImage.scrollIntoViewIfNeeded();
    await expect.poll(() => passportImage.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0);
    const form = page.locator(".pilot-form");
    await expect(form.locator('input[name="future-news"]')).not.toBeChecked();
    await expect(form.locator('input[name="privacy-acknowledgment"]')).not.toBeChecked();

    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations.filter(item => ["serious", "critical"].includes(item.impact ?? ""))).toEqual([]);
    expect(consoleErrors).toEqual([]);
    await page.locator(".pilot-hero").screenshot({ path: "../../.local/browser-results/research-pilot-desktop-hero.png" });
    await page.locator("section[aria-labelledby='why-heading']").screenshot({ path: "../../.local/browser-results/research-pilot-desktop-why.png" });
    await page.locator("section[aria-labelledby='principles-heading']").screenshot({ path: "../../.local/browser-results/research-pilot-desktop-principles.png" });
    await page.locator(".pilot-passport-section").screenshot({ path: "../../.local/browser-results/research-pilot-desktop-passport.png" });
  });

  test("validates required fields and shows confirmation after a successful Netlify post", async ({ page }) => {
    let submittedBody = "";
    await page.route("/", async route => {
      if (route.request().method() === "POST") {
        submittedBody = route.request().postData() ?? "";
        await route.fulfill({ status: 200, contentType: "text/html", body: "ok" });
        return;
      }
      await route.continue();
    });
    await page.goto("/research-pilot#apply");
    const form = page.locator(".pilot-form");
    await page.getByRole("button", { name: "Submit expression of interest" }).click();
    await expect(form.locator('input[name="name"]:invalid')).toHaveCount(1);

    await form.locator('input[name="name"]').fill("Pilot Tester");
    await form.locator('input[name="email"]').fill("pilot@example.com");
    await form.locator('input[name="country-region"]').fill("Mexico");
    await form.locator('select[name="role"]').selectOption({ label: "Independent designer" });
    await form.locator('select[name="project-type"]').selectOption({ label: "Website or digital experience" });
    await form.locator('textarea[name="project-description"]').fill("An early-stage digital communication project.");
    await form.locator('select[name="project-stage"]').selectOption({ label: "Early design development" });
    await form.locator('select[name="availability"]').selectOption({ label: "Yes" });
    await form.locator('input[name="privacy-acknowledgment"]').check();
    await page.getByRole("button", { name: "Submit expression of interest" }).click();

    await expect(page.getByRole("heading", { name: "Thank you for your interest!" })).toBeVisible();
    expect(submittedBody).toContain("form-name=research-pilot-2027");
    expect(submittedBody).toContain("privacy-acknowledgment=acknowledged");
    expect(submittedBody).not.toContain("future-news=yes");
    await expect(page.getByRole("link", { name: "Explore the SD Standard" })).toHaveAttribute("href", "/explore");
  });

  test("keeps the connected timeline readable on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/research-pilot#timeline");
    const timeline = page.locator(".pilot-timeline");
    await expect(timeline.locator(":scope > li")).toHaveCount(3);
    await expect(timeline.getByText("January", { exact: true })).toBeVisible();
    await expect(timeline.getByText("March", { exact: true })).toBeVisible();
    await page.screenshot({ path: "../../.local/browser-results/research-pilot-mobile.png", fullPage: true });
  });
});
