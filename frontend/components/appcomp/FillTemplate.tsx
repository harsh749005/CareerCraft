import { TEMPLATE_CONFIGS, SkillsDisplayMode } from "../../config/templateConfig";

export function fillTemplate(template:any, formData:any) {
// const formatSkills = () => { 
//   const skillsArray = []; 
   
//   // Programming Languages 
//   if (formData.skills?.categorized?.length > 0) { 
//     skillsArray.push( 
//       `<div style="display:flex;gap:8px;align-items:baseline;margin:0;padding:0;"> 
//         <strong style="font-family:'Times New Roman';font-size:10px;margin:0;padding:0;">${formData.skills.categorized[0]}</strong>  
//         <span style="font-family:'Times New Roman';font-size:10px;margin:0;padding:0;">${formData.skills.categorized[0].join(', ')}</span> 
//       </div>` 
//     ); 
//   } 
   
//   // Web Development (combine frameworks and tools) 
//   const webDevSkills = [ 
//     ...(formData.skills?.frameworks || []), 
//     ...(formData.skills?.tools || []) 
//   ]; 
//   if (webDevSkills.length > 0) { 
//     skillsArray.push( 
//       `<div style="display:flex;gap:8px;align-items:baseline;margin:0;padding:0;"> 
//         <strong style="font-family:'Times New Roman';font-size:10px;margin:0;padding:0;">Web Development:</strong>  
//         <span style="font-family:'Times New Roman';font-size:10px;margin:0;padding:0;">${webDevSkills.join(', ')}</span> 
//       </div>` 
//     ); 
//   } 
   
//   // Database 
//   if (formData.skills?.databases?.length > 0) { 
//     skillsArray.push( 
//       `<div style="display:flex;gap:8px;align-items:baseline;margin:0;padding:0;"> 
//         <strong style="font-family:'Times New Roman';font-size:10px;margin:0;padding:0;">Database:</strong>  
//         <span style="font-family:'Times New Roman';font-size:10px;margin:0;padding:0;">${formData.skills.databases.join(', ')}</span> 
//       </div>` 
//     ); 
//   } 
 
//   // Wrap all inside one parent div with minimal spacing
//   return ` 
//     <div style="display:flex;flex-direction:column;gap:2px;margin:0;padding:0;line-height:1.2;"> 
//       ${skillsArray.join('')} 
//     </div> 
//   `; 
// };
const formatSkills = () => {
  const skillsMode: SkillsDisplayMode =
    TEMPLATE_CONFIGS?.[formData.selected_template]?.skills?.mode ?? "uncategorized";

  const categorized: Record<string, string[]> = formData.skills?.categorized ?? {};
  const uncategorized: string[] = formData.skills?.uncategorized ?? [];

  // ── CATEGORIZED template ──────────────────────────────
  const categorizedHTML = Object.entries(categorized)
    .filter(([_, skills]) => skills.length > 0)   // skip empty categories
    .map(([category, skills]) => `
      <div style="display:flex;gap:8px;align-items:baseline;margin:0;padding:0;">
        <strong style="font-family:'Times New Roman';font-size:10px;margin:0;padding:0;">
          ${category}:
        </strong>
        <span style="font-family:'Times New Roman';font-size:10px;margin:0;padding:0;">
          ${skills.join(', ')}
        </span>
      </div>
    `)
    .join('');

  // ── UNCATEGORIZED template ────────────────────────────
  const uncategorizedHTML = uncategorized.length > 0
    ? `<div style="font-family:'Times New Roman';font-size:10px;margin:0;padding:0;">
        ${uncategorized.join(', ')}
      </div>`
    : '';

  const finalSkillsHTML =
    skillsMode === "categorized"
      ? categorizedHTML
      : skillsMode === "both"
      ? `${categorizedHTML}${uncategorizedHTML}`
      : uncategorizedHTML;

  return `
    <div style="display:flex;flex-direction:column;gap:2px;margin:0;padding:0;line-height:1.2;">
      ${finalSkillsHTML}
    </div>
  `;
};

const formatExperience = () => {
  return formData.work_experience
    ?.map(exp => {
      const duration = exp.start && exp.end 
        ? `${exp.start} - ${exp.end}` 
        : (exp.year || '');

      // 🔧 Enhanced Bullet + Bold Formatter
      const formatBulletPoints = (text: string) => {
        if (!text) return '';

        // 1️⃣ First handle bold text safely
        let safeText = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

        // 2️⃣ Split by line breaks or bullets
        const bullets = safeText
          .split(/\n|\r|\*/g) // split on * or newlines
          .map(bullet => bullet.trim())
          .filter(Boolean);

        if (bullets.length <= 1) {
          // No bullets → return plain div
          return `<div>${safeText}</div>`;
        }

        // 3️⃣ Wrap bullets in <li>
        const listItems = bullets
          .map(bullet => `<li style="margin-top: 2px;">${bullet}</li>`)
          .join('');

        return `<ul style="font-size:10px;margin-top:2px">${listItems}</ul>`;
      };

      return `
        <div style="margin-top:4px">
          <div style="display: flex; justify-content: space-between;">
            <strong style="font-family: 'Times New Roman';font-size: 10pt;">
              ${exp.company || ''}
            </strong>
            <em style="font-family: 'Times New Roman';font-size: 10px;">
              ${duration}
            </em>
          </div>
          <div style="font-style: italic; font-size: 11px;">
            ${exp.role || ''}
          </div>
          ${exp.experience ? formatBulletPoints(exp.experience) : ''}
        </div>
      `;
    })
    .join('') || '';
};



  const formatEducation = () => {
    return formData.education
      ?.map(ed => {
        const duration = ed.start && ed.end 
          ? `${ed.start} - ${ed.end}` 
          : (ed.year || '');
        
        return `
          <div style="margin-bottom: 2px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
              <span style="font-family: 'Times New Roman';font-size: 10px;">${ed.institution || ''}:${ed.degree || ''}</span>
              <div>
              <em style="font-family: 'Times New Roman';font-size: 10px;">${duration}</em>
              ${ed.result ? `<div>
              <em style="font-family: 'Times New Roman';font-size: 10px;">
              <strong style="font-family: 'Times New Roman';font-size: 10px;">Major GPA:</strong> 
              ${ed.result}
              </em>
              </div>` : ''}
              </div>
            </div>
          </div>
        `;
      })
      .join('') || '';
  };

const formatProjects = () => {
  return (
    formData.projects
      ?.map(project => {
        // 🔧 Enhanced Bullet + Bold Formatter (same as formatExperience)
        const formatBulletPoints = (text: string) => {
          if (!text) return "";

          // 1️⃣ Convert **bold**
          let safeText = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

          // 2️⃣ Split by line breaks
          const bullets = safeText
            .split(/\n|\r/)
            .map(line => line.trim())
            .filter(Boolean);

          // 3️⃣ Convert * to <li>
          const listItems = bullets
            .map(line => {
              if (line.startsWith("*")) {
                return `<li style="margin:0; padding:0; font-size:10px;">${line.replace(/^\*\s*/, "")}</li>`;
              }
              return line;
            })
            .join("");

          const hasBullets = bullets.some(line => line.startsWith("*"));

          if (hasBullets) {
            return `<ul style="margin:0; padding-left:12px; list-style-position:inside;">${listItems}</ul>`;
          }

          return `<div>${listItems}</div>`;
        };

        return `
          <div style="margin-bottom: 4px;">
            <div style="margin-bottom: 2px;">
              <strong style="font-family: 'Times New Roman';font-size: 11px;">
                ${project.title || ""}
              </strong> - 
              <em style="font-family: 'Times New Roman';font-size: 10px;">
                ${project.technologies || ""}
              </em>
            </div>
            ${project.description ? formatBulletPoints(project.description) : ""}
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
};


const formatSummary = () => {
  const text = formData.professional_summary;

  if (!text) return '';

  const bullets = text.split('*').filter(bullet => bullet.trim());

  if (bullets.length <= 1) {
    // If no asterisks found, return as regular text
    return `
      <div style="margin-bottom: 2px;">
        <div style="font-size:10px;">${text}</div>
      </div>
    `;
  }

  const listItems = bullets
    .map(bullet => `<li style="margin-bottom: 8px;">${bullet.trim()}</li>`)
    .join('');

  return `
    <div style="margin-bottom: 2px;">
      <ul style="margin: 4px 0; font-size:10px;">${listItems}</ul>
    </div>
  `;
};
const formatLinks = () => {
  const links = formData.otherLinks;
  if (!links || Object.keys(links).length === 0) return '';

  // Convert object to [key, value] pairs
  const listItems = Object.entries(links)
    .map(([key, value]) => {
      // Only show value (link), ignore key (name)
      return `<p style="margin-bottom: 1px;"><a href =${value} style="color:black;font-size:8px">${value}</a></p>`;
    })
    .join('');

  return `
    <div style="display:flex;flex-direction:column;">
      ${listItems}
    </div>
  `;
};

  // Professional resume template
  const professionalTemplate = `
    <div style="font-family: 'Times New Roman', serif; max-width: 800px; margin: 0 auto; padding: 20px; line-height: 1.6;">
      
      <!-- Header -->
      <div style="text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px;">
        <h1 style="margin: 0; font-size: 24px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px;">
          ${formData.personal_info?.name || ''}
        </h1>
        <div style="margin-top: 8px; font-size: 12px;">
          ${formData.personal_info?.title || 'Full Stack Developer'} | 
          ${formData.personal_info?.location || ''} | 
          ${formData.personal_info?.phone || ''}
        </div>
        <div style="margin-top: 5px; font-size: 12px;">
          📧 ${formData.personal_info?.email || ''} | 
          🔗 ${formData.personal_info?.linkedin || ''} | 
          💼 ${formData.personal_info?.portfolio || ''}
        </div>
      </div>

      <!-- Summary -->
      ${formData.professional_summary ? `
      <div style="margin-bottom: 25px;">
        <h2 style="font-size: 16px; margin-bottom: 10px; border-bottom: 1px solid #000; padding-bottom: 3px;">
          Summary of qualification
        </h2>
        <div style="font-size: 11px;">
          ${formData.professional_summary}
        </div>
      </div>
      ` : ''}

      <!-- Experience -->
      ${formData.work_experience?.length > 0 ? `
      <div style="margin-bottom: 25px;">
        <h2 style="font-size: 16px; margin-bottom: 15px; border-bottom: 1px solid #000; padding-bottom: 3px;">
          Experience
        </h2>
        <div style="font-size: 14px;">
          ${formatExperience()}
        </div>
      </div>
      ` : ''}

      <!-- Projects -->
      ${formData.projects?.length > 0 ? `
      <div style="margin-bottom: 25px;">
        <h2 style="font-size: 16px; margin-bottom: 15px; border-bottom: 1px solid #000; padding-bottom: 3px;">
          Projects
        </h2>
        <div style="font-size: 14px;">
          ${formatProjects()}
        </div>
      </div>
      ` : ''}

      <!-- Skills -->
      ${Object.keys(formData.skills || {}).length > 0 ? `
      <div style="margin-bottom: 25px;">
        <h2 style="font-size: 16px; margin-bottom: 10px; border-bottom: 1px solid #000; padding-bottom: 3px;">
          Skills
        </h2>
        <div style="font-size: 14px;">
          ${formatSkills()}
        </div>
      </div>
      ` : ''}

      <!-- Education -->
      ${formData.education?.length > 0 ? `
      <div style="margin-bottom: 25px;">
        <h2 style="font-size: 16px; margin-bottom: 15px; border-bottom: 1px solid #000; padding-bottom: 3px;">
          Education
        </h2>
        <div style="font-size: 14px;">
          ${formatEducation()}
        </div>
      </div>
      ` : ''}

    </div>
  `;

  // If a custom template is provided, use the replacement logic
  if (template && template !== '') {
    return template
      .replace("{{name}}", formData.personal_info?.name || "")
      .replace("{{email}}", formData.personal_info?.email || "")
      .replace("{{number}}", formData.personal_info?.number || "")
      .replace("{{summary}}", formatSummary())
      .replace("{{skills}}", formatSkills())
      .replace("{{experience}}", formatExperience())
      .replace("{{education}}", formatEducation())
      .replace("{{projects}}", formatProjects())
      .replace("{{links}}", formatLinks())
  }

  // Return the professional template by default
  return professionalTemplate;
}