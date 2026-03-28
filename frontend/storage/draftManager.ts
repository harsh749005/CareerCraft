import AsyncStorage from "@react-native-async-storage/async-storage";

const DRAFT_KEY = "resume_draft";

// 🔍 Check if form is empty
export const isFormEmpty = (data: any): boolean => {
  if (!data) return true;

  return Object.values(data).every((value) => {
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === "object" && value !== null) {
      return isFormEmpty(value);
    }
    return !value;
  });
};

// 💾 Save OR Remove automatically
export const syncDraft = async (data: any) => {
  try {
    if (isFormEmpty(data)) {
      await AsyncStorage.removeItem(DRAFT_KEY);
      console.log("🗑 Draft removed");
    } else {
      await AsyncStorage.setItem(DRAFT_KEY, JSON.stringify(data));

      console.log("💾 Draft saved:");
      console.log(JSON.stringify(data, null, 2)); // 👈 clean view
    }
  } catch (e) {
    console.error("Draft sync failed", e);
  }
};

// 📂 Load draft
export const loadDraft = async () => {
  try {
    const raw = await AsyncStorage.getItem(DRAFT_KEY);

    if (!raw) return null;

    const data = JSON.parse(raw);

    // Safety check
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