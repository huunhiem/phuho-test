import React, { useState } from 'react';
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
  AlertTriangle
} from 'lucide-react';
import { Submission, Question, User } from '../../types';
import { LMSStorageService } from '../../services/storage';

interface ResultsAndGradingProps {
  currentUser: User;
}

export const ResultsAndGrading: React.FC<ResultsAndGradingProps> = ({ currentUser }) => {
  const [submissions, setSubmissions] = useState<Submission[]>(() => LMSStorageService.getSubmissions());
  const [questions] = useState<Question[]>(() => LMSStorageService.getQuestions());
  const [classes] = useState(() => LMSStorageService.getClasses());
  const [assignments] = useState(() => LMSStorageService.getAssignments());

  const [selectedAssignmentFilter, setSelectedAssignmentFilter] = useState<string>('ALL');
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('ALL');

  // Grading Modal for Essay / Detailed Review
  const [gradingSub, setGradingSub] = useState<Submission | null>(null);
  const [essayPoints, setEssayPoints] = useState<Record<string, number>>({});
  const [essayFeedback, setEssayFeedback] = useState<Record<string, string>>({});

  const refreshSubmissions = () => {
    setSubmissions(LMSStorageService.getSubmissions());
  };

  const filteredSubmissions = submissions.filter((s) => {
    const matchesAssign = selectedAssignmentFilter === 'ALL' || s.assignmentId === selectedAssignmentFilter;
    const matchesClass = selectedClassFilter === 'ALL' || s.classId === selectedClassFilter;
    return matchesAssign && matchesClass;
  });

  // Calculate statistics
  const totalCount = filteredSubmissions.length;
  const avgScore =
    totalCount > 0
      ? (filteredSubmissions.reduce((acc, s) => acc + s.score, 0) / totalCount).toFixed(1)
      : '0.0';
  const passedCount = filteredSubmissions.filter((s) => s.score >= 5.0).length;
  const passRate = totalCount > 0 ? Math.round((passedCount / totalCount) * 100) : 0;

  // Export to CSV
  const handleExportCSV = () => {
    const csvData = LMSStorageService.exportSubmissionsToCSV(
      selectedAssignmentFilter === 'ALL' ? undefined : selectedAssignmentFilter
    );
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `bang_diem_tin_hoc_thcs_phu_ho_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Open Grading Modal
  const handleOpenGrading = (sub: Submission) => {
    setGradingSub(sub);
    const initialPts: Record<string, number> = {};
    const initialFeed: Record<string, string> = {};

    Object.entries(sub.answers).forEach(([qId, ans]) => {
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
    const updatedAnswers = { ...gradingSub.answers };

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
    refreshSubmissions();
    setGradingSub(null);
  };

  return (
    <div className="space-y-6">
      {/* Title & Export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Kết quả kiểm tra & Chấm bài</h1>
          <p className="text-sm text-slate-500 mt-1">
            Theo dõi điểm số, chấm bài tự luận và xuất bảng điểm Excel cho các lớp - THCS Phú Hồ
          </p>
        </div>
        <button
          type="button"
          onClick={handleExportCSV}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors self-start"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Xuất bảng điểm (Excel/CSV)</span>
        </button>
      </div>

      {/* Summary KPI row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Số bài đã nộp</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{totalCount} bài</div>
          <div className="text-xs text-slate-400 mt-1">Đã được hệ thống ghi nhận</div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Điểm trung bình</div>
          <div className="text-2xl font-bold text-indigo-600 mt-1">{avgScore} / 10</div>
          <div className="text-xs text-slate-400 mt-1">Thang điểm chuẩn THCS</div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tỷ lệ Đạt (≥ 5.0)</div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">{passRate}%</div>
          <div className="text-xs text-slate-400 mt-1">{passedCount} học sinh đạt yêu cầu</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700">Lọc theo Đợt thi:</span>
          <select
            value={selectedAssignmentFilter}
            onChange={(e) => setSelectedAssignmentFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">Tất cả đợt thi</option>
            {assignments.map((a) => (
              <option key={a.id} value={a.id}>
                {a.testTitle}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700">Lọc theo Lớp:</span>
          <select
            value={selectedClassFilter}
            onChange={(e) => setSelectedClassFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">Tất cả các lớp</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                Lớp {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Submissions Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Học sinh</th>
                <th className="px-4 py-3">Lớp</th>
                <th className="px-4 py-3">Đề thi</th>
                <th className="px-4 py-3">Mã đề</th>
                <th className="px-4 py-3 text-center">Đúng / Tổng câu</th>
                <th className="px-4 py-3 text-center">Điểm số</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSubmissions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-400">
                    Chưa có bài nộp nào phù hợp với bộ lọc.
                  </td>
                </tr>
              ) : (
                filteredSubmissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3 font-semibold text-slate-900">
                      <div>{sub.studentName}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{sub.studentCode}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-700 font-medium">Lớp {sub.className}</td>
                    <td className="px-4 py-3 text-slate-700 max-w-xs truncate">{sub.testTitle}</td>
                    <td className="px-4 py-3 font-mono font-bold text-slate-600">{sub.variantCode}</td>
                    <td className="px-4 py-3 text-center text-slate-700 font-medium">
                      {sub.correctCount} / {sub.totalQuestions}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`font-bold px-2.5 py-1 rounded-md text-sm ${
                          sub.score >= 8.0
                            ? 'bg-emerald-100 text-emerald-800'
                            : sub.score >= 5.0
                            ? 'bg-sky-100 text-sky-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {sub.score.toFixed(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {sub.isViolationAutoSubmitted ? (
                        <span
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200"
                          title={sub.violationReason || 'Chuyển tab khi đang làm bài'}
                        >
                          <AlertTriangle className="w-3 h-3 text-rose-600" /> Vi phạm: Rời tab (Tự nộp)
                        </span>
                      ) : sub.status === 'COMPLETED' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" /> Đã hoàn thành
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          <Clock className="w-3 h-3" /> Chờ chấm tự luận
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleOpenGrading(sub)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-indigo-700 hover:bg-indigo-50 rounded border border-indigo-200 transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>{sub.status === 'PENDING_ESSAY_GRADING' ? 'Chấm bài' : 'Xem lại'}</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Grading / Detailed Review Modal */}
      {gradingSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-3xl p-6 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  Chi tiết bài làm: {gradingSub.studentName} (Lớp {gradingSub.className})
                </h3>
                <div className="text-xs text-slate-500">
                  {gradingSub.testTitle} · Mã đề: {gradingSub.variantCode} · Nộp lúc:{' '}
                  {new Date(gradingSub.submittedAt).toLocaleString('vi-VN')}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setGradingSub(null)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            {gradingSub.isViolationAutoSubmitted && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-900 flex items-start gap-2 shadow-2xs">
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
              {Object.entries(gradingSub.answers).map(([qId, ans], idx) => {
                const q = questions.find((item) => item.id === qId);
                if (!q) return null;

                const isEssay = q.type === 'ESSAY';

                return (
                  <div key={qId} className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">
                        Câu {idx + 1}: {q.content}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-200 text-slate-700">
                        {q.type === 'ESSAY' ? 'Tự luận' : 'Trắc nghiệm tự động'}
                      </span>
                    </div>

                    {/* Student response display */}
                    <div className="bg-white p-3 rounded border border-slate-200 text-slate-800">
                      <span className="font-semibold text-slate-500">Học sinh trả lời: </span>
                      {ans.textAnswer ? (
                        <div className="mt-1 whitespace-pre-wrap font-mono text-slate-900 bg-slate-50 p-2 rounded">
                          {ans.textAnswer}
                        </div>
                      ) : ans.selectedOptionId ? (
                        <span>
                          {q.options?.find((o) => o.id === ans.selectedOptionId)?.text || ans.selectedOptionId}
                        </span>
                      ) : ans.tfAnswers ? (
                        <div className="mt-1 space-y-1">
                          {Object.entries(ans.tfAnswers).map(([stId, val]) => (
                            <div key={stId}>
                              Ý {stId}: {val ? 'ĐÚNG' : 'SAI'}
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
                          className="w-20 px-2 py-1 rounded border border-slate-300 text-center font-bold text-slate-900"
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
                        className="w-full px-2.5 py-1 rounded border border-slate-200 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
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
                  className="px-3.5 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Đóng
                </button>
                <button
                  type="button"
                  onClick={handleSaveGrade}
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
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
