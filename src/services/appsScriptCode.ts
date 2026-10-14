/**
 * Mã nguồn Google Apps Script Web App (Code.gs) phiên bản chuẩn và mới nhất
 * Cung cấp đầy đủ RESTful API cho toàn bộ 9 Sheet CSDL của trường THCS Phú Hồ:
 * - Tài khoản & Mật khẩu (TaiKhoan)
 * - Danh sách Học sinh (HocSinh)
 * - Danh sách Lớp học (LopHoc)
 * - Ngân hàng Câu hỏi (CauHoi)
 * - Tên bài học (TenBaiHoc)
 * - Đề kiểm tra (DeThi)
 * - Đợt giao đề (GiaoDe)
 * - Bảng điểm kết quả bài làm (BangDiem)
 * - Phân công giáo viên (GiaoVien)
 * - Đồng bộ hàng loạt tốc độ cao (batchPushAllData)
 * - Sao lưu và tải ảnh Google Drive (uploadImage, saveQuestionsToDrive)
 */

export const APPS_SCRIPT_SOURCE_CODE = `/**
 * Google Apps Script Web App - Cung cấp RESTful API cho CỔNG KIỂM TRA TRỰC TUYẾN trên Vercel
 * Hỗ trợ quản lý Tài khoản, Mật khẩu, Học sinh, Câu hỏi, Đề thi, Lưu trữ Google Drive và Điểm số
 *
 * Hướng dẫn triển khai:
 * 1. Trên Google Sheet, nhấn Tiện ích mở rộng (Extensions) -> Apps Script
 * 2. Dán toàn bộ mã nguồn này vào file Code.gs (xóa hết mã cũ)
 * 3. Nhấn Triển khai (Deploy) -> Quản lý bản triển khai (Manage deployments)
 * 4. Bấm vào biểu tượng cây bút (Chỉnh sửa) -> Tại mục Phiên bản (Version) chọn "Phiên bản mới (New version)"
 * 5. Bấm Triển khai (Deploy).
 */

function getTargetSpreadsheet(sheetId) {
  if (sheetId && String(sheetId).trim()) {
    try {
      return SpreadsheetApp.openById(String(sheetId).trim());
    } catch(err) {}
  }
  try {
    return SpreadsheetApp.getActiveSpreadsheet();
  } catch(err) {}
  return null;
}

function getTargetFolder(folderId) {
  if (folderId && String(folderId).trim()) {
    try {
      return DriveApp.getFolderById(String(folderId).trim());
    } catch(err) {}
  }
  return DriveApp.getRootFolder();
}

function doGet(e) {
  var sheetId = (e && e.parameter && e.parameter.sheetId);
  var ss = getTargetSpreadsheet(sheetId);
  var action = (e && e.parameter && e.parameter.action) || 'getAccounts';

  if (!ss) {
    return jsonResponse({ error: 'Không tìm thấy Google Spreadsheet. Vui lòng truyền sheetId hoặc mở đúng bảng tính.' });
  }

  // 0. Kiểm tra kết nối
  if (action === 'ping' || action === 'testConnection') {
    return jsonResponse({
      success: true,
      message: 'Google Apps Script hoạt động tốt!',
      spreadsheetName: ss.getName(),
      spreadsheetId: ss.getId(),
      spreadsheetUrl: ss.getUrl()
    });
  }
  
  // 1. Lấy toàn bộ tài khoản & mật khẩu
  if (action === 'getAccounts' || action === 'getUsers') {
    var sheet = ss.getSheetByName('TaiKhoan') || ss.getSheetByName('Tài khoản') || ss.getSheetByName('TAIKHOAN') || ss.getSheetByName('Users');
    if (!sheet) return jsonResponse({ error: 'Chưa có sheet TaiKhoan' });
    var data = sheet.getDataRange().getValues();
    return jsonResponse(data);
  }
  
  // 2. Lấy danh sách học sinh
  if (action === 'getStudents') {
    var sheet = ss.getSheetByName('HocSinh') || ss.getSheetByName('Học sinh') || ss.getSheetByName('HOCSINH') || ss.getSheetByName('Students');
    if (!sheet) return jsonResponse({ error: 'Chưa có sheet HocSinh' });
    var data = sheet.getDataRange().getValues();
    return jsonResponse(data);
  }
  
  // 3. Lấy ngân hàng câu hỏi
  if (action === 'getQuestions') {
    var sheet = ss.getSheetByName('CauHoi') || ss.getSheetByName('Câu hỏi') || ss.getSheetByName('CAUHOI') || ss.getSheetByName('Questions');
    if (!sheet) {
      sheet = ss.insertSheet('CauHoi');
      sheet.appendRow([
        'ID', 'Mã câu', 'Nội dung', 'Khối', 'Chủ đề',
        'Tên bài học', 'Yêu cầu cần đạt', 'Mức độ', 'Dạng câu',
        'Phương án / Đáp án đúng', 'Giải thích sư phạm',
        'Link nguồn file ảnh (Google Drive)', 'Tác giả', 'Ngày tạo'
      ]);
      return jsonResponse(sheet.getDataRange().getValues());
    }
    var data = sheet.getDataRange().getValues();
    return jsonResponse(data);
  }
  
  // 4. Lấy danh sách lớp học
  if (action === 'getClasses' || action === 'getLopHoc') {
    var sheet = ss.getSheetByName('LopHoc') || ss.getSheetByName('Lớp học') || ss.getSheetByName('Lớp Học') || ss.getSheetByName('LOPHOC') || ss.getSheetByName('lophoc');
    if (!sheet) return jsonResponse({ error: 'Chưa có sheet LopHoc' });
    var data = sheet.getDataRange().getDisplayValues();
    return jsonResponse(data);
  }
  
  // 5. Lấy bảng điểm bài thi
  if (action === 'getSubmissions') {
    var sheet = ss.getSheetByName('BangDiem') || ss.getSheetByName('Bảng điểm') || ss.getSheetByName('BANGDIEM') || ss.getSheetByName('KetQua') || ss.getSheetByName('Submissions');
    if (!sheet) return jsonResponse({ error: 'Chưa có sheet BangDiem' });
    var data = sheet.getDataRange().getValues();
    return jsonResponse(data);
  }

  // 6. Lấy danh sách tên bài học
  if (action === 'getLessons' || action === 'getTenBaiHoc') {
    var sheet = ss.getSheetByName('TenBaiHoc') || ss.getSheetByName('Tên bài học') || ss.getSheetByName('BaiHoc') || ss.getSheetByName('Bài học');
    if (!sheet) return jsonResponse({ error: 'Chưa có sheet TenBaiHoc' });
    var data = sheet.getDataRange().getValues();
    return jsonResponse(data);
  }

  // 7. Lấy danh sách đề thi
  if (action === 'getTests' || action === 'getDeThi') {
    var sheet = ss.getSheetByName('DeThi') || ss.getSheetByName('Đề thi') || ss.getSheetByName('DETHI') || ss.getSheetByName('Tests');
    if (!sheet) return jsonResponse({ error: 'Chưa có sheet DeThi' });
    var data = sheet.getDataRange().getValues();
    return jsonResponse(data);
  }

  // 8. Lấy danh sách đợt giao đề
  if (action === 'getAssignments' || action === 'getGiaoDe') {
    var sheet = ss.getSheetByName('GiaoDe') || ss.getSheetByName('Giao đề') || ss.getSheetByName('GIAODE') || ss.getSheetByName('Assignments');
    if (!sheet) return jsonResponse({ error: 'Chưa có sheet GiaoDe' });
    var data = sheet.getDataRange().getValues();
    return jsonResponse(data);
  }

  // 9. Lấy danh sách giáo viên & phân công
  if (action === 'getTeachers' || action === 'getGiaoVien') {
    var sheet = ss.getSheetByName('GiaoVien') || ss.getSheetByName('Giáo viên') || ss.getSheetByName('GIAOVIEN') || ss.getSheetByName('Teachers');
    if (!sheet) return jsonResponse({ error: 'Chưa có sheet GiaoVien' });
    var data = sheet.getDataRange().getValues();
    return jsonResponse(data);
  }
  
  return jsonResponse({ error: 'Action không hợp lệ: ' + action });
}

function doPost(e) {
  try {
    var payload = {};
    if (e && e.postData && e.postData.contents) {
      try {
        payload = JSON.parse(e.postData.contents);
      } catch (pErr) {
        payload = {};
      }
    }
    var action = payload.action;
    var ss = getTargetSpreadsheet(payload.sheetId);
    var folder = getTargetFolder(payload.folderId);
    
    // Ghi điểm bài thi
    if (action === 'addSubmission') {
      if (!ss) return jsonResponse({ error: 'Không tìm thấy Google Sheet' });
      var sheet = ss.getSheetByName('BangDiem');
      if (!sheet) {
        sheet = ss.insertSheet('BangDiem');
        sheet.appendRow(['ID Bài nộp', 'Họ tên học sinh', 'Mã số HS', 'Lớp', 'Tên bài thi', 'Mã đề', 'Điểm số', 'Đúng/Tổng câu', 'Thời gian nộp']);
      }
      sheet.appendRow([
        payload.id,
        payload.studentName,
        payload.studentCode,
        payload.className,
        payload.testTitle,
        payload.variantCode,
        payload.score,
        payload.correctCount + '/' + payload.totalQuestions,
        new Date().toISOString()
      ]);
      return jsonResponse({ success: true });
    }
    
    // Thêm người dùng mới
    if (action === 'addUser') {
      if (!ss) return jsonResponse({ error: 'Không tìm thấy Google Sheet' });
      var sheet = ss.getSheetByName('TaiKhoan');
      if (!sheet) {
        sheet = ss.insertSheet('TaiKhoan');
        sheet.appendRow(['ID', 'Tên đăng nhập', 'Mật khẩu', 'Họ và tên', 'Email', 'Vai trò', 'Mã số', 'Khối', 'Lớp', 'Số điện thoại', 'Trạng thái', 'Ngày tạo']);
      }
      sheet.appendRow([
        payload.id,
        payload.username,
        payload.password || '123456',
        payload.fullName,
        payload.email,
        payload.role,
        payload.code || '',
        payload.grade || '',
        payload.className || '',
        payload.phone || '',
        payload.status || 'ACTIVE',
        new Date().toISOString().split('T')[0]
      ]);
      return jsonResponse({ success: true });
    }

    // Tải ảnh trực tiếp lên Google Drive
    if (action === 'uploadImage') {
      var base64Data = payload.base64 || payload.imageBase64;
      if (!base64Data) return jsonResponse({ error: 'Không có dữ liệu ảnh base64' });
      if (base64Data.indexOf('base64,') > -1) {
        base64Data = base64Data.split('base64,')[1];
      }
      var decoded = Utilities.base64Decode(base64Data);
      var fileName = payload.fileName || ('cau_hoi_' + new Date().getTime() + '.png');
      var blob = Utilities.newBlob(decoded, payload.mimeType || 'image/png', fileName);
      var file = folder.createFile(blob);
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      var fileId = file.getId();
      return jsonResponse({
        success: true,
        fileId: fileId,
        viewLink: file.getUrl(),
        displayUrl: 'https://lh3.googleusercontent.com/d/' + fileId
      });
    }

    // Sao lưu toàn bộ danh sách câu hỏi lên Google Drive dưới dạng JSON
    if (action === 'saveQuestionsToDrive') {
      var fileName = 'PHU_HO_LMS_NganHangCauHoi.json';
      var content = typeof payload.questionsJson === 'string'
        ? payload.questionsJson
        : JSON.stringify(payload.questionsJson || [], null, 2);
      var files = folder.getFilesByName(fileName);
      var driveFile;
      if (files.hasNext()) {
        driveFile = files.next();
        driveFile.setContent(content);
      } else {
        driveFile = folder.createFile(fileName, content, MimeType.PLAIN_TEXT);
      }
      driveFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      return jsonResponse({
        success: true,
        fileId: driveFile.getId(),
        viewLink: driveFile.getUrl(),
        folderUrl: folder.getUrl()
      });
    }

    // Thêm hoặc cập nhật câu hỏi vào sheet CauHoi và sao lưu Google Drive
    if (action === 'addQuestion' || action === 'saveQuestion') {
      if (!ss) return jsonResponse({ error: 'Không tìm thấy Google Sheet' });
      var sheet = ss.getSheetByName('CauHoi');
      if (!sheet) {
        sheet = ss.insertSheet('CauHoi');
        sheet.appendRow([
          'ID', 'Mã câu', 'Nội dung', 'Khối', 'Chủ đề',
          'Tên bài học', 'Yêu cầu cần đạt', 'Mức độ', 'Dạng câu',
          'Phương án / Đáp án đúng', 'Giải thích sư phạm',
          'Link nguồn file ảnh (Google Drive)', 'Tác giả', 'Ngày tạo'
        ]);
      }

      var imageDriveUrl = payload.imageDriveUrl || payload.imageUrl || '';
      if (payload.imageBase64 && String(payload.imageBase64).startsWith('data:image/')) {
        try {
          var b64 = payload.imageBase64.split('base64,')[1];
          var imgBlob = Utilities.newBlob(Utilities.base64Decode(b64), 'image/png', 'img_' + (payload.code || new Date().getTime()) + '.png');
          var imgFile = folder.createFile(imgBlob);
          imgFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
          imageDriveUrl = imgFile.getUrl();
        } catch (imgErr) {}
      }
      
      var data = sheet.getDataRange().getValues();
      var targetRow = -1;
      for (var i = 1; i < data.length; i++) {
        if (data[i][0] == payload.id || (payload.code && data[i][1] == payload.code)) {
          targetRow = i + 1;
          break;
        }
      }

      var rowValues = [
        payload.id,
        payload.code || '',
        payload.content || '',
        payload.gradeLevel || payload.grade || 6,
        payload.topic || payload.topicId || 'Chủ đề 1: Máy tính và cộng đồng',
        payload.lessonTitle || 'Bài 1: Thông tin và dữ liệu',
        payload.learningOutcome || 'Chuẩn kiến thức GDPT 2018',
        payload.difficulty || 'BIET',
        payload.type || 'SINGLE_CHOICE',
        payload.options || payload.correctAnswerText || payload.essaySampleAnswer || '',
        payload.explanation || '',
        imageDriveUrl,
        payload.authorName || 'Giáo viên',
        payload.createdAt || new Date().toISOString().split('T')[0]
      ];

      if (targetRow > 0) {
        sheet.getRange(targetRow, 1, 1, rowValues.length).setValues([rowValues]);
      } else {
        sheet.appendRow(rowValues);
      }

      if (payload.allQuestions) {
        try {
          var backupName = 'PHU_HO_LMS_NganHangCauHoi.json';
          var bFiles = folder.getFilesByName(backupName);
          var bContent = JSON.stringify(payload.allQuestions, null, 2);
          if (bFiles.hasNext()) {
            bFiles.next().setContent(bContent);
          } else {
            folder.createFile(backupName, bContent, MimeType.PLAIN_TEXT).setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
          }
        } catch(bErr) {}
      }

      return jsonResponse({
        success: true,
        action: targetRow > 0 ? 'updated' : 'inserted',
        id: payload.id,
        imageDriveUrl: imageDriveUrl
      });
    }

    // Xóa câu hỏi
    if (action === 'deleteQuestion') {
      if (!ss) return jsonResponse({ error: 'Không tìm thấy Google Sheet' });
      var sheet = ss.getSheetByName('CauHoi');
      if (sheet) {
        var data = sheet.getDataRange().getValues();
        for (var i = 1; i < data.length; i++) {
          if (data[i][0] == payload.id || (payload.code && data[i][1] == payload.code)) {
            sheet.deleteRow(i + 1);
            return jsonResponse({ success: true, action: 'deleted' });
          }
        }
      }
      return jsonResponse({ success: true, action: 'not_found' });
    }

    // Xóa người dùng và xóa điểm thi liên quan
    if (action === 'deleteUser') {
      if (!ss) return jsonResponse({ error: 'Không tìm thấy Google Sheet' });
      var userId = payload.id;
      var studentCode = payload.studentCode;

      var tkSheet = ss.getSheetByName('TaiKhoan');
      if (tkSheet) {
        var tkData = tkSheet.getDataRange().getValues();
        for (var i = tkData.length - 1; i >= 1; i--) {
          if (tkData[i][0] == userId || (payload.username && tkData[i][1] == payload.username)) {
            tkSheet.deleteRow(i + 1);
          }
        }
      }

      var hsSheet = ss.getSheetByName('HocSinh');
      if (hsSheet) {
        var hsData = hsSheet.getDataRange().getValues();
        for (var i = hsData.length - 1; i >= 1; i--) {
          if (hsData[i][0] == userId || (studentCode && hsData[i][2] == studentCode)) {
            hsSheet.deleteRow(i + 1);
          }
        }
      }

      var bdSheet = ss.getSheetByName('BangDiem');
      if (bdSheet) {
        var bdData = bdSheet.getDataRange().getValues();
        for (var i = bdData.length - 1; i >= 1; i--) {
          if ((studentCode && bdData[i][2] == studentCode) || (payload.fullName && bdData[i][1] == payload.fullName)) {
            bdSheet.deleteRow(i + 1);
          }
        }
      }

      return jsonResponse({ success: true, action: 'deleted_user' });
    }

    // Thêm hoặc cập nhật Đề thi (DeThi)
    if (action === 'saveTest' || action === 'addTest') {
      if (!ss) return jsonResponse({ error: 'Không tìm thấy Google Sheet' });
      var dtSheet = ss.getSheetByName('DeThi');
      if (!dtSheet) {
        dtSheet = ss.insertSheet('DeThi');
        dtSheet.appendRow(['ID', 'Tên đề thi', 'Khối', 'Thời gian (phút)', 'Số câu', 'Mã đề', 'Tác giả', 'Ngày tạo', 'Trạng thái']);
      }
      var dtData = dtSheet.getDataRange().getValues();
      var targetRow = -1;
      for (var i = 1; i < dtData.length; i++) {
        if (dtData[i][0] == payload.id) {
          targetRow = i + 1;
          break;
        }
      }
      var dtRow = [
        payload.id,
        payload.title || '',
        'Khối ' + (payload.gradeLevel || 6),
        payload.durationMinutes || 45,
        payload.totalQuestions || 0,
        payload.variantCode || '101',
        payload.authorName || 'Giáo viên',
        payload.createdAt || new Date().toISOString().split('T')[0],
        payload.status || 'READY'
      ];
      if (targetRow > 0) {
        dtSheet.getRange(targetRow, 1, 1, dtRow.length).setValues([dtRow]);
      } else {
        dtSheet.appendRow(dtRow);
      }
      return jsonResponse({ success: true, action: targetRow > 0 ? 'updated' : 'inserted' });
    }

    // Xóa Đề thi (DeThi)
    if (action === 'deleteTest') {
      if (!ss) return jsonResponse({ error: 'Không tìm thấy Google Sheet' });
      var dtSheet = ss.getSheetByName('DeThi');
      if (dtSheet) {
        var dtData = dtSheet.getDataRange().getValues();
        for (var i = dtData.length - 1; i >= 1; i--) {
          if (dtData[i][0] == payload.id) {
            dtSheet.deleteRow(i + 1);
            return jsonResponse({ success: true, action: 'deleted' });
          }
        }
      }
      return jsonResponse({ success: true, action: 'not_found' });
    }

    // Thêm hoặc cập nhật Đợt giao đề (GiaoDe)
    if (action === 'saveAssignment' || action === 'addAssignment') {
      if (!ss) return jsonResponse({ error: 'Không tìm thấy Google Sheet' });
      var gdSheet = ss.getSheetByName('GiaoDe');
      if (!gdSheet) {
        gdSheet = ss.insertSheet('GiaoDe');
        gdSheet.appendRow(['ID Đợt giao', 'Tên bài kiểm tra', 'Khối lớp', 'Danh sách lớp', 'Thời gian bắt đầu', 'Thời gian kết thúc', 'Mật khẩu phòng thi', 'Cho xem đáp án sau nộp', 'Trộn thứ tự câu hỏi', 'Người giao đề', 'Ngày tạo', 'Trạng thái']);
      }
      var gdData = gdSheet.getDataRange().getValues();
      var targetRow = -1;
      for (var i = 1; i < gdData.length; i++) {
        if (gdData[i][0] == payload.id) {
          targetRow = i + 1;
          break;
        }
      }
      var gdRow = [
        payload.id,
        payload.testTitle || '',
        'Khối ' + (payload.gradeLevel || 6),
        Array.isArray(payload.classNames) ? payload.classNames.join(', ') : (payload.className || ''),
        payload.startTime || '',
        payload.endTime || '',
        payload.password || 'Không có',
        payload.allowReviewAfterSubmit ? 'Có' : 'Không',
        payload.shuffleQuestions ? 'Có' : 'Không',
        payload.assignedByName || 'Giáo viên',
        payload.createdAt || new Date().toISOString().split('T')[0],
        payload.status || 'ACTIVE'
      ];
      if (targetRow > 0) {
        gdSheet.getRange(targetRow, 1, 1, gdRow.length).setValues([gdRow]);
      } else {
        gdSheet.appendRow(gdRow);
      }
      return jsonResponse({ success: true, action: targetRow > 0 ? 'updated' : 'inserted' });
    }

    // Xóa Đợt giao đề (GiaoDe)
    if (action === 'deleteAssignment') {
      if (!ss) return jsonResponse({ error: 'Không tìm thấy Google Sheet' });
      var gdSheet = ss.getSheetByName('GiaoDe');
      if (gdSheet) {
        var gdData = gdSheet.getDataRange().getValues();
        for (var i = gdData.length - 1; i >= 1; i--) {
          if (gdData[i][0] == payload.id) {
            gdSheet.deleteRow(i + 1);
            return jsonResponse({ success: true, action: 'deleted' });
          }
        }
      }
      return jsonResponse({ success: true, action: 'not_found' });
    }

    // Thêm hoặc cập nhật Lớp học (LopHoc)
    if (action === 'saveClass' || action === 'addClass') {
      if (!ss) return jsonResponse({ error: 'Không tìm thấy Google Sheet' });
      var lhSheet = ss.getSheetByName('LopHoc');
      if (!lhSheet) {
        lhSheet = ss.insertSheet('LopHoc');
        lhSheet.appendRow(['ID', 'Tên lớp', 'Khối', 'Sĩ số', 'Giáo viên chủ nhiệm', 'Giáo viên phân công môn Tin học']);
      }
      var lhData = lhSheet.getDataRange().getValues();
      var targetRow = -1;
      for (var i = 1; i < lhData.length; i++) {
        if (lhData[i][0] == payload.id || lhData[i][1] == payload.name) {
          targetRow = i + 1;
          break;
        }
      }
      var lhRow = [
        payload.id,
        payload.name || '',
        payload.grade || (payload.name ? payload.name.split('/')[0] : '6'),
        payload.studentCount || 35,
        payload.homeroomTeacherName || '',
        payload.assignedTeacherNames || payload.subjectTeacherName || ''
      ];
      if (targetRow > 0) {
        lhSheet.getRange(targetRow, 1, 1, lhRow.length).setValues([lhRow]);
      } else {
        lhSheet.appendRow(lhRow);
      }
      return jsonResponse({ success: true, action: targetRow > 0 ? 'updated' : 'inserted' });
    }

    // Xóa Lớp học (LopHoc)
    if (action === 'deleteClass') {
      if (!ss) return jsonResponse({ error: 'Không tìm thấy Google Sheet' });
      var lhSheet = ss.getSheetByName('LopHoc');
      if (lhSheet) {
        var lhData = lhSheet.getDataRange().getValues();
        var lhDisplay = lhSheet.getDataRange().getDisplayValues();
        var targetId = String(payload.id || '').trim();
        var targetName = String(payload.name || '').trim().toLowerCase();
        var deletedCount = 0;

        for (var i = lhData.length - 1; i >= 1; i--) {
          var rowId = String(lhData[i][0] || '').trim();
          var rawName = lhData[i][1];
          var dispName = String(lhDisplay[i] ? lhDisplay[i][1] : '').trim().toLowerCase();
          var strName = String(rawName || '').trim().toLowerCase();
          
          var matchName = false;
          if (targetName) {
            if (dispName === targetName || strName === targetName) {
              matchName = true;
            } else if (rawName instanceof Date) {
              var m = rawName.getMonth() + 1;
              var d = rawName.getDate();
              var dateStr1 = m + '/' + d;
              var dateStr2 = d + '/' + m;
              if (targetName === dateStr1 || targetName === dateStr2) {
                matchName = true;
              }
            }
          }

          var matchId = targetId && rowId && (rowId === targetId);

          if (matchId || matchName) {
            lhSheet.deleteRow(i + 1);
            deletedCount++;
          }
        }

        if (deletedCount > 0) {
          return jsonResponse({ success: true, action: 'deleted', count: deletedCount });
        }
      }
      return jsonResponse({ success: true, action: 'not_found' });
    }

    // Cập nhật phân công giảng dạy cho Giáo viên (sheet LopHoc & GiaoVien)
    if (action === 'saveTeacherAssignment' || action === 'assignClasses') {
      if (!ss) return jsonResponse({ error: 'Không tìm thấy Google Sheet' });
      var lhSheet = ss.getSheetByName('LopHoc');
      if (!lhSheet) {
        lhSheet = ss.insertSheet('LopHoc');
      }
      if (payload.classesRows && payload.classesRows.length > 0) {
        lhSheet.clearContents();
        var numR = payload.classesRows.length;
        var numC = payload.classesRows[0].length || 1;
        try {
          lhSheet.getRange(1, 1, numR, numC).setNumberFormat('@');
        } catch(fmtErr) {}
        lhSheet.getRange(1, 1, numR, numC).setValues(payload.classesRows);
      }

      var gvSheet = ss.getSheetByName('GiaoVien');
      if (gvSheet && payload.teachersRows && payload.teachersRows.length > 0) {
        gvSheet.clearContents();
        var gvR = payload.teachersRows.length;
        var gvC = payload.teachersRows[0].length || 1;
        try {
          gvSheet.getRange(1, 1, gvR, gvC).setNumberFormat('@');
        } catch(gvFmtErr) {}
        gvSheet.getRange(1, 1, gvR, gvC).setValues(payload.teachersRows);
      }
      return jsonResponse({ success: true, action: 'assignment_saved' });
    }

    // Cập nhật thông tin tài khoản hoặc ảnh đại diện (TaiKhoan & HocSinh/GiaoVien)
    if (action === 'updateUser' || action === 'saveUser') {
      if (!ss) return jsonResponse({ error: 'Không tìm thấy Google Sheet' });
      var tkSheet = ss.getSheetByName('TaiKhoan');
      if (tkSheet) {
        var tkData = tkSheet.getDataRange().getValues();
        for (var uIdx = 1; uIdx < tkData.length; uIdx++) {
          if (tkData[uIdx][0] == payload.id || tkData[uIdx][1] == payload.username) {
            if (payload.fullName) tkSheet.getRange(uIdx + 1, 4).setValue(payload.fullName);
            if (payload.email) tkSheet.getRange(uIdx + 1, 5).setValue(payload.email);
            if (payload.phone) tkSheet.getRange(uIdx + 1, 10).setValue(payload.phone);
            if (payload.avatarUrl) tkSheet.getRange(uIdx + 1, 13).setValue(payload.avatarUrl);
            break;
          }
        }
      }
      return jsonResponse({ success: true, action: 'user_updated' });
    }

    // Đẩy toàn bộ dữ liệu nhiều Sheet một lúc (Batch Push All Sheets)
    if (action === 'batchPushAllData') {
      if (!ss) return jsonResponse({ error: 'Không tìm thấy Google Sheet' });
      var sheetsList = payload.sheets || [];
      var updatedSheets = [];

      for (var sIdx = 0; sIdx < sheetsList.length; sIdx++) {
        var sInfo = sheetsList[sIdx];
        var targetName = sInfo.name;
        var rowsData = sInfo.rows || [];
        if (!targetName) continue;

        var targetSheet = ss.getSheetByName(targetName);
        if (!targetSheet) {
          targetSheet = ss.insertSheet(targetName);
        }

        targetSheet.clearContents();

        if (rowsData.length > 0) {
          var numR = rowsData.length;
          var numC = rowsData[0].length || 1;
          try {
            targetSheet.getRange(1, 1, numR, numC).setNumberFormat('@');
          } catch(fmtErr) {}
          targetSheet.getRange(1, 1, numR, numC).setValues(rowsData);
        }
        updatedSheets.push(targetName);
      }

      if (payload.allQuestions && folder) {
        try {
          var qBackupName = 'PHU_HO_LMS_NganHangCauHoi.json';
          var qFiles = folder.getFilesByName(qBackupName);
          var qContent = JSON.stringify(payload.allQuestions, null, 2);
          if (qFiles.hasNext()) {
            qFiles.next().setContent(qContent);
          } else {
            folder.createFile(qBackupName, qContent, MimeType.PLAIN_TEXT).setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
          }
        } catch(bErr) {}
      }

      return jsonResponse({
        success: true,
        action: 'batchPushAllData',
        updatedSheets: updatedSheets,
        count: updatedSheets.length
      });
    }

    return jsonResponse({ error: 'Unsupported action: ' + action });
  } catch (err) {
    return jsonResponse({ error: err.message });
  }
}

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
`;
