// services/resumeService.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Resume } from "../types/resume";

const STORAGE_KEY = "careercraft_resumes";

// ── READ ──
export async function getResumes(): Promise<Resume[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

// ── SAVE (create or update) ──
export async function saveResume(resume: Resume): Promise<void> {
  const all = await getResumes();
  const idx = all.findIndex((r) => r.id === resume.id);
  if (idx >= 0) {
    all[idx] = resume;
  } else {
    all.unshift(resume); // newest first
  }
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

// ── DELETE ──
export async function deleteResume(id: string): Promise<void> {
  const all = await getResumes();
  const filtered = all.filter((r) => r.id !== id);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}