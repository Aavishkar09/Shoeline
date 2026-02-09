import React from 'react'
import './ListProduct.css'
import { useProducts, useDeleteProduct } from '../../hooks/useProducts'

const ListProduct = () => {
  // Use TanStack Query for data fetching
  const { 
    data: allproducts = [], 
    isLoading, 
    isError, 
    error,
    refetch 
  } = useProducts();

  // Use mutation for deleting products
  const deleteProductMutation = useDeleteProduct({
    onSuccess: () => {
      // Optional: Show success message
      console.log('Product deleted successfully');
    },
    onError: (error) => {
      // Optional: Show error message
      console.error('Failed to delete product:', error.message);
      alert('Failed to delete product. Please try again.');
    },
  });

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProductMutation.mutate(id);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className='list-product'>
        <h1>All Product List</h1>
        <div className="loading-state">
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className='list-product'>
        <h1>All Product List</h1>
        <div className="error-state">
          <p>Error loading products: {error?.message || 'Unknown error'}</p>
          <button onClick={() => refetch()} className="retry-btn">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='list-product'>
      <h1>All Product List</h1>
      <div className="product-table">
        <div className="table-header">
          <div className="header-cell">Product name</div>
          <div className="header-cell">Category</div>
          <div className="header-cell">Price</div>
          <div className="header-cell">Stock</div>
          <div className="header-cell">Size</div>
          <div className="header-cell">Action</div>
        </div>
        <div className="table-body">
          {allproducts.length === 0 ? (
            <div className="empty-state">
              <p>No products found</p>
            </div>
          ) : (
            allproducts.map((product, index) => {
              const isDeleting = deleteProductMutation.isLoading && 
                               deleteProductMutation.variables === product.id;
              
              return (
                <div key={product.id || index} className={`table-row ${isDeleting ? 'deleting' : ''}`}>
                  <div className="product-info">
                    <img src={product.image} alt={product.name} className='product-image'/>
                    <span className="product-name">{product.name}</span>
                  </div>
                  <div className="product-description">{product.category}</div>
                  <div className="product-price">€{product.new_price}</div>
                  <div className="product-stock">
                    <span className={`stock-badge ${product.available ? 'in-stock' : 'out-of-stock'}`}>
                      {product.available ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                  <div className="product-size">
                    {product.size_inventory ? 
                      Object.keys(product.size_inventory).filter(size => product.size_inventory[size] > 0).join(', ') || 'S,M,L,XL'
                      : 'S,M,L,XL'
                    }
                  </div>
                  <div className="product-actions">
                    <button className="edit-btn" disabled={isDeleting}>Edit</button>
                    <button 
                      className="delete-btn" 
                      onClick={() => handleDeleteProduct(product.id)}
                      disabled={isDeleting}
                    >
                      {isDeleting ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}

export default ListProduct
