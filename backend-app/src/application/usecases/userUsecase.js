import { User, UserRole } from '../models/user.js';
import { ErrorConstant } from '../constant/error.js';
import bcrypt from 'bcryptjs';

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
}