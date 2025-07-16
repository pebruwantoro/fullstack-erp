import { ErrorConstant } from "../constant/error.js";

export default class ProductController {
    constructor(productUsecase) {
        this.productUsecase = productUsecase;
    }

    async getProductDetail(req, res){
        try {
            const { id } = req.params;
            const result = await this.productUsecase.getProductById({ id: id })
            res.status(200).json({
                success: true,
                message: "success get product",
                data: result,
            })
        } catch (error){
            if (error.message === ErrorConstant.ErrorProductNotFound) {
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

    async getListProduct(req, res){
        try {
            const result = await this.productUsecase.getListProduct()
            res.status(200).json({
                success: true,
                message: "success get product",
                data: result,
            })
        } catch (error){
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }
}