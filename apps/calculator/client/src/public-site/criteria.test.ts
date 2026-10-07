import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { test } from "node:test";
import { publicCriteria, spanishCriteria, localizedCriterion, scopeLabel, filterCriteria } from "./criteria";
import questions from "./design-questions.json";
import { projectTypes } from "./project-types";
import { createBlankProject } from "../../../../../packages/standard-core/src/project/createProject";
test("public index contains all canonical criteria with valid scopes and generated KB files", () => {
  assert.equal(publicCriteria.length, 56);
  assert.equal(new Set(publicCriteria.map(item => item.id)).size, publicCriteria.length);
  for (const item of publicCriteria) {
    assert.ok(item.displayId); assert.ok(scopeLabel(item.appliesTo));
    assert.match(item.url, /^\/knowledge-base\/generated\/criteria\/.+\.html$/);
    const generatedPath = item.url.replace("/knowledge-base/", "docs/src/").replace(/\.html$/, ".md");
    assert.ok(existsSync(generatedPath), `Missing generated KB page: ${item.id}`);
  }
});
test("filters search stable IDs, display codes, titles and summaries", () => {
  assert.equal(filterCriteria("", "environment").length, 24);
  assert.equal(filterCriteria("", "society").length, 17);
  assert.ok(filterCriteria("Ink, Printing", "all").some(item => item.id === "E4"));
  assert.ok(filterCriteria("energy-efficiency", "all").length);
  assert.equal(filterCriteria("nothing matches this text", "all").length, 0);
});
test("Spanish translation lookup uses stable ID with safe explicit fallback", () => {
  const item = publicCriteria.find(item => item.id === "E4")!;
  assert.equal(item.displayId, "E3");
  const dictionary = { E4: { label: "Traducción revisada", summary: "Resumen revisado" } };
  assert.equal(localizedCriterion(item, true, dictionary).label, "Traducción revisada");
  assert.equal(localizedCriterion(item, true, {}).fallback, true);
  assert.equal(localizedCriterion(item, true, {}).label, item.label);
  for (const key of Object.keys(spanishCriteria)) assert.ok(publicCriteria.some(item => item.id === key), `Stale translation ${key}`);
});
test("organization applicability is separate from assessment component scope", () => {
  assert.equal(scopeLabel(["project"]), "Project");
  assert.equal(scopeLabel(["designingEntity"]), "Design entity");
  assert.equal(scopeLabel(["project", "designingEntity"], true), "Proyecto + Entidad de diseño");
  assert.throws(() => scopeLabel(["component"]));
});
test("all seven curated questions have unique valid stable IDs", () => {
  assert.equal(questions.length, 7);
  assert.equal(new Set(questions.map(item => item.id)).size, 7);
  for (const question of questions) {
    assert.equal(new Set(question.criterionIds).size, question.criterionIds.length);
    for (const id of question.criterionIds) assert.ok(publicCriteria.some(item => item.id === id), `Stale question mapping: ${question.id}/${id}`);
  }
});
test("project types create unified projects without selecting criteria", () => {
  assert.equal(projectTypes.length, 9);
  for (const type of projectTypes) {
    const project = createBlankProject({ title: type.name, projectTypes: [type.id] });
    assert.deepEqual(project.project.projectTypes, [type.id]); assert.deepEqual(project.criteriaAssessments, []);
  }
  const multiple = createBlankProject({ title: "Exhibition and publication", projectTypes: ["exhibition", "publication"] });
  assert.deepEqual(multiple.project.projectTypes, ["exhibition", "publication"]);
});
