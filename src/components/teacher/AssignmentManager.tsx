import React, { useState } from 'react';
import {
  Send,
  Plus,
  Calendar,
  Clock,
  Lock,
  CheckCircle2,
  Trash2,
  Users,
  Award,
  Eye,
  FileSpreadsheet,
  UserX,
  AlertTriangle,
  ArrowRight,
  Search
} from 'lucide-react';
import { Assignment, Test, User, ClassRoom } from '../../types';
import { LMSStorageService } from '../../services/storage';
import { ConfirmDialog } from '../common/ConfirmDialog';

interface AssignmentManagerProps {
  currentUser: User;
}

export const AssignmentManager: React.FC<AssignmentManagerProps> = ({ currentUser }) => {
  const [assignments, setAssignments] = useState<Assignment[]>(() => LMSStorageService.getAssignments());
  const [tests] = useState<Test[]>(() => LMSStorageService.getTests());
  const [classes] = useState<ClassRoom[]>(() => LMSStorageService.getClasses());

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteAssignId, setDeleteAssignId] = useState<string | null>(null);

  // Modal xem kết quả từng đề thi & học sinh tham gia / chưa tham gia
  const [viewResultAssign, setViewResultAssign] = useState<Assignment | null>(null);
  const [resultModalTab, setResultModalTab] = useState<'ALL' | 'PARTICIPATED' | 'NOT_PARTICIPATED'>('ALL');
  const [resultSearchQuery, setResultSearchQuery] = useState('');

  const [formData, setFormData] = useState({
    testId: tests[0]?.id || '',
    selectedClassIds: ['cls-6-1'],
    startTime: new Date().toISOString().slice(0, 16),
    endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    password: '',
    allowReviewAfterSubmit: true,
    shuffleQuestions: true
  });

  const refreshAssignments = () => {
    setAssignments(LMSStorageService.getAssignments());
  };

  const handleOpenAdd = () => {
    setFormData({
      testId: tests[0]?.id || '',
      selectedClassIds: [classes[0]?.id || 'cls-6-1'],
      startTime: new Date().toISOString().slice(0, 16),
      endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
      password: '',
      allowReviewAfterSubmit: true,
      shuffleQuestions: true
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const test = tests.find((t) => t.id === formData.testId);
    if (!test || formData.selectedClassIds.length === 0) return;

    const classNames = classes
      .filter((c) => formData.selectedClassIds.includes(c.id))
      .map((c) => c.name);

    const newAssignment: Assignment = {
      id: `assign-${Date.now()}`,
      testId: test.id,
      testTitle: test.title,
      gradeLevel: test.gradeLevel,
      classIds: formData.selectedClassIds,
      classNames,
      startTime: formData.startTime,
      endTime: formData.endTime,
      password: formData.password || undefined,
      allowReviewAfterSubmit: formData.allowReviewAfterSubmit,
      shuffleQuestions: formData.shuffleQuestions,
      status: 'ACTIVE',
      assignedBy: currentUser.id,
      assignedByName: currentUser.fullName,
      createdAt: new Date().toISOString().split('T')[0]
    };

    LMSStorageService.addAssignment(newAssignment);
    refreshAssignments();
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setDeleteAssignId(id);
  };

  const confirmDeleteAssignment = () => {
    if (deleteAssignId) {
      LMSStorageService.deleteAssignment(deleteAssignId);
      refreshAssignments();
      setDeleteAssignId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Giao bài kiểm tra cho Lớp</h1>
          <p className="text-sm text-slate-500 mt-1">
            Lên lịch thi trực tuyến, đặt hạn nộp bài và chỉ định các lớp làm bài kiểm tra Tin học
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors self-start"
        >
          <Send className="w-4 h-4" />
          <span>Giao bài mới</span>
        </button>
      </div>

      {/* Assignment List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {assignments.length === 0 ? (
          <div className="col-span-full p-8 text-center bg-white rounded-xl border border-slate-200 text-slate-400 text-xs">
            Chưa có đợt kiểm tra nào được giao. Bấm "Giao bài mới" để bắt đầu.
          </div>
        ) : (
          assignments.map((item) => (
            <div key={item.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Đang mở
                    </span>
                    <span className="text-xs text-slate-400">·</span>
                    <span className="text-xs font-semibold text-indigo-600">Khối {item.gradeLevel}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">{item.testTitle}</h3>
                </div>

                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                  title="Hủy giao bài"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2 text-xs border-t border-slate-100 pt-3 text-slate-600">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>Lớp được giao:</span>
                  </span>
                  <div className="flex items-center gap-1">
                    {item.classNames.map((cn) => (
                      <span key={cn} className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-semibold text-[11px]">
                        Lớp {cn}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Hạn nộp bài:</span>
                  </span>
                  <span className="font-medium text-slate-800">
                    {new Date(item.endTime).toLocaleString('vi-VN')}
                  </span>
                </div>

                {item.password && (
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Mật khẩu phòng thi:</span>
                    </span>
                    <span className="font-mono font-bold text-slate-800">{item.password}</span>
                  </div>
                )}
              </div>

              {/* Tình hình học sinh tham gia / chưa tham gia */}
              {(() => {
                const rep = LMSStorageService.getExamParticipationReport({ assignmentId: item.id });
                return (
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-700">Tình hình học sinh làm bài:</span>
                      <span className="text-indigo-600 font-bold">{rep.stats.participatedRate}%</span>
                    </div>

                    <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden flex">
                      <div
                        className="bg-emerald-500 h-full"
                        style={{ width: `${rep.stats.participatedRate}%` }}
                      />
                      <div
                        className="bg-amber-400 h-full"
                        style={{ width: `${100 - rep.stats.participatedRate}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Đã nộp: {rep.stats.participatedCount} HS
                      </span>
                      <span className="text-amber-700 font-semibold flex items-center gap-1">
                        <UserX className="w-3 h-3" />
                        Chưa nộp: {rep.stats.notParticipatedCount} HS
                      </span>
                      <span className="text-slate-500">
                        Điểm TB: <strong className="text-indigo-600">{rep.stats.avgScore}</strong>
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setViewResultAssign(item);
                        setResultModalTab('ALL');
                        setResultSearchQuery('');
                      }}
                      className="w-full mt-1.5 py-1.5 px-3 rounded-lg text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <Award className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Xem kết quả & Học sinh tham gia</span>
                    </button>
                  </div>
                );
              })()}

              <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-100 flex justify-between">
                <span>Người giao: {item.assignedByName}</span>
                <span>{item.allowReviewAfterSubmit ? 'Cho xem đáp án sau nộp' : 'Ẩn đáp án'}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Xem kết quả từng đề thi & Học sinh tham gia / Chưa tham gia */}
      {viewResultAssign && (() => {
        const modalReport = LMSStorageService.getExamParticipationReport({
          assignmentId: viewResultAssign.id
        });

        let list = modalReport.allRoster;
        if (resultModalTab === 'PARTICIPATED') {
          list = list.filter((i) => i.participated);
        } else if (resultModalTab === 'NOT_PARTICIPATED') {
          list = list.filter((i) => !i.participated);
        }

        if (resultSearchQuery.trim()) {
          const q = resultSearchQuery.trim().toLowerCase();
          list = list.filter(
            (i) =>
              i.fullName.toLowerCase().includes(q) ||
              i.studentCode.toLowerCase().includes(q) ||
              i.className.toLowerCase().includes(q)
          );
        }

        const handleModalExport = () => {
          const csv = LMSStorageService.exportExamParticipationCSV({
            assignmentId: viewResultAssign.id
          });
          const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `ket_qua_${viewResultAssign.id}_${new Date().toISOString().slice(0, 10)}.csv`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        };

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl p-6 max-h-[92vh] overflow-y-auto space-y-4 animate-in fade-in zoom-in-95">
              <div className="flex items-start justify-between border-b border-slate-200 pb-3">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-[11px] font-semibold mb-1">
                    <Award className="w-3.5 h-3.5" />
                    <span>Kết quả đợt kiểm tra</span>
                  </div>
                  <h2 className="text-lg font-bold text-slate-900">{viewResultAssign.testTitle}</h2>
                  <div className="text-xs text-slate-500 mt-1 flex flex-wrap gap-2">
                    <span>Khối: <strong>Khối {viewResultAssign.gradeLevel}</strong></span>
                    <span>·</span>
                    <span>Lớp: <strong>{viewResultAssign.classNames.join(', ')}</strong></span>
                    <span>·</span>
                    <span>Hạn nộp: <strong>{new Date(viewResultAssign.endTime).toLocaleString('vi-VN')}</strong></span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleModalExport}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Xuất Excel</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewResultAssign(null)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 text-sm"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* KPI Mini Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-[11px] font-semibold text-slate-500">Tổng học sinh</div>
                  <div className="text-xl font-black text-slate-900 mt-0.5">{modalReport.stats.totalAssigned}</div>
                  <div className="text-[10px] text-slate-400">Danh sách các lớp</div>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                  <div className="text-[11px] font-semibold text-emerald-700">Đã tham gia</div>
                  <div className="text-xl font-black text-emerald-700 mt-0.5">{modalReport.stats.participatedCount}</div>
                  <div className="text-[10px] text-emerald-600 font-medium">Tỷ lệ {modalReport.stats.participatedRate}%</div>
                </div>

                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                  <div className="text-[11px] font-semibold text-amber-700">Chưa tham gia</div>
                  <div className="text-xl font-black text-amber-700 mt-0.5">{modalReport.stats.notParticipatedCount}</div>
                  <div className="text-[10px] text-amber-600 font-medium">Chiếm {modalReport.stats.totalAssigned > 0 ? 100 - modalReport.stats.participatedRate : 0}%</div>
                </div>

                <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200">
                  <div className="text-[11px] font-semibold text-indigo-700">Điểm trung bình</div>
                  <div className="text-xl font-black text-indigo-700 mt-0.5">{modalReport.stats.avgScore} <span className="text-xs font-normal">/ 10</span></div>
                  <div className="text-[10px] text-indigo-600 font-medium">Đạt: {modalReport.stats.passRate}%</div>
                </div>
              </div>

              {/* Filter Tabs and Search */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setResultModalTab('ALL')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                      resultModalTab === 'ALL'
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Tất cả ({modalReport.stats.totalAssigned})
                  </button>
                  <button
                    type="button"
                    onClick={() => setResultModalTab('PARTICIPATED')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                      resultModalTab === 'PARTICIPATED'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                    }`}
                  >
                    Đã tham gia ({modalReport.stats.participatedCount})
                  </button>
                  <button
                    type="button"
                    onClick={() => setResultModalTab('NOT_PARTICIPATED')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                      resultModalTab === 'NOT_PARTICIPATED'
                        ? 'bg-amber-600 text-white'
                        : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                    }`}
                  >
                    Chưa tham gia ({modalReport.stats.notParticipatedCount})
                  </button>
                </div>

                <div className="relative w-full sm:w-60">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Tìm tên, mã học sinh..."
                    value={resultSearchQuery}
                    onChange={(e) => setResultSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Students Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden max-h-96 overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold sticky top-0">
                    <tr>
                      <th className="px-3 py-2.5 text-center w-10">STT</th>
                      <th className="px-3.5 py-2.5">Mã HS</th>
                      <th className="px-4 py-2.5">Họ và tên học sinh</th>
                      <th className="px-3 py-2.5">Lớp</th>
                      <th className="px-3.5 py-2.5">Trạng thái tham gia</th>
                      <th className="px-3 py-2.5 text-center">Đúng/Tổng</th>
                      <th className="px-3.5 py-2.5 text-center">Điểm số</th>
                      <th className="px-3.5 py-2.5">Thời gian nộp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {list.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-4 py-8 text-center text-slate-400">
                          Không có học sinh nào phù hợp.
                        </td>
                      </tr>
                    ) : (
                      list.map((st, idx) => {
                        const hasSub = st.participated && st.submission;
                        const sub = st.submission;

                        return (
                          <tr
                            key={st.id + (sub ? sub.id : '-unsub')}
                            className={!hasSub ? 'bg-amber-50/20' : 'hover:bg-slate-50'}
                          >
                            <td className="px-3 py-2.5 text-center text-slate-400">{idx + 1}</td>
                            <td className="px-3.5 py-2.5 font-mono text-slate-600">{st.studentCode}</td>
                            <td className="px-4 py-2.5 font-bold text-slate-900">{st.fullName}</td>
                            <td className="px-3 py-2.5">Lớp {st.className}</td>
                            <td className="px-3.5 py-2.5">
                              {hasSub ? (
                                sub?.isViolationAutoSubmitted ? (
                                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                                    <AlertTriangle className="w-3 h-3 text-rose-600" />
                                    <span>Vi phạm: Rời tab (Tự nộp)</span>
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                    <span>Đã nộp bài</span>
                                  </span>
                                )
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-300">
                                  <Clock className="w-3 h-3 text-amber-600" />
                                  <span>Chưa làm bài</span>
                                </span>
                              )}
                            </td>
                            <td className="px-3 py-2.5 text-center">
                              {sub ? `${sub.correctCount}/${sub.totalQuestions}` : '-'}
                            </td>
                            <td className="px-3.5 py-2.5 text-center">
                              {sub ? (
                                <span className="font-black text-xs px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                                  {sub.score.toFixed(1)}
                                </span>
                              ) : (
                                <span className="text-slate-300">-</span>
                              )}
                            </td>
                            <td className="px-3.5 py-2.5 text-slate-500 text-[11px]">
                              {sub ? new Date(sub.submittedAt).toLocaleString('vi-VN') : 'Chưa nộp bài'}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setViewResultAssign(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Modal Add Assignment */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md p-6 animate-in fade-in zoom-in-95">
            <h2 className="text-base font-bold text-slate-900 mb-4">Giao bài kiểm tra mới cho lớp</h2>

            <form onSubmit={handleSave} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Chọn đề kiểm tra *</label>
                <select
                  required
                  value={formData.testId}
                  onChange={(e) => setFormData({ ...formData, testId: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {tests.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.title} (Khối {t.gradeLevel} - {t.durationMinutes}p)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Chọn các lớp làm bài *</label>
                <div className="grid grid-cols-3 gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200 max-h-32 overflow-y-auto">
                  {classes.map((cls) => {
                    const isChecked = formData.selectedClassIds.includes(cls.id);
                    return (
                      <label key={cls.id} className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            if (isChecked) {
                              setFormData({
                                ...formData,
                                selectedClassIds: formData.selectedClassIds.filter((id) => id !== cls.id)
                              });
                            } else {
                              setFormData({
                                ...formData,
                                selectedClassIds: [...formData.selectedClassIds, cls.id]
                              });
                            }
                          }}
                          className="w-3.5 h-3.5 text-indigo-600 rounded"
                        />
                        <span className="font-semibold text-slate-800">{cls.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Thời gian bắt đầu</label>
                  <input
                    type="datetime-local"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Hạn nộp bài</label>
                  <input
                    type="datetime-local"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Mật khẩu phòng thi (Tùy chọn)</label>
                <input
                  type="text"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Để trống nếu không đặt mật khẩu"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                />
              </div>

              <div className="space-y-2 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.allowReviewAfterSubmit}
                    onChange={(e) => setFormData({ ...formData, allowReviewAfterSubmit: e.target.checked })}
                    className="w-3.5 h-3.5 text-indigo-600 rounded"
                  />
                  <span className="text-slate-700">Cho phép học sinh xem lời giải chi tiết sau khi nộp bài</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.shuffleQuestions}
                    onChange={(e) => setFormData({ ...formData, shuffleQuestions: e.target.checked })}
                    className="w-3.5 h-3.5 text-indigo-600 rounded"
                  />
                  <span className="text-slate-700">Tự động xáo trộn mã đề cho từng học sinh</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
                >
                  Xác nhận giao bài
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Assignment Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteAssignId)}
        title="Hủy đợt giao bài kiểm tra"
        message="Bạn có chắc chắn muốn hủy đợt giao bài kiểm tra này? Học sinh sẽ không thể tiếp tục làm bài."
        confirmLabel="Hủy đợt giao"
        cancelLabel="Đóng"
        isDanger={true}
        onConfirm={confirmDeleteAssignment}
        onCancel={() => setDeleteAssignId(null)}
      />
    </div>
  );
};
