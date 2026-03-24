// utils/branchUtils.ts

export type BranchCategory = "tech" | "non-tech";

export type BranchOption = {
  label: string;
  value: string;       // ✅ short ID — this is what gets stored in formData and matched in templateConfig
  category: BranchCategory;
  icon: string;
};

export const BRANCH_OPTIONS: BranchOption[] = [
  // ── Tech Branches ──
  { label: "Computer Science",          value: "CSE",    category: "tech",     icon: "💻" },
  { label: "Information Technology",    value: "IT",     category: "tech",     icon: "🖥️" },
  { label: "Software Engineering",      value: "SE",     category: "tech",     icon: "⚙️" },
  { label: "Cybersecurity",             value: "CYS",    category: "tech",     icon: "🔐" },
  { label: "Data Science",              value: "DS",     category: "tech",     icon: "📊" },
  { label: "Artificial Intelligence",   value: "AI",     category: "tech",     icon: "🤖" },
  { label: "Electronics & Communication", value: "ECE",  category: "tech",     icon: "📡" },
  { label: "Electrical Engineering",    value: "EEE",    category: "tech",     icon: "⚡" },
  { label: "Computer Engineering",      value: "CE",     category: "tech",     icon: "🔧" },
  { label: "Information Systems",       value: "IS",     category: "tech",     icon: "🗄️" },
  { label: "Network Engineering",       value: "NET",    category: "tech",     icon: "🌐" },
  { label: "Cloud Computing",           value: "CC",     category: "tech",     icon: "☁️" },

  // ── Non-Tech Branches ──
  { label: "Mechanical Engineering",    value: "ME",     category: "non-tech", icon: "🔩" },
  { label: "Civil Engineering",         value: "CVL",    category: "non-tech", icon: "🏗️" },
  { label: "Chemical Engineering",      value: "CHE",    category: "non-tech", icon: "🧪" },
  { label: "Biotechnology",             value: "BIO",    category: "non-tech", icon: "🧬" },
  { label: "Business Administration",   value: "MBA",    category: "non-tech", icon: "💼" },
  { label: "Commerce",                  value: "COM",    category: "non-tech", icon: "📈" },
  { label: "Arts & Humanities",         value: "ARTS",   category: "non-tech", icon: "🎨" },
  { label: "Law",                       value: "LAW",    category: "non-tech", icon: "⚖️" },
  { label: "Medicine / Healthcare",     value: "MED",    category: "non-tech", icon: "🩺" },
  { label: "Architecture",              value: "ARCH",   category: "non-tech", icon: "🏛️" },
  { label: "Psychology",                value: "PSY",    category: "non-tech", icon: "🧠" },
  { label: "Education / Teaching",      value: "EDU",    category: "non-tech", icon: "📚" },
  { label: "Media & Journalism",        value: "MJ",     category: "non-tech", icon: "📰" },
  { label: "Other",                     value: "OTH",    category: "non-tech", icon: "🎓" },
];

/** Returns true if the branch is tech-related */
export const isTechBranch = (branchValue: string): boolean => {
  const found = BRANCH_OPTIONS.find((b) => b.value === branchValue);
  return found?.category === "tech";
};

/** Get branch option by value */
export const getBranchOption = (value: string): BranchOption | undefined => {
  return BRANCH_OPTIONS.find((b) => b.value === value);
};

/** Quick-access chips — first 6 shown before opening full modal */
export const QUICK_ACCESS_BRANCHES = BRANCH_OPTIONS.slice(0, 6);