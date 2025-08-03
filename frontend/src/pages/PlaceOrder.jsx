import React, { useContext, useState, useRef } from 'react'
import Title from '../component/Title'
import CartTotal from '../component/CartTotal'
import razorpay from '../assets/Razorpay.jpg'
import { shopDataContext } from '../context/ShopContext'
import { authDataContext } from '../context/authContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Loading from '../component/Loading'

function PlaceOrder() {
    const [method, setMethod] = useState('cod')
    const navigate = useNavigate()
    const { cartItem, setCartItem, getCartAmount, delivery_fee, products } = useContext(shopDataContext)
    const { serverUrl } = useContext(authDataContext)
    const [loading, setLoading] = useState(false)
    const [isPaymentInProgress, setIsPaymentInProgress] = useState(false)
    const paymentInstance = useRef(null)

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        street: '',
        city: '',
        state: '',
        pinCode: '',
        country: '',
        phone: ''
    })

    const onChangeHandler = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setFormData(data => ({ ...data, [name]: value }))
    }

    const initPay = (order) => {
        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: order.amount,
            currency: order.currency,
            name: 'Order Payment',
            description: 'Order Payment',
            order_id: order.id,
            receipt: order.receipt,
            modal: {
                ondismiss: () => {
                    setIsPaymentInProgress(false)
                    setLoading(false)
                    toast.info("Payment window closed. Please try again if you wish to complete payment.")
                }
            },
            handler: async (response) => {
                try {
                    setLoading(true)
                    const { data } = await axios.post(
                        serverUrl + '/api/order/verifyrazorpay', 
                        response, 
                        { withCredentials: true }
                    )
                    
                    if (data && data.success) {
                        navigate("/order")
                        setCartItem({})
                        toast.success("Payment successful! Order placed.")
                    } else {
                        toast.error("Payment verification failed. Please contact support.")
                    }
                } catch (error) {
                    console.error("Verification error:", error)
                    toast.error("Payment verification error")
                } finally {
                    setIsPaymentInProgress(false)
                    setLoading(false)
                }
            }
        }
        
        paymentInstance.current = new window.Razorpay(options)
        paymentInstance.current.open()
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault()
        
        // Validate form data
        for (const key in formData) {
            if (!formData[key].trim()) {
                toast.error(`Please fill in your ${key}`)
                return
            }
        }
        
        // Validate cart items
        if (Object.keys(cartItem).length === 0) {
            toast.error("Your cart is empty")
            return
        }

        setLoading(true)
        
        try {
            let orderItems = []
            for (const productId in cartItem) {
                for (const size in cartItem[productId]) {
                    if (cartItem[productId][size] > 0) {
                        const itemInfo = structuredClone(products.find(
                            product => product._id === productId
                        ))
                        
                        if (itemInfo) {
                            itemInfo.size = size
                            itemInfo.quantity = cartItem[productId][size]
                            orderItems.push(itemInfo)
                        }
                    }
                }
            }
            
            const orderData = {
                address: formData,
                items: orderItems,
                amount: getCartAmount() + delivery_fee
            }

            switch (method) {
                case 'cod':
                    const result = await axios.post(
                        serverUrl + "/api/order/placeorder",
                        orderData,
                        { withCredentials: true }
                    )
                    
                    if (result.data && result.data.success) {
                        setCartItem({})
                        toast.success("Order placed successfully!")
                        navigate("/order")
                    } else {
                        toast.error(result.data?.message || "Failed to place order")
                    }
                    setLoading(false)
                    break

                case 'razorpay':
                    const resultRazorpay = await axios.post(
                        serverUrl + "/api/order/razorpay",
                        orderData,
                        { withCredentials: true }
                    )
                    
                    if (resultRazorpay.data) {
                        setIsPaymentInProgress(true)
                        initPay(resultRazorpay.data)
                    } else {
                        setLoading(false)
                        toast.error("Failed to initialize payment")
                    }
                    break

                default:
                    setLoading(false)
            }
        } catch (error) {
            console.error("Order error:", error)
            toast.error(error.response?.data?.message || "Order processing failed")
            setLoading(false)
        }
    }

    return (
        <div className='w-[100vw] min-h-[100vh] bg-gradient-to-l from-[#141414] to-[#0c2025] flex items-center justify-center flex-col md:flex-row gap-[50px] relative'>
            <div className='lg:w-[50%] w-[100%] h-[100%] flex items-center justify-center lg:mt-[0px] mt-[90px]'>
                <form onSubmit={onSubmitHandler} className='lg:w-[70%] w-[95%] lg:h-[70%] h-[100%]'>
                    <div className='py-[10px]'>
                        <Title text1={'DELIVERY'} text2={'INFORMATION'} />
                    </div>
                    
                    <div className='w-[100%] h-[70px] flex items-center justify-between px-[10px]'>
                        <input
                            type="text"
                            placeholder='First name'
                            className='w-[48%] h-[50px] rounded-md bg-slate-700 placeholder:text-[white] text-[18px] px-[20px] shadow-sm shadow-[#343434]'
                            required
                            onChange={onChangeHandler}
                            name='firstName'
                            value={formData.firstName}
                        />
                        <input
                            type="text"
                            placeholder='Last name'
                            className='w-[48%] h-[50px] rounded-md shadow-sm shadow-[#343434] bg-slate-700 placeholder:text-[white] text-[18px] px-[20px]'
                            required
                            onChange={onChangeHandler}
                            name='lastName'
                            value={formData.lastName}
                        />
                    </div>

                    <div className='w-[100%] h-[70px] flex items-center justify-between px-[10px]'>
                        <input
                            type="email"
                            placeholder='Email address'
                            className='w-[100%] h-[50px] rounded-md shadow-sm shadow-[#343434] bg-slate-700 placeholder:text-[white] text-[18px] px-[20px]'
                            required
                            onChange={onChangeHandler}
                            name='email'
                            value={formData.email}
                        />
                    </div>
                    
                    <div className='w-[100%] h-[70px] flex items-center justify-between px-[10px]'>
                        <input
                            type="text"
                            placeholder='Street'
                            className='w-[100%] h-[50px] rounded-md bg-slate-700 shadow-sm shadow-[#343434] placeholder:text-[white] text-[18px] px-[20px]'
                            required
                            onChange={onChangeHandler}
                            name='street'
                            value={formData.street}
                        />
                    </div>
                    
                    <div className='w-[100%] h-[70px] flex items-center justify-between px-[10px]'>
                        <input
                            type="text"
                            placeholder='City'
                            className='w-[48%] h-[50px] rounded-md bg-slate-700 shadow-sm shadow-[#343434] placeholder:text-[white] text-[18px] px-[20px]'
                            required
                            onChange={onChangeHandler}
                            name='city'
                            value={formData.city}
                        />
                        <input
                            type="text"
                            placeholder='State'
                            className='w-[48%] h-[50px] rounded-md bg-slate-700 shadow-sm shadow-[#343434] placeholder:text-[white] text-[18px] px-[20px]'
                            required
                            onChange={onChangeHandler}
                            name='state'
                            value={formData.state}
                        />
                    </div>
                    
                    <div className='w-[100%] h-[70px] flex items-center justify-between px-[10px]'>
                        <input
                            type="text"
                            placeholder='Pincode'
                            className='w-[48%] h-[50px] rounded-md bg-slate-700 shadow-sm shadow-[#343434] placeholder:text-[white] text-[18px] px-[20px]'
                            required
                            onChange={onChangeHandler}
                            name='pinCode'
                            value={formData.pinCode}
                        />
                        <input
                            type="text"
                            placeholder='Country'
                            className='w-[48%] h-[50px] rounded-md bg-slate-700 shadow-sm shadow-[#343434] placeholder:text-[white] text-[18px] px-[20px]'
                            required
                            onChange={onChangeHandler}
                            name='country'
                            value={formData.country}
                        />
                    </div>
                    
                    <div className='w-[100%] h-[70px] flex items-center justify-between px-[10px]'>
                        <input
                            type="text"
                            placeholder='Phone'
                            className='w-[100%] h-[50px] rounded-md bg-slate-700 shadow-sm shadow-[#343434] placeholder:text-[white] text-[18px] px-[20px]'
                            required
                            onChange={onChangeHandler}
                            name='phone'
                            value={formData.phone}
                        />
                    </div>
                    
                    <div>
                        <button
                            type='submit'
                            onClick={() => setMethod('razorpay')}
                            disabled={loading || isPaymentInProgress}
                            className={`text-[18px] active:bg-slate-500 bg-[#3bcee848] py-[10px] px-[50px] rounded-2xl text-white flex items-center justify-center gap-[20px] absolute lg:right-[20%] bottom-[10%] right-[35%] border-[1px] border-[#80808049] ml-[30px] mt-[20px] ${loading || isPaymentInProgress ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                            {loading ? <Loading /> : "PLACE ORDER"}
                        </button>
                    </div>
                </form>
            </div>
            
            <div className='lg:w-[50%] w-[100%] min-h-[100%] flex items-center justify-center gap-[30px]'>
                <div className='lg:w-[70%] w-[90%] lg:h-[70%] h-[100%] flex items-center justify-center gap-[10px] flex-col'>
                    <CartTotal />
                    <div className='py-[10px]'>
                        <Title text1={'PAYMENT'} text2={'METHOD'} />
                    </div>
                    
                    <div className='w-[100%] h-[30vh] lg:h-[100px] flex items-start mt-[20px] lg:mt-[0px] justify-center gap-[50px]'>
                        {/* <button
                            type='button'
                            onClick={() => setMethod('razorpay')}
                            className={`w-[150px] h-[50px] rounded-sm ${method === 'razorpay' ? 'border-[5px] border-blue-900 rounded-sm' : ''}`}
                        >
                            <img
                                src={razorpay}
                                className='w-[100%] h-[100%] object-fill rounded-sm'
                                alt="Razorpay"
                            />
                        </button> */}
                        
                        {/* <button
                            type='button'
                            onClick={() => setMethod('cod')}
                            className={`w-[200px] h-[50px] bg-gradient-to-t from-[#95b3f8] to-[white] text-[14px] px-[20px] rounded-sm text-[#332f6f] font-bold ${method === 'cod' ? 'border-[5px] border-blue-900 rounded-sm' : ''}`}
                        >
                            CASH ON DELIVERY
                        </button> */}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PlaceOrder