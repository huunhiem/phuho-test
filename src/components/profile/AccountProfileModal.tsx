import React, { useState, useRef } from 'react';
import {
  User as UserIcon,
  Mail,
  Phone,
  Lock,
  Camera,
  CheckCircle2,
  AlertCircle,
  X,
  Save,
  Key,
  Shield,
  GraduationCap,
  Briefcase,
  ExternalLink,
  UploadCloud,
  Loader2
} from 'lucide-react';
import { User } from '../../types';
import { LMSStorageService } from '../../services/storage';
import { GoogleSheetsService, getGoogleAccessToken } from '../../services/googleSheetsService';
import { GoogleDriveService } from '../../services/googleDriveService';

interface AccountProfileModalProps {
  currentUser: User;
  isOpen: boolean;
  onClose: () => void;
  onUserUpdated: (user: User) => void;
}

export const AccountProfileModal: React.FC<AccountProfileModalProps> = ({
  currentUser,
  isOpen,
  onClose,
  onUserUpdated
}) => {
  const [activeTab, setActiveTab] = useState<'INFO' | 'PASSWORD'>('INFO');

  // Form info
  const [fullName, setFullName] = useState(currentUser.fullName || '');
  const [phone, setPhone] = useState(currentUser.phone || '');
  const [email, setEmail] = useState(currentUser.email || '');
  const [avatarUrl, setAvatarUrl] = useState(currentUser.avatarUrl || '');

  // Form password
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Status & states
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarUploadStatus, setAvatarUploadStatus] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Vui lòng chọn tệp định dạng hình ảnh (PNG, JPG, JPEG, WEBP)!');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('Dung lượng ảnh đại diện không được vượt quá 5MB!');
      return;
    }

    setIsUploadingAvatar(true);
    setAvatarUploadStatus('Đang xử lý ảnh đại diện...');
    setErrorMessage('');

    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      setAvatarUrl(dataUrl);

      // Thử tải lên Google Drive nếu có kết nối
      try {
        const token = getGoogleAccessToken();
        if (token) {
          setAvatarUploadStatus('Đang tải ảnh đại diện lên Google Drive...');
          const uploadRes = await GoogleDriveService.uploadImageToDrive(file, `avatar_${currentUser.username}_${Date.now()}.png`, token);
          setAvatarUrl(uploadRes.displayUrl);
          setAvatarUploadStatus('✓ Đã lưu ảnh đại diện lên Google Drive!');
        } else {
          setAvatarUploadStatus('✓ Đã đính kèm ảnh đại diện!');
        }
      } catch (err: any) {
        console.warn('Lỗi tải avatar lên Drive:', err);
        setAvatarUploadStatus('✓ Đã đính kèm ảnh đại diện!');
      } finally {
        setIsUploadingAvatar(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!fullName.trim()) {
      setErrorMessage('Họ và tên không được để trống!');
      return;
    }

    setIsSaving(true);
    try {
      const updatedUser: User = {
        ...currentUser,
        fullName: fullName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        avatarUrl: avatarUrl.trim() || undefined
      };

      LMSStorageService.updateUser(updatedUser);
      LMSStorageService.setCurrentUser(updatedUser);
      GoogleSheetsService.triggerAutoSync('users');
      onUserUpdated(updatedUser);

      setSuccessMessage('✓ Đã cập nhật thông tin tài khoản thành công!');
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Lỗi khi cập nhật thông tin tài khoản');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!currentPassword) {
      setErrorMessage('Vui lòng nhập mật khẩu hiện tại!');
      return;
    }

    const actualCurrentPass = currentUser.password || (currentUser.role === 'STUDENT' ? '123456' : 'phuho@2025');
    if (currentPassword !== actualCurrentPass) {
      setErrorMessage('Mật khẩu hiện tại không chính xác. Vui lòng kiểm tra lại!');
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setErrorMessage('Mật khẩu mới phải có ít nhất 6 ký tự!');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Xác nhận mật khẩu mới không khớp!');
      return;
    }

    setIsSaving(true);
    try {
      const updatedUser: User = {
        ...currentUser,
        password: newPassword
      };

      LMSStorageService.updateUser(updatedUser);
      LMSStorageService.setCurrentUser(updatedUser);
      GoogleSheetsService.triggerAutoSync('users');
      onUserUpdated(updatedUser);

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setSuccessMessage('✓ Đã đổi mật khẩu thành công! Vui lòng ghi nhớ mật khẩu mới.');
      setTimeout(() => {
        setSuccessMessage('');
      }, 3500);
    } catch (err: any) {
      setErrorMessage(err.message || 'Lỗi khi đổi mật khẩu');
    } finally {
      setIsSaving(false);
    }
  };

  const getRoleBadge = () => {
    switch (currentUser.role) {
      case 'ADMIN':
        return { label: 'Quản trị viên', bg: 'bg-purple-100 text-purple-800 border-purple-200' };
      case 'PRINCIPAL':
        return { label: 'Ban Giám Hiệu', bg: 'bg-amber-100 text-amber-800 border-amber-200' };
      case 'DEPARTMENT_HEAD':
        return { label: 'Tổ trưởng Chuyên môn', bg: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
      case 'TEACHER':
        return { label: 'Giáo viên Bộ môn', bg: 'bg-blue-100 text-blue-800 border-blue-200' };
      default:
        return { label: 'Học sinh', bg: 'bg-indigo-100 text-indigo-800 border-indigo-200' };
    }
  };

  const roleMeta = getRoleBadge();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <UserIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Thay đổi thông tin tài khoản</h2>
              <p className="text-xs text-slate-500">Cập nhật hồ sơ cá nhân và đổi mật khẩu đăng nhập</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center border-b border-slate-200 px-6 bg-slate-50/30">
          <button
            type="button"
            onClick={() => {
              setActiveTab('INFO');
              setErrorMessage('');
              setSuccessMessage('');
            }}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'INFO'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <UserIcon className="w-4 h-4" />
            <span>Thông tin cá nhân</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('PASSWORD');
              setErrorMessage('');
              setSuccessMessage('');
            }}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'PASSWORD'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Key className="w-4 h-4" />
            <span>Đổi mật khẩu</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* Notifications */}
          {errorMessage && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {activeTab === 'INFO' ? (
            <form onSubmit={handleSaveInfo} className="space-y-4">
              {/* Avatar Section */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="relative group shrink-0">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={currentUser.fullName}
                      className="w-16 h-16 rounded-full object-cover border-2 border-indigo-200 shadow-xs"
                      onError={() => setAvatarUrl('')}
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xl border-2 border-indigo-200 shadow-xs">
                      {currentUser.fullName.charAt(0).toUpperCase()}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 bg-slate-900/40 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    title="Đổi ảnh đại diện"
                  >
                    <Camera className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-slate-900 text-sm">{currentUser.fullName}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${roleMeta.bg}`}>
                      {roleMeta.label}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 font-mono">@{currentUser.username}</div>
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleAvatarFileChange}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploadingAvatar}
                      className="px-2.5 py-1 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1"
                    >
                      {isUploadingAvatar ? <Loader2 className="w-3 h-3 animate-spin" /> : <UploadCloud className="w-3 h-3" />}
                      <span>Tải ảnh lên</span>
                    </button>
                    {avatarUrl && (
                      <button
                        type="button"
                        onClick={() => setAvatarUrl('')}
                        className="text-xs text-rose-600 hover:underline"
                      >
                        Gỡ ảnh
                      </button>
                    )}
                  </div>
                  {avatarUploadStatus && (
                    <p className="text-[11px] text-indigo-600 font-medium">{avatarUploadStatus}</p>
                  )}
                </div>
              </div>

              {/* Fixed Readonly Attributes */}
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-50/70 border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Tên đăng nhập:</span>
                  <span className="font-mono font-semibold text-slate-800">@{currentUser.username}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Mã định danh:</span>
                  <span className="font-mono font-semibold text-slate-800">
                    {currentUser.studentCode || currentUser.teacherCode || 'Hệ thống'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Đơn vị trường:</span>
                  <span className="font-medium text-slate-800">THCS Phú Hồ</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Trạng thái:</span>
                  <span className="font-semibold text-emerald-600">Đang hoạt động (Active)</span>
                </div>
              </div>

              {/* Editable Fields */}
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Họ và tên *
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Nhập họ và tên đầy đủ..."
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Số điện thoại
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="0905..."
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Email liên hệ
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="email@thcs-phuho.edu.vn"
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Đường dẫn ảnh đại diện (URL)
                  </label>
                  <input
                    type="url"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="https://... hoặc tải ảnh trực tiếp ở trên"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-[11px] text-slate-700"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}</span>
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
                <Shield className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Lưu ý an toàn:</span>
                  <p className="mt-0.5 text-[11px] text-amber-800 leading-relaxed">
                    Mật khẩu phải có độ dài tối thiểu 6 ký tự. Sau khi đổi mật khẩu, hệ thống sẽ tự động cập nhật và đồng bộ an toàn với máy chủ.
                  </p>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Mật khẩu hiện tại *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Nhập mật khẩu đang sử dụng..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Mật khẩu mới *
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Tối thiểu 6 ký tự..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Xác nhận mật khẩu mới *
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Nhập lại mật khẩu mới..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-slate-900"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Key className="w-3.5 h-3.5" />
                  <span>{isSaving ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
