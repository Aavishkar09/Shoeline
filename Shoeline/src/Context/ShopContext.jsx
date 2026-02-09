import React, { createContext, useState } from "react";
import { useProducts, useCart, useAddToCart, useRemoveFromCart } from '../hooks/useProducts';

export const ShopContext = createContext(null);

const getDefaultCart = () => {
    let cart = {};
    for(let index = 0; index < 300+1; index++){
        cart[index] = 0;
    }
    return cart;
}

const ShopContextProvider = (props) => {
    const { data: all_product = [] } = useProducts();
    const { data: cartItems = getDefaultCart() } = useCart();
    const addToCartMutation = useAddToCart();
    const removeFromCartMutation = useRemoveFromCart();
    
    const [localCartItems, setLocalCartItems] = useState(getDefaultCart());

    const addToCart = (itemId) => {
        if(localStorage.getItem('auth-token')){
            addToCartMutation.mutate(itemId);
        } else {
            setLocalCartItems((prev) => ({...prev, [itemId]: prev[itemId] + 1}));
        }
    }

    const removeFromCart = (itemId) => {
        if(localStorage.getItem('auth-token')){
            removeFromCartMutation.mutate(itemId);
        } else {
            setLocalCartItems((prev) => ({...prev, [itemId]: prev[itemId] - 1}));
        }
    }

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        const currentCart = localStorage.getItem('auth-token') ? cartItems : localCartItems;
        for(const item in currentCart){
            if(currentCart[item] > 0){
                let iteminfo = all_product.find((product) => product.id === Number(item));
                if(iteminfo) {
                    totalAmount += iteminfo.new_price * currentCart[item];
                }
            }
        }
        return totalAmount;
    }

    const getTotalCartItems = () => {
        let totalItem = 0;
        const currentCart = localStorage.getItem('auth-token') ? cartItems : localCartItems;
        for(const item in currentCart){
            if(currentCart[item] > 0){
                totalItem += currentCart[item];
            }
        }
        return totalItem;
    }
    
    const currentCart = localStorage.getItem('auth-token') ? cartItems : localCartItems;
    const contextValue = {
        getTotalCartItems,
        getTotalCartAmount,
        all_product,
        cartItems: currentCart,
        addToCart,
        removeFromCart
    };

    return (
        <ShopContext.Provider value = {contextValue}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;