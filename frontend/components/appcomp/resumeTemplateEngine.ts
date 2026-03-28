import { TEMPLATE_CONFIGS, SkillsDisplayMode } from "../../config/templateConfig";

export type ResumeTemplateVariant = "classic" | "modern";

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function formatMonthYear(month: string, year: string): string {
  if (!month && !year) return "";
  const monthIndex = parseInt(month, 10) - 1;
  const monthText = month && monthIndex >= 0 && monthIndex < 12 ? monthNames[monthIndex] : "";
  return `${monthText} ${year || ""}`.trim();
}

function formatBulletPointsHTML(text: string, variant: ResumeTemplateVariant): string {
  if (!text) return "";

  const safeText = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

  const stripMarkers = (line: string) =>
    line
      .replace(/^[*•\-]\s+/, "")
      .replace(/^\d+\.\s+/, "")
      .trim();

  const lines = safeText
    .split(/\n|\r/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) return "";

  const ulPad = variant === "modern" ? "20px" : "36px";
  const liSize = variant === "modern" ? "10.5px" : "10px";

  if (lines.length === 1) {
    return `<div style="font-size:${liSize};line-height:1.45;">${stripMarkers(lines[0])}</div>`;
  }

  const listItems = lines
    .map(
      (line) =>
        `<li style="margin-top:3px;font-size:${liSize};line-height:1.45;">${stripMarkers(line)}</li>`
    )
    .join("");

  return `<ul style="font-size:${liSize};margin-top:4px;padding-left:${ulPad};list-style-type:disc;">${listItems}</ul>`;
}

function formatSkillsInner(formData: any): string {
  const skillsMode: SkillsDisplayMode =
    TEMPLATE_CONFIGS?.[formData.selected_template]?.skills?.mode ?? "uncategorized";

  const categorized: Record<string, string[]> = formData.skills?.categorized ?? {};
  const uncategorized: string[] = formData.skills?.uncategorized ?? [];

  const categorizedHTML = Object.entries(categorized)
    .filter(([, skills]) => skills.length > 0)
    .map(
      ([category, skills]) => `
      <div style="display:flex;gap:8px;align-items:baseline;margin:0;padding:0;">
        <strong style="font-family:'Times New Roman',serif;font-size:10px;margin:0;padding:0;">
          ${category}:
        </strong>
        <span style="font-family:'Times New Roman',serif;font-size:10px;margin:0;padding:0;">
          ${skills.join(", ")}
        </span>
      </div>
    `
    )
    .join("");

  const uncategorizedHTML =
    uncategorized.length > 0
      ? `<div style="font-family:'Times New Roman',serif;font-size:10px;margin:0;padding:0;">
        ${uncategorized.join(", ")}
      </div>`
      : "";

  const finalSkillsHTML =
    skillsMode === "categorized"
      ? categorizedHTML
      : skillsMode === "both"
        ? `${categorizedHTML}${uncategorizedHTML}`
        : uncategorizedHTML;

  return `
    <div style="display:flex;flex-direction:column;gap:4px;margin:0;padding:0;line-height:1.35;">
      ${finalSkillsHTML}
    </div>
  `;
}

function formatSkillsModern(formData: any): string {
  const inner = formatSkillsInner(formData);
  return `<div class="skills-modern">${inner}</div>`;
}

function formatExperience(formData: any, variant: ResumeTemplateVariant): string {
  return (
    formData.work_experience
      ?.map((exp: any) => {
        const start = formatMonthYear(exp.start_month, exp.start_year);
        const end = exp.end_year ? formatMonthYear(exp.end_month, exp.end_year) : "Present";
        const duration = start || end ? `${start} - ${end}` : "";
        const location = [exp.city, exp.country].filter(Boolean).join(", ");
        const bullets = exp.description ? formatBulletPointsHTML(exp.description, variant) : "";

        if (variant === "modern") {
          return `
        <div class="exp-block" style="margin-bottom:10px;">
          <div class="row-between" style="display:flex;justify-content:space-between;align-items:baseline;gap:12px;">
            <strong style="font-family:'Times New Roman',serif;font-size:10.5pt;flex:1;min-width:0;">${exp.job_title || ""}</strong>
            <em style="font-family:'Times New Roman',serif;font-size:10px;white-space:nowrap;flex-shrink:0;">${duration}</em>
          </div>
          <div class="row-between" style="display:flex;justify-content:space-between;align-items:baseline;gap:12px;margin-top:2px;">
            <em style="font-family:'Times New Roman',serif;font-size:10px;">${exp.company_name || ""}</em>
            <span style="font-family:'Times New Roman',serif;font-size:10px;white-space:nowrap;">${location}</span>
          </div>
          ${bullets}
        </div>
      `;
        }

        return `
        <div style="margin-top:4px">
          <div style="display: flex; justify-content: space-between;">
            <strong style="font-family: 'Times New Roman';font-size: 10pt;">
              ${exp.company_name || ""}
            </strong>
            <em style="font-family: 'Times New Roman';font-size: 10px;">
              ${duration}
            </em>
          </div>
          <div style="font-style: italic; font-size: 11px;">
            ${exp.job_title || ""}
          </div>
          ${bullets}
        </div>
      `;
      })
      .join("") || ""
  );
}

function formatEducation(formData: any, variant: ResumeTemplateVariant): string {
  return (
    formData.education
      ?.map((ed: any) => {
        let duration = "";
        if (ed.start && ed.end) {
          duration = `${ed.start} - ${ed.end}`;
        } else {
          const start = formatMonthYear(ed.start_month, ed.start_year);
          const end = ed.is_present ? "Present" : formatMonthYear(ed.end_month, ed.end_year);
          duration = start || end ? `${start} - ${end}` : ed.year || "";
        }

        if (variant === "modern") {
          return `
          <div class="edu-block" style="margin-bottom:10px;">
            <div class="row-between" style="display:flex;justify-content:space-between;align-items:baseline;gap:12px;">
              <strong style="font-family:'Times New Roman',serif;font-size:10.5pt;">${ed.institution || ""}</strong>
            </div>
            <div class="row-between" style="display:flex;justify-content:space-between;align-items:baseline;gap:12px;margin-top:2px;">
              <span style="font-family:'Times New Roman',serif;font-size:10px;">${ed.degree || ""}</span>
              <em style="font-family:'Times New Roman',serif;font-size:10px;white-space:nowrap;">${duration}</em>
            </div>
            ${
              ed.result
                ? `<div style="font-family:'Times New Roman',serif;font-size:10px;margin-top:2px;"><strong>Major GPA:</strong> ${ed.result}</div>`
                : ""
            }
          </div>
        `;
        }

        return `
          <div style="margin-bottom: 2px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
              <span style="font-family: 'Times New Roman';font-size: 10px;">${ed.institution || ""}:${ed.degree || ""}</span>
              <div>
              <em style="font-family: 'Times New Roman';font-size: 10px;">${duration}</em>
              ${
                ed.result
                  ? `<div>
              <em style="font-family: 'Times New Roman';font-size: 10px;">
              <strong style="font-family: 'Times New Roman';font-size: 10px;">Major GPA:</strong> 
              ${ed.result}
              </em>
              </div>`
                  : ""
              }
              </div>
            </div>
          </div>
        `;
      })
      .join("") || ""
  );
}

function formatProjects(formData: any, variant: ResumeTemplateVariant): string {
  return (
    formData.projects
      ?.map((project: any) => {
        const bullets = project.description ? formatBulletPointsHTML(project.description, variant) : "";

        if (variant === "modern") {
          return `
          <div class="project-block" style="margin-bottom:12px;">
            <div class="row-between" style="display:flex;justify-content:space-between;align-items:flex-start;gap:16px;">
              <div style="flex:1;min-width:0;display:flex;flex-wrap:wrap;align-items:baseline;column-gap:6px;row-gap:4px;padding-right:8px;">
                <strong style="font-family:'Times New Roman',serif;font-size:10.5pt;">${project.title || ""}</strong>
                ${
                  project.technologies
                    ? `<span style="color:#555;font-size:10px;">|</span><em style="font-family:'Times New Roman',serif;font-size:10px;font-style:italic;">${project.technologies}</em>`
                    : ""
                }
              </div>
            </div>
            ${bullets}
            ${
              project.liveUrl
                ? `<div style="margin-top:4px;font-family:'Times New Roman',serif;font-size:9.5px;"><em>Live:</em> <a href="${project.liveUrl}">${project.liveUrl}</a></div>`
                : ""
            }
          </div>
        `;
        }

        return `
          <div style="margin-bottom: 4px;">
            <div style="display:flex;flex-wrap:wrap;align-items:baseline;column-gap:8px;row-gap:4px;margin-bottom:4px;">
              <strong style="font-family: 'Times New Roman';font-size: 11px;flex-shrink:0;">
                ${project.title || ""}
              </strong>
              ${
                project.technologies
                  ? `<span style="font-family:'Times New Roman';font-size:10px;color:#666;">—</span>
              <em style="font-family: 'Times New Roman';font-size: 10px;font-style:italic;">
                ${project.technologies}
              </em>`
                  : ""
              }
            </div>
            ${bullets}
            ${
              project.liveUrl
                ? `<em style="margin-left:10px;font-family: 'Times New Roman';font-size:10px;">
                     Live demo: <a href="${project.liveUrl}">${project.liveUrl}</a>
                   </em>`
                : ""
            }
          </div>
        `;
      })
      .join("") || ""
  );
}

function formatSummary(formData: any): string {
  const text = formData.professional_summary;

  if (!text) return "";

  const bullets = text.split("*").filter((b: string) => b.trim());

  if (bullets.length <= 1) {
    return `
      <div style="margin-bottom: 2px;">
        <div style="font-size:10px;">${text}</div>
      </div>
    `;
  }

  const listItems = bullets
    .map((bullet: string) => `<li style="margin-bottom: 8px;">${bullet.trim()}</li>`)
    .join("");

  return `
    <div style="margin-bottom: 2px;">
      <ul style="margin: 4px 0; font-size:10px;">${listItems}</ul>
    </div>
  `;
}

function formatLinks(formData: any): string {
  const links = formData.otherLinks;
  if (!links || Object.keys(links).length === 0) return "";

  const listItems = Object.entries(links)
    .map(([, value]) => {
      return `<p style="margin-bottom: 1px;"><a href="${value}" style="color:black;font-size:8px">${value}</a></p>`;
    })
    .join("");

  return `
    <div style="display:flex;flex-direction:column;">
      ${listItems}
    </div>
  `;
}

function formatContactLine(formData: any): string {
  const p = formData.personal_info || {};
  const phone = p.phone || p.number;
  const parts = [phone, p.email, p.linkedin, p.portfolio].filter(Boolean);
  return parts.join(" · ");
}

function professionalFallbackTemplate(formData: any, variant: ResumeTemplateVariant): string {
  const fs = variant === "modern" ? formatSkillsModern(formData) : formatSkillsInner(formData);

  return `
    <div style="font-family: 'Times New Roman', serif; max-width: 800px; margin: 0 auto; padding: 20px; line-height: 1.6;">
      <div style="text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px;">
        <h1 style="margin: 0; font-size: 24px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px;">
          ${formData.personal_info?.name || ""}
        </h1>
        <div style="margin-top: 8px; font-size: 12px;">
          ${formData.personal_info?.title || "Full Stack Developer"} | 
          ${formData.personal_info?.location || ""} | 
          ${formData.personal_info?.phone || formData.personal_info?.number || ""}
        </div>
        <div style="margin-top: 5px; font-size: 12px;">
          ${formData.personal_info?.email || ""} | 
          ${formData.personal_info?.linkedin || ""} | 
          ${formData.personal_info?.portfolio || ""}
        </div>
      </div>

      ${formData.professional_summary ? `
      <div style="margin-bottom: 25px;">
        <h2 style="font-size: 16px; margin-bottom: 10px; border-bottom: 1px solid #000; padding-bottom: 3px;">
          Summary of qualification
        </h2>
        <div style="font-size: 11px;">
          ${formData.professional_summary}
        </div>
      </div>
      ` : ""}

      ${formData.work_experience?.length > 0 ? `
      <div style="margin-bottom: 25px;">
        <h2 style="font-size: 16px; margin-bottom: 15px; border-bottom: 1px solid #000; padding-bottom: 3px;">
          Experience
        </h2>
        <div style="font-size: 14px;">
          ${formatExperience(formData, variant)}
        </div>
      </div>
      ` : ""}

      ${formData.projects?.length > 0 ? `
      <div style="margin-bottom: 25px;">
        <h2 style="font-size: 16px; margin-bottom: 15px; border-bottom: 1px solid #000; padding-bottom: 3px;">
          Projects
        </h2>
        <div style="font-size: 14px;">
          ${formatProjects(formData, variant)}
        </div>
      </div>
      ` : ""}

      ${Object.keys(formData.skills || {}).length > 0 ? `
      <div style="margin-bottom: 25px;">
        <h2 style="font-size: 16px; margin-bottom: 10px; border-bottom: 1px solid #000; padding-bottom: 3px;">
          Skills
        </h2>
        <div style="font-size: 14px;">
          ${fs}
        </div>
      </div>
      ` : ""}

      ${formData.education?.length > 0 ? `
      <div style="margin-bottom: 25px;">
        <h2 style="font-size: 16px; margin-bottom: 15px; border-bottom: 1px solid #000; padding-bottom: 3px;">
          Education
        </h2>
        <div style="font-size: 14px;">
          ${formatEducation(formData, variant)}
        </div>
      </div>
      ` : ""}

    </div>
  `;
}

function summarySectionHTML(formData: any): string {
  const raw = (formData.professional_summary || "").trim();
  if (!raw) return "";
  const inner = formatSummary(formData);
  return `
      <div class="section">
        <h2 class="section-title">Summary</h2>
        ${inner}
      </div>`;
}

function linksSectionHTML(formData: any): string {
  const inner = formatLinks(formData);
  if (!inner.trim()) return "";
  return `
      <div class="section">
        <h2 class="section-title">Links</h2>
        <div>${inner}</div>
      </div>`;
}

/**
 * Fills an HTML template string with resume data. Use `variant` to switch section layouts (classic vs modern).
 */
export function fillResumeTemplate(
  template: string | null | undefined,
  formData: any,
  variant: ResumeTemplateVariant = "classic"
): string {
  const v = variant;

  if (template && template !== "") {
    return template
      .replace(/\{\{name\}\}/g, formData.personal_info?.name || "")
      .replace(/\{\{email\}\}/g, formData.personal_info?.email || "")
      .replace(/\{\{number\}\}/g, formData.personal_info?.phone || formData.personal_info?.number || "")
      .replace(/\{\{contact\}\}/g, formatContactLine(formData))
      .replace(/\{\{summary\}\}/g, formatSummary(formData))
      .replace(/\{\{summary_block\}\}/g, summarySectionHTML(formData))
      .replace(/\{\{skills\}\}/g, v === "modern" ? formatSkillsModern(formData) : formatSkillsInner(formData))
      .replace(/\{\{experience\}\}/g, formatExperience(formData, v))
      .replace(/\{\{education\}\}/g, formatEducation(formData, v))
      .replace(/\{\{projects\}\}/g, formatProjects(formData, v))
      .replace(/\{\{links\}\}/g, formatLinks(formData))
      .replace(/\{\{links_block\}\}/g, linksSectionHTML(formData));
  }

  return professionalFallbackTemplate(formData, v);
}
