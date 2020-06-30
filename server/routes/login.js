const express = require('express');

const bcrypt = require('bcrypt');

var jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');

const app = express();

app.post('/login', (req, res) => {

    let body = req.body;

    Usuario.findOne({ email: body.email, estado: true }, (err, usuarioBD) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                error: err
            });
        }

        if (!usuarioBD) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: '(Usuario) o contraseña no encontrada'
                }
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioBD.password)) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Usuario o (contraseña) no encontrada'
                }
            });
        }

        let token = jwt.sign({
            usuario: usuarioBD
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

        res.json({
            ok: true,
            usuario: usuarioBD,
            token
        });
    });
});






module.exports = {
    app
};