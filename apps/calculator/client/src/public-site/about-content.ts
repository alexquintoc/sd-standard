import type { PillarColorKey } from "@/lib/pillar-colors";
export const pillars = [
  {
    title: "Environment",
    description:
      "Natural resources, emissions, waste, materials, energy, water, pollution, and ecological impacts.",
    colorKey: "environment",
  },
  {
    title: "Society",
    description:
      "Human rights, accessibility, labor, affordability, health, safety, education, and social equity.",
    colorKey: "society",
  },
  {
    title: "Culture",
    description:
      "Local culture, Indigenous culture, endangered languages, cultural diversity, audience engagement, and community participation.",
    colorKey: "culture",
  },
  {
    title: "Finance",
    description:
      "Fair compensation, profitability, economic benefits, accountability, transparency, and long-term value.",
    colorKey: "finance",
  },
] satisfies Array<{ title: string; description: string; colorKey: PillarColorKey }>;

export const audiences = [
  {
    title: "Designers and studios",
    description:
      "Use the criteria to ask better questions, improve project decisions, communicate sustainability choices, and document impact.",
  },
  {
    title: "Contributors",
    description:
      "Help improve criteria, write guidance, suggest case studies, test tools, review wording, or contribute examples from real projects.",
  },
  {
    title: "Advisors",
    description:
      "Review criteria, validate assumptions, identify gaps, and help align the framework with existing sustainability, accessibility, cultural, labor, or financial standards.",
  },
  {
    title: "Educational partners",
    description:
      "Use the SD Standard as a teaching framework for design briefs, critiques, studio projects, research assignments, and student self-assessment.",
  },
  {
    title: "Suppliers and production partners",
    description:
      "Share policies, certifications, material data, production practices, and evidence that can help designers make informed decisions.",
  },
  {
    title: "Nonprofits, institutions, and clients",
    description:
      "Use the framework to write better design briefs, evaluate project proposals, and understand how communications projects can support sustainability goals.",
  },
];

export const contributionWays = [
  "Designers and students: test the criteria on real projects; submit project examples or reflections.",
  "Educators: use the criteria in coursework.",
  "Researchers: help strengthen references and evidence.",
  "Advisors: review criteria and scoring logic.",
  "Suppliers: provide material, production, or certification data.",
  "Organizations: pilot the tools on communications projects.",
  "Developers: improve open-source tools and documentation.",
];

export const currentTools = [
  { title: "Creative Brief Generator", href: "/brief-generator" },
  { title: "Self-assessment Impact Calculator", href: "/calculator" },
  { title: "Impact Snapshot / Quick Project Scan tool", href: "/impact-snapshot" },
  { title: "Knowledge Base", href: "/knowledge-base" },
  { title: "References", href: "/references" },
];

export const roadmap = [
  {
    stage: "Stage 1",
    title: "Build the Framework",
    description: "Finalize the criteria, pillars, Knowledge Base, SDG mapping, and project guidance.",
  },
  {
    stage: "Stage 2",
    title: "Test the Tools",
    description: "Develop and refine the Brief Generator, Project Scan, Impact Calculator, Baselines, and Project Gallery.",
  },
  {
    stage: "Stage 3",
    title: "Pilot with Partners",
    description:
      "Work with designers, educators, suppliers, nonprofits, and organizations to test the standard on real projects.",
  },
  {
    stage: "Stage 4",
    title: "Create Recognition Pathways",
    description:
      "Introduce self-assessment, peer review, verified projects, supplier profiles, and public project records.",
  },
  {
    stage: "Stage 5",
    title: "Develop Certification and Custody Systems",
    description:
      "Build toward formal certification, supplier verification, and supply-chain custody documentation for design projects.",
  },
];

export const team = [
  {
    name: "Valerie Elliott",
    role: "F.DesCan, Strategic Communications Consultant, iD2 Communications Inc.",
    bio: "Valerie Elliott is a strategic creative working in Canada. She spearheaded and led the Sustainability Committee for the Professional Designers of Canada, previously the Graphic Designers of Canada, from 2007 to 2017, and joined the AIGA in developing their own sustainability initiative. She served as an International Council of Design (ico-D) sustainability juror from 2012 to 2015. From 2008 to 2009, Elliott sat on British Columbia, Canada's Climate Action Secretariat, Citizen's Conservation Council on Climate Action. Elliott has hosted exhibitions exploring social and environmental responsibility and spoken to design and business audiences across Canada on the importance of applying sustainability principles to design and communications work. She is a member of the International Association for Public Participation and is a film producer.",
  },
  {
    name: "Tuuli Sauren",
    role: "Founder/Creative Director, INSPIRIT Creatives UG / NGO",
    bio: "Tuuli Sauren is a multidisciplinary Art Director and activist working across borders worldwide with more than two decades of experience in communication design, sustainability, and human rights advocacy. She has worked extensively with NGOs and United Nations agencies since 2001. She brings a rare combination of strategic design expertise, systems thinking, and social justice commitment to the evaluation of sustainable design projects. Tuuli served as an International Council of Design (ico-D) sustainability juror from 2012 to 2015 and founded the Sustainable Designers Initiative (SDI), an initiative to expand equitable access to design education globally. Her work focuses on human-centred design, ethical impact, and the long-term societal consequences of organizational and design decisions, approaching sustainability not as compliance or perceived optics, but as a responsibility to human dignity, cultural integrity, and future generations.",
  },
  {
    name: "Alex Quinto",
    role: "Visual communication designer and web designer",
    bio: "Alex Quinto is a visual communication designer and web designer from Mexico focused on helping mission-driven organizations create clearer, more responsible communications. He has worked on design and digital projects for nonprofits, public-interest organizations, and international institutions, including the Inter-American Development Bank, Resilient Cities Catalyst, Bloomberg Philanthropies, and was previously a designer at Rockefeller Foundation's 100 Resilient Cities program. Alex served as an International Council of Design (ico-D) sustainability juror from 2012 to 2015. As a co-creator of the SD Standard, Alex develops practical tools, criteria, and resources to help designers reduce environmental impact, strengthen social value, and make sustainability easier to apply in everyday design work.",
  },
];

export const foundingContributors =
  "David Berman (original concept and founding chair), Marc Alt, Edi Berk, Simon Berry, Riitta Brusila, Donna Campbell, Banu, Valerie Elliott, Richard Henderson, Jiang Hua, Betty Lam Yan Yan, Ezio Manzini, Heidrun Mumper-Drumm, Stephen Palmer, Peter Perstel, Alex Quinto, Ajanta Sen, Tuuli Sauren, Sophie Thomas, Ursula Tischner, Bonne Zabolotney.";

