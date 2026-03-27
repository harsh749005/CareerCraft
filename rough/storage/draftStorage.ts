// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { ResumeDraft } from "../types/resume";

// const DRAFT_PREFIX = "resume_draft_";
// const DRAFT_INDEX_KEY = "resume_draft_ids"; // tracks all resume IDs

// // Save a single draft
// export const saveDraftLocally = async (draft: ResumeDraft) => {
//   try {
//     const key = `${DRAFT_PREFIX}${draft.resume_id}`;
//     await AsyncStorage.setItem(key, JSON.stringify(draft));
//     console.log("💾 Full draft saved:", JSON.stringify(draft, null, 2));
//     // Update the index of all draft IDs
//     const existing = await getDraftIds();
//     if (!existing.includes(draft.resume_id)) {
//       await AsyncStorage.setItem(
//         DRAFT_INDEX_KEY,
//         JSON.stringify([...existing, draft.resume_id])
//       );
//     }
//   } catch (e) {
//     console.error("Failed to save draft locally", e);
//   }
// };

// // Load a specific draft by ID
// export const loadDraftLocally = async (
//   resume_id: string
// ): Promise<ResumeDraft | null> => {
//   try {
//     const raw = await AsyncStorage.getItem(`${DRAFT_PREFIX}${resume_id}`);
//     return raw ? JSON.parse(raw) : null;
//   } catch {
//     return null;
//   }
// };

// // Load all draft IDs
// export const getDraftIds = async (): Promise<string[]> => {
//   try {
//     const raw = await AsyncStorage.getItem(DRAFT_INDEX_KEY);
//     return raw ? JSON.parse(raw) : [];
//   } catch {
//     return [];
//   }
// };

// // Load all drafts (for listing resumes)
// export const loadAllDraftsLocally = async (): Promise<ResumeDraft[]> => {
//   const ids = await getDraftIds();
//   const drafts = await Promise.all(ids.map(loadDraftLocally));
//   return drafts.filter(Boolean) as ResumeDraft[];
// };

// // Delete a draft
// export const deleteDraftLocally = async (resume_id: string) => {
//   await AsyncStorage.removeItem(`${DRAFT_PREFIX}${resume_id}`);
//   const existing = await getDraftIds();
//   await AsyncStorage.setItem(
//     DRAFT_INDEX_KEY,
//     JSON.stringify(existing.filter((id) => id !== resume_id))
//   );
// };