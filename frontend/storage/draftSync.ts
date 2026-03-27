// import { ResumeDraft } from "../types/resume";

// const API_URL = "https://your-api.com"; // replace with yours

// // Push draft to backend
// export const syncDraftToBackend = async (draft: ResumeDraft) => {
//   try {
//     await fetch(`${API_URL}/resumes/draft`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(draft),
//     });
//   } catch (e) {
//     console.warn("Draft sync failed, will retry later", e);
//     // Silently fail — AsyncStorage already has it
//   }
// };

// // Fetch all drafts for a user from backend (on fresh install / new device)
// export const fetchDraftsFromBackend = async (
//   user_id: string
// ): Promise<ResumeDraft[]> => {
//   try {
//     const res = await fetch(`${API_URL}/resumes/drafts/${user_id}`);
//     return await res.json();
//   } catch {
//     return [];
//   }
// };