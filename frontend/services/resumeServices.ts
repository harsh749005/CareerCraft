import AsyncStorage from "@react-native-async-storage/async-storage";
import { Resume } from "../types/resume";

const STORAGE_KEY = "careercraft_resumes";
// Tracks which saved resume is currently being edited
// so saveResume knows to UPDATE it, not create a new one
const EDITING_ID_KEY = "careercraft_editing_id";

// ── READ ──
export async function getResumes(): Promise<Resume[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function relativeTime(createdAt: number): string {
  const diff = Date.now() - createdAt;
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

// ── Track which resume is being edited ──
export async function setEditingResumeId(id: string | null): Promise<void> {
  if (id) {
    await AsyncStorage.setItem(EDITING_ID_KEY, id);
  } else {
    await AsyncStorage.removeItem(EDITING_ID_KEY);
  }
}

export async function getEditingResumeId(): Promise<string | null> {
  return await AsyncStorage.getItem(EDITING_ID_KEY);
}

// ── SAVE (create or update) ──
export async function saveResume(resume: Resume): Promise<void> {
  const all = await getResumes();
  const idx = all.findIndex((r) => r.id === resume.id);
  if (idx >= 0) {
    all[idx] = resume;
  } else {
    all.unshift(resume);
  }
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  // Clear editing id after save
  await setEditingResumeId(null);
}

// ── RENAME — updates resume.name only (not personal_info.name) ──
// personal_info.name is the actual person's name, rename is just the file label
export async function renameResume(id: string, newName: string): Promise<void> {
  const all = await getResumes();
  const idx = all.findIndex((r) => r.id === id);
  if (idx < 0) return;

  all[idx] = {
    ...all[idx],
    name: newName,
    // Do NOT touch data.personal_info.name — that's the real name in the resume
  };

  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

// ── DUPLICATE ──
export async function duplicateResume(resume: Resume): Promise<Resume> {
  const copy: Resume = {
    ...resume,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    name: `Copy of ${resume.name}`,
    createdAt: Date.now(),
    time: "Just now",
    data: JSON.parse(JSON.stringify(resume.data)), // deep copy
  };

  const all = await getResumes();
  all.unshift(copy);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  return copy;
}

// ── DELETE ──
export async function deleteResume(id: string): Promise<void> {
  const all = await getResumes();
  const filtered = all.filter((r) => r.id !== id);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}