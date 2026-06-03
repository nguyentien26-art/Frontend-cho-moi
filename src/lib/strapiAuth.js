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

export async function getMyProfile() {
  const token = getAuthToken();
  if (!token) return null;
  try {
    const response = await fetch(`${STRAPI_URL}/api/users/me?populate=role`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.message || 'Lỗi khi tải thông tin tài khoản');
    }
    return data;
  } catch (error) {
    console.error('Get profile error:', error);
    throw error;
  }
}

export async function createTopupRequest(amount, transactionId, note) {
  const token = getAuthToken();
  const user = getUserData();
  if (!token || !user) {
    throw new Error('Bạn chưa đăng nhập.');
  }

  try {
    const response = await fetch(`${STRAPI_URL}/api/topup-requests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        data: {
          amount: parseInt(amount, 10),
          transactionId,
          note,
          users_permissions_user: user.documentId || user.id,
          requestStatus: 'pending',
          publishedAt: new Date().toISOString(), // auto-publish in Strapi v5
        },
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.message || 'Gửi yêu cầu nạp tiền thất bại.');
    }
    return data;
  } catch (error) {
    console.error('Create topup request error:', error);
    throw error;
  }
}

export async function getTopupRequests(userId) {
  const token = getAuthToken();
  try {
    // Strapi v5 format: sort=field:asc or sort=field:desc
    console.log('Fetching all topup-requests for user:', userId);
    
    const response = await fetch(`${STRAPI_URL}/api/topup-requests?sort=createdAt:desc&pagination[limit]=100`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();
    
    console.log('API Response status:', response.status);
    console.log('API Response data:', data);
    
    if (!response.ok) {
      console.error('API Error Response:', data);
      throw new Error(data.error?.message || `Lỗi tải danh sách nạp tiền: ${response.status}`);
    }
    
    // Filter client-side cho safety
    if (data.data && Array.isArray(data.data)) {
      const filtered = data.data.filter(item => {
        const itemUserId = item.users_permissions_user?.id || item.users_permissions_user;
        return itemUserId === userId || itemUserId === parseInt(userId);
      });
      return { ...data, data: filtered };
    }
    
    return data;
  } catch (error) {
    console.error('Get topup requests error:', error);
    throw error;
  }
}

export async function updateTopupRequestStatus(documentId, status) {
  const token = getAuthToken();
  try {
    const response = await fetch(`${STRAPI_URL}/api/topup-requests/${documentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        data: {
          requestStatus: status,
        },
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.message || 'Cập nhật trạng thái thất bại');
    }
    return data;
  } catch (error) {
    console.error('Update topup status error:', error);
    throw error;
  }
}

export async function adjustUserBalance(userDocumentId, amount) {
  const token = getAuthToken();
  try {
    const response = await fetch(`${STRAPI_URL}/api/topup-requests/adjust-balance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        userDocumentId,
        amount: parseInt(amount, 10),
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.message || 'Điều chỉnh số dư thất bại');
    }
    return data;
  } catch (error) {
    console.error('Adjust user balance error:', error);
    throw error;
  }
}

export async function getAllUsers() {
  const token = getAuthToken();
  try {
    const response = await fetch(`${STRAPI_URL}/api/users?populate=role`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.message || 'Lỗi khi tải danh sách người dùng');
    }
    return data;
  } catch (error) {
    console.error('Get all users error:', error);
    throw error;
  }
}

