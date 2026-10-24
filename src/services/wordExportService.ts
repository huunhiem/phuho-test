import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  BorderStyle,
  HeightRule
} from 'docx';
import { Test, Question, OptionItem } from '../types';

export interface WordExportOptions {
  mode: 'STUDENT' | 'TEACHER' | 'BOTH'; // STUDENT: Đề phát học sinh; TEACHER: Đề kèm đáp án & HD chấm; BOTH: Đề thi + Hướng dẫn chấm ở trang cuối
  variantCode?: string; // 'ALL' hoặc mã đề cụ thể '101', '102'...
  schoolName?: string;
  departmentName?: string;
  districtName?: string;
  academicYear?: string;
  includeMatrix?: boolean;
  includeAnswerSheet?: boolean;
  includeExplanation?: boolean;
}

const FONT_FAMILY = 'Times New Roman';
const NO_BORDER = {
  top: { style: BorderStyle.NONE, size: 0, color: 'auto' },
  bottom: { style: BorderStyle.NONE, size: 0, color: 'auto' },
  left: { style: BorderStyle.NONE, size: 0, color: 'auto' },
  right: { style: BorderStyle.NONE, size: 0, color: 'auto' }
};

const THIN_BORDER = {
  top: { style: BorderStyle.SINGLE, size: 4, color: '888888' },
  bottom: { style: BorderStyle.SINGLE, size: 4, color: '888888' },
  left: { style: BorderStyle.SINGLE, size: 4, color: '888888' },
  right: { style: BorderStyle.SINGLE, size: 4, color: '888888' }
};

export class WordExportService {
  /**
   * Xuất đề thi ra file Word (.docx) chuẩn theo thể thức giáo dục Việt Nam
   */
  static async exportTestToDocx(
    test: Test,
    allQuestions: Question[],
    options: WordExportOptions = { mode: 'STUDENT' }
  ): Promise<Blob> {
    const questionMap = new Map<string, Question>();
    allQuestions.forEach((q) => questionMap.set(q.id, q));

    // Xác định danh sách các biến thể / mã đề cần xuất
    const variants = test.variants && test.variants.length > 0
      ? test.variants
      : [{ code: '101', questionIds: test.questionIds || [] }];

    const selectedVariants = options.variantCode && options.variantCode !== 'ALL'
      ? variants.filter((v) => v.code === options.variantCode)
      : variants;

    const activeVariants = selectedVariants.length > 0 ? selectedVariants : variants;

    const sections: any[] = [];

    // Tạo từng phần cho mỗi mã đề
    for (let vIdx = 0; vIdx < activeVariants.length; vIdx++) {
      const variant = activeVariants[vIdx];
      const children: any[] = [];

      // 1. Tiêu đề hành chính trường học
      children.push(this.buildHeaderTable(test, variant.code, options));
      children.push(new Paragraph({ spacing: { after: 120 } }));

      // 2. Khung thông tin học sinh & Điểm số (Dành cho bản học sinh hoặc cả hai)
      if (options.mode === 'STUDENT' || options.mode === 'BOTH') {
        children.push(this.buildStudentInfoTable());
        children.push(new Paragraph({ spacing: { after: 120 } }));

        // 3. Bảng tô đáp án trắc nghiệm nếu được yêu cầu
        if (options.includeAnswerSheet !== false) {
          children.push(this.buildAnswerGrid(test.totalQuestions || 20));
          children.push(new Paragraph({ spacing: { after: 140 } }));
        }
      }

      // 4. Lấy danh sách câu hỏi của mã đề này
      const variantQuestions: Question[] = (variant.questionIds || test.questionIds || [])
        .map((qid) => questionMap.get(qid))
        .filter(Boolean) as Question[];

      // Phân loại các câu hỏi theo 4 phần chuẩn GDPT 2018
      const part1Questions = variantQuestions.filter(
        (q) => q.type === 'SINGLE_CHOICE' || q.type === 'MULTIPLE_CHOICE'
      );
      const part2Questions = variantQuestions.filter((q) => q.type === 'TRUE_FALSE');
      const part3Questions = variantQuestions.filter((q) => q.type === 'FILL_IN_BLANK');
      const part4Questions = variantQuestions.filter((q) => q.type === 'ESSAY');

      let currentQuestionNumber = 1;

      // PHẦN I: Trắc nghiệm nhiều lựa chọn
      if (part1Questions.length > 0) {
        children.push(
          new Paragraph({
            spacing: { before: 180, after: 80 },
            children: [
              new TextRun({
                text: 'PHẦN I. CÂU HỎI TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN LỰA CHỌN',
                bold: true,
                font: FONT_FAMILY,
                size: 24 // 12pt
              })
            ]
          }),
          new Paragraph({
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: `Thí sinh trả lời từ câu ${currentQuestionNumber} đến câu ${
                  currentQuestionNumber + part1Questions.length - 1
                }. Mỗi câu hỏi thí sinh chỉ chọn một phương án chính xác nhất.`,
                italics: true,
                font: FONT_FAMILY,
                size: 22 // 11pt
              })
            ]
          })
        );

        part1Questions.forEach((q) => {
          const qPts = test.questionPoints?.[q.id] || (test.totalPoints / (test.totalQuestions || 1));
          let orderedOptions: OptionItem[] = q.options || [];
          if (variant.shuffledOptionOrder?.[q.id] && q.options) {
            const order = variant.shuffledOptionOrder[q.id];
            const mapped = order.map((optId) => q.options?.find((o) => o.id === optId)).filter(Boolean) as OptionItem[];
            if (mapped.length === q.options.length) {
              orderedOptions = mapped;
            }
          }
          const qElements = this.buildMultipleChoiceQuestion(
            q,
            currentQuestionNumber++,
            qPts,
            options.mode !== 'STUDENT',
            orderedOptions
          );
          children.push(...qElements);
        });
      }

      // PHẦN II: Trắc nghiệm Đúng / Sai
      if (part2Questions.length > 0) {
        children.push(
          new Paragraph({
            spacing: { before: 200, after: 80 },
            children: [
              new TextRun({
                text: 'PHẦN II. CÂU HỎI TRẮC NGHIỆM ĐÚNG / SAI',
                bold: true,
                font: FONT_FAMILY,
                size: 24
              })
            ]
          }),
          new Paragraph({
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: `Thí sinh trả lời từ câu ${currentQuestionNumber} đến câu ${
                  currentQuestionNumber + part2Questions.length - 1
                }. Trong mỗi ý a), b), c), d) ở mỗi câu, thí sinh chọn Đúng hoặc Sai.`,
                italics: true,
                font: FONT_FAMILY,
                size: 22
              })
            ]
          })
        );

        part2Questions.forEach((q) => {
          const qPts = test.questionPoints?.[q.id] || (test.totalPoints / (test.totalQuestions || 1));
          const qElements = this.buildTrueFalseQuestion(
            q,
            currentQuestionNumber++,
            qPts,
            options.mode !== 'STUDENT'
          );
          children.push(...qElements);
        });
      }

      // PHẦN III: Trả lời ngắn / Điền khuyết
      if (part3Questions.length > 0) {
        children.push(
          new Paragraph({
            spacing: { before: 200, after: 80 },
            children: [
              new TextRun({
                text: 'PHẦN III. CÂU HỎI TRẢ LỜI NGẮN / ĐIỀN KHUYẾT',
                bold: true,
                font: FONT_FAMILY,
                size: 24
              })
            ]
          }),
          new Paragraph({
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: `Thí sinh trả lời từ câu ${currentQuestionNumber} đến câu ${
                  currentQuestionNumber + part3Questions.length - 1
                }. Viết câu trả lời ngắn vào chỗ trống tương ứng.`,
                italics: true,
                font: FONT_FAMILY,
                size: 22
              })
            ]
          })
        );

        part3Questions.forEach((q) => {
          const qPts = test.questionPoints?.[q.id] || (test.totalPoints / (test.totalQuestions || 1));
          const qElements = this.buildFillInBlankQuestion(
            q,
            currentQuestionNumber++,
            qPts,
            options.mode !== 'STUDENT'
          );
          children.push(...qElements);
        });
      }

      // PHẦN IV: Tự luận (nếu có)
      if (part4Questions.length > 0) {
        children.push(
          new Paragraph({
            spacing: { before: 200, after: 80 },
            children: [
              new TextRun({
                text: 'PHẦN IV. CÂU HỎI TỰ LUẬN',
                bold: true,
                font: FONT_FAMILY,
                size: 24
              })
            ]
          }),
          new Paragraph({
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: `Thí sinh trình bày bài làm tự luận chi tiết vào phần giấy thi bên dưới.`,
                italics: true,
                font: FONT_FAMILY,
                size: 22
              })
            ]
          })
        );

        part4Questions.forEach((q) => {
          const qPts = test.questionPoints?.[q.id] || 1;
          const qElements = this.buildEssayQuestion(
            q,
            currentQuestionNumber++,
            qPts,
            options.mode !== 'STUDENT'
          );
          children.push(...qElements);
        });
      }

      // Dòng kết thúc đề thi
      children.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 240, after: 120 },
          children: [
            new TextRun({
              text: '---------- HẾT ----------',
              bold: true,
              font: FONT_FAMILY,
              size: 22
            })
          ]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
          children: [
            new TextRun({
              text: '(Cán bộ coi thi không giải thích gì thêm)',
              italics: true,
              font: FONT_FAMILY,
              size: 20
            })
          ]
        })
      );

      // Nếu là chế độ TEACHER hoặc BOTH: bổ sung Bảng đáp án & Hướng dẫn chấm
      if (options.mode === 'TEACHER' || options.mode === 'BOTH') {
        children.push(
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 360, after: 120 },
            children: [
              new TextRun({
                text: `HƯỚNG DẪN CHẤM & ĐÁP ÁN ĐỀ THI - MÃ ĐỀ ${variant.code}`,
                bold: true,
                font: FONT_FAMILY,
                size: 26,
                color: '1E3A8A'
              })
            ]
          }),
          this.buildAnswerKeySummaryTable(variantQuestions, test)
        );

        // Kèm bảng ma trận nếu được chọn
        if (options.includeMatrix && test.matrix) {
          children.push(
            new Paragraph({
              spacing: { before: 240, after: 100 },
              children: [
                new TextRun({
                  text: 'BẢNG MA TRẬN ĐỀ KIỂM TRA CHUẨN GDPT 2018',
                  bold: true,
                  font: FONT_FAMILY,
                  size: 24
                })
              ]
            }),
            this.buildMatrixTable(test)
          );
        }
      }

      sections.push({
        properties: {
          page: {
            margin: {
              top: 1134, // ~2.0 cm
              bottom: 1134, // ~2.0 cm
              left: 1418, // ~2.5 cm
              right: 1134 // ~2.0 cm
            }
          }
        },
        children
      });
    }

    const doc = new Document({
      sections
    });

    return await Packer.toBlob(doc);
  }

  /**
   * Tạo bảng tiêu đề hành chính 2 cột chuẩn văn bản thi THCS
   */
  private static buildHeaderTable(test: Test, variantCode: string, options: WordExportOptions): Table {
    const schoolName = options.schoolName || 'TRƯỜNG THCS PHÚ HỒ';
    const deptName = options.departmentName || 'TỔ: TIN HỌC - CÔNG NGHỆ';
    const districtName = options.districtName || 'UBND HUYỆN QUẢNG ĐIỀN';
    const year = options.academicYear || '2025 - 2026';

    return new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            // Cột bên trái: Đơn vị chủ quản & Trường
            new TableCell({
              width: { size: 45, type: WidthType.PERCENTAGE },
              borders: NO_BORDER,
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({ text: districtName, font: FONT_FAMILY, size: 20 }),
                    new TextRun({ text: '\n' }),
                    new TextRun({ text: schoolName, bold: true, font: FONT_FAMILY, size: 22 }),
                    new TextRun({ text: '\n' }),
                    new TextRun({ text: deptName, bold: true, font: FONT_FAMILY, size: 20 })
                  ]
                })
              ]
            }),
            // Cột bên phải: Tên kỳ thi, môn & mã đề
            new TableCell({
              width: { size: 55, type: WidthType.PERCENTAGE },
              borders: NO_BORDER,
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({ text: 'ĐỀ KIỂM TRA ĐỊNH KỲ NĂM HỌC ' + year, bold: true, font: FONT_FAMILY, size: 22 }),
                    new TextRun({ text: '\n' }),
                    new TextRun({ text: 'MÔN: TIN HỌC - KHỐI ' + test.gradeLevel, bold: true, font: FONT_FAMILY, size: 24, color: '1E3A8A' }),
                    new TextRun({ text: '\n' }),
                    new TextRun({
                      text: `Thời gian làm bài: ${test.durationMinutes} phút (Không kể phát đề)`,
                      italics: true,
                      font: FONT_FAMILY,
                      size: 20
                    }),
                    new TextRun({ text: '\n' }),
                    new TextRun({
                      text: `[ MÃ ĐỀ THI: ${variantCode} ]`,
                      bold: true,
                      font: FONT_FAMILY,
                      size: 22,
                      color: 'B91C1C'
                    })
                  ]
                })
              ]
            })
          ]
        })
      ]
    });
  }

  /**
   * Tạo khung thông tin học sinh và bảng điểm số
   */
  private static buildStudentInfoTable(): Table {
    return new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 100, type: WidthType.PERCENTAGE },
              borders: NO_BORDER,
              children: [
                new Paragraph({
                  children: [
                    new TextRun({ text: 'Họ và tên thí sinh: .................................................................................... ', font: FONT_FAMILY, size: 22 }),
                    new TextRun({ text: 'Lớp: ..................... ', font: FONT_FAMILY, size: 22 }),
                    new TextRun({ text: 'SBD: .............', font: FONT_FAMILY, size: 22 })
                  ]
                })
              ]
            })
          ]
        }),
        new TableRow({
          children: [
            new TableCell({
              width: { size: 40, type: WidthType.PERCENTAGE },
              borders: THIN_BORDER,
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({ text: 'ĐIỂM SỐ', bold: true, font: FONT_FAMILY, size: 22 }),
                    new TextRun({ text: '\n\nBằng số: ..........................' }),
                    new TextRun({ text: '\nBằng chữ: .........................' })
                  ]
                })
              ]
            }),
            new TableCell({
              width: { size: 60, type: WidthType.PERCENTAGE },
              borders: THIN_BORDER,
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({ text: 'LỜI PHÊ CỦA THẦY / CÔ GIÁO', bold: true, font: FONT_FAMILY, size: 22 }),
                    new TextRun({ text: '\n............................................................................................................' }),
                    new TextRun({ text: '\n............................................................................................................' })
                  ]
                })
              ]
            })
          ]
        })
      ]
    });
  }

  /**
   * Tạo bảng tô phương án trắc nghiệm nhanh cho học sinh
   */
  private static buildAnswerGrid(totalQuestions: number): Table {
    const cols = Math.min(totalQuestions, 20);
    const headerCells: TableCell[] = [
      new TableCell({
        width: { size: 12, type: WidthType.PERCENTAGE },
        borders: THIN_BORDER,
        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Câu', bold: true, font: FONT_FAMILY, size: 18 })] })]
      })
    ];
    const rowCells: TableCell[] = [
      new TableCell({
        width: { size: 12, type: WidthType.PERCENTAGE },
        borders: THIN_BORDER,
        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Chọn', bold: true, font: FONT_FAMILY, size: 18 })] })]
      })
    ];

    const cellWidth = 88 / cols;

    for (let i = 1; i <= cols; i++) {
      headerCells.push(
        new TableCell({
          width: { size: cellWidth, type: WidthType.PERCENTAGE },
          borders: THIN_BORDER,
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: String(i), font: FONT_FAMILY, size: 18 })] })]
        })
      );
      rowCells.push(
        new TableCell({
          width: { size: cellWidth, type: WidthType.PERCENTAGE },
          borders: THIN_BORDER,
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: ' ', font: FONT_FAMILY, size: 18 })] })]
        })
      );
    }

    return new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [new TableRow({ children: headerCells }), new TableRow({ children: rowCells })]
    });
  }

  /**
   * Tạo khối câu hỏi trắc nghiệm nhiều phương án
   */
  private static buildMultipleChoiceQuestion(
    q: Question,
    qNum: number,
    points: number,
    isTeacherMode: boolean,
    options: OptionItem[]
  ): Paragraph[] {
    const paras: Paragraph[] = [];

    // Nội dung câu hỏi
    const questionHeaderRuns: TextRun[] = [
      new TextRun({ text: `Câu ${qNum}. `, bold: true, font: FONT_FAMILY, size: 24 })
    ];

    if (isTeacherMode) {
      questionHeaderRuns.push(
        new TextRun({ text: `[${q.difficulty} - ${points.toFixed(2)}đ] `, font: FONT_FAMILY, size: 20, color: '047857' })
      );
    }

    questionHeaderRuns.push(
      new TextRun({ text: q.content, font: FONT_FAMILY, size: 24 })
    );

    paras.push(
      new Paragraph({
        spacing: { before: 120, after: 60 },
        children: questionHeaderRuns
      })
    );

    // Danh sách phương án A, B, C, D
    const optionLetters = ['A', 'B', 'C', 'D', 'E', 'F'];
    const optRuns: TextRun[] = [];

    options.forEach((opt, idx) => {
      const letter = optionLetters[idx] || String.fromCharCode(65 + idx);
      const isCorrect = Boolean(opt.isCorrect);

      optRuns.push(
        new TextRun({
          text: `${letter}. `,
          bold: true,
          font: FONT_FAMILY,
          size: 22,
          color: isTeacherMode && isCorrect ? '047857' : undefined,
          underline: isTeacherMode && isCorrect ? {} : undefined
        }),
        new TextRun({
          text: `${opt.text}${isTeacherMode && isCorrect ? ' (ĐÚNG)' : ''}    `,
          bold: isTeacherMode && isCorrect,
          font: FONT_FAMILY,
          size: 22,
          color: isTeacherMode && isCorrect ? '047857' : undefined
        })
      );
    });

    paras.push(
      new Paragraph({
        spacing: { after: 80 },
        indent: { left: 360 },
        children: optRuns
      })
    );

    // Lời giải thích nếu có
    if (isTeacherMode && q.explanation) {
      paras.push(
        new Paragraph({
          spacing: { after: 80 },
          indent: { left: 360 },
          children: [
            new TextRun({ text: '➤ Giải thích: ', italics: true, bold: true, font: FONT_FAMILY, size: 20, color: '4B5563' }),
            new TextRun({ text: q.explanation, italics: true, font: FONT_FAMILY, size: 20, color: '4B5563' })
          ]
        })
      );
    }

    return paras;
  }

  /**
   * Tạo khối câu hỏi Đúng / Sai
   */
  private static buildTrueFalseQuestion(
    q: Question,
    qNum: number,
    points: number,
    isTeacherMode: boolean
  ): Paragraph[] {
    const paras: Paragraph[] = [];

    paras.push(
      new Paragraph({
        spacing: { before: 120, after: 60 },
        children: [
          new TextRun({ text: `Câu ${qNum}. `, bold: true, font: FONT_FAMILY, size: 24 }),
          ...(isTeacherMode
            ? [new TextRun({ text: `[Đúng/Sai - ${q.difficulty} - ${points.toFixed(2)}đ] `, font: FONT_FAMILY, size: 20, color: '047857' })]
            : []),
          new TextRun({ text: q.content, font: FONT_FAMILY, size: 24 })
        ]
      })
    );

    const letters = ['a', 'b', 'c', 'd'];
    const statements = q.trueFalseStatements || [];

    statements.forEach((st, idx) => {
      const letter = letters[idx] || String(idx + 1);
      const answerStatus = st.isCorrect ? 'ĐÚNG' : 'SAI';

      paras.push(
        new Paragraph({
          spacing: { after: 40 },
          indent: { left: 360 },
          children: [
            new TextRun({ text: `${letter}) `, bold: true, font: FONT_FAMILY, size: 22 }),
            new TextRun({ text: `${st.statement} `, font: FONT_FAMILY, size: 22 }),
            new TextRun({
              text: isTeacherMode ? `[ ${answerStatus} ]` : `[ .... ]`,
              bold: isTeacherMode,
              font: FONT_FAMILY,
              size: 20,
              color: isTeacherMode ? (st.isCorrect ? '047857' : 'DC2626') : '9CA3AF'
            })
          ]
        })
      );
    });

    if (isTeacherMode && q.explanation) {
      paras.push(
        new Paragraph({
          spacing: { after: 80 },
          indent: { left: 360 },
          children: [
            new TextRun({ text: '➤ Hướng dẫn chấm: ', italics: true, bold: true, font: FONT_FAMILY, size: 20, color: '4B5563' }),
            new TextRun({ text: q.explanation, italics: true, font: FONT_FAMILY, size: 20, color: '4B5563' })
          ]
        })
      );
    }

    return paras;
  }

  /**
   * Tạo khối câu hỏi Trả lời ngắn / Điền khuyết
   */
  private static buildFillInBlankQuestion(
    q: Question,
    qNum: number,
    points: number,
    isTeacherMode: boolean
  ): Paragraph[] {
    const paras: Paragraph[] = [];

    paras.push(
      new Paragraph({
        spacing: { before: 120, after: 60 },
        children: [
          new TextRun({ text: `Câu ${qNum}. `, bold: true, font: FONT_FAMILY, size: 24 }),
          ...(isTeacherMode
            ? [new TextRun({ text: `[Trả lời ngắn - ${points.toFixed(2)}đ] `, font: FONT_FAMILY, size: 20, color: '047857' })]
            : []),
          new TextRun({ text: q.content, font: FONT_FAMILY, size: 24 })
        ]
      })
    );

    if (isTeacherMode) {
      paras.push(
        new Paragraph({
          spacing: { after: 60 },
          indent: { left: 360 },
          children: [
            new TextRun({ text: 'Đáp án chính xác: ', bold: true, font: FONT_FAMILY, size: 22, color: '047857' }),
            new TextRun({ text: q.correctAnswerText || '(Theo đáp án Google Sheet)', bold: true, font: FONT_FAMILY, size: 22, color: '047857' })
          ]
        })
      );
    } else {
      paras.push(
        new Paragraph({
          spacing: { after: 80 },
          indent: { left: 360 },
          children: [
            new TextRun({ text: 'Trả lời: .....................................................................................................................................', font: FONT_FAMILY, size: 22 })
          ]
        })
      );
    }

    return paras;
  }

  /**
   * Tạo khối câu hỏi Tự luận
   */
  private static buildEssayQuestion(
    q: Question,
    qNum: number,
    points: number,
    isTeacherMode: boolean
  ): Paragraph[] {
    const paras: Paragraph[] = [];

    paras.push(
      new Paragraph({
        spacing: { before: 140, after: 60 },
        children: [
          new TextRun({ text: `Câu ${qNum} (${points} điểm). `, bold: true, font: FONT_FAMILY, size: 24 }),
          new TextRun({ text: q.content, font: FONT_FAMILY, size: 24 })
        ]
      })
    );

    if (isTeacherMode) {
      paras.push(
        new Paragraph({
          spacing: { after: 60 },
          indent: { left: 360 },
          children: [
            new TextRun({ text: 'Gợi ý đáp án & Tiêu chí chấm: ', bold: true, font: FONT_FAMILY, size: 22, color: '1E3A8A' }),
            new TextRun({ text: q.essaySampleAnswer || q.explanation || 'Chấm theo đúng quy trình và nội dung kiến thức GDPT 2018.', font: FONT_FAMILY, size: 22 })
          ]
        })
      );
    } else {
      paras.push(
        new Paragraph({
          spacing: { after: 40 },
          children: [
            new TextRun({ text: 'Bài làm:', italics: true, font: FONT_FAMILY, size: 22 })
          ]
        }),
        new Paragraph({ children: [new TextRun({ text: '................................................................................................................................................................................................', font: FONT_FAMILY, size: 20 })] }),
        new Paragraph({ children: [new TextRun({ text: '................................................................................................................................................................................................', font: FONT_FAMILY, size: 20 })] }),
        new Paragraph({ children: [new TextRun({ text: '................................................................................................................................................................................................', font: FONT_FAMILY, size: 20 })] }),
        new Paragraph({ children: [new TextRun({ text: '................................................................................................................................................................................................', font: FONT_FAMILY, size: 20 })] })
      );
    }

    return paras;
  }

  /**
   * Tạo bảng Hướng dẫn chấm & Đáp án tổng hợp
   */
  private static buildAnswerKeySummaryTable(questions: Question[], test: Test): Table {
    const rows: TableRow[] = [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 10, type: WidthType.PERCENTAGE },
            borders: THIN_BORDER,
            children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Câu', bold: true, font: FONT_FAMILY, size: 20 })] })]
          }),
          new TableCell({
            width: { size: 20, type: WidthType.PERCENTAGE },
            borders: THIN_BORDER,
            children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Dạng câu', bold: true, font: FONT_FAMILY, size: 20 })] })]
          }),
          new TableCell({
            width: { size: 45, type: WidthType.PERCENTAGE },
            borders: THIN_BORDER,
            children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Đáp án chuẩn', bold: true, font: FONT_FAMILY, size: 20 })] })]
          }),
          new TableCell({
            width: { size: 12, type: WidthType.PERCENTAGE },
            borders: THIN_BORDER,
            children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Mức độ', bold: true, font: FONT_FAMILY, size: 20 })] })]
          }),
          new TableCell({
            width: { size: 13, type: WidthType.PERCENTAGE },
            borders: THIN_BORDER,
            children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Điểm', bold: true, font: FONT_FAMILY, size: 20 })] })]
          })
        ]
      })
    ];

    questions.forEach((q, idx) => {
      let answerText = '';
      if (q.type === 'SINGLE_CHOICE' || q.type === 'MULTIPLE_CHOICE') {
        const correctLetters: string[] = [];
        const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
        (q.options || []).forEach((opt, oIdx) => {
          if (opt.isCorrect) correctLetters.push(letters[oIdx] || String(oIdx + 1));
        });
        answerText = correctLetters.join(', ') || 'A';
      } else if (q.type === 'TRUE_FALSE') {
        const tf = (q.trueFalseStatements || []).map((s, i) => `${['a', 'b', 'c', 'd'][i] || i + 1}: ${s.isCorrect ? 'Đ' : 'S'}`).join(' | ');
        answerText = tf || 'Đúng/Sai';
      } else if (q.type === 'FILL_IN_BLANK') {
        answerText = q.correctAnswerText || 'Theo tiêu chuẩn';
      } else {
        answerText = 'Theo thang điểm tự luận';
      }

      const qPts = test.questionPoints?.[q.id] || (test.totalPoints / (test.totalQuestions || 1));

      rows.push(
        new TableRow({
          children: [
            new TableCell({
              width: { size: 10, type: WidthType.PERCENTAGE },
              borders: THIN_BORDER,
              children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: String(idx + 1), font: FONT_FAMILY, size: 20 })] })]
            }),
            new TableCell({
              width: { size: 20, type: WidthType.PERCENTAGE },
              borders: THIN_BORDER,
              children: [new Paragraph({ children: [new TextRun({ text: q.type, font: FONT_FAMILY, size: 18 })] })]
            }),
            new TableCell({
              width: { size: 45, type: WidthType.PERCENTAGE },
              borders: THIN_BORDER,
              children: [new Paragraph({ children: [new TextRun({ text: answerText, bold: true, font: FONT_FAMILY, size: 20, color: '047857' })] })]
            }),
            new TableCell({
              width: { size: 12, type: WidthType.PERCENTAGE },
              borders: THIN_BORDER,
              children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: q.difficulty, font: FONT_FAMILY, size: 18 })] })]
            }),
            new TableCell({
              width: { size: 13, type: WidthType.PERCENTAGE },
              borders: THIN_BORDER,
              children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: qPts.toFixed(2), bold: true, font: FONT_FAMILY, size: 20 })] })]
            })
          ]
        })
      );
    });

    return new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows
    });
  }

  /**
   * Tạo bảng Ma trận đề thi chuẩn GDPT 2018
   */
  private static buildMatrixTable(test: Test): Table {
    const know = test.matrix?.knowCount || 0;
    const understand = test.matrix?.understandCount || 0;
    const apply = test.matrix?.applyCount || 0;
    const total = test.totalQuestions || (know + understand + apply);

    return new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            new TableCell({ width: { size: 40, type: WidthType.PERCENTAGE }, borders: THIN_BORDER, children: [new Paragraph({ children: [new TextRun({ text: 'Mức độ nhận thức', bold: true, font: FONT_FAMILY, size: 20 })] })] }),
            new TableCell({ width: { size: 20, type: WidthType.PERCENTAGE }, borders: THIN_BORDER, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Số câu', bold: true, font: FONT_FAMILY, size: 20 })] })] }),
            new TableCell({ width: { size: 20, type: WidthType.PERCENTAGE }, borders: THIN_BORDER, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Số điểm', bold: true, font: FONT_FAMILY, size: 20 })] })] }),
            new TableCell({ width: { size: 20, type: WidthType.PERCENTAGE }, borders: THIN_BORDER, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Tỷ lệ %', bold: true, font: FONT_FAMILY, size: 20 })] })] })
          ]
        }),
        new TableRow({
          children: [
            new TableCell({ width: { size: 40, type: WidthType.PERCENTAGE }, borders: THIN_BORDER, children: [new Paragraph({ children: [new TextRun({ text: '1. Nhận biết', font: FONT_FAMILY, size: 20 })] })] }),
            new TableCell({ width: { size: 20, type: WidthType.PERCENTAGE }, borders: THIN_BORDER, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: String(know), font: FONT_FAMILY, size: 20 })] })] }),
            new TableCell({ width: { size: 20, type: WidthType.PERCENTAGE }, borders: THIN_BORDER, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${test.matrix?.difficultyPoints?.BIET?.points || (know * 0.5)}đ`, font: FONT_FAMILY, size: 20 })] })] }),
            new TableCell({ width: { size: 20, type: WidthType.PERCENTAGE }, borders: THIN_BORDER, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${Math.round((know / total) * 100)}%`, font: FONT_FAMILY, size: 20 })] })] })
          ]
        }),
        new TableRow({
          children: [
            new TableCell({ width: { size: 40, type: WidthType.PERCENTAGE }, borders: THIN_BORDER, children: [new Paragraph({ children: [new TextRun({ text: '2. Thông hiểu', font: FONT_FAMILY, size: 20 })] })] }),
            new TableCell({ width: { size: 20, type: WidthType.PERCENTAGE }, borders: THIN_BORDER, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: String(understand), font: FONT_FAMILY, size: 20 })] })] }),
            new TableCell({ width: { size: 20, type: WidthType.PERCENTAGE }, borders: THIN_BORDER, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${test.matrix?.difficultyPoints?.HIEU?.points || (understand * 0.5)}đ`, font: FONT_FAMILY, size: 20 })] })] }),
            new TableCell({ width: { size: 20, type: WidthType.PERCENTAGE }, borders: THIN_BORDER, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${Math.round((understand / total) * 100)}%`, font: FONT_FAMILY, size: 20 })] })] })
          ]
        }),
        new TableRow({
          children: [
            new TableCell({ width: { size: 40, type: WidthType.PERCENTAGE }, borders: THIN_BORDER, children: [new Paragraph({ children: [new TextRun({ text: '3. Vận dụng / Vận dụng cao', font: FONT_FAMILY, size: 20 })] })] }),
            new TableCell({ width: { size: 20, type: WidthType.PERCENTAGE }, borders: THIN_BORDER, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: String(apply), font: FONT_FAMILY, size: 20 })] })] }),
            new TableCell({ width: { size: 20, type: WidthType.PERCENTAGE }, borders: THIN_BORDER, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${test.matrix?.difficultyPoints?.VAN_DUNG?.points || (apply * 0.5)}đ`, font: FONT_FAMILY, size: 20 })] })] }),
            new TableCell({ width: { size: 20, type: WidthType.PERCENTAGE }, borders: THIN_BORDER, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${Math.round((apply / total) * 100)}%`, font: FONT_FAMILY, size: 20 })] })] })
          ]
        }),
        new TableRow({
          children: [
            new TableCell({ width: { size: 40, type: WidthType.PERCENTAGE }, borders: THIN_BORDER, children: [new Paragraph({ children: [new TextRun({ text: 'TỔNG CỘNG', bold: true, font: FONT_FAMILY, size: 20 })] })] }),
            new TableCell({ width: { size: 20, type: WidthType.PERCENTAGE }, borders: THIN_BORDER, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: String(total), bold: true, font: FONT_FAMILY, size: 20 })] })] }),
            new TableCell({ width: { size: 20, type: WidthType.PERCENTAGE }, borders: THIN_BORDER, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${test.totalPoints}đ`, bold: true, font: FONT_FAMILY, size: 20 })] })] }),
            new TableCell({ width: { size: 20, type: WidthType.PERCENTAGE }, borders: THIN_BORDER, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: '100%', bold: true, font: FONT_FAMILY, size: 20 })] })] })
          ]
        })
      ]
    });
  }

  /**
   * Tải file Word trực tiếp trên trình duyệt
   */
  static async downloadTestDocx(
    test: Test,
    allQuestions: Question[],
    options: WordExportOptions = { mode: 'STUDENT' }
  ): Promise<void> {
    const blob = await this.exportTestToDocx(test, allQuestions, options);
    const modeSuffix = options.mode === 'STUDENT' ? 'De_Thi_Hoc_Sinh' : options.mode === 'TEACHER' ? 'De_Thi_Va_Dap_An' : 'De_Thi_Kem_Dap_An';
    const variantSuffix = options.variantCode && options.variantCode !== 'ALL' ? `_MaDe_${options.variantCode}` : '';
    const cleanTitle = (test.title || 'De_Kiem_Tra')
      .replace(/[\s/\\?%*:|"<>]/g, '_')
      .replace(/_{2,}/g, '_');

    const fileName = `${cleanTitle}_${modeSuffix}${variantSuffix}.docx`;

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
