import React, { useState, useEffect, useMemo } from 'react';
import {
  Award,
  Download,
  Filter,
  CheckCircle2,
  Clock,
  Edit3,
  Eye,
  FileSpreadsheet,
  AlertCircle,
  AlertTriangle,
  UserX,
  Users,
  Search,
  Check,
  TrendingUp,
  FileText
} from 'lucide-react';
import { Submission, Question, User, Assignment, Test, ClassRoom } from '../../types';
import { LMSStorageService } from '../../services/storage';
import { onStorageChange } from '../../services/storageEvents';

interface ResultsAndGradingProps {
  currentUser: User;
}

export const ResultsAndGrading: React.FC<ResultsAndGradingProps> = ({ currentUser }) => {
  const [submissions, setSubmissions] = useState<Submission[]>(() => LMSStorageService.getSubmissions());
  const [questions, setQuestions] = useState<Question[]>(() => LMSStorageService.getQuestions());
  const [classes, setClasses] = useState<ClassRoom[]>(() => LMSStorageService.getClasses());
  const [assignments, setAssignments] = useState<Assignment[]>(() => LMSStorageService.getAssignments());
  const [tests, setTests] = useState<Test[]>(() => LMSStorageService.getTests());
  const [users, setUsers] = useState<User[]>(() => LMSStorageService.getUsers());

  // Filter states
  const [selectedAssignmentFilter, setSelectedAssignmentFilter] = useState<string>('ALL');
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('ALL');
  const [activeTabFilter, setActiveTabFilter] = useState<'ALL' | 'PARTICIPATED' | 'NOT_PARTICIPATED'>('ALL');
  const [searchStudentQuery, setSearchStudentQuery] = useState<string>('');

  // Grading Modal for Essay / Detailed Review
  const [gradingSub, setGradingSub] = useState<Submission | null>(null);
  const [essayPoints, setEssayPoints] = useState<Record<string, number>>({});
  const [essayFeedback, setEssayFeedback] = useState<Record<string, string>>({});

  const refreshData = () => {
    setSubmissions(LMSStorageService.getSubmissions());
    setQuestions(LMSStorageService.getQuestions());
    setClasses(LMSStorageService.getClasses());
    setAssignments(LMSStorageService.getAssignments());
    setTests(LMSStorageService.getTests());
    setUsers(LMSStorageService.getUsers());
  };

  useEffect(() => {
    const unsub = onStorageChange((entity) => {
      if (['submissions', 'assignments', 'tests', 'users', 'classes', 'all'].includes(entity)) {
        refreshData();
      }
    });
    return () => unsub();
  }, []);

  // Compute detailed participation report using LMSStorageService
  const report = useMemo(() => {
    return LMSStorageService.getExamParticipationReport({
      assignmentId: selectedAssignmentFilter,
      classId: selectedClassFilter
    });
  }, [selectedAssignmentFilter, selectedClassFilter, submissions, assignments, tests, users, classes]);

  // Filter roster by student search query and active tab
  const filteredRoster = useMemo(() => {
    let list = report.allRoster;

    if (activeTabFilter === 'PARTICIPATED') {
      list = list.filter((item) => item.participated);
    } else if (activeTabFilter === 'NOT_PARTICIPATED') {
      list = list.filter((item) => !item.participated);
    }

    if (searchStudentQuery.trim()) {
      const q = searchStudentQuery.trim().toLowerCase();
      list = list.filter(
        (item) =>
          item.fullName.toLowerCase().includes(q) ||
          item.studentCode.toLowerCase().includes(q) ||
          item.className.toLowerCase().includes(q)
      );
    }

    return list;
  }, [report.allRoster, activeTabFilter, searchStudentQuery]);

  // Export to CSV/Excel
  const handleExportCSV = () => {
    const csvData = LMSStorageService.exportExamParticipationCSV({
      assignmentId: selectedAssignmentFilter,
      classId: selectedClassFilter
    });
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const fileNameSuffix = selectedAssignmentFilter !== 'ALL' ? selectedAssignmentFilter : 'tat_ca_de_thi';
    link.setAttribute('download', `ket_qua_kiem_tra_thcs_phu_ho_${fileNameSuffix}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Open Grading Modal
  const handleOpenGrading = (sub: Submission) => {
    setGradingSub(sub);
    const initialPts: Record<string, number> = {};
    const initialFeed: Record<string, string> = {};

    Object.entries(sub.answers || {}).forEach(([qId, ans]) => {
      initialPts[qId] = ans.pointsEarned || 0;
      initialFeed[qId] = ans.teacherComment || '';
    });

    setEssayPoints(initialPts);
    setEssayFeedback(initialFeed);
  };

  // Save Manual Grade
  const handleSaveGrade = () => {
    if (!gradingSub) return;

    let newTotalScore = 0;
    const updatedAnswers = { ...(gradingSub.answers || {}) };

    Object.entries(essayPoints).forEach(([qId, pts]) => {
      if (updatedAnswers[qId]) {
        updatedAnswers[qId].pointsEarned = pts;
        updatedAnswers[qId].teacherComment = essayFeedback[qId] || '';
      }
      newTotalScore += Number(pts);
    });

    const updatedSub: Submission = {
      ...gradingSub,
      answers: updatedAnswers,
      score: Math.min(10, Math.round(newTotalScore * 10) / 10),
      status: 'COMPLETED',
      gradedBy: currentUser.fullName,
      gradedAt: new Date().toISOString()
    };

    LMSStorageService.updateSubmission(updatedSub);
    refreshData();
    setGradingSub(null);
  };

  const getRatingBadge = (score: number) => {
    if (score >= 8.5) {
      return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">Giỏi</span>;
    }
    if (score >= 6.5) {
      return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-sky-100 text-sky-800 border border-sky-200">Khá</span>;
    }
    if (score >= 5.0) {
      return <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-amber-100 text-amber-800 border border-amber-200">Đạt</span>;
    }
    return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-200">Chưa đạt</span>;
  };

  return (
    <div className="space-y-6">
      {/* Title & Export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-1">
            <Award className="w-3.5 h-3.5" />
            <span>Giám sát kiểm tra & Đánh giá học sinh</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Kết quả kiểm tra & Tình hình tham gia</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Theo dõi chi tiết kết quả từng đề thi, thống kê danh sách học sinh đã tham gia và chưa tham gia - THCS Phú Hồ
          </p>
        </div>
        <button
          type="button"
          onClick={handleExportCSV}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg shadow-2xs transition-colors self-start cursor-pointer"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
          <span>Xuất Báo cáo & Bảng điểm (Excel)</span>
        </button>
      </div>

      {/* Selectors and Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-end">
          {/* Select Exam / Assignment */}
          <div className="md:col-span-6 space-y-1">
            <label className="block text-xs font-semibold text-slate-700">
              Chọn Đề thi / Đợt kiểm tra:
            </label>
            <select
              value={selectedAssignmentFilter}
              onChange={(e) => {
                setSelectedAssignmentFilter(e.target.value);
                setSelectedClassFilter('ALL');
              }}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white text-slate-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            >
              <option value="ALL">📋 Tất cả các bài kiểm tra & đợt thi trong hệ thống</option>
              {assignments.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.testTitle} — Khối {a.gradeLevel} (Lớp: {a.classNames.join(', ')})
                </option>
              ))}
            </select>
          </div>

          {/* Select Class */}
          <div className="md:col-span-3 space-y-1">
            <label className="block text-xs font-semibold text-slate-700">
              Lọc theo Lớp học:
            </label>
            <select
              value={selectedClassFilter}
              onChange={(e) => setSelectedClassFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white text-slate-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            >
              <option value="ALL">🏫 Tất cả các lớp được giao</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  Lớp {c.name} ({c.studentCount} HS)
                </option>
              ))}
            </select>
          </div>

          {/* Search student */}
          <div className="md:col-span-3 space-y-1">
            <label className="block text-xs font-semibold text-slate-700">
              Tìm kiếm học sinh:
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm họ tên, mã HS..."
                value={searchStudentQuery}
                onChange={(e) => setSearchStudentQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Selected exam info summary banner */}
        <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-indigo-900">Đang xem:</span>
            <span className="font-semibold text-slate-800">{report.targetTitle}</span>
            {report.assignedClasses.length > 0 && (
              <span className="text-slate-500">
                · Các lớp: {report.assignedClasses.map((c) => `Lớp ${c}`).join(', ')}
              </span>
            )}
          </div>
          <div className="text-indigo-700 font-medium">
            Khối lớp: <strong>Khối {report.targetGrade}</strong>
          </div>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* Tổng HS */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Tổng học sinh</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1">{report.stats.totalAssigned}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Trong diện kiểm tra</div>
        </div>

        {/* Đã tham gia */}
        <div className="p-4 bg-white rounded-2xl border border-emerald-200 shadow-xs bg-emerald-50/20">
          <div className="flex items-center justify-between text-emerald-700 text-xs font-semibold">
            <span>Đã tham gia</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700 mt-1">
            {report.stats.participatedCount}
          </div>
          <div className="text-[11px] font-semibold text-emerald-600 mt-0.5">
            Đạt {report.stats.participatedRate}% danh sách
          </div>
        </div>

        {/* Chưa tham gia */}
        <div className="p-4 bg-white rounded-2xl border border-amber-200 shadow-xs bg-amber-50/20">
          <div className="flex items-center justify-between text-amber-700 text-xs font-semibold">
            <span>Chưa tham gia</span>
            <UserX className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-700 mt-1">
            {report.stats.notParticipatedCount}
          </div>
          <div className="text-[11px] font-semibold text-amber-600 mt-0.5">
            Chiếm {report.stats.totalAssigned > 0 ? 100 - report.stats.participatedRate : 0}% danh sách
          </div>
        </div>

        {/* Điểm trung bình */}
        <div className="p-4 bg-white rounded-2xl border border-indigo-200 shadow-xs bg-indigo-50/20">
          <div className="flex items-center justify-between text-indigo-700 text-xs font-semibold">
            <span>Điểm trung bình</span>
            <TrendingUp className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-indigo-700 mt-1">
            {report.stats.avgScore} <span className="text-xs font-normal text-slate-500">/ 10</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Thang điểm 10 THCS</div>
        </div>

        {/* Tỷ lệ Đạt */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Tỷ lệ Đạt (≥ 5.0)</span>
            <Award className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1">{report.stats.passRate}%</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Học sinh đạt yêu cầu</div>
        </div>

        {/* Vi phạm */}
        <div className="p-4 bg-white rounded-2xl border border-rose-200 shadow-xs bg-rose-50/20">
          <div className="flex items-center justify-between text-rose-700 text-xs font-semibold">
            <span>Vi phạm nội quy</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-black text-rose-700 mt-1">
            {report.stats.violationCount}
          </div>
          <div className="text-[11px] font-semibold text-rose-600 mt-0.5">Rời tab (Tự nộp)</div>
        </div>
      </div>

      {/* Roster Tabs Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-2">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setActiveTabFilter('ALL')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTabFilter === 'ALL'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span>Tất cả học sinh</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20 text-current">
              {report.stats.totalAssigned}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTabFilter('PARTICIPATED')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTabFilter === 'PARTICIPATED'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Đã tham gia kiểm tra</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-700 text-white">
              {report.stats.participatedCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTabFilter('NOT_PARTICIPATED')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTabFilter === 'NOT_PARTICIPATED'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
            }`}
          >
            <UserX className="w-3.5 h-3.5" />
            <span>Chưa tham gia (Vắng thi)</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-700 text-white">
              {report.stats.notParticipatedCount}
            </span>
          </button>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Hiển thị <strong>{filteredRoster.length}</strong> học sinh
        </div>
      </div>

      {/* Main Table: Shows both Participated and Not-Participated Roster */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-3.5 py-3 text-center w-12">STT</th>
                <th className="px-4 py-3">Họ và tên học sinh</th>
                <th className="px-3.5 py-3">Lớp</th>
                <th className="px-3.5 py-3">Trạng thái tham gia</th>
                <th className="px-3.5 py-3 text-center">Mã đề con</th>
                <th className="px-3.5 py-3 text-center">Đúng/Tổng</th>
                <th className="px-3.5 py-3 text-center">Điểm số</th>
                <th className="px-3.5 py-3 text-center">Xếp loại</th>
                <th className="px-4 py-3">Thời gian nộp bài</th>
                <th className="px-4 py-3 text-right">Chi tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRoster.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-12 text-center text-slate-400">
                    <UserX className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <div>Không tìm thấy học sinh nào phù hợp với bộ lọc hiện tại.</div>
                  </td>
                </tr>
              ) : (
                filteredRoster.map((item, idx) => {
                  const hasParticipated = item.participated && item.submission;
                  const sub = item.submission;

                  return (
                    <tr
                      key={item.id + (sub ? sub.id : '-unsubmitted')}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        !hasParticipated ? 'bg-amber-50/20' : ''
                      }`}
                    >
                      {/* STT */}
                      <td className="px-3.5 py-3 text-center text-slate-400 font-mono">
                        {idx + 1}
                      </td>

                      {/* Họ tên và Mã HS */}
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-900">{item.fullName}</div>
                        <div className="text-[11px] text-slate-400 font-mono font-medium">
                          {item.studentCode}
                        </div>
                      </td>

                      {/* Lớp */}
                      <td className="px-3.5 py-3">
                        <span className="font-semibold text-slate-800 px-2 py-0.5 rounded bg-slate-100 text-[11px]">
                          Lớp {item.className}
                        </span>
                      </td>

                      {/* Trạng thái tham gia */}
                      <td className="px-3.5 py-3">
                        {hasParticipated ? (
                          sub?.isViolationAutoSubmitted ? (
                            <span
                              className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200"
                              title={sub.violationReason || 'Chuyển tab khi đang làm bài'}
                            >
                              <AlertTriangle className="w-3 h-3 text-rose-600" />
                              <span>Vi phạm: Rời tab (Tự nộp)</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>Đã tham gia</span>
                            </span>
                          )
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-300">
                            <Clock className="w-3 h-3 text-amber-600" />
                            <span>Chưa tham gia (Vắng)</span>
                          </span>
                        )}
                      </td>

                      {/* Mã đề con */}
                      <td className="px-3.5 py-3 text-center">
                        {sub ? (
                          <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded text-[11px] border border-indigo-100">
                            {sub.variantCode}
                          </span>
                        ) : (
                          <span className="text-slate-300 font-mono">-</span>
                        )}
                      </td>

                      {/* Đúng / Tổng câu */}
                      <td className="px-3.5 py-3 text-center">
                        {sub ? (
                          <span className="font-semibold text-slate-700">
                            {sub.correctCount} / {sub.totalQuestions}
                          </span>
                        ) : (
                          <span className="text-slate-300">-</span>
                        )}
                      </td>

                      {/* Điểm số */}
                      <td className="px-3.5 py-3 text-center">
                        {sub ? (
                          <span
                            className={`font-black text-sm px-2.5 py-1 rounded-lg ${
                              sub.score >= 8.0
                                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                : sub.score >= 5.0
                                ? 'bg-sky-100 text-sky-900 border border-sky-300'
                                : 'bg-rose-100 text-rose-900 border border-rose-300'
                            }`}
                          >
                            {sub.score.toFixed(1)}
                          </span>
                        ) : (
                          <span className="text-slate-300 font-bold">-</span>
                        )}
                      </td>

                      {/* Xếp loại */}
                      <td className="px-3.5 py-3 text-center">
                        {sub ? getRatingBadge(sub.score) : <span className="text-slate-300">-</span>}
                      </td>

                      {/* Thời gian nộp bài */}
                      <td className="px-4 py-3 text-slate-600 text-[11px]">
                        {sub ? (
                          <div>
                            <div>{new Date(sub.submittedAt).toLocaleTimeString('vi-VN')}</div>
                            <div className="text-slate-400">
                              {new Date(sub.submittedAt).toLocaleDateString('vi-VN')}
                            </div>
                          </div>
                        ) : (
                          <span className="italic text-slate-400">Chưa nộp bài</span>
                        )}
                      </td>

                      {/* Thao tác */}
                      <td className="px-4 py-3 text-right">
                        {sub ? (
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => handleOpenGrading(sub)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-slate-700 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 font-semibold transition-colors cursor-pointer"
                              title="Xem chi tiết bài làm & Chấm điểm"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Xem bài</span>
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-amber-600 font-medium italic">
                            Chưa có dữ liệu
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grading Modal for Essay / Detailed Review */}
      {gradingSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl p-6 max-h-[90vh] overflow-y-auto space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between border-b border-slate-200 pb-3">
              <div>
                <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                  Chi tiết bài nộp & Chấm bài
                </div>
                <h2 className="text-lg font-bold text-slate-900">{gradingSub.testTitle}</h2>
                <div className="text-xs text-slate-500 mt-1 flex flex-wrap gap-2">
                  <span>Học sinh: <strong>{gradingSub.studentName}</strong> ({gradingSub.studentCode})</span>
                  <span>·</span>
                  <span>Lớp: <strong>{gradingSub.className}</strong></span>
                  <span>·</span>
                  <span>Mã đề con: <strong>{gradingSub.variantCode}</strong></span>
                  <span>·</span>
                  <span>Điểm hiện tại: <strong className="text-indigo-600 text-sm">{gradingSub.score.toFixed(1)}/10</strong></span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setGradingSub(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            {/* Violation Alert Banner in Modal */}
            {gradingSub.isViolationAutoSubmitted && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <div className="font-bold text-rose-800">
                    Cảnh báo vi phạm nội quy: Bài làm này đã bị hệ thống tự động thu hồi & nộp bài!
                  </div>
                  <div className="text-rose-700 font-medium">
                    Lý do: {gradingSub.violationReason || 'Học sinh chuyển tab hoặc rời khỏi cửa sổ phòng thi trong khi đang làm bài.'}
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4 text-xs">
              {Object.entries(gradingSub.answers || {}).map(([qId, ans], idx) => {
                const q = questions.find((item) => item.id === qId);
                if (!q) return null;

                const isEssay = q.type === 'ESSAY';

                return (
                  <div key={qId} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">
                        Câu {idx + 1}: {q.content}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-200 text-slate-700">
                        {q.type === 'ESSAY' ? 'Tự luận' : 'Trắc nghiệm tự động'}
                      </span>
                    </div>

                    {/* Student response display */}
                    <div className="bg-white p-3 rounded-lg border border-slate-200 text-slate-800">
                      <span className="font-semibold text-slate-500">Học sinh trả lời: </span>
                      {ans.textAnswer ? (
                        <div className="mt-1 whitespace-pre-wrap font-mono text-slate-900 bg-slate-50 p-2 rounded">
                          {ans.textAnswer}
                        </div>
                      ) : ans.selectedOptionId ? (
                        <span className="font-medium text-slate-900">
                          {q.options?.find((o) => o.id === ans.selectedOptionId)?.text || ans.selectedOptionId}
                        </span>
                      ) : ans.tfAnswers ? (
                        <div className="mt-1 space-y-1">
                          {Object.entries(ans.tfAnswers).map(([stId, val]) => (
                            <div key={stId}>
                              Ý {stId}: <strong>{val ? 'ĐÚNG' : 'SAI'}</strong>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="italic text-slate-400">Không trả lời</span>
                      )}
                    </div>

                    {/* Teacher grading control for this question */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-200">
                      {isEssay && q.essaySampleAnswer && (
                        <div className="text-[11px] text-indigo-700 max-w-md">
                          <strong>Gợi ý đáp án:</strong> {q.essaySampleAnswer}
                        </div>
                      )}

                      <div className="flex items-center gap-3 ml-auto">
                        <label className="font-semibold text-slate-700">Điểm cho câu này:</label>
                        <input
                          type="number"
                          step="0.25"
                          min="0"
                          max="10"
                          value={essayPoints[qId] ?? ans.pointsEarned}
                          onChange={(e) => setEssayPoints({ ...essayPoints, [qId]: Number(e.target.value) })}
                          className="w-20 px-2 py-1 rounded-lg border border-slate-300 text-center font-bold text-slate-900 bg-white"
                        />
                      </div>
                    </div>

                    {/* Teacher Feedback */}
                    <div>
                      <input
                        type="text"
                        placeholder="Nhận xét của giáo viên cho câu này (tùy chọn)..."
                        value={essayFeedback[qId] ?? ''}
                        onChange={(e) => setEssayFeedback({ ...essayFeedback, [qId]: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-200">
              <div className="text-xs text-slate-500">
                Chấm bởi: <strong>{currentUser.fullName}</strong>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setGradingSub(null)}
                  className="px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Đóng
                </button>
                <button
                  type="button"
                  onClick={handleSaveGrade}
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs"
                >
                  Lưu kết quả & Hoàn tất chấm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
