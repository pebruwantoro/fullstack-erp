export default class UserController {
    constructor(userUsecase) {
        this.userUsecase = userUsecase;
    }

    async createUser(req, res) {
        try {
            console.log('masuk sini')
            const data = req.body;
            const user = await this.userUsecase.createUser(data);
            res.status(201).json({
                success: true,
                message: "success create user",
                data: user.id,
            });
        } catch(error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }
}