import { User, UserRole } from '../models/user.js';
import { ErrorConstant } from '../constant/error.js';
import bcrypt from 'bcryptjs';
import generateAuthToken from '../util/token.js';
import { Customer } from '../models/customer.js';


export default class UserUsecase {
    constructor(userRepository, customerRepository) {
        this.userRepository = userRepository;
        this.customerRepository = customerRepository;
    }

    async createUser({ name, email, password, role, createdBy}) {
        if(!Object.values(UserRole).includes(role)) {
            throw new Error(ErrorConstant.ErrorInvalidUserRole);
        }

        const existingUser = await this.userRepository.findByEmail(email);
        if (existingUser) {
            throw new Error(ErrorConstant.ErrorEmailAlreadyRegistered)
        }

        const hashPassword = await bcrypt.hash(password, 10);
        const newUser = new User(null, name, email, hashPassword, role, null, null, null, createdBy, null, null);
        
        const user = await this.userRepository.create(newUser)
        if (newUser.role === UserRole.CUSTOMER) {
            const newCustomer = new Customer(null, user.id)
            await this.customerRepository.create(newCustomer);
        }

        return user
    }

    async loginUser({ email, password }) {
        const getUser = await this.userRepository.findByEmail(email);
        if (!getUser) {
            throw new Error(ErrorConstant.ErrorInvalidCredentials)
        }

        const isPasswordMatch = await bcrypt.compare(password, getUser.password);
        if (!isPasswordMatch){
            throw new Error(ErrorConstant.ErrorInvalidCredentials)
        }

        const payload = {
            id: getUser.id,
            email: getUser.email,
            role: getUser.role,
        };

        let customer = null;
        if (getUser.role === UserRole.CUSTOMER) {
            const getCustomer = await this.customerRepository.findByUserId(getUser.id);
            if (!getCustomer) {
                throw new Error(ErrorConstant.ErrorCustomerDataNotFound)
            }

            customer = getCustomer
        }

        if (customer) {
            payload.customer_id = customer.id;
        }

        const token = generateAuthToken(payload);

        return { token }
    }

    async getUserById({ id }) {
        const getUser = await this.userRepository.findById(id);
        if (!getUser) {
            throw new Error(ErrorConstant.ErrorUserNotFound)
        }

        let customer = null
        if (getUser.role === UserRole.CUSTOMER) {
            const getCustomer = await this.customerRepository.findByUserId(getUser.id);
            if (!getCustomer) {
                throw new Error(ErrorConstant.ErrorCustomerDataNotFound)
            }

            customer = getCustomer
        }

        const userProfile = {
            'id': getUser.id,
            'name': getUser.name,
            'email': getUser.email,
            'role': getUser.role,
        };

        if (customer) {
            userProfile.customer_id = customer.id;
        }

        return userProfile
    }
}