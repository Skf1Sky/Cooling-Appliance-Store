# Hướng dẫn deploy lên Vercel (Free Tier)

## Yêu cầu
- Tài khoản Vercel (miễn phí)
- Tài khoản Neon hoặc Supabase (PostgreSQL miễn phí) — cần DATABASE_URL riêng
- Tài khoản GitHub để kết nối với Vercel

## Bước 1: Chuẩn bị Database

### Dùng Neon (khuyến nghị — miễn phí)
1. Đăng ký tại https://neon.tech
2. Tạo project mới → copy **Connection string** (dạng `postgresql://...`)

### Hoặc dùng Supabase
1. Đăng ký tại https://supabase.com
2. Tạo project → Settings → Database → copy **Connection string (URI)**

## Bước 2: Push code lên GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/<username>/<repo>.git
git push -u origin main
```

## Bước 3: Deploy lên Vercel

1. Vào https://vercel.com → **Add New Project**
2. Chọn repo GitHub của bạn
3. **Framework Preset**: Other (để trống)
4. **Root Directory**: `.` (để mặc định)
5. **Build Command**: `pnpm install --frozen-lockfile && BASE_PATH=/ pnpm --filter @workspace/dien-lanh-store run build`
6. **Output Directory**: `artifacts/dien-lanh-store/dist/public`
7. **Install Command**: `npm install -g pnpm && pnpm install`

## Bước 4: Cấu hình Environment Variables

Trong Vercel → Project Settings → Environment Variables, thêm:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | postgresql://... (từ Neon/Supabase) |
| `SESSION_SECRET` | Chuỗi ngẫu nhiên dài 32+ ký tự |
| `NODE_ENV` | production |
| `ALLOWED_ORIGINS` | https://your-project.vercel.app |

> **Tạo SESSION_SECRET**: chạy lệnh `openssl rand -hex 32` hoặc dùng https://generate-secret.vercel.app/32

## Bước 5: Chạy Migration Database

Sau khi có DATABASE_URL từ Neon/Supabase, chạy lệnh này trên máy local:
```bash
DATABASE_URL="postgresql://..." pnpm --filter @workspace/db run push
```

Lệnh này sẽ tự động tạo tất cả các bảng cần thiết.

## Bước 6: Tạo tài khoản Admin

Kết nối vào database và chạy:
```sql
CREATE EXTENSION IF NOT EXISTS pgcrypto;
INSERT INTO users (username, password_hash, role) 
VALUES ('admin', crypt('your-password', gen_salt('bf', 10)), 'admin');
```

## Kiểm tra sau deploy

- Trang chủ: `https://your-project.vercel.app/`
- API: `https://your-project.vercel.app/api/healthz`
- Admin: `https://your-project.vercel.app/admin`
- Bảo hành: `https://your-project.vercel.app/warranty`

## Lưu ý quan trọng

- **Sessions** được lưu vào PostgreSQL nên không bị mất khi serverless restart
- **Free tier Vercel** giới hạn 100GB bandwidth/tháng và 100k serverless invocations/ngày
- **Neon free tier**: 0.5 GB storage, đủ dùng cho website nhỏ
- Nếu website chậm lần đầu load → đây là cold start của serverless function (bình thường)
