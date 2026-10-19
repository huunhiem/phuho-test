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
  province: 'Tỉnh Thừa Thiên Huế',
  district: 'Huyện Phú Vang',
  address: 'Xã Phú Hồ, Huyện Phú Vang, Tỉnh Thừa Thiên Huế',
  principalName: 'Trần Văn Khoa',
  academicYear: '2025-2026'
};

export const INITIAL_ACADEMIC_YEARS: AcademicYear[] = [
  { id: 'ay-2024-2025', name: '2024-2025', startDate: '2024-09-05', endDate: '2025-05-31', isCurrent: false },
  { id: 'ay-2025-2026', name: '2025-2026', startDate: '2025-09-05', endDate: '2026-05-31', isCurrent: true }
];

export const INITIAL_GRADES: Grade[] = [
  { id: 'grade-6', name: 'Khối 6', level: 6 },
  { id: 'grade-7', name: 'Khối 7', level: 7 },
  { id: 'grade-8', name: 'Khối 8', level: 8 },
  { id: 'grade-9', name: 'Khối 9', level: 9 }
];

export const INITIAL_CLASSES: ClassRoom[] = [
  {
    "id": "cls-8-7",
    "name": "8/7",
    "gradeId": "grade-8",
    "academicYearId": "ay-2025-2026",
    "homeroomTeacherId": "user-1791601248284",
    "homeroomTeacherName": "Lê Hữu Nhiệm",
    "subjectTeacherId": "user-1791601248284",
    "subjectTeacherName": "Lê Hữu Nhiệm",
    "assignedTeacherIds": [
      "user-1791601248284",
      "user-admin-01"
    ],
    "studentCount": 38
  },
  {
    "id": "cls-6-7",
    "name": "6/7",
    "gradeId": "grade-6",
    "academicYearId": "ay-2025-2026",
    "homeroomTeacherId": "user-1791601248284",
    "homeroomTeacherName": "Lê Hữu Nhiệm",
    "subjectTeacherId": "user-1791601248284",
    "subjectTeacherName": "Lê Hữu Nhiệm",
    "assignedTeacherIds": [
      "user-1791601248284",
      "user-admin-01"
    ],
    "studentCount": 35
  },
  {
    "id": "cls-6-8",
    "name": "6/8",
    "gradeId": "grade-6",
    "academicYearId": "ay-2025-2026",
    "homeroomTeacherId": "user-1791601248284",
    "homeroomTeacherName": "Lê Hữu Nhiệm",
    "subjectTeacherId": "user-1791601248284",
    "subjectTeacherName": "Lê Hữu Nhiệm",
    "assignedTeacherIds": [
      "user-1791601248284",
      "user-admin-01"
    ],
    "studentCount": 35
  },
  {
    "id": "cls-8-8",
    "name": "8/8",
    "gradeId": "grade-8",
    "academicYearId": "ay-2025-2026",
    "homeroomTeacherId": "user-teacher-02",
    "homeroomTeacherName": "Trần Quốc Bảo",
    "subjectTeacherId": "user-teacher-02",
    "subjectTeacherName": "Trần Quốc Bảo",
    "assignedTeacherIds": [
      "user-teacher-02"
    ],
    "studentCount": 37
  },
  {
    "id": "cls-6-1",
    "name": "6/1",
    "gradeId": "grade-6",
    "academicYearId": "ay-2025-2026",
    "homeroomTeacherId": "user-teacher-01",
    "homeroomTeacherName": "Nguyễn Hữu Dũng",
    "subjectTeacherId": "user-teacher-01",
    "subjectTeacherName": "Nguyễn Hữu Dũng",
    "assignedTeacherIds": [
      "user-teacher-01",
      "user-1791601248284"
    ],
    "studentCount": 35
  },
  {
    "id": "cls-6-2",
    "name": "6/2",
    "gradeId": "grade-6",
    "academicYearId": "ay-2025-2026",
    "homeroomTeacherId": "user-depthead-01",
    "homeroomTeacherName": "Lê Thị Mai",
    "subjectTeacherId": "user-depthead-01",
    "subjectTeacherName": "Lê Thị Mai",
    "assignedTeacherIds": [
      "user-depthead-01"
    ],
    "studentCount": 34
  },
  {
    "id": "cls-7-1",
    "name": "7/1",
    "gradeId": "grade-7",
    "academicYearId": "ay-2025-2026",
    "homeroomTeacherId": "user-1791384587518",
    "homeroomTeacherName": "Lê Nữ Linh Sang",
    "subjectTeacherId": "user-teacher-01",
    "subjectTeacherName": "Nguyễn Hữu Dũng",
    "assignedTeacherIds": [
      "user-teacher-01",
      "user-1791384587518"
    ],
    "studentCount": 36
  },
  {
    "id": "cls-7-2",
    "name": "7/2",
    "gradeId": "grade-7",
    "academicYearId": "ay-2025-2026",
    "homeroomTeacherId": "user-depthead-01",
    "homeroomTeacherName": "Lê Thị Mai",
    "subjectTeacherId": "user-depthead-01",
    "subjectTeacherName": "Lê Thị Mai",
    "assignedTeacherIds": [
      "user-depthead-01"
    ],
    "studentCount": 35
  },
  {
    "id": "cls-8-1",
    "name": "8/1",
    "gradeId": "grade-8",
    "academicYearId": "ay-2025-2026",
    "homeroomTeacherId": "user-1791513027866",
    "homeroomTeacherName": "Đinh Như Dậu",
    "subjectTeacherId": "user-teacher-02",
    "subjectTeacherName": "Trần Quốc Bảo",
    "assignedTeacherIds": [
      "user-teacher-02",
      "user-1791513027866"
    ],
    "studentCount": 37
  },
  {
    "id": "cls-8-2",
    "name": "8/2",
    "gradeId": "grade-8",
    "academicYearId": "ay-2025-2026",
    "homeroomTeacherId": "user-depthead-01",
    "homeroomTeacherName": "Lê Thị Mai",
    "subjectTeacherId": "user-depthead-01",
    "subjectTeacherName": "Lê Thị Mai",
    "assignedTeacherIds": [
      "user-depthead-01"
    ],
    "studentCount": 36
  },
  {
    "id": "cls-9-1",
    "name": "9/1",
    "gradeId": "grade-9",
    "academicYearId": "ay-2025-2026",
    "homeroomTeacherId": "user-teacher-01",
    "homeroomTeacherName": "Nguyễn Hữu Dũng",
    "subjectTeacherId": "user-teacher-01",
    "subjectTeacherName": "Nguyễn Hữu Dũng",
    "assignedTeacherIds": [
      "user-teacher-01"
    ],
    "studentCount": 33
  }
];

export const INITIAL_USERS: User[] = [
  {
    "id": "user-admin-01",
    "username": "admin",
    "password": "phuho@2025",
    "fullName": "Quản trị viên Hệ thống",
    "email": "admin@thcs-phuho.edu.vn",
    "role": "ADMIN",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2025-08-01"
  },
  {
    "id": "user-1791601248284",
    "username": "gv.nhiem",
    "password": "123456",
    "fullName": "Lê Hữu Nhiệm",
    "email": "huunhiemsp@gmail.com",
    "role": "TEACHER",
    "teacherCode": "GV-TIN-02",
    "assignedClassIds": [
      "cls-8-7",
      "cls-6-7",
      "cls-6-8"
    ],
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "phone": "0375090601",
    "createdAt": "2026-10-10"
  },
  {
    "id": "user-principal-01",
    "username": "hieutruong",
    "password": "phuho@2025",
    "fullName": "Thầy Trần Văn Khoa",
    "email": "hieutruong@thcs-phuho.edu.vn",
    "role": "PRINCIPAL",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2025-08-01"
  },
  {
    "id": "user-depthead-01",
    "username": "totruong.tin",
    "password": "mai@tin2025",
    "fullName": "Cô Lê Thị Mai",
    "email": "mai.lt@thcs-phuho.edu.vn",
    "role": "DEPARTMENT_HEAD",
    "teacherCode": "GV-TIN-01",
    "assignedClassIds": [
      "cls-6-2"
    ],
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2025-08-01"
  },
  {
    "id": "user-1791384587518",
    "username": "gv.sang",
    "password": "123456",
    "fullName": "Lê Nữ Linh Sang",
    "email": "gv.sang@gmail.com",
    "role": "TEACHER",
    "teacherCode": "GV-HDTN-01",
    "assignedClassIds": [
      "cls-7-1"
    ],
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-07"
  },
  {
    "id": "user-1791513027866",
    "username": "gv.dau",
    "password": "123456",
    "fullName": "Đinh Như Dậu",
    "email": "dau@gmail.com",
    "role": "TEACHER",
    "teacherCode": "GV-DIA-01",
    "assignedClassIds": [
      "cls-8-1"
    ],
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-09"
  },
  {
    "id": "user-1791601383323",
    "username": "gv.long",
    "password": "123456",
    "fullName": "Nguyễn Đăng Long",
    "email": "long@gmail.com",
    "role": "TEACHER",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-10"
  },
  {
    "id": "user-1791601353245",
    "username": "gv.khanh",
    "password": "123456",
    "fullName": "Nguyễn Phúc Kim Khánh",
    "email": "khanh@gmail.com",
    "role": "TEACHER",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-10"
  },
  {
    "id": "user-1791601324415",
    "username": "tt.ha",
    "password": "123456",
    "fullName": "Phạm Bá Hà",
    "email": "ha@gmail.com",
    "role": "DEPARTMENT_HEAD",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-10"
  },
  {
    "id": "user-1791601281961",
    "username": "gv.phuc",
    "password": "123456",
    "fullName": "Phạm Thị Hoàng Phúc",
    "email": "phuc@gmail.com",
    "role": "TEACHER",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-10"
  },
  {
    "id": "user-teacher-01",
    "username": "dung.tin",
    "password": "dung@tin2025",
    "fullName": "Nguyễn Hữu Dũng",
    "email": "dung.nh@thcs-phuho.edu.vn",
    "role": "TEACHER",
    "teacherCode": "GV-TIN-03",
    "assignedClassIds": [
      "cls-6-1",
      "cls-7-1"
    ],
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2025-08-01"
  },
  {
    "id": "user-teacher-02",
    "username": "bao.tin",
    "password": "bao@tin2025",
    "fullName": "Trần Quốc Bảo",
    "email": "bao.tq@thcs-phuho.edu.vn",
    "role": "TEACHER",
    "teacherCode": "GV-TIN-04",
    "assignedClassIds": [
      "cls-8-8"
    ],
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2025-08-01"
  },
  {
    "id": "user-1791697954029",
    "username": "hs.hoaian87",
    "password": "123456",
    "fullName": "Nguyễn Ngọc Hoài An",
    "email": "hoaian87@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS87-01",
    "classId": "cls-8-7",
    "gradeId": "grade-8",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-1791697738349",
    "username": "hs.tramanh88",
    "password": "123456",
    "fullName": "Võ Ngọc Trâm Anh",
    "email": "tramanh88@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS88-01",
    "classId": "cls-8-7",
    "gradeId": "grade-8",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625431950-0",
    "username": "hs.giabao78",
    "password": "123456",
    "fullName": "Đoàn Trương Gia Bảo",
    "email": "giabao78@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS78-02",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625431950-1",
    "username": "hs.baochau78",
    "password": "123456",
    "fullName": "Nguyễn Ngọc Bảo Châu",
    "email": "baochau78@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS78-03",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625431950-2",
    "username": "hs.quynhchi78",
    "password": "123456",
    "fullName": "Nguyễn Hoàng Quỳnh Chi",
    "email": "quynhchi78@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS78-04",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625431950-3",
    "username": "hs.thanhdanh78",
    "password": "123456",
    "fullName": "Nguyễn Duy Thành Danh",
    "email": "thanhdanh78@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS78-05",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625431950-4",
    "username": "hs.kieudiem78",
    "password": "123456",
    "fullName": "Nguyễn Ngọc Kiều Diễm",
    "email": "kieudiem78@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS78-06",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625431950-5",
    "username": "hs.duyduan78",
    "password": "123456",
    "fullName": "Lê Duy Duẩn",
    "email": "duyduan78@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS78-07",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625431950-6",
    "username": "hs.quochung78",
    "password": "123456",
    "fullName": "Ngô Văn Quốc Hùng",
    "email": "quochung78@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS78-08",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625431950-7",
    "username": "hs.giahuy78",
    "password": "123456",
    "fullName": "Đặng Gia Huy",
    "email": "giahuy78@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS78-09",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625431950-8",
    "username": "hs.vanhung78",
    "password": "123456",
    "fullName": "Nguyễn Văn Hưng",
    "email": "vanhung78@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS78-10",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625431950-9",
    "username": "hs.nguyenkhang78",
    "password": "123456",
    "fullName": "Trần Nguyễn Nguyên Khang",
    "email": "nguyenkhang78@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS78-11",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625431950-10",
    "username": "hs.huukhanh78",
    "password": "123456",
    "fullName": "Nguyễn Hữu Khánh",
    "email": "huukhanh78@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS78-12",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625431950-11",
    "username": "hs.anhkiet78",
    "password": "123456",
    "fullName": "Nguyễn Duy Anh Kiệt",
    "email": "anhkiet78@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS78-13",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625431950-12",
    "username": "hs.baolinh78",
    "password": "123456",
    "fullName": "Võ Hoàng Bảo Linh",
    "email": "baolinh78@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS78-14",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625431950-13",
    "username": "hs.baolong78",
    "password": "123456",
    "fullName": "Lê Nguyễn Bảo Long",
    "email": "baolong78@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS78-15",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625431950-14",
    "username": "hs.phatloc78",
    "password": "123456",
    "fullName": "Nguyễn Ngọc Phát Lộc",
    "email": "phatloc78@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS78-16",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625431950-15",
    "username": "hs.khanhly78",
    "password": "123456",
    "fullName": "Ngô Thị Khánh Ly",
    "email": "khanhly78@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS78-17",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625431950-16",
    "username": "hs.tramy78",
    "password": "123456",
    "fullName": "Ngô Thị Trà My",
    "email": "tramy78@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS78-18",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625431950-17",
    "username": "hs.kimngan78",
    "password": "123456",
    "fullName": "Võ Thị Kim Ngân",
    "email": "kimngan78@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS78-19",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625431950-18",
    "username": "hs.thaonguyen78",
    "password": "123456",
    "fullName": "Hồ Thị Thảo Nguyên",
    "email": "thaonguyen78@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS78-20",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625431950-19",
    "username": "hs.dannguyen78",
    "password": "123456",
    "fullName": "Trần Thị Đan Nguyên",
    "email": "dannguyen78@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS78-21",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625431950-20",
    "username": "hs.thanhnhan78",
    "password": "123456",
    "fullName": "Ngô Văn Thành Nhân",
    "email": "thanhnhan78@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS78-22",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625431950-21",
    "username": "hs.trungnhat78",
    "password": "123456",
    "fullName": "Hồ Viết Trung Nhật",
    "email": "trungnhat78@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS78-23",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625431950-22",
    "username": "hs.yennhi78",
    "password": "123456",
    "fullName": "Trần Ngọc Yến Nhi",
    "email": "yennhi78@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS78-24",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625431950-23",
    "username": "hs.quynhnhu78",
    "password": "123456",
    "fullName": "Nguyễn Hồ Quỳnh Như",
    "email": "quynhnhu78@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS78-25",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625431950-24",
    "username": "hs.tonu78",
    "password": "123456",
    "fullName": "Nguyễn Bạch Tố Nữ",
    "email": "tonu78@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS78-26",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625431950-25",
    "username": "hs.manhquan78",
    "password": "123456",
    "fullName": "Lê Nguyễn Mạnh Quân",
    "email": "manhquan78@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS78-27",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625431950-26",
    "username": "hs.minhquan78",
    "password": "123456",
    "fullName": "Nguyễn Hoàng Minh Quân",
    "email": "minhquan78@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS78-28",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625431950-27",
    "username": "hs.vanquy78",
    "password": "123456",
    "fullName": "Đỗ Văn Qúy",
    "email": "vanquy78@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS78-29",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625431950-28",
    "username": "hs.nhuquynh78",
    "password": "123456",
    "fullName": "Đỗ Như Quỳnh",
    "email": "nhuquynh78@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS78-30",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625431950-29",
    "username": "hs.phucthinh78",
    "password": "123456",
    "fullName": "Trần Phúc Thịnh",
    "email": "phucthinh78@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS78-31",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625431950-30",
    "username": "hs.chithuan78",
    "password": "123456",
    "fullName": "Ngô Văn Chí Thuần",
    "email": "chithuan78@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS78-32",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625431950-31",
    "username": "hs.anhthu78",
    "password": "123456",
    "fullName": "Ngô Huỳnh Anh Thư",
    "email": "anhthu78@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS78-33",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625431950-32",
    "username": "hs.nhattien78",
    "password": "123456",
    "fullName": "Phạm Hoàng Nhật Tiên",
    "email": "nhattien78@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS78-34",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625431950-33",
    "username": "hs.baotram78",
    "password": "123456",
    "fullName": "Nguyễn Ngọc Bảo Trâm",
    "email": "baotram78@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS78-35",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625431950-34",
    "username": "hs.minhtri78",
    "password": "123456",
    "fullName": "Hồ Nguyễn Minh Trí",
    "email": "minhtri78@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS78-36",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625431950-35",
    "username": "hs.duytuong78",
    "password": "123456",
    "fullName": "Nguyễn Duy Tường",
    "email": "duytuong78@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS78-37",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625431950-36",
    "username": "hs.kienvan78",
    "password": "123456",
    "fullName": "Đỗ Kiến Văn",
    "email": "kienvan78@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS78-38",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625431950-37",
    "username": "hs.camvan78",
    "password": "123456",
    "fullName": "Nguyễn Thị Cẩm Vân",
    "email": "camvan78@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS78-39",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625431950-38",
    "username": "hs.nhavien78",
    "password": "123456",
    "fullName": "Ngô Phan Nhã Viên",
    "email": "nhavien78@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS78-40",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625431950-39",
    "username": "hs.nhuy78",
    "password": "123456",
    "fullName": "Lê Thanh Như Ý",
    "email": "nhuy78@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS78-41",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625331289-0",
    "username": "hs.giabao77",
    "password": "123456",
    "fullName": "Ngô Đắc Gia Bảo",
    "email": "giabao77@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS77-02",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625331289-1",
    "username": "hs.giabao772",
    "password": "123456",
    "fullName": "Nguyễn Văn Gia Bão",
    "email": "giabao772@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS77-03",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625331289-2",
    "username": "hs.ngocbich77",
    "password": "123456",
    "fullName": "Phạm Nguyễn Ngọc Bích",
    "email": "ngocbich77@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS77-04",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625331289-3",
    "username": "hs.baochau77",
    "password": "123456",
    "fullName": "Nguyễn Bảo Châu",
    "email": "baochau77@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS77-05",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625331289-4",
    "username": "hs.ngocdai77",
    "password": "123456",
    "fullName": "Nguyễn Quang Ngọc Đại",
    "email": "ngocdai77@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS77-06",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625331289-5",
    "username": "hs.kimhien77",
    "password": "123456",
    "fullName": "Nguyễn Kim Hiền",
    "email": "kimhien77@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS77-07",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625331289-6",
    "username": "hs.viethoan77",
    "password": "123456",
    "fullName": "Hồ Viết Hoan",
    "email": "viethoan77@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS77-08",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625331289-7",
    "username": "hs.tuanhung77",
    "password": "123456",
    "fullName": "Hồ Ngô Tuấn Hưng",
    "email": "tuanhung77@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS77-09",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625331289-8",
    "username": "hs.congkhai77",
    "password": "123456",
    "fullName": "Đỗ Công Khái",
    "email": "congkhai77@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS77-10",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625331289-9",
    "username": "hs.dangkhoi77",
    "password": "123456",
    "fullName": "Hồ Viết Đăng Khôi",
    "email": "dangkhoi77@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS77-11",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625331289-10",
    "username": "hs.phuonglinh77",
    "password": "123456",
    "fullName": "Nguyễn Bình Phương Linh",
    "email": "phuonglinh77@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS77-12",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625331289-11",
    "username": "hs.philong77",
    "password": "123456",
    "fullName": "Nguyễn Kim Phi Long",
    "email": "philong77@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS77-13",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625331289-12",
    "username": "hs.hamy77",
    "password": "123456",
    "fullName": "Phạm Hà My",
    "email": "hamy77@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS77-14",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625331289-13",
    "username": "hs.thienmy77",
    "password": "123456",
    "fullName": "Trần Lê Thiên Mỹ",
    "email": "thienmy77@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS77-15",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625331289-14",
    "username": "hs.thanhngan77",
    "password": "123456",
    "fullName": "Nguyễn Thị Thanh Ngân",
    "email": "thanhngan77@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS77-16",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625331289-15",
    "username": "hs.baongoc77",
    "password": "123456",
    "fullName": "Lê Nguyễn Bảo Ngọc",
    "email": "baongoc77@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS77-17",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625331289-16",
    "username": "hs.thaonguyen77",
    "password": "123456",
    "fullName": "Hồ Nguyễn Thảo Nguyên",
    "email": "thaonguyen77@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS77-18",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625331289-17",
    "username": "hs.thanhnhan77",
    "password": "123456",
    "fullName": "Trần Văn Thành Nhân",
    "email": "thanhnhan77@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS77-19",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625331289-18",
    "username": "hs.annhien77",
    "password": "123456",
    "fullName": "Đỗ Dương An Nhiên",
    "email": "annhien77@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS77-20",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625331289-19",
    "username": "hs.haonhien77",
    "password": "123456",
    "fullName": "Phan Hữu Hạo Nhiên",
    "email": "haonhien77@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS77-21",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625331289-20",
    "username": "hs.huuphuc77",
    "password": "123456",
    "fullName": "Nguyễn Hữu Phúc",
    "email": "huuphuc77@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS77-22",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625331289-21",
    "username": "hs.thanhphuong77",
    "password": "123456",
    "fullName": "Phan Thị Thanh Phương",
    "email": "thanhphuong77@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS77-23",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625331289-22",
    "username": "hs.nhatquang77",
    "password": "123456",
    "fullName": "Nguyễn Văn Nhật Quang",
    "email": "nhatquang77@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS77-24",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625331289-23",
    "username": "hs.vietquan77",
    "password": "123456",
    "fullName": "Lê Nguyễn Viết Quân",
    "email": "vietquan77@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS77-25",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625331290-24",
    "username": "hs.minhquan77",
    "password": "123456",
    "fullName": "Nguyễn Đức Minh Quân",
    "email": "minhquan77@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS77-26",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625331290-25",
    "username": "hs.nhuquynh77",
    "password": "123456",
    "fullName": "Đỗ Ngọc Như Quỳnh",
    "email": "nhuquynh77@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS77-27",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625331290-26",
    "username": "hs.xuanson77",
    "password": "123456",
    "fullName": "Nguyễn Xuân Sơn",
    "email": "xuanson77@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS77-28",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625331290-27",
    "username": "hs.thanhtam77",
    "password": "123456",
    "fullName": "Trần Thị Thanh Tâm",
    "email": "thanhtam77@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS77-29",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625331290-28",
    "username": "hs.minhtan77",
    "password": "123456",
    "fullName": "Ngô Hòa Minh Tân",
    "email": "minhtan77@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS77-30",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625331290-29",
    "username": "hs.baothy77",
    "password": "123456",
    "fullName": "Lê Nguyễn Bảo Thy",
    "email": "baothy77@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS77-31",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625331290-30",
    "username": "hs.thanhtin77",
    "password": "123456",
    "fullName": "Nguyễn Thành Tín",
    "email": "thanhtin77@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS77-32",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625331290-31",
    "username": "hs.huyentram77",
    "password": "123456",
    "fullName": "Nguyễn Thị Huyền Trâm",
    "email": "huyentram77@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS77-33",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625331290-32",
    "username": "hs.tutrinh77",
    "password": "123456",
    "fullName": "Nguyễn Vũ Tú Trinh",
    "email": "tutrinh77@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS77-34",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625331290-33",
    "username": "hs.anhtu77",
    "password": "123456",
    "fullName": "Huỳnh Anh Tú",
    "email": "anhtu77@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS77-35",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625331290-34",
    "username": "hs.quoctu77",
    "password": "123456",
    "fullName": "Trần Quốc Tú",
    "email": "quoctu77@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS77-36",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625331290-35",
    "username": "hs.baotuan77",
    "password": "123456",
    "fullName": "Huỳnh Hoàng Bảo Tuấn",
    "email": "baotuan77@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS77-37",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625331290-36",
    "username": "hs.ngoctuyen77",
    "password": "123456",
    "fullName": "Ngô Ngọc Tuyến",
    "email": "ngoctuyen77@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS77-38",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625331290-37",
    "username": "hs.thaovy77",
    "password": "123456",
    "fullName": "Mai Nguyễn Thảo Vy",
    "email": "thaovy77@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS77-39",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625331290-38",
    "username": "hs.ngocyen77",
    "password": "123456",
    "fullName": "Nguyễn Thị Ngọc Yến",
    "email": "ngocyen77@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS77-40",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625233621-0",
    "username": "hs.giabao69",
    "password": "123456",
    "fullName": "Hồ Gia Bảo",
    "email": "giabao69@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS69-02",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625233621-1",
    "username": "hs.kimbao69",
    "password": "123456",
    "fullName": "Nguyễn Kim Bảo",
    "email": "kimbao69@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS69-03",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625233621-2",
    "username": "hs.haidang69",
    "password": "123456",
    "fullName": "Trần Hải Đăng",
    "email": "haidang69@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS69-04",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625233621-3",
    "username": "hs.vietgon69",
    "password": "123456",
    "fullName": "Nguyễn Viết Gôn",
    "email": "vietgon69@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS69-05",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625233621-4",
    "username": "hs.baohan69",
    "password": "123456",
    "fullName": "Nguyễn Huỳnh Bảo Hân",
    "email": "baohan69@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS69-06",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625233621-5",
    "username": "hs.tuankhanh69",
    "password": "123456",
    "fullName": "Nguyễn Văn Tuấn Khanh",
    "email": "tuankhanh69@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS69-07",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625233621-6",
    "username": "hs.namkhanh69",
    "password": "123456",
    "fullName": "Bùi Xuân Nam Khánh",
    "email": "namkhanh69@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS69-08",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625233621-7",
    "username": "hs.gialam69",
    "password": "123456",
    "fullName": "Phan Viết Gia Lâm",
    "email": "gialam69@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS69-09",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625233621-8",
    "username": "hs.thanhlong69",
    "password": "123456",
    "fullName": "Trần Văn Thành Long",
    "email": "thanhlong69@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS69-10",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625233621-9",
    "username": "hs.thinga69",
    "password": "123456",
    "fullName": "Đinh Thị Nga",
    "email": "thinga69@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS69-11",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625233621-10",
    "username": "hs.baongan69",
    "password": "123456",
    "fullName": "Nguyễn Thị Bảo Ngân",
    "email": "baongan69@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS69-12",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625233621-11",
    "username": "hs.minhnghia69",
    "password": "123456",
    "fullName": "Nguyễn Thị Minh Nghĩa",
    "email": "minhnghia69@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS69-13",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625233621-12",
    "username": "hs.vannghia69",
    "password": "123456",
    "fullName": "Trần Văn Nghĩa",
    "email": "vannghia69@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS69-14",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625233621-13",
    "username": "hs.baongoc69",
    "password": "123456",
    "fullName": "Phan Thị Bảo Ngọc",
    "email": "baongoc69@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS69-15",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625233621-14",
    "username": "hs.nhatnguyen69",
    "password": "123456",
    "fullName": "Võ Lê Nhật Nguyên",
    "email": "nhatnguyen69@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS69-16",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625233621-16",
    "username": "hs.thanhnhan69",
    "password": "123456",
    "fullName": "Nguyễn Đức Thành Nhân",
    "email": "thanhnhan69@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS69-18",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625233621-17",
    "username": "hs.yennhu69",
    "password": "123456",
    "fullName": "Lâm Yến Như",
    "email": "yennhu69@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS69-19",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625233621-18",
    "username": "hs.quynhnhu69",
    "password": "123456",
    "fullName": "Nguyễn Thị Quỳnh Như",
    "email": "quynhnhu69@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS69-20",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625233621-19",
    "username": "hs.khacphi69",
    "password": "123456",
    "fullName": "Võ Khắc Phi",
    "email": "khacphi69@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS69-21",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625233621-20",
    "username": "hs.vanphuc69",
    "password": "123456",
    "fullName": "Trần Văn Phúc",
    "email": "vanphuc69@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS69-22",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625233621-21",
    "username": "hs.huuquy69",
    "password": "123456",
    "fullName": "Lê Hữu Qúy",
    "email": "huuquy69@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS69-23",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625233621-22",
    "username": "hs.anhquynh69",
    "password": "123456",
    "fullName": "Nguyễn Phan Ánh Quỳnh",
    "email": "anhquynh69@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS69-24",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625233621-23",
    "username": "hs.tuantai69",
    "password": "123456",
    "fullName": "Hồ Quang Tuấn Tài",
    "email": "tuantai69@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS69-25",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625233621-24",
    "username": "hs.anhthu69",
    "password": "123456",
    "fullName": "Trần Thị Anh Thư",
    "email": "anhthu69@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS69-26",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625233621-25",
    "username": "hs.huyentram69",
    "password": "123456",
    "fullName": "Nguyễn Thị Huyền Trâm",
    "email": "huyentram69@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS69-27",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625233621-26",
    "username": "hs.baotran69",
    "password": "123456",
    "fullName": "Nguyễn Huỳnh Bảo Trân",
    "email": "baotran69@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS69-28",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625233621-27",
    "username": "hs.thientue69",
    "password": "123456",
    "fullName": "Đỗ Thiện Tuệ",
    "email": "thientue69@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS69-29",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625233621-28",
    "username": "hs.hongtuoi69",
    "password": "123456",
    "fullName": "Nguyễn Thị Hồng Tươi",
    "email": "hongtuoi69@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS69-30",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625233621-29",
    "username": "hs.baouyen69",
    "password": "123456",
    "fullName": "Nguyễn Thị Bảo Uyên",
    "email": "baouyen69@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS69-31",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625233621-30",
    "username": "hs.congvan69",
    "password": "123456",
    "fullName": "Đỗ Công Văn",
    "email": "congvan69@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS69-32",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625233621-31",
    "username": "hs.vanvu69",
    "password": "123456",
    "fullName": "Trương Văn Vũ",
    "email": "vanvu69@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS69-33",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625233621-32",
    "username": "hs.trucxinh69",
    "password": "123456",
    "fullName": "Đỗ Trúc Xinh",
    "email": "trucxinh69@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS69-34",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625174284-0",
    "username": "hs.anhduong68",
    "password": "123456",
    "fullName": "Nguyễn Thị Ánh Dương",
    "email": "anhduong68@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS68-02",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625174284-1",
    "username": "hs.giahao68",
    "password": "123456",
    "fullName": "Nguyễn Gia Hào",
    "email": "giahao68@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS68-03",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625174284-2",
    "username": "hs.dieuhien68",
    "password": "123456",
    "fullName": "Phan Thị Diệu Hiền",
    "email": "dieuhien68@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS68-04",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625174284-3",
    "username": "hs.quanghoi68",
    "password": "123456",
    "fullName": "Nguyễn Quang Hội",
    "email": "quanghoi68@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS68-05",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625174284-4",
    "username": "hs.nhathuy68",
    "password": "123456",
    "fullName": "Hồ Minh Nhật Huy",
    "email": "nhathuy68@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS68-06",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625174284-5",
    "username": "hs.giakhang68",
    "password": "123456",
    "fullName": "Võ Khắc Gia Khang",
    "email": "giakhang68@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS68-07",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625174284-6",
    "username": "hs.baokhanh68",
    "password": "123456",
    "fullName": "Nguyễn Hoàng Bảo Khanh",
    "email": "baokhanh68@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS68-08",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625174284-7",
    "username": "hs.ylan68",
    "password": "123456",
    "fullName": "Phan Thị Ý Lan",
    "email": "ylan68@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS68-09",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625174284-8",
    "username": "hs.hoailam68",
    "password": "123456",
    "fullName": "Nguyễn Hoài Lâm",
    "email": "hoailam68@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS68-10",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625174284-9",
    "username": "hs.duclin68",
    "password": "123456",
    "fullName": "Võ Đức Lin",
    "email": "duclin68@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS68-11",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625174284-10",
    "username": "hs.khanhlinh68",
    "password": "123456",
    "fullName": "Nguyễn Ngọc Khánh Linh",
    "email": "khanhlinh68@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS68-12",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625174284-11",
    "username": "hs.thatloc68",
    "password": "123456",
    "fullName": "Tôn Thất Lộc",
    "email": "thatloc68@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS68-13",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625174284-12",
    "username": "hs.anhminh68",
    "password": "123456",
    "fullName": "Nguyễn Ánh Minh",
    "email": "anhminh68@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS68-14",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625174284-13",
    "username": "hs.hamy68",
    "password": "123456",
    "fullName": "Nguyễn Đỗ Hà My",
    "email": "hamy68@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS68-15",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625174284-14",
    "username": "hs.baongan68",
    "password": "123456",
    "fullName": "Ngô Trần Bảo Ngân",
    "email": "baongan68@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS68-16",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625174284-15",
    "username": "hs.gianghia68",
    "password": "123456",
    "fullName": "Hồ Quang Gia Nghĩa",
    "email": "gianghia68@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS68-17",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625174284-16",
    "username": "hs.baongoc68",
    "password": "123456",
    "fullName": "Lê Thị Bảo Ngọc",
    "email": "baongoc68@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS68-18",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625174284-17",
    "username": "hs.khainguyen68",
    "password": "123456",
    "fullName": "Trần Khải Nguyên",
    "email": "khainguyen68@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS68-19",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625174284-18",
    "username": "hs.trongnhan68",
    "password": "123456",
    "fullName": "Lâm Đức Trọng Nhân",
    "email": "trongnhan68@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS68-20",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625174284-19",
    "username": "hs.yennhi68",
    "password": "123456",
    "fullName": "Đới Lê Yến Nhi",
    "email": "yennhi68@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS68-21",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625174284-20",
    "username": "hs.quynhnhu68",
    "password": "123456",
    "fullName": "Đinh Thị Quỳnh Như",
    "email": "quynhnhu68@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS68-22",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625174284-21",
    "username": "hs.luuphan68",
    "password": "123456",
    "fullName": "Phạm Lưu Phan",
    "email": "luuphan68@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS68-23",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625174284-22",
    "username": "hs.minhphi68",
    "password": "123456",
    "fullName": "Nguyễn Minh Phi",
    "email": "minhphi68@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS68-24",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625174284-23",
    "username": "hs.thienphuc68",
    "password": "123456",
    "fullName": "Nguyễn Văn Thiên Phúc",
    "email": "thienphuc68@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS68-25",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625174284-24",
    "username": "hs.thienphuoc68",
    "password": "123456",
    "fullName": "Phạm Thiên Phước",
    "email": "thienphuoc68@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS68-26",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625174284-25",
    "username": "hs.anhquan68",
    "password": "123456",
    "fullName": "Nguyễn Duy Anh Quân",
    "email": "anhquan68@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS68-27",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625174284-26",
    "username": "hs.thaotien68",
    "password": "123456",
    "fullName": "Trần Nguyễn Thảo Tiên",
    "email": "thaotien68@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS68-28",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625174284-27",
    "username": "hs.minhtien68",
    "password": "123456",
    "fullName": "Nguyễn Hoàng Minh Tiến",
    "email": "minhtien68@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS68-29",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625174284-28",
    "username": "hs.quoctoan68",
    "password": "123456",
    "fullName": "Trần Quốc Toàn",
    "email": "quoctoan68@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS68-30",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625174284-29",
    "username": "hs.baotram68",
    "password": "123456",
    "fullName": "Nguyễn Ngọc Bảo Trâm",
    "email": "baotram68@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS68-31",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625174284-30",
    "username": "hs.phuongtrinh68",
    "password": "123456",
    "fullName": "Ngô Ngọc Phương Trinh",
    "email": "phuongtrinh68@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS68-32",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625174284-31",
    "username": "hs.camtu68",
    "password": "123456",
    "fullName": "Nguyễn Hoàng Cẩm Tú",
    "email": "camtu68@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS68-33",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625174284-32",
    "username": "hs.phuonguyen68",
    "password": "123456",
    "fullName": "Lâm Nguyễn Phương Uyên",
    "email": "phuonguyen68@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS68-34",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625174284-33",
    "username": "hs.hoangvy68",
    "password": "123456",
    "fullName": "Nguyễn Hoàng Vy",
    "email": "hoangvy68@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS68-35",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625020454-0",
    "username": "hs.baoan67",
    "password": "123456",
    "fullName": "Lê Nguyễn Bảo An",
    "email": "baoan67@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS67-02",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625020454-1",
    "username": "hs.hoanganh67",
    "password": "123456",
    "fullName": "Nguyễn Văn Hoàng Anh",
    "email": "hoanganh67@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS67-03",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625020454-2",
    "username": "hs.duybao67",
    "password": "123456",
    "fullName": "Hồ Viết Duy Bảo",
    "email": "duybao67@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS67-04",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625020454-3",
    "username": "hs.giabao67",
    "password": "123456",
    "fullName": "Ngô Văn Gia Bảo",
    "email": "giabao67@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS67-05",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625020454-4",
    "username": "hs.anbinh67",
    "password": "123456",
    "fullName": "Lê Bảo An Bình",
    "email": "anbinh67@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS67-06",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625020454-5",
    "username": "hs.baochau67",
    "password": "123456",
    "fullName": "Nguyễn Ngọc Bảo Châu",
    "email": "baochau67@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS67-07",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625020454-6",
    "username": "hs.anhduong67",
    "password": "123456",
    "fullName": "Lâm Thị Ánh Dương",
    "email": "anhduong67@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS67-08",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625020454-7",
    "username": "hs.quanghao67",
    "password": "123456",
    "fullName": "Hồ Quang Hào",
    "email": "quanghao67@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS67-09",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625020454-8",
    "username": "hs.vanhau67",
    "password": "123456",
    "fullName": "Trần Văn Hậu",
    "email": "vanhau67@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS67-10",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625020454-9",
    "username": "hs.thihoa67",
    "password": "123456",
    "fullName": "Nguyễn Thị Hòa",
    "email": "thihoa67@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS67-11",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625020454-10",
    "username": "hs.quynhhuong67",
    "password": "123456",
    "fullName": "Nguyễn Thị Quỳnh Hương",
    "email": "quynhhuong67@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS67-12",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625020454-11",
    "username": "hs.vietkhai67",
    "password": "123456",
    "fullName": "Phan Viết Khải",
    "email": "vietkhai67@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS67-13",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625020454-12",
    "username": "hs.nguyenkhang67",
    "password": "123456",
    "fullName": "Nguyễn Đoàn Nguyên Khang",
    "email": "nguyenkhang67@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS67-14",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625020454-13",
    "username": "hs.vietkhiem67",
    "password": "123456",
    "fullName": "Hồ Viết Khiêm",
    "email": "vietkhiem67@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS67-15",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625020454-14",
    "username": "hs.tuankiet67",
    "password": "123456",
    "fullName": "Vi Tuấn Kiệt",
    "email": "tuankiet67@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS67-16",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625020454-15",
    "username": "hs.vanloc67",
    "password": "123456",
    "fullName": "Nguyễn Văn Lộc",
    "email": "vanloc67@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS67-17",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625020454-16",
    "username": "hs.quangminh67",
    "password": "123456",
    "fullName": "Nguyễn Văn Quang Minh",
    "email": "quangminh67@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS67-18",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625020454-17",
    "username": "hs.thaomy67",
    "password": "123456",
    "fullName": "Nguyễn Thị Thảo My",
    "email": "thaomy67@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS67-19",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625020454-18",
    "username": "hs.hoainam67",
    "password": "123456",
    "fullName": "Nguyễn Hoài Nam",
    "email": "hoainam67@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS67-20",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625020454-19",
    "username": "hs.thanhngan67",
    "password": "123456",
    "fullName": "Ngô Thanh Ngân",
    "email": "thanhngan67@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS67-21",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625020454-20",
    "username": "hs.hainguyen67",
    "password": "123456",
    "fullName": "Hồ Viết Hải Nguyên",
    "email": "hainguyen67@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS67-22",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625020454-21",
    "username": "hs.dinhnhan67",
    "password": "123456",
    "fullName": "Hồ Lê Đình Nhân",
    "email": "dinhnhan67@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS67-23",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625020454-22",
    "username": "hs.phucnhat67",
    "password": "123456",
    "fullName": "Nguyễn Trần Phúc Nhật",
    "email": "phucnhat67@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS67-24",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625020454-23",
    "username": "hs.annhien67",
    "password": "123456",
    "fullName": "Đỗ An Nhiên",
    "email": "annhien67@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS67-25",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625020454-24",
    "username": "hs.quynhnhu67",
    "password": "123456",
    "fullName": "Bạch Ngọc Quỳnh Như",
    "email": "quynhnhu67@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS67-26",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625020454-25",
    "username": "hs.daiphu67",
    "password": "123456",
    "fullName": "Võ Hữu Đại Phú",
    "email": "daiphu67@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS67-27",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625020454-26",
    "username": "hs.minhphuc67",
    "password": "123456",
    "fullName": "Ngô Văn Minh Phúc",
    "email": "minhphuc67@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS67-28",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625020454-28",
    "username": "hs.nhaphuong67",
    "password": "123456",
    "fullName": "Nguyễn Ngọc Nhã Phương",
    "email": "nhaphuong67@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS67-30",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625020454-29",
    "username": "hs.congthien67",
    "password": "123456",
    "fullName": "Đỗ Công Thiện",
    "email": "congthien67@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS67-31",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625020454-30",
    "username": "hs.ngoctram67",
    "password": "123456",
    "fullName": "Lê Trần Ngọc Trâm",
    "email": "ngoctram67@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS67-32",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625020454-31",
    "username": "hs.nhatran67",
    "password": "123456",
    "fullName": "Đỗ Thị Nhã Trân",
    "email": "nhatran67@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS67-33",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625020454-32",
    "username": "hs.nhauyen67",
    "password": "123456",
    "fullName": "Nguyễn Ngọc Nhã Uyên",
    "email": "nhauyen67@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS67-34",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625020454-33",
    "username": "hs.tuongvy67",
    "password": "123456",
    "fullName": "Nguyễn Ngọc Tường Vy",
    "email": "tuongvy67@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS67-35",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791625020454-34",
    "username": "hs.nhuy67",
    "password": "123456",
    "fullName": "Hồ Thị Như Ý",
    "email": "nhuy67@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS67-36",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791697626916-0",
    "username": "hs.linhchi88",
    "password": "123456",
    "fullName": "Nguyễn Thị Linh Chi",
    "email": "linhchi88@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS88-02",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791697626916-1",
    "username": "hs.huynhduc88",
    "password": "123456",
    "fullName": "Nguyễn Huỳnh Đức",
    "email": "huynhduc88@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS88-03",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791697626916-2",
    "username": "hs.ngochan88",
    "password": "123456",
    "fullName": "Nguyễn Thị Ngọc Hân",
    "email": "ngochan88@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS88-04",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791697626916-3",
    "username": "hs.khanhhuy88",
    "password": "123456",
    "fullName": "Nguyễn Đỗ Khánh Huy",
    "email": "khanhhuy88@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS88-05",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791697626916-4",
    "username": "hs.quochuy88",
    "password": "123456",
    "fullName": "Nguyễn Đức Quốc Huy",
    "email": "quochuy88@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS88-06",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791697626916-5",
    "username": "hs.tuankiet88",
    "password": "123456",
    "fullName": "Nguyễn Văn Tuấn Kiệt",
    "email": "tuankiet88@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS88-07",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791697626916-6",
    "username": "hs.tuankiet882",
    "password": "123456",
    "fullName": "Phạm Tuấn Kiệt",
    "email": "tuankiet882@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS88-08",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791697626916-7",
    "username": "hs.hoanglong88",
    "password": "123456",
    "fullName": "Nguyễn Văn Hoàng Long",
    "email": "hoanglong88@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS88-09",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791697626916-8",
    "username": "hs.men88",
    "password": "123456",
    "fullName": "Nguyễn Thị Mến",
    "email": "men88@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS88-10",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791697626916-9",
    "username": "hs.diemmy88",
    "password": "123456",
    "fullName": "Mai Phương Diễm My",
    "email": "diemmy88@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS88-11",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791697626916-10",
    "username": "hs.khanhngan88",
    "password": "123456",
    "fullName": "Nguyễn Thị Khánh Ngân",
    "email": "khanhngan88@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS88-12",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791697626916-11",
    "username": "hs.nhatnguyen88",
    "password": "123456",
    "fullName": "Hồ Viết Nhật Nguyên",
    "email": "nhatnguyen88@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS88-13",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791697626916-12",
    "username": "hs.thiennhan88",
    "password": "123456",
    "fullName": "Nguyễn Phúc Thiện Nhân",
    "email": "thiennhan88@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS88-14",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791697626916-13",
    "username": "hs.longnhat88",
    "password": "123456",
    "fullName": "Nguyễn Duy Long Nhật",
    "email": "longnhat88@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS88-15",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791697626916-14",
    "username": "hs.quynhnhu88",
    "password": "123456",
    "fullName": "Võ Thị Quỳnh Như",
    "email": "quynhnhu88@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS88-16",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791697626916-15",
    "username": "hs.vanphu88",
    "password": "123456",
    "fullName": "Ngô Văn Phú",
    "email": "vanphu88@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS88-17",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791697626916-16",
    "username": "hs.thuyphuong88",
    "password": "123456",
    "fullName": "Lê Thùy Phương",
    "email": "thuyphuong88@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS88-18",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791697626916-17",
    "username": "hs.khaphuong88",
    "password": "123456",
    "fullName": "Nguyễn Ngọc Khả Phương",
    "email": "khaphuong88@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS88-19",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791697626916-18",
    "username": "hs.vanquoc88",
    "password": "123456",
    "fullName": "Ngô Văn Quốc",
    "email": "vanquoc88@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS88-20",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791697626916-19",
    "username": "hs.thucquyen88",
    "password": "123456",
    "fullName": "Nguyễn Võ Thục Quyên",
    "email": "thucquyen88@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS88-21",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791697626916-20",
    "username": "hs.diemquynh88",
    "password": "123456",
    "fullName": "Võ Ngọc Diễm Quỳnh",
    "email": "diemquynh88@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS88-22",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791697626916-21",
    "username": "hs.tamthanh88",
    "password": "123456",
    "fullName": "Nguyễn Thị Tâm Thanh",
    "email": "tamthanh88@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS88-23",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791697626916-22",
    "username": "hs.anhthi88",
    "password": "123456",
    "fullName": "Huỳnh Ngọc Anh Thi",
    "email": "anhthi88@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS88-24",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791697626916-23",
    "username": "hs.thanhthien88",
    "password": "123456",
    "fullName": "Đỗ Thanh Thiện",
    "email": "thanhthien88@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS88-25",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791697626916-24",
    "username": "hs.quangthin88",
    "password": "123456",
    "fullName": "Ngô Quang Thìn",
    "email": "quangthin88@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS88-26",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791697626916-25",
    "username": "hs.minhthu88",
    "password": "123456",
    "fullName": "Nguyễn Thị Minh Thư",
    "email": "minhthu88@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS88-27",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791697626916-26",
    "username": "hs.doantrang88",
    "password": "123456",
    "fullName": "Đặng Thị Đoan Trang",
    "email": "doantrang88@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS88-28",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791697626916-27",
    "username": "hs.thanhtram88",
    "password": "123456",
    "fullName": "Hồ Thị Thanh Trâm",
    "email": "thanhtram88@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS88-29",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791697626916-28",
    "username": "hs.baotram88",
    "password": "123456",
    "fullName": "Nguyễn Ngọc Bảo Trâm",
    "email": "baotram88@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS88-30",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791697626916-29",
    "username": "hs.totrin h88",
    "password": "123456",
    "fullName": "Trần Lê Tố Trinh",
    "email": "totrinh88@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS88-31",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791697626916-30",
    "username": "hs.quangtuan88",
    "password": "123456",
    "fullName": "Nguyễn Quang Tuấn",
    "email": "quangtuan88@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS88-32",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791697626916-31",
    "username": "hs.kimtuyen88",
    "password": "123456",
    "fullName": "Đỗ Thị Kim Tuyền",
    "email": "kimtuyen88@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS88-33",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791697626916-32",
    "username": "hs.thanhvan88",
    "password": "123456",
    "fullName": "Lê Thanh Vân",
    "email": "thanhvan88@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS88-34",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791697626916-33",
    "username": "hs.khanhvy88",
    "password": "123456",
    "fullName": "Đỗ Mai Khánh Vy",
    "email": "khanhvy88@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS88-35",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791697626916-34",
    "username": "hs.nhuy88",
    "password": "123456",
    "fullName": "Nguyễn Thị Như Ý",
    "email": "nhuy88@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS88-36",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791697626916-35",
    "username": "hs.nhuy882",
    "password": "123456",
    "fullName": "Phạm Ngọc Như Ý",
    "email": "nhuy882@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS88-37",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791697889636-0",
    "username": "hs.quynhanh87",
    "password": "123456",
    "fullName": "Phạm Thị Quỳnh Anh",
    "email": "quynhanh87@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS87-02",
    "classId": "cls-8-7",
    "gradeId": "grade-8",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791697889636-1",
    "username": "hs.phuonganh87",
    "password": "123456",
    "fullName": "Trần Ngọc Phương Anh",
    "email": "phuonganh87@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS87-03",
    "classId": "cls-8-7",
    "gradeId": "grade-8",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791697889636-2",
    "username": "hs.ngocbach87",
    "password": "123456",
    "fullName": "Nguyễn Duy Ngọc Bách",
    "email": "ngocbach87@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS87-04",
    "classId": "cls-8-7",
    "gradeId": "grade-8",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791697889636-3",
    "username": "hs.quocbao87",
    "password": "123456",
    "fullName": "Nguyễn Viết Quốc Bảo",
    "email": "quocbao87@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS87-05",
    "classId": "cls-8-7",
    "gradeId": "grade-8",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791697889636-4",
    "username": "hs.quangbin87",
    "password": "123456",
    "fullName": "Hồ Trương Quang Bin",
    "email": "quangbin87@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS87-06",
    "classId": "cls-8-7",
    "gradeId": "grade-8",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791697889636-5",
    "username": "hs.thanhdat87",
    "password": "123456",
    "fullName": "Nguyễn Võ Thành Đạt",
    "email": "thanhdat87@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS87-07",
    "classId": "cls-8-7",
    "gradeId": "grade-8",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791697889636-6",
    "username": "hs.ngochan87",
    "password": "123456",
    "fullName": "Hồ Thị Ngọc Hân",
    "email": "ngochan87@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS87-08",
    "classId": "cls-8-7",
    "gradeId": "grade-8",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791697889636-7",
    "username": "hs.giahan87",
    "password": "123456",
    "fullName": "Nguyễn Hà Gia Hân",
    "email": "giahan87@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS87-09",
    "classId": "cls-8-7",
    "gradeId": "grade-8",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791697889636-8",
    "username": "hs.minhhoa87",
    "password": "123456",
    "fullName": "Đỗ Công Minh Hòa",
    "email": "minhhoa87@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS87-10",
    "classId": "cls-8-7",
    "gradeId": "grade-8",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791697889636-9",
    "username": "hs.nhathuy87",
    "password": "123456",
    "fullName": "Nguyễn Duy Nhật Huy",
    "email": "nhathuy87@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS87-11",
    "classId": "cls-8-7",
    "gradeId": "grade-8",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791697889636-10",
    "username": "hs.dangkhoa87",
    "password": "123456",
    "fullName": "Hồ Viết Đăng Khoa",
    "email": "dangkhoa87@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS87-12",
    "classId": "cls-8-7",
    "gradeId": "grade-8",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791697889636-11",
    "username": "hs.tuankiet87",
    "password": "123456",
    "fullName": "Ngô Văn Tuấn Kiệt",
    "email": "tuankiet87@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS87-13",
    "classId": "cls-8-7",
    "gradeId": "grade-8",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791697889636-12",
    "username": "hs.uyenlinh87",
    "password": "123456",
    "fullName": "Hồ Thị Uyên Linh",
    "email": "uyenlinh87@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS87-14",
    "classId": "cls-8-7",
    "gradeId": "grade-8",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791697889636-13",
    "username": "hs.tramy87",
    "password": "123456",
    "fullName": "Nguyễn Thị Trà My",
    "email": "tramy87@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS87-15",
    "classId": "cls-8-7",
    "gradeId": "grade-8",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791697889636-14",
    "username": "hs.thaomy87",
    "password": "123456",
    "fullName": "Trần Thị Thảo My",
    "email": "thaomy87@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS87-16",
    "classId": "cls-8-7",
    "gradeId": "grade-8",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791697889636-15",
    "username": "hs.baongoc87",
    "password": "123456",
    "fullName": "Phùng Nguyễn Bảo Ngọc",
    "email": "baongoc87@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS87-17",
    "classId": "cls-8-7",
    "gradeId": "grade-8",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791697889636-16",
    "username": "hs.hoangnguyen87",
    "password": "123456",
    "fullName": "Nguyễn Lê Hoàng Nguyên",
    "email": "hoangnguyen87@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS87-18",
    "classId": "cls-8-7",
    "gradeId": "grade-8",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791697889636-17",
    "username": "hs.thanhnhan87",
    "password": "123456",
    "fullName": "Ngô Thị Thanh Nhàn",
    "email": "thanhnhan87@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS87-19",
    "classId": "cls-8-7",
    "gradeId": "grade-8",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791697889636-18",
    "username": "hs.thanhnhan872",
    "password": "123456",
    "fullName": "Nguyễn Thành Nhân",
    "email": "thanhnhan872@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS87-20",
    "classId": "cls-8-7",
    "gradeId": "grade-8",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791697889636-19",
    "username": "hs.thanhnhan873",
    "password": "123456",
    "fullName": "Nguyễn Xuân Thành Nhân",
    "email": "thanhnhan873@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS87-21",
    "classId": "cls-8-7",
    "gradeId": "grade-8",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791697889636-20",
    "username": "hs.annhien87",
    "password": "123456",
    "fullName": "Đỗ An Nhiên",
    "email": "annhien87@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS87-22",
    "classId": "cls-8-7",
    "gradeId": "grade-8",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791697889636-21",
    "username": "hs.thuynhung87",
    "password": "123456",
    "fullName": "Lương Thị Thùy Nhung",
    "email": "thuynhung87@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS87-23",
    "classId": "cls-8-7",
    "gradeId": "grade-8",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791697889636-22",
    "username": "hs.khanhnhu87",
    "password": "123456",
    "fullName": "Hồ Thị Khánh Như",
    "email": "khanhnhu87@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS87-24",
    "classId": "cls-8-7",
    "gradeId": "grade-8",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791697889636-23",
    "username": "hs.quynhnhu87",
    "password": "123456",
    "fullName": "Nguyễn Thị Quỳnh Như",
    "email": "quynhnhu87@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS87-25",
    "classId": "cls-8-7",
    "gradeId": "grade-8",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791697889636-24",
    "username": "hs.vanquan87",
    "password": "123456",
    "fullName": "Lê Văn Quân",
    "email": "vanquan87@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS87-26",
    "classId": "cls-8-7",
    "gradeId": "grade-8",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791697889636-25",
    "username": "hs.minhquan87",
    "password": "123456",
    "fullName": "Nguyễn Đức Minh Quân",
    "email": "minhquan87@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS87-27",
    "classId": "cls-8-7",
    "gradeId": "grade-8",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791697889636-26",
    "username": "hs.phuongthao87",
    "password": "123456",
    "fullName": "Phạm Phương Thảo",
    "email": "phuongthao87@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS87-28",
    "classId": "cls-8-7",
    "gradeId": "grade-8",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791697889636-27",
    "username": "hs.ngocthinh87",
    "password": "123456",
    "fullName": "Nguyễn Ngọc Thịnh",
    "email": "ngocthinh87@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS87-29",
    "classId": "cls-8-7",
    "gradeId": "grade-8",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791697889636-28",
    "username": "hs.anhthu87",
    "password": "123456",
    "fullName": "Nguyễn Thị Anh Thư",
    "email": "anhthu87@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS87-30",
    "classId": "cls-8-7",
    "gradeId": "grade-8",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791697889636-29",
    "username": "hs.tutrinh87",
    "password": "123456",
    "fullName": "Lê Tú Trinh",
    "email": "tutrinh87@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS87-31",
    "classId": "cls-8-7",
    "gradeId": "grade-8",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791697889636-30",
    "username": "hs.giatrinh87",
    "password": "123456",
    "fullName": "Nguyễn Gia Trịnh",
    "email": "giatrinh87@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS87-32",
    "classId": "cls-8-7",
    "gradeId": "grade-8",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791697889636-31",
    "username": "hs.camtu87",
    "password": "123456",
    "fullName": "Lê Cẩm Tú",
    "email": "camtu87@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS87-33",
    "classId": "cls-8-7",
    "gradeId": "grade-8",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791697889636-32",
    "username": "hs.congtuan87",
    "password": "123456",
    "fullName": "Đỗ Công Tuân",
    "email": "congtuan87@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS87-34",
    "classId": "cls-8-7",
    "gradeId": "grade-8",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791697889636-33",
    "username": "hs.kimtuyen87",
    "password": "123456",
    "fullName": "Mai Thị Kim Tuyến",
    "email": "kimtuyen87@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS87-35",
    "classId": "cls-8-7",
    "gradeId": "grade-8",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791697889636-34",
    "username": "hs.khanhvan87",
    "password": "123456",
    "fullName": "Đinh Thị Khánh Vân",
    "email": "khanhvan87@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS87-36",
    "classId": "cls-8-7",
    "gradeId": "grade-8",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791697889636-35",
    "username": "hs.nhuy87",
    "password": "123456",
    "fullName": "Nguyễn Ngọc Như Ý",
    "email": "nhuy87@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS87-37",
    "classId": "cls-8-7",
    "gradeId": "grade-8",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "user-import-1791697889636-36",
    "username": "hs.nhuy872",
    "password": "123456",
    "fullName": "Nguyễn Thị Như Ý",
    "email": "nhuy872@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "HS87-38",
    "classId": "cls-8-7",
    "gradeId": "grade-8",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
  },
  {
    "id": "test-student-check-1",
    "username": "hs.check1",
    "password": "password123",
    "fullName": "Nguyen Van A",
    "email": "check1@thcs-phuho.edu.vn",
    "role": "STUDENT",
    "studentCode": "PH25-999999",
    "classId": "cls-8-7",
    "gradeId": "grade-6",
    "status": "ACTIVE",
    "schoolId": "school-phuho-01",
    "createdAt": "2026-10-11"
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
    "id": "q-1792164490623",
    "code": "TH8-A-95",
    "content": "Từ nào sau đây xuất hiện nhiều nhất cùng với từ \"tìm kiếm\", thuật ngữ được sử dụng để nói về việc tra cứu thông tin trên Internet?",
    "gradeLevel": 8,
    "topic": "Chủ đề 2: Tổ chức lưu trữ, tìm kiếm và trao đổi thông tin",
    "lessonTitle": "Bài 3: Thực hành khai thác thông tin số an toàn",
    "learningOutcome": "-Sử dụng được công cụ tìm kiếm, xử lí và trao đổi thông tin trong môi trường số. Nêu được ví dụ minh hoạ. \n-Chủ động tìm kiếm được thông tin để thực hiện nhiệm vụ (thông qua bài tập cụ thể).\n-Đánh giá được lợi ích của thông tin tìm được trong giải quyết vấn đề, nêu được ví dụ minh hoạ.\n1.1TC2a:Minh họa được nhu cầu thông tin\n1.1TC2b: Tổ chức được tìm kiếm dữ liệu, thông tin và nội dung trong môi trường số \n1.2TC2a: Thực hiện phân tích, so sánh và đánh giá được các nguồn dữ liệu thông tin và nội dung số",
    "difficulty": "BIET",
    "type": "SINGLE_CHOICE",
    "explanation": "Khi thực hiện thao tác tra cứu thông tin trên các công cụ tìm kiếm (như Google, Bing,...), người dùng cần nhập các cụm từ ngắn gọn đại diện cho nội dung cần tìm. Thuật ngữ chuyên dụng để chỉ các cụm từ này là \"từ khóa\" (keyword). Do đó, cụm từ \"từ khóa tìm kiếm\" là cụm từ phổ biến nhất khi nói về việc tra cứu thông tin trên Internet.",
    "imageDriveUrl": "",
    "authorName": "Lê Hữu Nhiệm",
    "createdBy": "user-1791601248284",
    "createdAt": "2026-10-16",
    "status": "ACTIVE",
    "options": [
      {
        "id": "opt-1-1",
        "text": "Trang web.",
        "isCorrect": false
      },
      {
        "id": "opt-1-2",
        "text": "Từ khoá.",
        "isCorrect": true
      },
      {
        "id": "opt-1-3",
        "text": "Báo cáo.",
        "isCorrect": false
      },
      {
        "id": "opt-1-4",
        "text": "Biểu mẫu.",
        "isCorrect": false
      }
    ]
  },
  {
    "id": "q-1792164402391",
    "code": "TH8-A-64",
    "content": "Trong môi trường kĩ thuật số, thông tin được thu thập và lưu trữ như thế nào?",
    "gradeLevel": 8,
    "topic": "Chủ đề 2: Tổ chức lưu trữ, tìm kiếm và trao đổi thông tin",
    "lessonTitle": "Bài 2: Thông tin trong môi trường số",
    "learningOutcome": "-Nêu được các đặc điểm của thông tin số: đa dạng, được thu thập ngày càng nhanh và nhiều, được lưu trữ với dung lượng khổng lồ bởi nhiều tổ chức và cá nhân, có tính bản quyền, có độ tin cậy rất khác nhau, có các công cụ tìm kiếm, chuyển đổi, truyền và xử lí hiệu quả.\n-Trình bày được tầm quan trọng của việc khai thác các nguồn thông tin đáng tin cậy, nêu được ví dụ minh hoạ.\n1.1TC2b: Tổ chức được tìm kiếm dữ liệu, thông tin và nội dung trong môi trường số \n1.2TC2a: Thực hiện phân tích, so sánh và đánh giá được các nguồn dữ liệu thông tin và nội dung số\n8.A1.2: Nhận diện rủi ro khi lạm dụng AI tạo sinh và sự cần thiết kiểm chứng thông tin; \n8.A2.1: Nhận biết việc AI có thể thu thập dữ liệu, theo dõi và tác động đến người dùng;",
    "difficulty": "BIET",
    "type": "SINGLE_CHOICE",
    "explanation": "Các hệ thống kĩ thuật số hiện đại có khả năng thu thập dữ liệu tự động với tốc độ cực kì nhanh chóng và hệ thống máy chủ/đám mây cho phép lưu trữ một lượng dữ liệu khổng lồ.",
    "imageDriveUrl": "",
    "authorName": "Lê Hữu Nhiệm",
    "createdBy": "user-1791601248284",
    "createdAt": "2026-10-16",
    "status": "ACTIVE",
    "options": [
      {
        "id": "opt-2-1",
        "text": "Tuy thu thập chậm nhưng lưu trữ với dung lượng lớn.",
        "isCorrect": false
      },
      {
        "id": "opt-2-2",
        "text": "Thu thập nhanh nhưng chỉ lưu trữ với dung lượng nhỏ.",
        "isCorrect": false
      },
      {
        "id": "opt-2-3",
        "text": "Thu thập chậm và được cân nhắc kĩ trước khi lưu trữ.",
        "isCorrect": false
      },
      {
        "id": "opt-2-4",
        "text": "Thu thập nhanh và lưu trữ với dung lượng lớn.",
        "isCorrect": true
      }
    ]
  },
  {
    "id": "q-1792164341815",
    "code": "TH8-A-90",
    "content": "Thông tin số có thể được truy cập như thế nào?",
    "gradeLevel": 8,
    "topic": "Chủ đề 2: Tổ chức lưu trữ, tìm kiếm và trao đổi thông tin",
    "lessonTitle": "Bài 2: Thông tin trong môi trường số",
    "learningOutcome": "-Nêu được các đặc điểm của thông tin số: đa dạng, được thu thập ngày càng nhanh và nhiều, được lưu trữ với dung lượng khổng lồ bởi nhiều tổ chức và cá nhân, có tính bản quyền, có độ tin cậy rất khác nhau, có các công cụ tìm kiếm, chuyển đổi, truyền và xử lí hiệu quả.-Trình bày được tầm quan trọng của việc khai thác các nguồn thông tin đáng tin cậy, nêu được ví dụ minh hoạ.1.1TC2b: Tổ chức được tìm kiếm dữ liệu, thông tin và nội dung trong môi trường số 1.2TC2a: Thực hiện phân tích, so sánh và đánh giá được các nguồn dữ liệu thông tin và nội dung số8.A1.2: Nhận diện rủi ro khi lạm dụng AI tạo sinh và sự cần thiết kiểm chứng thông tin; 8.A2.1: Nhận biết việc AI có thể thu thập dữ liệu, theo dõi và tác động đến người dùng;",
    "difficulty": "BIET",
    "type": "SINGLE_CHOICE",
    "explanation": "Một trong những lợi ích lớn của thông tin số là khả năng truy cập mọi lúc, mọi nơi (từ xa) thông qua internet, miễn là người dùng được cấp quyền (sự đồng ý) từ người quản lý dữ liệu đó.",
    "imageDriveUrl": "",
    "authorName": "Lê Hữu Nhiệm",
    "createdBy": "user-1791601248284",
    "createdAt": "2026-10-16",
    "status": "ACTIVE",
    "options": [
      {
        "id": "opt-3-1",
        "text": "Không thể truy cập từ xa dù được sự đồng ý của người quản lí.",
        "isCorrect": false
      },
      {
        "id": "opt-3-2",
        "text": "Có thể truy cập từ xa mà không cần sự đồng ý của người quản lí.",
        "isCorrect": false
      },
      {
        "id": "opt-3-3",
        "text": "Có thể truy cập từ xa nếu được sự đồng ý của người quản lí.",
        "isCorrect": true
      },
      {
        "id": "opt-3-4",
        "text": "Không thể truy cập từ xa nên không cần sự đồng ý của người quản lí.",
        "isCorrect": false
      }
    ]
  },
  {
    "id": "q-1792164275239",
    "code": "TH8-A-57",
    "content": "Chọn phương án nêu ba đặc điểm của thông tin số.",
    "gradeLevel": 8,
    "topic": "Chủ đề 2: Tổ chức lưu trữ, tìm kiếm và trao đổi thông tin",
    "lessonTitle": "Bài 2: Thông tin trong môi trường số",
    "learningOutcome": "-Nêu được các đặc điểm của thông tin số: đa dạng, được thu thập ngày càng nhanh và nhiều, được lưu trữ với dung lượng khổng lồ bởi nhiều tổ chức và cá nhân, có tính bản quyền, có độ tin cậy rất khác nhau, có các công cụ tìm kiếm, chuyển đổi, truyền và xử lí hiệu quả.\n-Trình bày được tầm quan trọng của việc khai thác các nguồn thông tin đáng tin cậy, nêu được ví dụ minh hoạ.\n1.1TC2b: Tổ chức được tìm kiếm dữ liệu, thông tin và nội dung trong môi trường số \n1.2TC2a: Thực hiện phân tích, so sánh và đánh giá được các nguồn dữ liệu thông tin và nội dung số\n8.A1.2: Nhận diện rủi ro khi lạm dụng AI tạo sinh và sự cần thiết kiểm chứng thông tin; \n8.A2.1: Nhận biết việc AI có thể thu thập dữ liệu, theo dõi và tác động đến người dùng;",
    "difficulty": "BIET",
    "type": "SINGLE_CHOICE",
    "explanation": "",
    "imageDriveUrl": "",
    "authorName": "Lê Hữu Nhiệm",
    "createdBy": "user-1791601248284",
    "createdAt": "2026-10-16",
    "status": "ACTIVE",
    "options": [
      {
        "id": "opt-4-1",
        "text": "Sao chép chậm, khó lan truyền, khó xoá bỏ hoàn toàn.",
        "isCorrect": false
      },
      {
        "id": "opt-4-2",
        "text": "Sao chép chậm, dễ lan truyền, dễ xoá bỏ hoàn toàn.",
        "isCorrect": false
      },
      {
        "id": "opt-4-3",
        "text": "Sao chép nhanh, dễ lan truyền, khó xoá bỏ hoàn toàn.",
        "isCorrect": true
      },
      {
        "id": "opt-4-4",
        "text": "Sao chép nhanh, khó lan truyền, dễ xoá bỏ hoàn toàn.",
        "isCorrect": false
      }
    ]
  },
  {
    "id": "q-1792163978871",
    "code": "TH8-A-56",
    "content": "Em thấy một đoạn video ngắn trên mạng có hình ảnh một MC truyền hình nổi tiếng khuyên mọi người uống một loại 'thần dược' chữa bách bệnh, nhưng phần khẩu hình miệng hơi lệch so với tiếng nói. Em nên xử lí như thế nào?",
    "gradeLevel": 8,
    "topic": "Chủ đề 2: Tổ chức lưu trữ, tìm kiếm và trao đổi thông tin",
    "lessonTitle": "Bài 2: Thông tin trong môi trường số",
    "learningOutcome": "-Nêu được các đặc điểm của thông tin số: đa dạng, được thu thập ngày càng nhanh và nhiều, được lưu trữ với dung lượng khổng lồ bởi nhiều tổ chức và cá nhân, có tính bản quyền, có độ tin cậy rất khác nhau, có các công cụ tìm kiếm, chuyển đổi, truyền và xử lí hiệu quả.\n-Trình bày được tầm quan trọng của việc khai thác các nguồn thông tin đáng tin cậy, nêu được ví dụ minh hoạ.\n1.1TC2b: Tổ chức được tìm kiếm dữ liệu, thông tin và nội dung trong môi trường số \n1.2TC2a: Thực hiện phân tích, so sánh và đánh giá được các nguồn dữ liệu thông tin và nội dung số\n8.A1.2: Nhận diện rủi ro khi lạm dụng AI tạo sinh và sự cần thiết kiểm chứng thông tin; \n8.A2.1: Nhận biết việc AI có thể thu thập dữ liệu, theo dõi và tác động đến người dùng;",
    "difficulty": "VAN_DUNG",
    "type": "SINGLE_CHOICE",
    "explanation": "",
    "imageDriveUrl": "",
    "authorName": "Quản trị viên Hệ thống",
    "createdBy": "user-1791601248284",
    "createdAt": "2026-10-16",
    "status": "ACTIVE",
    "options": [
      {
        "id": "opt-5-1",
        "text": "Mua ngay vì tin tưởng tuyệt đối vào người dẫn chương trình nổi tiếng.",
        "isCorrect": false
      },
      {
        "id": "opt-5-2",
        "text": "Chia sẻ ngay cho người thân và bạn bè để cùng mua phòng bệnh.",
        "isCorrect": false
      },
      {
        "id": "opt-5-3",
        "text": "Cảnh giác đây là sản phẩm Deepfake từ AI tạo sinh; kiểm chứng lại trên website chính thống của cơ quan y tế và đài truyền hình.",
        "isCorrect": true
      },
      {
        "id": "opt-5-4",
        "text": "Bình luận đặt hàng ngay dưới phần bình luận của video.",
        "isCorrect": false
      }
    ]
  },
  {
    "id": "q-1792163930000",
    "code": "TH8-A-73",
    "content": "Những nhược điểm của máy tính thế hệ thứ nhất là gì? (Em có thể chọn nhiều phương án.)",
    "gradeLevel": 8,
    "topic": "Chủ đề 1: Máy tính và cộng đồng",
    "lessonTitle": "Bài 1: Lược sử công cụ tính toá",
    "learningOutcome": "-Trình bày được sơ lược lịch sử phát triển máy tính.\n-Nêu được ví dụ cho thấy sự phát triển máy tính đã đem đến những thay đổi lớn lao cho xã hội loài người.\n 5.1TC1a:  Chỉ ra được các vấn đề kỹ thuật thông thường và được xác định rõ ràng khi vận hành thiết bị và sử dụng môi trường số",
    "difficulty": "BIET",
    "type": "MULTIPLE_CHOICE",
    "explanation": "",
    "imageDriveUrl": "",
    "authorName": "Quản trị viên Hệ thống",
    "createdBy": "user-1791601248284",
    "createdAt": "2026-10-16",
    "status": "ACTIVE",
    "options": [
      {
        "id": "opt-6-1",
        "text": "Chúng rất lớn.",
        "isCorrect": true
      },
      {
        "id": "opt-6-2",
        "text": "Chúng đắt tiền.",
        "isCorrect": true
      },
      {
        "id": "opt-6-3",
        "text": "Chúng tiêu hao rất nhiều điện.",
        "isCorrect": true
      },
      {
        "id": "opt-6-4",
        "text": "Chúng thường gặp trục trặc.",
        "isCorrect": false
      }
    ]
  },
  {
    "id": "q-1792163855447",
    "code": "TH8-A-89",
    "content": "Máy tính được Babbage thiết kế để làm gì?",
    "gradeLevel": 8,
    "topic": "Chủ đề 1: Máy tính và cộng đồng",
    "lessonTitle": "Bài 1: Lược sử công cụ tính toá",
    "learningOutcome": "-Trình bày được sơ lược lịch sử phát triển máy tính.\n-Nêu được ví dụ cho thấy sự phát triển máy tính đã đem đến những thay đổi lớn lao cho xã hội loài người.\n 5.1TC1a:  Chỉ ra được các vấn đề kỹ thuật thông thường và được xác định rõ ràng khi vận hành thiết bị và sử dụng môi trường số",
    "difficulty": "BIET",
    "type": "SINGLE_CHOICE",
    "explanation": "",
    "imageDriveUrl": "https://drive.google.com/file/d/1KyHksUHt6h1UC9CED7eoWS040oHsDccC/view?usp=drivesdk",
    "authorName": "Quản trị viên Hệ thống",
    "createdBy": "user-1791601248284",
    "createdAt": "2026-10-16",
    "status": "ACTIVE",
    "options": [
      {
        "id": "opt-7-1",
        "text": "Thực hiện phép cộng.",
        "isCorrect": false
      },
      {
        "id": "opt-7-2",
        "text": "Thực hiện phép cộng trừ.",
        "isCorrect": false
      },
      {
        "id": "opt-7-3",
        "text": "Thực hiện bốn phép tính số học.",
        "isCorrect": false
      },
      {
        "id": "opt-7-4",
        "text": "Có thể tính toán ngoài bốn phép tính số học.",
        "isCorrect": true
      }
    ]
  },
  {
    "id": "q-1792163715055",
    "code": "TH8-A-60",
    "content": "Hãy sắp xếp các thế hệ công cụ tính toán sau theo thứ tự thời gian:",
    "gradeLevel": 8,
    "topic": "Chủ đề 1: Máy tính và cộng đồng",
    "lessonTitle": "Bài 1: Lược sử công cụ tính toá",
    "learningOutcome": "-Trình bày được sơ lược lịch sử phát triển máy tính.\n-Nêu được ví dụ cho thấy sự phát triển máy tính đã đem đến những thay đổi lớn lao cho xã hội loài người.\n 5.1TC1a:  Chỉ ra được các vấn đề kỹ thuật thông thường và được xác định rõ ràng khi vận hành thiết bị và sử dụng môi trường số",
    "difficulty": "BIET",
    "type": "SINGLE_CHOICE",
    "explanation": "",
    "imageDriveUrl": "https://drive.google.com/file/d/1QJ2th45NBJ1wXZwkDgE7v0QZyWfB26pL/view?usp=drivesdk",
    "authorName": "Quản trị viên Hệ thống",
    "createdBy": "user-1791601248284",
    "createdAt": "2026-10-16",
    "status": "ACTIVE",
    "options": [
      {
        "id": "opt-8-1",
        "text": "a --> b --> c",
        "isCorrect": false
      },
      {
        "id": "opt-8-2",
        "text": "b --> c --> a",
        "isCorrect": false
      },
      {
        "id": "opt-8-3",
        "text": "c --> b --> a",
        "isCorrect": true
      },
      {
        "id": "opt-8-4",
        "text": "c --> a --> b",
        "isCorrect": false
      }
    ]
  },
  {
    "id": "q-1792162883576",
    "code": "TH8-A-10",
    "content": "Khi đọc được một tin đồn thất thiệt trên mạng xã hội về việc 'sắp xảy ra động đất lớn tại địa phương em', hành vi ứng xử nào sau đây là CÓ TRÁCH NHIỆM NHẤT?",
    "gradeLevel": 8,
    "topic": "Chủ đề 2: Tổ chức lưu trữ, tìm kiếm và trao đổi thông tin",
    "lessonTitle": "Bài 2: Thông tin trong môi trường số",
    "learningOutcome": "-Nêu được các đặc điểm của thông tin số: đa dạng, được thu thập ngày càng nhanh và nhiều, được lưu trữ với dung lượng khổng lồ bởi nhiều tổ chức và cá nhân, có tính bản quyền, có độ tin cậy rất khác nhau, có các công cụ tìm kiếm, chuyển đổi, truyền và xử lí hiệu quả.\n-Trình bày được tầm quan trọng của việc khai thác các nguồn thông tin đáng tin cậy, nêu được ví dụ minh hoạ.\n1.1TC2b: Tổ chức được tìm kiếm dữ liệu, thông tin và nội dung trong môi trường số \n1.2TC2a: Thực hiện phân tích, so sánh và đánh giá được các nguồn dữ liệu thông tin và nội dung số\n8.A1.2: Nhận diện rủi ro khi lạm dụng AI tạo sinh và sự cần thiết kiểm chứng thông tin; \n8.A2.1: Nhận biết việc AI có thể thu thập dữ liệu, theo dõi và tác động đến người dùng;",
    "difficulty": "VAN_DUNG",
    "type": "SINGLE_CHOICE",
    "explanation": "",
    "imageDriveUrl": "",
    "authorName": "Quản trị viên Hệ thống",
    "createdBy": "user-1791601248284",
    "createdAt": "2026-10-16",
    "status": "ACTIVE",
    "options": [
      {
        "id": "opt-9-1",
        "text": "Lập tức bấm nút Chia sẻ (Share) để mọi người cùng hoảng loạn sơ tán.",
        "isCorrect": false
      },
      {
        "id": "opt-9-2",
        "text": "Chụp màn hình rồi nhắn tin cảnh báo vào tất cả các nhóm chat người thân.",
        "isCorrect": false
      },
      {
        "id": "opt-9-3",
        "text": "Giữ bình tĩnh, đối chiếu với bản tin của Trung tâm Dự báo Khí tượng Thủy văn Quốc gia; không chia Chụp màn hình rồi nhắn tin cảnh báo vào tất cả các nhóm chat người thân.sẻ tin đồn và báo cáo vi phạm nội dung sai sự thật.",
        "isCorrect": true
      },
      {
        "id": "opt-9-4",
        "text": "Viết thêm bình luận giật gân để tăng lượt xem cho bài viết.",
        "isCorrect": false
      }
    ]
  },
  {
    "id": "q-1792162820351",
    "code": "TH8-A-48",
    "content": "Để tìm hiểu về quy định tuyển sinh vào lớp 10 THPT của địa phương, nguồn tin nào sau đây có ĐỘ TIN CẬY CAO NHẤT?",
    "gradeLevel": 8,
    "topic": "Chủ đề 2: Tổ chức lưu trữ, tìm kiếm và trao đổi thông tin",
    "lessonTitle": "Bài 2: Thông tin trong môi trường số",
    "learningOutcome": "-Nêu được các đặc điểm của thông tin số: đa dạng, được thu thập ngày càng nhanh và nhiều, được lưu trữ với dung lượng khổng lồ bởi nhiều tổ chức và cá nhân, có tính bản quyền, có độ tin cậy rất khác nhau, có các công cụ tìm kiếm, chuyển đổi, truyền và xử lí hiệu quả.\n-Trình bày được tầm quan trọng của việc khai thác các nguồn thông tin đáng tin cậy, nêu được ví dụ minh hoạ.\n1.1TC2b: Tổ chức được tìm kiếm dữ liệu, thông tin và nội dung trong môi trường số \n1.2TC2a: Thực hiện phân tích, so sánh và đánh giá được các nguồn dữ liệu thông tin và nội dung số\n8.A1.2: Nhận diện rủi ro khi lạm dụng AI tạo sinh và sự cần thiết kiểm chứng thông tin; \n8.A2.1: Nhận biết việc AI có thể thu thập dữ liệu, theo dõi và tác động đến người dùng;",
    "difficulty": "VAN_DUNG",
    "type": "SINGLE_CHOICE",
    "explanation": "",
    "imageDriveUrl": "",
    "authorName": "Quản trị viên Hệ thống",
    "createdBy": "user-1791601248284",
    "createdAt": "2026-10-16",
    "status": "ACTIVE",
    "options": [
      {
        "id": "opt-10-1",
        "text": "Bài đăng trong nhóm kín 'Hội ôn thi vào 10' trên Facebook của một tài khoản ẩn danh.",
        "isCorrect": false
      },
      {
        "id": "opt-10-2",
        "text": "Cổng thông tin điện tử chính thức của Sở Giáo dục và Đào tạo tỉnh (tên miền .edu.vn hoặc .gov.vn).",
        "isCorrect": true
      },
      {
        "id": "opt-10-3",
        "text": "Một đoạn video chia sẻ kinh nghiệm trên kênh TikTok không rõ danh tính.",
        "isCorrect": false
      },
      {
        "id": "opt-10-4",
        "text": "Tin nhắn truyền tai nhau qua nhóm chat Zalo bạn bè.",
        "isCorrect": false
      }
    ]
  },
  {
    "id": "q-1792162721697",
    "code": "TH8-A-56",
    "content": "Em thấy một đoạn video ngắn trên mạng có hình ảnh một MC truyền hình nổi tiếng khuyên mọi người uống một loại 'thần dược' chữa bách bệnh, nhưng phần khẩu hình miệng hơi lệch so với tiếng nói. Em nên xử lí như thế nào?",
    "gradeLevel": 8,
    "topic": "Chủ đề 2: Tổ chức lưu trữ, tìm kiếm và trao đổi thông tin",
    "lessonTitle": "Bài 2: Thông tin trong môi trường số",
    "learningOutcome": "-Nêu được các đặc điểm của thông tin số: đa dạng, được thu thập ngày càng nhanh và nhiều, được lưu trữ với dung lượng khổng lồ bởi nhiều tổ chức và cá nhân, có tính bản quyền, có độ tin cậy rất khác nhau, có các công cụ tìm kiếm, chuyển đổi, truyền và xử lí hiệu quả.\n-Trình bày được tầm quan trọng của việc khai thác các nguồn thông tin đáng tin cậy, nêu được ví dụ minh hoạ.\n1.1TC2b: Tổ chức được tìm kiếm dữ liệu, thông tin và nội dung trong môi trường số \n1.2TC2a: Thực hiện phân tích, so sánh và đánh giá được các nguồn dữ liệu thông tin và nội dung số\n8.A1.2: Nhận diện rủi ro khi lạm dụng AI tạo sinh và sự cần thiết kiểm chứng thông tin; \n8.A2.1: Nhận biết việc AI có thể thu thập dữ liệu, theo dõi và tác động đến người dùng;",
    "difficulty": "VAN_DUNG",
    "type": "SINGLE_CHOICE",
    "explanation": "",
    "imageDriveUrl": "",
    "authorName": "Quản trị viên Hệ thống",
    "createdBy": "user-1791601248284",
    "createdAt": "2026-10-16",
    "status": "ACTIVE",
    "options": [
      {
        "id": "opt-11-1",
        "text": "Mua ngay vì tin tưởng tuyệt đối vào người dẫn chương trình nổi tiếng.",
        "isCorrect": false
      },
      {
        "id": "opt-11-2",
        "text": "Chia sẻ ngay cho người thân và bạn bè để cùng mua phòng bệnh.",
        "isCorrect": false
      },
      {
        "id": "opt-11-3",
        "text": "Cảnh giác đây là sản phẩm Deepfake từ AI tạo sinh; kiểm chứng lại trên website chính thống của cơ quan y tế và đài truyền hình.",
        "isCorrect": true
      },
      {
        "id": "opt-11-4",
        "text": "Bình luận đặt hàng ngay dưới phần bình luận của video.",
        "isCorrect": false
      }
    ]
  },
  {
    "id": "q-1792162658120",
    "code": "TH8-A-38",
    "content": "Khi người dùng thường xuyên xem và tìm kiếm các video nấu ăn trên mạng xã hội, thuật toán AI của nền tảng sẽ liên tục gợi ý các nội dung về ẩm thực. Hiện tượng này thể hiện điều gì?",
    "gradeLevel": 8,
    "topic": "Chủ đề 2: Tổ chức lưu trữ, tìm kiếm và trao đổi thông tin",
    "lessonTitle": "Bài 2: Thông tin trong môi trường số",
    "learningOutcome": "-Nêu được các đặc điểm của thông tin số: đa dạng, được thu thập ngày càng nhanh và nhiều, được lưu trữ với dung lượng khổng lồ bởi nhiều tổ chức và cá nhân, có tính bản quyền, có độ tin cậy rất khác nhau, có các công cụ tìm kiếm, chuyển đổi, truyền và xử lí hiệu quả.\n-Trình bày được tầm quan trọng của việc khai thác các nguồn thông tin đáng tin cậy, nêu được ví dụ minh hoạ.\n1.1TC2b: Tổ chức được tìm kiếm dữ liệu, thông tin và nội dung trong môi trường số \n1.2TC2a: Thực hiện phân tích, so sánh và đánh giá được các nguồn dữ liệu thông tin và nội dung số\n8.A1.2: Nhận diện rủi ro khi lạm dụng AI tạo sinh và sự cần thiết kiểm chứng thông tin; \n8.A2.1: Nhận biết việc AI có thể thu thập dữ liệu, theo dõi và tác động đến người dùng;",
    "difficulty": "HIEU",
    "type": "SINGLE_CHOICE",
    "explanation": "",
    "imageDriveUrl": "",
    "authorName": "Quản trị viên Hệ thống",
    "createdBy": "user-1791601248284",
    "createdAt": "2026-10-16",
    "status": "ACTIVE",
    "options": [
      {
        "id": "opt-12-1",
        "text": "Ứng dụng bị lỗi kĩ thuật hiển thị ngẫu nhiên.",
        "isCorrect": false
      },
      {
        "id": "opt-12-2",
        "text": "AI có khả năng tự động thu thập dữ liệu hành vi người dùng để phân tích và đề xuất nội dung cá nhân hóa.",
        "isCorrect": true
      },
      {
        "id": "opt-12-3",
        "text": "Thiết bị máy tính tự sinh ra các món ăn mới.",
        "isCorrect": false
      },
      {
        "id": "opt-12-4",
        "text": "Người khác đang điều khiển máy tính của bạn từ xa.",
        "isCorrect": false
      }
    ]
  },
  {
    "id": "q-1792162599521",
    "code": "TH8-A-88",
    "content": "Phát biểu nào sau đây là một 'SỰ KIỆN', không phải là 'Ý KIẾN' cá nhân?",
    "gradeLevel": 8,
    "topic": "Chủ đề 2: Tổ chức lưu trữ, tìm kiếm và trao đổi thông tin",
    "lessonTitle": "Bài 2: Thông tin trong môi trường số",
    "learningOutcome": "-Nêu được các đặc điểm của thông tin số: đa dạng, được thu thập ngày càng nhanh và nhiều, được lưu trữ với dung lượng khổng lồ bởi nhiều tổ chức và cá nhân, có tính bản quyền, có độ tin cậy rất khác nhau, có các công cụ tìm kiếm, chuyển đổi, truyền và xử lí hiệu quả.\n-Trình bày được tầm quan trọng của việc khai thác các nguồn thông tin đáng tin cậy, nêu được ví dụ minh hoạ.\n1.1TC2b: Tổ chức được tìm kiếm dữ liệu, thông tin và nội dung trong môi trường số \n1.2TC2a: Thực hiện phân tích, so sánh và đánh giá được các nguồn dữ liệu thông tin và nội dung số\n8.A1.2: Nhận diện rủi ro khi lạm dụng AI tạo sinh và sự cần thiết kiểm chứng thông tin; \n8.A2.1: Nhận biết việc AI có thể thu thập dữ liệu, theo dõi và tác động đến người dùng;",
    "difficulty": "HIEU",
    "type": "SINGLE_CHOICE",
    "explanation": "",
    "imageDriveUrl": "",
    "authorName": "Quản trị viên Hệ thống",
    "createdBy": "user-1791601248284",
    "createdAt": "2026-10-16",
    "status": "ACTIVE",
    "options": [
      {
        "id": "opt-13-1",
        "text": "'Tôi nghĩ đây là chiếc điện thoại thông minh đẹp nhất từ trước tới nay.'",
        "isCorrect": false
      },
      {
        "id": "opt-13-2",
        "text": "'Hình như hôm nay trời sẽ mưa to vào buổi chiều.'",
        "isCorrect": false
      },
      {
        "id": "opt-13-3",
        "text": "'Trường THCS Phú Hồ được thành lập theo quyết định của cơ quan nhà nước có thẩm quyền.'",
        "isCorrect": true
      },
      {
        "id": "opt-13-4",
        "text": "'Môn Tin học là môn học thú vị nhất trong tất cả các môn.'",
        "isCorrect": false
      }
    ]
  },
  {
    "id": "q-1792162528112",
    "code": "TH8-A-35",
    "content": "Trong thiết kế bài trình chiếu chuyên nghiệp, quy tắc bố cục văn bản trên mỗi trang slide nội dung thường được khuyến nghị là gì?",
    "gradeLevel": 8,
    "topic": "Chủ đề 2: Tổ chức lưu trữ, tìm kiếm và trao đổi thông tin",
    "lessonTitle": "Bài 3: Thực hành khai thác thông tin số an toàn",
    "learningOutcome": "-Sử dụng được công cụ tìm kiếm, xử lí và trao đổi thông tin trong môi trường số. Nêu được ví dụ minh hoạ. \n-Chủ động tìm kiếm được thông tin để thực hiện nhiệm vụ (thông qua bài tập cụ thể).\n-Đánh giá được lợi ích của thông tin tìm được trong giải quyết vấn đề, nêu được ví dụ minh hoạ.\n1.1TC2a:Minh họa được nhu cầu thông tin\n1.1TC2b: Tổ chức được tìm kiếm dữ liệu, thông tin và nội dung trong môi trường số \n1.2TC2a: Thực hiện phân tích, so sánh và đánh giá được các nguồn dữ liệu thông tin và nội dung số",
    "difficulty": "HIEU",
    "type": "SINGLE_CHOICE",
    "explanation": "",
    "imageDriveUrl": "",
    "authorName": "Quản trị viên Hệ thống",
    "createdBy": "user-1791601248284",
    "createdAt": "2026-10-16",
    "status": "ACTIVE",
    "options": [
      {
        "id": "opt-14-1",
        "text": "Mỗi trang không quá 10 mục, mỗi mục không quá 5 dòng.",
        "isCorrect": false
      },
      {
        "id": "opt-14-2",
        "text": "Mỗi trang không quá 6 mục, mỗi mục không quá 2 dòng.",
        "isCorrect": true
      },
      {
        "id": "opt-14-3",
        "text": "Càng nhiều chữ càng tốt để người xem đọc chi tiết.",
        "isCorrect": false
      },
      {
        "id": "opt-14-4",
        "text": "Mỗi trang chỉ nên có duy nhất 1 dòng văn bản.",
        "isCorrect": false
      }
    ]
  },
  {
    "id": "q-1792162467280",
    "code": "TH8-A-87",
    "content": "Linh kiện điện tử chính được sử dụng trong máy tính điện tử Thế hệ thứ nhất (1945 - 1955) là gì?",
    "gradeLevel": 8,
    "topic": "Chủ đề 1: Máy tính và cộng đồng",
    "lessonTitle": "Bài 1: Thông tin và dữ liệu",
    "learningOutcome": "Chuẩn kiến thức GDPT 2018",
    "difficulty": "BIET",
    "type": "SINGLE_CHOICE",
    "explanation": "",
    "imageDriveUrl": "",
    "authorName": "Quản trị viên Hệ thống",
    "createdBy": "user-1791601248284",
    "createdAt": "2026-10-10",
    "status": "ACTIVE",
    "options": [
      {
        "id": "opt-15-1",
        "text": "Bóng bán dẫn.",
        "isCorrect": false
      },
      {
        "id": "opt-15-2",
        "text": "Đèn điện tử chân không.",
        "isCorrect": true
      },
      {
        "id": "opt-15-3",
        "text": "Mạch tích hợp (IC).",
        "isCorrect": false
      },
      {
        "id": "opt-15-4",
        "text": "Bộ vi xử lý (VLSI).",
        "isCorrect": false
      }
    ]
  },
  {
    "id": "q-1792162398481",
    "code": "TH8-A-94",
    "content": "Quyền tác giả của thông tin số trong môi trường số:",
    "gradeLevel": 8,
    "topic": "Chủ đề 2: Tổ chức lưu trữ, tìm kiếm và trao đổi thông tin",
    "lessonTitle": "Bài 2: Thông tin trong môi trường số",
    "learningOutcome": "-Nêu được các đặc điểm của thông tin số: đa dạng, được thu thập ngày càng nhanh và nhiều, được lưu trữ với dung lượng khổng lồ bởi nhiều tổ chức và cá nhân, có tính bản quyền, có độ tin cậy rất khác nhau, có các công cụ tìm kiếm, chuyển đổi, truyền và xử lí hiệu quả.\n-Trình bày được tầm quan trọng của việc khai thác các nguồn thông tin đáng tin cậy, nêu được ví dụ minh hoạ.\n1.1TC2b: Tổ chức được tìm kiếm dữ liệu, thông tin và nội dung trong môi trường số \n1.2TC2a: Thực hiện phân tích, so sánh và đánh giá được các nguồn dữ liệu thông tin và nội dung số\n8.A1.2: Nhận diện rủi ro khi lạm dụng AI tạo sinh và sự cần thiết kiểm chứng thông tin; \n8.A2.1: Nhận biết việc AI có thể thu thập dữ liệu, theo dõi và tác động đến người dùng;",
    "difficulty": "BIET",
    "type": "SINGLE_CHOICE",
    "explanation": "",
    "imageDriveUrl": "",
    "authorName": "Quản trị viên Hệ thống",
    "createdBy": "user-1791601248284",
    "createdAt": "2026-10-16",
    "status": "ACTIVE",
    "options": [
      {
        "id": "opt-16-1",
        "text": "Không cần bảo hộ vì ai cũng tải được trên mạng.",
        "isCorrect": false
      },
      {
        "id": "opt-16-2",
        "text": "Chỉ được bảo hộ nếu tác giả là người nổi tiếng.",
        "isCorrect": false
      },
      {
        "id": "opt-16-3",
        "text": "Được pháp luật bảo hộ theo luật sở hữu trí tuệ.",
        "isCorrect": true
      },
      {
        "id": "opt-16-4",
        "text": "Tự do sao chép và đổi tên tác giả tùy ý.",
        "isCorrect": false
      }
    ]
  },
  {
    "id": "q-1792162318912",
    "code": "TH8-A-18",
    "content": "Đặc điểm nào sau đây KHÔNG PHẢI là đặc điểm của thông tin số?",
    "gradeLevel": 8,
    "topic": "Chủ đề 2: Tổ chức lưu trữ, tìm kiếm và trao đổi thông tin",
    "lessonTitle": "Bài 2: Thông tin trong môi trường số",
    "learningOutcome": "-Nêu được các đặc điểm của thông tin số: đa dạng, được thu thập ngày càng nhanh và nhiều, được lưu trữ với dung lượng khổng lồ bởi nhiều tổ chức và cá nhân, có tính bản quyền, có độ tin cậy rất khác nhau, có các công cụ tìm kiếm, chuyển đổi, truyền và xử lí hiệu quả.\n-Trình bày được tầm quan trọng của việc khai thác các nguồn thông tin đáng tin cậy, nêu được ví dụ minh hoạ.\n1.1TC2b: Tổ chức được tìm kiếm dữ liệu, thông tin và nội dung trong môi trường số \n1.2TC2a: Thực hiện phân tích, so sánh và đánh giá được các nguồn dữ liệu thông tin và nội dung số\n8.A1.2: Nhận diện rủi ro khi lạm dụng AI tạo sinh và sự cần thiết kiểm chứng thông tin; \n8.A2.1: Nhận biết việc AI có thể thu thập dữ liệu, theo dõi và tác động đến người dùng;",
    "difficulty": "BIET",
    "type": "SINGLE_CHOICE",
    "explanation": "",
    "imageDriveUrl": "",
    "authorName": "Quản trị viên Hệ thống",
    "createdBy": "user-1791601248284",
    "createdAt": "2026-10-16",
    "status": "ACTIVE",
    "options": [
      {
        "id": "opt-17-1",
        "text": "Dễ dàng nhân bản và lan truyền.",
        "isCorrect": false
      },
      {
        "id": "opt-17-2",
        "text": "Rất dễ dàng bị xóa bỏ hoàn toàn khỏi mọi thiết bị và máy chủ.",
        "isCorrect": true
      },
      {
        "id": "opt-17-3",
        "text": "Có thể truy cập từ xa nếu được cấp quyền.",
        "isCorrect": false
      },
      {
        "id": "opt-17-4",
        "text": "Được lưu trữ với dung lượng khổng lồ bởi nhiều tổ chức và cá nhân.",
        "isCorrect": false
      }
    ]
  },
  {
    "id": "q-1792162253224",
    "code": "TH8-A-16",
    "content": "Thông tin số là gì?",
    "gradeLevel": 8,
    "topic": "Chủ đề 2: Tổ chức lưu trữ, tìm kiếm và trao đổi thông tin",
    "lessonTitle": "Bài 2: Thông tin trong môi trường số",
    "learningOutcome": "-Nêu được các đặc điểm của thông tin số: đa dạng, được thu thập ngày càng nhanh và nhiều, được lưu trữ với dung lượng khổng lồ bởi nhiều tổ chức và cá nhân, có tính bản quyền, có độ tin cậy rất khác nhau, có các công cụ tìm kiếm, chuyển đổi, truyền và xử lí hiệu quả.\n-Trình bày được tầm quan trọng của việc khai thác các nguồn thông tin đáng tin cậy, nêu được ví dụ minh hoạ.\n1.1TC2b: Tổ chức được tìm kiếm dữ liệu, thông tin và nội dung trong môi trường số \n1.2TC2a: Thực hiện phân tích, so sánh và đánh giá được các nguồn dữ liệu thông tin và nội dung số\n8.A1.2: Nhận diện rủi ro khi lạm dụng AI tạo sinh và sự cần thiết kiểm chứng thông tin; \n8.A2.1: Nhận biết việc AI có thể thu thập dữ liệu, theo dõi và tác động đến người dùng;",
    "difficulty": "BIET",
    "type": "SINGLE_CHOICE",
    "explanation": "",
    "imageDriveUrl": "",
    "authorName": "Quản trị viên Hệ thống",
    "createdBy": "user-1791601248284",
    "createdAt": "2026-10-16",
    "status": "ACTIVE",
    "options": [
      {
        "id": "opt-18-1",
        "text": "Thông tin chỉ được in trên sách báo truyền thống.",
        "isCorrect": false
      },
      {
        "id": "opt-18-2",
        "text": "Thông tin được mã hoá thành dãy bit để lan truyền, trao đổi trong môi trường kỹ thuật số.",
        "isCorrect": true
      },
      {
        "id": "opt-18-3",
        "text": "Tất cả mọi thông tin được con người nói miệng với nhau.",
        "isCorrect": false
      },
      {
        "id": "opt-18-4",
        "text": "Thông tin chỉ xuất hiện trên mạng xã hội Facebook.",
        "isCorrect": false
      }
    ]
  },
  {
    "id": "q-1792162150168",
    "code": "TH8-A-80",
    "content": "Trong quá trình sử dụng phần mềm tạo bài trình chiếu để báo cáo kết quả học tập, một nhóm học sinh đưa ra các quy tắc thiết kế slide như sau. Hãy xác định mỗi quy tắc đó là Đúng hay Sai:",
    "gradeLevel": 8,
    "topic": "Chủ đề 2: Tổ chức lưu trữ, tìm kiếm và trao đổi thông tin",
    "lessonTitle": "Bài 3: Thực hành khai thác thông tin số an toàn",
    "learningOutcome": "-Sử dụng được công cụ tìm kiếm, xử lí và trao đổi thông tin trong môi trường số. Nêu được ví dụ minh hoạ. \n-Chủ động tìm kiếm được thông tin để thực hiện nhiệm vụ (thông qua bài tập cụ thể).\n-Đánh giá được lợi ích của thông tin tìm được trong giải quyết vấn đề, nêu được ví dụ minh hoạ.\n1.1TC2a:Minh họa được nhu cầu thông tin\n1.1TC2b: Tổ chức được tìm kiếm dữ liệu, thông tin và nội dung trong môi trường số \n1.2TC2a: Thực hiện phân tích, so sánh và đánh giá được các nguồn dữ liệu thông tin và nội dung số",
    "difficulty": "VAN_DUNG",
    "type": "TRUE_FALSE",
    "explanation": "",
    "imageDriveUrl": "",
    "authorName": "Quản trị viên Hệ thống",
    "createdBy": "user-1791601248284",
    "createdAt": "2026-10-16",
    "status": "ACTIVE",
    "trueFalseStatements": [
      {
        "id": "tf-19-1",
        "statement": "[x]",
        "isCorrect": true
      },
      {
        "id": "tf-19-2",
        "statement": "[ ]",
        "isCorrect": false
      },
      {
        "id": "tf-19-3",
        "statement": "[ ]",
        "isCorrect": false
      },
      {
        "id": "tf-19-4",
        "statement": "[ ]",
        "isCorrect": false
      }
    ]
  },
  {
    "id": "q-1792162078353",
    "code": "TH8-A-67",
    "content": "Nam đang sử dụng một công cụ Trí tuệ nhân tạo (AI Chatbot) để hỗ trợ chuẩn bị cho bài thuyết trình môn Tin học. Em hãy xác định các hành động/nhận định sau đây của Nam là Đúng hay Sai:",
    "gradeLevel": 8,
    "topic": "Chủ đề 2: Tổ chức lưu trữ, tìm kiếm và trao đổi thông tin",
    "lessonTitle": "Bài 3: Thực hành khai thác thông tin số an toàn",
    "learningOutcome": "-Sử dụng được công cụ tìm kiếm, xử lí và trao đổi thông tin trong môi trường số. Nêu được ví dụ minh hoạ. \n-Chủ động tìm kiếm được thông tin để thực hiện nhiệm vụ (thông qua bài tập cụ thể).\n-Đánh giá được lợi ích của thông tin tìm được trong giải quyết vấn đề, nêu được ví dụ minh hoạ.\n1.1TC2a:Minh họa được nhu cầu thông tin\n1.1TC2b: Tổ chức được tìm kiếm dữ liệu, thông tin và nội dung trong môi trường số \n1.2TC2a: Thực hiện phân tích, so sánh và đánh giá được các nguồn dữ liệu thông tin và nội dung số",
    "difficulty": "VAN_DUNG",
    "type": "TRUE_FALSE",
    "explanation": "",
    "imageDriveUrl": "",
    "authorName": "Quản trị viên Hệ thống",
    "createdBy": "user-1791601248284",
    "createdAt": "2026-10-16",
    "status": "ACTIVE",
    "trueFalseStatements": [
      {
        "id": "tf-20-1",
        "statement": "[x]",
        "isCorrect": true
      },
      {
        "id": "tf-20-2",
        "statement": "[ ]",
        "isCorrect": false
      },
      {
        "id": "tf-20-3",
        "statement": "[ ]",
        "isCorrect": false
      },
      {
        "id": "tf-20-4",
        "statement": "[ ]",
        "isCorrect": false
      }
    ]
  },
  {
    "id": "q-1792161830410",
    "code": "TH8-A-69",
    "content": "Khi tìm thấy hai bài viết trái ngược nhau về tác động môi trường của một dự án điện mặt trời (một bài khen ngợi trên trang web của công ty bán pin năng lượng mặt trời, một bài phân tích trên cổng thông tin của Bộ Tài nguyên và Môi trường), em nên xử lý như thế nào?",
    "gradeLevel": 8,
    "topic": "Chủ đề 2: Tổ chức lưu trữ, tìm kiếm và trao đổi thông tin",
    "lessonTitle": "Bài 3: Thực hành khai thác thông tin số an toàn",
    "learningOutcome": "-Sử dụng được công cụ tìm kiếm, xử lí và trao đổi thông tin trong môi trường số. Nêu được ví dụ minh hoạ. \n-Chủ động tìm kiếm được thông tin để thực hiện nhiệm vụ (thông qua bài tập cụ thể).\n-Đánh giá được lợi ích của thông tin tìm được trong giải quyết vấn đề, nêu được ví dụ minh hoạ.\n1.1TC2a:Minh họa được nhu cầu thông tin\n1.1TC2b: Tổ chức được tìm kiếm dữ liệu, thông tin và nội dung trong môi trường số \n1.2TC2a: Thực hiện phân tích, so sánh và đánh giá được các nguồn dữ liệu thông tin và nội dung số",
    "difficulty": "VAN_DUNG",
    "type": "SINGLE_CHOICE",
    "explanation": "Vận dụng NLS",
    "imageDriveUrl": "",
    "authorName": "Quản trị viên Hệ thống",
    "createdBy": "user-1791601248284",
    "createdAt": "2026-10-16",
    "status": "ACTIVE",
    "options": [
      {
        "id": "opt-21-1",
        "text": "Tin tưởng hoàn toàn vào công ty bán pin vì họ am hiểu sản phẩm nhất.",
        "isCorrect": false
      },
      {
        "id": "opt-21-2",
        "text": "Ưu tiên phân tích dữ liệu từ cơ quan nhà nước và đối chiếu thêm các công trình nghiên cứu độc lập để có góc nhìn khách quan.",
        "isCorrect": true
      },
      {
        "id": "opt-21-3",
        "text": "Chọn thông tin nào viết ngắn hơn để đưa vào bài thuyết trình.",
        "isCorrect": false
      },
      {
        "id": "opt-21-4",
        "text": "Bỏ qua cả hai nguồn và tự bịa ra số liệu theo ý mình.",
        "isCorrect": false
      }
    ]
  },
  {
    "id": "q-1792161631810",
    "code": "TH8-A-69",
    "content": "Khi tìm thấy hai bài viết trái ngược nhau về tác động môi trường của một dự án điện mặt trời (một bài khen ngợi trên trang web của công ty bán pin năng lượng mặt trời, một bài phân tích trên cổng thông tin của Bộ Tài nguyên và Môi trường), em nên xử lý như thế nào?",
    "gradeLevel": 8,
    "topic": "Chủ đề 2: Tổ chức lưu trữ, tìm kiếm và trao đổi thông tin",
    "lessonTitle": "Bài 3: Thực hành khai thác thông tin số an toàn",
    "learningOutcome": "-Sử dụng được công cụ tìm kiếm, xử lí và trao đổi thông tin trong môi trường số. Nêu được ví dụ minh hoạ. \n-Chủ động tìm kiếm được thông tin để thực hiện nhiệm vụ (thông qua bài tập cụ thể).\n-Đánh giá được lợi ích của thông tin tìm được trong giải quyết vấn đề, nêu được ví dụ minh hoạ.\n1.1TC2a:Minh họa được nhu cầu thông tin\n1.1TC2b: Tổ chức được tìm kiếm dữ liệu, thông tin và nội dung trong môi trường số \n1.2TC2a: Thực hiện phân tích, so sánh và đánh giá được các nguồn dữ liệu thông tin và nội dung số",
    "difficulty": "VAN_DUNG",
    "type": "SINGLE_CHOICE",
    "explanation": "Vận dụng NLS",
    "imageDriveUrl": "",
    "authorName": "Quản trị viên Hệ thống",
    "createdBy": "user-1791601248284",
    "createdAt": "2026-10-16",
    "status": "ACTIVE",
    "options": [
      {
        "id": "opt-22-1",
        "text": "Tin tưởng hoàn toàn vào công ty bán pin vì họ am hiểu sản phẩm nhất.",
        "isCorrect": false
      },
      {
        "id": "opt-22-2",
        "text": "Ưu tiên phân tích dữ liệu từ cơ quan nhà nước và đối chiếu thêm các công trình nghiên cứu độc lập để có góc nhìn khách quan.",
        "isCorrect": true
      },
      {
        "id": "opt-22-3",
        "text": "Chọn thông tin nào viết ngắn hơn để đưa vào bài thuyết trình.",
        "isCorrect": false
      },
      {
        "id": "opt-22-4",
        "text": "Bỏ qua cả hai nguồn và tự bịa ra số liệu theo ý mình.",
        "isCorrect": false
      }
    ]
  },
  {
    "id": "q-1792161550218",
    "code": "TH8-A-22",
    "content": "Khi thực hiện tìm kiếm thông tin về chủ đề \"Ưu điểm của năng lượng điện gió\", cách lựa chọn từ khóa nào dưới đây sẽ đem lại kết quả chính xác và thu hẹp tốt nhất?",
    "gradeLevel": 8,
    "topic": "Chủ đề 2: Tổ chức lưu trữ, tìm kiếm và trao đổi thông tin",
    "lessonTitle": "Bài 3: Thực hành khai thác thông tin số an toàn",
    "learningOutcome": "-Sử dụng được công cụ tìm kiếm, xử lí và trao đổi thông tin trong môi trường số. Nêu được ví dụ minh hoạ. \n-Chủ động tìm kiếm được thông tin để thực hiện nhiệm vụ (thông qua bài tập cụ thể).\n-Đánh giá được lợi ích của thông tin tìm được trong giải quyết vấn đề, nêu được ví dụ minh hoạ.\n1.1TC2a:Minh họa được nhu cầu thông tin\n1.1TC2b: Tổ chức được tìm kiếm dữ liệu, thông tin và nội dung trong môi trường số \n1.2TC2a: Thực hiện phân tích, so sánh và đánh giá được các nguồn dữ liệu thông tin và nội dung số",
    "difficulty": "HIEU",
    "type": "SINGLE_CHOICE",
    "explanation": "",
    "imageDriveUrl": "",
    "authorName": "Quản trị viên Hệ thống",
    "createdBy": "user-1791601248284",
    "createdAt": "2026-10-16",
    "status": "ACTIVE",
    "options": [
      {
        "id": "opt-23-1",
        "text": "Năng lượng",
        "isCorrect": false
      },
      {
        "id": "opt-23-2",
        "text": "Gió",
        "isCorrect": false
      },
      {
        "id": "opt-23-3",
        "text": "\"ưu điểm của điện gió\" hoặc \"ưu nhược điểm năng lượng gió\"",
        "isCorrect": true
      },
      {
        "id": "opt-23-4",
        "text": "Làm sao để sản xuất ra điện từ gió vậy Google ơi",
        "isCorrect": false
      }
    ]
  },
  {
    "id": "q-1791695752220",
    "code": "TH8-A-99",
    "content": "Theo nguyên lý hoạt động của John Von Neumann, cấu trúc cơ bản của máy tính bao gồm mấy khối chức năng chính?",
    "gradeLevel": 8,
    "topic": "Chủ đề 1: Máy tính và cộng đồng",
    "lessonTitle": "Bài 1: Lịch sử phát triển của máy tính",
    "learningOutcome": "Nêu được các thế hệ máy tính điện tử",
    "difficulty": "BIET",
    "type": "SINGLE_CHOICE",
    "explanation": "",
    "imageDriveUrl": "https://drive.google.com/file/d/1Eqz8noqc7cKDaztAo-YY7Zd8HKKSj4Hp/view?usp=drivesdk",
    "authorName": "Quản trị viên Hệ thống",
    "createdBy": "user-1791601248284",
    "createdAt": "2026-10-11",
    "status": "ACTIVE",
    "options": [
      {
        "id": "opt-24-1",
        "text": "2 khối: Màn hình và Thân máy.",
        "isCorrect": false
      },
      {
        "id": "opt-24-2",
        "text": "3 khối: Chuột, Bàn phím và CPU.",
        "isCorrect": false
      },
      {
        "id": "opt-24-3",
        "text": "4 khối: Bộ xử lí, Bộ nhớ, Thiết bị vào, Thiết bị ra.",
        "isCorrect": true
      },
      {
        "id": "opt-24-4",
        "text": "5 khối: Bộ số học, Bộ logic, Màn hình, Loa, Ổ cứng.",
        "isCorrect": false
      }
    ]
  },
  {
    "id": "q-1791600768847",
    "code": "TH8-A-87",
    "content": "Linh kiện điện tử chính được sử dụng trong máy tính điện tử Thế hệ thứ nhất (1945 - 1955) là gì?",
    "gradeLevel": 8,
    "topic": "Chủ đề 1: Máy tính và cộng đồng",
    "lessonTitle": "Bài 1: Thông tin và dữ liệu",
    "learningOutcome": "Chuẩn kiến thức GDPT 2018",
    "difficulty": "BIET",
    "type": "SINGLE_CHOICE",
    "explanation": "",
    "imageDriveUrl": "",
    "authorName": "Quản trị viên Hệ thống",
    "createdBy": "user-1791601248284",
    "createdAt": "2026-10-10",
    "status": "ACTIVE",
    "options": [
      {
        "id": "opt-25-1",
        "text": "Bóng bán dẫn.",
        "isCorrect": false
      },
      {
        "id": "opt-25-2",
        "text": "Đèn điện tử chân không.",
        "isCorrect": true
      },
      {
        "id": "opt-25-3",
        "text": "Mạch tích hợp (IC).",
        "isCorrect": false
      },
      {
        "id": "opt-25-4",
        "text": "Bộ vi xử lý (VLSI).",
        "isCorrect": false
      }
    ]
  },
  {
    "id": "q-1791600285461",
    "code": "TH6-A-36",
    "content": "Chiếc máy tính cơ học đầu tiên có tên gọi là gì và do ai sáng chế?",
    "gradeLevel": 6,
    "topic": "Chủ đề 1: Máy tính và cộng đồng",
    "lessonTitle": "Bài 1: Thông tin và dữ liệu",
    "learningOutcome": "Chuẩn kiến thức GDPT 2018",
    "difficulty": "BIET",
    "type": "SINGLE_CHOICE",
    "explanation": "",
    "imageDriveUrl": "https://drive.google.com/file/d/1gTPTnKddnVGc7nmUS4bRMojNdWW6IayF/view?usp=drive_link",
    "authorName": "Đinh Như Dậu",
    "createdBy": "user-1791601248284",
    "createdAt": "2026-10-10",
    "status": "ACTIVE",
    "options": [
      {
        "id": "opt-26-1",
        "text": "Harvard Mark I do Howard Aiken chế tạo.",
        "isCorrect": false
      },
      {
        "id": "opt-26-2",
        "text": "Pascaline do nhà bác học Blaise Pascal sáng chế năm 1642.",
        "isCorrect": true
      },
      {
        "id": "opt-26-3",
        "text": "ENIAC do John Mauchly và J. Presper Eckert phát minh.",
        "isCorrect": false
      },
      {
        "id": "opt-26-4",
        "text": "Bàn tính hạt gảy do người Lưỡng Hà cổ đại làm ra.",
        "isCorrect": false
      }
    ]
  },
  {
    "id": "q-1791515890351",
    "code": "TH8-A-02",
    "content": "Ai là người được xem là 'cha đẻ của công nghệ máy tính' nhờ ý tưởng thiết kế máy tính đa năng tự động năm 1833?",
    "gradeLevel": 8,
    "topic": "Chủ đề 1: Máy tính và cộng đồng",
    "lessonTitle": "Bài 1: Lược sử công cụ tính toán",
    "learningOutcome": "-Trình bày được sơ lược lịch sử phát triển máy tính.",
    "difficulty": "BIET",
    "type": "SINGLE_CHOICE",
    "explanation": "",
    "imageDriveUrl": "",
    "authorName": "Quản trị viên Hệ thống",
    "createdBy": "user-1791601248284",
    "createdAt": "2026-10-09",
    "status": "ACTIVE",
    "options": [
      {
        "id": "opt-27-1",
        "text": "John Von Neumann.",
        "isCorrect": false
      },
      {
        "id": "opt-27-2",
        "text": "Gottfried Leibniz.",
        "isCorrect": false
      },
      {
        "id": "opt-27-3",
        "text": "Charles Babbage.",
        "isCorrect": true
      },
      {
        "id": "opt-27-4",
        "text": "Claude Shannon.",
        "isCorrect": false
      }
    ]
  },
  {
    "id": "q-1791386636548",
    "code": "TH6-A-47",
    "content": "[AI Đề xuất] Trong chương trình Tin học 6 (Nhận biết), phát biểu nào sau đây là chính xác về Chủ đề A: Máy tính và cộng đồng?",
    "gradeLevel": 6,
    "topic": "Chủ đề 1: Máy tính và cộng đồng",
    "lessonTitle": "Bài 1: Thông tin và dữ liệu",
    "learningOutcome": "Chuẩn kiến thức GDPT 2018",
    "difficulty": "BIET",
    "type": "SINGLE_CHOICE",
    "explanation": "Thông tin trong máy tính điện tử bắt buộc phải được số hóa thành các dãy bit (0 và 1) để bộ vi xử lý có thể tính toán và lưu trữ.",
    "imageDriveUrl": "https://drive.google.com/file/d/1sQg4nBCuGMA0zrUxIqzAbWSAjCCOtvC9/view?usp=drivesdk",
    "authorName": "Quản trị viên Hệ thống",
    "createdBy": "user-1791601248284",
    "createdAt": "2026-10-07",
    "status": "ACTIVE",
    "options": [
      {
        "id": "opt-28-1",
        "text": "Thông tin được mã hóa dưới dạng dãy các bit 0 và 1",
        "isCorrect": true
      },
      {
        "id": "opt-28-2",
        "text": "Dữ liệu chỉ tồn tại trên thiết bị phần cứng không thể truyền qua mạng",
        "isCorrect": false
      },
      {
        "id": "opt-28-3",
        "text": "Máy tính xử lý thông tin tương tự hoàn toàn như bộ não con người",
        "isCorrect": false
      },
      {
        "id": "opt-28-4",
        "text": "Mọi tập tin trên máy tính đều có dung lượng bằng nhau",
        "isCorrect": false
      }
    ]
  },
  {
    "id": "q-1791379750654",
    "code": "TH6-A-50",
    "content": "[AI Đề xuất] Em hãy trình bày cách xử lý tình huống: Em phát hiện một tài khoản mạng xã hội giả mạo tên và hình ảnh của bạn cùng lớp để đăng tin sai sự thật. Em sẽ làm gì?",
    "gradeLevel": 6,
    "topic": "Chủ đề 1: Máy tính và cộng đồng",
    "lessonTitle": "Bài 1: Thông tin và dữ liệu",
    "learningOutcome": "Chuẩn kiến thức GDPT 2018",
    "difficulty": "BIET",
    "type": "ESSAY",
    "explanation": "Đánh giá kỹ năng ứng xử thực tế và tinh thần trách nhiệm trong môi trường số.",
    "imageDriveUrl": "",
    "authorName": "Thầy Trần Văn Khoa",
    "createdBy": "user-1791601248284",
    "createdAt": "2026-10-07",
    "status": "ACTIVE",
    "essaySampleAnswer": "[x] [x] | [ ] [ ] | [ ] [ ] | [ ] [ ]"
  },
  {
    "id": "q-1792119009448",
    "code": "TH8-A-34",
    "content": "Việc ghi rõ tác giả, thời gian xuất bản và địa chỉ trang web (URL) trong trang \"Tài liệu tham khảo\" mang lại lợi ích gì lớn nhất?",
    "gradeLevel": 8,
    "topic": "Chủ đề 2: Tổ chức lưu trữ, tìm kiếm và trao đổi thông tin",
    "lessonTitle": "Bài 3: Thực hành khai thác thông tin số an toàn",
    "learningOutcome": "-Sử dụng được công cụ tìm kiếm, xử lí và trao đổi thông tin trong môi trường số. Nêu được ví dụ minh hoạ. \n-Chủ động tìm kiếm được thông tin để thực hiện nhiệm vụ (thông qua bài tập cụ thể).\n-Đánh giá được lợi ích của thông tin tìm được trong giải quyết vấn đề, nêu được ví dụ minh hoạ.\n1.1TC2a:Minh họa được nhu cầu thông tin\n1.1TC2b: Tổ chức được tìm kiếm dữ liệu, thông tin và nội dung trong môi trường số \n1.2TC2a: Thực hiện phân tích, so sánh và đánh giá được các nguồn dữ liệu thông tin và nội dung số",
    "difficulty": "HIEU",
    "type": "SINGLE_CHOICE",
    "explanation": "",
    "imageDriveUrl": "https://drive.google.com/file/d/1ooESFpNswaG-BwuKEh3J4xij-ZNV1adY/view?usp=drivesdk",
    "authorName": "Quản trị viên Hệ thống",
    "createdBy": "user-1791601248284",
    "createdAt": "2026-10-16",
    "status": "ACTIVE",
    "options": [
      {
        "id": "opt-30-1",
        "text": "Làm cho bài trình chiếu trông dài hơn để lấy điểm số cao.",
        "isCorrect": false
      },
      {
        "id": "opt-30-2",
        "text": "Tôn trọng bản quyền tác giả, minh bạch hóa dữ liệu và giúp người xem dễ dàng kiểm chứng thông tin.",
        "isCorrect": true
      },
      {
        "id": "opt-30-3",
        "text": "Bắt buộc phải có theo luật an ninh mạng nếu không sẽ bị khóa máy tính.",
        "isCorrect": false
      },
      {
        "id": "opt-30-4",
        "text": "Để người nghe biết người thuyết trình không tự nghĩ ra được ý tưởng nào.",
        "isCorrect": false
      }
    ]
  },
  {
    "id": "q-1792118779591",
    "code": "TH8-A-91",
    "content": "Để tìm hiểu thông tin chính xác về lịch thi đấu và bảng xếp hạng bóng đá của một giải đấu cấp khu vực (như giải vô địch châu Phi), nguồn tin nào có độ tin cậy cao nhất?",
    "gradeLevel": 8,
    "topic": "Chủ đề 2: Tổ chức lưu trữ, tìm kiếm và trao đổi thông tin",
    "lessonTitle": "Bài 3: Thực hành khai thác thông tin số an toàn",
    "learningOutcome": "-Sử dụng được công cụ tìm kiếm, xử lí và trao đổi thông tin trong môi trường số. Nêu được ví dụ minh hoạ. \n-Chủ động tìm kiếm được thông tin để thực hiện nhiệm vụ (thông qua bài tập cụ thể).\n-Đánh giá được lợi ích của thông tin tìm được trong giải quyết vấn đề, nêu được ví dụ minh hoạ.\n1.1TC2a:Minh họa được nhu cầu thông tin\n1.1TC2b: Tổ chức được tìm kiếm dữ liệu, thông tin và nội dung trong môi trường số \n1.2TC2a: Thực hiện phân tích, so sánh và đánh giá được các nguồn dữ liệu thông tin và nội dung số",
    "difficulty": "HIEU",
    "type": "ESSAY",
    "explanation": "",
    "imageDriveUrl": "",
    "authorName": "Quản trị viên Hệ thống",
    "createdBy": "user-1791601248284",
    "createdAt": "2026-10-16",
    "status": "ACTIVE",
    "essaySampleAnswer": "[x] [x] | [ ] [ ] | [ ] [ ] | [ ] [ ]"
  },
  {
    "id": "q-1792118736343",
    "code": "TH8-A-55",
    "content": "Để tìm hiểu thông tin chính xác về lịch thi đấu và bảng xếp hạng bóng đá của một giải đấu cấp khu vực (như giải vô địch châu Phi), nguồn tin nào sau đây có độ tin cậy cao nhất?",
    "gradeLevel": 8,
    "topic": "Chủ đề 2: Tổ chức lưu trữ, tìm kiếm và trao đổi thông tin",
    "lessonTitle": "Bài 3: Thực hành khai thác thông tin số an toàn",
    "learningOutcome": "-Sử dụng được công cụ tìm kiếm, xử lí và trao đổi thông tin trong môi trường số. Nêu được ví dụ minh hoạ. \n-Chủ động tìm kiếm được thông tin để thực hiện nhiệm vụ (thông qua bài tập cụ thể).\n-Đánh giá được lợi ích của thông tin tìm được trong giải quyết vấn đề, nêu được ví dụ minh hoạ.\n1.1TC2a:Minh họa được nhu cầu thông tin\n1.1TC2b: Tổ chức được tìm kiếm dữ liệu, thông tin và nội dung trong môi trường số \n1.2TC2a: Thực hiện phân tích, so sánh và đánh giá được các nguồn dữ liệu thông tin và nội dung số",
    "difficulty": "HIEU",
    "type": "SINGLE_CHOICE",
    "explanation": "",
    "imageDriveUrl": "",
    "authorName": "Quản trị viên Hệ thống",
    "createdBy": "user-1791601248284",
    "createdAt": "2026-10-16",
    "status": "ACTIVE",
    "options": [
      {
        "id": "opt-32-1",
        "text": "Bài đăng trên diễn đàn bóng đá phong trào.",
        "isCorrect": false
      },
      {
        "id": "opt-32-2",
        "text": "Website chính thức của Liên đoàn bóng đá quản lý giải đấu đó.",
        "isCorrect": true
      },
      {
        "id": "opt-32-3",
        "text": "Trang fanpage cá nhân của một cổ động viên cuồng nhiệt.",
        "isCorrect": false
      },
      {
        "id": "opt-32-4",
        "text": "Bình luận của người xem dưới một video clip highlight trên mạng xã hội.",
        "isCorrect": false
      }
    ]
  },
  {
    "id": "q-1792118656891",
    "code": "TH8-A-35",
    "content": "Trong thiết kế bài trình chiếu chuyên nghiệp, quy tắc bố cục văn bản trên mỗi trang slide nội dung thường được khuyến nghị là gì?",
    "gradeLevel": 8,
    "topic": "Chủ đề 2: Tổ chức lưu trữ, tìm kiếm và trao đổi thông tin",
    "lessonTitle": "Bài 3: Thực hành khai thác thông tin số an toàn",
    "learningOutcome": "-Sử dụng được công cụ tìm kiếm, xử lí và trao đổi thông tin trong môi trường số. Nêu được ví dụ minh hoạ. \n-Chủ động tìm kiếm được thông tin để thực hiện nhiệm vụ (thông qua bài tập cụ thể).\n-Đánh giá được lợi ích của thông tin tìm được trong giải quyết vấn đề, nêu được ví dụ minh hoạ.\n1.1TC2a:Minh họa được nhu cầu thông tin\n1.1TC2b: Tổ chức được tìm kiếm dữ liệu, thông tin và nội dung trong môi trường số \n1.2TC2a: Thực hiện phân tích, so sánh và đánh giá được các nguồn dữ liệu thông tin và nội dung số",
    "difficulty": "HIEU",
    "type": "SINGLE_CHOICE",
    "explanation": "",
    "imageDriveUrl": "",
    "authorName": "Quản trị viên Hệ thống",
    "createdBy": "user-1791601248284",
    "createdAt": "2026-10-16",
    "status": "ACTIVE",
    "options": [
      {
        "id": "opt-33-1",
        "text": "Mỗi trang không quá 10 mục, mỗi mục không quá 5 dòng.",
        "isCorrect": false
      },
      {
        "id": "opt-33-2",
        "text": "Mỗi trang không quá 6 mục, mỗi mục không quá 2 dòng.",
        "isCorrect": true
      },
      {
        "id": "opt-33-3",
        "text": "Càng nhiều chữ càng tốt để người xem đọc chi tiết.",
        "isCorrect": false
      },
      {
        "id": "opt-33-4",
        "text": "Mỗi trang chỉ nên có duy nhất 1 dòng văn bản.",
        "isCorrect": false
      }
    ]
  },
  {
    "id": "q-1792118535480",
    "code": "TH8-A-62",
    "content": "Để phòng tránh sự cố máy tính bị quá nhiệt dẫn đến sập nguồn đột ngột hoặc giảm tuổi thọ linh kiện phần cứng, biện pháp kỹ thuật nào sau đây là đúng đắn nhất?",
    "gradeLevel": 8,
    "topic": "Chủ đề 1: Máy tính và cộng đồng",
    "lessonTitle": "Bài 1: Lược sử công cụ tính toá",
    "learningOutcome": "-Trình bày được sơ lược lịch sử phát triển máy tính.\n-Nêu được ví dụ cho thấy sự phát triển máy tính đã đem đến những thay đổi lớn lao cho xã hội loài người.\n 5.1TC1a:  Chỉ ra được các vấn đề kỹ thuật thông thường và được xác định rõ ràng khi vận hành thiết bị và sử dụng môi trường số",
    "difficulty": "VAN_DUNG",
    "type": "SINGLE_CHOICE",
    "explanation": "",
    "imageDriveUrl": "",
    "authorName": "Quản trị viên Hệ thống",
    "createdBy": "user-1791601248284",
    "createdAt": "2026-10-16",
    "status": "ACTIVE",
    "options": [
      {
        "id": "opt-34-1",
        "text": "Thường xuyên dội nước làm mát lên vỏ case máy tính.",
        "isCorrect": false
      },
      {
        "id": "opt-34-2",
        "text": "Đặt máy tính trong phòng kín không thông gió và bọc kín khăn phủ bụi khi đang bật máy.",
        "isCorrect": false
      },
      {
        "id": "opt-34-3",
        "text": "Định kỳ vệ sinh bụi bám ở các khe tản nhiệt, quạt làm mát và tra lại keo tản nhiệt CPU.",
        "isCorrect": true
      },
      {
        "id": "opt-34-4",
        "text": "Luôn chạy tối đa các phần mềm nặng để quạt quay với công suất cực đại tự thổi bụi.",
        "isCorrect": false
      }
    ]
  },
  {
    "id": "q-1792118475588",
    "code": "TH8-A-42",
    "content": "Để tìm hiểu về cách sử dụng một chiếc máy ảnh mới mua, nguồn thông tin nào sau đây là chuẩn xác và đáng tham khảo nhất?",
    "gradeLevel": 8,
    "topic": "Chủ đề 2: Tổ chức lưu trữ, tìm kiếm và trao đổi thông tin",
    "lessonTitle": "Bài 3: Thực hành khai thác thông tin số an toàn",
    "learningOutcome": "-Sử dụng được công cụ tìm kiếm, xử lí và trao đổi thông tin trong môi trường số. Nêu được ví dụ minh hoạ. \n-Chủ động tìm kiếm được thông tin để thực hiện nhiệm vụ (thông qua bài tập cụ thể).\n-Đánh giá được lợi ích của thông tin tìm được trong giải quyết vấn đề, nêu được ví dụ minh hoạ.\n1.1TC2a:Minh họa được nhu cầu thông tin\n1.1TC2b: Tổ chức được tìm kiếm dữ liệu, thông tin và nội dung trong môi trường số \n1.2TC2a: Thực hiện phân tích, so sánh và đánh giá được các nguồn dữ liệu thông tin và nội dung số",
    "difficulty": "BIET",
    "type": "SINGLE_CHOICE",
    "explanation": "",
    "imageDriveUrl": "",
    "authorName": "Quản trị viên Hệ thống",
    "createdBy": "user-1791601248284",
    "createdAt": "2026-10-16",
    "status": "ACTIVE",
    "options": [
      {
        "id": "opt-35-1",
        "text": "Hướng dẫn của một người bạn đã từng chụp ảnh.",
        "isCorrect": false
      },
      {
        "id": "opt-35-2",
        "text": "Sách hướng dẫn sử dụng chính thức từ nhà sản xuất.",
        "isCorrect": true
      },
      {
        "id": "opt-35-3",
        "text": "Hướng dẫn của một người giỏi Tin học nhưng chưa dùng máy ảnh đó.",
        "isCorrect": false
      },
      {
        "id": "opt-35-4",
        "text": "Câu trả lời của một tài khoản ẩn danh trên diễn đàn nhiếp ảnh.",
        "isCorrect": false
      }
    ]
  },
  {
    "id": "q-1792118279477",
    "code": "TH8-A-47",
    "content": "Khi nói về sự phát triển của các thế hệ máy tính điện tử, các phát biểu sau đây là Đúng hay Sai?",
    "gradeLevel": 8,
    "topic": "Chủ đề 1: Máy tính và cộng đồng",
    "lessonTitle": "Bài 1: Lược sử công cụ tính toá",
    "learningOutcome": "-Trình bày được sơ lược lịch sử phát triển máy tính.\n-Nêu được ví dụ cho thấy sự phát triển máy tính đã đem đến những thay đổi lớn lao cho xã hội loài người.\n 5.1TC1a:  Chỉ ra được các vấn đề kỹ thuật thông thường và được xác định rõ ràng khi vận hành thiết bị và sử dụng môi trường số",
    "difficulty": "BIET",
    "type": "TRUE_FALSE",
    "explanation": "",
    "imageDriveUrl": "https://drive.google.com/file/d/1aYA4dFTOQTvyRlu8mJ3y9_gNEIz0sMh5/view?usp=drivesdk",
    "authorName": "Quản trị viên Hệ thống",
    "createdBy": "user-1791601248284",
    "createdAt": "2026-10-16",
    "status": "ACTIVE",
    "trueFalseStatements": [
      {
        "id": "tf-36-1",
        "statement": "ENIAC là chiếc máy tính điện tử hoàn chỉnh đầu tiên trên thế giới và nó sử dụng bóng đèn chân không.",
        "isCorrect": true
      },
      {
        "id": "tf-36-2",
        "statement": "Máy tính thế hệ thứ hai có kích thước nhỏ hơn và ít tiêu thụ điện hơn nhờ sử dụng vi mạch (IC).",
        "isCorrect": false
      },
      {
        "id": "tf-36-3",
        "statement": "[ ]",
        "isCorrect": false
      },
      {
        "id": "tf-36-4",
        "statement": "[ ]",
        "isCorrect": false
      }
    ]
  },
  {
    "id": "q-1792117749458",
    "code": "TH8-A-49",
    "content": "Khi tìm hiểu về các công cụ tính toán và máy tính cơ học, các nhận định sau đây là Đúng hay Sai?",
    "gradeLevel": 8,
    "topic": "Chủ đề 1: Máy tính và cộng đồng",
    "lessonTitle": "Bài 1: Lược sử công cụ tính toá",
    "learningOutcome": "-Trình bày được sơ lược lịch sử phát triển máy tính.\n-Nêu được ví dụ cho thấy sự phát triển máy tính đã đem đến những thay đổi lớn lao cho xã hội loài người.\n 5.1TC1a:  Chỉ ra được các vấn đề kỹ thuật thông thường và được xác định rõ ràng khi vận hành thiết bị và sử dụng môi trường số",
    "difficulty": "BIET",
    "type": "TRUE_FALSE",
    "explanation": "",
    "imageDriveUrl": "",
    "authorName": "Quản trị viên Hệ thống",
    "createdBy": "user-1791601248284",
    "createdAt": "2026-10-16",
    "status": "ACTIVE",
    "trueFalseStatements": [
      {
        "id": "tf-37-1",
        "statement": "[x]",
        "isCorrect": true
      },
      {
        "id": "tf-37-2",
        "statement": "[ ]",
        "isCorrect": false
      },
      {
        "id": "tf-37-3",
        "statement": "[ ]",
        "isCorrect": false
      },
      {
        "id": "tf-37-4",
        "statement": "[ ]",
        "isCorrect": false
      }
    ]
  },
  {
    "id": "q-1792117528731",
    "code": "TH8-A-52",
    "content": "Thế hệ máy tính thứ tư (1974 - 1990) được đặc trưng bởi công nghệ nào cho phép máy vi tính cá nhân (PC) ra đời và đặt vừa vặn trên bàn làm việc?",
    "gradeLevel": 8,
    "topic": "Chủ đề 1: Máy tính và cộng đồng",
    "lessonTitle": "Bài 1: Lược sử công cụ tính toá",
    "learningOutcome": "-Trình bày được sơ lược lịch sử phát triển máy tính.\n-Nêu được ví dụ cho thấy sự phát triển máy tính đã đem đến những thay đổi lớn lao cho xã hội loài người.\n 5.1TC1a:  Chỉ ra được các vấn đề kỹ thuật thông thường và được xác định rõ ràng khi vận hành thiết bị và sử dụng môi trường số",
    "difficulty": "HIEU",
    "type": "SINGLE_CHOICE",
    "explanation": "",
    "imageDriveUrl": "",
    "authorName": "Quản trị viên Hệ thống",
    "createdBy": "user-1791601248284",
    "createdAt": "2026-10-16",
    "status": "ACTIVE",
    "options": [
      {
        "id": "opt-38-1",
        "text": "Mạch tích hợp cỡ rất lớn (VLSI) tạo ra những bộ vi xử lý nguyên khối.",
        "isCorrect": true
      },
      {
        "id": "opt-38-2",
        "text": "Các ống đèn chân không thu nhỏ kích thước.",
        "isCorrect": false
      },
      {
        "id": "opt-38-3",
        "text": "Đĩa mềm dung lượng cao thay thế băng từ.",
        "isCorrect": false
      },
      {
        "id": "opt-38-4",
        "text": "Mạng Internet cáp quang toàn cầu.",
        "isCorrect": false
      }
    ]
  },
  {
    "id": "q-1792117339609",
    "code": "TH8-A-96",
    "content": "Khi bật máy tính, màn hình vẫn tối đen và thùng máy phát ra chuỗi tiếng bíp (beep) liên tục, quạt tản nhiệt quay mạnh. Vấn đề kỹ thuật thường gặp nhất ở đây là gì?",
    "gradeLevel": 8,
    "topic": "Chủ đề 1: Máy tính và cộng đồng",
    "lessonTitle": "Bài 1: Lược sử công cụ tính toá",
    "learningOutcome": "-Trình bày được sơ lược lịch sử phát triển máy tính.\n-Nêu được ví dụ cho thấy sự phát triển máy tính đã đem đến những thay đổi lớn lao cho xã hội loài người.\n 5.1TC1a:  Chỉ ra được các vấn đề kỹ thuật thông thường và được xác định rõ ràng khi vận hành thiết bị và sử dụng môi trường số",
    "difficulty": "VAN_DUNG",
    "type": "ESSAY",
    "explanation": "",
    "imageDriveUrl": "",
    "authorName": "Quản trị viên Hệ thống",
    "createdBy": "user-1791601248284",
    "createdAt": "2026-10-16",
    "status": "ACTIVE",
    "essaySampleAnswer": "[x] [x] | [ ] [ ] | [ ] [ ] | [ ] [ ]"
  },
  {
    "id": "q-1792117267520",
    "code": "TH8-A-20",
    "content": "Khi bật máy tính, màn hình vẫn tối đen và thùng máy phát ra chuỗi tiếng bíp (beep) liên tục, quạt tản nhiệt quay mạnh. Vấn đề kỹ thuật thường gặp nhất ở đây là gì?",
    "gradeLevel": 8,
    "topic": "Chủ đề 1: Máy tính và cộng đồng",
    "lessonTitle": "Bài 1: Lược sử công cụ tính toá",
    "learningOutcome": "-Trình bày được sơ lược lịch sử phát triển máy tính.\n-Nêu được ví dụ cho thấy sự phát triển máy tính đã đem đến những thay đổi lớn lao cho xã hội loài người.\n 5.1TC1a:  Chỉ ra được các vấn đề kỹ thuật thông thường và được xác định rõ ràng khi vận hành thiết bị và sử dụng môi trường số",
    "difficulty": "VAN_DUNG",
    "type": "SINGLE_CHOICE",
    "explanation": "",
    "imageDriveUrl": "",
    "authorName": "Quản trị viên Hệ thống",
    "createdBy": "user-1791601248284",
    "createdAt": "2026-10-16",
    "status": "ACTIVE",
    "options": [
      {
        "id": "opt-40-1",
        "text": "Màn hình máy tính đã bị cháy bóng đèn nền hoàn toàn.",
        "isCorrect": false
      },
      {
        "id": "opt-40-2",
        "text": "Thanh bộ nhớ RAM bị bám bụi bẩn hoặc lỏng chân tiếp xúc với bo mạch chủ.",
        "isCorrect": true
      },
      {
        "id": "opt-40-3",
        "text": "Chuột máy tính chưa được cài đặt phần mềm điều khiển.",
        "isCorrect": false
      },
      {
        "id": "opt-40-4",
        "text": "Bàn phím máy tính bị kẹt phím cách (Space).",
        "isCorrect": false
      }
    ]
  },
  {
    "id": "q-1792117180443",
    "code": "TH8-1-10",
    "content": "...................................... là minh chứng rõ nét nhất cho máy tính Thế hệ thứ năm có khả năng cảm nhận, tương tác thông minh và di động?",
    "gradeLevel": 8,
    "topic": "Chủ đề 1: Máy tính và cộng đồng",
    "lessonTitle": "Bài 1: Lược sử công cụ tính toá",
    "learningOutcome": "-Trình bày được sơ lược lịch sử phát triển máy tính.\n-Nêu được ví dụ cho thấy sự phát triển máy tính đã đem đến những thay đổi lớn lao cho xã hội loài người.\n 5.1TC1a:  Chỉ ra được các vấn đề kỹ thuật thông thường và được xác định rõ ràng khi vận hành thiết bị và sử dụng môi trường số",
    "difficulty": "VAN_DUNG",
    "type": "FILL_IN_BLANK",
    "explanation": "Điện thoại thông minh (smartphone) có trợ lý ảo nhận dạng giọng nói.",
    "imageDriveUrl": "https://drive.google.com/file/d/1JgoCs4zkKaoyQYWFWMemcIAiRd_lUguq/view?usp=drivesdk",
    "authorName": "Quản trị viên Hệ thống",
    "createdBy": "user-1791601248284",
    "createdAt": "2026-10-16",
    "status": "ACTIVE",
    "correctAnswerText": "[x] [x] | [ ] [ ] | [ ] [ ] | [ ] [ ]"
  },
  {
    "id": "q-1792117072650",
    "code": "TH8-1-61",
    "content": "Thiết bị nào sau đây là minh chứng rõ nét nhất cho máy tính Thế hệ thứ năm có khả năng cảm nhận, tương tác thông minh và di động?",
    "gradeLevel": 8,
    "topic": "Chủ đề 1: Máy tính và cộng đồng",
    "lessonTitle": "Bài 1: Lược sử công cụ tính toá",
    "learningOutcome": "-Trình bày được sơ lược lịch sử phát triển máy tính.\n-Nêu được ví dụ cho thấy sự phát triển máy tính đã đem đến những thay đổi lớn lao cho xã hội loài người.\n 5.1TC1a:  Chỉ ra được các vấn đề kỹ thuật thông thường và được xác định rõ ràng khi vận hành thiết bị và sử dụng môi trường số",
    "difficulty": "VAN_DUNG",
    "type": "SINGLE_CHOICE",
    "explanation": "",
    "imageDriveUrl": "https://drive.google.com/file/d/1O9KNUqdhlcMKq_YLTD9GkhOfMkNi26LD/view?usp=drivesdk",
    "authorName": "Quản trị viên Hệ thống",
    "createdBy": "user-1791601248284",
    "createdAt": "2026-10-16",
    "status": "ACTIVE",
    "options": [
      {
        "id": "opt-42-1",
        "text": "Máy in laser đen trắng kết nối qua cổng USB.",
        "isCorrect": false
      },
      {
        "id": "opt-42-2",
        "text": "Chiếc máy vi tính để bàn dùng hệ điều hành MS-DOS năm 1981.",
        "isCorrect": false
      },
      {
        "id": "opt-42-3",
        "text": "Điện thoại thông minh (smartphone) có trợ lý ảo nhận dạng giọng nói.",
        "isCorrect": true
      },
      {
        "id": "opt-42-4",
        "text": "Máy tính cầm tay Casio FX-500 chỉ làm phép tính cộng trừ nhân chia.",
        "isCorrect": false
      }
    ]
  },
  {
    "id": "q-1792115489875",
    "code": "TH8-A-13",
    "content": "Vào thời điểm đất nước ta hoàn toàn thống nhất (năm 1975), những thế hệ máy tính điện tử nào đã xuất hiện tại Việt Nam?",
    "gradeLevel": 8,
    "topic": "Chủ đề 1: Máy tính và cộng đồng",
    "lessonTitle": "Bài 1: Lược sử công cụ tính toá",
    "learningOutcome": "-Trình bày được sơ lược lịch sử phát triển máy tính.\n-Nêu được ví dụ cho thấy sự phát triển máy tính đã đem đến những thay đổi lớn lao cho xã hội loài người.\n 5.1TC1a:  Chỉ ra được các vấn đề kỹ thuật thông thường và được xác định rõ ràng khi vận hành thiết bị và sử dụng môi trường số",
    "difficulty": "BIET",
    "type": "SINGLE_CHOICE",
    "explanation": "",
    "imageDriveUrl": "",
    "authorName": "Quản trị viên Hệ thống",
    "createdBy": "user-1791601248284",
    "createdAt": "2026-10-16",
    "status": "ACTIVE",
    "options": [
      {
        "id": "opt-43-1",
        "text": "Chỉ có máy tính thế hệ thứ nhất (ENIAC).",
        "isCorrect": false
      },
      {
        "id": "opt-43-2",
        "text": "Thế hệ thứ hai (chiếc Minsk-22) và Thế hệ thứ ba (dòng máy IBM System/360).",
        "isCorrect": false
      },
      {
        "id": "opt-43-3",
        "text": "Thế hệ thứ tư (máy vi tính IBM PC).",
        "isCorrect": true
      },
      {
        "id": "opt-43-4",
        "text": "Chưa có bất kỳ thế hệ máy tính điện tử nào.",
        "isCorrect": false
      }
    ]
  },
  {
    "id": "q-1792115240633",
    "code": "TH8-1-81",
    "content": "Bước tiến đột phá nào giúp máy tính Thế hệ thứ hai nhỏ hơn, rẻ hơn, tiêu thụ ít điện năng và chạy nhanh hơn máy tính Thế hệ thứ nhất?",
    "gradeLevel": 8,
    "topic": "Chủ đề 1: Máy tính và cộng đồng",
    "lessonTitle": "Bài 1: Lược sử công cụ tính toá",
    "learningOutcome": "-Trình bày được sơ lược lịch sử phát triển máy tính.\n-Nêu được ví dụ cho thấy sự phát triển máy tính đã đem đến những thay đổi lớn lao cho xã hội loài người.\n 5.1TC1a:  Chỉ ra được các vấn đề kỹ thuật thông thường và được xác định rõ ràng khi vận hành thiết bị và sử dụng môi trường số",
    "difficulty": "HIEU",
    "type": "SINGLE_CHOICE",
    "explanation": "",
    "imageDriveUrl": "",
    "authorName": "Quản trị viên Hệ thống",
    "createdBy": "user-1791601248284",
    "createdAt": "2026-10-16",
    "status": "ACTIVE",
    "options": [
      {
        "id": "opt-44-1",
        "text": "Thay thế rơ le điện - cơ bằng thẻ đục lỗ.",
        "isCorrect": false
      },
      {
        "id": "opt-44-2",
        "text": "Thay thế đèn điện tử chân không bằng bóng bán dẫn.",
        "isCorrect": true
      },
      {
        "id": "opt-44-3",
        "text": "Chế tạo thành công chuột máy tính và bàn phím.",
        "isCorrect": false
      },
      {
        "id": "opt-44-4",
        "text": "Tích hợp công nghệ trí tuệ nhân tạo (AI).",
        "isCorrect": false
      }
    ]
  },
  {
    "id": "q-01",
    "code": "TH6-01-01",
    "content": "Thiết bị nào sau đây là thiết bị vào (Input) của máy tính?",
    "gradeLevel": 6,
    "topic": "Chủ đề 1: Máy tính và cộng đồng",
    "lessonTitle": "Bài 1: Thông tin và dữ liệu",
    "learningOutcome": "Nhận biết được các thiết bị vào - ra cơ bản của hệ thống máy tính",
    "difficulty": "BIET",
    "type": "SINGLE_CHOICE",
    "explanation": "Bàn phím là thiết bị đưa dữ liệu từ người dùng vào máy tính. Màn hình, máy in và loa là thiết bị ra.",
    "imageDriveUrl": "https://drive.google.com/file/d/1A_thcsphuho_keyboard_input/view?usp=sharing",
    "authorName": "Nguyễn Hữu Dũng",
    "createdBy": "user-1791601248284",
    "createdAt": "2025-10-01",
    "status": "ACTIVE",
    "options": [
      {
        "id": "opt-45-1",
        "text": "Bàn phím (Keyboard)",
        "isCorrect": true
      },
      {
        "id": "opt-45-2",
        "text": "Màn hình (Monitor)",
        "isCorrect": false
      },
      {
        "id": "opt-45-3",
        "text": "Máy in (Printer)",
        "isCorrect": false
      },
      {
        "id": "opt-45-4",
        "text": "Loa (Speaker)",
        "isCorrect": false
      }
    ]
  },
  {
    "id": "q-02",
    "code": "TH6-A-02",
    "content": "Đơn vị đo dung lượng thông tin nhỏ nhất trong máy tính là gì?",
    "gradeLevel": 6,
    "topic": "Chủ đề 1: Máy tính và cộng đồng",
    "lessonTitle": "Bài 1: Thông tin và dữ liệu",
    "learningOutcome": "Chuẩn kiến thức GDPT 2018",
    "difficulty": "BIET",
    "type": "SINGLE_CHOICE",
    "explanation": "Bit (viết tắt của Binary digit) là đơn vị nhỏ nhất để đo lượng thông tin, chỉ nhận giá trị 0 hoặc 1.",
    "imageDriveUrl": "",
    "authorName": "Nguyễn Hữu Dũng",
    "createdBy": "user-1791601248284",
    "createdAt": "2025-10-01",
    "status": "ACTIVE",
    "options": [
      {
        "id": "opt-46-1",
        "text": "Bit (0 hoặc 1)",
        "isCorrect": true
      },
      {
        "id": "opt-46-2",
        "text": "Byte (8 bit)",
        "isCorrect": false
      },
      {
        "id": "opt-46-3",
        "text": "Kilobyte (KB)",
        "isCorrect": false
      },
      {
        "id": "opt-46-4",
        "text": "Megabyte (MB)",
        "isCorrect": false
      }
    ]
  },
  {
    "id": "q-03",
    "code": "TH6-B-03",
    "content": "Những hành động nào sau đây giúp em bảo vệ tài khoản cá nhân an toàn trên Internet? (Chọn các phương án đúng)",
    "gradeLevel": 6,
    "topic": "Chủ đề 1: Máy tính và cộng đồng",
    "lessonTitle": "Bài 1: Thông tin và dữ liệu",
    "learningOutcome": "Chuẩn kiến thức GDPT 2018",
    "difficulty": "HIEU",
    "type": "MULTIPLE_CHOICE",
    "explanation": "Mật khẩu mạnh, đăng xuất máy công cộng và không nhấp link lạ là các biện pháp an toàn. Tuyệt đối không chia sẻ mật khẩu.",
    "imageDriveUrl": "",
    "authorName": "Lê Thị Mai",
    "createdBy": "user-1791601248284",
    "createdAt": "2025-10-02",
    "status": "ACTIVE",
    "options": [
      {
        "id": "opt-47-1",
        "text": "Đặt mật khẩu mạnh gồm chữ hoa, chữ thường, số và ký tự đặc biệt",
        "isCorrect": true
      },
      {
        "id": "opt-47-2",
        "text": "Đăng xuất tài khoản sau khi dùng máy tính công cộng",
        "isCorrect": true
      },
      {
        "id": "opt-47-3",
        "text": "Chia sẻ mật khẩu cho bạn thân cùng lớp để nhờ làm bài tập",
        "isCorrect": false
      },
      {
        "id": "opt-47-4",
        "text": "Không nhấp vào các đường link lạ nhận được từ người lạ trên mạng xã hội",
        "isCorrect": true
      }
    ]
  },
  {
    "id": "q-04",
    "code": "TH6-C-04",
    "content": "Xét tính Đúng/Sai của các nhận định sau về việc tổ chức thông tin trong máy tính:",
    "gradeLevel": 6,
    "topic": "Chủ đề 1: Máy tính và cộng đồng",
    "lessonTitle": "Bài 1: Thông tin và dữ liệu",
    "learningOutcome": "Chuẩn kiến thức GDPT 2018",
    "difficulty": "HIEU",
    "type": "TRUE_FALSE",
    "explanation": "Cùng một thư mục không thể chứa 2 tệp trùng tên và phần mở rộng. Khi xóa thư mục mẹ, toàn bộ nội dung bên trong sẽ bị xóa.",
    "imageDriveUrl": "",
    "authorName": "Nguyễn Hữu Dũng",
    "createdBy": "user-1791601248284",
    "createdAt": "2025-10-03",
    "status": "ACTIVE",
    "trueFalseStatements": [
      {
        "id": "tf-48-1",
        "statement": "Đáp án A",
        "isCorrect": true
      },
      {
        "id": "tf-48-2",
        "statement": "Đáp án B",
        "isCorrect": false
      },
      {
        "id": "tf-48-3",
        "statement": "Đáp án C",
        "isCorrect": false
      },
      {
        "id": "tf-48-4",
        "statement": "Đáp án D",
        "isCorrect": false
      }
    ]
  },
  {
    "id": "q-05",
    "code": "TH6-F-05",
    "content": "Điền từ còn thiếu vào chỗ trống: \"Trong thuật toán, cấu trúc [...] được sử dụng để thực hiện một số bước công việc chỉ khi một điều kiện cho trước được thỏa mãn.\"",
    "gradeLevel": 6,
    "topic": "Chủ đề 1: Máy tính và cộng đồng",
    "lessonTitle": "Bài 1: Thông tin và dữ liệu",
    "learningOutcome": "Chuẩn kiến thức GDPT 2018",
    "difficulty": "VAN_DUNG",
    "type": "FILL_IN_BLANK",
    "explanation": "Cấu trúc rẽ nhánh (if-then) kiểm tra điều kiện: nếu đúng thì thực hiện câu lệnh, nếu sai thì bỏ qua hoặc thực hiện nhánh khác.",
    "imageDriveUrl": "",
    "authorName": "Nguyễn Hữu Dũng",
    "createdBy": "user-1791601248284",
    "createdAt": "2025-10-04",
    "status": "ACTIVE",
    "correctAnswerText": "[x] Đáp án A | [ ] Đáp án B | [ ] Đáp án C | [ ] Đáp án D"
  },
  {
    "id": "q-06",
    "code": "TH6-F-06",
    "content": "Em hãy viết các bước bằng ngôn ngữ tự nhiên để mô tả thuật toán: \"Tìm số lớn nhất trong hai số a và b được nhập từ bàn phím\". Nêu ví dụ khi a = 15 và b = 28.",
    "gradeLevel": 6,
    "topic": "Chủ đề 1: Máy tính và cộng đồng",
    "lessonTitle": "Bài 1: Thông tin và dữ liệu",
    "learningOutcome": "Chuẩn kiến thức GDPT 2018",
    "difficulty": "VAN_DUNG",
    "type": "ESSAY",
    "explanation": "Học sinh cần nêu rõ bước nhập dữ liệu, bước kiểm tra điều kiện so sánh, bước đưa ra kết quả và chạy thử với ví dụ thực tế.",
    "imageDriveUrl": "",
    "authorName": "Lê Thị Mai",
    "createdBy": "user-1791601248284",
    "createdAt": "2025-10-05",
    "status": "ACTIVE",
    "essaySampleAnswer": "[x] [x] | [ ] [ ]"
  },
  {
    "id": "q-07",
    "code": "TH7-E-01",
    "content": "Trong bảng tính Excel, địa chỉ ô nào sau đây là địa chỉ tuyệt đối?",
    "gradeLevel": 7,
    "topic": "Chủ đề 1: Máy tính và cộng đồng",
    "lessonTitle": "Bài 1: Thông tin và dữ liệu",
    "learningOutcome": "Chuẩn kiến thức GDPT 2018",
    "difficulty": "BIET",
    "type": "SINGLE_CHOICE",
    "explanation": "Địa chỉ có dấu $ trước cả tên cột và chỉ số dòng ($A$1) là địa chỉ tuyệt đối.",
    "imageDriveUrl": "",
    "authorName": "Nguyễn Hữu Dũng",
    "createdBy": "user-1791601248284",
    "createdAt": "2025-10-06",
    "status": "ACTIVE",
    "options": [
      {
        "id": "opt-51-1",
        "text": "$A$1",
        "isCorrect": true
      },
      {
        "id": "opt-51-2",
        "text": "A1",
        "isCorrect": false
      },
      {
        "id": "opt-51-3",
        "text": "A$1",
        "isCorrect": false
      },
      {
        "id": "opt-51-4",
        "text": "$A1",
        "isCorrect": false
      }
    ]
  },
  {
    "id": "q-08",
    "code": "TH7-E-02",
    "content": "Hàm nào sau đây dùng để tính trung bình cộng của một dãy số trong bảng tính?",
    "gradeLevel": 7,
    "topic": "Chủ đề 1: Máy tính và cộng đồng",
    "lessonTitle": "Bài 1: Thông tin và dữ liệu",
    "learningOutcome": "Chuẩn kiến thức GDPT 2018",
    "difficulty": "BIET",
    "type": "SINGLE_CHOICE",
    "explanation": "Hàm AVERAGE(danh_sách) dùng để tính giá trị trung bình cộng.",
    "imageDriveUrl": "",
    "authorName": "Nguyễn Hữu Dũng",
    "createdBy": "user-1791601248284",
    "createdAt": "2025-10-06",
    "status": "ACTIVE",
    "options": [
      {
        "id": "opt-52-1",
        "text": "AVERAGE",
        "isCorrect": true
      },
      {
        "id": "opt-52-2",
        "text": "SUM",
        "isCorrect": false
      },
      {
        "id": "opt-52-3",
        "text": "COUNT",
        "isCorrect": false
      },
      {
        "id": "opt-52-4",
        "text": "MAX",
        "isCorrect": false
      }
    ]
  },
  {
    "id": "q-09",
    "code": "TH8-F-01",
    "content": "Trong ngôn ngữ lập trình Scratch/Python, vòng lặp \"for i in range(5):\" sẽ thực hiện khối lệnh bao nhiêu lần?",
    "gradeLevel": 8,
    "topic": "Chủ đề 1: Máy tính và cộng đồng",
    "lessonTitle": "Bài 1: Thông tin và dữ liệu",
    "learningOutcome": "Chuẩn kiến thức GDPT 2018",
    "difficulty": "HIEU",
    "type": "SINGLE_CHOICE",
    "explanation": "Hàm range(5) sinh ra dãy các số: 0, 1, 2, 3, 4 (tổng cộng 5 giá trị), do đó vòng lặp chạy đúng 5 lần.",
    "imageDriveUrl": "",
    "authorName": "Phan Quốc Bảo",
    "createdBy": "user-1791601248284",
    "createdAt": "2025-10-07",
    "status": "ACTIVE",
    "options": [
      {
        "id": "opt-53-1",
        "text": "5 lần (với giá trị i từ 0 đến 4)",
        "isCorrect": true
      },
      {
        "id": "opt-53-2",
        "text": "4 lần",
        "isCorrect": false
      },
      {
        "id": "opt-53-3",
        "text": "6 lần",
        "isCorrect": false
      },
      {
        "id": "opt-53-4",
        "text": "Vô hạn lần",
        "isCorrect": false
      }
    ]
  },
  {
    "id": "q-10",
    "code": "TH6-D-01",
    "content": "Khi sử dụng lại một bài viết hoặc hình ảnh từ trên mạng Internet để đưa vào bài thuyết trình của mình, hành vi nào sau đây là văn minh và đúng luật?",
    "gradeLevel": 6,
    "topic": "Chủ đề 1: Máy tính và cộng đồng",
    "lessonTitle": "Bài 1: Thông tin và dữ liệu",
    "learningOutcome": "Chuẩn kiến thức GDPT 2018",
    "difficulty": "HIEU",
    "type": "SINGLE_CHOICE",
    "explanation": "Luật sở hữu trí tuệ và đạo đức mạng yêu cầu phải trích dẫn rõ nguồn và tác giả khi sử dụng tài liệu tham khảo.",
    "imageDriveUrl": "",
    "authorName": "Lê Thị Mai",
    "createdBy": "user-1791601248284",
    "createdAt": "2025-10-07",
    "status": "ACTIVE",
    "options": [
      {
        "id": "opt-54-1",
        "text": "Ghi rõ tên tác giả và nguồn gốc xuất xứ của tài liệu được trích dẫn",
        "isCorrect": true
      },
      {
        "id": "opt-54-2",
        "text": "Tự nhận đó là do mình sáng tạo ra để được điểm cao",
        "isCorrect": false
      },
      {
        "id": "opt-54-3",
        "text": "Cắt bỏ logo của tác giả để tránh bị giáo viên phát hiện",
        "isCorrect": false
      },
      {
        "id": "opt-54-4",
        "text": "Đem bán lại tài liệu đó cho các bạn khác trong trường",
        "isCorrect": false
      }
    ]
  },
  {
    "id": "q-11",
    "code": "TH6-A-03",
    "content": "Quá trình xử lý thông tin của máy tính bao gồm các bước theo thứ tự nào sau đây?",
    "gradeLevel": 6,
    "topic": "Chủ đề 1: Máy tính và cộng đồng",
    "lessonTitle": "Bài 1: Thông tin và dữ liệu",
    "learningOutcome": "Hiểu các bước cơ bản của quá trình xử lý thông tin",
    "difficulty": "HIEU",
    "type": "SINGLE_CHOICE",
    "explanation": "Quy trình xử lý thông tin chuẩn: Nhận thông tin vào (Input) -> Xử lý (Processing) -> Xuất kết quả (Output) và Lưu trữ (Storage).",
    "imageDriveUrl": "",
    "authorName": "Nguyễn Hữu Dũng",
    "createdBy": "user-1791601248284",
    "createdAt": "2025-10-08",
    "status": "ACTIVE",
    "options": [
      {
        "id": "opt-55-1",
        "text": "Nhận thông tin -> Xử lý thông tin -> Xuất thông tin (và lưu trữ)",
        "isCorrect": true
      },
      {
        "id": "opt-55-2",
        "text": "Xử lý thông tin -> Nhận thông tin -> Lưu trữ thông tin",
        "isCorrect": false
      },
      {
        "id": "opt-55-3",
        "text": "Xuất thông tin -> Nhận thông tin -> Xử lý thông tin",
        "isCorrect": false
      },
      {
        "id": "opt-55-4",
        "text": "Lưu trữ thông tin -> Xuất thông tin -> Nhận thông tin",
        "isCorrect": false
      }
    ]
  },
  {
    "id": "q-12",
    "code": "TH6-A-04",
    "content": "Đúng hay Sai: 1 Byte tương đương với bao nhiêu bit?",
    "gradeLevel": 6,
    "topic": "Chủ đề 1: Máy tính và cộng đồng",
    "lessonTitle": "Bài 2: Lưu trữ và biểu diễn dữ liệu",
    "learningOutcome": "Quy đổi chính xác các đơn vị đo dung lượng thông tin",
    "difficulty": "BIET",
    "type": "TRUE_FALSE",
    "explanation": "1 Byte = 8 bit; 1 KB = 1024 Byte; 1 MB = 1024 KB; 1 TB = 1024 GB nên GB nhỏ hơn TB.",
    "imageDriveUrl": "",
    "authorName": "Nguyễn Hữu Dũng",
    "createdBy": "user-1791601248284",
    "createdAt": "2025-10-08",
    "status": "ACTIVE",
    "trueFalseStatements": [
      {
        "id": "tf-56-1",
        "statement": "Đáp án A",
        "isCorrect": true
      },
      {
        "id": "tf-56-2",
        "statement": "Đáp án B",
        "isCorrect": false
      },
      {
        "id": "tf-56-3",
        "statement": "Đáp án C",
        "isCorrect": false
      },
      {
        "id": "tf-56-4",
        "statement": "Đáp án D",
        "isCorrect": false
      }
    ]
  },
  {
    "id": "q-13",
    "code": "TH6-B-05",
    "content": "Mạng máy tính gồm những thành phần cơ bản nào?",
    "gradeLevel": 6,
    "topic": "Chủ đề 2: Mạng máy tính và Internet",
    "lessonTitle": "Bài 4: Mạng máy tính",
    "learningOutcome": "Nhận biết các thành phần mạng máy tính",
    "difficulty": "BIET",
    "type": "MULTIPLE_CHOICE",
    "explanation": "Các thành phần của mạng máy tính bao gồm thiết bị đầu cuối, thiết bị kết nối mạng và phần mềm mạng.",
    "imageDriveUrl": "",
    "authorName": "Nguyễn Hữu Dũng",
    "createdBy": "user-1791601248284",
    "createdAt": "2025-10-09",
    "status": "ACTIVE",
    "options": [
      {
        "id": "opt-57-1",
        "text": "Các thiết bị đầu cuối (Máy tính, điện thoại, máy in)",
        "isCorrect": true
      },
      {
        "id": "opt-57-2",
        "text": "Các thiết bị kết nối mạng (Switch, Router, Modem, Cáp mạng)",
        "isCorrect": true
      },
      {
        "id": "opt-57-3",
        "text": "Phần mềm mạng (Giao thức mạng, hệ điều hành mạng)",
        "isCorrect": true
      },
      {
        "id": "opt-57-4",
        "text": "Bàn phím cơ chơi game",
        "isCorrect": false
      }
    ]
  },
  {
    "id": "q-14",
    "code": "TH6-B-06",
    "content": "Hãy nêu ít nhất 3 lời khuyên giúp học sinh THCS tự bảo vệ bản thân và không rơi vào cạm bẫy trên không gian mạng Internet.",
    "gradeLevel": 6,
    "topic": "Chủ đề 2: Mạng máy tính và Internet",
    "lessonTitle": "Bài 5: An toàn khi dùng Internet",
    "learningOutcome": "Thực hành bảo vệ an toàn trên mạng",
    "difficulty": "VAN_DUNG",
    "type": "ESSAY",
    "explanation": "Học sinh trình bày đủ 3 ý rõ ràng, thực tế và có tính ứng dụng cao.",
    "imageDriveUrl": "",
    "authorName": "Nguyễn Hữu Dũng",
    "createdBy": "user-1791601248284",
    "createdAt": "2025-10-09",
    "status": "ACTIVE",
    "essaySampleAnswer": "[x] Đáp án A | [ ] Đáp án B | [ ] Đáp án C | [ ] Đáp án D"
  },
  {
    "id": "q-15",
    "code": "TH6-C-07",
    "content": "Thư mục gốc (Root directory) trong hệ thống tệp là gì?",
    "gradeLevel": 6,
    "topic": "Chủ đề 3: Tổ chức lưu trữ, tìm kiếm và trao đổi thông tin",
    "lessonTitle": "Bài 6: Tệp và thư mục",
    "learningOutcome": "Nhận biết thư mục gốc và đường dẫn",
    "difficulty": "BIET",
    "type": "SINGLE_CHOICE",
    "explanation": "Thư mục gốc là thư mục cao nhất của một ổ đĩa (ví dụ C:\\ hoặc D:\\).",
    "imageDriveUrl": "",
    "authorName": "Nguyễn Hữu Dũng",
    "createdBy": "user-1791601248284",
    "createdAt": "2025-10-10",
    "status": "ACTIVE",
    "options": [
      {
        "id": "opt-59-1",
        "text": "Thư mục ở vị trí cao nhất của một ổ đĩa, không nằm trong bất kỳ thư mục nào khác",
        "isCorrect": true
      },
      {
        "id": "opt-59-2",
        "text": "Thư mục chỉ chứa hình ảnh cá nhân",
        "isCorrect": false
      },
      {
        "id": "opt-59-3",
        "text": "Thư mục tạm thời bị xóa nằm trong thùng rác",
        "isCorrect": false
      },
      {
        "id": "opt-59-4",
        "text": "Tệp văn bản Word",
        "isCorrect": false
      }
    ]
  },
  {
    "id": "q-16",
    "code": "TH7-A-01",
    "content": "Bộ nhớ RAM thuộc loại bộ nhớ nào của máy tính?",
    "gradeLevel": 7,
    "topic": "Chủ đề 1: Máy tính và cộng đồng",
    "lessonTitle": "Bài 1: Thiết bị vào - ra và thiết bị lưu trữ",
    "learningOutcome": "Phân biệt bộ nhớ trong và bộ nhớ ngoài",
    "difficulty": "BIET",
    "type": "SINGLE_CHOICE",
    "explanation": "RAM là bộ nhớ trong (Random Access Memory), dữ liệu trong RAM sẽ bị mất khi tắt máy tính.",
    "imageDriveUrl": "",
    "authorName": "Nguyễn Hữu Dũng",
    "createdBy": "user-1791601248284",
    "createdAt": "2025-10-10",
    "status": "ACTIVE",
    "options": [
      {
        "id": "opt-60-1",
        "text": "Bộ nhớ trong (Bộ nhớ truy cập ngẫu nhiên, mất dữ liệu khi tắt nguồn)",
        "isCorrect": true
      },
      {
        "id": "opt-60-2",
        "text": "Bộ nhớ ngoài như ổ cứng HDD/SSD",
        "isCorrect": false
      },
      {
        "id": "opt-60-3",
        "text": "Thiết bị xuất kết quả",
        "isCorrect": false
      },
      {
        "id": "opt-60-4",
        "text": "Bộ nguồn máy tính",
        "isCorrect": false
      }
    ]
  },
  {
    "id": "q-17",
    "code": "TH7-E-03",
    "content": "Giả sử ô A1 có giá trị 15, ô B1 có giá trị 25. Công thức =SUM(A1, B1, 10) sẽ cho kết quả là bao nhiêu?",
    "gradeLevel": 7,
    "topic": "Chủ đề 4: Ứng dụng tin học",
    "lessonTitle": "Bài 6: Các hàm tính toán thông dụng",
    "learningOutcome": "Vận dụng tính toán với hàm SUM",
    "difficulty": "HIEU",
    "type": "FILL_IN_BLANK",
    "explanation": "",
    "imageDriveUrl": "",
    "authorName": "Nguyễn Hữu Dũng",
    "createdBy": "user-1791601248284",
    "createdAt": "2025-10-10",
    "status": "ACTIVE",
    "correctAnswerText": "[x] Đáp án A | [ ] Đáp án B | [ ] Đáp án C | [ ] Đáp án D"
  },
  {
    "id": "q-18",
    "code": "TH7-F-01",
    "content": "Xét tính Đúng/Sai của các mệnh đề sau về thuật toán tìm kiếm tuần tự và tìm kiếm nhị phân:",
    "gradeLevel": 7,
    "topic": "Chủ đề 5: Giải quyết vấn đề với sự trợ giúp của máy tính",
    "lessonTitle": "Bài 7: Thuật toán tìm kiếm tuần tự và nhị phân",
    "learningOutcome": "So sánh thuật toán tìm kiếm tuần tự và nhị phân",
    "difficulty": "HIEU",
    "type": "TRUE_FALSE",
    "explanation": "Tìm kiếm nhị phân đòi hỏi mảng đã sắp xếp và nhanh hơn đáng kể so với tìm kiếm tuần tự.",
    "imageDriveUrl": "",
    "authorName": "Nguyễn Hữu Dũng",
    "createdBy": "user-1791601248284",
    "createdAt": "2025-10-10",
    "status": "ACTIVE",
    "trueFalseStatements": [
      {
        "id": "tf-62-1",
        "statement": "Đáp án A",
        "isCorrect": true
      },
      {
        "id": "tf-62-2",
        "statement": "Đáp án B",
        "isCorrect": false
      },
      {
        "id": "tf-62-3",
        "statement": "Đáp án C",
        "isCorrect": false
      },
      {
        "id": "tf-62-4",
        "statement": "Đáp án D",
        "isCorrect": false
      }
    ]
  },
  {
    "id": "q-19",
    "code": "TH8-A-01",
    "content": "Máy tính điện tử thế hệ thứ nhất sử dụng linh kiện điện tử chủ yếu nào?",
    "gradeLevel": 8,
    "topic": "Chủ đề 1: Máy tính và cộng đồng",
    "lessonTitle": "Bài 1: Lịch sử phát triển của máy tính",
    "learningOutcome": "Nhận biết các mốc phát triển công nghệ máy tính",
    "difficulty": "BIET",
    "type": "SINGLE_CHOICE",
    "explanation": "Thế hệ 1 dùng đèn điện tử chân không; thế hệ 2 dùng transistor; thế hệ 3 dùng IC; thế hệ 4 dùng vi xử lý.",
    "imageDriveUrl": "",
    "authorName": "Phan Quốc Bảo",
    "createdBy": "user-1791601248284",
    "createdAt": "2025-10-10",
    "status": "ACTIVE",
    "options": [
      {
        "id": "opt-63-1",
        "text": "Đèn điện tử chân không (Vacuum tube)",
        "isCorrect": true
      },
      {
        "id": "opt-63-2",
        "text": "Bóng bán dẫn (Transistor)",
        "isCorrect": false
      },
      {
        "id": "opt-63-3",
        "text": "Mạch tích hợp (IC)",
        "isCorrect": false
      },
      {
        "id": "opt-63-4",
        "text": "Bộ vi xử lý siêu lớn (VLSI)",
        "isCorrect": false
      }
    ]
  },
  {
    "id": "q-20",
    "code": "TH9-A-01",
    "content": "Trí tuệ nhân tạo (AI - Artificial Intelligence) mang lại những lợi ích gì nổi bật trong thời đại chuyển đổi số?",
    "gradeLevel": 9,
    "topic": "Chủ đề 1: Máy tính và cộng đồng",
    "lessonTitle": "Bài 1: Vai trò của máy tính trong đời sống",
    "learningOutcome": "Nhận biết ứng dụng và xu hướng AI",
    "difficulty": "BIET",
    "type": "MULTIPLE_CHOICE",
    "explanation": "AI hỗ trợ tự động hóa, phân tích dữ liệu, dịch thuật và nhận diện nhưng không thể thay thế sự rèn luyện tư duy của con người.",
    "imageDriveUrl": "",
    "authorName": "Lê Thị Mai",
    "createdBy": "user-1791601248284",
    "createdAt": "2025-10-10",
    "status": "ACTIVE",
    "options": [
      {
        "id": "opt-64-1",
        "text": "Tự động hóa các tác vụ lặp đi lặp lại với độ chính xác cao",
        "isCorrect": true
      },
      {
        "id": "opt-64-2",
        "text": "Phân tích dữ liệu lớn và hỗ trợ đưa ra quyết định",
        "isCorrect": true
      },
      {
        "id": "opt-64-3",
        "text": "Hỗ trợ dịch thuật ngôn ngữ và nhận diện khuôn mặt, giọng nói",
        "isCorrect": true
      },
      {
        "id": "opt-64-4",
        "text": "Thay thế hoàn toàn nhu cầu rèn luyện tư duy của con người",
        "isCorrect": false
      }
    ]
  }
];

export const INITIAL_TESTS: Test[] = [];

export const INITIAL_ASSIGNMENTS: Assignment[] = [];


export const INITIAL_SUBMISSIONS: Submission[] = [];
