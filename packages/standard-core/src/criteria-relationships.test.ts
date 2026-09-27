import assert from "node:assert/strict";
import test from "node:test";
import criteriaV2 from "./criteria.v2.json";
import {
  CURATED_CRITERIA_RELATIONSHIPS,
  resolveCriterionRelationships,
  validateCriterionRelationships,
} from "./criteria-relationships";

test("curated criterion relationships reference canonical criteria without duplicate pairs", () => {
  const errors = validateCriterionRelationships(criteriaV2, CURATED_CRITERIA_RELATIONSHIPS);
  assert.deepEqual(errors, []);

  const resolved = resolveCriterionRelationships(criteriaV2, CURATED_CRITERIA_RELATIONSHIPS);
  assert.equal(resolved.length, CURATED_CRITERIA_RELATIONSHIPS.length);
  assert.equal(resolved.find((item) => item.id.startsWith("C2-EM6"))?.criteria[0].displayId, "C1");
  assert.equal(resolved.find((item) => item.id.startsWith("C2-EM6"))?.criteria[1].displayId, "EM10");

  const pairs = new Set(resolved.map((item) => [...item.criterionIds].sort().join("::")));
  for (const pair of [
    "E14::F2",
    "E19::F2",
    "E21::S2",
    "E23::S2",
    "SM1::SM3",
    "FM3::S12",
    "FM3::S13",
    "F5::SM2",
    "F2::S6",
  ]) {
    assert.ok(pairs.has(pair), `Expected curated relationship ${pair}`);
  }
  assert.equal(pairs.has("F7::S6"), false);
});

test("relationship validation rejects missing criteria and duplicate unordered pairs", () => {
  const relationships = [
    {
      ...CURATED_CRITERIA_RELATIONSHIPS[0],
      id: "first",
      criterionIds: ["C2", "missing"] as const,
    },
    {
      ...CURATED_CRITERIA_RELATIONSHIPS[0],
      id: "second",
      criterionIds: ["missing", "C2"] as const,
    },
  ];
  const errors = validateCriterionRelationships(criteriaV2, relationships);
  assert.ok(errors.some((error) => error.includes("missing criterion missing")));
  assert.ok(errors.some((error) => error.includes("Duplicate criterion pair")));
});
