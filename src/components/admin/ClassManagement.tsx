import React, { useState, useEffect } from 'react';
import {
  Layers,
  Plus,
  Users,
  UserCheck,
  Edit2,
  Trash2,
  Search,
  FileSpreadsheet,
  UploadCloud,
  DownloadCloud,
  CheckCircle2,
  AlertCircle,
  Loader2,
  BookOpen,
  CheckSquare,
  Square,
  Eye,
  RefreshCw,
  Sparkles,
  School
} from 'lucide-react';
import { ClassRoom, User } from '../../types';
import { LMSStorageService } from '../../services/storage';
import { onStorageChange } from '../../services/storageEvents';
import {
  GoogleSheetsService,
  getGoogleAccessToken,
  getSavedSheetId,
  getAppsScriptUrl,
  subscribeAutoSyncStatus,
  AutoSyncState
} from '../../services/googleSheetsService';
import { ConfirmDialog } from '../common/ConfirmDialog';

export const ClassManagement: React.FC = () => {
  const [classes, setClasses] = useState<ClassRoom[]>(() => LMSStorageService.getClasses());
  const [users, setUsers] = useState<User[]>(() => LMSStorageService.getUsers());
  const [selectedGrade, setSelectedGrade] = useState<number | 'ALL'>('ALL');
  const [assignmentFilter, setAssignmentFilter] = useState<'ALL' | 'ASSIGNED' | 'UNASSIGNED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteClassId, setDeleteClassId] = useState<string | null>(null);

  // Google Sheet state
  const [isSyncing, setIsSyncing] = useState(false);
  const [isPulling, setIsPulling] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const [syncSuccessToast, setSyncSuccessToast] = useState<string | null>(null);
  const [autoSyncState, setAutoSyncState] = useState<AutoSyncState>({ status: 'idle' });

  // Class Modal (Add/Edit)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassRoom | null>(null);
  const [formData, setFormData] = useState({
    name: '6/1',
    gradeLevel: 6,
    homeroomTeacherId: '',
    selectedTeacherIds: [] as string[],
    studentCount: 35
  });

  // Teacher Assignment Modal (Phân công giảng dạy theo giáo viên)
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isSavingAssignment, setIsSavingAssignment] = useState(false);
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('');
  const [assignedClassIdsForTeacher, setAssignedClassIdsForTeacher] = useState<string[]>([]);

  // Class Students Roster View Modal
  const [viewingClassStudents, setViewingClassStudents] = useState<ClassRoom | null>(null);

  const teachers = users.filter((u) => u.role === 'TEACHER' || u.role === 'DEPARTMENT_HEAD');

  const refreshData = () => {
    setClasses(LMSStorageService.getClasses());
    setUsers(LMSStorageService.getUsers());
  };

  useEffect(() => {
    const unsub = onStorageChange((entity) => {
      if (entity === 'classes' || entity === 'users' || entity === 'all') {
        refreshData();
      }
    });
    const unsubSync = subscribeAutoSyncStatus((st) => setAutoSyncState(st));

    // Tự động kiểm tra và cập nhật dữ liệu lớp từ Google Sheet LopHoc khi mở màn hình
    const autoFetchLopHoc = async () => {
      const sheetId = getSavedSheetId();
      const token = getGoogleAccessToken();
      const scriptUrl = getAppsScriptUrl();
      if ((sheetId && token) || scriptUrl) {
        try {
          if (sheetId && token) {
            await GoogleSheetsService.pullClassesFromSheet(sheetId, token);
          } else {
            await GoogleSheetsService.pullClassesFromAppsScript();
          }
          LMSStorageService.refreshTeacherAssignmentsFromClasses();
          refreshData();
        } catch (e) {
          console.warn('Auto fetch classes error:', e);
        }
      }
    };
    autoFetchLopHoc();

    return () => {
      unsub();
      unsubSync();
    };
  }, []);

  const showToast = (msg: string) => {
    setSyncSuccessToast(msg);
    setTimeout(() => setSyncSuccessToast(null), 4000);
  };

  // Sĩ số học sinh thực tế trong hệ thống cho mỗi lớp
  const actualStudentCountByClass: Record<string, number> = {};
  users.forEach((u) => {
    const cid = u.classId;
    if (u.role === 'STUDENT' && cid && u.status !== 'DELETED') {
      const matched = classes.find((c) => c.id === cid || c.name === cid || c.name.replace('/', '-') === cid.replace('cls-', ''));
      if (matched) {
        actualStudentCountByClass[matched.id] = (actualStudentCountByClass[matched.id] || 0) + 1;
      } else {
        actualStudentCountByClass[cid] = (actualStudentCountByClass[cid] || 0) + 1;
      }
    }
  });

  // Trích xuất số khối chuẩn xác từ lớp học (hỗ trợ cả "6/1", "Lớp 6/1", gradeId)
  const getGradeFromClass = (cls: ClassRoom): number => {
    if (cls.gradeId) {
      const match = cls.gradeId.match(/(\d+)/);
      if (match) return parseInt(match[1], 10);
    }
    const clean = cls.name.replace(/^(lớp|lop)\s+/i, '').trim();
    const match = clean.match(/^(\d+)/);
    if (match) return parseInt(match[1], 10);
    const anyDigit = clean.match(/(\d+)/);
    return anyDigit ? parseInt(anyDigit[1], 10) : 6;
  };

  // Lọc lớp theo khối, phân công, và tìm kiếm
  const filteredClasses = classes.filter((cls) => {
    // Lọc theo khối
    if (selectedGrade !== 'ALL') {
      const gNum = getGradeFromClass(cls);
      if (gNum !== selectedGrade) {
        return false;
      }
    }

    // Lọc theo trạng thái phân công
    const isAssigned =
      Boolean(cls.subjectTeacherName) ||
      Boolean(cls.homeroomTeacherName) ||
      (cls.assignedTeacherIds && cls.assignedTeacherIds.length > 0) ||
      teachers.some((t) => t.assignedClassIds?.includes(cls.id) || (cls.subjectTeacherName && LMSStorageService.isTeacherNameMatch(cls.subjectTeacherName, t)));

    if (assignmentFilter === 'ASSIGNED' && !isAssigned) return false;
    if (assignmentFilter === 'UNASSIGNED' && isAssigned) return false;

    // Lọc theo từ khóa tìm kiếm
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = cls.name.toLowerCase().includes(q);
      const matchHomeroom = cls.homeroomTeacherName?.toLowerCase().includes(q);
      const matchSubject = cls.subjectTeacherName?.toLowerCase().includes(q);
      if (!matchName && !matchHomeroom && !matchSubject) return false;
    }
    return true;
  });

  // Mở modal thêm lớp mới
  const handleOpenAdd = () => {
    setEditingClass(null);
    const targetGrade = selectedGrade === 'ALL' ? 6 : selectedGrade;
    const existingInGrade = classes.filter((c) => c.name.startsWith(`${targetGrade}/`));
    const nextIdx = existingInGrade.length + 1;

    setFormData({
      name: `${targetGrade}/${nextIdx}`,
      gradeLevel: targetGrade,
      homeroomTeacherId: teachers[0]?.id || '',
      selectedTeacherIds: teachers[0]?.id ? [teachers[0].id] : [],
      studentCount: 35
    });
    setIsModalOpen(true);
  };

  // Mở modal sửa lớp
  const handleOpenEdit = (cls: ClassRoom) => {
    setEditingClass(cls);
    const gNum = parseInt(cls.name.split('/')[0] || '6', 10) || 6;
    // Tìm các giáo viên được phân công lớp này
    const currentTeachers = teachers
      .filter((t) => t.assignedClassIds?.includes(cls.id) || cls.assignedTeacherIds?.includes(t.id) || cls.subjectTeacherId === t.id)
      .map((t) => t.id);

    setFormData({
      name: cls.name,
      gradeLevel: gNum,
      homeroomTeacherId: cls.homeroomTeacherId || '',
      selectedTeacherIds: currentTeachers.length > 0 ? currentTeachers : (cls.homeroomTeacherId ? [cls.homeroomTeacherId] : []),
      studentCount: cls.studentCount || 35
    });
    setIsModalOpen(true);
  };

  // Lưu lớp học
  const handleSaveClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Vui lòng nhập Tên lớp học!');
      return;
    }

    const homeroomTeacher = teachers.find((t) => t.id === formData.homeroomTeacherId);
    const selectedTeachers = teachers.filter((t) => formData.selectedTeacherIds.includes(t.id));
    const subjectTeacherNames = selectedTeachers.map((t) => t.fullName).join(', ');

    if (editingClass) {
      const updated: ClassRoom = {
        ...editingClass,
        name: formData.name.trim(),
        gradeId: `grade-${formData.gradeLevel}`,
        homeroomTeacherId: formData.homeroomTeacherId,
        homeroomTeacherName: homeroomTeacher?.fullName || '',
        subjectTeacherId: formData.selectedTeacherIds[0] || '',
        subjectTeacherName: subjectTeacherNames || homeroomTeacher?.fullName || '',
        assignedTeacherIds: formData.selectedTeacherIds,
        studentCount: Number(formData.studentCount) || 35
      };

      LMSStorageService.updateClassWithTeachers(updated, formData.selectedTeacherIds);
      GoogleSheetsService.triggerAutoSync('classes');
      GoogleSheetsService.triggerAutoSync('users');

      // Gửi action trực tiếp lên Apps Script
      GoogleSheetsService.postToAppsScript({
        action: 'saveClass',
        id: updated.id,
        name: updated.name,
        grade: formData.gradeLevel,
        studentCount: updated.studentCount,
        homeroomTeacherName: updated.homeroomTeacherName,
        assignedTeacherNames: subjectTeacherNames
      }).catch(() => {});

      showToast(`✓ Đã cập nhật Lớp ${updated.name} và phân công giảng dạy (Đồng bộ Google Sheet)!`);
    } else {
      const cleanName = formData.name.trim();
      const stableId = `cls-${cleanName.replace(/[^a-zA-Z0-9]/g, '-')}`;
      const newClass: ClassRoom = {
        id: stableId,
        name: cleanName,
        gradeId: `grade-${formData.gradeLevel}`,
        academicYearId: 'ay-2025-2026',
        homeroomTeacherId: formData.homeroomTeacherId,
        homeroomTeacherName: homeroomTeacher?.fullName || '',
        subjectTeacherId: formData.selectedTeacherIds[0] || '',
        subjectTeacherName: subjectTeacherNames || homeroomTeacher?.fullName || '',
        assignedTeacherIds: formData.selectedTeacherIds,
        studentCount: Number(formData.studentCount) || 35
      };

      LMSStorageService.addClass(newClass);
      LMSStorageService.updateClassWithTeachers(newClass, formData.selectedTeacherIds);
      GoogleSheetsService.triggerAutoSync('classes');
      GoogleSheetsService.triggerAutoSync('users');

      GoogleSheetsService.postToAppsScript({
        action: 'saveClass',
        id: newClass.id,
        name: newClass.name,
        grade: formData.gradeLevel,
        studentCount: newClass.studentCount,
        homeroomTeacherName: newClass.homeroomTeacherName,
        assignedTeacherNames: subjectTeacherNames
      }).catch(() => {});

      showToast(`✓ Đã thêm Lớp mới ${newClass.name} và lưu trữ lên Google Sheet!`);
    }

    refreshData();
    setIsModalOpen(false);
  };

  // Xác nhận xóa lớp
  const confirmDeleteClass = async () => {
    if (deleteClassId) {
      const target = classes.find((c) => c.id === deleteClassId);
      LMSStorageService.deleteClass(deleteClassId);
      refreshData();
      setDeleteClassId(null);

      // Kích hoạt đồng bộ làm sạch Google Sheet trong nền
      GoogleSheetsService.triggerAutoSync('classes');
      GoogleSheetsService.triggerAutoSync('users');

      if (target) {
        try {
          await GoogleSheetsService.postToAppsScript({
            action: 'deleteClass',
            id: target.id,
            name: target.name
          });
        } catch (e) {
          console.warn('Lỗi gọi deleteClass qua Apps Script:', e);
        }
        showToast(`✓ Đã xóa Lớp ${target.name} và đồng bộ làm sạch trên Google Sheet!`);
      }
    }
  };

  // Mở modal phân công giảng dạy theo giáo viên
  const handleOpenAssignModal = (teacherId?: string) => {
    const tId = teacherId || teachers[0]?.id || '';
    setSelectedTeacherId(tId);
    const targetTeacher = teachers.find((t) => t.id === tId);
    // Lấy danh sách lớp giáo viên đang phụ trách
    const currentClassIds = targetTeacher?.assignedClassIds || [];
    setAssignedClassIdsForTeacher([...currentClassIds]);
    setIsAssignModalOpen(true);
  };

  // Thay đổi giáo viên trong modal phân công
  const handleSelectTeacherChange = (teacherId: string) => {
    setSelectedTeacherId(teacherId);
    const targetTeacher = teachers.find((t) => t.id === teacherId);
    setAssignedClassIdsForTeacher([...(targetTeacher?.assignedClassIds || [])]);
  };

  // Toggle lớp phân công cho giáo viên
  const toggleClassForTeacher = (classId: string) => {
    if (assignedClassIdsForTeacher.includes(classId)) {
      setAssignedClassIdsForTeacher(assignedClassIdsForTeacher.filter((id) => id !== classId));
    } else {
      setAssignedClassIdsForTeacher([...assignedClassIdsForTeacher, classId]);
    }
  };

  // Chọn toàn bộ lớp của một khối
  const selectAllClassesInGrade = (gradeNum: number) => {
    const gradeClassIds = classes
      .filter((c) => c.name.startsWith(`${gradeNum}/`))
      .map((c) => c.id);
    const merged = Array.from(new Set([...assignedClassIdsForTeacher, ...gradeClassIds]));
    setAssignedClassIdsForTeacher(merged);
  };

  // Bỏ chọn tất cả lớp của một khối
  const deselectAllClassesInGrade = (gradeNum: number) => {
    const gradeClassIds = new Set(
      classes.filter((c) => c.name.startsWith(`${gradeNum}/`)).map((c) => c.id)
    );
    setAssignedClassIdsForTeacher(assignedClassIdsForTeacher.filter((id) => !gradeClassIds.has(id)));
  };

  // Lưu phân công giảng dạy và đồng bộ ngay lập tức vào Google Sheet
  const handleSaveTeacherAssignment = async () => {
    if (!selectedTeacherId) return;
    const targetTeacher = teachers.find((t) => t.id === selectedTeacherId);
    setIsSavingAssignment(true);

    try {
      // 1. Cập nhật dữ liệu vào Storage hệ thống
      LMSStorageService.assignTeacherToClasses(selectedTeacherId, assignedClassIdsForTeacher);

      const classNames = classes
        .filter((c) => assignedClassIdsForTeacher.includes(c.id))
        .map((c) => c.name)
        .join(', ');

      // 2. Đồng bộ trực tiếp lên Google Sheet (sheet LopHoc & GiaoVien)
      const syncResult = await GoogleSheetsService.syncClassAssignments(
        selectedTeacherId,
        assignedClassIdsForTeacher
      );

      showToast(
        `✓ Đã cập nhật phân công giảng dạy cho ${targetTeacher?.fullName}: ${classNames || 'Không có lớp'} (Đồng bộ Google Sheet LopHoc & GiaoVien thành công)!`
      );
      refreshData();
      setIsAssignModalOpen(false);
    } catch (err: any) {
      console.warn('Lỗi khi lưu phân công:', err);
      showToast(`✓ Đã lưu phân công cho ${targetTeacher?.fullName} vào hệ thống cục bộ!`);
      refreshData();
      setIsAssignModalOpen(false);
    } finally {
      setIsSavingAssignment(false);
    }
  };

  // Đồng bộ toàn bộ Lớp học & Phân công lên Google Sheet
  const handlePushToGoogleSheet = async () => {
    setIsSyncing(true);
    setSyncMessage('Đang đồng bộ danh mục Lớp học và Phân công lên Google Sheet (sheet LopHoc & GiaoVien)...');
    try {
      const sheetId = getSavedSheetId();
      const token = getGoogleAccessToken();

      if (sheetId && token) {
        await GoogleSheetsService.syncEntity('classes', sheetId, token);
        await GoogleSheetsService.syncEntity('users', sheetId, token);
        setSyncMessage('✓ Đã cập nhật thành công lên Google Sheet (sheet LopHoc và GiaoVien)!');
      } else {
        const res = await GoogleSheetsService.pushAllDataViaAppsScript();
        if (res.success) {
          setSyncMessage('✓ Đã đẩy thành công toàn bộ Lớp học và Phân công lên Google Sheet qua Apps Script!');
        } else {
          setSyncMessage(`Thông báo: ${res.message}`);
        }
      }
      showToast('✓ Đồng bộ dữ liệu Lớp học & Phân công lên Google Sheet thành công!');
    } catch (err: any) {
      setSyncMessage(`Lỗi đồng bộ: ${err.message || String(err)}`);
    } finally {
      setIsSyncing(false);
    }
  };

  // Tải danh sách Lớp học và Phân công từ Google Sheet về
  const handlePullFromGoogleSheet = async () => {
    setIsPulling(true);
    setSyncMessage('Đang lấy dữ liệu Khối & Lớp học và Phân công từ sheet LopHoc trên Google Sheet...');
    try {
      const sheetId = getSavedSheetId();
      const token = getGoogleAccessToken();
      let count = 0;

      // 1. Kéo trước danh sách tài khoản nếu có để đảm bảo có thông tin Giáo viên đối chiếu
      try {
        if (sheetId && token) {
          await GoogleSheetsService.pullAccountsFromSheet(sheetId, token);
        } else {
          await GoogleSheetsService.pullAccountsFromAppsScript();
        }
      } catch {}

      // 2. Kéo danh sách lớp học và phân công từ sheet LopHoc
      if (sheetId && token) {
        try {
          count = await GoogleSheetsService.pullClassesFromSheet(sheetId, token);
        } catch (oauthErr) {
          console.warn('Lỗi kéo từ OAuth, thử lại qua Apps Script:', oauthErr);
          const res = await GoogleSheetsService.pullClassesFromAppsScript();
          if (res.success) {
            count = res.count;
          } else {
            throw oauthErr;
          }
        }
      } else {
        const res = await GoogleSheetsService.pullClassesFromAppsScript();
        if (res.success) {
          count = res.count;
        } else {
          throw new Error(res.error || 'Lỗi tải từ Apps Script');
        }
      }

      // 3. Liên kết hai chiều phân công giáo viên và cập nhật giao diện
      LMSStorageService.refreshTeacherAssignmentsFromClasses();
      refreshData();

      setSyncMessage(`✓ Đã nạp thành công ${count} lớp học và phân công từ sheet LopHoc về giao diện!`);
      showToast(`✓ Đã lấy thành công ${count} lớp học và phân công từ Sheet LopHoc hiển thị ở giao diện!`);
    } catch (err: any) {
      setSyncMessage(`Lỗi tải từ Google Sheet: ${err.message || String(err)}`);
    } finally {
      setIsPulling(false);
    }
  };

  // Tính toán số liệu thống kê
  const totalClasses = classes.length;
  const totalStudents = classes.reduce((sum, c) => sum + (c.studentCount || 0), 0);
  const actualStudentsTotal = Object.values(actualStudentCountByClass).reduce((a, b) => a + b, 0);
  const assignedClassesCount = classes.filter(
    (c) =>
      c.homeroomTeacherName ||
      c.subjectTeacherName ||
      (c.assignedTeacherIds && c.assignedTeacherIds.length > 0) ||
      teachers.some((t) => t.assignedClassIds?.includes(c.id))
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Quản lý Khối & Lớp học</h1>
            <span className="text-[11px] font-bold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full flex items-center gap-1">
              <School className="w-3 h-3" />
              THCS Phú Hồ
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Quản lý khối lớp, phân công giáo viên giảng dạy môn Tin học và tự động cập nhật hệ thống dữ liệu Google Sheet
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => handleOpenAssignModal()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg shadow-xs transition-colors"
            title="Phân công giáo viên phụ trách các lớp học"
          >
            <UserCheck className="w-4 h-4 text-indigo-600" />
            <span>Phân công giảng dạy</span>
          </button>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm lớp mới</span>
          </button>

          <button
            type="button"
            onClick={handlePushToGoogleSheet}
            disabled={isSyncing}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors disabled:opacity-50"
            title="Đẩy dữ liệu lớp học và phân công lên Google Sheet"
          >
            {isSyncing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UploadCloud className="w-3.5 h-3.5" />}
            <span>Đồng bộ Google Sheet</span>
          </button>

          <button
            type="button"
            onClick={handlePullFromGoogleSheet}
            disabled={isPulling}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-700 hover:bg-indigo-800 border border-indigo-700 rounded-lg shadow-xs transition-colors disabled:opacity-50"
            title="Lấy trực tiếp danh sách lớp học và phân công từ sheet LopHoc trên Google Sheet và hiển thị lên giao diện"
          >
            {isPulling ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <DownloadCloud className="w-3.5 h-3.5" />}
            <span>Lấy dữ liệu từ Sheet LopHoc</span>
          </button>
        </div>
      </div>

      {/* Sync Status Banner */}
      {(syncMessage || autoSyncState.status === 'synced') && (
        <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{syncMessage || `Đã đồng bộ dữ liệu lớp học lên Google Sheet lúc ${autoSyncState.lastSyncedTime}`}</span>
          </div>
          <span className="font-semibold text-[11px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
            Sheet: LopHoc & GiaoVien
          </span>
        </div>
      )}

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-slate-500 text-xs font-medium flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-indigo-500" />
            <span>Tổng số lớp học</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{totalClasses} lớp</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Khối 6, 7, 8, 9</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-slate-500 text-xs font-medium flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-emerald-500" />
            <span>Học sinh trong hệ thống</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{actualStudentsTotal} em</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Định mức: {totalStudents} em</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-slate-500 text-xs font-medium flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5 text-amber-500" />
            <span>Đã phân công giảng dạy</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            {assignedClassesCount}/{totalClasses}
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-0.5">
            {totalClasses > 0 ? Math.round((assignedClassesCount / totalClasses) * 100) : 0}% hoàn thành
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-slate-500 text-xs font-medium flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-purple-500" />
            <span>Giáo viên Tin học</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{teachers.length} thầy cô</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Tổ Tin học - THCS Phú Hồ</div>
        </div>
      </div>

      {/* Grade Selector Tabs & Search Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        {/* Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setSelectedGrade('ALL')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              selectedGrade === 'ALL'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span>Tất cả</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                selectedGrade === 'ALL' ? 'bg-indigo-700 text-white' : 'bg-slate-200 text-slate-700'
              }`}
            >
              {classes.length}
            </span>
          </button>

          {[6, 7, 8, 9].map((g) => {
            const isActive = selectedGrade === g;
            const count = classes.filter((c) => getGradeFromClass(c) === g).length;
            return (
              <button
                key={g}
                type="button"
                onClick={() => setSelectedGrade(g)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span>Khối {g}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-indigo-700 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {count} lớp
                </span>
              </button>
            );
          })}
        </div>

        {/* Assignment Filter & Search */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center p-0.5 bg-slate-100 rounded-lg border border-slate-200 text-xs">
            <button
              type="button"
              onClick={() => setAssignmentFilter('ALL')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                assignmentFilter === 'ALL'
                  ? 'bg-white text-indigo-700 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tất cả
            </button>
            <button
              type="button"
              onClick={() => setAssignmentFilter('ASSIGNED')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors flex items-center gap-1 ${
                assignmentFilter === 'ASSIGNED'
                  ? 'bg-white text-emerald-700 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Đã phân công</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-full font-bold">
                {assignedClassesCount}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setAssignmentFilter('UNASSIGNED')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors flex items-center gap-1 ${
                assignmentFilter === 'UNASSIGNED'
                  ? 'bg-white text-amber-700 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Chưa phân công</span>
              <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded-full font-bold">
                {classes.length - assignedClassesCount}
              </span>
            </button>
          </div>

          <div className="relative w-full sm:w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm lớp, GVCN, GV bộ môn..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            />
          </div>
        </div>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClasses.length === 0 ? (
          <div className="col-span-full p-12 text-center bg-white rounded-xl border border-slate-200 text-slate-400 text-xs space-y-2">
            <School className="w-8 h-8 mx-auto text-slate-300" />
            <div className="font-semibold text-slate-700 text-sm">Không tìm thấy lớp học nào</div>
            <p>
              {selectedGrade === 'ALL'
                ? 'Chưa có lớp học nào phù hợp với bộ lọc.'
                : `Chưa có lớp nào trong Khối ${selectedGrade}.`}
            </p>
            <button
              type="button"
              onClick={handleOpenAdd}
              className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg border border-indigo-200"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm lớp mới ngay</span>
            </button>
          </div>
        ) : (
          filteredClasses.map((cls) => {
            const actualCount = actualStudentCountByClass[cls.id] || 0;
            const gNum = getGradeFromClass(cls);

            // Danh sách giáo viên phụ trách lớp này (đối chiếu ID hoặc đối chiếu tên từ Sheet LopHoc)
            const assignedTeachersForThisClass = teachers.filter((t) => {
              const isMatchId =
                t.assignedClassIds?.includes(cls.id) ||
                cls.assignedTeacherIds?.includes(t.id) ||
                cls.subjectTeacherId === t.id;
              if (isMatchId) return true;
              if (cls.subjectTeacherName && LMSStorageService.isTeacherNameMatch(cls.subjectTeacherName, t)) {
                return true;
              }
              return false;
            });

            return (
              <div
                key={cls.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-indigo-200 transition-all space-y-4 flex flex-col justify-between"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center font-bold text-indigo-700 text-lg shadow-2xs">
                        {cls.name}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-bold text-slate-900 text-sm">Lớp {cls.name}</h3>
                          <span className="text-[10px] font-bold px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded">
                            Khối {gNum}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500">Năm học 2025-2026 · THCS Phú Hồ</div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(cls)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Chỉnh sửa thông tin lớp"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteClassId(cls.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Xóa lớp học"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Class Info Details */}
                  <div className="space-y-2.5 text-xs border-t border-slate-100 mt-4 pt-3.5">
                    {/* Sĩ số */}
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        <span>Sĩ số học sinh:</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setViewingClassStudents(cls)}
                        className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-semibold text-xs group"
                        title="Xem danh sách học sinh"
                      >
                        <span>
                          {actualCount} / {cls.studentCount || 35} em
                        </span>
                        <Eye className="w-3 h-3 group-hover:scale-110 transition-transform" />
                      </button>
                    </div>

                    {/* GVCN */}
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="flex items-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                        <span>GV Chủ nhiệm:</span>
                      </span>
                      <span className="font-medium text-slate-800">
                        {cls.homeroomTeacherName || 'Chưa phân công'}
                      </span>
                    </div>

                    {/* Phân công GV Tin học */}
                    <div className="flex items-start justify-between gap-2 text-slate-600 pt-1 border-t border-slate-50">
                      <span className="flex items-center gap-1.5 shrink-0">
                        <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                        <span>GV Bộ môn Tin:</span>
                      </span>
                      <div className="text-right">
                        {assignedTeachersForThisClass.length > 0 ? (
                          <div className="flex flex-wrap justify-end gap-1">
                            {assignedTeachersForThisClass.map((t) => (
                              <span
                                key={t.id}
                                className="text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100 px-2 py-0.5 rounded flex items-center gap-1"
                              >
                                <UserCheck className="w-3 h-3 text-indigo-600" />
                                {t.fullName}
                              </span>
                            ))}
                          </div>
                        ) : cls.subjectTeacherName ? (
                          <span className="text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded inline-flex items-center gap-1" title="Phân công từ Sheet LopHoc">
                            <UserCheck className="w-3 h-3 text-emerald-600" />
                            {cls.subjectTeacherName}
                          </span>
                        ) : (
                          <span className="text-[11px] text-amber-600 font-medium bg-amber-50 px-2 py-0.5 rounded">
                            Chưa phân công GV
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Footer Quick Action */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">ID: {cls.id}</span>
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(cls)}
                    className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                  >
                    <span>Cập nhật phân công</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal 1: Thêm / Chỉnh sửa lớp học */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <School className="w-4 h-4 text-indigo-600" />
                <span>{editingClass ? `Chỉnh sửa Lớp ${editingClass.name}` : `Thêm lớp học mới`}</span>
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveClass} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Tên lớp *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ví dụ: 6/1, 8/7, 8/8"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Khối lớp *</label>
                  <select
                    value={formData.gradeLevel}
                    onChange={(e) => setFormData({ ...formData, gradeLevel: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
                  >
                    <option value={6}>Khối 6</option>
                    <option value={7}>Khối 7</option>
                    <option value={8}>Khối 8</option>
                    <option value={9}>Khối 9</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Sĩ số học sinh dự kiến</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={formData.studentCount}
                  onChange={(e) => setFormData({ ...formData, studentCount: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Giáo viên chủ nhiệm (GVCN)</label>
                <select
                  value={formData.homeroomTeacherId}
                  onChange={(e) => setFormData({ ...formData, homeroomTeacherId: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">-- Chưa phân công GVCN --</option>
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.fullName} ({t.teacherCode || t.username})
                    </option>
                  ))}
                </select>
              </div>

              {/* Phân công giáo viên bộ môn Tin học */}
              <div>
                <label className="block font-medium text-slate-700 mb-1.5 flex items-center justify-between">
                  <span>Phân công Giáo viên bộ môn Tin học:</span>
                  <span className="text-[11px] text-indigo-600 font-normal">Có thể chọn nhiều GV</span>
                </label>
                <div className="space-y-1.5 max-h-36 overflow-y-auto border border-slate-200 rounded-lg p-2.5 bg-slate-50">
                  {teachers.map((t) => {
                    const isChecked = formData.selectedTeacherIds.includes(t.id);
                    return (
                      <label
                        key={t.id}
                        className={`flex items-center gap-2 p-1.5 rounded cursor-pointer transition-colors ${
                          isChecked ? 'bg-indigo-50/80 font-medium text-indigo-900' : 'hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            if (isChecked) {
                              setFormData({
                                ...formData,
                                selectedTeacherIds: formData.selectedTeacherIds.filter((id) => id !== t.id)
                              });
                            } else {
                              setFormData({
                                ...formData,
                                selectedTeacherIds: [...formData.selectedTeacherIds, t.id]
                              });
                            }
                          }}
                          className="rounded text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="flex-1 text-xs">
                          {t.fullName} <span className="text-slate-400 text-[11px]">({t.teacherCode || t.role})</span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{editingClass ? 'Lưu thay đổi' : 'Tạo lớp học'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Phân công giảng dạy theo giáo viên (Teacher Assignment Matrix Modal) */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-2xl p-6 animate-in fade-in zoom-in-95 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Phân công giảng dạy môn Tin học</h2>
                  <p className="text-xs text-slate-500">
                    Phân công lớp phụ trách cho giáo viên bộ môn và cập nhật tự động lên hệ thống Google Sheet
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAssignModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 my-4 overflow-y-auto pr-1 text-xs flex-1">
              {/* Chọn giáo viên */}
              <div>
                <label className="block font-medium text-slate-700 mb-1">Chọn Giáo viên cần phân công:</label>
                <select
                  value={selectedTeacherId}
                  onChange={(e) => handleSelectTeacherChange(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold text-slate-800 text-xs bg-slate-50"
                >
                  {teachers.map((t) => {
                    const assignedCount = (t.assignedClassIds || []).length;
                    return (
                      <option key={t.id} value={t.id}>
                        {t.fullName} - {t.teacherCode || t.username} ({assignedCount} lớp đang phụ trách)
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Danh sách lớp theo từng khối để tích chọn */}
              <div className="space-y-3.5">
                {[6, 7, 8, 9].map((g) => {
                  const gradeClasses = classes.filter((c) => c.name.startsWith(`${g}/`));
                  const allInGradeSelected =
                    gradeClasses.length > 0 &&
                    gradeClasses.every((c) => assignedClassIdsForTeacher.includes(c.id));

                  return (
                    <div key={g} className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5 text-indigo-500" />
                          <span>Khối {g} ({gradeClasses.length} lớp)</span>
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              allInGradeSelected ? deselectAllClassesInGrade(g) : selectAllClassesInGrade(g)
                            }
                            className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800"
                          >
                            {allInGradeSelected ? 'Bỏ chọn cả khối' : 'Chọn cả khối'}
                          </button>
                        </div>
                      </div>

                      {/* Checkboxes grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {gradeClasses.map((cls) => {
                          const isChecked = assignedClassIdsForTeacher.includes(cls.id);
                          return (
                            <button
                              key={cls.id}
                              type="button"
                              onClick={() => toggleClassForTeacher(cls.id)}
                              className={`flex items-center gap-2 p-2 rounded-lg border text-left transition-colors ${
                                isChecked
                                  ? 'bg-indigo-600 text-white border-indigo-600 font-semibold shadow-2xs'
                                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              {isChecked ? (
                                <CheckSquare className="w-4 h-4 shrink-0 text-white" />
                              ) : (
                                <Square className="w-4 h-4 shrink-0 text-slate-400" />
                              )}
                              <span className="text-xs">Lớp {cls.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Tóm tắt phân công */}
              <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl flex items-center justify-between text-xs text-indigo-900">
                <span>
                  Đang phân công: <strong>{assignedClassIdsForTeacher.length} lớp</strong> (
                  {classes
                    .filter((c) => assignedClassIdsForTeacher.includes(c.id))
                    .map((c) => c.name)
                    .join(', ') || 'Chưa chọn lớp nào'}
                  )
                </span>
                <button
                  type="button"
                  onClick={() => setAssignedClassIdsForTeacher([])}
                  className="text-xs text-rose-600 hover:underline font-semibold"
                >
                  Xóa tất cả
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 shrink-0">
              <button
                type="button"
                onClick={() => setIsAssignModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Hủy
              </button>
              <button
                type="button"
                disabled={isSavingAssignment}
                onClick={handleSaveTeacherAssignment}
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                {isSavingAssignment ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Đang lưu & Cập nhật Google Sheet...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Lưu phân công & Cập nhật Google Sheet</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 3: Xem danh sách học sinh của lớp */}
      {viewingClassStudents && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-2xl p-6 animate-in fade-in zoom-in-95 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Danh sách học sinh Lớp {viewingClassStudents.name}
                </h2>
                <div className="text-xs text-slate-500 mt-0.5">
                  GVCN: <strong>{viewingClassStudents.homeroomTeacherName || 'Chưa phân công'}</strong> · Sĩ số thực tế:{' '}
                  {actualStudentCountByClass[viewingClassStudents.id] || 0} học sinh
                </div>
              </div>
              <button
                type="button"
                onClick={() => setViewingClassStudents(null)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none p-1"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto my-3 flex-1">
              {users.filter(
                (u) => u.role === 'STUDENT' && u.classId === viewingClassStudents.id && u.status !== 'DELETED'
              ).length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  Chưa có học sinh nào trong Lớp {viewingClassStudents.name}.
                </div>
              ) : (
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 sticky top-0">
                    <tr>
                      <th className="py-2.5 px-3">STT</th>
                      <th className="py-2.5 px-3">MSHS</th>
                      <th className="py-2.5 px-3">Họ và tên</th>
                      <th className="py-2.5 px-3">Tài khoản</th>
                      <th className="py-2.5 px-3">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {users
                      .filter(
                        (u) => u.role === 'STUDENT' && u.classId === viewingClassStudents.id && u.status !== 'DELETED'
                      )
                      .map((stu, sIdx) => (
                        <tr key={stu.id} className="hover:bg-slate-50">
                          <td className="py-2 px-3 text-slate-400 font-medium">{sIdx + 1}</td>
                          <td className="py-2 px-3 font-mono font-bold text-indigo-600">{stu.studentCode || stu.id}</td>
                          <td className="py-2 px-3 font-semibold text-slate-900">{stu.fullName}</td>
                          <td className="py-2 px-3 font-mono text-slate-500">{stu.username}</td>
                          <td className="py-2 px-3">
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700">
                              Hoạt động
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end shrink-0">
              <button
                type="button"
                onClick={() => setViewingClassStudents(null)}
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Class Confirmation Dialog */}
      {(() => {
        const targetDeleteClass = classes.find((c) => c.id === deleteClassId);
        const enrolledCount = targetDeleteClass ? (actualStudentCountByClass[targetDeleteClass.id] || 0) : 0;
        const deleteMsg = targetDeleteClass
          ? `Bạn có chắc chắn muốn xóa Lớp ${targetDeleteClass.name} khỏi hệ thống? ${
              enrolledCount > 0
                ? `Lớp hiện có ${enrolledCount} học sinh đang theo học (các em sẽ được tự động chuyển về trạng thái Chưa phân lớp).`
                : ''
            } Dữ liệu lớp học sẽ được xóa trên LMS và làm sạch đồng bộ trên Google Sheet (sheet LopHoc).`
          : 'Bạn có chắc chắn muốn xóa lớp học này?';
        return (
          <ConfirmDialog
            isOpen={Boolean(deleteClassId)}
            title={`Xóa lớp học ${targetDeleteClass ? targetDeleteClass.name : ''}`}
            message={deleteMsg}
            confirmLabel="Xóa lớp học"
            cancelLabel="Hủy bỏ"
            isDanger={true}
            onConfirm={confirmDeleteClass}
            onCancel={() => setDeleteClassId(null)}
          />
        );
      })()}

      {/* Success Toast */}
      {syncSuccessToast && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl text-xs flex items-center gap-2 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{syncSuccessToast}</span>
        </div>
      )}
    </div>
  );
};
