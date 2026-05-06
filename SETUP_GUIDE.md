# 🚀 Hướng Dẫn Cài Đặt & Chạy choMỌI

## Bước 1: Chuẩn Bị Môi Trường

Đảm bảo bạn đã cài đặt:
- Node.js (phiên bản 18+)
- npm hoặc yarn
- Git (tùy chọn)

## Bước 2: Cầu Hình Backend Strapi

### 2.1 Tạo Models trong Strapi

Truy cập: http://localhost:1337/admin

Tạo Collection Type **Products** với các fields:
- `title` (String, Required)
- `price` (Number, Required)
- `description` (RichText)
- `location` (String)
- `category` (String)
- `image` (Media)

### 2.2 Thêm Dữ Liệu Test

Tạo vài sản phẩm test để hiển thị trên frontend.

## Bước 3: Chuẩn Bị Frontend

```bash
# 1. Vào thư mục frontend
cd Frontend-cho-moi

# 2. Cài đặt dependencies
npm install

# 3. Kiểm tra file .env.local
# Đảm bảo API URL trỏ đúng đến Strapi
# NEXT_PUBLIC_API_URL=http://localhost:1337/api
```

## Bước 4: Chạy Ứng Dụng

### Terminal 1 - Chạy Strapi Backend
```bash
cd Backend-cho-moi
npm run develop
```
✅ Strapi sẽ chạy trên: http://localhost:1337

### Terminal 2 - Chạy Next.js Frontend
```bash
cd Frontend-cho-moi
npm run dev
```
✅ Frontend sẽ chạy trên: http://localhost:3000

## Bước 5: Truy Cập Ứng Dụng

1. **Frontend App**: http://localhost:3000
2. **Strapi Admin**: http://localhost:1337/admin
3. **API Docs**: http://localhost:1337/documentation

## 🎯 Các Tính Năng Đã Xây Dựng

### ✅ Giao Diện Đẹp (Chợ Tốt Style)
- Header hiện đại với tìm kiếm
- Hero banner với call-to-action
- Footer đầy đủ thông tin
- Responsive trên mobile & desktop

### ✅ Các Trang Chính
- **Trang Chủ** (`/`) - Hiển thị sản phẩm mới
- **Tìm Kiếm** (`/search`) - Tìm sản phẩm
- **Chi Tiết** (`/product/[id]`) - Xem thông tin chi tiết
- **Đăng Tin** (`/create`) - Biểu mẫu đăng sản phẩm
- **Đăng Nhập** (`/auth/login`) - Giao diện đăng nhập
- **Đăng Ký** (`/auth/signup`) - Giao diện đăng ký

### ✅ Components
- Header với menu & tìm kiếm
- Footer với app promotion
- Hero Banner
- Product Card
- Category List

## 🔗 Kết Nối Frontend với Backend

Frontend sẽ tự động fetch dữ liệu từ Strapi:

```javascript
// Ví dụ: Lấy sản phẩm
const res = await fetch('http://localhost:1337/api/products?populate=*');
const json = await res.json();
return json.data;
```

## ⚙️ Cấu Hình Tailwind CSS

Project đã được cấu hình sẵn Tailwind CSS v4 với:
- Utility classes
- Custom colors (yellow theme)
- Responsive breakpoints
- Dark mode support (optional)

## 📝 Tiếp Theo - Tasks để Hoàn Thành

### Backend Strapi
- [ ] Setup authentication (JWT)
- [ ] Tạo API endpoint cho user registration
- [ ] Tạo API endpoint cho upload ảnh
- [ ] Tạo API filters & search
- [ ] Setup CORS

### Frontend Next.js
- [ ] Kết nối form đăng tin với backend
- [ ] Kết nối authentication
- [ ] Thêm form validation
- [ ] Thêm loading states
- [ ] Error handling improvements
- [ ] Thêm pagination cho list sản phẩm
- [ ] Thêm favorites feature

## 🐛 Gỡ Rối Thường Gặp

### Lỗi: "Cannot fetch from Strapi"
```bash
# Kiểm tra Strapi đang chạy
http://localhost:1337/api/products

# Nếu lỗi CORS, thêm vào Strapi config:
# config/middlewares.js
```

### Lỗi: Port đã được sử dụng
```bash
# Chạy frontend trên port khác
npm run dev -- -p 3001

# Hoặc kill process
# Windows: taskkill /F /PID <PID>
# Mac/Linux: kill -9 <PID>
```

### Lỗi: Module dependencies
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

## 📞 Cần Giúp?

Các file quan trọng:
- Frontend structure: `Frontend-cho-moi/src/`
- Components: `src/global_components/`
- Pages: `src/app/`
- Styles: `src/app/globals.css`

## 🎉 Hoàn Thành!

Bây giờ bạn có:
✅ Frontend Next.js đầy đủ chức năng  
✅ Backend Strapi  
✅ Giao diện giống Chợ Tốt  
✅ Kết nối Frontend-Backend  

**Hãy tiếp tục phát triển thêm features!** 🚀

---

**Last Updated**: 2026-04-26  
**Version**: 1.0.0
