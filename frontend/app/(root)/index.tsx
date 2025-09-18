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

export default function Index() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<{
    personal_info: Record<string, any>;
    professional_summary: string;
    work_experience: any[];
    projects: any[];
    education: any[];
    skills: {
      languages: string[];
      frameworks: string[];
      tools: string[];
      databases: string[];
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
    education: [],
    skills: {
      languages: [],
      frameworks: [],
      tools: [],
      databases: [],
    },
    // certifications: [],
    // languages: [],
    selected_template: "",
    otherLinks: {},
  });

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
  const addEducation = (edu: string) => {
    setFormData((prev: any) => ({
      ...prev,
      education: [...prev.education, edu],
    }));
  };

  // 🔹 Update Education
  const updateEducation = (index: number, field: string, value: string) => {
    const updated = formData.education.map((edu, i) =>
      i === index ? { ...edu, [field]: value } : edu
    );
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
  const updateSkill = (category: SkillCategory, skill: string) => {
    setFormData((prev) => {
      const currentSkills = prev.skills[category] || [];
      const alreadySelected = currentSkills.includes(skill);

      return {
        ...prev,
        skills: {
          ...prev.skills,
          [category]: alreadySelected
            ? currentSkills.filter((item: string) => item !== skill)
            : [...currentSkills, skill],
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
  return (
    <SafeScreen>
      <View style={{ flex: 1, padding: 20 }}>
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View
            style={[
              styles.progressFill,
              { flex: step, backgroundColor: "#000" },
            ]}
          />
          <View style={{ flex: totalSteps - step, backgroundColor: "#eee" }} />
        </View>
        {/* <Text style={styles.header}>Step {step} / {totalSteps}</Text> */}
        {/* Step Counter */}
        {/* <Text style={{ fontSize: 18, marginBottom: 10 }}>Step {step}/9</Text> */}

        {step === 1 && (
          <ResumeOptions
            nextStep={nextStep}
            updateSelectedTemplate={updateSelectedTemplate}
          />
        )}

        {step === 2 && (
          <PersonalInfoStep
            data={formData.personal_info}
            updatePersonalInfo={updatePersonalInfo}
            prevStep={prevStep}
            nextStep={nextStep}
          />
        )}

        {step === 9 && (
          <EducationStep
            data={formData}
            addEducation={addEducation}
            updateEducation={updateEducation}
            removeEducationExperience={handleRemoveEducationExperience}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        )}
        {step === 4 && (
          // <LanguagesStep
          //   data={formData}
          //   handleLanguage={handleLanguage}
          //   nextStep={nextStep}
          //   prevStep={prevStep}
          // />
          <SkillsStep
            data={formData}
            updateSkill={updateSkill}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        )}
        {step === 5 && (
          <Projects
            data={formData}
            addProjects={addProjects}
            updateProjects={updateProjects}
            removeProjects={removeProjects}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        )}
        {step === 6 && (
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
          />
        )}
        {step === 7 && (
          <OtherLinks
            data={formData}
            updateOtherLinks={updateOtherLinks}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        )}

        {step === 8 && (
          <SummaryStep
            data={formData}
            summary={formData.professional_summary}
            updateSummary={updateSummary}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        )}

        {/* {step === 6 && (
          <ResumeOptions
            nextStep={nextStep}
            prevStep={prevStep}
            updateSelectedTemplate={updateSelectedTemplate}
          />
        )} */}
        {step === 3 && <ReviewStep data={formData} prevStep={prevStep} />}
      </View>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  progressContainer: {
    flexDirection: "row",
    height: 2,
    // borderRadius: 6,
    overflow: "hidden",
    marginBottom: 15,
  },
  progressFill: {
    // borderRadius: 6,
  },
  stepIndicator: {
    backgroundColor: "#f0f8ff",
    paddingHorizontal: 16,
    paddingVertical: 6,
    // borderRadius: 20,
    marginBottom: 16,
  },
  stepText: {
    fontSize: 12,
    fontFamily: "WorkSansMedium",
    color: "#007AFF",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});
