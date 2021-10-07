import express from 'express';
import compression from 'compression';
import path from 'path';
import bodyParser from "body-parser";
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import {Server} from "socket.io";
import cors from "cors";
import {UserActionMap} from "./utils/UserActionMap";

import {fileURLToPath} from 'url';
import {dirname} from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import indexRouter from './routes';
import userRouter from './routes/user';
import authRouter from './routes/auth';
import docRouter from './routes/doc';
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import db from './models'
import {UserMap} from "./utils/UserMap";
import helmet from "helmet";

const {Doc, DocAuth, User, Sequelize} = db
const {Op} = Sequelize

const app = express();

dotenv.config({path: path.resolve(__dirname, `../.env.${process.env.NODE_ENV}`)});

const corsOptions = {
    origin: process.env.CORS_URL,
    // 'http://localhost:3000'
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
const io = new Server()
app.set("io", io)
app.use(helmet());
app.use(compression())
app.use(cors(corsOptions))
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

export let userMap = new UserMap(1000 * 60 * 3)
let userOnlineMap = new UserActionMap(1000 * 60 * 3, "user")
let cursorMap = new UserActionMap(1000 * 60 * 3, "cursor")
let selectionMap = new UserActionMap(1000 * 60 * 3, "range")

app.use('/api', indexRouter);
app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/doc', docRouter);

// const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);
io.on('connection', function (socket) {
    const uuid = socket.handshake.query.uuid
    let login_user = {}
    let doc = null
    let docAuth = null
    socket.use(async (sockets, next) => {
        let token;
        try {
            token = socket.handshake.auth.token;
            if (!token.id) {
                jwt.verify(token, process.env['JWT_SIGN_SECRET'], function (err, decode) {
                    if (!err) {
                        login_user = decode
                        return next();
                    } else {
                        const error = new Error("not authorized");
                        error.data = {content: "Please retry later"}; // additional details
                        return next(error);
                    }
                });
            } else {
                if (!doc || doc.uuid !== uuid) {
                    doc = await Doc.findOne({
                        where: {uuid},
                        order: [['updatedAt', 'DESC']],
                    });
                    docAuth = await DocAuth.findOne({
                        where: {DocId: doc.id, UserId: -1, auth: {[Op.gte]: 1}}
                    })
                }
                if (docAuth) {
                    login_user = socket.handshake.auth.token
                    return next();
                } else {
                    const error = new Error("not authorized");
                    error.data = {content: "Please retry later"}; // additional details
                    return next(error);
                }
            }
        } catch (error) {
            console.log(error)
        }
    });
    socket.on("get-document", async () => {
        try {
            const query = []
            if (login_user.id && Number.isInteger(login_user.id)) {
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
            if (!doc) {
                return socket.emit('error', {status: '404'})
            }
            const now = new Date()
            if (!userMap.getUser(login_user)) {
                userMap.create(login_user, now)
            }
            userOnlineMap.create(uuid, now)
            userOnlineMap.update(uuid, {...userMap.getUser(login_user), user: {}, time: new Date()})
            socket.join(uuid)
            socket.emit('receive-users', userOnlineMap.getResult(uuid, now))
            socket.emit("load-document", {
                content: doc.content,
                updated: doc.updatedAt,
                User: {name: ''},
                editable: doc.DocAuths[0].auth === 2 || doc.creatorId === login_user.id
            })
        } catch (e) {
            console.log(e)
            return socket.emit('error', {status: '404'})
        }
    })
    socket.on("send-changes", async delta => {
        const doc = await Doc.findOne({
            where: {uuid},
            order: [['updatedAt', 'DESC']],
            include: [{model: User, as: 'creator'}]
        })
        const docUpdate = await doc.update({content: delta.data})
        const now = new Date()
        userOnlineMap.create(uuid, now)
        userOnlineMap.update(uuid, {...userMap.getUser(login_user), user: {}, time: new Date()})
        socket.broadcast.to(uuid).emit('receive-users', userOnlineMap.getResult(uuid, now))
        socket.emit('receive-updated', {updated: docUpdate.updatedAt, User: login_user})
        socket.broadcast.to(uuid).emit('receive-updated', {updated: docUpdate.updatedAt, User: login_user})
        socket.broadcast.to(uuid).emit("receive-changes", {delta: delta.delta})
    })

    socket.on("send-cursor-changes", cursor => {
        const now = new Date()
        if (!userMap.getUser(login_user)) {
            userMap.create(login_user, now)
        }
        userOnlineMap.create(uuid, now)
        userOnlineMap.update(uuid, {...userMap.getUser(login_user), user: {}, time: new Date()})
        cursorMap.create(uuid, now)
        cursorMap.update(uuid, {...userMap.getUser(login_user), ...cursor})
        socket.broadcast.to(uuid).emit('receive-users', userOnlineMap.getResult(uuid, now))
        socket.broadcast.to(uuid).emit("receive-cursor-changes", cursorMap.getResult(uuid, now))
    })
    socket.on("send-selection-changes", selection => {
        const now = new Date()
        if (!userMap.getUser(login_user)) {
            userMap.create(login_user, now)
        }
        userOnlineMap.create(uuid, now)
        userOnlineMap.update(uuid, {...userMap.getUser(login_user), user: {}, time: new Date()})
        selectionMap.create(uuid, now)
        selectionMap.update(uuid, {...userMap.getUser(login_user), ...selection})
        socket.broadcast.to(uuid).emit('receive-users', userOnlineMap.getResult(uuid, now))
        socket.broadcast.to(uuid).emit("receive-selection-changes", selectionMap.getResult(uuid, now))
    })
    socket.on('disconnect', function () {
        const now = new Date()
        userMap.removeUser(login_user)
        userOnlineMap.removeUser(login_user.id)
        cursorMap.removeUser(login_user.id)
        selectionMap.removeUser(login_user.id)
        socket.leave(uuid)
        socket.broadcast.to(uuid).emit('receive-users', userOnlineMap.getResult(uuid, now))
        socket.broadcast.to(uuid).emit("receive-cursor-changes", cursorMap.getResult(uuid, now))
        socket.broadcast.to(uuid).emit("receive-selection-changes", selectionMap.getResult(uuid, now))
    });
});
export default app;
