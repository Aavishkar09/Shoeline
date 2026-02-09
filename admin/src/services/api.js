const API_URL = import.meta.env.VITE_API_URL;

// Utility function to get cookie value
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
};

// API Error class for better error handling
class APIError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.data = data;
  }
}

// Base API client with error handling
const apiClient = async (endpoint, options = {}) => {
  const token = getCookie('auth-token');
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new APIError(
        errorData.message || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        errorData
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError('Network error occurred', 0, { originalError: error });
  }
};

// Product API service
export const productAPI = {
  // Get all products
  getAll: async () => {
    return apiClient('/products/');
  },

  // Delete product by ID
  delete: async (id) => {
    return apiClient(`/products/${id}/`, {
      method: 'DELETE',
    });
  },

  // Create new product
  create: async (productData) => {
    return apiClient('/products/', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  },

  // Update product
  update: async (id, productData) => {
    return apiClient(`/products/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  },
};

// Upload API service
export const uploadAPI = {
  uploadImage: async (imageFile) => {
    const token = getCookie('auth-token');
    const formData = new FormData();
    formData.append('product', imageFile);

    const response = await fetch(`${API_URL}/upload/`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new APIError(
        errorData.message || 'Upload failed',
        response.status,
        errorData
      );
    }

    return await response.json();
  },
};