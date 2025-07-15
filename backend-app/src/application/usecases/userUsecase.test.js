import { jest } from '@jest/globals';
import UserUsecase from './userUsecase.js';
import { User, UserRole } from '../models/user.js';
import { ErrorConstant } from '../constant/error.js';
import bcrypt from 'bcryptjs';
import { sequelize } from '../../database.js';
import UserRepository from '../repositories/userRepository.js';

jest.mock('../repositories/userRepository.js');

describe('UserUsecase', () => {
  let userUsecase;
  let mockUserRepository;

  beforeEach(() => {
    mockUserRepository = new UserRepository();
    userUsecase = new UserUsecase(mockUserRepository);
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('createUser', () => {
    it('success create new user', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'customer',
        createdBy: 'admin',
      };

      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockUserRepository.create.mockImplementation(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return new User(1, user.name, user.email, hashedPassword, user.role, new Date(), new Date(), null, user.createdBy, null, null);
      });

      const newUser = await userUsecase.createUser(userData);

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(userData.email);
      expect(mockUserRepository.create).toHaveBeenCalled();
      expect(newUser).toBeInstanceOf(User);
      expect(newUser.email).toBe(userData.email);
    });

    it('error user role invalid', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'INVALID_ROLE',
        createdBy: 'admin',
      };

      await expect(userUsecase.createUser(userData)).rejects.toThrow(
        ErrorConstant.ErrorInvalidUserRole
      );
    });

    it('error email already registered', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'sales',
        createdBy: 'admin',
      };

      mockUserRepository.findByEmail.mockResolvedValue(new User(1, 'Existing User', 'test@example.com', 'hashedpassword', UserRole.USER, new Date(), new Date(), null, 'admin', null, null));

      await expect(userUsecase.createUser(userData)).rejects.toThrow(
        ErrorConstant.ErrorEmailAlreadyRegistered
      );
    });
  });

  describe('loginUser', () => {
    it('success login', async () => {
      const userData = {
        email: 'test@example.com',
        password: '1234',
      };

      mockUserRepository.findByEmail.mockResolvedValue(new User(1, 'Existing User', 'test@example.com', '$2a$10$J8qh.eurZGQDk8o8EafJpOYlOvLGOSz7osjcIoiZ3I5rRyvFe0dpC', UserRole.CUSTOMER, new Date(), new Date(), null, 'admin', null, null));

      const result = await userUsecase.loginUser(userData);

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(userData.email);
      expect(result.token).not.toBe('');
      expect(result.token).not.toBe(NaN);
      expect(result.token).not.toBe(undefined);
    });

    it('error user not found', async () => {
      const userData = {
        email: 'test@example.com',
        password: '1234',
      };

      mockUserRepository.findByEmail.mockResolvedValue(null);

      await expect(userUsecase.loginUser(userData)).rejects.toThrow(
        ErrorConstant.ErrorInvalidCredentials
      );
    });

    it('error password not match', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'wrong-password',
      };

      mockUserRepository.findByEmail.mockResolvedValue(new User(1, 'Existing User', 'test@example.com', '$2a$10$J8qh.eurZGQDk8o8EafJpOYlOvLGOSz7osjcIoiZ3I5rRyvFe0dpC', UserRole.CUSTOMER, new Date(), new Date(), null, 'admin', null, null));

      await expect(userUsecase.loginUser(userData)).rejects.toThrow(
        ErrorConstant.ErrorInvalidCredentials
      );
    });
  });

  describe('getUserById', () => {
    it('success get user', async () => {
      const id = 'user-id-1'

      mockUserRepository.findById.mockResolvedValue(new User('user-id-1', 'Existing User', 'test@example.com', '$2a$10$J8qh.eurZGQDk8o8EafJpOYlOvLGOSz7osjcIoiZ3I5rRyvFe0dpC', UserRole.CUSTOMER, new Date(), new Date(), null, 'admin', null, null));

      const result = await userUsecase.getUserById(id);
      
      expect(result.id).toBe(id);
      expect(result.name).toBe('Existing User');
      expect(result.email).toBe('test@example.com');
      expect(result.role).toBe(UserRole.CUSTOMER);
    });

    it('error user not found', async () => {
      const id = 'user-id-1'

      mockUserRepository.findById.mockResolvedValue(null);

      await expect(userUsecase.getUserById(id)).rejects.toThrow(
        ErrorConstant.ErrorUserNotFound
      );
    });
  });
});