import { useEffect, type ReactNode } from "react";
export function PageMeta({ title, description, lang = "en", alternatePath, ogType = "website" }: { title: string; description: string; lang?: string; alternatePath?: string; ogType?: "website" | "article" }) {
  useEffect(() => {
    const fullTitle = `${title} | SD Standard`; const canonicalUrl = `https://sdstandard.org${window.location.pathname.replace(/\/$/, "") || "/"}`;
    document.title = fullTitle; document.documentElement.lang = lang;
    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!meta) { meta = document.createElement("meta"); meta.name = "description"; document.head.append(meta); }
    meta.content = description;
    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement("link"); canonical.rel = "canonical"; document.head.append(canonical); }
    canonical.href = canonicalUrl;
    const social: Array<[string,string,string]> = [
      ["property","og:title",fullTitle], ["property","og:description",description], ["property","og:type",ogType], ["property","og:url",canonicalUrl], ["property","og:locale",lang === "es" ? "es_MX" : "en_US"],
      ["name","twitter:card","summary"], ["name","twitter:title",fullTitle], ["name","twitter:description",description],
    ];
    const socialNodes = social.map(([attribute,name,content]) => { const node=document.createElement("meta"); node.setAttribute(attribute,name); node.content=content; node.dataset.pageMeta="true"; document.head.append(node); return node; });
    let alternate: HTMLLinkElement | undefined;
    if (alternatePath) { alternate=document.createElement("link"); alternate.rel="alternate"; alternate.hreflang=lang === "es" ? "en" : "es"; alternate.href=`https://sdstandard.org${alternatePath}`; alternate.dataset.pageMeta="true"; document.head.append(alternate); }
    return () => { document.documentElement.lang = "en"; document.title = "SD Standard"; canonical?.remove(); socialNodes.forEach((node)=>node.remove()); alternate?.remove(); };
  }, [title, description, lang, alternatePath, ogType]); return null;
}
export function PageIntro({ title, description, eyebrow = "Explore the Standard", children }: { title: string; description: string; eyebrow?: string; children?: ReactNode }) {
  return <header className="public-intro"><p className="public-eyebrow">{eyebrow}</p><h1>{title}</h1><p>{description}</p>{children}</header>;
}
