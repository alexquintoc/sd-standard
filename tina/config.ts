import { defineConfig } from "tinacms";
import criteriaV2 from "../packages/standard-core/src/criteria.v2.json";

// Your hosting provider likely exposes this as an environment variable
const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  "main";

const criteriaPrefixByPillar: Record<string, string> = {
  environment: "E",
  society: "S",
  social: "S",
  culture: "C",
  cultural: "C",
  finance: "F",
  financial: "F",
};

type CriteriaWithDisplayIds = {
  id?: string;
  displayId?: string;
  label: string;
};

const criteriaOptions = criteriaV2.pillars.flatMap((pillar) =>
  pillar.criteria.map((rawCriterion, index) => {
    const criterion = rawCriterion as CriteriaWithDisplayIds;
    const generatedDisplayId = `${criteriaPrefixByPillar[pillar.id]}${index + 1}`;
    const displayId = criterion.displayId ?? generatedDisplayId;
    const referenceId = criterion.id ?? displayId;

    return {
      label: `${referenceId} / ${displayId} - ${criterion.label}`,
      value: referenceId,
    };
  }),
);

export default defineConfig({
  branch,

  // Get this from tina.io
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID,
  // Get this from tina.io
  token: process.env.TINA_TOKEN,

  build: {
    outputFolder: "admin",
    publicFolder: "apps/calculator/client/public",
  },
  // Uncomment to allow cross-origin requests from non-localhost origins
  // during local development (e.g. GitHub Codespaces, Gitpod, Docker).
  // Use 'private' to allow all private-network IPs (WSL2, Docker, etc.)
  // server: {
  //   allowedOrigins: ['https://your-codespace.github.dev'],
  // },
  media: {
    tina: {
      mediaRoot: "",
      publicFolder: "apps/calculator/client/public",
    },
  },
  // See docs on content modeling for more info on how to setup new content models: https://tina.io/docs/r/content-modelling-collections/
  schema: {
    collections: [
      {
        name: "update",
        label: "Updates",
        path: "content/updates",
        format: "mdx",
        fields: [
          { type: "string", name: "title", label: "Title", isTitle: true, required: true },
          {
            type: "string",
            name: "summary",
            label: "Summary",
            ui: { component: "textarea" },
          },
          { type: "datetime", name: "publishedDate", label: "Publication date", required: true },
          { type: "boolean", name: "published", label: "Published" },
          { type: "string", name: "locale", label: "Language", options: ["en", "es"] },
          { type: "string", name: "translationSlug", label: "Translation slug" },
          { type: "string", name: "followUpSlug", label: "Follow-up update slug" },
          { type: "string", name: "followUpTitle", label: "Follow-up link label" },
          { type: "datetime", name: "followUpDate", label: "Follow-up publication date" },
          {
            type: "string",
            name: "category",
            label: "Category",
            required: true,
            options: ["Event", "Project update", "Partnership", "Research", "Tool release", "Opportunity"],
          },
          { type: "image", name: "featuredImage", label: "Featured image" },
          {
            type: "string",
            name: "imageAlt",
            label: "Featured image alternative text",
            description: "Required when a featured image is supplied. Describe the image's content and purpose.",
          },
          { type: "rich-text", name: "body", label: "Body", isBody: true },
          { type: "boolean", name: "showInAnnouncementBar", label: "Show in announcement bar" },
          { type: "string", name: "announcementText", label: "Announcement text" },
          {
            type: "string",
            name: "announcementLinkLabel",
            label: "Announcement link label",
            ui: { defaultValue: "Learn more" },
          },
          { type: "datetime", name: "announcementStart", label: "Announcement start" },
          { type: "datetime", name: "announcementEnd", label: "Announcement end" },
          { type: "number", name: "announcementPriority", label: "Announcement priority" },
        ],
        ui: {
          router: ({ document }) => `/updates/${document._sys.filename}`,
        },
      },
      {
        name: "post",
        label: "Posts",
        path: "content/posts",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true,
          },
          {
            type: "rich-text",
            name: "body",
            label: "Body",
            isBody: true,
          },
        ],
        ui: {
          // This is an DEMO router. You can remove this to fit your site
          router: ({ document }) => `/demo/blog/${document._sys.filename}`,
        },
      },
      {
        name: "project",
        label: "Projects",
        path: "content/projects",
        format: "mdx",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true,
          },
          {
            type: "string",
            name: "description",
            label: "Description",
            ui: {
              component: "textarea",
            },
          },
          {
            type: "number",
            name: "year",
            label: "Year",
          },
          {
            type: "string",
            name: "location",
            label: "Location",
          },
          {
            type: "string",
            name: "projectType",
            label: "Project Type",
          },
          {
            type: "string",
            name: "website",
            label: "Website",
          },
          {
            type: "image",
            name: "coverImage",
            label: "Cover Image",
          },
          {
            type: "image",
            name: "gallery",
            label: "Gallery",
            list: true,
          },
          {
            type: "string",
            name: "pillars",
            label: "Pillars",
            list: true,
            options: ["environment", "society", "culture", "finance"],
          },
          {
            type: "string",
            name: "criteria",
            label: "Criteria",
            list: true,
            options: criteriaOptions,
          },
          {
            type: "string",
            name: "rating",
            label: "Rating",
            options: ["Emerging", "Advanced", "Transformative"],
          },
          {
            type: "number",
            name: "score",
            label: "Score",
          },
          {
            type: "string",
            name: "relatedBaselines",
            label: "Related Baselines",
            list: true,
            description: "Optional baseline slugs linked to this project.",
          },
          {
            type: "boolean",
            name: "published",
            label: "Published",
          },
          {
            type: "rich-text",
            name: "body",
            label: "Body",
            isBody: true,
          },
        ],
        ui: {
          router: ({ document }) => `/projects/${document._sys.filename}`,
        },
      },
      {
        name: "baseline",
        label: "Baseline Studies",
        path: "content/baselines",
        format: "mdx",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true,
          },
          {
            type: "string",
            name: "slug",
            label: "Slug",
            required: true,
          },
          {
            type: "string",
            name: "summary",
            label: "Summary",
            ui: {
              component: "textarea",
            },
          },
          {
            type: "string",
            name: "projectType",
            label: "Project Type",
          },
          {
            type: "string",
            name: "format",
            label: "Format",
          },
          {
            type: "string",
            name: "region",
            label: "Region",
          },
          {
            type: "number",
            name: "year",
            label: "Year",
          },
          {
            type: "image",
            name: "coverImage",
            label: "Cover Image",
          },
          {
            type: "image",
            name: "gallery",
            label: "Gallery",
            list: true,
          },
          {
            type: "string",
            name: "pillars",
            label: "Pillars",
            list: true,
            options: ["environment", "society", "culture", "finance"],
          },
          {
            type: "string",
            name: "criteria",
            label: "Criteria",
            list: true,
            options: criteriaOptions,
            description: "Store criteria references only, such as E1, E4, S6, C4, or F2.",
          },
          {
            type: "string",
            name: "sdgs",
            label: "SDGs",
            list: true,
          },
          {
            type: "string",
            name: "rating",
            label: "Rating",
            options: ["Baseline", "Improved", "Best Practice", "Experimental"],
          },
          {
            type: "number",
            name: "estimatedCarbonKg",
            label: "Estimated Carbon (kg CO2e)",
          },
          {
            type: "number",
            name: "estimatedWasteKg",
            label: "Estimated Waste (kg)",
          },
          {
            type: "number",
            name: "estimatedLifespanUses",
            label: "Estimated Lifespan Uses",
          },
          {
            type: "string",
            name: "recyclability",
            label: "Recyclability",
            options: ["High", "Medium", "Low", "Unknown"],
          },
          {
            type: "string",
            name: "productionAssumptions",
            label: "Production Assumptions",
            list: true,
          },
          {
            type: "string",
            name: "materialAssumptions",
            label: "Material Assumptions",
            list: true,
          },
          {
            type: "string",
            name: "transportAssumptions",
            label: "Transport Assumptions",
            list: true,
          },
          {
            type: "string",
            name: "disposalAssumptions",
            label: "Disposal Assumptions",
            list: true,
          },
          {
            type: "string",
            name: "evidenceNotes",
            label: "Evidence Notes",
            ui: {
              component: "textarea",
            },
          },
          {
            type: "object",
            name: "sources",
            label: "Sources",
            list: true,
            fields: [
              {
                type: "string",
                name: "label",
                label: "Label",
              },
              {
                type: "string",
                name: "url",
                label: "URL",
              },
            ],
          },
          {
            type: "string",
            name: "relatedProjects",
            label: "Related Projects",
            list: true,
            description: "Optional project slugs linked to this baseline.",
          },
          {
            type: "boolean",
            name: "published",
            label: "Published",
          },
          {
            type: "rich-text",
            name: "body",
            label: "Body",
            isBody: true,
          },
        ],
        ui: {
          router: ({ document }) => `/baselines/${document._sys.filename}`,
        },
      },
    ],
  },
});
