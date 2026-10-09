# HƯỚNG DẪN TRIỂN KHAI CỔNG KIỂM TRA TRỰC TUYẾN LÊN VERCEL.COM
### Đơn vị: Trường THCS Phú Hồ, thành phố Huế
### Tác giả phát triển: Thầy giáo Lê Hữu Nhiệm

---

## 🌟 Tổng Quan Kiến Trúc Serverless

Ứng dụng được thiết kế theo mô hình **Single Page Application (SPA)** hiện đại:
- **Frontend Hosting**: Triển khai hoàn toàn miễn phí trên [Vercel.com](https://vercel.com) với chứng chỉ HTTPS bảo mật.
- **Cơ sở dữ liệu (Database)**: Lưu trữ trực tiếp trên **Google Sheet** (bao gồm 7 bảng tính: `TaiKhoan`, `HocSinh`, `GiaoVien`, `LopHoc`, `TenBaiHoc`, `CauHoi`, `DeThi`, `BangDiem`).
- **Hình ảnh & Tài liệu**: Lưu trữ vĩnh viễn trên **Google Drive** của trường.
- **RESTful API Backend**: Vận hành thông qua **Google Apps Script Web App** (không phát sinh chi phí server).

---

## 🚀 4 Bước Triển Khai Nhanh Lên Vercel.com

### Bước 1: Tải mã nguồn và Đẩy lên GitHub
Nếu bạn đang dùng Git trên máy tính, chạy các lệnh sau trong thư mục dự án:
```bash
git init
git add .
git commit -m "Deploy Cổng Kiểm Tra Trực Tuyến THCS Phú Hồ"
git branch -M main
git remote add origin https://github.com/TÊN_TÀI_KHOẢN_GITHUB/TÊN_KHO_LƯU_TRỮ.git
git push -u origin main
```

---

### Bước 2: Tạo dự án mới trên Vercel.com
1. Truy cập [https://vercel.com](https://vercel.com) và đăng nhập bằng tài khoản GitHub.
2. Tại trang Tổng quan (Dashboard), nhấn nút **"Add New..."** -> chọn **"Project"**.
3. Tìm kho lưu trữ (repository) vừa tải lên ở Bước 1 và nhấn **"Import"**.
4. Các thiết lập giữ nguyên mặc định:
   - **Framework Preset**: `Vite` (Vercel tự động nhận diện).
   - **Root Directory**: `./` (thư mục gốc).
   - **Build Command**: `npm run build` (hoặc `vite build`).
   - **Output Directory**: `dist`.

---

### Bước 3: Cấu hình Biến môi trường (Environment Variables) trên Vercel
Trước khi nhấn Deploy, tại mục **Environment Variables**, thêm biến sau:

| Tên biến (Key) | Giá trị (Value) | Ghi chú |
| :--- | :--- | :--- |
| `VITE_APPS_SCRIPT_URL` | `https://script.google.com/macros/s/AKfycbx3p_wb8t8BWTx0ZqK6coG2icwx77N-cD4YfNoFVUd-n_yqO_BWVhCOdGmMoaCUvOSMjw/exec` | URL Web App Google Apps Script kết nối Google Sheet |
| `GEMINI_API_KEY` | *(Khóa API Gemini của bạn nếu có)* | Dùng cho tính năng AI hỗ trợ soạn câu hỏi (Tùy chọn) |

> **Lưu ý quan trọng**: Biến trên Vite bắt buộc phải có tiền tố `VITE_` để ứng dụng phía trình duyệt đọc được.

---

### Bước 4: Nhấn "Deploy" & Hoàn tất
1. Nhấn nút **"Deploy"**. Vercel sẽ tiến hành build và xuất bản trong vòng **dưới 1 phút**.
2. Sau khi thành công, bạn sẽ nhận được đường dẫn công khai có dạng:
   👉 **`https://ten-du-an.vercel.app`**
3. Truy cập vào trang web và kiểm tra:
   - Giáo viên, học sinh có thể đăng nhập ngay với tài khoản đã có trong Google Sheet.
   - Khi học sinh làm bài kiểm tra và nộp bài, điểm số tự động ghi nhận tức thì vào sheet `BangDiem`.
   - Khi giáo viên thêm câu hỏi hoặc đính kèm ảnh Google Drive, ảnh hiển thị sắc nét trực tiếp.

---

## 📋 Kiểm Tra & Tự Động Đồng Bộ Google Sheet

Ngay tại giao diện ứng dụng (trang Đăng nhập hoặc mục Quản trị):
- Nút **"Đồng bộ Sheet"** cho phép tải lại tài khoản mới nhất nếu quản trị viên vừa thêm người dùng trực tiếp trên file Google Sheet.
- Nếu thêm người dùng hoặc học sinh nộp bài trong ứng dụng, hệ thống tự động đẩy dữ liệu lên Google Sheet qua Apps Script trong nền mà không cần thao tác thủ công.

---
*Chúc quý thầy cô Trường THCS Phú Hồ triển khai thành công!*
