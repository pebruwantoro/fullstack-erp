import { Customer } from '../models/customer.js';
import { Customer as CustomerModel } from '../../database.js';

const _mapToEntity = (CustomerModelInstance) => {
    if (!CustomerModelInstance) {
        return null;
    }
    
    const { id, userId, created_at, updated_at, deleted_at, } = CustomerModelInstance;
    return new Customer(id, userId, created_at, updated_at, deleted_at);
};

export default class CustomerRepository {
    async create(customerEntity) {
        const { userId } = customerEntity;

        const newCustomer = await CustomerModel.create({
            userId,
        });

        return _mapToEntity(newCustomer);
    }

    async findByUserId(userId) {
        const customer = await CustomerModel.findOne({ where: { 
            user_id: userId,
            deleted_at: null,
        } });
        return _mapToEntity(customer);
    }

    async findById(id) {
        const customer = await CustomerModel.findOne({ where: { 
            id: id,
            deleted_at: null,
        } })
        return _mapToEntity(customer);
    }
}