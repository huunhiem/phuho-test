import {
  School,
  AcademicYear,
  Grade,
  ClassRoom,
  User,
  Topic,
  Lesson,
  Question,
  Test,
  Assignment,
  Submission
} from '../types';

export const INITIAL_SCHOOL: School = {
  id: 'school-phuho-01',
  name: 'Trường THCS Phú Hồ',
  code: 'THCS-PHUHO',
  province: 'Thành phố Huế',
  district: 'Xã Phú Hồ',
  address: 'Xã Phú Hồ, thành phố Huế',
  principalName: 'Trần Văn Khoa',
  academicYear: '2025-2026'
};

export const INITIAL_ACADEMIC_YEARS: AcademicYear[] = [
  { id: 'ay-2025-2026', name: '2025-2026', isCurrent: true, startDate: '2025-09-05', endDate: '2026-05-31' },
  { id: 'ay-2024-2025', name: '2024-2025', isCurrent: false, startDate: '2024-09-05', endDate: '2025-05-31' }
];

export const INITIAL_GRADES: Grade[] = [
  { id: 'grade-6', name: 'Khối 6', level: 6 },
  { id: 'grade-7', name: 'Khối 7', level: 7 },
  { id: 'grade-8', name: 'Khối 8', level: 8 },
  { id: 'grade-9', name: 'Khối 9', level: 9 }
];

export const INITIAL_CLASSES: ClassRoom[] = [
  { id: 'cls-6-1', name: '6/1', gradeId: 'grade-6', academicYearId: 'ay-2025-2026', homeroomTeacherId: 'user-teacher-01', homeroomTeacherName: 'Nguyễn Hữu Dũng', subjectTeacherId: 'user-teacher-01', subjectTeacherName: 'Nguyễn Hữu Dũng', assignedTeacherIds: ['user-teacher-01'], studentCount: 38 },
  { id: 'cls-6-2', name: '6/2', gradeId: 'grade-6', academicYearId: 'ay-2025-2026', homeroomTeacherId: 'user-depthead-01', homeroomTeacherName: 'Lê Thị Mai', subjectTeacherId: 'user-depthead-01', subjectTeacherName: 'Lê Thị Mai', assignedTeacherIds: ['user-depthead-01'], studentCount: 36 },
  { id: 'cls-7-1', name: '7/1', gradeId: 'grade-7', academicYearId: 'ay-2025-2026', homeroomTeacherId: 'user-teacher-01', homeroomTeacherName: 'Nguyễn Hữu Dũng', subjectTeacherId: 'user-teacher-01', subjectTeacherName: 'Nguyễn Hữu Dũng', assignedTeacherIds: ['user-teacher-01'], studentCount: 40 },
  { id: 'cls-7-2', name: '7/2', gradeId: 'grade-7', academicYearId: 'ay-2025-2026', homeroomTeacherId: 'user-depthead-01', homeroomTeacherName: 'Lê Thị Mai', subjectTeacherId: 'user-depthead-01', subjectTeacherName: 'Lê Thị Mai', assignedTeacherIds: ['user-depthead-01'], studentCount: 39 },
  { id: 'cls-8-1', name: '8/1', gradeId: 'grade-8', academicYearId: 'ay-2025-2026', homeroomTeacherId: 'user-teacher-02', homeroomTeacherName: 'Phan Quốc Bảo', subjectTeacherId: 'user-teacher-02', subjectTeacherName: 'Phan Quốc Bảo', assignedTeacherIds: ['user-teacher-02'], studentCount: 41 },
  { id: 'cls-8-7', name: '8/7', gradeId: 'grade-8', academicYearId: 'ay-2025-2026', homeroomTeacherId: 'user-teacher-02', homeroomTeacherName: 'Phan Quốc Bảo', subjectTeacherId: 'user-teacher-02', subjectTeacherName: 'Phan Quốc Bảo', assignedTeacherIds: ['user-teacher-02'], studentCount: 42 },
  { id: 'cls-8-8', name: '8/8', gradeId: 'grade-8', academicYearId: 'ay-2025-2026', homeroomTeacherId: 'user-teacher-02', homeroomTeacherName: 'Phan Quốc Bảo', subjectTeacherId: 'user-teacher-02', subjectTeacherName: 'Phan Quốc Bảo', assignedTeacherIds: ['user-teacher-02'], studentCount: 40 },
  { id: 'cls-9-1', name: '9/1', gradeId: 'grade-9', academicYearId: 'ay-2025-2026', homeroomTeacherId: 'user-teacher-02', homeroomTeacherName: 'Phan Quốc Bảo', subjectTeacherId: 'user-teacher-02', subjectTeacherName: 'Phan Quốc Bảo', assignedTeacherIds: ['user-teacher-02'], studentCount: 37 }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'user-admin-01',
    username: 'admin',
    password: 'admin@phuho2025',
    fullName: 'Quản trị viên Hệ thống',
    email: 'admin@thcs-phuho.edu.vn',
    role: 'ADMIN',
    schoolId: 'school-phuho-01',
    phone: '0905123456',
    status: 'ACTIVE',
    createdAt: '2025-08-01'
  },
  {
    id: 'user-principal-01',
    username: 'hieutruong',
    password: 'phuho@2025',
    fullName: 'Thầy Trần Văn Khoa',
    email: 'hieutruong@thcs-phuho.edu.vn',
    role: 'PRINCIPAL',
    schoolId: 'school-phuho-01',
    phone: '0913987654',
    status: 'ACTIVE',
    createdAt: '2025-08-01'
  },
  {
    id: 'user-depthead-01',
    username: 'totruong.tin',
    password: 'mai@tin2025',
    fullName: 'Cô Lê Thị Mai',
    email: 'mai.lt@thcs-phuho.edu.vn',
    role: 'DEPARTMENT_HEAD',
    schoolId: 'school-phuho-01',
    teacherCode: 'GV-TIN-01',
    assignedClassIds: ['cls-6-2', 'cls-7-2'],
    phone: '0905888999',
    status: 'ACTIVE',
    createdAt: '2025-08-01'
  },
  {
    id: 'user-teacher-01',
    username: 'dung.tin',
    password: 'dung@tin2025',
    fullName: 'Thầy Nguyễn Hữu Dũng',
    email: 'dung.nh@thcs-phuho.edu.vn',
    role: 'TEACHER',
    schoolId: 'school-phuho-01',
    teacherCode: 'GV-TIN-02',
    assignedClassIds: ['cls-6-1', 'cls-7-1'],
    phone: '0988776655',
    status: 'ACTIVE',
    createdAt: '2025-08-01'
  },
  {
    id: 'user-teacher-02',
    username: 'bao.tin',
    password: 'bao@tin2025',
    fullName: 'Thầy Phan Quốc Bảo',
    email: 'bao.pq@thcs-phuho.edu.vn',
    role: 'TEACHER',
    schoolId: 'school-phuho-01',
    teacherCode: 'GV-TIN-03',
    assignedClassIds: ['cls-8-1', 'cls-8-7', 'cls-8-8', 'cls-9-1'],
    phone: '0977665544',
    status: 'ACTIVE',
    createdAt: '2025-08-01'
  },
  {
    id: 'user-student-8701',
    username: 'hs.phuc.8a7',
    password: '123456',
    fullName: 'Hoàng Văn Phúc',
    email: 'phuc.hv.87@thcs-phuho.edu.vn',
    role: 'STUDENT',
    schoolId: 'school-phuho-01',
    classId: 'cls-8-7',
    gradeId: 'grade-8',
    studentCode: 'PH25-080701',
    status: 'ACTIVE',
    createdAt: '2025-08-20'
  },
  {
    id: 'user-student-8702',
    username: 'hs.ha.8a7',
    password: '123456',
    fullName: 'Nguyễn Thị Thu Hà',
    email: 'ha.ntt.87@thcs-phuho.edu.vn',
    role: 'STUDENT',
    schoolId: 'school-phuho-01',
    classId: 'cls-8-7',
    gradeId: 'grade-8',
    studentCode: 'PH25-080702',
    status: 'ACTIVE',
    createdAt: '2025-08-20'
  },
  {
    id: 'user-student-8703',
    username: 'hs.minh.8a7',
    password: '123456',
    fullName: 'Trần Nhật Minh',
    email: 'minh.tn.87@thcs-phuho.edu.vn',
    role: 'STUDENT',
    schoolId: 'school-phuho-01',
    classId: 'cls-8-7',
    gradeId: 'grade-8',
    studentCode: 'PH25-080703',
    status: 'ACTIVE',
    createdAt: '2025-08-20'
  },
  {
    id: 'user-student-8704',
    username: 'hs.linh.8a7',
    password: '123456',
    fullName: 'Võ Thùy Linh',
    email: 'linh.vt.87@thcs-phuho.edu.vn',
    role: 'STUDENT',
    schoolId: 'school-phuho-01',
    classId: 'cls-8-7',
    gradeId: 'grade-8',
    studentCode: 'PH25-080704',
    status: 'ACTIVE',
    createdAt: '2025-08-20'
  },
  {
    id: 'user-student-8801',
    username: 'hs.kien.8a8',
    password: '123456',
    fullName: 'Đỗ Trung Kiên',
    email: 'kien.dt.88@thcs-phuho.edu.vn',
    role: 'STUDENT',
    schoolId: 'school-phuho-01',
    classId: 'cls-8-8',
    gradeId: 'grade-8',
    studentCode: 'PH25-080801',
    status: 'ACTIVE',
    createdAt: '2025-08-20'
  },
  {
    id: 'user-student-8802',
    username: 'hs.vy.8a8',
    password: '123456',
    fullName: 'Phạm Thảo Vy',
    email: 'vy.pt.88@thcs-phuho.edu.vn',
    role: 'STUDENT',
    schoolId: 'school-phuho-01',
    classId: 'cls-8-8',
    gradeId: 'grade-8',
    studentCode: 'PH25-080802',
    status: 'ACTIVE',
    createdAt: '2025-08-20'
  },
  {
    id: 'user-student-8803',
    username: 'hs.khoi.8a8',
    password: '123456',
    fullName: 'Ngô Đăng Khôi',
    email: 'khoi.nd.88@thcs-phuho.edu.vn',
    role: 'STUDENT',
    schoolId: 'school-phuho-01',
    classId: 'cls-8-8',
    gradeId: 'grade-8',
    studentCode: 'PH25-080803',
    status: 'ACTIVE',
    createdAt: '2025-08-20'
  },
  {
    id: 'user-student-8804',
    username: 'hs.mai.8a8',
    password: '123456',
    fullName: 'Bùi Ngọc Phương Mai',
    email: 'mai.bnp.88@thcs-phuho.edu.vn',
    role: 'STUDENT',
    schoolId: 'school-phuho-01',
    classId: 'cls-8-8',
    gradeId: 'grade-8',
    studentCode: 'PH25-080804',
    status: 'ACTIVE',
    createdAt: '2025-08-20'
  },
  {
    id: 'user-student-01',
    username: 'hs.tri.6a1',
    password: '123456',
    fullName: 'Hoàng Minh Trí',
    email: 'tri.hm@thcs-phuho.edu.vn',
    role: 'STUDENT',
    schoolId: 'school-phuho-01',
    classId: 'cls-6-1',
    gradeId: 'grade-6',
    studentCode: 'PH25-060101',
    status: 'ACTIVE',
    createdAt: '2025-08-20'
  },
  {
    id: 'user-student-02',
    username: 'hs.nga.6a1',
    password: '123456',
    fullName: 'Trần Quỳnh Nga',
    email: 'nga.tq@thcs-phuho.edu.vn',
    role: 'STUDENT',
    schoolId: 'school-phuho-01',
    classId: 'cls-6-1',
    gradeId: 'grade-6',
    studentCode: 'PH25-060102',
    status: 'ACTIVE',
    createdAt: '2025-08-20'
  },
  {
    id: 'user-student-03',
    username: 'hs.nam.6a1',
    password: '123456',
    fullName: 'Lê Hoàng Nam',
    email: 'nam.lh@thcs-phuho.edu.vn',
    role: 'STUDENT',
    schoolId: 'school-phuho-01',
    classId: 'cls-6-1',
    gradeId: 'grade-6',
    studentCode: 'PH25-060103',
    status: 'ACTIVE',
    createdAt: '2025-08-20'
  },
  {
    id: 'user-student-04',
    username: 'hs.anh.7a1',
    password: '123456',
    fullName: 'Nguyễn Tuấn Anh',
    email: 'anh.nt@thcs-phuho.edu.vn',
    role: 'STUDENT',
    schoolId: 'school-phuho-01',
    classId: 'cls-7-1',
    gradeId: 'grade-7',
    studentCode: 'PH25-070101',
    status: 'ACTIVE',
    createdAt: '2025-08-20'
  },
  {
    id: 'user-student-05',
    username: 'hs.tuyet.6a1',
    password: '123456',
    fullName: 'Phan Thị Ánh Tuyết',
    email: 'tuyet.pt@thcs-phuho.edu.vn',
    role: 'STUDENT',
    schoolId: 'school-phuho-01',
    classId: 'cls-6-1',
    gradeId: 'grade-6',
    studentCode: 'PH25-060104',
    status: 'ACTIVE',
    createdAt: '2025-08-20'
  },
  {
    id: 'user-student-06',
    username: 'hs.huy.6a1',
    password: '123456',
    fullName: 'Đặng Gia Huy',
    email: 'huy.dg@thcs-phuho.edu.vn',
    role: 'STUDENT',
    schoolId: 'school-phuho-01',
    classId: 'cls-6-1',
    gradeId: 'grade-6',
    studentCode: 'PH25-060105',
    status: 'ACTIVE',
    createdAt: '2025-08-20'
  },
  {
    id: 'user-student-07',
    username: 'hs.ngoc.6a2',
    password: '123456',
    fullName: 'Nguyễn Bảo Ngọc',
    email: 'ngoc.nb@thcs-phuho.edu.vn',
    role: 'STUDENT',
    schoolId: 'school-phuho-01',
    classId: 'cls-6-2',
    gradeId: 'grade-6',
    studentCode: 'PH25-060201',
    status: 'ACTIVE',
    createdAt: '2025-08-20'
  },
  {
    id: 'user-student-08',
    username: 'hs.duy.6a2',
    password: '123456',
    fullName: 'Phạm Đức Duy',
    email: 'duy.pd@thcs-phuho.edu.vn',
    role: 'STUDENT',
    schoolId: 'school-phuho-01',
    classId: 'cls-6-2',
    gradeId: 'grade-6',
    studentCode: 'PH25-060202',
    status: 'ACTIVE',
    createdAt: '2025-08-20'
  },
  {
    id: 'user-student-09',
    username: 'hs.linh.6a2',
    password: '123456',
    fullName: 'Vũ Thùy Linh',
    email: 'linh.vt@thcs-phuho.edu.vn',
    role: 'STUDENT',
    schoolId: 'school-phuho-01',
    classId: 'cls-6-2',
    gradeId: 'grade-6',
    studentCode: 'PH25-060203',
    status: 'ACTIVE',
    createdAt: '2025-08-20'
  },
  {
    id: 'user-student-10',
    username: 'hs.khoi.7a1',
    password: '123456',
    fullName: 'Trần Minh Khôi',
    email: 'khoi.tm@thcs-phuho.edu.vn',
    role: 'STUDENT',
    schoolId: 'school-phuho-01',
    classId: 'cls-7-1',
    gradeId: 'grade-7',
    studentCode: 'PH25-070102',
    status: 'ACTIVE',
    createdAt: '2025-08-20'
  },
  {
    id: 'user-student-11',
    username: 'hs.thao.7a1',
    password: '123456',
    fullName: 'Lê Phương Thảo',
    email: 'thao.lp@thcs-phuho.edu.vn',
    role: 'STUDENT',
    schoolId: 'school-phuho-01',
    classId: 'cls-7-1',
    gradeId: 'grade-7',
    studentCode: 'PH25-070103',
    status: 'ACTIVE',
    createdAt: '2025-08-20'
  }
];

export const INITIAL_TOPICS: Topic[] = [
  // --- KHỐI 6 (Tin học 6 - Kết nối tri thức với cuộc sống) ---
  { id: 'top-6-1', code: 'CHỦ ĐỀ 1', name: 'Chủ đề 1: Máy tính và cộng đồng', gradeLevel: 6, description: 'Thông tin và dữ liệu, xử lí thông tin, thông tin trong máy tính' },
  { id: 'top-6-2', code: 'CHỦ ĐỀ 2', name: 'Chủ đề 2: Mạng máy tính và Internet', gradeLevel: 6, description: 'Mạng máy tính, Internet và lợi ích kết nối toàn cầu' },
  { id: 'top-6-3', code: 'CHỦ ĐỀ 3', name: 'Chủ đề 3: Tổ chức lưu trữ, tìm kiếm và trao đổi thông tin', gradeLevel: 6, description: 'Mạng thông tin toàn cầu, tìm kiếm thông tin, thư điện tử' },
  { id: 'top-6-4', code: 'CHỦ ĐỀ 4', name: 'Chủ đề 4: Đạo đức, pháp luật và văn hoá trong môi trường số', gradeLevel: 6, description: 'An toàn thông tin trên Internet, bảo vệ bản quyền số' },
  { id: 'top-6-5', code: 'CHỦ ĐỀ 5', name: 'Chủ đề 5: Ứng dụng tin học', gradeLevel: 6, description: 'Sơ đồ tư duy, định dạng văn bản, trình bày thông tin ở dạng bảng' },
  { id: 'top-6-6', code: 'CHỦ ĐỀ 6', name: 'Chủ đề 6: Giải quyết vấn đề với sự trợ giúp của máy tính', gradeLevel: 6, description: 'Thuật toán, các cấu trúc điều khiển, chương trình máy tính' },

  // --- KHỐI 7 (Tin học 7 - Kết nối tri thức với cuộc sống) ---
  { id: 'top-7-1', code: 'CHỦ ĐỀ 1', name: 'Chủ đề 1: Máy tính và cộng đồng', gradeLevel: 7, description: 'Thiết bị vào – ra, phần mềm máy tính, quản lí dữ liệu trong máy tính' },
  { id: 'top-7-2', code: 'CHỦ ĐỀ 2', name: 'Chủ đề 2: Tổ chức lưu trữ, tìm kiếm và trao đổi thông tin', gradeLevel: 7, description: 'Mạng xã hội và một số kênh trao đổi thông tin trên Internet' },
  { id: 'top-7-3', code: 'CHỦ ĐỀ 3', name: 'Chủ đề 3: Đạo đức, pháp luật và văn hoá trong môi trường số', gradeLevel: 7, description: 'Ứng xử trên mạng, văn hóa giao tiếp và bản quyền số' },
  { id: 'top-7-4', code: 'CHỦ ĐỀ 4', name: 'Chủ đề 4: Ứng dụng tin học', gradeLevel: 7, description: 'Bảng tính điện tử, tính toán tự động, bài trình chiếu' },
  { id: 'top-7-5', code: 'CHỦ ĐỀ 5', name: 'Chủ đề 5: Giải quyết vấn đề với sự trợ giúp của máy tính', gradeLevel: 7, description: 'Thuật toán tìm kiếm tuần tự, tìm kiếm nhị phân, thuật toán sắp xếp' },

  // --- KHỐI 8 (Tin học 8 - Kết nối tri thức với cuộc sống) ---
  { id: 'top-8-1', code: 'CHỦ ĐỀ 1', name: 'Chủ đề 1: Máy tính và cộng đồng', gradeLevel: 8, description: 'Lược sử công cụ tính toán và các thế hệ máy tính' },
  { id: 'top-8-2', code: 'CHỦ ĐỀ 2', name: 'Chủ đề 2: Tổ chức lưu trữ, tìm kiếm và trao đổi thông tin', gradeLevel: 8, description: 'Thông tin trong môi trường số, khai thác thông tin số an toàn' },
  { id: 'top-8-3', code: 'CHỦ ĐỀ 3', name: 'Chủ đề 3: Đạo đức, pháp luật và văn hoá trong môi trường số', gradeLevel: 8, description: 'Đạo đức và văn hóa trong sử dụng công nghệ kĩ thuật số' },
  { id: 'top-8-4', code: 'CHỦ ĐỀ 4', name: 'Chủ đề 4: Ứng dụng tin học', gradeLevel: 8, description: 'Bảng tính nâng cao, biểu đồ, văn bản nâng cao, chỉnh sửa ảnh' },
  { id: 'top-8-5', code: 'CHỦ ĐỀ 5', name: 'Chủ đề 5: Giải quyết vấn đề với sự trợ giúp của máy tính', gradeLevel: 8, description: 'Từ thuật toán đến chương trình, biểu diễn dữ liệu, cấu trúc điều khiển, gỡ lỗi' },
  { id: 'top-8-6', code: 'CHỦ ĐỀ 6', name: 'Chủ đề 6: Hướng nghiệp với tin học', gradeLevel: 8, description: 'Tin học với nghề nghiệp và cơ hội việc làm trong thời đại số' },

  // --- KHỐI 9 (Tin học 9 - Kết nối tri thức với cuộc sống) ---
  { id: 'top-9-1', code: 'CHỦ ĐỀ 1', name: 'Chủ đề 1: Máy tính và cộng đồng', gradeLevel: 9, description: 'Thế giới kĩ thuật số, tác động của công nghệ số và trí tuệ nhân tạo' },
  { id: 'top-9-2', code: 'CHỦ ĐỀ 2', name: 'Chủ đề 2: Tổ chức lưu trữ, tìm kiếm và trao đổi thông tin', gradeLevel: 9, description: 'Thông tin trong giải quyết vấn đề, đánh giá chất lượng thông tin' },
  { id: 'top-9-3', code: 'CHỦ ĐỀ 3', name: 'Chủ đề 3: Đạo đức, pháp luật và văn hoá trong môi trường số', gradeLevel: 9, description: 'Một số vấn đề pháp lí về sử dụng dịch vụ Internet và an ninh mạng' },
  { id: 'top-9-4', code: 'CHỦ ĐỀ 4', name: 'Chủ đề 4: Ứng dụng tin học', gradeLevel: 9, description: 'Phần mềm mô phỏng, trao đổi hợp tác, bảng tính nâng cao, làm video' },
  { id: 'top-9-5', code: 'CHỦ ĐỀ 5', name: 'Chủ đề 5: Giải quyết vấn đề với sự trợ giúp của máy tính', gradeLevel: 9, description: 'Giải quyết vấn đề, bài toán tin học, lập trình máy tính' },
  { id: 'top-9-6', code: 'CHỦ ĐỀ 6', name: 'Chủ đề 6: Hướng nghiệp với tin học', gradeLevel: 9, description: 'Tin học và thế giới nghề nghiệp trong kỷ nguyên số' }
];

export const INITIAL_LESSONS: Lesson[] = [
  // ==================== KHỐI 6 ====================
  // Chủ đề 1: Máy tính và cộng đồng
  { id: 'les-6-01', topicId: 'top-6-1', gradeLevel: 6, lessonNumber: 1, title: 'Bài 1: Thông tin và dữ liệu', learningOutcomes: 'Nhận biết được thông tin, dữ liệu và vật mang tin; nêu được ví dụ minh họa' },
  { id: 'les-6-02', topicId: 'top-6-1', gradeLevel: 6, lessonNumber: 2, title: 'Bài 2: Xử lí thông tin', learningOutcomes: 'Nêu được các bước xử lí thông tin trong đời sống và vai trò quan trọng của máy tính' },
  { id: 'les-6-03', topicId: 'top-6-1', gradeLevel: 6, lessonNumber: 3, title: 'Bài 3: Thông tin trong máy tính', learningOutcomes: 'Hiểu thông tin trong máy tính biểu diễn bằng các dãy bit; đơn vị đo bit, Byte, KB, MB, GB, TB' },

  // Chủ đề 2: Mạng máy tính và Internet
  { id: 'les-6-04', topicId: 'top-6-2', gradeLevel: 6, lessonNumber: 4, title: 'Bài 4: Mạng máy tính', learningOutcomes: 'Nêu được khái niệm mạng máy tính, các thành phần cơ bản và lợi ích kết nối mạng' },
  { id: 'les-6-05', topicId: 'top-6-2', gradeLevel: 6, lessonNumber: 5, title: 'Bài 5: Internet', learningOutcomes: 'Nêu được khái niệm Internet, lợi ích và đặc điểm của mạng Internet toàn cầu' },

  // Chủ đề 3: Tổ chức lưu trữ, tìm kiếm và trao đổi thông tin
  { id: 'les-6-06', topicId: 'top-6-3', gradeLevel: 6, lessonNumber: 6, title: 'Bài 6: Mạng thông tin toàn cầu', learningOutcomes: 'Nêu được khái niệm World Wide Web, trình duyệt web, trang web và địa chỉ website' },
  { id: 'les-6-07', topicId: 'top-6-3', gradeLevel: 6, lessonNumber: 7, title: 'Bài 7: Tìm kiếm thông tin trên Internet', learningOutcomes: 'Sử dụng máy tìm kiếm, từ khóa để tìm kiếm thông tin học tập hiệu quả' },
  { id: 'les-6-08', topicId: 'top-6-3', gradeLevel: 6, lessonNumber: 8, title: 'Bài 8: Thư điện tử', learningOutcomes: 'Hiểu cấu trúc địa chỉ email, đăng nhập, soạn và gửi thư điện tử có tệp đính kèm' },

  // Chủ đề 4: Đạo đức, pháp luật và văn hoá trong môi trường số
  { id: 'les-6-09', topicId: 'top-6-4', gradeLevel: 6, lessonNumber: 9, title: 'Bài 9: An toàn thông tin trên Internet', learningOutcomes: 'Nhận biết các nguy cơ rủi ro trên mạng, bảo vệ thông tin cá nhân và mật khẩu an toàn' },

  // Chủ đề 5: Ứng dụng tin học
  { id: 'les-6-10', topicId: 'top-6-5', gradeLevel: 6, lessonNumber: 10, title: 'Bài 10: Sơ đồ tư duy', learningOutcomes: 'Sử dụng phần mềm sơ đồ tư duy để tóm tắt và trình bày ý tưởng bài học' },
  { id: 'les-6-11', topicId: 'top-6-5', gradeLevel: 6, lessonNumber: 11, title: 'Bài 11: Định dạng văn bản', learningOutcomes: 'Thực hiện được các thao tác định dạng kí tự, định dạng đoạn văn bản' },
  { id: 'les-6-12', topicId: 'top-6-5', gradeLevel: 6, lessonNumber: 12, title: 'Bài 12: Trình bày thông tin ở dạng bảng', learningOutcomes: 'Tạo bảng, chèn thêm, xóa hàng cột và định dạng bảng biểu văn bản' },
  { id: 'les-6-13', topicId: 'top-6-5', gradeLevel: 6, lessonNumber: 13, title: 'Bài 13: Thực hành: Tìm kiếm và thay thế', learningOutcomes: 'Sử dụng công cụ Find & Replace tìm kiếm và sửa đổi văn bản nhanh chóng' },
  { id: 'les-6-14', topicId: 'top-6-5', gradeLevel: 6, lessonNumber: 14, title: 'Bài 14: Thực hành tổng hợp: Hoàn thiện sổ lưu niệm', learningOutcomes: 'Kết hợp định dạng văn bản, chèn ảnh, bảng biểu tạo sản phẩm hoàn chỉnh' },

  // Chủ đề 6: Giải quyết vấn đề với sự trợ giúp của máy tính
  { id: 'les-6-15', topicId: 'top-6-6', gradeLevel: 6, lessonNumber: 15, title: 'Bài 15: Thuật toán', learningOutcomes: 'Nêu được khái niệm thuật toán, mô tả thuật toán bằng liệt kê từng bước và sơ đồ khối' },
  { id: 'les-6-16', topicId: 'top-6-6', gradeLevel: 6, lessonNumber: 16, title: 'Bài 16: Các cấu trúc điều khiển', learningOutcomes: 'Nhận biết và mô tả cấu trúc tuần tự, rẽ nhánh và lặp trong thuật toán' },
  { id: 'les-6-17', topicId: 'top-6-6', gradeLevel: 6, lessonNumber: 17, title: 'Bài 17: Chương trình máy tính', learningOutcomes: 'Hiểu mối quan hệ giữa thuật toán và chương trình, viết chương trình đơn giản' },

  // ==================== KHỐI 7 ====================
  // Chủ đề 1: Máy tính và cộng đồng
  { id: 'les-7-01', topicId: 'top-7-1', gradeLevel: 7, lessonNumber: 1, title: 'Bài 1: Thiết bị vào – ra', learningOutcomes: 'Nhận biết và phân biệt các thiết bị vào, thiết bị ra và thiết bị lưu trữ dữ liệu' },
  { id: 'les-7-02', topicId: 'top-7-1', gradeLevel: 7, lessonNumber: 2, title: 'Bài 2: Phần mềm máy tính', learningOutcomes: 'Phân biệt hệ điều hành và phần mềm ứng dụng; chức năng cơ bản của hệ điều hành' },
  { id: 'les-7-03', topicId: 'top-7-1', gradeLevel: 7, lessonNumber: 3, title: 'Bài 3: Quản lí dữ liệu trong máy tính', learningOutcomes: 'Tổ chức lưu trữ dữ liệu dạng cây thư mục, thao tác quản lý tệp và thư mục' },
  { id: 'les-7-04', topicId: 'top-7-1', gradeLevel: 7, lessonNumber: 4, title: 'Bài 4: Phân loại tệp và bảo vệ dữ liệu', learningOutcomes: 'Nhận biết phần mở rộng của tệp, thực hiện sao lưu dự phòng bảo vệ dữ liệu' },

  // Chủ đề 2: Tổ chức lưu trữ, tìm kiếm và trao đổi thông tin
  { id: 'les-7-05', topicId: 'top-7-2', gradeLevel: 7, lessonNumber: 5, title: 'Bài 5: Mạng xã hội và một số kênh trao đổi thông tin trên Internet', learningOutcomes: 'Sử dụng mạng xã hội lành mạnh, các kênh trao đổi thông tin học tập an toàn' },

  // Chủ đề 3: Đạo đức, pháp luật và văn hoá trong môi trường số
  { id: 'les-7-06', topicId: 'top-7-3', gradeLevel: 7, lessonNumber: 6, title: 'Bài 6: Ứng xử trên mạng', learningOutcomes: 'Giao tiếp văn minh lịch sự trên mạng, phòng tránh bạo lực mạng và tuân thủ bản quyền' },

  // Chủ đề 4: Ứng dụng tin học
  { id: 'les-7-07', topicId: 'top-7-4', gradeLevel: 7, lessonNumber: 7, title: 'Bài 7: Làm quen với phần mềm bảng tính', learningOutcomes: 'Nhận biết giao diện bảng tính, các ô tính, hàng, cột, khối ô và nhập dữ liệu' },
  { id: 'les-7-08', topicId: 'top-7-4', gradeLevel: 7, lessonNumber: 8, title: 'Bài 8: Tính toán tự động trên bảng tính', learningOutcomes: 'Nhập công thức tính toán đơn giản, sao chép công thức với địa chỉ ô' },
  { id: 'les-7-09', topicId: 'top-7-4', gradeLevel: 7, lessonNumber: 9, title: 'Bài 9: Công cụ hỗ trợ tính toán', learningOutcomes: 'Sử dụng thành thạo các hàm SUM, AVERAGE, MAX, MIN, COUNT' },
  { id: 'les-7-10', topicId: 'top-7-4', gradeLevel: 7, lessonNumber: 10, title: 'Bài 10: Trình bày bảng tính', learningOutcomes: 'Định dạng văn bản, số, kẻ viền và màu nền cho bảng tính rõ ràng' },
  { id: 'les-7-11', topicId: 'top-7-4', gradeLevel: 7, lessonNumber: 11, title: 'Bài 11: Hoàn thiện bảng tính', learningOutcomes: 'Thiết lập trang in, căn lề và xem trước khi in bảng tính' },
  { id: 'les-7-12', topicId: 'top-7-4', gradeLevel: 7, lessonNumber: 12, title: 'Bài 12: Tạo bài trình chiếu', learningOutcomes: 'Nhập nội dung, chọn mẫu bố cục và thiết kế bài trình chiếu chuyên nghiệp' },
  { id: 'les-7-13', topicId: 'top-7-4', gradeLevel: 7, lessonNumber: 13, title: 'Bài 13: Định dạng đối tượng trên trang chiếu', learningOutcomes: 'Định dạng văn bản, chèn hình ảnh, tạo hiệu ứng chuyển trang và hiệu ứng động' },
  { id: 'les-7-14', topicId: 'top-7-4', gradeLevel: 7, lessonNumber: 14, title: 'Bài 14: Thực hành tổng hợp: Hoàn thiện bài trình chiếu', learningOutcomes: 'Tạo sản phẩm báo cáo dự án học tập hoàn chỉnh bằng bài trình chiếu' },

  // Chủ đề 5: Giải quyết vấn đề với sự trợ giúp của máy tính
  { id: 'les-7-15', topicId: 'top-7-5', gradeLevel: 7, lessonNumber: 15, title: 'Bài 15: Thuật toán tìm kiếm tuần tự', learningOutcomes: 'Mô tả và thực hiện được thuật toán tìm kiếm tuần tự trên dãy phần tử' },
  { id: 'les-7-16', topicId: 'top-7-5', gradeLevel: 7, lessonNumber: 16, title: 'Bài 16: Thuật toán tìm kiếm nhị phân', learningOutcomes: 'Mô tả và thực hiện được thuật toán tìm kiếm nhị phân trên dãy đã sắp xếp' },
  { id: 'les-7-17', topicId: 'top-7-5', gradeLevel: 7, lessonNumber: 17, title: 'Bài 17: Thuật toán sắp xếp', learningOutcomes: 'Mô phỏng và thực hiện thuật toán sắp xếp nổi bọt và sắp xếp chọn' },

  // ==================== KHỐI 8 ====================
  // Chủ đề 1: Máy tính và cộng đồng
  { id: 'les-8-01', topicId: 'top-8-1', gradeLevel: 8, lessonNumber: 1, title: 'Bài 1: Lược sử công cụ tính toán', learningOutcomes: 'Nêu được các mốc lịch sử phát triển của công cụ tính toán và các thế hệ máy tính điện tử' },

  // Chủ đề 2: Tổ chức lưu trữ, tìm kiếm và trao đổi thông tin
  { id: 'les-8-02', topicId: 'top-8-2', gradeLevel: 8, lessonNumber: 2, title: 'Bài 2: Thông tin trong môi trường số', learningOutcomes: 'Đánh giá độ tin cậy của thông tin số, tính bản quyền và trích dẫn thông tin' },
  { id: 'les-8-03', topicId: 'top-8-2', gradeLevel: 8, lessonNumber: 3, title: 'Bài 3: Thực hành: Khai thác thông tin số', learningOutcomes: 'Sử dụng công cụ tìm kiếm nâng cao, kiểm chứng nguồn tin chính xác an toàn' },

  // Chủ đề 3: Đạo đức, pháp luật và văn hoá trong môi trường số
  { id: 'les-8-04', topicId: 'top-8-3', gradeLevel: 8, lessonNumber: 4, title: 'Bài 4: Đạo đức và văn hóa trong sử dụng công nghệ kĩ thuật số', learningOutcomes: 'Tuân thủ pháp luật, tôn trọng quyền riêng tư và bản quyền số' },

  // Chủ đề 4: Ứng dụng tin học
  { id: 'les-8-05', topicId: 'top-8-4', gradeLevel: 8, lessonNumber: 5, title: 'Bài 5: Sử dụng bảng tính giải quyết bài toán thực tế', learningOutcomes: 'Vận dụng bảng tính và công thức giải bài toán quản lý tài chính, chi tiêu' },
  { id: 'les-8-06', topicId: 'top-8-4', gradeLevel: 8, lessonNumber: 6, title: 'Bài 6: Sắp xếp và lọc dữ liệu', learningOutcomes: 'Sắp xếp dữ liệu đa tiêu chí, trích xuất dữ liệu bằng bộ lọc Filter' },
  { id: 'les-8-07', topicId: 'top-8-4', gradeLevel: 8, lessonNumber: 7, title: 'Bài 7: Trình bày dữ liệu bằng biểu đồ', learningOutcomes: 'Tạo và tùy biến biểu đồ hình cột, hình tròn, đường gấp khúc' },
  { id: 'les-8-08', topicId: 'top-8-4', gradeLevel: 8, lessonNumber: 8, title: 'Bài 8: Làm việc với danh sách dạng liệt kê và hình ảnh trong văn bản', learningOutcomes: 'Tạo danh sách đầu dòng, đánh số và chèn ảnh minh họa văn bản' },
  { id: 'les-8-09', topicId: 'top-8-4', gradeLevel: 8, lessonNumber: 9, title: 'Bài 9: Tạo đầu trang, chân trang cho văn bản', learningOutcomes: 'Chèn Header, Footer và đánh số trang tài liệu chuyên nghiệp' },
  { id: 'les-8-10', topicId: 'top-8-4', gradeLevel: 8, lessonNumber: 10, title: 'Bài 10: Định dạng nâng cao cho trang chiếu', learningOutcomes: 'Thiết lập màu nền, mẫu slide Master, bản mẫu Template đồng bộ' },
  { id: 'les-8-11', topicId: 'top-8-4', gradeLevel: 8, lessonNumber: 11, title: 'Bài 11: Làm quen với phần mềm chỉnh sửa ảnh', learningOutcomes: 'Cắt ghép ảnh, điều chỉnh độ sáng, kích thước và thêm văn bản nghệ thuật' },

  // Chủ đề 5: Giải quyết vấn đề với sự trợ giúp của máy tính
  { id: 'les-8-12', topicId: 'top-8-5', gradeLevel: 8, lessonNumber: 12, title: 'Bài 12: Từ thuật toán đến chương trình', learningOutcomes: 'Chuyển đổi mô tả thuật toán thành kịch bản khối lệnh lập trình trực quan' },
  { id: 'les-8-13', topicId: 'top-8-5', gradeLevel: 8, lessonNumber: 13, title: 'Bài 13: Biểu diễn dữ liệu', learningOutcomes: 'Khai báo và sử dụng biến, kiểu dữ liệu số, chuỗi, biểu thức toán học' },
  { id: 'les-8-14', topicId: 'top-8-5', gradeLevel: 8, lessonNumber: 14, title: 'Bài 14: Cấu trúc điều khiển', learningOutcomes: 'Sử dụng cấu trúc rẽ nhánh điều kiện nếu... thì và các vòng lặp lặp lại' },
  { id: 'les-8-15', topicId: 'top-8-5', gradeLevel: 8, lessonNumber: 15, title: 'Bài 15: Gỡ lỗi', learningOutcomes: 'Nhận biết lỗi cú pháp, lỗi logic và phương pháp kiểm thử gỡ lỗi chương trình' },

  // Chủ đề 6: Hướng nghiệp với tin học
  { id: 'les-8-16', topicId: 'top-8-6', gradeLevel: 8, lessonNumber: 16, title: 'Bài 16: Tin học với nghề nghiệp', learningOutcomes: 'Tìm hiểu các ngành nghề sử dụng tin học và cơ hội việc làm trong thời đại số' },

  // ==================== KHỐI 9 ====================
  // Chủ đề 1: Máy tính và cộng đồng
  { id: 'les-9-01', topicId: 'top-9-1', gradeLevel: 9, lessonNumber: 1, title: 'Bài 1: Thế giới kĩ thuật số', learningOutcomes: 'Nêu được tác động của công nghệ số, Internet vạn vật IoT và trí tuệ nhân tạo đối với xã hội' },

  // Chủ đề 2: Tổ chức lưu trữ, tìm kiếm và trao đổi thông tin
  { id: 'les-9-02', topicId: 'top-9-2', gradeLevel: 9, lessonNumber: 2, title: 'Bài 2: Thông tin trong giải quyết vấn đề', learningOutcomes: 'Phân tích, thu thập và xử lý thông tin để đưa ra quyết định' },
  { id: 'les-9-03', topicId: 'top-9-2', gradeLevel: 9, lessonNumber: 3, title: 'Bài 3: Thực hành: Đánh giá chất lượng thông tin', learningOutcomes: 'Tiêu chí đánh giá tính chính xác, tính cập nhật và độ tin cậy của dữ liệu' },

  // Chủ đề 3: Đạo đức, pháp luật và văn hoá trong môi trường số
  { id: 'les-9-04', topicId: 'top-9-3', gradeLevel: 9, lessonNumber: 4, title: 'Bài 4: Một số vấn đề pháp lí về sử dụng dịch vụ Internet', learningOutcomes: 'Hiểu Luật An ninh mạng, trách nhiệm khi đăng tải và chia sẻ thông tin trên Internet' },

  // Chủ đề 4: Ứng dụng tin học
  { id: 'les-9-05', topicId: 'top-9-4', gradeLevel: 9, lessonNumber: 5, title: 'Bài 5: Tìm hiểu phần mềm mô phỏng', learningOutcomes: 'Khái niệm mô phỏng và ứng dụng phần mềm mô phỏng trong học tập khoa học' },
  { id: 'les-9-06', topicId: 'top-9-4', gradeLevel: 9, lessonNumber: 6, title: 'Bài 6: Thực hành: Khai thác phần mềm mô phỏng', learningOutcomes: 'Thao tác thực nghiệm trên các phần mềm mô phỏng vật lý, hóa học, toán học' },
  { id: 'les-9-07', topicId: 'top-9-4', gradeLevel: 9, lessonNumber: 7, title: 'Bài 7: Trình bày thông tin trong trao đổi và hợp tác', learningOutcomes: 'Sử dụng công cụ trực tuyến trao đổi và cộng tác nhóm giải quyết nhiệm vụ học tập' },
  { id: 'les-9-08', topicId: 'top-9-4', gradeLevel: 9, lessonNumber: 8, title: 'Bài 8: Thực hành: Sử dụng công cụ trực quan trình bày thông tin', learningOutcomes: 'Thiết kế Infographic và sơ đồ trực quan hóa dữ liệu sinh động' },
  { id: 'les-9-09', topicId: 'top-9-4', gradeLevel: 9, lessonNumber: 9, title: 'Bài 9: Sử dụng bảng tính điện tử nâng cao', learningOutcomes: 'Công cụ xác thực dữ liệu Data Validation và cố định vùng hiển thị' },
  { id: 'les-9-10', topicId: 'top-9-4', gradeLevel: 9, lessonNumber: 10, title: 'Bài 10: Các hàm tính toán có điều kiện (COUNTIF, SUMIF, IF)', learningOutcomes: 'Vận dụng linh hoạt các hàm điều kiện thống kê số liệu thực tế' },
  { id: 'les-9-11', topicId: 'top-9-4', gradeLevel: 9, lessonNumber: 11, title: 'Bài 11: Làm quen với phần mềm làm video', learningOutcomes: 'Nhập video, hình ảnh, âm thanh vào phần mềm biên tập đa phương tiện' },
  { id: 'les-9-12', topicId: 'top-9-4', gradeLevel: 9, lessonNumber: 12, title: 'Bài 12: Dựng video và biên tập âm thanh', learningOutcomes: 'Cắt ghép video, chèn hiệu ứng chuyển cảnh, phụ đề và lồng tiếng' },
  { id: 'les-9-13', topicId: 'top-9-4', gradeLevel: 9, lessonNumber: 13, title: 'Bài 13: Thực hành tổng hợp: Hoàn thành và xuất bản video', learningOutcomes: 'Hoàn thiện sản phẩm video clip thuyết trình chất lượng cao' },

  // Chủ đề 5: Giải quyết vấn đề với sự trợ giúp của máy tính
  { id: 'les-9-14', topicId: 'top-9-5', gradeLevel: 9, lessonNumber: 14, title: 'Bài 14: Giải quyết vấn đề', learningOutcomes: 'Các bước phân tích bài toán, xác định Input, Output và xây dựng giải thuật' },
  { id: 'les-9-15', topicId: 'top-9-5', gradeLevel: 9, lessonNumber: 15, title: 'Bài 15: Bài toán tin học', learningOutcomes: 'Mô hình hóa bài toán thực tế thành bài toán tin học và lựa chọn cấu trúc dữ liệu' },
  { id: 'les-9-16', topicId: 'top-9-5', gradeLevel: 9, lessonNumber: 16, title: 'Bài 16: Thực hành: Lập chương trình máy tính', learningOutcomes: 'Cài đặt chương trình, chạy thử nghiệm và tối ưu hóa giải thuật' },

  // Chủ đề 6: Hướng nghiệp với tin học
  { id: 'les-9-17', topicId: 'top-9-6', gradeLevel: 9, lessonNumber: 17, title: 'Bài 17: Tin học và thế giới nghề nghiệp', learningOutcomes: 'Định hướng nghề nghiệp công nghệ thông tin, an ninh mạng, khoa học dữ liệu và AI' }
];

export const INITIAL_QUESTIONS: Question[] = [
  {
    id: 'q-01',
    code: 'TH6-01-01',
    content: 'Thiết bị nào sau đây là thiết bị vào (Input) của máy tính?',
    gradeLevel: 6,
    topic: 'Chủ đề 1: Máy tính và cộng đồng',
    lessonTitle: 'Bài 1: Thông tin và dữ liệu',
    learningOutcome: 'Nhận biết được các thiết bị vào - ra cơ bản của hệ thống máy tính',
    difficulty: 'BIET',
    type: 'SINGLE_CHOICE',
    options: [
      { id: 'opt-1', text: 'Bàn phím (Keyboard)', isCorrect: true },
      { id: 'opt-2', text: 'Màn hình (Monitor)', isCorrect: false },
      { id: 'opt-3', text: 'Máy in (Printer)', isCorrect: false },
      { id: 'opt-4', text: 'Loa (Speaker)', isCorrect: false }
    ],
    explanation: 'Bàn phím là thiết bị đưa dữ liệu từ người dùng vào máy tính. Màn hình, máy in và loa là thiết bị ra.',
    imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
    imageDriveUrl: 'https://drive.google.com/file/d/1A_thcsphuho_keyboard_input/view?usp=sharing',
    createdBy: 'user-teacher-01',
    authorName: 'Nguyễn Hữu Dũng',
    createdAt: '2025-10-01',
    status: 'ACTIVE'
  },
  {
    id: 'q-02',
    code: 'TH6-01-02',
    content: 'Đơn vị đo dung lượng thông tin nhỏ nhất trong máy tính là gì?',
    gradeLevel: 6,
    topic: 'Chủ đề 1: Máy tính và cộng đồng',
    lessonTitle: 'Bài 3: Thông tin trong máy tính',
    learningOutcome: 'Nêu được đơn vị đo dung lượng thông tin cơ bản: Bit, Byte, KB, MB, GB',
    difficulty: 'BIET',
    type: 'SINGLE_CHOICE',
    options: [
      { id: 'opt-1', text: 'Bit (0 hoặc 1)', isCorrect: true },
      { id: 'opt-2', text: 'Byte (8 bit)', isCorrect: false },
      { id: 'opt-3', text: 'Kilobyte (KB)', isCorrect: false },
      { id: 'opt-4', text: 'Megabyte (MB)', isCorrect: false }
    ],
    explanation: 'Bit (viết tắt của Binary digit) là đơn vị nhỏ nhất để đo lượng thông tin, chỉ nhận giá trị 0 hoặc 1.',
    createdBy: 'user-teacher-01',
    authorName: 'Nguyễn Hữu Dũng',
    createdAt: '2025-10-01',
    status: 'ACTIVE'
  },
  {
    id: 'q-03',
    code: 'TH6-04-03',
    content: 'Những hành động nào sau đây giúp em bảo vệ tài khoản cá nhân an toàn trên Internet? (Chọn các phương án đúng)',
    gradeLevel: 6,
    topic: 'Chủ đề 4: Đạo đức, pháp luật và văn hoá trong môi trường số',
    lessonTitle: 'Bài 9: An toàn thông tin trên Internet',
    learningOutcome: 'Hiểu và thực hiện được các quy tắc an toàn bảo mật trên Internet',
    difficulty: 'HIEU',
    type: 'MULTIPLE_CHOICE',
    options: [
      { id: 'opt-1', text: 'Đặt mật khẩu mạnh gồm chữ hoa, chữ thường, số và ký tự đặc biệt', isCorrect: true },
      { id: 'opt-2', text: 'Đăng xuất tài khoản sau khi dùng máy tính công cộng', isCorrect: true },
      { id: 'opt-3', text: 'Chia sẻ mật khẩu cho bạn thân cùng lớp để nhờ làm bài tập', isCorrect: false },
      { id: 'opt-4', text: 'Không nhấp vào các đường link lạ nhận được từ người lạ trên mạng xã hội', isCorrect: true }
    ],
    explanation: 'Mật khẩu mạnh, đăng xuất máy công cộng và không nhấp link lạ là các biện pháp an toàn. Tuyệt đối không chia sẻ mật khẩu.',
    createdBy: 'user-depthead-01',
    authorName: 'Lê Thị Mai',
    createdAt: '2025-10-02',
    status: 'ACTIVE'
  },
  {
    id: 'q-04',
    code: 'TH6-03-04',
    content: 'Xét tính Đúng/Sai của các nhận định sau về việc tổ chức thông tin trong máy tính:',
    gradeLevel: 6,
    topic: 'Chủ đề 3: Tổ chức lưu trữ, tìm kiếm và trao đổi thông tin',
    lessonTitle: 'Bài 6: Mạng thông tin toàn cầu',
    learningOutcome: 'Phân biệt tệp và thư mục, hiểu cấu trúc cây thư mục',
    difficulty: 'HIEU',
    type: 'TRUE_FALSE',
    trueFalseStatements: [
      { id: 'tf-1', statement: 'Thư mục có thể chứa các tệp và các thư mục con khác.', isCorrect: true },
      { id: 'tf-2', statement: 'Trong cùng một thư mục mẹ, có thể tạo 2 tệp có tên và phần mở rộng giống hệt nhau.', isCorrect: false },
      { id: 'tf-3', statement: 'Phần mở rộng của tệp (ví dụ .docx, .xlsx, .pptx) quy định loại tệp đó.', isCorrect: true },
      { id: 'tf-4', statement: 'Xóa một thư mục mẹ sẽ không làm mất các tệp nằm bên trong thư mục đó.', isCorrect: false }
    ],
    explanation: 'Cùng một thư mục không thể chứa 2 tệp trùng tên và phần mở rộng. Khi xóa thư mục mẹ, toàn bộ nội dung bên trong sẽ bị xóa.',
    createdBy: 'user-teacher-01',
    authorName: 'Nguyễn Hữu Dũng',
    createdAt: '2025-10-03',
    status: 'ACTIVE'
  },
  {
    id: 'q-05',
    code: 'TH6-06-05',
    content: 'Điền từ còn thiếu vào chỗ trống: "Trong thuật toán, cấu trúc [...] được sử dụng để thực hiện một số bước công việc chỉ khi một điều kiện cho trước được thỏa mãn."',
    gradeLevel: 6,
    topic: 'Chủ đề 6: Giải quyết vấn đề với sự trợ giúp của máy tính',
    lessonTitle: 'Bài 16: Các cấu trúc điều khiển',
    learningOutcome: 'Hiểu và mô tả được cấu trúc rẽ nhánh',
    difficulty: 'VAN_DUNG',
    type: 'FILL_IN_BLANK',
    correctAnswerText: 'rẽ nhánh',
    explanation: 'Cấu trúc rẽ nhánh (if-then) kiểm tra điều kiện: nếu đúng thì thực hiện câu lệnh, nếu sai thì bỏ qua hoặc thực hiện nhánh khác.',
    createdBy: 'user-teacher-01',
    authorName: 'Nguyễn Hữu Dũng',
    createdAt: '2025-10-04',
    status: 'ACTIVE'
  },
  {
    id: 'q-06',
    code: 'TH6-06-06',
    content: 'Em hãy viết các bước bằng ngôn ngữ tự nhiên để mô tả thuật toán: "Tìm số lớn nhất trong hai số a và b được nhập từ bàn phím". Nêu ví dụ khi a = 15 và b = 28.',
    gradeLevel: 6,
    topic: 'Chủ đề 6: Giải quyết vấn đề với sự trợ giúp của máy tính',
    lessonTitle: 'Bài 15: Thuật toán',
    learningOutcome: 'Vận dụng mô tả thuật toán bằng ngôn ngữ tự nhiên',
    difficulty: 'VAN_DUNG',
    type: 'ESSAY',
    essaySampleAnswer: 'Bước 1: Nhập vào hai số a và b.\nBước 2: So sánh a và b. Nếu a > b thì thông báo Max = a; Ngược lại (nếu a <= b) thì thông báo Max = b.\nBước 3: Kết thúc thuật toán.\nVí dụ với a=15, b=28: Do 15 < 28 nên Max = 28.',
    explanation: 'Học sinh cần nêu rõ bước nhập dữ liệu, bước kiểm tra điều kiện so sánh, bước đưa ra kết quả và chạy thử với ví dụ thực tế.',
    createdBy: 'user-depthead-01',
    authorName: 'Lê Thị Mai',
    createdAt: '2025-10-05',
    status: 'ACTIVE'
  },
  {
    id: 'q-07',
    code: 'TH7-04-01',
    content: 'Trong bảng tính Excel, địa chỉ ô nào sau đây là địa chỉ tuyệt đối?',
    gradeLevel: 7,
    topic: 'Chủ đề 4: Ứng dụng tin học',
    lessonTitle: 'Bài 8: Tính toán tự động trên bảng tính',
    learningOutcome: 'Nhận biết địa chỉ tương đối và địa chỉ tuyệt đối trong bảng tính điện tử',
    difficulty: 'BIET',
    type: 'SINGLE_CHOICE',
    options: [
      { id: 'opt-1', text: '$A$1', isCorrect: true },
      { id: 'opt-2', text: 'A1', isCorrect: false },
      { id: 'opt-3', text: 'A$1', isCorrect: false },
      { id: 'opt-4', text: '$A1', isCorrect: false }
    ],
    explanation: 'Địa chỉ có dấu $ trước cả tên cột và chỉ số dòng ($A$1) là địa chỉ tuyệt đối.',
    createdBy: 'user-teacher-01',
    authorName: 'Nguyễn Hữu Dũng',
    createdAt: '2025-10-06',
    status: 'ACTIVE'
  },
  {
    id: 'q-08',
    code: 'TH7-04-02',
    content: 'Hàm nào sau đây dùng để tính trung bình cộng của một dãy số trong bảng tính?',
    gradeLevel: 7,
    topic: 'Chủ đề 4: Ứng dụng tin học',
    lessonTitle: 'Bài 9: Công cụ hỗ trợ tính toán',
    learningOutcome: 'Sử dụng được các hàm SUM, AVERAGE, MAX, MIN',
    difficulty: 'BIET',
    type: 'SINGLE_CHOICE',
    options: [
      { id: 'opt-1', text: 'AVERAGE', isCorrect: true },
      { id: 'opt-2', text: 'SUM', isCorrect: false },
      { id: 'opt-3', text: 'COUNT', isCorrect: false },
      { id: 'opt-4', text: 'MAX', isCorrect: false }
    ],
    explanation: 'Hàm AVERAGE(danh_sách) dùng để tính giá trị trung bình cộng.',
    createdBy: 'user-teacher-01',
    authorName: 'Nguyễn Hữu Dũng',
    createdAt: '2025-10-06',
    status: 'ACTIVE'
  },
  {
    id: 'q-09',
    code: 'TH8-05-01',
    content: 'Trong ngôn ngữ lập trình Scratch/Python, vòng lặp "for i in range(5):" sẽ thực hiện khối lệnh bao nhiêu lần?',
    gradeLevel: 8,
    topic: 'Chủ đề 5: Giải quyết vấn đề với sự trợ giúp của máy tính',
    lessonTitle: 'Bài 14: Cấu trúc điều khiển',
    learningOutcome: 'Xác định số lần lặp và kết quả của vòng lặp xác định',
    difficulty: 'HIEU',
    type: 'SINGLE_CHOICE',
    options: [
      { id: 'opt-1', text: '5 lần (với giá trị i từ 0 đến 4)', isCorrect: true },
      { id: 'opt-2', text: '4 lần', isCorrect: false },
      { id: 'opt-3', text: '6 lần', isCorrect: false },
      { id: 'opt-4', text: 'Vô hạn lần', isCorrect: false }
    ],
    explanation: 'Hàm range(5) sinh ra dãy các số: 0, 1, 2, 3, 4 (tổng cộng 5 giá trị), do đó vòng lặp chạy đúng 5 lần.',
    createdBy: 'user-teacher-02',
    authorName: 'Phan Quốc Bảo',
    createdAt: '2025-10-07',
    status: 'ACTIVE'
  },
  {
    id: 'q-10',
    code: 'TH6-04-01',
    content: 'Khi sử dụng lại một bài viết hoặc hình ảnh từ trên mạng Internet để đưa vào bài thuyết trình của mình, hành vi nào sau đây là văn minh và đúng luật?',
    gradeLevel: 6,
    topic: 'Chủ đề 4: Đạo đức, pháp luật và văn hoá trong môi trường số',
    lessonTitle: 'Bài 9: An toàn thông tin trên Internet',
    learningOutcome: 'Hiểu về quyền tác giả và trích dẫn nguồn tài liệu hợp lệ',
    difficulty: 'HIEU',
    type: 'SINGLE_CHOICE',
    options: [
      { id: 'opt-1', text: 'Ghi rõ tên tác giả và nguồn gốc xuất xứ của tài liệu được trích dẫn', isCorrect: true },
      { id: 'opt-2', text: 'Tự nhận đó là do mình sáng tạo ra để được điểm cao', isCorrect: false },
      { id: 'opt-3', text: 'Cắt bỏ logo của tác giả để tránh bị giáo viên phát hiện', isCorrect: false },
      { id: 'opt-4', text: 'Đem bán lại tài liệu đó cho các bạn khác trong trường', isCorrect: false }
    ],
    explanation: 'Luật sở hữu trí tuệ và đạo đức mạng yêu cầu phải trích dẫn rõ nguồn và tác giả khi sử dụng tài liệu tham khảo.',
    createdBy: 'user-depthead-01',
    authorName: 'Lê Thị Mai',
    createdAt: '2025-10-07',
    status: 'ACTIVE'
  },
  {
    id: 'q-11',
    code: 'TH6-01-03',
    content: 'Quá trình xử lý thông tin của máy tính bao gồm các bước theo thứ tự nào sau đây?',
    gradeLevel: 6,
    topic: 'Chủ đề 1: Máy tính và cộng đồng',
    lessonTitle: 'Bài 2: Xử lí thông tin',
    learningOutcome: 'Hiểu các bước cơ bản của quá trình xử lý thông tin',
    difficulty: 'HIEU',
    type: 'SINGLE_CHOICE',
    options: [
      { id: 'opt-1', text: 'Nhận thông tin -> Xử lý thông tin -> Xuất thông tin (và lưu trữ)', isCorrect: true },
      { id: 'opt-2', text: 'Xử lý thông tin -> Nhận thông tin -> Lưu trữ thông tin', isCorrect: false },
      { id: 'opt-3', text: 'Xuất thông tin -> Nhận thông tin -> Xử lý thông tin', isCorrect: false },
      { id: 'opt-4', text: 'Lưu trữ thông tin -> Xuất thông tin -> Nhận thông tin', isCorrect: false }
    ],
    explanation: 'Quy trình xử lý thông tin chuẩn: Nhận thông tin vào (Input) -> Xử lý (Processing) -> Xuất kết quả (Output) và Lưu trữ (Storage).',
    createdBy: 'user-teacher-01',
    authorName: 'Nguyễn Hữu Dũng',
    createdAt: '2025-10-08',
    status: 'ACTIVE'
  },
  {
    id: 'q-12',
    code: 'TH6-01-04',
    content: 'Đúng hay Sai: 1 Byte tương đương với bao nhiêu bit?',
    gradeLevel: 6,
    topic: 'Chủ đề 1: Máy tính và cộng đồng',
    lessonTitle: 'Bài 3: Thông tin trong máy tính',
    learningOutcome: 'Quy đổi chính xác các đơn vị đo dung lượng thông tin',
    difficulty: 'BIET',
    type: 'TRUE_FALSE',
    trueFalseStatements: [
      { id: 'tf-1', statement: '1 Byte bằng 8 bit.', isCorrect: true },
      { id: 'tf-2', statement: '1 KB bằng 1000 Byte trong tính toán nhị phân chuẩn.', isCorrect: false },
      { id: 'tf-3', statement: '1 MB bằng 1024 KB.', isCorrect: true },
      { id: 'tf-4', statement: '1 GB lớn hơn 1 TB.', isCorrect: false }
    ],
    explanation: '1 Byte = 8 bit; 1 KB = 1024 Byte; 1 MB = 1024 KB; 1 TB = 1024 GB nên GB nhỏ hơn TB.',
    createdBy: 'user-teacher-01',
    authorName: 'Nguyễn Hữu Dũng',
    createdAt: '2025-10-08',
    status: 'ACTIVE'
  },
  {
    id: 'q-13',
    code: 'TH6-02-05',
    content: 'Mạng máy tính gồm những thành phần cơ bản nào?',
    gradeLevel: 6,
    topic: 'Chủ đề 2: Mạng máy tính và Internet',
    lessonTitle: 'Bài 4: Mạng máy tính',
    learningOutcome: 'Nhận biết các thành phần mạng máy tính',
    difficulty: 'BIET',
    type: 'MULTIPLE_CHOICE',
    options: [
      { id: 'opt-1', text: 'Các thiết bị đầu cuối (Máy tính, điện thoại, máy in)', isCorrect: true },
      { id: 'opt-2', text: 'Các thiết bị kết nối mạng (Switch, Router, Modem, Cáp mạng)', isCorrect: true },
      { id: 'opt-3', text: 'Phần mềm mạng (Giao thức mạng, hệ điều hành mạng)', isCorrect: true },
      { id: 'opt-4', text: 'Bàn phím cơ chơi game', isCorrect: false }
    ],
    explanation: 'Các thành phần của mạng máy tính bao gồm thiết bị đầu cuối, thiết bị kết nối mạng và phần mềm mạng.',
    createdBy: 'user-teacher-01',
    authorName: 'Nguyễn Hữu Dũng',
    createdAt: '2025-10-09',
    status: 'ACTIVE'
  },
  {
    id: 'q-14',
    code: 'TH6-04-06',
    content: 'Hãy nêu ít nhất 3 lời khuyên giúp học sinh THCS tự bảo vệ bản thân và không rơi vào cạm bẫy trên không gian mạng Internet.',
    gradeLevel: 6,
    topic: 'Chủ đề 4: Đạo đức, pháp luật và văn hoá trong môi trường số',
    lessonTitle: 'Bài 9: An toàn thông tin trên Internet',
    learningOutcome: 'Thực hành bảo vệ an toàn trên mạng',
    difficulty: 'VAN_DUNG',
    type: 'ESSAY',
    essaySampleAnswer: '1. Không chia sẻ thông tin cá nhân (địa chỉ nhà, số điện thoại, trường học) cho người lạ trên mạng.\n2. Đặt mật khẩu mạnh và không chia sẻ mật khẩu tài khoản cho bất kỳ ai.\n3. Khi gặp nội dung độc hại, đe dọa hoặc nghi ngờ lừa đảo, hãy báo ngay cho cha mẹ hoặc thầy cô giáo.',
    explanation: 'Học sinh trình bày đủ 3 ý rõ ràng, thực tế và có tính ứng dụng cao.',
    createdBy: 'user-teacher-01',
    authorName: 'Nguyễn Hữu Dũng',
    createdAt: '2025-10-09',
    status: 'ACTIVE'
  },
  {
    id: 'q-15',
    code: 'TH6-03-07',
    content: 'Thư mục gốc (Root directory) trong hệ thống tệp là gì?',
    gradeLevel: 6,
    topic: 'Chủ đề 3: Tổ chức lưu trữ, tìm kiếm và trao đổi thông tin',
    lessonTitle: 'Bài 6: Mạng thông tin toàn cầu',
    learningOutcome: 'Nhận biết thư mục gốc và đường dẫn',
    difficulty: 'BIET',
    type: 'SINGLE_CHOICE',
    options: [
      { id: 'opt-1', text: 'Thư mục ở vị trí cao nhất của một ổ đĩa, không nằm trong bất kỳ thư mục nào khác', isCorrect: true },
      { id: 'opt-2', text: 'Thư mục chỉ chứa hình ảnh cá nhân', isCorrect: false },
      { id: 'opt-3', text: 'Thư mục tạm thời bị xóa nằm trong thùng rác', isCorrect: false },
      { id: 'opt-4', text: 'Tệp văn bản Word', isCorrect: false }
    ],
    explanation: 'Thư mục gốc là thư mục cao nhất của một ổ đĩa (ví dụ C:\\ hoặc D:\\).',
    createdBy: 'user-teacher-01',
    authorName: 'Nguyễn Hữu Dũng',
    createdAt: '2025-10-10',
    status: 'ACTIVE'
  },
  {
    id: 'q-16',
    code: 'TH7-01-01',
    content: 'Bộ nhớ RAM thuộc loại bộ nhớ nào của máy tính?',
    gradeLevel: 7,
    topic: 'Chủ đề 1: Máy tính và cộng đồng',
    lessonTitle: 'Bài 1: Thiết bị vào – ra',
    learningOutcome: 'Phân biệt bộ nhớ trong và bộ nhớ ngoài',
    difficulty: 'BIET',
    type: 'SINGLE_CHOICE',
    options: [
      { id: 'opt-1', text: 'Bộ nhớ trong (Bộ nhớ truy cập ngẫu nhiên, mất dữ liệu khi tắt nguồn)', isCorrect: true },
      { id: 'opt-2', text: 'Bộ nhớ ngoài như ổ cứng HDD/SSD', isCorrect: false },
      { id: 'opt-3', text: 'Thiết bị xuất kết quả', isCorrect: false },
      { id: 'opt-4', text: 'Bộ nguồn máy tính', isCorrect: false }
    ],
    explanation: 'RAM là bộ nhớ trong (Random Access Memory), dữ liệu trong RAM sẽ bị mất khi tắt máy tính.',
    createdBy: 'user-teacher-01',
    authorName: 'Nguyễn Hữu Dũng',
    createdAt: '2025-10-10',
    status: 'ACTIVE'
  },
  {
    id: 'q-17',
    code: 'TH7-04-03',
    content: 'Giả sử ô A1 có giá trị 15, ô B1 có giá trị 25. Công thức =SUM(A1, B1, 10) sẽ cho kết quả là bao nhiêu?',
    gradeLevel: 7,
    topic: 'Chủ đề 4: Ứng dụng tin học',
    lessonTitle: 'Bài 9: Công cụ hỗ trợ tính toán',
    learningOutcome: 'Vận dụng tính toán với hàm SUM',
    difficulty: 'HIEU',
    type: 'FILL_IN_BLANK',
    correctAnswerText: '50',
    explanation: '=SUM(15, 25, 10) = 15 + 25 + 10 = 50.',
    createdBy: 'user-teacher-01',
    authorName: 'Nguyễn Hữu Dũng',
    createdAt: '2025-10-10',
    status: 'ACTIVE'
  },
  {
    id: 'q-18',
    code: 'TH7-05-01',
    content: 'Xét tính Đúng/Sai của các mệnh đề sau về thuật toán tìm kiếm tuần tự và tìm kiếm nhị phân:',
    gradeLevel: 7,
    topic: 'Chủ đề 5: Giải quyết vấn đề với sự trợ giúp của máy tính',
    lessonTitle: 'Bài 15: Thuật toán tìm kiếm tuần tự',
    learningOutcome: 'So sánh thuật toán tìm kiếm tuần tự và nhị phân',
    difficulty: 'HIEU',
    type: 'TRUE_FALSE',
    trueFalseStatements: [
      { id: 'tf-1', statement: 'Thuật toán tìm kiếm tuần tự có thể áp dụng cho danh sách chưa được sắp xếp.', isCorrect: true },
      { id: 'tf-2', statement: 'Thuật toán tìm kiếm nhị phân bắt buộc danh sách phải được sắp xếp trước.', isCorrect: true },
      { id: 'tf-3', statement: 'Thuật toán tìm kiếm nhị phân luôn chậm hơn tìm kiếm tuần tự.', isCorrect: false },
      { id: 'tf-4', statement: 'Mỗi bước của tìm kiếm nhị phân chia đôi phạm vi tìm kiếm.', isCorrect: true }
    ],
    explanation: 'Tìm kiếm nhị phân đòi hỏi mảng đã sắp xếp và nhanh hơn đáng kể so với tìm kiếm tuần tự.',
    createdBy: 'user-teacher-01',
    authorName: 'Nguyễn Hữu Dũng',
    createdAt: '2025-10-10',
    status: 'ACTIVE'
  },
  {
    id: 'q-19',
    code: 'TH8-01-01',
    content: 'Máy tính điện tử thế hệ thứ nhất sử dụng linh kiện điện tử chủ yếu nào?',
    gradeLevel: 8,
    topic: 'Chủ đề 1: Máy tính và cộng đồng',
    lessonTitle: 'Bài 1: Lược sử công cụ tính toán',
    learningOutcome: 'Nhận biết các mốc phát triển công nghệ máy tính',
    difficulty: 'BIET',
    type: 'SINGLE_CHOICE',
    options: [
      { id: 'opt-1', text: 'Đèn điện tử chân không (Vacuum tube)', isCorrect: true },
      { id: 'opt-2', text: 'Bóng bán dẫn (Transistor)', isCorrect: false },
      { id: 'opt-3', text: 'Mạch tích hợp (IC)', isCorrect: false },
      { id: 'opt-4', text: 'Bộ vi xử lý siêu lớn (VLSI)', isCorrect: false }
    ],
    explanation: 'Thế hệ 1 dùng đèn điện tử chân không; thế hệ 2 dùng transistor; thế hệ 3 dùng IC; thế hệ 4 dùng vi xử lý.',
    createdBy: 'user-teacher-02',
    authorName: 'Phan Quốc Bảo',
    createdAt: '2025-10-10',
    status: 'ACTIVE'
  },
  {
    id: 'q-20',
    code: 'TH9-01-01',
    content: 'Trí tuệ nhân tạo (AI - Artificial Intelligence) mang lại những lợi ích gì nổi bật trong thời đại chuyển đổi số?',
    gradeLevel: 9,
    topic: 'Chủ đề 1: Máy tính và cộng đồng',
    lessonTitle: 'Bài 1: Thế giới kĩ thuật số',
    learningOutcome: 'Nhận biết ứng dụng và xu hướng AI',
    difficulty: 'BIET',
    type: 'MULTIPLE_CHOICE',
    options: [
      { id: 'opt-1', text: 'Tự động hóa các tác vụ lặp đi lặp lại với độ chính xác cao', isCorrect: true },
      { id: 'opt-2', text: 'Phân tích dữ liệu lớn và hỗ trợ đưa ra quyết định', isCorrect: true },
      { id: 'opt-3', text: 'Hỗ trợ dịch thuật ngôn ngữ và nhận diện khuôn mặt, giọng nói', isCorrect: true },
      { id: 'opt-4', text: 'Thay thế hoàn toàn nhu cầu rèn luyện tư duy của con người', isCorrect: false }
    ],
    explanation: 'AI hỗ trợ tự động hóa, phân tích dữ liệu, dịch thuật và nhận diện nhưng không thể thay thế sự rèn luyện tư duy của con người.',
    createdBy: 'user-depthead-01',
    authorName: 'Lê Thị Mai',
    createdAt: '2025-10-10',
    status: 'ACTIVE'
  }
];

export const INITIAL_TESTS: Test[] = [
  {
    id: 'test-th6-gk1',
    title: 'Kiểm tra Giữa kì 1 - Tin học 6 (Năm học 2025-2026)',
    gradeLevel: 6,
    durationMinutes: 45,
    totalQuestions: 6,
    totalPoints: 10,
    matrix: {
      knowCount: 2,
      understandCount: 2,
      applyCount: 2,
      selectedTopics: ['Chủ đề 1: Máy tính và cộng đồng', 'Chủ đề 2: Mạng máy tính và Internet', 'Chủ đề 3: Tổ chức lưu trữ, tìm kiếm và trao đổi thông tin', 'Chủ đề 6: Giải quyết vấn đề với sự trợ giúp của máy tính'],
      selectedLessons: [
        'Bài 1: Thông tin và dữ liệu',
        'Bài 3: Thông tin trong máy tính',
        'Bài 4: Mạng máy tính',
        'Bài 6: Mạng thông tin toàn cầu',
        'Bài 15: Thuật toán',
        'Bài 16: Các cấu trúc điều khiển'
      ]
    },
    questionIds: ['q-01', 'q-02', 'q-03', 'q-04', 'q-05', 'q-06'],
    variants: [
      {
        code: '101',
        questionIds: ['q-01', 'q-02', 'q-03', 'q-04', 'q-05', 'q-06']
      },
      {
        code: '102',
        questionIds: ['q-02', 'q-04', 'q-01', 'q-03', 'q-06', 'q-05']
      }
    ],
    createdBy: 'user-teacher-01',
    authorName: 'Nguyễn Hữu Dũng',
    createdAt: '2025-10-10',
    status: 'READY'
  },
  {
    id: 'test-th6-15p',
    title: 'Kiểm tra Thường xuyên 15 phút - Chủ đề 1 & 2',
    gradeLevel: 6,
    durationMinutes: 15,
    totalQuestions: 4,
    totalPoints: 10,
    matrix: {
      knowCount: 2,
      understandCount: 2,
      applyCount: 0,
      selectedTopics: ['Chủ đề 1: Máy tính và cộng đồng', 'Chủ đề 2: Mạng máy tính và Internet'],
      selectedLessons: [
        'Bài 1: Thông tin và dữ liệu',
        'Bài 3: Thông tin trong máy tính',
        'Bài 4: Mạng máy tính',
        'Bài 9: An toàn thông tin trên Internet'
      ]
    },
    questionIds: ['q-01', 'q-02', 'q-03', 'q-10'],
    variants: [
      {
        code: '201',
        questionIds: ['q-01', 'q-02', 'q-03', 'q-10']
      },
      {
        code: '202',
        questionIds: ['q-03', 'q-10', 'q-01', 'q-02']
      }
    ],
    createdBy: 'user-teacher-01',
    authorName: 'Nguyễn Hữu Dũng',
    createdAt: '2025-10-12',
    status: 'READY'
  }
];

export const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: 'assign-01',
    testId: 'test-th6-gk1',
    testTitle: 'Kiểm tra Giữa kì 1 - Tin học 6 (Năm học 2025-2026)',
    gradeLevel: 6,
    classIds: ['cls-6-1', 'cls-6-2'],
    classNames: ['6/1', '6/2'],
    startTime: '2025-10-15T07:30:00',
    endTime: '2026-12-31T23:59:00', // Đang mở để kiểm thử trực tiếp
    allowReviewAfterSubmit: true,
    shuffleQuestions: true,
    status: 'ACTIVE',
    assignedBy: 'user-teacher-01',
    assignedByName: 'Nguyễn Hữu Dũng',
    createdAt: '2025-10-14'
  },
  {
    id: 'assign-02',
    testId: 'test-th6-15p',
    testTitle: 'Kiểm tra Thường xuyên 15 phút - Chủ đề 1 & 2',
    gradeLevel: 6,
    classIds: ['cls-6-1'],
    classNames: ['6/1'],
    startTime: '2025-10-01T07:30:00',
    endTime: '2026-12-31T23:59:00',
    allowReviewAfterSubmit: true,
    shuffleQuestions: true,
    status: 'ACTIVE',
    assignedBy: 'user-teacher-01',
    assignedByName: 'Nguyễn Hữu Dũng',
    createdAt: '2025-10-01'
  }
];

export const INITIAL_SUBMISSIONS: Submission[] = [
  {
    id: 'sub-01',
    assignmentId: 'assign-02',
    testId: 'test-th6-15p',
    testTitle: 'Kiểm tra Thường xuyên 15 phút - Chủ đề 1 & 2',
    variantCode: '201',
    studentId: 'user-student-02',
    studentName: 'Trần Quỳnh Nga',
    studentCode: 'PH25-060102',
    classId: 'cls-6-1',
    className: '6/1',
    gradeLevel: 6,
    score: 10.0,
    maxScore: 10.0,
    correctCount: 4,
    totalQuestions: 4,
    startedAt: '2025-10-02T08:00:00',
    submittedAt: '2025-10-02T08:11:20',
    timeSpentSeconds: 680,
    status: 'COMPLETED',
    answers: {
      'q-01': { questionId: 'q-01', selectedOptionId: 'opt-1', isCorrect: true, pointsEarned: 2.5 },
      'q-02': { questionId: 'q-02', selectedOptionId: 'opt-1', isCorrect: true, pointsEarned: 2.5 },
      'q-03': { questionId: 'q-03', selectedOptionIds: ['opt-1', 'opt-2', 'opt-4'], isCorrect: true, pointsEarned: 2.5 },
      'q-10': { questionId: 'q-10', selectedOptionId: 'opt-1', isCorrect: true, pointsEarned: 2.5 }
    }
  },
  {
    id: 'sub-02',
    assignmentId: 'assign-02',
    testId: 'test-th6-15p',
    testTitle: 'Kiểm tra Thường xuyên 15 phút - Chủ đề 1 & 2',
    variantCode: '202',
    studentId: 'user-student-03',
    studentName: 'Lê Hoàng Nam',
    studentCode: 'PH25-060103',
    classId: 'cls-6-1',
    className: '6/1',
    gradeLevel: 6,
    score: 7.5,
    maxScore: 10.0,
    correctCount: 3,
    totalQuestions: 4,
    startedAt: '2025-10-02T08:05:00',
    submittedAt: '2025-10-02T08:14:10',
    timeSpentSeconds: 550,
    status: 'COMPLETED',
    answers: {
      'q-01': { questionId: 'q-01', selectedOptionId: 'opt-1', isCorrect: true, pointsEarned: 2.5 },
      'q-02': { questionId: 'q-02', selectedOptionId: 'opt-2', isCorrect: false, pointsEarned: 0 },
      'q-03': { questionId: 'q-03', selectedOptionIds: ['opt-1', 'opt-2', 'opt-4'], isCorrect: true, pointsEarned: 2.5 },
      'q-10': { questionId: 'q-10', selectedOptionId: 'opt-1', isCorrect: true, pointsEarned: 2.5 }
    }
  },
  {
    id: 'sub-03',
    assignmentId: 'assign-02',
    testId: 'test-th6-15p',
    testTitle: 'Kiểm tra Thường xuyên 15 phút - Chủ đề 1 & 2',
    variantCode: '201',
    studentId: 'user-student-05',
    studentName: 'Phan Thị Ánh Tuyết',
    studentCode: 'PH25-060104',
    classId: 'cls-6-1',
    className: '6/1',
    gradeLevel: 6,
    score: 8.5,
    maxScore: 10.0,
    correctCount: 4,
    totalQuestions: 4,
    startedAt: '2025-10-02T08:02:00',
    submittedAt: '2025-10-02T08:12:40',
    timeSpentSeconds: 640,
    status: 'COMPLETED',
    answers: {
      'q-01': { questionId: 'q-01', selectedOptionId: 'opt-1', isCorrect: true, pointsEarned: 2.5 },
      'q-02': { questionId: 'q-02', selectedOptionId: 'opt-1', isCorrect: true, pointsEarned: 2.5 },
      'q-03': { questionId: 'q-03', selectedOptionIds: ['opt-1', 'opt-2', 'opt-4'], isCorrect: true, pointsEarned: 2.5 },
      'q-10': { questionId: 'q-10', selectedOptionId: 'opt-1', isCorrect: true, pointsEarned: 2.5 }
    }
  },
  {
    id: 'sub-04',
    assignmentId: 'assign-01',
    testId: 'test-th6-gk1',
    testTitle: 'Kiểm tra Giữa kỳ I - Tin học 6 (GDPT 2018)',
    variantCode: '101',
    studentId: 'user-student-07',
    studentName: 'Nguyễn Bảo Ngọc',
    studentCode: 'PH25-060201',
    classId: 'cls-6-2',
    className: '6/2',
    gradeLevel: 6,
    score: 9.0,
    maxScore: 10.0,
    correctCount: 9,
    totalQuestions: 10,
    startedAt: '2025-10-01T08:00:00',
    submittedAt: '2025-10-01T08:28:15',
    timeSpentSeconds: 1695,
    status: 'COMPLETED',
    answers: {}
  }
];
