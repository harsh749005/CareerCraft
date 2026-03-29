import AsyncStorage from "@react-native-async-storage/async-storage";

const DRAFT_KEY = "resume_draft";

export const isFormEmpty = (data: any): boolean => {
  if (!data) return true;
  return Object.values(data).every((value) => {
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === "object" && value !== null) return isFormEmpty(value);
    return !value;
  });
};

export const syncDraft = async (data: any) => {
  try {
    if (isFormEmpty(data)) {
      await AsyncStorage.removeItem(DRAFT_KEY);
    } else {
      await AsyncStorage.setItem(DRAFT_KEY, JSON.stringify(data));
    }
  } catch (e) {
    console.error("Draft sync failed", e);
  }
};

export const loadDraft = async () => {
  try {
    const raw = await AsyncStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (isFormEmpty(data)) {
      await AsyncStorage.removeItem(DRAFT_KEY);
      return null;
    }
    return data;
  } catch (e) {
    console.error("Load failed", e);
    return null;
  }
};

// ── NEW: clear draft completely ──
export const clearDraft = async () => {
  try {
    await AsyncStorage.removeItem(DRAFT_KEY);
  } catch (e) {
    console.error("Clear draft failed", e);
  }
};

// ── NEW: load a saved resume's data into draft for editing ──
export const loadResumeIntoDraft = async (resumeData: any) => {
  try {
    await AsyncStorage.setItem(DRAFT_KEY, JSON.stringify(resumeData));
  } catch (e) {
    console.error("Load into draft failed", e);
  }
};