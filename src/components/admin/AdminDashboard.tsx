import React from 'react';
import {
  Users,
  GraduationCap,
  BookOpen,
  Layers,
  HelpCircle,
  FileText,
  CheckCircle2,
  TrendingUp,
  PlusCircle,
  FileSpreadsheet
} from 'lucide-react';
import { LMSStorageService } from '../../services/storage';
import { NavTab } from '../Sidebar';

interface AdminDashboardProps {
  onNavigate: (tab: NavTab) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const users = LMSStorageService.getUsers();
  const classes = LMSStorageService.getClasses();
  const questions = LMSStorageService.getQuestions();
  const tests = LMSStorageService.getTests();
  const assignments = LMSStorageService.getAssignments();
  const submissions = LMSStorageService.getSubmissions();

  const students = users.filter((u) => u.role === 'STUDENT');
  const teachers = users.filter((u) => u.role === 'TEACHER' || u.role === 'DEPARTMENT_HEAD');

  const totalClassesCount = classes.length;
  const totalSubmissions = submissions.length;
  const avgSchoolScore =
    submissions.length > 0
      ? (submissions.reduce((acc, s) => acc + s.score, 0) / submissions.length).toFixed(1)
      : '0.0';

  const grades = [6, 7, 8, 9];

  return (
    <div className="space-y-6">
      {/* Title & Quick actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Tổng quan Quản trị Hệ thống</h1>
          <p className="text-sm text-slate-500 mt-1">
            Quản lý tập trung học sinh, giáo viên, ngân hàng câu hỏi môn Tin học - Trường THCS Phú Hồ
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onNavigate('admin_import')}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors border border-indigo-200"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Import Excel</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('admin_users')}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Thêm tài khoản</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Học sinh</span>
            <div className="p-2 rounded-lg bg-sky-50 text-sky-600">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{students.length}</span>
            <span className="text-xs text-slate-500">tài khoản</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">Phân bố trên {totalClassesCount} lớp học</div>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Giáo viên Tin học</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{teachers.length}</span>
            <span className="text-xs text-slate-500">giáo viên</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">Tổ Tin học - Công nghệ</div>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Ngân hàng câu hỏi</span>
            <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
              <HelpCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{questions.length}</span>
            <span className="text-xs text-slate-500">câu hỏi</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">Chuẩn GDPT 2018 (Khối 6-9)</div>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Lượt làm bài</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{totalSubmissions}</span>
            <span className="text-xs text-emerald-600 font-medium">ĐTB: {avgSchoolScore}/10</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">{assignments.length} đợt kiểm tra đã tạo</div>
        </div>
      </div>

      {/* Breakdown by Grade */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 mb-4">Phân bố lớp và học sinh theo Khối</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {grades.map((gradeLevel) => {
            const gradeClasses = classes.filter((c) => c.name.startsWith(`${gradeLevel}/`));
            const totalStudentsInGrade = gradeClasses.reduce((acc, c) => acc + c.studentCount, 0);
            const gradeQuestions = questions.filter((q) => q.gradeLevel === gradeLevel);

            return (
              <div key={gradeLevel} className="p-4 rounded-lg bg-slate-50 border border-slate-200/80">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-slate-900 text-sm">Khối {gradeLevel}</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-100 text-indigo-700">
                    {gradeClasses.length} lớp
                  </span>
                </div>
                <div className="text-xs text-slate-600 space-y-1">
                  <div>Sĩ số: <strong className="text-slate-800">{totalStudentsInGrade}</strong> học sinh</div>
                  <div>Ngân hàng: <strong className="text-slate-800">{gradeQuestions.length}</strong> câu hỏi</div>
                  <div className="text-[11px] text-slate-500 truncate mt-1">
                    Lớp: {gradeClasses.map((c) => c.name).join(', ') || 'Chưa có'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* System info & Quick checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <h2 className="text-base font-bold text-slate-900 mb-3">Thông tin đơn vị & Niên khóa</h2>
          <div className="space-y-2.5 text-sm text-slate-600">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Đơn vị sử dụng:</span>
              <strong className="text-slate-900">Trường THCS Phú Hồ</strong>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Địa chỉ:</span>
              <span>Xã Phú Hồ, Huyện Phú Vang, Thừa Thiên Huế</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Năm học:</span>
              <span className="font-semibold text-indigo-600">2025 - 2026</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Môn học:</span>
              <span>Tin học 6, Tin học 7, Tin học 8, Tin học 9</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Kiến trúc sẵn sàng:</span>
              <span className="text-emerald-700 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Firestore & Gemini AI Ready
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <h2 className="text-base font-bold text-slate-900 mb-3">Trạng thái cấu hình & Module</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-100">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-medium text-emerald-900">Phân quyền 5 vai trò (RBAC)</span>
              </div>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                Hoạt động
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-100">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-medium text-emerald-900">Ngân hàng 5 dạng câu hỏi GDPT 2018</span>
              </div>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                Hoạt động
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-100">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-medium text-emerald-900">Phòng thi trực tuyến & Tự động chấm</span>
              </div>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                Hoạt động
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-indigo-50/60 border border-indigo-100">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-medium text-indigo-900">Đồng bộ Cloud Firestore & AI Gemini</span>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('firebase_guide')}
                className="text-[11px] font-semibold text-indigo-700 underline hover:text-indigo-900"
              >
                Xem chi tiết
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
