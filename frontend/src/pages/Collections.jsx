import React, { useContext, useEffect, useState } from 'react'
import { FaChevronRight, FaChevronDown } from "react-icons/fa";
import Title from '../component/Title';
import { shopDataContext } from '../context/ShopContext';
import Card from '../component/Card';

function Collections() {

    let [showFilter, setShowFilter] = useState(false)
    let { products, search, showSearch } = useContext(shopDataContext)
    let [filterProduct, setFilterProduct] = useState([])
    let [category, setCategory] = useState([])
    let [subCategory, setSubCategory] = useState([])
    let [sortType, setSortType] = useState("relavent")

    const toggleCategory = (e) => {
        if (category.includes(e.target.value)) {
            setCategory(prev => prev.filter(item => item !== e.target.value))
        } else {
            setCategory(prev => [...prev, e.target.value])
        }
    }

    // const toggleSubCategory = (e) => {
    //     if (subCategory.includes(e.target.value)) {
    //         setSubCategory(prev => prev.filter(item => item !== e.target.value))
    //     } else {
    //         setSubCategory(prev => [...prev, e.target.value])
    //     }
    // }

    const applyFilter = () => {
        let productCopy = [...products]

        if (showSearch && search) {
            productCopy = productCopy.filter(item => 
                item.name.toLowerCase().includes(search.toLowerCase())
            )
        }
        if (category.length > 0) {
            productCopy = productCopy.filter(item => category.includes(item.category))
        }
        if (subCategory.length > 0) {
            productCopy = productCopy.filter(item => subCategory.includes(item.subCategory))
        }
        setFilterProduct(productCopy)
    }

    const sortProducts = () => {
        let productCopy = [...filterProduct]

        switch (sortType) {
            case 'low-high':
                productCopy.sort((a, b) => (a.price - b.price))
                break;
            case 'high-low':
                productCopy.sort((a, b) => (b.price - a.price))
                break;
            default:
                // Maintain current order
                break;
        }
        setFilterProduct(productCopy)
    }

    useEffect(() => {
        setFilterProduct(products)
    }, [products])

    useEffect(() => {
        applyFilter()
    }, [category, subCategory, search, showSearch])

    useEffect(() => {
        sortProducts()
    }, [sortType])

    return (
        <div className='w-full min-h-screen bg-gradient-to-l from-[#141414] to-[#0c2025] flex flex-col md:flex-row pt-[70px] pb-28'>
            {/* Filter Section */}
            <div className={`w-full md:w-[30vw] lg:w-[20vw] ${showFilter ? "h-auto" : "h-16"} p-4 md:p-5 border-b md:border-r border-gray-700 text-blue-100 lg:sticky top-[70px]`}>
                <p 
                    className='text-xl md:text-2xl font-bold flex items-center gap-2 cursor-pointer'
                    onClick={() => setShowFilter(!showFilter)}
                >
                    FILTERS
                    {showFilter ? 
                        <FaChevronDown className='md:hidden' /> : 
                        <FaChevronRight className='md:hidden' />
                    }
                </p>
                
                <div className={`${showFilter ? "block" : "hidden md:block"} space-y-5 mt-4`}>
                    <div className='border-2 border-gray-500 p-4 rounded-lg bg-gray-800/50'>
                        <p className='text-lg font-semibold text-white mb-2'>CATEGORIES</p>
                        <div className='space-y-2'>
                            {['Men', 'Women', 'Kids'].map(cat => (
                                <label key={cat} className='flex items-center gap-3 text-gray-200'>
                                    <input 
                                        type="checkbox"
                                        value={cat}
                                        className='w-4 h-4 accent-blue-400'
                                        onChange={toggleCategory}
                                        checked={category.includes(cat)}
                                    />
                                    {cat}
                                </label>
                            ))}
                        </div>
                    </div>
{/*                     
                    <div className='border-2 border-gray-500 p-4 rounded-lg bg-gray-800/50'>
                        <p className='text-lg font-semibold text-white mb-2'>SUB-CATEGORIES</p>
                        <div className='space-y-2'>
                            {['TopWear', 'BottomWear', 'WinterWear'].map(subCat => (
                                <label key={subCat} className='flex items-center gap-3 text-gray-200'>
                                    <input 
                                        type="checkbox"
                                        value={subCat}
                                        className='w-4 h-4 accent-blue-400'
                                        onChange={toggleSubCategory}
                                        checked={subCategory.includes(subCat)}
                                    />
                                    {subCat}
                                </label>
                            ))}
                        </div>
                    </div> */}
                </div>
            </div>
            
            {/* Products Section */}
            <div className='flex-1 w-full'>
                <div className='flex flex-col lg:flex-row justify-between items-start lg:items-center p-4 lg:px-8 gap-4'>
                    <Title text1={"ALL"} text2={"COLLECTIONS"} />
                    
                    <select 
                        value={sortType}
                        onChange={(e) => setSortType(e.target.value)}
                        className='bg-gray-800 border border-gray-600 w-full lg:w-64 h-12 px-4 text-white rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none'
                    >
                        <option value="relavent">Sort By: Relevant</option>
                        <option value="low-high">Price: Low to High</option>
                        <option value="high-low">Price: High to Low</option>
                    </select>
                </div>
                
                {/* Product Grid - 2 columns on mobile */}
                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4'>
                    {filterProduct.map((item) => (
                        <Card 
                            key={item._id} 
                            id={item._id} 
                            name={item.name} 
                            price={item.price} 
                            image={item.image1}
                        />
                    ))}
                </div>
                
                {/* Empty state */}
                {filterProduct.length === 0 && (
                    <div className='flex justify-center items-center h-64'>
                        <p className='text-gray-400 text-xl'>No products found matching your filters</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Collections