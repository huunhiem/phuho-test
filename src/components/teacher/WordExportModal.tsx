import React, { useState } from 'react';
import {
  FileText,
  Download,
  X,
  CheckCircle2,
  FileCheck,
  GraduationCap,
  Sparkles,
  Settings,
  Table,
  CheckSquare,
  Square,
  Loader2,
  HelpCircle,
  Building,
  School
} from 'lucide-react';
import { Test, Question } from '../../types';
import { WordExportService, WordExportOptions } from '../../services/wordExportService';

interface WordExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  test: Test | null;
  allQuestions: Question[];
}

export const WordExportModal: React.FC<WordExportModalProps> = ({
  isOpen,
  onClose,
  test,
  allQuestions
}) => {
  if (!isOpen || !test) return null;

  const [mode, setMode] = useState<'STUDENT' | 'TEACHER' | 'BOTH'>('STUDENT');
  const [selectedVariant, setSelectedVariant] = useState<string>('ALL');
  const [includeMatrix, setIncludeMatrix] = useState<boolean>(true);
  const [includeAnswerSheet, setIncludeAnswerSheet] = useState<boolean>(true);
  const [includeExplanation, setIncludeExplanation] = useState<boolean>(true);
  
  // Thông tin đơn vị hành chính
  const [showSchoolConfig, setShowSchoolConfig] = useState<boolean>(false);
  const [districtName, setDistrictName] = useState<string>('UBND HUYỆN QUẢNG ĐIỀN');
  const [schoolName, setSchoolName] = useState<string>('TRƯỜNG THCS PHÚ HỒ');
  const [departmentName, setDepartmentName] = useState<string>('TỔ: TIN HỌC - CÔNG NGHỆ');
  const [academicYear, setAcademicYear] = useState<string>('NĂM HỌC 2025 - 2026');

  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportSuccessMessage, setExportSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const variants = test.variants && test.variants.length > 0
    ? test.variants
    : [{ code: '101', questionIds: test.questionIds || [] }];

  const handleExport = async () => {
    setIsExporting(true);
    setErrorMessage(null);
    setExportSuccessMessage(null);

    try {
      const options: WordExportOptions = {
        mode,
        variantCode: selectedVariant,
        districtName: districtName.trim() || 'UBND HUYỆN QUẢNG ĐIỀN',
        schoolName: schoolName.trim() || 'TRƯỜNG THCS PHÚ HỒ',
        departmentName: departmentName.trim() || 'TỔ: TIN HỌC - CÔNG NGHỆ',
        academicYear: academicYear.trim() || 'NĂM HỌC 2025 - 2026',
        includeMatrix,
        includeAnswerSheet,
        includeExplanation
      };

      await WordExportService.downloadTestDocx(test, allQuestions, options);

      const modeName = mode === 'STUDENT' ? 'Đề thi học sinh' : mode === 'TEACHER' ? 'Đề kèm Đáp án & HD chấm' : 'Đầy đủ Đề thi & Đáp án';
      setExportSuccessMessage(`Đã xuất thành công file Word (.docx) cho [${modeName}]! Bạn có thể mở trực tiếp bằng Microsoft Word hoặc Google Docs.`);

      setTimeout(() => {
        setExportSuccessMessage(null);
      }, 5000);
    } catch (err: any) {
      console.error('Word export failed:', err);
      setErrorMessage(`Không thể xuất file Word: ${err.message || String(err)}`);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-linear-to-r from-blue-700 via-indigo-700 to-indigo-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-xs border border-white/20">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">Xuất Đề thi ra file Word (.docx)</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/40 text-blue-100 border border-white/20">
                  Chuẩn GDPT 2018
                </span>
              </div>
              <p className="text-xs text-blue-100/90 mt-0.5 line-clamp-1">
                {test.title} (Khối {test.gradeLevel} · {test.durationMinutes} phút · {test.totalQuestions} câu · Thang {test.totalPoints}đ)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-white/70 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700">
          
          {/* Notification Messages */}
          {exportSuccessMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-start gap-2.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">{exportSuccessMessage}</p>
                <p className="text-[11px] text-emerald-700 mt-0.5">
                  File đã được tải về thư mục Downloads của bạn. Định dạng tương thích hoàn toàn với Word 2010 - 2024, Office 365 và Google Docs.
                </p>
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-2">
              <X className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Step 1: Chọn Chế độ xuất file */}
          <div className="space-y-2">
            <label className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-blue-600" />
              <span>1. Chọn loại tài liệu cần xuất</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Option 1: Student Paper */}
              <div
                onClick={() => setMode('STUDENT')}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  mode === 'STUDENT'
                    ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-500/20 shadow-xs'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    📄 Đề phát học sinh
                  </span>
                  <input
                    type="radio"
                    name="exportMode"
                    checked={mode === 'STUDENT'}
                    onChange={() => setMode('STUDENT')}
                    className="accent-blue-600 cursor-pointer"
                  />
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Đề thi chuẩn, có khung điểm & lời phê, bảng tô trắc nghiệm. <strong>Không kèm đáp án</strong>.
                </p>
              </div>

              {/* Option 2: Teacher Master */}
              <div
                onClick={() => setMode('TEACHER')}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  mode === 'TEACHER'
                    ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-500/20 shadow-xs'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    👨‍🏫 Đề & Hướng dẫn chấm
                  </span>
                  <input
                    type="radio"
                    name="exportMode"
                    checked={mode === 'TEACHER'}
                    onChange={() => setMode('TEACHER')}
                    className="accent-blue-600 cursor-pointer"
                  />
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Bản giáo viên: <strong>Đáp án in đậm gạch chân</strong>, biểu điểm chi tiết, ma trận 2 chiều GDPT 2018.
                </p>
              </div>

              {/* Option 3: Both */}
              <div
                onClick={() => setMode('BOTH')}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  mode === 'BOTH'
                    ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-500/20 shadow-xs'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    📑 Cả hai (Đề + Đáp án cuối)
                  </span>
                  <input
                    type="radio"
                    name="exportMode"
                    checked={mode === 'BOTH'}
                    onChange={() => setMode('BOTH')}
                    className="accent-blue-600 cursor-pointer"
                  />
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Trang đầu là đề thi hoàn chỉnh cho học sinh, trang cuối là Bảng đáp án tổng hợp & Hướng dẫn chấm.
                </p>
              </div>
            </div>
          </div>

          {/* Step 2: Chọn Mã đề thi */}
          <div className="space-y-2">
            <label className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-blue-600" />
              <span>2. Chọn mã đề thi xuất ra</span>
            </label>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setSelectedVariant('ALL')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  selectedVariant === 'ALL'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Tất cả các mã đề ({variants.length} mã đề)
              </button>

              {variants.map((v) => (
                <button
                  key={v.code}
                  type="button"
                  onClick={() => setSelectedVariant(v.code)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer ${
                    selectedVariant === v.code
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  Mã đề {v.code}
                </button>
              ))}
            </div>
          </div>

          {/* Step 3: Tùy chọn cấu hình in ấn */}
          <div className="space-y-2.5 pt-1">
            <label className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Table className="w-4 h-4 text-blue-600" />
              <span>3. Tùy chọn nội dung kèm theo</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 bg-slate-50/70 p-3.5 rounded-xl border border-slate-200">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={includeMatrix}
                  onChange={(e) => setIncludeMatrix(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 accent-blue-600 cursor-pointer"
                />
                <span className="text-xs font-medium text-slate-700">
                  Kèm Bảng Ma trận đề thi 2 chiều GDPT 2018
                </span>
              </label>

              {(mode === 'STUDENT' || mode === 'BOTH') && (
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={includeAnswerSheet}
                    onChange={(e) => setIncludeAnswerSheet(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500 accent-blue-600 cursor-pointer"
                  />
                  <span className="text-xs font-medium text-slate-700">
                    Kèm Bảng phiếu tô trắc nghiệm nhanh (A B C D)
                  </span>
                </label>
              )}

              {(mode === 'TEACHER' || mode === 'BOTH') && (
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={includeExplanation}
                    onChange={(e) => setIncludeExplanation(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500 accent-blue-600 cursor-pointer"
                  />
                  <span className="text-xs font-medium text-slate-700">
                    Kèm Lời giải chi tiết & Biểu điểm từng phần
                  </span>
                </label>
              )}
            </div>
          </div>

          {/* Step 4: Cấu hình Đơn vị hành chính trường học (Collapsible) */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setShowSchoolConfig(!showSchoolConfig)}
              className="flex items-center justify-between w-full text-left text-xs font-bold text-slate-700 hover:text-blue-700 p-2.5 rounded-lg bg-slate-50 border border-slate-200 transition-colors"
            >
              <div className="flex items-center gap-2">
                <School className="w-4 h-4 text-blue-600" />
                <span>Tiêu đề hành chính trường học (Mặc định: THCS Phú Hồ - Quảng Điền)</span>
              </div>
              <span className="text-blue-600 text-[11px] underline">
                {showSchoolConfig ? 'Thu gọn' : 'Chỉnh sửa'}
              </span>
            </button>

            {showSchoolConfig && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-slate-50 border border-t-0 border-slate-200 rounded-b-xl animate-in fade-in">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Cơ quan chủ quản / Huyện:
                  </label>
                  <input
                    type="text"
                    value={districtName}
                    onChange={(e) => setDistrictName(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs focus:ring-1 focus:ring-blue-500"
                    placeholder="UBND HUYỆN QUẢNG ĐIỀN"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Tên trường:
                  </label>
                  <input
                    type="text"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs focus:ring-1 focus:ring-blue-500"
                    placeholder="TRƯỜNG THCS PHÚ HỒ"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Tổ chuyên môn:
                  </label>
                  <input
                    type="text"
                    value={departmentName}
                    onChange={(e) => setDepartmentName(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs focus:ring-1 focus:ring-blue-500"
                    placeholder="TỔ: TIN HỌC - CÔNG NGHỆ"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Năm học:
                  </label>
                  <input
                    type="text"
                    value={academicYear}
                    onChange={(e) => setAcademicYear(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs focus:ring-1 focus:ring-blue-500"
                    placeholder="NĂM HỌC 2025 - 2026"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Quick Info Box */}
          <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100 flex items-start gap-2 text-[11px] text-blue-900">
            <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p>
              Tài liệu được định dạng chuẩn hành chính: Khổ giấy A4, Phông chữ Times New Roman, lề chuẩn Bộ GD&ĐT (trên/dưới 2.0cm, trái 2.5cm, phải 2.0cm). Đầy đủ các phần trắc nghiệm, đúng/sai, trả lời ngắn và tự luận.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            disabled={isExporting}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            Đóng
          </button>

          <button
            type="button"
            onClick={handleExport}
            disabled={isExporting}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang xử lý & tạo file Word...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Tải file Word (.docx) về máy</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
