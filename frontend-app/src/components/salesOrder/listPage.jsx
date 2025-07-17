import { useEffect, useState } from "react";
import { useLocalStorage } from "react-use";
import { alertError } from "../../lib/alert";
import { useNavigate } from "react-router-dom";
import Pagination from "../pagination.jsx";
import { UserRole } from "../../constant/constant.js";
import SalesOrderCard from "./salesOrderCard.jsx";
import { List as salesOrderList } from "../../api/salesOrder.js";


export default function SalesOrderListPage() {
    const [token, _] = useLocalStorage("token");
    const [role, __] = useLocalStorage("role", "");
    const [salesOrders, setSalesOrders] = useState([]);
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }

        if (role === UserRole.CUSTOMER) {
            navigate('/dashboard');
            return;
        }

        async function fetchProducts() {
            let params = {
                page: Number(currentPage),
                per_page: Number(6),
            };
            
            const response = await salesOrderList(token, params);
            const responseBody = await response.json();
            
            if(response.status === 200) {
                setSalesOrders(responseBody.data.list);
                setTotalPages(responseBody.data.pagination.total_page);
            } else {
                alertError(response.message)
            }
        }
        fetchProducts();
    }, [token, navigate, role, currentPage]);





    return (
        <div className="flex flex-col h-full">
            <div className="mb-6 flex justify-start items-end gap-4">
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {salesOrders.length > 0 ? (
                    salesOrders.map(salesOrder => (
                        <SalesOrderCard 
                            key={salesOrder.id} 
                            salesOrder={salesOrder}
                        />
                    ))
                ) : (
                    <div className="col-span-3 text-center text-gray-400 py-10">
                        No content to display.
                    </div>
                )}
            </div>
            
            <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
        </div>
    );
}