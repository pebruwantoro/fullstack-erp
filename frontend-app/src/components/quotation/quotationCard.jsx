import { format } from 'date-fns';
import { formatDollarCurrency } from "../../util/format.js";
import { QuotationStatus } from "../../constant/constant.js";

const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
        case QuotationStatus.PENDING:
            return 'text-red-500';
        case QuotationStatus.APPROVED:
            return 'text-green-500';
        case QuotationStatus.PROCESSED:
            return 'text-blue-500';
        default:
            return 'text-gray-400';
    }
};

export default function QuotationCard({ quotation }) {
    return (
        <div className="bg-gray-800 bg-opacity-80 rounded-xl shadow-custom border border-gray-700 overflow-hidden card-hover animate-fade-in">
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
                    <p className="flex items-center">
                        <i className="fas fa-dollar-sign text-gray-500 w-6" />
                        <span className="font-medium w-24">Total:</span>
                        <span>{formatDollarCurrency(quotation.total_amount)}</span>
                    </p>
                    <p className="flex items-center">
                        <i className="fas fa-calendar-alt text-gray-500 w-6" />
                        <span className="font-medium w-24">Created:</span>
                        <span>{format(new Date(quotation.created_at), 'dd MMMM yyyy')}</span>
                    </p>
                    {quotation.updated_at && (
                        <p className="flex items-center">
                            <i className="fas fa-edit text-gray-500 w-6" />
                            <span className="font-medium w-24">Updated:</span>
                            <span>{format(new Date(quotation.updated_at), 'dd MMMM yyyy')}</span>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
