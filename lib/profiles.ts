import { v4 as uuidv4 } from "uuid";

export interface ProfilePreset {
  id: string;
  displayName: string;
  handle: string;
  avatarUrl?: string;
}

const KEY = "carrossel_profiles";

export function loadProfiles(): ProfilePreset[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as ProfilePreset[]) : [];
  } catch {
    return [];
  }
}

function persist(profiles: ProfilePreset[]): void {
  localStorage.setItem(KEY, JSON.stringify(profiles));
}

export function addProfile(data: Omit<ProfilePreset, "id">): ProfilePreset {
  const profiles = loadProfiles();
  const preset: ProfilePreset = { id: uuidv4(), ...data };
  profiles.push(preset);
  persist(profiles);
  return preset;
}

export function removeProfile(id: string): void {
  persist(loadProfiles().filter(p => p.id !== id));
}
