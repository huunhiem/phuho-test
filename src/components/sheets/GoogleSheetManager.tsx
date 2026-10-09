import React, { useState, useEffect } from 'react';
import {
  FileSpreadsheet,
  Cloud,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  Upload,
  Download,
  Key,
  Code2,
  Copy,
  Layers,
  Sparkles,
  AlertCircle,
  Zap,
  Users,
  ShieldCheck,
  Lock,
  Eye,
  Check,
  HardDrive,
  Globe
} from 'lucide-react';
import {
  initGoogleAuth,
  signInWithGoogleSheets,
  getGoogleAccessToken,
  logoutGoogle,
  getSavedSheetId,
  saveSheetId,
  GoogleSheetsService,
  subscribeAutoSyncStatus,
  AutoSyncState,
  isAutoSyncEnabled,
  setAutoSyncEnabled,
  REQUIRED_SHEETS,
  clearGoogleToken,
  isAuthErrorMessage,
  getAppsScriptUrl,
  saveAppsScriptUrl
} from '../../services/googleSheetsService';
import { GoogleDriveService } from '../../services/googleDriveService';
import { LMSStorageService } from '../../services/storage';
import { User as FirebaseUser } from 'firebase/auth';

export const GoogleSheetManager: React.FC = () => {
  const [googleUser, setGoogleUser] = useState<FirebaseUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [sheetId, setSheetId] = useState(getSavedSheetId());
  const [syncStatus, setSyncStatus] = useState<string>('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [autoSync, setAutoSync] = useState(isAutoSyncEnabled());
  const [autoSyncState, setAutoSyncState] = useState<AutoSyncState>({ status: 'disconnected' });
  const [activeSubTab, setActiveSubTab] = useState<'manager' | 'preview' | 'vercel'>('manager');

  // Apps Script Backend State
  const [appsScriptUrlInput, setAppsScriptUrlInput] = useState(getAppsScriptUrl());
  const [isTestingScript, setIsTestingScript] = useState(false);
  const [scriptTestResult, setScriptTestResult] = useState<{ success?: boolean; message?: string } | null>(null);
  const [isSyncingScript, setIsSyncingScript] = useState(false);

  // Preview data
  const [previewTab, setPreviewTab] = useState<string>('TaiKhoan');
  const [sheetRows, setSheetRows] = useState<any[][]>([]);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);

  const [copiedScript, setCopiedScript] = useState(false);

  useEffect(() => {
    const unsubscribeAuth = initGoogleAuth(
      (user, token) => {
        setGoogleUser(user);
        setAccessToken(token);
      },
      () => {
        setGoogleUser(null);
        setAccessToken(null);
      }
    );

    const unsubscribeSync = subscribeAutoSyncStatus((state) => {
      setAutoSyncState(state);
    });

    return () => {
      unsubscribeAuth();
      unsubscribeSync();
    };
  }, []);

  const handleToggleAutoSync = () => {
    const nextVal = !autoSync;
    setAutoSync(nextVal);
    setAutoSyncEnabled(nextVal);
  };

  const handleSignIn = async () => {
    setIsLoggingIn(true);
    setSyncStatus('');
    try {
      const res = await signInWithGoogleSheets();
      if (res) {
        setGoogleUser(res.user);
        setAccessToken(res.accessToken);
        setSyncStatus('Đã kết nối tài khoản Google thành công với quyền Google Sheets!');
      }
    } catch (e: any) {
      setSyncStatus(`Lỗi kết nối: ${e.message || String(e)}`);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleCreateNewSheet = async () => {
    if (!accessToken) {
      alert('Vui lòng kết nối tài khoản Google trước.');
      return;
    }

    setIsSyncing(true);
    setSyncStatus('Đang khởi tạo Google Spreadsheet Database trên Google Drive với 7 sheet quản lý...');
    try {
      const result = await GoogleSheetsService.createLMSDatabaseSheet(accessToken);
      setSheetId(result.spreadsheetId);
      saveSheetId(result.spreadsheetId);
      setSyncStatus(`Khởi tạo thành công! Spreadsheet ID: ${result.spreadsheetId}`);
    } catch (e: any) {
      const errMsg = e.message || String(e);
      if (errMsg.includes('insufficient authentication scopes') || errMsg.includes('insufficient')) {
        setSyncStatus(
          'Lỗi cấp quyền (insufficient scopes): Tài khoản Google của bạn đang dùng phiên đăng nhập cũ chưa cấp quyền truy cập bảng tính. Vui lòng bấm nút "Cấp lại quyền Google Sheets" ở trên hoặc sử dụng bảng tính tạo sẵn từ sheets.new bên dưới.'
        );
      } else {
        setSyncStatus(`Lỗi tạo bảng tính: ${errMsg}`);
      }
    } finally {
      setIsSyncing(false);
    }
  };

  const handlePushToSheet = async () => {
    if (!accessToken || !sheetId.trim()) {
      alert('Vui lòng kết nối Google và nhập Spreadsheet ID.');
      return;
    }

    setIsSyncing(true);
    setSyncStatus('Đang đẩy toàn bộ dữ liệu LMS (Tài khoản, Học sinh, Giáo viên, Lớp học, Câu hỏi, Đề thi, Điểm) lên Google Sheets...');
    try {
      await GoogleSheetsService.pushAllDataToSheet(sheetId, accessToken);
      setSyncStatus('Đã đồng bộ toàn bộ 7 sheet lên Google Sheet thành công!');
    } catch (e: any) {
      setSyncStatus(`Lỗi đồng bộ: ${e.message || String(e)}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const handlePullAccountsFromSheet = async () => {
    if (!accessToken || !sheetId.trim()) {
      alert('Vui lòng kết nối Google và nhập Spreadsheet ID.');
      return;
    }

    setIsSyncing(true);
    setSyncStatus('Đang đọc danh sách tài khoản, username & mật khẩu từ sheet TaiKhoan...');
    try {
      const count = await GoogleSheetsService.pullAccountsFromSheet(sheetId, accessToken);
      setSyncStatus(`Đã tải & cập nhật thành công ${count} tài khoản và mật khẩu từ Google Sheet vào LMS!`);
    } catch (e: any) {
      setSyncStatus(`Lỗi tải dữ liệu tài khoản: ${e.message || String(e)}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const handlePullStudentsFromSheet = async () => {
    if (!accessToken || !sheetId.trim()) {
      alert('Vui lòng kết nối Google và nhập Spreadsheet ID.');
      return;
    }

    setIsSyncing(true);
    setSyncStatus('Đang đọc dữ liệu học sinh từ sheet HocSinh...');
    try {
      const count = await GoogleSheetsService.pullStudentsFromSheet(sheetId, accessToken);
      setSyncStatus(`Đã tải thành công ${count} học sinh từ Google Sheet vào LMS!`);
    } catch (e: any) {
      setSyncStatus(`Lỗi tải dữ liệu học sinh: ${e.message || String(e)}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const loadPreviewData = async (tabName: string) => {
    setPreviewTab(tabName);
    if (!accessToken || !sheetId.trim()) return;

    setIsLoadingPreview(true);
    try {
      const rows = await GoogleSheetsService.readSheetValues(sheetId, `${tabName}!A1:L30`, accessToken);
      setSheetRows(rows);
    } catch (e) {
      setSheetRows([]);
    } finally {
      setIsLoadingPreview(false);
    }
  };

  const handleSaveAppsScriptUrl = () => {
    saveAppsScriptUrl(appsScriptUrlInput);
    setScriptTestResult({ success: true, message: 'Đã lưu cấu hình Google Apps Script URL thành công!' });
  };

  const handleTestAppsScript = async () => {
    setIsTestingScript(true);
    setScriptTestResult(null);
    saveAppsScriptUrl(appsScriptUrlInput);
    try {
      const res = await GoogleSheetsService.testAppsScriptConnection();
      setScriptTestResult({ success: res.success, message: res.message });
    } catch (e: any) {
      setScriptTestResult({ success: false, message: e.message || 'Lỗi kiểm tra kết nối' });
    } finally {
      setIsTestingScript(false);
    }
  };

  const handleSyncFromAppsScript = async () => {
    setIsSyncingScript(true);
    setScriptTestResult(null);
    saveAppsScriptUrl(appsScriptUrlInput);
    try {
      const res = await GoogleSheetsService.syncFromAppsScript();
      if (res.success) {
        setScriptTestResult({
          success: true,
          message: `Đồng bộ thành công! Đã nạp ${res.users} tài khoản, ${res.classes} lớp học, ${res.questions} câu hỏi từ Google Sheet!`
        });
      } else {
        setScriptTestResult({ success: false, message: res.error || 'Lỗi đồng bộ dữ liệu' });
      }
    } catch (e: any) {
      setScriptTestResult({ success: false, message: e.message || 'Lỗi kết nối' });
    } finally {
      setIsSyncingScript(false);
    }
  };

  const appsScriptCode = `/**
 * Google Apps Script Web App - Cung cấp RESTful API cho CỔNG KIỂM TRA TRỰC TUYẾN trên Vercel
 * Hỗ trợ quản lý Tài khoản, Mật khẩu, Học sinh, Câu hỏi, Đề thi và Điểm số
 *
 * Hướng dẫn triển khai:
 * 1. Trên Google Sheet, nhấn Tiện ích mở rộng (Extensions) -> Apps Script
 * 2. Dán toàn bộ mã nguồn này vào
 * 3. Nhấn Triển khai (Deploy) -> Tùy chọn triển khai mới (New deployment)
 * 4. Chọn loại: Ứng dụng web (Web App)
 * 5. Ai có quyền truy cập (Who has access): Bất kỳ ai (Anyone)
 * 6. Sao chép Web App URL và điền vào biến môi trường VITE_APPS_SCRIPT_URL trên Vercel.
 */

function doGet(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var action = (e && e.parameter && e.parameter.action) || 'getAccounts';
  
  // 1. Lấy toàn bộ tài khoản & mật khẩu
  if (action === 'getAccounts' || action === 'getUsers') {
    var sheet = ss.getSheetByName('TaiKhoan');
    if (!sheet) return jsonResponse({ error: 'Chưa có sheet TaiKhoan' });
    var data = sheet.getDataRange().getValues();
    return jsonResponse(data);
  }
  
  // 2. Lấy danh sách học sinh
  if (action === 'getStudents') {
    var sheet = ss.getSheetByName('HocSinh');
    if (!sheet) return jsonResponse({ error: 'Chưa có sheet HocSinh' });
    var data = sheet.getDataRange().getValues();
    return jsonResponse(data);
  }
  
  // 3. Lấy ngân hàng câu hỏi
  if (action === 'getQuestions') {
    var sheet = ss.getSheetByName('CauHoi');
    if (!sheet) return jsonResponse({ error: 'Chưa có sheet CauHoi' });
    var data = sheet.getDataRange().getValues();
    return jsonResponse(data);
  }
  
  // 4. Lấy danh sách lớp học
  if (action === 'getClasses') {
    var sheet = ss.getSheetByName('LopHoc');
    if (!sheet) return jsonResponse({ error: 'Chưa có sheet LopHoc' });
    var data = sheet.getDataRange().getValues();
    return jsonResponse(data);
  }
  
  // 5. Lấy bảng điểm bài thi
  if (action === 'getSubmissions') {
    var sheet = ss.getSheetByName('BangDiem');
    if (!sheet) return jsonResponse({ error: 'Chưa có sheet BangDiem' });
    var data = sheet.getDataRange().getValues();
    return jsonResponse(data);
  }

  // 6. Lấy danh sách tên bài học
  if (action === 'getLessons' || action === 'getTenBaiHoc') {
    var sheet = ss.getSheetByName('TenBaiHoc');
    if (!sheet) return jsonResponse({ error: 'Chưa có sheet TenBaiHoc' });
    var data = sheet.getDataRange().getValues();
    return jsonResponse(data);
  }

  // 7. Lấy danh sách đề thi
  if (action === 'getTests' || action === 'getDeThi') {
    var sheet = ss.getSheetByName('DeThi');
    if (!sheet) return jsonResponse({ error: 'Chưa có sheet DeThi' });
    var data = sheet.getDataRange().getValues();
    return jsonResponse(data);
  }
  
  return jsonResponse({ error: 'Action không hợp lệ: ' + action });
}

function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var payload = JSON.parse(e.postData.contents);
    var action = payload.action;
    
    // Ghi điểm bài thi
    if (action === 'addSubmission') {
      var sheet = ss.getSheetByName('BangDiem');
      sheet.appendRow([
        payload.id,
        payload.studentName,
        payload.studentCode,
        payload.className,
        payload.testTitle,
        payload.variantCode,
        payload.score,
        payload.correctCount + '/' + payload.totalQuestions,
        new Date().toISOString()
      ]);
      return jsonResponse({ success: true });
    }
    
    // Thêm người dùng mới
    if (action === 'addUser') {
      var sheet = ss.getSheetByName('TaiKhoan');
      sheet.appendRow([
        payload.id,
        payload.username,
        payload.password || '123456',
        payload.fullName,
        payload.email,
        payload.role,
        payload.code || '',
        payload.grade || '',
        payload.className || '',
        payload.phone || '',
        payload.status || 'ACTIVE',
        new Date().toISOString().split('T')[0]
      ]);
      return jsonResponse({ success: true });
    }

    // Thêm câu hỏi mới
    if (action === 'addQuestion') {
      var sheet = ss.getSheetByName('CauHoi');
      sheet.appendRow([
        payload.id,
        payload.code || '',
        payload.content || '',
        payload.grade || 6,
        payload.topicId || '',
        payload.difficulty || 'BIET',
        payload.type || 'SINGLE_CHOICE',
        payload.options || '',
        payload.explanation || '',
        payload.imageDriveUrl || '',
        payload.authorName || '',
        new Date().toISOString()
      ]);
      return jsonResponse({ success: true });
    }

    return jsonResponse({ error: 'Unsupported action: ' + action });
  } catch (err) {
    return jsonResponse({ error: err.message });
  }
}

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}`;

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <FileSpreadsheet className="w-7 h-7 text-emerald-600" />
            <span>Google Sheet Database & Tự Động Cập Nhật</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Quản lý tài khoản, mật khẩu, học sinh, câu hỏi & bảng điểm trên Google Sheet cho THCS Phú Hồ
          </p>
        </div>

        {/* Sub-tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveSubTab('manager')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeSubTab === 'manager' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Cấu hình & Tự động lưu
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveSubTab('preview');
              loadPreviewData(previewTab);
            }}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeSubTab === 'preview' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Xem bảng tính (7 Sheet)
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('vercel')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeSubTab === 'vercel' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Hướng dẫn Vercel.com
          </button>
        </div>
      </div>

      {/* AUTO-SYNC HIGHLIGHT BANNER */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-indigo-50 border border-emerald-200/80 rounded-xl p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-3">
            <div className={`p-2 rounded-lg ${autoSync ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-sm">
                  Chế độ Tự Động Cập Nhật (Realtime Auto-Sync):
                </h3>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold ${
                  autoSync && accessToken && sheetId
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    : 'bg-amber-100 text-amber-800 border border-amber-200'
                }`}>
                  {autoSync && accessToken && sheetId ? 'Đang hoạt động' : 'Cần kết nối Google Sheet'}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Mỗi khi thêm Lớp, thêm/sửa Học sinh, Người dùng, Mật khẩu, tạo Câu hỏi, Đề thi hay nộp bài kiểm tra, hệ thống <strong>tự động ghi thẳng vào Google Sheet</strong> trong nền. <strong>Không cần bấm nút Đồng bộ!</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-center">
            {autoSyncState.status === 'syncing' && (
              <span className="inline-flex items-center gap-1.5 text-xs text-indigo-600 font-semibold animate-pulse">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Đang tự động lưu...</span>
              </span>
            )}
            {autoSyncState.status === 'synced' && autoSyncState.lastSyncedTime && (
              <span className="inline-flex items-center gap-1 text-xs text-emerald-700 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Đã lưu lúc {autoSyncState.lastSyncedTime}</span>
              </span>
            )}
            <button
              type="button"
              onClick={handleToggleAutoSync}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors border cursor-pointer ${
                autoSync
                  ? 'bg-emerald-600 text-white border-emerald-700 hover:bg-emerald-700'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
            >
              {autoSync ? 'Bật Auto-Sync' : 'Tắt Auto-Sync'}
            </button>
          </div>
        </div>
      </div>

      {activeSubTab === 'manager' && (
        <div className="space-y-6">
          {/* Card: Google Apps Script Backend (Dành cho Vercel & GitHub) */}
          <div className="bg-gradient-to-r from-indigo-50/70 via-sky-50/70 to-emerald-50/70 rounded-xl border border-indigo-200 p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-indigo-600" />
                  <span>Google Apps Script Backend (Vận hành Vercel & GitHub)</span>
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  Kết nối trực tiếp tới Google Sheet của THCS Phú Hồ thông qua Web App URL. Hoạt động 100% không cần đăng nhập Google OAuth trên Vercel.
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 self-start sm:self-auto">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Sẵn sàng cho Vercel
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  URL Google Apps Script Web App (Biến môi trường Vercel: <code className="text-indigo-600 font-mono">VITE_APPS_SCRIPT_URL</code>)
                </label>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <input
                    type="url"
                    value={appsScriptUrlInput}
                    onChange={(e) => setAppsScriptUrlInput(e.target.value)}
                    placeholder="https://script.google.com/macros/s/.../exec"
                    className="flex-1 px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleSaveAppsScriptUrl}
                      className="px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Lưu URL
                    </button>
                    <button
                      type="button"
                      onClick={handleTestAppsScript}
                      disabled={isTestingScript}
                      className="px-3 py-2 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isTestingScript ? 'animate-spin' : ''}`} />
                      <span>{isTestingScript ? 'Đang thử...' : 'Kiểm tra'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleSyncFromAppsScript}
                      disabled={isSyncingScript}
                      className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isSyncingScript ? 'animate-spin' : ''}`} />
                      <span>{isSyncingScript ? 'Đang đồng bộ...' : 'Đồng bộ Sheet'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {scriptTestResult && (
                <div
                  className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
                    scriptTestResult.success
                      ? 'bg-emerald-100/80 border border-emerald-300 text-emerald-900'
                      : 'bg-rose-100/80 border border-rose-300 text-rose-900'
                  }`}
                >
                  {scriptTestResult.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-700 shrink-0" />
                  )}
                  <span>{scriptTestResult.message}</span>
                </div>
              )}
            </div>
          </div>

          {/* 1. Google Auth Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Cloud className="w-5 h-5 text-emerald-600" />
              <span>1. Xác thực tài khoản Google (OAuth 2.0)</span>
            </h2>

            {googleUser ? (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-sm">
                    {googleUser.displayName?.charAt(0) || 'G'}
                  </div>
                  <div>
                    <div className="font-bold text-emerald-950 text-sm">{googleUser.displayName || 'Tài khoản Google'}</div>
                    <div className="text-xs text-emerald-700">{googleUser.email}</div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-100 text-emerald-800">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Đã kết nối Google
                  </span>
                  <button
                    type="button"
                    onClick={handleSignIn}
                    className="px-2.5 py-1 text-xs text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors font-medium border border-indigo-200"
                    title="Buộc hiển thị hộp thoại xin quyền Google Sheets"
                  >
                    Cấp lại quyền Google Sheets
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      await logoutGoogle();
                      setGoogleUser(null);
                      setAccessToken(null);
                    }}
                    className="px-3 py-1 text-xs text-slate-600 hover:bg-slate-200/60 rounded-md transition-colors"
                  >
                    Đăng xuất
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <p className="text-xs text-slate-600 leading-relaxed">
                  Đăng nhập tài khoản Google để cấp quyền đọc/ghi Google Spreadsheet cho THCS Phú Hồ:
                </p>

                <button
                  type="button"
                  onClick={handleSignIn}
                  disabled={isLoggingIn}
                  className="inline-flex items-center gap-3 px-4 py-2.5 bg-white border border-slate-300 rounded-lg shadow-xs hover:bg-slate-50 transition-colors text-xs font-semibold text-slate-700 cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>{isLoggingIn ? 'Đang xác thực Google...' : 'Đăng nhập với Google để kết nối Sheets'}</span>
                </button>
              </div>
            )}
          </div>

          {/* 2. Spreadsheet Setup & Structure Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
              <span>2. Thiết lập Bảng tính Google Sheets Database (7 Sheets Quản Lý)</span>
            </h2>

            {/* Sheets explanation cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
              {[
                { name: 'TaiKhoan', desc: 'Tài khoản & MK', color: 'bg-rose-50 text-rose-700 border-rose-200', icon: Key },
                { name: 'HocSinh', desc: 'Học sinh & MK', color: 'bg-sky-50 text-sky-700 border-sky-200', icon: Users },
                { name: 'GiaoVien', desc: 'Giáo viên & BGH', color: 'bg-purple-50 text-purple-700 border-purple-200', icon: ShieldCheck },
                { name: 'LopHoc', desc: 'Khối & Lớp học', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: Layers },
                { name: 'CauHoi', desc: 'Ngân hàng câu hỏi', color: 'bg-amber-50 text-amber-700 border-amber-200', icon: Sparkles },
                { name: 'DeThi', desc: 'Đề & Mã đề thi', color: 'bg-indigo-50 text-indigo-700 border-indigo-200', icon: Code2 },
                { name: 'BangDiem', desc: 'Kết quả làm bài', color: 'bg-teal-50 text-teal-700 border-teal-200', icon: CheckCircle2 }
              ].map((sheet) => {
                const Icon = sheet.icon;
                return (
                  <div key={sheet.name} className={`p-2.5 rounded-lg border text-center ${sheet.color}`}>
                    <Icon className="w-4 h-4 mx-auto mb-1 opacity-80" />
                    <div className="font-bold text-xs">{sheet.name}</div>
                    <div className="text-[10px] opacity-80">{sheet.desc}</div>
                  </div>
                );
              })}
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-lg text-xs space-y-1.5 text-indigo-950">
                <div className="font-semibold flex items-center gap-1.5 text-indigo-900">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>Cách 1: Khởi tạo bảng tính mới từ sheets.new (Khuyên dùng)</span>
                </div>
                <p className="text-[11px] text-indigo-800 leading-relaxed">
                  1. Mở trang tạo bảng tính mới:{' '}
                  <a
                    href="https://sheets.new"
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold underline text-indigo-700 hover:text-indigo-900"
                  >
                    sheets.new (Bấm vào đây để mở tab mới)
                  </a>
                  <br />
                  2. Sao chép ID bảng tính từ link trình duyệt và dán vào ô bên dưới.
                  <br />
                  3. Bấm <strong>"Đẩy toàn bộ 7 sheet lên Google Sheet"</strong>. Hệ thống sẽ tự động khởi tạo đầy đủ 7 sheet (TaiKhoan, HocSinh, GiaoVien, LopHoc, CauHoi, DeThi, BangDiem) kèm tất cả tài khoản và mật khẩu!
                </p>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Google Spreadsheet ID (Mã định danh bảng tính):
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={sheetId}
                    onChange={(e) => {
                      setSheetId(e.target.value);
                      saveSheetId(e.target.value);
                    }}
                    placeholder="Ví dụ: 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
                    className="flex-1 px-3 py-2 rounded-lg border border-slate-200 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  {sheetId && (
                    <a
                      href={`https://docs.google.com/spreadsheets/d/${sheetId}/edit`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Mở Google Sheet</span>
                    </a>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Mã ID nằm trong link URL: <code>https://docs.google.com/spreadsheets/d/<b>[ID]</b>/edit</code>
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  disabled={!accessToken || isSyncing}
                  onClick={handleCreateNewSheet}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Tự động tạo Sheet mới trên Drive</span>
                </button>

                <button
                  type="button"
                  disabled={!accessToken || !sheetId || isSyncing}
                  onClick={handlePushToSheet}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  <span>Đẩy toàn bộ 7 sheet lên Google Sheet</span>
                </button>

                <button
                  type="button"
                  disabled={!accessToken || !sheetId || isSyncing}
                  onClick={handlePullAccountsFromSheet}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
                  title="Đọc tài khoản & mật khẩu từ sheet TaiKhoan về LMS"
                >
                  <Download className="w-4 h-4" />
                  <span>Tải Tài khoản & Mật khẩu từ Sheet về LMS</span>
                </button>

                <button
                  type="button"
                  disabled={!accessToken || isSyncing}
                  onClick={async () => {
                    if (!accessToken) {
                      alert('Vui lòng kết nối tài khoản Google trước.');
                      return;
                    }
                    setIsSyncing(true);
                    setSyncStatus('Đang lưu trữ dữ liệu ngân hàng câu hỏi lên Google Drive...');
                    try {
                      const res = await GoogleDriveService.saveQuestionsToDrive(
                        LMSStorageService.getQuestions(),
                        accessToken
                      );
                      setSyncStatus(`Đã lưu trữ ngân hàng câu hỏi lên Google Drive thành công (File ID: ${res.fileId})!`);
                    } catch (e: any) {
                      const isAuth = Boolean(e?.isAuthError || isAuthErrorMessage(e?.message));
                      if (isAuth) {
                        clearGoogleToken();
                        setAccessToken(null);
                        setSyncStatus('Lỗi xác thực Google: Phiên đăng nhập đã hết hạn hoặc chưa được cấp quyền Google Drive. Vui lòng bấm nút "Kết nối tài khoản Google" ở đầu trang để cấp lại quyền.');
                      } else {
                        setSyncStatus(`Lỗi lưu lên Google Drive: ${e.message || String(e)}`);
                      }
                    } finally {
                      setIsSyncing(false);
                    }
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
                  title="Lưu file ngân hàng câu hỏi lên Google Drive"
                >
                  <HardDrive className="w-4 h-4" />
                  <span>Lưu Ngân hàng câu hỏi lên Google Drive</span>
                </button>

                {GoogleDriveService.getSavedFolderUrl() && (
                  <a
                    href={GoogleDriveService.getSavedFolderUrl()}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 font-semibold transition-colors shadow-xs text-xs"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Mở thư mục Google Drive của trường</span>
                  </a>
                )}
              </div>

              {syncStatus && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>{syncStatus}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* PREVIEW SUB-TAB */}
      {activeSubTab === 'preview' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                <span>Xem trực tiếp dữ liệu Google Sheet Database</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Xem trước các bản ghi trong 7 sheet hiện có trên Google Spreadsheet
              </p>
            </div>

            <button
              type="button"
              disabled={isLoadingPreview || !accessToken || !sheetId}
              onClick={() => loadPreviewData(previewTab)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingPreview ? 'animate-spin' : ''}`} />
              <span>Làm mới dữ liệu</span>
            </button>
          </div>

          {/* Sheet Selector Tabs */}
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2 text-xs">
            {REQUIRED_SHEETS.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => loadPreviewData(tab)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                  previewTab === tab
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab === 'TaiKhoan' && '🔑 TaiKhoan (Tài khoản & MK)'}
                {tab === 'HocSinh' && '🎓 HocSinh'}
                {tab === 'GiaoVien' && '👨‍🏫 GiaoVien'}
                {tab === 'LopHoc' && '🏫 LopHoc'}
                {tab === 'CauHoi' && '❓ CauHoi'}
                {tab === 'DeThi' && '📝 DeThi'}
                {tab === 'BangDiem' && '📊 BangDiem'}
              </button>
            ))}
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            {isLoadingPreview ? (
              <div className="py-12 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" />
                <span>Đang tải dữ liệu từ sheet {previewTab}...</span>
              </div>
            ) : sheetRows.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">
                Chưa có dữ liệu trong sheet "{previewTab}". Bấm "Đẩy toàn bộ 7 sheet lên Google Sheet" để khởi tạo.
              </div>
            ) : (
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 font-bold">
                    {sheetRows[0]?.map((col: string, idx: number) => (
                      <th key={idx} className="px-3 py-2 whitespace-nowrap border-r border-slate-200 last:border-0">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sheetRows.slice(1).map((row: any[], rowIdx: number) => (
                    <tr key={rowIdx} className="hover:bg-slate-50">
                      {row.map((cell: any, cellIdx: number) => (
                        <td key={cellIdx} className="px-3 py-2 whitespace-nowrap border-r border-slate-100 last:border-0 text-slate-700">
                          {previewTab === 'TaiKhoan' && cellIdx === 2 ? (
                            <span className="font-mono bg-amber-50 text-amber-900 px-1.5 py-0.5 rounded border border-amber-200">
                              {cell}
                            </span>
                          ) : (
                            String(cell || '')
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* VERCEL SUB-TAB */}
      {activeSubTab === 'vercel' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-indigo-600" />
                  <span>Hướng Dẫn Triển Khai Lên Vercel.com & Kết Nối Google Sheet, Google Drive</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Kiến trúc Serverless tối ưu 100%: Miễn phí hosting trọn đời trên Vercel, lưu trữ dữ liệu vĩnh viễn trên Google Sheet & Google Drive của trường
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 self-start sm:self-auto">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Đã tối ưu hóa cho Vercel
              </span>
            </div>
          </div>

          {/* Sơ đồ hoạt động */}
          <div className="p-4 rounded-xl bg-slate-900 text-slate-100 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              Mô hình kết nối dữ liệu khi vận hành trên Vercel
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-800 border border-slate-700">
                <div className="font-bold text-white mb-1 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span> 1. GitHub Repo
                </div>
                <div className="text-[11px] text-slate-400">Chứa mã nguồn React SPA Vite đã được cấu hình vercel.json rewrite</div>
              </div>
              <div className="p-3 rounded-lg bg-slate-800 border border-slate-700">
                <div className="font-bold text-white mb-1 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-sky-400"></span> 2. Vercel Hosting
                </div>
                <div className="text-[11px] text-slate-400">Máy chủ biên toàn cầu tốc độ cực nhanh, phát hành tên miền HTTPS miễn phí</div>
              </div>
              <div className="p-3 rounded-lg bg-slate-800 border border-slate-700">
                <div className="font-bold text-white mb-1 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span> 3. Google Sheet
                </div>
                <div className="text-[11px] text-slate-400">Lưu trữ Tài khoản, Học sinh, Điểm số, Lớp học, Câu hỏi môn Tin học</div>
              </div>
              <div className="p-3 rounded-lg bg-slate-800 border border-slate-700">
                <div className="font-bold text-white mb-1 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-400"></span> 4. Google Drive
                </div>
                <div className="text-[11px] text-slate-400">Lưu file ảnh câu hỏi và backup toàn bộ ngân hàng đề thi môn Tin học</div>
              </div>
            </div>
          </div>

          {/* 4 Bước triển khai chi tiết */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900">4 Bước Triển Khai Từ GitHub Lên Vercel</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Bước 1 */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">1</span>
                  <h4 className="font-bold text-slate-900 text-sm">Đẩy mã nguồn lên GitHub</h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Tải toàn bộ mã nguồn về hoặc đẩy vào kho lưu trữ (repository) GitHub của bạn:
                </p>
                <pre className="p-2.5 rounded-lg bg-slate-100 text-slate-800 font-mono text-[11px] overflow-x-auto">
{`git init
git add .
git commit -m "Deploy Cổng Kiểm Tra Trực Tuyến THCS Phú Hồ"
git branch -M main
git remote add origin https://github.com/tai-khoan-cua-ban/ten-repo.git
git push -u origin main`}
                </pre>
              </div>

              {/* Bước 2 */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">2</span>
                  <h4 className="font-bold text-slate-900 text-sm">Tạo dự án trên Vercel.com</h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Đăng nhập vào <a href="https://vercel.com" target="_blank" rel="noreferrer" className="text-indigo-600 font-semibold underline">vercel.com</a> (bằng tài khoản GitHub):
                </p>
                <ul className="text-xs text-slate-600 list-disc list-inside space-y-1">
                  <li>Bấm nút <strong>"Add New..."</strong> -&gt; chọn <strong>"Project"</strong>.</li>
                  <li>Tìm tên kho lưu trữ GitHub vừa tạo và bấm <strong>"Import"</strong>.</li>
                  <li>Framework Preset: Vercel sẽ tự động nhận diện là <strong>Vite</strong>.</li>
                  <li>Root Directory: để mặc định <code>./</code> (hoặc thư mục gốc).</li>
                </ul>
              </div>

              {/* Bước 3 */}
              <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/50 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">3</span>
                  <h4 className="font-bold text-indigo-950 text-sm">Cấu hình Biến môi trường trên Vercel</h4>
                </div>
                <p className="text-xs text-indigo-900 leading-relaxed">
                  Tại mục <strong>"Environment Variables"</strong> của Vercel, nhập 2 biến sau:
                </p>
                <div className="space-y-2 font-mono text-[11px]">
                  <div className="p-2 rounded bg-white border border-indigo-200">
                    <div className="font-bold text-indigo-700">Tên biến: VITE_APPS_SCRIPT_URL</div>
                    <div className="text-slate-600 text-[10px] truncate mt-0.5">
                      Giá trị: {getAppsScriptUrl()}
                    </div>
                  </div>
                  <div className="p-2 rounded bg-white border border-indigo-200">
                    <div className="font-bold text-indigo-700">Tên biến: GEMINI_API_KEY (Tùy chọn)</div>
                    <div className="text-slate-500 text-[10px] mt-0.5">
                      Khóa API Gemini nếu muốn dùng AI sinh câu hỏi tự động
                    </div>
                  </div>
                </div>
              </div>

              {/* Bước 4 */}
              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">4</span>
                  <h4 className="font-bold text-emerald-950 text-sm">Bấm Deploy & Sử Dụng</h4>
                </div>
                <p className="text-xs text-emerald-900 leading-relaxed">
                  Nhấn nút <strong>"Deploy"</strong>. Vercel sẽ tự động build ứng dụng trong vòng chưa đầy 1 phút.
                </p>
                <ul className="text-xs text-emerald-900 list-disc list-inside space-y-1">
                  <li>Bạn nhận được link truy cập công khai có dạng <code>https://ten-du-an.vercel.app</code>.</li>
                  <li>Mọi tài khoản giáo viên, học sinh trong Google Sheet có thể đăng nhập ngay!</li>
                  <li>Điểm số học sinh nộp bài thi sẽ tự động ghi thẳng vào Google Sheet!</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Mã nguồn Apps Script */}
          <div className="p-4 bg-slate-900 text-slate-100 rounded-xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div>
                <span className="font-mono text-emerald-400 font-bold text-xs">Mã nguồn Google Apps Script (Code.gs)</span>
                <span className="text-[11px] text-slate-400 ml-2">Đã tối ưu hóa đầy đủ cho 7 Sheet</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(appsScriptCode);
                  setCopiedScript(true);
                  setTimeout(() => setCopiedScript(false), 2000);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded-md text-[11px] font-semibold text-white transition-colors cursor-pointer"
              >
                {copiedScript ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedScript ? 'Đã sao chép!' : 'Sao chép mã'}</span>
              </button>
            </div>

            <pre className="font-mono text-[11px] text-slate-300 max-h-60 overflow-y-auto leading-relaxed">
              {appsScriptCode}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
