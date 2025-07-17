import { useEffect, useState } from "react";
import { useLocalStorage } from "react-use";
import { alertError } from "../../lib/alert";
import { List as productList } from "../../api/product.js";
import { Link, useNavigate } from "react-router-dom";
import { formatDollarCurrency } from "../../util/format.js";

export default function ProductListPage() {
    const [token] = useLocalStorage("token");
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }
        async function fetchProducts() {
            const response = await productList(token);
            if (!response.ok) {
                return alertError('Failed to fetch products.');
            }
            const responseBody = await response.json();
            setProducts(responseBody.data);
        }
        fetchProducts();
    }, [token, navigate]);

    
    function DetailRow({ icon, label, value }) {
        return (
            <p className="flex items-center">
            <i className={`fas ${icon} text-gray-400 dark:text-slate-500 w-6 text-center`} />
            <span className="font-medium text-gray-500 dark:text-slate-400 w-20">{label}:</span>
            <span className="text-gray-800 dark:text-slate-200">{value}</span>
            </p>
        );
    }

    return (
        <div className="flex flex-col h-full">
            <div className="mb-6 flex justify-start items-end gap-4">
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(product => (
                    <div
                    key={product.id}
                    className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-lg dark:shadow-slate-900/50 card-hover animate-fade-in"
                    >
                        <div className="p-6">
                            <Link to={`/product/${product.id}`} className="block">
                                <div className="flex items-center mb-3">
                                    <div className="w-10 h-10 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center mr-3 shadow-md flex-shrink-0">
                                        <i className="fas fa-box-open text-white" />
                                    </div>
                                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white truncate" title={product.name}>{product.name}</h2>
                                </div>
                                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 h-10 line-clamp-2">{product.description}</p>

                                <div className="space-y-3 text-sm">
                                    <DetailRow icon="fa-barcode" label="SKU" value={product.sku} />
                                    <DetailRow icon="fa-dollar-sign" label="Price" value={formatDollarCurrency(product.price)} />
                                    <DetailRow icon="fa-boxes-stacked" label="Stock" value={product.stock} />
                                </div>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}