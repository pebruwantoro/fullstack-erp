import { ErrorConstant } from "../constant/error.js";

export default class UserController {
    constructor(userUsecase) {
        this.userUsecase = userUsecase;
    }

    async createUser(req, res) {
        try {
            const data = req.body;
            const user = await this.userUsecase.createUser(data);
            res.status(201).json({
                success: true,
                message: "success create user",
                data: user.id,
            });
        } catch(error) {
            if (error.message === ErrorConstant.ErrorInvalidUserRole || error.message === ErrorConstant.ErrorEmailAlreadyRegistered) {
                res.status(400).json({
                    success: false,
                    message: error.message,
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: error.message,
                });
            }
        }
    }

    async loginUser(req, res){
        try {
            const { email, password } = req.body;
            const result = await this.userUsecase.loginUser({ email, password })
            res.status(200).json({
                success: true,
                message: "success login",
                data: result,
            })
        } catch (error){
            if (error.message === ErrorConstant.ErrorInvalidCredentials) {
                return res.status(400).json({
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

    async getUserProfile(req, res){
        try {
            const userId = req.user.id;
            const result = await this.userUsecase.getUserById({ id: userId })
            res.status(200).json({
                success: true,
                message: "success login",
                data: result,
            })
        } catch (error){
            if (error.message === ErrorConstant.ErrorUserNotFound) {
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
}