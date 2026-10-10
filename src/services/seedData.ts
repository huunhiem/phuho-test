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
  { id: 'cls-6-1', name: '6/1', gradeId: 'grade-6', academicYearId: 'ay-2025-2026', homeroomTeacherId: 'user-teacher-01', homeroomTeacherName: 'Nguyễn Hữu Dũng', studentCount: 38 },
  { id: 'cls-6-2', name: '6/2', gradeId: 'grade-6', academicYearId: 'ay-2025-2026', homeroomTeacherId: 'user-depthead-01', homeroomTeacherName: 'Lê Thị Mai', studentCount: 36 },
  { id: 'cls-7-1', name: '7/1', gradeId: 'grade-7', academicYearId: 'ay-2025-2026', homeroomTeacherId: 'user-teacher-01', homeroomTeacherName: 'Nguyễn Hữu Dũng', studentCount: 40 },
  { id: 'cls-7-2', name: '7/2', gradeId: 'grade-7', academicYearId: 'ay-2025-2026', homeroomTeacherId: 'user-depthead-01', homeroomTeacherName: 'Lê Thị Mai', studentCount: 39 },
  { id: 'cls-8-1', name: '8/1', gradeId: 'grade-8', academicYearId: 'ay-2025-2026', homeroomTeacherId: 'user-teacher-02', homeroomTeacherName: 'Phan Quốc Bảo', studentCount: 41 },
  { id: 'cls-9-1', name: '9/1', gradeId: 'grade-9', academicYearId: 'ay-2025-2026', homeroomTeacherId: 'user-teacher-02', homeroomTeacherName: 'Phan Quốc Bảo', studentCount: 37 }
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
    assignedClassIds: ['cls-8-1', 'cls-9-1'],
    phone: '0977665544',
    status: 'ACTIVE',
    createdAt: '2025-08-01'
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
  }
];

export const INITIAL_TOPICS: Topic[] = [
  { id: 'top-a', code: 'CHỦ ĐỀ A', name: 'Chủ đề A: Máy tính và cộng đồng', gradeLevel: 6, description: 'Thông tin và thu nhận thông tin, thiết bị số' },
  { id: 'top-b', code: 'CHỦ ĐỀ B', name: 'Chủ đề B: Mạng máy tính và Internet', gradeLevel: 6, description: 'Khái niệm mạng, tìm kiếm và chia sẻ thông tin' },
  { id: 'top-c', code: 'CHỦ ĐỀ C', name: 'Chủ đề C: Tổ chức lưu trữ và trao đổi thông tin', gradeLevel: 6, description: 'Thư mục, tệp, thư điện tử email' },
  { id: 'top-d', code: 'CHỦ ĐỀ D', name: 'Chủ đề D: Đạo đức, pháp luật và văn hóa trong môi trường số', gradeLevel: 6, description: 'Bản quyền, an toàn thông tin' },
  { id: 'top-e', code: 'CHỦ ĐỀ E', name: 'Chủ đề E: Ứng dụng tin học', gradeLevel: 6, description: 'Soạn thảo văn bản, bảng tính điện tử' },
  { id: 'top-f', code: 'CHỦ ĐỀ F', name: 'Chủ đề F: Giải quyết vấn đề với sự trợ giúp của máy tính', gradeLevel: 6, description: 'Thuật toán, sơ đồ khối, lập trình trực quan' }
];

export const INITIAL_LESSONS: Lesson[] = [
  // Khối 6
  { id: 'les-6-01', topicId: 'top-a', gradeLevel: 6, lessonNumber: 1, title: 'Bài 1: Thông tin và dữ liệu', learningOutcomes: 'Nhận biết được thông tin, dữ liệu và các thiết bị vào ra cơ bản' },
  { id: 'les-6-02', topicId: 'top-a', gradeLevel: 6, lessonNumber: 2, title: 'Bài 2: Lưu trữ và biểu diễn dữ liệu', learningOutcomes: 'Nêu được các đơn vị đo dung lượng thông tin: Bit, Byte, KB, MB, GB' },
  { id: 'les-6-03', topicId: 'top-a', gradeLevel: 6, lessonNumber: 3, title: 'Bài 3: Máy tính trong hoạt động thông tin', learningOutcomes: 'Hiểu vai trò của máy tính trong thu thập, lưu trữ, xử lý và truyền thông tin' },
  { id: 'les-6-04', topicId: 'top-b', gradeLevel: 6, lessonNumber: 4, title: 'Bài 4: Mạng máy tính', learningOutcomes: 'Hiểu khái niệm và lợi ích kết nối của mạng máy tính' },
  { id: 'les-6-05', topicId: 'top-b', gradeLevel: 6, lessonNumber: 5, title: 'Bài 5: An toàn khi dùng Internet', learningOutcomes: 'Thực hiện được các quy tắc bảo mật và an toàn thông tin trên mạng' },
  { id: 'les-6-06', topicId: 'top-c', gradeLevel: 6, lessonNumber: 6, title: 'Bài 6: Tệp và thư mục', learningOutcomes: 'Phân biệt tệp và thư mục, thao tác tổ chức cây thư mục' },
  { id: 'les-6-07', topicId: 'top-c', gradeLevel: 6, lessonNumber: 7, title: 'Bài 7: Thư điện tử (Email)', learningOutcomes: 'Biết cách sử dụng thư điện tử để trao đổi thông tin học tập' },
  { id: 'les-6-08', topicId: 'top-d', gradeLevel: 6, lessonNumber: 8, title: 'Bài 8: Tôn trọng bản quyền', learningOutcomes: 'Hiểu luật sở hữu trí tuệ và trích dẫn tài liệu văn minh' },
  { id: 'les-6-09', topicId: 'top-e', gradeLevel: 6, lessonNumber: 9, title: 'Bài 9: Sơ đồ tư duy', learningOutcomes: 'Sử dụng phần mềm tạo sơ đồ tư duy tóm tắt nội dung bài học' },
  { id: 'les-6-10', topicId: 'top-e', gradeLevel: 6, lessonNumber: 10, title: 'Bài 10: Định dạng văn bản và bảng biểu', learningOutcomes: 'Định dạng văn bản và chèn bảng biểu chuyên nghiệp' },
  { id: 'les-6-11', topicId: 'top-f', gradeLevel: 6, lessonNumber: 11, title: 'Bài 11: Cấu trúc rẽ nhánh trong thuật toán', learningOutcomes: 'Mô tả và giải thích được cấu trúc rẽ nhánh điều kiện' },
  { id: 'les-6-12', topicId: 'top-f', gradeLevel: 6, lessonNumber: 12, title: 'Bài 12: Mô tả thuật toán', learningOutcomes: 'Vẽ sơ đồ khối và viết thuật toán bằng ngôn ngữ tự nhiên' },

  // Khối 7
  { id: 'les-7-01', topicId: 'top-a', gradeLevel: 7, lessonNumber: 1, title: 'Bài 1: Thiết bị vào - ra và thiết bị lưu trữ', learningOutcomes: 'Phân loại các thiết bị phần cứng máy tính' },
  { id: 'les-7-02', topicId: 'top-a', gradeLevel: 7, lessonNumber: 2, title: 'Bài 2: Hệ điều hành và phần mềm ứng dụng', learningOutcomes: 'Phân biệt hệ điều hành và các ứng dụng' },
  { id: 'les-7-03', topicId: 'top-b', gradeLevel: 7, lessonNumber: 3, title: 'Bài 3: Mạng xã hội và giao tiếp trực tuyến', learningOutcomes: 'Kỹ năng ứng xử văn minh trên mạng xã hội' },
  { id: 'les-7-04', topicId: 'top-c', gradeLevel: 7, lessonNumber: 4, title: 'Bài 4: Quản lý dữ liệu trong máy tính', learningOutcomes: 'Tổ chức lưu trữ khoa học, sao lưu phòng ngừa mất mát dữ liệu' },
  { id: 'les-7-05', topicId: 'top-d', gradeLevel: 7, lessonNumber: 5, title: 'Bài 5: Ứng xử có văn hóa và bảo vệ bản quyền', learningOutcomes: 'Tuân thủ luật sở hữu trí tuệ và ứng xử chuẩn mực' },
  { id: 'les-7-06', topicId: 'top-e', gradeLevel: 7, lessonNumber: 6, title: 'Bài 6: Làm quen với bảng tính điện tử', learningOutcomes: 'Nhập dữ liệu và điều hướng trang tính' },
  { id: 'les-7-07', topicId: 'top-e', gradeLevel: 7, lessonNumber: 7, title: 'Bài 7: Sử dụng công thức và hàm', learningOutcomes: 'Phân biệt địa chỉ tương đối, tuyệt đối' },
  { id: 'les-7-08', topicId: 'top-e', gradeLevel: 7, lessonNumber: 8, title: 'Bài 8: Các hàm tính toán thông dụng', learningOutcomes: 'Sử dụng thành thạo SUM, AVERAGE, COUNT, MAX, MIN' },
  { id: 'les-7-09', topicId: 'top-e', gradeLevel: 7, lessonNumber: 9, title: 'Bài 9: Định dạng và trình bày bảng tính', learningOutcomes: 'Trình bày bảng tính rõ ràng, kẻ khung, căn lề và định dạng số' },
  { id: 'les-7-10', topicId: 'top-f', gradeLevel: 7, lessonNumber: 10, title: 'Bài 10: Thuật toán tìm kiếm tuần tự', learningOutcomes: 'Mô tả và giải thích được thuật toán tìm kiếm tuần tự' },
  { id: 'les-7-11', topicId: 'top-f', gradeLevel: 7, lessonNumber: 11, title: 'Bài 11: Thuật toán tìm kiếm nhị phân', learningOutcomes: 'Thực hiện thuật toán tìm kiếm nhị phân trên dãy số đã sắp xếp' },
  { id: 'les-7-12', topicId: 'top-f', gradeLevel: 7, lessonNumber: 12, title: 'Bài 12: Thuật toán sắp xếp nổi bọt và chọn', learningOutcomes: 'Mô phỏng thuật toán sắp xếp nổi bọt và chọn' },

  // Khối 8
  { id: 'les-8-01', topicId: 'top-a', gradeLevel: 8, lessonNumber: 1, title: 'Bài 1: Lịch sử phát triển của máy tính', learningOutcomes: 'Nêu được các thế hệ máy tính điện tử' },
  { id: 'les-8-02', topicId: 'top-b', gradeLevel: 8, lessonNumber: 2, title: 'Bài 2: Thông tin trong môi trường số', learningOutcomes: 'Đánh giá độ tin cậy của thông tin trên Internet' },
  { id: 'les-8-03', topicId: 'top-b', gradeLevel: 8, lessonNumber: 3, title: 'Bài 3: Thực hành khai thác thông tin số an toàn', learningOutcomes: 'Kỹ năng tìm kiếm nâng cao và kiểm chứng nguồn tin cậy' },
  { id: 'les-8-04', topicId: 'top-d', gradeLevel: 8, lessonNumber: 4, title: 'Bài 4: Đạo đức và văn hóa khi sử dụng công nghệ số', learningOutcomes: 'Phòng ngừa lừa đảo, bảo vệ quyền riêng tư cá nhân' },
  { id: 'les-8-05', topicId: 'top-e', gradeLevel: 8, lessonNumber: 5, title: 'Bài 5: Bảng tính điện tử nâng cao và biểu đồ', learningOutcomes: 'Vẽ biểu đồ hình cột, đường gấp khúc, hình tròn' },
  { id: 'les-8-06', topicId: 'top-e', gradeLevel: 8, lessonNumber: 6, title: 'Bài 6: Sắp xếp và lọc dữ liệu trong bảng tính', learningOutcomes: 'Sắp xếp dữ liệu đa tiêu chí và trích xuất dữ liệu bằng AutoFilter' },
  { id: 'les-8-07', topicId: 'top-f', gradeLevel: 8, lessonNumber: 7, title: 'Bài 7: Làm quen với lập trình trực quan', learningOutcomes: 'Khối lệnh, biến và biểu thức toán học trong Scratch' },
  { id: 'les-8-08', topicId: 'top-f', gradeLevel: 8, lessonNumber: 8, title: 'Bài 8: Cấu trúc rẽ nhánh trong lập trình', learningOutcomes: 'Áp dụng khối lệnh điều kiện nếu... thì và nếu... không thì' },
  { id: 'les-8-09', topicId: 'top-f', gradeLevel: 8, lessonNumber: 9, title: 'Bài 9: Cấu trúc lặp', learningOutcomes: 'Sử dụng vòng lặp xác định và không xác định' },
  { id: 'les-8-10', topicId: 'top-f', gradeLevel: 8, lessonNumber: 10, title: 'Bài 10: Xây dựng dự án trò chơi hoặc mô phỏng', learningOutcomes: 'Hoàn thiện sản phẩm phần mềm học tập hoàn chỉnh' },

  // Khối 9
  { id: 'les-9-01', topicId: 'top-a', gradeLevel: 9, lessonNumber: 1, title: 'Bài 1: Vai trò của máy tính trong đời sống và xã hội', learningOutcomes: 'Tác động của trí tuệ nhân tạo và công nghệ số đối với đời sống' },
  { id: 'les-9-02', topicId: 'top-b', gradeLevel: 9, lessonNumber: 2, title: 'Bài 2: Bảo vệ thông tin và an toàn trên không gian mạng', learningOutcomes: 'Phòng ngừa mã độc, tấn công mạng và rủi ro trực tuyến' },
  { id: 'les-9-03', topicId: 'top-c', gradeLevel: 9, lessonNumber: 3, title: 'Bài 3: Đánh giá chất lượng và độ tin cậy của thông tin', learningOutcomes: 'Phương pháp phân tích và kiểm chứng thông tin đa chiều' },
  { id: 'les-9-04', topicId: 'top-d', gradeLevel: 9, lessonNumber: 4, title: 'Bài 4: Pháp luật, đạo đức và trách nhiệm công dân số', learningOutcomes: 'Hiểu luật An ninh mạng và trách nhiệm công dân trong môi trường số' },
  { id: 'les-9-05', topicId: 'top-e', gradeLevel: 9, lessonNumber: 5, title: 'Bài 5: Đồ họa và xử lý hình ảnh số', learningOutcomes: 'Xử lý hình ảnh, chèn chữ nghệ thuật và cắt ghép ảnh kỹ thuật số' },
  { id: 'les-9-06', topicId: 'top-e', gradeLevel: 9, lessonNumber: 6, title: 'Bài 6: Biên tập video và sản phẩm đa phương tiện', learningOutcomes: 'Sáng tạo clip ngắn phục vụ thuyết trình và học tập' },
  { id: 'les-9-07', topicId: 'top-f', gradeLevel: 9, lessonNumber: 7, title: 'Bài 7: Thuật toán và mô tả thuật toán nâng cao', learningOutcomes: 'Phân tích độ phức tạp và tối ưu hóa giải thuật giải quyết vấn đề' },
  { id: 'les-9-08', topicId: 'top-f', gradeLevel: 9, lessonNumber: 8, title: 'Bài 8: Lập trình giải quyết bài toán thực tế', learningOutcomes: 'Giải quyết bài toán thực tế bằng chương trình máy tính' },
  { id: 'les-9-09', topicId: 'top-d', gradeLevel: 9, lessonNumber: 9, title: 'Bài 9: Hướng nghiệp và các ngành nghề trong kỷ nguyên AI', learningOutcomes: 'Tìm hiểu các ngành nghề công nghệ thông tin và phát triển kỹ năng tương lai' }
];

export const INITIAL_QUESTIONS: Question[] = [
  {
    id: 'q-01',
    code: 'TH6-A-01',
    content: 'Thiết bị nào sau đây là thiết bị vào (Input) của máy tính?',
    gradeLevel: 6,
    topic: 'Chủ đề A: Máy tính và cộng đồng',
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
    code: 'TH6-A-02',
    content: 'Đơn vị đo dung lượng thông tin nhỏ nhất trong máy tính là gì?',
    gradeLevel: 6,
    topic: 'Chủ đề A: Máy tính và cộng đồng',
    lessonTitle: 'Bài 2: Lưu trữ và biểu diễn dữ liệu',
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
    code: 'TH6-B-03',
    content: 'Những hành động nào sau đây giúp em bảo vệ tài khoản cá nhân an toàn trên Internet? (Chọn các phương án đúng)',
    gradeLevel: 6,
    topic: 'Chủ đề B: Mạng máy tính và Internet',
    lessonTitle: 'Bài 3: An toàn khi dùng Internet',
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
    code: 'TH6-C-04',
    content: 'Xét tính Đúng/Sai của các nhận định sau về việc tổ chức thông tin trong máy tính:',
    gradeLevel: 6,
    topic: 'Chủ đề C: Tổ chức lưu trữ và trao đổi thông tin',
    lessonTitle: 'Bài 4: Tệp và thư mục',
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
    code: 'TH6-F-05',
    content: 'Điền từ còn thiếu vào chỗ trống: "Trong thuật toán, cấu trúc [...] được sử dụng để thực hiện một số bước công việc chỉ khi một điều kiện cho trước được thỏa mãn."',
    gradeLevel: 6,
    topic: 'Chủ đề F: Giải quyết vấn đề với sự trợ giúp của máy tính',
    lessonTitle: 'Bài 5: Cấu trúc rẽ nhánh trong thuật toán',
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
    code: 'TH6-F-06',
    content: 'Em hãy viết các bước bằng ngôn ngữ tự nhiên để mô tả thuật toán: "Tìm số lớn nhất trong hai số a và b được nhập từ bàn phím". Nêu ví dụ khi a = 15 và b = 28.',
    gradeLevel: 6,
    topic: 'Chủ đề F: Giải quyết vấn đề với sự trợ giúp của máy tính',
    lessonTitle: 'Bài 6: Mô tả thuật toán',
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
    code: 'TH7-E-01',
    content: 'Trong bảng tính Excel, địa chỉ ô nào sau đây là địa chỉ tuyệt đối?',
    gradeLevel: 7,
    topic: 'Chủ đề E: Ứng dụng tin học',
    lessonTitle: 'Bài 7: Sử dụng công thức và hàm',
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
    code: 'TH7-E-02',
    content: 'Hàm nào sau đây dùng để tính trung bình cộng của một dãy số trong bảng tính?',
    gradeLevel: 7,
    topic: 'Chủ đề E: Ứng dụng tin học',
    lessonTitle: 'Bài 8: Các hàm tính toán thông dụng',
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
    code: 'TH8-F-01',
    content: 'Trong ngôn ngữ lập trình Scratch/Python, vòng lặp "for i in range(5):" sẽ thực hiện khối lệnh bao nhiêu lần?',
    gradeLevel: 8,
    topic: 'Chủ đề F: Giải quyết vấn đề với sự trợ giúp của máy tính',
    lessonTitle: 'Bài 9: Cấu trúc lặp',
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
    code: 'TH6-D-01',
    content: 'Khi sử dụng lại một bài viết hoặc hình ảnh từ trên mạng Internet để đưa vào bài thuyết trình của mình, hành vi nào sau đây là văn minh và đúng luật?',
    gradeLevel: 6,
    topic: 'Chủ đề D: Đạo đức, pháp luật và văn hóa trong môi trường số',
    lessonTitle: 'Bài 10: Tôn trọng bản quyền',
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
    code: 'TH6-A-03',
    content: 'Quá trình xử lý thông tin của máy tính bao gồm các bước theo thứ tự nào sau đây?',
    gradeLevel: 6,
    topic: 'Chủ đề A: Máy tính và cộng đồng',
    lessonTitle: 'Bài 1: Thông tin và dữ liệu',
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
    code: 'TH6-A-04',
    content: 'Đúng hay Sai: 1 Byte tương đương với bao nhiêu bit?',
    gradeLevel: 6,
    topic: 'Chủ đề A: Máy tính và cộng đồng',
    lessonTitle: 'Bài 2: Lưu trữ và biểu diễn dữ liệu',
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
    code: 'TH6-B-05',
    content: 'Mạng máy tính gồm những thành phần cơ bản nào?',
    gradeLevel: 6,
    topic: 'Chủ đề B: Mạng máy tính và Internet',
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
    code: 'TH6-B-06',
    content: 'Hãy nêu ít nhất 3 lời khuyên giúp học sinh THCS tự bảo vệ bản thân và không rơi vào cạm bẫy trên không gian mạng Internet.',
    gradeLevel: 6,
    topic: 'Chủ đề B: Mạng máy tính và Internet',
    lessonTitle: 'Bài 5: An toàn khi dùng Internet',
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
    code: 'TH6-C-07',
    content: 'Thư mục gốc (Root directory) trong hệ thống tệp là gì?',
    gradeLevel: 6,
    topic: 'Chủ đề C: Tổ chức lưu trữ và trao đổi thông tin',
    lessonTitle: 'Bài 6: Tệp và thư mục',
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
    code: 'TH7-A-01',
    content: 'Bộ nhớ RAM thuộc loại bộ nhớ nào của máy tính?',
    gradeLevel: 7,
    topic: 'Chủ đề A: Máy tính và cộng đồng',
    lessonTitle: 'Bài 1: Thiết bị vào - ra và thiết bị lưu trữ',
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
    code: 'TH7-E-03',
    content: 'Giả sử ô A1 có giá trị 15, ô B1 có giá trị 25. Công thức =SUM(A1, B1, 10) sẽ cho kết quả là bao nhiêu?',
    gradeLevel: 7,
    topic: 'Chủ đề E: Ứng dụng tin học',
    lessonTitle: 'Bài 6: Các hàm tính toán thông dụng',
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
    code: 'TH7-F-01',
    content: 'Xét tính Đúng/Sai của các mệnh đề sau về thuật toán tìm kiếm tuần tự và tìm kiếm nhị phân:',
    gradeLevel: 7,
    topic: 'Chủ đề F: Giải quyết vấn đề với sự trợ giúp của máy tính',
    lessonTitle: 'Bài 7: Thuật toán tìm kiếm tuần tự và nhị phân',
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
    code: 'TH8-A-01',
    content: 'Máy tính điện tử thế hệ thứ nhất sử dụng linh kiện điện tử chủ yếu nào?',
    gradeLevel: 8,
    topic: 'Chủ đề A: Máy tính và cộng đồng',
    lessonTitle: 'Bài 1: Lịch sử phát triển của máy tính',
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
    code: 'TH9-A-01',
    content: 'Trí tuệ nhân tạo (AI - Artificial Intelligence) mang lại những lợi ích gì nổi bật trong thời đại chuyển đổi số?',
    gradeLevel: 9,
    topic: 'Chủ đề A: Máy tính và cộng đồng',
    lessonTitle: 'Bài 1: Vai trò của máy tính trong đời sống',
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
      selectedTopics: ['Chủ đề A: Máy tính và cộng đồng', 'Chủ đề B: Mạng máy tính và Internet', 'Chủ đề C: Tổ chức lưu trữ và trao đổi thông tin', 'Chủ đề F: Giải quyết vấn đề với sự trợ giúp của máy tính'],
      selectedLessons: [
        'Bài 1: Thông tin và dữ liệu',
        'Bài 2: Lưu trữ và biểu diễn dữ liệu',
        'Bài 3: An toàn khi dùng Internet',
        'Bài 4: Tệp và thư mục',
        'Bài 5: Cấu trúc rẽ nhánh trong thuật toán',
        'Bài 6: Mô tả thuật toán'
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
    title: 'Kiểm tra Thường xuyên 15 phút - Chủ đề A & B',
    gradeLevel: 6,
    durationMinutes: 15,
    totalQuestions: 4,
    totalPoints: 10,
    matrix: {
      knowCount: 2,
      understandCount: 2,
      applyCount: 0,
      selectedTopics: ['Chủ đề A: Máy tính và cộng đồng', 'Chủ đề B: Mạng máy tính và Internet'],
      selectedLessons: [
        'Bài 1: Thông tin và dữ liệu',
        'Bài 2: Lưu trữ và biểu diễn dữ liệu',
        'Bài 3: An toàn khi dùng Internet',
        'Bài 10: Tôn trọng bản quyền'
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
    testTitle: 'Kiểm tra Thường xuyên 15 phút - Chủ đề A & B',
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
    testTitle: 'Kiểm tra Thường xuyên 15 phút - Chủ đề A & B',
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
    testTitle: 'Kiểm tra Thường xuyên 15 phút - Chủ đề A & B',
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
  }
];
