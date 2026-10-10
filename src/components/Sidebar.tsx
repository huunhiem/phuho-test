import React from 'react';
import {
  LayoutDashboard,
  Users,
  Layers,
  HelpCircle,
  FileText,
  Send,
  Award,
  BarChart3,
  FileSpreadsheet,
  CloudCog,
  BookOpenCheck,
  History,
  GraduationCap,
  Lock,
  Shield,
  Building2,
  UserCheck,
  BookOpen
} from 'lucide-react';
import { User, UserRole } from '../types';
import { ROLE_METAS } from './Header';

export type NavTab =
  | 'admin_dashboard'
  | 'admin_users'
  | 'admin_classes'
  | 'admin_lessons'
  | 'admin_import'
  | 'google_sheets'
  | 'firebase_guide'
  | 'principal_dashboard'
  | 'teacher_dashboard'
  | 'teacher_classes'
  | 'question_bank'
  | 'test_builder'
  | 'assignments'
  | 'results'
  | 'question_analysis'
  | 'student_dashboard'
  | 'student_history';

interface SidebarProps {
  currentUser: User;
  currentRole: UserRole;
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

interface NavItem {
  id: NavTab;
  label: string;
  icon: React.ReactNode;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentUser,
  currentRole,
  activeTab,
  onTabChange,
  mobileMenuOpen,
  setMobileMenuOpen
}) => {
  const roleMeta = ROLE_METAS[currentRole] || ROLE_METAS.STUDENT;

  const getNavItems = (): NavItem[] => {
    switch (currentRole) {
      case 'ADMIN':
        return [
          { id: 'admin_dashboard', label: 'Dashboard Quản trị', icon: <LayoutDashboard className="w-5 h-5" /> },
          { id: 'results', label: 'Kết quả từng đề thi', icon: <Award className="w-5 h-5 text-amber-600" /> },
          { id: 'assignments', label: 'Quản lý giao đề kiểm tra', icon: <Send className="w-5 h-5 text-indigo-600" /> },
          { id: 'admin_users', label: 'Quản lý Người dùng', icon: <Users className="w-5 h-5" /> },
          { id: 'admin_classes', label: 'Quản lý Khối & Lớp', icon: <Layers className="w-5 h-5" /> },
          { id: 'admin_lessons', label: 'Cấu hình Tên Bài học', icon: <BookOpen className="w-5 h-5" /> },
          { id: 'question_bank', label: 'Ngân hàng câu hỏi', icon: <HelpCircle className="w-5 h-5" /> },
          { id: 'test_builder', label: 'Đề kiểm tra', icon: <FileText className="w-5 h-5" /> },
          { id: 'admin_import', label: 'Import Excel / CSV', icon: <FileSpreadsheet className="w-5 h-5" /> },
          { id: 'google_sheets', label: 'Cấu hình CSDL Google Sheet', icon: <FileSpreadsheet className="w-5 h-5 text-emerald-600" /> },
          { id: 'firebase_guide', label: 'Cấu hình Firebase', icon: <CloudCog className="w-5 h-5" /> }
        ];

      case 'PRINCIPAL':
        return [
          { id: 'principal_dashboard', label: 'Báo cáo BGH', icon: <LayoutDashboard className="w-5 h-5" /> },
          { id: 'question_bank', label: 'Ngân hàng câu hỏi', icon: <HelpCircle className="w-5 h-5" /> },
          { id: 'test_builder', label: 'Giám sát Đề thi', icon: <FileText className="w-5 h-5" /> },
          { id: 'results', label: 'Kết quả toàn trường', icon: <Award className="w-5 h-5" /> },
          { id: 'question_analysis', label: 'Phân tích câu hỏi', icon: <BarChart3 className="w-5 h-5" /> }
        ];

      case 'DEPARTMENT_HEAD':
        return [
          { id: 'teacher_dashboard', label: 'Dashboard Tổ Tin học', icon: <LayoutDashboard className="w-5 h-5" /> },
          { id: 'question_bank', label: 'Ngân hàng câu hỏi', icon: <HelpCircle className="w-5 h-5" /> },
          { id: 'test_builder', label: 'Tạo đề kiểm tra', icon: <FileText className="w-5 h-5" /> },
          { id: 'assignments', label: 'Giao bài theo khối', icon: <Send className="w-5 h-5" /> },
          { id: 'results', label: 'Kết quả từng đề thi & Chấm bài', icon: <Award className="w-5 h-5" /> },
          { id: 'question_analysis', label: 'Phân tích câu hỏi', icon: <BarChart3 className="w-5 h-5" /> }
        ];

      case 'TEACHER':
        return [
          { id: 'teacher_dashboard', label: 'Dashboard Giáo viên', icon: <LayoutDashboard className="w-5 h-5" /> },
          { id: 'teacher_classes', label: 'Lớp học phụ trách', icon: <GraduationCap className="w-5 h-5" /> },
          { id: 'question_bank', label: 'Ngân hàng câu hỏi', icon: <HelpCircle className="w-5 h-5" /> },
          { id: 'test_builder', label: 'Tạo đề kiểm tra', icon: <FileText className="w-5 h-5" /> },
          { id: 'assignments', label: 'Giao bài kiểm tra', icon: <Send className="w-5 h-5" /> },
          { id: 'results', label: 'Kết quả từng đề thi & Chấm bài', icon: <Award className="w-5 h-5" /> },
          { id: 'question_analysis', label: 'Phân tích câu hỏi', icon: <BarChart3 className="w-5 h-5" /> }
        ];

      case 'STUDENT':
        return [
          { id: 'student_dashboard', label: 'Bài kiểm tra được giao', icon: <BookOpenCheck className="w-5 h-5" /> },
          { id: 'student_history', label: 'Lịch sử & Kết quả', icon: <History className="w-5 h-5" /> }
        ];

      default:
        return [];
    }
  };

  const navItems = getNavItems();

  const handleSelect = (id: NavTab) => {
    onTabChange(id);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-20 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed md:sticky top-16 z-20 h-[calc(100vh-4rem)] w-64 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-200 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-4 space-y-3 overflow-y-auto">
          {/* User Role Card in Sidebar - Cố định vai trò */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-2xs shrink-0">
                {currentUser.fullName.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-slate-800 truncate">
                  {currentUser.fullName}
                </div>
                <div className="text-[10px] text-slate-500 font-mono truncate">
                  @{currentUser.username}
                </div>
              </div>
            </div>

            <div className="pt-1.5 border-t border-slate-200/80 flex items-center justify-between">
              <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold border ${roleMeta.badgeClass}`}>
                {roleMeta.icon}
                <span>{roleMeta.badgeLabel}</span>
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-500" title="Vai trò cố định theo tài khoản">
                <Lock className="w-2.5 h-2.5 text-slate-400" />
                <span>Cố định</span>
              </span>
            </div>
          </div>

          <div className="px-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Menu chức năng
          </div>

          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelect(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer info box */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="text-xs text-slate-500 space-y-1">
            <div className="font-semibold text-slate-700">Trường THCS Phú Hồ</div>
            <div>Môn: Tin học THCS (6-9)</div>
            <div className="text-[11px] text-slate-400">Phiên bản v1</div>
          </div>
        </div>
      </aside>
    </>
  );
};
