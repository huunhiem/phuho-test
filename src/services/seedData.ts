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
  { id: 'cls-6-1', name: '6/1', gradeId: 'grade-6', academicYearId: 'ay-2025-2026', homeroomTeacherId: 'user-teacher-01', homeroomTeacherName: 'Nguyễn Hữu Dũng', subjectTeacherId: 'user-teacher-01', subjectTeacherName: 'Nguyễn Hữu Dũng', assignedTeacherIds: ['user-teacher-01'], studentCount: 0 },
  { id: 'cls-6-2', name: '6/2', gradeId: 'grade-6', academicYearId: 'ay-2025-2026', homeroomTeacherId: 'user-depthead-01', homeroomTeacherName: 'Lê Thị Mai', subjectTeacherId: 'user-depthead-01', subjectTeacherName: 'Lê Thị Mai', assignedTeacherIds: ['user-depthead-01'], studentCount: 0 },
  { id: 'cls-7-1', name: '7/1', gradeId: 'grade-7', academicYearId: 'ay-2025-2026', homeroomTeacherId: 'user-teacher-01', homeroomTeacherName: 'Nguyễn Hữu Dũng', subjectTeacherId: 'user-teacher-01', subjectTeacherName: 'Nguyễn Hữu Dũng', assignedTeacherIds: ['user-teacher-01'], studentCount: 0 },
  { id: 'cls-7-2', name: '7/2', gradeId: 'grade-7', academicYearId: 'ay-2025-2026', homeroomTeacherId: 'user-depthead-01', homeroomTeacherName: 'Lê Thị Mai', subjectTeacherId: 'user-depthead-01', subjectTeacherName: 'Lê Thị Mai', assignedTeacherIds: ['user-depthead-01'], studentCount: 0 },
  { id: 'cls-8-1', name: '8/1', gradeId: 'grade-8', academicYearId: 'ay-2025-2026', homeroomTeacherId: 'user-teacher-02', homeroomTeacherName: 'Phan Quốc Bảo', subjectTeacherId: 'user-teacher-02', subjectTeacherName: 'Phan Quốc Bảo', assignedTeacherIds: ['user-teacher-02'], studentCount: 0 },
  { id: 'cls-8-7', name: '8/7', gradeId: 'grade-8', academicYearId: 'ay-2025-2026', homeroomTeacherId: 'user-teacher-02', homeroomTeacherName: 'Phan Quốc Bảo', subjectTeacherId: 'user-teacher-02', subjectTeacherName: 'Phan Quốc Bảo', assignedTeacherIds: ['user-teacher-02'], studentCount: 0 },
  { id: 'cls-8-8', name: '8/8', gradeId: 'grade-8', academicYearId: 'ay-2025-2026', homeroomTeacherId: 'user-teacher-02', homeroomTeacherName: 'Phan Quốc Bảo', subjectTeacherId: 'user-teacher-02', subjectTeacherName: 'Phan Quốc Bảo', assignedTeacherIds: ['user-teacher-02'], studentCount: 0 },
  { id: 'cls-9-1', name: '9/1', gradeId: 'grade-9', academicYearId: 'ay-2025-2026', homeroomTeacherId: 'user-teacher-02', homeroomTeacherName: 'Phan Quốc Bảo', subjectTeacherId: 'user-teacher-02', subjectTeacherName: 'Phan Quốc Bảo', assignedTeacherIds: ['user-teacher-02'], studentCount: 0 }
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

export const INITIAL_QUESTIONS: Question[] = [];

export const INITIAL_TESTS: Test[] = [];

export const INITIAL_ASSIGNMENTS: Assignment[] = [];

export const INITIAL_SUBMISSIONS: Submission[] = [];
