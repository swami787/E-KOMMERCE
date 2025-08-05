import React, { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { shopDataContext } from '../context/ShopContext'
import { userDataContext } from '../context/UserContext'
import { FaStar } from "react-icons/fa";
import { FaStarHalfAlt } from "react-icons/fa";
import RelatedProduct from '../component/RelatedProduct';
import Loading from '../component/Loading';
import { toast } from 'react-toastify';

function ProductDetail() {
    const { productId } = useParams();
    const { products, currency, addtoCart, loading } = useContext(shopDataContext);
    const { userData } = useContext(userDataContext);
    const [productData, setProductData] = useState(false);
    const [image, setImage] = useState('');
    const [image1, setImage1] = useState('');
    const [image2, setImage2] = useState('');
    const [image3, setImage3] = useState('');
    const [image4, setImage4] = useState('');
    const [size, setSize] = useState('');
    const navigate = useNavigate();

    const fetchProductData = async () => {
        products.map((item) => {
            if (item._id === productId) {
                setProductData(item);
                setImage1(item.image1);
                setImage2(item.image2);
                setImage3(item.image3);
                setImage4(item.image4);
                setImage(item.image1);
                return null;
            }
        });
    };

    const handleAddToCart = () => {
        if (!userData) {
            toast.error("Please login to add items to cart");
            navigate("/login");
            return;
        }
        
        if (!size) {
            toast.error("Please select a size");
            return;
        }
        
        addtoCart(productData._id, size);
    };

    useEffect(() => {
        fetchProductData();
    }, [productId, products]);

    return productData ? (
        <div>
            <div className='w-[99vw] min-h-[100vh] bg-gradient-to-l from-[#141414] to-[#0c2025] flex items-center justify-start flex-col lg:flex-row gap-[20px] pt-[70px] pb-10'>
                {/* Product Images */}
                <div className='lg:w-[50vw] w-full lg:h-[85vh] mt-[20px] lg:mt-0 flex items-center justify-center gap-4 flex-col-reverse lg:flex-row px-4'>
                    <div className='lg:w-[20%] w-full lg:h-[80%] flex items-center justify-center gap-4 lg:gap-4 lg:flex-col flex-wrap'>
                        {[image1, image2, image3, image4].map((img, index) => (
                            <div 
                                key={index} 
                                className={`w-[60px] h-[60px] md:w-[80px] md:h-[80px] bg-slate-300 border rounded-md cursor-pointer transition-all duration-200 ${
                                    image === img ? 'ring-4 ring-blue-500 scale-105' : 'border-[#80808049]'
                                }`}
                                onClick={() => setImage(img)}
                            >
                                <img 
                                    src={img} 
                                    alt="" 
                                    className='w-full h-full object-cover rounded-md' 
                                />
                            </div>
                        ))}
                    </div>
                    <div className='lg:w-[60%] w-full lg:h-[80%] h-[50vh] border border-[#80808049] rounded-lg overflow-hidden bg-gray-900'>
                        <img 
                            src={image} 
                            alt={productData.name} 
                            className='w-full h-full object-contain' 
                        />
                    </div>
                </div>

                {/* Product Details */}
                <div className='lg:w-[50vw] w-full lg:h-[85vh] flex items-start justify-start flex-col py-4 px-4 lg:px-8 gap-4'>
                    <h1 className='text-2xl md:text-3xl lg:text-4xl font-bold text-white'>{productData.name}</h1>
                    {/* <div className='flex items-center gap-1'>
                        <FaStar className='text-yellow-400' />
                        <FaStar className='text-yellow-400' />
                        <FaStar className='text-yellow-400' />
                        <FaStar className='text-yellow-400' />
                        <FaStarHalfAlt className='text-yellow-400' />
                        <p className='text-white pl-2'>(124 reviews)</p>
                    </div> */}
                    <p className='text-2xl font-bold text-white'>{currency} {productData.price}</p>
                    <p className='text-gray-300 text-base md:text-lg'>
                        {productData.description} Stylish, breathable cotton shirt with a modern slim fit. 
                        Easy to wash, super comfortable, and designed for effortless style.
                    </p>
                    
                    {/* Size Selection */}
                    <div className='w-full flex flex-col gap-4 my-2'>
                        <p className='text-xl font-semibold text-white'>Select Size</p>
                        <div className='flex flex-wrap gap-2'>
                            {productData.sizes.map((item, index) => (
                                <button 
                                    key={index} 
                                    className={`w-12 h-12 flex items-center justify-center border rounded-md transition-all ${
                                        item === size 
                                            ? 'bg-blue-600 text-white border-blue-500 scale-110' 
                                            : 'bg-gray-800 text-gray-200 border-gray-700 hover:bg-gray-700'
                                    }`} 
                                    onClick={() => setSize(item)}
                                >
                                    {item}
                                </button>
                            ))}
                        </div>
                        <button 
                            className={`w-full py-3 px-6 rounded-xl text-white font-medium transition-all ${
                                loading 
                                    ? 'bg-gray-700 cursor-not-allowed' 
                                    : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
                            }`}
                            onClick={handleAddToCart}
                            disabled={loading}
                        >
                            {loading ? <Loading size="small" /> : "Add to Cart"}
                        </button>
                    </div>
                    
                    <div className='w-full h-px bg-gray-700 my-2'></div>
                    <div className='text-gray-400 text-sm'>
                        <p className='flex items-center gap-2 mb-1'>
                            <span className='text-green-500 font-bold'>✓</span> 100% Original Product
                        </p>
                        <p className='flex items-center gap-2 mb-1'>
                            <span className='text-red-500 font-bold'>✗</span> Cash on delivery not available
                        </p>
                        <p className='flex items-center gap-2'>
                            <span className='text-red-500 font-bold'>✗</span> No return and exchange policy
                        </p>
                    </div>
                </div>
            </div>

            {/* Related Products Section */}
            <div className='w-full bg-gradient-to-l from-[#141414] to-[#0c2025] py-10'>
                <div className='container mx-auto px-4'>
                    <h2 className='text-2xl md:text-3xl font-bold text-white mb-8 text-center'>
                        Related Products
                    </h2>
                    <div className='mt-[50px]'> {/* Increased top margin */}
                        <RelatedProduct
                            category={productData.category} 
                            subCategory={productData.subCategory} 
                            currentProductId={productData._id}
                        />
                    </div>
                </div>
            </div>
        </div>
    ) : (
        <div className='w-full min-h-screen bg-gradient-to-l from-[#141414] to-[#0c2025] flex items-center justify-center pt-[70px]'>
            <Loading size="large" />
        </div>
    )
}

export default ProductDetail