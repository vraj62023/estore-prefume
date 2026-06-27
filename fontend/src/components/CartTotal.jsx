import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title'

const CartTotal = () => {
    const { currency, delivery_fee, getCartAmount, discount, appliedCoupon } = useContext(ShopContext);

    const subtotal = getCartAmount();
    const discountAmount = subtotal * discount;
    const shippingFee = subtotal === 0 ? 0 : delivery_fee;
    const finalTotal = subtotal === 0 ? 0 : subtotal - discountAmount + shippingFee;

    return (
        <div className='w-full'>
            <div className='text-2xl'>
                <Title text1={'CART'} text2={'TOTALS'} />
            </div>
            <div className='flex flex-col gap-2 mt-2 text-sm'>
                <div className='flex justify-between text-gray-600'>
                    <p>Subtotal</p>
                    <p>{currency} {subtotal.toFixed(2)}</p>
                </div>
                <hr className='border-gray-150/40' />
                
                {discount > 0 && (
                    <>
                        <div className='flex justify-between text-green-600 font-semibold animate-pulse'>
                            <p>Discount ({appliedCoupon})</p>
                            <p>- {currency} {discountAmount.toFixed(2)}</p>
                        </div>
                        <hr className='border-gray-150/40' />
                    </>
                )}

                <div className='flex justify-between text-gray-600'>
                    <p>Shipping Fee</p>
                    <p>{currency} {shippingFee.toFixed(2)}</p>
                </div>
                <hr className='border-gray-150/40' />
                
                <div className='flex justify-between text-gray-900'>
                    <b className='text-base'>Total</b>
                    <b className='text-base text-black'>{currency} {finalTotal.toFixed(2)}</b>
                </div>
            </div>
        </div>
    )
}

export default CartTotal;