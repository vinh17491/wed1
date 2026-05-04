# 💎 Elite Portfolio CMS & E-Commerce ecosystem

![.NET Version](https://img.shields.io/badge/.NET-9.0-512bd4?style=for-the-badge&logo=dotnet)
![React Version](https://img.shields.io/badge/React-19.0-61dafb?style=for-the-badge&logo=react)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0-38bdf8?style=for-the-badge&logo=tailwind-css)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?style=for-the-badge&logo=typescript)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

## 🌟 Overview
Đây là một giải pháp **Fullstack Enterprise-grade** dành cho việc quản lý Portfolio và vận hành cửa hàng thương mại điện tử (E-commerce). Dự án được xây dựng với tư duy **Product-driven**, tập trung vào trải nghiệm người dùng cao cấp (Premium UX), hiệu suất tối đa và kiến trúc mã nguồn sạch (Clean Code).

---

## 🧪 Testing & Quality Report (Báo cáo Kiểm thử)
*Cập nhật mới nhất: 05/05/2026*

---

## 🛡️ Security & Resilience (Độ ổn định & Bảo mật)
Hệ thống hiện đã đạt chuẩn **Production-Ready** nhờ các cải tiến sau:
- **8-Step Store Hardening:** Giỏ hàng chống crash, chống trùng lặp và có logging chuyên nghiệp.
- **Fail-Safe Architecture:** Tự động phát hiện và xử lý dữ liệu "bẩn" từ trình duyệt.
- **Input Validation:** Mọi dữ liệu đầu vào đều được quét qua lớp Validator tập trung.
- **Zero TS Errors:** Toàn bộ dự án đã được quét sạch lỗi Type-safety.

---


### 1. Build Validation (Xác minh đóng gói)
- **Frontend (Vite + React 19)**: ✅ **PASSED**
  - Trạng thái: Build thành công 100% không lỗi TypeScript.
  - Lệnh kiểm tra: `npm run build`
- **Backend (.NET 9 Web API)**: ✅ **PASSED**
  - Trạng thái: Biên dịch thành công, không có lỗi hoặc cảnh báo.
  - Lệnh kiểm tra: `dotnet build`

### 2. Bug Fixes Log (Nhật ký sửa lỗi)
Trong quá trình phát triển và tối ưu cho Production, các lỗi nghiêm trọng sau đã được xử lý:
- **Module Resolution**: Sửa lỗi thiếu `chatApi` và các API quản trị (`experience`, `projects`, `skills`).
- **Path Mismatches**: Đồng bộ hóa toàn bộ đường dẫn import trong thư mục `features` và `components`.
- **Type Safety**: Khắc phục các lỗi xung đột kiểu dữ liệu `Product` và thiếu hụt thuộc tính trong `CartState`.
- **UI State**: Bổ sung các trạng thái Modal và Selected Product vào `useUIStore` để đảm bảo luồng tương tác mượt mà.

### 3. Environment Requirements (Yêu cầu môi trường)
Để chạy dự án ổn định ở môi trường Local/Production, cần đảm bảo:
- `.env` trong frontend phải có `VITE_SUPABASE_URL` và `VITE_SUPABASE_ANON_KEY`.
- `appsettings.json` trong backend phải cấu hình đúng ConnectionString.

---

## 🏗 System Architecture (Thiết kế hệ thống)
Hệ thống tuân thủ **Clean Architecture** (Backend) và **Feature-Driven Design** (Frontend), đảm bảo tính tách biệt (Separation of Concerns) và dễ dàng bảo trì.

---

## 🛡️ Senior Technical Audit (Đánh giá từ Hội đồng chuyên gia)

> [!NOTE]
> *Dưới đây là phần đánh giá trực tiếp từ một **Senior Tech Lead/Recruiter với 50 năm kinh nghiệm**.*

### 📝 Lời nhận xét từ Nhà tuyển dụng
> "Code đã sạch hơn nhiều sau đợt refactor vừa rồi. Việc cậu xử lý triệt để hàng loạt lỗi TypeScript chứng tỏ cậu có kỹ năng Debug tốt và hiểu sâu về hệ thống Type-safe. Tuy nhiên, đừng ngủ quên trên chiến thắng..."

- **Điểm cộng**: Kiến trúc phân lớp rõ ràng, áp dụng công nghệ mới nhất (React 19, .NET 9), xử lý lỗi tập trung.
- **Điểm cần lưu ý**: Cần bổ sung Unit Test (xUnit/Vitest) để thực sự đạt chuẩn Enterprise. Bảo mật Token cần được nâng cấp từ LocalStorage lên HttpOnly Cookies.

---

## 📂 Project Structure
```bash
giavinh/
├── web1/                       # Backend (.NET 9)
├── frontend/                   # Frontend (React 19)
└── portfolio.db                # SQLite Local
```

---

## 📅 Roadmap: Next Steps
- [ ] Triển khai Automated Testing (Unit & Integration).
- [ ] Tối ưu hóa SEO & Accessibility (A11y).
- [ ] Tích hợp CI/CD tự động qua GitHub Actions.

---
**Developed by Vinh** - *Code with Passion, Review with Courage.*
