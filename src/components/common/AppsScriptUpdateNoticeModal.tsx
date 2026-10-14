import React, { useState } from 'react';
import {
  X,
  AlertTriangle,
  Copy,
  Check,
  ExternalLink,
  Download,
  Upload,
  RefreshCw,
  HelpCircle,
  FileSpreadsheet,
  CheckCircle2
} from 'lucide-react';
import { APPS_SCRIPT_SOURCE_CODE } from '../../services/appsScriptCode';
import { LMSStorageService } from '../../services/storage';

interface AppsScriptUpdateNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  context?: 'test' | 'assignment' | 'general';
}

export const AppsScriptUpdateNoticeModal: React.FC<AppsScriptUpdateNoticeModalProps> = ({
  isOpen,
  onClose,
  title = 'Cần cập nhật Google Apps Script để đồng bộ Đề thi & Giao đề',
  context = 'general'
}) => {
  const [copied, setCopied] = useState(false);
  const [showCodePreview, setShowCodePreview] = useState(false);
  const [backupToast, setBackupToast] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(APPS_SCRIPT_SOURCE_CODE);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = APPS_SCRIPT_SOURCE_CODE;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleExportData = () => {
    try {
      const jsonStr = LMSStorageService.exportDatabaseJSON();
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `PHU_HO_LMS_DeThi_GiaoDe_Backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setBackupToast('✓ Đã xuất file sao lưu JSON thành công! Thầy/Cô có thể gửi file này sang trình duyệt/máy khác và bấm "Nhập file dữ liệu".');
      setTimeout(() => setBackupToast(null), 5000);
    } catch (err: any) {
      setBackupToast(`Lỗi xuất file: ${err.message}`);
    }
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const jsonStr = event.target?.result as string;
        const ok = LMSStorageService.importDatabaseJSON(jsonStr);
        if (ok) {
          setBackupToast('✓ Đã nhập thành công toàn bộ dữ liệu Đề thi, Đợt giao và CSDL vào trình duyệt này!');
          setTimeout(() => {
            setBackupToast(null);
            window.location.reload();
          }, 2000);
        } else {
          setBackupToast('⚠️ File dữ liệu không đúng cấu trúc chuẩn của hệ thống.');
        }
      } catch (err: any) {
        setBackupToast(`⚠️ Lỗi đọc file JSON: ${err.message}`);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-amber-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 px-6 py-4 flex items-center justify-between text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-xs">
              <AlertTriangle className="w-6 h-6 text-amber-100" />
            </div>
            <div>
              <h3 className="text-lg font-bold leading-tight">{title}</h3>
              <p className="text-xs text-amber-100/90 mt-0.5">
                Giải thích nguyên nhân & hướng dẫn xử lý đồng bộ giữa các trình duyệt
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/20 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm text-slate-700 leading-relaxed">
          {backupToast && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl font-medium text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{backupToast}</span>
            </div>
          )}

          {/* Nguyên nhân chính */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <h4 className="font-bold text-amber-900 text-sm flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-amber-700 shrink-0" />
              Tại sao dữ liệu không lưu được sang trình duyệt khác dù đã nhấn đồng bộ?
            </h4>
            <ul className="mt-2 text-xs space-y-1.5 text-amber-950 list-disc pl-5">
              <li>
                <b>Phiên bản Google Apps Script cũ:</b> Google Apps Script đang chạy trên Google Sheet của trường chỉ mới hỗ trợ các hàm cơ bản (Tài khoản, Câu hỏi, Bảng điểm), <b>chưa được cập nhật phiên bản mới</b> để hỗ trợ lưu và đọc sheet <code>DeThi</code> và <code>GiaoDe</code>.
              </li>
              <li>
                <b>Dữ liệu chỉ lưu tạm trên trình duyệt hiện tại:</b> Vì Apps Script từ chối lưu, đề thi và đợt giao đề của Thầy/Cô chỉ nằm trong bộ nhớ tạm (localStorage) của trình duyệt này.
              </li>
              <li>
                <b>Khi sang trình duyệt khác hoặc thoát ra vào lại:</b> Trình duyệt mới không có dữ liệu tạm và không thể tải đề thi từ Google Sheet về, nên hệ thống buộc phải hiển thị dữ liệu mặc định ban đầu.
              </li>
            </ul>
          </div>

          {/* Hướng dẫn khắc phục triệt để */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                  1
                </span>
                <h4 className="font-bold text-slate-900 text-sm">
                  Khắc phục vĩnh viễn: Cập nhật Google Apps Script (Chỉ mất 1 phút)
                </h4>
              </div>
              <button
                type="button"
                onClick={handleCopyCode}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs cursor-pointer transition-all active:scale-95"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Đã sao chép mã!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Sao chép mã Code.gs
                  </>
                )}
              </button>
            </div>

            <ol className="text-xs space-y-2 text-slate-700 list-decimal pl-5">
              <li>
                Mở Google Sheet CSDL trường -&gt; Chọn menu <b>Tiện ích mở rộng (Extensions)</b> -&gt; <b>Apps Script</b>.
              </li>
              <li>
                Mở file <b>Code.gs</b>, nhấn <code>Ctrl + A</code> xóa sạch mã cũ và <b>dán toàn bộ mã vừa sao chép</b> vào.
              </li>
              <li>
                Bấm nút <b>Triển khai (Deploy)</b> ở góc trên bên phải -&gt; Chọn <b>Quản lý bản triển khai (Manage deployments)</b>.
              </li>
              <li>
                Bấm biểu tượng cây bút (<b>Chỉnh sửa</b>) -&gt; Tại ô <b>Phiên bản (Version)</b>, chọn <b>Phiên bản mới (New version)</b> -&gt; Bấm <b>Triển khai (Deploy)</b>.
              </li>
            </ol>
            <p className="mt-2.5 text-[11px] text-emerald-700 font-medium">
              ✓ Sau khi làm 4 bước trên, URL web app giữ nguyên không đổi, và 100% đề thi, đợt giao đề của mọi giáo viên sẽ lưu thẳng vào Google Sheet và hiển thị đồng bộ ở tất cả mọi trình duyệt!
            </p>
          </div>

          {/* Giải pháp tức thời: Chuyển dữ liệu bằng file JSON */}
          <div className="border border-slate-200 rounded-xl p-4 bg-white">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-6 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-xs">
                2
              </span>
              <h4 className="font-bold text-slate-900 text-sm">
                Giải pháp tức thì: Chuyển dữ liệu sang trình duyệt khác bằng file JSON
              </h4>
            </div>
            <p className="text-xs text-slate-600 mb-3">
              Nếu Thầy/Cô chưa có quyền quản trị Google Sheet để cập nhật Apps Script, có thể xuất file đề thi & đợt giao sang máy khác ngay lập tức:
            </p>
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={handleExportData}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-900 text-white shadow-xs cursor-pointer transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Xuất file dữ liệu Đề & Bài giao (JSON)
              </button>
              <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 shadow-xs cursor-pointer transition-colors">
                <Upload className="w-3.5 h-3.5 text-slate-500" />
                Nhập file dữ liệu (JSON)
                <input
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={handleImportFile}
                />
              </label>
            </div>
          </div>

          {/* Xem trước mã nguồn nếu cần */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setShowCodePreview(!showCodePreview)}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-medium underline cursor-pointer"
            >
              {showCodePreview ? 'Ẩn mã nguồn Code.gs' : 'Xem mã nguồn Code.gs chuẩn đầy đủ'}
            </button>
            {showCodePreview && (
              <div className="mt-2 relative">
                <pre className="p-3 bg-slate-900 text-slate-200 text-[11px] font-mono rounded-xl max-h-56 overflow-auto border border-slate-700">
                  {APPS_SCRIPT_SOURCE_CODE}
                </pre>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="absolute top-2 right-2 px-2.5 py-1 bg-white/20 hover:bg-white/30 text-white rounded text-[11px] font-medium"
                >
                  {copied ? 'Đã chép' : 'Sao chép'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-100 border-t border-slate-200 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-500">
            Trường THCS Phú Hồ - Hệ thống Kiểm tra Đánh giá Trực tuyến
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg cursor-pointer transition-colors shadow-2xs"
          >
            Đã hiểu & Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
