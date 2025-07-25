import { ErrorConstant } from "../constant/error.js";

export default class QuotationController {
    constructor(quotationUsecase) {
        this.quotationUsecase = quotationUsecase;
    }

    async createQuotation(req, res){
        try {
            const customerId = req.user.customer_id;
            const data = req.body.products;

            const dataProduct = data.map(product => {
                return {
                    id: product.id,
                    price: product.price,
                    quantity: product.quantity,
                }
            })
            
            const quotationRequest = {
                createdBy: customerId,
                products: dataProduct,
            };

            const result = await this.quotationUsecase.createQuotation(quotationRequest)
            res.status(201).json({
                success: true,
                message: "success create quotation",
                data: result.id,
            })
        } catch (error){
            if (error.message === ErrorConstant.ErrorProductNull) {
                return res.status(404).json({
                    success: false,
                    message: error.message,
                });
            } else {
                return res.status(500).json({
                    success: false,
                    message: error.message,
                });
            }
        }
    }

    async approveQuotation(req, res){
        try {
            const salesId = req.user.id;
            const quotationId = req.params.id;
            const result = await this.quotationUsecase.approveQuotation({ id: quotationId, updatedBy: salesId })
            res.status(200).json({
                success: true,
                message: "success approved quotation",
                data: result.id,
            })
        } catch (error){
            if (error.message === ErrorConstant.ErrorQuotationNotFound) {
                return res.status(404).json({
                    success: false,
                    message: error.message,
                });
            } else {
                return res.status(500).json({
                    success: false,
                    message: error.message,
                });
            }
        }
    }

    async getListQuotation(req, res){
        try {
            let filterStatus = null;
            let filterDate = null;
            let filterPage = null;
            let filterLimit = null;
            if(req.query.status) {
                filterStatus = req.query.status;
            }
            if(req.query.date) {
                filterDate = req.query.date;
            }
            if(req.query.page){
                filterPage = req.query.page;
            } else {
                filterPage = 1;
            }
            if(req.query.per_page){
                filterLimit = req.query.per_page;
            } else {
                filterLimit = 10;
            }

            const filter = {
                status: filterStatus,
                createdAt: filterDate,
                page: filterPage,
                limit: filterLimit,
            }
            
            const result = await this.quotationUsecase.getListQuotations(filter)
            res.status(200).json({
                success: true,
                message: "success get quotations",
                data: result,
            })
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }
}