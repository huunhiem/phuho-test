import { Question, Test } from '../types';
import {
  getGoogleAccessToken,
  clearGoogleToken,
  isAuthErrorMessage,
  signInWithGoogleSheets
} from './googleSheetsService';

const FOLDER_ID_KEY = 'phuho_lms_drive_folder_id';
const FOLDER_URL_KEY = 'phuho_lms_drive_folder_url';
const QUESTIONS_FILE_ID_KEY = 'phuho_lms_drive_questions_file_id';
const QUESTIONS_FILE_URL_KEY = 'phuho_lms_drive_questions_file_url';

export const FOLDER_NAME = 'THCS Phú Hồ - Ngân Hàng Đề Thi & Hình Ảnh';

export interface DriveUploadResult {
  fileId: string;
  viewLink: string;
  displayUrl: string;
  downloadUrl?: string;
  name: string;
}

export interface DriveQuestionsSaveResult {
  fileId: string;
  viewLink: string;
  updatedTime: string;
  fileName: string;
}

/**
 * Service tích hợp Google Drive API v3
 * Quản lý lưu trữ hình ảnh câu hỏi, ngân hàng câu hỏi & đề thi trường THCS Phú Hồ
 */
export class GoogleDriveService {
  /**
   * Xử lý lỗi API Google Drive và tự động phát hiện hết hạn token
   */
  private static async handleResponseError(res: Response, defaultMsg: string): Promise<never> {
    let errMsg = defaultMsg;
    try {
      const errData = await res.json();
      errMsg = errData.error?.message || defaultMsg;
    } catch {
      errMsg = `${defaultMsg} (HTTP ${res.status})`;
    }

    if (res.status === 401 || res.status === 403 || isAuthErrorMessage(errMsg)) {
      clearGoogleToken();
      const friendlyError: any = new Error(
        'Phiên đăng nhập Google đã hết hạn hoặc chưa được cấp quyền Google Drive. Vui lòng bấm "Đăng nhập lại Google" để cấp quyền lưu trữ đám mây.'
      );
      friendlyError.isAuthError = true;
      friendlyError.originalMessage = errMsg;
      throw friendlyError;
    }

    throw new Error(errMsg);
  }

  /**
   * Yêu cầu người dùng đăng nhập lại Google với quyền Drive và nhận token mới
   */
  static async reconnectAndGetToken(): Promise<string> {
    const res = await signInWithGoogleSheets();
    if (!res?.accessToken) {
      throw new Error('Chưa thể nhận mã truy cập Google. Vui lòng thử lại.');
    }
    return res.accessToken;
  }

  /**
   * Chuyển đổi Data URL (base64) sang Blob
   */
  private static dataUrlToBlob(dataUrl: string): { blob: Blob; mimeType: string } {
    const arr = dataUrl.split(',');
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mimeType = mimeMatch ? mimeMatch[1] : 'image/png';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return { blob: new Blob([u8arr], { type: mimeType }), mimeType };
  }

  /**
   * Đảm bảo thư mục lưu trữ LMS tồn tại trên Google Drive của người dùng
   */
  static async ensureDriveFolder(accessToken?: string): Promise<{ folderId: string; folderUrl: string }> {
    const token = accessToken || getGoogleAccessToken();
    if (!token) {
      throw new Error('Chưa đăng nhập tài khoản Google để thao tác với Google Drive.');
    }

    const cachedId = localStorage.getItem(FOLDER_ID_KEY);
    const cachedUrl = localStorage.getItem(FOLDER_URL_KEY);
    if (cachedId && cachedUrl) {
      // Xác minh xem thư mục còn tồn tại không
      try {
        const checkRes = await fetch(
          `https://www.googleapis.com/drive/v3/files/${cachedId}?fields=id,name,webViewLink,trashed`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (checkRes.status === 401 || checkRes.status === 403) {
          await this.handleResponseError(checkRes, 'Phiên đăng nhập Google đã hết hạn');
        }
        if (checkRes.ok) {
          const fileData = await checkRes.json();
          if (!fileData.trashed) {
            return { folderId: cachedId, folderUrl: fileData.webViewLink || cachedUrl };
          }
        }
      } catch (e: any) {
        if (e?.isAuthError) throw e;
        // Tiếp tục tìm kiếm bên dưới nếu lỗi mạng thông thường
      }
    }

    // Tìm kiếm thư mục theo tên
    const query = encodeURIComponent(
      `name = '${FOLDER_NAME}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`
    );
    const searchRes = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,webViewLink)&pageSize=1`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (searchRes.status === 401 || searchRes.status === 403) {
      await this.handleResponseError(searchRes, 'Phiên đăng nhập Google đã hết hạn');
    }

    if (searchRes.ok) {
      const searchData = await searchRes.json();
      if (searchData.files && searchData.files.length > 0) {
        const folder = searchData.files[0];
        localStorage.setItem(FOLDER_ID_KEY, folder.id);
        localStorage.setItem(FOLDER_URL_KEY, folder.webViewLink);
        return { folderId: folder.id, folderUrl: folder.webViewLink };
      }
    }

    // Nếu chưa có, tạo mới thư mục
    const createRes = await fetch('https://www.googleapis.com/drive/v3/files', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: FOLDER_NAME,
        mimeType: 'application/vnd.google-apps.folder',
        description: 'Thư mục lưu trữ hình ảnh câu hỏi, đề thi môn Tin học THCS Phú Hồ'
      })
    });

    if (!createRes.ok) {
      await this.handleResponseError(createRes, 'Không thể tạo thư mục trên Google Drive');
    }

    const newFolder = await createRes.json();
    const folderId = newFolder.id;
    const folderUrl = `https://drive.google.com/drive/folders/${folderId}`;

    // Cấp quyền chia sẻ công khai cho thư mục (người có liên kết có thể xem)
    try {
      await fetch(`https://www.googleapis.com/drive/v3/files/${folderId}/permissions`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          role: 'reader',
          type: 'anyone'
        })
      });
    } catch (e) {
      console.warn('Lỗi phân quyền thư mục Drive:', e);
    }

    localStorage.setItem(FOLDER_ID_KEY, folderId);
    localStorage.setItem(FOLDER_URL_KEY, folderUrl);

    return { folderId, folderUrl };
  }

  /**
   * Tải hình ảnh câu hỏi lên Google Drive (Multipart upload)
   * Đặt quyền xem công khai và trả về link Google Drive
   */
  static async uploadImageToDrive(
    fileOrDataUrl: File | Blob | string,
    fileName: string,
    accessToken?: string
  ): Promise<DriveUploadResult> {
    const token = accessToken || getGoogleAccessToken();
    if (!token) {
      throw new Error('Chưa đăng nhập Google. Vui lòng kết nối tài khoản Google để tải ảnh lên Google Drive.');
    }

    const { folderId } = await this.ensureDriveFolder(token);

    let blob: Blob;
    let mimeType = 'image/png';

    if (typeof fileOrDataUrl === 'string') {
      const parsed = this.dataUrlToBlob(fileOrDataUrl);
      blob = parsed.blob;
      mimeType = parsed.mimeType;
    } else {
      blob = fileOrDataUrl;
      mimeType = fileOrDataUrl.type || 'image/png';
    }

    const sanitizedFileName = (fileName || `cau_hoi_${Date.now()}.png`).replace(/[^a-zA-Z0-9._-]/g, '_');

    // Chuẩn bị Multipart Body
    const boundary = '-------314159265358979323846';
    const delimiter = `\r\n--${boundary}\r\n`;
    const closeDelimiter = `\r\n--${boundary}--`;

    const metadata = {
      name: sanitizedFileName,
      mimeType,
      parents: [folderId],
      description: 'Hình ảnh đính kèm câu hỏi kiểm tra môn Tin học THCS Phú Hồ'
    };

    const metadataPart = delimiter +
      'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
      JSON.stringify(metadata) +
      delimiter +
      `Content-Type: ${mimeType}\r\n` +
      'Content-Transfer-Encoding: base64\r\n\r\n';

    // Đọc blob sang base64 để ghép multipart an toàn trong browser
    const base64Data = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const res = reader.result as string;
        resolve(res.split(',')[1] || '');
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

    const multipartRequestBody = metadataPart + base64Data + closeDelimiter;

    const uploadRes = await fetch(
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink,webContentLink,thumbnailLink',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': `multipart/related; boundary=${boundary}`
        },
        body: multipartRequestBody
      }
    );

    if (!uploadRes.ok) {
      await this.handleResponseError(uploadRes, 'Không thể tải ảnh lên Google Drive');
    }

    const uploaded = await uploadRes.json();
    const fileId = uploaded.id;

    // Cấp quyền xem cho ai có link để hiển thị ảnh trên giao diện bài thi
    try {
      await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}/permissions`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          role: 'reader',
          type: 'anyone'
        })
      });
    } catch (e) {
      console.warn('Lỗi gán quyền xem file Google Drive:', e);
    }

    // Google Drive direct link thumbnail hỗ trợ nhúng trực tiếp trong <img>
    const displayUrl = `https://lh3.googleusercontent.com/d/${fileId}`;
    const viewLink = uploaded.webViewLink || `https://drive.google.com/file/d/${fileId}/view?usp=sharing`;

    return {
      fileId,
      name: uploaded.name || sanitizedFileName,
      viewLink,
      displayUrl,
      downloadUrl: uploaded.webContentLink
    };
  }

  /**
   * Chuyển đổi mọi đường dẫn Google Drive (chia sẻ, view, thumbnail, direct link) thành URL nhúng trực tiếp an toàn
   * Hỗ trợ hiển thị ảnh câu hỏi ổn định 100% trên Vercel và GitHub không bị chặn CORS
   */
  static getDriveDirectImageUrl(driveUrlOrId: string): string {
    if (!driveUrlOrId || typeof driveUrlOrId !== 'string') return '';
    const trimmed = driveUrlOrId.trim();
    if (!trimmed) return '';
    
    // Nếu là base64 data url hoặc url http thông thường không phải drive
    if (trimmed.startsWith('data:image/') || (!trimmed.includes('drive.google.com') && !trimmed.includes('googleusercontent.com'))) {
      return trimmed;
    }

    // Trích xuất File ID từ nhiều định dạng link Google Drive khác nhau
    // 1. https://drive.google.com/file/d/FILE_ID/view...
    // 2. https://drive.google.com/open?id=FILE_ID
    // 3. https://drive.google.com/uc?id=FILE_ID
    // 4. https://lh3.googleusercontent.com/d/FILE_ID
    let fileId = '';
    const matchFileD = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    const matchIdParam = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    const matchLh3 = trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/);

    if (matchFileD && matchFileD[1]) {
      fileId = matchFileD[1];
    } else if (matchIdParam && matchIdParam[1]) {
      fileId = matchIdParam[1];
    } else if (matchLh3 && matchLh3[1]) {
      fileId = matchLh3[1];
    } else if (/^[a-zA-Z0-9_-]{20,}$/.test(trimmed)) {
      fileId = trimmed;
    }

    if (fileId) {
      return `https://lh3.googleusercontent.com/d/${fileId}`;
    }

    return trimmed;
  }

  /**
   * Lưu trữ danh sách câu hỏi kiểm tra lên Google Drive
   * Xuất cả file JSON và tài liệu tổng hợp có link nguồn ảnh Drive
   */
  static async saveQuestionsToDrive(
    questions: Question[],
    accessToken?: string
  ): Promise<DriveQuestionsSaveResult> {
    const token = accessToken || getGoogleAccessToken();
    if (!token) {
      throw new Error('Chưa đăng nhập Google để lưu câu hỏi lên Google Drive.');
    }

    const { folderId } = await this.ensureDriveFolder(token);
    const fileName = 'PHU_HO_LMS_NganHangCauHoi.json';

    const payloadContent = JSON.stringify(
      {
        school: 'Trường THCS Phú Hồ',
        system: 'CỔNG KIỂM TRA TRỰC TUYẾN - Ngân Hàng Câu Hỏi & Đề Thi Tin Học',
        exportedAt: new Date().toISOString(),
        totalQuestions: questions.length,
        questions: questions.map((q) => ({
          id: q.id,
          code: q.code,
          gradeLevel: q.gradeLevel,
          topic: q.topic,
          lessonTitle: q.lessonTitle,
          difficulty: q.difficulty,
          type: q.type,
          content: q.content,
          imageUrl: q.imageUrl || '',
          imageDriveUrl: q.imageDriveUrl || '',
          options: q.options || [],
          trueFalseStatements: q.trueFalseStatements || [],
          correctAnswerText: q.correctAnswerText || '',
          essaySampleAnswer: q.essaySampleAnswer || '',
          explanation: q.explanation || '',
          authorName: q.authorName,
          createdAt: q.createdAt
        }))
      },
      null,
      2
    );

    // Kiểm tra xem file đã tồn tại trên Drive chưa
    let existingFileId = localStorage.getItem(QUESTIONS_FILE_ID_KEY);
    if (!existingFileId) {
      const q = encodeURIComponent(`name = '${fileName}' and '${folderId}' in parents and trashed = false`);
      const searchRes = await fetch(
        `https://www.googleapis.com/drive/v3/files?q=${q}&fields=files(id,webViewLink)&pageSize=1`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (searchRes.status === 401 || searchRes.status === 403) {
        await this.handleResponseError(searchRes, 'Phiên đăng nhập Google đã hết hạn');
      }
      if (searchRes.ok) {
        const searchData = await searchRes.json();
        if (searchData.files && searchData.files.length > 0) {
          existingFileId = searchData.files[0].id;
        }
      }
    }

    let fileId = existingFileId;
    let viewLink = '';

    if (existingFileId) {
      // Cập nhật nội dung file hiện có
      const updateRes = await fetch(
        `https://www.googleapis.com/upload/drive/v3/files/${existingFileId}?uploadType=media`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: payloadContent
        }
      );

      if (updateRes.ok) {
        const updateData = await updateRes.json();
        viewLink = `https://drive.google.com/file/d/${existingFileId}/view?usp=sharing`;
      } else {
        if (updateRes.status === 401 || updateRes.status === 403) {
          await this.handleResponseError(updateRes, 'Phiên đăng nhập Google đã hết hạn');
        }
        existingFileId = null; // Thử tạo mới nếu patch lỗi khác
      }
    }

    if (!existingFileId) {
      // Tạo file mới
      const boundary = '-------questions-multipart-boundary';
      const delimiter = `\r\n--${boundary}\r\n`;
      const closeDelimiter = `\r\n--${boundary}--`;

      const metadata = {
        name: fileName,
        mimeType: 'application/json',
        parents: [folderId],
        description: 'Dữ liệu ngân hàng câu hỏi THCS Phú Hồ được đồng bộ tự động từ LMS'
      };

      const multipartBody =
        delimiter +
        'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
        JSON.stringify(metadata) +
        delimiter +
        'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
        payloadContent +
        closeDelimiter;

      const createRes = await fetch(
        'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': `multipart/related; boundary=${boundary}`
          },
          body: multipartBody
        }
      );

      if (!createRes.ok) {
        await this.handleResponseError(createRes, 'Không thể lưu file câu hỏi lên Google Drive');
      }

      const createdData = await createRes.json();
      fileId = createdData.id;
      viewLink = createdData.webViewLink || `https://drive.google.com/file/d/${fileId}/view?usp=sharing`;

      // Cấp quyền xem
      try {
        await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}/permissions`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ role: 'reader', type: 'anyone' })
        });
      } catch (e) {
        console.warn('Lỗi gán quyền xem file JSON:', e);
      }
    }

    if (fileId) {
      localStorage.setItem(QUESTIONS_FILE_ID_KEY, fileId);
      localStorage.setItem(QUESTIONS_FILE_URL_KEY, viewLink);
    }

    return {
      fileId: fileId || '',
      viewLink,
      fileName,
      updatedTime: new Date().toLocaleTimeString('vi-VN')
    };
  }

  /**
   * Lấy URL thư mục Google Drive đã kết nối
   */
  static getSavedFolderUrl(): string {
    return localStorage.getItem(FOLDER_URL_KEY) || '';
  }

  /**
   * Lấy URL file câu hỏi trên Google Drive
   */
  static getSavedQuestionsDriveUrl(): string {
    return localStorage.getItem(QUESTIONS_FILE_URL_KEY) || '';
  }

  /**
   * Quản trị viên lưu thông tin thư mục Google Drive dùng chung
   */
  static saveFolder(folderId: string, folderUrl: string): void {
    if (folderId) localStorage.setItem(FOLDER_ID_KEY, folderId.trim());
    if (folderUrl) localStorage.setItem(FOLDER_URL_KEY, folderUrl.trim());
  }
}
