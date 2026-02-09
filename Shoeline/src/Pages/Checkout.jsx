import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import CheckoutForm from '../Component/CheckoutForm/CheckoutForm';
import { ShopContext } from '../Context/ShopContext';
import { orderAPI } from '../services/api';

const Checkout = () => {
  const { getTotalCartAmount } = useContext(ShopContext);
  const navigate = useNavigate();
  const totalAmount = getTotalCartAmount();

  const handleCheckout = async (formData) => {
    const token = localStorage.getItem('auth-token');
    if (!token) {
      navigate('/login');
      return;
    }

    const order = await orderAPI.checkout(formData);
    navigate('/order-confirmation', { state: { order } });
  };

  return (
    <div>
      <CheckoutForm totalAmount={totalAmount} onSubmit={handleCheckout} />
    </div>
  );
};

export default Checkout;
