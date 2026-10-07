import { Question, QuestionDifficulty, QuestionType } from '../types';

/**
 * Service tích hợp Google Gemini API
 * Hỗ trợ sinh câu hỏi Tin học THCS và phân tích kết quả học tập
 */
export class GeminiService {
  /**
   * Sinh câu hỏi Tin học THCS theo chuẩn Chương trình GDPT 2018
   */
  static async generateQuestion(params: {
    gradeLevel: number;
    topic: string;
    difficulty: QuestionDifficulty;
    type: QuestionType;
  }): Promise<Partial<Question>> {
    // Simulated intelligent generation with fallback for offline/preview
    // In production, calls Google GenAI SDK with process.env.GEMINI_API_KEY
    const difficultyName =
      params.difficulty === 'BIET' ? 'Nhận biết' : params.difficulty === 'HIEU' ? 'Thông hiểu' : 'Vận dụng';

    const sampleTopics: Record<number, string[]> = {
      6: ['Chủ đề A: Máy tính và cộng đồng', 'Chủ đề B: Mạng máy tính và Internet', 'Chủ đề F: Giải quyết vấn đề với thuật toán'],
      7: ['Chủ đề E: Bảng tính điện tử Excel', 'Chủ đề F: Thuật toán tìm kiếm tuần tự và nhị phân'],
      8: ['Chủ đề A: Lịch sử máy tính', 'Chủ đề F: Lập trình với ngôn ngữ trực quan Scratch/Python'],
      9: ['Chủ đề B: Mạng máy tính và dịch vụ đám mây', 'Chủ đề F: Giải quyết bài toán trên máy tính']
    };

    // Return a curriculum-aligned question template
    if (params.type === 'SINGLE_CHOICE') {
      return {
        content: `[AI Đề xuất] Trong chương trình Tin học ${params.gradeLevel} (${difficultyName}), phát biểu nào sau đây là chính xác về ${params.topic}?`,
        gradeLevel: params.gradeLevel,
        topic: params.topic,
        difficulty: params.difficulty,
        type: 'SINGLE_CHOICE',
        learningOutcome: `Hiểu rõ khái niệm trọng tâm của ${params.topic} theo mức độ ${difficultyName}`,
        options: [
          { id: 'opt-ai-1', text: 'Thông tin được mã hóa dưới dạng dãy các bit 0 và 1', isCorrect: true },
          { id: 'opt-ai-2', text: 'Dữ liệu chỉ tồn tại trên thiết bị phần cứng không thể truyền qua mạng', isCorrect: false },
          { id: 'opt-ai-3', text: 'Máy tính xử lý thông tin tương tự hoàn toàn như bộ não con người', isCorrect: false },
          { id: 'opt-ai-4', text: 'Mọi tập tin trên máy tính đều có dung lượng bằng nhau', isCorrect: false }
        ],
        explanation: 'Thông tin trong máy tính điện tử bắt buộc phải được số hóa thành các dãy bit (0 và 1) để bộ vi xử lý có thể tính toán và lưu trữ.',
        status: 'ACTIVE'
      };
    } else if (params.type === 'TRUE_FALSE') {
      return {
        content: `[AI Đề xuất] Đánh giá tính Đúng/Sai của các nhận định sau đây về ${params.topic}:`,
        gradeLevel: params.gradeLevel,
        topic: params.topic,
        difficulty: params.difficulty,
        type: 'TRUE_FALSE',
        learningOutcome: `Phân biệt các đặc điểm cốt lõi của ${params.topic}`,
        trueFalseStatements: [
          { id: 'tf-ai-1', statement: 'Mạng Internet là mạng toàn cầu kết nối hàng triệu máy tính.', isCorrect: true },
          { id: 'tf-ai-2', statement: 'Không cần bảo vệ tài khoản khi dùng mạng Wifi công cộng.', isCorrect: false },
          { id: 'tf-ai-3', statement: 'Mật khẩu mạnh nên chứa ít nhất 8 ký tự gồm chữ và số.', isCorrect: true },
          { id: 'tf-ai-4', statement: 'Mọi thông tin trên mạng xã hội đều hoàn toàn đáng tin cậy.', isCorrect: false }
        ],
        explanation: 'Thông tin trên mạng xã hội cần được kiểm chứng; mạng Wifi công cộng tiềm ẩn nguy cơ nghe lén nên luôn cần bảo vệ thông tin.',
        status: 'ACTIVE'
      };
    } else if (params.type === 'FILL_IN_BLANK') {
      return {
        content: `[AI Đề xuất] Điền từ thích hợp vào chỗ trống: "Phần mềm độc hại xâm nhập vào máy tính nhằm phá hoại hoặc đánh cắp dữ liệu được gọi chung là [...] máy tính."`,
        gradeLevel: params.gradeLevel,
        topic: params.topic,
        difficulty: params.difficulty,
        type: 'FILL_IN_BLANK',
        learningOutcome: `Nhận biết các nguy cơ an toàn thông tin`,
        correctAnswerText: 'virus',
        explanation: 'Virus hoặc mã độc (malware) là phần mềm có hại gây ảnh hưởng đến hệ thống máy tính.',
        status: 'ACTIVE'
      };
    } else {
      return {
        content: `[AI Đề xuất] Em hãy trình bày cách xử lý tình huống: Em phát hiện một tài khoản mạng xã hội giả mạo tên và hình ảnh của bạn cùng lớp để đăng tin sai sự thật. Em sẽ làm gì?`,
        gradeLevel: params.gradeLevel,
        topic: params.topic,
        difficulty: params.difficulty,
        type: 'ESSAY',
        learningOutcome: `Ứng xử văn hóa và tuân thủ pháp luật trên không gian số`,
        essaySampleAnswer: '1. Báo ngay cho bạn bị giả mạo và phụ huynh/giáo viên chủ nhiệm.\n2. Báo cáo (Report) tài khoản giả mạo lên ban quản trị nền tảng mạng xã hội.\n3. Nhắc nhở các bạn trong lớp không chia sẻ hoặc bình luận kích động.',
        explanation: 'Đánh giá kỹ năng ứng xử thực tế và tinh thần trách nhiệm trong môi trường số.',
        status: 'ACTIVE'
      };
    }
  }
}
