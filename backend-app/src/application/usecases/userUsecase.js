import { User, UserRole } from '../models/user.js';
import { ErrorConstant } from '../constant/error.js';
import bcrypt from 'bcryptjs';
import generateAuthToken from '../util/token.js';

export default class UserUsecase {
    constructor(userRepository) {
        this.userRepository = userRepository;
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
        return this.userRepository.create(newUser)
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

        const token = generateAuthToken(payload);

        return { token }
    }
}