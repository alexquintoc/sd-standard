export type RelationshipMapMode = "overview" | "detail";

export type RelationshipPillarId = "environment" | "society" | "culture" | "finance";

export type RelationshipCriterion = {
  id: string;
  displayId?: string;
  label: string;
  description?: string;
  summary?: string;
  sdgs?: number[];
  mandatory?: boolean;
  slug?: string;
};

export type RelationshipPillar = {
  id: RelationshipPillarId | string;
  label: string;
  criteria: RelationshipCriterion[];
};

export type RelationshipCriteriaData = {
  pillars: RelationshipPillar[];
};

export type RelationshipMapNodeType = "pillar" | "criterion" | "sdg";

export type RelationshipMapCriterion = {
  id: string;
  displayId: string;
  title: string;
  summary: string;
  pillarId: string;
  pillarLabel: string;
  sdgs: number[];
  mandatory: boolean;
  url: string | null;
};

export type RelationshipMapNode = {
  id: string;
  label: string;
  type: RelationshipMapNodeType;
  pillarId?: string;
  pillarLabel?: string;
  criterionId?: string;
  sdg?: number;
  color?: string;
  criteria: RelationshipMapCriterion[];
};

export type RelationshipMapLink = {
  id: string;
  source: string;
  target: string;
  value: number;
  pillarId: string;
  pillarLabel: string;
  criterionId?: string;
  sdg?: number;
  criteria: RelationshipMapCriterion[];
};

export type RelationshipMapGraph = {
  nodes: RelationshipMapNode[];
  links: RelationshipMapLink[];
  criteria: RelationshipMapCriterion[];
  hasMandatoryCriteria: boolean;
};

export type RelationshipMapOptions = {
  mode?: RelationshipMapMode;
  pillarId?: RelationshipPillarId | "all";
  includeMandatory?: boolean;
  knowledgeBaseBasePath?: string;
  pillarColors?: Partial<Record<RelationshipPillarId | string, string>>;
};

export const SDG_LABELS: Record<number, string> = {
  1: "No Poverty",
  2: "Zero Hunger",
  3: "Good Health and Well-being",
  4: "Quality Education",
  5: "Gender Equality",
  6: "Clean Water and Sanitation",
  7: "Affordable and Clean Energy",
  8: "Decent Work and Economic Growth",
  9: "Industry, Innovation and Infrastructure",
  10: "Reduced Inequalities",
  11: "Sustainable Cities and Communities",
  12: "Responsible Consumption and Production",
  13: "Climate Action",
  14: "Life Below Water",
  15: "Life on Land",
  16: "Peace, Justice and Strong Institutions",
  17: "Partnerships for the Goals",
};

function normalizePillarLabel(label: string) {
  return label.replace(/\s+Criteria$/i, "");
}

export function getCriterionKnowledgeBaseUrl(
  criterion: Pick<RelationshipCriterion, "slug">,
  basePath = "/knowledge-base",
) {
  if (!criterion.slug) {
    return null;
  }

  return `${basePath.replace(/\/$/, "")}/generated/criteria/${criterion.slug}.html`;
}

function ensureNode(nodes: Map<string, RelationshipMapNode>, node: RelationshipMapNode) {
  const existing = nodes.get(node.id);
  if (!existing) {
    nodes.set(node.id, node);
    return node;
  }

  const criterionIds = new Set(existing.criteria.map((criterion) => criterion.id));
  for (const criterion of node.criteria) {
    if (!criterionIds.has(criterion.id)) {
      existing.criteria.push(criterion);
    }
  }

  return existing;
}

function addLink(
  links: Map<string, RelationshipMapLink>,
  link: Omit<RelationshipMapLink, "value">,
) {
  const existing = links.get(link.id);
  if (!existing) {
    links.set(link.id, {
      ...link,
      value: link.criteria.length,
    });
    return;
  }

  const criterionIds = new Set(existing.criteria.map((criterion) => criterion.id));
  for (const criterion of link.criteria) {
    if (!criterionIds.has(criterion.id)) {
      existing.criteria.push(criterion);
    }
  }
  existing.value = existing.criteria.length;
}

export function transformCriteriaToSankey(
  criteriaData: RelationshipCriteriaData,
  options: RelationshipMapOptions = {},
): RelationshipMapGraph {
  const mode = options.mode ?? "overview";
  const pillarFilter = options.pillarId ?? "all";
  const includeMandatory = options.includeMandatory ?? true;
  const knowledgeBaseBasePath = options.knowledgeBaseBasePath ?? "/knowledge-base";
  const nodes = new Map<string, RelationshipMapNode>();
  const links = new Map<string, RelationshipMapLink>();
  const criteria: RelationshipMapCriterion[] = [];
  let hasMandatoryCriteria = false;

  for (const pillar of criteriaData.pillars) {
    if (pillarFilter !== "all" && pillar.id !== pillarFilter) {
      continue;
    }

    const pillarLabel = normalizePillarLabel(pillar.label);
    const pillarNodeId = `pillar:${pillar.id}`;

    ensureNode(nodes, {
      id: pillarNodeId,
      label: pillarLabel,
      type: "pillar",
      pillarId: pillar.id,
      pillarLabel,
      color: options.pillarColors?.[pillar.id],
      criteria: [],
    });

    for (const sourceCriterion of pillar.criteria) {
      hasMandatoryCriteria = hasMandatoryCriteria || sourceCriterion.mandatory === true;

      if (!includeMandatory && sourceCriterion.mandatory === true) {
        continue;
      }

      const sdgs = Array.from(new Set(sourceCriterion.sdgs ?? []))
        .filter((sdg) => Number.isInteger(sdg) && sdg >= 1 && sdg <= 17)
        .sort((a, b) => a - b);

      if (sdgs.length === 0) {
        continue;
      }

      const criterion: RelationshipMapCriterion = {
        id: sourceCriterion.id,
        displayId: sourceCriterion.displayId ?? sourceCriterion.id,
        title: sourceCriterion.label,
        summary: sourceCriterion.summary ?? sourceCriterion.description ?? "",
        pillarId: pillar.id,
        pillarLabel,
        sdgs,
        mandatory: sourceCriterion.mandatory === true,
        url: getCriterionKnowledgeBaseUrl(sourceCriterion, knowledgeBaseBasePath),
      };

      criteria.push(criterion);
      nodes.get(pillarNodeId)?.criteria.push(criterion);

      if (mode === "detail") {
        const criterionNodeId = `criterion:${criterion.id}`;
        ensureNode(nodes, {
          id: criterionNodeId,
          label: `${criterion.displayId} ${criterion.title}`,
          type: "criterion",
          pillarId: pillar.id,
          pillarLabel,
          criterionId: criterion.id,
          color: options.pillarColors?.[pillar.id],
          criteria: [criterion],
        });

        addLink(links, {
          id: `${pillarNodeId}->${criterionNodeId}`,
          source: pillarNodeId,
          target: criterionNodeId,
          pillarId: pillar.id,
          pillarLabel,
          criterionId: criterion.id,
          criteria: [criterion],
        });
      }

      for (const sdg of sdgs) {
        const sdgNodeId = `sdg:${sdg}`;
        ensureNode(nodes, {
          id: sdgNodeId,
          label: `SDG ${sdg}: ${SDG_LABELS[sdg] ?? "Goal"}`,
          type: "sdg",
          sdg,
          criteria: [criterion],
        });

        if (mode === "detail") {
          addLink(links, {
            id: `criterion:${criterion.id}->${sdgNodeId}`,
            source: `criterion:${criterion.id}`,
            target: sdgNodeId,
            pillarId: pillar.id,
            pillarLabel,
            criterionId: criterion.id,
            sdg,
            criteria: [criterion],
          });
        } else {
          addLink(links, {
            id: `${pillarNodeId}->${sdgNodeId}`,
            source: pillarNodeId,
            target: sdgNodeId,
            pillarId: pillar.id,
            pillarLabel,
            sdg,
            criteria: [criterion],
          });
        }
      }
    }
  }

  return {
    nodes: Array.from(nodes.values()).filter((node) => node.criteria.length > 0),
    links: Array.from(links.values()),
    criteria,
    hasMandatoryCriteria,
  };
}
