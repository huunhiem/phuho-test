import { LMSApi } from './api';
import {
  School,
  AcademicYear,
  Grade,
  ClassRoom,
  User,
  Topic,
  Lesson,
  Question,
  QuestionDifficulty,
  QuestionType,
  Test,
  TestVariant,
  Assignment,
  Submission,
  QuestionAnalysisItem,
  StudentAnswer
} from '../types';
import {
  INITIAL_SCHOOL,
  INITIAL_ACADEMIC_YEARS,
  INITIAL_GRADES,
  INITIAL_CLASSES,
  INITIAL_USERS,
  INITIAL_TOPICS,
  INITIAL_LESSONS,
  INITIAL_QUESTIONS,
  INITIAL_TESTS,
  INITIAL_ASSIGNMENTS,
  INITIAL_SUBMISSIONS
} from './seedData';

const STORAGE_KEYS = {
  SCHOOL: 'phuho_lms_school',
  ACADEMIC_YEARS: 'phuho_lms_academic_years',
  GRADES: 'phuho_lms_grades',
  CLASSES: 'phuho_lms_classes',
  USERS: 'phuho_lms_users',
  TOPICS: 'phuho_lms_topics',
  LESSONS: 'phuho_lms_lessons',
  QUESTIONS: 'phuho_lms_questions',
  DELETED_QUESTION_IDS: 'phuho_lms_deleted_question_ids',
  DELETED_USER_IDS: 'phuho_lms_deleted_user_ids',
  TESTS: 'phuho_lms_tests',
  ASSIGNMENTS: 'phuho_lms_assignments',
  SUBMISSIONS: 'phuho_lms_submissions',
  CURRENT_USER: 'phuho_lms_current_user'
};

export {
  onStorageChange,
  notifyChange,
  type StorageEntity,
  type StorageChangeListener
} from './storageEvents';
import { notifyChange } from './storageEvents';

function getStored<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw) as T;
  } catch (e) {
    console.error(`Error loading key ${key}:`, e);
    return defaultValue;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving key ${key}:`, e);
  }
}

/**
 * Hàm phân tích ngày giờ linh hoạt: Hỗ trợ ISO string, định dạng Việt Nam, Date object
 * Ngăn chặn hoàn toàn lỗi RangeError: Invalid time value khi đọc từ Google Sheet
 */
export function parseDateTimeFlexible(val: any): string {
  if (!val) return new Date().toISOString();
  if (val instanceof Date) {
    return isNaN(val.getTime()) ? new Date().toISOString() : val.toISOString();
  }
  const s = String(val).trim();
  if (!s || s.toLowerCase() === 'không có' || s.toLowerCase() === 'n/a') {
    return new Date().toISOString();
  }
  // Thử parse trực tiếp nếu là định dạng chuẩn ISO hoặc RFC
  const parsedDirect = Date.parse(s);
  if (!isNaN(parsedDirect)) {
    return new Date(parsedDirect).toISOString();
  }

  // Chuẩn hóa chuỗi ngày giờ, loại bỏ dấu phẩy thừa
  const cleanStr = s.replace(/,\s*/g, ' ').trim();

  // Định dạng Việt Nam giờ trước: "14:30:00 12/10/2026" hoặc "14:30 12/10/2026"
  const viTimeFirst = cleanStr.match(/^(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?\s+(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})$/);
  if (viTimeFirst) {
    const [, h, m, sec, d, mo, y] = viTimeFirst;
    const date = new Date(Number(y), Number(mo) - 1, Number(d), Number(h), Number(m), Number(sec || 0));
    if (!isNaN(date.getTime())) return date.toISOString();
  }

  // Định dạng Việt Nam ngày trước: "12/10/2026 14:30:00" hoặc "12/10/2026 14:30" hoặc "12/10/2026"
  const viDateFirst = cleanStr.match(/^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})(?:\s+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?$/);
  if (viDateFirst) {
    const [, d, mo, y, h, m, sec] = viDateFirst;
    const date = new Date(Number(y), Number(mo) - 1, Number(d), Number(h || 0), Number(m || 0), Number(sec || 0));
    if (!isNaN(date.getTime())) return date.toISOString();
  }

  // Định dạng năm trước: "2026-10-12 14:30:00" hoặc "2026/10/12 14:30"
  const ymdFormat = cleanStr.match(/^(\d{4})[\/\-\.](\d{1,2})[\/\-\.](\d{1,2})(?:\s+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?$/);
  if (ymdFormat) {
    const [, y, mo, d, h, m, sec] = ymdFormat;
    const date = new Date(Number(y), Number(mo) - 1, Number(d), Number(h || 0), Number(m || 0), Number(sec || 0));
    if (!isNaN(date.getTime())) return date.toISOString();
  }

  return new Date().toISOString();
}

export function safeFormatDateTimeForInput(val: any): string {
  try {
    const iso = parseDateTimeFlexible(val);
    const d = new Date(iso);
    return isNaN(d.getTime()) ? new Date().toISOString().slice(0, 16) : d.toISOString().slice(0, 16);
  } catch {
    return new Date().toISOString().slice(0, 16);
  }
}

// Hàm chuẩn hóa và ánh xạ Chủ đề môn Tin học theo Bộ sách Kết nối tri thức và cuộc sống (K6-K9)
export function normalizeKNTTTopic(rawTopic: string, gradeLevel: number = 6): string {
  const t = (rawTopic || '').trim();
  const lower = t.toLowerCase();

  // Khớp chính xác nếu đã đúng định dạng Chủ đề 1..6 của KNTT
  if (lower.startsWith('chủ đề 1') || lower.startsWith('chu de 1')) {
    return 'Chủ đề 1: Máy tính và cộng đồng';
  }
  if (lower.startsWith('chủ đề 2') || lower.startsWith('chu de 2')) {
    if (gradeLevel === 6) return 'Chủ đề 2: Mạng máy tính và Internet';
    return 'Chủ đề 2: Tổ chức lưu trữ, tìm kiếm và trao đổi thông tin';
  }
  if (lower.startsWith('chủ đề 3') || lower.startsWith('chu de 3')) {
    if (gradeLevel === 6) return 'Chủ đề 3: Tổ chức lưu trữ, tìm kiếm và trao đổi thông tin';
    return 'Chủ đề 3: Đạo đức, pháp luật và văn hoá trong môi trường số';
  }
  if (lower.startsWith('chủ đề 4') || lower.startsWith('chu de 4')) {
    if (gradeLevel === 6) return 'Chủ đề 4: Đạo đức, pháp luật và văn hoá trong môi trường số';
    return 'Chủ đề 4: Ứng dụng tin học';
  }
  if (lower.startsWith('chủ đề 5') || lower.startsWith('chu de 5')) {
    if (gradeLevel === 6) return 'Chủ đề 5: Ứng dụng tin học';
    return 'Chủ đề 5: Giải quyết vấn đề với sự trợ giúp của máy tính';
  }
  if (lower.startsWith('chủ đề 6') || lower.startsWith('chu de 6')) {
    if (gradeLevel === 6) return 'Chủ đề 6: Giải quyết vấn đề với sự trợ giúp của máy tính';
    return 'Chủ đề 6: Hướng nghiệp với tin học';
  }

  // Chuyển đổi nâng cấp từ bộ cũ (Chủ đề A..G hoặc tên chữ) sang bộ KNTT
  if (lower.includes('chủ đề a') || lower.includes('chu de a') || lower.includes('máy tính và cộng đồng') || lower.includes('lịch sử máy tính')) {
    return 'Chủ đề 1: Máy tính và cộng đồng';
  }
  if (lower.includes('chủ đề b') || lower.includes('chu de b') || lower.includes('mạng máy tính') || lower.includes('internet')) {
    if (gradeLevel === 6) return 'Chủ đề 2: Mạng máy tính và Internet';
    return 'Chủ đề 2: Tổ chức lưu trữ, tìm kiếm và trao đổi thông tin';
  }
  if (lower.includes('chủ đề c') || lower.includes('chu de c') || lower.includes('tổ chức lưu trữ') || lower.includes('trao đổi thông tin')) {
    if (gradeLevel === 6) return 'Chủ đề 3: Tổ chức lưu trữ, tìm kiếm và trao đổi thông tin';
    return 'Chủ đề 2: Tổ chức lưu trữ, tìm kiếm và trao đổi thông tin';
  }
  if (lower.includes('chủ đề d') || lower.includes('chu de d') || lower.includes('đạo đức') || lower.includes('bản quyền') || lower.includes('pháp luật')) {
    if (gradeLevel === 6) return 'Chủ đề 4: Đạo đức, pháp luật và văn hoá trong môi trường số';
    return 'Chủ đề 3: Đạo đức, pháp luật và văn hoá trong môi trường số';
  }
  if (lower.includes('chủ đề e') || lower.includes('chu de e') || lower.includes('ứng dụng tin học') || lower.includes('bảng tính')) {
    if (gradeLevel === 6) return 'Chủ đề 5: Ứng dụng tin học';
    return 'Chủ đề 4: Ứng dụng tin học';
  }
  if (lower.includes('chủ đề f') || lower.includes('chu de f') || lower.includes('giải quyết vấn đề') || lower.includes('thuật toán') || lower.includes('lập trình') || lower.includes('scratch') || lower.includes('python')) {
    if (gradeLevel === 6) return 'Chủ đề 6: Giải quyết vấn đề với sự trợ giúp của máy tính';
    return 'Chủ đề 5: Giải quyết vấn đề với sự trợ giúp của máy tính';
  }
  if (lower.includes('chủ đề g') || lower.includes('chu de g') || lower.includes('hướng nghiệp')) {
    return 'Chủ đề 6: Hướng nghiệp với tin học';
  }

  // Mặc định
  return 'Chủ đề 1: Máy tính và cộng đồng';
}

export class LMSStorageService {
  // Current logged in user
  static getCurrentUser(): User | null {
  return this.getStoredUser();
  }
  static async login(
  username: string,
  password: string
  ): Promise<User> {

  const user = await LMSApi.login(
    username,
    password
  );

  if (!user) {
    throw new Error(
      'Tên đăng nhập hoặc mật khẩu không chính xác!'
    );
  }

  const normalizedUser: User = {
    ...user,

    id: String(
      user.id ??
      user.ID ??
      ''
    ),

    username: String(
      user.username ??
      user.Username ??
      user.taiKhoan ??
      user.TenDangNhap ??
      ''
    ),

    fullName: String(
      user.fullName ??
      user.FullName ??
      user.hoTen ??
      user.HoTen ??
      ''
    ),

    role:
      user.role ??
      user.Role ??
      'STUDENT',

    status:
      user.status ??
      user.Status ??
      'ACTIVE'
  } as User;

  // Không lưu mật khẩu vào trình duyệt
  const safeUser = {
    ...normalizedUser
  } as any;

  delete safeUser.password;
  delete safeUser.Password;
  delete safeUser.matKhau;

  this.setCurrentUser(safeUser);

  return safeUser;
}
  static getStoredUser(): User | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (!raw) return null;
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  }

  static setCurrentUser(user: User): void {
    setStored(STORAGE_KEYS.CURRENT_USER, user);
  }

  static clearCurrentUser(): void {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }

  // School
  static getSchool(): School {
    return getStored<School>(STORAGE_KEYS.SCHOOL, INITIAL_SCHOOL);
  }

  static updateSchool(school: School): void {
    setStored(STORAGE_KEYS.SCHOOL, school);
  }

  // Academic Years
  static getAcademicYears(): AcademicYear[] {
    return getStored<AcademicYear[]>(STORAGE_KEYS.ACADEMIC_YEARS, INITIAL_ACADEMIC_YEARS);
  }

  // Grades
  static getGrades(): Grade[] {
    return getStored<Grade[]>(STORAGE_KEYS.GRADES, INITIAL_GRADES);
  }

  // Classes
  static getClasses(): ClassRoom[] {
    return getStored<ClassRoom[]>(STORAGE_KEYS.CLASSES, INITIAL_CLASSES);
  }

  static addClass(cls: ClassRoom): void {
    const list = this.getClasses();
    setStored(STORAGE_KEYS.CLASSES, [cls, ...list]);
    notifyChange('classes');
  }

  static updateClass(cls: ClassRoom): void {
    const list = this.getClasses().map((c) => (c.id === cls.id ? cls : c));
    setStored(STORAGE_KEYS.CLASSES, list);
    notifyChange('classes');
  }

  static deleteClass(id: string): void {
    const list = this.getClasses().filter((c) => c.id !== id);
    setStored(STORAGE_KEYS.CLASSES, list);

    // Tự động gỡ bỏ liên kết học sinh và phân công giáo viên đối với lớp bị xóa
    const users = this.getUsers();
    let hasUserChanges = false;
    const updatedUsers = users.map((u) => {
      let changed = false;
      let newClassId = u.classId;
      let newAssigned = u.assignedClassIds;

      if (u.classId === id) {
        newClassId = undefined;
        changed = true;
      }
      if (u.assignedClassIds && u.assignedClassIds.includes(id)) {
        newAssigned = u.assignedClassIds.filter((cid) => cid !== id);
        changed = true;
      }

      if (changed) {
        hasUserChanges = true;
        return { ...u, classId: newClassId, assignedClassIds: newAssigned };
      }
      return u;
    });

    if (hasUserChanges) {
      setStored(STORAGE_KEYS.USERS, updatedUsers);
      notifyChange('users');
    }

    notifyChange('classes');
  }

  /**
   * Nạp danh sách Lớp học (từ Google Sheet LopHoc).
   * Mặc định replaceAll = true để danh sách lớp khớp chính xác 100% với Google Sheet (không giữ lại các lớp mẫu ma)
   */
  static importClasses(newClasses: ClassRoom[], replaceAll = true): void {
    if (!newClasses || newClasses.length === 0) return;

    // Lọc và chỉ giữ lại những lớp học thực tế hợp lệ (chấp nhận mọi định dạng lớp: 6/1, 7A, 8/7, 9/1, 10A1, 12A, v.v.)
    const validNewClasses = newClasses.filter((c) => {
      if (!c || !c.name) return false;
      const clean = c.name.trim().toLowerCase();
      if (!clean || clean === 'tên lớp' || clean === 'lớp' || clean === 'khối' || clean === 'stt' || clean === 'mã lớp') {
        return false;
      }
      if (clean.startsWith('tổng') || clean.startsWith('cộng') || clean.includes('học sinh')) {
        return false;
      }
      return true;
    });
    if (validNewClasses.length === 0) return;

    // Loại bỏ trùng lặp tên lớp
    const uniqueMap = new Map<string, ClassRoom>();
    validNewClasses.forEach((c) => {
      const clean = c.name.trim().toLowerCase().replace(/^(lớp|lop)\s+/i, '');
      if (!uniqueMap.has(clean)) {
        uniqueMap.set(clean, c);
      }
    });
    const sanitizedClasses = Array.from(uniqueMap.values());

    const existing = getStored<ClassRoom[]>(STORAGE_KEYS.CLASSES, INITIAL_CLASSES);
    const existingMap = new Map<string, ClassRoom>();
    const nameToExisting = new Map<string, ClassRoom>();
    existing.forEach((c) => {
      existingMap.set(c.id, c);
      const clean = c.name.trim().toLowerCase().replace(/^(lớp|lop)\s+/i, '');
      nameToExisting.set(c.name.trim().toLowerCase(), c);
      nameToExisting.set(clean, c);
    });

    if (replaceAll) {
      // Khi nạp từ Google Sheet, danh sách lớp mới là nguồn chân lý duy nhất (Source of Truth)
      const finalClasses: ClassRoom[] = sanitizedClasses.map((c) => {
        const cleanName = c.name.trim().toLowerCase();
        const stripped = cleanName.replace(/^(lớp|lop)\s+/i, '');
        const prev = existingMap.get(c.id) || nameToExisting.get(cleanName) || nameToExisting.get(stripped);
        const targetId = prev?.id || c.id;

        return {
          ...prev,
          ...c,
          id: targetId,
          homeroomTeacherId: c.homeroomTeacherId || prev?.homeroomTeacherId,
          homeroomTeacherName: c.homeroomTeacherName || prev?.homeroomTeacherName || '',
          subjectTeacherId: c.subjectTeacherId || prev?.subjectTeacherId,
          subjectTeacherName: c.subjectTeacherName || prev?.subjectTeacherName || '',
          assignedTeacherIds: Array.from(
            new Set([...(c.assignedTeacherIds || []), ...(prev?.assignedTeacherIds || [])])
          )
        };
      });

      setStored(STORAGE_KEYS.CLASSES, finalClasses);

      // Đồng bộ dọn dẹp phân công lớp học của các tài khoản để loại bỏ lớp cũ không còn tồn tại
      const validIds = new Set(finalClasses.map((fc) => fc.id));
      const users = this.getUsers();
      let usersChanged = false;
      const cleanedUsers = users.map((u) => {
        let changed = false;
        let newClassId = u.classId;
        let newAssigned = u.assignedClassIds;

        if (u.classId && !validIds.has(u.classId)) {
          newClassId = undefined;
          changed = true;
        }
        if (u.assignedClassIds) {
          const filtered = u.assignedClassIds.filter((cid) => validIds.has(cid));
          if (filtered.length !== u.assignedClassIds.length) {
            newAssigned = filtered;
            changed = true;
          }
        }
        if (changed) {
          usersChanged = true;
          return { ...u, classId: newClassId, assignedClassIds: newAssigned };
        }
        return u;
      });

      if (usersChanged) {
        setStored(STORAGE_KEYS.USERS, cleanedUsers);
        notifyChange('users');
      }

      this.refreshTeacherAssignmentsFromClasses();
      notifyChange('classes');
      return;
    }

    // Chế độ gộp nếu replaceAll = false
    const map = new Map<string, ClassRoom>(existingMap);
    sanitizedClasses.forEach((c) => {
      const cleanName = c.name.trim().toLowerCase();
      const stripped = cleanName.replace(/^(lớp|lop)\s+/i, '');
      const existingId = nameToExisting.get(cleanName)?.id || nameToExisting.get(stripped)?.id;
      const targetId = existingId || c.id;
      const prev = map.get(targetId);

      const mergedClass: ClassRoom = {
        ...prev,
        ...c,
        id: targetId,
        homeroomTeacherId: c.homeroomTeacherId || prev?.homeroomTeacherId,
        homeroomTeacherName: c.homeroomTeacherName || prev?.homeroomTeacherName || '',
        subjectTeacherId: c.subjectTeacherId || prev?.subjectTeacherId,
        subjectTeacherName: c.subjectTeacherName || prev?.subjectTeacherName || '',
        assignedTeacherIds: Array.from(new Set([...(c.assignedTeacherIds || []), ...(prev?.assignedTeacherIds || [])]))
      };

      map.set(targetId, mergedClass);
    });

    const merged = Array.from(map.values());
    setStored(STORAGE_KEYS.CLASSES, merged);
    this.refreshTeacherAssignmentsFromClasses();
    notifyChange('classes');
  }

  /**
   * Kiểm tra xem tên giáo viên trong chuỗi (từ Sheet LopHoc) có khớp với đối tượng User giáo viên hay không
   * Hỗ trợ mọi biến thể: đầy đủ, viết tắt, chức danh (Thầy/Cô/GV), tên gọi (từ cuối), tên đăng nhập, mã GV, phân công nhiều GV
   */
  static isTeacherNameMatch(teacherString: string, teacherUser: User): boolean {
    if (!teacherString || !teacherUser) return false;
    const cleanTitle = (val: string) =>
      (val || '')
        .toLowerCase()
        .replace(/^(thầy|cô|gv|giáo viên|thầy\/cô|thay|co)\s+/i, '')
        .replace(/\s*\([^)]*\)/g, '')
        .trim();

    const tFull = (teacherUser.fullName || '').toLowerCase().trim();
    const tClean = cleanTitle(teacherUser.fullName || '');
    const tUser = (teacherUser.username || '').toLowerCase().trim();
    const tCode = (teacherUser.teacherCode || '').toLowerCase().trim();
    const tEmail = (teacherUser.email || '').toLowerCase().trim().split('@')[0];
    const tLastName = tClean.split(/\s+/).pop() || '';

    const splitNames = teacherString.split(/[,;/+\n]/).map((s) => cleanTitle(s)).filter(Boolean);

    for (const rawItem of splitNames) {
      const item = cleanTitle(rawItem);
      if (!item) continue;

      // 1. Khớp chính xác tên đầy đủ, tên chuẩn hóa, username, mã giáo viên, email
      if (
        item === tClean ||
        item === tFull ||
        item === tUser ||
        (tCode && item === tCode) ||
        (tEmail && item === tEmail)
      ) {
        return true;
      }

      // 2. Chứa chuỗi nhau
      if (tClean && (item.includes(tClean) || tClean.includes(item))) {
        return true;
      }
      if (tFull && (item.includes(tFull) || tFull.includes(item))) {
        return true;
      }
      if (tUser && (item === tUser || item.includes(tUser))) {
        return true;
      }

      // 3. Khớp tên gọi (từ cuối cùng - tên riêng của giáo viên như "Long", "Mai", "Cường")
      const itemLastName = item.split(/\s+/).pop() || '';
      if (tLastName && itemLastName && tLastName === itemLastName && tLastName.length >= 2) {
        if (item === itemLastName || item.includes(tLastName)) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Tự động quét và liên kết hai chiều giữa Lớp học và Giáo viên theo phân công từ Sheet LopHoc
   */
  static refreshTeacherAssignmentsFromClasses(): void {
    const classes = this.getClasses();
    const users = this.getUsers();
    const staff = users.filter((u) => u.role !== 'STUDENT');
    if (classes.length === 0 || staff.length === 0) return;

    let hasUsersChanged = false;
    let hasClassesChanged = false;

    // 1. Cập nhật assignedClassIds cho từng giáo viên dựa trên lớp học
    const validClassIds = new Set(classes.map((c) => c.id));
    const updatedUsers = users.map((u) => {
      if (u.role === 'STUDENT') return u;
      // Chỉ giữ lại những lớp hiện còn tồn tại trong hệ thống
      const myClassIds = new Set((u.assignedClassIds || []).filter((id) => validClassIds.has(id)));

      classes.forEach((c) => {
        const isSubjectMatch = c.subjectTeacherName && this.isTeacherNameMatch(c.subjectTeacherName, u);
        const isHomeroomMatch = c.homeroomTeacherName && this.isTeacherNameMatch(c.homeroomTeacherName, u);
        const isIdMatch =
          c.assignedTeacherIds?.includes(u.id) ||
          c.subjectTeacherId === u.id ||
          c.homeroomTeacherId === u.id;

        if (isSubjectMatch || isHomeroomMatch || isIdMatch) {
          if (!myClassIds.has(c.id)) {
            myClassIds.add(c.id);
            hasUsersChanged = true;
          }
        }
      });

      const nextAssigned = Array.from(myClassIds);
      if (nextAssigned.length !== (u.assignedClassIds || []).length) {
        hasUsersChanged = true;
        return { ...u, assignedClassIds: nextAssigned };
      }
      return u;
    });

    // 2. Cập nhật ngược lại assignedTeacherIds & subjectTeacherId cho từng Lớp học
    const updatedClasses = classes.map((c) => {
      const teacherIds = new Set(c.assignedTeacherIds || []);
      let subjectTeacherId = c.subjectTeacherId;
      let homeroomTeacherId = c.homeroomTeacherId;

      staff.forEach((t) => {
        const isAssigned = t.assignedClassIds?.includes(c.id);
        const isSubjectMatch = c.subjectTeacherName && this.isTeacherNameMatch(c.subjectTeacherName, t);
        const isHomeroomMatch = c.homeroomTeacherName && this.isTeacherNameMatch(c.homeroomTeacherName, t);

        if (isAssigned || isSubjectMatch || isHomeroomMatch) {
          if (!teacherIds.has(t.id)) {
            teacherIds.add(t.id);
            hasClassesChanged = true;
          }
          if (isSubjectMatch && !subjectTeacherId) {
            subjectTeacherId = t.id;
            hasClassesChanged = true;
          }
          if (isHomeroomMatch && !homeroomTeacherId) {
            homeroomTeacherId = t.id;
            hasClassesChanged = true;
          }
        }
      });

      const nextTeacherIds = Array.from(teacherIds);
      if (
        nextTeacherIds.length !== (c.assignedTeacherIds || []).length ||
        subjectTeacherId !== c.subjectTeacherId ||
        homeroomTeacherId !== c.homeroomTeacherId
      ) {
        hasClassesChanged = true;
        return {
          ...c,
          assignedTeacherIds: nextTeacherIds,
          subjectTeacherId: subjectTeacherId || c.subjectTeacherId,
          homeroomTeacherId: homeroomTeacherId || c.homeroomTeacherId
        };
      }
      return c;
    });

    if (hasUsersChanged) {
      setStored(STORAGE_KEYS.USERS, updatedUsers);
      const curr = this.getCurrentUser();
      if (curr) {
        const updatedCurr = updatedUsers.find((u) => u.id === curr.id);
        if (updatedCurr) {
          this.setCurrentUser({ ...curr, assignedClassIds: updatedCurr.assignedClassIds });
        }
      }
      notifyChange('users');
    }

    if (hasClassesChanged) {
      setStored(STORAGE_KEYS.CLASSES, updatedClasses);
      notifyChange('classes');
    }
  }

  /**
   * Lấy danh sách lớp phụ trách của một giáo viên hoặc quản trị viên
   * Hỗ trợ tìm kiếm theo ID lớp, ID giáo viên, và đối chiếu tên hiển thị từ Google Sheet LopHoc
   */
  static getClassesForTeacher(user: User): ClassRoom[] {
    const allClasses = this.getClasses();
    if (!user) return [];
    if (user.role === 'ADMIN' || user.role === 'PRINCIPAL') {
      return allClasses;
    }

    const assignedIds = new Set(user.assignedClassIds || []);

    return allClasses.filter((c) => {
      const cCleanName = c.name.toLowerCase().replace(/^(lớp|lop)\s+/i, '').trim();

      // 1. Giáo viên có class.id hoặc class.name trong assignedClassIds (hỗ trợ nhiều biến thể định dạng)
      if (
        assignedIds.has(c.id) ||
        assignedIds.has(c.name) ||
        assignedIds.has(cCleanName) ||
        assignedIds.has(c.name.replace('/', '-')) ||
        assignedIds.has(`cls-${c.name.replace('/', '-')}`)
      ) {
        return true;
      }

      // 2. Class có ID giáo viên trong assignedTeacherIds hoặc subjectTeacherId hoặc homeroomTeacherId
      if (
        c.assignedTeacherIds?.includes(user.id) ||
        c.subjectTeacherId === user.id ||
        c.homeroomTeacherId === user.id
      ) {
        return true;
      }

      // 3. Đối chiếu tên giáo viên phân công từ cột 5 của Sheet LopHoc (subjectTeacherName)
      if (c.subjectTeacherName && this.isTeacherNameMatch(c.subjectTeacherName, user)) {
        return true;
      }

      // 4. Đối chiếu tên giáo viên chủ nhiệm
      if (c.homeroomTeacherName && this.isTeacherNameMatch(c.homeroomTeacherName, user)) {
        return true;
      }

      return false;
    });
  }

  // Phân công giáo viên phụ trách các lớp học
  static assignTeacherToClasses(teacherId: string, classIds: string[]): void {
    const users = this.getUsers();
    const teacher = users.find((u) => u.id === teacherId);
    const updatedUsers = users.map((u) => {
      if (u.id === teacherId) {
        return { ...u, assignedClassIds: classIds };
      }
      return u;
    });
    setStored(STORAGE_KEYS.USERS, updatedUsers);

    // Cập nhật người dùng hiện tại nếu đang đăng nhập đúng tài khoản này
    const current = this.getCurrentUser();
    if (current && current.id === teacherId) {
      this.setCurrentUser({ ...current, assignedClassIds: classIds });
    }

    const classes = this.getClasses();
    const updatedClasses = classes.map((c) => {
      const isAssigned = classIds.includes(c.id);
      const assignedSet = new Set(c.assignedTeacherIds || []);
      if (isAssigned) {
        assignedSet.add(teacherId);
        // Lấy danh sách giáo viên phụ trách để cập nhật tên đầy đủ
        const assignedTeachers = updatedUsers.filter((u) => assignedSet.has(u.id));
        const allNames = assignedTeachers.map((t) => t.fullName).filter(Boolean).join(', ');

        return {
          ...c,
          assignedTeacherIds: Array.from(assignedSet),
          subjectTeacherId: teacherId,
          subjectTeacherName: allNames || teacher?.fullName || c.subjectTeacherName
        };
      } else {
        assignedSet.delete(teacherId);
        const assignedTeachers = updatedUsers.filter((u) => assignedSet.has(u.id));
        const remainingNames = assignedTeachers.map((t) => t.fullName).filter(Boolean).join(', ');

        return {
          ...c,
          assignedTeacherIds: Array.from(assignedSet),
          subjectTeacherId: c.subjectTeacherId === teacherId ? (assignedTeachers[0]?.id) : c.subjectTeacherId,
          subjectTeacherName: remainingNames || (c.subjectTeacherId === teacherId ? undefined : c.subjectTeacherName)
        };
      }
    });
    setStored(STORAGE_KEYS.CLASSES, updatedClasses);
    notifyChange('classes');
    notifyChange('users');
  }

  // Cập nhật lớp học kèm danh sách giáo viên phân công
  static updateClassWithTeachers(cls: ClassRoom, assignedTeacherIds: string[]): void {
    const users = this.getUsers();
    const teachers = users.filter((u) => u.role === 'TEACHER' || u.role === 'DEPARTMENT_HEAD');
    const assignedNames = teachers
      .filter((t) => assignedTeacherIds.includes(t.id))
      .map((t) => t.fullName)
      .join(', ');

    const updatedCls: ClassRoom = {
      ...cls,
      assignedTeacherIds,
      subjectTeacherName: assignedNames || cls.subjectTeacherName
    };
    this.updateClass(updatedCls);

    let usersUpdated = false;
    const updatedUsers = users.map((u) => {
      if (u.role === 'TEACHER' || u.role === 'DEPARTMENT_HEAD') {
        const currentClasses = new Set(u.assignedClassIds || []);
        if (assignedTeacherIds.includes(u.id)) {
          if (!currentClasses.has(cls.id)) {
            currentClasses.add(cls.id);
            usersUpdated = true;
            return { ...u, assignedClassIds: Array.from(currentClasses) };
          }
        } else {
          if (currentClasses.has(cls.id)) {
            currentClasses.delete(cls.id);
            usersUpdated = true;
            return { ...u, assignedClassIds: Array.from(currentClasses) };
          }
        }
      }
      return u;
    });

    if (usersUpdated) {
      setStored(STORAGE_KEYS.USERS, updatedUsers);
      notifyChange('users');
    }
  }

  // Deleted user IDs helper
  static getDeletedUserIds(): Set<string> {
    const list = getStored<string[]>(STORAGE_KEYS.DELETED_USER_IDS, []);
    return new Set(list);
  }

  // Users
  static getUsers(): User[] {
    const deletedIds = this.getDeletedUserIds();
    const stored = getStored<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
    // Filter out any explicitly deleted users
    const filteredStored = stored.filter((u) => !deletedIds.has(u.id) && u.status !== 'DELETED');
    const existingIds = new Set(filteredStored.map((u) => u.id));
    let hasMissing = false;
    const merged = [...filteredStored];

    INITIAL_USERS.forEach((initUser) => {
      if (!existingIds.has(initUser.id) && !deletedIds.has(initUser.id)) {
        merged.push(initUser);
        hasMissing = true;
      }
    });

    if (hasMissing || filteredStored.length !== stored.length) {
      setStored(STORAGE_KEYS.USERS, merged);
    }
    return merged;
  }

  static addUser(user: User): void {
    // If re-adding previously deleted ID, remove from deleted IDs
    const deletedList = getStored<string[]>(STORAGE_KEYS.DELETED_USER_IDS, []);
    if (deletedList.includes(user.id)) {
      setStored(STORAGE_KEYS.DELETED_USER_IDS, deletedList.filter((id) => id !== user.id));
    }
    const list = this.getUsers().filter((u) => u.id !== user.id && u.username.toLowerCase() !== user.username.toLowerCase());
    setStored(STORAGE_KEYS.USERS, [user, ...list]);
    notifyChange('users');
  }

  static updateUser(user: User): void {
    let matched = false;
    const list = this.getUsers().map((u) => {
      const isMatch =
        u.id === user.id ||
        (Boolean(u.username && user.username) && u.username.toLowerCase() === user.username.toLowerCase()) ||
        (Boolean(u.studentCode && user.studentCode) && u.studentCode!.toLowerCase() === user.studentCode!.toLowerCase()) ||
        (Boolean(u.teacherCode && user.teacherCode) && u.teacherCode!.toLowerCase() === user.teacherCode!.toLowerCase());

      if (isMatch) {
        matched = true;
        return {
          ...u,
          ...user,
          avatarUrl: user.avatarUrl !== undefined ? user.avatarUrl : u.avatarUrl
        };
      }
      return u;
    });

    if (!matched) {
      list.push(user);
    }

    setStored(STORAGE_KEYS.USERS, list);

    const current = this.getCurrentUser();
    if (
      current &&
      (current.id === user.id ||
        (Boolean(current.username && user.username) && current.username.toLowerCase() === user.username.toLowerCase()))
    ) {
      this.setCurrentUser({
        ...current,
        ...user,
        avatarUrl: user.avatarUrl !== undefined ? user.avatarUrl : current.avatarUrl
      });
    }
    notifyChange('users');
  }

  static deleteUser(id: string): void {
    // Lưu vào danh sách đã xóa để không bao giờ bị khôi phục lại
    const deletedList = getStored<string[]>(STORAGE_KEYS.DELETED_USER_IDS, []);
    if (!deletedList.includes(id)) {
      setStored(STORAGE_KEYS.DELETED_USER_IDS, [...deletedList, id]);
    }

    const targetUser = this.getUsers().find((u) => u.id === id);
    const targetStudentCode = targetUser?.studentCode;

    const list = this.getUsers().filter((u) => u.id !== id);
    setStored(STORAGE_KEYS.USERS, list);

    // Xóa điểm / bài nộp của tài khoản đã xóa khỏi Bảng điểm
    const subs = this.getSubmissions().filter((s) => s.studentId !== id && (!targetStudentCode || s.studentCode !== targetStudentCode));
    setStored(STORAGE_KEYS.SUBMISSIONS, subs);

    notifyChange('users');
    notifyChange('submissions');
  }

  static importStudents(newStudents: User[]): void {
    const deletedIds = this.getDeletedUserIds();
    const existing = this.getUsers();
    const userMap = new Map<string, User>();
    const usernameToId = new Map<string, string>();

    existing.forEach((u) => {
      userMap.set(u.id, u);
      if (u.username) {
        usernameToId.set(u.username.toLowerCase(), u.id);
      }
    });

    newStudents.forEach((u) => {
      // If newly imported, ensure it is unflagged from deleted IDs
      deletedIds.delete(u.id);
      const cleanUsername = (u.username || '').toLowerCase();
      const existingId = usernameToId.get(cleanUsername);
      const targetId = existingId || u.id;
      const prev = userMap.get(targetId);

      const mergedUser: User = {
        ...prev,
        ...u,
        id: targetId,
        // Bảo tồn avatarUrl đã có nếu lượt import này chưa có avatar
        avatarUrl: u.avatarUrl || prev?.avatarUrl,
        // Bảo tồn assignedClassIds nếu lượt import này không có
        assignedClassIds: (u.assignedClassIds && u.assignedClassIds.length > 0)
          ? u.assignedClassIds
          : (prev?.assignedClassIds || []),
        password: u.password || prev?.password || (u.role === 'STUDENT' ? '123456' : 'phuho@2025')
      };

      // If ID changed to match existing username, clean up any old key
      if (existingId && existingId !== u.id && userMap.has(u.id)) {
        userMap.delete(u.id);
      }

      userMap.set(targetId, mergedUser);
      if (cleanUsername) usernameToId.set(cleanUsername, targetId);
    });

    setStored(STORAGE_KEYS.DELETED_USER_IDS, Array.from(deletedIds));
    const updated = Array.from(userMap.values());
    setStored(STORAGE_KEYS.USERS, updated);
    notifyChange('users');
  }

  // Topics
  static getTopics(gradeLevel?: number): Topic[] {
    const stored = getStored<Topic[]>(STORAGE_KEYS.TOPICS, INITIAL_TOPICS);
    // Tự động nâng cấp sang danh mục 23 Chủ đề Kết nối tri thức và cuộc sống môn Tin học K6, K7, K8, K9
    const hasOldTopics = !Array.isArray(stored) || stored.some((t) => t.name.includes('Chủ đề A') || t.name.includes('Chủ đề B') || t.id.startsWith('top-a') || !t.id.startsWith('top-'));
    const isMissingTopics = Array.isArray(stored) && stored.length !== INITIAL_TOPICS.length;
    if (hasOldTopics || isMissingTopics || !stored.some((t) => t.id.startsWith('top-6-') || t.id.startsWith('top-7-') || t.id.startsWith('top-8-') || t.id.startsWith('top-9-'))) {
      setStored(STORAGE_KEYS.TOPICS, INITIAL_TOPICS);
      return gradeLevel ? INITIAL_TOPICS.filter((t) => t.gradeLevel === gradeLevel) : INITIAL_TOPICS;
    }
    if (gradeLevel) {
      return stored.filter((t) => t.gradeLevel === gradeLevel);
    }
    return stored;
  }

  static resetTopics(): void {
    setStored(STORAGE_KEYS.TOPICS, INITIAL_TOPICS);
    notifyChange('topics');
  }

  // Lessons
  static getLessons(gradeLevel?: number): Lesson[] {
    const stored = getStored<Lesson[]>(STORAGE_KEYS.LESSONS, INITIAL_LESSONS);
    // Tự động nâng cấp sang danh mục Bài học Kết nối tri thức và cuộc sống môn Tin học K6, K7, K8, K9
    if (!stored.some((l) => l.topicId.startsWith('top-6-') || l.topicId.startsWith('top-7-'))) {
      setStored(STORAGE_KEYS.LESSONS, INITIAL_LESSONS);
      return gradeLevel ? INITIAL_LESSONS.filter((l) => l.gradeLevel === gradeLevel) : INITIAL_LESSONS;
    }
    if (gradeLevel) {
      return stored.filter((l) => l.gradeLevel === gradeLevel);
    }
    return stored;
  }

  static getLessonsByGrade(gradeLevel: number): Lesson[] {
    const all = this.getLessons();
    return all.filter((l) => l.gradeLevel === gradeLevel);
  }

  static getLessonsByGradeAndTopic(gradeLevel: number, topicIdOrName: string): Lesson[] {
    const all = this.getLessons();
    const topics = this.getTopics();
    return all.filter((l) => {
      if (l.gradeLevel !== gradeLevel) return false;
      if (!topicIdOrName) return true;
      if (l.topicId === topicIdOrName) return true;
      const lower = topicIdOrName.toLowerCase();
      const topicObj = topics.find((t) => t.id === l.topicId);
      if (topicObj && (topicObj.name.toLowerCase() === lower || topicObj.code.toLowerCase() === lower)) return true;
      if (lower.includes('chủ đề 1') && l.topicId === `top-${gradeLevel}-1`) return true;
      if (lower.includes('chủ đề 2') && l.topicId === `top-${gradeLevel}-2`) return true;
      if (lower.includes('chủ đề 3') && l.topicId === `top-${gradeLevel}-3`) return true;
      if (lower.includes('chủ đề 4') && l.topicId === `top-${gradeLevel}-4`) return true;
      if (lower.includes('chủ đề 5') && l.topicId === `top-${gradeLevel}-5`) return true;
      if (lower.includes('chủ đề 6') && l.topicId === `top-${gradeLevel}-6`) return true;
      return false;
    });
  }

  static addLesson(lesson: Lesson): void {
    const list = this.getLessons();
    const updated = [lesson, ...list];
    setStored(STORAGE_KEYS.LESSONS, updated);
    notifyChange('lessons');
  }

  static updateLesson(lesson: Lesson): void {
    const list = this.getLessons().map((item) => (item.id === lesson.id ? lesson : item));
    setStored(STORAGE_KEYS.LESSONS, list);
    notifyChange('lessons');
  }

  static deleteLesson(id: string): void {
    const list = this.getLessons().filter((item) => item.id !== id);
    setStored(STORAGE_KEYS.LESSONS, list);
    notifyChange('lessons');
  }

  static importLessons(newLessons: Lesson[]): void {
    const existing = this.getLessons();
    const map = new Map<string, Lesson>();
    existing.forEach((l) => map.set(l.id, l));
    newLessons.forEach((l) => map.set(l.id, l));
    const merged = Array.from(map.values());
    setStored(STORAGE_KEYS.LESSONS, merged);
    notifyChange('lessons');
  }

  static resetLessons(): void {
    setStored(STORAGE_KEYS.LESSONS, INITIAL_LESSONS);
    notifyChange('lessons');
  }

  // Questions
  static getQuestions(): Question[] {
    const deletedIds = new Set(getStored<string[]>(STORAGE_KEYS.DELETED_QUESTION_IDS, []));
    const stored = getStored<Question[]>(STORAGE_KEYS.QUESTIONS, []);
    const topics = this.getTopics();

    // Map chứa toàn bộ câu hỏi hệ thống + câu hỏi tạo mới/đồng bộ
    const qMap = new Map<string, Question>();

    // 1. Khởi tạo bằng toàn bộ 20 câu hỏi chuẩn GDPT 2018 của hệ thống nếu chưa bị xóa
    INITIAL_QUESTIONS.forEach((q) => {
      if (!deletedIds.has(q.id)) {
        qMap.set(q.id, { ...q });
      }
    });

    // 2. Nạp đè/bổ sung từ kho lưu trữ (chứa các chỉnh sửa của GV và câu hỏi mới thêm)
    if (Array.isArray(stored)) {
      stored.forEach((q) => {
        if (q && q.id && !deletedIds.has(q.id)) {
          qMap.set(q.id, q);
        }
      });
    }

    const rawList = Array.from(qMap.values());

    // Chuẩn hóa và khắc phục dữ liệu câu hỏi nếu có trường bị thiếu từ Google Sheet
    const normalized: Question[] = rawList.map((q, idx) => {
      const gradeLevel = Number(q.gradeLevel || (q as any).grade) || 6;
      let topic = q.topic || (q as any).topicName;
      if (!topic && (q as any).topicId) {
        const found = topics.find((t) => t.id === (q as any).topicId);
        topic = found ? found.name : 'Chủ đề 1: Máy tính và cộng đồng';
      }
      if (!topic) {
        topic = 'Chủ đề 1: Máy tính và cộng đồng';
      }

      topic = normalizeKNTTTopic(topic, gradeLevel);

      return {
        ...q,
        id: q.id || `q-${idx + 1}`,
        code: q.code || `TH${gradeLevel}-00${idx + 1}`,
        content: q.content || '',
        gradeLevel,
        topic,
        lessonTitle: q.lessonTitle || 'Bài 1: Thông tin và dữ liệu',
        learningOutcome: q.learningOutcome || 'Chuẩn kiến thức GDPT 2018',
        difficulty: (['BIET', 'HIEU', 'VAN_DUNG', 'VAN_DUNG_CAO'].includes(q.difficulty) ? q.difficulty : 'BIET') as QuestionDifficulty,
        type: (['SINGLE_CHOICE', 'MULTIPLE_CHOICE', 'TRUE_FALSE', 'FILL_IN_BLANK', 'ESSAY'].includes(q.type) ? q.type : 'SINGLE_CHOICE') as QuestionType,
        options: Array.isArray(q.options) && q.options.length > 0 ? q.options : [
          { id: `opt-${q.id || idx}-1`, text: 'Đáp án A', isCorrect: true },
          { id: `opt-${q.id || idx}-2`, text: 'Đáp án B', isCorrect: false },
          { id: `opt-${q.id || idx}-3`, text: 'Đáp án C', isCorrect: false },
          { id: `opt-${q.id || idx}-4`, text: 'Đáp án D', isCorrect: false }
        ],
        authorName: q.authorName || 'Giáo viên',
        createdAt: q.createdAt || new Date().toISOString().split('T')[0],
        status: (q.status === 'DRAFT' ? 'DRAFT' : 'ACTIVE') as 'ACTIVE' | 'DRAFT'
      };
    });

    if (!normalized.some((q) => q.imageUrl)) {
      const q1 = normalized.find((q) => q.id === 'q-01');
      if (q1) {
        q1.imageUrl = 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80';
        q1.imageDriveUrl = 'https://drive.google.com/file/d/1A_thcsphuho_keyboard_input/view?usp=sharing';
      }
    }

    return normalized;
  }

  static addQuestion(q: Question): void {
    // Nếu ID này từng nằm trong danh sách đã xóa, bỏ khỏi danh sách xóa
    const deletedIds = getStored<string[]>(STORAGE_KEYS.DELETED_QUESTION_IDS, []);
    if (deletedIds.includes(q.id)) {
      setStored(
        STORAGE_KEYS.DELETED_QUESTION_IDS,
        deletedIds.filter((id) => id !== q.id)
      );
    }

    const current = this.getQuestions();
    const updated = [q, ...current.filter((item) => item.id !== q.id)];
    setStored(STORAGE_KEYS.QUESTIONS, updated);
    notifyChange('questions');
  }

  static bulkAddQuestions(questions: Question[]): void {
    const current = this.getQuestions();
    const map = new Map<string, Question>();
    questions.forEach((q) => map.set(q.id, q));
    current.forEach((q) => {
      if (!map.has(q.id)) {
        map.set(q.id, q);
      }
    });
    setStored(STORAGE_KEYS.QUESTIONS, Array.from(map.values()));
    notifyChange('questions');
  }

  static updateQuestion(q: Question): void {
    const current = this.getQuestions();
    const exists = current.some((item) => item.id === q.id);
    let updated: Question[];
    if (exists) {
      updated = current.map((item) => (item.id === q.id ? q : item));
    } else {
      updated = [q, ...current];
    }
    setStored(STORAGE_KEYS.QUESTIONS, updated);
    notifyChange('questions');
  }

  static deleteQuestion(id: string): void {
    const deletedIds = getStored<string[]>(STORAGE_KEYS.DELETED_QUESTION_IDS, []);
    if (!deletedIds.includes(id)) {
      setStored(STORAGE_KEYS.DELETED_QUESTION_IDS, [...deletedIds, id]);
    }
    const current = this.getQuestions();
    const list = current.filter((item) => item.id !== id);
    setStored(STORAGE_KEYS.QUESTIONS, list);
    notifyChange('questions');
  }

  static importQuestions(newQuestions: Question[]): void {
    if (!newQuestions || newQuestions.length === 0) return;
    const existing = this.getQuestions();
    const map = new Map<string, Question>();
    existing.forEach((q) => map.set(q.id, q));

    newQuestions.forEach((q) => {
      if (q && q.id) {
        // Tìm xem có câu trùng mã code không để cập nhật
        if (q.code) {
          const matchedByCode = Array.from(map.values()).find((item) => item.code === q.code);
          if (matchedByCode) {
            map.set(matchedByCode.id, { ...matchedByCode, ...q, id: matchedByCode.id });
            return;
          }
        }
        map.set(q.id, q);
      }
    });

    const merged = Array.from(map.values());
    setStored(STORAGE_KEYS.QUESTIONS, merged);
    notifyChange('questions');
  }

  // Tests
  static getTests(): Test[] {
    const list = getStored<Test[]>(STORAGE_KEYS.TESTS, INITIAL_TESTS);
    return list.map((test) => {
      if (test.matrix?.selectedTopics && test.matrix.selectedTopics.some((t) => t.includes('Chủ đề A') || t.includes('Chủ đề B') || t.includes('Chủ đề C') || t.includes('Chủ đề D') || t.includes('Chủ đề E') || t.includes('Chủ đề F'))) {
        const normalized = test.matrix.selectedTopics.map((top) => normalizeKNTTTopic(top, test.gradeLevel));
        return {
          ...test,
          matrix: {
            ...test.matrix,
            selectedTopics: Array.from(new Set(normalized))
          }
        };
      }
      return test;
    });
  }

  static addTest(test: Test): void {
    const list = this.getTests();
    setStored(STORAGE_KEYS.TESTS, [test, ...list]);
    notifyChange('tests');
  }

  static updateTest(test: Test): void {
    const list = this.getTests().map((t) => (t.id === test.id ? test : t));
    setStored(STORAGE_KEYS.TESTS, list);
    notifyChange('tests');
  }

  static deleteTest(id: string): void {
    const list = this.getTests().filter((t) => t.id !== id);
    setStored(STORAGE_KEYS.TESTS, list);
    notifyChange('tests');
  }

  static importTests(newTests: Test[]): void {
    if (!Array.isArray(newTests) || newTests.length === 0) return;
    const existing = this.getTests();
    const allQuestions = this.getQuestions();
    const map = new Map<string, Test>();
    const titleToId = new Map<string, string>();

    existing.forEach((t) => {
      map.set(t.id, t);
      if (t.title) titleToId.set(t.title.trim().toLowerCase(), t.id);
    });

    newTests.forEach((t) => {
      if (!t || !t.title) return;
      const cleanTitle = t.title.trim().toLowerCase();
      const existingId = map.has(t.id) ? t.id : titleToId.get(cleanTitle);
      const targetId = existingId || t.id;
      const prev = map.get(targetId);

      // Đảm bảo danh sách ID câu hỏi luôn hợp lệ, không bao giờ để undefined
      let questionIds: string[] = [];
      if (Array.isArray(t.questionIds) && t.questionIds.length > 0) {
        questionIds = t.questionIds;
      } else if (prev && Array.isArray(prev.questionIds) && prev.questionIds.length > 0) {
        questionIds = prev.questionIds;
      } else if (t.variants?.[0]?.questionIds && t.variants[0].questionIds.length > 0) {
        questionIds = t.variants[0].questionIds;
      } else {
        // Tự động gán câu hỏi phù hợp với khối lớp từ ngân hàng câu hỏi
        const gradeQuestions = allQuestions.filter((q) => q.gradeLevel === (t.gradeLevel || 6));
        const count = t.totalQuestions || 20;
        questionIds = gradeQuestions.slice(0, count).map((q) => q.id);
      }

      const totalQuestions = questionIds.length > 0 ? questionIds.length : (t.totalQuestions || 20);
      const variantCode = t.variants?.[0]?.code || (prev?.variants?.[0]?.code) || '101';
      const variants: TestVariant[] = [
        {
          code: variantCode,
          questionIds
        }
      ];

      const mergedTest: Test = {
        ...prev,
        ...t,
        id: targetId,
        totalQuestions,
        totalPoints: t.totalPoints || prev?.totalPoints || 10,
        questionIds,
        variants,
        createdBy: t.createdBy || prev?.createdBy || 'user-admin-01',
        authorName: t.authorName || prev?.authorName || 'Giáo viên Tin học',
        createdAt: t.createdAt || prev?.createdAt || new Date().toISOString().split('T')[0],
        status: (t.status === 'DRAFT' ? 'DRAFT' : 'READY') as 'DRAFT' | 'READY',
        matrix: t.matrix || prev?.matrix || {
          knowCount: Math.round(totalQuestions * 0.4),
          understandCount: Math.round(totalQuestions * 0.3),
          applyCount: Math.max(0, totalQuestions - Math.round(totalQuestions * 0.7)),
          selectedTopics: []
        }
      };

      map.set(targetId, mergedTest);
      titleToId.set(cleanTitle, targetId);
    });

    const merged = Array.from(map.values());
    setStored(STORAGE_KEYS.TESTS, merged);
    notifyChange('tests');
  }

  // Assignments
  static getAssignments(): Assignment[] {
    return getStored<Assignment[]>(STORAGE_KEYS.ASSIGNMENTS, INITIAL_ASSIGNMENTS);
  }

  static addAssignment(a: Assignment): void {
    const list = this.getAssignments();
    setStored(STORAGE_KEYS.ASSIGNMENTS, [a, ...list]);
    notifyChange('assignments');
  }

  static updateAssignment(a: Assignment): void {
    const list = this.getAssignments().map((item) => (item.id === a.id ? a : item));
    setStored(STORAGE_KEYS.ASSIGNMENTS, list);
    notifyChange('assignments');
  }

  static deleteAssignment(id: string): void {
    const list = this.getAssignments().filter((item) => item.id !== id);
    setStored(STORAGE_KEYS.ASSIGNMENTS, list);
    notifyChange('assignments');
  }

  static importAssignments(newAssignments: Assignment[]): void {
    if (!Array.isArray(newAssignments) || newAssignments.length === 0) return;
    const existing = this.getAssignments();
    const tests = this.getTests();
    const classes = this.getClasses();
    const map = new Map<string, Assignment>();
    const titleToId = new Map<string, string>();

    existing.forEach((a) => {
      map.set(a.id, a);
      if (a.testTitle) titleToId.set(a.testTitle.trim().toLowerCase(), a.id);
    });

    newAssignments.forEach((a) => {
      if (!a || !a.testTitle) return;
      const cleanTitle = a.testTitle.trim().toLowerCase();
      const existingId = map.has(a.id) ? a.id : titleToId.get(cleanTitle);
      const targetId = existingId || a.id;
      const prev = map.get(targetId);

      // Đối chiếu đề thi tương ứng
      const matchedTest = tests.find(
        (t) => t.title.trim().toLowerCase() === cleanTitle || t.id === a.testId
      );
      const testId = matchedTest?.id || (a.testId && a.testId.startsWith('test-') ? a.testId : (tests[0]?.id || `test-${targetId}`));

      // Đối chiếu danh sách lớp
      const classNames = a.classNames && a.classNames.length > 0
        ? a.classNames
        : (prev?.classNames || (classes[0] ? [classes[0].name] : ['6/1']));

      const classIds = classNames
        .map((cn) => classes.find((c) => c.name === cn)?.id || `cls-${cn.replace('/', '-')}`)
        .filter(Boolean);

      const mergedAssignment: Assignment = {
        ...prev,
        ...a,
        id: targetId,
        testId,
        testTitle: matchedTest?.title || a.testTitle,
        gradeLevel: matchedTest?.gradeLevel || a.gradeLevel || 6,
        classNames,
        classIds: classIds.length > 0 ? classIds : (prev?.classIds || [classes[0]?.id || 'cls-6-1']),
        startTime: parseDateTimeFlexible(a.startTime || prev?.startTime),
        endTime: parseDateTimeFlexible(a.endTime || prev?.endTime),
        password: a.password === 'Không có' ? undefined : (a.password || prev?.password),
        allowReviewAfterSubmit: a.allowReviewAfterSubmit ?? prev?.allowReviewAfterSubmit ?? true,
        shuffleQuestions: a.shuffleQuestions ?? prev?.shuffleQuestions ?? true,
        assignedByName: a.assignedByName || prev?.assignedByName || 'Giáo viên',
        createdAt: a.createdAt || prev?.createdAt || new Date().toISOString().split('T')[0],
        status: (a.status as any) === 'CLOSED' ? 'CLOSED' : 'ACTIVE'
      };

      map.set(targetId, mergedAssignment);
      titleToId.set(cleanTitle, targetId);
    });

    const merged = Array.from(map.values());
    setStored(STORAGE_KEYS.ASSIGNMENTS, merged);
    notifyChange('assignments');
  }

  // Submissions
  static getSubmissions(): Submission[] {
    const rawSubs = getStored<Submission[]>(STORAGE_KEYS.SUBMISSIONS, INITIAL_SUBMISSIONS);
    const deletedIds = this.getDeletedUserIds();
    const activeUsers = this.getUsers().filter((u) => u.status !== 'DELETED');
    const activeUserIds = new Set(activeUsers.map((u) => u.id));
    const activeStudentCodes = new Set(activeUsers.map((u) => u.studentCode).filter(Boolean));

    // Lọc bỏ triệt để các bài nộp của tài khoản đã xóa, chỉ lưu và đọc kết quả tài khoản còn hoạt động
    const filtered = rawSubs.filter((s) => {
      if (deletedIds.has(s.studentId)) return false;
      if (s.studentCode && activeStudentCodes.has(s.studentCode)) return true;
      if (activeUserIds.has(s.studentId)) return true;
      return false;
    });

    if (filtered.length !== rawSubs.length) {
      setStored(STORAGE_KEYS.SUBMISSIONS, filtered);
    }
    return filtered;
  }

  static addSubmission(sub: Submission): void {
    const list = this.getSubmissions();
    setStored(STORAGE_KEYS.SUBMISSIONS, [sub, ...list]);
    notifyChange('submissions');
  }

  static updateSubmission(sub: Submission): void {
    const list = this.getSubmissions().map((s) => (s.id === sub.id ? sub : s));
    setStored(STORAGE_KEYS.SUBMISSIONS, list);
    notifyChange('submissions');
  }

  static importSubmissions(newSubs: Submission[]): void {
    const existing = this.getSubmissions();
    const map = new Map<string, Submission>();
    existing.forEach((s) => map.set(s.id, s));
    newSubs.forEach((s) => map.set(s.id, s));
    const merged = Array.from(map.values());
    setStored(STORAGE_KEYS.SUBMISSIONS, merged);
    notifyChange('submissions');
  }

  // Automated Grading Engine
  static gradeSubmission(
    test: Test,
    questions: Question[],
    userAnswers: Record<string, {
      selectedOptionId?: string;
      selectedOptionIds?: string[];
      tfAnswers?: Record<string, boolean>;
      textAnswer?: string;
    }>
  ): {
    evaluatedAnswers: Record<string, StudentAnswer>;
    totalScore: number;
    correctCount: number;
    hasEssay: boolean;
  } {
    const questionMap = new Map(questions.map((q) => [q.id, q]));
    const totalQCount = test.questionIds.length || 1;
    const defaultPointsPerQ = test.totalPoints / totalQCount;

    // Lấy điểm cụ thể của từng câu hỏi theo thiết lập ma trận hoặc phân bổ điểm
    const getQuestionPoints = (qId: string, q: Question): number => {
      if (test.questionPoints && typeof test.questionPoints[qId] === 'number') {
        return test.questionPoints[qId];
      }
      if (test.matrix?.questionPointsMap && typeof test.matrix.questionPointsMap[qId] === 'number') {
        return test.matrix.questionPointsMap[qId];
      }
      if (test.matrix?.grid && test.matrix.grid[q.type]?.[q.difficulty]?.pointPerQuestion) {
        return test.matrix.grid[q.type][q.difficulty].pointPerQuestion;
      }
      return defaultPointsPerQ;
    };

    let totalScore = 0;
    let correctCount = 0;
    let hasEssay = false;
    const evaluatedAnswers: Record<string, StudentAnswer> = {};

    for (const qId of test.questionIds) {
      const q = questionMap.get(qId);
      const answer = userAnswers[qId] || {};

      if (!q) {
        evaluatedAnswers[qId] = {
          questionId: qId,
          pointsEarned: 0,
          isCorrect: false
        };
        continue;
      }

      const pointsPerQuestion = getQuestionPoints(qId, q);

      if (q.type === 'SINGLE_CHOICE') {
        const correctOpt = q.options?.find((o) => o.isCorrect);
        const isRight = Boolean(answer.selectedOptionId && correctOpt && answer.selectedOptionId === correctOpt.id);
        const pts = isRight ? pointsPerQuestion : 0;
        if (isRight) correctCount++;
        totalScore += pts;
        evaluatedAnswers[qId] = {
          questionId: qId,
          selectedOptionId: answer.selectedOptionId,
          isCorrect: isRight,
          pointsEarned: Math.round(pts * 100) / 100
        };
      } else if (q.type === 'MULTIPLE_CHOICE') {
        const correctOptIds = new Set((q.options || []).filter((o) => o.isCorrect).map((o) => o.id));
        const userOptIds = new Set(answer.selectedOptionIds || []);
        
        let isRight = false;
        if (correctOptIds.size > 0 && correctOptIds.size === userOptIds.size) {
          isRight = Array.from(correctOptIds).every((id) => userOptIds.has(id));
        }
        const pts = isRight ? pointsPerQuestion : 0;
        if (isRight) correctCount++;
        totalScore += pts;
        evaluatedAnswers[qId] = {
          questionId: qId,
          selectedOptionIds: answer.selectedOptionIds || [],
          isCorrect: isRight,
          pointsEarned: Math.round(pts * 100) / 100
        };
      } else if (q.type === 'TRUE_FALSE') {
        const statements = q.trueFalseStatements || [];
        const userTf = answer.tfAnswers || {};
        let allCorrect = true;
        let matchedCount = 0;

        for (const st of statements) {
          if (userTf[st.id] === st.isCorrect) {
            matchedCount++;
          } else {
            allCorrect = false;
          }
        }

        // Tỷ lệ điểm theo số ý đúng (chuẩn đánh giá định dạng mới)
        const ratio = statements.length > 0 ? matchedCount / statements.length : 0;
        const pts = pointsPerQuestion * ratio;
        if (allCorrect && statements.length > 0) correctCount++;
        totalScore += pts;
        evaluatedAnswers[qId] = {
          questionId: qId,
          tfAnswers: userTf,
          isCorrect: allCorrect,
          pointsEarned: Math.round(pts * 100) / 100
        };
      } else if (q.type === 'FILL_IN_BLANK') {
        const userVal = (answer.textAnswer || '').trim().toLowerCase();
        const expectedVal = (q.correctAnswerText || '').trim().toLowerCase();
        const isRight = Boolean(userVal && expectedVal && userVal === expectedVal);
        const pts = isRight ? pointsPerQuestion : 0;
        if (isRight) correctCount++;
        totalScore += pts;
        evaluatedAnswers[qId] = {
          questionId: qId,
          textAnswer: answer.textAnswer,
          isCorrect: isRight,
          pointsEarned: Math.round(pts * 100) / 100
        };
      } else if (q.type === 'ESSAY') {
        hasEssay = true;
        evaluatedAnswers[qId] = {
          questionId: qId,
          textAnswer: answer.textAnswer,
          isCorrect: undefined, // Pending teacher manual grade
          pointsEarned: 0
        };
      }
    }

    return {
      evaluatedAnswers,
      totalScore: Math.round(totalScore * 10) / 10,
      correctCount,
      hasEssay
    };
  }

  // Question Analysis (Item Analysis)
  static analyzeQuestions(gradeFilter?: number): QuestionAnalysisItem[] {
    const allQuestions = this.getQuestions();
    const allSubmissions = this.getSubmissions();

    const result: QuestionAnalysisItem[] = [];

    const filteredQuestions = gradeFilter
      ? allQuestions.filter((q) => q.gradeLevel === gradeFilter)
      : allQuestions;

    for (const q of filteredQuestions) {
      let totalAttempts = 0;
      let correctAttempts = 0;

      for (const sub of allSubmissions) {
        if (sub.answers && sub.answers[q.id]) {
          totalAttempts++;
          if (sub.answers[q.id].isCorrect) {
            correctAttempts++;
          }
        }
      }

      const correctRate = totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 0;

      result.push({
        questionId: q.id,
        code: q.code,
        content: q.content,
        gradeLevel: q.gradeLevel,
        difficulty: q.difficulty,
        totalAttempts,
        correctAttempts,
        correctRate,
        isLowPerformance: totalAttempts >= 2 && correctRate < 50
      });
    }

    return result;
  }

  // Reset to sample initial database
  static resetToDefault(): void {
    localStorage.removeItem(STORAGE_KEYS.SCHOOL);
    localStorage.removeItem(STORAGE_KEYS.ACADEMIC_YEARS);
    localStorage.removeItem(STORAGE_KEYS.GRADES);
    localStorage.removeItem(STORAGE_KEYS.CLASSES);
    localStorage.removeItem(STORAGE_KEYS.USERS);
    localStorage.removeItem(STORAGE_KEYS.TOPICS);
    localStorage.removeItem(STORAGE_KEYS.QUESTIONS);
    localStorage.removeItem(STORAGE_KEYS.TESTS);
    localStorage.removeItem(STORAGE_KEYS.ASSIGNMENTS);
    localStorage.removeItem(STORAGE_KEYS.SUBMISSIONS);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }

  // Export all DB to JSON backup
  static exportDatabaseJSON(): string {
    const data = {
      school: this.getSchool(),
      academicYears: this.getAcademicYears(),
      grades: this.getGrades(),
      classes: this.getClasses(),
      users: this.getUsers(),
      topics: this.getTopics(),
      questions: this.getQuestions(),
      tests: this.getTests(),
      assignments: this.getAssignments(),
      submissions: this.getSubmissions(),
      exportedAt: new Date().toISOString()
    };
    return JSON.stringify(data, null, 2);
  }

  // Export Results to CSV/Excel string
  static exportSubmissionsToCSV(assignmentId?: string): string {
    const submissions = this.getSubmissions().filter((s) => !assignmentId || s.assignmentId === assignmentId);
    const headers = ['Mã bài nộp', 'Họ và tên học sinh', 'Mã số HS', 'Lớp', 'Tên bài kiểm tra', 'Mã đề', 'Điểm', 'Số câu đúng', 'Tổng số câu', 'Thời gian nộp', 'Trạng thái'];
    
    const rows = submissions.map((s) => [
      s.id,
      `"${s.studentName}"`,
      s.studentCode,
      s.className,
      `"${s.testTitle}"`,
      s.variantCode,
      s.score,
      s.correctCount,
      s.totalQuestions,
      new Date(s.submittedAt).toLocaleString('vi-VN'),
      s.isViolationAutoSubmitted ? 'Vi phạm quy chế (Rời tab)' : s.status === 'COMPLETED' ? 'Đã hoàn thành' : 'Chờ chấm tự luận'
    ]);

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  }

  /**
   * Báo cáo chi tiết kết quả từng đề thi: học sinh đã tham gia và chưa tham gia
   */
  static getExamParticipationReport(params: {
    assignmentId?: string;
    testId?: string;
    classId?: string;
  }): {
    targetTitle: string;
    targetGrade: number;
    assignedClasses: string[];
    allRoster: Array<{
      id: string;
      studentCode: string;
      fullName: string;
      className: string;
      classId: string;
      avatarUrl?: string;
      participated: boolean;
      submission?: Submission;
    }>;
    participatedStudents: Array<{
      id: string;
      studentCode: string;
      fullName: string;
      className: string;
      classId: string;
      avatarUrl?: string;
      submission: Submission;
    }>;
    notParticipatedStudents: Array<{
      id: string;
      studentCode: string;
      fullName: string;
      className: string;
      classId: string;
      avatarUrl?: string;
      homeroomTeacherName?: string;
    }>;
    stats: {
      totalAssigned: number;
      participatedCount: number;
      notParticipatedCount: number;
      participatedRate: number;
      avgScore: number;
      passRate: number;
      violationCount: number;
    };
  } {
    const allUsers = this.getUsers();
    const allClasses = this.getClasses();
    const allAssignments = this.getAssignments();
    const allTests = this.getTests();
    const allSubmissions = this.getSubmissions();

    let targetTitle = 'Tất cả các bài kiểm tra';
    let targetGrade = 6;
    let targetClassIds: string[] = [];

    let currentAssignment: Assignment | undefined;
    let currentTest: Test | undefined;

    if (params.assignmentId && params.assignmentId !== 'ALL') {
      currentAssignment = allAssignments.find((a) => a.id === params.assignmentId);
      if (currentAssignment) {
        targetTitle = currentAssignment.testTitle;
        targetGrade = currentAssignment.gradeLevel;
        targetClassIds = [...currentAssignment.classIds];
        currentTest = allTests.find((t) => t.id === currentAssignment?.testId);
      }
    } else if (params.testId && params.testId !== 'ALL') {
      currentTest = allTests.find((t) => t.id === params.testId);
      if (currentTest) {
        targetTitle = currentTest.title;
        targetGrade = currentTest.gradeLevel;
        // Lấy tất cả lớp được giao bài của test này
        const matchingAssigns = allAssignments.filter((a) => a.testId === currentTest?.id);
        if (matchingAssigns.length > 0) {
          targetClassIds = Array.from(new Set(matchingAssigns.flatMap((a) => a.classIds)));
        } else {
          // Lấy tất cả lớp thuộc khối này
          targetClassIds = allClasses.filter((c) => c.gradeId === `grade-${currentTest?.gradeLevel}`).map((c) => c.id);
        }
      }
    }

    // Nếu lọc theo 1 lớp cụ thể
    if (params.classId && params.classId !== 'ALL') {
      targetClassIds = [params.classId];
    }

    // Lọc bài nộp liên quan
    const matchingSubs = allSubmissions.filter((s) => {
      if (currentAssignment) {
        if (s.assignmentId !== currentAssignment.id && s.testId !== currentAssignment.testId) return false;
      } else if (currentTest) {
        if (s.testId !== currentTest.id) return false;
      }
      if (params.classId && params.classId !== 'ALL') {
        if (s.classId !== params.classId) return false;
      } else if (targetClassIds.length > 0) {
        if (!targetClassIds.includes(s.classId)) return false;
      }
      return true;
    });

    // Lấy danh sách học sinh thuộc các lớp được giao (chỉ lấy học sinh còn hoạt động)
    const studentUsers = allUsers.filter((u) => {
      if (u.role !== 'STUDENT' || u.status === 'DELETED') return false;
      if (targetClassIds.length > 0) {
        return targetClassIds.includes(u.classId || '');
      }
      // Nếu chọn ALL tất cả
      return true;
    });

    // Tìm tên lớp tương ứng
    const getClassName = (cId?: string, fallbackName?: string) => {
      if (fallbackName) return fallbackName;
      const found = allClasses.find((c) => c.id === cId);
      return found ? found.name : 'Chưa xếp lớp';
    };

    const getHomeroomTeacher = (cId?: string) => {
      const found = allClasses.find((c) => c.id === cId);
      return found?.homeroomTeacherName || 'Chưa phân công';
    };

    const participatedList: Array<{
      id: string;
      studentCode: string;
      fullName: string;
      className: string;
      classId: string;
      avatarUrl?: string;
      submission: Submission;
    }> = [];

    const notParticipatedList: Array<{
      id: string;
      studentCode: string;
      fullName: string;
      className: string;
      classId: string;
      avatarUrl?: string;
      homeroomTeacherName?: string;
    }> = [];

    const submittedStudentIds = new Set<string>();
    const submittedStudentCodes = new Set<string>();

    matchingSubs.forEach((sub) => {
      submittedStudentIds.add(sub.studentId);
      if (sub.studentCode) submittedStudentCodes.add(sub.studentCode.toLowerCase());
      const stu = studentUsers.find((u) => u.id === sub.studentId || (u.studentCode && sub.studentCode && u.studentCode.toLowerCase() === sub.studentCode.toLowerCase()));
      participatedList.push({
        id: sub.studentId,
        studentCode: sub.studentCode,
        fullName: sub.studentName,
        className: sub.className,
        classId: sub.classId,
        avatarUrl: stu?.avatarUrl,
        submission: sub
      });
    });

    studentUsers.forEach((stu) => {
      const hasTaken =
        submittedStudentIds.has(stu.id) ||
        (stu.studentCode && submittedStudentCodes.has(stu.studentCode.toLowerCase()));

      if (!hasTaken) {
        notParticipatedList.push({
          id: stu.id,
          studentCode: stu.studentCode || stu.username,
          fullName: stu.fullName,
          className: getClassName(stu.classId),
          classId: stu.classId || '',
          avatarUrl: stu.avatarUrl,
          homeroomTeacherName: getHomeroomTeacher(stu.classId)
        });
      }
    });

    const allRoster = [
      ...participatedList.map((p) => ({
        id: p.id,
        studentCode: p.studentCode,
        fullName: p.fullName,
        className: p.className,
        classId: p.classId,
        avatarUrl: p.avatarUrl,
        participated: true,
        submission: p.submission
      })),
      ...notParticipatedList.map((np) => ({
        id: np.id,
        studentCode: np.studentCode,
        fullName: np.fullName,
        className: np.className,
        classId: np.classId,
        avatarUrl: np.avatarUrl,
        participated: false,
        submission: undefined
      }))
    ];

    const totalAssigned = allRoster.length;
    const participatedCount = participatedList.length;
    const notParticipatedCount = notParticipatedList.length;
    const participatedRate = totalAssigned > 0 ? Math.round((participatedCount / totalAssigned) * 100) : 0;

    const sumScore = participatedList.reduce((acc, curr) => acc + curr.submission.score, 0);
    const avgScore = participatedCount > 0 ? Number((sumScore / participatedCount).toFixed(1)) : 0;
    const passedCount = participatedList.filter((p) => p.submission.score >= 5.0).length;
    const passRate = participatedCount > 0 ? Math.round((passedCount / participatedCount) * 100) : 0;
    const violationCount = participatedList.filter((p) => p.submission.isViolationAutoSubmitted).length;

    const assignedClassNames = targetClassIds.map((cid) => getClassName(cid));

    return {
      targetTitle,
      targetGrade,
      assignedClasses: assignedClassNames,
      allRoster,
      participatedStudents: participatedList,
      notParticipatedStudents: notParticipatedList,
      stats: {
        totalAssigned,
        participatedCount,
        notParticipatedCount,
        participatedRate,
        avgScore,
        passRate,
        violationCount
      }
    };
  }

  /**
   * Xuất danh sách kết quả bài thi bao gồm cả học sinh tham gia và chưa tham gia
   */
  static exportExamParticipationCSV(params: {
    assignmentId?: string;
    testId?: string;
    classId?: string;
  }): string {
    const report = this.getExamParticipationReport(params);
    const headers = [
      'STT',
      'Mã học sinh',
      'Họ và tên',
      'Lớp',
      'Tên bài kiểm tra',
      'Trạng thái tham gia',
      'Điểm số',
      'Xếp loại',
      'Số câu đúng',
      'Thời gian nộp',
      'Ghi chú / Vi phạm'
    ];

    let index = 1;
    const rows = report.allRoster.map((item) => {
      const getRating = (score: number) => {
        if (score >= 8.5) return 'Giỏi';
        if (score >= 6.5) return 'Khá';
        if (score >= 5.0) return 'Đạt';
        return 'Chưa đạt';
      };

      if (item.participated && item.submission) {
        return [
          index++,
          item.studentCode,
          `"${item.fullName}"`,
          `"Lớp ${item.className}"`,
          `"${report.targetTitle}"`,
          'Đã tham gia',
          item.submission.score.toFixed(1),
          getRating(item.submission.score),
          `"${item.submission.correctCount}/${item.submission.totalQuestions}"`,
          new Date(item.submission.submittedAt).toLocaleString('vi-VN'),
          item.submission.isViolationAutoSubmitted
            ? `"${item.submission.violationReason || 'Vi phạm: Rời tab thi'}"`
            : 'Hoàn thành bình thường'
        ];
      } else {
        return [
          index++,
          item.studentCode,
          `"${item.fullName}"`,
          `"Lớp ${item.className}"`,
          `"${report.targetTitle}"`,
          'Chưa tham gia',
          '-',
          'Vắng thi',
          '-',
          '-',
          'Chưa nộp bài / Chưa vào phòng thi'
        ];
      }
    });

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  }
}
