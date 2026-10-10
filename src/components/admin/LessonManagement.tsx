import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  RotateCcw,
  Search,
  Filter,
  Layers,
  HelpCircle,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Lesson, Topic } from '../../types';
import { LMSStorageService, onStorageChange } from '../../services/storage';
import { ConfirmDialog } from '../common/ConfirmDialog';

export const LessonManagement: React.FC = () => {
  const [selectedGrade, setSelectedGrade] = useState<number>(6);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopicFilter, setSelectedTopicFilter] = useState<string>('ALL');

  const [lessons, setLessons] = useState<Lesson[]>(() => LMSStorageService.getLessons());
  const [topics] = useState<Topic[]>(() => LMSStorageService.getTopics());
  const [questions, setQuestions] = useState(() => LMSStorageService.getQuestions());

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [deleteLessonId, setDeleteLessonId] = useState<string | null>(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Form Data
  const [formData, setFormData] = useState<{
    gradeLevel: number;
    lessonNumber: number;
    topicId: string;
    title: string;
    learningOutcomes: string;
  }>({
    gradeLevel: 6,
    lessonNumber: 1,
    topicId: 'top-a',
    title: '',
    learningOutcomes: ''
  });

  const refreshData = () => {
    setLessons(LMSStorageService.getLessons());
    setQuestions(LMSStorageService.getQuestions());
  };

  useEffect(() => {
    const unsub = onStorageChange((entity) => {
      if (entity === 'lessons' || entity === 'questions' || entity === 'all') {
        refreshData();
      }
    });
    return () => unsub();
  }, []);

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => {
      setSuccessToast(null);
    }, 3500);
  };

  // Grade tabs: 6, 7, 8, 9
  const grades = [6, 7, 8, 9];

  // Lessons filtered by grade
  const lessonsInGrade = lessons
    .filter((l) => l.gradeLevel === selectedGrade)
    .sort((a, b) => a.lessonNumber - b.lessonNumber);

  // Question count by lessonTitle
  const questionCountByLesson: Record<string, number> = {};
  questions.forEach((q) => {
    if (q.gradeLevel === selectedGrade && q.lessonTitle) {
      questionCountByLesson[q.lessonTitle] = (questionCountByLesson[q.lessonTitle] || 0) + 1;
    }
  });

  // Filtered by search and topic
  const filteredLessons = lessonsInGrade.filter((les) => {
    if (selectedTopicFilter !== 'ALL' && les.topicId !== selectedTopicFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = les.title.toLowerCase().includes(q);
      const matchOutcomes = les.learningOutcomes?.toLowerCase().includes(q);
      if (!matchTitle && !matchOutcomes) return false;
    }
    return true;
  });

  const handleOpenAdd = () => {
    setEditingLesson(null);
    const nextLessonNum = lessonsInGrade.length > 0 ? Math.max(...lessonsInGrade.map((l) => l.lessonNumber)) + 1 : 1;
    setFormData({
      gradeLevel: selectedGrade,
      lessonNumber: nextLessonNum,
      topicId: topics[0]?.id || 'top-a',
      title: `Bài ${nextLessonNum}: `,
      learningOutcomes: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (les: Lesson) => {
    setEditingLesson(les);
    setFormData({
      gradeLevel: les.gradeLevel,
      lessonNumber: les.lessonNumber,
      topicId: les.topicId,
      title: les.title,
      learningOutcomes: les.learningOutcomes || ''
    });
    setIsModalOpen(true);
  };

  const handleSaveLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Vui lòng nhập Tên bài học!');
      return;
    }

    if (editingLesson) {
      const updated: Lesson = {
        ...editingLesson,
        gradeLevel: formData.gradeLevel,
        lessonNumber: Number(formData.lessonNumber) || 1,
        topicId: formData.topicId,
        title: formData.title.trim(),
        learningOutcomes: formData.learningOutcomes.trim()
      };
      LMSStorageService.updateLesson(updated);
      showToast(`Đã cập nhật bài học: ${updated.title}`);
    } else {
      const newLesson: Lesson = {
        id: `les-${formData.gradeLevel}-${Date.now()}`,
        gradeLevel: formData.gradeLevel,
        lessonNumber: Number(formData.lessonNumber) || 1,
        topicId: formData.topicId,
        title: formData.title.trim(),
        learningOutcomes: formData.learningOutcomes.trim()
      };
      LMSStorageService.addLesson(newLesson);
      showToast(`Đã thêm bài học mới: ${newLesson.title}`);
    }

    refreshData();
    setIsModalOpen(false);
  };

  const confirmDeleteLesson = () => {
    if (deleteLessonId) {
      const found = lessons.find((l) => l.id === deleteLessonId);
      LMSStorageService.deleteLesson(deleteLessonId);
      refreshData();
      setDeleteLessonId(null);
      if (found) {
        showToast(`Đã xóa bài học: ${found.title}`);
      }
    }
  };

  const confirmResetLessons = () => {
    LMSStorageService.resetLessons();
    refreshData();
    setIsResetConfirmOpen(false);
    showToast('Đã khôi phục danh mục bài học chuẩn môn Tin học THCS!');
  };

  const getTopicName = (topicId: string) => {
    const t = topics.find((item) => item.id === topicId);
    return t ? t.name : topicId;
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-emerald-800 text-white px-4 py-3 rounded-xl shadow-xl animate-in fade-in slide-in-from-bottom-2 text-sm font-medium">
          <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-1.5">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Quản trị Danh mục Chương trình Tin học</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Cấu hình Tên Bài học theo Khối lớp</h1>
          <p className="text-sm text-slate-500 mt-1">
            Quản trị danh mục tên bài học theo từng khối lớp (6-9). Danh mục này được tích hợp trực tiếp khi giáo viên tạo câu hỏi, không phải nhập thủ công.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setIsResetConfirmOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
            title="Khôi phục danh mục bài học chuẩn theo CTGDPT 2018"
          >
            <RotateCcw className="w-4 h-4 text-slate-500" />
            <span>Khôi phục mặc định</span>
          </button>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm bài học mới</span>
          </button>
        </div>
      </div>

      {/* Grade Selector Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        {grades.map((grade) => {
          const count = lessons.filter((l) => l.gradeLevel === grade).length;
          const isActive = selectedGrade === grade;
          return (
            <button
              key={grade}
              type="button"
              onClick={() => {
                setSelectedGrade(grade);
                setSelectedTopicFilter('ALL');
              }}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Khối {grade}</span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {count} bài
              </span>
            </button>
          );
        })}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên bài học hoặc yêu cầu cần đạt..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedTopicFilter}
            onChange={(e) => setSelectedTopicFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          >
            <option value="ALL">Tất cả Chủ đề ({topics.length} chủ đề)</option>
            {topics.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Lesson List Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 w-16 text-center">STT</th>
                <th className="px-4 py-3 min-w-[220px]">Tên bài học (Khối {selectedGrade})</th>
                <th className="px-4 py-3 min-w-[180px]">Chủ đề kiến thức</th>
                <th className="px-4 py-3 min-w-[260px]">Yêu cầu cần đạt</th>
                <th className="px-4 py-3 w-28 text-center">Số câu hỏi</th>
                <th className="px-4 py-3 w-28 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredLessons.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-slate-400">
                    <BookOpen className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    Không tìm thấy bài học nào phù hợp với bộ lọc trong Khối {selectedGrade}.
                  </td>
                </tr>
              ) : (
                filteredLessons.map((les) => {
                  const qCount = questionCountByLesson[les.title] || 0;
                  return (
                    <tr key={les.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3 text-center font-bold text-slate-700">
                        {les.lessonNumber}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-900 text-sm">{les.title}</div>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5">Mã: {les.id}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-block px-2.5 py-1 rounded-md text-[11px] font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                          {getTopicName(les.topicId)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600 text-xs leading-relaxed">
                        {les.learningOutcomes || <span className="text-slate-400 italic">Chưa thiết lập</span>}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            qCount > 0
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          <HelpCircle className="w-3 h-3" />
                          {qCount} câu
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(les)}
                            title="Sửa bài học"
                            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteLessonId(les.id)}
                            title="Xóa bài học"
                            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Lesson Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg p-6 animate-in fade-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-600" />
                <span>{editingLesson ? 'Chỉnh sửa Bài học' : 'Thêm Bài học mới'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-base font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveLesson} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Khối lớp *</label>
                  <select
                    value={formData.gradeLevel}
                    onChange={(e) => setFormData({ ...formData, gradeLevel: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    {grades.map((g) => (
                      <option key={g} value={g}>
                        Khối {g}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Số thứ tự bài *</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    required
                    value={formData.lessonNumber}
                    onChange={(e) => setFormData({ ...formData, lessonNumber: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Chủ đề kiến thức *</label>
                <select
                  value={formData.topicId}
                  onChange={(e) => setFormData({ ...formData, topicId: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  {topics.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Tên bài học * (Sẽ hiển thị trong danh sách chọn câu hỏi)
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Bài 1: Thông tin và dữ liệu"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Yêu cầu cần đạt chuẩn</label>
                <textarea
                  rows={3}
                  placeholder="Ví dụ: Nhận biết được thông tin, dữ liệu và các thiết bị vào ra cơ bản..."
                  value={formData.learningOutcomes}
                  onChange={(e) => setFormData({ ...formData, learningOutcomes: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-xs cursor-pointer"
                >
                  {editingLesson ? 'Lưu thay đổi' : 'Thêm bài học'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteLessonId)}
        title="Xóa bài học khỏi danh mục cấu hình"
        message="Bạn có chắc chắn muốn xóa bài học này không? Các câu hỏi đã tạo trước đây vẫn sẽ được giữ nguyên."
        confirmText="Xác nhận xóa"
        isDanger={true}
        onConfirm={confirmDeleteLesson}
        onCancel={() => setDeleteLessonId(null)}
      />

      {/* Reset Confirmation */}
      <ConfirmDialog
        isOpen={isResetConfirmOpen}
        title="Khôi phục danh mục bài học chuẩn môn Tin học"
        message="Hệ thống sẽ tải lại toàn bộ danh mục bài học chuẩn khối 6, 7, 8, 9 theo Chương trình GDPT 2018. Bạn có chắc chắn muốn tiếp tục?"
        confirmText="Khôi phục ngay"
        type="info"
        onConfirm={confirmResetLessons}
        onCancel={() => setIsResetConfirmOpen(false)}
      />
    </div>
  );
};
