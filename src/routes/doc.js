import express from 'express';
import {docController} from "../controllers/doc";
import authentication from "../middlewares/authentication";
import authenticationDoc from "../middlewares/authenticationDoc";

const router = express.Router();

const doc = new docController()
router.get("/", authentication, async function (req, res, next) {
    return doc.getList(req, res, next)
});
router.get("/:uuid", authenticationDoc, async function (req, res, next) {
    return doc.getId(req, res, next)
});
router.post("/", authentication, async function (req, res, next) {
    return doc.create(req, res, next)
});
router.put("/:uuid", authenticationDoc, async function (req, res, next) {
    return doc.put(req, res, next)
});
router.patch("/:uuid", authenticationDoc, async function (req, res, next) {
    return doc.patch(req, res, next)
});
router.delete("/:uuid", authentication, async function (req, res, next) {
    return doc.delete(req, res, next)
});
router.get("/:uuid/doc_auth", authenticationDoc, async function (req, res, next) {
    return doc.getDocAuth(req, res, next)
});
router.patch("/:uuid/doc_auth", authentication, async function (req, res, next) {
    return doc.setDocAuth(req, res, next)
});
export default router;