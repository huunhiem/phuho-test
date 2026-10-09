import React, { useState, useEffect, useRef } from 'react';
import {
  Lock,
  User as UserIcon,
  Eye,
  EyeOff,
  LogIn,
  AlertCircle,
  ShieldCheck,
  ImageIcon
} from 'lucide-react';
import { User } from '../../types';
import { LMSStorageService } from '../../services/storage';
import { GoogleSheetsService } from '../../services/googleSheetsService';

interface LoginScreenProps {
  onLoginSuccess: (user: User) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [customImage, setCustomImage] = useState<string | null>(() => {
    return localStorage.getItem('lms_truong_cover_image') || null;
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Tự động đồng bộ tài khoản mới nhất từ Google Sheet trong nền (không hiển thị UI kết nối dữ liệu)
  useEffect(() => {
    let isMounted = true;
    const autoSync = async () => {
      try {
        await GoogleSheetsService.syncFromAppsScript();
      } catch {
        // Im lặng trong nền nếu ngoại tuyến
      }
    };
    autoSync();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setCustomImage(result);
          try {
            localStorage.setItem('lms_truong_cover_image', result);
          } catch {
            // bỏ qua nếu vượt quota localStorage
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
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

    setIsLoggingIn(true);

    try {
      let allUsers = LMSStorageService.getUsers();

      const findMatch = (userList: User[]) => {
        return userList.find((u) => {
          const matchIdentity =
            u.username.toLowerCase() === trimmedUser ||
            u.email.toLowerCase() === trimmedUser ||
            (u.studentCode && u.studentCode.toLowerCase() === trimmedUser) ||
            (u.teacherCode && u.teacherCode.toLowerCase() === trimmedUser);

          const actualPass = String(u.password || (u.role === 'STUDENT' ? '123456' : 'phuho@2025')).trim();
          return matchIdentity && actualPass === trimmedPass;
        });
      };

      let matched = findMatch(allUsers);

      // Nếu chưa tìm thấy trên máy cục bộ, thử đồng bộ ngầm với Google Sheet
      if (!matched) {
        try {
          const syncRes = await GoogleSheetsService.syncFromAppsScript();
          if (syncRes.success) {
            allUsers = LMSStorageService.getUsers();
            matched = findMatch(allUsers);
          }
        } catch {
          // Bỏ qua lỗi
        }
      }

      if (matched) {
        if (matched.status === 'LOCKED') {
          setError('Tài khoản này hiện đang bị khóa. Vui lòng liên hệ Quản trị viên!');
          return;
        }
        onLoginSuccess(matched);
      } else {
        setError('Tên đăng nhập hoặc Mật khẩu không chính xác!');
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center p-3 sm:p-6 lg:p-8">
      {/* Khung giao diện chính: Đã bỏ toàn bộ viền xung quanh, bóng đổ tự nhiên, căn giữa nội dung */}
      <div className="w-full max-w-6xl bg-slate-900/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        
        {/* ==================== VÙNG ĐĂNG NHẬP BÊN TRÁI (KHÔNG CÓ VIỀN, KHÔNG CÓ VÙNG KẾT NỐI DỮ LIỆU) ==================== */}
        <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between bg-slate-900/80">
          <div>
            {/* Tiêu đề vùng đăng nhập */}
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold mb-3">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Cổng truy cập bảo mật</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Đăng nhập
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Nhập tài khoản để vào hệ thống kiểm tra và quản lý
              </p>
            </div>

            {/* Thông báo lỗi nếu đăng nhập không thành công */}
            {error && (
              <div className="mb-5 p-3 rounded-xl bg-rose-500/10 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            {/* Biểu mẫu đăng nhập */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Tên đăng nhập / Mã số
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Nhập tên đăng nhập hoặc mã học sinh/giáo viên"
                    required
                    autoFocus
                    className="w-full pl-10 pr-3.5 py-3 rounded-xl bg-slate-950/70 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
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
                    className="w-full pl-10 pr-10 py-3 rounded-xl bg-slate-950/70 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
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
                disabled={isLoggingIn}
                className="w-full py-3 px-4 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer mt-3 text-sm disabled:opacity-50"
              >
                <LogIn className="w-4 h-4" />
                <span>{isLoggingIn ? 'Đang xác thực...' : 'Đăng nhập ngay'}</span>
              </button>
            </form>

            {/* Thông tin trợ giúp đăng nhập */}
            <div className="mt-5 p-3.5 rounded-xl bg-slate-950/40 text-xs text-slate-400 space-y-1.5">
              <p className="font-semibold text-slate-300">Hướng dẫn đăng nhập:</p>
              <p>• Học sinh: Sử dụng mã học sinh, mật khẩu mặc định <span className="font-mono text-indigo-300">123456</span></p>
              <p>• Giáo viên / Quản lý: Đăng nhập theo tài khoản do nhà trường cấp</p>
            </div>
          </div>

          {/* Dòng ghi nhận tác giả ở góc dưới bên trái */}
          <div className="mt-6 pt-4">
            <p className="text-xs text-slate-400 font-medium">
              Hệ thống được xây dựng và phát triển bởi <span className="text-indigo-300 font-semibold">thầy giáo Lê Hữu Nhiệm</span>
            </p>
          </div>
        </div>

        {/* ==================== BÊN PHẢI: CHÈN ẢNH VÀ TÊN HỆ THỐNG - CĂN GIỮA NỘI DUNG, BỎ VIỀN ==================== */}
        <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-center items-center text-center bg-gradient-to-br from-slate-900/60 via-slate-900/40 to-indigo-950/40">
          <div className="space-y-6 w-full max-w-2xl mx-auto flex flex-col items-center text-center">
            {/* TÊN HỆ THỐNG VÀ MÔ TẢ (CĂN GIỮA NỘI DUNG) */}
            <div className="space-y-3 text-center w-full">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-wide uppercase text-center leading-snug">
                CỔNG KIỂM TRA ĐÁNH GIÁ TRỰC TUYẾN
              </h1>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed text-center max-w-xl mx-auto">
                Nền tảng kiểm tra trực tuyến, tra cứu ngân hàng câu hỏi và quản lý điểm số dành riêng cho Cán bộ quản lý, Giáo viên và Học sinh Trường THCS Phú Hồ.
              </p>
            </div>

            {/* HÌNH ẢNH TRƯỜNG: FILE Truong.jpg GIỮ NGUYÊN HÌNH ẢNH (BỎ VIỀN XUNG QUANH, CĂN GIỮA) */}
            <div className="w-full flex flex-col items-center">
              <div className="rounded-2xl overflow-hidden shadow-2xl bg-slate-950/60 p-1 flex items-center justify-center w-full">
                <img
                  src={customImage || '/Truong.jpg'}
                  alt="Trường THCS Phú Hồ"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.src.endsWith('/truong.jpg')) {
                      target.src = '/truong.jpg';
                    }
                  }}
                  className="w-full h-auto max-h-[460px] object-contain rounded-xl mx-auto"
                />
              </div>

              {/* Nút nhỏ hỗ trợ chọn ảnh Truong.jpg nếu muốn tải lại trực tiếp từ máy tính */}
              <div className="flex justify-center mt-3 w-full">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  title="Chọn lại file ảnh Truong.jpg từ máy tính nếu muốn cập nhật"
                  className="text-[11px] text-slate-400 hover:text-indigo-300 flex items-center gap-1.5 transition-colors cursor-pointer py-1 px-2.5 rounded-lg hover:bg-slate-800/60"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Chọn ảnh Truong.jpg từ máy</span>
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

