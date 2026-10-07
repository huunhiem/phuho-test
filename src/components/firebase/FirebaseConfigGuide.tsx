import React, { useState } from 'react';
import {
  CloudCog,
  Database,
  ShieldCheck,
  Download,
  Copy,
  CheckCircle2,
  ExternalLink,
  Layers,
  Key,
  Flame
} from 'lucide-react';
import { LMSStorageService } from '../../services/storage';

export const FirebaseConfigGuide: React.FC = () => {
  const [copiedBlueprint, setCopiedBlueprint] = useState(false);
  const [copiedRules, setCopiedRules] = useState(false);

  const collections = [
    'users',
    'schools',
    'academicYears',
    'grades',
    'classes',
    'students',
    'teachers',
    'subjects',
    'lessons',
    'materials',
    'questions',
    'questionBanks',
    'tests',
    'testQuestions',
    'assignments',
    'submissions',
    'answers',
    'learningProgress',
    'reports',
    'systemSettings'
  ];

  const handleDownloadBlueprint = () => {
    fetch('/firebase-blueprint.json')
      .then((res) => res.text())
      .then((text) => {
        const blob = new Blob([text], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'firebase-blueprint.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
  };

  const handleDownloadRules = () => {
    fetch('/firestore.rules')
      .then((res) => res.text())
      .then((text) => {
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'firestore.rules';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
  };

  const handleExportDatabase = () => {
    const jsonStr = LMSStorageService.exportDatabaseJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `phuho_lms_backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Cấu hình Firebase Firestore & Triển khai
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Kiến trúc kỹ thuật, 20 collections Firestore và quy trình triển khai cho Trường THCS Phú Hồ
        </p>
      </div>

      {/* Step by step deployment card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Flame className="w-5 h-5 text-amber-500" />
          <span>Hướng dẫn 4 bước kích hoạt Firebase cho Trường THCS Phú Hồ</span>
        </h2>

        <div className="space-y-4 text-xs">
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex gap-3">
            <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0">
              1
            </span>
            <div className="space-y-1">
              <strong className="text-slate-900 text-sm">Tạo Firebase Project</strong>
              <p className="text-slate-600 leading-relaxed">
                Truy cập <a href="https://console.firebase.google.com/" target="_blank" rel="noreferrer" className="text-indigo-600 underline font-semibold">Firebase Console</a>, nhấn <strong>Add project</strong> và đặt tên dự án (ví dụ: <code>thcs-phuho-lms</code>).
              </p>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex gap-3">
            <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0">
              2
            </span>
            <div className="space-y-1">
              <strong className="text-slate-900 text-sm">Kích hoạt Cloud Firestore & Authentication</strong>
              <p className="text-slate-600 leading-relaxed">
                Tại menu trái, chọn <strong>Firestore Database</strong> &rarr; <strong>Create database</strong>. Chọn Region gần nhất (ví dụ: <code>asia-east1</code> hoặc <code>asia-southeast1</code>). Trong phần <strong>Authentication</strong>, bật phương thức Google Sign-In hoặc Email/Password.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex gap-3">
            <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0">
              3
            </span>
            <div className="space-y-1">
              <strong className="text-slate-900 text-sm">Triển khai Firestore Security Rules</strong>
              <p className="text-slate-600 leading-relaxed">
                Sao chép nội dung file <code>firestore.rules</code> đã được tối ưu hóa bảo mật ABAC (học sinh tuyệt đối không được đọc ngân hàng câu hỏi và bài thi của bạn khác) vào tab <strong>Rules</strong> của Firestore Console và nhấn <strong>Publish</strong>.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex gap-3">
            <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0">
              4
            </span>
            <div className="space-y-1">
              <strong className="text-slate-900 text-sm">Đồng bộ Dữ liệu ban đầu (Seed Data)</strong>
              <p className="text-slate-600 leading-relaxed">
                Tải file sao lưu dữ liệu JSON bên dưới và chạy đồng bộ lên Firestore hoặc duy trì chế độ Persistent Cache tự động lưu trữ của ứng dụng.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 20 Collections Schema Audit */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Database className="w-5 h-5 text-indigo-600" />
              <span>Danh mục 20 Collections Firestore chuẩn</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Toàn bộ 20 collections theo yêu cầu mục 13 đã được định nghĩa trong <code>firebase-blueprint.json</code>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadBlueprint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Tải firebase-blueprint.json</span>
            </button>
            <button
              type="button"
              onClick={handleDownloadRules}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Tải firestore.rules</span>
            </button>
            <button
              type="button"
              onClick={handleExportDatabase}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Xuất bản sao lưu Database</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2.5 pt-2">
          {collections.map((colName) => (
            <div
              key={colName}
              className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between text-xs"
            >
              <span className="font-mono font-bold text-indigo-900">{colName}</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
