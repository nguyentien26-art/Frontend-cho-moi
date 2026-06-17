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

    const email = data.user.email;
    let roleType = 'authenticated';

    if (email === 'moderator@gmail.com') {
      roleType = 'moderator';
    }

    data.user.role = { type: roleType };
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
    return user.role.type || user.role.name || user.role.id?.toString();
  }
  return null;
}

export function canPost() {
  const token = getAuthToken();
  return !!token;
}

export function canModerate() {
  const role = getUserRole();
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

export function setUserRole(role) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('user_role', role);
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
    let dataToSend = { ...productData };

    // Handle relational category parsing dynamically
    if (productData.category) {
      const categoryResponse = await fetch(`${STRAPI_URL}/api/categories?filters[name][$eq]=${encodeURIComponent(productData.category)}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const categoryData = await categoryResponse.json();
      // v5 flat list validation
      const categoriesList = categoryData.data || categoryData;

      if (categoryResponse.ok && categoriesList && categoriesList.length > 0) {
        dataToSend.categories = categoriesList[0].id;
        delete dataToSend.category;
      }
    }

    // Standard block format compilation for rich text
    if (productData.description && !Array.isArray(productData.description)) {
      dataToSend.description = [
        {
          type: 'paragraph',
          children: [{ type: 'text', text: productData.description }]
        }
      ];
    }

    // FIXED: Image Multi-part Upload Pipeline
    let imageIds = [];
    if (productData.images && productData.images.length > 0) {
      for (const imageFile of productData.images) {
        const formData = new FormData();
        formData.append('files', imageFile);

        const uploadResponse = await fetch(`${STRAPI_URL}/api/upload`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            // CRITICAL: NO 'Content-Type' header here. The browser needs to construct it naturally!
          },
          body: formData,
        });

        const uploadData = await uploadResponse.json();
        if (uploadResponse.ok && uploadData && uploadData.length > 0) {
          imageIds.push(uploadData[0].id);
        } else {
          console.error("Failed to upload image file asset:", uploadData);
        }
      }
      dataToSend.images = imageIds; 
    }
    dataToSend.image = imageIds;
    delete dataToSend.images;
    // Explicit fallback for moderation system compliance
    if (!dataToSend.productStatus) {
      dataToSend.productStatus = 'pending';
    }

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
      console.error('Strapi creation trace details:', JSON.stringify(data, null, 2));
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
      throw new Error(data.error?.message || data.message || 'Cập nhật tin thất bại');
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getMyProfile() {
  const token = getAuthToken();
  try {
    const response = await fetch(`${STRAPI_URL}/api/users/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.message || data.message || 'Lỗi khi lấy thông tin người dùng');
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function createTopupRequest(amount, transactionId, note) {
  const token = getAuthToken();
  const user = getUserData();
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
          users_permissions_user: user.id,
          requestStatus: 'pending',
        },
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.message || data.message || 'Lỗi khi tạo yêu cầu nạp tiền');
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export const getTopupRequests = async (userId) => {
  try {
    const token = getAuthToken();
    if (!token) return { data: [] };

    // Fetch the raw history data cleanly without complex deep backend filters
    const res = await fetch(`http://localhost:1337/api/topup-requests?sort=createdAt:desc`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });

    if (!res.ok) {
      console.warn(`Strapi Topup API endpoint returned status: ${res.status}`);
      return { data: [] };
    }
    
    const json = await res.json();
    const rawData = json?.data || [];

    // Filter by the logged-in user's ID manually right here on the frontend
    if (userId) {
      return {
        data: rawData.filter(item => {
          // Check standard relational structures in Strapi v5 flat data blocks
          const itemUserId = item.user?.id || item.userId || item.user;
          return Number(itemUserId) === Number(userId);
        })
      };
    }
    
    return { data: rawData };
  } catch (error) {
    console.error('getTopupRequests Error:', error);
    return { data: [] };
  }
};