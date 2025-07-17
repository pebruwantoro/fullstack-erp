import { format } from 'date-fns';
import { formatDollarCurrency } from "../../util/format.js";
import { getStatusColor } from '../../util/helper.js';


function DetailRow({ icon, label, value, isTruncated = false }) {
  return (
    <div className="flex items-start">
      <i className={`fas ${icon} text-gray-400 dark:text-slate-500 w-6 pt-1 text-center`} />
      <span className="font-medium text-gray-500 dark:text-slate-400 mr-3">{label}:</span>
      <span
        className={`text-gray-800 dark:text-slate-200 ${isTruncated ? 'truncate' : ''}`}
        title={value}
      >
        {value}
      </span>
    </div>
  );
}

export default function SalesOrderCard({ salesOrder }) {
    return (
        <div className="bg-white dark:bg-slate-800/80 border border-gray-200 dark:border-slate-700 rounded-xl shadow-lg dark:shadow-slate-900/50 card-hover animate-fade-in">
            <div className="p-6">
                <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center mr-3 shadow-md flex-shrink-0">
                        <i className="fas fa-file-invoice-dollar text-white" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white truncate" title={salesOrder.id}>
                        {salesOrder.id}
                    </h2>
                </div>
                <p className={`text-sm mb-5 font-bold ${getStatusColor(salesOrder.status)}`}>
                    {salesOrder.status.toUpperCase()}
                </p>

                <div className="space-y-3 text-sm">
                    <DetailRow
                        icon="fa-receipt"
                        label="Quotation"
                        value={salesOrder.quotation_id}
                        isTruncated={true}
                    />
                    <DetailRow
                        icon="fa-dollar-sign"
                        label="Total"
                        value={formatDollarCurrency(salesOrder.total_amount)}
                    />
                    <DetailRow
                        icon="fa-calendar-alt"
                        label="Created"
                        value={format(new Date(salesOrder.created_at), 'dd MMMM yyyy')}
                    />
                    {salesOrder.updated_at && (
                        <DetailRow
                            icon="fa-edit"
                            label="Updated"
                            value={format(new Date(salesOrder.updated_at), 'dd MMMM yyyy')}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}