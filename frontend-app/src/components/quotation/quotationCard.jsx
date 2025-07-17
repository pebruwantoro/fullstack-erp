import { format } from 'date-fns';
import { formatDollarCurrency } from "../../util/format.js";
import { QuotationStatus, UserRole } from "../../constant/constant.js";
import { ApprovedQuotation as approveQuotation} from "../../api/quotation.js";
import { alertError, alertSuccess } from "../../lib/alert";
import { useLocalStorage } from "react-use";
import { getStatusColor } from '../../util/helper.js';


export default function QuotationCard({ quotation, onApprovalSuccess }) {
    const [token, _] = useLocalStorage("token");
    const [role, __] = useLocalStorage("role", "");

    async function handleApprove(quotationId) {
        const response = await approveQuotation(token, quotationId);
        const responseBody = await response.json();
        
        if(response.status === 200) {
            alertSuccess(responseBody.message)
            if (onApprovalSuccess) {
                onApprovalSuccess();
            }
        } else {
            alertError(response.message)
        }
    }

    function DetailRow({ icon, label, value }) {
        return (
            <p className="flex items-center">
            <i className={`fas ${icon} text-gray-400 dark:text-slate-500 w-6 text-center`} />
            <span className="font-medium text-gray-500 dark:text-slate-400 w-20">{label}:</span>
            <span className="text-gray-800 dark:text-slate-200 truncate">{value}</span>
            </p>
        );
    }

    return (
        <div className="bg-white dark:bg-slate-800/80 border border-gray-200 dark:border-slate-700 rounded-xl shadow-lg dark:shadow-slate-900/50 card-hover animate-fade-in flex flex-col">
            <div className="p-6">
                <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-3 shadow-md flex-shrink-0">
                        <i className="fas fa-file-invoice-dollar text-white" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white truncate" title={quotation.id}>{quotation.id}</h2>
                </div>
                <p className={`text-sm mb-4 h-10 line-clamp-2 ${getStatusColor(quotation.status)}`}>
                    {quotation.status.toUpperCase()}
                </p>
                <div className="space-y-3 text-sm">
                    <DetailRow
                        icon="fa-dollar-sign"
                        label="Total"
                        value={formatDollarCurrency(quotation.total_amount)}
                    />
                    <DetailRow
                        icon="fa-calendar-alt"
                        label="Created"
                        value={format(new Date(quotation.created_at), 'dd MMMM yyyy')}
                    />
                    {quotation.updated_at && (
                        <DetailRow
                            icon="fa-edit"
                            label="Updated"
                            value={format(new Date(quotation.updated_at), 'dd MMMM yyyy')}
                        />
                    )}
                </div>
            </div>
            {quotation.status.toLowerCase() === QuotationStatus.PENDING && role === UserRole.SALES && (
                <div className="px-6 pb-6 mt-4 flex justify-end">
                    <button
                        onClick={() => handleApprove(quotation.id)}
                        className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-green-500 transition-colors"
                    >
                        <i className="fas fa-check mr-2" />
                        Approve
                    </button>
                </div>
            )}
        </div>
    );
}