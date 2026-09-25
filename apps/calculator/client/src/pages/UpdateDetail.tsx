import { PageMeta } from "@/public-site/PageIntro";
import { useEffect, useState } from "react";
import { MarkdownContent } from "@/components/MarkdownContent";
import { fetchUpdate, type Update } from "@/lib/updates";

export default function UpdateDetail({ params }: { params: { slug: string } }) {
  const [item, setItem] = useState<Update | null>();
  useEffect(() => { fetchUpdate(params.slug).then(setItem).catch(() => setItem(null)); }, [params.slug]);

  if (item === undefined) return <main className="mx-auto max-w-4xl p-10">Loading update…</main>;
  if (item === null) return <main className="mx-auto max-w-4xl p-10"><h1 className="text-4xl font-extrabold">Update not found</h1></main>;

  const spanish = item.locale === "es";
  const basePath = spanish ? "/es/about/updates" : "/about/updates";
  const alternatePath = item.translationSlug ? `${spanish ? "" : "/es"}/about/updates/${item.translationSlug}` : undefined;
  const showFollowUp = Boolean(item.followUpSlug && item.followUpDate && (Date.parse(item.followUpDate) <= Date.now() || import.meta.env.VITE_INCLUDE_SCHEDULED_UPDATES === "1"));

  return (
    <main lang={item.locale} className="mx-auto max-w-4xl px-5 py-14 sm:px-8">
      <a className="font-bold text-[#28775e] underline underline-offset-4 focus:outline-none focus:ring-4 focus:ring-[#85bba8]" href={basePath}>{spanish ? "Volver a novedades" : "Back to all updates"}</a>
      <PageMeta title={item.title} description={item.summary} lang={item.locale} alternatePath={alternatePath} ogType="article" /><article className="mt-8">
        <div className="flex flex-wrap gap-4 text-sm font-bold text-[#5f5a50]">
          <span className="uppercase text-[#28775e]">{item.category}</span>
          <time dateTime={item.publishedDate}>{new Date(item.publishedDate).toLocaleDateString(item.locale, { dateStyle: "long", timeZone: "UTC" })}</time>
        </div>
        <h1 className="mt-5 text-4xl font-extrabold leading-tight sm:text-5xl">{item.title}</h1>
        {item.summary ? <p className="mt-5 text-xl leading-8 text-[#5f5a50]">{item.summary}</p> : null}
        {alternatePath ? <p className="mt-5 text-sm font-bold"><a className="text-[#28775e] underline underline-offset-4 focus:outline-none focus:ring-4 focus:ring-[#85bba8]" href={alternatePath} hrefLang={spanish ? "en" : "es"}>{spanish ? "Read this release in English" : "Leer esta publicación en español"}</a></p> : null}
        {showFollowUp ? <p className="mt-6 border-l-4 border-[#85bba8] py-2 pl-4 text-sm font-bold"><time dateTime={item.followUpDate}>{new Date(item.followUpDate!).toLocaleDateString("en", { dateStyle:"long", timeZone:"UTC" })}</time>: <a className="text-[#28775e] underline underline-offset-4 focus:outline-none focus:ring-4 focus:ring-[#85bba8]" href={`/about/updates/${item.followUpSlug}`}>{item.followUpTitle}</a>.</p> : null}
        {item.featuredImage ? <img className="mt-8 w-full rounded-lg" src={item.featuredImage} alt={item.imageAlt ?? ""} /> : null}
        <div className="mt-10">
          <MarkdownContent markdown={item.body} />
        </div>
      </article>
    </main>
  );
}
