const API_BASE_URL = import.meta.env.VITE_API_URL;
const DJANGO_API_BASE_URL = import.meta.env.VITE_DJANGO_API_URL;

const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  console.log('Backend URL:', url);
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, config);
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
};

export const authAPI = {
  sendVerificationEmail: (email) => 
    fetch(`${DJANGO_API_BASE_URL}/api/send-verification-email/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    }).then(res => res.json()),
  
  verifyEmail: (token) => 
    fetch(`${DJANGO_API_BASE_URL}/api/verify-email/?token=${token}`)
      .then(res => res.json()),
  
  completeRegistration: (token, username, password) => 
    fetch(`${DJANGO_API_BASE_URL}/api/complete-registration/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, username, password }),
    }).then(res => res.json()),
};

export const productAPI = {
  getAll: () => apiRequest('/products/'),
  getNewCollection: () => apiRequest('/products/newcollection'),
  getPopularInWomen: () => apiRequest('/products/popularinwomen'),
  getPopularInMen: () => apiRequest('/products/popularinmen'),
};

export const cartAPI = {
  get: async () => {
    const token = localStorage.getItem('auth-token');
    if (!token) return {};
    
    const response = await fetch(`${API_BASE_URL}/cart/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) return {};
    
    const data = await response.json();
    const cartObj = {};
    if (data.items) {
      data.items.forEach(item => {
        cartObj[item.product] = item.quantity;
      });
    }
    return cartObj;
  },
  
  add: async (itemId) => {
    const token = localStorage.getItem('auth-token');
    if (!token) return {};
    
    console.log('Adding to cart:', itemId);
    
    const response = await fetch(`${API_BASE_URL}/cart/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ itemId }),
    });
    
    const data = await response.json();
    if (!response.ok) {
      console.error('Cart add error:', data);
    }
    return data;
  },
  
  remove: async (itemId) => {
    const token = localStorage.getItem('auth-token');
    if (!token) return {};
    
    const response = await fetch(`${API_BASE_URL}/cart/${itemId}/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    return response.json();
  },
};

export const orderAPI = {
  checkout: async (addressData) => {
    const token = localStorage.getItem('auth-token');
    if (!token) throw new Error('Not authenticated');
    
    const response = await fetch(`${API_BASE_URL}/orders/checkout/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(addressData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Checkout failed');
    }
    
    return response.json();
  },
  
  getOrders: async () => {
    const token = localStorage.getItem('auth-token');
    if (!token) return [];
    
    const response = await fetch(`${API_BASE_URL}/orders/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) return [];
    return response.json();
  },
};