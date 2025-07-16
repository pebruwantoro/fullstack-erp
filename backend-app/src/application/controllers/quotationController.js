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
}