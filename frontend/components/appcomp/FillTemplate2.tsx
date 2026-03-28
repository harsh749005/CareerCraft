import { fillResumeTemplate } from "./resumeTemplateEngine";

/** Modern single-column layout (matches `template2.js`). */
export function fillTemplate2(template: any, formData: any) {
  return fillResumeTemplate(template, formData, "modern");
}
