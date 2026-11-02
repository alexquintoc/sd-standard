import { Fragment, type ReactNode } from "react";
import { PILLAR_COLORS, type PillarColorKey } from "@/lib/pillar-colors";

export function MarkdownContent({ markdown }: { markdown: string }) {
  return (
    <div className="space-y-5 text-base leading-8 text-[#5f5a50]">
      {markdown.split(/\n{2,}/).map((block) => block.trim()).filter(Boolean).map(renderBlock)}
    </div>
  );
}

function renderBlock(block: string, key: number) {
  const figure = parseFigure(block);
  if (figure) {
    return (
      <figure className="my-10" key={key}>
        <a
          aria-label={`Open larger image: ${figure.alt}`}
          className="block overflow-hidden rounded-lg focus:outline-none focus:ring-4 focus:ring-[#85bba8]"
          href={figure.src}
          rel="noreferrer"
          target="_blank"
        >
          <img
            alt={figure.alt}
            className="h-auto w-full"
            decoding="async"
            height={figure.height}
            loading="lazy"
            src={figure.src}
            width={figure.width}
          />
        </a>
        {figure.caption ? <figcaption className="mt-3 text-sm leading-6 text-[#5f5a50]">{renderInline(figure.caption)}</figcaption> : null}
      </figure>
    );
  }

  if (block.startsWith("**Relevant SD Standard")) return renderCriteria(block, key);
  if (block.startsWith("### ")) return <h3 className="pt-3 text-xl font-extrabold leading-tight text-[#1f241f]" key={key}>{renderInline(block.slice(4))}</h3>;
  if (/^#{1,2}\s/.test(block)) return <h2 className="pt-4 text-2xl font-extrabold leading-tight text-[#1f241f]" key={key}>{renderInline(block.replace(/^#{1,2}\s+/, ""))}</h2>;
  if (/^-\s+/m.test(block)) return <ul className="list-disc space-y-2 pl-6" key={key}>{block.split(/\r?\n/).map((item) => <li key={item}>{renderInline(item.replace(/^-\s+/, ""))}</li>)}</ul>;
  if (/^>\s?/m.test(block)) {
    const lines = block.split(/\r?\n/).map((line) => line.replace(/^>\s?/, "")).filter(Boolean);
    const attribution = lines.at(-1)?.startsWith("— ") ? lines.pop() : undefined;
    return <blockquote className="border-l-4 border-[#85bba8] py-1 pl-5 text-lg leading-8 text-[#1f241f]" key={key}><p>{renderInline(lines.join(" "))}</p>{attribution ? <cite className="mt-3 block text-sm font-bold not-italic text-[#5f5a50]">{renderInline(attribution)}</cite> : null}</blockquote>;
  }
  return <p key={key}>{renderInline(block)}</p>;
}

function parseFigure(block: string) {
  const match = block.match(/^!\[([^\]]+)]\((\S+)(?:\s+"(\d+)x(\d+)")?\)(?:\r?\n\*([\s\S]+)\*)?$/);
  if (!match) return null;

  return {
    alt: match[1],
    src: match[2],
    width: Number(match[3]) || undefined,
    height: Number(match[4]) || undefined,
    caption: match[5],
  };
}

function renderCriteria(block: string, key: number) {
  const links = Array.from(block.matchAll(/\[([^\]]+)]\(([^)\s]+)\)/g));
  return (
    <aside aria-label="Relevant SD Standard criteria" className="rounded-lg border border-[#d9d4c8] bg-[#fffdf8] p-5" key={key}>
      <p className="text-sm font-extrabold uppercase tracking-wide text-[#5f5a50]">Relevant SD Standard criteria</p>
      <ul className="mt-3 flex list-none flex-wrap gap-2 p-0">
        {links.map((match) => {
          const code = match[1].split("—", 1)[0].trim();
          const pillar = criterionPillar(code);
          return (
            <li key={match[2]}>
              <a
                className="inline-flex rounded-full border-2 bg-white px-3 py-1 text-sm font-extrabold text-[#1f241f] no-underline hover:bg-[#f5f1e8] focus:outline-none focus:ring-4 focus:ring-[#85bba8]"
                href={match[2]}
                style={{ borderColor: PILLAR_COLORS[pillar] }}
              >
                {match[1]}
              </a>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}

function criterionPillar(code: string): PillarColorKey {
  if (code.startsWith("EM") || code.startsWith("E")) return "environment";
  if (code.startsWith("SM") || code.startsWith("S")) return "society";
  if (code.startsWith("C")) return "culture";
  return "finance";
}

function renderInline(markdown: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const pattern = /(\*\*([^*]+)\*\*|\*([^*]+)\*|\[([^\]]+)\]\(([^)\s]+)\))/g;
  let cursor = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(markdown))) {
    if (match.index > cursor) nodes.push(markdown.slice(cursor, match.index));
    if (match[2]) nodes.push(<strong className="font-extrabold text-[#1f241f]" key={match.index}>{match[2]}</strong>);
    else if (match[3]) nodes.push(<em key={match.index}>{match[3]}</em>);
    else {
      const external = /^https?:\/\//.test(match[5]);
      nodes.push(<a className="font-bold text-[#28775e] underline underline-offset-2 hover:text-[#1f241f] focus:outline-none focus:ring-4 focus:ring-[#85bba8]" href={match[5]} key={match.index} rel={external ? "noreferrer" : undefined} target={external ? "_blank" : undefined}>{match[4]}</a>);
    }
    cursor = pattern.lastIndex;
  }

  if (cursor < markdown.length) nodes.push(markdown.slice(cursor));
  return nodes.map((node, index) => <Fragment key={index}>{node}</Fragment>);
}
