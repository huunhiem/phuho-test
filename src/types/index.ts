export type UserRole = 'ADMIN' | 'PRINCIPAL' | 'DEPARTMENT_HEAD' | 'TEACHER' | 'STUDENT';

export type QuestionDifficulty = 'BIET' | 'HIEU' | 'VAN_DUNG';

export type QuestionType =
  | 'SINGLE_CHOICE'     // Một đáp án đúng
  | 'MULTIPLE_CHOICE'   // Nhiều đáp án đúng
  | 'TRUE_FALSE'        // Đúng / Sai
  | 'FILL_IN_BLANK'     // Điền khuyết
  | 'ESSAY';            // Tự luận

export interface OptionItem {
  id: string;
  text: string;
  isCorrect?: boolean;
}

export interface TrueFalseStatement {
  id: string;
  statement: string;
  isCorrect: boolean; // true = Đúng, false = Sai
}

export interface User {
  id: string;
  username: string;
  password?: string;    // Mật khẩu đăng nhập
  fullName: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  phone?: string;
  schoolId: string;
  classId?: string;     // Dành cho học sinh
  gradeId?: string;     // Khối
  assignedClassIds?: string[]; // Dành cho giáo viên
  teacherCode?: string; // Mã giáo viên
  studentCode?: string; // Mã số học sinh
  status?: 'ACTIVE' | 'LOCKED';
  createdAt: string;
}

export interface School {
  id: string;
  name: string;
  code: string;
  province: string;
  district: string;
  address: string;
  principalName: string;
  academicYear: string;
}

export interface AcademicYear {
  id: string;
  name: string; // e.g. "2025-2026"
  isCurrent: boolean;
  startDate: string;
  endDate: string;
}

export interface Grade {
  id: string;
  name: string; // "Khối 6", "Khối 7", "Khối 8", "Khối 9"
  level: number; // 6, 7, 8, 9
}

export interface ClassRoom {
  id: string;
  name: string; // "6/1", "6/2", "7/1", "8/1", "9/1"
  gradeId: string;
  academicYearId: string;
  homeroomTeacherId?: string;
  homeroomTeacherName?: string;
  studentCount: number;
}

export interface Subject {
  id: string;
  name: string; // "Tin học"
  code: string; // "TIN"
  gradeId: string;
}

export interface Topic {
  id: string;
  code: string; // "CHU_DE_A", "CHU_DE_B", v.v.
  name: string; // "Chủ đề A: Máy tính và cộng đồng"
  gradeLevel: number;
  description: string;
}

export interface Lesson {
  id: string;
  topicId: string;
  gradeLevel: number;
  lessonNumber: number;
  title: string;
  learningOutcomes: string; // Yêu cầu cần đạt
}

export interface Question {
  id: string;
  code: string; // e.g. "TH6-A-001"
  content: string; // Nội dung câu hỏi
  gradeLevel: number; // 6, 7, 8, 9
  topic: string; // Chủ đề A, B, C, D, E, F
  lessonTitle: string; // Tên bài học
  learningOutcome: string; // Yêu cầu cần đạt
  difficulty: QuestionDifficulty; // BIET | HIEU | VAN_DUNG
  type: QuestionType;
  options?: OptionItem[]; // Cho SINGLE_CHOICE và MULTIPLE_CHOICE
  trueFalseStatements?: TrueFalseStatement[]; // Cho TRUE_FALSE
  correctAnswerText?: string; // Cho FILL_IN_BLANK
  essaySampleAnswer?: string; // Cho ESSAY
  explanation?: string; // Lời giải chi tiết
  imageUrl?: string;
  imageDriveUrl?: string;
  imageDriveFileId?: string;
  createdBy: string;
  authorName: string;
  createdAt: string;
  status: 'ACTIVE' | 'DRAFT';
}

export interface MatrixCellConfig {
  count: number;             // Số câu hỏi ở ô này
  pointPerQuestion: number;  // Số điểm mỗi câu hỏi
}

export type MatrixGrid = Record<QuestionType, Record<QuestionDifficulty, MatrixCellConfig>>;

export interface MatrixSummaryLevel {
  count: number;
  points: number;
  percentage: number;
}

export interface MatrixSummaryType {
  count: number;
  points: number;
}

export interface TestMatrix {
  knowCount: number;       // Số câu Biết
  understandCount: number; // Số câu Hiểu
  applyCount: number;      // Số câu Vận dụng
  selectedTopics: string[];
  selectedLessons?: string[]; // Danh sách bài học được chọn để tạo đề
  // Ma trận 2 chiều chi tiết: Dạng câu hỏi x Mức độ
  grid?: MatrixGrid;
  // Tổng hợp số câu và số điểm theo Mức độ
  difficultyPoints?: Record<QuestionDifficulty, { count: number; points: number }>;
  // Tổng hợp số câu và số điểm theo Dạng câu hỏi
  typePoints?: Record<QuestionType, { count: number; points: number }>;
  // Map điểm số của từng câu hỏi (questionId -> số điểm)
  questionPointsMap?: Record<string, number>;
}

export interface TestVariant {
  code: string; // "101", "102", "103", "104"
  questionIds: string[]; // Danh sách ID câu hỏi đã xáo trộn
  shuffledOptionOrder?: Record<string, string[]>; // Map questionId -> order of option ids
}

export interface Test {
  id: string;
  title: string;
  gradeLevel: number;
  durationMinutes: number; // Thời gian làm bài (phút)
  totalQuestions: number;
  totalPoints: number; // Thang điểm (thường là 10)
  matrix: TestMatrix;
  questionIds: string[]; // Bộ câu hỏi gốc
  questionPoints?: Record<string, number>; // Phân bổ điểm chi tiết theo câu hỏi (questionId -> points)
  variants: TestVariant[]; // Danh sách các mã đề
  createdBy: string;
  authorName: string;
  createdAt: string;
  status: 'DRAFT' | 'READY';
}

export interface Assignment {
  id: string;
  testId: string;
  testTitle: string;
  gradeLevel: number;
  classIds: string[];
  classNames: string[];
  startTime: string;
  endTime: string;
  password?: string;
  allowReviewAfterSubmit: boolean;
  shuffleQuestions: boolean;
  status: 'UPCOMING' | 'ACTIVE' | 'CLOSED';
  assignedBy: string;
  assignedByName: string;
  createdAt: string;
}

export interface StudentAnswer {
  questionId: string;
  selectedOptionId?: string; // Cho single choice
  selectedOptionIds?: string[]; // Cho multiple choice
  tfAnswers?: Record<string, boolean>; // statementId -> boolean (cho True/False)
  textAnswer?: string; // Cho fill in blank hoặc essay
  isCorrect?: boolean;
  pointsEarned: number;
  teacherComment?: string;
}

export interface Submission {
  id: string;
  assignmentId: string;
  testId: string;
  testTitle: string;
  variantCode: string;
  studentId: string;
  studentName: string;
  studentCode: string;
  classId: string;
  className: string;
  gradeLevel: number;
  answers: Record<string, StudentAnswer>; // questionId -> StudentAnswer
  score: number;
  maxScore: number;
  correctCount: number;
  totalQuestions: number;
  startedAt: string;
  submittedAt: string;
  timeSpentSeconds: number;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'PENDING_ESSAY_GRADING';
  gradedBy?: string;
  gradedAt?: string;
  isViolationAutoSubmitted?: boolean; // Tự động nộp bài do vi phạm quy chế (chuyển tab)
  violationReason?: string; // Lý do vi phạm (ví dụ: Chuyển tab / rời khỏi màn hình kiểm tra)
  tabSwitchCount?: number; // Số lần phát hiện chuyển tab
}

export interface QuestionAnalysisItem {
  questionId: string;
  code: string;
  content: string;
  gradeLevel: number;
  difficulty: QuestionDifficulty;
  totalAttempts: number;
  correctAttempts: number;
  correctRate: number; // 0 - 100%
  isLowPerformance: boolean; // true nếu correctRate < 50%
}
