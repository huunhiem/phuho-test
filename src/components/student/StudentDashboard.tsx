import React, { useState } from 'react';
import {
  BookOpenCheck,
  Clock,
  Calendar,
  CheckCircle2,
  Award,
  ArrowRight,
  History,
  AlertCircle,
  FileText
} from 'lucide-react';
import { User, Assignment, Submission } from '../../types';
import { LMSStorageService } from '../../services/storage';
import { ExamRoom } from './ExamRoom';

interface StudentDashboardProps {
  currentUser: User;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ currentUser }) => {
  const [assignments, setAssignments] = useState(() => LMSStorageService.getAssignments());
  const [submissions, setSubmissions] = useState(() => LMSStorageService.getSubmissions());
  const [activeExam, setActiveExam] = useState<Assignment | null>(null);

  const refreshData = () => {
    setAssignments(LMSStorageService.getAssignments());
    setSubmissions(LMSStorageService.getSubmissions());
  };

  // Submissions made by this student
  const studentSubs = submissions.filter((s) => s.studentId === currentUser.id);

  // Assignments for this student's class
  const studentAssignments = assignments.filter(
    (a) => !currentUser.classId || a.classIds.includes(currentUser.classId)
  );

  const completedAssignmentIds = new Set(studentSubs.map((s) => s.assignmentId));

  // Average score
  const studentAvg =
    studentSubs.length > 0
      ? (studentSubs.reduce((acc, s) => acc + s.score, 0) / studentSubs.length).toFixed(1)
      : 'Chưa có';

  // If in an exam room
  if (activeExam) {
    return (
      <ExamRoom
        assignment={activeExam}
        currentUser={currentUser}
        onExit={() => {
          setActiveExam(null);
          refreshData();
        }}
        onFinishSubmission={() => {
          refreshData();
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Student Welcome Card */}
      <div className="bg-linear-to-r from-sky-600 to-indigo-700 rounded-2xl p-6 text-white shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-white/90 text-xs font-semibold mb-2 backdrop-blur-xs">
              <span>Học sinh Lớp 6/1</span>
              <span>·</span>
              <span>Trường THCS Phú Hồ</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Chào em, {currentUser.fullName}!</h1>
            <p className="text-sky-100 text-xs mt-1">
              Mã học sinh: <strong>{currentUser.studentCode}</strong> · Chúc em làm bài kiểm tra Tin học thật tốt và đạt kết quả cao!
            </p>
          </div>

          <div className="p-3 bg-white/10 rounded-xl backdrop-blur-xs text-center border border-white/20">
            <div className="text-xs text-sky-200">Điểm trung bình</div>
            <div className="text-2xl font-extrabold text-white mt-0.5">{studentAvg}</div>
            <div className="text-[11px] text-sky-200">{studentSubs.length} bài đã nộp</div>
          </div>
        </div>
      </div>

      {/* Assigned Tests section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <BookOpenCheck className="w-5 h-5 text-indigo-600" />
            <span>Bài kiểm tra cần hoàn thành</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {studentAssignments.length === 0 ? (
            <div className="col-span-full p-8 text-center bg-white rounded-xl border border-slate-200 text-slate-400 text-xs">
              Hiện tại không có bài kiểm tra nào được giao cho lớp của em.
            </div>
          ) : (
            studentAssignments.map((assign) => {
              const isCompleted = completedAssignmentIds.has(assign.id);
              const existingSub = studentSubs.find((s) => s.assignmentId === assign.id);

              return (
                <div
                  key={assign.id}
                  className={`bg-white rounded-xl border p-5 shadow-xs transition-all space-y-4 ${
                    isCompleted ? 'border-emerald-200/80 bg-emerald-50/20' : 'border-slate-200 hover:border-indigo-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        {isCompleted ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                            <CheckCircle2 className="w-3 h-3" /> Đã hoàn thành
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                            <Clock className="w-3 h-3" /> Đang diễn ra
                          </span>
                        )}
                        <span className="text-xs text-slate-400">·</span>
                        <span className="text-xs text-slate-500">Khối {assign.gradeLevel}</span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-sm">{assign.testTitle}</h3>
                    </div>

                    {isCompleted && existingSub && (
                      <div className="text-right">
                        <div className="text-xs text-slate-400">Điểm số</div>
                        <div className="text-xl font-extrabold text-emerald-600">
                          {existingSub.score.toFixed(1)}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Hạn nộp bài:</span>
                      <strong className="text-slate-800">
                        {new Date(assign.endTime).toLocaleString('vi-VN')}
                      </strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Giáo viên giao đề:</span>
                      <span>{assign.assignedByName}</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    {isCompleted ? (
                      <button
                        type="button"
                        disabled
                        className="w-full py-2 px-3 rounded-lg text-xs font-semibold bg-slate-100 text-slate-500 cursor-not-allowed text-center"
                      >
                        Em đã hoàn thành bài thi này
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setActiveExam(assign)}
                        className="w-full py-2.5 px-3 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-xs flex items-center justify-center gap-2"
                      >
                        <span>Vào phòng thi làm bài</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Submission History */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <History className="w-5 h-5 text-indigo-600" />
          <span>Lịch sử các bài kiểm tra đã làm</span>
        </h2>

        {studentSubs.length === 0 ? (
          <div className="p-6 text-center text-slate-400 text-xs">
            Em chưa làm bài kiểm tra nào. Hãy bấm "Vào phòng thi làm bài" ở trên nhé!
          </div>
        ) : (
          <div className="divide-y divide-slate-100 text-xs">
            {studentSubs.map((sub) => (
              <div key={sub.id} className="py-3 flex items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{sub.testTitle}</h4>
                  <div className="text-slate-400 text-[11px] mt-0.5">
                    Mã đề: {sub.variantCode} · Nộp lúc: {new Date(sub.submittedAt).toLocaleString('vi-VN')} · Đúng:{' '}
                    <strong className="text-emerald-700">{sub.correctCount}</strong>/{sub.totalQuestions} câu
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span
                      className={`inline-block font-extrabold text-base px-2.5 py-1 rounded-md ${
                        sub.score >= 8.0
                          ? 'bg-emerald-100 text-emerald-800'
                          : sub.score >= 5.0
                          ? 'bg-sky-100 text-sky-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {sub.score.toFixed(1)} đ
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
