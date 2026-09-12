export type SiteNavigationItem = {
  label: string;
  href: string;
  opensInNewTab?: boolean;
};

export type SiteNavigationSection = {
  id: "explore" | "projects" | "about";
  label: string;
  href: string;
  match: (location: string) => boolean;
  items: readonly SiteNavigationItem[];
};

export const siteNavigation: readonly SiteNavigationSection[] = [
  {
    id: "explore",
    label: "Explore",
    href: "/explore",
    match: (location: string) => location.startsWith("/explore") || location === "/es/criteria",
    items: [
      { label: "Browse by project type", href: "/explore#project-types" },
      { label: "The four pillars", href: "/explore/pillars" },
      { label: "The criteria", href: "/explore/criteria" },
      { label: "Project types", href: "/explore/project-types" },
      { label: "Tools and resources", href: "/explore#tools-and-resources" },
      { label: "Knowledge Base", href: "/knowledge-base", opensInNewTab: true },
      { label: "SDGs", href: "/explore/sdgs" },
    ],
  },
  {
    id: "projects",
    label: "Projects",
    href: "/projects",
    match: (location: string) => location.startsWith("/projects"),
    items: [
      { label: "Projects", href: "/projects" },
      { label: "Case studies", href: "/projects#case-studies" },
    ],
  },
  {
    id: "about",
    label: "About",
    href: "/about",
    match: (location: string) => location.startsWith("/about"),
    items: [
      { label: "What is the SD Standard", href: "/about#what-is-the-sd-standard" },
      { label: "Why it exists", href: "/about#why-it-exists" },
      { label: "Who developed it", href: "/about#who-developed-it" },
      { label: "Who is it for", href: "/about#who-is-it-for" },
      { label: "Project roadmap", href: "/about#roadmap" },
      { label: "Get involved", href: "/about/get-involved" },
      { label: "News and updates", href: "/about/updates" },
    ],
  },
];

export function knowledgeBaseLinkProps(item: SiteNavigationItem) {
  return item.opensInNewTab
    ? {
        target: "_blank" as const,
        rel: "noopener noreferrer",
        "aria-label": `${item.label} (opens in a new tab)`,
      }
    : {};
}
