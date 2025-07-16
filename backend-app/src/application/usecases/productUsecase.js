import { ErrorConstant } from '../constant/error.js';


export default class ProductUsecase {
    constructor(productRepository, redisClient) {
        this.productRepository = productRepository;
        this.redisClient = redisClient;
    }

    async getProductById({ id }) {
        const getProduct = await this.productRepository.findById(id);
        if (!getProduct) {
            throw new Error(ErrorConstant.ErrorProductNotFound)
        }

        return getProduct;
    }

    async getListProduct() {
        const cacheKey = 'products:all';
        const cachedProducts = await this.redisClient.get(cacheKey);

        if (cachedProducts) {
            return JSON.parse(cachedProducts);
        }
        
        const getProducts = await this.productRepository.findAll();
        await this.redisClient.set(cacheKey, JSON.stringify(getProducts), {
            EX: 600,
        });

        return getProducts;
    }
}