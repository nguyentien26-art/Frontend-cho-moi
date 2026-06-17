// Dữ liệu giả cho sản phẩm (sau này sẽ thay bằng data từ Strapi)

export const mockProducts = [
  { 
    id: "1", 
    title: 'Xe Honda Wave Alpha 2021 chính chủ', 
    price: 12500000, 
    location: 'Hà Nội', 
    timeAgo: '2 giờ trước', 
    image: 'https://placehold.co/800x600/orange/white?text=Xe+Wave',
    description: "Xe gia đình sử dụng kỹ, bảo dưỡng định kỳ tại hãng. Máy móc nguyên bản.",
    seller: { name: "Nguyễn Văn An", avatar: "https://placehold.co/100x100/orange/white?text=An" }
  },
  { 
    id: "2", 
    title: 'MacBook Pro M1 2020 8GB Ram', 
    price: 16800000, 
    location: 'TP.HCM', 
    timeAgo: '5 giờ trước', 
    image: 'https://placehold.co/800x600/gray/white?text=MacBook',
    description: "Máy đẹp 99%, pin còn tốt, sạc cáp zin theo máy. Mọi chức năng hoàn hảo.",
    seller: { name: "Trần Minh Tâm", avatar: "https://placehold.co/100x100/blue/white?text=Tam" }
  },
  { 
    id: "3", 
    title: 'Cho thuê phòng trọ khép kín giá rẻ', 
    price: 3500000, 
    location: 'TP.HCM', 
    timeAgo: '1 ngày trước', 
    image: 'https://placehold.co/800x600/green/white?text=Phong+Tro',
    description: "Phòng mới sơn sửa, có gác lửng, giờ giấc tự do, an ninh đảm bảo.",
    seller: { name: "Chị Hoa", avatar: "https://placehold.co/100x100/green/white?text=Hoa" }
  }
];