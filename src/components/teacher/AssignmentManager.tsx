import React, { useState, useEffect, useMemo } from 'react';
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
  Search,
  Edit2,
  DownloadCloud,
  UploadCloud,
  Loader2,
  FileText,
  ExternalLink,
  Check,
  X,
  HelpCircle,
  Copy
} from 'lucide-react';
import { Assignment, Test, User, ClassRoom, Submission, Question } from '../../types';
import { LMSStorageService, safeFormatDateTimeForInput } from '../../services/storage';
import { GoogleSheetsService, getSavedSheetId, getGoogleAccessToken, getAppsScriptUrl } from '../../services/googleSheetsService';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { AppsScriptUpdateNoticeModal } from '../common/AppsScriptUpdateNoticeModal';
import { onStorageChange } from '../../services/storageEvents';
import { GoogleDriveService } from '../../services/googleDriveService';

interface AssignmentManagerProps {
  currentUser: User;
  onNavigate?: (tab: string, extra?: any) => void;
}

export const AssignmentManager: React.FC<AssignmentManagerProps> = ({ currentUser, onNavigate }) => {
  const isAdmin = currentUser.role === 'ADMIN';
  const [, setTick] = useState(0);

  useEffect(() => {
    return onStorageChange((entity) => {
      if (entity === 'assignments' || entity === 'classes' || entity === 'tests' || entity === 'all') {
        setAssignments(LMSStorageService.getAssignments());
        setTick((t) => t + 1);
      }
    });
  }, []);

  const allClasses = LMSStorageService.getClasses();
  const classes = LMSStorageService.getClassesForTeacher(currentUser);
  const assignableClasses = classes.length > 0 ? classes : allClasses;
  const questions = LMSStorageService.getQuestions();

  const allTests = LMSStorageService.getTests();
  // Riêng Tài khoản quản trị hiển thị tất cả đề; Giáo viên ưu tiên đề do mình tạo hoặc dùng chung đề trong tổ
  const assignableTests = useMemo(() => {
    if (isAdmin) return allTests;
    const myTests = allTests.filter((t) => LMSStorageService.isTestCreatedByUser(t, currentUser));
    return myTests.length > 0 ? myTests : allTests;
  }, [allTests, isAdmin, currentUser]);

  const [assignments, setAssignments] = useState<Assignment[]>(() => LMSStorageService.getAssignments());
  const [assignScopeFilter, setAssignScopeFilter] = useState<'ALL' | 'MINE' | 'TEACHING'>(isAdmin ? 'ALL' : 'TEACHING');
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('ALL');
  const [selectedGradeFilter, setSelectedGradeFilter] = useState<string>('ALL');
  const [searchAssignQuery, setSearchAssignQuery] = useState<string>('');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareText, setShareText] = useState('');
  const [copiedShare, setCopiedShare] = useState(false);
  const [importShareError, setImportShareError] = useState('');
  const [importShareSuccess, setImportShareSuccess] = useState('');
  const [isPullingAssignments, setIsPullingAssignments] = useState(false);
  const [isSyncingAssignments, setIsSyncingAssignments] = useState(false);
  const [syncAssignMessage, setSyncAssignMessage] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string>('');

  // Chuẩn hóa chuỗi tên lớp học (ví dụ: '8-7', '8/7', '8a7', 'cls-8-7' -> '8-7')
  const normalizeClassKey = (str: string): string => {
    if (!str) return '';
    return str.toLowerCase().replace(/lớp|lop|cls-|\s+/g, '').replace(/[/.a]/g, '-');
  };

  // Hiển thị đợt giao bài theo lớp học và phân quyền linh hoạt
  const visibleAssignments = useMemo(() => {
    let list = assignments;

    // 1. Phân quyền và phạm vi hiển thị
    if (!isAdmin) {
      if (assignScopeFilter === 'MINE') {
        const mineList = list.filter((a) => LMSStorageService.isAssignmentCreatedByUser(a, currentUser));
        list = mineList.length > 0 ? mineList : list;
      } else if (assignScopeFilter === 'TEACHING') {
        const myClassNames = new Set(classes.map((c) => c.name));
        const myClassIds = new Set(classes.map((c) => c.id));
        const myClassKeys = new Set(classes.map((c) => normalizeClassKey(c.name)));

        const teachingList = list.filter((a) => {
          if (LMSStorageService.isAssignmentCreatedByUser(a, currentUser)) return true;
          if (a.classIds.some((cid) => myClassIds.has(cid))) return true;
          if (a.classNames.some((cname) => myClassNames.has(cname))) return true;
          if (a.classNames.some((cname) => myClassKeys.has(normalizeClassKey(cname)))) return true;
          return false;
        });

        // Nếu lọc theo lớp phụ trách có kết quả thì dùng, nếu chưa (hoặc chưa phân công cụ thể) thì hiển thị toàn bộ bài tập để giáo viên không bị trống rỗng
        list = teachingList.length > 0 ? teachingList : list;
      }
      // 'ALL': giáo viên vẫn có thể bấm xem toàn trường khi cần tham khảo đề thi của khối
    } else {
      if (assignScopeFilter === 'MINE') {
        list = list.filter((a) => LMSStorageService.isAssignmentCreatedByUser(a, currentUser));
      }
    }

    // 2. Lọc theo Khối lớp
    if (selectedGradeFilter !== 'ALL') {
      const gNum = parseInt(selectedGradeFilter, 10);
      list = list.filter((a) => a.gradeLevel === gNum);
    }

    // 3. Lọc theo Lớp học được giao cụ thể
    if (selectedClassFilter !== 'ALL') {
      const targetClass = allClasses.find((c) => c.id === selectedClassFilter);
      const targetName = targetClass?.name || selectedClassFilter;
      const targetKey = normalizeClassKey(targetName);

      list = list.filter((a) => {
        if (a.classIds.includes(selectedClassFilter)) return true;
        if (a.classNames.includes(targetName)) return true;
        if (a.classNames.some((cn) => normalizeClassKey(cn) === targetKey)) return true;
        if (a.classIds.some((cid) => normalizeClassKey(cid) === targetKey)) return true;
        return false;
      });
    }

    // 4. Tìm kiếm từ khóa (tên đề thi, tên lớp, giáo viên giao đề)
    if (searchAssignQuery.trim()) {
      const q = searchAssignQuery.trim().toLowerCase();
      list = list.filter(
        (a) =>
          a.testTitle.toLowerCase().includes(q) ||
          a.classNames.some((cn) => cn.toLowerCase().includes(q)) ||
          (a.assignedByName && a.assignedByName.toLowerCase().includes(q))
      );
    }

    return list;
  }, [assignments, isAdmin, assignScopeFilter, selectedClassFilter, selectedGradeFilter, searchAssignQuery, currentUser, classes, allClasses]);

  // Modal chi tiết bài làm học sinh
  const [selectedSubDetail, setSelectedSubDetail] = useState<Submission | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAssign, setEditingAssign] = useState<Assignment | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [deleteAssignId, setDeleteAssignId] = useState<string | null>(null);

  // Modal xem kết quả từng đề thi & học sinh tham gia / chưa tham gia
  const [viewResultAssign, setViewResultAssign] = useState<Assignment | null>(null);
  const [resultModalTab, setResultModalTab] = useState<'ALL' | 'PARTICIPATED' | 'NOT_PARTICIPATED'>('ALL');
  const [resultSearchQuery, setResultSearchQuery] = useState('');

  const [formData, setFormData] = useState({
    testId: assignableTests[0]?.id || '',
    selectedClassIds: assignableClasses[0]?.id ? [assignableClasses[0].id] : ['cls-6-1'],
    startTime: new Date().toISOString().slice(0, 16),
    endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    password: '',
    allowReviewAfterSubmit: true,
    shuffleQuestions: true
  });

  const refreshAssignments = () => {
    setAssignments(LMSStorageService.getAssignments());
  };

  // Lấy dữ liệu Giao đề từ Google Sheet (sheet GiaoDe)
  const handlePullAssignmentsFromGoogleSheet = async () => {
    setIsPullingAssignments(true);
    setSyncAssignMessage('Đang lấy dữ liệu Giao đề từ sheet GiaoDe trên Google Sheet...');
    try {
      const sheetId = getSavedSheetId();
      const token = getGoogleAccessToken();
      let count = 0;
      if (sheetId && token) {
        try {
          count = await GoogleSheetsService.pullAssignmentsFromSheet(sheetId, token);
        } catch (oauthErr) {
          console.warn('OAuth pullAssignments error, trying Apps Script:', oauthErr);
          const res = await GoogleSheetsService.pullAssignmentsFromAppsScript();
          if (res.success) {
            count = res.count;
          } else {
            throw oauthErr;
          }
        }
      } else {
        const res = await GoogleSheetsService.pullAssignmentsFromAppsScript();
        if (res.success) {
          count = res.count;
        } else {
          throw new Error(res.error || 'Lỗi tải giao đề từ Apps Script');
        }
      }
      refreshAssignments();
      setToastMessage(`✓ Đã nạp thành công ${count} đợt giao đề từ sheet GiaoDe về giao diện!`);
      setSyncAssignMessage(`✓ Đã lấy thành công ${count} đợt giao đề từ sheet GiaoDe lúc ${new Date().toLocaleTimeString('vi-VN')}`);
    } catch (err: any) {
      setSyncAssignMessage(`Lỗi tải giao đề: ${err.message || String(err)}`);
    } finally {
      setIsPullingAssignments(false);
    }
  };

  const [showScriptUpdateModal, setShowScriptUpdateModal] = useState(false);

  // Đồng bộ toàn bộ đợt giao đề lên Google Sheet (sheet GiaoDe)
  const handlePushAssignmentsToGoogleSheet = async () => {
    setIsSyncingAssignments(true);
    setSyncAssignMessage('Đang đồng bộ danh sách Giao đề lên sheet GiaoDe...');
    try {
      const res = await GoogleSheetsService.pushAssignmentsToGoogleSheet();
      if (res.success) {
        setToastMessage(`✓ ${res.message}`);
        setSyncAssignMessage(`✓ ${res.message} lúc ${new Date().toLocaleTimeString('vi-VN')}`);
      } else {
        setToastMessage(`⚠️ ${res.message}`);
        setSyncAssignMessage(`⚠️ ${res.message}`);
        if (res.needScriptUpdate) {
          setShowScriptUpdateModal(true);
        }
      }
    } catch (err: any) {
      setSyncAssignMessage(`⚠️ Lỗi đồng bộ: ${err.message || String(err)}`);
    } finally {
      setIsSyncingAssignments(false);
    }
  };

  const handleOpenShareModal = () => {
    const pkg = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      school: 'THCS Phú Hồ',
      tests: LMSStorageService.getTests(),
      assignments: LMSStorageService.getAssignments()
    };
    setShareText(JSON.stringify(pkg, null, 2));
    setImportShareError('');
    setImportShareSuccess('');
    setCopiedShare(false);
    setIsShareModalOpen(true);
  };

  const handleCopyShare = () => {
    navigator.clipboard.writeText(shareText);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2500);
  };

  const handleDownloadShareFile = () => {
    const blob = new Blob([shareText], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `goi-de-thi-giao-de-thcs-phuho-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportShare = () => {
    try {
      setImportShareError('');
      setImportShareSuccess('');
      if (!shareText.trim()) {
        setImportShareError('Vui lòng dán nội dung mã gói dữ liệu JSON vào ô bên dưới!');
        return;
      }
      const parsed = JSON.parse(shareText.trim());
      let tCount = 0;
      let aCount = 0;
      if (Array.isArray(parsed.tests) && parsed.tests.length > 0) {
        LMSStorageService.importTests(parsed.tests);
        tCount = parsed.tests.length;
      }
      if (Array.isArray(parsed.assignments) && parsed.assignments.length > 0) {
        LMSStorageService.importAssignments(parsed.assignments);
        aCount = parsed.assignments.length;
      }
      if (tCount === 0 && aCount === 0) {
        setImportShareError('Không tìm thấy danh sách đề thi (tests) hoặc giao đề (assignments) trong dữ liệu!');
        return;
      }
      refreshAssignments();
      setImportShareSuccess(`✓ Đã nạp thành công ${tCount} đề thi và ${aCount} đợt giao bài vào hệ thống!`);
      setTimeout(() => {
        setIsShareModalOpen(false);
        setImportShareSuccess('');
      }, 2000);
    } catch (e: any) {
      setImportShareError('Dữ liệu JSON không hợp lệ: ' + (e.message || String(e)));
    }
  };

  const handleOpenAdd = () => {
    if (!isAdmin && assignableTests.length === 0) {
      setToastMessage('⚠️ Thầy/Cô chưa có đề kiểm tra nào do mình tạo. Vui lòng vào mục "Tạo đề kiểm tra" để tạo đề trước khi giao bài!');
      setTimeout(() => setToastMessage(null), 5000);
      return;
    }
    setEditingAssign(null);
    setValidationError('');
    setFormData({
      testId: assignableTests[0]?.id || '',
      selectedClassIds: assignableClasses[0]?.id ? [assignableClasses[0].id] : ['cls-6-1'],
      startTime: new Date().toISOString().slice(0, 16),
      endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
      password: '',
      allowReviewAfterSubmit: true,
      shuffleQuestions: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (assign: Assignment) => {
    setEditingAssign(assign);
    setValidationError('');
    setFormData({
      testId: assign.testId,
      selectedClassIds: assign.classIds,
      startTime: safeFormatDateTimeForInput(assign.startTime),
      endTime: safeFormatDateTimeForInput(assign.endTime),
      password: assign.password || '',
      allowReviewAfterSubmit: assign.allowReviewAfterSubmit ?? true,
      shuffleQuestions: assign.shuffleQuestions ?? true
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const test = assignableTests.find((t) => t.id === formData.testId) || allTests.find((t) => t.id === formData.testId);
    if (!test) {
      setValidationError('Vui lòng chọn một đề kiểm tra cần giao!');
      return;
    }
    if (formData.selectedClassIds.length === 0) {
      setValidationError('Vui lòng chọn ít nhất một lớp học để giao bài!');
      return;
    }
    setValidationError('');

    const classNames = allClasses
      .filter((c) => formData.selectedClassIds.includes(c.id))
      .map((c) => c.name);

    if (editingAssign) {
      const updatedAssignment: Assignment = {
        ...editingAssign,
        testId: test.id,
        testTitle: test.title,
        gradeLevel: test.gradeLevel,
        classIds: formData.selectedClassIds,
        classNames,
        startTime: formData.startTime,
        endTime: formData.endTime,
        password: formData.password || undefined,
        allowReviewAfterSubmit: formData.allowReviewAfterSubmit,
        shuffleQuestions: formData.shuffleQuestions
      };

      LMSStorageService.updateAssignment(updatedAssignment);
      GoogleSheetsService.triggerAutoSync('assignments');
      GoogleSheetsService.postToAppsScript({
        action: 'saveAssignment',
        ...updatedAssignment
      }).catch((e) => console.warn('Lỗi ghi saveAssignment Apps Script:', e));
      GoogleSheetsService.pushAssignmentsToGoogleSheet().then((res) => {
        if (!res.success && res.needScriptUpdate) {
          setSyncAssignMessage('⚠️ Google Apps Script trên Google Sheet cần cập nhật phiên bản mới để lưu đợt giao đề sang các thiết bị khác.');
        }
      }).catch(() => {});
      refreshAssignments();
      setIsModalOpen(false);
      setEditingAssign(null);
      setToastMessage('✓ Đã cập nhật đợt giao đề thành công!');
      setTimeout(() => setToastMessage(null), 4000);
      return;
    }

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
    GoogleSheetsService.triggerAutoSync('assignments');
    GoogleSheetsService.postToAppsScript({
      action: 'saveAssignment',
      ...newAssignment
    }).catch((e) => console.warn('Lỗi ghi saveAssignment Apps Script:', e));
    GoogleSheetsService.pushAssignmentsToGoogleSheet().then((res) => {
      if (!res.success && res.needScriptUpdate) {
        setSyncAssignMessage('⚠️ Google Apps Script trên Google Sheet chưa được cập nhật phiên bản mới. Đợt giao đề hiện chỉ lưu trên trình duyệt này!');
      }
    }).catch(() => {});
    refreshAssignments();
    setIsModalOpen(false);
    setToastMessage('✓ Đã giao bài kiểm tra thành công!');
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleDelete = (id: string) => {
    setDeleteAssignId(id);
  };

  const confirmDeleteAssignment = () => {
    if (deleteAssignId) {
      const idToDelete = deleteAssignId;
      LMSStorageService.deleteAssignment(idToDelete);
      GoogleSheetsService.triggerAutoSync('assignments');
      GoogleSheetsService.postToAppsScript({
        action: 'deleteAssignment',
        id: idToDelete
      }).catch((e) => console.warn('Lỗi xóa deleteAssignment Apps Script:', e));
      GoogleSheetsService.pushAssignmentsToGoogleSheet().catch(() => {});
      refreshAssignments();
      setDeleteAssignId(null);
      setToastMessage('✓ Đã xóa đợt giao đề và tự động cập nhật Google Sheet (sheet GiaoDe)!');
      setTimeout(() => setToastMessage(null), 4000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-emerald-700 hover:text-emerald-900 text-sm font-bold ml-2"
          >
            ✕
          </button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Giao bài kiểm tra cho Lớp</h1>
          <p className="text-sm text-slate-500 mt-1">
            Lên lịch thi trực tuyến, đặt hạn nộp bài và chỉ định các lớp làm bài kiểm tra Tin học (Tự động lưu vào Google Sheet)
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={handlePullAssignmentsFromGoogleSheet}
            disabled={isPullingAssignments}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-700 hover:bg-indigo-800 rounded-lg shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
            title="Lấy trực tiếp danh sách đợt giao đề từ sheet GiaoDe trên Google Sheet về giao diện"
          >
            {isPullingAssignments ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <DownloadCloud className="w-3.5 h-3.5" />}
            <span>Lấy dữ liệu từ Sheet GiaoDe</span>
          </button>

          <button
            type="button"
            onClick={handlePushAssignmentsToGoogleSheet}
            disabled={isSyncingAssignments}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
            title="Lưu toàn bộ danh sách đợt giao đề lên sheet GiaoDe"
          >
            {isSyncingAssignments ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UploadCloud className="w-3.5 h-3.5" />}
            <span>Đồng bộ Google Sheet</span>
          </button>

          <button
            type="button"
            onClick={() => setShowScriptUpdateModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors cursor-pointer"
            title="Hướng dẫn đồng bộ Đợt giao đề giữa các trình duyệt và cập nhật Google Apps Script"
          >
            <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
            <span>Hướng dẫn đồng bộ</span>
          </button>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors self-start cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Giao bài mới</span>
          </button>
        </div>
      </div>

      {/* Sync Status Banner */}
      {syncAssignMessage && (
        <div
          className={`flex items-center justify-between p-3 rounded-xl text-xs shadow-xs ${
            syncAssignMessage.startsWith('⚠️') || syncAssignMessage.startsWith('Lỗi')
              ? 'bg-amber-50 border border-amber-200 text-amber-900'
              : 'bg-indigo-50 border border-indigo-200 text-indigo-900'
          }`}
        >
          <div className="flex items-center gap-2">
            {syncAssignMessage.startsWith('⚠️') || syncAssignMessage.startsWith('Lỗi') ? (
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
            )}
            <span>{syncAssignMessage}</span>
            {(syncAssignMessage.startsWith('⚠️') || syncAssignMessage.startsWith('Lỗi')) && (
              <button
                type="button"
                onClick={() => setShowScriptUpdateModal(true)}
                className="underline font-bold text-amber-900 hover:text-amber-950 ml-1 cursor-pointer"
              >
                (Xem cách xử lý)
              </button>
            )}
          </div>
          <span
            className={`font-semibold text-[11px] px-2 py-0.5 rounded ${
              syncAssignMessage.startsWith('⚠️') || syncAssignMessage.startsWith('Lỗi')
                ? 'bg-amber-100 text-amber-800'
                : 'bg-indigo-100 text-indigo-800'
            }`}
          >
            Sheet: GiaoDe
          </span>
        </div>
      )}

      {/* Bộ lọc hiển thị theo Lớp học được giao, Khối lớp và Phạm vi phụ trách */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3.5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          {/* Tabs phạm vi */}
          <div className="flex flex-wrap items-center gap-1.5">
            {!isAdmin ? (
              <>
                <button
                  type="button"
                  onClick={() => setAssignScopeFilter('TEACHING')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    assignScopeFilter === 'TEACHING'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  🏫 Lớp tôi phụ trách ({classes.map(c => c.name).join(', ') || 'Chưa gán'})
                </button>
                <button
                  type="button"
                  onClick={() => setAssignScopeFilter('MINE')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    assignScopeFilter === 'MINE'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  👤 Do tôi giao ({assignments.filter((a) => LMSStorageService.isAssignmentCreatedByUser(a, currentUser)).length})
                </button>
                <button
                  type="button"
                  onClick={() => setAssignScopeFilter('ALL')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    assignScopeFilter === 'ALL'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  🌐 Toàn trường ({assignments.length})
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setAssignScopeFilter('ALL')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    assignScopeFilter === 'ALL'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  🌐 Tất cả đợt giao toàn trường ({assignments.length})
                </button>
                <button
                  type="button"
                  onClick={() => setAssignScopeFilter('MINE')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    assignScopeFilter === 'MINE'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  👤 Do tôi giao ({assignments.filter((a) => LMSStorageService.isAssignmentCreatedByUser(a, currentUser)).length})
                </button>
              </>
            )}
          </div>

          {/* Nút chia sẻ gói giao đề giữa các máy / trình duyệt */}
          <button
            type="button"
            onClick={handleOpenShareModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors cursor-pointer"
            title="Xuất hoặc nhập toàn bộ đề thi & giao đề để dùng ngay trên các trình duyệt / máy tính khác"
          >
            <DownloadCloud className="w-3.5 h-3.5" />
            <span>Chia sẻ / Đồng bộ gói Đề thi & Giao đề (JSON)</span>
          </button>
        </div>

        {/* Thanh lọc chi tiết theo Lớp, Khối và Tìm kiếm */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          {/* Lọc theo Lớp học được giao */}
          <div className="sm:col-span-5 flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600 shrink-0">Lọc theo Lớp:</span>
            <select
              value={selectedClassFilter}
              onChange={(e) => setSelectedClassFilter(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ALL">🏫 Tất cả các lớp ({allClasses.length} lớp)</option>
              {allClasses.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  Lớp {cls.name} ({cls.studentCount || 40} HS) - Khối {cls.gradeId ? cls.gradeId.replace('grade-', '') : '8'}
                </option>
              ))}
            </select>
          </div>

          {/* Lọc theo Khối */}
          <div className="sm:col-span-3 flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600 shrink-0">Khối:</span>
            <select
              value={selectedGradeFilter}
              onChange={(e) => setSelectedGradeFilter(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ALL">Tất cả khối</option>
              <option value="6">Khối 6</option>
              <option value="7">Khối 7</option>
              <option value="8">Khối 8</option>
              <option value="9">Khối 9</option>
            </select>
          </div>

          {/* Tìm kiếm */}
          <div className="sm:col-span-4 relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm theo tên bài thi, lớp..."
              value={searchAssignQuery}
              onChange={(e) => setSearchAssignQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Thông tin số lượng kết quả */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
          <span>
            Đang hiển thị <strong>{visibleAssignments.length}</strong> / <strong>{assignments.length}</strong> đợt giao bài kiểm tra
            {selectedClassFilter !== 'ALL' && (
              <span className="text-indigo-600 font-medium"> · Lớp được chọn: {allClasses.find(c => c.id === selectedClassFilter)?.name || selectedClassFilter}</span>
            )}
            {selectedGradeFilter !== 'ALL' && (
              <span className="text-indigo-600 font-medium"> · Khối: {selectedGradeFilter}</span>
            )}
          </span>
          {(selectedClassFilter !== 'ALL' || selectedGradeFilter !== 'ALL' || searchAssignQuery.trim()) && (
            <button
              type="button"
              onClick={() => {
                setSelectedClassFilter('ALL');
                setSelectedGradeFilter('ALL');
                setSearchAssignQuery('');
              }}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 underline cursor-pointer"
            >
              Xóa bộ lọc
            </button>
          )}
        </div>
      </div>

      {/* Assignment List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {visibleAssignments.length === 0 ? (
          <div className="col-span-full p-8 text-center bg-white rounded-xl border border-slate-200 text-slate-400 text-xs">
            Chưa có đợt kiểm tra nào được giao. Bấm "Giao bài mới" để bắt đầu.
          </div>
        ) : (
          visibleAssignments.map((item: Assignment) => (
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

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(item)}
                    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors cursor-pointer"
                    title="Chỉnh sửa đợt giao bài"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                    title="Hủy giao bài"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-xs border-t border-slate-100 pt-3 text-slate-600">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>Lớp được giao:</span>
                  </span>
                  <div className="flex items-center gap-1">
                    {item.classNames.map((cn: string) => (
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
                  {onNavigate && (
                    <button
                      type="button"
                      onClick={() => {
                        setViewResultAssign(null);
                        onNavigate('results');
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 cursor-pointer"
                      title="Mở toàn màn hình chuyên sâu trong mục Kết quả & Chấm bài"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-indigo-600" />
                      <span className="hidden sm:inline">Trang Chấm bài chi tiết</span>
                    </button>
                  )}
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
                      <th className="px-3.5 py-2.5 text-center">Chi tiết bài thi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {list.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="px-4 py-8 text-center text-slate-400">
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
                            <td className="px-3.5 py-2.5 text-center">
                              {hasSub && sub ? (
                                <button
                                  type="button"
                                  onClick={() => setSelectedSubDetail(sub)}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-colors cursor-pointer shadow-2xs"
                                  title="Xem toàn bộ câu hỏi và đáp án đã làm của học sinh"
                                >
                                  <Eye className="w-3.5 h-3.5 text-indigo-600" />
                                  <span>Xem bài làm</span>
                                </button>
                              ) : (
                                <span className="text-slate-400 text-[11px] italic">Chưa nộp</span>
                              )}
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
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 cursor-pointer"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Modal Xem chi tiết bài làm của học sinh */}
      {selectedSubDetail && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl p-6 max-h-[92vh] overflow-y-auto space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between border-b border-slate-200 pb-3">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-[11px] font-semibold mb-1">
                  <FileText className="w-3.5 h-3.5" />
                  <span>Chi tiết bài làm kiểm tra</span>
                </div>
                <h2 className="text-lg font-bold text-slate-900">{selectedSubDetail.studentName}</h2>
                <div className="text-xs text-slate-500 mt-0.5 flex flex-wrap gap-2">
                  <span>Mã HS: <strong className="font-mono text-slate-700">{selectedSubDetail.studentCode}</strong></span>
                  <span>·</span>
                  <span>Lớp: <strong>{selectedSubDetail.className}</strong></span>
                  <span>·</span>
                  <span>Đề: <strong>{selectedSubDetail.testTitle}</strong></span>
                  <span>·</span>
                  <span>Mã đề: <strong>{selectedSubDetail.variantCode || '101'}</strong></span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSubDetail(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Thống kê bài thi */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200">
                <div className="text-[11px] font-semibold text-indigo-700">Điểm số đạt được</div>
                <div className="text-2xl font-black text-indigo-700 mt-0.5">
                  {selectedSubDetail.score.toFixed(1)} <span className="text-xs font-normal">/ 10</span>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                <div className="text-[11px] font-semibold text-emerald-700">Số câu đúng</div>
                <div className="text-2xl font-black text-emerald-700 mt-0.5">
                  {selectedSubDetail.correctCount} / {selectedSubDetail.totalQuestions}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-[11px] font-semibold text-slate-600">Thời gian làm bài</div>
                <div className="text-lg font-bold text-slate-800 mt-1">
                  {Math.round(selectedSubDetail.timeSpentSeconds / 60)} phút {selectedSubDetail.timeSpentSeconds % 60}s
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-[11px] font-semibold text-slate-600">Thời gian nộp bài</div>
                <div className="text-xs font-medium text-slate-700 mt-1.5">
                  {new Date(selectedSubDetail.submittedAt).toLocaleString('vi-VN')}
                </div>
              </div>
            </div>

            {/* Cảnh báo vi phạm nếu có */}
            {selectedSubDetail.isViolationAutoSubmitted && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <div className="font-bold text-rose-800">
                    Cảnh báo vi phạm nội quy: Rời khỏi màn hình làm bài (Tự động thu hồi)
                  </div>
                  <div className="text-rose-700 font-medium">
                    Lý do: {selectedSubDetail.violationReason || 'Phát hiện chuyển tab hoặc rời ứng dụng trong lúc thi.'}
                  </div>
                </div>
              </div>
            )}

            {/* Chi tiết từng câu hỏi trong bài làm */}
            <div className="space-y-3.5 pt-1">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                Nội dung các câu hỏi và câu trả lời của học sinh:
              </h3>

              {Object.keys(selectedSubDetail.answers || {}).length === 0 ? (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-400">
                  Không có dữ liệu chi tiết từng câu hỏi cho bài nộp này.
                </div>
              ) : (
                Object.entries(selectedSubDetail.answers || {}).map(([qId, ans], idx) => {
                  const q = questions.find((item) => item.id === qId);

                  return (
                    <div key={qId} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-bold text-slate-900 text-xs">
                          Câu {idx + 1}: {q?.content || `Câu hỏi #${qId}`}
                        </span>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {ans.isCorrect ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                              <Check className="w-3 h-3" /> Đúng (+{ans.pointsEarned}đ)
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                              <X className="w-3 h-3" /> Sai (0đ)
                            </span>
                          )}
                        </div>
                      </div>

                      {(q?.imageUrl || q?.imageDriveUrl) && (
                        <div className="my-1.5 p-2 bg-white rounded-lg border border-slate-200 inline-block">
                          <img
                            src={GoogleDriveService.getDriveDirectImageUrl(q.imageUrl || q.imageDriveUrl || '')}
                            alt="Ảnh câu hỏi"
                            className="max-h-36 max-w-full rounded object-contain"
                          />
                        </div>
                      )}

                      {/* Các lựa chọn trắc nghiệm */}
                      {q?.options && q.options.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1 text-xs">
                          {q.options.map((opt) => {
                            const isSelected = ans.selectedOptionId === opt.id || ans.selectedOptionIds?.includes(opt.id);
                            const isCorrect = opt.isCorrect;

                            let optClass = 'bg-white border-slate-200 text-slate-700';
                            if (isSelected && isCorrect) {
                              optClass = 'bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold';
                            } else if (isSelected && !isCorrect) {
                              optClass = 'bg-rose-50 border-rose-300 text-rose-900 font-semibold';
                            } else if (isCorrect) {
                              optClass = 'bg-emerald-50/60 border-emerald-200 text-emerald-800 font-medium';
                            }

                            return (
                              <div
                                key={opt.id}
                                className={`p-2 rounded-lg border flex items-center justify-between gap-2 ${optClass}`}
                              >
                                <span>{opt.text}</span>
                                <div className="flex items-center gap-1 shrink-0">
                                  {isSelected && (
                                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-700 font-bold">
                                      HS chọn
                                    </span>
                                  )}
                                  {isCorrect && (
                                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-bold">
                                      Đáp án đúng
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Tự luận hoặc điền từ */}
                      {ans.textAnswer && (
                        <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-xs">
                          <span className="font-semibold text-slate-500">Bài làm học sinh:</span>
                          <div className="mt-1 font-mono text-slate-900 whitespace-pre-wrap">{ans.textAnswer}</div>
                        </div>
                      )}

                      {/* Lời giải chi tiết */}
                      {q?.explanation && (
                        <div className="p-2.5 rounded-lg bg-indigo-50/50 border border-indigo-100 text-[11px] text-indigo-900">
                          <strong>Lời giải chi tiết:</strong> {q.explanation}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setSelectedSubDetail(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Add Assignment */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md p-6 animate-in fade-in zoom-in-95">
            <h2 className="text-base font-bold text-slate-900 mb-4">
              {editingAssign ? 'Chỉnh sửa & Thay đổi đợt giao bài (Đồng bộ Google Sheet)' : 'Giao bài kiểm tra mới cho lớp (Đồng bộ Google Sheet)'}
            </h2>

            <form onSubmit={handleSave} className="space-y-3.5 text-xs">
              {validationError && (
                <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                  {validationError}
                </div>
              )}

              <div>
                <label className="block font-medium text-slate-700 mb-1">Chọn đề kiểm tra *</label>
                <select
                  required
                  value={formData.testId}
                  onChange={(e) => setFormData({ ...formData, testId: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-800"
                >
                  {assignableTests.length === 0 ? (
                    <option value="">Thầy/Cô chưa có đề thi nào (Vui lòng tạo đề trước)</option>
                  ) : (
                    assignableTests.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.title} (Khối {t.gradeLevel} - {t.durationMinutes}p)
                      </option>
                    ))
                  )}
                </select>
                {assignableTests.length === 0 && (
                  <div className="mt-2 p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs space-y-1.5">
                    <p className="font-semibold">
                      Theo phân quyền: Đề tài khoản nào Tạo thì chỉ xuất hiện ở Tài khoản đó (Riêng Quản trị viên xem tất cả).
                    </p>
                    {onNavigate && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsModalOpen(false);
                          onNavigate('test_builder');
                        }}
                        className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Chuyển sang mục Tạo đề thi</span>
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Chọn các lớp làm bài *</label>
                <div className="grid grid-cols-3 gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200 max-h-32 overflow-y-auto">
                  {assignableClasses.map((cls) => {
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
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingAssign(null);
                  }}
                  className="px-3.5 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  {editingAssign ? 'Cập nhật & Đồng bộ Google Sheet' : 'Xác nhận giao bài'}
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

      {/* Modal Chia sẻ / Đồng bộ gói Đề thi & Giao đề giữa các trình duyệt & thiết bị */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
                  <DownloadCloud className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Chia sẻ & Đồng bộ gói Đề thi & Giao đề</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Xuất hoặc nhập toàn bộ dữ liệu Đề thi và Đợt giao đề để sử dụng ngay trên các trình duyệt / máy tính / IP khác
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsShareModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {importShareSuccess && (
              <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl flex items-center gap-2 border border-emerald-200">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{importShareSuccess}</span>
              </div>
            )}

            {importShareError && (
              <div className="p-3 bg-rose-50 text-rose-800 text-xs rounded-xl flex items-center gap-2 border border-rose-200">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{importShareError}</span>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-600 font-semibold">
                <span>Nội dung mã gói dữ liệu (JSON):</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyShare}
                    className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 cursor-pointer"
                  >
                    {copiedShare ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedShare ? 'Đã sao chép!' : 'Sao chép mã'}</span>
                  </button>
                  <span>·</span>
                  <button
                    type="button"
                    onClick={handleDownloadShareFile}
                    className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 cursor-pointer"
                  >
                    <DownloadCloud className="w-3.5 h-3.5" />
                    <span>Tải tệp .json</span>
                  </button>
                </div>
              </div>
              <textarea
                value={shareText}
                onChange={(e) => setShareText(e.target.value)}
                rows={10}
                placeholder="Dán mã gói dữ liệu JSON vào đây để nạp vào hệ thống..."
                className="w-full p-3 font-mono text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <p className="text-[11px] text-slate-400">
                💡 <strong>Cách dùng:</strong> Trên máy vừa tạo đề/giao đề, bấm "Sao chép mã" hoặc "Tải tệp". Sau đó trên máy/trình duyệt khác, mở mục này, dán mã vào ô trên rồi bấm nút <strong>"Nạp vào hệ thống"</strong> bên dưới.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsShareModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Đóng
              </button>
              <button
                type="button"
                onClick={handleImportShare}
                className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Nạp vào hệ thống ngay</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cập nhật Apps Script & Hướng dẫn đồng bộ sang máy khác */}
      <AppsScriptUpdateNoticeModal
        isOpen={showScriptUpdateModal}
        onClose={() => setShowScriptUpdateModal(false)}
        title="Đồng bộ Đợt giao đề giữa các trình duyệt & thiết bị"
        context="assignment"
      />
    </div>
  );
};
