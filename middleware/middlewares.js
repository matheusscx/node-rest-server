const jwt = require('jsonwebtoken');


let validarToken = (req, res, next) => {
    let token = req.get('Authorization');
    jwt.verify(token, process.env.SEED_TOKEN, (err, decoded) => {

        if (err) {
            res.status(401).json({
                status: false,
                err
            });
        } else {
            req.user = decoded.user;
            next();
        }
    });
};

let validarAdminRole = (req, res, next) => {
    let adminRole = req.user.role;
    if (adminRole === 'ADMIN_ROLE') {
        next();
    } else {
        res.status(401).json({
            status: false,
            err: {
                message: 'No tienes permiso de administrador'
            }
        });
    }
}




module.exports = {
    validarToken,
    validarAdminRole
}