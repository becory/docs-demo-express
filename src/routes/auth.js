import express from 'express';
import {authController} from "../controllers/auth";
const router = express.Router();

const auth = new authController()
router.post("/login", async function (req, res) {
    return auth.login(req, res)
});
export default router;