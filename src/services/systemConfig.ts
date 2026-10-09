export const APPS_SCRIPT_URL_KEY = 'phuho_lms_apps_script_url';
export const DEFAULT_APPS_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbx3p_wb8t8BWTx0ZqK6coG2icwx77N-cD4YfNoFVUd-n_yqO_BWVhCOdGmMoaCUvOSMjw/exec';
export const SHEET_ID_KEY = 'phuho_lms_connected_sheet_id';
export const SYSTEM_CONFIG_KEY = 'phuho_lms_system_connection_config';
export const DRIVE_FOLDER_ID_KEY = 'phuho_lms_drive_folder_id';
export const DRIVE_FOLDER_URL_KEY = 'phuho_lms_drive_folder_url';

export const getSavedSheetId = (): string => {
  try {
    const direct = localStorage.getItem(SHEET_ID_KEY);
    if (direct && direct.trim()) return direct.trim();
    const raw = localStorage.getItem(SYSTEM_CONFIG_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.sheetId && String(parsed.sheetId).trim()) {
        return String(parsed.sheetId).trim();
      }
    }
  } catch {
    // ignore
  }
  return '';
};

export const getSavedDriveFolderId = (): string => {
  try {
    const direct = localStorage.getItem(DRIVE_FOLDER_ID_KEY);
    if (direct && direct.trim()) return direct.trim();
    const raw = localStorage.getItem(SYSTEM_CONFIG_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.driveFolderId && String(parsed.driveFolderId).trim()) {
        return String(parsed.driveFolderId).trim();
      }
    }
  } catch {
    // ignore
  }
  return '';
};

export const getSavedDriveFolderUrl = (): string => {
  try {
    const direct = localStorage.getItem(DRIVE_FOLDER_URL_KEY);
    if (direct && direct.trim()) return direct.trim();
    const raw = localStorage.getItem(SYSTEM_CONFIG_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.driveFolderUrl && String(parsed.driveFolderUrl).trim()) {
        return String(parsed.driveFolderUrl).trim();
      }
    }
  } catch {
    // ignore
  }
  return 'https://drive.google.com/';
};

export const getAppsScriptUrl = (): string => {
  try {
    const local = localStorage.getItem(APPS_SCRIPT_URL_KEY);
    if (local && local.trim()) return local.trim();
    const raw = localStorage.getItem(SYSTEM_CONFIG_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.appsScriptUrl && String(parsed.appsScriptUrl).trim()) {
        return String(parsed.appsScriptUrl).trim();
      }
    }
  } catch {
    // ignore
  }
  const envScript = (import.meta as any).env?.VITE_APPS_SCRIPT_URL;
  if (envScript && envScript.trim()) return envScript.trim();
  const envAppUrl = (import.meta as any).env?.VITE_APP_URL || (import.meta as any).env?.APP_URL;
  if (envAppUrl && String(envAppUrl).includes('script.google.com')) return String(envAppUrl).trim();
  return DEFAULT_APPS_SCRIPT_URL;
};

export const saveAppsScriptUrl = (url: string): void => {
  try {
    localStorage.setItem(APPS_SCRIPT_URL_KEY, url.trim());
  } catch (e) {
    console.error('Error saving Apps Script URL:', e);
  }
};

export const extractSheetId = (input: string): string => {
  if (!input) return '';
  const trimmed = input.trim();
  const match = trimmed.match(/\/d\/([a-zA-Z0-9-_]+)/);
  if (match && match[1]) {
    return match[1];
  }
  return trimmed;
};

export interface SystemConnectionConfig {
  sheetId: string;
  sheetUrl?: string;
  appsScriptUrl: string;
  driveFolderId?: string;
  driveFolderUrl?: string;
  autoSyncEnabled: boolean;
  configuredByAdmin: boolean;
  lastConfiguredAt?: string;
  configuredByName?: string;
}
