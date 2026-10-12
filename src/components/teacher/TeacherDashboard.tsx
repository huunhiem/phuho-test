import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  HelpCircle,
  FileText,
  Send,
  Award,
  BarChart3,
  CheckCircle2,
  Clock,
  ArrowRight,
  User as UserIcon
} from 'lucide-react';
import { User } from '../../types';
import { LMSStorageService } from '../../services/storage';
import { onStorageChange } from '../../services/storageEvents';
import { NavTab } from '../Sidebar';
import { AccountProfileModal } from '../profile/AccountProfileModal';
import { UserAvatar } from '../common/UserAvatar';

interface TeacherDashboardProps {
  currentUser: User;
  onNavigate: (tab: NavTab) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ currentUser, onNavigate }) => {
  const [classes, setClasses] = useState(() => LMSStorageService.getClasses());
  const [questions, setQuestions] = useState(() => LMSStorageService.getQuestions());
  const [tests, setTests] = useState(() => LMSStorageService.getTests());
  const [assignments, setAssignments] = useState(() => LMSStorageService.getAssignments());
  const [submissions, setSubmissions] = useState(() => LMSStorageService.getSubmissions());
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    const unsub = onStorageChange(() => {
      setClasses(LMSStorageService.getClasses());
      setQuestions(LMSStorageService.getQuestions());
      setTests(LMSStorageService.getTests());
      setAssignments(LMSStorageService.getAssignments());
      setSubmissions(LMSStorageService.getSubmissions());
    });
    return () => unsub();
  }, []);

  const isPrivileged = currentUser.role === 'ADMIN' || currentUser.role === 'PRINCIPAL';
  const visibleClasses = LMSStorageService.getClassesForTeacher(currentUser);

  const uFull = (currentUser.fullName || '').toLowerCase().trim();
  const uUser = (currentUser.username || '').toLowerCase().trim();

  const visibleTests = isPrivileged
    ? tests
    : tests.filter((t) => {
        if (t.createdBy === currentUser.id) return true;
        const authName = (t.authorName || '').toLowerCase().trim();
        if (authName && (authName === uFull || authName === uUser || authName.includes(uFull) || uFull.includes(authName))) {
          return true;
        }
        return false;
      });

  const myClassNames = new Set(visibleClasses.map((c) => c.name));
  const myClassIds = new Set(visibleClasses.map((c) => c.id));

  const visibleAssignments = isPrivileged
    ? assignments
    : assignments.filter((a) => {
        if (a.assignedBy === currentUser.id) return true;
        const abName = (a.assignedByName || '').toLowerCase().trim();
        if (abName && (abName === uFull || abName === uUser || abName.includes(uFull) || uFull.includes(abName))) {
          return true;
        }
        if (a.classNames?.some((cn) => myClassNames.has(cn))) return true;
        if (a.classIds?.some((cid) => myClassIds.has(cid))) return true;
        return false;
      });

  const visibleAssignmentIds = new Set(visibleAssignments.map((a) => a.id));

  const visibleSubmissions = isPrivileged
    ? submissions
    : submissions.filter((s) => visibleAssignmentIds.has(s.assignmentId));

  const teacherQuestions = questions.filter((q) => q.createdBy === currentUser.id);
  const activeAssignments = visibleAssignments.filter((a) => a.status === 'ACTIVE');
  const pendingEssaySubs = visibleSubmissions.filter((s) => s.status === 'PENDING_ESSAY_GRADING');

  // Score distribution statistics
  let excellentCount = 0; // >= 8.0
  let goodCount = 0;      // 6.5 - 7.9
  let averageCount = 0;   // 5.0 - 6.4
  let belowCount = 0;     // < 5.0

  visibleSubmissions.forEach((s) => {
    if (s.score >= 8.0) excellentCount++;
    else if (s.score >= 6.5) goodCount++;
    else if (s.score >= 5.0) averageCount++;
    else belowCount++;
  });

  const totalSubs = visibleSubmissions.length || 1;
  const passRate = Math.round(((excellentCount + goodCount + averageCount) / totalSubs) * 100);

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="bg-linear-to-r from-indigo-700 to-indigo-900 rounded-2xl p-6 text-white shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <UserAvatar user={currentUser} size="lg" className="ring-4 ring-white/20 shadow-lg shrink-0" />
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-white/90 text-xs font-semibold mb-2 backdrop-blur-xs">
                <span>Tổ Tin học - Công nghệ</span>
                <span>·</span>
                <span>THCS Phú Hồ</span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight">Kính chào Thầy/Cô {currentUser.fullName}</h1>
              <p className="text-indigo-100 text-xs mt-1 max-w-xl">
                Hệ thống LMS Tin học THCS đã sẵn sàng cho năm học 2025-2026. Quản lý ngân hàng câu hỏi, tạo đề theo ma trận và giám sát kết quả học sinh.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setIsProfileOpen(true)}
              className="px-3.5 py-2 text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1.5"
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>Hồ sơ cá nhân</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('question_bank')}
              className="px-4 py-2 text-xs font-semibold bg-white text-indigo-900 hover:bg-indigo-50 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              + Soạn câu hỏi
            </button>
            <button
              type="button"
              onClick={() => onNavigate('test_builder')}
              className="px-4 py-2 text-xs font-semibold bg-indigo-600/80 hover:bg-indigo-600 text-white border border-indigo-400/30 rounded-lg transition-colors cursor-pointer"
            >
              + Tạo đề kiểm tra
            </button>
          </div>
        </div>
      </div>

      {/* Account Profile Modal */}
      <AccountProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        currentUser={currentUser}
        onUserUpdated={() => {
          setClasses(LMSStorageService.getClasses());
        }}
      />

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Ngân hàng câu hỏi</span>
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <HelpCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{questions.length}</span>
            <span className="text-xs text-slate-500">câu hỏi</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Thầy/Cô đã đóng góp: <strong className="text-indigo-600">{teacherQuestions.length}</strong> câu
          </div>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Đề kiểm tra</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{visibleTests.length}</span>
            <span className="text-xs text-slate-500">bộ đề</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Chuẩn ma trận Biết - Hiểu - Vận dụng
          </div>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Đang kiểm tra</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <Send className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{activeAssignments.length}</span>
            <span className="text-xs text-slate-500">đợt thi</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">Học sinh đang làm trực tuyến</div>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tỷ lệ Đạt (≥ 5.0)</span>
            <div className="p-2 rounded-lg bg-sky-50 text-sky-600">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{passRate}%</span>
            <span className="text-xs text-emerald-600 font-medium">({visibleSubmissions.length} bài nộp)</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            {pendingEssaySubs.length > 0 ? (
              <span className="text-amber-600 font-medium">Có {pendingEssaySubs.length} bài chờ chấm tự luận</span>
            ) : (
              'Đã chấm điểm đầy đủ'
            )}
          </div>
        </div>
      </div>

      {/* Grade distribution & Action cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Score Distribution Chart / Visual bars */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Phổ điểm kết quả kiểm tra</h2>
            <button
              type="button"
              onClick={() => onNavigate('results')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              <span>Xem chi tiết</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-emerald-700">Giỏi (8.0 - 10.0 điểm)</span>
                <span className="text-slate-600">
                  {excellentCount} bài ({Math.round((excellentCount / totalSubs) * 100)}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-emerald-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${(excellentCount / totalSubs) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-sky-700">Khá (6.5 - 7.9 điểm)</span>
                <span className="text-slate-600">
                  {goodCount} bài ({Math.round((goodCount / totalSubs) * 100)}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-sky-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${(goodCount / totalSubs) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-amber-700">Trung bình (5.0 - 6.4 điểm)</span>
                <span className="text-slate-600">
                  {averageCount} bài ({Math.round((averageCount / totalSubs) * 100)}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-amber-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${(averageCount / totalSubs) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-rose-700">Chưa đạt (Dưới 5.0 điểm)</span>
                <span className="text-slate-600">
                  {belowCount} bài ({Math.round((belowCount / totalSubs) * 100)}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-rose-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${(belowCount / totalSubs) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Teacher Navigation shortcuts */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
          <h2 className="text-base font-bold text-slate-900">Lối tắt nhanh</h2>

          <button
            type="button"
            onClick={() => onNavigate('question_bank')}
            className="w-full p-3 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 flex items-center justify-between text-left transition-colors group"
          >
            <div>
              <div className="font-semibold text-xs text-slate-900 group-hover:text-indigo-700">
                Ngân hàng 5 dạng câu hỏi
              </div>
              <div className="text-[11px] text-slate-500">Biết / Hiểu / Vận dụng · GDPT 2018</div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
          </button>

          <button
            type="button"
            onClick={() => onNavigate('test_builder')}
            className="w-full p-3 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 flex items-center justify-between text-left transition-colors group"
          >
            <div>
              <div className="font-semibold text-xs text-slate-900 group-hover:text-indigo-700">
                Tạo đề thi ma trận & Mã đề
              </div>
              <div className="text-[11px] text-slate-500">Tự động xáo trộn câu và đáp án (101, 102...)</div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
          </button>

          <button
            type="button"
            onClick={() => onNavigate('question_analysis')}
            className="w-full p-3 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 flex items-center justify-between text-left transition-colors group"
          >
            <div>
              <div className="font-semibold text-xs text-slate-900 group-hover:text-indigo-700">
                Phân tích câu hỏi (Item Analysis)
              </div>
              <div className="text-[11px] text-slate-500">Cảnh báo câu sai & nội dung cần củng cố</div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
          </button>
        </div>
      </div>
    </div>
  );
};
