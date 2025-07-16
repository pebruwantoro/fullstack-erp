import { ErrorConstant } from '../constant/error.js';
import { Quotation, QuotationStatus } from '../models/quotation.js';
import { QuotationItem } from '../models/quotationItem.js';


export default class QuotationUsecase {
    constructor(quotationRepository, quotationItemRepository, productRepository) {
        this.quotationRepository = quotationRepository;
        this.quotationItemRepository = quotationItemRepository;
        this.productRepository = productRepository;
    }

    async createQuotation(quotationRequest) {
        if (quotationRequest.products.length === 0) {
            throw new Error(ErrorConstant.ErrorProductNull);
        }

        const ids = quotationRequest.products.map(product => product.id);
        const getProducts = await this.productRepository.findByIds(ids);
        
        if (quotationRequest.products.length !== getProducts.length) {
            throw new Error(ErrorConstant.ErrorProductPayloadInvalid);
        }

        const totalAmount = quotationRequest.products.reduce((sum, product) => {
            return sum + (product.price * product.quantity);
        }, 0);
        
        const newQuotation = new Quotation(null, quotationRequest.createdBy, QuotationStatus.PENDING, totalAmount, null, null, null, quotationRequest.createdBy)

        const quotation = await this.quotationRepository.create(newQuotation);

        const newQuotationItems = quotationRequest.products.map(product => {
            return  new QuotationItem(null, quotation.id, product.id, product.quantity, product.price, (product.quantity * product.price));
        })

        await this.quotationItemRepository.createMany(newQuotationItems)
       
        const updatedProduct = getProducts.map(product => {
            const requestedItem = quotationRequest.products.find(item => item.id === product.id);
            if (requestedItem) {
                return {
                    ...product,
                    stock: product.stock - requestedItem.quantity,
                    updated_at: new Date(),
                    updatedBy: quotationRequest.createdBy,
                }
            }
        })
        
        await this.productRepository.updateMany(ids, updatedProduct)

        return quotation;
    }

    async approveQuotation({ id, updatedBy }) {
        const getQuotation = await this.quotationRepository.findById(id);
        if (!getQuotation) {
            throw new Error(ErrorConstant.ErrorQuotationNotFound)
        }
        
        if (getQuotation.status == QuotationStatus.APPROVED) {
            throw new Error(ErrorConstant.ErrorQuotationAlreadyApproved)
        }

        getQuotation.status = QuotationStatus.APPROVED
        
        const updatedQuotation = await this.quotationRepository.update(id, getQuotation, updatedBy)

        return updatedQuotation
    }
}