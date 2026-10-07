import React, { useState } from 'react';
import { Layers, Plus, Users, UserCheck, Edit2, Trash2 } from 'lucide-react';
import { ClassRoom } from '../../types';
import { LMSStorageService } from '../../services/storage';
import { ConfirmDialog } from '../common/ConfirmDialog';

export const ClassManagement: React.FC = () => {
  const [classes, setClasses] = useState<ClassRoom[]>(() => LMSStorageService.getClasses());
  const [teachers] = useState(() =>
    LMSStorageService.getUsers().filter((u) => u.role === 'TEACHER' || u.role === 'DEPARTMENT_HEAD')
  );
  const [selectedGrade, setSelectedGrade] = useState<number>(6);
  const [deleteClassId, setDeleteClassId] = useState<string | null>(null);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassRoom | null>(null);
  const [formData, setFormData] = useState({
    name: '6/3',
    gradeId: 'grade-6',
    homeroomTeacherId: '',
    studentCount: 35
  });

  const refreshClasses = () => {
    setClasses(LMSStorageService.getClasses());
  };

  const handleOpenAdd = () => {
    setEditingClass(null);
    setFormData({
      name: `${selectedGrade}/3`,
      gradeId: `grade-6`,
      homeroomTeacherId: teachers[0]?.id || '',
      studentCount: 35
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cls: ClassRoom) => {
    setEditingClass(cls);
    setFormData({
      name: cls.name,
      gradeId: cls.gradeId,
      homeroomTeacherId: cls.homeroomTeacherId || '',
      studentCount: cls.studentCount
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setDeleteClassId(id);
  };

  const confirmDeleteClass = () => {
    if (deleteClassId) {
      LMSStorageService.deleteClass(deleteClassId);
      refreshClasses();
      setDeleteClassId(null);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const teacher = teachers.find((t) => t.id === formData.homeroomTeacherId);

    if (editingClass) {
      const updated: ClassRoom = {
        ...editingClass,
        name: formData.name,
        gradeId: formData.gradeId,
        homeroomTeacherId: formData.homeroomTeacherId,
        homeroomTeacherName: teacher?.fullName,
        studentCount: Number(formData.studentCount)
      };
      LMSStorageService.updateClass(updated);
    } else {
      const newClass: ClassRoom = {
        id: `cls-${Date.now()}`,
        name: formData.name,
        gradeId: formData.gradeId,
        academicYearId: 'ay-2025-2026',
        homeroomTeacherId: formData.homeroomTeacherId,
        homeroomTeacherName: teacher?.fullName,
        studentCount: Number(formData.studentCount)
      };
      LMSStorageService.addClass(newClass);
    }

    setIsModalOpen(false);
    refreshClasses();
  };

  const filteredClasses = classes.filter((c) => c.name.startsWith(`${selectedGrade}/`));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Quản lý Khối & Lớp học</h1>
          <p className="text-sm text-slate-500 mt-1">
            Danh sách lớp học, phân công giáo viên chủ nhiệm và sĩ số học sinh - THCS Phú Hồ
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm lớp mới</span>
        </button>
      </div>

      {/* Grade Selector Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        {[6, 7, 8, 9].map((g) => {
          const isActive = selectedGrade === g;
          const count = classes.filter((c) => c.name.startsWith(`${g}/`)).length;
          return (
            <button
              key={g}
              type="button"
              onClick={() => setSelectedGrade(g)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span>Khối {g}</span>
              <span
                className={`text-[11px] px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-indigo-700 text-white' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {count} lớp
              </span>
            </button>
          );
        })}
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClasses.length === 0 ? (
          <div className="col-span-full p-8 text-center bg-white rounded-xl border border-slate-200 text-slate-400 text-xs">
            Chưa có lớp nào trong Khối {selectedGrade}. Bấm "Thêm lớp mới" để khởi tạo.
          </div>
        ) : (
          filteredClasses.map((cls) => (
            <div key={cls.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center font-bold text-indigo-700 text-base">
                    {cls.name}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Lớp {cls.name}</h3>
                    <div className="text-xs text-slate-500">Khối {selectedGrade} · THCS Phú Hồ</div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(cls)}
                    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded"
                    title="Chỉnh sửa"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(cls.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                    title="Xóa"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-xs border-t border-slate-100 pt-3">
                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>Sĩ số học sinh:</span>
                  </span>
                  <strong className="text-slate-800">{cls.studentCount} em</strong>
                </div>

                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                    <span>Giáo viên phụ trách:</span>
                  </span>
                  <span className="font-medium text-slate-800">
                    {cls.homeroomTeacherName || 'Chưa phân công'}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-sm p-6 animate-in fade-in zoom-in-95">
            <h2 className="text-base font-bold text-slate-900 mb-4">
              {editingClass ? `Chỉnh sửa Lớp ${editingClass.name}` : `Thêm lớp mới vào Khối ${selectedGrade}`}
            </h2>

            <form onSubmit={handleSave} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Tên lớp *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ví dụ: 6/1, 6/2"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Sĩ số học sinh</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={formData.studentCount}
                  onChange={(e) => setFormData({ ...formData, studentCount: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Giáo viên phụ trách</label>
                <select
                  value={formData.homeroomTeacherId}
                  onChange={(e) => setFormData({ ...formData, homeroomTeacherId: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">-- Chưa phân công --</option>
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.fullName} ({t.role})
                    </option>
                  ))}
                </select>
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
                  Lưu lớp học
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Class Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteClassId)}
        title="Xóa lớp học"
        message="Bạn có chắc chắn muốn xóa lớp học này khỏi hệ thống? Thao tác này không thể hoàn tác."
        confirmLabel="Xóa lớp học"
        cancelLabel="Hủy bỏ"
        isDanger={true}
        onConfirm={confirmDeleteClass}
        onCancel={() => setDeleteClassId(null)}
      />
    </div>
  );
};
