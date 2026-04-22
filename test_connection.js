require('dotenv').config({ path: '.env.local' });

async function testStrapi() {
    console.log('--- BẮT ĐẦU KIỂM TRA ---');

    const baseUrl = process.env.STRAPI_URL || 'http://localhost:1337';
    const token = process.env.STRAPI_API_TOKEN;
    const collection = 'products'; 

    // Chuẩn hóa URL để tránh lỗi dư dấu xuyệt hoặc thiếu /api
    const cleanBaseUrl = baseUrl.replace(/\/$/, "").replace(/\/api$/, "");
    const finalUrl = `${cleanBaseUrl}/api/${collection}`;

    console.log(`Đang gọi: ${finalUrl}`);

    if (!token) {
        console.error('❌ Lỗi: Không tìm thấy STRAPI_API_TOKEN trong .env.local');
        return;
    }

    try {
        const response = await fetch(finalUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        console.log(`Trạng thái: ${response.status} ${response.statusText}`);

        const result = await response.json();

        if (response.ok) {
            console.log('✅ KẾT NỐI THÀNH CÔNG!');
            console.log('Dữ liệu mẫu:', JSON.stringify(result.data ? (Array.isArray(result.data) ? result.data[0] : result.data) : result, null, 2));
        } else {
            console.error('❌ KẾT NỐI THẤT BẠI!');
            console.error('Chi tiết lỗi từ Strapi:', JSON.stringify(result.error || result, null, 2));
        }
    } catch (error) {
        console.error('❌ LỖI HỆ THỐNG:');
        console.error(error.message);
    }
}

// Gọi hàm chạy
testStrapi();