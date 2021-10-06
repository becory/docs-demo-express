import jwt from "jsonwebtoken";
import db from "../models";
import {userMap} from "../app";

const {User} = db

export class authController {
    login = async (req, res) => {
        try {
            const {username, password} = req.body;
            const user = await User.findOne({where: {username}})
            if (user) {
                const authComplete = user.validPassword(password)
                if (!authComplete) {
                    return res.status(401).json({msg: "帳號密碼錯誤"});
                }
                const login_user = {id: user.id, username, name: user.name}
                if (!userMap.getUser(login_user)) {
                    const now = new Date()
                    userMap.create(login_user, now)
                }
                const token = jwt.sign({...userMap.getUser(login_user)}, process.env.JWT_SIGN_SECRET);
                return res.status(200).json({token});
            }
            return res.status(404).json({msg: "帳號密碼錯誤"});
        } catch (error) {
            console.log(error);
            return res.status(500).json({msg: "err"});
        }
    }
}