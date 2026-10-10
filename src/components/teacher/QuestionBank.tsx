import React, { useState, useEffect, useRef } from 'react';
import {
  HelpCircle,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit2,
  Sparkles,
  CheckCircle2,
  XCircle,
  Eye,
  BookOpen,
  ChevronDown,
  Image as ImageIcon,
  UploadCloud,
  ExternalLink,
  Maximize2,
  HardDrive,
  RefreshCw,
  X,
  Loader2,
  AlertTriangle,
  Key
} from 'lucide-react';
import { Question, QuestionDifficulty, QuestionType, User, OptionItem, TrueFalseStatement, Lesson } from '../../types';
import { LMSStorageService } from '../../services/storage';
import { onStorageChange } from '../../services/storageEvents';
import { GeminiService } from '../../services/geminiService';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { GoogleDriveService } from '../../services/googleDriveService';
import {
  getGoogleAccessToken,
  signInWithGoogleSheets,
  clearGoogleToken,
  isAuthErrorMessage,
  GoogleSheetsService,
  getAppsScriptUrl
} from '../../services/googleSheetsService';

interface QuestionBankProps {
  currentUser: User;
}

export const QuestionBank: React.FC<QuestionBankProps> = ({ currentUser }) => {
  const [questions, setQuestions] = useState<Question[]>(() => LMSStorageService.getQuestions());
  const [topics] = useState(() => LMSStorageService.getTopics());

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [gradeFilter, setGradeFilter] = useState<string>('ALL');
  const [topicFilter, setTopicFilter] = useState<string>('ALL');
  const [lessonFilter, setLessonFilter] = useState<string>('ALL');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewQuestion, setPreviewQuestion] = useState<Question | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [deleteQuestionId, setDeleteQuestionId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSyncingSheet, setIsSyncingSheet] = useState(false);
  const [saveSuccessNotification, setSaveSuccessNotification] = useState<string>('');

  // Image & Drive States
  const [zoomImageModal, setZoomImageModal] = useState<{ url: string; title: string; driveUrl?: string } | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadImageStatus, setUploadImageStatus] = useState<string>('');
  const [isSyncingDrive, setIsSyncingDrive] = useState(false);
  const [driveSyncMsg, setDriveSyncMsg] = useState<string>('');
  const [isDriveSyncError, setIsDriveSyncError] = useState(false);
  const [isAuthFailure, setIsAuthFailure] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [googleConnected, setGoogleConnected] = useState<boolean>(() => Boolean(getGoogleAccessToken()));
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Lesson list from system configuration (Quản trị cấu hình bài học theo từng khối)
  const [allLessons, setAllLessons] = useState<Lesson[]>(() => LMSStorageService.getLessons());
  const [isCustomLessonMode, setIsCustomLessonMode] = useState(false);

  // Form State
  const [formData, setFormData] = useState<{
    code: string;
    content: string;
    gradeLevel: number;
    topic: string;
    lessonTitle: string;
    learningOutcome: string;
    difficulty: QuestionDifficulty;
    type: QuestionType;
    options: OptionItem[];
    trueFalseStatements: TrueFalseStatement[];
    correctAnswerText: string;
    essaySampleAnswer: string;
    explanation: string;
    imageUrl: string;
    imageDriveUrl: string;
    imageDriveFileId: string;
  }>({
    code: '',
    content: '',
    gradeLevel: 6,
    topic: 'Chủ đề A: Máy tính và cộng đồng',
    lessonTitle: 'Bài 1: Thông tin và thu nhận thông tin',
    learningOutcome: 'Nhận biết được vai trò của thông tin trong đời sống',
    difficulty: 'BIET',
    type: 'SINGLE_CHOICE',
    options: [
      { id: 'opt-1', text: 'Phương án A', isCorrect: true },
      { id: 'opt-2', text: 'Phương án B', isCorrect: false },
      { id: 'opt-3', text: 'Phương án C', isCorrect: false },
      { id: 'opt-4', text: 'Phương án D', isCorrect: false }
    ],
    trueFalseStatements: [
      { id: 'tf-1', statement: 'Mệnh đề a', isCorrect: true },
      { id: 'tf-2', statement: 'Mệnh đề b', isCorrect: false },
      { id: 'tf-3', statement: 'Mệnh đề c', isCorrect: true },
      { id: 'tf-4', statement: 'Mệnh đề d', isCorrect: false }
    ],
    correctAnswerText: '',
    essaySampleAnswer: '',
    explanation: '',
    imageUrl: '',
    imageDriveUrl: '',
    imageDriveFileId: ''
  });

  const refreshQuestions = () => {
    setQuestions(LMSStorageService.getQuestions());
  };

  // Lắng nghe mọi thay đổi lưu trữ từ hệ thống hoặc tab khác
  useEffect(() => {
    const unsubscribe = onStorageChange((entity) => {
      if (entity === 'questions' || entity === 'all') {
        refreshQuestions();
      }
      if (entity === 'lessons' || entity === 'all') {
        setAllLessons(LMSStorageService.getLessons());
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  // Luôn nạp dữ liệu câu hỏi hệ thống khi mở trang và đồng bộ tức thì với Google Sheet của trường
  useEffect(() => {
    refreshQuestions();
    const scriptUrl = getAppsScriptUrl();
    if (scriptUrl) {
      setIsSyncingSheet(true);
      GoogleSheetsService.pullQuestionsFromAppsScript()
        .then((res) => {
          if (res.success && res.count > 0) {
            refreshQuestions();
          }
        })
        .catch((e) => {
          console.warn('Lỗi đồng bộ tức thì câu hỏi từ Google Sheet:', e);
        })
        .finally(() => {
          setIsSyncingSheet(false);
        });
    }
  }, []);

  const handleOpenAdd = () => {
    setEditingQuestion(null);
    setUploadImageStatus('');

    // Nạp mới danh sách bài học cấu hình từ Quản trị viên
    const freshLessons = LMSStorageService.getLessons();
    setAllLessons(freshLessons);

    const targetGrade = gradeFilter === 'ALL' ? 6 : Number(gradeFilter);
    const gradeLessons = freshLessons.filter((l) => l.gradeLevel === targetGrade).sort((a, b) => a.lessonNumber - b.lessonNumber);
    const firstLesson = gradeLessons[0];
    const matchedTopic = firstLesson ? topics.find((t) => t.id === firstLesson.topicId) : null;
    setIsCustomLessonMode(false);

    setFormData({
      code: `TH${targetGrade}-A-${Math.floor(10 + Math.random() * 90)}`,
      content: '',
      gradeLevel: targetGrade,
      topic: matchedTopic ? matchedTopic.name : 'Chủ đề A: Máy tính và cộng đồng',
      lessonTitle: firstLesson ? firstLesson.title : 'Bài 1: Thông tin và dữ liệu',
      learningOutcome: firstLesson?.learningOutcomes || 'Nhận biết được thông tin, dữ liệu và các thiết bị vào ra cơ bản',
      difficulty: 'BIET',
      type: 'SINGLE_CHOICE',
      options: [
        { id: 'opt-1', text: '', isCorrect: true },
        { id: 'opt-2', text: '', isCorrect: false },
        { id: 'opt-3', text: '', isCorrect: false },
        { id: 'opt-4', text: '', isCorrect: false }
      ],
      trueFalseStatements: [
        { id: 'tf-1', statement: '', isCorrect: true },
        { id: 'tf-2', statement: '', isCorrect: false },
        { id: 'tf-3', statement: '', isCorrect: true },
        { id: 'tf-4', statement: '', isCorrect: false }
      ],
      correctAnswerText: '',
      essaySampleAnswer: '',
      explanation: '',
      imageUrl: '',
      imageDriveUrl: '',
      imageDriveFileId: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (q: Question) => {
    setEditingQuestion(q);
    setUploadImageStatus(q.imageDriveUrl ? 'Đã lưu trên Google Drive' : '');

    const freshLessons = LMSStorageService.getLessons();
    setAllLessons(freshLessons);

    const lessonsInGrade = freshLessons.filter((l) => l.gradeLevel === q.gradeLevel);
    const isConfiguredLesson = lessonsInGrade.some((l) => l.title === q.lessonTitle);
    setIsCustomLessonMode(!isConfiguredLesson && Boolean(q.lessonTitle));

    setFormData({
      code: q.code,
      content: q.content,
      gradeLevel: q.gradeLevel,
      topic: q.topic,
      lessonTitle: q.lessonTitle,
      learningOutcome: q.learningOutcome,
      difficulty: q.difficulty,
      type: q.type,
      options: q.options || [
        { id: 'opt-1', text: '', isCorrect: true },
        { id: 'opt-2', text: '', isCorrect: false }
      ],
      trueFalseStatements: q.trueFalseStatements || [
        { id: 'tf-1', statement: '', isCorrect: true },
        { id: 'tf-2', statement: '', isCorrect: false }
      ],
      correctAnswerText: q.correctAnswerText || '',
      essaySampleAnswer: q.essaySampleAnswer || '',
      explanation: q.explanation || '',
      imageUrl: q.imageUrl || '',
      imageDriveUrl: q.imageDriveUrl || '',
      imageDriveFileId: q.imageDriveFileId || ''
    });
    setIsModalOpen(true);
  };

  const handleGradeChange = (newGrade: number) => {
    const freshLessons = LMSStorageService.getLessons();
    setAllLessons(freshLessons);
    const lessonsInNewGrade = freshLessons.filter((l) => l.gradeLevel === newGrade).sort((a, b) => a.lessonNumber - b.lessonNumber);
    const firstLesson = lessonsInNewGrade[0];
    const matchedTopic = firstLesson ? topics.find((t) => t.id === firstLesson.topicId) : null;
    setIsCustomLessonMode(false);

    setFormData((prev) => ({
      ...prev,
      gradeLevel: newGrade,
      code: `TH${newGrade}-A-${Math.floor(10 + Math.random() * 90)}`,
      lessonTitle: firstLesson ? firstLesson.title : prev.lessonTitle,
      topic: matchedTopic ? matchedTopic.name : prev.topic,
      learningOutcome: firstLesson?.learningOutcomes || prev.learningOutcome
    }));
  };

  const handleTopicChange = (newTopicName: string) => {
    const matchedTopic = topics.find((t) => t.name === newTopicName);
    const topicId = matchedTopic?.id;
    // Tìm bài học tương ứng với chủ đề này trong khối
    const matchingLesson = allLessons.find(
      (l) => l.gradeLevel === formData.gradeLevel && l.topicId === topicId
    );

    setFormData((prev) => ({
      ...prev,
      topic: newTopicName,
      lessonTitle: matchingLesson ? matchingLesson.title : prev.lessonTitle,
      learningOutcome: matchingLesson?.learningOutcomes || prev.learningOutcome
    }));
  };

  const handleLessonChange = (selectedVal: string) => {
    if (selectedVal === '__CUSTOM__') {
      setIsCustomLessonMode(true);
      return;
    }
    setIsCustomLessonMode(false);
    const matched = allLessons.find(
      (l) => l.gradeLevel === formData.gradeLevel && l.title === selectedVal
    );
    if (matched) {
      const matchedTopic = topics.find((t) => t.id === matched.topicId);
      setFormData((prev) => ({
        ...prev,
        lessonTitle: matched.title,
        topic: matchedTopic ? matchedTopic.name : prev.topic,
        learningOutcome: matched.learningOutcomes || prev.learningOutcome
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        lessonTitle: selectedVal
      }));
    }
  };

  const matchedTopicId = (tId: string) => tId;

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedImageFile(file);
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      setFormData((prev) => ({
        ...prev,
        imageUrl: dataUrl
      }));

      // Tự động tải ảnh lên Google Drive (ưu tiên OAuth hoặc Apps Script cấu hình chung)
      setIsUploadingImage(true);
      setUploadImageStatus('Đang tải hình ảnh lên Google Drive...');
      try {
        const token = getGoogleAccessToken();
        let res: { displayUrl: string; viewLink: string; fileId: string };
        if (token) {
          res = await GoogleDriveService.uploadImageToDrive(file, file.name, token);
          setGoogleConnected(true);
        } else {
          res = await GoogleDriveService.uploadImageViaAppsScript(dataUrl, file.name);
        }
        setFormData((prev) => ({
          ...prev,
          imageUrl: res.displayUrl,
          imageDriveUrl: res.viewLink,
          imageDriveFileId: res.fileId
        }));
        setUploadImageStatus('✓ Đã lưu trữ ảnh lên Google Drive thành công!');
      } catch (err: any) {
        console.warn('Lỗi tải ảnh lên Drive:', err);
        setUploadImageStatus('✓ Ảnh đã đính kèm (sẽ tự động hoàn tất lưu trên Google Drive khi bấm Lưu câu hỏi)');
      } finally {
        setIsUploadingImage(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleConnectGoogleAndUploadImage = async () => {
    setIsUploadingImage(true);
    setUploadImageStatus('Đang mở cửa sổ đăng nhập Google...');
    try {
      const res = await signInWithGoogleSheets();
      if (!res?.accessToken) {
        setUploadImageStatus('Chưa hoàn tất đăng nhập Google.');
        return;
      }
      setGoogleConnected(true);
      setUploadImageStatus('Đang tải hình ảnh lên Google Drive...');
      if (selectedImageFile) {
        const uploadRes = await GoogleDriveService.uploadImageToDrive(
          selectedImageFile,
          selectedImageFile.name,
          res.accessToken
        );
        setFormData((prev) => ({
          ...prev,
          imageUrl: uploadRes.displayUrl,
          imageDriveUrl: uploadRes.viewLink,
          imageDriveFileId: uploadRes.fileId
        }));
        setUploadImageStatus('Đã kết nối và tải ảnh lên Google Drive thành công!');
      } else if (formData.imageUrl && formData.imageUrl.startsWith('data:')) {
        const uploadRes = await GoogleDriveService.uploadImageToDrive(
          formData.imageUrl,
          `cau_hoi_${Date.now()}.png`,
          res.accessToken
        );
        setFormData((prev) => ({
          ...prev,
          imageUrl: uploadRes.displayUrl,
          imageDriveUrl: uploadRes.viewLink,
          imageDriveFileId: uploadRes.fileId
        }));
        setUploadImageStatus('Đã kết nối và tải ảnh lên Google Drive thành công!');
      }
    } catch (err: any) {
      setUploadImageStatus(`Lỗi kết nối Google: ${err.message || String(err)}`);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImageFile(null);
    setFormData((prev) => ({
      ...prev,
      imageUrl: '',
      imageDriveUrl: '',
      imageDriveFileId: ''
    }));
    setUploadImageStatus('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSaveQuestionsToDrive = async () => {
    const token = getGoogleAccessToken();
    setIsSyncingDrive(true);
    setIsDriveSyncError(false);
    setIsAuthFailure(false);
    setDriveSyncMsg('Đang lưu trữ dữ liệu ngân hàng câu hỏi lên Google Drive của trường...');

    try {
      if (token) {
        const res = await GoogleDriveService.saveQuestionsToDrive(questions, token);
        setDriveSyncMsg(`✓ Đã lưu trữ ngân hàng câu hỏi lên Google Drive thành công lúc ${res.updatedTime}!`);
        setGoogleConnected(true);
      } else {
        // Tự động lưu trực tiếp qua Apps Script kết nối hệ thống
        const ok = await GoogleDriveService.saveQuestionsToDriveViaAppsScript(questions);
        if (ok) {
          setDriveSyncMsg(`✓ Đã sao lưu thành công toàn bộ ${questions.length} câu hỏi lên Google Drive của trường lúc ${new Date().toLocaleTimeString('vi-VN')}!`);
        } else {
          setDriveSyncMsg('Lỗi gửi bản sao lưu lên Google Drive. Vui lòng kiểm tra cấu hình kết nối.');
          setIsDriveSyncError(true);
        }
      }
    } catch (e: any) {
      console.warn('Lỗi lưu Google Drive:', e);
      // Fallback lưu qua Apps Script
      try {
        await GoogleDriveService.saveQuestionsToDriveViaAppsScript(questions);
        setDriveSyncMsg(`✓ Đã sao lưu dự phòng ${questions.length} câu hỏi lên Google Drive của trường lúc ${new Date().toLocaleTimeString('vi-VN')}!`);
      } catch (fErr: any) {
        setIsDriveSyncError(true);
        setDriveSyncMsg(`Lỗi lưu lên Google Drive: ${e.message || String(e)}`);
      }
    } finally {
      setIsSyncingDrive(false);
    }
  };

  const handleSyncFromSheet = async () => {
    setIsSyncingSheet(true);
    setDriveSyncMsg('Đang tải danh sách câu hỏi từ Google Sheet của trường...');
    try {
      const res = await GoogleSheetsService.pullQuestionsFromAppsScript();
      refreshQuestions();
      if (res.success) {
        setSaveSuccessNotification(`✓ Đã đồng bộ và cập nhật thành công ${res.count} câu hỏi từ Google Sheet (sheet CauHoi)!`);
      } else {
        setSaveSuccessNotification(`Đã làm mới ngân hàng câu hỏi (${res.error || 'Hoàn tất'})`);
      }
      setTimeout(() => setSaveSuccessNotification(''), 6000);
    } catch (err: any) {
      refreshQuestions();
    } finally {
      setIsSyncingSheet(false);
    }
  };

  const handleReauthAndSaveQuestions = async () => {
    setIsSyncingDrive(true);
    setDriveSyncMsg('Đang mở cửa sổ đăng nhập lại Google...');
    try {
      const authRes = await signInWithGoogleSheets();
      if (!authRes?.accessToken) {
        setDriveSyncMsg('Chưa hoàn tất đăng nhập Google.');
        setIsDriveSyncError(true);
        return;
      }
      setGoogleConnected(true);
      setDriveSyncMsg('Đang lưu trữ dữ liệu ngân hàng câu hỏi lên Google Drive...');
      const res = await GoogleDriveService.saveQuestionsToDrive(questions, authRes.accessToken);
      setDriveSyncMsg(`Đã kết nối lại và lưu trữ ngân hàng câu hỏi lên Google Drive thành công lúc ${res.updatedTime}!`);
      setIsDriveSyncError(false);
      setIsAuthFailure(false);
    } catch (err: any) {
      setIsDriveSyncError(true);
      setDriveSyncMsg(`Lỗi: ${err.message || String(err)}`);
    } finally {
      setIsSyncingDrive(false);
    }
  };

  const handleDelete = (id: string) => {
    setDeleteQuestionId(id);
  };

  const confirmDeleteQuestion = async () => {
    if (deleteQuestionId) {
      LMSStorageService.deleteQuestion(deleteQuestionId);
      // Gửi lệnh xóa lên Google Sheet qua Apps Script
      await GoogleSheetsService.deleteQuestionFromGoogleSheet(deleteQuestionId);
      refreshQuestions();
      setDeleteQuestionId(null);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.content.trim()) return;

    setIsSaving(true);
    try {
      let finalImageUrl = formData.imageUrl;
      let finalDriveUrl = formData.imageDriveUrl;
      let finalDriveFileId = formData.imageDriveFileId;

      // Nếu ảnh có dữ liệu cục bộ (base64) mà chưa có link Google Drive, thử tải lên Google Drive
      if (formData.imageUrl && (!formData.imageDriveUrl || !formData.imageDriveUrl.includes('drive.google.com'))) {
        try {
          const token = getGoogleAccessToken();
          let uploadRes;
          if (token && selectedImageFile) {
            uploadRes = await GoogleDriveService.uploadImageToDrive(selectedImageFile, selectedImageFile.name, token);
          } else {
            uploadRes = await GoogleDriveService.uploadImageViaAppsScript(
              formData.imageUrl,
              selectedImageFile?.name || `img_${formData.code || Date.now()}.png`
            );
          }
          if (uploadRes) {
            finalImageUrl = uploadRes.displayUrl;
            finalDriveUrl = uploadRes.viewLink;
            finalDriveFileId = uploadRes.fileId;
          }
        } catch (err) {
          console.warn('Lỗi tải ảnh Drive khi lưu câu hỏi:', err);
        }
      }

      if (editingQuestion) {
        const updated: Question = {
          ...editingQuestion,
          code: formData.code,
          content: formData.content,
          gradeLevel: Number(formData.gradeLevel) || 6,
          topic: formData.topic || 'Chủ đề A: Máy tính và cộng đồng',
          lessonTitle: formData.lessonTitle || 'Bài 1: Thông tin và dữ liệu',
          learningOutcome: formData.learningOutcome || 'Chuẩn kiến thức GDPT 2018',
          difficulty: formData.difficulty || 'BIET',
          type: formData.type || 'SINGLE_CHOICE',
          options: formData.options,
          trueFalseStatements: formData.trueFalseStatements,
          correctAnswerText: formData.correctAnswerText,
          essaySampleAnswer: formData.essaySampleAnswer,
          explanation: formData.explanation,
          imageUrl: finalImageUrl || undefined,
          imageDriveUrl: finalDriveUrl || undefined,
          imageDriveFileId: finalDriveFileId || undefined
        };
        LMSStorageService.updateQuestion(updated);

        // Lưu đồng thời lên Google Sheet & Google Drive
        const saveRes = await GoogleSheetsService.saveQuestionToGoogleSheetAndDrive(
          updated,
          formData.imageUrl && formData.imageUrl.startsWith('data:') ? formData.imageUrl : undefined
        );

        if (saveRes?.sheetSaved && saveRes?.driveSaved) {
          setSaveSuccessNotification('✓ Đã cập nhật câu hỏi thành công vào Ngân hàng, Google Sheet (sheet CauHoi) và sao lưu Google Drive!');
        } else if (saveRes?.sheetSaved) {
          setSaveSuccessNotification('✓ Đã cập nhật câu hỏi thành công vào Ngân hàng và Google Sheet (sheet CauHoi)!');
        } else if (saveRes?.needScriptUpdate) {
          setSaveSuccessNotification('✓ Đã lưu câu hỏi vào Ngân hàng của trường! (Lưu ý: Apps Script cần bản cập nhật mới để tự động ghi vào sheet CauHoi)');
        } else {
          setSaveSuccessNotification('✓ Đã cập nhật câu hỏi thành công vào Ngân hàng câu hỏi!');
        }
      } else {
        const newQ: Question = {
          id: `q-${Date.now()}`,
          code: formData.code || `TH${formData.gradeLevel}-00${Math.floor(10 + Math.random() * 90)}`,
          content: formData.content,
          gradeLevel: Number(formData.gradeLevel) || 6,
          topic: formData.topic || 'Chủ đề A: Máy tính và cộng đồng',
          lessonTitle: formData.lessonTitle || 'Bài 1: Thông tin và dữ liệu',
          learningOutcome: formData.learningOutcome || 'Chuẩn kiến thức GDPT 2018',
          difficulty: formData.difficulty || 'BIET',
          type: formData.type || 'SINGLE_CHOICE',
          options: formData.options,
          trueFalseStatements: formData.trueFalseStatements,
          correctAnswerText: formData.correctAnswerText,
          essaySampleAnswer: formData.essaySampleAnswer,
          explanation: formData.explanation,
          imageUrl: finalImageUrl || undefined,
          imageDriveUrl: finalDriveUrl || undefined,
          imageDriveFileId: finalDriveFileId || undefined,
          createdBy: currentUser.id,
          authorName: currentUser.fullName,
          createdAt: new Date().toISOString().split('T')[0],
          status: 'ACTIVE'
        };
        LMSStorageService.addQuestion(newQ);

        // Lưu đồng thời lên Google Sheet & Google Drive
        const saveRes = await GoogleSheetsService.saveQuestionToGoogleSheetAndDrive(
          newQ,
          formData.imageUrl && formData.imageUrl.startsWith('data:') ? formData.imageUrl : undefined
        );

        if (saveRes?.sheetSaved && saveRes?.driveSaved) {
          setSaveSuccessNotification('✓ Đã lưu câu hỏi thành công vào Ngân hàng, Google Sheet (sheet CauHoi) và sao lưu Google Drive!');
        } else if (saveRes?.sheetSaved) {
          setSaveSuccessNotification('✓ Đã lưu câu hỏi thành công vào Ngân hàng và Google Sheet (sheet CauHoi)!');
        } else if (saveRes?.needScriptUpdate) {
          setSaveSuccessNotification('✓ Đã lưu câu hỏi vào Ngân hàng! (Lưu ý: Apps Script cần bản cập nhật mới để tự động ghi vào sheet CauHoi - câu hỏi đã lưu an toàn trong hệ thống).');
        } else {
          setSaveSuccessNotification('✓ Đã lưu câu hỏi thành công vào Ngân hàng câu hỏi!');
        }
      }

      setTimeout(() => setSaveSuccessNotification(''), 7000);
      setIsModalOpen(false);
      refreshQuestions();
    } catch (err: any) {
      console.error('Lỗi lưu câu hỏi:', err);
      // Đảm bảo giao diện vẫn cập nhật
      refreshQuestions();
      setIsModalOpen(false);
    } finally {
      setIsSaving(false);
    }
  };

  // AI Assistant: Generate Question
  const handleAIAssist = async () => {
    setIsGeneratingAI(true);
    try {
      const generated = await GeminiService.generateQuestion({
        gradeLevel: formData.gradeLevel,
        topic: formData.topic,
        difficulty: formData.difficulty,
        type: formData.type
      });

      setFormData((prev) => ({
        ...prev,
        content: generated.content || prev.content,
        learningOutcome: generated.learningOutcome || prev.learningOutcome,
        explanation: generated.explanation || prev.explanation,
        options: generated.options || prev.options,
        trueFalseStatements: generated.trueFalseStatements || prev.trueFalseStatements,
        correctAnswerText: generated.correctAnswerText || prev.correctAnswerText,
        essaySampleAnswer: generated.essaySampleAnswer || prev.essaySampleAnswer
      }));
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const filteredQuestions = questions.filter((q) => {
    const qContent = (q.content || '').toLowerCase();
    const qCode = (q.code || '').toLowerCase();
    const qTopic = (q.topic || '').toLowerCase();
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      qContent.includes(search) ||
      qCode.includes(search) ||
      qTopic.includes(search);

    const qGrade = Number(q.gradeLevel || (q as any).grade || 6);
    const matchesGrade = gradeFilter === 'ALL' || qGrade === Number(gradeFilter);
    const matchesTopic = topicFilter === 'ALL' || (q.topic || '').includes(topicFilter);
    const matchesLesson = lessonFilter === 'ALL' || q.lessonTitle === lessonFilter;
    const matchesDifficulty = difficultyFilter === 'ALL' || q.difficulty === difficultyFilter;
    const matchesType = typeFilter === 'ALL' || q.type === typeFilter;

    return matchesSearch && matchesGrade && matchesTopic && matchesLesson && matchesDifficulty && matchesType;
  });

  const getDifficultyBadge = (diff: QuestionDifficulty) => {
    switch (diff) {
      case 'BIET':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">Biết</span>;
      case 'HIEU':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-sky-50 text-sky-700 border border-sky-200">Hiểu</span>;
      case 'VAN_DUNG':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">Vận dụng</span>;
    }
  };

  const getTypeLabel = (t: QuestionType) => {
    switch (t) {
      case 'SINGLE_CHOICE':
        return '1 đáp án đúng';
      case 'MULTIPLE_CHOICE':
        return 'Nhiều đáp án';
      case 'TRUE_FALSE':
        return 'Đúng / Sai';
      case 'FILL_IN_BLANK':
        return 'Điền khuyết';
      case 'ESSAY':
        return 'Tự luận';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Ngân hàng câu hỏi Tin học</h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{questions.length} câu hỏi (Google Sheet & Drive)</span>
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Quản lý toàn bộ câu hỏi theo chuẩn GDPT 2018 (Khối 6-9) từ Google Sheet THCS Phú Hồ · Hỗ trợ chèn hình ảnh và đồng bộ Google Drive
          </p>
        </div>
        <div className="flex items-center gap-2 self-start flex-wrap">
          <button
            type="button"
            disabled={isSyncingSheet}
            onClick={handleSyncFromSheet}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            title="Đồng bộ lại toàn bộ danh sách câu hỏi từ Google Sheet (sheet CauHoi)"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-emerald-700 ${isSyncingSheet ? 'animate-spin' : ''}`} />
            <span>{isSyncingSheet ? 'Đang nạp...' : 'Đồng bộ Google Sheet'}</span>
          </button>

          <button
            type="button"
            disabled={isSyncingDrive}
            onClick={handleSaveQuestionsToDrive}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-indigo-800 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            title="Sao lưu toàn bộ ngân hàng câu hỏi lên Google Drive"
          >
            {isSyncingDrive ? (
              <RefreshCw className="w-3.5 h-3.5 text-indigo-700 animate-spin" />
            ) : (
              <HardDrive className="w-3.5 h-3.5 text-indigo-700" />
            )}
            <span>{isSyncingDrive ? 'Đang lưu...' : 'Sao lưu Google Drive'}</span>
          </button>

          {GoogleDriveService.getSavedFolderUrl() && (
            <a
              href={GoogleDriveService.getSavedFolderUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-100 rounded-lg transition-colors"
              title="Mở thư mục Google Drive của trường THCS Phú Hồ"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Thư mục Drive</span>
            </a>
          )}

          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Soạn câu hỏi mới</span>
          </button>
        </div>
      </div>

      {saveSuccessNotification && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center justify-between gap-2 shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{saveSuccessNotification}</span>
          </div>
          <button
            type="button"
            onClick={() => setSaveSuccessNotification('')}
            className="text-emerald-700 hover:text-emerald-900 font-bold px-1"
          >
            ✕
          </button>
        </div>
      )}

      {driveSyncMsg && (
        <div
          className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-3 animate-in fade-in ${
            isDriveSyncError
              ? 'bg-amber-50/90 border-amber-300 text-amber-950'
              : 'bg-emerald-50 border-emerald-200 text-emerald-900'
          }`}
        >
          <div className="flex items-center gap-2 flex-wrap">
            {isDriveSyncError ? (
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            )}
            <span className="font-medium">{driveSyncMsg}</span>

            {isAuthFailure && (
              <button
                type="button"
                onClick={handleReauthAndSaveQuestions}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg text-xs shadow-xs transition-colors cursor-pointer"
              >
                <Key className="w-3.5 h-3.5" />
                <span>Đăng nhập lại Google & Lưu ngay</span>
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={() => {
              setDriveSyncMsg('');
              setIsDriveSyncError(false);
              setIsAuthFailure(false);
            }}
            className="text-slate-400 hover:text-slate-700 px-1.5 py-0.5 rounded cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Filter bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo nội dung, mã câu hỏi, chủ đề kiến thức..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <select
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">Tất cả Khối</option>
            <option value="6">Khối 6</option>
            <option value="7">Khối 7</option>
            <option value="8">Khối 8</option>
            <option value="9">Khối 9</option>
          </select>

          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">Tất cả Mức độ</option>
            <option value="BIET">Biết (Nhận biết)</option>
            <option value="HIEU">Hiểu (Thông hiểu)</option>
            <option value="VAN_DUNG">Vận dụng</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">Tất cả Dạng câu</option>
            <option value="SINGLE_CHOICE">1 đáp án đúng</option>
            <option value="MULTIPLE_CHOICE">Nhiều đáp án</option>
            <option value="TRUE_FALSE">Đúng / Sai</option>
            <option value="FILL_IN_BLANK">Điền khuyết</option>
            <option value="ESSAY">Tự luận</option>
          </select>

          <select
            value={topicFilter}
            onChange={(e) => setTopicFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">Tất cả Chủ đề (A - F)</option>
            <option value="Chủ đề A">Chủ đề A</option>
            <option value="Chủ đề B">Chủ đề B</option>
            <option value="Chủ đề C">Chủ đề C</option>
            <option value="Chủ đề D">Chủ đề D</option>
            <option value="Chủ đề E">Chủ đề E</option>
            <option value="Chủ đề F">Chủ đề F</option>
          </select>

          <select
            value={lessonFilter}
            onChange={(e) => setLessonFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 max-w-xs truncate"
          >
            <option value="ALL">Tất cả Bài học (Cấu hình)</option>
            {allLessons
              .filter((l) => gradeFilter === 'ALL' || l.gradeLevel === Number(gradeFilter))
              .sort((a, b) => a.gradeLevel - b.gradeLevel || a.lessonNumber - b.lessonNumber)
              .map((les) => (
                <option key={les.id} value={les.title}>
                  [K{les.gradeLevel}] {les.title}
                </option>
              ))}
          </select>
        </div>
      </div>

      {/* Question list */}
      <div className="space-y-3">
        {filteredQuestions.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-400 text-xs">
            Không tìm thấy câu hỏi phù hợp với bộ lọc hiện tại.
          </div>
        ) : (
          filteredQuestions.map((q) => (
            <div
              key={q.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-colors space-y-3"
            >
              {/* Question Top Metadata */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                    {q.code}
                  </span>
                  <span className="font-semibold text-slate-700">Khối {q.gradeLevel}</span>
                  <span className="text-slate-400">·</span>
                  {q.lessonTitle && (
                    <>
                      <span className="font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                        📖 {q.lessonTitle}
                      </span>
                      <span className="text-slate-400">·</span>
                    </>
                  )}
                  <span className="text-slate-600">{q.topic}</span>
                  <span className="text-slate-400">·</span>
                  {getDifficultyBadge(q.difficulty)}
                  <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700">
                    {getTypeLabel(q.type)}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewQuestion(q);
                      setIsPreviewOpen(true);
                    }}
                    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded"
                    title="Xem chi tiết & Giải thích"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(q)}
                    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded"
                    title="Sửa câu hỏi"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(q.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                    title="Xóa câu hỏi"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="text-sm font-medium text-slate-900 leading-relaxed whitespace-pre-wrap">
                {q.content}
              </div>

              {/* Question Image Attachment Preview */}
              {(q.imageUrl || q.imageDriveUrl) && (() => {
                const directImg = GoogleDriveService.getDriveDirectImageUrl(q.imageUrl || q.imageDriveUrl || '');
                if (!directImg) return null;
                return (
                  <div className="flex flex-wrap items-center gap-3 p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
                    <div
                      className="relative cursor-pointer group shrink-0"
                      onClick={() =>
                        setZoomImageModal({
                          url: directImg,
                          title: `Câu hỏi ${q.code}`,
                          driveUrl: q.imageDriveUrl
                        })
                      }
                      title="Bấm để phóng to hình"
                    >
                      <img
                        src={directImg}
                        alt={`Hình câu ${q.code}`}
                        className="w-24 h-18 object-cover rounded-md border border-slate-200 group-hover:opacity-90 transition-opacity bg-white"
                        onError={(e) => {
                          if (q.imageDriveUrl && e.currentTarget.src !== q.imageDriveUrl) {
                            e.currentTarget.src = q.imageDriveUrl;
                          }
                        }}
                      />
                      <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-md transition-opacity">
                        <Maximize2 className="w-3.5 h-3.5 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-[200px] text-xs">
                      <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Hình ảnh đính kèm câu hỏi</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Bấm vào hình để phóng to xem đầy đủ
                      </div>
                      {q.imageDriveUrl && (
                        <a
                          href={q.imageDriveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 mt-1 text-[11px] font-medium text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Xem nguồn trên Google Drive</span>
                        </a>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* Options or Answer hints Preview */}
              {q.type === 'SINGLE_CHOICE' || q.type === 'MULTIPLE_CHOICE' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                  {q.options?.map((opt, idx) => (
                    <div
                      key={opt.id}
                      className={`p-2 rounded-lg border flex items-center justify-between ${
                        opt.isCorrect
                          ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900 font-medium'
                          : 'bg-slate-50 border-slate-200/60 text-slate-600'
                      }`}
                    >
                      <span>
                        <strong className="mr-1">{String.fromCharCode(65 + idx)}.</strong> {opt.text}
                      </span>
                      {opt.isCorrect && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 ml-1" />}
                    </div>
                  ))}
                </div>
              ) : q.type === 'TRUE_FALSE' ? (
                <div className="space-y-1.5 text-xs pt-1">
                  {q.trueFalseStatements?.map((st, idx) => (
                    <div
                      key={st.id}
                      className="p-2 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-between"
                    >
                      <span className="text-slate-800">
                        <strong className="mr-1">{String.fromCharCode(97 + idx)})</strong> {st.statement}
                      </span>
                      <span
                        className={`font-semibold px-2 py-0.5 rounded text-[11px] ${
                          st.isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {st.isCorrect ? 'ĐÚNG' : 'SAI'}
                      </span>
                    </div>
                  ))}
                </div>
              ) : q.type === 'FILL_IN_BLANK' ? (
                <div className="p-2.5 rounded-lg bg-amber-50/60 border border-amber-200 text-xs text-amber-900">
                  <span>Từ cần điền chính xác: </span>
                  <strong className="font-mono bg-white px-2 py-0.5 rounded border border-amber-300">
                    {q.correctAnswerText}
                  </strong>
                </div>
              ) : (
                <div className="p-2.5 rounded-lg bg-indigo-50/60 border border-indigo-200 text-xs text-indigo-900">
                  <span className="font-semibold">Dạng Tự luận:</span> Chờ giáo viên chấm theo biểu điểm.
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                <span>Soạn bởi: {q.authorName} ({q.createdAt})</span>
                <span>Yêu cầu cần đạt: {q.learningOutcome}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Question Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-2xl p-6 animate-in fade-in zoom-in-95 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900">
                {editingQuestion ? 'Chỉnh sửa câu hỏi' : 'Soạn câu hỏi mới'}
              </h2>
              {/* Gemini AI button */}
              <button
                type="button"
                onClick={handleAIAssist}
                disabled={isGeneratingAI}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>{isGeneratingAI ? 'Đang tạo bằng Gemini AI...' : 'AI Gợi ý nội dung'}</span>
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              {/* Basic classifications */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Khối lớp *</label>
                  <select
                    value={formData.gradeLevel}
                    onChange={(e) => handleGradeChange(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value={6}>Khối 6</option>
                    <option value={7}>Khối 7</option>
                    <option value={8}>Khối 8</option>
                    <option value={9}>Khối 9</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Mức độ *</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as QuestionDifficulty })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="BIET">Biết (Nhận biết)</option>
                    <option value="HIEU">Hiểu (Thông hiểu)</option>
                    <option value="VAN_DUNG">Vận dụng</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Dạng câu hỏi *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as QuestionType })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="SINGLE_CHOICE">1 đáp án đúng</option>
                    <option value="MULTIPLE_CHOICE">Nhiều đáp án</option>
                    <option value="TRUE_FALSE">Đúng / Sai</option>
                    <option value="FILL_IN_BLANK">Điền khuyết</option>
                    <option value="ESSAY">Tự luận</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Mã câu hỏi</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>
              </div>

              {/* Topic & Lesson */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Chủ đề kiến thức *</label>
                  <select
                    value={formData.topic}
                    onChange={(e) => handleTopicChange(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    {topics.map((t) => (
                      <option key={t.id} value={t.name}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-medium text-slate-700">Tên bài học *</label>
                    <span className="text-[10px] text-indigo-700 bg-indigo-50 border border-indigo-200 px-1.5 py-0.5 rounded font-medium">
                      Cấu hình sẵn Khối {formData.gradeLevel}
                    </span>
                  </div>
                  <select
                    value={isCustomLessonMode ? '__CUSTOM__' : formData.lessonTitle}
                    onChange={(e) => handleLessonChange(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white font-medium text-slate-900"
                  >
                    <option value="">-- Chọn bài học (Đã cấu hình theo Khối {formData.gradeLevel}) --</option>
                    {allLessons
                      .filter((l) => l.gradeLevel === formData.gradeLevel)
                      .sort((a, b) => a.lessonNumber - b.lessonNumber)
                      .map((les) => {
                        const top = topics.find((t) => t.id === les.topicId);
                        return (
                          <option key={les.id} value={les.title}>
                            {les.title} {top ? `· [${top.code}]` : ''}
                          </option>
                        );
                      })}
                    <option value="__CUSTOM__">✍️ Nhập tên bài học khác (tùy chỉnh)...</option>
                  </select>
                  <p className="text-[11px] text-slate-500 mt-1">
                    💡 Chọn bài học từ danh mục Quản trị cấu hình để tự động điền Chủ đề và Yêu cầu cần đạt.
                  </p>

                  {isCustomLessonMode && (
                    <div className="mt-2 animate-in fade-in">
                      <input
                        type="text"
                        value={formData.lessonTitle}
                        onChange={(e) => setFormData({ ...formData, lessonTitle: e.target.value })}
                        placeholder="Nhập tên bài học tùy chỉnh..."
                        className="w-full px-3 py-2 rounded-lg border border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-indigo-50/30 font-medium"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Learning outcome */}
              <div>
                <label className="block font-medium text-slate-700 mb-1">Yêu cầu cần đạt</label>
                <input
                  type="text"
                  value={formData.learningOutcome}
                  onChange={(e) => setFormData({ ...formData, learningOutcome: e.target.value })}
                  placeholder="Nhận biết được đơn vị đo dung lượng thông tin..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Question Content */}
              <div>
                <label className="block font-medium text-slate-700 mb-1">Nội dung câu hỏi *</label>
                <textarea
                  required
                  rows={3}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Nhập nội dung đề bài câu hỏi..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Question Image Attachment & Google Drive Sync */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-indigo-600" />
                    <span>Hình ảnh minh họa cho câu hỏi (Tùy chọn)</span>
                  </label>
                  {formData.imageUrl && (
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="text-rose-600 hover:text-rose-700 text-xs font-semibold flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Xóa ảnh</span>
                    </button>
                  )}
                </div>

                {formData.imageUrl ? (
                  <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-3 rounded-lg border border-slate-200">
                    <img
                      src={formData.imageUrl}
                      alt="Xem trước hình câu hỏi"
                      className="max-h-36 max-w-full object-contain rounded-md border border-slate-100"
                    />
                    <div className="flex-1 text-xs space-y-1">
                      <div className="font-medium text-slate-700 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Đã đính kèm ảnh câu hỏi</span>
                      </div>
                      {uploadImageStatus && (
                        <div className="text-[11px] text-indigo-600 font-medium">
                          {uploadImageStatus}
                        </div>
                      )}
                      {formData.imageDriveUrl ? (
                        <a
                          href={formData.imageDriveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] text-blue-600 hover:underline font-mono"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Mở link Google Drive</span>
                        </a>
                      ) : currentUser.role === 'ADMIN' ? (
                        <button
                          type="button"
                          disabled={isUploadingImage}
                          onClick={handleConnectGoogleAndUploadImage}
                          className="mt-1 inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-md text-[11px] shadow-xs cursor-pointer transition-colors"
                          title="Đăng nhập Google và tải hình ảnh này lên Google Drive"
                        >
                          <Key className="w-3 h-3" />
                          <span>{isUploadingImage ? 'Đang tải lên Drive...' : 'Đăng nhập Google Drive để tải ảnh lên đám mây'}</span>
                        </button>
                      ) : (
                        <div className="text-[11px] text-emerald-700 font-medium pt-0.5">
                          ✓ Ảnh được tự động lưu trữ và đồng bộ theo cấu hình của Quản trị viên
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleImageFileChange}
                        className="hidden"
                        id="question-image-upload"
                      />
                      <label
                        htmlFor="question-image-upload"
                        className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-indigo-300 bg-indigo-50/50 hover:bg-indigo-50 text-indigo-700 font-semibold text-xs transition-colors"
                      >
                        {isUploadingImage ? (
                          <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                        ) : (
                          <UploadCloud className="w-4 h-4 text-indigo-600" />
                        )}
                        <span>{isUploadingImage ? 'Đang tải lên Drive...' : 'Chọn ảnh từ máy tính (Tải lên Google Drive)'}</span>
                      </label>
                      <span className="text-[11px] text-slate-400">hoặc dán đường dẫn ảnh:</span>
                    </div>

                    <input
                      type="url"
                      value={formData.imageUrl}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          imageUrl: e.target.value,
                          imageDriveUrl: e.target.value
                        })
                      }
                      placeholder="Dán URL hình ảnh trực tiếp (https://...)"
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                    />
                  </div>
                )}
              </div>

              {/* Options configuration according to Question Type */}
              {formData.type === 'SINGLE_CHOICE' || formData.type === 'MULTIPLE_CHOICE' ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="font-semibold text-slate-800">
                      Các phương án lựa chọn ({formData.type === 'SINGLE_CHOICE' ? 'Chọn 1 đáp án đúng' : 'Chọn các đáp án đúng'})
                    </label>
                  </div>
                  {formData.options.map((opt, idx) => (
                    <div key={opt.id} className="flex items-center gap-2">
                      <input
                        type={formData.type === 'SINGLE_CHOICE' ? 'radio' : 'checkbox'}
                        name="correctOption"
                        checked={Boolean(opt.isCorrect)}
                        onChange={() => {
                          if (formData.type === 'SINGLE_CHOICE') {
                            const updated = formData.options.map((o) => ({ ...o, isCorrect: o.id === opt.id }));
                            setFormData({ ...formData, options: updated });
                          } else {
                            const updated = formData.options.map((o) =>
                              o.id === opt.id ? { ...o, isCorrect: !o.isCorrect } : o
                            );
                            setFormData({ ...formData, options: updated });
                          }
                        }}
                        className="w-4 h-4 text-indigo-600 rounded"
                      />
                      <span className="font-bold text-slate-600 w-5">{String.fromCharCode(65 + idx)}.</span>
                      <input
                        type="text"
                        required
                        value={opt.text}
                        onChange={(e) => {
                          const updated = [...formData.options];
                          updated[idx].text = e.target.value;
                          setFormData({ ...formData, options: updated });
                        }}
                        placeholder={`Phương án ${String.fromCharCode(65 + idx)}`}
                        className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  ))}
                </div>
              ) : formData.type === 'TRUE_FALSE' ? (
                <div className="space-y-2">
                  <label className="font-semibold text-slate-800">Các mệnh đề Đúng / Sai (Định dạng GDPT 2018)</label>
                  {formData.trueFalseStatements.map((st, idx) => (
                    <div key={st.id} className="flex items-center gap-2">
                      <span className="font-bold text-slate-600 w-5">{String.fromCharCode(97 + idx)})</span>
                      <input
                        type="text"
                        required
                        value={st.statement}
                        onChange={(e) => {
                          const updated = [...formData.trueFalseStatements];
                          updated[idx].statement = e.target.value;
                          setFormData({ ...formData, trueFalseStatements: updated });
                        }}
                        placeholder={`Mệnh đề ${String.fromCharCode(97 + idx)}`}
                        className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...formData.trueFalseStatements];
                            updated[idx].isCorrect = true;
                            setFormData({ ...formData, trueFalseStatements: updated });
                          }}
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            st.isCorrect ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          Đúng
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...formData.trueFalseStatements];
                            updated[idx].isCorrect = false;
                            setFormData({ ...formData, trueFalseStatements: updated });
                          }}
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            !st.isCorrect ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          Sai
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : formData.type === 'FILL_IN_BLANK' ? (
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Từ / Cụm từ điền khuyết chính xác *</label>
                  <input
                    type="text"
                    required
                    value={formData.correctAnswerText}
                    onChange={(e) => setFormData({ ...formData, correctAnswerText: e.target.value })}
                    placeholder="Ví dụ: virus, rẽ nhánh, megabyte"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>
              ) : (
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Đáp án mẫu / Biểu điểm chấm tự luận</label>
                  <textarea
                    rows={3}
                    value={formData.essaySampleAnswer}
                    onChange={(e) => setFormData({ ...formData, essaySampleAnswer: e.target.value })}
                    placeholder="Gợi ý đáp án và các bước cho điểm..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              )}

              {/* Explanation */}
              <div>
                <label className="block font-medium text-slate-700 mb-1">Lời giải chi tiết & Giải thích sư phạm</label>
                <textarea
                  rows={2}
                  value={formData.explanation}
                  onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                  placeholder="Giải thích vì sao chọn đáp án này để học sinh tham khảo sau khi nộp bài..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-4 py-2 font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {isSaving && <RefreshCw className="w-4 h-4 animate-spin" />}
                  <span>{isSaving ? 'Đang lưu Google Sheet & Drive...' : 'Lưu vào Ngân hàng'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Question Modal */}
      {isPreviewOpen && previewQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg p-6 animate-in fade-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                {previewQuestion.code}
              </span>
              <button
                type="button"
                onClick={() => setIsPreviewOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="text-sm font-semibold text-slate-900 leading-relaxed">
              {previewQuestion.content}
            </div>

            {/* Preview image */}
            {previewQuestion.imageUrl && (
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex flex-col items-center gap-2">
                <img
                  src={previewQuestion.imageUrl}
                  alt={`Hình câu ${previewQuestion.code}`}
                  className="max-h-56 max-w-full object-contain rounded-md"
                />
                {previewQuestion.imageDriveUrl && (
                  <a
                    href={previewQuestion.imageDriveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-blue-600 hover:underline flex items-center gap-1 font-mono"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>Nguồn file trên Google Drive</span>
                  </a>
                )}
              </div>
            )}

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80 space-y-2 text-xs">
              <div className="font-semibold text-indigo-900">Lời giải chi tiết:</div>
              <div className="text-slate-700 leading-relaxed">
                {previewQuestion.explanation || 'Chưa có lời giải chi tiết.'}
              </div>
            </div>

            <div className="text-right pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsPreviewOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Question Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteQuestionId)}
        title="Xóa câu hỏi khỏi ngân hàng"
        message="Bạn có chắc chắn muốn xóa câu hỏi này? Câu hỏi sẽ không còn xuất hiện trong ngân hàng đề thi."
        confirmLabel="Xóa câu hỏi"
        cancelLabel="Hủy bỏ"
        isDanger={true}
        onConfirm={confirmDeleteQuestion}
        onCancel={() => setDeleteQuestionId(null)}
      />

      {/* Image Zoom Modal */}
      {zoomImageModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4 animate-in fade-in"
          onClick={() => setZoomImageModal(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-3 border-b border-slate-100">
              <span className="font-semibold text-slate-800 text-xs flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-indigo-600" />
                {zoomImageModal.title}
              </span>
              <div className="flex items-center gap-3">
                {zoomImageModal.driveUrl && (
                  <a
                    href={zoomImageModal.driveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline flex items-center gap-1 font-medium"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Mở trên Google Drive</span>
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => setZoomImageModal(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-2 overflow-auto flex items-center justify-center max-h-[75vh]">
              <img
                src={zoomImageModal.url}
                alt={zoomImageModal.title}
                className="max-h-[70vh] w-auto object-contain rounded-lg shadow-xs"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
