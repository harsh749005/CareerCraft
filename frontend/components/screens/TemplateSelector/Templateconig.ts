/**
 * Resume Template Management System
 * 
 * This module provides a centralized configuration for managing resume templates
 * across different industries with metadata, categorization, and filtering capabilities.
 */

import { ImageSourcePropType } from "react-native";

// Import template images
import resume1 from "../../../assets/images/resume/resume1.png";
import resume2 from "../../../assets/images/resume/resume2.jpg";
import resume3 from "../../../assets/images/resume/resume3.jpg";

export type IndustryId =
  | "it"
  | "finance"
  | "marketing"
  | "healthcare"
  | "education"
  | "government"
  | "creative"
  | "engineering";

export interface Industry {
  id: IndustryId;
  name: string;
  description: string;
  icon: string;
  color: string;
  keywords: string[];
}

export interface ResumeTemplate {
  id: string;
  name: string;
  image: ImageSourcePropType;
  description: string;
  features: string[];
  industries: IndustryId[];
  atsScore: number; // 1-10 rating for ATS compatibility
  tags: string[];
  recommended?: boolean;
}

// Industry Definitions
export const INDUSTRIES: Record<IndustryId, Industry> = {
  it: {
    id: "it",
    name: "Information Technology",
    description: "Software, DevOps, Data Science, Cybersecurity",
    icon: "💻",
    color: "#007AFF",
    keywords: ["technical", "software", "developer", "engineer", "data"],
  },
  finance: {
    id: "finance",
    name: "Finance & Accounting",
    description: "Banking, Investment, Audit, Financial Analysis",
    icon: "💰",
    color: "#34C759",
    keywords: ["banking", "investment", "accounting", "audit", "analyst"],
  },
  marketing: {
    id: "marketing",
    name: "Marketing & Sales",
    description: "Digital Marketing, Brand Management, Sales",
    icon: "📊",
    color: "#FF9500",
    keywords: ["marketing", "sales", "brand", "digital", "content"],
  },
  healthcare: {
    id: "healthcare",
    name: "Healthcare & Medical",
    description: "Nursing, Medical Practice, Healthcare Admin",
    icon: "🏥",
    color: "#FF3B30",
    keywords: ["medical", "nursing", "healthcare", "clinical", "patient"],
  },
  education: {
    id: "education",
    name: "Education & Training",
    description: "Teaching, Curriculum Design, Academic Research",
    icon: "📚",
    color: "#5856D6",
    keywords: ["teaching", "education", "curriculum", "academic", "training"],
  },
  government: {
    id: "government",
    name: "Government & Public Service",
    description: "Civil Service, Policy, Public Administration",
    icon: "🏛️",
    color: "#8E8E93",
    keywords: ["government", "public", "civil", "policy", "federal"],
  },
  creative: {
    id: "creative",
    name: "Creative & Design",
    description: "Graphic Design, UX/UI, Content Creation",
    icon: "🎨",
    color: "#FF2D55",
    keywords: ["design", "creative", "ux", "ui", "graphic", "content"],
  },
  engineering: {
    id: "engineering",
    name: "Engineering",
    description: "Mechanical, Civil, Electrical, Industrial",
    icon: "⚙️",
    color: "#5AC8FA",
    keywords: ["engineering", "mechanical", "civil", "electrical", "technical"],
  },
};

// Template Database
export const RESUME_TEMPLATES: ResumeTemplate[] = [
  {
    id: "professional-1",
    name: "Professional",
    image: resume1,
    description: "Classic ATS-optimized format for corporate environments",
    features: ["ATS-Friendly", "Clean Layout", "Single Column"],
    industries: ["it", "finance", "government", "engineering"],
    atsScore: 10,
    tags: ["corporate", "traditional", "formal"],
    recommended: true,
  },
  {
    id: "modern-1",
    name: "Modern",
    image: resume2,
    description: "Contemporary design that balances style and readability",
    features: ["Eye-catching", "Modern Design", "Two Column"],
    industries: ["it", "marketing", "creative", "education"],
    atsScore: 8,
    tags: ["contemporary", "stylish", "balanced"],
  },
  {
    id: "creative-1",
    name: "Creative",
    image: resume3,
    description: "Bold design perfect for creative and design roles",
    features: ["Unique Style", "Creative Flair", "Visual Impact"],
    industries: ["creative", "marketing", "education"],
    atsScore: 6,
    tags: ["bold", "artistic", "distinctive"],
  },
];

// Utility Functions

/**
 * Get templates filtered by industry
 */
export const getTemplatesByIndustry = (
  industryId: IndustryId
): ResumeTemplate[] => {
  return RESUME_TEMPLATES.filter((template) =>
    template.industries.includes(industryId)
  );
};

/**
 * Get recommended template for an industry
 */
export const getRecommendedTemplate = (
  industryId: IndustryId
): ResumeTemplate | null => {
  const industryTemplates = getTemplatesByIndustry(industryId);
  
  // First try to find a recommended template
  const recommended = industryTemplates.find((t) => t.recommended);
  if (recommended) return recommended;
  
  // Otherwise return the highest ATS score
  return industryTemplates.sort((a, b) => b.atsScore - a.atsScore)[0] || null;
};

/**
 * Get industry configuration by ID
 */
export const getIndustry = (industryId: IndustryId): Industry => {
  return INDUSTRIES[industryId];
};

/**
 * Get all industries as an array
 */
export const getAllIndustries = (): Industry[] => {
  return Object.values(INDUSTRIES);
};

/**
 * Get template by ID
 */
export const getTemplateById = (templateId: string): ResumeTemplate | null => {
  return RESUME_TEMPLATES.find((t) => t.id === templateId) || null;
};

/**
 * Search templates by keyword
 */
export const searchTemplates = (keyword: string): ResumeTemplate[] => {
  const lowerKeyword = keyword.toLowerCase();
  return RESUME_TEMPLATES.filter(
    (template) =>
      template.name.toLowerCase().includes(lowerKeyword) ||
      template.description.toLowerCase().includes(lowerKeyword) ||
      template.tags.some((tag) => tag.toLowerCase().includes(lowerKeyword))
  );
};

/**
 * Get templates sorted by ATS score
 */
export const getTemplatesByAtsScore = (
  industryId?: IndustryId
): ResumeTemplate[] => {
  let templates = industryId
    ? getTemplatesByIndustry(industryId)
    : RESUME_TEMPLATES;
  
  return [...templates].sort((a, b) => b.atsScore - a.atsScore);
};

/**
 * Validate if template is suitable for industry
 */
export const isTemplateValidForIndustry = (
  templateId: string,
  industryId: IndustryId
): boolean => {
  const template = getTemplateById(templateId);
  return template ? template.industries.includes(industryId) : false;
};

export default {
  INDUSTRIES,
  RESUME_TEMPLATES,
  getTemplatesByIndustry,
  getRecommendedTemplate,
  getIndustry,
  getAllIndustries,
  getTemplateById,
  searchTemplates,
  getTemplatesByAtsScore,
  isTemplateValidForIndustry,
};