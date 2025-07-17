import { useLocalStorage } from "react-use";
import { alertError, alertSuccess } from "../../lib/alert";
import { List as productList } from "../../api/product.js";
import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { formatDollarCurrency } from "../../util/format.js";
import { CreateQuotation as createQuotation } from "../../api/quotation.js";
import { UserRole } from "../../constant/constant.js";

export default function FormCreateQuotation() {
    const [token, _] = useLocalStorage("token");
    const [role, __] = useLocalStorage("role");
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }
        if (role !== UserRole.CUSTOMER ) {
            alertError('Can not access this page')
            navigate('/dashboard');
            return
        }

        async function fetchProducts() {
            const response = await productList(token);
            const responseBody = await response.json();
            
            if(response.status === 200) {
                setProducts(responseBody.data);
            } else {
                alertError(response.message)
            }
        }
        fetchProducts();
    }, [token, navigate, role]);

    const [orderItems, setOrderItems] = useState([]);
    const [currentItem, setCurrentItem] = useState({
        productId: '',
        name: '',
        price: '',
        quantity: 0
    });

    
    useEffect(() => {
        const selectedProduct = products.find(
            p => p.id.toString() === currentItem.productId
        );
        if (selectedProduct) {
            setCurrentItem(prev => ({
                ...prev,
                name: selectedProduct.name,
                price: selectedProduct.price,
                quantity: 1,
            }));
        }
    }, [currentItem.productId, products]);

    function handleAddItem() {
        if (!currentItem.productId) return;

        const existingItemIndex = orderItems.findIndex(item => item.productId === currentItem.productId);

        if (existingItemIndex > -1) {
            const updatedItems = [...orderItems];
            updatedItems[existingItemIndex].quantity += currentItem.quantity;
            setOrderItems(updatedItems);
        } else {
            setOrderItems([...orderItems, currentItem]);
        }

        setCurrentItem({ productId: '', name: '', price: '', quantity: 1 });
    }

    function handleRemoveItem(productId) {
        setOrderItems(orderItems.filter(item => item.productId !== productId));
    }

    async function handleSubmit(e) {
        e.preventDefault();

        let products = [];

        orderItems.map(item => {
            const data = {
                id: item.productId,
                quantity: item.quantity,
                price: item.price,
            }
            products.push(data)
        })

        const response = await createQuotation(token, products);
        const responseBody = await response.json();
        
        if(response.status === 201) {
            alertSuccess(responseBody.message)

            setOrderItems([]);
            setCurrentItem({ productId: '', name: '', price: '', quantity: 0 });
            navigate('/quotations'); 
        } else {
            alertError(response.message)
        }
    }


    return <>
        <div className="animate-fade-in bg-gray-800 bg-opacity-80 p-8 rounded-xl shadow-custom border border-gray-700 backdrop-blur-sm w-full max-w-md">
            <div className="text-center mb-8">
                <div className="inline-block p-3 bg-gradient rounded-full mb-4">
                    <i className="fas fa-solid fa-dolly text-3xl text-white" />
                </div>
                <h1 className="text-3xl font-bold text-white">ERP System</h1>
                <p className="text-gray-300 mt-2">Create Quotation</p>
            </div>
            <form onSubmit={handleSubmit}>

                {/* Product Drop Down Box */}
                <div className="mb-4">
                    <label htmlFor="product" className="block text-gray-300 text-sm font-medium mb-2">
                        Product
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <i className="fas fa-tag text-gray-500" />
                        </div>
                        <select
                            id="product"
                            name="productId"
                            value={currentItem.productId}
                            onChange={(e) => setCurrentItem(prev => ({ ...prev, productId: e.target.value }))}
                            className="w-full pl-10 pr-3 py-3 bg-gray-700 bg-opacity-50 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none"
                        >
                            <option value="" disabled>
                                Choose a product
                            </option>
                            {products.map((product) => (
                                <option key={product.id} value={product.id}>{product.name}</option>
                            ))}
                        </select>
                    </div>
                    
                </div>

                {/* Unit Price Box */}
                <div className="mb-4">
                    <label htmlFor="price" className="block text-gray-300 text-sm font-medium mb-2">
                        Unit Price
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <i className="fas fa-money-bill-1 text-gray-500" />
                        </div>
                        <input
                            type="text"
                            disabled={!currentItem.productId}
                            value={formatDollarCurrency(currentItem.price)}
                            className="w-full pl-10 pr-3 py-3 bg-gray-900 bg-opacity-70 border border-gray-600 text-gray-400 rounded-lg focus:outline-none"
                            placeholder="Product unit price"
                            required
                            readOnly
                        />
                    </div>
                </div>


                {/* Quantity Box */}
                <div className="mb-4">
                    <label htmlFor="quantity" className="block text-gray-300 text-sm font-medium mb-2">
                        Quantity
                    </label>
                    <div className="relative flex items-center">
                            <button 
                                type="button"
                                onClick={() => setCurrentItem(p => ({ ...p, quantity: Math.max(1, p.quantity - 1) }))}
                                disabled={!currentItem.productId}
                                className="px-3 py-3 bg-gray-600 text-white rounded-l-lg hover:bg-gray-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-600 disabled:opacity-50 disabled:transform-none"
                                aria-label="Decrease quantity"
                            >
                                    <i className="fas fa-minus" />
                            </button>
                        <input
                            type="number"
                            value={currentItem.quantity}
                            onChange={(e) => setCurrentItem(prev => ({ ...prev, quantity: Number(e.target.value) }))}
                            disabled={!currentItem.productId}
                            className="w-full text-center bg-gray-800 border-y border-gray-700 text-white p-3 outline-none"
                            min="1"
                        />
                        <button 
                            type="button"
                            onClick={() => setCurrentItem(p => ({ ...p, quantity: p.quantity + 1 }))}
                            disabled={!currentItem.productId}
                            className="px-3 py-3 bg-gray-600 text-white rounded-r-lg hover:bg-gray-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-600 disabled:opacity-50 disabled:transform-none"
                            aria-label="Increase quantity"
                        >
                            <i className="fas fa-plus" />
                        </button>
                    </div>
                </div>


                {/* --- "Add Product" button --- */}
                <div className="mb-6">
                    <button
                        type="button"
                        onClick={() => {
                            handleAddItem();
                            setCurrentItem(p => ({ ...p, quantity: 0 }));
                        }}
                        disabled={!currentItem.productId}
                        className="w-full bg-gradient text-white py-3 px-4 rounded-lg font-medium shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 
                                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 
                                disabled:bg-gray-600 disabled:opacity-50 disabled:transform-none"
                    >
                        <i className="fas fa-plus" /> Add Product to Quotation
                    </button>
                </div>

                {orderItems.length > 0 && (
                    <div className="space-y-2 mb-6 border-t border-gray-700 pt-4">
                        {orderItems.map(item => (
                            <div key={item.productId} className="flex justify-between items-center text-white bg-gray-700/50 p-2 rounded">
                                <span>{item.name} <span className="text-gray-400">x {item.quantity}</span></span>
                                <div>
                                    <span className="mr-4">{formatDollarCurrency(item.price * item.quantity)}</span>
                                    <button type="button" onClick={() => handleRemoveItem(item.productId)} className="text-red-500 hover:text-red-400">
                                        <i className="fas fa-times-circle" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}


                {/* Button Create */}
                <div className="mb-6">
                    <button
                        type="submit"
                        disabled={orderItems.length === 0}
                        className="w-full bg-gradient text-white py-3 px-4 rounded-lg font-medium shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 
                                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 
                                disabled:bg-gray-600 disabled:opacity-50 disabled:transform-none">
                        <i className="fas fa-cart-plus" /> Create
                    </button>
                </div>
            </form>
        </div>
    </>
}