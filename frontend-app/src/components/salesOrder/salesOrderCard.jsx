import { format } from 'date-fns';
import { formatDollarCurrency } from "../../util/format.js";
import { getStatusColor } from '../../util/helper.js';

export default function SalesOrderCard({ salesOrder }) {
    return (
        <div className="bg-gray-800 bg-opacity-80 rounded-xl shadow-custom border border-gray-700 overflow-hidden card-hover animate-fade-in">
            <div className="p-6">
                <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-3 shadow-md flex-shrink-0">
                        <i className="fas fa-file-invoice-dollar text-white" />
                    </div>
                    <h2 className="text-lg font-semibold text-white truncate" title={salesOrder.id}>
                        {salesOrder.id}
                    </h2>
                </div>
                <p className={`text-sm mb-5 font-bold ${getStatusColor(salesOrder.status)}`}>
                    {salesOrder.status.toUpperCase()}
                </p>
                <div className="space-y-3 text-gray-300 text-sm">
                    <div className="flex items-start">
                        <i className="fas fa-file-invoice-dollar text-gray-500 w-6 pt-1 text-center" /> 
                        <span className="font-medium mr-3">Quotation:</span>
                        <span className="truncate text-white" title={salesOrder.quotation_id}>
                            {salesOrder.quotation_id}
                        </span>
                    </div>
                    <div className="flex items-center">
                        <i className="fas fa-dollar-sign text-gray-500 w-6 text-center" />
                        <span className="font-medium mr-3">Total:</span>
                        <span className="text-white">{formatDollarCurrency(salesOrder.total_amount)}</span>
                    </div>
                    <div className="flex items-center">
                        <i className="fas fa-calendar-alt text-gray-500 w-6 text-center" />
                        <span className="font-medium mr-3">Created:</span>
                        <span className="text-white">{format(new Date(salesOrder.created_at), 'dd MMMM yyyy')}</span>
                    </div>
                    {salesOrder.updated_at && (
                        <div className="flex items-center">
                            <i className="fas fa-edit text-gray-500 w-6 text-center" />
                            <span className="font-medium mr-3">Updated:</span>
                            <span className="text-white">{format(new Date(salesOrder.updated_at), 'dd MMMM yyyy')}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
