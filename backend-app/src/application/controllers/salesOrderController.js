export default class SalesOrderController {
    constructor(salesOrderUsecase) {
        this.salesOrderUsecase = salesOrderUsecase;
    }

    async createSalesOrder(req, res) {
        try {
            const user = await this.salesOrderUsecase.createSalesOrder();
            res.status(201).json({
                success: true,
                message: "success create sales orders",
                data: user.id,
            });
        } catch(error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }
}