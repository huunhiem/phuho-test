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
import { LMSStorageService, onStorageChange } from './storage';
import { User, UserRole, Lesson } from '../types';
import { GoogleDriveService } from './googleDriveService';

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);

const TOKEN_KEY = 'phuho_lms_google_access_token';
const SHEET_ID_KEY = 'phuho_lms_connected_sheet_id';
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
    lower.includes('401')
  );
};

export const logoutGoogle = async () => {
  await signOut(auth);
  clearGoogleToken();
};

export const getSavedSheetId = (): string => {
  return localStorage.getItem(SHEET_ID_KEY) || '';
};

export const saveSheetId = (sheetId: string): void => {
  localStorage.setItem(SHEET_ID_KEY, sheetId.trim());
  if (cachedAccessToken && sheetId.trim()) {
    notifyAutoSyncListeners({ status: 'idle' });
  } else {
    notifyAutoSyncListeners({ status: 'disconnected' });
  }
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

    // Nếu chưa cấu hình Google Sheet hoặc chưa đăng nhập thì không thể auto-sync
    if (!sheetId || !token) {
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
}

// Tự động lắng nghe mọi thay đổi trên LMS Storage và kích hoạt đồng bộ nền lên Google Sheet
// Người dùng không cần phải bấm nút đồng bộ thủ công
onStorageChange((entity) => {
  GoogleSheetsService.triggerAutoSync(entity === 'assignments' ? 'tests' : entity);
});

