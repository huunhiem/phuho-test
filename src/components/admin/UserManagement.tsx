import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  UserPlus,
  Filter,
  Trash2,
  Edit2,
  FileSpreadsheet,
  Download,
  Upload,
  CheckCircle2,
  AlertCircle,
  Key,
  Eye,
  EyeOff,
  Copy,
  Check,
  RefreshCw,
  Zap,
  Lock
} from 'lucide-react';
import { User, UserRole } from '../../types';
import { LMSStorageService } from '../../services/storage';
import { ConfirmDialog } from '../common/ConfirmDialog';
import {
  subscribeAutoSyncStatus,
  AutoSyncState,
  getSavedSheetId
} from '../../services/googleSheetsService';

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>(() => LMSStorageService.getUsers());
  const [classes] = useState(() => LMSStorageService.getClasses());
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [classFilter, setClassFilter] = useState<string>('ALL');
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);

  // Password visibility tracking per user row
  const [revealedPasswords, setRevealedPasswords] = useState<Record<string, boolean>>({});
  const [copiedUserId, setCopiedUserId] = useState<string | null>(null);

  // Auto-sync status
  const [autoSyncState, setAutoSyncState] = useState<AutoSyncState>({ status: 'disconnected' });
  const hasSheet = Boolean(getSavedSheetId());

  useEffect(() => {
    const unsub = subscribeAutoSyncStatus((st) => setAutoSyncState(st));
    return () => unsub();
  }, []);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showModalPassword, setShowModalPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    fullName: '',
    email: '',
    role: 'STUDENT' as UserRole,
    phone: '',
    studentCode: '',
    teacherCode: '',
    classId: '',
    gradeId: 'grade-6'
  });

  // Excel / CSV Import Modal
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importText, setImportText] = useState('');
  const [importPreview, setImportPreview] = useState<any[]>([]);
  const [importSuccessMessage, setImportSuccessMessage] = useState('');

  const refreshUsers = () => {
    setUsers(LMSStorageService.getUsers());
  };

  const handleOpenAdd = () => {
    setEditingUser(null);
    const randomCode = `PH25-${Math.floor(100000 + Math.random() * 900000)}`;
    setFormData({
      username: `hs.${randomCode.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
      password: '123456',
      fullName: '',
      email: '',
      role: 'STUDENT',
      phone: '',
      studentCode: randomCode,
      teacherCode: '',
      classId: classes[0]?.id || '',
      gradeId: 'grade-6'
    });
    setShowModalPassword(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      username: user.username || user.email.split('@')[0],
      password: user.password || '123456',
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      phone: user.phone || '',
      studentCode: user.studentCode || '',
      teacherCode: user.teacherCode || '',
      classId: user.classId || '',
      gradeId: user.gradeId || 'grade-6'
    });
    setShowModalPassword(false);
    setIsModalOpen(true);
  };

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
    let res = '';
    for (let i = 0; i < 8; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData((prev) => ({ ...prev, password: res }));
    setShowModalPassword(true);
  };

  const toggleRevealPassword = (userId: string) => {
    setRevealedPasswords((prev) => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  const copyCredentials = (user: User) => {
    const pwd = user.password || (user.role === 'STUDENT' ? '123456' : 'phuho@2025');
    const text = `Tài khoản: ${user.username || user.email}\nMật khẩu: ${pwd}\nHọ tên: ${user.fullName}`;
    navigator.clipboard.writeText(text);
    setCopiedUserId(user.id);
    setTimeout(() => setCopiedUserId(null), 2000);
  };

  const handleDelete = (id: string) => {
    setDeleteUserId(id);
  };

  const confirmDeleteUser = () => {
    if (deleteUserId) {
      LMSStorageService.deleteUser(deleteUserId);
      refreshUsers();
      setDeleteUserId(null);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim()) return;

    if (editingUser) {
      const updated: User = {
        ...editingUser,
        ...formData
      };
      LMSStorageService.updateUser(updated);
    } else {
      const newUser: User = {
        id: `user-${Date.now()}`,
        username: formData.username || formData.email.split('@')[0] || `user_${Date.now()}`,
        password: formData.password || (formData.role === 'STUDENT' ? '123456' : 'phuho@2025'),
        fullName: formData.fullName,
        email: formData.email,
        role: formData.role,
        phone: formData.phone,
        schoolId: 'school-phuho-01',
        classId: formData.role === 'STUDENT' ? formData.classId : undefined,
        gradeId: formData.role === 'STUDENT' ? formData.gradeId : undefined,
        studentCode: formData.role === 'STUDENT' ? formData.studentCode : undefined,
        teacherCode: formData.role === 'TEACHER' || formData.role === 'DEPARTMENT_HEAD' ? formData.teacherCode : undefined,
        createdAt: new Date().toISOString().split('T')[0]
      };
      LMSStorageService.addUser(newUser);
    }

    setIsModalOpen(false);
    refreshUsers();
  };

  // CSV Import preview handler
  const handleParseCSV = (rawText: string) => {
    setImportText(rawText);
    const lines = rawText.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);
    if (lines.length <= 1) {
      setImportPreview([]);
      return;
    }

    // Expected headers: Họ và tên, Mã số HS, Tên đăng nhập, Mật khẩu, Lớp, Email
    const previewList = [];
    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(',').map((p) => p.replace(/"/g, '').trim());
      if (parts.length >= 2) {
        const studentCode = parts[1] || `PH25-${Math.floor(100000 + Math.random() * 900000)}`;
        const username = parts[2] || `hs.${studentCode.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
        const password = parts[3] || '123456';
        const className = parts[4] || '6/1';
        const email = parts[5] || `${username}@thcs-phuho.edu.vn`;

        previewList.push({
          fullName: parts[0] || 'Học sinh mới',
          studentCode,
          username,
          password,
          className,
          email
        });
      }
    }
    setImportPreview(previewList);
  };

  const handleExecuteImport = () => {
    if (importPreview.length === 0) return;

    const newUsers: User[] = importPreview.map((item, idx) => {
      const matchedClass = classes.find((c) => c.name === item.className) || classes[0];
      return {
        id: `user-import-${Date.now()}-${idx}`,
        username: item.username,
        password: item.password || '123456',
        fullName: item.fullName,
        email: item.email,
        role: 'STUDENT',
        schoolId: 'school-phuho-01',
        studentCode: item.studentCode,
        classId: matchedClass?.id,
        gradeId: matchedClass?.gradeId || 'grade-6',
        createdAt: new Date().toISOString().split('T')[0]
      };
    });

    LMSStorageService.importStudents(newUsers);
    refreshUsers();
    setImportSuccessMessage(`Đã thêm thành công ${newUsers.length} học sinh và tự động đồng bộ lên Google Sheet!`);
    setTimeout(() => {
      setIsImportModalOpen(false);
      setImportSuccessMessage('');
      setImportPreview([]);
      setImportText('');
    }, 1500);
  };

  const downloadSampleTemplate = () => {
    const csvContent =
      'Họ và tên,Mã số HS,Tên đăng nhập,Mật khẩu,Lớp,Email\n' +
      'Nguyễn Văn An,PH25-060110,hs.an0601,123456,6/1,an.nv@thcs-phuho.edu.vn\n' +
      'Trần Thị Bích,PH25-060111,hs.bich0601,123456,6/1,bich.tt@thcs-phuho.edu.vn\n' +
      'Lê Đức Cường,PH25-060212,hs.cuong0602,123456,6/2,cuong.ld@thcs-phuho.edu.vn';
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'mau_danh_sach_tai_khoan_hoc_sinh.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.username && u.username.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (u.studentCode && u.studentCode.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (u.teacherCode && u.teacherCode.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    const matchesClass = classFilter === 'ALL' || u.classId === classFilter;

    return matchesSearch && matchesRole && matchesClass;
  });

  return (
    <div className="space-y-6">
      {/* Title & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Quản lý Người dùng & Tài khoản</h1>
            {hasSheet && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                <Zap className="w-3 h-3 text-emerald-600" />
                <span>Auto-Sync Google Sheet</span>
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Quản trị tài khoản, tên đăng nhập, mật khẩu Giáo viên, Học sinh, BGH (Đồng bộ tức thì vào Google Sheet)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {autoSyncState.status === 'syncing' && (
            <span className="text-xs text-indigo-600 flex items-center gap-1 mr-2 animate-pulse font-medium">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Đang lưu vào Sheet...</span>
            </span>
          )}

          <button
            type="button"
            onClick={() => setIsImportModalOpen(true)}
            className="inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-colors cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>Import Excel/CSV</span>
          </button>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Thêm tài khoản</span>
          </button>
        </div>
      </div>

      {/* Filters and search */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo họ tên, username, email, mã HS/GV..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">Tất cả vai trò</option>
            <option value="STUDENT">Học sinh</option>
            <option value="TEACHER">Giáo viên</option>
            <option value="DEPARTMENT_HEAD">Tổ trưởng</option>
            <option value="PRINCIPAL">Ban Giám Hiệu</option>
            <option value="ADMIN">Quản trị viên</option>
          </select>

          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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

      {/* Users table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Họ và tên</th>
                <th className="px-4 py-3">Tài khoản & Username</th>
                <th className="px-4 py-3">Mật khẩu đăng nhập</th>
                <th className="px-4 py-3">Vai trò</th>
                <th className="px-4 py-3">Mã định danh</th>
                <th className="px-4 py-3">Lớp học</th>
                <th className="px-4 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                    Không tìm thấy người dùng phù hợp.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const assignedClass = classes.find((c) => c.id === user.classId);
                  const isRevealed = Boolean(revealedPasswords[user.id]);
                  const currentPassword = user.password || (user.role === 'STUDENT' ? '123456' : 'phuho@2025');
                  const isCopied = copiedUserId === user.id;

                  return (
                    <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3 font-semibold text-slate-900">{user.fullName}</td>
                      <td className="px-4 py-3 text-slate-600">
                        <div className="font-mono text-indigo-700 font-semibold">@{user.username || user.email.split('@')[0]}</div>
                        <div className="text-[11px] text-slate-400">{user.email}</div>
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-800">
                            {isRevealed ? currentPassword : '••••••••'}
                          </span>
                          <button
                            type="button"
                            onClick={() => toggleRevealPassword(user.id)}
                            className="p-1 text-slate-400 hover:text-slate-700 transition-colors"
                            title={isRevealed ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                          >
                            {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            type="button"
                            onClick={() => copyCredentials(user)}
                            className="p-1 text-slate-400 hover:text-indigo-600 transition-colors"
                            title="Sao chép thông tin tài khoản & mật khẩu"
                          >
                            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold border ${
                            user.role === 'ADMIN'
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : user.role === 'PRINCIPAL'
                              ? 'bg-purple-50 text-purple-700 border-purple-200'
                              : user.role === 'DEPARTMENT_HEAD'
                              ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                              : user.role === 'TEACHER'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-sky-50 text-sky-700 border-sky-200'
                          }`}
                        >
                          {user.role === 'ADMIN'
                            ? 'Quản trị viên (ADMIN)'
                            : user.role === 'PRINCIPAL'
                            ? 'Ban Giám Hiệu (BGH)'
                            : user.role === 'DEPARTMENT_HEAD'
                            ? 'Tổ trưởng Tin học'
                            : user.role === 'TEACHER'
                            ? 'Giáo viên Tin học'
                            : 'Học sinh'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600 font-mono">
                        {user.studentCode || user.teacherCode || '-'}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {assignedClass ? `Lớp ${assignedClass.name}` : user.role === 'TEACHER' ? 'Bộ môn Tin' : '-'}
                      </td>
                      <td className="px-4 py-3 text-right space-x-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(user)}
                          className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                          title="Sửa thông tin & Mật khẩu"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(user.id)}
                          className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                          title="Xóa tài khoản"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg p-6 animate-in fade-in zoom-in-95">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Key className="w-5 h-5 text-indigo-600" />
              <span>{editingUser ? 'Chỉnh sửa tài khoản & mật khẩu' : 'Thêm tài khoản người dùng mới'}</span>
            </h2>

            <form onSubmit={handleSave} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Họ và tên *</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Ví dụ: Hoàng Minh Trí"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Username & Password */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Tên đăng nhập (Username) *</label>
                  <input
                    type="text"
                    required
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    placeholder="hs.tri.6a1"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-medium text-slate-700">Mật khẩu *</label>
                    <button
                      type="button"
                      onClick={generateRandomPassword}
                      className="text-[10px] text-indigo-600 hover:text-indigo-800 font-semibold"
                    >
                      Tạo ngẫu nhiên
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showModalPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Mật khẩu"
                      className="w-full pl-3 pr-8 py-2 rounded-lg border border-slate-200 bg-white font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowModalPassword(!showModalPassword)}
                      className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-700"
                    >
                      {showModalPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Email liên lạc *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="tri.hm@thcs-phuho.edu.vn"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Vai trò hệ thống</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="STUDENT">Học sinh</option>
                    <option value="TEACHER">Giáo viên</option>
                    <option value="DEPARTMENT_HEAD">Tổ trưởng chuyên môn</option>
                    <option value="PRINCIPAL">Ban Giám Hiệu</option>
                    <option value="ADMIN">Quản trị viên</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Số điện thoại</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="09..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {formData.role === 'STUDENT' ? (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Lớp học</label>
                    <select
                      value={formData.classId}
                      onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {classes.map((c) => (
                        <option key={c.id} value={c.id}>
                          Lớp {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Mã học sinh (MSHS)</label>
                    <input
                      type="text"
                      value={formData.studentCode}
                      onChange={(e) => setFormData({ ...formData, studentCode: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Mã giáo viên / cán bộ</label>
                  <input
                    type="text"
                    value={formData.teacherCode}
                    onChange={(e) => setFormData({ ...formData, teacherCode: e.target.value })}
                    placeholder="GV-TIN-01"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              )}

              <p className="text-[11px] text-emerald-600 bg-emerald-50 p-2.5 rounded-lg border border-emerald-100 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 shrink-0" />
                <span>Dữ liệu tài khoản sẽ tự động lưu vào Google Sheet ngay khi bạn nhấn "Lưu thay đổi".</span>
              </p>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Excel / CSV Import Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-2xl p-6 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                <h2 className="text-lg font-bold text-slate-900">Import danh sách học sinh & tài khoản từ Excel / CSV</h2>
              </div>
              <button
                type="button"
                onClick={downloadSampleTemplate}
                className="inline-flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-800 font-medium cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Tải file mẫu .CSV</span>
              </button>
            </div>

            <p className="text-xs text-slate-500 mb-3">
              Dán nội dung CSV (Họ và tên, Mã số HS, Tên đăng nhập, Mật khẩu, Lớp, Email) vào khung bên dưới để hệ thống nhận diện tự động:
            </p>

            <textarea
              rows={5}
              value={importText}
              onChange={(e) => handleParseCSV(e.target.value)}
              placeholder="Họ và tên,Mã số HS,Tên đăng nhập,Mật khẩu,Lớp,Email&#10;Trần Quốc Tuấn,PH25-060150,hs.tuan0601,123456,6/1,tuan.tq@thcs-phuho.edu.vn&#10;Võ Thị Sáu,PH25-060151,hs.sau0601,123456,6/1,sau.vt@thcs-phuho.edu.vn"
              className="w-full p-3 font-mono text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 mb-3"
            />

            {importSuccessMessage && (
              <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs mb-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{importSuccessMessage}</span>
              </div>
            )}

            {/* Preview table */}
            {importPreview.length > 0 && (
              <div className="mb-4">
                <div className="text-xs font-semibold text-slate-700 mb-2">
                  Xem trước {importPreview.length} học sinh sẽ được thêm:
                </div>
                <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-lg">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-600">
                      <tr>
                        <th className="px-3 py-2">Họ và tên</th>
                        <th className="px-3 py-2">MSHS</th>
                        <th className="px-3 py-2">Tên đăng nhập</th>
                        <th className="px-3 py-2">Mật khẩu</th>
                        <th className="px-3 py-2">Lớp</th>
                        <th className="px-3 py-2">Email</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {importPreview.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="px-3 py-2 font-medium">{item.fullName}</td>
                          <td className="px-3 py-2 font-mono">{item.studentCode}</td>
                          <td className="px-3 py-2 font-mono text-indigo-700">@{item.username}</td>
                          <td className="px-3 py-2 font-mono text-slate-600">{item.password}</td>
                          <td className="px-3 py-2">Lớp {item.className}</td>
                          <td className="px-3 py-2 text-slate-500">{item.email}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setIsImportModalOpen(false);
                  setImportPreview([]);
                  setImportText('');
                }}
                className="px-3.5 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                Đóng
              </button>
              <button
                type="button"
                disabled={importPreview.length === 0}
                onClick={handleExecuteImport}
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
              >
                Xác nhận Import ({importPreview.length} học sinh)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteUserId)}
        title="Xác nhận xóa tài khoản"
        message="Bạn có chắc chắn muốn xóa tài khoản này khỏi hệ thống? Dữ liệu trên Google Sheet cũng sẽ được tự động cập nhật lại."
        confirmText="Xóa tài khoản"
        cancelText="Hủy"
        type="danger"
        onConfirm={confirmDeleteUser}
        onCancel={() => setDeleteUserId(null)}
      />
    </div>
  );
};
