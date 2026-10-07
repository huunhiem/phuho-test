import React, { useState } from 'react';
import { Send, Plus, Calendar, Clock, Lock, CheckCircle2, Trash2, Users } from 'lucide-react';
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

              <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-100 flex justify-between">
                <span>Người giao: {item.assignedByName}</span>
                <span>{item.allowReviewAfterSubmit ? 'Cho xem đáp án sau nộp' : 'Ẩn đáp án'}</span>
              </div>
            </div>
          ))
        )}
      </div>

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
