import db from "../models";
import {v4 as uuidV4} from 'uuid'

const {User, Doc, DocAuth, Sequelize, sequelize} = db
const {Op} = Sequelize

function sortByUpdateAtDESC(a, b) {
    return b.updatedAt - a.updatedAt
}

export class docController {
    getList = async (req, res) => {
        try {
            const {login_user} = res.locals
            const {keyword} = req.query
            let sql = `SELECT DISTINCT ON (uuid) * FROM "Doc" `
            sql += `WHERE "creatorId" = ${login_user.id} `
            if (keyword) {
                sql += `AND "name" LIKE '%${keyword}%' `
            }
            sql += 'ORDER BY "Doc"."uuid" ASC,  "Doc"."updatedAt" DESC '
            let docs = await sequelize.query(sql, {
                model: Doc,
                mapToModel: true // pass true here if you have any mapped fields
            })
            docs.sort(sortByUpdateAtDESC)
            if (!docs) {
                return res.status(404).json({msg: "找不到文件"});
            } else {
                return res.status(200).json(docs);
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json({msg: error});
        }
    }
    getId = async (req, res) => {
        try {
            const {login_user} = res.locals

            const {uuid} = req.params;
            const doc = await Doc.findOne({
                where: {
                    uuid
                },
                order: [['updatedAt', 'DESC']]
            });
            if (!doc) {
                return res.status(404).json({msg: "找不到文件"});
            }
            const query = []
            if (login_user.id) {
                query.push({creatorId: login_user.id})
                query.push({
                    [Op.and]: [
                        {'$DocAuths.UserId$': login_user.id},
                        {'$DocAuths.auth$': {[Op.gte]: 1}}
                    ]
                })
            } else {
                query.push({
                    [Op.and]: [
                        {'$DocAuths.UserId$': -1},
                        {'$DocAuths.auth$': {[Op.gte]: 1}}
                    ]
                })
            }
            const docAuth = await Doc.findOne({
                where: {
                    [Op.and]: [
                        {uuid: uuid},
                        {
                            [Op.or]: query
                        }
                    ]
                },
                order: [['updatedAt', 'DESC']],
                include: [
                    {model: User, as: 'creator'},
                    {
                        model: DocAuth,
                        as: 'DocAuths',
                        required: true,
                        include: [{
                            model: User,
                            required: true
                        }]
                    }
                ],
                subQuery: false
            });
            if (!docAuth) {
                return res.status(401).json({msg: "沒有權限"});
            } else {
                return res.status(200).json(doc.toJSON());
            }
        } catch (error) {
            console.log(error);
            return res.status(404).json({msg: "找不到文件"});
        }
    }
    create = async (req, res) => {
        try {
            const {login_user} = res.locals

            const {name} = req.body;
            const uuid = uuidV4()
            const doc = await Doc.create({uuid, name: name, content: {}, creatorId: login_user.id})
            await DocAuth.create({UserId: -1, auth: 0, DocId: doc.id})
            return res.status(200).json({uuid: uuid.toString()});
        } catch (error) {
            console.log(error);
            return res.status(500).json({msg: error});
        }
    }
    put = async (req, res) => {
        try {
            const {uuid} = req.params;
            const required = ["name", "content"]
            const data = {}
            required.forEach(key => {
                if (!req.body[key]) return res.status(400).json({msg: `「${key}」為必填欄位`});
                data[key] = req.body[key]
            })
            const doc = await Doc.findOne({
                where: {
                    [Op.and]: [
                        {uuid: uuid},
                        {
                            [Op.or]: [
                                {creatorId: login_user.id},
                                {
                                    [Op.and]: [
                                        {'$DocAuths.UserId$': login_user.id},
                                        {'$DocAuths.auth$': {[Op.gte]: 1}}
                                    ]
                                }
                            ]
                        }
                    ]
                },
                order: [['updatedAt', 'DESC']],
                include: [
                    {model: User, as: 'creator'},
                    {
                        model: DocAuth,
                        as: 'DocAuths',
                        required: true,
                        include: [{
                            model: User,
                            required: true
                        }]
                    }
                ],
                subQuery: false
            });
            await doc.update(data)
            return res.status(200).json({uuid: uuid.toString()});
        } catch (error) {
            console.log(error);
            return res.status(500).json({msg: error});
        }
    }
    patch = async (req, res) => {
        try {
            const {login_user} = res.locals
            const {uuid} = req.params;
            const {name, content} = req.body;
            const doc = await Doc.findOne({
                where: {
                    [Op.and]: [
                        {uuid: uuid},
                        {
                            [Op.or]: [
                                {creatorId: login_user.id},
                                {
                                    [Op.and]: [
                                        {'$DocAuths.UserId$': login_user.id},
                                        {'$DocAuths.auth$': {[Op.gte]: 1}}
                                    ]
                                }
                            ]
                        }
                    ]
                },
                order: [['updatedAt', 'DESC']],
                include: [
                    {model: User, as: 'creator'},
                    {
                        model: DocAuth,
                        as: 'DocAuths',
                        required: true,
                        include: [{
                            model: User,
                            required: true
                        }]
                    }
                ],
                subQuery: false
            });
            const docUpdated = await doc.update({name, content})
            return res.status(200).json(docUpdated);
        } catch (error) {
            console.log(error);
            return res.status(500).json({msg: error});
        }
    }

    delete = async (req, res) => {
        try {
            const {login_user} = res.locals
            const {uuid} = req.params;
            const doc = await Doc.findOne({
                where: {
                    [Op.and]: [
                        {uuid: uuid},
                        {
                            [Op.or]: [
                                {creatorId: login_user.id},
                                {
                                    [Op.and]: [
                                        {'$DocAuths.UserId$': login_user.id},
                                        {'$DocAuths.auth$': {[Op.gte]: 1}}
                                    ]
                                }
                            ]
                        }
                    ]
                },
                order: [['updatedAt', 'DESC']],
                include: [
                    {model: User, as: 'creator'},
                    {
                        model: DocAuth,
                        as: 'DocAuths',
                        required: true,
                        include: [{
                            model: User,
                            required: true
                        }]
                    }
                ],
                subQuery: false
            });
            await Doc.destroy({
                where: {uuid, creatorId: login_user.id},
            });
            if (!doc) {
                return res.status(404).json({msg: "找不到文件"});
            } else {
                return res.status(200).json(doc.toJSON());
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json({msg: error});
        }
    }
    getDocAuth = async (req, res) => {
        try {
            const {login_user} = res.locals
            const {uuid} = req.params;
            const query = []
            if (login_user.id) {
                query.push({creatorId: login_user.id})
                query.push({
                    [Op.and]: [
                        {'$DocAuths.UserId$': login_user.id},
                        {'$DocAuths.auth$': {[Op.gte]: 1}}
                    ]
                })
            } else {
                query.push({
                    [Op.and]: [
                        {'$DocAuths.UserId$': -1},
                        {'$DocAuths.auth$': {[Op.gte]: 1}}
                    ]
                })
            }
            const doc = await Doc.findOne({
                where: {
                    [Op.and]: [
                        {uuid: uuid},
                        {
                            [Op.or]: query
                        }
                    ]
                },
                order: [['updatedAt', 'DESC']],
                include: [
                    {model: User, as: 'creator'},
                    {
                        model: DocAuth,
                        as: 'DocAuths'
                    }
                ],
                subQuery: false
            });
            const docAuth = await DocAuth.findAll({
                where: {DocId: doc.id},
                include: [User]
            })
            if (!doc) {
                return res.status(404).json({msg: "找不到文件"});
            } else {
                return res.status(200).json(docAuth);
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json({msg: error});
        }
    }
    setDocAuth = async (req, res) => {
        try {
            const {login_user} = res.locals
            const {uuid} = req.params;
            const {docAuths} = req.body;

            const doc = await Doc.findOne({
                where: {uuid, creatorId: login_user.id},
                order: [['updatedAt', 'DESC']],
            })
            if (!doc) {
                return res.status(404).json({msg: "找不到文件"});
            } else {
                const setDocAuthList = []
                for (const auth of docAuths) {
                    const [docAuth, created] = await DocAuth.findOrCreate({
                        where: {DocId: doc.id, UserId: auth.User.id},
                        defaults: {
                            auth: auth.auth
                        }
                    });
                    if (docAuth) {
                        const newAuth = await docAuth.update({auth: auth.auth})
                        setDocAuthList.push(newAuth)
                    } else {
                        setDocAuthList.push(created)
                    }
                }
                await doc.setDocAuths(setDocAuthList)
                await DocAuth.destroy({where: {DocId: null}})
                return res.status(200).json(doc.toJSON());
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json({msg: error});
        }
    }
}