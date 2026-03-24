import MainScreen from "@/components/screens/ResumeList";
import EducationStep from "@/components/screens/EducationStep";
import ResumeOptions from "@/components/screens/ResumeOptions";
import ReviewStep from "@/components/screens/ReviewStep";
import SkillsStep from "@/components/screens/SkillStep";
import SummaryStep from "@/components/screens/SummaryStep";
import WorkExperienceStep from "@/components/screens/WorkExperience";
import SafeScreen from "@/components/appcomp/SafeScreen";
import Projects from "@/components/screens/Projects";
import PersonalInfoStep from "@/components/screens/PersonalInfoStep";
import OtherLinks from "@/components/screens/OtherLinks";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import IndustrySelector from "./TemplateSelector/IndustrySelector";
import ResumeOptionEnhanced from "./TemplateSelector/ResumeOptionEnhanced";
import JobDescriptionStep from "./JobDescriptionStep";
import BranchSelectScreen from "./TemplateSelector/Branchselectscreen";

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
    education: [{}],
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
  const setBranch = (branch: string) => {
    setFormData((prev) => ({
      ...prev,
      personal_info: { ...prev.personal_info, branch },
    }));
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
    setFormData((prev) => ({
      ...prev,
      personal_info: { ...prev.personal_info, [field]: value },
    }));
  };

  // 🔹 Add Work Experience
  const addWorkExperience = (exp: any) => {
    setFormData((prev: any) => ({
      ...prev,
      work_experience: [...prev.work_experience, exp],
    }));
  };

  // 🔹 Update Work Experience
  const updateWorkExperience = (
    index: number,
    field: string,
    value: string
  ) => {
    const updated = formData.work_experience.map((exp, i) =>
      i === index ? { ...exp, [field]: value } : exp
    );
    setFormData({ ...formData, work_experience: updated });
  };
  // Remove Exprerienc
  const removeExperience = (index: number) => {
    const updated = formData.work_experience.filter((_, i) => i !== index);
    setFormData({ ...formData, work_experience: updated });
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
    const updated = formData.projects.map((pro, i) =>
      i === index ? { ...pro, [field]: value } : pro
    );
    setFormData({ ...formData, projects: updated });
  };
  // Remove Exprerienc
  const removeProjects = (index: number) => {
    const updated = formData.projects.filter((_, i) => i !== index);
    setFormData({ ...formData, projects: updated });
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
    field: string | Record<string, string>,
    value?: string
  ) => {
    const updated = formData.education.map((edu, i) => {
      if (i !== index) return edu;

      // 🔥 Handle object update
      if (typeof field === "object") {
        return { ...edu, ...field };
      }

      return { ...edu, [field]: value };
    });

    setFormData({ ...formData, education: updated });
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
  const totalSteps = 9;
  // const progress = step / totalSteps;
  const goToStep = (stepNumber: number) => {
    setStep(stepNumber);
  };
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
          // prevStep={prevStep}
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
            nextStep={nextStep}
            prevStep={prevStep}
            step={step}
            totalSteps={totalSteps}
          />
        )}
        {step === 5 && (
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
        {step === 6 && (
          <Projects
            data={formData}
            addProjects={addProjects}
            updateProjects={updateProjects}
            removeProjects={removeProjects}
            nextStep={nextStep}
            prevStep={prevStep}
            step={step}
            totalSteps={totalSteps}
          />
        )}
        {step === 7 && (
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
            nextStep={nextStep}
            prevStep={prevStep}
            step={step}
            totalSteps={totalSteps}
          />
        )}
        {step === 8 && (
          <JobDescriptionStep
            data={formData}
            // addExperience={addWorkExperience}
            updateExperience={updateWorkExperience}
            // removeExperience={removeExperience}
            nextStep={nextStep}
            prevStep={prevStep}
            step={step}
            totalSteps={totalSteps}
          />
        )}
        {step === 9 && (
          <OtherLinks
            data={formData}
            updateOtherLinks={updateOtherLinks}
            nextStep={nextStep}
            prevStep={prevStep}
            step={step}
            totalSteps={totalSteps}
          />
        )}

        {step === 10 && (
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
        {step === 11 && <ReviewStep data={formData} prevStep={prevStep} step={step}
          totalSteps={totalSteps} goToStep={goToStep} />}
      </View>
    </SafeScreen>
  );
}

