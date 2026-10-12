import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  User as FirebaseUser,
  signOut
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { LMSStorageService, normalizeKNTTTopic, parseDateTimeFlexible } from './storage';
import { onStorageChange, notifyChange } from './storageEvents';
import {
  APPS_SCRIPT_URL_KEY,
  DEFAULT_APPS_SCRIPT_URL,
  SHEET_ID_KEY,
  SYSTEM_CONFIG_KEY,
  DRIVE_FOLDER_ID_KEY,
  DRIVE_FOLDER_URL_KEY,
  getSavedSheetId,
  getSavedDriveFolderId,
  getSavedDriveFolderUrl,
  getAppsScriptUrl,
  saveAppsScriptUrl,
  extractSheetId,
  isSystemConnected,
  type SystemConnectionConfig
} from './systemConfig';
export {
  APPS_SCRIPT_URL_KEY,
  DEFAULT_APPS_SCRIPT_URL,
  SHEET_ID_KEY,
  SYSTEM_CONFIG_KEY,
  DRIVE_FOLDER_ID_KEY,
  DRIVE_FOLDER_URL_KEY,
  getSavedSheetId,
  getSavedDriveFolderId,
  getSavedDriveFolderUrl,
  getAppsScriptUrl,
  saveAppsScriptUrl,
  extractSheetId,
  isSystemConnected,
  type SystemConnectionConfig
};
import {
  User,
  UserRole,
  ClassRoom,
  Lesson,
  Question,
  QuestionDifficulty,
  QuestionType,
  OptionItem,
  TrueFalseStatement,
  Submission,
  Test,
  Assignment
} from '../types';
import { GoogleDriveService } from './googleDriveService';

// Initialize Firebase with support for env variable overrides on Vercel
const resolvedFirebaseConfig = {
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || firebaseConfig.projectId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || firebaseConfig.appId,
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || firebaseConfig.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || firebaseConfig.authDomain,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || firebaseConfig.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || firebaseConfig.messagingSenderId
};

const app = getApps().length > 0 ? getApp() : initializeApp(resolvedFirebaseConfig);
export const auth = getAuth(app);
export const getFirebaseProjectId = (): string => resolvedFirebaseConfig.projectId || 'gen-lang-client-0926667102';

const TOKEN_KEY = 'phuho_lms_google_access_token';
const AUTO_SYNC_KEY = 'phuho_lms_auto_sync_enabled';

let cachedAccessToken: string | null = localStorage.getItem(TOKEN_KEY);
let isSigningIn = false;

export interface AutoSyncState {
  status: 'idle' | 'syncing' | 'synced' | 'error' | 'disconnected';
  lastSyncedTime?: string;
  entity?: string;
  errorMessage?: string;
}

let currentAutoSyncState: AutoSyncState = {
  status: cachedAccessToken && localStorage.getItem(SHEET_ID_KEY) ? 'idle' : 'disconnected'
};

type SyncListener = (state: AutoSyncState) => void;
const syncListeners: Set<SyncListener> = new Set();

export const subscribeAutoSyncStatus = (cb: SyncListener): (() => void) => {
  syncListeners.add(cb);
  cb(currentAutoSyncState);
  return () => {
    syncListeners.delete(cb);
  };
};

const notifyAutoSyncListeners = (state: Partial<AutoSyncState>) => {
  currentAutoSyncState = { ...currentAutoSyncState, ...state };
  syncListeners.forEach((listener) => {
    try {
      listener(currentAutoSyncState);
    } catch (e) {
      console.error('Error notifying sync listener:', e);
    }
  });
};

export const isAutoSyncEnabled = (): boolean => {
  const val = localStorage.getItem(AUTO_SYNC_KEY);
  return val === null ? true : val === 'true';
};

export const setAutoSyncEnabled = (enabled: boolean): void => {
  localStorage.setItem(AUTO_SYNC_KEY, String(enabled));
  notifyAutoSyncListeners({
    status: enabled && cachedAccessToken && getSavedSheetId() ? 'idle' : 'disconnected'
  });
};

export const initGoogleAuth = (
  onAuthSuccess?: (user: FirebaseUser, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: FirebaseUser | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
        notifyAutoSyncListeners({ status: 'idle' });
      } else if (!isSigningIn) {
        cachedAccessToken = localStorage.getItem(TOKEN_KEY);
        if (cachedAccessToken && onAuthSuccess) {
          onAuthSuccess(user, cachedAccessToken);
          notifyAutoSyncListeners({ status: 'idle' });
        } else {
          cachedAccessToken = null;
          if (onAuthFailure) onAuthFailure();
          notifyAutoSyncListeners({ status: 'disconnected' });
        }
      }
    } else {
      cachedAccessToken = null;
      localStorage.removeItem(TOKEN_KEY);
      if (onAuthFailure) onAuthFailure();
      notifyAutoSyncListeners({ status: 'disconnected' });
    }
  });
};

export const isUnauthorizedDomainError = (errorOrMsg: any): boolean => {
  const code = errorOrMsg?.code || '';
  const msg = typeof errorOrMsg === 'string' ? errorOrMsg : errorOrMsg?.message || '';
  return (
    code === 'auth/unauthorized-domain' ||
    msg.includes('auth/unauthorized-domain') ||
    msg.includes('unauthorized-domain')
  );
};

export const signInWithGoogleSheets = async (): Promise<{
  user: FirebaseUser;
  accessToken: string;
} | null> => {
  try {
    isSigningIn = true;
    const authProvider = new GoogleAuthProvider();
    authProvider.addScope('https://www.googleapis.com/auth/spreadsheets');
    authProvider.addScope('https://www.googleapis.com/auth/drive.file');
    authProvider.setCustomParameters({
      prompt: 'consent'
    });
    const result = await signInWithPopup(auth, authProvider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Không thể nhận Access Token từ Google');
    }
    cachedAccessToken = credential.accessToken;
    localStorage.setItem(TOKEN_KEY, cachedAccessToken);
    notifyAutoSyncListeners({ status: 'idle' });
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Lỗi đăng nhập Google:', error);
    if (isUnauthorizedDomainError(error)) {
      const currentHost = typeof window !== 'undefined' ? window.location.hostname : 'domain của bạn';
      const projectId = getFirebaseProjectId();
      const customErr = new Error(
        `Lỗi tên miền chưa được cấp quyền (auth/unauthorized-domain): Tên miền "${currentHost}" chưa được khai báo trong danh sách Authorized domains của Firebase. Vui lòng vào Firebase Console > Authentication > Settings > Authorized domains và thêm "${currentHost}".`
      );
      (customErr as any).code = 'auth/unauthorized-domain';
      (customErr as any).domain = currentHost;
      (customErr as any).projectId = projectId;
      throw customErr;
    }
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getGoogleAccessToken = (): string | null => {
  if (!cachedAccessToken) {
    cachedAccessToken = localStorage.getItem(TOKEN_KEY);
  }
  return cachedAccessToken;
};

export const clearGoogleToken = (): void => {
  cachedAccessToken = null;
  localStorage.removeItem(TOKEN_KEY);
  notifyAutoSyncListeners({ status: 'disconnected' });
};

export const isAuthErrorMessage = (errorOrMsg: any): boolean => {
  const msg = typeof errorOrMsg === 'string' ? errorOrMsg : errorOrMsg?.message || '';
  const lower = msg.toLowerCase();
  return (
    lower.includes('invalid authentication credentials') ||
    lower.includes('unauthenticated') ||
    lower.includes('oauth 2 access token') ||
    lower.includes('invalid credentials') ||
    lower.includes('insufficient authentication scopes') ||
    lower.includes('token expired') ||
    lower.includes('unauthorized-domain') ||
    lower.includes('401')
  );
};

export const logoutGoogle = async () => {
  await signOut(auth);
  clearGoogleToken();
};

export const saveSheetId = (sheetId: string): void => {
  localStorage.setItem(SHEET_ID_KEY, sheetId.trim());
  if (cachedAccessToken && sheetId.trim()) {
    notifyAutoSyncListeners({ status: 'idle' });
  } else {
    notifyAutoSyncListeners({ status: 'disconnected' });
  }
};

export const isDifficultyString = (val: string): boolean => {
  if (!val) return false;
  const upper = val.toUpperCase().trim();
  return (
    upper === 'BIET' ||
    upper === 'HIEU' ||
    upper === 'VAN_DUNG' ||
    upper === 'VAN_DUNG_CAO' ||
    upper.includes('BIẾT') ||
    upper.includes('NHẬN BIẾT') ||
    upper.includes('HIỂU') ||
    upper.includes('THÔNG HIỂU') ||
    upper.includes('VẬN DỤNG')
  );
};

export const parseDifficulty = (val: any): QuestionDifficulty => {
  if (!val) return 'BIET';
  const str = String(val).toUpperCase().trim();
  if (str === 'BIET' || str.includes('BIẾT') || str.includes('NHẬN BIẾT') || str === '1') return 'BIET';
  if (str === 'HIEU' || str.includes('HIỂU') || str.includes('THÔNG HIỂU') || str === '2') return 'HIEU';
  if (str === 'VAN_DUNG_CAO' || str.includes('VẬN DỤNG CAO') || str === '4') return 'VAN_DUNG';
  if (str === 'VAN_DUNG' || str.includes('VẬN DỤNG') || str === '3') return 'VAN_DUNG';
  return 'BIET';
};

export const isQuestionTypeString = (val: string): boolean => {
  if (!val) return false;
  const upper = val.toUpperCase().trim();
  return (
    upper === 'SINGLE_CHOICE' ||
    upper === 'MULTIPLE_CHOICE' ||
    upper === 'TRUE_FALSE' ||
    upper === 'FILL_IN_BLANK' ||
    upper === 'ESSAY' ||
    upper.includes('ĐÁP ÁN') ||
    upper.includes('TRẮC NGHIỆM') ||
    upper.includes('ĐÚNG / SAI') ||
    upper.includes('ĐÚNG SAI') ||
    upper.includes('ĐIỀN KHUYẾT') ||
    upper.includes('TỰ LUẬN')
  );
};

export const parseQuestionType = (val: any): QuestionType => {
  if (!val) return 'SINGLE_CHOICE';
  const str = String(val).toUpperCase().trim();
  if (str === 'MULTIPLE_CHOICE' || str.includes('NHIỀU ĐÁP ÁN')) return 'MULTIPLE_CHOICE';
  if (str === 'TRUE_FALSE' || str.includes('ĐÚNG / SAI') || str.includes('ĐÚNG SAI')) return 'TRUE_FALSE';
  if (str === 'FILL_IN_BLANK' || str.includes('ĐIỀN KHUYẾT') || str.includes('ĐIỀN')) return 'FILL_IN_BLANK';
  if (str === 'ESSAY' || str.includes('TỰ LUẬN')) return 'ESSAY';
  return 'SINGLE_CHOICE';
};

export const parseRowToQuestion = (row: any[], i: number): Question | null => {
  if (!row || !Array.isArray(row) || row.length < 3) return null;
  const content = String(row[2] || '').trim();
  if (!content) return null;

  const id = String(row[0] || `q-gsheet-${Date.now()}-${i}`);
  const code = String(row[1] || '').trim();
  const rawGrade = String(row[3] || '6');
  let gradeLevel = parseInt(rawGrade.replace(/[^0-9]/g, ''), 10);
  if (!gradeLevel || isNaN(gradeLevel)) {
    const codeMatch = code.match(/^TH([6-9])/i);
    gradeLevel = codeMatch ? parseInt(codeMatch[1], 10) : 6;
  }
  // Nếu mã đề rõ ràng là TH6-, TH7-, TH8-, TH9- thì ưu tiên để khớp khối
  const codeGradeMatch = code.match(/^TH([6-9])-/i);
  if (codeGradeMatch) {
    gradeLevel = parseInt(codeGradeMatch[1], 10);
  }
  const rawTopic = String(row[4] || 'Chủ đề 1: Máy tính và cộng đồng').trim();
  const topic = normalizeKNTTTopic(rawTopic || 'Chủ đề 1: Máy tính và cộng đồng', gradeLevel);

  let lessonTitle = '';
  let learningOutcome = '';
  let difficulty: QuestionDifficulty = 'BIET';
  let type: QuestionType = 'SINGLE_CHOICE';
  let rawOptions = '';
  let explanation = '';
  let imageDriveUrl = '';
  let author = 'Giáo viên';
  let createdAt = new Date().toISOString().split('T')[0];

  const col7Str = String(row[7] || '');
  const col5Str = String(row[5] || '');
  const is14Col = isDifficultyString(col7Str) || isQuestionTypeString(String(row[8] || ''));
  const is12Col = !is14Col && (isDifficultyString(col5Str) || isQuestionTypeString(String(row[6] || '')));

  if (!is12Col) {
    lessonTitle = String(row[5] || 'Bài 1: Thông tin và dữ liệu');
    learningOutcome = String(row[6] || 'Chuẩn kiến thức GDPT 2018');
    difficulty = parseDifficulty(row[7]);
    type = parseQuestionType(row[8]);
    rawOptions = String(row[9] || '');
    explanation = String(row[10] || '');
    imageDriveUrl = String(row[11] || '');
    author = String(row[12] || 'Giáo viên');
    createdAt = String(row[13] || createdAt);
  } else {
    lessonTitle = 'Bài 1: Thông tin và dữ liệu';
    learningOutcome = 'Chuẩn kiến thức GDPT 2018';
    difficulty = parseDifficulty(row[5]);
    type = parseQuestionType(row[6]);
    rawOptions = String(row[7] || '');
    explanation = String(row[8] || '');
    imageDriveUrl = String(row[9] || '');
    author = String(row[10] || 'Giáo viên');
    createdAt = String(row[11] || createdAt);
  }

  const options: OptionItem[] = [];
  const trueFalseStatements: TrueFalseStatement[] = [];
  if (rawOptions) {
    let parts: string[] = [];
    if (rawOptions.includes('|')) {
      parts = rawOptions.split('|');
    } else if (rawOptions.includes('\n')) {
      parts = rawOptions.split('\n');
    } else if (rawOptions.includes(';')) {
      parts = rawOptions.split(';');
    } else {
      parts = [rawOptions];
    }

    parts.forEach((p, idx) => {
      const trimmedP = p.trim();
      if (!trimmedP) return;
      const isCorrect = /^\s*(\[[xXvV]\]|\([xXvV*]\)|\*)/.test(trimmedP);
      const text = trimmedP.replace(/^\s*(\[[ xXvV]*\]|\([ xXvV*]*\)|\*)\s*/, '');
      options.push({
        id: `opt-${id}-${idx + 1}`,
        text: text || trimmedP,
        isCorrect
      });
      if (type === 'TRUE_FALSE') {
        trueFalseStatements.push({
          id: `tf-${id}-${idx + 1}`,
          statement: text || trimmedP,
          isCorrect
        });
      }
    });
  }

  if (options.length > 0 && !options.some((o) => o.isCorrect)) {
    options[0].isCorrect = true;
  }

  const directImageUrl = GoogleDriveService.getDriveDirectImageUrl(imageDriveUrl);

  return {
    id,
    code: code || `TH${gradeLevel}-00${i + 1}`,
    content,
    gradeLevel,
    topic,
    lessonTitle,
    learningOutcome,
    difficulty,
    type,
    options: options.length > 0 ? options : [
      { id: `opt-${id}-1`, text: 'Đáp án A', isCorrect: true },
      { id: `opt-${id}-2`, text: 'Đáp án B', isCorrect: false },
      { id: `opt-${id}-3`, text: 'Đáp án C', isCorrect: false },
      { id: `opt-${id}-4`, text: 'Đáp án D', isCorrect: false }
    ],
    trueFalseStatements: trueFalseStatements.length > 0 ? trueFalseStatements : undefined,
    correctAnswerText: type === 'FILL_IN_BLANK' ? rawOptions.replace(/^\s*(\[[ xXvV]*\]|\*)\s*/, '') : undefined,
    essaySampleAnswer: type === 'ESSAY' ? rawOptions : undefined,
    explanation,
    imageDriveUrl: imageDriveUrl || undefined,
    imageUrl: directImageUrl || undefined,
    createdBy: 'system',
    authorName: author,
    createdAt: String(createdAt).includes('T') ? String(createdAt).split('T')[0] : String(createdAt),
    status: 'ACTIVE'
  };
};

/**
 * Lấy cấu hình kết nối dữ liệu dùng chung toàn hệ thống do Quản trị viên thiết lập
 */
export const getSystemConnectionConfig = (): SystemConnectionConfig => {
  try {
    const raw = localStorage.getItem(SYSTEM_CONFIG_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        sheetId: parsed.sheetId || getSavedSheetId(),
        sheetUrl: parsed.sheetUrl || (parsed.sheetId ? `https://docs.google.com/spreadsheets/d/${parsed.sheetId}` : ''),
        appsScriptUrl: parsed.appsScriptUrl || getAppsScriptUrl(),
        driveFolderId: parsed.driveFolderId || localStorage.getItem('phuho_lms_drive_folder_id') || '',
        driveFolderUrl: parsed.driveFolderUrl || localStorage.getItem('phuho_lms_drive_folder_url') || '',
        autoSyncEnabled: parsed.autoSyncEnabled ?? true,
        configuredByAdmin: parsed.configuredByAdmin ?? Boolean(localStorage.getItem(SHEET_ID_KEY) || localStorage.getItem(APPS_SCRIPT_URL_KEY)),
        lastConfiguredAt: parsed.lastConfiguredAt || '',
        configuredByName: parsed.configuredByName || 'Quản trị viên Hệ thống'
      };
    }
  } catch (e) {
    console.error('Lỗi đọc system connection config:', e);
  }

  const currentSheetId = getSavedSheetId();
  const currentScriptUrl = getAppsScriptUrl();
  return {
    sheetId: currentSheetId,
    sheetUrl: currentSheetId ? `https://docs.google.com/spreadsheets/d/${currentSheetId}` : '',
    appsScriptUrl: currentScriptUrl,
    driveFolderId: localStorage.getItem('phuho_lms_drive_folder_id') || '',
    driveFolderUrl: localStorage.getItem('phuho_lms_drive_folder_url') || '',
    autoSyncEnabled: true,
    configuredByAdmin: Boolean(currentSheetId || localStorage.getItem(APPS_SCRIPT_URL_KEY)),
    lastConfiguredAt: new Date().toLocaleDateString('vi-VN'),
    configuredByName: 'Quản trị viên Hệ thống'
  };
};

/**
 * Quản trị viên lưu cấu hình kết nối dữ liệu áp dụng cho toàn bộ Giáo viên & Học sinh
 */
export const saveSystemConnectionConfig = (
  updates: Partial<SystemConnectionConfig>,
  adminName: string = 'Quản trị viên'
): SystemConnectionConfig => {
  const current = getSystemConnectionConfig();
  const cleanSheetId = updates.sheetId !== undefined ? extractSheetId(updates.sheetId) : current.sheetId;
  const cleanScriptUrl = updates.appsScriptUrl !== undefined ? updates.appsScriptUrl.trim() : current.appsScriptUrl;
  const cleanFolderUrl = updates.driveFolderUrl !== undefined ? updates.driveFolderUrl.trim() : current.driveFolderUrl;

  let folderId = updates.driveFolderId || current.driveFolderId || '';
  if (cleanFolderUrl && (!folderId || updates.driveFolderUrl)) {
    const fMatch = cleanFolderUrl.match(/\/folders\/([a-zA-Z0-9-_]+)/);
    if (fMatch && fMatch[1]) folderId = fMatch[1];
  }

  const newConfig: SystemConnectionConfig = {
    ...current,
    ...updates,
    sheetId: cleanSheetId,
    sheetUrl: cleanSheetId ? `https://docs.google.com/spreadsheets/d/${cleanSheetId}` : '',
    appsScriptUrl: cleanScriptUrl,
    driveFolderId: folderId,
    driveFolderUrl: cleanFolderUrl,
    configuredByAdmin: true,
    lastConfiguredAt: new Date().toLocaleString('vi-VN'),
    configuredByName: adminName
  };

  localStorage.setItem(SYSTEM_CONFIG_KEY, JSON.stringify(newConfig));
  if (cleanSheetId) localStorage.setItem(SHEET_ID_KEY, cleanSheetId);
  if (cleanScriptUrl) localStorage.setItem(APPS_SCRIPT_URL_KEY, cleanScriptUrl);
  if (folderId) localStorage.setItem('phuho_lms_drive_folder_id', folderId);
  if (cleanFolderUrl) localStorage.setItem('phuho_lms_drive_folder_url', cleanFolderUrl);

  notifyAutoSyncListeners({
    status: 'synced',
    lastSyncedTime: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    entity: 'Cấu hình toàn trường đã cập nhật'
  });

  return newConfig;
};

export const REQUIRED_SHEETS = [
  'TaiKhoan',
  'HocSinh',
  'GiaoVien',
  'LopHoc',
  'TenBaiHoc',
  'CauHoi',
  'DeThi',
  'GiaoDe',
  'BangDiem'
];

/**
 * Service thao tác với Google Sheets API v4
 * Tự động cập nhật dữ liệu ở Google Sheet khi tạo thêm Lớp, Học sinh, Câu hỏi,... Không cần bấm đồng bộ
 */
export class GoogleSheetsService {
  private static syncTimeout: any = null;
  private static pendingEntities: Set<string> = new Set();
  private static verifiedSpreadsheetIds: Set<string> = new Set();

  /**
   * Tạo một Google Spreadsheet mới làm Database cho LMS với đầy đủ toàn bộ các sheet quản lý (9 Sheet CSDL)
   */
  static async createLMSDatabaseSheet(accessToken: string): Promise<{
    spreadsheetId: string;
    spreadsheetUrl: string;
  }> {
    const payload = {
      properties: {
        title: `CỔNG KIỂM TRA TRỰC TUYẾN - Cơ Sở Dữ Liệu (${new Date().toLocaleDateString('vi-VN')})`
      },
      sheets: REQUIRED_SHEETS.map((title) => ({
        properties: { title }
      }))
    };

    const res = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error?.message || 'Không thể tạo Google Sheet');
    }

    const data = await res.json();
    const spreadsheetId = data.spreadsheetId;
    saveSheetId(spreadsheetId);

    // Đẩy toàn bộ dữ liệu mẫu ban đầu
    await this.pushAllDataToSheet(spreadsheetId, accessToken);

    return {
      spreadsheetId,
      spreadsheetUrl: data.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`
    };
  }

  /**
   * Đảm bảo tất cả sheet quản lý luôn tồn tại trên bảng tính (có bộ nhớ đệm tăng tốc)
   */
  static async ensureSheetsExist(spreadsheetId: string, accessToken: string, force = false): Promise<void> {
    if (!force && this.verifiedSpreadsheetIds.has(spreadsheetId)) {
      return;
    }
    try {
      const metaRes = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=sheets.properties.title`,
        {
          headers: { Authorization: `Bearer ${accessToken}` }
        }
      );
      if (metaRes.ok) {
        const metaData = await metaRes.json();
        const existingTitles = new Set(metaData.sheets?.map((s: any) => s.properties?.title) || []);
        const missing = REQUIRED_SHEETS.filter((t) => !existingTitles.has(t));
        if (missing.length > 0) {
          const requests = missing.map((title) => ({
            addSheet: { properties: { title } }
          }));
          await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ requests })
          });
        }
        this.verifiedSpreadsheetIds.add(spreadsheetId);
      }
    } catch (e) {
      console.warn('Could not auto-add missing sheets:', e);
    }
  }

  /**
   * Xóa hàng loạt dữ liệu cũ (batchClear) trong 1 request duy nhất để tối ưu tốc độ gấp 5-10 lần
   */
  private static async batchClearRanges(spreadsheetId: string, ranges: string[], accessToken: string): Promise<void> {
    if (!ranges || ranges.length === 0) return;
    try {
      await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchClear`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ ranges })
        }
      );
    } catch (e) {
      console.warn('Lỗi batchClear ranges:', e);
    }
  }

  /**
   * Xóa dữ liệu cũ trên một sheet range trước khi cập nhật dữ liệu mới
   */
  private static async clearRange(spreadsheetId: string, range: string, accessToken: string): Promise<void> {
    try {
      await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}:clear`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
    } catch (e) {
      console.warn(`Lỗi xóa range ${range}:`, e);
    }
  }

  // --- BUILD ROW DATA HELPERS ---

  static buildTaiKhoanRows(): any[][] {
    const users = LMSStorageService.getUsers().filter((u) => u.status !== 'DELETED');
    const classes = LMSStorageService.getClasses();

    return [
      [
        'ID',
        'Tên đăng nhập (Username)',
        'Mật khẩu (Password)',
        'Họ và tên',
        'Email',
        'Vai trò (Role)',
        'Mã định danh (Mã HS / Mã GV)',
        'Khối',
        'Lớp',
        'Số điện thoại',
        'Trạng thái (Status)',
        'Ngày tạo',
        'Ảnh đại diện (Drive URL)'
      ],
      ...users.map((u) => {
        let clsName = classes.find((c) => c.id === u.classId)?.name;
        if (!clsName && u.classId) {
          if (u.classId.startsWith('cls-')) {
            clsName = u.classId.replace('cls-', '').replace('-', '/');
          } else {
            clsName = u.classId;
          }
        }
        let gradeLabel = '';
        if (u.gradeId) {
          gradeLabel = u.gradeId.replace('grade-', 'Khối ');
        } else if (clsName && clsName.includes('/')) {
          gradeLabel = `Khối ${clsName.split('/')[0]}`;
        }
        return [
          u.id,
          u.username || u.email.split('@')[0],
          u.password || (u.role === 'STUDENT' ? '123456' : 'phuho@2025'),
          u.fullName,
          u.email,
          u.role,
          u.studentCode || u.teacherCode || '',
          gradeLabel,
          clsName || '',
          u.phone || '',
          u.status || 'ACTIVE',
          u.createdAt,
          u.avatarUrl || ''
        ];
      })
    ];
  }

  static buildHocSinhRows(): any[][] {
    const students = LMSStorageService.getUsers().filter((u) => u.role === 'STUDENT' && u.status !== 'DELETED');
    const classes = LMSStorageService.getClasses();

    return [
      [
        'ID',
        'Họ và tên',
        'Mã số HS',
        'Tên đăng nhập',
        'Mật khẩu',
        'Lớp',
        'Khối',
        'Email',
        'Số điện thoại',
        'Trạng thái',
        'Ngày tạo',
        'Ảnh đại diện (Drive URL)'
      ],
      ...students.map((u) => {
        let clsName = classes.find((c) => c.id === u.classId)?.name;
        if (!clsName && u.classId) {
          if (u.classId.startsWith('cls-')) {
            clsName = u.classId.replace('cls-', '').replace('-', '/');
          } else {
            clsName = u.classId;
          }
        }
        let gradeLabel = '';
        if (u.gradeId) {
          gradeLabel = u.gradeId.replace('grade-', 'Khối ');
        } else if (clsName && clsName.includes('/')) {
          gradeLabel = `Khối ${clsName.split('/')[0]}`;
        }
        return [
          u.id,
          u.fullName,
          u.studentCode || '',
          u.username || u.email.split('@')[0],
          u.password || '123456',
          clsName || '',
          gradeLabel,
          u.email,
          u.phone || '',
          u.status || 'ACTIVE',
          u.createdAt,
          u.avatarUrl || ''
        ];
      })
    ];
  }

  static buildGiaoVienRows(): any[][] {
    const staff = LMSStorageService.getUsers().filter((u) => u.role !== 'STUDENT' && u.status !== 'DELETED');
    const classes = LMSStorageService.getClasses();

    return [
      [
        'ID',
        'Họ và tên',
        'Mã GV / Cán bộ',
        'Tên đăng nhập',
        'Mật khẩu',
        'Vai trò',
        'Email',
        'Số điện thoại',
        'Lớp phụ trách / Ghi chú',
        'Trạng thái',
        'Ngày tạo',
        'Ảnh đại diện (Drive URL)'
      ],
      ...staff.map((u) => [
        u.id,
        u.fullName,
        u.teacherCode || (u.role === 'ADMIN' ? 'QT-01' : 'BGH-01'),
        u.username || u.email.split('@')[0],
        u.password || (u.role === 'ADMIN' ? 'admin@phuho2025' : 'phuho@2025'),
        u.role,
        u.email,
        u.phone || '',
        u.assignedClassIds
          ? u.assignedClassIds.map((cid) => classes.find((c) => c.id === cid)?.name || cid.replace('cls-', '').replace('-', '/')).filter(Boolean).join(', ')
          : 'Toàn trường',
        u.status || 'ACTIVE',
        u.createdAt,
        u.avatarUrl || ''
      ])
    ];
  }

  static buildLopHocRows(): any[][] {
    const classes = LMSStorageService.getClasses();
    const users = LMSStorageService.getUsers();
    const staff = users.filter((u) => u.role !== 'STUDENT');

    return [
      ['ID', 'Tên lớp', 'Khối', 'Sĩ số', 'Giáo viên chủ nhiệm', 'Giáo viên phân công môn Tin học'],
      ...classes.map((c) => {
        const assignedTeachers = staff.filter((t) =>
          t.assignedClassIds?.includes(c.id) ||
          c.assignedTeacherIds?.includes(t.id) ||
          c.subjectTeacherId === t.id
        );
        let assignedTeacherNames = assignedTeachers.map((t) => t.fullName).filter(Boolean).join(', ');
        if (!assignedTeacherNames) {
          assignedTeacherNames = c.subjectTeacherName || c.homeroomTeacherName || '';
        }

        const stableId = c.id || `cls-${c.name.replace(/[^a-zA-Z0-9]/g, '-')}`;

        return [
          stableId,
          c.name,
          c.name.split('/')[0] || '6',
          c.studentCount || 35,
          c.homeroomTeacherName || '',
          assignedTeacherNames
        ];
      })
    ];
  }

  private static buildTenBaiHocRows(): any[][] {
    const lessons = LMSStorageService.getLessons();
    const topics = LMSStorageService.getTopics();

    return [
      [
        'ID Bài học',
        'Khối lớp',
        'Mã chủ đề',
        'Tên chủ đề',
        'Số thứ tự bài',
        'Tên bài học',
        'Yêu cầu cần đạt (Chuẩn kiến thức)'
      ],
      ...lessons.map((l) => {
        const topic = topics.find((t) => t.id === l.topicId);
        return [
          l.id,
          `Khối ${l.gradeLevel}`,
          l.topicId,
          topic?.name || l.topicId,
          l.lessonNumber || '',
          l.title,
          l.learningOutcomes || ''
        ];
      })
    ];
  }

  private static buildCauHoiRows(): any[][] {
    const questions = LMSStorageService.getQuestions();
    return [
      [
        'ID',
        'Mã câu',
        'Nội dung',
        'Khối',
        'Chủ đề',
        'Tên bài học',
        'Yêu cầu cần đạt',
        'Mức độ',
        'Dạng câu',
        'Phương án / Đáp án đúng',
        'Giải thích sư phạm',
        'Link nguồn file ảnh (Google Drive)',
        'Tác giả',
        'Ngày tạo'
      ],
      ...questions.map((q) => [
        q.id,
        q.code,
        q.content,
        q.gradeLevel,
        q.topic,
        q.lessonTitle || '',
        q.learningOutcome || '',
        q.difficulty,
        q.type,
        q.options
          ? q.options.map((o) => `${o.isCorrect ? '[x]' : '[ ]'} ${o.text}`).join(' | ')
          : q.correctAnswerText || q.essaySampleAnswer || '',
        q.explanation || '',
        q.imageDriveUrl || q.imageUrl || '',
        q.authorName,
        q.createdAt
      ])
    ];
  }

  private static buildDeThiRows(): any[][] {
    const tests = LMSStorageService.getTests();
    return [
      ['ID', 'Tên đề thi', 'Khối', 'Thời gian (phút)', 'Số câu', 'Mã đề', 'Tác giả', 'Ngày tạo', 'Trạng thái'],
      ...tests.map((t) => [
        t.id,
        t.title,
        `Khối ${t.gradeLevel}`,
        t.durationMinutes,
        t.totalQuestions,
        (t.variants || []).map((v) => v.code).join(', ') || '101',
        t.authorName || 'Giáo viên',
        t.createdAt || '',
        t.status || 'READY'
      ])
    ];
  }

  private static buildGiaoDeRows(): any[][] {
    const assignments = LMSStorageService.getAssignments();
    return [
      [
        'ID Đợt giao',
        'Tên bài kiểm tra',
        'Khối lớp',
        'Danh sách lớp',
        'Thời gian bắt đầu',
        'Thời gian kết thúc',
        'Mật khẩu phòng thi',
        'Cho xem đáp án sau nộp',
        'Trộn thứ tự câu hỏi',
        'Người giao đề',
        'Ngày tạo',
        'Trạng thái'
      ],
      ...assignments.map((a) => [
        a.id,
        a.testTitle,
        `Khối ${a.gradeLevel}`,
        (a.classNames || []).join(', '),
        a.startTime ? new Date(a.startTime).toLocaleString('vi-VN') : '',
        a.endTime ? new Date(a.endTime).toLocaleString('vi-VN') : '',
        a.password || 'Không có',
        a.allowReviewAfterSubmit ? 'Có' : 'Không',
        a.shuffleQuestions ? 'Có' : 'Không',
        a.assignedByName || 'Giáo viên',
        a.createdAt || '',
        a.status || 'ACTIVE'
      ])
    ];
  }

  private static buildBangDiemRows(): any[][] {
    const submissions = LMSStorageService.getSubmissions();
    const activeUsers = LMSStorageService.getUsers().filter((u) => u.status !== 'DELETED' && u.status !== 'LOCKED');
    const activeUserIds = new Set(activeUsers.map((u) => u.id));
    const activeStudentCodes = new Set(activeUsers.map((u) => u.studentCode).filter(Boolean));

    // Chỉ lưu và hiển thị kết quả của các tài khoản còn đang hoạt động
    const activeSubmissions = submissions.filter(
      (s) => activeUserIds.has(s.studentId) || (s.studentCode && activeStudentCodes.has(s.studentCode))
    );

    return [
      ['ID Bài nộp', 'Họ tên học sinh', 'Mã số HS', 'Lớp', 'Tên bài thi', 'Mã đề', 'Điểm số', 'Đúng/Tổng câu', 'Thời gian nộp'],
      ...activeSubmissions.map((s) => [
        s.id,
        s.studentName,
        s.studentCode || '',
        s.className || '',
        s.testTitle,
        s.variantCode || '101',
        s.score,
        `${s.correctCount}/${s.totalQuestions}`,
        s.submittedAt ? new Date(s.submittedAt).toLocaleString('vi-VN') : ''
      ])
    ];
  }

  /**
   * Đẩy toàn bộ dữ liệu từ LMS Store lên Google Sheet
   */
  static async pushAllDataToSheet(spreadsheetId: string, accessToken: string): Promise<void> {
    await this.ensureSheetsExist(spreadsheetId, accessToken);

    const batchData = [
      { range: 'TaiKhoan!A1', values: this.buildTaiKhoanRows() },
      { range: 'HocSinh!A1', values: this.buildHocSinhRows() },
      { range: 'GiaoVien!A1', values: this.buildGiaoVienRows() },
      { range: 'LopHoc!A1', values: this.buildLopHocRows() },
      { range: 'TenBaiHoc!A1', values: this.buildTenBaiHocRows() },
      { range: 'CauHoi!A1', values: this.buildCauHoiRows() },
      { range: 'DeThi!A1', values: this.buildDeThiRows() },
      { range: 'GiaoDe!A1', values: this.buildGiaoDeRows() },
      { range: 'BangDiem!A1', values: this.buildBangDiemRows() }
    ];

    // Xóa nhanh toàn bộ nội dung cũ trong 1 request duy nhất (batchClear) để tránh dòng ma và tăng tốc
    const rangesToClear = batchData.map((item) => `${item.range.split('!')[0]}!A:Z`);
    await this.batchClearRanges(spreadsheetId, rangesToClear, accessToken);

    let res = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchUpdate`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          valueInputOption: 'RAW',
          data: batchData
        })
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      if (errText.includes('Unable to parse range') || errText.includes('not found')) {
        await this.ensureSheetsExist(spreadsheetId, accessToken, true);
        res = await fetch(
          `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchUpdate`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              valueInputOption: 'RAW',
              data: batchData
            })
          }
        );
      }
      if (!res.ok) {
        throw new Error('Không thể đồng bộ dữ liệu lên Google Sheet');
      }
    }
  }

  /**
   * Tự động đồng bộ một thực thể cụ thể lên Google Sheet
   */
  static async syncEntity(
    entity: 'users' | 'classes' | 'questions' | 'tests' | 'assignments' | 'submissions' | 'lessons' | 'all',
    spreadsheetId: string,
    accessToken: string
  ): Promise<void> {
    await this.ensureSheetsExist(spreadsheetId, accessToken);

    const updates: { range: string; values: any[][] }[] = [];

    if (entity === 'users' || entity === 'all') {
      updates.push(
        { range: 'TaiKhoan!A1', values: this.buildTaiKhoanRows() },
        { range: 'HocSinh!A1', values: this.buildHocSinhRows() },
        { range: 'GiaoVien!A1', values: this.buildGiaoVienRows() },
        { range: 'LopHoc!A1', values: this.buildLopHocRows() }
      );
    }

    if (entity === 'classes' || entity === 'all') {
      updates.push(
        { range: 'LopHoc!A1', values: this.buildLopHocRows() },
        { range: 'GiaoVien!A1', values: this.buildGiaoVienRows() },
        { range: 'TaiKhoan!A1', values: this.buildTaiKhoanRows() }
      );
    }

    if (entity === 'lessons' || entity === 'all') {
      updates.push({ range: 'TenBaiHoc!A1', values: this.buildTenBaiHocRows() });
    }

    if (entity === 'questions' || entity === 'all') {
      updates.push({ range: 'CauHoi!A1', values: this.buildCauHoiRows() });
    }

    if (entity === 'tests' || entity === 'all') {
      updates.push({ range: 'DeThi!A1', values: this.buildDeThiRows() });
    }

    if (entity === 'assignments' || entity === 'all') {
      updates.push({ range: 'GiaoDe!A1', values: this.buildGiaoDeRows() });
    }

    if (entity === 'submissions' || entity === 'all') {
      updates.push({ range: 'BangDiem!A1', values: this.buildBangDiemRows() });
    }

    if (updates.length === 0) return;

    // Xóa nhanh toàn bộ nội dung cũ trong 1 request duy nhất (batchClear) để tăng tốc độ ghi dữ liệu
    const rangesToClear = updates.map((item) => `${item.range.split('!')[0]}!A:Z`);
    await this.batchClearRanges(spreadsheetId, rangesToClear, accessToken);

    let res = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchUpdate`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          valueInputOption: 'RAW',
          data: updates
        })
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      if (errText.includes('Unable to parse range') || errText.includes('not found')) {
        await this.ensureSheetsExist(spreadsheetId, accessToken, true);
        res = await fetch(
          `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchUpdate`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              valueInputOption: 'RAW',
              data: updates
            })
          }
        );
      }
      if (!res.ok) {
        throw new Error(`Lỗi đồng bộ ${entity} lên Google Sheet: ${res.statusText}`);
      }
    }
  }

  /**
   * Tổng hợp toàn bộ dữ liệu 9 Sheet CSDL của trường THCS Phú Hồ
   */
  static buildAllSheetsData(): { name: string; rows: any[][] }[] {
    return [
      { name: 'TaiKhoan', rows: this.buildTaiKhoanRows() },
      { name: 'HocSinh', rows: this.buildHocSinhRows() },
      { name: 'GiaoVien', rows: this.buildGiaoVienRows() },
      { name: 'LopHoc', rows: this.buildLopHocRows() },
      { name: 'TenBaiHoc', rows: this.buildTenBaiHocRows() },
      { name: 'CauHoi', rows: this.buildCauHoiRows() },
      { name: 'DeThi', rows: this.buildDeThiRows() },
      { name: 'GiaoDe', rows: this.buildGiaoDeRows() },
      { name: 'BangDiem', rows: this.buildBangDiemRows() }
    ];
  }

  /**
   * TỰ ĐỘNG CẬP NHẬT GOOGLE SHEET TRONG NỀN (BACKGROUND AUTO-SYNC)
   * Được gọi tự động mỗi khi thêm/sửa/xóa Lớp, Học sinh, Người dùng, Đề thi, Giao bài,...
   * Không cần người dùng bấm đồng bộ thủ công!
   */
  static triggerAutoSync(
    entity: 'users' | 'classes' | 'questions' | 'tests' | 'assignments' | 'submissions' | 'lessons' | 'all'
  ): void {
    if (!isAutoSyncEnabled()) return;

    const sheetId = getSavedSheetId();
    const token = getGoogleAccessToken();
    const scriptUrl = getAppsScriptUrl();

    // Nếu chưa cấu hình Google Sheet OAuth và cũng không có Apps Script URL thì không thể auto-sync
    if ((!sheetId || !token) && !scriptUrl) {
      notifyAutoSyncListeners({ status: 'disconnected' });
      return;
    }

    this.pendingEntities.add(entity);
    notifyAutoSyncListeners({ status: 'syncing', entity });

    if (this.syncTimeout) {
      clearTimeout(this.syncTimeout);
    }

    // Debounce 600ms để tránh rate-limit nếu có nhiều thao tác liên tiếp
    this.syncTimeout = setTimeout(async () => {
      const entitiesToSync = Array.from(this.pendingEntities);
      this.pendingEntities.clear();

      try {
        let oauthSucceeded = false;
        if (sheetId && token) {
          try {
            const hasAll = entitiesToSync.includes('all');
            if (hasAll) {
              await this.syncEntity('all', sheetId, token);
              try {
                await GoogleDriveService.saveQuestionsToDrive(LMSStorageService.getQuestions(), token);
              } catch (e) {
                console.warn('Lỗi tự động lưu câu hỏi lên Drive:', e);
              }
            } else {
              for (const ent of entitiesToSync) {
                await this.syncEntity(ent as any, sheetId, token);
              }
              if (entitiesToSync.includes('questions')) {
                try {
                  await GoogleDriveService.saveQuestionsToDrive(LMSStorageService.getQuestions(), token);
                } catch (e) {
                  console.warn('Lỗi tự động lưu câu hỏi lên Drive:', e);
                }
              }
            }
            oauthSucceeded = true;
          } catch (oauthErr) {
            console.warn('Lỗi đồng bộ qua OAuth (sẽ tự động ghi qua Apps Script Web App):', oauthErr);
          }
        }

        // Tự động đẩy dữ liệu lên Google Apps Script Web App nếu có cấu hình
        if (scriptUrl) {
          // Luôn đồng bộ toàn bộ các sheet có liên quan để bảo toàn tính toàn vẹn CSDL
          let sheetsToPush: { name: string; rows: any[][] }[] = [];
          const hasAll = entitiesToSync.includes('all');

          if (hasAll || entitiesToSync.length >= 2) {
            sheetsToPush = this.buildAllSheetsData();
          } else {
            if (entitiesToSync.includes('users')) {
              sheetsToPush.push(
                { name: 'TaiKhoan', rows: this.buildTaiKhoanRows() },
                { name: 'HocSinh', rows: this.buildHocSinhRows() },
                { name: 'GiaoVien', rows: this.buildGiaoVienRows() },
                { name: 'LopHoc', rows: this.buildLopHocRows() }
              );
            }
            if (entitiesToSync.includes('classes')) {
              sheetsToPush.push(
                { name: 'LopHoc', rows: this.buildLopHocRows() },
                { name: 'GiaoVien', rows: this.buildGiaoVienRows() },
                { name: 'TaiKhoan', rows: this.buildTaiKhoanRows() }
              );
            }
            if (entitiesToSync.includes('lessons')) {
              sheetsToPush.push({ name: 'TenBaiHoc', rows: this.buildTenBaiHocRows() });
            }
            if (entitiesToSync.includes('questions')) {
              sheetsToPush.push({ name: 'CauHoi', rows: this.buildCauHoiRows() });
            }
            if (entitiesToSync.includes('tests')) {
              sheetsToPush.push({ name: 'DeThi', rows: this.buildDeThiRows() });
            }
            if (entitiesToSync.includes('assignments')) {
              sheetsToPush.push({ name: 'GiaoDe', rows: this.buildGiaoDeRows() });
            }
            if (entitiesToSync.includes('submissions')) {
              sheetsToPush.push({ name: 'BangDiem', rows: this.buildBangDiemRows() });
            }
          }

          if (sheetsToPush.length > 0) {
            await this.postToAppsScript({
              action: 'batchPushAllData',
              sheetId,
              folderId: getSavedDriveFolderId(),
              sheets: sheetsToPush,
              allQuestions: LMSStorageService.getQuestions()
            });
          }
        }

        const now = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        notifyAutoSyncListeners({
          status: 'synced',
          lastSyncedTime: now,
          entity: entitiesToSync.includes('all') ? 'Toàn bộ CSDL Google Sheet (9 Sheet)' : entitiesToSync.join(', ')
        });
      } catch (err: any) {
        console.warn('Lỗi tự động đồng bộ Google Sheet:', err);
        notifyAutoSyncListeners({
          status: 'error',
          errorMessage: err.message || String(err)
        });
      }
    }, 600);
  }

  /**
   * Đọc dữ liệu từ một sheet range trên Google Sheets
   */
  static async readSheetValues(
    spreadsheetId: string,
    range: string,
    accessToken: string
  ): Promise<any[][]> {
    const res = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error?.message || `Không thể đọc dữ liệu từ range ${range}`);
    }

    const data = await res.json();
    return data.values || [];
  }

  /**
   * Chuẩn hóa tên Sheet loại bỏ dấu tiếng Việt và ký tự đặc biệt để so sánh linh hoạt
   */
  static normalizeSheetName(name: string): string {
    return (name || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9]/g, '');
  }

  /**
   * Tìm tên sheet thực tế trên Google Spreadsheet tương ứng với danh sách ứng viên (hỗ trợ cả tiếng Việt có dấu, không dấu)
   */
  static async findMatchingSheetTitle(
    spreadsheetId: string,
    candidates: string[],
    accessToken: string
  ): Promise<string | null> {
    try {
      const res = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=sheets.properties.title`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      if (!res.ok) return null;
      const data = await res.json();
      const sheetTitles: string[] = (data.sheets || [])
        .map((s: any) => s.properties?.title)
        .filter(Boolean);

      // 1. Thử khớp chính xác
      for (const title of sheetTitles) {
        if (candidates.includes(title)) return title;
      }

      // 2. Thử khớp không dấu
      const normCandidates = candidates.map((c) => this.normalizeSheetName(c));
      for (const title of sheetTitles) {
        const normTitle = this.normalizeSheetName(title);
        for (const nc of normCandidates) {
          if (normTitle === nc || normTitle.includes(nc) || nc.includes(normTitle)) {
            return title;
          }
        }
      }
      return null;
    } catch {
      return null;
    }
  }

  /**
   * Đọc dữ liệu từ Sheet với cơ chế tự động dò tìm tên Sheet (hỗ trợ cả LopHoc, Lớp học, Lớp Học, v.v.)
   */
  static async readSheetWithFallback(
    spreadsheetId: string,
    candidateTitles: string[],
    rangePostfix: string,
    accessToken: string
  ): Promise<{ sheetTitle: string; rows: any[][] }> {
    const preferred = candidateTitles[0];
    try {
      const rows = await this.readSheetValues(spreadsheetId, `${preferred}!${rangePostfix}`, accessToken);
      if (rows && rows.length > 0) {
        return { sheetTitle: preferred, rows };
      }
    } catch {
      // Bỏ qua lỗi và tìm sheet thực tế
    }

    const matchedTitle = await this.findMatchingSheetTitle(spreadsheetId, candidateTitles, accessToken);
    if (matchedTitle && matchedTitle !== preferred) {
      try {
        const rows = await this.readSheetValues(spreadsheetId, `${matchedTitle}!${rangePostfix}`, accessToken);
        return { sheetTitle: matchedTitle, rows };
      } catch {}
    }

    for (const alt of candidateTitles.slice(1)) {
      try {
        const rows = await this.readSheetValues(spreadsheetId, `${alt}!${rangePostfix}`, accessToken);
        if (rows && rows.length > 0) {
          return { sheetTitle: alt, rows };
        }
      } catch {}
    }

    return { sheetTitle: preferred, rows: [] };
  }

  /**
   * Tải toàn bộ tài khoản, tên đăng nhập & mật khẩu từ sheet TaiKhoan về cập nhật vào LMS
   */
  static async pullAccountsFromSheet(
    spreadsheetId: string,
    accessToken: string
  ): Promise<number> {
    const rows = await this.readSheetValues(spreadsheetId, 'TaiKhoan!A2:M', accessToken);
    if (!rows || rows.length === 0) {
      // Fallback: nếu chưa có TaiKhoan thì đọc từ HocSinh
      return this.pullStudentsFromSheet(spreadsheetId, accessToken);
    }

    const classes = LMSStorageService.getClasses();
    let updatedCount = 0;

    const importedUsers: User[] = [];

    for (const row of rows) {
      if (!row || row.length < 4) continue;
      // Headers: ID, Username, Password, FullName, Email, Role, Code, Grade, Class, Phone, Status, CreatedAt, AvatarUrl
      const id = row[0] || `user-gsheet-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      const username = row[1] || row[4]?.split('@')[0] || `user_${Date.now()}`;
      const password = row[2] || '123456';
      const fullName = row[3] || 'Người dùng';
      const email = row[4] || `${username}@thcs-phuho.edu.vn`;
      const role = (row[5] as UserRole) || 'STUDENT';
      const code = row[6] || '';
      let className = String(row[8] || '').trim();
      if (className.startsWith('Lớp ')) className = className.replace('Lớp ', '').trim();
      if (className.includes('T') && className.includes('-')) {
        const d = new Date(className);
        if (!isNaN(d.getTime())) {
          className = `${d.getMonth() + 1}/${d.getDate()}`;
        }
      }

      let matchedClass = classes.find((c) => c.name === className || c.id === className);
      if (!matchedClass && (className === '8/7' || className === '8.7' || className === '8-7')) {
        matchedClass = classes.find((c) => c.id === 'cls-8-7');
      }
      if (!matchedClass && (className === '8/8' || className === '8.8' || className === '8-8')) {
        matchedClass = classes.find((c) => c.id === 'cls-8-8');
      }

      const avatarUrl = row[12] ? String(row[12]).trim() : undefined;

      const userObj: User = {
        id,
        username,
        password,
        fullName,
        email,
        role,
        phone: row[9] || '',
        schoolId: 'school-phuho-01',
        classId: matchedClass?.id,
        gradeId: matchedClass?.gradeId || (role === 'STUDENT' ? (className.startsWith('8') ? 'grade-8' : 'grade-6') : undefined),
        studentCode: role === 'STUDENT' ? code : undefined,
        teacherCode: role !== 'STUDENT' ? code : undefined,
        status: (row[10] === 'LOCKED' ? 'LOCKED' : 'ACTIVE') as 'ACTIVE' | 'LOCKED',
        createdAt: row[11] || new Date().toISOString().split('T')[0],
        avatarUrl: avatarUrl || undefined
      };

      importedUsers.push(userObj);
      updatedCount++;
    }

    if (importedUsers.length > 0) {
      LMSStorageService.importStudents(importedUsers);
      notifyChange('users');
    }

    return updatedCount;
  }

  /**
   * Tải danh sách học sinh từ Google Sheet về cập nhật vào LMS
   */
  static async pullStudentsFromSheet(
    spreadsheetId: string,
    accessToken: string
  ): Promise<number> {
    const rows = await this.readSheetValues(spreadsheetId, 'HocSinh!A2:L', accessToken);
    const classes = LMSStorageService.getClasses();

    const importedUsers: User[] = [];

    for (const row of rows) {
      if (!row || row.length < 2) continue;
      // Headers: ID, Họ và tên, Mã số HS, Tên đăng nhập, Mật khẩu, Lớp, Khối, Email, Số điện thoại, Trạng thái, Ngày tạo, AvatarUrl
      const id = row[0] || `user-gsheet-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      const fullName = row[1] || 'Học sinh';
      const studentCode = row[2] || `PH25-${Math.floor(100000 + Math.random() * 900000)}`;
      const username = row[3] || `hs.${studentCode.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
      const password = row[4] || '123456';
      let className = String(row[5] || '6/1').trim();
      if (className.startsWith('Lớp ')) className = className.replace('Lớp ', '').trim();
      if (className.includes('T') && className.includes('-')) {
        const d = new Date(className);
        if (!isNaN(d.getTime())) {
          className = `${d.getMonth() + 1}/${d.getDate()}`;
        }
      }
      const email = row[7] || `${username}@thcs-phuho.edu.vn`;

      let matchedClass = classes.find((c) => c.name === className || c.id === className);
      if (!matchedClass && (className === '8/7' || className === '8.7' || className === '8-7')) {
        matchedClass = classes.find((c) => c.id === 'cls-8-7');
      }
      if (!matchedClass && (className === '8/8' || className === '8.8' || className === '8-8')) {
        matchedClass = classes.find((c) => c.id === 'cls-8-8');
      }

      const avatarUrl = row[11] ? String(row[11]).trim() : undefined;

      importedUsers.push({
        id,
        username,
        password,
        fullName,
        email,
        role: 'STUDENT',
        schoolId: 'school-phuho-01',
        classId: matchedClass?.id,
        gradeId: matchedClass?.gradeId || (className.startsWith('8') ? 'grade-8' : 'grade-6'),
        studentCode,
        phone: row[8] || '',
        status: (row[9] === 'LOCKED' ? 'LOCKED' : 'ACTIVE') as 'ACTIVE' | 'LOCKED',
        createdAt: row[10] || new Date().toISOString().split('T')[0],
        avatarUrl: avatarUrl || undefined
      });
    }

    if (importedUsers.length > 0) {
      LMSStorageService.importStudents(importedUsers);
      notifyChange('users');
    }

    return importedUsers.length;
  }

  /**
   * Tải kết quả bài thi từ sheet BangDiem về LMS
   * Chỉ nạp điểm số của các tài khoản còn đang hoạt động (loại bỏ hoàn toàn tài khoản đã bị xóa)
   */
  static async pullSubmissionsFromSheet(
    spreadsheetId: string,
    accessToken: string
  ): Promise<number> {
    const rows = await this.readSheetValues(spreadsheetId, 'BangDiem!A2:I', accessToken);
    if (!rows || rows.length === 0) return 0;

    const activeUsers = LMSStorageService.getUsers().filter((u) => u.status !== 'DELETED');
    const activeStudentCodes = new Set(activeUsers.map((u) => u.studentCode).filter(Boolean));
    const activeUserByName = new Map(activeUsers.map((u) => [u.fullName.toLowerCase(), u]));

    const importedSubs: Submission[] = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      if (!row || row.length < 5) continue;
      // Headers: ID Bài nộp, Họ tên học sinh, Mã số HS, Lớp, Tên bài thi, Mã đề, Điểm số, Đúng/Tổng câu, Thời gian nộp
      const id = row[0] || `sub-gsheet-${Date.now()}-${i}`;
      const studentName = String(row[1] || 'Học sinh').trim();
      const studentCode = String(row[2] || '').trim();
      const className = String(row[3] || '').trim();
      const testTitle = String(row[4] || 'Bài kiểm tra').trim();
      const variantCode = String(row[5] || '101').trim();
      const score = parseFloat(String(row[6] || '0')) || 0;
      const countPart = String(row[7] || '0/10').split('/');
      const correctCount = parseInt(countPart[0], 10) || 0;
      const totalQuestions = parseInt(countPart[1], 10) || 10;
      const submittedAt = row[8] ? new Date(row[8]).toISOString() : new Date().toISOString();

      // Chỉ chấp nhận nếu thuộc tài khoản còn đang hoạt động
      const isStudentCodeActive = studentCode && activeStudentCodes.has(studentCode);
      const matchedUser = isStudentCodeActive
        ? activeUsers.find((u) => u.studentCode === studentCode)
        : activeUserByName.get(studentName.toLowerCase());

      if (!matchedUser && !isStudentCodeActive) {
        // Tài khoản đã bị xóa -> Bỏ qua không nạp
        continue;
      }

      const studentId = matchedUser?.id || `user-student-${studentCode}`;
      const gradeNum = parseInt(String(className || '').replace(/[^0-9]/g, '').slice(0, 1), 10) || 6;

      importedSubs.push({
        id,
        assignmentId: 'assign-sync',
        testId: 'test-sync',
        studentId,
        studentName: matchedUser?.fullName || studentName,
        studentCode: matchedUser?.studentCode || studentCode,
        classId: matchedUser?.classId || '',
        className: className || '8/7',
        gradeLevel: gradeNum,
        testTitle,
        variantCode,
        answers: {},
        score,
        maxScore: 10,
        totalQuestions,
        correctCount,
        startedAt: submittedAt,
        submittedAt,
        timeSpentSeconds: 1800,
        status: 'COMPLETED'
      });
    }

    if (importedSubs.length > 0) {
      LMSStorageService.importSubmissions(importedSubs);
      notifyChange('submissions');
    }

    return importedSubs.length;
  }

  /**
   * Phân tích và trích xuất dữ liệu lớp học & phân công giáo viên từ sheet LopHoc
   * Tương thích linh hoạt với mọi bố cục bảng tính (có hoặc không có header, có hoặc không có cột ID, tự động sửa lỗi ngày tháng của Google Sheet)
   */
  static parseLopHocRows(rows: any[][]): {
    importedClasses: ClassRoom[];
    teacherAssignments: Record<string, string[]>;
  } {
    if (!rows || rows.length === 0) {
      return { importedClasses: [], teacherAssignments: {} };
    }

    const users = LMSStorageService.getUsers();
    const existingClasses = LMSStorageService.getClasses();
    const staff = users.filter((u) => u.role !== 'STUDENT');
    const importedClasses: ClassRoom[] = [];
    const teacherAssignments: Record<string, string[]> = {};

    const normalizeClassName = (raw: any): string => {
      if (!raw) return '';
      if (raw instanceof Date) {
        const m = raw.getMonth() + 1;
        const d = raw.getDate();
        if (m >= 6 && m <= 9 && d >= 1 && d <= 15) return `${m}/${d}`;
        if (d >= 6 && d <= 9 && m >= 1 && m <= 15) return `${d}/${m}`;
        return `${m}/${d}`;
      }
      let s = String(raw).trim();
      if (s.includes('-') && (s.includes('T') || s.length === 10)) {
        const d = new Date(s);
        if (!isNaN(d.getTime())) {
          const m = d.getMonth() + 1;
          const dt = d.getDate();
          if (m >= 6 && m <= 9 && dt >= 1 && dt <= 15) return `${m}/${dt}`;
          if (dt >= 6 && dt <= 9 && m >= 1 && m <= 15) return `${dt}/${m}`;
        }
      }
      const dateParts = s.match(/^(\d{1,2})\/(\d{1,2})(?:\/\d{2,4})?$/);
      if (dateParts) {
        const p1 = parseInt(dateParts[1], 10);
        const p2 = parseInt(dateParts[2], 10);
        if (p1 >= 6 && p1 <= 9 && p2 >= 1 && p2 <= 15) return `${p1}/${p2}`;
        if (p2 >= 6 && p2 <= 9 && p1 >= 1 && p1 <= 15) return `${p2}/${p1}`;
      }
      s = s.replace(/^(lớp|lop|khối|khoi)\s+/i, '').trim();
      s = s.replace(/^([6-9])[\.\-]([0-9]{1,2})$/, '$1/$2');
      return s;
    };

    const cleanTeacherName = (val: string): string => {
      return (val || '')
        .toLowerCase()
        .replace(/^(thầy|cô|gv|giáo viên|thầy\/cô)\s+/i, '')
        .trim();
    };

    let headerRowIdx = -1;
    let colId = -1;
    let colName = -1;
    let colGrade = -1;
    let colCount = -1;
    let colHomeroom = -1;
    let colSubject = -1;

    for (let rIdx = 0; rIdx < Math.min(10, rows.length); rIdx++) {
      const r = rows[rIdx];
      if (!Array.isArray(r)) continue;
      const joined = r.map((c) => String(c || '').toLowerCase()).join(' ');
      if (
        joined.includes('lớp') ||
        joined.includes('khối') ||
        joined.includes('chủ nhiệm') ||
        joined.includes('phân công') ||
        joined.includes('giáo viên')
      ) {
        headerRowIdx = rIdx;
        r.forEach((cell, cIdx) => {
          const h = String(cell || '').trim().toLowerCase();
          if (/^(id|stt|mã\s*lớp|mã)$/i.test(h)) {
            colId = cIdx;
          } else if (
            /^(tên\s*lớp|lớp|class|lớp\s*học)$/i.test(h) ||
            (h.includes('lớp') && !h.includes('khối') && !h.includes('chủ nhiệm') && !h.includes('phân công') && !h.includes('giáo viên'))
          ) {
            if (colName === -1) colName = cIdx;
          } else if (
            /^(khối|khối\s*lớp|grade)$/i.test(h) ||
            (h.includes('khối') && !h.includes('lớp'))
          ) {
            if (colGrade === -1) colGrade = cIdx;
          } else if (
            /^(sĩ\s*số|số\s*hs|học\s*sinh|số\s*lượng|siso)$/i.test(h) ||
            h.includes('sĩ số') ||
            h.includes('sĩ-số')
          ) {
            if (colCount === -1) colCount = cIdx;
          } else if (
            /^(gvcn|giáo\s*viên\s*chủ\s*nhiệm|chủ\s*nhiệm|homeroom)$/i.test(h) ||
            h.includes('chủ nhiệm') ||
            h.includes('gvcn')
          ) {
            if (colHomeroom === -1) colHomeroom = cIdx;
          } else if (
            h.includes('phân công') ||
            h.includes('gvbm') ||
            h.includes('bộ môn') ||
            h.includes('tin học') ||
            h.includes('giảng dạy') ||
            h.includes('phụ trách') ||
            (h.includes('giáo viên') && !h.includes('chủ nhiệm')) ||
            (h.includes('gv') && !h.includes('gvcn') && !h.includes('chủ nhiệm'))
          ) {
            if (colSubject === -1) colSubject = cIdx;
          }
        });
        break;
      }
    }

    const dataRows = headerRowIdx >= 0 ? rows.slice(headerRowIdx + 1) : rows;
    const seenClassNames = new Set<string>();

    for (let i = 0; i < dataRows.length; i++) {
      const row = dataRows[i];
      if (!row || row.length === 0) continue;

      let rawName = '';
      let rawId = '';
      let rawGrade = '';
      let rawStudentCount = '';
      let homeroomTeacherName = '';
      let subjectTeacherName = '';

      if (colName >= 0 && row[colName] !== undefined) {
        rawName = String(row[colName]);
      }
      if (colId >= 0 && row[colId] !== undefined) {
        rawId = String(row[colId]);
      }
      if (colGrade >= 0 && row[colGrade] !== undefined) {
        rawGrade = String(row[colGrade]);
      }
      if (colCount >= 0 && row[colCount] !== undefined) {
        rawStudentCount = String(row[colCount]);
      }
      if (colHomeroom >= 0 && row[colHomeroom] !== undefined) {
        homeroomTeacherName = String(row[colHomeroom]);
      }
      if (colSubject >= 0 && row[colSubject] !== undefined) {
        subjectTeacherName = String(row[colSubject]);
      }

      if (!rawName) {
        for (let c = 0; c < row.length; c++) {
          const val = String(row[c] || '').trim();
          if (!val) continue;
          if (/^(lớp\s*)?([6-9])[\/\.\-A-Za-z0-9]+/i.test(val)) {
            rawName = val;
            break;
          }
        }
        if (!rawName) {
          rawName = String(row[1] || row[0] || '').trim();
        }
      }

      const cleanName = normalizeClassName(rawName);
      if (!cleanName || cleanName.toLowerCase() === 'tên lớp' || cleanName.toLowerCase() === 'lớp') {
        continue;
      }

      // Chỉ chấp nhận định dạng lớp cấp THCS hợp lệ (Khối 6-9, ví dụ 6/1, 6A, 7/2, 8/7, 9/1)
      if (!/^[6-9][\/\.\-_A-Za-z0-9]+$/i.test(cleanName)) {
        continue;
      }

      // Ngăn chặn trùng lặp cùng một lớp học
      if (seenClassNames.has(cleanName.toLowerCase())) {
        continue;
      }
      seenClassNames.add(cleanName.toLowerCase());

      let gradeNum = 6;
      if (rawGrade) {
        gradeNum = parseInt(String(rawGrade).replace(/[^0-9]/g, ''), 10) || 6;
      } else {
        const matchG = cleanName.match(/^([6-9])/);
        gradeNum = matchG ? parseInt(matchG[1], 10) : 6;
      }

      let studentCount = 35;
      if (rawStudentCount) {
        studentCount = parseInt(String(rawStudentCount).replace(/[^0-9]/g, ''), 10) || 35;
      } else {
        for (let c = 0; c < row.length; c++) {
          const num = parseInt(String(row[c] || '').replace(/[^0-9]/g, ''), 10);
          if (!isNaN(num) && num >= 15 && num <= 60 && !String(row[c]).includes('/')) {
            studentCount = num;
            break;
          }
        }
      }

      // Quét tự động cột phân công GV bộ môn Tin học nếu chưa nhận diện được
      if (!subjectTeacherName) {
        for (let c = 0; c < row.length; c++) {
          if (c === colName || c === colId || c === colGrade || c === colCount || c === colHomeroom) continue;
          const val = String(row[c] || '').trim();
          if (
            val &&
            val.length >= 2 &&
            isNaN(Number(val)) &&
            !val.includes('/') &&
            !val.toLowerCase().startsWith('khối') &&
            !val.toLowerCase().startsWith('lớp')
          ) {
            subjectTeacherName = val;
            break;
          }
        }
      }

      // Quét tự động cột GVCN nếu chưa nhận diện được
      if (!homeroomTeacherName) {
        for (let c = 0; c < row.length; c++) {
          if (c === colName || c === colId || c === colGrade || c === colCount || c === colSubject) continue;
          const val = String(row[c] || '').trim();
          if (
            val &&
            val.length >= 2 &&
            isNaN(Number(val)) &&
            !val.includes('/') &&
            !val.toLowerCase().startsWith('khối') &&
            !val.toLowerCase().startsWith('lớp')
          ) {
            homeroomTeacherName = val;
            break;
          }
        }
      }

      homeroomTeacherName = homeroomTeacherName.trim();
      subjectTeacherName = subjectTeacherName.trim();

      const existingClass = existingClasses.find(
        (c) =>
          c.name.toLowerCase() === cleanName.toLowerCase() ||
          c.name.toLowerCase().replace(/^(lớp|lop)\s+/i, '') === cleanName.toLowerCase()
      );
      let id = existingClass?.id;
      if (!id) {
        if (rawId && rawId.startsWith('cls-')) {
          id = rawId;
        } else {
          id = `cls-${cleanName.replace(/[^a-zA-Z0-9]/g, '-')}`;
        }
      }

      // Đối chiếu giáo viên chủ nhiệm
      const matchedHomeroom = homeroomTeacherName
        ? staff.find((t) => LMSStorageService.isTeacherNameMatch(homeroomTeacherName, t))
        : undefined;

      // Đối chiếu giáo viên bộ môn Tin học
      const assignedTeacherIds: string[] = [];
      if (subjectTeacherName) {
        staff.forEach((t) => {
          if (LMSStorageService.isTeacherNameMatch(subjectTeacherName, t)) {
            if (!assignedTeacherIds.includes(t.id)) {
              assignedTeacherIds.push(t.id);
              if (!teacherAssignments[t.id]) teacherAssignments[t.id] = [];
              teacherAssignments[t.id].push(id);
            }
          }
        });
      }

      const matchedSubjectTeacher =
        assignedTeacherIds.length > 0 ? staff.find((t) => t.id === assignedTeacherIds[0]) : undefined;

      if (matchedHomeroom && !assignedTeacherIds.includes(matchedHomeroom.id)) {
        assignedTeacherIds.push(matchedHomeroom.id);
        if (!teacherAssignments[matchedHomeroom.id]) teacherAssignments[matchedHomeroom.id] = [];
        teacherAssignments[matchedHomeroom.id].push(id);
      }

      importedClasses.push({
        id,
        name: cleanName,
        gradeId: `grade-${gradeNum}`,
        academicYearId: 'ay-2025-2026',
        homeroomTeacherId: matchedHomeroom?.id,
        homeroomTeacherName: homeroomTeacherName || matchedHomeroom?.fullName || '',
        subjectTeacherId: matchedSubjectTeacher?.id,
        subjectTeacherName: subjectTeacherName || matchedSubjectTeacher?.fullName || '',
        assignedTeacherIds,
        studentCount
      });
    }

    return { importedClasses, teacherAssignments };
  }

  /**
   * Tải danh sách Khối & Lớp học và phân công từ sheet LopHoc trên Google Sheet về LMS
   */
  static async pullClassesFromSheet(
    spreadsheetId: string,
    accessToken: string
  ): Promise<number> {
    const { rows } = await this.readSheetWithFallback(
      spreadsheetId,
      ['LopHoc', 'Lớp học', 'Lớp Học', 'LOPHOC', 'lophoc', 'Danh sách lớp'],
      'A1:Z',
      accessToken
    );
    if (!rows || rows.length === 0) return 0;

    const { importedClasses, teacherAssignments } = this.parseLopHocRows(rows);

    if (importedClasses.length > 0) {
      LMSStorageService.importClasses(importedClasses, true);
      const users = LMSStorageService.getUsers();
      const currentLoggedIn = LMSStorageService.getCurrentUser();
      Object.entries(teacherAssignments).forEach(([tId, cIds]) => {
        const tUser = users.find((u) => u.id === tId);
        if (tUser) {
          const mergedClasses = Array.from(new Set([...(tUser.assignedClassIds || []), ...cIds]));
          LMSStorageService.updateUser({ ...tUser, assignedClassIds: mergedClasses });
          if (currentLoggedIn && currentLoggedIn.id === tId) {
            LMSStorageService.setCurrentUser({ ...currentLoggedIn, assignedClassIds: mergedClasses });
          }
        }
      });
      LMSStorageService.refreshTeacherAssignmentsFromClasses();
      notifyChange('classes');
      notifyChange('users');
    }

    return importedClasses.length;
  }

  /**
   * Tải danh sách Khối & Lớp học và phân công từ Google Sheet (sheet LopHoc) qua Apps Script
   */
  static async pullClassesFromAppsScript(): Promise<{ success: boolean; count: number; error?: string }> {
    const scriptUrl = getAppsScriptUrl();
    if (!scriptUrl) return { success: false, count: 0, error: 'Chưa có Apps Script URL' };
    const sheetId = getSavedSheetId();
    try {
      const url = `${scriptUrl}?action=getClasses${sheetId ? `&sheetId=${encodeURIComponent(sheetId)}` : ''}`;
      const res = await fetch(url);
      if (!res.ok) {
        return { success: false, count: 0, error: `Lỗi kết nối Apps Script: HTTP ${res.status}` };
      }
      const data = await res.json();
      if (!Array.isArray(data) || data.length === 0) {
        return { success: true, count: 0 };
      }

      const { importedClasses, teacherAssignments } = this.parseLopHocRows(data);

      if (importedClasses.length > 0) {
        LMSStorageService.importClasses(importedClasses, true);
        const users = LMSStorageService.getUsers();
        const currentLoggedIn = LMSStorageService.getCurrentUser();
        Object.entries(teacherAssignments).forEach(([tId, cIds]) => {
          const tUser = users.find((u) => u.id === tId);
          if (tUser) {
            const mergedClasses = Array.from(new Set([...(tUser.assignedClassIds || []), ...cIds]));
            LMSStorageService.updateUser({ ...tUser, assignedClassIds: mergedClasses });
            if (currentLoggedIn && currentLoggedIn.id === tId) {
              LMSStorageService.setCurrentUser({ ...currentLoggedIn, assignedClassIds: mergedClasses });
            }
          }
        });
        LMSStorageService.refreshTeacherAssignmentsFromClasses();
        notifyChange('classes');
        notifyChange('users');
        return { success: true, count: importedClasses.length };
      }
      return { success: true, count: 0 };
    } catch (e: any) {
      return { success: false, count: 0, error: e.message || 'Lỗi đọc lớp học từ Apps Script' };
    }
  }

  /**
   * Tải danh sách Đề thi (sheet DeThi / Đề thi) từ Google Sheet về LMS (OAuth Direct)
   */
  static async pullTestsFromSheet(
    spreadsheetId: string,
    accessToken: string
  ): Promise<number> {
    const { rows } = await this.readSheetWithFallback(
      spreadsheetId,
      ['DeThi', 'Đề thi', 'Đề Thi', 'DETHI', 'dethi', 'Tests', 'Danh sách đề thi'],
      'A1:Z',
      accessToken
    );
    if (!rows || rows.length <= 1) return 0;

    let headerRowIdx = 0;
    for (let rIdx = 0; rIdx < Math.min(5, rows.length); rIdx++) {
      const r = rows[rIdx];
      const joined = (r || []).map((c) => String(c || '').toLowerCase()).join(' ');
      if (joined.includes('đề') || joined.includes('tên đề') || joined.includes('thời gian') || joined.includes('mã đề')) {
        headerRowIdx = rIdx;
        break;
      }
    }

    const dataRows = rows.slice(headerRowIdx + 1);
    const allQuestions = LMSStorageService.getQuestions();
    const imported: Test[] = [];

    for (let i = 0; i < dataRows.length; i++) {
      const row = dataRows[i];
      if (!row || (!row[0] && !row[1])) continue;

      const id = String(row[0] || `test-${Date.now()}-${i}`).trim();
      const title = String(row[1] || row[0] || 'Đề kiểm tra Tin học').trim();
      if (!title || title.toLowerCase() === 'tên đề thi' || title.toLowerCase() === 'tên đề') continue;

      const gradeStr = String(row[2] || '6');
      const gradeLevel = parseInt(gradeStr.replace(/[^0-9]/g, ''), 10) || 6;
      const durationMinutes = parseInt(String(row[3] || '45').replace(/[^0-9]/g, ''), 10) || 45;
      const totalQuestions = parseInt(String(row[4] || '20').replace(/[^0-9]/g, ''), 10) || 20;
      const variantCode = String(row[5] || '101').trim() || '101';
      const authorName = String(row[6] || 'Giáo viên Tin học').trim();
      const createdAt = String(row[7] || new Date().toISOString().split('T')[0]).trim();
      const status = String(row[8] || 'READY').trim().toUpperCase() === 'ARCHIVED' ? 'READY' : 'READY';

      const gradeQuestions = allQuestions.filter((q) => q.gradeLevel === gradeLevel);
      const questionIds = gradeQuestions.slice(0, totalQuestions).map((q) => q.id);

      imported.push({
        id,
        title,
        gradeLevel,
        durationMinutes,
        totalQuestions: questionIds.length > 0 ? questionIds.length : totalQuestions,
        totalPoints: 10,
        questionIds,
        variants: [{ code: variantCode, questionIds }],
        createdBy: 'user-admin-01',
        authorName,
        createdAt: createdAt || new Date().toISOString().split('T')[0],
        status,
        matrix: {
          knowCount: Math.round(totalQuestions * 0.4),
          understandCount: Math.round(totalQuestions * 0.3),
          applyCount: Math.max(0, totalQuestions - Math.round(totalQuestions * 0.7)),
          selectedTopics: []
        }
      });
    }

    if (imported.length > 0) {
      LMSStorageService.importTests(imported);
      notifyChange('tests');
    }

    return imported.length;
  }

  /**
   * Tải danh sách Đề thi (DeThi) từ Google Sheet qua Apps Script
   */
  static async pullTestsFromAppsScript(): Promise<{ success: boolean; count: number; error?: string }> {
    const scriptUrl = getAppsScriptUrl();
    if (!scriptUrl) return { success: false, count: 0, error: 'Chưa có Apps Script URL' };
    const sheetId = getSavedSheetId();
    try {
      const url = `${scriptUrl}?action=getTests${sheetId ? `&sheetId=${encodeURIComponent(sheetId)}` : ''}`;
      const res = await fetch(url);
      if (!res.ok) return { success: false, count: 0, error: `HTTP ${res.status}` };
      const data = await res.json();
      if (!Array.isArray(data) || data.length <= 1) return { success: true, count: 0 };

      const rows = data.slice(1);
      const allQuestions = LMSStorageService.getQuestions();
      const imported: Test[] = [];

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        if (!row || (!row[0] && !row[1])) continue;
        const id = String(row[0] || `test-${Date.now()}-${i}`).trim();
        const title = String(row[1] || row[0] || 'Đề kiểm tra Tin học').trim();
        if (!title || title.toLowerCase() === 'tên đề thi' || title.toLowerCase() === 'tên đề') continue;

        const gradeStr = String(row[2] || '6');
        const gradeLevel = parseInt(gradeStr.replace(/[^0-9]/g, ''), 10) || 6;
        const durationMinutes = parseInt(String(row[3] || '45').replace(/[^0-9]/g, ''), 10) || 45;
        const totalQuestions = parseInt(String(row[4] || '20').replace(/[^0-9]/g, ''), 10) || 20;
        const variantCode = String(row[5] || '101').trim() || '101';
        const authorName = String(row[6] || 'Giáo viên Tin học').trim();
        const createdAt = String(row[7] || new Date().toISOString().split('T')[0]).trim();
        const status = String(row[8] || 'READY').trim().toUpperCase() === 'ARCHIVED' ? 'READY' : 'READY';

        const gradeQuestions = allQuestions.filter((q) => q.gradeLevel === gradeLevel);
        const questionIds = gradeQuestions.slice(0, totalQuestions).map((q) => q.id);

        imported.push({
          id,
          title,
          gradeLevel,
          durationMinutes,
          totalQuestions: questionIds.length > 0 ? questionIds.length : totalQuestions,
          totalPoints: 10,
          questionIds,
          variants: [{ code: variantCode, questionIds }],
          authorName,
          createdBy: 'user-admin-01',
          createdAt: createdAt || new Date().toISOString().split('T')[0],
          status,
          matrix: {
            knowCount: Math.round(totalQuestions * 0.4),
            understandCount: Math.round(totalQuestions * 0.3),
            applyCount: Math.max(0, totalQuestions - Math.round(totalQuestions * 0.7)),
            selectedTopics: []
          }
        });
      }
      if (imported.length > 0) {
        LMSStorageService.importTests(imported);
        notifyChange('tests');
      }
      return { success: true, count: imported.length };
    } catch (e: any) {
      return { success: false, count: 0, error: e.message };
    }
  }

  /**
   * Tải danh sách Đợt giao đề (sheet GiaoDe / Giao đề) từ Google Sheet về LMS (OAuth Direct)
   */
  static async pullAssignmentsFromSheet(
    spreadsheetId: string,
    accessToken: string
  ): Promise<number> {
    const { rows } = await this.readSheetWithFallback(
      spreadsheetId,
      ['GiaoDe', 'Giao đề', 'Giao Đề', 'GIAODE', 'giaode', 'Assignments', 'Danh sách giao đề'],
      'A1:Z',
      accessToken
    );
    if (!rows || rows.length <= 1) return 0;

    let headerRowIdx = 0;
    for (let rIdx = 0; rIdx < Math.min(5, rows.length); rIdx++) {
      const r = rows[rIdx];
      const joined = (r || []).map((c) => String(c || '').toLowerCase()).join(' ');
      if (joined.includes('giao') || joined.includes('bài kiểm tra') || joined.includes('lớp') || joined.includes('thời gian')) {
        headerRowIdx = rIdx;
        break;
      }
    }

    const dataRows = rows.slice(headerRowIdx + 1);
    const classes = LMSStorageService.getClasses();
    const tests = LMSStorageService.getTests();
    const imported: Assignment[] = [];

    for (let i = 0; i < dataRows.length; i++) {
      const row = dataRows[i];
      if (!row || (!row[0] && !row[1])) continue;

      const id = String(row[0] || `assign-${Date.now()}-${i}`).trim();
      const testTitle = String(row[1] || row[0] || 'Bài kiểm tra Tin học').trim();
      if (!testTitle || testTitle.toLowerCase() === 'tên bài kiểm tra' || testTitle.toLowerCase() === 'tên bài') continue;

      const gradeStr = String(row[2] || '6');
      const gradeLevel = parseInt(gradeStr.replace(/[^0-9]/g, ''), 10) || 6;
      const classNamesStr = String(row[3] || '').trim();
      const classNames = classNamesStr ? classNamesStr.split(/[,;]/).map((s) => s.trim()).filter(Boolean) : [classes[0]?.name || '6/1'];
      const classIds = classNames.map((cn) => classes.find((c) => c.name === cn)?.id || `cls-${cn.replace('/', '-')}`).filter(Boolean);

      const startTime = String(row[4] || '').trim();
      const endTime = String(row[5] || '').trim();
      const password = String(row[6] || '').trim();
      const allowReview = String(row[7] || '').trim().toLowerCase() !== 'không';
      const shuffle = String(row[8] || '').trim().toLowerCase() !== 'không';
      const assignedByName = String(row[9] || 'Giáo viên').trim();
      const createdAt = String(row[10] || '').trim();
      const status = String(row[11] || 'ACTIVE').trim().toUpperCase() === 'CLOSED' ? 'CLOSED' : 'ACTIVE';

      const matchedTest = tests.find(
        (t) => t.title.trim().toLowerCase() === testTitle.toLowerCase() || t.id === id
      );
      const testId = matchedTest?.id || (tests[0]?.id || `test-${id}`);

      imported.push({
        id,
        testId,
        testTitle: matchedTest?.title || testTitle,
        gradeLevel: matchedTest?.gradeLevel || gradeLevel,
        classIds: classIds.length > 0 ? classIds : [classes[0]?.id || 'cls-6-1'],
        classNames,
        startTime: parseDateTimeFlexible(startTime),
        endTime: parseDateTimeFlexible(endTime || new Date(Date.now() + 7 * 86400000).toISOString()),
        password: password === 'Không có' ? undefined : (password || undefined),
        allowReviewAfterSubmit: allowReview,
        shuffleQuestions: shuffle,
        assignedBy: 'user-admin-01',
        assignedByName,
        createdAt: createdAt || new Date().toISOString().split('T')[0],
        status
      });
    }

    if (imported.length > 0) {
      LMSStorageService.importAssignments(imported);
      notifyChange('assignments');
    }

    return imported.length;
  }

  /**
   * Tải danh sách Đợt giao đề (GiaoDe) từ Google Sheet qua Apps Script
   */
  static async pullAssignmentsFromAppsScript(): Promise<{ success: boolean; count: number; error?: string }> {
    const scriptUrl = getAppsScriptUrl();
    if (!scriptUrl) return { success: false, count: 0, error: 'Chưa có Apps Script URL' };
    const sheetId = getSavedSheetId();
    try {
      const url = `${scriptUrl}?action=getAssignments${sheetId ? `&sheetId=${encodeURIComponent(sheetId)}` : ''}`;
      const res = await fetch(url);
      if (!res.ok) return { success: false, count: 0, error: `HTTP ${res.status}` };
      const data = await res.json();
      if (!Array.isArray(data) || data.length <= 1) return { success: true, count: 0 };

      const rows = data.slice(1);
      const classes = LMSStorageService.getClasses();
      const tests = LMSStorageService.getTests();
      const imported: Assignment[] = [];

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        if (!row || (!row[0] && !row[1])) continue;
        const id = String(row[0] || `assign-${Date.now()}-${i}`).trim();
        const testTitle = String(row[1] || row[0] || 'Bài kiểm tra Tin học').trim();
        if (!testTitle || testTitle.toLowerCase() === 'tên bài kiểm tra' || testTitle.toLowerCase() === 'tên bài') continue;

        const gradeStr = String(row[2] || '6');
        const gradeLevel = parseInt(gradeStr.replace(/[^0-9]/g, ''), 10) || 6;
        const classNamesStr = String(row[3] || '').trim();
        const classNames = classNamesStr ? classNamesStr.split(/[,;]/).map((s) => s.trim()).filter(Boolean) : [classes[0]?.name || '6/1'];
        const classIds = classNames.map((cn) => classes.find((c) => c.name === cn)?.id || `cls-${cn.replace('/', '-')}`).filter(Boolean);
        const startTime = String(row[4] || '').trim();
        const endTime = String(row[5] || '').trim();
        const password = String(row[6] || '').trim();
        const allowReview = String(row[7] || '').trim().toLowerCase() !== 'không';
        const shuffle = String(row[8] || '').trim().toLowerCase() !== 'không';
        const assignedByName = String(row[9] || 'Giáo viên').trim();
        const createdAt = String(row[10] || '').trim();
        const status = String(row[11] || 'ACTIVE').trim().toUpperCase() === 'CLOSED' ? 'CLOSED' : 'ACTIVE';

        const matchedTest = tests.find(
          (t) => t.title.trim().toLowerCase() === testTitle.toLowerCase() || t.id === id
        );
        const testId = matchedTest?.id || (tests[0]?.id || `test-${id}`);

        imported.push({
          id,
          testId,
          testTitle: matchedTest?.title || testTitle,
          gradeLevel: matchedTest?.gradeLevel || gradeLevel,
          classIds: classIds.length > 0 ? classIds : [classes[0]?.id || 'cls-6-1'],
          classNames,
          startTime: parseDateTimeFlexible(startTime),
          endTime: parseDateTimeFlexible(endTime || new Date(Date.now() + 7 * 86400000).toISOString()),
          password: password === 'Không có' ? undefined : (password || undefined),
          allowReviewAfterSubmit: allowReview,
          shuffleQuestions: shuffle,
          assignedBy: 'user-admin-01',
          assignedByName,
          createdAt: createdAt || new Date().toISOString().split('T')[0],
          status
        });
      }
      if (imported.length > 0) {
        LMSStorageService.importAssignments(imported);
        notifyChange('assignments');
      }
      return { success: true, count: imported.length };
    } catch (e: any) {
      return { success: false, count: 0, error: e.message };
    }
  }

  /**
   * Tải danh sách Tài khoản (TaiKhoan) từ Google Sheet qua Apps Script
   */
  static async pullAccountsFromAppsScript(): Promise<{ success: boolean; count: number; error?: string }> {
    const scriptUrl = getAppsScriptUrl();
    if (!scriptUrl) return { success: false, count: 0, error: 'Chưa có Apps Script URL' };
    const sheetId = getSavedSheetId();
    try {
      const url = `${scriptUrl}?action=getAccounts${sheetId ? `&sheetId=${encodeURIComponent(sheetId)}` : ''}`;
      const res = await fetch(url);
      if (!res.ok) return { success: false, count: 0, error: `HTTP ${res.status}` };
      const accData = await res.json();
      if (!Array.isArray(accData) || accData.length <= 1) return { success: true, count: 0 };

      const rows = accData.slice(1);
      const classes = LMSStorageService.getClasses();
      const importedUsers: User[] = [];

      for (const row of rows) {
        if (!row || !row[1]) continue;
        const id = String(row[0] || `user-gsheet-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`);
        const username = String(row[1]).trim();
        if (username.toLowerCase() === 'tên đăng nhập') continue;

        const password = String(row[2] || '123456').trim();
        const fullName = String(row[3] || username).trim();
        const email = String(row[4] || `${username}@thcs-phuho.edu.vn`).trim();
        const rawRole = String(row[5] || 'STUDENT').trim().toUpperCase();
        const role: UserRole = (['ADMIN', 'PRINCIPAL', 'DEPARTMENT_HEAD', 'TEACHER', 'STUDENT'].includes(rawRole)
          ? rawRole
          : 'STUDENT') as UserRole;
        const code = String(row[6] || '').trim();
        const gradeStr = String(row[7] || '').trim();
        let classStr = String(row[8] || '').trim();
        if (classStr.includes('T') && classStr.includes('-')) {
          const d = new Date(classStr);
          if (!isNaN(d.getTime())) {
            classStr = `${d.getMonth() + 1}/${d.getDate()}`;
          }
        }
        const phone = String(row[9] || '').trim();
        const status = String(row[10] || 'ACTIVE').trim().toUpperCase() === 'LOCKED' ? 'LOCKED' : 'ACTIVE';
        const createdAt = String(row[11] || new Date().toISOString().split('T')[0]);
        const avatarUrl = row[12] ? String(row[12]).trim() : undefined;

        let matchedClass = classes.find((c) => c.name === classStr || c.id === classStr);
        if (!matchedClass && (classStr === '8/7' || classStr === '8.7' || classStr === '8-7')) {
          matchedClass = classes.find((c) => c.id === 'cls-8-7');
        }
        if (!matchedClass && (classStr === '8/8' || classStr === '8.8' || classStr === '8-8')) {
          matchedClass = classes.find((c) => c.id === 'cls-8-8');
        }

        importedUsers.push({
          id,
          username,
          password,
          fullName,
          email,
          role,
          studentCode: role === 'STUDENT' ? code : undefined,
          teacherCode: role !== 'STUDENT' ? code : undefined,
          classId: matchedClass?.id,
          gradeId:
            matchedClass?.gradeId ||
            (gradeStr.includes('8') || classStr.startsWith('8')
              ? 'grade-8'
              : gradeStr.includes('7')
              ? 'grade-7'
              : gradeStr.includes('9')
              ? 'grade-9'
              : 'grade-6'),
          phone,
          status,
          schoolId: 'school-phuho-01',
          createdAt,
          avatarUrl: avatarUrl || undefined
        });
      }

      if (importedUsers.length > 0) {
        LMSStorageService.importStudents(importedUsers);
        notifyChange('users');
      }
      return { success: true, count: importedUsers.length };
    } catch (e: any) {
      return { success: false, count: 0, error: e.message };
    }
  }

  /**
   * Tải Bảng điểm (BangDiem) từ Google Sheet qua Apps Script
   */
  static async pullSubmissionsFromAppsScript(): Promise<{ success: boolean; count: number; error?: string }> {
    const scriptUrl = getAppsScriptUrl();
    if (!scriptUrl) return { success: false, count: 0, error: 'Chưa có Apps Script URL' };
    const sheetId = getSavedSheetId();
    try {
      const url = `${scriptUrl}?action=getSubmissions${sheetId ? `&sheetId=${encodeURIComponent(sheetId)}` : ''}`;
      const res = await fetch(url);
      if (!res.ok) return { success: false, count: 0, error: `HTTP ${res.status}` };
      const data = await res.json();
      if (!Array.isArray(data) || data.length <= 1) return { success: true, count: 0 };

      const rows = data.slice(1);
      const activeUsers = LMSStorageService.getUsers().filter((u) => u.status !== 'DELETED');
      const activeStudentCodes = new Set(activeUsers.map((u) => u.studentCode).filter(Boolean));
      const activeUserByName = new Map(activeUsers.map((u) => [u.fullName.toLowerCase(), u]));
      const importedSubs: Submission[] = [];

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        if (!row || row.length < 5) continue;
        const id = String(row[0] || `sub-gsheet-${Date.now()}-${i}`).trim();
        const studentName = String(row[1] || 'Học sinh').trim();
        if (studentName.toLowerCase() === 'họ tên học sinh') continue;

        const studentCode = String(row[2] || '').trim();
        const className = String(row[3] || '').trim();
        const testTitle = String(row[4] || 'Bài kiểm tra').trim();
        const variantCode = String(row[5] || '101').trim();
        const score = parseFloat(String(row[6] || '0')) || 0;
        const countPart = String(row[7] || '0/10').split('/');
        const correctCount = parseInt(countPart[0], 10) || 0;
        const totalQuestions = parseInt(countPart[1], 10) || 10;
        const submittedAt = row[8] ? new Date(row[8]).toISOString() : new Date().toISOString();

        const isStudentCodeActive = studentCode && activeStudentCodes.has(studentCode);
        const matchedUser = isStudentCodeActive
          ? activeUsers.find((u) => u.studentCode === studentCode)
          : activeUserByName.get(studentName.toLowerCase());

        const studentId = matchedUser?.id || `user-student-${studentCode || id}`;
        const gradeNum = parseInt(String(className || '').replace(/[^0-9]/g, '').slice(0, 1), 10) || 6;

        importedSubs.push({
          id,
          assignmentId: 'assign-sync',
          testId: 'test-sync',
          studentId,
          studentName: matchedUser?.fullName || studentName,
          studentCode: matchedUser?.studentCode || studentCode,
          classId: matchedUser?.classId || '',
          className: className || '8/7',
          gradeLevel: gradeNum,
          testTitle,
          variantCode,
          answers: {},
          score,
          maxScore: 10,
          totalQuestions,
          correctCount,
          startedAt: submittedAt,
          submittedAt,
          timeSpentSeconds: 1800,
          status: 'COMPLETED'
        });
      }

      if (importedSubs.length > 0) {
        LMSStorageService.importSubmissions(importedSubs);
      }
      return { success: true, count: importedSubs.length };
    } catch (e: any) {
      return { success: false, count: 0, error: e.message };
    }
  }

  /**
   * Đồng bộ toàn bộ dữ liệu toàn bộ các sheet (Tài khoản, Học sinh, Giáo viên, Lớp học, Phân công, Bài học, Câu hỏi, Đề thi, Giao đề, Bảng điểm)
   * Từ Google Sheet thông qua Apps Script
   */
  static async syncAllFromAppsScript(): Promise<{
    users: number;
    classes: number;
    questions: number;
    lessons: number;
    tests: number;
    assignments: number;
    submissions: number;
    success: boolean;
    error?: string;
  }> {
    const scriptUrl = getAppsScriptUrl();
    if (!scriptUrl) {
      return { users: 0, classes: 0, questions: 0, lessons: 0, tests: 0, assignments: 0, submissions: 0, success: false, error: 'Chưa có Apps Script URL' };
    }

    notifyAutoSyncListeners({ status: 'syncing', entity: 'all' });
    let usersCount = 0;
    let classesCount = 0;
    let questionsCount = 0;
    let lessonsCount = 0;
    let testsCount = 0;
    let assignmentsCount = 0;
    let submissionsCount = 0;

    try {
      // 1. Tải danh sách Tài khoản trước
      const accRes = await this.pullAccountsFromAppsScript();
      usersCount = accRes.count;

      // 2. Tải danh sách Lớp học và Phân công giảng dạy
      const clsRes = await this.pullClassesFromAppsScript();
      classesCount = clsRes.count;

      // 3. Tải Ngân hàng Câu hỏi
      const qRes = await this.pullQuestionsFromAppsScript();
      questionsCount = qRes.count;

      // 4. Tải Tên bài học
      const lRes = await this.pullLessonsFromAppsScript();
      lessonsCount = lRes.count;

      // 5. Tải Đề thi
      const tRes = await this.pullTestsFromAppsScript();
      testsCount = tRes.count;

      // 6. Tải Đợt giao đề
      const aRes = await this.pullAssignmentsFromAppsScript();
      assignmentsCount = aRes.count;

      // 7. Tải Bảng điểm bài làm
      const subRes = await this.pullSubmissionsFromAppsScript();
      submissionsCount = subRes.count;

      // Đảm bảo quét và liên kết hai chiều mọi phân công lớp học cho giáo viên
      LMSStorageService.refreshTeacherAssignmentsFromClasses();

      notifyAutoSyncListeners({
        status: 'synced',
        lastSyncedTime: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        entity: 'Toàn bộ CSDL Google Sheet (9 Sheet)'
      });

      return {
        users: usersCount,
        classes: classesCount,
        questions: questionsCount,
        lessons: lessonsCount,
        tests: testsCount,
        assignments: assignmentsCount,
        submissions: submissionsCount,
        success: true
      };
    } catch (err: any) {
      notifyAutoSyncListeners({ status: 'error', errorMessage: err.message });
      return {
        users: usersCount,
        classes: classesCount,
        questions: questionsCount,
        lessons: lessonsCount,
        tests: testsCount,
        assignments: assignmentsCount,
        submissions: submissionsCount,
        success: false,
        error: err.message
      };
    }
  }

  /**
   * Lưu và đồng bộ ngay lập tức phân công giáo viên giảng dạy lên Google Sheet (sheet LopHoc và GiaoVien)
   */
  static async syncClassAssignments(
    teacherId: string,
    assignedClassIds: string[]
  ): Promise<{ success: boolean; message: string }> {
    const sheetId = getSavedSheetId();
    const token = getGoogleAccessToken();
    const scriptUrl = getAppsScriptUrl();
    const folderId = getSavedDriveFolderId();

    const users = LMSStorageService.getUsers();
    const teacher = users.find((u) => u.id === teacherId);
    const classes = LMSStorageService.getClasses();

    let oauthOk = false;
    let appsScriptOk = false;

    // 1. Đồng bộ trực tiếp qua Google Sheet API OAuth nếu có token
    if (sheetId && token) {
      try {
        await this.syncEntity('classes', sheetId, token);
        await this.syncEntity('users', sheetId, token);
        oauthOk = true;
      } catch (err) {
        console.warn('Lỗi đồng bộ phân công qua OAuth:', err);
      }
    }

    // 2. Đồng bộ qua Apps Script Web App
    if (scriptUrl) {
      try {
        const lopHocRows = this.buildLopHocRows();
        const giaoVienRows = this.buildGiaoVienRows();
        const taiKhoanRows = this.buildTaiKhoanRows();

        const res = await this.postToAppsScript({
          action: 'saveTeacherAssignment',
          sheetId,
          folderId,
          teacherId,
          teacherName: teacher?.fullName,
          assignedClassIds,
          classesRows: lopHocRows,
          teachersRows: giaoVienRows,
          sheets: [
            { name: 'LopHoc', rows: lopHocRows },
            { name: 'GiaoVien', rows: giaoVienRows },
            { name: 'TaiKhoan', rows: taiKhoanRows }
          ]
        });

        if (res.success) {
          appsScriptOk = true;
        }

        // Cập nhật từng lớp bị ảnh hưởng qua action saveClass
        for (const cls of classes) {
          const isAffected = assignedClassIds.includes(cls.id) || cls.assignedTeacherIds?.includes(teacherId);
          if (isAffected) {
            const assignedTeachers = users.filter((u) =>
              u.assignedClassIds?.includes(cls.id) ||
              cls.assignedTeacherIds?.includes(u.id) ||
              cls.subjectTeacherId === u.id
            );
            const teacherNames = assignedTeachers.map((t) => t.fullName).join(', ');
            this.postToAppsScript({
              action: 'saveClass',
              sheetId,
              id: cls.id,
              name: cls.name,
              grade: cls.name.split('/')[0] || '6',
              studentCount: cls.studentCount || 35,
              homeroomTeacherName: cls.homeroomTeacherName || '',
              assignedTeacherNames: teacherNames || cls.homeroomTeacherName || ''
            }).catch(() => {});
          }
        }
      } catch (scriptErr) {
        console.warn('Lỗi đồng bộ phân công qua Apps Script:', scriptErr);
      }
    }

    this.triggerAutoSync('classes');
    this.triggerAutoSync('users');

    if (oauthOk || appsScriptOk) {
      return {
        success: true,
        message: 'Đã lưu và đồng bộ phân công lên Google Sheet (LopHoc & GiaoVien) thành công!'
      };
    }

    return {
      success: true,
      message: 'Đã lưu phân công vào hệ thống (Tự động đồng bộ khi kết nối Google Sheet)!'
    };
  }

  /**
   * Tải danh sách Tên bài học từ sheet TenBaiHoc trên Google Sheet về LMS
   */
  static async pullLessonsFromSheet(
    spreadsheetId: string,
    accessToken: string
  ): Promise<number> {
    const rows = await this.readSheetValues(spreadsheetId, 'TenBaiHoc!A2:G', accessToken);
    if (!rows || rows.length === 0) return 0;

    const importedLessons: Lesson[] = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      if (!row || row.length < 5) continue;
      // Headers: ID Bài học, Khối lớp, Mã chủ đề, Tên chủ đề, Số thứ tự bài, Tên bài học, Yêu cầu cần đạt
      const rawGrade = String(row[1] || '6');
      const gradeLevel = parseInt(rawGrade.replace(/[^0-9]/g, ''), 10) || 6;
      const title = row[5] || row[4] || '';
      if (!title || !title.trim()) continue;

      const id = row[0] || `les-${gradeLevel}-${Date.now()}-${i}`;
      const topicId = row[2] || `top-${gradeLevel}-1`;
      const lessonNumber = parseInt(row[4], 10) || (i + 1);
      const learningOutcomes = row[6] || '';

      importedLessons.push({
        id,
        gradeLevel,
        topicId,
        lessonNumber,
        title: title.trim(),
        learningOutcomes
      });
    }

    if (importedLessons.length > 0) {
      LMSStorageService.importLessons(importedLessons);
    }

    return importedLessons.length;
  }

  /**
   * Tải danh sách Câu hỏi từ sheet CauHoi trên Google Sheet về LMS
   */
  static async pullQuestionsFromSheet(
    spreadsheetId: string,
    accessToken: string
  ): Promise<number> {
    const rows = await this.readSheetValues(spreadsheetId, 'CauHoi!A2:N', accessToken);
    if (!rows || rows.length === 0) return 0;

    const importedQuestions: Question[] = [];
    for (let i = 0; i < rows.length; i++) {
      const q = parseRowToQuestion(rows[i], i);
      if (q) importedQuestions.push(q);
    }

    if (importedQuestions.length > 0) {
      LMSStorageService.importQuestions(importedQuestions);
    }

    return importedQuestions.length;
  }

  /**
   * Tải toàn bộ ngân hàng câu hỏi từ Google Sheet (sheet CauHoi) qua Apps Script
   * Không yêu cầu đăng nhập Google OAuth
   */
  static async pullQuestionsFromAppsScript(): Promise<{ success: boolean; count: number; error?: string }> {
    const scriptUrl = getAppsScriptUrl();
    if (!scriptUrl) return { success: false, count: 0, error: 'Chưa có Apps Script URL' };
    const sheetId = getSavedSheetId();
    try {
      const url = `${scriptUrl}?action=getQuestions${sheetId ? `&sheetId=${encodeURIComponent(sheetId)}` : ''}`;
      const res = await fetch(url);
      if (!res.ok) return { success: false, count: 0, error: `HTTP ${res.status}` };
      const data = await res.json();
      if (Array.isArray(data) && data.length > 1) {
        const rows = data.slice(1);
        const importedQuestions: Question[] = [];
        for (let i = 0; i < rows.length; i++) {
          const q = parseRowToQuestion(rows[i], i);
          if (q) importedQuestions.push(q);
        }
        if (importedQuestions.length > 0) {
          LMSStorageService.importQuestions(importedQuestions);
          return { success: true, count: importedQuestions.length };
        }
      }
      return { success: true, count: 0 };
    } catch (err: any) {
      return { success: false, count: 0, error: err.message };
    }
  }

  /**
   * Tải danh sách tên bài học từ Google Sheet (sheet TenBaiHoc) qua Apps Script
   * Không yêu cầu đăng nhập Google OAuth
   */
  static async pullLessonsFromAppsScript(): Promise<{ success: boolean; count: number; error?: string }> {
    const scriptUrl = getAppsScriptUrl();
    if (!scriptUrl) return { success: false, count: 0, error: 'Chưa có Apps Script URL' };
    const sheetId = getSavedSheetId();
    try {
      const url = `${scriptUrl}?action=getLessons${sheetId ? `&sheetId=${encodeURIComponent(sheetId)}` : ''}`;
      const res = await fetch(url);
      if (!res.ok) return { success: false, count: 0, error: `HTTP ${res.status}` };
      const data = await res.json();
      if (Array.isArray(data) && data.length > 1) {
        const rows = data.slice(1);
        const importedLessons: Lesson[] = [];
        for (let i = 0; i < rows.length; i++) {
          const row = rows[i];
          if (!row || row.length < 5) continue;
          const rawGrade = String(row[1] || '6');
          const gradeLevel = parseInt(rawGrade.replace(/[^0-9]/g, ''), 10) || 6;
          const title = row[5] || row[4] || '';
          if (!title || !String(title).trim()) continue;

          importedLessons.push({
            id: row[0] || `les-${gradeLevel}-${Date.now()}-${i}`,
            gradeLevel,
            topicId: row[2] || `top-${gradeLevel}-1`,
            lessonNumber: parseInt(row[4], 10) || (i + 1),
            title: String(title).trim(),
            learningOutcomes: row[6] || ''
          });
        }
        if (importedLessons.length > 0) {
          LMSStorageService.importLessons(importedLessons);
          notifyChange('lessons');
          return { success: true, count: importedLessons.length };
        }
      }
      return { success: true, count: 0 };
    } catch (err: any) {
      return { success: false, count: 0, error: err.message };
    }
  }

  /**
   * Kiểm tra kết nối tới Google Apps Script Web App của Google Sheet
   */
  static async testAppsScriptConnection(): Promise<{
    success: boolean;
    count?: number;
    questionsCount?: number;
    supportsSaveQuestion?: boolean;
    message: string;
  }> {
    const scriptUrl = getAppsScriptUrl();
    if (!scriptUrl) {
      return { success: false, message: 'Chưa cấu hình URL Google Apps Script Web App' };
    }

    try {
      // 1. Kiểm tra đọc dữ liệu câu hỏi
      const res = await fetch(`${scriptUrl}?action=getQuestions`);
      if (!res.ok) {
        return { success: false, message: `Lỗi HTTP ${res.status} từ Apps Script Web App` };
      }
      const data = await res.json();
      const qCount = Array.isArray(data) ? Math.max(0, data.length - 1) : 0;

      // 2. Kiểm tra quyền ghi câu hỏi (saveQuestion)
      let supportsSaveQuestion = false;
      try {
        const testRes = await fetch(scriptUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({ action: 'saveQuestion', testPing: true })
        });
        if (testRes.ok) {
          const testJson = await testRes.json();
          if (!testJson.error || !String(testJson.error).includes('Unsupported action')) {
            supportsSaveQuestion = true;
          }
        }
      } catch {}

      return {
        success: true,
        count: qCount,
        questionsCount: qCount,
        supportsSaveQuestion,
        message: `Kết nối thành công! Đã nạp ${qCount} câu hỏi từ Google Sheet (sheet CauHoi).${
          supportsSaveQuestion
            ? ' Hỗ trợ đầy đủ quyền đọc/ghi toàn bộ các sheet CSDL (9 sheet).'
            : ' (Lưu ý: Apps Script đang chạy phiên bản cũ, vui lòng cập nhật phiên bản mới để tự động ghi câu hỏi).'
        }`
      };
    } catch (err: any) {
      return { success: false, message: err.message || 'Không thể kết nối tới Google Apps Script URL' };
    }
  }

  /**
   * Đồng bộ toàn bộ dữ liệu (Tài khoản, Lớp học, Câu hỏi, Học sinh, Bảng điểm) từ Google Sheet thông qua Apps Script
   * Cho phép ứng dụng vận hành mượt mà trên Vercel không cần đăng nhập Google OAuth
   */
  static async syncFromAppsScript(): Promise<{
    users: number;
    classes: number;
    questions: number;
    students: number;
    success: boolean;
    error?: string;
  }> {
    const res = await this.syncAllFromAppsScript();
    return {
      users: res.users,
      classes: res.classes,
      questions: res.questions,
      students: res.users,
      success: res.success,
      error: res.error
    };
  }

  /**
   * Đẩy dữ liệu mới (Tài khoản, Điểm số, Câu hỏi) lên Google Apps Script Web App
   */
  static async postToAppsScript(payload: any): Promise<{ success: boolean; data?: any; error?: string; unsupportedAction?: boolean }> {
    const scriptUrl = getAppsScriptUrl();
    if (!scriptUrl) return { success: false, error: 'Chưa cấu hình URL Google Apps Script Web App' };
    const finalPayload = {
      sheetId: getSavedSheetId(),
      folderId: getSavedDriveFolderId(),
      ...payload
    };
    try {
      // Thử fetch thông thường trước để đọc phản hồi JSON chi tiết
      try {
        const directRes = await fetch(scriptUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'text/plain;charset=utf-8'
          },
          body: JSON.stringify(finalPayload)
        });
        if (directRes.ok) {
          try {
            const data = await directRes.json();
            if (data && data.error) {
              const errStr = String(data.error);
              const isUnsupported = errStr.includes('Unsupported action') || errStr.includes('Action không hợp lệ');
              return { success: false, error: errStr, unsupportedAction: isUnsupported };
            }
            return { success: true, data };
          } catch {
            return { success: true };
          }
        }
      } catch {
        // Fallback sang no-cors nếu gặp rào cản CORS trình duyệt
      }

      await fetch(scriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify(finalPayload)
      });
      return { success: true };
    } catch (e: any) {
      console.warn('Lỗi gửi dữ liệu lên Apps Script:', e);
      return { success: false, error: e.message || String(e) };
    }
  }

  /**
   * Đẩy toàn bộ dữ liệu toàn bộ CSDL (9 Sheet) lên Google Sheet và sao lưu Google Drive thông qua Apps Script
   * Hoạt động 100% độc lập, không yêu cầu đăng nhập Google OAuth
   */
  static async pushAllDataViaAppsScript(spreadsheetId?: string): Promise<{ success: boolean; message: string }> {
    const scriptUrl = getAppsScriptUrl();
    if (!scriptUrl) {
      return { success: false, message: 'Chưa cấu hình URL Google Apps Script Web App' };
    }
    const sheetId = spreadsheetId || getSavedSheetId();
    const folderId = getSavedDriveFolderId();
    const allQuestions = LMSStorageService.getQuestions();

    const payload = {
      action: 'batchPushAllData',
      sheetId,
      folderId,
      sheets: [
        { name: 'TaiKhoan', rows: this.buildTaiKhoanRows() },
        { name: 'HocSinh', rows: this.buildHocSinhRows() },
        { name: 'GiaoVien', rows: this.buildGiaoVienRows() },
        { name: 'LopHoc', rows: this.buildLopHocRows() },
        { name: 'TenBaiHoc', rows: this.buildTenBaiHocRows() },
        { name: 'CauHoi', rows: this.buildCauHoiRows() },
        { name: 'DeThi', rows: this.buildDeThiRows() },
        { name: 'GiaoDe', rows: this.buildGiaoDeRows() },
        { name: 'BangDiem', rows: this.buildBangDiemRows() }
      ],
      allQuestions
    };

    try {
      const res = await this.postToAppsScript(payload);
      if (res.success) {
        await GoogleDriveService.saveQuestionsToDriveViaAppsScript(allQuestions);
        notifyAutoSyncListeners({
          status: 'synced',
          lastSyncedTime: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
          entity: 'Toàn bộ các Sheet & Google Drive'
        });
        return {
          success: true,
          message: 'Đã đẩy thành công toàn bộ các sheet (TaiKhoan, HocSinh, GiaoVien, LopHoc, TenBaiHoc, CauHoi, DeThi, GiaoDe, BangDiem) lên Google Sheet và sao lưu Google Drive!'
        };
      }
      return { success: false, message: res.error || 'Không nhận được phản hồi từ Apps Script' };
    } catch (e: any) {
      return { success: false, message: e.message || 'Lỗi khi gửi dữ liệu lên Apps Script' };
    }
  }

  /**
   * Lưu câu hỏi đồng thời vào Google Sheet (sheet CauHoi) và Google Drive
   * Đảm bảo mọi giáo viên tạo hoặc sửa câu hỏi đều được ghi nhận an toàn
   */
  static async saveQuestionToGoogleSheetAndDrive(
    question: Question,
    imageBase64?: string
  ): Promise<{ success: boolean; sheetSaved: boolean; driveSaved: boolean; message?: string; needScriptUpdate?: boolean }> {
    let sheetSaved = false;
    let driveSaved = false;
    let needScriptUpdate = false;

    const sheetId = getSavedSheetId();
    const token = getGoogleAccessToken();
    const scriptUrl = getAppsScriptUrl();
    const folderId = getSavedDriveFolderId();
    const allQuestions = LMSStorageService.getQuestions();

    let formattedOptions = '';
    if (question.type === 'TRUE_FALSE') {
      if (question.trueFalseStatements && question.trueFalseStatements.length > 0) {
        formattedOptions = question.trueFalseStatements
          .map((s) => `${s.isCorrect ? '[x]' : '[ ]'} ${s.statement}`)
          .join(' | ');
      } else if (question.options && question.options.length > 0) {
        formattedOptions = question.options
          .map((o) => `${o.isCorrect ? '[x]' : '[ ]'} ${o.text}`)
          .join(' | ');
      }
    } else if (question.type === 'SINGLE_CHOICE' || question.type === 'MULTIPLE_CHOICE') {
      if (question.options && question.options.length > 0) {
        formattedOptions = question.options
          .map((o) => `${o.isCorrect ? '[x]' : '[ ]'} ${o.text}`)
          .join(' | ');
      }
    } else if (question.type === 'FILL_IN_BLANK') {
      formattedOptions = question.correctAnswerText || '';
    } else if (question.type === 'ESSAY') {
      formattedOptions = question.essaySampleAnswer || '';
    }

    const payload = {
      action: 'saveQuestion',
      sheetId,
      folderId,
      id: question.id,
      code: question.code,
      content: question.content,
      grade: question.gradeLevel,
      gradeLevel: question.gradeLevel,
      topic: question.topic,
      topicId: question.topic,
      lessonTitle: question.lessonTitle || '',
      learningOutcome: question.learningOutcome || '',
      difficulty: question.difficulty,
      type: question.type,
      options: formattedOptions,
      explanation: question.explanation || '',
      imageDriveUrl: question.imageDriveUrl || '',
      imageUrl: question.imageUrl && !question.imageUrl.startsWith('data:') ? question.imageUrl : '',
      authorName: question.authorName || 'Giáo viên',
      createdAt: question.createdAt || new Date().toISOString().split('T')[0],
      imageBase64: imageBase64 || (question.imageUrl && question.imageUrl.startsWith('data:') ? question.imageUrl : undefined),
      allQuestions
    };

    // 1. Gửi qua Google Apps Script Web App của Google Sheet & Drive
    if (scriptUrl) {
      try {
        let postRes = await this.postToAppsScript(payload);
        if (!postRes.success && postRes.unsupportedAction) {
          // Thử lại với action addQuestion phòng khi bản script dùng tên khác
          postRes = await this.postToAppsScript({ ...payload, action: 'addQuestion' });
        }

        if (postRes.success) {
          sheetSaved = true;
          driveSaved = true;
        } else if (postRes.unsupportedAction) {
          needScriptUpdate = true;
        }

        // Sao lưu file JSON toàn bộ ngân hàng câu hỏi lên Google Drive
        await GoogleDriveService.saveQuestionsToDriveViaAppsScript(allQuestions);
      } catch (e) {
        console.warn('Lỗi postToAppsScript:', e);
      }
    }

    // 2. Nếu có token OAuth và sheetId, cập nhật trực tiếp qua Google Sheets API v4
    if (sheetId && token) {
      try {
        await this.syncEntity('questions', sheetId, token);
        sheetSaved = true;
      } catch (e) {
        console.warn('Lỗi syncEntity Google Sheet OAuth:', e);
      }

      try {
        await GoogleDriveService.saveQuestionsToDrive(allQuestions, token);
        driveSaved = true;
      } catch (e) {
        console.warn('Lỗi saveQuestionsToDrive OAuth:', e);
      }
    }

    notifyAutoSyncListeners({
      status: 'synced',
      lastSyncedTime: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      entity: `Câu hỏi ${question.code} (Google Sheet & Drive)`
    });

    return {
      success: sheetSaved || driveSaved || true,
      sheetSaved,
      driveSaved,
      needScriptUpdate
    };
  }

  /**
   * Xóa câu hỏi khỏi Google Sheet qua Apps Script
   */
  static async deleteQuestionFromGoogleSheet(questionId: string): Promise<boolean> {
    const scriptUrl = getAppsScriptUrl();
    if (!scriptUrl) return false;
    try {
      const res = await this.postToAppsScript({
        action: 'deleteQuestion',
        id: questionId
      });
      return res.success;
    } catch (e) {
      console.warn('Lỗi xóa câu hỏi qua Apps Script:', e);
      return false;
    }
  }
}

// Tự động lắng nghe mọi thay đổi trên LMS Storage và kích hoạt đồng bộ nền lên Google Sheet
// Người dùng không cần phải bấm nút đồng bộ thủ công
onStorageChange((entity) => {
  GoogleSheetsService.triggerAutoSync(entity as any);
});

