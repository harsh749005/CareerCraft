// config/templateConfig.ts

export type SkillsDisplayMode = "categorized" | "uncategorized" | "both";

export type ProjectsDisplayMode = "card" | "nocard";

/** Which PDF HTML shell (`template1.js` / `template2.js` / `template3.js`) to use in GeneratePDF. */
export type PdfTemplateLayout = "classic" | "modern" | "classic2";

export type TemplateConfig = {
  /** Stable key stored in `formData.selected_template` (must match `TEMPLATE_CONFIGS` record keys). */
  id: string;
  /** Display label in the UI (may differ from `id` later). */
  name: string;
  tag: string;
  tagColor: string;
  image: any;
  skills: {
    mode: SkillsDisplayMode;
  };
  projects?: {
    mode: ProjectsDisplayMode;
  };
  /** PDF export layout; mapped from `selected_template` id. */
  pdfLayout: PdfTemplateLayout;
};

export const TEMPLATE_CONFIGS: Record<string, TemplateConfig> = {
  Classic: {
    id: "Classic",
    name: "Classic",
    tag: "Most Popular",
    tagColor: "#3BBFAD",
    image: require("../assets/images/resume/resume1.png"),
    skills: { mode: "uncategorized" },
    projects: { mode: "nocard" },
    pdfLayout: "classic",
  },
  Modern: {
    id: "Modern",
    name: "Modern",
    tag: "Clean & Bold",
    tagColor: "#81B29A",
    image: require("../assets/images/resume/resume2.jpg"),
    skills: { mode: "categorized" },
    projects: { mode: "card" },
    pdfLayout: "modern",
  },
  Executive: {
    id: "Executive",
    name: "Executive",
    tag: "Professional",
    tagColor: "#3D405B",
    image: require("../assets/images/resume/resume2.jpg"),
    skills: { mode: "categorized" },
    projects: { mode: "nocard" },
    pdfLayout: "classic",
  },
  Creative: {
    id: "Creative",
    name: "Creative",
    tag: "Stand Out",
    tagColor: "#E07A5F",
    image: require("../assets/images/resume/resume3.jpg"),
    skills: { mode: "uncategorized" },
    projects: { mode: "nocard" },
    pdfLayout: "classic",
  },
  Professional: {
    id: "Professional",
    name: "Professional",
    tag: "Industry Ready",
    tagColor: "#5C6BC0",
    image: require("../assets/images/resume/resume3.png"), // swap with your template3 preview image
    skills: { mode: "uncategorized" },
    projects: { mode: "nocard" },
    pdfLayout: "classic",
  },
};

/**
 * Keys = BranchOption.value from branchUtils.ts (must match exactly).
 * Values = ordered template IDs — first entry is recommended/shown first.
 */
export const BRANCH_TEMPLATE_MAP: Record<string, string[]> = {
  // ── Tech ──
  CSE:  ["Modern", "Creative", "Classic", "Professional"],
  IT:   ["Modern", "Creative", "Classic", "Professional"],
  SE:   ["Modern", "Creative", "Classic", "Professional"],
  CYS:  ["Modern", "Executive", "Classic", "Professional"],
  DS:   ["Modern", "Creative", "Classic", "Professional"],
  AI:   ["Modern", "Creative", "Classic", "Professional"],
  ECE:  ["Classic", "Modern", "Executive", "Professional"],
  EEE:  ["Classic", "Executive", "Modern", "Professional"],
  CE:   ["Modern", "Classic", "Executive", "Professional"],
  IS:   ["Modern", "Classic", "Executive", "Professional"],
  NET:  ["Modern", "Executive", "Classic", "Professional"],
  CC:   ["Modern", "Creative", "Classic", "Professional"],

  // ── Non-Tech ──
  ME:   ["Professional", "Executive", "Classic", "Modern"],
  CVL:  ["Professional", "Executive", "Classic", "Modern"],
  CHE:  ["Professional", "Classic", "Executive", "Modern"],
  BIO:  ["Creative", "Professional", "Classic", "Modern"],
  MBA:  ["Executive", "Professional", "Modern", "Classic"],
  COM:  ["Professional", "Executive", "Classic", "Modern"],
  ARTS: ["Creative", "Professional", "Classic", "Modern"],
  LAW:  ["Professional", "Executive", "Classic", "Modern"],
  MED:  ["Professional", "Classic", "Executive", "Modern"],
  ARCH: ["Creative", "Professional", "Executive", "Classic"],
  PSY:  ["Creative", "Professional", "Classic", "Modern"],
  EDU:  ["Professional", "Classic", "Creative", "Modern"],
  MJ:   ["Creative", "Modern", "Professional", "Classic"],
  OTH:  ["Classic", "Modern", "Executive", "Creative", "Professional"],

  // ── Fallback ──
  All:  ["Classic", "Modern", "Executive", "Creative", "Professional"],
};

/**
 * Returns ordered TemplateConfig[] for a given branch value.
 * Falls back to "All" if branch is unknown or undefined.
 */
export const getTemplatesForBranch = (branch: string | undefined): TemplateConfig[] => {
  const ids = BRANCH_TEMPLATE_MAP[branch ?? ""] ?? BRANCH_TEMPLATE_MAP["All"];
  return ids
    .map((id) => TEMPLATE_CONFIGS[id])
    .filter(Boolean) as TemplateConfig[];
};

/**
 * Resolves which PDF HTML shell to use from `formData.selected_template` (template id).
 * Falls back to `"classic"` if unknown or empty.
 */
export function resolvePdfLayoutFromTemplateId(
  selectedTemplateId: string | undefined | null
): PdfTemplateLayout {
  if (!selectedTemplateId) return "classic";
  const config = TEMPLATE_CONFIGS[selectedTemplateId];
  if (config?.pdfLayout) return config.pdfLayout;
  const byName = Object.values(TEMPLATE_CONFIGS).find((c) => c.name === selectedTemplateId);
  return byName?.pdfLayout ?? "classic";
}