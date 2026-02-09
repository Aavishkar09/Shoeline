import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CheckoutForm.css';

const CheckoutForm = ({ totalAmount, onSubmit }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'India'
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-form-container">
      <h2>Shipping Address</h2>
      <form onSubmit={handleSubmit} className="checkout-form">
        <div className="form-group">
          <label>Full Name *</label>
          <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} required />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Email *</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Phone *</label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
          </div>
        </div>

        <div className="form-group">
          <label>Address Line 1 *</label>
          <input type="text" name="address_line1" value={formData.address_line1} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Address Line 2</label>
          <input type="text" name="address_line2" value={formData.address_line2} onChange={handleChange} />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>City *</label>
            <input type="text" name="city" value={formData.city} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>State *</label>
            <input type="text" name="state" value={formData.state} onChange={handleChange} required />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Postal Code *</label>
            <input type="text" name="postal_code" value={formData.postal_code} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Country *</label>
            <input type="text" name="country" value={formData.country} onChange={handleChange} required />
          </div>
        </div>

        <div className="order-summary">
          <h3>Order Total: <span>&#8377;{totalAmount}</span></h3>
        </div>

        <div className="form-actions">
          <button type="button" onClick={() => navigate('/cart')} className="btn-secondary">Back to Cart</button>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Processing...' : 'Buy Now'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CheckoutForm;
