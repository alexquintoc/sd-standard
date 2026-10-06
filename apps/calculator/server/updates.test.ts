import assert from "node:assert/strict";
import test from "node:test";
import { getAllUpdates, getUpdate } from "./updates";

const englishSlug = "what-is-a-design-made-of-abierto-2026";
const spanishSlug = "de-que-esta-hecho-un-diseno-abierto-2026";
const bidSlug = "sd-standard-selected-bienal-iberoamericana-diseno-2026";

test("the BID selection is the latest English update and retains its related links", () => {
  const updates = getAllUpdates({ now: new Date("2026-10-06T06:00:00.000Z") });
  const bid = getUpdate(bidSlug, { now: new Date("2026-10-06T06:00:00.000Z") });

  assert.equal(updates.filter((update) => update.locale === "en")[0]?.slug, bidSlug);
  assert.ok(bid);
  assert.equal(bid.featuredImage, "/images/updates/sd-standard-bid-2026.png");
  assert.equal(bid.imageAlt, "SD Standard selected for BID 2026");
  assert.equal(bid.showInAnnouncementBar, true);
  assert.equal(bid.announcementText, "SD Standard selected for BID 2026.");
  assert.equal(bid.announcementLinkLabel, "Learn more");
  assert.equal(bid.announcementPriority, 2);
  assert.match(bid.summary, /2026 Bienal Iberoamericana de Diseño/);
  assert.match(bid.body, /https:\/\/bid-dimad\.com\//);
  assert.match(bid.body, /\/explore\/pillars/);
  assert.match(bid.body, /\/projects\/abierto/);
});

test("the September press release stays unavailable before its Mexico City publication date", () => {
  const beforeRelease = new Date("2026-09-25T05:59:59.000Z");
  const slugs = getAllUpdates({ now: beforeRelease }).map((update) => update.slug);

  assert.equal(slugs.includes(englishSlug), false);
  assert.equal(slugs.includes(spanishSlug), false);
  assert.equal(getUpdate(englishSlug, { now: beforeRelease }), null);
});

test("both language versions publish together and retain reciprocal metadata", () => {
  const atRelease = new Date("2026-09-25T06:00:00.000Z");
  const english = getUpdate(englishSlug, { now: atRelease });
  const spanish = getUpdate(spanishSlug, { now: atRelease });

  assert.ok(english);
  assert.ok(spanish);
  assert.equal(english.locale, "en");
  assert.equal(spanish.locale, "es");
  assert.equal(english.translationSlug, spanishSlug);
  assert.equal(spanish.translationSlug, englishSlug);
  assert.equal(english.featuredImage, "/images/project-passports/abierto/abierto-installation-overview.jpg");
  assert.equal(spanish.featuredImage, english.featuredImage);
  assert.match(english.imageAlt ?? "", /illuminated woven textile/);
  assert.match(spanish.imageAlt ?? "", /textil tejido e iluminado/);
  assert.match(english.body, /Denisse Arnaiz, Co-founder of Arudeko design studio/);
  assert.match(spanish.body, /Denisse Arnaiz, cofundadora del estudio de diseño Arudeko/);
  assert.match(english.body, /https:\/\/sdstandard\.org\/impact-snapshot/);
  assert.match(spanish.body, /https:\/\/sdstandard\.org\/impact-snapshot/);
});

test("the July announcement exposes its dated follow-up metadata", () => {
  const july = getUpdate("abierto-de-diseno-cdmx-2026", { includeScheduled: true });

  assert.ok(july);
  assert.equal(july.showInAnnouncementBar, false);
  assert.equal(july.followUpSlug, englishSlug);
  assert.equal(july.followUpDate, "2026-09-25T06:00:00.000Z");
  assert.doesNotMatch(july.body, /to be confirmed/i);
});
