
import { SalesOrderStatus, QuotationStatus } from "../constant/constant.js";
import { ErrorConstant } from "../constant/error.js";

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

export const emailValidation = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new Error(ErrorConstant.ErrorEmailInvalid)
    }
}

export const passwordValidation = (password) => {
    if (password.length < 8) {
        throw new Error(ErrorConstant.ErrorPasswordInvalidMin);
    }
    if (!/[a-z]/.test(password)) {
        throw new Error(ErrorConstant.ErrorPasswordInvalidNotContainLowercase);
    }
    if (!/[A-Z]/.test(password)) {
        throw new Error(ErrorConstant.ErrorPasswordInvalidNotContainUppercase);
    }
    if (!/\d/.test(password)) {
        throw new Error(ErrorConstant.ErrorPasswordInvalidNotContainNumber);
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        throw new Error(ErrorConstant.ErrorPasswordInvalidNotContainSpecialCharacter);
    }
}