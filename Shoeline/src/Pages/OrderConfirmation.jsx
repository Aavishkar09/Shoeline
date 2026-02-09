import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './css/OrderConfirmation.css';

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;

  if (!order) {
    navigate('/');
    return null;
  }

  return (
    <div className="order-confirmation">
      <div className="confirmation-container">
        <div className="success-icon">✓</div>
        <h1>Order Placed Successfully!</h1>
        <p className="confirmation-message">
          Thank you for your purchase. A receipt has been sent to your email.
        </p>

        <div className="order-details">
          <h2>Order Details</h2>
          <div className="detail-row">
            <span>Order ID:</span>
            <strong>#{order.id}</strong>
          </div>
          <div className="detail-row">
            <span>Order Date:</span>
            <strong>{new Date(order.created_at).toLocaleDateString()}</strong>
          </div>
          <div className="detail-row">
            <span>Total Amount:</span>
            <strong>&#8377;{order.total_amount}</strong>
          </div>
        </div>

        <div className="shipping-details">
          <h2>Shipping Address</h2>
          <p>{order.full_name}</p>
          <p>{order.address_line1}</p>
          {order.address_line2 && <p>{order.address_line2}</p>}
          <p>{order.city}, {order.state} {order.postal_code}</p>
          <p>{order.country}</p>
          <p>Phone: {order.phone}</p>
        </div>

        <div className="order-items">
          <h2>Order Items</h2>
          {order.items.map((item) => (
            <div key={item.id} className="order-item">
              <img src={item.product_image} alt={item.product_name} />
              <div className="item-details">
                <p className="item-name">{item.product_name}</p>
                <p className="item-quantity">Quantity: {item.quantity}</p>
              </div>
              <p className="item-price">&#8377;{item.price * item.quantity}</p>
            </div>
          ))}
        </div>

        <button onClick={() => navigate('/')} className="continue-shopping">
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default OrderConfirmation;
