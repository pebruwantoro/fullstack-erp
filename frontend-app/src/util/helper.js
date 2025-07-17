
import { SalesOrderStatus, QuotationStatus } from "../constant/constant.js";

export const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
        case QuotationStatus.PENDING:
            return 'text-red-500';
        case QuotationStatus.APPROVED:
            return 'text-green-500';
        case QuotationStatus.PROCESSED:
            return 'text-blue-500';
        case SalesOrderStatus.SHIPPED:
            return 'text-yellow-500';
        case SalesOrderStatus.CANCELED:
            return 'text-red-500';
        case SalesOrderStatus.COMPLETED:
            return 'text-green-500';
        case SalesOrderStatus.INVOICED:
            return 'text-blue-500';
        default:
            return 'text-gray-400';
    }
};
