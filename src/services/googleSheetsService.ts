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
import { LMSStorageService } from './storage';
import { onStorageChange } from './storageEvents';
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
  type SystemConnectionConfig
};
import {
  User,
  UserRole,
  Lesson,
  Question,
  QuestionDifficulty,
  QuestionType,
  OptionItem,
  TrueFalseStatement
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
  'BangDiem'
];

/**
 * Service thao tác với Google Sheets API v4
 * Tự động cập nhật dữ liệu ở Google Sheet khi tạo thêm Lớp, Học sinh, Câu hỏi,... Không cần bấm đồng bộ
 */
export class GoogleSheetsService {
  private static syncTimeout: any = null;
  private static pendingEntities: Set<string> = new Set();

  /**
   * Tạo một Google Spreadsheet mới làm Database cho LMS với đầy đủ 7 sheet quản lý
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
   * Đảm bảo tất cả 7 sheet quản lý luôn tồn tại trên bảng tính
   */
  static async ensureSheetsExist(spreadsheetId: string, accessToken: string): Promise<void> {
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
      }
    } catch (e) {
      console.warn('Could not auto-add missing sheets:', e);
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

  private static buildTaiKhoanRows(): any[][] {
    const users = LMSStorageService.getUsers();
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
        'Ngày tạo'
      ],
      ...users.map((u) => [
        u.id,
        u.username || u.email.split('@')[0],
        u.password || (u.role === 'STUDENT' ? '123456' : 'phuho@2025'),
        u.fullName,
        u.email,
        u.role,
        u.studentCode || u.teacherCode || '',
        u.gradeId ? u.gradeId.replace('grade-', 'Khối ') : '',
        classes.find((c) => c.id === u.classId)?.name || '',
        u.phone || '',
        u.status || 'ACTIVE',
        u.createdAt
      ])
    ];
  }

  private static buildHocSinhRows(): any[][] {
    const students = LMSStorageService.getUsers().filter((u) => u.role === 'STUDENT');
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
        'Ngày tạo'
      ],
      ...students.map((u) => [
        u.id,
        u.fullName,
        u.studentCode || '',
        u.username || u.email.split('@')[0],
        u.password || '123456',
        classes.find((c) => c.id === u.classId)?.name || '6/1',
        u.gradeId ? u.gradeId.replace('grade-', 'Khối ') : 'Khối 6',
        u.email,
        u.phone || '',
        u.status || 'ACTIVE',
        u.createdAt
      ])
    ];
  }

  private static buildGiaoVienRows(): any[][] {
    const staff = LMSStorageService.getUsers().filter((u) => u.role !== 'STUDENT');
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
        'Ngày tạo'
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
          ? u.assignedClassIds.map((cid) => classes.find((c) => c.id === cid)?.name).filter(Boolean).join(', ')
          : 'Toàn trường',
        u.status || 'ACTIVE',
        u.createdAt
      ])
    ];
  }

  private static buildLopHocRows(): any[][] {
    const classes = LMSStorageService.getClasses();
    return [
      ['ID', 'Tên lớp', 'Khối', 'Sĩ số', 'Giáo viên chủ nhiệm'],
      ...classes.map((c) => [
        c.id,
        c.name,
        c.name.split('/')[0] || '6',
        c.studentCount,
        c.homeroomTeacherName || ''
      ])
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
      ['ID', 'Tên đề thi', 'Khối', 'Thời gian (phút)', 'Số câu', 'Mã đề', 'Tác giả', 'Ngày tạo'],
      ...tests.map((t) => [
        t.id,
        t.title,
        t.gradeLevel,
        t.durationMinutes,
        t.totalQuestions,
        t.variants.map((v) => v.code).join(', '),
        t.authorName,
        t.createdAt
      ])
    ];
  }

  private static buildBangDiemRows(): any[][] {
    const submissions = LMSStorageService.getSubmissions();
    return [
      ['ID Bài nộp', 'Họ tên học sinh', 'Mã số HS', 'Lớp', 'Tên bài thi', 'Mã đề', 'Điểm số', 'Đúng/Tổng câu', 'Thời gian nộp'],
      ...submissions.map((s) => [
        s.id,
        s.studentName,
        s.studentCode,
        s.className,
        s.testTitle,
        s.variantCode,
        s.score,
        `${s.correctCount}/${s.totalQuestions}`,
        new Date(s.submittedAt).toLocaleString('vi-VN')
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
      { range: 'BangDiem!A1', values: this.buildBangDiemRows() }
    ];

    // Clear old contents to prevent ghost rows
    for (const item of batchData) {
      const sheetName = item.range.split('!')[0];
      await this.clearRange(spreadsheetId, `${sheetName}!A:Z`, accessToken);
    }

    const res = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchUpdate`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          valueInputOption: 'USER_ENTERED',
          data: batchData
        })
      }
    );

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error?.message || 'Không thể đồng bộ dữ liệu lên Google Sheet');
    }
  }

  /**
   * Tự động đồng bộ một thực thể cụ thể lên Google Sheet
   */
  static async syncEntity(
    entity: 'users' | 'classes' | 'questions' | 'tests' | 'submissions' | 'lessons' | 'all',
    spreadsheetId: string,
    accessToken: string
  ): Promise<void> {
    await this.ensureSheetsExist(spreadsheetId, accessToken);

    const updates: { range: string; values: any[][] }[] = [];

    if (entity === 'users' || entity === 'all') {
      updates.push(
        { range: 'TaiKhoan!A1', values: this.buildTaiKhoanRows() },
        { range: 'HocSinh!A1', values: this.buildHocSinhRows() },
        { range: 'GiaoVien!A1', values: this.buildGiaoVienRows() }
      );
    }

    if (entity === 'classes' || entity === 'all') {
      updates.push({ range: 'LopHoc!A1', values: this.buildLopHocRows() });
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

    if (entity === 'submissions' || entity === 'all') {
      updates.push({ range: 'BangDiem!A1', values: this.buildBangDiemRows() });
    }

    if (updates.length === 0) return;

    for (const item of updates) {
      const sheetName = item.range.split('!')[0];
      await this.clearRange(spreadsheetId, `${sheetName}!A:Z`, accessToken);
    }

    const res = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchUpdate`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          valueInputOption: 'USER_ENTERED',
          data: updates
        })
      }
    );

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error?.message || `Lỗi đồng bộ ${entity} lên Google Sheet`);
    }
  }

  /**
   * TỰ ĐỘNG CẬP NHẬT GOOGLE SHEET TRONG NỀN (BACKGROUND AUTO-SYNC)
   * Được gọi tự động mỗi khi thêm/sửa/xóa Lớp, Học sinh, Người dùng, Câu hỏi,...
   * Không cần người dùng bấm đồng bộ thủ công!
   */
  static triggerAutoSync(entity: 'users' | 'classes' | 'questions' | 'tests' | 'submissions' | 'lessons' | 'all'): void {
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
        if (sheetId && token) {
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
        }

        // Tự động đẩy dữ liệu lên Google Apps Script Web App nếu có cấu hình
        if (scriptUrl) {
          for (const ent of entitiesToSync) {
            if (ent === 'users' || ent === 'all') {
              const users = LMSStorageService.getUsers();
              if (users.length > 0) {
                const u = users[0];
                this.postToAppsScript({
                  action: 'addUser',
                  id: u.id,
                  username: u.username,
                  password: u.password,
                  fullName: u.fullName,
                  email: u.email,
                  role: u.role,
                  code: u.studentCode || u.teacherCode || '',
                  className: u.classId || '',
                  phone: u.phone || ''
                });
              }
            } else if (ent === 'submissions' || ent === 'all') {
              const subs = LMSStorageService.getSubmissions();
              if (subs.length > 0) {
                const s = subs[0];
                this.postToAppsScript({
                  action: 'addSubmission',
                  id: s.id,
                  studentName: s.studentName,
                  studentCode: s.studentCode,
                  className: s.className,
                  testTitle: s.testTitle,
                  variantCode: s.variantCode || '101',
                  score: s.score,
                  correctCount: s.correctCount,
                  totalQuestions: s.totalQuestions
                });
              }
            } else if (ent === 'questions' || ent === 'all') {
              const qs = LMSStorageService.getQuestions();
              if (qs.length > 0) {
                const q = qs[0];
                this.postToAppsScript({
                  action: 'saveQuestion',
                  id: q.id,
                  code: q.code,
                  content: q.content,
                  grade: q.gradeLevel,
                  gradeLevel: q.gradeLevel,
                  topic: q.topic,
                  topicId: q.topic,
                  lessonTitle: q.lessonTitle || '',
                  learningOutcome: q.learningOutcome || '',
                  difficulty: q.difficulty,
                  type: q.type,
                  options: q.options
                    ? q.options.map((o) => `${o.isCorrect ? '[x]' : '[ ]'} ${o.text}`).join(' | ')
                    : q.correctAnswerText || q.essaySampleAnswer || '',
                  explanation: q.explanation || '',
                  imageDriveUrl: q.imageDriveUrl || q.imageUrl || '',
                  authorName: q.authorName || 'Giáo viên',
                  createdAt: q.createdAt
                });
              }
            }
          }
        }

        const now = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        notifyAutoSyncListeners({
          status: 'synced',
          lastSyncedTime: now,
          entity: entitiesToSync.join(', ')
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
   * Tải toàn bộ tài khoản, tên đăng nhập & mật khẩu từ sheet TaiKhoan về cập nhật vào LMS
   */
  static async pullAccountsFromSheet(
    spreadsheetId: string,
    accessToken: string
  ): Promise<number> {
    const rows = await this.readSheetValues(spreadsheetId, 'TaiKhoan!A2:L', accessToken);
    if (!rows || rows.length === 0) {
      // Fallback: nếu chưa có TaiKhoan thì đọc từ HocSinh
      return this.pullStudentsFromSheet(spreadsheetId, accessToken);
    }

    const classes = LMSStorageService.getClasses();
    const existingUsers = LMSStorageService.getUsers();
    let updatedCount = 0;

    const importedUsers: User[] = [];

    for (const row of rows) {
      if (!row || row.length < 4) continue;
      // Headers: ID, Username, Password, FullName, Email, Role, Code, Grade, Class, Phone, Status, CreatedAt
      const id = row[0] || `user-gsheet-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      const username = row[1] || row[4]?.split('@')[0] || `user_${Date.now()}`;
      const password = row[2] || '123456';
      const fullName = row[3] || 'Người dùng';
      const email = row[4] || `${username}@thcs-phuho.edu.vn`;
      const role = (row[5] as UserRole) || 'STUDENT';
      const code = row[6] || '';
      const className = row[8] || '';

      const matchedClass = classes.find((c) => c.name === className);

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
        gradeId: matchedClass?.gradeId || (role === 'STUDENT' ? 'grade-6' : undefined),
        studentCode: role === 'STUDENT' ? code : undefined,
        teacherCode: role !== 'STUDENT' ? code : undefined,
        status: (row[10] === 'LOCKED' ? 'LOCKED' : 'ACTIVE') as 'ACTIVE' | 'LOCKED',
        createdAt: row[11] || new Date().toISOString().split('T')[0]
      };

      importedUsers.push(userObj);
      updatedCount++;
    }

    if (importedUsers.length > 0) {
      // Merge users by username or email or id
      const userMap = new Map<string, User>();
      existingUsers.forEach((u) => userMap.set(u.id, u));
      importedUsers.forEach((u) => userMap.set(u.id, u));
      const merged = Array.from(userMap.values());
      localStorage.setItem('phuho_lms_users', JSON.stringify(merged));
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
    const rows = await this.readSheetValues(spreadsheetId, 'HocSinh!A2:K', accessToken);
    const classes = LMSStorageService.getClasses();

    const importedUsers: User[] = [];

    for (const row of rows) {
      if (!row || row.length < 2) continue;
      // Headers: ID, Họ và tên, Mã số HS, Tên đăng nhập, Mật khẩu, Lớp, Khối, Email, Số điện thoại, Trạng thái, Ngày tạo
      const id = row[0] || `user-gsheet-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      const fullName = row[1] || 'Học sinh';
      const studentCode = row[2] || `PH25-${Math.floor(100000 + Math.random() * 900000)}`;
      const username = row[3] || `hs.${studentCode.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
      const password = row[4] || '123456';
      const className = row[5] || '6/1';
      const email = row[7] || `${username}@thcs-phuho.edu.vn`;

      const matchedClass = classes.find((c) => c.name === className) || classes[0];

      importedUsers.push({
        id,
        username,
        password,
        fullName,
        email,
        role: 'STUDENT',
        schoolId: 'school-phuho-01',
        classId: matchedClass?.id,
        gradeId: matchedClass?.gradeId || 'grade-6',
        studentCode,
        phone: row[8] || '',
        status: (row[9] === 'LOCKED' ? 'LOCKED' : 'ACTIVE') as 'ACTIVE' | 'LOCKED',
        createdAt: row[10] || new Date().toISOString().split('T')[0]
      });
    }

    if (importedUsers.length > 0) {
      LMSStorageService.importStudents(importedUsers);
    }

    return importedUsers.length;
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
      const topicId = row[2] || 'top-a';
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
      const row = rows[i];
      if (!row || !row[2]) continue;

      const id = String(row[0] || `q-${Date.now()}-${i}`);
      const code = String(row[1] || '').trim();
      const content = String(row[2]).trim();
      const rawGrade = String(row[3] || '6');
      const gradeLevel = parseInt(rawGrade.replace(/[^0-9]/g, ''), 10) || 6;
      const topic = String(row[4] || 'Chủ đề A: Máy tính và cộng đồng').trim();

      let lessonTitle = '';
      let learningOutcome = '';
      let difficulty: QuestionDifficulty = 'BIET';
      let type: QuestionType = 'SINGLE_CHOICE';
      let rawOptions = '';
      let explanation = '';
      let imageDriveUrl = '';
      let authorName = 'Giáo viên';
      let createdAt = new Date().toISOString().split('T')[0];

      const is14Col = ['BIET', 'HIEU', 'VAN_DUNG', 'VAN_DUNG_CAO'].includes(String(row[7]).toUpperCase());
      if (is14Col) {
        lessonTitle = String(row[5] || '');
        learningOutcome = String(row[6] || '');
        difficulty = (['BIET', 'HIEU', 'VAN_DUNG', 'VAN_DUNG_CAO'].includes(String(row[7]).toUpperCase())
          ? String(row[7]).toUpperCase()
          : 'BIET') as QuestionDifficulty;
        type = (['SINGLE_CHOICE', 'MULTIPLE_CHOICE', 'TRUE_FALSE', 'FILL_IN_BLANK', 'ESSAY'].includes(String(row[8]))
          ? String(row[8])
          : 'SINGLE_CHOICE') as QuestionType;
        rawOptions = String(row[9] || '');
        explanation = String(row[10] || '');
        imageDriveUrl = String(row[11] || '');
        authorName = String(row[12] || 'Giáo viên');
        createdAt = String(row[13] || createdAt);
      } else {
        difficulty = (['BIET', 'HIEU', 'VAN_DUNG', 'VAN_DUNG_CAO'].includes(String(row[5]).toUpperCase())
          ? String(row[5]).toUpperCase()
          : 'BIET') as QuestionDifficulty;
        type = (['SINGLE_CHOICE', 'MULTIPLE_CHOICE', 'TRUE_FALSE', 'FILL_IN_BLANK', 'ESSAY'].includes(String(row[6]))
          ? String(row[6])
          : 'SINGLE_CHOICE') as QuestionType;
        rawOptions = String(row[7] || '');
        explanation = String(row[8] || '');
        imageDriveUrl = String(row[9] || '');
        authorName = String(row[10] || 'Giáo viên');
        createdAt = String(row[11] || createdAt);
      }

      const options: OptionItem[] = [];
      const trueFalseStatements: TrueFalseStatement[] = [];
      if (rawOptions && rawOptions.includes('|')) {
        const parts = rawOptions.split('|');
        parts.forEach((p, idx) => {
          const trimmedP = p.trim();
          const isCorrect = trimmedP.startsWith('[x]') || trimmedP.startsWith('[X]');
          const text = trimmedP.replace(/^\[[ xX]\]\s*/, '');
          options.push({
            id: `opt-${id}-${idx + 1}`,
            text,
            isCorrect
          });
          if (type === 'TRUE_FALSE') {
            trueFalseStatements.push({
              id: `tf-${id}-${idx + 1}`,
              statement: text,
              isCorrect
            });
          }
        });
      }

      const directImageUrl = GoogleDriveService.getDriveDirectImageUrl(imageDriveUrl);

      importedQuestions.push({
        id,
        code: code || `TH${gradeLevel}-00${i + 1}`,
        content,
        gradeLevel,
        topic,
        lessonTitle: lessonTitle || 'Bài 1: Thông tin và dữ liệu',
        learningOutcome: learningOutcome || 'Chuẩn kiến thức GDPT 2018',
        difficulty,
        type,
        options: options.length > 0 ? options : [
          { id: `opt-${id}-1`, text: 'Đáp án A', isCorrect: true },
          { id: `opt-${id}-2`, text: 'Đáp án B', isCorrect: false },
          { id: `opt-${id}-3`, text: 'Đáp án C', isCorrect: false },
          { id: `opt-${id}-4`, text: 'Đáp án D', isCorrect: false }
        ],
        trueFalseStatements: trueFalseStatements.length > 0 ? trueFalseStatements : undefined,
        correctAnswerText: type === 'FILL_IN_BLANK' ? rawOptions.replace(/^\[[ xX]\]\s*/, '') : undefined,
        essaySampleAnswer: type === 'ESSAY' ? rawOptions : undefined,
        explanation,
        imageDriveUrl: imageDriveUrl || undefined,
        imageUrl: directImageUrl || undefined,
        createdBy: 'system',
        authorName,
        createdAt,
        status: 'ACTIVE'
      });
    }

    if (importedQuestions.length > 0) {
      LMSStorageService.importQuestions(importedQuestions);
    }

    return importedQuestions.length;
  }

  /**
   * Kiểm tra kết nối tới Google Apps Script Web App của Google Sheet
   */
  static async testAppsScriptConnection(): Promise<{ success: boolean; count?: number; message: string }> {
    const scriptUrl = getAppsScriptUrl();
    if (!scriptUrl) {
      return { success: false, message: 'Chưa cấu hình URL Google Apps Script Web App' };
    }

    try {
      const res = await fetch(`${scriptUrl}?action=getAccounts`);
      if (!res.ok) {
        return { success: false, message: `Lỗi HTTP ${res.status} từ Apps Script` };
      }
      const data = await res.json();
      if (Array.isArray(data)) {
        return {
          success: true,
          count: Math.max(0, data.length - 1),
          message: `Kết nối thành công! Đã tìm thấy ${Math.max(0, data.length - 1)} tài khoản trong Google Sheet.`
        };
      }
      return { success: false, message: data.error || 'Dữ liệu trả về không hợp lệ' };
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
    const scriptUrl = getAppsScriptUrl();
    if (!scriptUrl) {
      return { users: 0, classes: 0, questions: 0, students: 0, success: false, error: 'Chưa có Apps Script URL' };
    }

    notifyAutoSyncListeners({ status: 'syncing', entity: 'all' });
    let usersCount = 0;
    let classesCount = 0;
    let questionsCount = 0;
    let studentsCount = 0;

    try {
      // 1. Tải danh sách Lớp học trước
      try {
        const clsRes = await fetch(`${scriptUrl}?action=getClasses`);
        if (clsRes.ok) {
          const clsData = await clsRes.json();
          if (Array.isArray(clsData) && clsData.length > 1) {
            const rows = clsData.slice(1);
            const importedClasses: any[] = [];
            for (const row of rows) {
              if (!row || !row[0]) continue;
              const id = String(row[0]);
              let name = String(row[1] || '6/1');
              if (name.includes('T') && name.includes('-')) {
                const d = new Date(name);
                if (!isNaN(d.getTime())) {
                  name = `${d.getMonth() + 1}/${d.getDate()}`;
                }
              }
              const rawGrade = String(row[2] || '6');
              const gradeNum = parseInt(rawGrade.replace(/[^0-9]/g, ''), 10) || 6;
              const count = parseInt(String(row[3] || '35'), 10) || 35;
              const homeroom = String(row[4] || '');

              importedClasses.push({
                id,
                name,
                gradeId: `grade-${gradeNum}`,
                academicYearId: 'ay-2025-2026',
                studentCount: count,
                homeroomTeacherName: homeroom
              });
            }
            if (importedClasses.length > 0) {
              LMSStorageService.importClasses(importedClasses);
              classesCount = importedClasses.length;
            }
          }
        }
      } catch (e) {
        console.warn('Lỗi tải classes từ Apps Script:', e);
      }

      // 2. Tải danh sách Tài khoản
      try {
        const accRes = await fetch(`${scriptUrl}?action=getAccounts`);
        if (accRes.ok) {
          const accData = await accRes.json();
          if (Array.isArray(accData) && accData.length > 1) {
            const rows = accData.slice(1);
            const classes = LMSStorageService.getClasses();
            const importedUsers: User[] = [];

            for (const row of rows) {
              if (!row || !row[1]) continue;
              const id = String(row[0] || `user-gsheet-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`);
              const username = String(row[1]).trim();
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

              const matchedClass = classes.find((c) => c.name === classStr);

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
                  (gradeStr.includes('6')
                    ? 'grade-6'
                    : gradeStr.includes('7')
                    ? 'grade-7'
                    : gradeStr.includes('8')
                    ? 'grade-8'
                    : gradeStr.includes('9')
                    ? 'grade-9'
                    : undefined),
                phone,
                status,
                schoolId: 'school-phuho-01',
                createdAt
              });
            }

            if (importedUsers.length > 0) {
              const existingUsers = LMSStorageService.getUsers();
              const userMap = new Map<string, User>();
              existingUsers.forEach((u) => userMap.set(u.username.toLowerCase(), u));
              importedUsers.forEach((u) => userMap.set(u.username.toLowerCase(), u));
              const merged = Array.from(userMap.values());
              localStorage.setItem('phuho_lms_users', JSON.stringify(merged));
              usersCount = importedUsers.length;
            }
          }
        }
      } catch (e) {
        console.warn('Lỗi tải accounts từ Apps Script:', e);
      }

      // 3. Tải Ngân hàng Câu hỏi
      try {
        const qRes = await fetch(`${scriptUrl}?action=getQuestions`);
        if (qRes.ok) {
          const qData = await qRes.json();
          if (Array.isArray(qData) && qData.length > 1) {
            const rows = qData.slice(1);
            const importedQuestions: Question[] = [];

            for (let i = 0; i < rows.length; i++) {
              const row = rows[i];
              if (!row || !row[2]) continue;
              const id = String(row[0] || `q-${Date.now()}-${i}`);
              const code = String(row[1] || '').trim();
              const content = String(row[2]).trim();
              const rawGrade = String(row[3] || '6');
              const gradeLevel = parseInt(rawGrade.replace(/[^0-9]/g, ''), 10) || 6;
              const rawTopic = String(row[4] || 'Chủ đề A: Máy tính và cộng đồng').trim();
              const topic = rawTopic || 'Chủ đề A: Máy tính và cộng đồng';

              let lessonTitle = '';
              let learningOutcome = '';
              let difficulty: QuestionDifficulty = 'BIET';
              let type: QuestionType = 'SINGLE_CHOICE';
              let rawOptions = '';
              let explanation = '';
              let imageDriveUrl = '';
              let author = 'Giáo viên';
              let createdAt = new Date().toISOString().split('T')[0];

              const is14Col = ['BIET', 'HIEU', 'VAN_DUNG', 'VAN_DUNG_CAO'].includes(String(row[7]).toUpperCase());
              if (is14Col) {
                lessonTitle = String(row[5] || '');
                learningOutcome = String(row[6] || '');
                difficulty = (['BIET', 'HIEU', 'VAN_DUNG', 'VAN_DUNG_CAO'].includes(String(row[7]).toUpperCase())
                  ? String(row[7]).toUpperCase()
                  : 'BIET') as QuestionDifficulty;
                type = (['SINGLE_CHOICE', 'MULTIPLE_CHOICE', 'TRUE_FALSE', 'FILL_IN_BLANK', 'ESSAY'].includes(String(row[8]))
                  ? String(row[8])
                  : 'SINGLE_CHOICE') as QuestionType;
                rawOptions = String(row[9] || '');
                explanation = String(row[10] || '');
                imageDriveUrl = String(row[11] || '');
                author = String(row[12] || 'Giáo viên');
                createdAt = String(row[13] || createdAt);
              } else {
                difficulty = (['BIET', 'HIEU', 'VAN_DUNG', 'VAN_DUNG_CAO'].includes(String(row[5]).toUpperCase())
                  ? String(row[5]).toUpperCase()
                  : 'BIET') as QuestionDifficulty;
                type = (['SINGLE_CHOICE', 'MULTIPLE_CHOICE', 'TRUE_FALSE', 'FILL_IN_BLANK', 'ESSAY'].includes(String(row[6]))
                  ? String(row[6])
                  : 'SINGLE_CHOICE') as QuestionType;
                rawOptions = String(row[7] || '');
                explanation = String(row[8] || '');
                imageDriveUrl = String(row[9] || '');
                author = String(row[10] || 'Giáo viên');
                createdAt = String(row[11] || createdAt);
              }

              const directImageUrl = GoogleDriveService.getDriveDirectImageUrl(imageDriveUrl);

              const options: OptionItem[] = [];
              const trueFalseStatements: TrueFalseStatement[] = [];
              if (rawOptions && rawOptions.includes('|')) {
                const parts = rawOptions.split('|');
                parts.forEach((p, idx) => {
                  const trimmedP = p.trim();
                  const isCorrect = trimmedP.startsWith('[x]') || trimmedP.startsWith('[X]');
                  const text = trimmedP.replace(/^\[[ xX]\]\s*/, '');
                  options.push({
                    id: `opt-${id}-${idx + 1}`,
                    text,
                    isCorrect
                  });
                  if (type === 'TRUE_FALSE') {
                    trueFalseStatements.push({
                      id: `tf-${id}-${idx + 1}`,
                      statement: text,
                      isCorrect
                    });
                  }
                });
              }

              importedQuestions.push({
                id,
                code: code || `TH${gradeLevel}-00${i + 1}`,
                content,
                gradeLevel,
                topic,
                lessonTitle: lessonTitle || 'Bài 1: Thông tin và dữ liệu',
                learningOutcome: learningOutcome || 'Chuẩn kiến thức GDPT 2018',
                difficulty,
                type,
                options: options.length > 0 ? options : [
                  { id: `opt-${id}-1`, text: 'Đáp án A', isCorrect: true },
                  { id: `opt-${id}-2`, text: 'Đáp án B', isCorrect: false },
                  { id: `opt-${id}-3`, text: 'Đáp án C', isCorrect: false },
                  { id: `opt-${id}-4`, text: 'Đáp án D', isCorrect: false }
                ],
                trueFalseStatements: trueFalseStatements.length > 0 ? trueFalseStatements : undefined,
                correctAnswerText: type === 'FILL_IN_BLANK' ? rawOptions.replace(/^\[[ xX]\]\s*/, '') : undefined,
                essaySampleAnswer: type === 'ESSAY' ? rawOptions : undefined,
                explanation,
                imageDriveUrl: imageDriveUrl || undefined,
                imageUrl: directImageUrl || undefined,
                createdBy: 'system',
                authorName: author,
                createdAt,
                status: 'ACTIVE'
              });
            }

            if (importedQuestions.length > 0) {
              LMSStorageService.importQuestions(importedQuestions);
              questionsCount = importedQuestions.length;
            }
          } else {
            // Google Sheet chưa có câu hỏi, giữ nguyên các câu hỏi hiện có trong LMS
            questionsCount = LMSStorageService.getQuestions().length;
          }
        } else {
          questionsCount = LMSStorageService.getQuestions().length;
        }
      } catch (e) {
        console.warn('Lỗi tải questions từ Apps Script:', e);
        questionsCount = LMSStorageService.getQuestions().length;
      }

      notifyAutoSyncListeners({
        status: 'synced',
        lastSyncedTime: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        entity: 'Google Sheet (Apps Script)'
      });

      return {
        users: usersCount,
        classes: classesCount,
        questions: questionsCount,
        students: studentsCount,
        success: true
      };
    } catch (err: any) {
      notifyAutoSyncListeners({ status: 'error', errorMessage: err.message });
      return {
        users: usersCount,
        classes: classesCount,
        questions: questionsCount,
        students: studentsCount,
        success: false,
        error: err.message
      };
    }
  }

  /**
   * Đẩy dữ liệu mới (Tài khoản, Điểm số, Câu hỏi) lên Google Apps Script Web App
   */
  static async postToAppsScript(payload: any): Promise<boolean> {
    const scriptUrl = getAppsScriptUrl();
    if (!scriptUrl) return false;
    const finalPayload = {
      sheetId: getSavedSheetId(),
      folderId: getSavedDriveFolderId(),
      ...payload
    };
    try {
      // Thử fetch thông thường trước
      try {
        const directRes = await fetch(scriptUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'text/plain;charset=utf-8'
          },
          body: JSON.stringify(finalPayload)
        });
        if (directRes.ok) return true;
      } catch {
        // Fallback sang no-cors
      }

      await fetch(scriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify(finalPayload)
      });
      return true;
    } catch (e) {
      console.warn('Lỗi gửi dữ liệu lên Apps Script:', e);
      return false;
    }
  }

  /**
   * Đẩy toàn bộ dữ liệu 7 sheet lên Google Sheet và sao lưu Google Drive thông qua Apps Script
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
        { name: 'BangDiem', rows: this.buildBangDiemRows() }
      ],
      allQuestions
    };

    try {
      const ok = await this.postToAppsScript(payload);
      if (ok) {
        await GoogleDriveService.saveQuestionsToDriveViaAppsScript(allQuestions);
        notifyAutoSyncListeners({
          status: 'synced',
          lastSyncedTime: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
          entity: 'Toàn bộ 7 Sheet & Google Drive'
        });
        return {
          success: true,
          message: 'Đã đẩy thành công toàn bộ 7 sheet (TaiKhoan, HocSinh, GiaoVien, LopHoc, TenBaiHoc, CauHoi, DeThi, BangDiem) lên Google Sheet và sao lưu Google Drive!'
        };
      }
      return { success: false, message: 'Không nhận được phản hồi từ Apps Script' };
    } catch (e: any) {
      return { success: false, message: e.message || 'Lỗi khi gửi dữ liệu lên Apps Script' };
    }
  }

  /**
   * Lưu câu hỏi đồng thời vào Google Sheet (sheet CauHoi) và Google Drive
   * Đảm bảo mọi giáo viên tạo hoặc sửa câu hỏi đều được ghi nhận ngay lập tức
   */
  static async saveQuestionToGoogleSheetAndDrive(
    question: Question,
    imageBase64?: string
  ): Promise<{ success: boolean; sheetSaved: boolean; driveSaved: boolean }> {
    let sheetSaved = false;
    let driveSaved = false;

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
        const posted = await this.postToAppsScript(payload);
        if (posted) {
          sheetSaved = true;
          driveSaved = true;
        }
        // Sao lưu file JSON toàn bộ ngân hàng câu hỏi lên Google Drive
        await GoogleDriveService.saveQuestionsToDriveViaAppsScript(allQuestions);
      } catch (e) {
        console.warn('Lỗi postToAppsScript:', e);
      }
    }

    // 2. Nếu có token và sheetId, cập nhật trực tiếp qua Google Sheets API v4
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
      success: sheetSaved || driveSaved,
      sheetSaved,
      driveSaved
    };
  }

  /**
   * Xóa câu hỏi khỏi Google Sheet qua Apps Script
   */
  static async deleteQuestionFromGoogleSheet(questionId: string): Promise<boolean> {
    const scriptUrl = getAppsScriptUrl();
    if (!scriptUrl) return false;
    try {
      return await this.postToAppsScript({
        action: 'deleteQuestion',
        id: questionId
      });
    } catch (e) {
      console.warn('Lỗi xóa câu hỏi qua Apps Script:', e);
      return false;
    }
  }
}

// Tự động lắng nghe mọi thay đổi trên LMS Storage và kích hoạt đồng bộ nền lên Google Sheet
// Người dùng không cần phải bấm nút đồng bộ thủ công
onStorageChange((entity) => {
  GoogleSheetsService.triggerAutoSync(entity === 'assignments' ? 'tests' : entity);
});

