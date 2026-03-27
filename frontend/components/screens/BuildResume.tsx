import { useEffect, useState } from "react";
import {  View } from "react-native";
import BranchSelectScreen from "./BranchSelector/Branchselectscreen";
import PersonalInfoStep from "@/components/screens/PersonalInfo/PersonalInfoStep";
import EducationStep from "@/components/screens/Education/EducationStep";
import EducationSummary from "@/components/screens/Education/EducationSummary";
import Projects from "@/components/screens/Project/Projects";
import ProjectsSummaryStep from "./Project/ProjectsSummaryStep";
import WorkExperienceStep from "@/components/screens/Work/WorkExperience";
import JobDescriptionStep from "./Work/JobDescriptionStep";
import WorkExperienceSummaryStep from "./Work/WorkExperienceSummaryStep";
import ResumeOptions from "@/components/screens/ResumeOptions/ResumeOptions";
import SkillsStep from "@/components/screens/Skill/SkillStep";
import ReviewStep from "@/components/screens/Review/ReviewStep";
import SummaryStep from "@/components/screens/Summary/SummaryStep";
import OtherLinks from "@/components/screens/Links/OtherLinks";
import SafeScreen from "@/components/appcomp/SafeScreen";

// storage filles
import {saveDraftLocally,loadDraftLocally} from "@/storage/draftStorage";

export default function BuildReume() {
  // const [option,setOption] = useState("");
  // const [selectedIndustry, setSelectedIndustry] = useState("");
  // const [selectedTemplate, setSelectedTemplate] = useState("");
  // const updateSelectedIndustry = (industry: string) => {
  //   setSelectedIndustry(industry);
  // };
  // const handleOption = (e:string) =>{
  //   setOption(e);
  // }

  const [step, setStep] = useState(1);
  const [activeEduExperienceIndex, setActiveEduExperienceIndex] = useState(0);
  /** Which `work_experience` entry WorkExperience + JobDescription steps edit (not always index 0). */
  const [activeWorkExperienceIndex, setActiveWorkExperienceIndex] = useState(0);
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const [formData, setFormData] = useState<{
    personal_info: Record<string, any>;
    professional_summary: string;
    work_experience: any[];
    projects: any[];
    education: any[];
    skills: {
      categorized: Record<string, string[]>;  // { "Frontend": ["HTML", "CSS"], "Backend": ["MySQL"] }
      uncategorized: string[];                // ["HTML", "CSS", "MySQL"] — for flat templates
    };
    // certifications: string[];
    // languages: string[];
    selected_template: string;
    otherLinks: Record<string, any>;
  }>({
    personal_info: {},
    professional_summary: "",
    work_experience: [], // ✅ now properly typed
    projects: [],
    // EducationStep edits `education[0]` as a controlled form.
    // Ensure we always have an initial object to write into.
    education: [],
    skills: {
      categorized: {
        Languages: [],
        Frameworks: [],
        Tools: [],
        Databases: [],
      },
      uncategorized: [],
    },
    // certifications: [],
    // languages: [],
    selected_template: "",
    otherLinks: {},
  });

  useEffect(() => {
    let isMounted = true;
    const hydrateFromLocalDraft = async () => {
      const local = await loadDraftLocally();
      if (!isMounted || !local) return;

      setFormData((prev) => ({
        ...prev,
        ...local,
        personal_info: { ...prev.personal_info, ...(local.personal_info ?? {}) },
        otherLinks: { ...prev.otherLinks, ...(local.otherLinks ?? {}) },
        work_experience: Array.isArray(local.work_experience) ? local.work_experience : prev.work_experience,
        projects: Array.isArray(local.projects) ? local.projects : prev.projects,
        education: Array.isArray(local.education) ? local.education : prev.education,
        skills: local.skills ?? prev.skills,
      }));
    };

    hydrateFromLocalDraft();
    return () => {
      isMounted = false;
    };
  }, []);
  const setBranch = (branch: string) => {
    setFormData((prev) => {
      const updated = {

        ...prev,
        personal_info: { ...prev.personal_info, branch },
      }
      saveDraftLocally(updated);
      return updated
    });
  };
  const setTemplate = (templateId: string) => {
    setFormData((prev) => ({
      ...prev,
      selected_template: templateId,   // ✅ matches your formData shape exactly
    }));
    // setStep(3);                        // move to forms
  };
  // 🔹 Update Personal Info (nested object)
  const updatePersonalInfo = (field: string, value: string) => {
    setFormData((prev) => {
      const updated = {
        ...prev,
        personal_info: { ...prev.personal_info, [field]: value },
      }
      saveDraftLocally(updated);
      return updated
    });
  };

  // 🔹 Add Work Experience
  const addWorkExperience = (exp: any) => {
    setFormData((prev: any) => ({
      ...prev,
      work_experience: [...prev.work_experience, exp],
    }));
  };

  const EMPTY_WORK_EXPERIENCE = {
    job_title: "",
    company_name: "",
    city: "",
    country: "",
    start_month: "",
    start_year: "",
    end_month: "",
    end_year: "",
    is_present: false,
    description: "",
  };
  const EMPTY_PROJECT = {
    title: "",
    technologies: "",
    description: "",
    liveUrl: "",
  };
  const EMPTY_EDU_EXPERIENCE = {
    institution: "",
    degree:"",
    result:"",
    start_month: "",
    start_year: "",
    end_month: "",
    end_year: "",
    is_present: false,
  };
  const isEduExperienceEmpty = (exp: any) => {
    if (!exp) return true;
    const i = (exp.institution || "").trim();
    const d = (exp.degree || "").trim();
    const r = (exp.result || "").trim();
    const hasDates =
      Boolean(exp.start_month) ||
      Boolean(exp.start_year) ||
      Boolean(exp.end_month) ||
      Boolean(exp.end_year) ||
      Boolean(exp.is_present);
    return !i && !d && !r && !hasDates;
  };
  const isWorkExperienceEmpty = (exp: any) => {
    if (!exp) return true;
    const t = (exp.job_title || "").trim();
    const c = (exp.company_name || "").trim();
    const d = (exp.description || "").trim();
    const hasDates =
      Boolean(exp.start_month) ||
      Boolean(exp.start_year) ||
      Boolean(exp.end_month) ||
      Boolean(exp.end_year) ||
      Boolean(exp.is_present);
    return !t && !c && !d && !hasDates;
  };

  const isProjectEmpty = (p: any) => {
    if (!p) return true;
    const t = (p.title || "").trim();
    const d = (p.description || "").trim();
    const tech = (p.technologies || "").trim();
    const url = (p.liveUrl || "").trim();
    return !t && !d && !tech && !url;
  };

  // 🔹 Update Work Experience (functional update avoids stale overwrites)
  const updateWorkExperience = (
    index: number,
    field: string,
    value: string | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      work_experience: prev.work_experience.map((exp, i) =>
        i === index ? { ...exp, [field]: value } : exp
      ),
    }));
  };

  const removeExperience = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      work_experience: prev.work_experience.filter((_, i) => i !== index),
    }));
    setActiveWorkExperienceIndex((prev) => {
      if (index < prev) return prev - 1;
      if (index === prev) return Math.max(0, prev - 1);
      return prev;
    });
  };
  const removeEduExperience = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
    setActiveEduExperienceIndex((prev) => {
      if (index < prev) return prev - 1;
      if (index === prev) return Math.max(0, prev - 1);
      return prev;
    });
  };

  /** Add a new role, drop prior blank drafts, focus the new slot, go to Work Experience. */
  const handleAddAnotherPosition = () => {
    let newIndex = 0;
    setFormData((prev) => {
      const cleaned = prev.work_experience.filter((e) => !isWorkExperienceEmpty(e));
      newIndex = cleaned.length;
      return {
        ...prev,
        work_experience: [...cleaned, { ...EMPTY_WORK_EXPERIENCE }],
      };
    });
    setActiveWorkExperienceIndex(newIndex);
    setStep(9);
  };
  const handleAddAnotherEduExperience = () => {
    let newIndex = 0;
    setFormData((prev) => {
      const cleaned = prev.education.filter((e) => !isEduExperienceEmpty(e));
      newIndex = cleaned.length;
      return {
        ...prev,
        education: [...cleaned, { ...EMPTY_EDU_EXPERIENCE }],
      };
    });
    setActiveEduExperienceIndex(newIndex);
    setStep(4);
  };
  const handleEditWorkExperience = (index: number) => {
    setActiveWorkExperienceIndex(index);
    setStep(9);
  };
  const handleEditEduExperience = (index: number) => {
    setActiveEduExperienceIndex(index);
    setStep(4);
  };
  const handleGoToJobDescription = (index: number) => {
    setActiveWorkExperienceIndex(index);
    setStep(10);
  };
  // add projects
  const addProjects = (pro: any) => {
    setFormData((prev: any) => ({
      ...prev,
      projects: [...prev.projects, pro],
    }));
  };
  // update project
  const updateProjects = (index: number, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      projects: prev.projects.map((pro, i) =>
        i === index ? { ...pro, [field]: value } : pro
      ),
    }));
  };
  const handleEditProjects = (index: number) => {
    setActiveProjectIndex(index);
    // Go back to the projects editor (not the summary list).
    setStep(7);
  };
  // Remove Exprerienc
  const removeProjects = (index: number) => {
    // const updated = formData.projects.filter((_, i) => i !== index);
    // setFormData({ ...formData, projects: updated });
    setFormData((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index),
    }));
    setActiveProjectIndex((prev) => {
      if (index < prev) return prev - 1;
      if (index === prev) return Math.max(0, prev - 1);
      return prev;
    });
  };
  /** Add a new role, drop prior blank drafts, focus the new slot, go to Work Experience. */
  const handleAddAnotherProject = () => {
    let newIndex = 0;
    setFormData((prev) => {
      const cleaned = prev.projects.filter((e) => !isProjectEmpty(e));
      newIndex = cleaned.length;
      return {
        ...prev,
        projects: [...cleaned, { ...EMPTY_PROJECT }],
      };
    });
    setActiveProjectIndex(newIndex);
    setStep(7);
  };

  // 🔹 Update Summary
  const updateSummary = (value: string) => {
    setFormData((prev) => ({ ...prev, professional_summary: value }));
  };

  // add Certification
  // const addCertification = (cert:string) => {
  //   setFormData((prev:any) => ({
  //     ...prev,
  //     certifications: [...prev.certifications, cert],
  //   }));
  // };

  // 🔹 Update Certifications
  // const updateCertification = (index:number, value:string) => {
  //   const updated = formData.certifications.map((cert, i) =>
  //     i === index ? value : cert
  //   );
  //   setFormData({ ...formData, certifications: updated });
  // };

  // add Education
  const addEducation = (edu: any) => {
    setFormData((prev: any) => ({
      ...prev,
      education: [...prev.education, edu],
    }));
  };

  // 🔹 Update Education
  const updateEducation = (
    index: number,
    field: string,
    value: string | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.map((exp, i) =>
        i === index ? { ...exp, [field]: value } : exp
      ),
    }));
  };
  const handleRemoveEducationExperience = (index: number) => {
    const updated = formData.education.filter((_, i) => i !== index);
    setFormData({ ...formData, education: updated });
  };

  // 🔹 Add & Remove Languages
  // const handleLanguage = (lang:string) => {
  //   setFormData((prev:any) => {
  //     const alreadySelected = prev.languages.includes(lang);

  //     return {
  //       ...prev,
  //       languages: alreadySelected
  //         ? prev.languages.filter((item:any) => item !== lang) // remove if already selected
  //         : [...prev.languages, lang], // add if not selected
  //     };
  //   });
  // };

  // 🔹 Update Languages
  // const updateLanguage = (index:number, value:string) => {
  //   const updated = formData.languages.map((lang, i) =>
  //     i === index ? value : lang
  //   );
  //   setFormData({ ...formData, languages: updated });
  // };

  // Your updateSkill function:
  type SkillCategory = "languages" | "frameworks" | "tools" | "databases";
  // For categorized templates — toggles skill inside a named category
  const updateCategorizedSkill = (category: string, skill: string) => {
    setFormData((prev) => {
      const currentSkills = prev.skills.categorized[category] || [];
      const alreadySelected = currentSkills.includes(skill);

      return {
        ...prev,
        skills: {
          ...prev.skills,
          categorized: {
            ...prev.skills.categorized,
            [category]: alreadySelected
              ? currentSkills.filter((s) => s !== skill)
              : [...currentSkills, skill],
          },
        },
      };
    });
  };

  // For uncategorized templates — toggles skill in flat list
  const updateUncategorizedSkill = (skill: string) => {
    setFormData((prev) => {
      const currentSkills = prev.skills.uncategorized;
      const alreadySelected = currentSkills.includes(skill);

      return {
        ...prev,
        skills: {
          ...prev.skills,
          uncategorized: alreadySelected
            ? currentSkills.filter((s) => s !== skill)
            : [...currentSkills, skill],
        },
      };
    });
  };

  // Optional: add a new category dynamically
  const addSkillCategory = (categoryName: string) => {
    setFormData((prev) => {
      if (prev.skills.categorized[categoryName]) return prev; // already exists
      return {
        ...prev,
        skills: {
          ...prev.skills,
          categorized: {
            ...prev.skills.categorized,
            [categoryName]: [],
          },
        },
      };
    });
  };

  // 🔹 Update Selected Template
  const updateSelectedTemplate = (value: string) => {
    console.log("Selected Template in Index:", value);
    setFormData((prev) => ({ ...prev, selected_template: value }));
  };

  // 🔹 Update updateOtherLinks (nested object)
  const updateOtherLinks = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      otherLinks: { ...prev.otherLinks, [field]: value },
    }));
  };

  // 🔹 Navigation
  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);
  const totalSteps = 13;
  // const progress = step / totalSteps;
  const goToStep = (stepNumber: number) => {
    setStep(stepNumber);
  };

  const visibleEntries = formData.projects
    .map((exp: any, index: number) => ({ exp, index }))
    .filter(({ exp }) => !isProjectEmpty(exp));

  return (
    <SafeScreen>
      <View style={{ flex: 1 }}>
        {/* 🔹 Progress Bar */}
        {/* <View style={styles.progressContainer}>
        <View
          style={[
            styles.progressFill,
            { flex: step, backgroundColor: "#81B29A" },
          ]}
        />
        <View style={{ flex: totalSteps - step, backgroundColor: "#eee" }} />
      </View> */}
        {/* <Text style={styles.header}>Step {step} / {totalSteps}</Text> */}
        {/* Step Counter */}
        {/* <Text style={{ fontSize: 18, marginBottom: 10 }}>Step {step}/9</Text> */}

        {/* {
              step === 1 && (
                <MainScreen></MainScreen>
              )
        } */}
        {step === 1 && (
          <BranchSelectScreen
            onNext={(branch) => {
              setBranch(branch);
              // nextStep();        // call it as a function, not a prop
            }}
            nextStep={nextStep}
            prevStep={prevStep}
            step={step}
            totalSteps={totalSteps}
          />
        )}
        {step === 2 && (
          // <IndustrySelector nextStep={nextStep} updateSelectedIndustry={setSelectedIndustry} />
          <ResumeOptions
            branch={formData.personal_info.branch}    // ✅ pass branch for filtering
            updateSelectedTemplate={updateSelectedTemplate}  // ✅ matches the interface
            nextStep={nextStep}
            prevStep={prevStep}
            step={step}
            totalSteps={totalSteps}
          />

        )}
        {/* {step === 2 && (
          <ResumeOptionEnhanced nextStep={nextStep} updateSelectedTemplate={setSelectedTemplate} selectedIndustry={selectedIndustry} />
        )} */}

        {step === 3 && (
          <PersonalInfoStep
            data={formData.personal_info}
            updatePersonalInfo={updatePersonalInfo}
            prevStep={prevStep}
            nextStep={nextStep}
            step={step}
            totalSteps={totalSteps}
          />
        )}

        {step === 4 && (
          <EducationStep
            data={formData}
            addEducation={addEducation}
            updateEducation={updateEducation}
            removeEducationExperience={handleRemoveEducationExperience}
            activeEduExperienceIndex={activeEduExperienceIndex}
            nextStep={nextStep}
            prevStep={prevStep}
            step={step}
            totalSteps={totalSteps}
          />
        )}
        {
          step === 5 &&  (
            <EducationSummary
            data={formData}
            removeExperience={removeEduExperience}
            onAddAnotherPosition={handleAddAnotherEduExperience}
            onEditExperience={handleEditEduExperience}
            // onGoToJobDescription={handleGoToJobDescription}
            nextStep={nextStep}
            prevStep={prevStep}
            step={step}
            totalSteps={totalSteps}
            />
          )
        }
        {step === 6 && (
          // <LanguagesStep
          //   data={formData}
          //   handleLanguage={handleLanguage}
          //   nextStep={nextStep}
          //   prevStep={prevStep}
          // />
          <SkillsStep
            data={formData}
            updateCategorizedSkill={updateCategorizedSkill}
            updateUncategorizedSkill={updateUncategorizedSkill}
            addSkillCategory={addSkillCategory}
            nextStep={nextStep}
            prevStep={prevStep}
            step={step}
            totalSteps={totalSteps}
          />
        )}
        {step === 7 && (
          <Projects
            data={formData}
            addProjects={addProjects}
            updateProjects={updateProjects}
            removeProjects={removeProjects}
            // activeProjectIndex={activeProjectIndex}
            nextStep={nextStep}
            prevStep={prevStep}
            step={step}
            totalSteps={totalSteps}
          />
        )}
        {
          step === 8 && (
            <ProjectsSummaryStep
              data={formData}
              projects={formData.projects}
              visibleEntries={visibleEntries}
              onEdit={handleEditProjects}
              onDelete={removeProjects}
              onAddAnother={handleAddAnotherProject}
              nextStep={nextStep}
              prevStep={prevStep}
              step={step}
              totalSteps={totalSteps}
            />
          )
        }
        {step === 9 && (
          // <CertificationsStep
          //   data={formData}
          //   addCertification={addCertification}
          //   updateCertification={updateCertification}
          //   nextStep={nextStep}
          //   prevStep={prevStep}
          // />
          <WorkExperienceStep
            data={formData}
            addExperience={addWorkExperience}
            updateExperience={updateWorkExperience}
            removeExperience={removeExperience}
            activeExperienceIndex={activeWorkExperienceIndex}
            nextStep={nextStep}
            prevStep={prevStep}
            step={step}
            totalSteps={totalSteps}
          />
        )}

        {step === 10 && (
          <JobDescriptionStep
            data={formData}
            updateExperience={updateWorkExperience}
            activeExperienceIndex={activeWorkExperienceIndex}
            nextStep={nextStep}
            prevStep={prevStep}
            step={step}
            totalSteps={totalSteps}
          />
        )}
        {
          step === 11 && (
            <WorkExperienceSummaryStep
              data={formData}
              removeExperience={removeExperience}
              onAddAnotherPosition={handleAddAnotherPosition}
              onEditExperience={handleEditWorkExperience}
              onGoToJobDescription={handleGoToJobDescription}
              nextStep={nextStep}
              prevStep={prevStep}
              step={step}
              totalSteps={totalSteps}
            />
          )
        }
        {step === 12 && (
          <OtherLinks
            data={formData}
            updateOtherLinks={updateOtherLinks}
            nextStep={nextStep}
            prevStep={prevStep}
            step={step}
            totalSteps={totalSteps}
          />
        )}

        {step === 13 && (
          <SummaryStep
            data={formData}
            summary={formData.professional_summary}
            updateSummary={updateSummary}
            nextStep={nextStep}
            prevStep={prevStep}
            step={step}
            totalSteps={totalSteps}
          />
        )}

        {/* {step === 6 && (
          <ResumeOptions
            nextStep={nextStep}
            prevStep={prevStep}
            updateSelectedTemplate={updateSelectedTemplate}
          />
        )} */}
        {step === 14 && <ReviewStep data={formData} prevStep={prevStep} step={step}
          totalSteps={totalSteps} goToStep={goToStep} />}
      </View>
    </SafeScreen>
  );
}

