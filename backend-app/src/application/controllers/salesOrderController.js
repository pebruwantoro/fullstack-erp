import { ErrorConstant } from "../constant/error.js";

export default class SalesOrderController {
    constructor(salesOrderUsecase) {
        this.salesOrderUsecase = salesOrderUsecase;
    }

    async createSalesOrder(req, res) {
        try {
            await this.salesOrderUsecase.createSalesOrder();
            res.status(201).json({
                success: true,
                message: "success create sales orders",
            });
        } catch(error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    async getSalesOrders(req, res) {
        try {
            let filter = {};
            if (req.query.quotationId){
                filter.quotationId = req.query.quotationId;
            }
            if(req.query.page){
                filter.page = req.query.page;
            } else {
                filter.page = 1;
            }
            if(req.query.per_page){
                filter.limit = req.query.per_page;
            } else {
                filter.limit = 10;
            }
            
            const salesOrder = await this.salesOrderUsecase.getSalesOrders(filter);
            res.status(200).json({
                success: true,
                message: "success create sales orders",
                data: salesOrder,
            });
        } catch(error){
            if(error.message === ErrorConstant.ErrorSalesOrderNotFound){
                res.status(404).json({
                    success: false,
                    message: error.message,
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: error.message,
                });
            }
        }
    }
}