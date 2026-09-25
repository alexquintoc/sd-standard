import fs from "fs";
import path from "path";
import { parseMdx, type FrontmatterValue } from "./content";

export type Update = { slug:string; title:string; summary:string; publishedDate:string; published:boolean; category:string; locale:"en"|"es"; translationSlug?:string; followUpSlug?:string; followUpTitle?:string; followUpDate?:string; featuredImage?:string; imageAlt?:string; body:string; showInAnnouncementBar:boolean; announcementText?:string; announcementLinkLabel:string; announcementStart?:string; announcementEnd?:string; announcementPriority?:number };
const directory = path.resolve(process.cwd(), "..", "..", "content", "updates");
const str = (value: FrontmatterValue | undefined) => typeof value === "string" && value.trim() ? value : undefined;
const time = (value: string) => Number.isNaN(Date.parse(value)) ? 0 : Date.parse(value);

export function getAllUpdates(options: { includeScheduled?: boolean; now?: Date } = {}): Update[] {
  if (!fs.existsSync(directory)) return [];
  const includeScheduled = options.includeScheduled ?? process.env.SD_UPDATES_INCLUDE_SCHEDULED === "1";
  const now = options.now?.getTime() ?? Date.now();
  return fs.readdirSync(directory).filter((name) => /\.mdx?$/.test(name)).map((name) => {
    const { frontmatter: f, body } = parseMdx(fs.readFileSync(path.join(directory, name), "utf8"));
    const imageAlt = str(f.imageAlt); const featuredImage = str(f.featuredImage);
    return { slug:name.replace(/\.mdx?$/, ""), title:String(f.title ?? "Untitled update"), summary:String(f.summary ?? ""), publishedDate:String(f.publishedDate ?? ""), published:f.published === true, category:String(f.category ?? "Project update"), locale:f.locale === "es" ? "es" : "en", translationSlug:str(f.translationSlug), followUpSlug:str(f.followUpSlug), followUpTitle:str(f.followUpTitle), followUpDate:str(f.followUpDate), featuredImage: imageAlt ? featuredImage : undefined, imageAlt, body, showInAnnouncementBar:f.showInAnnouncementBar === true, announcementText:str(f.announcementText), announcementLinkLabel:String(f.announcementLinkLabel || "Learn more"), announcementStart:str(f.announcementStart), announcementEnd:str(f.announcementEnd), announcementPriority:typeof f.announcementPriority === "number" ? f.announcementPriority : undefined };
  }).filter((item) => item.published && (includeScheduled || time(item.publishedDate) <= now)).sort((a,b) => time(b.publishedDate)-time(a.publishedDate));
}
export function getUpdate(slug:string, options: { includeScheduled?: boolean; now?: Date } = {}) { return getAllUpdates(options).find((item) => item.slug === slug) ?? null; }
