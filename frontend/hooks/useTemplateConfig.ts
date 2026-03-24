// useTemplateConfig.ts

import { TEMPLATE_CONFIGS, TemplateConfig } from "../config/templateConfig";

export const useTemplateConfig = (selectedTemplate: string): TemplateConfig | null => {
  return TEMPLATE_CONFIGS[selectedTemplate] ?? null;
};