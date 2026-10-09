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
    notifyChange('classes');
  }

  static importClasses(newClasses: ClassRoom[]): void {
    const existing = this.getClasses();
    const map = new Map<string, ClassRoom>();
    existing.forEach((c) => map.set(c.id, c));
    newClasses.forEach((c) => map.set(c.id, c));
    const merged = Array.from(map.values());
    setStored(STORAGE_KEYS.CLASSES, merged);
    notifyChange('classes');
  }

  // Users
  static getUsers(): User[] {
    return getStored<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
  }

  static addUser(user: User): void {
    const list = this.getUsers();
    setStored(STORAGE_KEYS.USERS, [user, ...list]);
    notifyChange('users');
  }

  static updateUser(user: User): void {
    const list = this.getUsers().map((u) => (u.id === user.id ? user : u));
    setStored(STORAGE_KEYS.USERS, list);
    const current = this.getCurrentUser();
    if (current && current.id === user.id) {
      this.setCurrentUser(user);
    }
    notifyChange('users');
  }

  static deleteUser(id: string): void {
    const list = this.getUsers().filter((u) => u.id !== id);
    setStored(STORAGE_KEYS.USERS, list);
    notifyChange('users');
  }

  static importStudents(newStudents: User[]): void {
    const existing = this.getUsers();
    const updated = [...newStudents, ...existing];
    setStored(STORAGE_KEYS.USERS, updated);
    notifyChange('users');
  }

  // Topics
  static getTopics(): Topic[] {
    return getStored<Topic[]>(STORAGE_KEYS.TOPICS, INITIAL_TOPICS);
  }

  // Lessons
  static getLessons(): Lesson[] {
    return getStored<Lesson[]>(STORAGE_KEYS.LESSONS, INITIAL_LESSONS);
  }

  static getLessonsByGrade(gradeLevel: number): Lesson[] {
    const all = this.getLessons();
    return all.filter((l) => l.gradeLevel === gradeLevel);
  }

  static getLessonsByGradeAndTopic(gradeLevel: number, topicIdOrName: string): Lesson[] {
    const all = this.getLessons();
    return all.filter((l) => {
      if (l.gradeLevel !== gradeLevel) return false;
      if (!topicIdOrName) return true;
      if (l.topicId === topicIdOrName) return true;
      // If topicIdOrName is a topic name or contains code
      if (topicIdOrName.includes('top-') && l.topicId === topicIdOrName) return true;
      const lower = topicIdOrName.toLowerCase();
      if (l.topicId === 'top-a' && (lower.includes('chủ đề a') || lower.includes('máy tính và cộng đồng'))) return true;
      if (l.topicId === 'top-b' && (lower.includes('chủ đề b') || lower.includes('mạng máy tính'))) return true;
      if (l.topicId === 'top-c' && (lower.includes('chủ đề c') || lower.includes('tổ chức lưu trữ'))) return true;
      if (l.topicId === 'top-d' && (lower.includes('chủ đề d') || lower.includes('đạo đức, pháp luật'))) return true;
      if (l.topicId === 'top-e' && (lower.includes('chủ đề e') || lower.includes('ứng dụng tin học'))) return true;
      if (l.topicId === 'top-f' && (lower.includes('chủ đề f') || lower.includes('giải quyết vấn đề'))) return true;
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

  // Questions
  static getQuestions(): Question[] {
    const raw = getStored<Question[]>(STORAGE_KEYS.QUESTIONS, INITIAL_QUESTIONS);
    const topics = this.getTopics();

    // Chuẩn hóa và khắc phục dữ liệu câu hỏi nếu có trường bị thiếu từ Google Sheet
    const normalized: Question[] = (raw && raw.length > 0 ? raw : INITIAL_QUESTIONS).map((q, idx) => {
      const gradeLevel = Number(q.gradeLevel || (q as any).grade) || 6;
      let topic = q.topic || (q as any).topicName;
      if (!topic && (q as any).topicId) {
        const found = topics.find((t) => t.id === (q as any).topicId);
        topic = found ? found.name : 'Chủ đề A: Máy tính và cộng đồng';
      }
      if (!topic) {
        topic = 'Chủ đề A: Máy tính và cộng đồng';
      }

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
    const list = this.getQuestions();
    setStored(STORAGE_KEYS.QUESTIONS, [q, ...list]);
    notifyChange('questions');
  }

  static bulkAddQuestions(questions: Question[]): void {
    const list = this.getQuestions();
    setStored(STORAGE_KEYS.QUESTIONS, [...questions, ...list]);
    notifyChange('questions');
  }

  static updateQuestion(q: Question): void {
    const list = this.getQuestions().map((item) => (item.id === q.id ? q : item));
    setStored(STORAGE_KEYS.QUESTIONS, list);
    notifyChange('questions');
  }

  static deleteQuestion(id: string): void {
    const list = this.getQuestions().filter((item) => item.id !== id);
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
        map.set(q.id, q);
      }
    });
    const merged = Array.from(map.values());
    setStored(STORAGE_KEYS.QUESTIONS, merged);
    notifyChange('questions');
  }

  // Tests
  static getTests(): Test[] {
    return getStored<Test[]>(STORAGE_KEYS.TESTS, INITIAL_TESTS);
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

  // Submissions
  static getSubmissions(): Submission[] {
    return getStored<Submission[]>(STORAGE_KEYS.SUBMISSIONS, INITIAL_SUBMISSIONS);
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
      s.status === 'COMPLETED' ? 'Đã hoàn thành' : 'Chờ chấm tự luận'
    ]);

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  }
}
