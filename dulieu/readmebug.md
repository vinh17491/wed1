# 🛡️ BÁO CÁO AUDIT HỆ THỐNG - DỰ ÁN GIA VINH
**Role:** Senior Fullstack Developer + Lead QA + Security Engineer
**Date:** 03/05/2026

---

## 1. SYSTEM OVERVIEW (TỔNG QUAN HỆ THỐNG)

### 📋 Chức năng hiện có (Features)
- **E-Commerce:** Listing sản phẩm, chi tiết sản phẩm (Hover zoom), giỏ hàng persistent (Zustand).
- **Portfolio CMS:** Quản lý Profile, Skills, Projects, Experiences.
- **Auth System:** Login/Register (Custom Minecraft UI + Supabase Auth).
- **Admin Panel:** Quản lý dữ liệu dự án, xem Logs Analytics, Dashboard thống kê.
- **AI Integration:** Chatbot tư vấn thông minh (Promise-based).

### 🔄 Luồng hoạt động chính (User Flow)
`Guest` → `Landing Page` → `Shop` → `Product Detail` → `Cart (Local)` → `Login (Auth)` → `Checkout`.

### 🏗️ Các Module chính
1. **Auth:** `features/auth` - Xác thực người dùng qua Supabase.
2. **Shop:** `features/shop` - Quản lý Catalog và trưng bày sản phẩm.
3. **Cart:** `features/cart` - Logic giỏ hàng, tính toán giá trị đơn hàng.
4. **Admin:** `pages/admin` - Hệ thống quản trị tập trung.
5. **Core:** `core/` - Chứa config, API, Error handling tập trung.

---

## 2. BUG DETECTION (BẮT LỖI KỸ THUẬT)

### 🐞 Logic & Race Condition
1. **Async Update on Unmounted Component (Chatbot):**
   - **File:** `src/components/Chatbot.tsx` (Line 34-51)
   - **Nguyên nhân:** Khi gọi `chatApi.send`, nếu user đóng Chatbot trước khi API phản hồi, `setMessages` vẫn được gọi.
   - **Cách tái hiện:** Nhập tin nhắn -> Đóng chatbot ngay lập tức -> Check console (Memory leak warning).
2. **Race Condition in Pagination (Admin Logs):**
   - **File:** `src/pages/admin/AnalyticsDashboard.tsx` (Line 17-27)
   - **Nguyên nhân:** Chuyển trang liên tục làm kích hoạt nhiều request `loadLogs` song song. Request về cuối cùng sẽ ghi đè lên state, dù có thể là của trang cũ.
   - **Fix:** Dùng `AbortController` hoặc `React Query` để auto-cancel request cũ.

### ⚠️ Null/Undefined Risk
1. **Safe Access Failure (Cart Total):**
   - **File:** `src/store/useCartStore.ts` (Line 72)
   - **Nguyên nhân:** Truy cập `item.product.price` mà không check `item.product`. Nếu dữ liệu cache trong localStorage bị hỏng, hàm `reduce` sẽ crash.
2. **String Operation on Null (ManageProjects):**
   - **File:** `src/pages/admin/ManageProjects.tsx` (Line 102)
   - **Nguyên nhân:** `p.techStack.split(',')` sẽ ném lỗi nếu `techStack` là `null` hoặc `undefined`.

---

## 3. SECURITY CHECK (BẢO MẬT)

- **XSS Vulnerability:** Supabase Auth mặc định lưu Session (chứa Access Token) trong `localStorage`. Nếu ứng dụng bị dính XSS (ví dụ qua User Note trong giỏ hàng không được sanitize), attacker có thể đánh cắp Token.
- **Data Validation:** Các trường URL (GitHub, Live Preview) trong Admin không được validate format. Attacker có thể chèn `javascript:alert(1)` vào link.
- **API Security:** Backend .NET 9 cần đảm bảo check Role `Admin` trên mọi Endpoint nhạy cảm (Cần audit controller code).

---

## 4. EDGE CASE & CHAOS TEST (THỬ THÁCH HỆ THỐNG)

- **Spam Click "Add to Cart":** Click liên tục 10 lần vào 1 sản phẩm. Kết quả thực tế: Sinh ra 10 bản ghi trong giỏ hàng nếu ID collision xảy ra.
- **Mạng chậm (3G Slow):** Load `MinecraftVideoBackground` (75MB). Kết quả: UI bị treo trắng do video quá nặng không có lazy load phù hợp.
- **Xóa sạch LocalStorage:** Web sẽ logout đột ngột nhưng một số store (`useExtraStore`) có thể không sync kịp gây lỗi logic filter.

---

## 5. HIDDEN BUG DETECTION (LỖI TIỀM ẨN)

### 🕰️ State Drift & Inconsistency
- **Cart Consistency:** Khi giá sản phẩm thay đổi trên Database, Giỏ hàng trong localStorage vẫn giữ giá cũ.
- **Fix:** Luôn re-validate giá từ API khi vào trang Cart.

### 💾 Memory Leak (setTimeout)
- **File:** `src/features/shop/components/ProductDetailModal.tsx` (Line 31-37)
- **Lỗi:** `setTimeout` reset state không có `clearTimeout`. Nếu đóng mở modal cực nhanh, các state sẽ bị loạn.

---

## 6. DANH SÁCH LỖI & FIX (OUTPUT)

### 🔴 CRITICAL: Missing Env Validation
- **File:** `src/core/supabaseClient.ts`
- **Nguyên nhân:** Gọi `createClient` với string rỗng khi thiếu biến môi trường.
- **Fix:**
```typescript
if (!CONFIG.SUPABASE.URL) throw new Error('Supabase URL is required');
```

### 🟡 MAJOR: ID Collision Risk
- **File:** `src/store/useCartStore.ts` (Line 56)
- **Lỗi:** Dùng `Date.now()` khi `randomUUID` không khả dụng.
- **Fix:** Dùng thư viện `nanoid` hoặc kết hợp `Math.random()` để giảm tỉ lệ trùng lặp về gần 0.

### 🟡 MAJOR: Unhandled API Error
- **File:** `src/api/index.ts`
- **Lỗi:** Thiếu Axios Interceptor để catch lỗi 401 (Hết hạn Token).
- **Fix:** Thêm `axios.interceptors.response` để auto-redirect về `/login`.

### 🔵 MINOR: UI Flicker on Modal Close
- **File:** `src/store/useUIStore.ts`
- **Lỗi:** Reset `selectedProduct` quá sớm làm modal mất data trước khi biến mất.
- **Fix:** Trì hoãn set `null` cho đến khi modal đã exit xong.

---
**Báo cáo này được tạo để hỗ trợ việc refactor hệ thống lên chuẩn Enterprise.**
"Code with Passion, Review with Courage."
