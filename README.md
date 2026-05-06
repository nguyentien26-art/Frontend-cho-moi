# 🛒 choMỌI - Chợ Đồ Cũ Trực Tuyến

Nền tảng mua bán đồ cũ online giống **Chợ Tốt**, được xây dựng với **Next.js** (frontend) và **Strapi** (backend).

## 📋 Tính Năng

✅ Duyệt sản phẩm theo danh mục  
✅ Tìm kiếm sản phẩm  
✅ Xem chi tiết sản phẩm  
✅ Đăng tin mới (giao diện)  
✅ Đăng nhập / Đăng ký (giao diện)  
✅ Responsive design (mobile-friendly)  
✅ Giao diện hiện đại với Tailwind CSS  

## 🛠️ Cấu Trúc Thư Mục

```
Frontend-cho-moi/
├── src/
│   ├── app/
│   │   ├── page.js                 # Trang chủ
│   │   ├── create/page.js          # Đăng tin sản phẩm
│   │   ├── search/page.js          # Trang tìm kiếm
│   │   ├── product/[id]/page.js    # Chi tiết sản phẩm
│   │   ├── auth/
│   │   │   ├── login/page.js       # Trang đăng nhập
│   │   │   └── signup/page.js      # Trang đăng ký
│   │   ├── layout.js               # Layout chính
│   │   └── globals.css             # CSS toàn cụ
│   ├── global_components/
│   │   ├── Header.js               # Header component
│   │   ├── Footer.js               # Footer component
│   │   ├── HeroBanner.js           # Banner quảng cáo
│   │   ├── Categories.js           # Danh mục sản phẩm
│   │   ├── ProductCard.js          # Thẻ sản phẩm
│   │   └── BannerSwipe.js          # Banner carousel
│   └── lib/
│       └── data.js                 # Dữ liệu mock
├── public/                         # Tài nguyên tĩnh
├── package.json
└── README.md
```

## ⚙️ Cài Đặt & Chạy

### 1. Cài đặt Dependencies

```bash
cd Frontend-cho-moi
npm install
```

### 2. Tạo File `.env.local` (Nếu cần)

```env
NEXT_PUBLIC_API_URL=http://localhost:1337/api
```

### 3. Chạy Development Server

```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) trong trình duyệt.

### 4. Build cho Production

```bash
npm run build
npm start
```

## 🔌 Kết Nối với Strapi Backend

### Cấu Hình API Endpoints

Frontend hiện đang gọi API từ: `http://localhost:1337/api`

**Điểm kết nối chính:**
- Lấy danh sách sản phẩm: `GET /api/products?populate=*`
- Lấy chi tiết sản phẩm: `GET /api/products/{id}?populate=*`

### Bước Tập Hợp:

1. **Chạy Backend Strapi:**
```bash
cd Backend-cho-moi
npm run develop
```

2. **Chạy Frontend Next.js:**
```bash
cd Frontend-cho-moi
npm run dev
```

3. **Strapi Admin Panel:** http://localhost:1337/admin
4. **Frontend App:** http://localhost:3000

## 📱 Các Trang Chính

| Trang | URL | Mô tả |
|-------|-----|-------|
| Trang chủ | `/` | Hiển thị sản phẩm mới nhất |
| Tìm kiếm | `/search?q=keyword` | Kết quả tìm kiếm |
| Chi tiết | `/product/[id]` | Thông tin chi tiết sản phẩm |
| Đăng tin | `/create` | Biểu mẫu đăng sản phẩm mới |
| Đăng nhập | `/auth/login` | Trang đăng nhập |
| Đăng ký | `/auth/signup` | Trang đăng ký tài khoản |

## 🎨 Giao Diện Component

### Header
- Logo & Tên ứng dụng
- Thanh tìm kiếm với danh mục
- Chọn khu vực
- Nút đăng tin
- Liên kết đăng nhập/đăng ký

### Footer
- Quảng cáo tải ứng dụng
- Các link hỗ trợ
- Thông tin công ty
- Social media links

### Hero Banner
- Slogan chính
- Tìm kiếm theo vị trí
- Hình minh họa

## 🔄 Luồng Dữ Liệu

```
Strapi Backend → API Endpoints
       ↓
Next.js Frontend → Fetch Data
       ↓
React Components → Render UI
       ↓
User Interactions → Updates State
```

## 📦 Dependencies Chính

- **Next.js 16** - React framework
- **React 19** - UI library
- **Tailwind CSS 4** - Styling
- **next/navigation** - Routing

## 🐛 Troubleshooting

### Lỗi: Cannot connect to Strapi
- Kiểm tra Strapi server đang chạy trên `http://localhost:1337`
- Xóa cache: `rm -rf .next` và chạy lại `npm run dev`

### Lỗi: Port 3000 đã được sử dụng
```bash
npm run dev -- -p 3001
```

### Lỗi: Module not found
```bash
npm install
rm -rf node_modules/.next
npm run dev
```

## 📖 Tài Liệu Tham Khảo

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Strapi Docs](https://docs.strapi.io)
- [React Docs](https://react.dev)

## 🚀 Tiếp Theo

- [ ] Tích hợp authentication với Strapi
- [ ] Tạo API endpoints cho phần upload ảnh
- [ ] Thêm tính năng favorites/wishlist
- [ ] Thêm system notification
- [ ] Deploy lên hosting

## 📧 Liên Hệ

Email: support@chomoi.vn  
Điện thoại: 19003003

---

**Made with ❤️ by choMỌI Team**
