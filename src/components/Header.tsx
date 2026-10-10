import React, { useState, useEffect, useRef } from 'react';
import {
  GraduationCap,
  Shield,
  UserCheck,
  BookOpen,
  Building2,
  Lock,
  LogOut,
  RotateCcw,
  Menu,
  X,
  ChevronDown,
  CheckCircle2,
  RefreshCw,
  Zap
} from 'lucide-react';
import { User, UserRole } from '../types';
import { LMSStorageService } from '../services/storage';
import { ConfirmDialog } from './common/ConfirmDialog';
import {
  subscribeAutoSyncStatus,
  AutoSyncState,
  getSavedSheetId
} from '../services/googleSheetsService';
import { isSystemConnected } from '../services/systemConfig';

export interface RoleMeta {
  title: string;
  badgeLabel: string;
  description: string;
  icon: React.ReactNode;
  badgeClass: string;
  cardBg: string;
}

export const ROLE_METAS: Record<UserRole, RoleMeta> = {
  ADMIN: {
    title: 'Quản trị viên Hệ thống',
    badgeLabel: 'Quản trị viên',
    description: 'Toàn quyền quản trị tài khoản, lớp học, đề thi & CSDL Google Sheets',
    icon: <Shield className="w-4 h-4 text-rose-600" />,
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
    cardBg: 'bg-rose-50/70 border-rose-200 text-rose-900'
  },
  PRINCIPAL: {
    title: 'Ban Giám Hiệu nhà trường',
    badgeLabel: 'Ban Giám Hiệu',
    description: 'Giám sát hoạt động, theo dõi thống kê và duyệt đề thi toàn trường',
    icon: <Building2 className="w-4 h-4 text-purple-600" />,
    badgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
    cardBg: 'bg-purple-50/70 border-purple-200 text-purple-900'
  },
  DEPARTMENT_HEAD: {
    title: 'Tổ trưởng Bộ môn Tin học',
    badgeLabel: 'Tổ trưởng Tin học',
    description: 'Quản lý ngân hàng câu hỏi, ma trận đề và tổ chức kiểm tra theo khối',
    icon: <UserCheck className="w-4 h-4 text-indigo-600" />,
    badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    cardBg: 'bg-indigo-50/70 border-indigo-200 text-indigo-900'
  },
  TEACHER: {
    title: 'Giáo viên Tin học',
    badgeLabel: 'Giáo viên',
    description: 'Tạo đề kiểm tra, giao bài, chấm điểm và đánh giá lớp phụ trách',
    icon: <BookOpen className="w-4 h-4 text-emerald-600" />,
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    cardBg: 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
  },
  STUDENT: {
    title: 'Học sinh',
    badgeLabel: 'Học sinh',
    description: 'Làm bài kiểm tra trực tuyến và tra cứu lịch sử, điểm số',
    icon: <GraduationCap className="w-4 h-4 text-sky-600" />,
    badgeClass: 'bg-sky-50 text-sky-700 border-sky-200',
    cardBg: 'bg-sky-50/70 border-sky-200 text-sky-900'
  }
};

interface HeaderProps {
  currentUser: User;
  onResetData: () => void;
  onLogout?: () => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onResetData,
  onLogout,
  mobileMenuOpen,
  setMobileMenuOpen
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Auto-sync status tracking
  const [autoSyncState, setAutoSyncState] = useState<AutoSyncState>({ status: 'disconnected' });
  const hasSheet = isSystemConnected() || Boolean(getSavedSheetId());

  useEffect(() => {
    const unsub = subscribeAutoSyncStatus((st) => setAutoSyncState(st));
    return () => unsub();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const roleMeta = ROLE_METAS[currentUser.role] || ROLE_METAS.STUDENT;

  // Get class details if student or teacher
  const classes = LMSStorageService.getClasses();
  const studentClass = currentUser.classId
    ? classes.find((c) => c.id === currentUser.classId)?.name
    : null;

  const assignedClassesText = currentUser.assignedClassIds?.length
    ? classes
        .filter((c) => currentUser.assignedClassIds?.includes(c.id))
        .map((c) => c.name)
        .join(', ')
    : null;

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & School Name */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 focus:outline-hidden cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-slate-200 shadow-xs bg-white flex items-center justify-center shrink-0">
                <img
                  src="/logo.jpg"
                  alt="Logo Cổng Kiểm Tra Trực Tuyến"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.style.display = 'none';
                    if (target.nextElementSibling) {
                      (target.nextElementSibling as HTMLElement).style.display = 'flex';
                    }
                  }}
                />
                <div
                  style={{ display: 'none' }}
                  className="w-full h-full bg-indigo-600 flex items-center justify-center text-white"
                >
                  <GraduationCap className="w-6 h-6" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-base tracking-tight">
                    THCS PHÚ HỒ - CỔNG KIỂM TRA TRỰC TUYẾN
                  </span>
                  <span className="hidden sm:inline-block text-xs font-semibold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
                    GDPT 2018
                  </span>
                </div>
                <div className="text-xs text-slate-500 font-medium">
                  Hệ thống kiểm tra & đánh giá trực tuyến
                </div>
              </div>
            </div>
          </div>

          {/* Right Status & Current User Identity (Vai trò cố định) */}
          <div className="flex items-center gap-3">
            {/* Auto-Sync Live Badge */}
            {hasSheet && (
              <div className="hidden sm:flex items-center">
                {autoSyncState.status === 'syncing' ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 animate-pulse">
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    <span>Đang lưu Google Sheet...</span>
                  </span>
                ) : autoSyncState.status === 'synced' ? (
                  <span
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200"
                    title={`Đã tự động đồng bộ lúc ${autoSyncState.lastSyncedTime || 'vừa xong'}`}
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Sheet: Đã lưu</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Sheet: Đã kết nối</span>
                  </span>
                )}
              </div>
            )}

            {/* User Account & Fixed Role Profile Display */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-all cursor-pointer shadow-2xs group"
                aria-expanded={dropdownOpen}
                title="Thông tin tài khoản và vai trò"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                  {currentUser.fullName.charAt(0)}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="font-semibold text-slate-800 text-xs leading-tight">
                    {currentUser.fullName}
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold border ${roleMeta.badgeClass}`}>
                      {roleMeta.icon}
                      <span>{roleMeta.badgeLabel}</span>
                    </span>
                  </div>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180 text-indigo-600' : ''}`} />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 py-3 z-50 animate-in fade-in zoom-in-95 duration-100">
                  {/* User identity Header */}
                  <div className="px-4 pb-3 border-b border-slate-100 flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-base shadow-xs shrink-0">
                      {currentUser.fullName.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-bold text-slate-900 truncate">{currentUser.fullName}</h4>
                      <p className="text-xs text-slate-500 font-mono">@{currentUser.username}</p>
                      <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
                    </div>
                  </div>

                  {/* Fixed Role Display Card - Cố định vai trò */}
                  <div className="p-3 mx-3 my-2 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Vai trò gắn với tài khoản
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-600 bg-white px-2 py-0.5 rounded-full border border-slate-200 shadow-2xs">
                        <Lock className="w-3 h-3 text-amber-600" />
                        <span>Cố định</span>
                      </span>
                    </div>

                    <div className={`p-2.5 rounded-lg border flex items-start gap-2.5 ${roleMeta.cardBg}`}>
                      <div className="mt-0.5 shrink-0">{roleMeta.icon}</div>
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-xs leading-tight">
                          {roleMeta.title}
                        </div>
                        <p className="text-[11px] opacity-90 mt-0.5 leading-snug">
                          {roleMeta.description}
                        </p>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-0.5">
                      <Lock className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>Vai trò được gán cố định theo tài khoản, không thể tự chuyển đổi.</span>
                    </div>
                  </div>

                  {/* Account Metadata */}
                  <div className="px-4 py-2 space-y-1.5 text-xs border-b border-slate-100">
                    {currentUser.role === 'STUDENT' && (
                      <>
                        {studentClass && (
                          <div className="flex justify-between items-center text-slate-600">
                            <span className="text-slate-400">Lớp học:</span>
                            <span className="font-semibold text-slate-800">Lớp {studentClass}</span>
                          </div>
                        )}
                        {currentUser.studentCode && (
                          <div className="flex justify-between items-center text-slate-600">
                            <span className="text-slate-400">Mã học sinh:</span>
                            <span className="font-mono font-medium text-slate-800">{currentUser.studentCode}</span>
                          </div>
                        )}
                      </>
                    )}

                    {(currentUser.role === 'TEACHER' || currentUser.role === 'DEPARTMENT_HEAD') && (
                      <>
                        {currentUser.teacherCode && (
                          <div className="flex justify-between items-center text-slate-600">
                            <span className="text-slate-400">Mã giáo viên:</span>
                            <span className="font-mono font-medium text-slate-800">{currentUser.teacherCode}</span>
                          </div>
                        )}
                        {assignedClassesText && (
                          <div className="flex justify-between items-center text-slate-600">
                            <span className="text-slate-400">Lớp phụ trách:</span>
                            <span className="font-medium text-slate-800">{assignedClassesText}</span>
                          </div>
                        )}
                      </>
                    )}

                    {currentUser.phone && (
                      <div className="flex justify-between items-center text-slate-600">
                        <span className="text-slate-400">Điện thoại:</span>
                        <span className="text-slate-700 font-mono">{currentUser.phone}</span>
                      </div>
                    )}

                    <div className="flex justify-between items-center text-slate-600">
                      <span className="text-slate-400">Đơn vị:</span>
                      <span className="text-slate-700 font-medium">Trường THCS Phú Hồ</span>
                    </div>
                  </div>

                  {/* Bottom Actions */}
                  <div className="pt-2 px-3 space-y-1">
                    {currentUser.role === 'ADMIN' && (
                      <button
                        type="button"
                        onClick={() => {
                          setDropdownOpen(false);
                          setShowResetConfirm(true);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-amber-700 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
                        <span>Khôi phục dữ liệu mẫu THCS Phú Hồ</span>
                      </button>
                    )}

                    {onLogout && (
                      <button
                        type="button"
                        onClick={() => {
                          setDropdownOpen(false);
                          onLogout();
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer font-semibold"
                      >
                        <div className="flex items-center gap-2">
                          <LogOut className="w-4 h-4 text-rose-600" />
                          <span>Đăng xuất khỏi hệ thống</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-normal">Đổi tài khoản</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Dialog (Dành cho Quản trị viên) */}
      <ConfirmDialog
        isOpen={showResetConfirm}
        title="Khôi phục dữ liệu mẫu"
        message="Hệ thống sẽ đặt lại toàn bộ dữ liệu mẫu ban đầu về học sinh, lớp học, ngân hàng câu hỏi và các đề thi của THCS Phú Hồ. Bạn có chắc chắn muốn thực hiện?"
        confirmLabel="Khôi phục dữ liệu"
        cancelLabel="Hủy"
        isDanger={false}
        onConfirm={() => {
          setShowResetConfirm(false);
          onResetData();
        }}
        onCancel={() => setShowResetConfirm(false)}
      />
    </header>
  );
};
