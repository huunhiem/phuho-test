import React, { useState, useEffect, useMemo } from 'react';
import {
  FileText,
  Plus,
  Shuffle,
  CheckCircle2,
  AlertCircle,
  Eye,
  Trash2,
  Calendar,
  Layers,
  Sparkles,
  ArrowRight,
  Calculator,
  Sliders,
  HelpCircle,
  Table,
  Check,
  RefreshCw,
  Search,
  BookOpen,
  CheckSquare,
  Square,
  Filter,
  X
} from 'lucide-react';
import {
  Test,
  TestMatrix,
  Question,
  User,
  TestVariant,
  QuestionDifficulty,
  QuestionType,
  MatrixGrid,
  MatrixCellConfig
} from '../../types';
import { LMSStorageService } from '../../services/storage';
import { onStorageChange } from '../../services/storageEvents';
import { ConfirmDialog } from '../common/ConfirmDialog';

interface TestBuilderProps {
  currentUser: User;
  onTestCreated?: (test: Test) => void;
}

// Danh mục dạng câu hỏi theo chuẩn GDPT 2018
export const QUESTION_TYPES: {
  type: QuestionType;
  label: string;
  shortLabel: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
}[] = [
  {
    type: 'SINGLE_CHOICE',
    label: 'Trắc nghiệm 1 lựa chọn',
    shortLabel: 'Nhiều PA (1 đúng)',
    badgeBg: 'bg-blue-50',
    badgeText: 'text-blue-700',
    badgeBorder: 'border-blue-200'
  },
  {
    type: 'MULTIPLE_CHOICE',
    label: 'Trắc nghiệm nhiều lựa chọn',
    shortLabel: 'Nhiều PA (nhiều đúng)',
    badgeBg: 'bg-indigo-50',
    badgeText: 'text-indigo-700',
    badgeBorder: 'border-indigo-200'
  },
  {
    type: 'TRUE_FALSE',
    label: 'Trắc nghiệm Đúng / Sai',
    shortLabel: 'Đúng / Sai',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-700',
    badgeBorder: 'border-emerald-200'
  },
  {
    type: 'FILL_IN_BLANK',
    label: 'Trả lời ngắn / Điền khuyết',
    shortLabel: 'Điền khuyết / Trả lời ngắn',
    badgeBg: 'bg-amber-50',
    badgeText: 'text-amber-700',
    badgeBorder: 'border-amber-200'
  },
  {
    type: 'ESSAY',
    label: 'Tự luận',
    shortLabel: 'Tự luận',
    badgeBg: 'bg-purple-50',
    badgeText: 'text-purple-700',
    badgeBorder: 'border-purple-200'
  }
];

// Danh mục mức độ nhận thức
export const DIFFICULTY_LEVELS: {
  difficulty: QuestionDifficulty;
  label: string;
  shortLabel: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  headerBg: string;
}[] = [
  {
    difficulty: 'BIET',
    label: 'Mức 1: Nhận biết',
    shortLabel: 'Nhận biết',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-700',
    badgeBorder: 'border-emerald-200',
    headerBg: 'bg-emerald-50/80 text-emerald-900 border-emerald-200'
  },
  {
    difficulty: 'HIEU',
    label: 'Mức 2: Thông hiểu',
    shortLabel: 'Thông hiểu',
    badgeBg: 'bg-sky-50',
    badgeText: 'text-sky-700',
    badgeBorder: 'border-sky-200',
    headerBg: 'bg-sky-50/80 text-sky-900 border-sky-200'
  },
  {
    difficulty: 'VAN_DUNG',
    label: 'Mức 3: Vận dụng',
    shortLabel: 'Vận dụng',
    badgeBg: 'bg-amber-50',
    badgeText: 'text-amber-700',
    badgeBorder: 'border-amber-200',
    headerBg: 'bg-amber-50/80 text-amber-900 border-amber-200'
  }
];

// Hàm khởi tạo lưới ma trận mặc định (khớp kho câu hỏi mẫu để có thể trích xuất ngay)
export const createDefaultMatrixGrid = (): MatrixGrid => ({
  SINGLE_CHOICE: {
    BIET: { count: 2, pointPerQuestion: 1.0 },
    HIEU: { count: 1, pointPerQuestion: 1.0 },
    VAN_DUNG: { count: 0, pointPerQuestion: 1.0 }
  },
  MULTIPLE_CHOICE: {
    BIET: { count: 0, pointPerQuestion: 1.0 },
    HIEU: { count: 1, pointPerQuestion: 1.0 },
    VAN_DUNG: { count: 0, pointPerQuestion: 1.0 }
  },
  TRUE_FALSE: {
    BIET: { count: 0, pointPerQuestion: 2.0 },
    HIEU: { count: 1, pointPerQuestion: 2.0 },
    VAN_DUNG: { count: 0, pointPerQuestion: 2.0 }
  },
  FILL_IN_BLANK: {
    BIET: { count: 0, pointPerQuestion: 2.0 },
    HIEU: { count: 0, pointPerQuestion: 2.0 },
    VAN_DUNG: { count: 1, pointPerQuestion: 2.0 }
  },
  ESSAY: {
    BIET: { count: 0, pointPerQuestion: 2.0 },
    HIEU: { count: 0, pointPerQuestion: 2.0 },
    VAN_DUNG: { count: 1, pointPerQuestion: 2.0 }
  }
});

// Các mẫu ma trận định sẵn (Presets)
export const MATRIX_PRESETS = [
  {
    id: 'preset-tin6-sample',
    name: 'Đề mẫu Tin học 6 (6 câu - 10 điểm - Đầy đủ 5 dạng)',
    badge: 'Khớp sẵn kho',
    description: '2 Biết (TN), 3 Hiểu (1 TN, 1 Đ/S, 1 Nhiều PA), 2 Vận dụng (1 Điền khuyết, 1 Tự luận) = 10.0 điểm',
    build: (): MatrixGrid => createDefaultMatrixGrid()
  },
  {
    id: 'preset-gdpt2018-70-30',
    name: 'Chuẩn GDPT 2018 (70% Trắc nghiệm + 30% Tự luận)',
    badge: 'Bộ GD&ĐT',
    description: '14 câu Trắc nghiệm (7.0đ) + 2 câu Tự luận (3.0đ) = 10.0 điểm (40% Biết, 30% Hiểu, 30% Vận dụng)',
    build: (): MatrixGrid => ({
      SINGLE_CHOICE: {
        BIET: { count: 8, pointPerQuestion: 0.5 },
        HIEU: { count: 4, pointPerQuestion: 0.5 },
        VAN_DUNG: { count: 2, pointPerQuestion: 0.5 }
      },
      MULTIPLE_CHOICE: {
        BIET: { count: 0, pointPerQuestion: 0.5 },
        HIEU: { count: 0, pointPerQuestion: 0.5 },
        VAN_DUNG: { count: 0, pointPerQuestion: 0.5 }
      },
      TRUE_FALSE: {
        BIET: { count: 0, pointPerQuestion: 1.0 },
        HIEU: { count: 0, pointPerQuestion: 1.0 },
        VAN_DUNG: { count: 0, pointPerQuestion: 1.0 }
      },
      FILL_IN_BLANK: {
        BIET: { count: 0, pointPerQuestion: 0.5 },
        HIEU: { count: 0, pointPerQuestion: 0.5 },
        VAN_DUNG: { count: 0, pointPerQuestion: 0.5 }
      },
      ESSAY: {
        BIET: { count: 0, pointPerQuestion: 1.0 },
        HIEU: { count: 1, pointPerQuestion: 1.0 },
        VAN_DUNG: { count: 1, pointPerQuestion: 2.0 }
      }
    })
  },
  {
    id: 'preset-100-mcq',
    name: '100% Trắc nghiệm khách quan (20 câu x 0.5đ = 10đ)',
    badge: 'Trắc nghiệm',
    description: '8 Nhận biết (4.0đ), 8 Thông hiểu (4.0đ), 4 Vận dụng (2.0đ) - Mỗi câu 0.5 điểm',
    build: (): MatrixGrid => ({
      SINGLE_CHOICE: {
        BIET: { count: 8, pointPerQuestion: 0.5 },
        HIEU: { count: 8, pointPerQuestion: 0.5 },
        VAN_DUNG: { count: 4, pointPerQuestion: 0.5 }
      },
      MULTIPLE_CHOICE: {
        BIET: { count: 0, pointPerQuestion: 0.5 },
        HIEU: { count: 0, pointPerQuestion: 0.5 },
        VAN_DUNG: { count: 0, pointPerQuestion: 0.5 }
      },
      TRUE_FALSE: {
        BIET: { count: 0, pointPerQuestion: 1.0 },
        HIEU: { count: 0, pointPerQuestion: 1.0 },
        VAN_DUNG: { count: 0, pointPerQuestion: 1.0 }
      },
      FILL_IN_BLANK: {
        BIET: { count: 0, pointPerQuestion: 0.5 },
        HIEU: { count: 0, pointPerQuestion: 0.5 },
        VAN_DUNG: { count: 0, pointPerQuestion: 0.5 }
      },
      ESSAY: {
        BIET: { count: 0, pointPerQuestion: 1.0 },
        HIEU: { count: 0, pointPerQuestion: 1.0 },
        VAN_DUNG: { count: 0, pointPerQuestion: 1.0 }
      }
    })
  },
  {
    id: 'preset-new-format',
    name: 'Định dạng mới GDPT 2018 (3 Phần: TN + Đúng/Sai + Điền từ)',
    badge: 'Mới 2025',
    description: '8 câu 1 lựa chọn (4đ) + 2 câu Đúng/Sai (3đ) + 2 câu Điền từ (3đ) = 10.0 điểm',
    build: (): MatrixGrid => ({
      SINGLE_CHOICE: {
        BIET: { count: 5, pointPerQuestion: 0.5 },
        HIEU: { count: 3, pointPerQuestion: 0.5 },
        VAN_DUNG: { count: 0, pointPerQuestion: 0.5 }
      },
      MULTIPLE_CHOICE: {
        BIET: { count: 0, pointPerQuestion: 0.5 },
        HIEU: { count: 0, pointPerQuestion: 0.5 },
        VAN_DUNG: { count: 0, pointPerQuestion: 0.5 }
      },
      TRUE_FALSE: {
        BIET: { count: 0, pointPerQuestion: 1.5 },
        HIEU: { count: 1, pointPerQuestion: 1.5 },
        VAN_DUNG: { count: 1, pointPerQuestion: 1.5 }
      },
      FILL_IN_BLANK: {
        BIET: { count: 0, pointPerQuestion: 1.5 },
        HIEU: { count: 1, pointPerQuestion: 1.5 },
        VAN_DUNG: { count: 1, pointPerQuestion: 1.5 }
      },
      ESSAY: {
        BIET: { count: 0, pointPerQuestion: 1.0 },
        HIEU: { count: 0, pointPerQuestion: 1.0 },
        VAN_DUNG: { count: 0, pointPerQuestion: 1.0 }
      }
    })
  },
  {
    id: 'preset-15min',
    name: 'Kiểm tra 15 phút thường xuyên (10 câu x 1.0đ = 10đ)',
    badge: 'Thường xuyên',
    description: '4 Nhận biết (4.0đ), 4 Thông hiểu (4.0đ), 2 Vận dụng (2.0đ) - Mỗi câu 1.0 điểm',
    build: (): MatrixGrid => ({
      SINGLE_CHOICE: {
        BIET: { count: 4, pointPerQuestion: 1.0 },
        HIEU: { count: 4, pointPerQuestion: 1.0 },
        VAN_DUNG: { count: 2, pointPerQuestion: 1.0 }
      },
      MULTIPLE_CHOICE: {
        BIET: { count: 0, pointPerQuestion: 1.0 },
        HIEU: { count: 0, pointPerQuestion: 1.0 },
        VAN_DUNG: { count: 0, pointPerQuestion: 1.0 }
      },
      TRUE_FALSE: {
        BIET: { count: 0, pointPerQuestion: 1.0 },
        HIEU: { count: 0, pointPerQuestion: 1.0 },
        VAN_DUNG: { count: 0, pointPerQuestion: 1.0 }
      },
      FILL_IN_BLANK: {
        BIET: { count: 0, pointPerQuestion: 1.0 },
        HIEU: { count: 0, pointPerQuestion: 1.0 },
        VAN_DUNG: { count: 0, pointPerQuestion: 1.0 }
      },
      ESSAY: {
        BIET: { count: 0, pointPerQuestion: 1.0 },
        HIEU: { count: 0, pointPerQuestion: 1.0 },
        VAN_DUNG: { count: 0, pointPerQuestion: 1.0 }
      }
    })
  }
];

export const TestBuilder: React.FC<TestBuilderProps> = ({ currentUser, onTestCreated }) => {
  const [tests, setTests] = useState<Test[]>(() => LMSStorageService.getTests());
  const [questions, setQuestions] = useState<Question[]>(() => LMSStorageService.getQuestions());

  useEffect(() => {
    const unsub = onStorageChange((entity) => {
      if (entity === 'questions' || entity === 'all') {
        setQuestions(LMSStorageService.getQuestions());
      }
      if (entity === 'tests' || entity === 'all') {
        setTests(LMSStorageService.getTests());
      }
    });
    return () => unsub();
  }, []);

  // Form State for creating new test
  const [isCreating, setIsCreating] = useState(false);
  const [previewTest, setPreviewTest] = useState<Test | null>(null);
  const [deleteTestId, setDeleteTestId] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string>('');

  // Matrix Grid Configuration
  const [matrixGrid, setMatrixGrid] = useState<MatrixGrid>(() => createDefaultMatrixGrid());
  const [selectedPresetId, setSelectedPresetId] = useState<string>('preset-tin6-sample');

  const [testForm, setTestForm] = useState({
    title: 'Kiểm tra Cuối kì 1 - Tin học 6 (2025-2026)',
    gradeLevel: 6,
    durationMinutes: 45,
    selectedTopics: ['Chủ đề A: Máy tính và cộng đồng', 'Chủ đề B: Mạng máy tính và Internet'],
    variantCount: 2 // Số mã đề cần sinh (ví dụ: 101, 102)
  });

  // Selected questions & specific question points map
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>([]);
  const [questionPointsMap, setQuestionPointsMap] = useState<Record<string, number>>({});
  const [autoPickMessage, setAutoPickMessage] = useState('');
  const [shortfallWarning, setShortfallWarning] = useState<string>('');

  // Manual Question Picker Modal
  const [showQuestionPickerModal, setShowQuestionPickerModal] = useState(false);
  const [pickerSearch, setPickerSearch] = useState('');
  const [pickerFilterType, setPickerFilterType] = useState<string>('ALL');
  const [pickerFilterDifficulty, setPickerFilterDifficulty] = useState<string>('ALL');
  const [pickerFilterLesson, setPickerFilterLesson] = useState<string>('ALL');

  // Chọn bài học để tạo đề thi
  const [selectedLessons, setSelectedLessons] = useState<string[]>([]);
  const [lessonSelectionMode, setLessonSelectionMode] = useState<'ALL' | 'CUSTOM'>('ALL');
  const [lessonSearchQuery, setLessonSearchQuery] = useState('');

  const refreshTests = () => {
    setTests(LMSStorageService.getTests());
  };

  // Danh sách các bài học khả dụng theo Khối lớp (kết hợp chương trình chuẩn GDPT 2018 + câu hỏi có trong kho)
  const availableLessons = useMemo(() => {
    const standard = LMSStorageService.getLessonsByGrade(testForm.gradeLevel).map((l) => l.title);
    const questionsInGrade = questions.filter((q) => q.gradeLevel === testForm.gradeLevel);
    const questionLessonTitles = questionsInGrade.map((q) => q.lessonTitle).filter(Boolean);
    const set = new Set([...standard, ...questionLessonTitles]);
    return Array.from(set).sort((a, b) => {
      const matchA = a.match(/Bài\s*(\d+)/i);
      const matchB = b.match(/Bài\s*(\d+)/i);
      if (matchA && matchB) {
        return parseInt(matchA[1], 10) - parseInt(matchB[1], 10);
      }
      return a.localeCompare(b, 'vi');
    });
  }, [testForm.gradeLevel, questions]);

  // Thống kê số lượng câu hỏi hiện có trong kho theo từng bài học
  const questionCountByLesson = useMemo(() => {
    const map: Record<string, number> = {};
    const questionsInGrade = questions.filter((q) => q.gradeLevel === testForm.gradeLevel);
    questionsInGrade.forEach((q) => {
      if (q.lessonTitle) {
        map[q.lessonTitle] = (map[q.lessonTitle] || 0) + 1;
      }
    });
    return map;
  }, [testForm.gradeLevel, questions]);

  // Danh sách bài học sau khi lọc theo ô tìm kiếm
  const filteredLessons = useMemo(() => {
    if (!lessonSearchQuery.trim()) return availableLessons;
    const q = lessonSearchQuery.toLowerCase();
    return availableLessons.filter((l) => l.toLowerCase().includes(q));
  }, [availableLessons, lessonSearchQuery]);

  // Tính toán số lượng câu hỏi hiện có trong Ngân hàng theo (gradeLevel, type, difficulty, selectedLessons)
  const bankAvailability = useMemo(() => {
    const map: Record<string, number> = {};
    const filtered = questions.filter((q) => {
      if (q.gradeLevel !== testForm.gradeLevel) return false;
      if (lessonSelectionMode === 'CUSTOM' && selectedLessons.length > 0) {
        if (!q.lessonTitle || !selectedLessons.includes(q.lessonTitle)) return false;
      }
      return true;
    });
    for (const q of filtered) {
      const key = `${q.type}_${q.difficulty}`;
      map[key] = (map[key] || 0) + 1;
    }
    return map;
  }, [questions, testForm.gradeLevel, selectedLessons, lessonSelectionMode]);

  // Tính toán thống kê ma trận theo thời gian thực (Số câu, Số điểm, Tỷ lệ %)
  const matrixSummary = useMemo(() => {
    let totalQuestions = 0;
    let totalPoints = 0;

    // Thống kê theo mức độ
    const byDifficulty: Record<QuestionDifficulty, { count: number; points: number; percent: number }> = {
      BIET: { count: 0, points: 0, percent: 0 },
      HIEU: { count: 0, points: 0, percent: 0 },
      VAN_DUNG: { count: 0, points: 0, percent: 0 }
    };

    // Thống kê theo dạng câu hỏi
    const byType: Record<QuestionType, { count: number; points: number }> = {
      SINGLE_CHOICE: { count: 0, points: 0 },
      MULTIPLE_CHOICE: { count: 0, points: 0 },
      TRUE_FALSE: { count: 0, points: 0 },
      FILL_IN_BLANK: { count: 0, points: 0 },
      ESSAY: { count: 0, points: 0 }
    };

    for (const qType of QUESTION_TYPES) {
      for (const diff of DIFFICULTY_LEVELS) {
        const cell = matrixGrid[qType.type]?.[diff.difficulty] || { count: 0, pointPerQuestion: 0 };
        const count = Number(cell.count) || 0;
        const pts = Number(cell.pointPerQuestion) || 0;
        const cellTotal = count * pts;

        totalQuestions += count;
        totalPoints += cellTotal;

        byDifficulty[diff.difficulty].count += count;
        byDifficulty[diff.difficulty].points += cellTotal;

        byType[qType.type].count += count;
        byType[qType.type].points += cellTotal;
      }
    }

    // Làm tròn tổng điểm
    totalPoints = Math.round(totalPoints * 100) / 100;

    // Tính tỷ lệ %
    for (const diff of DIFFICULTY_LEVELS) {
      const pts = byDifficulty[diff.difficulty].points;
      byDifficulty[diff.difficulty].points = Math.round(pts * 100) / 100;
      byDifficulty[diff.difficulty].percent = totalPoints > 0 ? Math.round((pts / totalPoints) * 100) : 0;
    }

    for (const qType of QUESTION_TYPES) {
      byType[qType.type].points = Math.round(byType[qType.type].points * 100) / 100;
    }

    return {
      totalQuestions,
      totalPoints,
      byDifficulty,
      byType
    };
  }, [matrixGrid]);

  // Cập nhật ô ma trận (Số câu hoặc Điểm mỗi câu)
  const handleUpdateMatrixCell = (
    type: QuestionType,
    difficulty: QuestionDifficulty,
    field: 'count' | 'pointPerQuestion',
    value: number
  ) => {
    setMatrixGrid((prev) => {
      const currentCell = prev[type]?.[difficulty] || { count: 0, pointPerQuestion: 0 };
      const updatedValue = Math.max(0, value);
      return {
        ...prev,
        [type]: {
          ...prev[type],
          [difficulty]: {
            ...currentCell,
            [field]: updatedValue
          }
        }
      };
    });
    setSelectedPresetId('');
  };

  // Áp dụng mẫu ma trận (Preset)
  const handleApplyPreset = (presetId: string) => {
    const preset = MATRIX_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    setMatrixGrid(preset.build());
    setSelectedPresetId(presetId);
    setAutoPickMessage('');
    setShortfallWarning('');
  };

  // Cân bằng điểm tự động về đúng thang 10.0 điểm
  const handleBalancePointsTo10 = () => {
    if (matrixSummary.totalQuestions === 0) return;

    // Đếm số câu có count > 0
    let totalCellPoints = 0;
    for (const qType of QUESTION_TYPES) {
      for (const diff of DIFFICULTY_LEVELS) {
        const cell = matrixGrid[qType.type]?.[diff.difficulty];
        if (cell && cell.count > 0) {
          totalCellPoints += cell.count * cell.pointPerQuestion;
        }
      }
    }

    if (totalCellPoints === 0) {
      // Chia đều cho tất cả các câu đã chọn
      const pointPerQ = Math.round((10 / matrixSummary.totalQuestions) * 100) / 100;
      setMatrixGrid((prev) => {
        const next = { ...prev };
        for (const qType of QUESTION_TYPES) {
          next[qType.type] = { ...next[qType.type] };
          for (const diff of DIFFICULTY_LEVELS) {
            if (next[qType.type][diff.difficulty].count > 0) {
              next[qType.type][diff.difficulty] = {
                ...next[qType.type][diff.difficulty],
                pointPerQuestion: pointPerQ
              };
            }
          }
        }
        return next;
      });
      return;
    }

    const factor = 10 / totalCellPoints;
    setMatrixGrid((prev) => {
      const next = { ...prev };
      for (const qType of QUESTION_TYPES) {
        next[qType.type] = { ...next[qType.type] };
        for (const diff of DIFFICULTY_LEVELS) {
          const cell = next[qType.type][diff.difficulty];
          if (cell.count > 0) {
            next[qType.type][diff.difficulty] = {
              ...cell,
              pointPerQuestion: Math.round(cell.pointPerQuestion * factor * 100) / 100
            };
          }
        }
      }
      return next;
    });
  };

  // Làm trống toàn bộ ma trận
  const handleResetMatrix = () => {
    const emptyGrid: MatrixGrid = {
      SINGLE_CHOICE: { BIET: { count: 0, pointPerQuestion: 0.5 }, HIEU: { count: 0, pointPerQuestion: 0.5 }, VAN_DUNG: { count: 0, pointPerQuestion: 0.5 } },
      MULTIPLE_CHOICE: { BIET: { count: 0, pointPerQuestion: 0.5 }, HIEU: { count: 0, pointPerQuestion: 0.5 }, VAN_DUNG: { count: 0, pointPerQuestion: 0.5 } },
      TRUE_FALSE: { BIET: { count: 0, pointPerQuestion: 1.0 }, HIEU: { count: 0, pointPerQuestion: 1.0 }, VAN_DUNG: { count: 0, pointPerQuestion: 1.0 } },
      FILL_IN_BLANK: { BIET: { count: 0, pointPerQuestion: 0.5 }, HIEU: { count: 0, pointPerQuestion: 0.5 }, VAN_DUNG: { count: 0, pointPerQuestion: 0.5 } },
      ESSAY: { BIET: { count: 0, pointPerQuestion: 1.0 }, HIEU: { count: 0, pointPerQuestion: 1.0 }, VAN_DUNG: { count: 0, pointPerQuestion: 1.0 } }
    };
    setMatrixGrid(emptyGrid);
    setSelectedPresetId('');
  };

  // Tự động trích xuất câu hỏi từ Ngân hàng theo Ma trận chi tiết
  const handleAutoExtractQuestions = () => {
    const candidateQuestions = questions.filter((q) => {
      if (q.gradeLevel !== testForm.gradeLevel) return false;
      if (lessonSelectionMode === 'CUSTOM' && selectedLessons.length > 0) {
        if (!q.lessonTitle || !selectedLessons.includes(q.lessonTitle)) return false;
      }
      return true;
    });

    const shuffleArray = <T,>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);

    const pickedIds: string[] = [];
    const pointsMap: Record<string, number> = {};
    const shortfalls: string[] = [];

    let totalRequested = 0;
    let totalExtracted = 0;

    // Duyệt qua từng ô ma trận (type x difficulty)
    for (const qType of QUESTION_TYPES) {
      for (const diff of DIFFICULTY_LEVELS) {
        const cell = matrixGrid[qType.type]?.[diff.difficulty];
        if (!cell || cell.count <= 0) continue;

        totalRequested += cell.count;

        // Lọc câu hỏi trong ngân hàng phù hợp đúng cả Dạng và Mức độ (và bài học đã chọn)
        const matchingQuestions = candidateQuestions.filter(
          (q) => q.type === qType.type && q.difficulty === diff.difficulty && !pickedIds.includes(q.id)
        );

        const shuffled = shuffleArray(matchingQuestions);
        const picked = shuffled.slice(0, cell.count);

        picked.forEach((q) => {
          pickedIds.push(q.id);
          pointsMap[q.id] = cell.pointPerQuestion;
        });

        totalExtracted += picked.length;

        if (picked.length < cell.count) {
          shortfalls.push(
            `Ô "${qType.shortLabel} - ${diff.shortLabel}" cần ${cell.count} câu nhưng kho chỉ có ${matchingQuestions.length} câu (thiếu ${cell.count - picked.length} câu)`
          );
        }
      }
    }

    setSelectedQuestionIds(pickedIds);
    setQuestionPointsMap(pointsMap);

    if (shortfalls.length > 0) {
      setShortfallWarning(
        `Cảnh báo thiếu câu hỏi: ${shortfalls.join('; ')}. Bạn có thể bổ sung câu hỏi vào Ngân hàng, mở rộng bài học hoặc chọn thêm thủ công.`
      );
    } else {
      setShortfallWarning('');
    }

    const lessonInfoText =
      lessonSelectionMode === 'CUSTOM' && selectedLessons.length > 0
        ? ` (${selectedLessons.length} bài học đã chọn)`
        : ' (toàn bộ chương trình)';

    setAutoPickMessage(
      `Đã tự động trích xuất thành công ${pickedIds.length} câu hỏi theo đúng ma trận thiết lập${lessonInfoText} (${matrixSummary.byDifficulty.BIET.count} Biết, ${matrixSummary.byDifficulty.HIEU.count} Hiểu, ${matrixSummary.byDifficulty.VAN_DUNG.count} Vận dụng)!`
    );
  };

  // Cập nhật điểm của từng câu hỏi riêng biệt
  const handleUpdateSingleQuestionPoint = (qId: string, point: number) => {
    const val = Math.max(0, point);
    setQuestionPointsMap((prev) => ({
      ...prev,
      [qId]: val
    }));
  };

  // Đổi câu hỏi ngẫu nhiên khác từ ngân hàng cùng dạng & mức độ
  const handleSwapQuestion = (currentQId: string) => {
    const currentQ = questions.find((q) => q.id === currentQId);
    if (!currentQ) return;

    const availableCandidates = questions.filter(
      (q) =>
        q.gradeLevel === currentQ.gradeLevel &&
        q.type === currentQ.type &&
        q.difficulty === currentQ.difficulty &&
        !selectedQuestionIds.includes(q.id) &&
        (lessonSelectionMode !== 'CUSTOM' || selectedLessons.length === 0 || (q.lessonTitle && selectedLessons.includes(q.lessonTitle)))
    );

    if (availableCandidates.length === 0) {
      alert(`Trong ngân hàng không còn câu hỏi nào khác có dạng "${currentQ.type}" và mức độ "${currentQ.difficulty}" để đổi!`);
      return;
    }

    const randomPick = availableCandidates[Math.floor(Math.random() * availableCandidates.length)];
    const currentPoint = questionPointsMap[currentQId] ?? 1.0;

    setSelectedQuestionIds((prev) => prev.map((id) => (id === currentQId ? randomPick.id : id)));
    setQuestionPointsMap((prev) => {
      const next = { ...prev };
      delete next[currentQId];
      next[randomPick.id] = currentPoint;
      return next;
    });
  };

  // Xóa câu hỏi khỏi đề
  const handleRemoveQuestion = (qId: string) => {
    setSelectedQuestionIds((prev) => prev.filter((id) => id !== qId));
    setQuestionPointsMap((prev) => {
      const next = { ...prev };
      delete next[qId];
      return next;
    });
  };

  // Thêm thủ công câu hỏi từ ngân hàng
  const handleAddQuestionFromPicker = (q: Question) => {
    if (selectedQuestionIds.includes(q.id)) return;

    // Lấy điểm mặc định theo ô ma trận tương ứng
    const cellPoint = matrixGrid[q.type]?.[q.difficulty]?.pointPerQuestion ?? 1.0;

    setSelectedQuestionIds((prev) => [...prev, q.id]);
    setQuestionPointsMap((prev) => ({
      ...prev,
      [q.id]: cellPoint
    }));
  };

  // Sinh các mã đề xáo trộn (101, 102, 103, 104)
  const generateVariants = (baseQuestionIds: string[], count: number): TestVariant[] => {
    const variants: TestVariant[] = [];
    const baseCodes = ['101', '102', '103', '104', '105'];

    for (let i = 0; i < count; i++) {
      const code = baseCodes[i] || `10${i + 1}`;
      const shuffledIds = [...baseQuestionIds].sort(() => Math.random() - 0.5);
      variants.push({
        code,
        questionIds: shuffledIds
      });
    }

    return variants;
  };

  // Tính tổng điểm thực tế của các câu hỏi được chọn
  const actualSelectedPoints = useMemo(() => {
    return selectedQuestionIds.reduce((sum, qId) => {
      return sum + (questionPointsMap[qId] ?? 0);
    }, 0);
  }, [selectedQuestionIds, questionPointsMap]);

  // Lưu đề thi
  const handleSaveTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedQuestionIds.length === 0) {
      setValidationError('Vui lòng chọn hoặc tự động trích xuất ít nhất một câu hỏi từ ngân hàng theo ma trận!');
      return;
    }
    setValidationError('');

    const variants = generateVariants(selectedQuestionIds, testForm.variantCount);

    // Tính tổng số câu Biết, Hiểu, Vận dụng từ danh sách câu hỏi thực tế được chọn
    const selectedQuestions = selectedQuestionIds
      .map((id) => questions.find((q) => q.id === id))
      .filter(Boolean) as Question[];

    const knowCount = selectedQuestions.filter((q) => q.difficulty === 'BIET').length;
    const understandCount = selectedQuestions.filter((q) => q.difficulty === 'HIEU').length;
    const applyCount = selectedQuestions.filter((q) => q.difficulty === 'VAN_DUNG').length;

    // Thống kê điểm theo mức độ
    const difficultyPoints: Record<QuestionDifficulty, { count: number; points: number }> = {
      BIET: { count: 0, points: 0 },
      HIEU: { count: 0, points: 0 },
      VAN_DUNG: { count: 0, points: 0 }
    };

    // Thống kê điểm theo dạng câu hỏi
    const typePoints: Record<QuestionType, { count: number; points: number }> = {
      SINGLE_CHOICE: { count: 0, points: 0 },
      MULTIPLE_CHOICE: { count: 0, points: 0 },
      TRUE_FALSE: { count: 0, points: 0 },
      FILL_IN_BLANK: { count: 0, points: 0 },
      ESSAY: { count: 0, points: 0 }
    };

    selectedQuestions.forEach((q) => {
      const pts = questionPointsMap[q.id] ?? 1.0;
      difficultyPoints[q.difficulty].count++;
      difficultyPoints[q.difficulty].points = Math.round((difficultyPoints[q.difficulty].points + pts) * 100) / 100;

      typePoints[q.type].count++;
      typePoints[q.type].points = Math.round((typePoints[q.type].points + pts) * 100) / 100;
    });

    const finalTotalPoints = Math.round(actualSelectedPoints * 100) / 100 || matrixSummary.totalPoints || 10;

    const newTest: Test = {
      id: `test-${Date.now()}`,
      title: testForm.title,
      gradeLevel: Number(testForm.gradeLevel),
      durationMinutes: Number(testForm.durationMinutes),
      totalQuestions: selectedQuestionIds.length,
      totalPoints: finalTotalPoints,
      matrix: {
        knowCount,
        understandCount,
        applyCount,
        selectedTopics: testForm.selectedTopics,
        selectedLessons: lessonSelectionMode === 'CUSTOM' && selectedLessons.length > 0 ? selectedLessons : undefined,
        grid: matrixGrid,
        difficultyPoints,
        typePoints,
        questionPointsMap
      },
      questionIds: selectedQuestionIds,
      questionPoints: questionPointsMap,
      variants,
      createdBy: currentUser.id,
      authorName: currentUser.fullName,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'READY'
    };

    LMSStorageService.addTest(newTest);
    refreshTests();
    setIsCreating(false);
    if (onTestCreated) onTestCreated(newTest);
  };

  const handleDeleteTest = (id: string) => {
    setDeleteTestId(id);
  };

  const confirmDeleteTest = () => {
    if (deleteTestId) {
      LMSStorageService.deleteTest(deleteTestId);
      refreshTests();
      setDeleteTestId(null);
    }
  };

  // Lọc câu hỏi trong modal chọn thủ công
  const filteredPickerQuestions = useMemo(() => {
    return questions.filter((q) => {
      if (q.gradeLevel !== testForm.gradeLevel) return false;
      if (pickerFilterType !== 'ALL' && q.type !== pickerFilterType) return false;
      if (pickerFilterDifficulty !== 'ALL' && q.difficulty !== pickerFilterDifficulty) return false;
      if (pickerFilterLesson !== 'ALL' && q.lessonTitle !== pickerFilterLesson) return false;
      if (pickerSearch) {
        const text = (q.content + ' ' + q.code + ' ' + q.lessonTitle).toLowerCase();
        if (!text.includes(pickerSearch.toLowerCase())) return false;
      }
      return true;
    });
  }, [questions, testForm.gradeLevel, pickerFilterType, pickerFilterDifficulty, pickerFilterLesson, pickerSearch]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Layers className="w-7 h-7 text-indigo-600" />
            <span>Tạo & Quản lý Đề kiểm tra</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Thiết lập ma trận 2 chiều chuẩn GDPT 2018: số câu, số điểm theo Mức độ nhận thức và Dạng câu hỏi
          </p>
        </div>
        {!isCreating && (
          <button
            type="button"
            onClick={() => {
              setIsCreating(true);
              setAutoPickMessage('');
              setShortfallWarning('');
              setSelectedQuestionIds([]);
              setQuestionPointsMap({});
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors self-start cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tạo đề thi mới theo Ma trận</span>
          </button>
        )}
      </div>

      {/* Test Creation Form */}
      {isCreating ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-7">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2.5">
              <Table className="w-5 h-5 text-indigo-600" />
              <span>Thiết lập Ma trận đề thi & Phân bổ điểm chi tiết</span>
            </h2>
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
            >
              Hủy bỏ
            </button>
          </div>

          <form onSubmit={handleSaveTest} className="space-y-7 text-xs">
            {/* Step 1: General Info */}
            <div className="space-y-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">1</span>
                <span>Thông tin chung về Đề kiểm tra</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Tên bài kiểm tra *</label>
                  <input
                    type="text"
                    required
                    value={testForm.title}
                    onChange={(e) => setTestForm({ ...testForm, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-800"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Khối lớp *</label>
                    <select
                      value={testForm.gradeLevel}
                      onChange={(e) => {
                        const newGrade = Number(e.target.value);
                        setTestForm({ ...testForm, gradeLevel: newGrade });
                        setSelectedLessons([]);
                        setLessonSelectionMode('ALL');
                        setAutoPickMessage('');
                        setShortfallWarning('');
                        setSelectedQuestionIds([]);
                        setQuestionPointsMap({});
                      }}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-800 bg-white"
                    >
                      <option value={6}>Khối 6</option>
                      <option value={7}>Khối 7</option>
                      <option value={8}>Khối 8</option>
                      <option value={9}>Khối 9</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Thời gian (phút)</label>
                    <input
                      type="number"
                      min="5"
                      max="120"
                      value={testForm.durationMinutes}
                      onChange={(e) => setTestForm({ ...testForm, durationMinutes: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Số mã đề sinh</label>
                    <select
                      value={testForm.variantCount}
                      onChange={(e) => setTestForm({ ...testForm, variantCount: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-800 bg-white"
                    >
                      <option value={1}>1 mã (101)</option>
                      <option value={2}>2 mã (101, 102)</option>
                      <option value={4}>4 mã (101-104)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Chọn bài học để tạo đề thi */}
            <div className="space-y-3.5 border-t border-slate-100 pt-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">2</span>
                    <BookOpen className="w-4 h-4 text-indigo-600" />
                    <span>Chọn bài học để tạo đề thi (Khối {testForm.gradeLevel})</span>
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Giới hạn phạm vi câu hỏi theo bài học cần kiểm tra. Khi trích xuất, hệ thống sẽ lọc câu hỏi từ các bài học được chọn để đáp ứng Ma trận.
                  </p>
                </div>

                {/* Chế độ chọn bài học */}
                <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl self-start">
                  <button
                    type="button"
                    onClick={() => {
                      setLessonSelectionMode('ALL');
                      setSelectedLessons([]);
                      setAutoPickMessage('');
                      setShortfallWarning('');
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      lessonSelectionMode === 'ALL'
                        ? 'bg-white text-indigo-700 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Tất cả bài học ({availableLessons.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLessonSelectionMode('CUSTOM');
                      if (selectedLessons.length === 0 && availableLessons.length > 0) {
                        setSelectedLessons(availableLessons.slice(0, 3));
                      }
                      setAutoPickMessage('');
                      setShortfallWarning('');
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      lessonSelectionMode === 'CUSTOM'
                        ? 'bg-white text-indigo-700 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Chọn bài học cụ thể {selectedLessons.length > 0 ? `(${selectedLessons.length})` : ''}
                  </button>
                </div>
              </div>

              {lessonSelectionMode === 'CUSTOM' ? (
                <div className="bg-slate-50/80 border border-slate-200 rounded-xl p-4 space-y-3">
                  {/* Toolbar phụ: Chọn tất cả, Bỏ chọn, Ô tìm kiếm */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={() => setSelectedLessons([...availableLessons])}
                        className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 bg-white px-2.5 py-1 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                      >
                        ✓ Chọn tất cả ({availableLessons.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedLessons([])}
                        className="text-[11px] font-medium text-slate-500 hover:text-slate-800 bg-white px-2.5 py-1 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                      >
                        ✕ Bỏ chọn tất cả
                      </button>
                      <span className="text-[11px] text-slate-500 font-medium">
                        Đã chọn: <strong className="text-indigo-700">{selectedLessons.length}</strong> / {availableLessons.length} bài
                      </span>
                    </div>

                    {/* Ô tìm kiếm bài học */}
                    <div className="relative w-full sm:w-64">
                      <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Tìm bài học..."
                        value={lessonSearchQuery}
                        onChange={(e) => setLessonSearchQuery(e.target.value)}
                        className="w-full pl-7 pr-2.5 py-1 rounded-lg border border-slate-200 bg-white text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  {/* Lưới danh sách bài học */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-56 overflow-y-auto pr-1">
                    {filteredLessons.map((lessonTitle) => {
                      const isSelected = selectedLessons.includes(lessonTitle);
                      const qCount = questionCountByLesson[lessonTitle] || 0;

                      return (
                        <div
                          key={lessonTitle}
                          onClick={() => {
                            if (isSelected) {
                              setSelectedLessons(selectedLessons.filter((l) => l !== lessonTitle));
                            } else {
                              setSelectedLessons([...selectedLessons, lessonTitle]);
                            }
                          }}
                          className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-all select-none ${
                            isSelected
                              ? 'bg-indigo-50/70 border-indigo-300 text-indigo-950 font-medium shadow-2xs'
                              : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}} // handled by div click
                            className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 pointer-events-none"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="line-clamp-2 leading-snug">{lessonTitle}</div>
                            <div className="flex items-center gap-1.5 mt-1">
                              <span
                                className={`inline-block px-1.5 py-0.2 rounded text-[10px] font-medium ${
                                  qCount > 0 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-400'
                                }`}
                              >
                                {qCount} câu trong kho
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-[11px]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    Phạm vi kiểm tra: <strong>Toàn bộ {availableLessons.length} bài học</strong> trong chương trình Tin học {testForm.gradeLevel}.
                  </span>
                </div>
              )}
            </div>

            {/* Step 3: Matrix Config - Mức độ & Dạng câu hỏi */}
            <div className="space-y-4 border-t border-slate-100 pt-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">3</span>
                    <span>Ma trận đề kiểm tra (Mức độ × Dạng câu hỏi)</span>
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Thiết lập số câu và số điểm cho từng ô giao nhau giữa Dạng câu hỏi và Mức độ nhận thức
                  </p>
                </div>

                {/* Quick Presets Selector */}
                <div className="flex items-center gap-2 flex-wrap self-start">
                  <span className="text-slate-500 font-medium text-xs flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Mẫu ma trận:</span>
                  </span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {MATRIX_PRESETS.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => handleApplyPreset(preset.id)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer border ${
                          selectedPresetId === preset.id
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                            : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
                        }`}
                        title={preset.description}
                      >
                        {preset.badge}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Real-time Summary Cards & Score Balance Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200/90">
                <div className="bg-white p-3 rounded-lg border border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="text-[11px] text-slate-500 font-medium">Tổng số câu hỏi</div>
                    <div className="text-lg font-bold text-slate-900">
                      {matrixSummary.totalQuestions} <span className="text-xs font-normal text-slate-500">câu</span>
                    </div>
                  </div>
                  <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                    <FileText className="w-5 h-5" />
                  </div>
                </div>

                <div className="bg-white p-3 rounded-lg border border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="text-[11px] text-slate-500 font-medium">Tổng điểm ma trận</div>
                    <div className="text-lg font-bold flex items-center gap-1.5">
                      <span className={matrixSummary.totalPoints === 10 ? 'text-emerald-700' : 'text-amber-600'}>
                        {matrixSummary.totalPoints} / 10.0
                      </span>
                      <span className="text-xs font-normal text-slate-500">điểm</span>
                    </div>
                  </div>
                  <div>
                    {matrixSummary.totalPoints === 10 ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        <Check className="w-3 h-3" /> Chuẩn 10đ
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleBalancePointsTo10}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 text-[10px] font-bold cursor-pointer transition-colors"
                        title="Tự động chuẩn hóa tổng điểm về 10.0"
                      >
                        <Calculator className="w-3 h-3" /> Cân về 10đ
                      </button>
                    )}
                  </div>
                </div>

                <div className="bg-white p-3 rounded-lg border border-slate-200">
                  <div className="text-[11px] text-slate-500 font-medium mb-1">Tỷ lệ Mức độ (Biết - Hiểu - VD)</div>
                  <div className="flex items-center gap-2 text-xs font-bold">
                    <span className="text-emerald-700">{matrixSummary.byDifficulty.BIET.percent}%</span>
                    <span className="text-slate-300">/</span>
                    <span className="text-sky-700">{matrixSummary.byDifficulty.HIEU.percent}%</span>
                    <span className="text-slate-300">/</span>
                    <span className="text-amber-700">{matrixSummary.byDifficulty.VAN_DUNG.percent}%</span>
                  </div>
                  {/* Visual 3-color Progress Bar */}
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden flex mt-1.5">
                    <div
                      style={{ width: `${matrixSummary.byDifficulty.BIET.percent}%` }}
                      className="bg-emerald-500 h-full"
                      title={`Biết: ${matrixSummary.byDifficulty.BIET.points}đ (${matrixSummary.byDifficulty.BIET.percent}%)`}
                    />
                    <div
                      style={{ width: `${matrixSummary.byDifficulty.HIEU.percent}%` }}
                      className="bg-sky-500 h-full"
                      title={`Hiểu: ${matrixSummary.byDifficulty.HIEU.points}đ (${matrixSummary.byDifficulty.HIEU.percent}%)`}
                    />
                    <div
                      style={{ width: `${matrixSummary.byDifficulty.VAN_DUNG.percent}%` }}
                      className="bg-amber-500 h-full"
                      title={`Vận dụng: ${matrixSummary.byDifficulty.VAN_DUNG.points}đ (${matrixSummary.byDifficulty.VAN_DUNG.percent}%)`}
                    />
                  </div>
                </div>
              </div>

              {/* 2D Interactive Matrix Table (Dạng câu hỏi x Mức độ) */}
              <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-2xs bg-white">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/90 text-slate-700">
                      <th className="py-2.5 px-3 font-bold text-xs w-48">Dạng câu hỏi</th>
                      {DIFFICULTY_LEVELS.map((diff) => (
                        <th key={diff.difficulty} className={`py-2.5 px-3 font-bold text-xs ${diff.headerBg} border-x border-slate-200/80 text-center`}>
                          <div className="flex items-center justify-center gap-1.5">
                            <span>{diff.label}</span>
                          </div>
                        </th>
                      ))}
                      <th className="py-2.5 px-3 font-bold text-xs bg-indigo-50/70 text-indigo-900 text-center w-36">
                        Tổng theo Dạng
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {QUESTION_TYPES.map((qType) => {
                      const typeTotal = matrixSummary.byType[qType.type];
                      return (
                        <tr key={qType.type} className="hover:bg-slate-50/60 transition-colors">
                          {/* Row Header: Question Type */}
                          <td className="py-3 px-3 font-semibold text-slate-800 bg-slate-50/40">
                            <div className="flex flex-col">
                              <span className="font-bold text-slate-900">{qType.label}</span>
                              <span className="text-[10px] text-slate-400 font-normal">
                                {qType.type === 'SINGLE_CHOICE'
                                  ? '4 phương án A,B,C,D'
                                  : qType.type === 'TRUE_FALSE'
                                  ? 'Phần Đúng/Sai 4 ý'
                                  : qType.type === 'FILL_IN_BLANK'
                                  ? 'Điền từ / Số / Khái niệm'
                                  : qType.type === 'ESSAY'
                                  ? 'Tự luận tự chấm điểm'
                                  : 'Chọn các phương án đúng'}
                              </span>
                            </div>
                          </td>

                          {/* 3 Difficulty Columns */}
                          {DIFFICULTY_LEVELS.map((diff) => {
                            const cell = matrixGrid[qType.type]?.[diff.difficulty] || { count: 0, pointPerQuestion: 0 };
                            const cellPoints = Math.round(cell.count * cell.pointPerQuestion * 100) / 100;
                            const availableInBank = bankAvailability[`${qType.type}_${diff.difficulty}`] || 0;
                            const isShort = cell.count > availableInBank;

                            return (
                              <td
                                key={diff.difficulty}
                                className={`py-2 px-2.5 border-x border-slate-200/60 text-center ${
                                  cell.count > 0 ? 'bg-indigo-50/15' : ''
                                }`}
                              >
                                <div className="flex flex-col items-center gap-1.5 bg-slate-50/60 p-2 rounded-lg border border-slate-200/60">
                                  {/* Inputs Row: Số câu & Điểm/câu */}
                                  <div className="flex items-center gap-1">
                                    <div className="flex flex-col items-center">
                                      <input
                                        type="number"
                                        min="0"
                                        max="50"
                                        value={cell.count}
                                        onChange={(e) =>
                                          handleUpdateMatrixCell(
                                            qType.type,
                                            diff.difficulty,
                                            'count',
                                            Number(e.target.value)
                                          )
                                        }
                                        className="w-14 px-1.5 py-1 text-center font-bold text-slate-900 bg-white rounded border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                        title="Số câu hỏi ở ô ma trận này"
                                      />
                                      <span className="text-[9px] text-slate-400 mt-0.5">câu</span>
                                    </div>

                                    <span className="text-slate-400 font-bold">×</span>

                                    <div className="flex flex-col items-center">
                                      <input
                                        type="number"
                                        min="0"
                                        max="10"
                                        step="0.25"
                                        value={cell.pointPerQuestion}
                                        onChange={(e) =>
                                          handleUpdateMatrixCell(
                                            qType.type,
                                            diff.difficulty,
                                            'pointPerQuestion',
                                            Number(e.target.value)
                                          )
                                        }
                                        className="w-14 px-1.5 py-1 text-center font-bold text-indigo-700 bg-white rounded border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                        title="Điểm số cho mỗi câu hỏi ở ô này"
                                      />
                                      <span className="text-[9px] text-slate-400 mt-0.5">đ/câu</span>
                                    </div>
                                  </div>

                                  {/* Subtotal & Bank count badge */}
                                  <div className="flex items-center justify-between w-full px-1 text-[10px]">
                                    <span
                                      className={`font-semibold ${
                                        cellPoints > 0 ? 'text-indigo-700' : 'text-slate-400'
                                      }`}
                                    >
                                      = {cellPoints}đ
                                    </span>

                                    <span
                                      className={`px-1 py-0.2 rounded text-[9px] font-medium ${
                                        isShort
                                          ? 'bg-rose-100 text-rose-800'
                                          : availableInBank > 0
                                          ? 'bg-emerald-50 text-emerald-700'
                                          : 'text-slate-400'
                                      }`}
                                      title={`Kho môn Khối ${testForm.gradeLevel} hiện có ${availableInBank} câu dạng này`}
                                    >
                                      Kho: {availableInBank}
                                    </span>
                                  </div>
                                </div>
                              </td>
                            );
                          })}

                          {/* Row Total: Summary per Type */}
                          <td className="py-2.5 px-3 text-center bg-indigo-50/30">
                            <div className="font-bold text-slate-900">{typeTotal.count} câu</div>
                            <div className="font-semibold text-indigo-700 text-[11px]">
                              {typeTotal.points} điểm
                            </div>
                          </td>
                        </tr>
                      );
                    })}

                    {/* Bottom Summary Row: Summary per Difficulty */}
                    <tr className="bg-slate-100/80 font-bold border-t-2 border-slate-300 text-slate-900">
                      <td className="py-3 px-3">
                        <div className="text-slate-800 font-extrabold uppercase text-[11px]">
                          Tổng cộng Mức độ
                        </div>
                      </td>
                      {DIFFICULTY_LEVELS.map((diff) => {
                        const diffSummary = matrixSummary.byDifficulty[diff.difficulty];
                        return (
                          <td key={diff.difficulty} className="py-3 px-2 text-center border-x border-slate-200">
                            <div className="text-sm font-extrabold text-slate-900">
                              {diffSummary.count} câu
                            </div>
                            <div className={`text-xs font-bold ${diff.badgeText}`}>
                              {diffSummary.points} điểm ({diffSummary.percent}%)
                            </div>
                          </td>
                        );
                      })}
                      {/* Grand Total Cell */}
                      <td className="py-3 px-3 text-center bg-indigo-100/70 border-l border-slate-200">
                        <div className="text-sm font-extrabold text-indigo-950">
                          {matrixSummary.totalQuestions} câu
                        </div>
                        <div
                          className={`text-xs font-extrabold ${
                            matrixSummary.totalPoints === 10 ? 'text-emerald-700' : 'text-amber-700'
                          }`}
                        >
                          {matrixSummary.totalPoints} / 10.0 đ
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Action Toolbar for Matrix */}
              <div className="flex items-center justify-between gap-3 flex-wrap pt-1">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleBalancePointsTo10}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs transition-colors cursor-pointer"
                  >
                    <Calculator className="w-3.5 h-3.5" />
                    <span>Cân đối điểm về 10.0</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleResetMatrix}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs transition-colors cursor-pointer"
                  >
                    <span>Làm trống</span>
                  </button>
                </div>

                <div className="text-slate-500 text-[11px]">
                  💡 <em>Gợi ý: Nhấn "Tự động trích xuất theo ma trận" để hệ thống tự lọc câu hỏi khớp từng ô.</em>
                </div>
              </div>
            </div>

            {/* Step 4: Question Extraction & Selection */}
            <div className="space-y-4 border-t border-slate-100 pt-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">4</span>
                    <span>Bộ câu hỏi được chọn theo Ma trận ({selectedQuestionIds.length} câu)</span>
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Tổng điểm thực tế: <strong className="text-indigo-600">{actualSelectedPoints} / 10.0 điểm</strong>. Bạn có thể tinh chỉnh điểm từng câu bên dưới.
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => setShowQuestionPickerModal(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg shadow-2xs transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Chọn thêm từ ngân hàng</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleAutoExtractQuestions}
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors cursor-pointer"
                  >
                    <Shuffle className="w-3.5 h-3.5" />
                    <span>Tự động trích xuất theo Ma trận</span>
                  </button>
                </div>
              </div>

              {/* Extraction messages */}
              {autoPickMessage && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{autoPickMessage}</span>
                </div>
              )}

              {shortfallWarning && (
                <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>{shortfallWarning}</span>
                </div>
              )}

              {/* Selected Questions List with individual point setting */}
              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs bg-white">
                <div className="bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-slate-700 flex items-center justify-between border-b border-slate-200">
                  <span>Danh sách câu hỏi trong đề ({selectedQuestionIds.length} câu)</span>
                  <div className="flex items-center gap-3">
                    <span>
                      Tổng điểm thực: <strong className="text-indigo-600">{actualSelectedPoints}</strong> điểm
                    </span>
                  </div>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {selectedQuestionIds.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 space-y-2">
                      <Table className="w-8 h-8 mx-auto text-slate-300" />
                      <div>Chưa có câu hỏi nào được chọn.</div>
                      <div className="text-[11px]">
                        Nhấn nút <strong>"Tự động trích xuất theo Ma trận"</strong> để hệ thống tự động bốc câu hỏi từ Ngân hàng.
                      </div>
                    </div>
                  ) : (
                    selectedQuestionIds.map((qId, idx) => {
                      const q = questions.find((item) => item.id === qId);
                      if (!q) return null;

                      const qPts = questionPointsMap[q.id] ?? 1.0;
                      const typeObj = QUESTION_TYPES.find((t) => t.type === q.type);
                      const diffObj = DIFFICULTY_LEVELS.find((d) => d.difficulty === q.difficulty);

                      return (
                        <div
                          key={q.id}
                          className="p-3 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 transition-colors"
                        >
                          {/* Left: Index, Code, Content & Badges */}
                          <div className="flex items-start gap-2.5 flex-1 min-w-0">
                            <span className="font-bold text-slate-400 w-6 pt-0.5 shrink-0">
                              {idx + 1}.
                            </span>

                            <div className="space-y-1 min-w-0 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-mono text-[11px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-1.5 py-0.2 rounded">
                                  {q.code}
                                </span>

                                <span
                                  className={`text-[10px] font-semibold px-2 py-0.2 rounded border ${
                                    typeObj?.badgeBg || 'bg-slate-50'
                                  } ${typeObj?.badgeText || 'text-slate-700'} ${
                                    typeObj?.badgeBorder || 'border-slate-200'
                                  }`}
                                >
                                  {typeObj?.shortLabel || q.type}
                                </span>

                                <span
                                  className={`text-[10px] font-semibold px-2 py-0.2 rounded border ${
                                    diffObj?.badgeBg || 'bg-slate-50'
                                  } ${diffObj?.badgeText || 'text-slate-700'} ${
                                    diffObj?.badgeBorder || 'border-slate-200'
                                  }`}
                                >
                                  {diffObj?.shortLabel || q.difficulty}
                                </span>
                              </div>

                              <p className="font-medium text-slate-800 line-clamp-2 leading-relaxed">
                                {q.content}
                              </p>
                            </div>
                          </div>

                          {/* Right: Point Input & Controls */}
                          <div className="flex items-center gap-2.5 shrink-0 sm:self-center ml-8 sm:ml-0">
                            {/* Điểm cho câu hỏi này */}
                            <div className="flex items-center gap-1.5 bg-indigo-50/70 border border-indigo-200 px-2 py-1 rounded-lg">
                              <label className="text-[11px] font-semibold text-indigo-900">Điểm:</label>
                              <input
                                type="number"
                                min="0"
                                max="10"
                                step="0.25"
                                value={qPts}
                                onChange={(e) => handleUpdateSingleQuestionPoint(q.id, Number(e.target.value))}
                                className="w-14 px-1.5 py-0.5 text-center font-bold text-indigo-700 bg-white rounded border border-indigo-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                title="Chỉnh điểm riêng cho câu hỏi này"
                              />
                            </div>

                            {/* Đổi câu khác cùng dạng & mức */}
                            <button
                              type="button"
                              onClick={() => handleSwapQuestion(q.id)}
                              className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                              title="Đổi câu hỏi khác cùng Dạng & Mức độ"
                            >
                              <RefreshCw className="w-3.5 h-3.5" />
                            </button>

                            {/* Bỏ câu */}
                            <button
                              type="button"
                              onClick={() => handleRemoveQuestion(q.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Bỏ câu này khỏi đề"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* Validation Error */}
            {validationError && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            {/* Actions Form Bottom */}
            <div className="flex items-center justify-between gap-3 pt-5 border-t border-slate-100 flex-wrap">
              <div className="text-xs text-slate-500">
                Sinh tự động <strong>{testForm.variantCount} mã đề</strong> (101, 102...) với thứ tự câu hỏi đảo ngẫu nhiên.
              </div>

              <div className="flex items-center gap-3 ml-auto">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer font-medium"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Lưu & Hoàn tất Đề thi ({selectedQuestionIds.length} câu)</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      ) : (
        /* Test List Cards */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tests.length === 0 ? (
            <div className="col-span-full p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs space-y-3">
              <Layers className="w-10 h-10 mx-auto text-slate-300" />
              <div className="font-semibold text-slate-600 text-sm">Chưa có đề kiểm tra nào được tạo</div>
              <div>Bấm nút "Tạo đề thi mới theo Ma trận" ở góc trên để bắt đầu soạn đề.</div>
            </div>
          ) : (
            tests.map((test) => {
              const knowCount = test.matrix?.knowCount ?? 0;
              const understandCount = test.matrix?.understandCount ?? 0;
              const applyCount = test.matrix?.applyCount ?? 0;

              return (
                <div key={test.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4 hover:border-indigo-200 transition-all">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                          Khối {test.gradeLevel}
                        </span>
                        <span className="text-xs text-slate-400">·</span>
                        <span className="text-xs text-slate-500 font-medium">{test.durationMinutes} phút</span>
                        <span className="text-xs text-slate-400">·</span>
                        <span className="text-xs text-slate-500 font-medium">{test.totalQuestions} câu</span>
                        <span className="text-xs text-slate-400">·</span>
                        <span className="text-xs font-bold text-indigo-600">{test.totalPoints} điểm</span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-sm leading-snug">{test.title}</h3>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => setPreviewTest(test)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                        title="Xem chi tiết & Ma trận đề thi"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteTest(test.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Xóa đề"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Matrix summary row */}
                  <div className="grid grid-cols-3 gap-2 text-xs py-2 px-3 bg-slate-50 rounded-xl border border-slate-200/80">
                    <div className="text-center">
                      <div className="text-[11px] text-slate-500 font-medium">Nhận biết</div>
                      <div className="font-bold text-emerald-700">
                        {knowCount} câu
                        {test.matrix?.difficultyPoints?.BIET && (
                          <span className="text-[10px] text-slate-400 font-normal ml-1">
                            ({test.matrix.difficultyPoints.BIET.points}đ)
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-center border-x border-slate-200">
                      <div className="text-[11px] text-slate-500 font-medium">Thông hiểu</div>
                      <div className="font-bold text-sky-700">
                        {understandCount} câu
                        {test.matrix?.difficultyPoints?.HIEU && (
                          <span className="text-[10px] text-slate-400 font-normal ml-1">
                            ({test.matrix.difficultyPoints.HIEU.points}đ)
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-[11px] text-slate-500 font-medium">Vận dụng</div>
                      <div className="font-bold text-amber-700">
                        {applyCount} câu
                        {test.matrix?.difficultyPoints?.VAN_DUNG && (
                          <span className="text-[10px] text-slate-400 font-normal ml-1">
                            ({test.matrix.difficultyPoints.VAN_DUNG.points}đ)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Selected Lessons badge in test card */}
                  {test.matrix?.selectedLessons && test.matrix.selectedLessons.length > 0 && (
                    <div className="flex items-center gap-1.5 text-[11px] text-indigo-700 bg-indigo-50/70 border border-indigo-100 px-2.5 py-1 rounded-lg">
                      <BookOpen className="w-3.5 h-3.5 shrink-0 text-indigo-600" />
                      <span className="font-semibold truncate">
                        {test.matrix.selectedLessons.length === 1
                          ? test.matrix.selectedLessons[0]
                          : `${test.matrix.selectedLessons.length} bài học: ${test.matrix.selectedLessons.slice(0, 2).join(', ')}${test.matrix.selectedLessons.length > 2 ? '...' : ''}`}
                      </span>
                    </div>
                  )}

                  {/* Variants pills */}
                  <div className="flex items-center justify-between text-xs pt-1 flex-wrap gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-500 text-[11px]">Mã đề:</span>
                      {test.variants.map((v) => (
                        <span
                          key={v.code}
                          className="font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 text-[11px]"
                        >
                          {v.code}
                        </span>
                      ))}
                    </div>
                    <span className="text-[11px] text-slate-400">Tạo bởi: {test.authorName}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Manual Question Picker Modal */}
      {showQuestionPickerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-3xl p-6 animate-in fade-in zoom-in-95 max-h-[90vh] flex flex-col space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Chọn câu hỏi từ Ngân hàng (Khối {testForm.gradeLevel})</h3>
                <p className="text-xs text-slate-500">
                  Chọn bổ sung câu hỏi vào đề thi. Điểm số sẽ tự động tính theo ma trận hoặc bạn có thể chỉnh lại.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowQuestionPickerModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter toolbar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm nội dung, mã câu..."
                  value={pickerSearch}
                  onChange={(e) => setPickerSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <select
                  value={pickerFilterLesson}
                  onChange={(e) => setPickerFilterLesson(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white"
                >
                  <option value="ALL">Tất cả Bài học ({availableLessons.length})</option>
                  {availableLessons.map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>

              <div>
                <select
                  value={pickerFilterType}
                  onChange={(e) => setPickerFilterType(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white"
                >
                  <option value="ALL">Tất cả Dạng câu hỏi</option>
                  {QUESTION_TYPES.map((t) => (
                    <option key={t.type} value={t.type}>{t.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <select
                  value={pickerFilterDifficulty}
                  onChange={(e) => setPickerFilterDifficulty(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white"
                >
                  <option value="ALL">Tất cả Mức độ</option>
                  {DIFFICULTY_LEVELS.map((d) => (
                    <option key={d.difficulty} value={d.difficulty}>{d.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Question List */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 border border-slate-200 rounded-xl max-h-96">
              {filteredPickerQuestions.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  Không tìm thấy câu hỏi phù hợp với bộ lọc.
                </div>
              ) : (
                filteredPickerQuestions.map((q) => {
                  const isAlreadySelected = selectedQuestionIds.includes(q.id);
                  const typeObj = QUESTION_TYPES.find((t) => t.type === q.type);
                  const diffObj = DIFFICULTY_LEVELS.find((d) => d.difficulty === q.difficulty);

                  return (
                    <div
                      key={q.id}
                      className={`p-3 text-xs flex items-center justify-between gap-3 ${
                        isAlreadySelected ? 'bg-indigo-50/40' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-[10px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-1.5 py-0.2 rounded">
                            {q.code}
                          </span>
                          <span className={`text-[10px] font-medium px-1.5 py-0.2 rounded border ${typeObj?.badgeBg || 'bg-slate-50'} ${typeObj?.badgeText || 'text-slate-700'}`}>
                            {typeObj?.shortLabel || q.type}
                          </span>
                          <span className={`text-[10px] font-medium px-1.5 py-0.2 rounded border ${diffObj?.badgeBg || 'bg-slate-50'} ${diffObj?.badgeText || 'text-slate-700'}`}>
                            {diffObj?.shortLabel || q.difficulty}
                          </span>
                          {q.lessonTitle && (
                            <span className="text-[10px] text-indigo-700 bg-indigo-50 border border-indigo-100 px-1.5 py-0.2 rounded font-medium">
                              {q.lessonTitle}
                            </span>
                          )}
                          <span className="text-[10px] text-slate-400 truncate">
                            {q.topic}
                          </span>
                        </div>
                        <p className="text-slate-800 line-clamp-2">{q.content}</p>
                      </div>

                      <button
                        type="button"
                        disabled={isAlreadySelected}
                        onClick={() => handleAddQuestionFromPicker(q)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 cursor-pointer transition-colors ${
                          isAlreadySelected
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-2xs'
                        }`}
                      >
                        {isAlreadySelected ? 'Đã trong đề' : '+ Thêm vào đề'}
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowQuestionPickerModal(false)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 cursor-pointer"
              >
                Đóng (Đã chọn {selectedQuestionIds.length} câu)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Test Preview Modal */}
      {previewTest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-3xl p-6 sm:p-7 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-600" />
                  <span>{previewTest.title}</span>
                </h3>
                <div className="text-xs text-slate-500 mt-1 flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-semibold border border-indigo-100">
                    Khối {previewTest.gradeLevel}
                  </span>
                  <span>·</span>
                  <span>{previewTest.durationMinutes} phút</span>
                  <span>·</span>
                  <span>{previewTest.totalQuestions} câu hỏi</span>
                  <span>·</span>
                  <span className="font-bold text-indigo-700">Thang {previewTest.totalPoints} điểm</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPreviewTest(null)}
                className="text-slate-400 hover:text-slate-700 font-bold p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            {/* Selected lessons display in preview */}
            {previewTest.matrix?.selectedLessons && previewTest.matrix.selectedLessons.length > 0 && (
              <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-100 text-xs space-y-1.5">
                <div className="font-bold flex items-center gap-1.5 text-indigo-900">
                  <BookOpen className="w-4 h-4 text-indigo-600" />
                  <span>Phạm vi bài học kiểm tra ({previewTest.matrix.selectedLessons.length} bài):</span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {previewTest.matrix.selectedLessons.map((les) => (
                    <span key={les} className="px-2.5 py-1 rounded-lg bg-white border border-indigo-200 text-[11px] font-semibold text-indigo-800 shadow-2xs">
                      {les}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Matrix Breakdown Summary Table */}
            <div className="space-y-2">
              <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Table className="w-4 h-4 text-indigo-600" />
                <span>Bảng Ma trận đề thi chi tiết:</span>
              </h4>

              <div className="grid grid-cols-3 gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-center">
                  <span className="text-[11px] text-slate-500 font-medium">Nhận biết</span>
                  <div className="text-base font-extrabold text-emerald-700 mt-0.5">
                    {previewTest.matrix.knowCount} câu
                  </div>
                  {previewTest.matrix.difficultyPoints?.BIET && (
                    <div className="text-[11px] text-slate-600 font-semibold">
                      {previewTest.matrix.difficultyPoints.BIET.points} điểm
                    </div>
                  )}
                </div>

                <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-center">
                  <span className="text-[11px] text-slate-500 font-medium">Thông hiểu</span>
                  <div className="text-base font-extrabold text-sky-700 mt-0.5">
                    {previewTest.matrix.understandCount} câu
                  </div>
                  {previewTest.matrix.difficultyPoints?.HIEU && (
                    <div className="text-[11px] text-slate-600 font-semibold">
                      {previewTest.matrix.difficultyPoints.HIEU.points} điểm
                    </div>
                  )}
                </div>

                <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-center">
                  <span className="text-[11px] text-slate-500 font-medium">Vận dụng</span>
                  <div className="text-base font-extrabold text-amber-700 mt-0.5">
                    {previewTest.matrix.applyCount} câu
                  </div>
                  {previewTest.matrix.difficultyPoints?.VAN_DUNG && (
                    <div className="text-[11px] text-slate-600 font-semibold">
                      {previewTest.matrix.difficultyPoints.VAN_DUNG.points} điểm
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Questions List */}
            <div className="space-y-3">
              <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                Nội dung đề thi (Mã đề {previewTest.variants[0]?.code || '101'}):
              </h4>

              <div className="space-y-3">
                {previewTest.questionIds.map((qId, idx) => {
                  const q = questions.find((item) => item.id === qId);
                  if (!q) return null;

                  const qPts =
                    previewTest.questionPoints?.[q.id] ??
                    previewTest.matrix?.questionPointsMap?.[q.id] ??
                    (previewTest.matrix?.grid && previewTest.matrix.grid[q.type]?.[q.difficulty]?.pointPerQuestion) ??
                    Math.round((previewTest.totalPoints / previewTest.totalQuestions) * 100) / 100;

                  const typeObj = QUESTION_TYPES.find((t) => t.type === q.type);
                  const diffObj = DIFFICULTY_LEVELS.find((d) => d.difficulty === q.difficulty);

                  return (
                    <div key={q.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">
                            Câu {idx + 1}.
                          </span>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${diffObj?.badgeBg || 'bg-slate-50'} ${diffObj?.badgeText || 'text-slate-700'}`}>
                            {diffObj?.shortLabel || q.difficulty}
                          </span>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${typeObj?.badgeBg || 'bg-slate-50'} ${typeObj?.badgeText || 'text-slate-700'}`}>
                            {typeObj?.shortLabel || q.type}
                          </span>
                          <span className="font-mono text-[10px] text-slate-500">
                            {q.code}
                          </span>
                          {q.lessonTitle && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                              {q.lessonTitle}
                            </span>
                          )}
                        </div>

                        <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-bold text-xs border border-indigo-200">
                          {qPts} điểm
                        </span>
                      </div>

                      <div className="text-slate-800 font-medium leading-relaxed">{q.content}</div>

                      {q.options && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                          {q.options.map((opt, oIdx) => (
                            <div
                              key={opt.id}
                              className={`p-2 rounded-lg text-[11px] border ${
                                opt.isCorrect
                                  ? 'bg-emerald-50 text-emerald-900 border-emerald-200 font-semibold'
                                  : 'bg-white text-slate-700 border-slate-200'
                              }`}
                            >
                              <strong>{String.fromCharCode(65 + oIdx)}.</strong> {opt.text}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="text-right pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setPreviewTest(null)}
                className="px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl cursor-pointer"
              >
                Đóng xem trước
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Test Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteTestId)}
        title="Xóa đề kiểm tra"
        message="Bạn có chắc chắn muốn xóa đề kiểm tra này khỏi hệ thống? Thao tác này không thể hoàn tác."
        confirmLabel="Xóa đề thi"
        cancelLabel="Hủy bỏ"
        isDanger={true}
        onConfirm={confirmDeleteTest}
        onCancel={() => setDeleteTestId(null)}
      />
    </div>
  );
};
