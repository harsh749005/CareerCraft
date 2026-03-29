import AsyncStorage from "@react-native-async-storage/async-storage";
import { Resume } from "../types/resume";
import { api } from "./apiServices";

const STORAGE_KEY = "careercraft_resumes";
const EDITING_ID_KEY = "careercraft_editing_id";

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

// ── READ — try Neon first, fall back to AsyncStorage ──
export async function getResumes(userId?: string): Promise<Resume[]> {
  // 1. Always load local data first
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  const localResumes: Resume[] = raw ? JSON.parse(raw) : [];

  if (userId) {
    try {
      const remote = await api.getResumes(userId);

      if (remote && Array.isArray(remote) && remote.length > 0) {
        // Remote has data — merge with local
        const mapped: Resume[] = remote.map((r: any) => ({
          id: r.id,
          name: r.name,
          createdAt: new Date(r.created_at).getTime(),
          updatedAt: new Date(r.updated_at).getTime(),
          time: relativeTime(new Date(r.updated_at).getTime()),
          data: r.data,
        }));

        // Merge: remote wins for same id, keep local-only ones too
        const remoteIds = new Set(mapped.map((r) => r.id));
        const localOnly = localResumes.filter((r) => !remoteIds.has(r.id));
        const merged = [...mapped, ...localOnly];

        // Update local cache with merged result
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        return merged;

      } else if (remote && Array.isArray(remote) && remote.length === 0) {
        // Remote is empty but local has data — push local to Neon
        console.log("📤 Remote empty, uploading local resumes to Neon...");
        for (const resume of localResumes) {
          await api.saveResume(resume, userId);
        }
        return localResumes;
      }
    } catch (e) {
      console.error("❌ Remote fetch failed, using local:", e);
    }
  }

  // Offline or no userId — return local
  return localResumes;
}

// ── SAVE ──
export async function saveResume(
  resume: Resume,
  userId?: string
): Promise<void> {
  // 1. Save locally first (instant)
  const all = await getResumes();
  const idx = all.findIndex((r) => r.id === resume.id);
  if (idx >= 0) {
    all[idx] = resume;
  } else {
    all.unshift(resume);
  }
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(all));

  // 2. Sync to Neon in background
  if (userId) {
    await api.saveResume(resume, userId);
  }

  await setEditingResumeId(null);
}

// ── RENAME ──
export async function renameResume(
  id: string,
  newName: string,
  userId?: string
): Promise<void> {
  // 1. Update locally
  const all = await getResumes();
  const idx = all.findIndex((r) => r.id === id);
  if (idx >= 0) {
    all[idx] = { ...all[idx], name: newName };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  }

  // 2. Sync to Neon
  if (userId) {
    await api.renameResume(id, newName, userId);
  }
}

// ── DUPLICATE ──
export async function duplicateResume(
  resume: Resume,
  userId?: string
): Promise<Resume> {
  const copy: Resume = {
    ...resume,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    name: `Copy of ${resume.name}`,
    createdAt: Date.now(),
    time: "Just now",
    data: JSON.parse(JSON.stringify(resume.data)),
  };

  // 1. Save locally
  const all = await getResumes();
  all.unshift(copy);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(all));

  // 2. Sync to Neon
  if (userId) {
    await api.saveResume(copy, userId);
  }

  return copy;
}

// ── DELETE ──
export async function deleteResume(
  id: string,
  userId?: string
): Promise<void> {
  // 1. Delete locally
  const all = await getResumes();
  const filtered = all.filter((r) => r.id !== id);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));

  // 2. Sync to Neon
  if (userId) {
    await api.deleteResume(id, userId);
  }
}