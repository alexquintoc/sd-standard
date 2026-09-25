import assert from "node:assert/strict";
import test from "node:test";
import { getAllUpdates, getUpdate } from "./updates";

const englishSlug = "what-is-a-design-made-of-abierto-2026";
const spanishSlug = "de-que-esta-hecho-un-diseno-abierto-2026";

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
  assert.match(english.body, /Denisse, Co-founder\. Arudeko/);
  assert.match(spanish.body, /Denisse Arnaiz, Co-fundadora\. Arudeko/);
  assert.match(english.body, /\/projects\/abierto/);
  assert.match(spanish.body, /\/projects\/abierto/);
});

test("the July announcement exposes its dated follow-up metadata", () => {
  const july = getUpdate("abierto-de-diseno-cdmx-2026", { includeScheduled: true });

  assert.ok(july);
  assert.equal(july.followUpSlug, englishSlug);
  assert.equal(july.followUpDate, "2026-09-25T06:00:00.000Z");
  assert.doesNotMatch(july.body, /to be confirmed/i);
});
