export type SkillsData = {
    categorized: Record<string, string[]>;
    uncategorized: string[];
  };
  
  export type ResumeDraft = {
    resume_id: string;          // unique per resume
    user_id: string;            // to sync with backend
    last_modified: string;      // ISO timestamp
    personal_info: Record<string, any>;
    professional_summary: string;
    work_experience: any[];
    projects: any[];
    education: any[];
    skills: SkillsData;
    /** `TemplateConfig.id` (e.g. "Classic", "Modern") from ResumeOptions. */
    selected_template: string;
    otherLinks: Record<string, any>;
  };