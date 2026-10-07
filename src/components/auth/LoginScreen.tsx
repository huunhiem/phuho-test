import React, { useState } from 'react';
import {
  Lock,
  User as UserIcon,
  Eye,
  EyeOff,
  LogIn,
  AlertCircle
} from 'lucide-react';
import { User } from '../../types';
import { LMSStorageService } from '../../services/storage';

interface LoginScreenProps {
  onLoginSuccess: (user: User) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const allUsers = LMSStorageService.getUsers();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedUser = username.trim().toLowerCase();
    const trimmedPass = password.trim();

    if (!trimmedUser) {
      setError('Vui lòng nhập Tên đăng nhập!');
      return;
    }
    if (!trimmedPass) {
      setError('Vui lòng nhập Mật khẩu!');
      return;
    }

    const matched = allUsers.find((u) => {
      const matchIdentity =
        u.username.toLowerCase() === trimmedUser ||
        u.email.toLowerCase() === trimmedUser ||
        (u.studentCode && u.studentCode.toLowerCase() === trimmedUser) ||
        (u.teacherCode && u.teacherCode.toLowerCase() === trimmedUser);

      const actualPass = u.password || (u.role === 'STUDENT' ? '123456' : 'phuho@2025');
      return matchIdentity && actualPass === trimmedPass;
    });

    if (matched) {
      if (matched.status === 'LOCKED') {
        setError('Tài khoản này hiện đang bị khóa. Vui lòng liên hệ Quản trị viên!');
        return;
      }
      onLoginSuccess(matched);
    } else {
      setError('Tên đăng nhập hoặc Mật khẩu không chính xác!');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
      {/* Cổng thông tin tiêu đề phía trên */}
      <div className="w-full max-w-xl text-center mb-6 px-2 space-y-3">
        <div className="flex justify-center items-center">
          <div className="w-20 h-20 rounded-2xl overflow-hidden bg-white p-1 border-2 border-indigo-400/40 shadow-xl">
            <img
              src="/logo.jpg"
              alt="Logo Cổng Kiểm Tra Trực Tuyến"
              className="w-full h-full object-contain rounded-xl"
            />
          </div>
        </div>
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight uppercase">
            Cổng Kiểm Tra Trực Tuyến
          </h1>
          <p className="text-sm sm:text-base text-slate-300 font-medium">
            Dành cho Cán bộ quản lý, Giáo viên và Học sinh Trường THCS Phú Hồ
          </p>
          <p className="text-xs sm:text-sm text-indigo-300 font-medium">
            Tra cứu đề thi, làm bài kiểm tra trực tuyến
          </p>
        </div>
      </div>

      <div className="w-full max-w-sm bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl p-6 sm:p-8 space-y-6">
        <h2 className="text-xl font-bold text-center text-white">
          Đăng nhập
        </h2>

        {error && (
          <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Tên đăng nhập
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <UserIcon className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Nhập tên đăng nhập"
                required
                autoFocus
                className="w-full pl-10 pr-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Mật khẩu
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu"
                required
                className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 cursor-pointer"
                aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer mt-2 text-sm"
          >
            <LogIn className="w-4 h-4" />
            <span>Đăng nhập</span>
          </button>
        </form>
      </div>

      {/* Phía dưới của Trang đăng nhập */}
      <div className="mt-8 text-center px-4 max-w-lg">
        <p className="text-xs sm:text-sm text-slate-400 font-medium tracking-wide">
          Hệ thống được xây dựng và phát triển bởi thầy giáo Lê Hữu Nhiệm
        </p>
      </div>
    </div>
  );
};
