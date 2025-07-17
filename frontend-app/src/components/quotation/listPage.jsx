import { useEffect, useState } from "react";
import { useLocalStorage } from "react-use";
import { alertError } from "../../lib/alert";
import { List as quotationList } from "../../api/quotation.js";
import { useNavigate, Link, Outlet, useOutlet } from "react-router-dom";
import Pagination from "../pagination.jsx";
import QuotationCard from "./quotationCard.jsx";
import { UserRole, QuotationStatus } from "../../constant/constant.js";


export default function QuotationListPage() {
    const [token, _] = useLocalStorage("token");
    const [role, __] = useLocalStorage("role", "");
    const [quotations, setQuotations] = useState([]);
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filterDate, setFilterDate] = useState('');
    const outlet = useOutlet();

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }

        if (outlet) return; 
        
        async function fetchQuotations() {
            let params = {
                page: Number(currentPage),
                per_page: Number(9),
            };

            if (role === UserRole.SALES){
                params.status = QuotationStatus.PENDING;
            }

            if (filterDate) {
                console.log('filter date: ', filterDate)
                params.date = filterDate;
            }
            console.log('query params: ', params)
            const response = await quotationList(token, params);
            const responseBody = await response.json();
            
            if(response.status === 200) {
                setQuotations(responseBody.data.list);
                setTotalPages(responseBody.data.pagination.total_page);
            } else {
                alertError(response.message)
            }
        }
        fetchQuotations();
    }, [token, navigate, currentPage, filterDate, role, outlet]);

    const handleDateChange = (e) => {
        setFilterDate(e.target.value);
        setCurrentPage(1); 
    };


    return outlet ? <Outlet /> : (
        <div className="flex flex-col h-full">
            <div className="mb-6 flex justify-start items-end gap-4">
                { role === UserRole.CUSTOMER && (
                    <Link
                    onClick={{ state: { refresh: true } }}
                    to="/quotations/create"
                    className="inline-flex items-center justify-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800"
                    >
                        <i className="fas fa-plus mr-2" />
                        Create Quotation
                    </Link>
                )}

                <div>
                    <label htmlFor="date-filter" className="block text-sm font-medium text-gray-300 mb-2">
                    </label>
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
                {/* {quotations.length > 0 ? (
                    quotations.map(quotation => (
                        <div key={quotation.id} className="bg-gray-800 bg-opacity-80 rounded-xl shadow-custom border border-gray-700 overflow-hidden card-hover animate-fade-in">
                            <div className="p-6">
                                <div className="flex items-center mb-3">
                                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-3 shadow-md flex-shrink-0">
                                        <i className="fas fa-file-invoice-dollar text-white" />
                                    </div>
                                    <h2 className="text-lg font-semibold text-white truncate" title={quotation.id}>{quotation.id}</h2>
                                </div>
                                <p className={`text-sm mb-4 h-10 line-clamp-2 ${getStatusColor(quotation.status)}`}>
                                    {quotation.status.toUpperCase()}
                                </p>
                                <div className="space-y-3 text-gray-300 ml-2">
                                    <p className="flex items-center"><i className="fas fa-dollar-sign text-gray-500 w-6" /><span className="font-medium w-24">Total:</span><span>{formatDollarCurrency(quotation.total_amount)}</span></p>
                                    <p className="flex items-center"><i className="fas fa-calendar-alt text-gray-500 w-6" /><span className="font-medium w-24">Created:</span><span>{format(new Date(quotation.created_at), 'dd MMMM yyyy')}</span></p>
                                    {quotation.updated_at && (
                                        <p className="flex items-center"><i className="fas fa-edit text-gray-500 w-6" /><span className="font-medium w-24">Updated:</span><span>{format(new Date(quotation.updated_at), 'dd MMMM yyyy')}</span></p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-3 text-center text-gray-400 py-10">
                        No quotations found.
                    </div>
                )} */}
                {quotations.length > 0 ? (
                    quotations.map(quotation => (
                        <QuotationCard key={quotation.id} quotation={quotation} />
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