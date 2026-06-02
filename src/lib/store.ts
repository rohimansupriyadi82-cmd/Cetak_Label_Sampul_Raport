import { useSyncExternalStore } from "react";

export type SekolahState = {
  namaSekolah?: string;
  namaKepalaSekolah?: string;
  nipKepalaSekolah?: string;
  statusSekolah?: string;
  logoSekolahCustom?: string;
  defaultTemaLabel?: "navy" | "bottle" | "maroon" | "black";
};

export type Siswa = {
  id: string;
  nama: string;
  nis?: string;
  nisn?: string;
};

export type Guru = {
  id: string;
  nama: string;
  nip?: string;
};

export type Mapel = {
  id: string;
  nama: string;
  kode?: string;
};

export type NilaiSiswa = {
  id: string;
  siswaId: string;
  mapelId: string;
  nilai?: string;
};

export type UiTheme = "glossy-neon" | "cyberpunk-glitch" | "soft-glass";

export type UiState = {
  primaryColor: string;
  uiTheme: UiTheme;
};

export type AppStore = {
  sekolah: SekolahState;
  siswaList: Siswa[];
  guruList: Guru[];
  mapelList: Mapel[];
  nilaiList: NilaiSiswa[];
  ui: UiState;
  setSiswaList: (list: Siswa[]) => void;
  setGuruList: (list: Guru[]) => void;
  setMapelList: (list: Mapel[]) => void;
  setNilaiList: (list: NilaiSiswa[]) => void;
  setSekolah: (patch: Partial<SekolahState>) => void;
  setUi: (patch: Partial<UiState>) => void;
};

const demoSiswa: Siswa[] = Array.from({ length: 12 }).map((_, i) => {
  const idx = String(i + 1).padStart(2, "0");
  return {
    id: `S-${idx}`,
    nama: `SISWA ${idx}`,
    nis: `NIS${idx}001`,
    nisn: `NISN${idx}0001`,
  };
});

type StoreState = {
  sekolah: SekolahState;
  siswaList: Siswa[];
  guruList: Guru[];
  mapelList: Mapel[];
  nilaiList: NilaiSiswa[];
  ui: UiState;
};

const LS_APP_STATE_KEY = "siakad_app_state_v1";

function canUseLocalStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function parseJson<T>(value: string | null): T | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

function sanitizeSiswaList(input: unknown): Siswa[] {
  if (!Array.isArray(input)) return [];
  return input
    .map((row) => {
      if (!row || typeof row !== "object") return null;
      const r = row as Record<string, unknown>;
      const id = typeof r.id === "string" ? r.id : "";
      const nama = typeof r.nama === "string" ? r.nama : "";
      const nisRaw = typeof r.nis === "string" ? r.nis : "";
      const nisnRaw = typeof r.nisn === "string" ? r.nisn : "";
      const nis = nisRaw.trim() ? nisRaw : undefined;
      const nisn = nisnRaw.trim() ? nisnRaw : undefined;
      if (!id || !nama) return null;
      const base: Siswa = { id, nama };
      if (nis) base.nis = nis;
      if (nisn) base.nisn = nisn;
      return base;
    })
    .filter((v): v is Siswa => v !== null);
}

function sanitizeGuruList(input: unknown): Guru[] {
  if (!Array.isArray(input)) return [];
  return input
    .map((row) => {
      if (!row || typeof row !== "object") return null;
      const r = row as Record<string, unknown>;
      const id = typeof r.id === "string" ? r.id : "";
      const nama = typeof r.nama === "string" ? r.nama : "";
      const nipRaw = typeof r.nip === "string" ? r.nip : "";
      const nip = nipRaw.trim() ? nipRaw : undefined;
      if (!id || !nama) return null;
      const base: Guru = { id, nama };
      if (nip) base.nip = nip;
      return base;
    })
    .filter((v): v is Guru => v !== null);
}

function sanitizeMapelList(input: unknown): Mapel[] {
  if (!Array.isArray(input)) return [];
  return input
    .map((row) => {
      if (!row || typeof row !== "object") return null;
      const r = row as Record<string, unknown>;
      const id = typeof r.id === "string" ? r.id : "";
      const nama = typeof r.nama === "string" ? r.nama : "";
      const kodeRaw = typeof r.kode === "string" ? r.kode : "";
      const kode = kodeRaw.trim() ? kodeRaw : undefined;
      if (!id || !nama) return null;
      const base: Mapel = { id, nama };
      if (kode) base.kode = kode;
      return base;
    })
    .filter((v): v is Mapel => v !== null);
}

function sanitizeNilaiList(input: unknown): NilaiSiswa[] {
  if (!Array.isArray(input)) return [];
  return input
    .map((row) => {
      if (!row || typeof row !== "object") return null;
      const r = row as Record<string, unknown>;
      const id = typeof r.id === "string" ? r.id : "";
      const siswaId = typeof r.siswaId === "string" ? r.siswaId : "";
      const mapelId = typeof r.mapelId === "string" ? r.mapelId : "";
      const nilaiRaw = typeof r.nilai === "string" ? r.nilai : "";
      const nilai = nilaiRaw.trim() ? nilaiRaw : undefined;
      if (!id || !siswaId || !mapelId) return null;
      const base: NilaiSiswa = { id, siswaId, mapelId };
      if (nilai) base.nilai = nilai;
      return base;
    })
    .filter((v): v is NilaiSiswa => v !== null);
}

function sanitizeSekolah(input: unknown): SekolahState {
  if (!input || typeof input !== "object") return {};
  const r = input as Record<string, unknown>;
  const statusSekolah = typeof r.statusSekolah === "string" ? r.statusSekolah : undefined;
  const logoSekolahCustom =
    typeof r.logoSekolahCustom === "string" ? r.logoSekolahCustom : undefined;
  const namaSekolah = typeof r.namaSekolah === "string" ? r.namaSekolah : undefined;
  const namaKepalaSekolah =
    typeof r.namaKepalaSekolah === "string" ? r.namaKepalaSekolah : undefined;
  const nipKepalaSekolah =
    typeof r.nipKepalaSekolah === "string" ? r.nipKepalaSekolah : undefined;
  const defaultTemaLabel =
    r.defaultTemaLabel === "navy" ||
    r.defaultTemaLabel === "bottle" ||
    r.defaultTemaLabel === "maroon" ||
    r.defaultTemaLabel === "black"
      ? r.defaultTemaLabel
      : undefined;

  return {
    namaSekolah,
    namaKepalaSekolah,
    nipKepalaSekolah,
    statusSekolah,
    logoSekolahCustom,
    defaultTemaLabel,
  };
}

function normalizeHexColor(input: string) {
  const v = input.trim();
  if (/^#[0-9a-fA-F]{6}$/.test(v)) return v.toUpperCase();
  if (/^#[0-9a-fA-F]{3}$/.test(v)) {
    const r = v[1];
    const g = v[2];
    const b = v[3];
    return `#${r}${r}${g}${g}${b}${b}`.toUpperCase();
  }
  return null;
}

function sanitizeUi(input: unknown): UiState {
  const fallback: UiState = { primaryColor: "#0D1B2A", uiTheme: "soft-glass" };
  if (!input || typeof input !== "object") return fallback;
  const r = input as Record<string, unknown>;

  const primaryColorRaw = typeof r.primaryColor === "string" ? r.primaryColor : "";
  const primaryColor = normalizeHexColor(primaryColorRaw) || fallback.primaryColor;

  const uiTheme =
    r.uiTheme === "glossy-neon" || r.uiTheme === "cyberpunk-glitch" || r.uiTheme === "soft-glass"
      ? (r.uiTheme as UiTheme)
      : fallback.uiTheme;

  return { primaryColor, uiTheme };
}

function loadPersistedState(): Partial<StoreState> | null {
  if (!canUseLocalStorage()) return null;
  const raw = window.localStorage.getItem(LS_APP_STATE_KEY);
  const parsed = parseJson<Record<string, unknown>>(raw);
  if (!parsed) return null;

  const sekolah = sanitizeSekolah(parsed.sekolah);
  const siswaList = sanitizeSiswaList(parsed.siswaList);
  const guruList = sanitizeGuruList(parsed.guruList);
  const mapelList = sanitizeMapelList(parsed.mapelList);
  const nilaiList = sanitizeNilaiList(parsed.nilaiList);
  const ui = sanitizeUi(parsed.ui);

  return { sekolah, siswaList, guruList, mapelList, nilaiList, ui };
}

let state: StoreState = {
  sekolah: {
    namaSekolah: "SDN Contoh 01",
    namaKepalaSekolah: "Nama Kepala Sekolah",
    nipKepalaSekolah: "",
    statusSekolah: "Negeri",
    logoSekolahCustom: "",
    defaultTemaLabel: "navy",
  },
  siswaList: demoSiswa,
  guruList: [],
  mapelList: [],
  nilaiList: [],
  ui: {
    primaryColor: "#0D1B2A",
    uiTheme: "soft-glass",
  },
};

{
  const persisted = loadPersistedState();
  if (persisted) {
    state = {
      ...state,
      ...persisted,
      sekolah: { ...state.sekolah, ...persisted.sekolah },
      siswaList: persisted.siswaList && persisted.siswaList.length ? persisted.siswaList : state.siswaList,
      guruList: persisted.guruList || state.guruList,
      mapelList: persisted.mapelList || state.mapelList,
      nilaiList: persisted.nilaiList || state.nilaiList,
      ui: { ...state.ui, ...(persisted.ui || {}) },
    };
  }
}


const listeners = new Set<() => void>();

function persistState(next: StoreState) {
  if (!canUseLocalStorage()) return;
  const dataToSave = {
    sekolah: next.sekolah,
    siswaList: next.siswaList,
    guruList: next.guruList,
    mapelList: next.mapelList,
    nilaiList: next.nilaiList,
    ui: next.ui,
  };
  window.localStorage.setItem(LS_APP_STATE_KEY, JSON.stringify(dataToSave));
}

function emitChange() {
  for (const l of listeners) l();
}

export const storeApi = {
  getState(): StoreState {
    return state;
  },
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  setSiswaList(list: Siswa[]) {
    state = { ...state, siswaList: list };
    persistState(state);
    emitChange();
  },
  setGuruList(list: Guru[]) {
    state = { ...state, guruList: list };
    persistState(state);
    emitChange();
  },
  setMapelList(list: Mapel[]) {
    state = { ...state, mapelList: list };
    persistState(state);
    emitChange();
  },
  setNilaiList(list: NilaiSiswa[]) {
    state = { ...state, nilaiList: list };
    persistState(state);
    emitChange();
  },
  setSekolah(patch: Partial<SekolahState>) {
    state = { ...state, sekolah: { ...state.sekolah, ...patch } };
    persistState(state);
    emitChange();
  },
  setUi(patch: Partial<UiState>) {
    state = { ...state, ui: { ...state.ui, ...patch } };
    persistState(state);
    emitChange();
  },
};

export function useStore(): AppStore {
  const snap = useSyncExternalStore(storeApi.subscribe, storeApi.getState, storeApi.getState);
  return {
    ...snap,
    setSiswaList: storeApi.setSiswaList,
    setGuruList: storeApi.setGuruList,
    setMapelList: storeApi.setMapelList,
    setNilaiList: storeApi.setNilaiList,
    setSekolah: storeApi.setSekolah,
    setUi: storeApi.setUi,
  };
}
