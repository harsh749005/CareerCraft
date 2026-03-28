import { fillResumeTemplate } from "./resumeTemplateEngine";

/** Classic layout (matches `template1.js` and the built-in professional fallback). */
export function fillTemplate(template: any, formData: any) {
  return fillResumeTemplate(template, formData, "classic");
}
