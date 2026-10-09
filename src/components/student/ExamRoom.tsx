import React, { useState, useEffect, useRef } from 'react';
import {
  Clock,
  AlertTriangle,
  CheckCircle2,
  Flag,
  ChevronLeft,
  ChevronRight,
  Send,
  HelpCircle,
  FileCheck,
  Image as ImageIcon,
  Maximize2,
  ExternalLink,
  X
} from 'lucide-react';
import { Assignment, Test, Question, User, Submission } from '../../types';
import { LMSStorageService } from '../../services/storage';
import { GoogleDriveService } from '../../services/googleDriveService';

interface ExamRoomProps {
  assignment: Assignment;
  currentUser: User;
  onExit: () => void;
  onFinishSubmission: (submission: Submission) => void;
}

export const ExamRoom: React.FC<ExamRoomProps> = ({
  assignment,
  currentUser,
  onExit,
  onFinishSubmission
}) => {
  const tests = LMSStorageService.getTests();
  const allQuestions = LMSStorageService.getQuestions();

  const test = tests.find((t) => t.id === assignment.testId) || tests[0];

  // Select variant (e.g. 101 or 102)
  const variant = test.variants[0] || {
    code: '101',
    questionIds: test.questionIds
  };

  const examQuestions: Question[] = variant.questionIds
    .map((qId) => allQuestions.find((q) => q.id === qId))
    .filter((q): q is Question => Boolean(q));

  const [currentIndex, setCurrentIndex] = useState(0);

  // User answers state: questionId -> answer
  const [userAnswers, setUserAnswers] = useState<
    Record<
      string,
      {
        selectedOptionId?: string;
        selectedOptionIds?: string[];
        tfAnswers?: Record<string, boolean>;
        textAnswer?: string;
      }
    >
  >(() => {
    // Restore from localStorage backup if existing
    const backupKey = `exam_progress_${currentUser.id}_${assignment.id}`;
    try {
      const raw = localStorage.getItem(backupKey);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return {};
  });

  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<string>>(new Set());

  // Countdown Timer
  const totalSeconds = (test.durationMinutes || 45) * 60;
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(totalSeconds);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [submittedResult, setSubmittedResult] = useState<Submission | null>(null);
  const [zoomImageUrl, setZoomImageUrl] = useState<string | null>(null);

  const startTimeRef = useRef(new Date().toISOString());

  // Auto-save backup
  useEffect(() => {
    const backupKey = `exam_progress_${currentUser.id}_${assignment.id}`;
    localStorage.setItem(backupKey, JSON.stringify(userAnswers));
  }, [userAnswers, currentUser.id, assignment.id]);

  // Timer interval
  useEffect(() => {
    if (submittedResult) return;

    const timer = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Auto submit when time runs out!
          handleSubmitExam(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [submittedResult]);

  // Format time mm:ss
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Answer handler
  const handleSelectSingleChoice = (questionId: string, optionId: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        selectedOptionId: optionId
      }
    }));
  };

  const handleToggleMultipleChoice = (questionId: string, optionId: string) => {
    setUserAnswers((prev) => {
      const current = prev[questionId]?.selectedOptionIds || [];
      const updated = current.includes(optionId)
        ? current.filter((id) => id !== optionId)
        : [...current, optionId];

      return {
        ...prev,
        [questionId]: {
          ...prev[questionId],
          selectedOptionIds: updated
        }
      };
    });
  };

  const handleSelectTrueFalse = (questionId: string, statementId: string, value: boolean) => {
    setUserAnswers((prev) => {
      const current = prev[questionId]?.tfAnswers || {};
      return {
        ...prev,
        [questionId]: {
          ...prev[questionId],
          tfAnswers: {
            ...current,
            [statementId]: value
          }
        }
      };
    });
  };

  const handleTextChange = (questionId: string, val: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        textAnswer: val
      }
    }));
  };

  const toggleFlag = (questionId: string) => {
    setFlaggedQuestions((prev) => {
      const next = new Set(prev);
      if (next.has(questionId)) next.delete(questionId);
      else next.add(questionId);
      return next;
    });
  };

  // Check if a question is answered
  const isQuestionAnswered = (q: Question) => {
    const ans = userAnswers[q.id];
    if (!ans) return false;
    if (q.type === 'SINGLE_CHOICE') return Boolean(ans.selectedOptionId);
    if (q.type === 'MULTIPLE_CHOICE') return Boolean(ans.selectedOptionIds && ans.selectedOptionIds.length > 0);
    if (q.type === 'TRUE_FALSE') {
      const statements = q.trueFalseStatements || [];
      if (!ans.tfAnswers) return false;
      return statements.every((st) => ans.tfAnswers?.[st.id] !== undefined);
    }
    if (q.type === 'FILL_IN_BLANK' || q.type === 'ESSAY') {
      return Boolean(ans.textAnswer && ans.textAnswer.trim().length > 0);
    }
    return false;
  };

  const answeredCount = examQuestions.filter((q) => isQuestionAnswered(q)).length;
  const unansweredCount = examQuestions.length - answeredCount;

  // Final Submit
  const handleSubmitExam = (isAuto: boolean = false) => {
    setIsSubmitting(true);

    const { evaluatedAnswers, totalScore, correctCount, hasEssay } = LMSStorageService.gradeSubmission(
      test,
      examQuestions,
      userAnswers
    );

    const timeSpent = totalSeconds - timeLeftSeconds;

    const submission: Submission = {
      id: `sub-${Date.now()}`,
      assignmentId: assignment.id,
      testId: test.id,
      testTitle: test.title,
      variantCode: variant.code,
      studentId: currentUser.id,
      studentName: currentUser.fullName,
      studentCode: currentUser.studentCode || 'PH25-STUDENT',
      classId: currentUser.classId || 'cls-6-1',
      className: '6/1',
      gradeLevel: test.gradeLevel,
      answers: evaluatedAnswers,
      score: totalScore,
      maxScore: test.totalPoints,
      correctCount,
      totalQuestions: examQuestions.length,
      startedAt: startTimeRef.current,
      submittedAt: new Date().toISOString(),
      timeSpentSeconds: timeSpent,
      status: hasEssay ? 'PENDING_ESSAY_GRADING' : 'COMPLETED'
    };

    LMSStorageService.addSubmission(submission);

    // Clear local backup
    localStorage.removeItem(`exam_progress_${currentUser.id}_${assignment.id}`);

    setSubmittedResult(submission);
    setIsSubmitting(false);
    setShowConfirmModal(false);
    onFinishSubmission(submission);
  };

  const currentQ = examQuestions[currentIndex];

  // If exam has been submitted, show Result Screen!
  if (submittedResult) {
    return (
      <div className="max-w-3xl mx-auto py-8 px-4 animate-in fade-in zoom-in-95">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-md text-center space-y-6">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <FileCheck className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900">Em đã nộp bài thành công!</h2>
            <p className="text-xs text-slate-500 mt-1">
              Bài kiểm tra: {submittedResult.testTitle} · Mã đề: {submittedResult.variantCode}
            </p>
          </div>

          {/* Score card */}
          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <div className="text-xs text-slate-500">Điểm số</div>
              <div className="text-3xl font-extrabold text-indigo-600 mt-1">
                {submittedResult.score.toFixed(1)}
              </div>
              <div className="text-[11px] text-slate-400">Thang 10 điểm</div>
            </div>

            <div className="border-x border-slate-200">
              <div className="text-xs text-slate-500">Số câu đúng</div>
              <div className="text-3xl font-extrabold text-emerald-600 mt-1">
                {submittedResult.correctCount} / {submittedResult.totalQuestions}
              </div>
              <div className="text-[11px] text-slate-400">Trắc nghiệm</div>
            </div>

            <div>
              <div className="text-xs text-slate-500">Thời gian làm</div>
              <div className="text-3xl font-extrabold text-slate-700 mt-1">
                {Math.floor(submittedResult.timeSpentSeconds / 60)}p
              </div>
              <div className="text-[11px] text-slate-400">{submittedResult.timeSpentSeconds % 60}s</div>
            </div>
          </div>

          {submittedResult.status === 'PENDING_ESSAY_GRADING' && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 text-left">
              <strong>Lưu ý:</strong> Bài thi có phần tự luận. Điểm số hiển thị ở trên là điểm phần trắc nghiệm tự động. Giáo viên bộ môn sẽ chấm phần tự luận và cập nhật điểm chính thức cho em.
            </div>
          )}

          {/* Action */}
          <div className="pt-4 border-t border-slate-100 flex justify-center gap-3">
            <button
              type="button"
              onClick={onExit}
              className="px-6 py-2.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-xs"
            >
              Trở về danh sách bài kiểm tra
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-4 pb-12">
      {/* Top Exam Header with Timer */}
      <div className="sticky top-16 z-20 bg-white/95 backdrop-blur-xs border border-slate-200 rounded-xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 text-sm sm:text-base">{test.title}</span>
            <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
              Mã đề: {variant.code}
            </span>
          </div>
          <div className="text-xs text-slate-500 mt-0.5">
            Học sinh: <strong className="text-slate-800">{currentUser.fullName}</strong> ({currentUser.studentCode}) · Lớp 6/1
          </div>
        </div>

        {/* Real-time Countdown timer */}
        <div className="flex items-center gap-3">
          <div
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg border font-mono font-bold text-sm ${
              timeLeftSeconds <= 300
                ? 'bg-rose-50 text-rose-700 border-rose-300 animate-pulse'
                : 'bg-indigo-50 text-indigo-800 border-indigo-200'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>{formatTime(timeLeftSeconds)}</span>
          </div>

          <button
            type="button"
            onClick={() => setShowConfirmModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Nộp bài thi</span>
          </button>
        </div>
      </div>

      {/* Main Examination Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left 3 cols: Current Question Content */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
          {currentQ ? (
            <>
              {/* Question header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-base text-indigo-700">
                    Câu {currentIndex + 1} / {examQuestions.length}
                  </span>
                  <span className="text-xs text-slate-400">·</span>
                  <span className="text-xs text-slate-500">
                    {currentQ.type === 'SINGLE_CHOICE'
                      ? 'Chọn 1 đáp án'
                      : currentQ.type === 'MULTIPLE_CHOICE'
                      ? 'Chọn nhiều đáp án'
                      : currentQ.type === 'TRUE_FALSE'
                      ? 'Đúng / Sai'
                      : currentQ.type === 'FILL_IN_BLANK'
                      ? 'Điền từ'
                      : 'Tự luận'}
                  </span>
                  <span className="text-xs text-slate-400">·</span>
                  <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-bold text-xs border border-indigo-200">
                    {test.questionPoints?.[currentQ.id]
                      ?? (test.matrix?.grid && test.matrix.grid[currentQ.type]?.[currentQ.difficulty]?.pointPerQuestion)
                      ?? Math.round((test.totalPoints / (examQuestions.length || 1)) * 100) / 100} điểm
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => toggleFlag(currentQ.id)}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                    flaggedQuestions.has(currentQ.id)
                      ? 'bg-amber-100 text-amber-800'
                      : 'text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  <Flag className="w-3.5 h-3.5" />
                  <span>{flaggedQuestions.has(currentQ.id) ? 'Đã đánh dấu' : 'Xem lại sau'}</span>
                </button>
              </div>

              {/* Question Content */}
              <div className="text-base font-semibold text-slate-900 leading-relaxed whitespace-pre-wrap">
                {currentQ.content}
              </div>

              {/* Question Image Attachment (Google Drive / Source) */}
              {(currentQ.imageUrl || currentQ.imageDriveUrl) && (() => {
                const effectiveImg = GoogleDriveService.getDriveDirectImageUrl(currentQ.imageUrl || currentQ.imageDriveUrl || '');
                if (!effectiveImg) return null;
                return (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 flex flex-col items-center gap-2">
                    <div className="relative group max-w-full flex justify-center">
                      <img
                        src={effectiveImg}
                        alt={`Hình ảnh minh họa câu ${currentIndex + 1}`}
                        className="max-h-72 max-w-full object-contain rounded-lg border border-slate-200/80 shadow-xs cursor-pointer hover:opacity-95 transition-all"
                        onClick={() => setZoomImageUrl(effectiveImg)}
                        onError={(e) => {
                          if (currentQ.imageDriveUrl && e.currentTarget.src !== currentQ.imageDriveUrl) {
                            e.currentTarget.src = currentQ.imageDriveUrl;
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setZoomImageUrl(effectiveImg)}
                        className="absolute bottom-2 right-2 p-1.5 bg-slate-900/70 hover:bg-slate-900 text-white rounded-lg text-xs backdrop-blur-xs flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity cursor-pointer"
                        title="Phóng to hình ảnh"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Phóng to</span>
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center justify-between w-full pt-1 px-1 text-[11px] text-slate-500 border-t border-slate-200/60">
                      <span className="flex items-center gap-1 text-slate-600">
                        <ImageIcon className="w-3.5 h-3.5 text-indigo-500" />
                        <span>Hình minh họa kèm theo câu hỏi (bấm vào hình để phóng to)</span>
                      </span>
                      {currentQ.imageDriveUrl && (
                        <a
                          href={currentQ.imageDriveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700 flex items-center gap-1 font-medium hover:underline ml-auto"
                          title="Xem file gốc trên Google Drive"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Google Drive</span>
                        </a>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* Answer Interaction based on Question Type */}
              <div className="space-y-3 pt-2">
                {currentQ.type === 'SINGLE_CHOICE' && (
                  <div className="space-y-2">
                    {currentQ.options?.map((opt, optIdx) => {
                      const isSelected = userAnswers[currentQ.id]?.selectedOptionId === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => handleSelectSingleChoice(currentQ.id, opt.id)}
                          className={`w-full p-3.5 rounded-xl border text-left text-xs font-medium flex items-center gap-3 transition-colors ${
                            isSelected
                              ? 'bg-indigo-50 border-indigo-500 text-indigo-950 ring-1 ring-indigo-500'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <span
                            className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                              isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span className="flex-1 text-sm">{opt.text}</span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {currentQ.type === 'MULTIPLE_CHOICE' && (
                  <div className="space-y-2">
                    <p className="text-xs text-slate-500 mb-2 italic">
                      (Em có thể chọn nhiều hơn một phương án đúng)
                    </p>
                    {currentQ.options?.map((opt, optIdx) => {
                      const isSelected = (userAnswers[currentQ.id]?.selectedOptionIds || []).includes(opt.id);
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => handleToggleMultipleChoice(currentQ.id, opt.id)}
                          className={`w-full p-3.5 rounded-xl border text-left text-xs font-medium flex items-center gap-3 transition-colors ${
                            isSelected
                              ? 'bg-indigo-50 border-indigo-500 text-indigo-950 ring-1 ring-indigo-500'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            readOnly
                            className="w-4 h-4 text-indigo-600 rounded pointer-events-none"
                          />
                          <span className="font-bold text-slate-600 w-5">
                            {String.fromCharCode(65 + optIdx)}.
                          </span>
                          <span className="flex-1 text-sm">{opt.text}</span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {currentQ.type === 'TRUE_FALSE' && (
                  <div className="space-y-2.5">
                    {currentQ.trueFalseStatements?.map((st, sIdx) => {
                      const answerVal = userAnswers[currentQ.id]?.tfAnswers?.[st.id];
                      return (
                        <div
                          key={st.id}
                          className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                        >
                          <div className="flex items-start gap-2 flex-1">
                            <span className="font-bold text-slate-700 w-5">
                              {String.fromCharCode(97 + sIdx)})
                            </span>
                            <span className="text-slate-800 text-sm leading-snug">{st.statement}</span>
                          </div>

                          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                            <button
                              type="button"
                              onClick={() => handleSelectTrueFalse(currentQ.id, st.id, true)}
                              className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition-colors ${
                                answerVal === true
                                  ? 'bg-emerald-600 text-white shadow-xs'
                                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                              }`}
                            >
                              Đúng
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSelectTrueFalse(currentQ.id, st.id, false)}
                              className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition-colors ${
                                answerVal === false
                                  ? 'bg-rose-600 text-white shadow-xs'
                                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                              }`}
                            >
                              Sai
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {currentQ.type === 'FILL_IN_BLANK' && (
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-slate-700">
                      Nhập từ hoặc cụm từ điền vào chỗ trống:
                    </label>
                    <input
                      type="text"
                      value={userAnswers[currentQ.id]?.textAnswer || ''}
                      onChange={(e) => handleTextChange(currentQ.id, e.target.value)}
                      placeholder="Gõ câu trả lời của em tại đây..."
                      className="w-full p-3 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                    />
                  </div>
                )}

                {currentQ.type === 'ESSAY' && (
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-slate-700">
                      Bài làm tự luận của học sinh:
                    </label>
                    <textarea
                      rows={6}
                      value={userAnswers[currentQ.id]?.textAnswer || ''}
                      onChange={(e) => handleTextChange(currentQ.id, e.target.value)}
                      placeholder="Trình bày các bước giải thuật hoặc câu trả lời tự luận chi tiết của em..."
                      className="w-full p-3 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans"
                    />
                  </div>
                )}
              </div>

              {/* Navigation buttons: Prev / Next */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                <button
                  type="button"
                  disabled={currentIndex === 0}
                  onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-40 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Câu trước</span>
                </button>

                <button
                  type="button"
                  disabled={currentIndex === examQuestions.length - 1}
                  onClick={() => setCurrentIndex((prev) => Math.min(examQuestions.length - 1, prev + 1))}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 transition-colors shadow-xs"
                >
                  <span>Câu kế tiếp</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="p-8 text-center text-slate-400 text-xs">Không tìm thấy câu hỏi.</div>
          )}
        </div>

        {/* Right 1 col: Question Map Navigation Grid */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4 h-fit">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              Danh sách câu hỏi
            </h3>
            <div className="flex items-center justify-between text-xs text-slate-500 mt-1">
              <span>Đã làm: {answeredCount}</span>
              <span>Chưa làm: {unansweredCount}</span>
            </div>
          </div>

          {/* Grid buttons */}
          <div className="grid grid-cols-4 gap-2">
            {examQuestions.map((q, idx) => {
              const isAnswered = isQuestionAnswered(q);
              const isFlagged = flaggedQuestions.has(q.id);
              const isCurrent = currentIndex === idx;

              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`relative h-10 rounded-lg text-xs font-bold transition-all flex items-center justify-center ${
                    isCurrent
                      ? 'ring-2 ring-indigo-600 ring-offset-1'
                      : ''
                  } ${
                    isAnswered
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <span>{idx + 1}</span>
                  {isFlagged && (
                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-400" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="space-y-1.5 text-[11px] text-slate-500 border-t border-slate-100 pt-3">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-emerald-600 inline-block" />
              <span>Đã làm ({answeredCount})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-slate-200 inline-block" />
              <span>Chưa làm ({unansweredCount})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
              <span>Đánh dấu phân vân</span>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => setShowConfirmModal(true)}
              className="w-full py-2.5 px-3 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-xs"
            >
              Nộp bài thi
            </button>
          </div>
        </div>
      </div>

      {/* Confirm Submit Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md p-6 animate-in fade-in zoom-in-95 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-amber-100 text-amber-600">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Xác nhận nộp bài thi</h3>
                <p className="text-xs text-slate-500">
                  Em còn <strong className="text-indigo-600">{formatTime(timeLeftSeconds)}</strong> thời gian làm bài.
                </p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-700 space-y-1 border border-slate-200">
              <div>
                Số câu đã làm: <strong className="text-emerald-700">{answeredCount}</strong> / {examQuestions.length} câu
              </div>
              {unansweredCount > 0 && (
                <div className="text-rose-600 font-semibold">
                  Cảnh báo: Em còn {unansweredCount} câu chưa trả lời!
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Tiếp tục làm bài
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleSubmitExam(false)}
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors"
              >
                {isSubmitting ? 'Đang chấm điểm...' : 'Đồng ý nộp bài'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Zoom Modal */}
      {zoomImageUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4 animate-in fade-in"
          onClick={() => setZoomImageUrl(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-3 border-b border-slate-100">
              <span className="font-semibold text-slate-800 text-xs flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-indigo-600" />
                Hình minh họa câu {currentIndex + 1}
              </span>
              <button
                type="button"
                onClick={() => setZoomImageUrl(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-2 overflow-auto flex items-center justify-center max-h-[75vh]">
              <img
                src={zoomImageUrl}
                alt={`Chi tiết hình ảnh câu ${currentIndex + 1}`}
                className="max-h-[70vh] w-auto object-contain rounded-lg shadow-xs"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
