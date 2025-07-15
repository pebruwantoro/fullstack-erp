import { User } from '../models/user.js';
import { User as UserModel } from '../../database.js';

const _mapToEntity = (userModelInstance) => {
    if (!userModelInstance) {
        return null;
    }
    
    const { id, name, email, password, role, created_at, updated_at, deleted_at, createdBy, updatedBy, deletedBy } = userModelInstance;
    return new User(id, name, email, password, role, created_at, updated_at, deleted_at, createdBy, updatedBy, deletedBy);
};

export default class UserRepository {
    async create(userEntity) {
        const { name, email, password, role, createdBy } = userEntity;

        const newUser = await UserModel.create({
            name,
            email,
            password,
            role,
            createdBy,
        });

        return _mapToEntity(newUser);
    }

    async findByEmail(email){
        const user = await UserModel.findOne({ where: { email } })
        return _mapToEntity(user);
    }
}