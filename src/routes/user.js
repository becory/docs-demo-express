import express from 'express';
import {userController} from "../controllers/user";
import authentication from "../middlewares/authentication";

const router = express.Router();

const user = new userController()

/* GET users listing. */
router.get('/', authentication, function (req, res) {
    return user.getList(req, res)
});

router.post('/register', function (req, res) {
    return user.register(req, res)
});

export default router;