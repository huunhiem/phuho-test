import React, { useState } from 'react';
import { BarChart3, AlertTriangle, CheckCircle2, TrendingDown, BookOpen } from 'lucide-react';
import { LMSStorageService } from '../../services/storage';

export const QuestionAnalysis: React.FC = () => {
  const [selectedGrade, setSelectedGrade] = useState<number>(6);
  const analysisItems = LMSStorageService.analyzeQuestions(selectedGrade);

  const lowPerformanceCount = analysisItems.filter((i) => i.isLowPerformance).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Phân tích câu hỏi (Item Analysis)</h1>
          <p className="text-sm text-slate-500 mt-1">
            Đánh giá chất lượng đề thi, phát hiện câu hỏi có tỷ lệ sai cao để củng cố kiến thức cho học sinh
          </p>
        </div>

        {/* Grade selector */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg">
          {[6, 7, 8, 9].map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setSelectedGrade(g)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                selectedGrade === g ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Khối {g}
            </button>
          ))}
        </div>
      </div>

      {/* Warning banner if questions have high error rate */}
      {lowPerformanceCount > 0 && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 space-y-1">
            <span className="font-bold text-sm">Cảnh báo sư phạm:</span>
            <p>
              Hệ thống phát hiện <strong>{lowPerformanceCount} câu hỏi</strong> trong Khối {selectedGrade} có tỷ lệ học sinh làm đúng dưới 50%. Giáo viên bộ môn nên tổ chức ôn tập, sửa bài chi tiết cho học sinh trên lớp.
            </p>
          </div>
        </div>
      )}

      {/* Analysis Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Mã câu</th>
                <th className="px-4 py-3">Nội dung câu hỏi</th>
                <th className="px-4 py-3">Mức độ</th>
                <th className="px-4 py-3 text-center">Lượt làm</th>
                <th className="px-4 py-3 text-center">Đúng / Sai</th>
                <th className="px-4 py-3">Tỷ lệ đúng</th>
                <th className="px-4 py-3">Đánh giá sư phạm</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {analysisItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                    Chưa có dữ liệu bài nộp cho Khối {selectedGrade}.
                  </td>
                </tr>
              ) : (
                analysisItems.map((item) => {
                  const wrongAttempts = item.totalAttempts - item.correctAttempts;
                  return (
                    <tr key={item.questionId} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3 font-mono font-bold text-indigo-700 bg-slate-50/50">
                        {item.code}
                      </td>
                      <td className="px-4 py-3 max-w-md font-medium text-slate-900 leading-snug">
                        {item.content}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {item.difficulty === 'BIET' ? 'Biết' : item.difficulty === 'HIEU' ? 'Hiểu' : 'Vận dụng'}
                      </td>
                      <td className="px-4 py-3 text-center font-bold text-slate-700">
                        {item.totalAttempts}
                      </td>
                      <td className="px-4 py-3 text-center font-mono">
                        <span className="text-emerald-700 font-bold">{item.correctAttempts}</span> /{' '}
                        <span className="text-rose-700 font-bold">{wrongAttempts}</span>
                      </td>
                      <td className="px-4 py-3 w-40">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-2 rounded-full ${
                                item.correctRate >= 70
                                  ? 'bg-emerald-500'
                                  : item.correctRate >= 50
                                  ? 'bg-amber-500'
                                  : 'bg-rose-500'
                              }`}
                              style={{ width: `${item.correctRate}%` }}
                            />
                          </div>
                          <span className="font-bold text-slate-800 w-10 text-right">{item.correctRate}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {item.isLowPerformance ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                            <TrendingDown className="w-3 h-3" /> Cần củng cố
                          </span>
                        ) : item.totalAttempts === 0 ? (
                          <span className="text-slate-400 text-[11px]">Chưa kiểm tra</span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" /> Đạt chuẩn
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
