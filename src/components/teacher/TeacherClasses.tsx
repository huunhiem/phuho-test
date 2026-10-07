import React, { useState } from 'react';
import { GraduationCap, Users, UserCheck, Search, Award } from 'lucide-react';
import { User, ClassRoom } from '../../types';
import { LMSStorageService } from '../../services/storage';

interface TeacherClassesProps {
  currentUser: User;
}

export const TeacherClasses: React.FC<TeacherClassesProps> = ({ currentUser }) => {
  const classes = LMSStorageService.getClasses();
  const users = LMSStorageService.getUsers();
  const submissions = LMSStorageService.getSubmissions();

  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || '');
  const [searchTerm, setSearchTerm] = useState('');

  const selectedClass = classes.find((c) => c.id === selectedClassId) || classes[0];
  const studentsInClass = users.filter((u) => u.role === 'STUDENT' && u.classId === selectedClass?.id);

  const filteredStudents = studentsInClass.filter(
    (s) =>
      s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.studentCode && s.studentCode.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Lớp học phụ trách</h1>
        <p className="text-sm text-slate-500 mt-1">
          Danh sách học sinh, điểm số tích lũy và tiến độ học tập môn Tin học - THCS Phú Hồ
        </p>
      </div>

      {/* Class Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        {classes.map((cls) => {
          const isActive = cls.id === selectedClassId;
          const isAssigned = currentUser.assignedClassIds?.includes(cls.id);
          return (
            <button
              key={cls.id}
              type="button"
              onClick={() => setSelectedClassId(cls.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors shrink-0 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
              }`}
            >
              <span>Lớp {cls.name}</span>
              {isAssigned && (
                <span className="text-[10px] bg-emerald-500 text-white px-1.5 py-0.2 rounded-full font-bold">
                  Phụ trách
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Class Roster Summary Card */}
      {selectedClass && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Lớp {selectedClass.name} · Sĩ số {studentsInClass.length} học sinh
              </h2>
              <div className="text-xs text-slate-500">
                GVCN / Phụ trách: <strong>{selectedClass.homeroomTeacherName || 'Chưa phân công'}</strong>
              </div>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm học sinh theo tên, MSHS..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Student Roster Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-2.5">STT</th>
                  <th className="px-4 py-2.5">Họ và tên học sinh</th>
                  <th className="px-4 py-2.5">Mã số HS (MSHS)</th>
                  <th className="px-4 py-2.5">Tài khoản Email</th>
                  <th className="px-4 py-2.5 text-center">Số bài kiểm tra đã làm</th>
                  <th className="px-4 py-2.5 text-center">Điểm trung bình</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                      Chưa có học sinh nào trong lớp {selectedClass.name}.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((st, idx) => {
                    const stSubs = submissions.filter((s) => s.studentId === st.id);
                    const avg =
                      stSubs.length > 0
                        ? (stSubs.reduce((acc, s) => acc + s.score, 0) / stSubs.length).toFixed(1)
                        : '-';

                    return (
                      <tr key={st.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3 text-slate-400 font-mono">{idx + 1}</td>
                        <td className="px-4 py-3 font-semibold text-slate-900">{st.fullName}</td>
                        <td className="px-4 py-3 font-mono text-slate-600">{st.studentCode || '-'}</td>
                        <td className="px-4 py-3 text-slate-500">{st.email}</td>
                        <td className="px-4 py-3 text-center font-bold text-slate-700">{stSubs.length}</td>
                        <td className="px-4 py-3 text-center">
                          {avg !== '-' ? (
                            <span
                              className={`font-bold px-2 py-0.5 rounded text-xs ${
                                Number(avg) >= 8.0
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : Number(avg) >= 5.0
                                  ? 'bg-sky-100 text-sky-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {avg}
                            </span>
                          ) : (
                            <span className="text-slate-400">Chưa thi</span>
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
      )}
    </div>
  );
};
