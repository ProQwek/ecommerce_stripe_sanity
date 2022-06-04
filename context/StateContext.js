import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from 'react-hot-toast'

const Context = createContext();

export const StateContext = ({ children }) => {
    const [showCart, setShowCart] = useState(false)
    const [cartItems, setCartItems] = useState([])
    const [totalPrice, setTotalPrice] = useState(0)
    const [totalQuantities, setTotalQuantities] = useState(0)
    const [qty, setQty] = useState(1)

    let foundProduct;
    let index;

    const onAdd = (product, quantity) => {
        const checkProductInCart = cartItems.find((item) => item._id === product._id)

        setTotalPrice((prevTotalPrice) => prevTotalPrice + product.price * quantity)
        setTotalQuantities((prevTotalQuanities) => prevTotalQuanities + quantity)

        if (checkProductInCart) {

            const updatedCartItems = cartItems.map((cartProduct) => {
                if (cartProduct._id === product._id) {
                    return {
                        ...cartProduct,
                        quantity: cartProduct.quantity + quantity
                    }
                }
            })
            setCartItems(updatedCartItems)

        } else {
            product.quantity = quantity
            setCartItems([...cartItems, { ...product }])
        }
        toast.success(`${qty} ${product.name} added to the cart.`);
    }

     const onRemove=(id)=>{
         foundProduct = cartItems.find(item=>item._id===id)
         const updatedCartItems = cartItems.filter(item=>item._id!==id)
        
        setTotalPrice(prevTotalPrice=> prevTotalPrice-foundProduct.price*foundProduct.quantity)
        setTotalQuantities(prevTotalQuanities=>prevTotalQuanities-foundProduct.quantity)
        setCartItems(updatedCartItems)
     }
    const toggleCartItemQuantity = (id, value) => {
        index = cartItems.findIndex((product) => product._id === id)
        const newCartItems = [...cartItems]
        const newCartItem = { ...cartItems[index] }
        if (value === 'inc') { 
            newCartItem.quantity += 1
            newCartItems[index] = newCartItem
            setCartItems(newCartItems)
            setTotalPrice((prevTotalPrice) =>  prevTotalPrice + newCartItem.price )
            setTotalQuantities((prevTotalQuanities) => prevTotalQuanities + 1)
        } else if (value === 'dec') {
            if (newCartItem.quantity > 1) {
                newCartItem.quantity -= 1
                newCartItems[index] = newCartItem
                setCartItems(newCartItems)
                setTotalPrice((prevTotalPrice) =>  prevTotalPrice - newCartItem.price )
                setTotalQuantities((prevTotalQuanities) => prevTotalQuanities - 1)
            }else{
                toast("STOP, YOU CAN'T GO BELLOW 1")
            }

        }
    }
    const incQty = () => {
        setQty((prevQty) => prevQty + 1)
    }
    const decQty = () => {
        setQty((prevQty) => {
            if (prevQty - 1 < 1) return 1
            return prevQty - 1
        })
    }
    return <Context.Provider value={{
        showCart,
        cartItems,
        totalPrice,
        totalQuantities,
        qty,
        incQty,
        decQty,
        onAdd,
        showCart,
        setShowCart,
        toggleCartItemQuantity,
        onRemove,
        setCartItems,
        setTotalPrice,
        setTotalQuantities
    }}>
        {children}
    </Context.Provider>
}

export const useStateContext = () => useContext(Context)