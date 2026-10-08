import React, { useState, useEffect } from 'react';
import { User, UserRole } from './types';
import { LMSStorageService } from './services/storage';
import { Header } from './components/Header';
import { Sidebar, NavTab } from './components/Sidebar';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { UserManagement } from './components/admin/UserManagement';
import { ClassManagement } from './components/admin/ClassManagement';
import { TeacherDashboard } from './components/teacher/TeacherDashboard';
import { TeacherClasses } from './components/teacher/TeacherClasses';
import { QuestionBank } from './components/teacher/QuestionBank';
import { TestBuilder } from './components/teacher/TestBuilder';
import { AssignmentManager } from './components/teacher/AssignmentManager';
import { ResultsAndGrading } from './components/teacher/ResultsAndGrading';
import { QuestionAnalysis } from './components/teacher/QuestionAnalysis';
import { StudentDashboard } from './components/student/StudentDashboard';
import { PrincipalView } from './components/principal/PrincipalView';
import { FirebaseConfigGuide } from './components/firebase/FirebaseConfigGuide';
import { GoogleSheetManager } from './components/sheets/GoogleSheetManager';
import { LoginScreen } from './components/auth/LoginScreen';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
  const stored = LMSStorageService.getStoredUser();

  if (!stored) {
    return null;
  }

  const status = String(
    (stored as any).status ??
    (stored as any).Status ??
    'ACTIVE'
  ).toUpperCase();

  if (
    status === 'LOCKED' ||
    status === '0' ||
    status === 'FALSE'
  ) {
    LMSStorageService.clearCurrentUser();
    return null;
  }

  return stored;
});
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getDefaultTabForRole = (role: UserRole): NavTab => {
    switch (role) {
      case 'ADMIN':
        return 'admin_dashboard';
      case 'PRINCIPAL':
        return 'principal_dashboard';
      case 'DEPARTMENT_HEAD':
      case 'TEACHER':
        return 'teacher_dashboard';
      case 'STUDENT':
        return 'student_dashboard';
    }
  };

  const [activeTab, setActiveTab] = useState<NavTab>(() =>
    currentUser ? getDefaultTabForRole(currentUser.role) : 'student_dashboard'
  );

  // Khi đăng nhập thành công, lưu tài khoản và kích hoạt màn hình đúng theo vai trò của tài khoản đó
  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    LMSStorageService.setCurrentUser(user);
    setActiveTab(getDefaultTabForRole(user.role));
  };

  // Đăng xuất hoàn toàn để đổi sang tài khoản khác
  const handleLogout = () => {
    LMSStorageService.clearCurrentUser();
    setCurrentUser(null);
  };

  // Khôi phục dữ liệu mẫu (dành cho Admin)
  const handleResetData = () => {
    LMSStorageService.resetToDefault();
    // Sau khi reset, cập nhật lại thông tin Admin từ danh sách mới
    const allUsers = LMSStorageService.getUsers();
    const adminUser = allUsers.find((u) => u.role === 'ADMIN') || allUsers[0];
    if (adminUser) {
      setCurrentUser(adminUser);
      LMSStorageService.setCurrentUser(adminUser);
      setActiveTab(getDefaultTabForRole(adminUser.role));
    }
  };

  // Đảm bảo tab hiện tại luôn phù hợp với vai trò của tài khoản đang đăng nhập
  useEffect(() => {
    if (!currentUser) return;

    const validAdminTabs: NavTab[] = [
      'admin_dashboard',
      'admin_users',
      'admin_classes',
      'question_bank',
      'test_builder',
      'admin_import',
      'google_sheets',
      'firebase_guide'
    ];

    const validPrincipalTabs: NavTab[] = [
      'principal_dashboard',
      'question_bank',
      'test_builder',
      'results',
      'question_analysis',
      'google_sheets'
    ];

    const validTeacherTabs: NavTab[] = [
      'teacher_dashboard',
      'teacher_classes',
      'question_bank',
      'test_builder',
      'assignments',
      'results',
      'question_analysis',
      'google_sheets'
    ];

    const validStudentTabs: NavTab[] = ['student_dashboard', 'student_history'];

    let isTabValid = false;
    switch (currentUser.role) {
      case 'ADMIN':
        isTabValid = validAdminTabs.includes(activeTab);
        break;
      case 'PRINCIPAL':
        isTabValid = validPrincipalTabs.includes(activeTab);
        break;
      case 'DEPARTMENT_HEAD':
      case 'TEACHER':
        isTabValid = validTeacherTabs.includes(activeTab);
        break;
      case 'STUDENT':
        isTabValid = validStudentTabs.includes(activeTab);
        break;
    }

    if (!isTabValid) {
      setActiveTab(getDefaultTabForRole(currentUser.role));
    }
  }, [currentUser, activeTab]);

  // Nếu người dùng chưa đăng nhập, hiển thị giao diện Đăng nhập đầu tiên
  if (!currentUser) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  // Phân quyền nội dung hiển thị nghiêm ngặt theo vai trò gắn với tài khoản
  const renderContent = () => {
    // Học sinh chỉ được phép truy cập giao diện học sinh
    if (currentUser.role === 'STUDENT') {
      return <StudentDashboard currentUser={currentUser} />;
    }

    // Ban Giám Hiệu
    if (currentUser.role === 'PRINCIPAL') {
      switch (activeTab) {
        case 'principal_dashboard':
          return <PrincipalView />;
        case 'question_bank':
          return <QuestionBank currentUser={currentUser} />;
        case 'test_builder':
          return (
            <TestBuilder
              currentUser={currentUser}
              onTestCreated={() => setActiveTab('principal_dashboard')}
            />
          );
        case 'results':
          return <ResultsAndGrading currentUser={currentUser} />;
        case 'question_analysis':
          return <QuestionAnalysis />;
        case 'google_sheets':
          return <GoogleSheetManager />;
        default:
          return <PrincipalView />;
      }
    }

    // Quản trị viên
    if (currentUser.role === 'ADMIN') {
      switch (activeTab) {
        case 'admin_dashboard':
          return <AdminDashboard onNavigate={setActiveTab} />;
        case 'admin_users':
        case 'admin_import':
          return <UserManagement />;
        case 'admin_classes':
          return <ClassManagement />;
        case 'google_sheets':
          return <GoogleSheetManager />;
        case 'firebase_guide':
          return <FirebaseConfigGuide />;
        case 'question_bank':
          return <QuestionBank currentUser={currentUser} />;
        case 'test_builder':
          return (
            <TestBuilder
              currentUser={currentUser}
              onTestCreated={() => setActiveTab('test_builder')}
            />
          );
        default:
          return <AdminDashboard onNavigate={setActiveTab} />;
      }
    }

    // Giáo viên & Tổ trưởng chuyên môn
    switch (activeTab) {
      case 'teacher_dashboard':
        return <TeacherDashboard currentUser={currentUser} onNavigate={setActiveTab} />;
      case 'teacher_classes':
        return <TeacherClasses currentUser={currentUser} />;
      case 'question_bank':
        return <QuestionBank currentUser={currentUser} />;
      case 'test_builder':
        return (
          <TestBuilder
            currentUser={currentUser}
            onTestCreated={() => setActiveTab('assignments')}
          />
        );
      case 'assignments':
        return <AssignmentManager currentUser={currentUser} />;
      case 'results':
        return <ResultsAndGrading currentUser={currentUser} />;
      case 'question_analysis':
        return <QuestionAnalysis />;
      case 'google_sheets':
        return <GoogleSheetManager />;
      default:
        return <TeacherDashboard currentUser={currentUser} onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header
        currentUser={currentUser}
        onResetData={handleResetData}
        onLogout={handleLogout}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar
          currentUser={currentUser}
          currentRole={currentUser.role}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
