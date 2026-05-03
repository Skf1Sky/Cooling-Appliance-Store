export const MOCK_CATEGORIES = [
  { id: 1, name: "Máy Lạnh", description: "Điều hòa nhiệt độ chính hãng, tiết kiệm điện." },
  { id: 2, name: "Máy Giặt", description: "Máy giặt lồng ngang, lồng đứng các loại." },
  { id: 3, name: "Tủ Lạnh", description: "Tủ lạnh Inverter, dung tích lớn cho gia đình." },
];

export const MOCK_PRODUCTS = [
  {
    id: 1,
    categoryId: 1,
    name: "Máy lạnh Daikin Inverter 1.5 HP",
    description: "Máy lạnh Daikin dòng FTKM cao cấp, tiết kiệm điện vượt trội.",
    price: "12500000",
    originalPrice: "14000000",
    image: "/images/product-ac-1.png",
    featured: true,
    condition: "new",
    specs: { "Công suất": "1.5 HP", "Công nghệ": "Inverter", "Gas": "R32" }
  },
  {
    id: 2,
    categoryId: 1,
    name: "Máy lạnh Panasonic 1.0 HP (Đã qua sử dụng)",
    description: "Máy lạnh Panasonic nội địa Nhật, làm lạnh nhanh, máy còn mới 90%.",
    price: "4500000",
    originalPrice: "6000000",
    image: "/images/product-ac-2.png",
    featured: true,
    condition: "used",
    specs: { "Công suất": "1.0 HP", "Tình trạng": "90%", "Bảo hành": "6 tháng" }
  },
  {
    id: 3,
    categoryId: 2,
    name: "Máy giặt LG TurboWash 9kg",
    description: "Máy giặt lồng ngang LG với công nghệ giặt hơi nước diệt khuẩn.",
    price: "8900000",
    originalPrice: "10500000",
    image: "/images/category-wm.png",
    featured: true,
    condition: "new",
    specs: { "Khối lượng": "9 kg", "Động cơ": "Truyền động trực tiếp" }
  },
  {
    id: 4,
    categoryId: 3,
    name: "Tủ lạnh Samsung Inverter 300L",
    description: "Tủ lạnh 2 cửa Samsung, ngăn đông dưới, giữ thực phẩm tươi ngon.",
    price: "11000000",
    originalPrice: "13500000",
    image: "/images/category-ac.png",
    featured: true,
    condition: "new",
    specs: { "Dung tích": "300 Lít", "Kiểu tủ": "Ngăn đông dưới" }
  }
];
