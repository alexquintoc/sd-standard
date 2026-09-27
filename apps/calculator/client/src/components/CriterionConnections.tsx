import { useMemo, useState, type KeyboardEvent } from "react";
import {
  getCriterionKnowledgeBaseUrl,
  PILLAR_COLORS,
  resolveCriterionRelationships,
  type CriterionRelationshipType,
  type RelationshipCriteriaData,
  type ResolvedCriterion,
  type ResolvedCriterionRelationship,
} from "@sd-standard/standard-core";

const TYPE_LABELS: Record<CriterionRelationshipType, string> = {
  reinforces: "Reinforces",
  enables: "May enable",
  "potential-tension": "Potential tension",
};

const TYPE_DESCRIPTIONS: Record<CriterionRelationshipType, string> = {
  reinforces: "The criteria can support one another when the stated conditions are present.",
  enables: "One criterion may create useful conditions for the other, but does not guarantee it.",
  "potential-tension": "The criteria may pull decisions in different directions and require balancing.",
};

const GUIDED_EXAMPLES = [
  {
    label: "Language, culture and ecosystems",
    criterionId: "C2",
    relationshipId: "C2-EM6-language-and-ecological-knowledge",
  },
  {
    label: "Durability and business models",
    criterionId: "E7",
    relationshipId: "E7-F2-durability-and-profitability",
  },
  {
    label: "Affordability and fair compensation",
    criterionId: "S11",
    relationshipId: "S11-F2-affordability-and-profitability",
  },
] as const;

function publicId(criterion: ResolvedCriterion) {
  return criterion.displayId || criterion.id;
}

function criterionLabel(criterion: ResolvedCriterion) {
  return `${publicId(criterion)} ${criterion.label}`;
}

function partnerFor(relationship: ResolvedCriterionRelationship, selectedId: string) {
  return relationship.criteria[0].id === selectedId
    ? relationship.criteria[1]
    : relationship.criteria[0];
}

type ChordNode = {
  criterion: ResolvedCriterion;
  angle: number;
  x: number;
  y: number;
  labelX: number;
  labelY: number;
};

type PillarArc = {
  id: string;
  label: string;
  color: string;
  startAngle: number;
  endAngle: number;
  labelAngle: number;
};

const CHORD_CENTER = 410;
const CHORD_NODE_RADIUS = 286;
const CHORD_LABEL_RADIUS = 310;
const CHORD_PILLAR_LABEL_RADIUS = 366;

function pointOnCircle(angle: number, radius: number) {
  const radians = (angle * Math.PI) / 180;
  return {
    x: CHORD_CENTER + Math.cos(radians) * radius,
    y: CHORD_CENTER + Math.sin(radians) * radius,
  };
}

function buildChordLayout(criteriaData: RelationshipCriteriaData) {
  const criteriaCount = criteriaData.pillars.reduce((total, pillar) => total + pillar.criteria.length, 0);
  const groupGap = 12;
  const step = (360 - groupGap * criteriaData.pillars.length) / criteriaCount;
  const nodes: ChordNode[] = [];
  const arcs: PillarArc[] = [];
  let angle = -90;

  for (const pillar of criteriaData.pillars) {
    const startAngle = angle;
    for (const criterion of pillar.criteria) {
      const nodeAngle = angle + step / 2;
      const point = pointOnCircle(nodeAngle, CHORD_NODE_RADIUS);
      const labelPoint = pointOnCircle(nodeAngle, CHORD_LABEL_RADIUS);
      nodes.push({
        criterion: {
          ...criterion,
          pillarId: pillar.id,
          pillarLabel: pillar.label.replace(/\s+Criteria$/i, ""),
        },
        angle: nodeAngle,
        x: point.x,
        y: point.y,
        labelX: labelPoint.x,
        labelY: labelPoint.y,
      });
      angle += step;
    }
    const endAngle = angle;
    arcs.push({
      id: pillar.id,
      label: pillar.label.replace(/\s+Criteria$/i, ""),
      color: PILLAR_COLORS[pillar.id as keyof typeof PILLAR_COLORS],
      startAngle,
      endAngle,
      labelAngle: startAngle + (endAngle - startAngle) / 2,
    });
    angle += groupGap;
  }

  return { nodes, arcs };
}

function arcPath(startAngle: number, endAngle: number, radius: number) {
  const start = pointOnCircle(startAngle, radius);
  const end = pointOnCircle(endAngle, radius);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y}`;
}

function chordPath(source: ChordNode, target: ChordNode) {
  return `M ${source.x} ${source.y} Q ${CHORD_CENTER} ${CHORD_CENTER} ${target.x} ${target.y}`;
}

function textOrientation(angle: number, inward = false) {
  const normalized = ((angle % 360) + 360) % 360;
  const leftSide = normalized > 90 && normalized < 270;
  return {
    rotation: leftSide ? angle + 180 : angle,
    anchor: inward
      ? leftSide
        ? ("start" as const)
        : ("end" as const)
      : leftSide
        ? ("end" as const)
        : ("start" as const),
  };
}

function CriterionName({ criterion }: { criterion: ResolvedCriterion }) {
  return (
    <>
      <span className="block text-xs font-extrabold uppercase tracking-[0.1em]">
        {publicId(criterion)} · {criterion.pillarLabel}
      </span>
      <span className="mt-1 block font-extrabold leading-tight">{criterion.label}</span>
    </>
  );
}

function KnowledgeBaseLink({ criterion }: { criterion: ResolvedCriterion }) {
  const url = getCriterionKnowledgeBaseUrl(criterion);
  if (!url) return null;

  return (
    <a className="connections-text-link" href={url}>
      Open {publicId(criterion)} in the Knowledge Base
      <span aria-hidden="true"> ↗</span>
    </a>
  );
}

function RelationshipDetail({ relationship }: { relationship: ResolvedCriterionRelationship }) {
  return (
    <article className="connections-detail" aria-labelledby={`relationship-${relationship.id}`}>
      <div className="connections-detail__heading">
        <span className={`connections-type connections-type--${relationship.type}`}>
          {TYPE_LABELS[relationship.type]}
        </span>
        <span className="connections-status">
          {relationship.editorialStatus === "reviewed" ? "Editorially reviewed" : "Editorial review pending"}
        </span>
      </div>

      <h2 id={`relationship-${relationship.id}`} className="sr-only">
        {criterionLabel(relationship.criteria[0])} and {criterionLabel(relationship.criteria[1])}
      </h2>

      <div className="connections-pair" aria-label="Criteria in this relationship">
        {relationship.criteria.map((criterion) => (
          <div key={criterion.id}>
            <CriterionName criterion={criterion} />
            <KnowledgeBaseLink criterion={criterion} />
          </div>
        ))}
      </div>

      <div className="connections-detail__copy">
        <div>
          <h3>Possible relationship</h3>
          <p>{relationship.explanation}</p>
        </div>
        <div>
          <h3>Conditions and limits</h3>
          <p>{relationship.conditions}</p>
        </div>
        <p className="connections-meaning">
          <strong>What this line means:</strong> {TYPE_DESCRIPTIONS[relationship.type]}
        </p>
      </div>

      {relationship.sources?.length ? (
        <div className="connections-sources">
          <h3>Sources</h3>
          <ul>
            {relationship.sources.map((source) => (
              <li key={source.url}>
                <a
                  className="connections-text-link"
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${source.title} (opens in a new tab)`}
                >
                  {source.title}<span aria-hidden="true"> ↗</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </article>
  );
}

export function CriterionConnections({ criteriaData }: { criteriaData: RelationshipCriteriaData }) {
  const relationships = useMemo(() => resolveCriterionRelationships(criteriaData), [criteriaData]);
  const chordLayout = useMemo(() => buildChordLayout(criteriaData), [criteriaData]);
  const allCriteria = useMemo(
    () =>
      criteriaData.pillars.flatMap((pillar) =>
        pillar.criteria.map((criterion) => ({
          ...criterion,
          pillarId: pillar.id,
          pillarLabel: pillar.label.replace(/\s+Criteria$/i, ""),
        })),
      ) as ResolvedCriterion[],
    [criteriaData],
  );
  const [selectedCriterionId, setSelectedCriterionId] = useState("C2");
  const [selectedRelationshipId, setSelectedRelationshipId] = useState(
    "C2-EM6-language-and-ecological-knowledge",
  );

  const selectedCriterion =
    allCriteria.find((criterion) => criterion.id === selectedCriterionId) ?? allCriteria[0];
  const connections = relationships.filter((relationship) =>
    relationship.criterionIds.includes(selectedCriterion.id),
  );
  const selectedRelationship =
    connections.find((relationship) => relationship.id === selectedRelationshipId) ?? connections[0] ?? null;
  const connectedCriterionIds = new Set(
    connections.flatMap((relationship) => relationship.criterionIds).filter((id) => id !== selectedCriterion.id),
  );
  const criteriaWithConnections = new Set(relationships.flatMap((relationship) => relationship.criterionIds));
  const chordNodesById = new Map(chordLayout.nodes.map((node) => [node.criterion.id, node]));

  function selectCriterion(criterionId: string, preferredRelationshipId?: string) {
    setSelectedCriterionId(criterionId);
    const nextConnections = relationships.filter((relationship) =>
      relationship.criterionIds.includes(criterionId),
    );
    setSelectedRelationshipId(
      preferredRelationshipId && nextConnections.some((item) => item.id === preferredRelationshipId)
        ? preferredRelationshipId
        : nextConnections[0]?.id ?? "",
    );
  }

  function activateOnKeyboard(event: KeyboardEvent<SVGGElement>, action: () => void) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      action();
    }
  }

  return (
    <div className="connections-explorer">
      <section className="connections-controls" aria-labelledby="connections-controls-title">
        <div>
          <h2 id="connections-controls-title">Choose a criterion</h2>
          <label htmlFor="criterion-connection-select">
            Search by typing a code or name after opening the list.
          </label>
          <select
            id="criterion-connection-select"
            value={selectedCriterion.id}
            onChange={(event) => selectCriterion(event.target.value)}
          >
            {criteriaData.pillars.map((pillar) => (
              <optgroup key={pillar.id} label={pillar.label.replace(/\s+Criteria$/i, "")}>
                {pillar.criteria.map((criterion) => (
                  <option key={criterion.id} value={criterion.id}>
                    {criterion.displayId || criterion.id} {criterion.label}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        <div className="connections-guides">
          <h2>Guided examples</h2>
          <div>
            {GUIDED_EXAMPLES.map((example) => (
              <button
                key={example.relationshipId}
                type="button"
                aria-pressed={selectedRelationshipId === example.relationshipId}
                onClick={() => selectCriterion(example.criterionId, example.relationshipId)}
              >
                {example.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="connections-workspace">
        <section className="connections-network-panel" aria-labelledby="connections-network-title">
          <div className="connections-network-heading">
            <div>
              <p>{selectedCriterion.pillarLabel}</p>
              <h2 id="connections-network-title">{criterionLabel(selectedCriterion)}</h2>
            </div>
            <span aria-live="polite">
              {connections.length} curated {connections.length === 1 ? "connection" : "connections"}
            </span>
          </div>

          {connections.length ? (
            <div className="connections-chord-wrap">
              <svg
                className="connections-chord"
                viewBox="0 0 820 820"
                role="group"
                aria-label={`Circular chord diagram for ${criterionLabel(selectedCriterion)}`}
              >
                <g className="connections-chord__arcs" aria-hidden="true">
                  {chordLayout.arcs.map((arc) => {
                    const labelPoint = pointOnCircle(arc.labelAngle, CHORD_PILLAR_LABEL_RADIUS);
                    return (
                      <g key={arc.id}>
                        <path d={arcPath(arc.startAngle, arc.endAngle, 298)} style={{ stroke: arc.color }} />
                        <text x={labelPoint.x} y={labelPoint.y} textAnchor="middle">
                          {arc.label}
                        </text>
                      </g>
                    );
                  })}
                </g>

                <g className="connections-chord__context" aria-hidden="true">
                  {relationships
                    .filter((relationship) => !relationship.criterionIds.includes(selectedCriterion.id))
                    .map((relationship) => {
                      const source = chordNodesById.get(relationship.criterionIds[0]);
                      const target = chordNodesById.get(relationship.criterionIds[1]);
                      if (!source || !target) return null;
                      return (
                        <path
                          key={relationship.id}
                          d={chordPath(source, target)}
                          className={`connections-chord__path connections-chord__path--context connections-chord__path--${relationship.type}`}
                          style={{ stroke: PILLAR_COLORS[source.criterion.pillarId as keyof typeof PILLAR_COLORS] }}
                        />
                      );
                    })}
                </g>

                <g className="connections-chord__active-paths">
                  {connections.map((relationship) => {
                    const source = chordNodesById.get(relationship.criterionIds[0]);
                    const target = chordNodesById.get(relationship.criterionIds[1]);
                    if (!source || !target) return null;
                    const partner = partnerFor(relationship, selectedCriterion.id);
                    const isActive = selectedRelationship?.id === relationship.id;
                    const path = chordPath(source, target);
                    const label = `${TYPE_LABELS[relationship.type]} connection between ${criterionLabel(relationship.criteria[0])} and ${criterionLabel(relationship.criteria[1])}`;
                    return (
                      <g
                        key={relationship.id}
                        role="button"
                        tabIndex={0}
                        aria-label={label}
                        aria-pressed={isActive}
                        onClick={() => setSelectedRelationshipId(relationship.id)}
                        onKeyDown={(event) =>
                          activateOnKeyboard(event, () => setSelectedRelationshipId(relationship.id))
                        }
                      >
                        <path
                          d={path}
                          className={`connections-chord__path connections-chord__path--${relationship.type}${isActive ? " is-active" : ""}`}
                          style={{ stroke: PILLAR_COLORS[partner.pillarId as keyof typeof PILLAR_COLORS] }}
                        />
                        <path d={path} className="connections-chord__hit-path" />
                      </g>
                    );
                  })}
                </g>

                <g className="connections-chord__nodes">
                  {chordLayout.nodes.map((node) => {
                    const isSelected = node.criterion.id === selectedCriterion.id;
                    const isRelated = connectedCriterionIds.has(node.criterion.id);
                    const isAvailable = criteriaWithConnections.has(node.criterion.id);
                    const emphasized = isSelected || isRelated;
                    const labelPoint = emphasized
                      ? pointOnCircle(node.angle, 266)
                      : { x: node.labelX, y: node.labelY };
                    const orientation = textOrientation(node.angle, emphasized);
                    const nodeClass = isSelected
                      ? "is-selected"
                      : isRelated
                        ? "is-related"
                        : "is-context";
                    return (
                      <g
                        key={node.criterion.id}
                        className={nodeClass}
                        role="button"
                        tabIndex={isAvailable ? 0 : -1}
                        aria-label={`Select ${criterionLabel(node.criterion)}`}
                        aria-pressed={isSelected}
                        aria-disabled={!isAvailable}
                        onClick={() => selectCriterion(node.criterion.id)}
                        onKeyDown={(event) =>
                          isAvailable && activateOnKeyboard(event, () => selectCriterion(node.criterion.id))
                        }
                      >
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={isSelected ? 11 : isRelated ? 8 : 4.5}
                          style={{ fill: PILLAR_COLORS[node.criterion.pillarId as keyof typeof PILLAR_COLORS] }}
                        />
                        <text
                          x={labelPoint.x}
                          y={labelPoint.y}
                          textAnchor={orientation.anchor}
                          transform={`rotate(${orientation.rotation} ${labelPoint.x} ${labelPoint.y})`}
                        >
                          {isSelected || isRelated
                            ? `${publicId(node.criterion)} ${node.criterion.label}`
                            : publicId(node.criterion)}
                        </text>
                      </g>
                    );
                  })}
                </g>

                <g className="connections-chord__center-label" aria-hidden="true">
                  <text x="410" y="395" textAnchor="middle">{publicId(selectedCriterion)}</text>
                  <text x="410" y="420" textAnchor="middle">{selectedCriterion.label}</text>
                  <text x="410" y="445" textAnchor="middle">
                    {connections.length} curated {connections.length === 1 ? "connection" : "connections"}
                  </text>
                </g>
              </svg>
            </div>
          ) : (
            <div className="connections-empty" role="status">
              <h3>No curated connections yet</h3>
              <p>
                This does not mean the criterion is isolated. It means a relationship has not yet been
                written and reviewed for this dataset.
              </p>
            </div>
          )}

          <div className="connections-legend" aria-label="Relationship types">
            {(Object.keys(TYPE_LABELS) as CriterionRelationshipType[]).map((type) => (
              <span key={type} className={`connections-legend__${type}`}>
                <i aria-hidden="true" /> {TYPE_LABELS[type]}
              </span>
            ))}
          </div>
        </section>

        {selectedRelationship ? (
          <RelationshipDetail relationship={selectedRelationship} />
        ) : (
          <aside className="connections-detail connections-detail--empty">
            <h2>Select a connection</h2>
            <p>Choose a node or a relationship in the list to read its explanation and limits.</p>
          </aside>
        )}
      </div>

      {connections.length ? (
        <section className="connections-list" aria-labelledby="connections-list-title">
          <div>
            <h2 id="connections-list-title">Connections as a list</h2>
            <p>The list contains the same relationships as the circular view.</p>
          </div>
          <ul>
            {connections.map((relationship) => {
              const partner = partnerFor(relationship, selectedCriterion.id);
              return (
                <li key={relationship.id}>
                  <button
                    type="button"
                    aria-pressed={selectedRelationship?.id === relationship.id}
                    onClick={() => setSelectedRelationshipId(relationship.id)}
                  >
                    <span className={`connections-type connections-type--${relationship.type}`}>
                      {TYPE_LABELS[relationship.type]}
                    </span>
                    <strong>{criterionLabel(partner)}</strong>
                    <span>{relationship.explanation}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
