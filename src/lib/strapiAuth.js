// Strapi v5 Authentication API Client
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export async function registerUser(userData) {
  try {
    const response = await fetch(`${STRAPI_URL}/api/auth/local/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: userData.username,
        email: userData.email,
        password: userData.password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || data.message || 'Đăng ký thất bại');
    }

    return data;
  } catch (error) {
    throw error;
  }
}

export async function loginUser(credentials) {
  try {
    // Strapi v5 uses /api/auth/local for login
    const response = await fetch(`${STRAPI_URL}/api/auth/local`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        identifier: credentials.email,
        password: credentials.password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || data.message || 'Đăng nhập thất bại');
    }

    // Log để debug
    console.log('Login response:', data);
    console.log('User object:', data.user);

    // Strapi v5 không trả về role mặc định
    // Sử dụng email để xác định role tạm thời
    const email = data.user.email;
    let roleType = 'authenticated'; // Mặc định là user thường

    // Cấu hình email moderator
    if (email === 'moderator@gmail.com') {
      roleType = 'moderator';
    }

    data.user.role = { type: roleType };
    console.log('User role determined by email:', data.user.role);

    return data;
  } catch (error) {
    throw error;
  }
}

export function saveAuthToken(token) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('strapi_token', token);
  }
}

export function getAuthToken() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('strapi_token');
  }
  return null;
}

export function removeAuthToken() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('strapi_token');
  }
}

export function saveUserData(user) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('strapi_user', JSON.stringify(user));
  }
}

export function getUserData() {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('strapi_user');
    return user ? JSON.parse(user) : null;
  }
  return null;
}

export function getUserRole() {
  const user = getUserData();
  if (user && user.role) {
    // Strapi v5 trả về role với cấu trúc khác nhau
    // Có thể là user.role.type, user.role.name, hoặc user.role.id
    return user.role.type || user.role.name || user.role.id?.toString();
  }
  return null;
}

export function canPost() {
  const token = getAuthToken();
  // Tất cả user đã đăng nhập đều có thể đăng tin
  return !!token;
}

export function canModerate() {
  const role = getUserRole();
  // Log để debug
  console.log('Current role:', role);
  return role === 'moderator';
}

export function isAdmin() {
  const role = getUserRole();
  return role === 'admin';
}

export function removeUserData() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('strapi_user');
  }
}

// Hàm set role thủ công cho testing
export function setUserRole(role) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('user_role', role);
    // Cập nhật user data trong localStorage
    const user = getUserData();
    if (user) {
      user.role = { type: role };
      saveUserData(user);
    }
  }
}

export function getUserRoleFromStorage() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('user_role');
  }
  return null;
}

export async function createProduct(productData) {
  const token = getAuthToken();
  try {
    // Nếu có category, cần lấy category ID từ Strapi
    let dataToSend = { ...productData };

    if (productData.category) {
      // Fetch category ID từ Strapi
      const categoryResponse = await fetch(`${STRAPI_URL}/api/categories?filters[name][$eq]=${encodeURIComponent(productData.category)}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const categoryData = await categoryResponse.json();

      if (categoryResponse.ok && categoryData.data && categoryData.data.length > 0) {
        // Gửi category ID thay vì tên
        dataToSend.categories = categoryData.data[0].id;
        delete dataToSend.category;
      }
    }

    // Convert description to Rich text block structure cho Strapi v5
    if (productData.description) {
      dataToSend.description = [
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              text: productData.description
            }
          ]
        }
      ];
    }

    // Upload ảnh nếu có
    let imageIds = [];
    if (productData.images && productData.images.length > 0) {
      for (const imageFile of productData.images) {
        const formData = new FormData();
        formData.append('files', imageFile);
        formData.append('field', 'image');
        formData.append('refId', 'upload');
        formData.append('ref', 'plugin::upload.file');

        const uploadResponse = await fetch(`${STRAPI_URL}/api/upload`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        });

        const uploadData = await uploadResponse.json();
        if (uploadResponse.ok && uploadData && uploadData.length > 0) {
          imageIds.push(uploadData[0].id);
        }
      }
      dataToSend.image = imageIds;
    }

    delete dataToSend.images;

    // Tạm thời bỏ productStatus để xem có bắt buộc không
    // Nếu Strapi có default value, nó sẽ tự set
    // dataToSend.productStatus = 'pending';

    const response = await fetch(`${STRAPI_URL}/api/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        data: dataToSend,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Strapi error:', data);
      console.error('Error details:', JSON.stringify(data, null, 2));
      throw new Error(data.error?.message || data.message || 'Đăng tin thất bại');
    }

    return data;
  } catch (error) {
    console.error('Create product error:', error);
    throw error;
  }
}

export async function getProducts(filters = {}) {
  try {
    const queryString = new URLSearchParams(filters).toString();
    // Thêm populate=* để lấy đầy đủ thông tin bao gồm categories
    const response = await fetch(`${STRAPI_URL}/api/products?${queryString}&populate=*`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || data.message || 'Lỗi khi lấy danh sách tin');
    }

    return data;
  } catch (error) {
    throw error;
  }
}

export async function updateProduct(productId, productData) {
  const token = getAuthToken();
  try {
    console.log('Updating product:', productId, 'with data:', productData);
    // Strapi v5 dùng documentId thay vì id cho PUT endpoint
    const response = await fetch(`${STRAPI_URL}/api/products/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        data: productData,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Strapi update error:', data);
      console.error('Error details:', JSON.stringify(data, null, 2));
      throw new Error(data.error?.message || data.message || 'Cập nhật tin thất bại');
    }

    return data;
  } catch (error) {
    console.error('Update product error:', error);
    throw error;
  }
}
