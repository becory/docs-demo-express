import jwt from 'jsonwebtoken'
const authentication = (req, res, next) => {
    let token;
    try {
        token = req.headers['authorization'].split(' ')[1];
    } catch (e) {
        token = '';
    }
    jwt.verify(token, process.env['JWT_SIGN_SECRET'], function (err, decoded) {
        if (!err) {
            res.locals.login_user = decoded
            next();
        } else {
            return res.status(401).json({ message: 'Unauthorized!' });
        }
    });
};

export default authentication;