// config/templateConfig.ts

export type SkillsDisplayMode = "categorized" | "uncategorized" | "both";

export type TemplateConfig = {
  id: string;
  name: string;
  tag: string;
  tagColor: string;
  image: any;
  skills: {
    mode: SkillsDisplayMode;
  };
};

export const TEMPLATE_CONFIGS: Record<string, TemplateConfig> = {
  Classic: {
    id: "Classic",
    name: "Classic",
    tag: "Most Popular",
    tagColor: "#3BBFAD",
    image: require("../assets/images/resume/resume1.png"),
    skills: { mode: "uncategorized" },
  },
  Modern: {
    id: "Modern",
    name: "Modern",
    tag: "Clean & Bold",
    tagColor: "#81B29A",
    image: require("../assets/images/resume/resume2.jpg"),
    skills: { mode: "categorized" },
  },
  Executive: {
    id: "Executive",
    name: "Executive",
    tag: "Professional",
    tagColor: "#3D405B",
    image: require("../assets/images/resume/resume2.jpg"),
    skills: { mode: "categorized" },
  },
  Creative: {
    id: "Creative",
    name: "Creative",
    tag: "Stand Out",
    tagColor: "#E07A5F",
    image: require("../assets/images/resume/resume3.jpg"),
    skills: { mode: "both" },
  },
};

/**
 * Keys = BranchOption.value from branchUtils.ts (must match exactly).
 * Values = ordered template IDs — first entry is recommended/shown first.
 */
export const BRANCH_TEMPLATE_MAP: Record<string, string[]> = {
  // ── Tech ──
  CSE:  ["Modern", "Creative", "Classic"],
  IT:   ["Modern", "Creative", "Classic"],
  SE:   ["Modern", "Creative", "Classic"],
  CYS:  ["Modern", "Executive", "Classic"],
  DS:   ["Modern", "Creative", "Classic"],
  AI:   ["Modern", "Creative", "Classic"],
  ECE:  ["Classic", "Modern", "Executive"],
  EEE:  ["Classic", "Executive", "Modern"],
  CE:   ["Modern", "Classic", "Executive"],
  IS:   ["Modern", "Classic", "Executive"],
  NET:  ["Modern", "Executive", "Classic"],
  CC:   ["Modern", "Creative", "Classic"],

  // ── Non-Tech ──
  ME:   ["Executive", "Classic", "Modern"],
  CVL:  ["Executive", "Classic", "Modern"],
  CHE:  ["Classic", "Executive", "Modern"],
  BIO:  ["Creative", "Classic", "Modern"],
  MBA:  ["Executive", "Modern", "Classic"],
  COM:  ["Executive", "Classic", "Modern"],
  ARTS: ["Creative", "Classic", "Modern"],
  LAW:  ["Executive", "Classic", "Modern"],
  MED:  ["Classic", "Executive", "Modern"],
  ARCH: ["Creative", "Executive", "Classic"],
  PSY:  ["Creative", "Classic", "Modern"],
  EDU:  ["Classic", "Creative", "Modern"],
  MJ:   ["Creative", "Modern", "Classic"],
  OTH:  ["Classic", "Modern", "Executive", "Creative"],

  // ── Fallback ──
  All:  ["Classic", "Modern", "Executive", "Creative"],
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