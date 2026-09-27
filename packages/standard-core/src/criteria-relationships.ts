import type { RelationshipCriteriaData, RelationshipCriterion } from "./relationship-map";

export type CriterionRelationshipType = "reinforces" | "enables" | "potential-tension";
export type CriterionRelationshipStatus = "draft" | "reviewed";

export type CriterionRelationshipSource = {
  title: string;
  url: string;
};

export type CriterionRelationship = {
  id: string;
  criterionIds: readonly [string, string];
  type: CriterionRelationshipType;
  explanation: string;
  conditions: string;
  editorialStatus: CriterionRelationshipStatus;
  sources?: readonly CriterionRelationshipSource[];
};

export type ResolvedCriterion = RelationshipCriterion & {
  pillarId: string;
  pillarLabel: string;
};

export type ResolvedCriterionRelationship = CriterionRelationship & {
  criteria: readonly [ResolvedCriterion, ResolvedCriterion];
};

// Human-curated only. Shared SDGs, keywords, or categories are not evidence of a relationship.
// criterionIds always use stable internal IDs from criteria.v2.json, never displayId values.
export const CURATED_CRITERIA_RELATIONSHIPS: readonly CriterionRelationship[] = [
  {
    id: "C2-C3-language-and-indigenous-culture",
    criterionIds: ["C2", "C3"],
    type: "reinforces",
    explanation:
      "Language preservation may support the continuity of Indigenous cultural knowledge, identity, and intergenerational transmission. Language work is one part of cultural continuity, not a substitute for it.",
    conditions:
      "Indigenous communities must direct the work, decide what may be shared, and retain authority over language, knowledge, representation, and intellectual property.",
    editorialStatus: "draft",
    sources: [
      {
        title: "UNESCO: Indigenous languages, knowledge and hope",
        url: "https://www.unesco.org/en/articles/indigenous-languages-knowledge-and-hope",
      },
    ],
  },
  {
    id: "C2-EM6-language-and-ecological-knowledge",
    criterionIds: ["C2", "EM6"],
    type: "enables",
    explanation:
      "Protecting an endangered Indigenous language may help sustain place-based ecological knowledge and stewardship practices carried through that language. This is a possible pathway, not proof of an environmental outcome.",
    conditions:
      "Indigenous communities must direct the work, the language and associated practices must remain active, and any ecological outcome must be evaluated separately in its local context.",
    editorialStatus: "draft",
    sources: [
      {
        title: "UNESCO: Indigenous languages, knowledge and hope",
        url: "https://www.unesco.org/en/articles/indigenous-languages-knowledge-and-hope",
      },
      {
        title: "IPBES: Indigenous and local knowledge",
        url: "https://www.ipbes.net/assessment-guide_indigenous-and-local-knowledge",
      },
    ],
  },
  {
    id: "C3-EM6-culture-and-stewardship",
    criterionIds: ["C3", "EM6"],
    type: "enables",
    explanation:
      "Supporting living Indigenous cultural practices may help sustain place-based ecological knowledge and stewardship. Cultural preservation alone does not guarantee ecosystem conservation.",
    conditions:
      "Indigenous communities must govern the work and have continued access, rights, and capacity to practice stewardship in the relevant place.",
    editorialStatus: "draft",
    sources: [
      {
        title: "UNESCO: Local, Indigenous and scientific knowledge",
        url: "https://www.unesco.org/en/biodiversity/knowledge",
      },
      {
        title: "IPBES: Indigenous and local knowledge",
        url: "https://www.ipbes.net/assessment-guide_indigenous-and-local-knowledge",
      },
    ],
  },
  {
    id: "E7-F2-durability-and-profitability",
    criterionIds: ["E7", "F2"],
    type: "potential-tension",
    explanation:
      "Designing for longer use, repair, or upgrade can require additional development and service costs, while reducing repeat sales in some business models. It can also create value through repair, leasing, or service models.",
    conditions:
      "The balance depends on product category, pricing, warranty, expected lifetime, repair access, and whether the business model captures value over time.",
    editorialStatus: "draft",
    sources: [
      {
        title: "Ellen MacArthur Foundation: Designing products to be used more and for longer",
        url: "https://www.ellenmacarthurfoundation.org/articles/designing-products-to-be-used-more-and-for-longer",
      },
    ],
  },
  {
    id: "S11-F2-affordability-and-profitability",
    criterionIds: ["S11", "F2"],
    type: "potential-tension",
    explanation:
      "Keeping a product affordable for people with limited financial resources can put pressure on the budget needed to compensate the design entity fairly.",
    conditions:
      "Scope, pricing, subsidies, cross-subsidy, licensing, or phased delivery may help, but affordability should not depend on unpaid design work.",
    editorialStatus: "reviewed",
  },
  {
    id: "S3-F1-local-labour-and-regional-benefit",
    criterionIds: ["S3", "F1"],
    type: "reinforces",
    explanation:
      "Sourcing labour locally can help a project direct some economic value toward the region and communities connected to the work.",
    conditions:
      "The benefit depends on fair pay, meaningful local participation, suitable skills, and evidence that value remains in the region rather than only being contracted there.",
    editorialStatus: "reviewed",
  },
  {
    id: "E3-F5-material-and-financial-transparency",
    criterionIds: ["E3", "F5"],
    type: "reinforces",
    explanation:
      "Clear material disclosure can reinforce accountable procurement and documentation by making product composition visible to project decision-makers.",
    conditions:
      "The disclosed information must be complete, understandable, current, and connected to purchasing or reporting decisions. Disclosure does not by itself establish financial accountability.",
    editorialStatus: "reviewed",
  },
  {
    id: "S6-F2-accessibility-and-profitability",
    criterionIds: ["S6", "F2"],
    type: "enables",
    explanation:
      "Accessible electronic documents and interfaces may help a project reach and serve more people while reducing avoidable remediation and support work.",
    conditions:
      "Accessibility must be designed, tested, and maintained with disabled users in mind. Wider access or lower remediation costs do not automatically make a project profitable or replace fair compensation for the design entity.",
    editorialStatus: "draft",
  },
  {
    id: "C7-F1-community-and-economic-benefit",
    criterionIds: ["C7", "F1"],
    type: "enables",
    explanation:
      "Community participation can help identify which economic benefits matter locally and who should receive them.",
    conditions:
      "Participation must influence decisions, include affected groups, and avoid extracting unpaid community knowledge. Economic outcomes still require separate goals and evidence.",
    editorialStatus: "reviewed",
  },
  {
    id: "E14-F2-recyclability-and-profitability",
    criterionIds: ["E14", "F2"],
    type: "potential-tension",
    explanation:
      "Designing for recycling or reuse can add material, production, collection, or recovery costs. It may also create value through reuse, take-back, or material recovery models.",
    conditions:
      "The financial effect depends on material markets, product volumes, reverse logistics, recovery rates, customer participation, and who pays for end-of-use handling.",
    editorialStatus: "draft",
  },
  {
    id: "E19-F2-logistics-and-profitability",
    criterionIds: ["E19", "F2"],
    type: "enables",
    explanation:
      "More efficient storage and transportation may reduce project costs and operational complexity, which can help protect a workable project budget.",
    conditions:
      "Financial benefit depends on actual volumes, routes, warehousing, service levels, and contracts. Efficiency should not come from unsafe work, unfair pay, or shifting environmental costs elsewhere.",
    editorialStatus: "draft",
  },
  {
    id: "E21-S2-air-pollution-and-health",
    criterionIds: ["E21", "S2"],
    type: "reinforces",
    explanation:
      "Reducing air pollution can support human health and safety by reducing exposure to pollutants associated with respiratory and cardiovascular harm.",
    conditions:
      "The pathway depends on which pollutants are reduced, the scale and location of exposure, who is exposed, and whether reductions are measured rather than assumed.",
    editorialStatus: "draft",
    sources: [
      {
        title: "WHO: Ambient outdoor air pollution",
        url: "https://www.who.int/news-room/fact-sheets/detail/ambient-%28outdoor%29-air-quality-and-health",
      },
    ],
  },
  {
    id: "E23-S2-water-pollution-and-health",
    criterionIds: ["E23", "S2"],
    type: "reinforces",
    explanation:
      "Reducing water pollution can support human health and safety when it reduces exposure to microbial or chemical contamination.",
    conditions:
      "The pathway depends on the pollutant, exposure route, affected population, local water system, and verified water-quality improvement. Reduced water use alone does not establish a health benefit.",
    editorialStatus: "draft",
    sources: [
      {
        title: "WHO: Drinking-water",
        url: "https://www.who.int/news-room/fact-sheets/detail/drinking-water",
      },
    ],
  },
  {
    id: "SM3-SM1-workers-and-human-rights",
    criterionIds: ["SM3", "SM1"],
    type: "reinforces",
    explanation:
      "Protecting fundamental worker rights reinforces the broader commitment to avoid involvement in human-rights violations.",
    conditions:
      "The review must cover relevant workers and supply-chain relationships, use credible evidence, and include remedy when harm is found. Meeting one criterion does not automatically prove the other.",
    editorialStatus: "draft",
  },
  {
    id: "FM3-S12-paid-work-and-fair-trade",
    criterionIds: ["FM3", "S12"],
    type: "reinforces",
    explanation:
      "Avoiding unpaid design work can reinforce fairer international collaboration by recognizing creative labour as work that should be compensated.",
    conditions:
      "The relationship is most relevant to collaborations across income contexts. Payment must also be fair, timely, and proportionate; payment alone does not establish fair trade.",
    editorialStatus: "draft",
  },
  {
    id: "FM3-S13-paid-work-and-social-gaps",
    criterionIds: ["FM3", "S13"],
    type: "reinforces",
    explanation:
      "Refusing unpaid design work may help reduce power and wealth gaps when people with less bargaining power would otherwise carry uncompensated project costs.",
    conditions:
      "The effect depends on who is paid, how much, who controls the terms, and whether interns, students, freelancers, and marginalized practitioners are treated equitably.",
    editorialStatus: "draft",
  },
  {
    id: "SM2-F5-corruption-and-accountability",
    criterionIds: ["SM2", "F5"],
    type: "reinforces",
    explanation:
      "Transparent financial management and documentation can reinforce anti-corruption practice by making decisions, payments, and responsibilities easier to examine.",
    conditions:
      "Documentation must be accurate, accessible to appropriate reviewers, and paired with governance, oversight, and consequences. Transparency alone does not prevent corruption.",
    editorialStatus: "draft",
  },
];

function canonicalPair([first, second]: readonly [string, string]) {
  return [first, second].sort().join("::");
}

export function validateCriterionRelationships(
  criteriaData: RelationshipCriteriaData,
  relationships: readonly CriterionRelationship[] = CURATED_CRITERIA_RELATIONSHIPS,
) {
  const criterionIds = new Set(
    criteriaData.pillars.flatMap((pillar) => pillar.criteria.map((criterion) => criterion.id)),
  );
  const relationshipIds = new Set<string>();
  const pairs = new Set<string>();
  const errors: string[] = [];

  for (const relationship of relationships) {
    if (relationshipIds.has(relationship.id)) {
      errors.push(`Duplicate relationship id: ${relationship.id}`);
    }
    relationshipIds.add(relationship.id);

    const pair = canonicalPair(relationship.criterionIds);
    if (pairs.has(pair)) {
      errors.push(`Duplicate criterion pair: ${relationship.criterionIds.join(" and ")}`);
    }
    pairs.add(pair);

    if (relationship.criterionIds[0] === relationship.criterionIds[1]) {
      errors.push(`Relationship ${relationship.id} references the same criterion twice.`);
    }

    for (const criterionId of relationship.criterionIds) {
      if (!criterionIds.has(criterionId)) {
        errors.push(`Relationship ${relationship.id} references missing criterion ${criterionId}.`);
      }
    }
  }

  return errors;
}

export function resolveCriterionRelationships(
  criteriaData: RelationshipCriteriaData,
  relationships: readonly CriterionRelationship[] = CURATED_CRITERIA_RELATIONSHIPS,
): ResolvedCriterionRelationship[] {
  const errors = validateCriterionRelationships(criteriaData, relationships);
  if (errors.length) {
    throw new Error(`Invalid criterion relationships:\n${errors.join("\n")}`);
  }

  const criteria = new Map<string, ResolvedCriterion>();
  for (const pillar of criteriaData.pillars) {
    for (const criterion of pillar.criteria) {
      criteria.set(criterion.id, {
        ...criterion,
        pillarId: pillar.id,
        pillarLabel: pillar.label.replace(/\s+Criteria$/i, ""),
      });
    }
  }

  return relationships.map((relationship) => ({
    ...relationship,
    criteria: relationship.criterionIds.map((id) => criteria.get(id)!) as [
      ResolvedCriterion,
      ResolvedCriterion,
    ],
  }));
}
