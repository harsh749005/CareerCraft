const BASE_URL = process.env.EXPO_PUBLIC_API_URL;
// console.log("🌐 API BASE_URL:", BASE_URL); // check .env is loading

export const api = {
  syncUser: async (id: string, email: string) => {
    try {
      console.log("👤 Syncing user:", id, email);
      const res = await fetch(`${BASE_URL}/api/resumes/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, email }),
      });
      const json = await res.json();
      console.log("👤 syncUser response:", json);
    } catch (e) {
      console.error("❌ syncUser failed:", e);
    }
  },

  getResumes: async (userId: string) => {
    try {
      console.log("📥 Fetching resumes for user:", userId);
      const res = await fetch(`${BASE_URL}/api/resumes/${userId}`);
      const json = await res.json();
      console.log("📥 getResumes response:", json);
      return json;
    } catch (e) {
      console.error("❌ getResumes failed:", e);
      return null;
    }
  },

  saveResume: async (resume: any, userId: string) => {
    try {
      console.log("💾 Saving resume to Neon:", resume.id, "for user:", userId);
      const res = await fetch(`${BASE_URL}/api/resumes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...resume, user_id: userId }),
      });
      const json = await res.json();
      console.log("💾 saveResume response:", json);
    } catch (e) {
      console.error("❌ saveResume failed:", e);
    }
  },

  renameResume: async (id: string, name: string, userId: string) => {
    try {
      console.log("✏️ Renaming resume:", id, "to:", name);
      const res = await fetch(`${BASE_URL}/api/resumes/${id}/rename`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, user_id: userId }),
      });
      const json = await res.json();
      console.log("✏️ renameResume response:", json);
    } catch (e) {
      console.error("❌ renameResume failed:", e);
    }
  },

  deleteResume: async (id: string, userId: string) => {
    try {
      console.log("🗑 Deleting resume:", id);
      const res = await fetch(`${BASE_URL}/api/resumes/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId }),
      });
      const json = await res.json();
      console.log("🗑 deleteResume response:", json);
    } catch (e) {
      console.error("❌ deleteResume failed:", e);
    }
  },
};