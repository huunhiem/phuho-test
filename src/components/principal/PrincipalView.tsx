import React from 'react';
import {
  Building2,
  Award,
  Users,
  BookOpen,
  TrendingUp,
  BarChart2,
  FileCheck,
  ShieldCheck
} from 'lucide-react';
import { LMSStorageService } from '../../services/storage';

export const PrincipalView: React.FC = () => {
  const users = LMSStorageService.getUsers();
  const classes = LMSStorageService.getClasses();
  const questions = LMSStorageService.getQuestions();
  const tests = LMSStorageService.getTests();
  const submissions = LMSStorageService.getSubmissions();

  const totalStudents = users.filter((u) => u.role === 'STUDENT').length;
  const totalTeachers = users.filter((u) => u.role === 'TEACHER' || u.role === 'DEPARTMENT_HEAD').length;

  const totalSubs = submissions.length || 1;
  const excellentSubs = submissions.filter((s) => s.score >= 8.0).length;
  const goodSubs = submissions.filter((s) => s.score >= 6.5 && s.score < 8.0).length;
  const avgSubs = submissions.filter((s) => s.score >= 5.0 && s.score < 6.5).length;
  const lowSubs = submissions.filter((s) => s.score < 5.0).length;

  const schoolAvg = (submissions.reduce((acc, s) => acc + s.score, 0) / totalSubs).toFixed(1);
  const passRate = Math.round(((totalSubs - lowSubs) / totalSubs) * 100);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Báo cáo Chất lượng Môn Tin học · BGH & Tổ Chuyên môn
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Số liệu thống kê toàn trường theo Thông tư 22/2021/TT-BGDĐT - Trường THCS Phú Hồ
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-50 text-purple-700 text-xs font-semibold border border-purple-200">
            <ShieldCheck className="w-4 h-4 text-purple-600" />
            <span>Năm học 2025 - 2026</span>
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Điểm TB toàn trường</div>
          <div className="text-2xl font-extrabold text-indigo-700 mt-2">{schoolAvg} / 10</div>
          <div className="text-xs text-slate-400 mt-1">Dựa trên {submissions.length} lượt kiểm tra</div>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tỷ lệ Đạt (≥ 5.0)</div>
          <div className="text-2xl font-extrabold text-emerald-600 mt-2">{passRate}%</div>
          <div className="text-xs text-slate-400 mt-1">Đạt chỉ tiêu kế hoạch năm học</div>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Quy mô học sinh</div>
          <div className="text-2xl font-extrabold text-slate-900 mt-2">{totalStudents}</div>
          <div className="text-xs text-slate-400 mt-1">Phân bố tại {classes.length} lớp học</div>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Ngân hàng câu hỏi</div>
          <div className="text-2xl font-extrabold text-purple-700 mt-2">{questions.length} câu</div>
          <div className="text-xs text-slate-400 mt-1">Chuẩn ma trận GDPT 2018</div>
        </div>
      </div>

      {/* Grade Comparison Table */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900">
          Chất lượng học tập môn Tin học phân theo Khối (Khối 6, 7, 8, 9)
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Khối</th>
                <th className="px-4 py-3">Số lớp</th>
                <th className="px-4 py-3 text-center">Giỏi (≥ 8.0)</th>
                <th className="px-4 py-3 text-center">Khá (6.5 - 7.9)</th>
                <th className="px-4 py-3 text-center">Đạt (5.0 - 6.4)</th>
                <th className="px-4 py-3 text-center">Chưa đạt (&lt; 5.0)</th>
                <th className="px-4 py-3 text-right">Tỷ lệ Đạt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[6, 7, 8, 9].map((g) => {
                const gradeClasses = classes.filter((c) => c.name.startsWith(`${g}/`));
                const gradeSubs = submissions.filter((s) => s.gradeLevel === g);
                const gTotal = gradeSubs.length || 1;

                const gEx = gradeSubs.filter((s) => s.score >= 8.0).length;
                const gGood = gradeSubs.filter((s) => s.score >= 6.5 && s.score < 8.0).length;
                const gAvg = gradeSubs.filter((s) => s.score >= 5.0 && s.score < 6.5).length;
                const gLow = gradeSubs.filter((s) => s.score < 5.0).length;
                const gPassRate = Math.round(((gTotal - gLow) / gTotal) * 100);

                return (
                  <tr key={g} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-bold text-slate-900">Khối {g}</td>
                    <td className="px-4 py-3 text-slate-600">{gradeClasses.length} lớp</td>
                    <td className="px-4 py-3 text-center text-emerald-700 font-semibold">
                      {gEx} ({Math.round((gEx / gTotal) * 100)}%)
                    </td>
                    <td className="px-4 py-3 text-center text-sky-700 font-semibold">
                      {gGood} ({Math.round((gGood / gTotal) * 100)}%)
                    </td>
                    <td className="px-4 py-3 text-center text-amber-700 font-semibold">
                      {gAvg} ({Math.round((gAvg / gTotal) * 100)}%)
                    </td>
                    <td className="px-4 py-3 text-center text-rose-700 font-semibold">
                      {gLow} ({Math.round((gLow / gTotal) * 100)}%)
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="font-extrabold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                        {gradeSubs.length > 0 ? `${gPassRate}%` : '100%'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
