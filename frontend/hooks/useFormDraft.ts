import { useState, useEffect, useCallback } from "react";
import { useDebouncedCallback } from "use-debounce";
import { ResumeDraft } from "../types/resume";
import { saveDraftLocally, loadDraftLocally } from "../storage/draftStorage";
// import { syncDraftToBackend } from "../storage/draftSync";
import "react-native-get-random-values"; // needed for uuid
import { v4 as uuidv4 } from "uuid";

const makeEmptyDraft = (user_id: string): ResumeDraft => ({
  resume_id: uuidv4(),
  user_id,
  last_modified: new Date().toISOString(),
  personal_info: {},
  professional_summary: "",
  work_experience: [],
  projects: [],
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
  selected_template: "",
  otherLinks: {},
});

export const useFormDraft = (user_id: string, resume_id?: string) => {
  const [formDataDraft, setFormData] = useState<ResumeDraft | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load draft on mount
  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      if (resume_id) {
        const local = await loadDraftLocally(resume_id);
        setFormData(local ?? makeEmptyDraft(user_id));
      } else {
        // New resume
        setFormData(makeEmptyDraft(user_id));
      }
      setIsLoading(false);
    };
    load();
  }, [resume_id, user_id]);

  // Debounced backend sync (fires 1.5s after last change)
  const syncToBackend = useDebouncedCallback(async (draft: ResumeDraft) => {
    setIsSaving(true);
    // await syncDraftToBackend(draft);
    setIsSaving(false);
  }, 1500);

  // Called on every field change
  const updateSection = useCallback(
    <K extends keyof ResumeDraft>(section: K, value: ResumeDraft[K]) => {
      setFormData((prev) => {
        if (!prev) return prev;
        const updated: ResumeDraft = {
          ...prev,
          [section]: value,
          last_modified: new Date().toISOString(),
        };
        // 1. Save locally immediately
        saveDraftLocally(updated);
        // 2. Sync to backend after debounce
        syncToBackend(updated);
        return updated;
      });
    },
    [syncToBackend]
  );

  return { formDataDraft, updateSection, isSaving, isLoading };
};