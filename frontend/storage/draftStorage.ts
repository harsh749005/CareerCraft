import AsyncStorage from "@react-native-async-storage/async-storage";
import { ResumeDraft } from "@/types/resume";

// BuildResume stores the "draft body" locally (no backend metadata yet).
export type ResumeDraftBody = Omit<
  ResumeDraft,
  "resume_id" | "user_id" | "last_modified"
>;
// Save
export const saveDraftLocally = async (data: ResumeDraftBody) => {
  try {
    await AsyncStorage.setItem("resume_draft", JSON.stringify(data));
    console.log("Saved!", data);
  } catch (e) {
    console.error("Save failed", e);
  }
};

// Load
export const loadDraftLocally = async (): Promise<ResumeDraftBody | null> => {
  try {
    const raw = await AsyncStorage.getItem("resume_draft");
    if (!raw) return null;

    const data = JSON.parse(raw) as ResumeDraftBody;
    console.log("Loaded!", data);
    return data;
  } catch (e) {
    console.error("Load failed", e);
    return null;
  }
};
// Remove
export const removeDraftLocally = async () => {
  try {
    await AsyncStorage.removeItem("resume_draft");
    console.log("Draft removed!");
  } catch (e) {
    console.error("Remove failed", e);
  }
};
// clearall
export const clearAllLocalStorage = async () => {
  try {
    await AsyncStorage.clear();
    console.log("All local storage cleared!");
  } catch (e) {
    console.error("Clear failed", e);
  }
};