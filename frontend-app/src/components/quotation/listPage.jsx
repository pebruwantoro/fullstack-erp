import { useEffect, useState } from "react";
import { useLocalStorage } from "react-use";
import { alertError } from "../../lib/alert";
import { List as quotationList } from "../../api/quotation.js";
import { useNavigate } from "react-router";
import { formatDollarCurrency } from "../../util/format.js";
import { format } from 'date-fns';
import Pagination from "../pagination.jsx";
import { UserRole, QuotationStatus } from "../../constant/constant.js";


export default function QuotationListPage() {
    const [token, _] = useLocalStorage("token");
    const [role, __] = useLocalStorage("role", "");
    const [quotations, setQuotations] = useState([]);
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }
        async function fetchQuotations() {
            let params = {
                page: Number(currentPage),
                per_page: Number(9),
            };

            if (role === UserRole.SALES){
                params.status = QuotationStatus.PENDING;
            }
            
            const response = await quotationList(token, params);
            const responseBody = await response.json();
            
            if(response.status === 200) {
                setQuotations(responseBody.data.list);
                setTotalPages(responseBody.data.pagination.total_page);
                console.log(responseBody.data.list[0].created_at)
            } else {
                alertError(response.message)
            }
        }
        fetchQuotations();
    }, [token, navigate, currentPage]);

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'pending':
            return 'text-red-500';
            case 'approved':
            return 'text-green-500';
            case 'processed':
            return 'text-blue-500';
            default:
            return 'text-gray-400';
        }
    };


    return (
        <div className="flex flex-col h-full">
            {/* The grid for the list items (NO flex-grow here) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {quotations.map(quotation => (
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
                ))}
            </div>
            
            <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
        </div>
    );
}