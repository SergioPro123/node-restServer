const express = require('express');

const bcrypt = require('bcrypt');

const _ = require('underscore');

const Usuario = require('../models/usuario');
const { verificaToken, verificaTokenAdminRole } = require('../middlewares/autenticacion');

const app = express();

app.get('/usuario', [verificaToken], function(req, res) {

    let desde = Number(req.query.desde) || 0;
    let hasta = Number(req.query.hasta) || 16;

    Usuario.find({ estado: true }, 'nombre role email estado google img ')
        .skip(desde)
        .limit(hasta)
        .exec((err, usuarios) => {
            if (err) {
                res.status(400).json({
                    ok: false,
                    error: err
                });
            } else {
                Usuario.count({ estado: true }, (err, conteo) => {
                    res.json({
                        ok: true,
                        usuarios,
                        cantidadTotal: conteo
                    });
                });

            }
        })

});

app.post('/usuario', [verificaToken, verificaTokenAdminRole], function(req, res) {
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role,
        img: body.img
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            res.status(400).json({
                ok: false,
                error: err
            });
        } else {
            //usuarioDB.password = null;

            res.json({
                ok: true,
                usuario: usuarioDB
            });
        }
    });
})

app.put('/usuario/:id', [verificaToken, verificaTokenAdminRole], function(req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);


    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            res.status(400).json({
                ok: false,
                error: err
            });
        } else {
            res.json({
                ok: true,
                usuario: usuarioDB
            });
        }
    });
})

app.delete('/usuario/:id', [verificaToken, verificaTokenAdminRole], function(req, res) {
    let id = req.params.id;

    const cambiaData = {
        estado: false
    };
    Usuario.findByIdAndUpdate(id, cambiaData, { new: true }, (err, usuarioDB) => {
        if (err) {
            res.status(400).json({
                ok: false,
                error: err
            });
        } else {
            res.json({
                ok: true,
                usuario: usuarioDB
            });
        }
    });
});
/* app.delete('/usuario/:id', function(req, res) {
    let id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                error: err
            });
        }
        if (usuarioDB === null) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Usuario no encontrado.'
                }
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        });

    });
}); */

module.exports = {
    app
};