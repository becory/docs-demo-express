import jwt from 'jsonwebtoken'
import db from "../models";

const {Doc, DocAuth, Sequelize} = db
const {Op} = Sequelize

const authenticationDoc = async (req, res, next) => {
    let token;
    try {
        token = req.headers['authorization'].split(' ')[1];
        jwt.verify(token, process.env['JWT_SIGN_SECRET'], async function (err, decoded) {
            if (!err) {
                res.locals.login_user = decoded
                return next();
            } else {
                const {uuid} = req.params;
                const doc = await Doc.findOne({
                    where: {uuid},
                    order: [['updatedAt', 'DESC']],
                });
                const docAuth = await DocAuth.findOne({
                    where: {DocId: doc.id, UserId: -1, auth: {[Op.gte]: 1}}
                })
                if (docAuth) {
                    res.locals.login_user = 'Guest'
                    return next();
                } else {
                    return res.status(401).json({msg: 'Unauthorized!'});
                }
            }
        });
    } catch (e) {
        const {uuid} = req.params;
        const doc = await Doc.findOne({
            where: {uuid},
            order: [['updatedAt', 'DESC']],
        });
        const docAuth = await DocAuth.findOne({
            where: {DocId: doc.id, UserId: -1, auth: {[Op.gte]: 1}}
        })
        if (docAuth) {
            res.locals.login_user = 'Guest'
            return next();
        } else {
            return res.status(401).json({msg: 'Unauthorized!'});
        }
    }
};

export default authenticationDoc;