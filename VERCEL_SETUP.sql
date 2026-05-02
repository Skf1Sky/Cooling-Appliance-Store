-- ============================================================
-- ĐIỆN LẠNH MINH HOÀNG — Database Setup Script
-- Chạy file này trong SQL Editor của Neon (neon.tech)
-- ============================================================

-- 1. TẠO CÁC BẢNG
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    brand TEXT NOT NULL,
    category_id INTEGER NOT NULL,
    price NUMERIC(15,0) NOT NULL,
    original_price NUMERIC(15,0),
    discount_percent INTEGER,
    image_url TEXT,
    images JSONB DEFAULT '[]',
    description TEXT,
    specs JSONB DEFAULT '{}',
    condition TEXT DEFAULT 'new',
    is_featured BOOLEAN DEFAULT false,
    in_stock BOOLEAN DEFAULT true,
    rating NUMERIC(2,1),
    review_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT,
    shipping_address TEXT NOT NULL,
    note TEXT,
    total NUMERIC(15,0) NOT NULL,
    status TEXT DEFAULT 'pending' NOT NULL,
    created_at TIMESTAMP DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS cart_items (
    id SERIAL PRIMARY KEY,
    session_id TEXT NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER DEFAULT 1 NOT NULL,
    created_at TIMESTAMP DEFAULT now() NOT NULL,
    updated_at TIMESTAMP DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'admin' NOT NULL,
    created_at TIMESTAMP DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS warranties (
    id SERIAL PRIMARY KEY,
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    product_name TEXT NOT NULL,
    serial_number TEXT,
    purchase_date TEXT NOT NULL,
    warranty_end_date TEXT NOT NULL,
    status TEXT DEFAULT 'active' NOT NULL,
    note TEXT,
    created_at TIMESTAMP DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS session (
    sid VARCHAR NOT NULL PRIMARY KEY,
    sess JSON NOT NULL,
    expire TIMESTAMP(6) NOT NULL
);

CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON session (expire);

-- 2. DỮ LIỆU DANH MỤC
INSERT INTO categories (id, name, slug, description) VALUES
(1, 'Máy Lạnh - Điều Hòa', 'may-lanh', 'Điều hòa không khí các loại, tiết kiệm điện, công nghệ hiện đại'),
(2, 'Máy Giặt', 'may-giat', 'Máy giặt cửa trước và cửa trên, nhiều dung tích phù hợp mọi gia đình'),
(3, 'Tủ Lạnh', 'tu-lanh', 'Tủ lạnh các loại, tiết kiệm điện, công nghệ làm lạnh hiện đại')
ON CONFLICT (id) DO NOTHING;

SELECT setval('categories_id_seq', (SELECT MAX(id) FROM categories));

-- 3. TÀI KHOẢN ADMIN (username: admin / password: admin123)
INSERT INTO users (username, password_hash, role) VALUES
('admin', '$2a$10$Q54T2arpr5gMTxewdwlLl.Qvr0glSVTiCHVzNGyd6X.db8ZOHJ5OS', 'admin')
ON CONFLICT (username) DO NOTHING;

-- 4. SẢN PHẨM
INSERT INTO products (name, slug, brand, category_id, price, original_price, discount_percent, description, is_featured, in_stock, rating, review_count, condition) VALUES
-- === MÁY LẠNH MỚI ===
('Điều Hòa Daikin Inverter 1 HP FTKB25XVMV', 'daikin-ftkb25xvmv', 'Daikin', 1, 9490000, 11200000, 15, 'Điều hòa Daikin inverter tiết kiệm điện, làm lạnh nhanh, hoạt động êm ái. Phù hợp phòng ngủ 10-15m².', true, true, 4.8, 124, 'new'),
('Điều Hòa LG Dual Cool 1.5 HP V13ENH', 'lg-v13enh', 'LG', 1, 11900000, 14500000, 18, 'Điều hòa LG Dual Cool công nghệ làm lạnh kép, lọc không khí PM1.0, tiết kiệm điện tối ưu. Phù hợp phòng 15-20m².', true, true, 4.7, 98, 'new'),
('Điều Hòa Panasonic Inverter 2 HP CS-XU18ZKH-8', 'panasonic-xu18zkh', 'Panasonic', 1, 15600000, 18900000, 17, 'Điều hòa Panasonic công suất 2 HP, lọc bụi mịn, kháng khuẩn nanoe-G. Phù hợp phòng khách 20-25m².', true, true, 4.6, 67, 'new'),
('Điều Hòa Samsung Wind-Free 1 HP AR09TYHYCWKNSV', 'samsung-ar09tyhycwk', 'Samsung', 1, 10800000, 13200000, 18, 'Công nghệ Wind-Free độc quyền, làm lạnh không trực tiếp, thoải mái hơn 100 lần so với điều hòa thường.', false, true, 4.5, 45, 'new'),
('Điều Hòa Mitsubishi Heavy 1.5 HP SRK13CXS-S5', 'mitsubishi-srk13cxs', 'Mitsubishi Heavy', 1, 13200000, 15800000, 16, 'Điều hòa Mitsubishi Heavy bền bỉ, tiết kiệm điện, phù hợp khí hậu nhiệt đới Việt Nam.', false, true, 4.4, 33, 'new'),
('Điều Hòa Toshiba Inverter 2 HP RAS-H18G2KCV-V', 'toshiba-ras-h18g2kcv', 'Toshiba', 1, 14500000, 17600000, 18, 'Điều hòa Toshiba 2 HP với chế độ tự làm sạch, lọc ion bạc diệt khuẩn, hoạt động ổn định.', false, true, 4.3, 28, 'new'),
-- === MÁY LẠNH CŨ ===
('Điều Hòa Daikin 1 HP Cũ - Còn tốt 80%', 'daikin-1hp-cu-01', 'Daikin', 1, 3500000, 9490000, 63, 'Máy lạnh Daikin 1 HP đã qua sử dụng, còn chạy lạnh tốt, đã vệ sinh dàn lạnh. Bảo hành cửa hàng 3 tháng.', false, true, 4.0, 7, 'used'),
('Điều Hòa Samsung 1.5 HP Cũ - Giá rẻ', 'samsung-15hp-cu-01', 'Samsung', 1, 4200000, 10800000, 61, 'Máy lạnh Samsung 1.5 HP đã qua sử dụng, hoạt động ổn, đã nạp ga kiểm tra đầy đủ. Bảo hành 3 tháng.', false, true, 3.9, 4, 'used'),
-- === MÁY GIẶT MỚI ===
('Máy Giặt Samsung Inverter 9kg WW90T3040WW', 'samsung-ww90t3040ww', 'Samsung', 2, 8490000, 10200000, 17, 'Máy giặt Samsung cửa trước 9kg, công nghệ Hygiene Steam diệt khuẩn 99.9%, tiết kiệm điện hiệu quả.', true, true, 4.7, 156, 'new'),
('Máy Giặt LG FV1409S3W 9kg Cửa Trước', 'lg-fv1409s3w', 'LG', 2, 9200000, 11500000, 20, 'Máy giặt LG cửa trước 9kg, động cơ DD thế hệ mới, Ezdispacer giảm rung lắc, giặt sạch hơn 18%.', true, true, 4.8, 203, 'new'),
('Máy Giặt Panasonic 10kg NA-FD10VR1BV Cửa Trước', 'panasonic-na-fd10vr1bv', 'Panasonic', 2, 11900000, 14800000, 20, 'Máy giặt Panasonic 10kg, công nghệ ActiveFoam diệt khuẩn từ trong lõi vải, tiết kiệm nước.', true, true, 4.6, 89, 'new'),
('Máy Giặt Aqua 8kg AQW-W80FT.W Cửa Trên', 'aqua-aqw-w80ft', 'Aqua', 2, 5200000, 6400000, 19, 'Máy giặt Aqua cửa trên 8kg, thiết kế nhỏ gọn, phù hợp gia đình nhỏ, dễ sử dụng.', false, true, 4.2, 67, 'new'),
('Máy Giặt Toshiba 8.5kg AW-M950BV Cửa Trên', 'toshiba-aw-m950bv', 'Toshiba', 2, 5900000, 7200000, 18, 'Máy giặt Toshiba cửa trên 8.5kg, lồng giặt SPA Drum, tự làm sạch lồng giặt sau mỗi chu kỳ.', false, true, 4.3, 44, 'new'),
('Máy Giặt Electrolux 11kg EWF1141AEWA Cửa Trước', 'electrolux-ewf1141aewa', 'Electrolux', 2, 13800000, 16900000, 18, 'Máy giặt Electrolux 11kg UltimateCare, công nghệ Woolmark giặt nhẹ vải cao cấp, tiết kiệm điện.', true, true, 4.5, 72, 'new'),
('Máy Giặt Casper 8.5kg WF-85I68BGB Cửa Trước', 'casper-wf-85i68bgb', 'Casper', 2, 6800000, 7900000, 14, 'Máy giặt cửa trước inverter, chế độ giặt hơi nước, tiết kiệm điện nước.', false, true, 4.5, 22, 'new'),
('Máy Giặt Midea 10kg MF100-U1401 Cửa Trước', 'midea-mf100-u1401', 'Midea', 2, 9200000, 10500000, 12, 'Máy giặt 10kg inverter cao cấp, lồng giặt khử khuẩn UV, kết nối WiFi.', true, true, 4.6, 18, 'new'),
('Máy Giặt Sharp 9kg ES-FK954SV Cửa Trên', 'sharp-es-fk954sv', 'Sharp', 2, 7100000, NULL, NULL, 'Máy giặt cửa trên 9kg, chức năng giặt nước nóng, diệt khuẩn hiệu quả.', false, true, 4.4, 31, 'new'),
('Máy Giặt Bosch 8kg WAJ20180SG Cửa Trước', 'bosch-waj20180sg', 'Bosch', 2, 12500000, 14000000, 11, 'Máy giặt cao cấp Bosch, mô-tơ EcoSilence không chổi than, êm ái bền bỉ.', true, true, 4.8, 45, 'new'),
-- === MÁY GIẶT CŨ ===
('Máy Giặt Samsung 7kg Cũ - Bao test OK', 'samsung-7kg-cu-01', 'Samsung', 2, 2200000, 8490000, 74, 'Máy giặt Samsung 7kg đã qua sử dụng, còn hoạt động tốt, đã vệ sinh sạch. Bảo hành cửa hàng 3 tháng.', false, true, 4.2, 8, 'used'),
('Máy Giặt LG 8kg Cũ - Còn mới 90%', 'lg-8kg-cu-01', 'LG', 2, 2800000, 9200000, 70, 'Máy giặt LG 8kg cửa trước đã qua sử dụng, ít hỏng, vệ sinh sạch. Bảo hành cửa hàng 3 tháng.', false, true, 4.0, 5, 'used'),
('Máy Giặt Aqua 8kg Cũ - Giá tốt', 'aqua-8kg-cu-01', 'Aqua', 2, 1800000, 5200000, 65, 'Máy giặt Aqua 8kg đã qua sử dụng, còn chạy ổn. Đã kiểm tra kỹ trước khi bán. Bảo hành 1 tháng.', false, true, 3.9, 3, 'used'),
-- === TỦ LẠNH MỚI ===
('Tủ Lạnh Samsung Inverter 300L RT29K5532S8/SV', 'samsung-rt29k5532s8', 'Samsung', 3, 8900000, 10500000, 15, 'Tủ lạnh 2 cánh inverter 300L, ngăn đá trên, công nghệ All-Around Cooling làm lạnh đều, tiết kiệm điện.', true, true, 4.7, 62, 'new'),
('Tủ Lạnh LG Inverter 254L GN-D255PS', 'lg-gn-d255ps', 'LG', 3, 7500000, NULL, NULL, 'Tủ lạnh LG 254L inverter, ngăn đá dưới, công nghệ DoorCooling+ làm lạnh nhanh từ cánh cửa.', true, true, 4.6, 48, 'new'),
('Tủ Lạnh Panasonic 234L NR-BL267PKVN', 'panasonic-nr-bl267pkvn', 'Panasonic', 3, 6400000, 7200000, 11, 'Tủ lạnh Panasonic 234L, bộ lọc kháng khuẩn Ag Clean, làm lạnh nhanh và tiết kiệm điện.', false, true, 4.5, 34, 'new'),
('Tủ Lạnh Aqua 212L AQR-D212FA(FB)', 'aqua-aqr-d212fa', 'Aqua', 3, 5100000, 5900000, 14, 'Tủ lạnh 2 cánh 212L, ngăn đá trên, phù hợp gia đình 2-3 người, tiết kiệm điện hiệu quả.', false, true, 4.3, 27, 'new'),
('Tủ Lạnh Electrolux 320L ETB3400J-H Side-by-Side', 'electrolux-etb3400j-h', 'Electrolux', 3, 14500000, 17000000, 15, 'Tủ lạnh Side-by-Side 320L cao cấp, màn hình LED, ngăn đông mềm, phù hợp gia đình đông người.', true, true, 4.8, 19, 'new'),
-- === TỦ LẠNH CŨ ===
('Tủ Lạnh Samsung 180L Cũ - Hoạt động tốt', 'samsung-180l-cu-01', 'Samsung', 3, 1900000, 6500000, 71, 'Tủ lạnh Samsung 180L đã qua sử dụng, còn lạnh tốt, đã vệ sinh sạch. Bảo hành cửa hàng 3 tháng.', false, true, 4.1, 6, 'used'),
('Tủ Lạnh LG 209L Cũ - Còn mới 85%', 'lg-209l-cu-01', 'LG', 3, 2500000, 7500000, 67, 'Tủ lạnh LG 209L đã qua sử dụng, ít dùng, còn rất tốt. Đã kiểm tra kỹ. Bảo hành cửa hàng 3 tháng.', false, true, 4.3, 4, 'used'),
('Tủ Lạnh Mini Aqua 90L Cũ - Phòng trọ', 'aqua-90l-mini-cu-01', 'Aqua', 3, 1200000, 3500000, 66, 'Tủ lạnh mini 90L phù hợp phòng trọ, ký túc xá. Đã qua sử dụng, hoạt động ổn định. Bảo hành 1 tháng.', false, true, 3.8, 9, 'used')
ON CONFLICT (slug) DO NOTHING;
