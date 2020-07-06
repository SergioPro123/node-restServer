var jwt = require('jsonwebtoken');

//=================================
//       Verificar token
//=================================

let verificaToken = (req, res, next) => {

    let token = req.get('Authorization');

    jwt.verify(token, process.env.SEED, (err, decode) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err
            });
        }

        req.usuario = decode.usuario;
        next();
    });

};

//=================================
//     Verificar ADMIN_ROLE 
//=================================

let verificaTokenAdminRole = (req, res, next) => {

    let userRole = req.usuario.role;

    if (userRole === "ADMIN_ROLE") {
        next();
    } else {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'Autorización no permitida'
            }
        });
    }
};
//=================================
//     Verificar token para img
//=================================
let verificaTokenImg = (req, res, next) => {
    let token = req.query.token;

    jwt.verify(token, process.env.SEED, (err, decode) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err
            });
        }

        req.usuario = decode.usuario;
        next();
    })


};
module.exports = {
    verificaToken,
    verificaTokenAdminRole,
    verificaTokenImg
};