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

    async loginUser(req, res){
        try {
            const { email, password } = req.body;
            const result = await this.userUsecase.loginUser({ email, password })
            res.status(200).json({
                success: true,
                message: "success login",
                data: {
                    'token': result,
                }
            })
        } catch (error){
            return res.status(401).json({
                success: false,
                message: error.message,
            });
        }
    }
}