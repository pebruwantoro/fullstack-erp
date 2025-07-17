import { useEffect, useState, useCallback } from "react";
import { useLocalStorage } from "react-use";
import { alertError, alertSuccess } from "../../lib/alert";
import { List as quotationList } from "../../api/quotation.js";
import { useNavigate, Link, Outlet, useOutlet } from "react-router-dom";
import Pagination from "../pagination.jsx";
import QuotationCard from "./quotationCard.jsx";
import { UserRole, QuotationStatus } from "../../constant/constant.js";
import { GenerateSalesOrders as generateSalesOrders } from "../../api/salesOrder.js";


export default function QuotationListPage() {
    const [token, _] = useLocalStorage("token");
    const [role, __] = useLocalStorage("role", "");
    const [quotations, setQuotations] = useState([]);
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filterDate, setFilterDate] = useState('');
    const outlet = useOutlet();

    const fetchQuotations = useCallback(async () => {
        if (!token) return;

        let params = {
            page: Number(currentPage),
            per_page: Number(6),
        };

        if (role === UserRole.SALES) {
            params.status = QuotationStatus.PENDING;
        }

        if (filterDate) {
            params.date = filterDate;
        }

        const response = await quotationList(token, params);
        const responseBody = await response.json();
        
        if (response.ok) {
            setQuotations(responseBody.data.list);
            setTotalPages(responseBody.data.pagination.total_page);
        } else {
            alertError(responseBody.message || 'Failed to load quotations.');
        }
    }, [token, currentPage, filterDate, role]);

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }
        if (outlet) return; 
        
        fetchQuotations();
    }, [token, navigate, outlet, fetchQuotations]);


    const handleApprovalSuccess = useCallback(() => {
        setCurrentPage(1);
    }, []);


    const handleDateChange = (e) => {
        setFilterDate(e.target.value);
        setCurrentPage(1); 
    };

    async function handleGenerateSalesOrder(e) {
        e.preventDefault();

        const response = await generateSalesOrders(token);
        const responseBody = await response.json();
        
        if(response.status === 201) {
            alertSuccess(responseBody.message);
            fetchQuotations();
        } else {
            alertError(responseBody.message);
        }
    }


    return outlet ? <Outlet /> : (
        <div className="flex flex-col h-full">
            <div className="mb-6 flex justify-start items-end gap-4">
                { role === UserRole.CUSTOMER && (
                    <Link
                    to="/quotations/create"
                    className="inline-flex items-center justify-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800"
                    >
                        <i className="fas fa-plus mr-2" />
                        Create Quotation
                    </Link>
                )}
                { role === UserRole.SALES && (
                    <button
                    onClick={handleGenerateSalesOrder}
                    className="inline-flex items-center justify-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800"
                    >
                        <i className="fas fa-file-invoice mr-2" />
                        Generate Sales Order
                    </button>
                )}
                <div>
                    <div className="relative">
                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <i className="fas fa-calendar-alt text-gray-500" />
                        </div>
                        <input
                            type="date"
                            id="date-filter"
                            value={filterDate}
                            onChange={handleDateChange}
                            className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {quotations.length > 0 ? (
                    quotations.map(quotation => (
                        <QuotationCard 
                            key={quotation.id} 
                            quotation={quotation}
                            onApprovalSuccess={handleApprovalSuccess}
                        />
                    ))
                ) : (
                    <div className="col-span-3 text-center text-gray-400 py-10">
                        No quotations found.
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