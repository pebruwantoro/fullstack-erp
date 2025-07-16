import { useEffect, useState } from "react";
import { useLocalStorage } from "react-use";
import { alertError } from "../../lib/alert";
import { List as productList } from "../../api/product.js";
import { Link, useNavigate } from "react-router";
import { formatDollarCurrency } from '../../util/format.js';

export default function ProductList() {

    const [token, setToken] = useLocalStorage("token", "");
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    async function fetchProducts() {
        const response = await productList(token);
        const responseBody = await response.json();
        
        if(response.status === 200) {
            setProducts(responseBody.data);
        } else {
            alertError(response.message)
        }
    }

    const handleLogout = () => {
        setToken("");
        navigate('/login');
    };
    
    useEffect(() => {
        fetchProducts()
    }, [])

    return <>
        <div className="flex h-screen overflow-hidden bg-gray-900 text-white font-sans">
            <aside className="w-64 bg-gray-800 p-6 flex flex-col flex-shrink-0">
                <div>
                    <div className="flex items-center mb-10">
                        <i className="fas fa-cubes text-blue-400 text-3xl mr-3"></i>
                        <h1 className="text-xl font-bold">ERP System</h1>
                    </div>
                    <nav>
                        <ul>
                            <li className="mb-4">
                                <Link to="/dashboard" className="flex items-center p-3 bg-blue-500 bg-opacity-30 text-blue-300 rounded-lg">
                                    <i className="fas fa-box-open w-6 text-blue-300" />
                                    <span className="font-semibold">Product</span>
                                </Link>
                            </li>
                            <li className="mb-4">
                                <Link to="/sales-order" className="flex items-center p-3 text-gray-400 hover:bg-gray-700 rounded-lg transition-colors">
                                    <i className="fas fa-shopping-cart w-6" />
                                    <span>Sales Order</span>
                                </Link>
                            </li>
                            <li className="mb-4">
                                <Link to="/quotations" className="flex items-center p-3 text-gray-400 hover:bg-gray-700 rounded-lg transition-colors">
                                    <i className="fas fa-file-invoice-dollar w-6" />
                                    <span>Quotation</span>
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div>
                <div className="flex-grow"></div>

                <div>
                    <button onClick={handleLogout} className="w-full flex items-center p-3 text-gray-400 hover:bg-gray-700 rounded-lg transition-colors text-left">
                        <i className="fas fa-sign-out-alt w-6" />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            <main className="flex-grow p-8 overflow-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map( product => (
                        <div key={product.id}
                        className="bg-gray-800 bg-opacity-80 rounded-xl shadow-custom border border-gray-700 overflow-hidden card-hover animate-fade-in">
                            <div className="p-6">
                                <Link
                                to={`/product/${product.id}`}
                                className="block"
                                >
                                <div className="flex items-center mb-3">
                                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-3 shadow-md flex-shrink-0">
                                        <i className="fas fa-box-open text-white" />
                                    </div>
                                    <h2 className="text-lg font-semibold text-white truncate" title={product.name}>
                                        {product.name}
                                    </h2>
                                </div>
                                <p className="text-gray-400 text-sm mb-4 h-10 line-clamp-2">
                                    {product.description}
                                </p>
                                <div className="space-y-3 text-gray-300 ml-2">
                                    <p className="flex items-center">
                                        <i className="fas fa-barcode text-gray-500 w-6" />
                                        <span className="font-medium w-24">SKU:</span>
                                        <span>{product.sku}</span>
                                    </p>
                                    <p className="flex items-center">
                                        <i className="fas fa-dollar-sign text-gray-500 w-6" />
                                        <span className="font-medium w-24">Price:</span>
                                        <span>{formatDollarCurrency(product.price)}</span>
                                    </p>
                                    <p className="flex items-center">
                                        <i className="fas fa-bucket text-gray-500 w-6" />
                                        <span className="font-medium w-24">Stock:</span>
                                        <span>{product.stock}</span>
                                    </p>
                                </div>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    </>
}