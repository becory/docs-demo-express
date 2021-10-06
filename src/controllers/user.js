import db from "../models";

const {User, Sequelize} = db
const {Op} = Sequelize

export class userController {
    register = async (req, res) => {
        try {
            const {username, password, name, email} = req.body;
            await User.create({username, password, name, email})
            return res.status(200).json({username: username, name: name, email: email});
        } catch (error) {
            console.log(error);
            return res.status(500).json({msg: "err"});
        }
    }
    getList = async (req, res) => {
        try {
            const {login_user} = res.locals
            const {keyword} = req.query
            const user = await User.findAll({
                where: {
                    [Op.not]: {id: [0, login_user.id]},
                    [Op.or]: [
                        {username: {[Op.like]: `%${keyword}%`}},
                        {name: {[Op.like]: `%${keyword}%`}},
                        {email: {[Op.like]: `%${keyword}%`}}
                    ]
                },
                attributes: ['id', 'username', 'name', 'email']
            })
            return res.status(200).json(user)
        } catch (error) {
            console.log(error);
            return res.status(500).json({msg: "err"});
        }
    }
}