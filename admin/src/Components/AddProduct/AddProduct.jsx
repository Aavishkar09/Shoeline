import React, { useState } from 'react'
import './AddProduct.css'
import upload_area from '../../assets/upload_area.svg'
import { useCreateProduct, useUploadImage } from '../../hooks/useProducts'

const AddProduct = () => {
    const [image, setImage] = useState(false);
    const [productDetails, setProductDetails] = useState({
        name: "",
        image: "",
        category: "men",
        new_price: "",
        old_price: "",
        color: [],
        type: "",
        available: true
    })
    
    const [sizeInventory, setSizeInventory] = useState({});
    const [colorInput, setColorInput] = useState("");
    
    // TanStack Query mutations
    const uploadImageMutation = useUploadImage({
        onSuccess: (data) => {
            console.log('Image uploaded successfully:', data.image_url);
        },
        onError: (error) => {
            console.error('Image upload failed:', error.message);
            alert('Image upload failed. Please try again.');
        },
    });

    const createProductMutation = useCreateProduct({
        onSuccess: (data) => {
            console.log('Product created successfully:', data);
            alert('Product Added Successfully!');
            // Reset form
            resetForm();
        },
        onError: (error) => {
            console.error('Product creation failed:', error.message);
            alert('Failed to add product. Please try again.');
        },
    });
    
    const resetForm = () => {
        setProductDetails({
            name: "",
            image: "",
            category: "men",
            new_price: "",
            old_price: "",
            color: [],
            type: "",
            available: true
        });
        setSizeInventory({});
        setImage(false);
        setColorInput("");
    };
    
    const imageHandler = (e) => {
        setImage(e.target.files[0]);
    }

    const changeHandler = (e) => {
        const { name, value, type, checked } = e.target;
        setProductDetails({
            ...productDetails,
            [name]: type === 'checkbox' ? checked : value
        });
    }
    
    const handleSizeInventoryChange = (size, quantity) => {
        setSizeInventory({
            ...sizeInventory,
            [size]: parseInt(quantity) || 0
        });
    }
    
    const addColor = () => {
        if (colorInput.trim() && !productDetails.color.includes(colorInput.trim())) {
            setProductDetails({
                ...productDetails,
                color: [...productDetails.color, colorInput.trim()]
            });
            setColorInput("");
        }
    }
    
    const removeColor = (colorToRemove) => {
        setProductDetails({
            ...productDetails,
            color: productDetails.color.filter(color => color !== colorToRemove)
        });
    }

    const handleAddProduct = async () => {
        // Validation
        if (!productDetails.name.trim()) {
            alert('Please enter product name');
            return;
        }
        if (!productDetails.new_price.trim()) {
            alert('Please enter product price');
            return;
        }
        if (!image) {
            alert('Please select an image');
            return;
        }

        try {
            // First upload the image
            const uploadResult = await uploadImageMutation.mutateAsync(image);
            
            if (uploadResult.success) {
                // Then create the product with the uploaded image URL
                const productData = {
                    ...productDetails,
                    image: uploadResult.image_url,
                    size_inventory: sizeInventory
                };
                
                await createProductMutation.mutateAsync(productData);
            }
        } catch (error) {
            // Error handling is done in mutation callbacks
            console.error('Add product process failed:', error);
        }
    };

    const isLoading = uploadImageMutation.isLoading || createProductMutation.isLoading;

    return (
        <div className='add-product'>
            <div className='addproduct-itemfield'>
                <p>Product Title</p>
                <input 
                    value={productDetails.name} 
                    onChange={changeHandler} 
                    type='text' 
                    name='name' 
                    placeholder='Type here'
                    disabled={isLoading}
                />
            </div>
            <div className="addproduct-price">
                <div className="addproduct-itemfield">
                    <p>Price</p>
                    <input 
                        value={productDetails.old_price} 
                        onChange={changeHandler} 
                        type='text' 
                        name='old_price' 
                        placeholder='Type here'
                        disabled={isLoading}
                    />
                </div>
                <div className="addproduct-itemfield">
                    <p>Offer Price</p>
                    <input 
                        value={productDetails.new_price} 
                        onChange={changeHandler} 
                        type='text' 
                        name='new_price' 
                        placeholder='Type here'
                        disabled={isLoading}
                    />
                </div>
            </div>
            <div className="addproduct-itemfield">
                <p>Product Category</p>
                <select 
                    value={productDetails.category} 
                    onChange={changeHandler} 
                    name='category' 
                    className='add-product-selector'
                    disabled={isLoading}
                >
                    <option value='men'>Men</option>
                    <option value='women'>Women</option>
                    <option value='kid'>Kid</option>
                </select>
            </div>
            <div className="addproduct-itemfield">
                <p>Product Type</p>
                <input 
                    value={productDetails.type} 
                    onChange={changeHandler} 
                    type='text' 
                    name='type' 
                    placeholder='e.g., Sneakers, Boots, Sandals'
                    disabled={isLoading}
                />
            </div>
            <div className="addproduct-itemfield">
                <p>Size Inventory</p>
                <div className="size-inventory-grid">
                    {["6", "7", "8", "9", "10", "11", "12"].map(size => (
                        <div key={size} className="size-inventory-item">
                            <label>Size {size}:</label>
                            <input 
                                type="number" 
                                min="0"
                                value={sizeInventory[size] || 0}
                                onChange={(e) => handleSizeInventoryChange(size, e.target.value)}
                                placeholder="Qty"
                                disabled={isLoading}
                            />
                        </div>
                    ))}
                </div>
            </div>
            <div className="addproduct-itemfield">
                <p>Colors</p>
                <div className="color-input-container">
                    <input 
                        value={colorInput} 
                        onChange={(e) => setColorInput(e.target.value)} 
                        type='text' 
                        placeholder='Enter color (e.g., Black, White, Red)'
                        onKeyPress={(e) => e.key === 'Enter' && addColor()}
                        disabled={isLoading}
                    />
                    <button 
                        type="button" 
                        onClick={addColor} 
                        className="add-btn"
                        disabled={isLoading}
                    >
                        Add
                    </button>
                </div>
                <div className="tags-container">
                    {productDetails.color.map((color, index) => (
                        <span key={index} className="tag">
                            {color}
                            <button 
                                type="button" 
                                onClick={() => removeColor(color)} 
                                className="remove-tag"
                                disabled={isLoading}
                            >
                                ×
                            </button>
                        </span>
                    ))}
                </div>
            </div>
            <div className="addproduct-itemfield">
                <label className="checkbox-container">
                    <input 
                        type="checkbox" 
                        name="available" 
                        checked={productDetails.available} 
                        onChange={changeHandler}
                        disabled={isLoading}
                    />
                    <span className="checkmark"></span>
                    Product Available
                </label>
            </div>
            <div className="addproduct-itemfield">
                <label htmlFor='file-input'>
                    <img 
                        src={image ? URL.createObjectURL(image) : upload_area} 
                        className='addproduct-thumnail-img' 
                        alt=''
                    />
                </label>
                <input 
                    onChange={imageHandler} 
                    type='file' 
                    name='image' 
                    id='file-input' 
                    hidden
                    disabled={isLoading}
                />
            </div>
            <button 
                onClick={handleAddProduct} 
                className={`addproduct-btn ${isLoading ? 'loading' : ''}`}
                disabled={isLoading}
            >
                {isLoading ? 'Adding Product...' : 'ADD'}
            </button>
            
            {/* Loading indicator */}
            {isLoading && (
                <div className="loading-indicator">
                    <p>
                        {uploadImageMutation.isLoading ? 'Uploading image...' : 'Creating product...'}
                    </p>
                </div>
            )}
        </div>
    )
}

export default AddProduct