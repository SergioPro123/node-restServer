const express = require('express');

let { verificaToken, verificaTokenAdminRole } = require('../middlewares/autenticacion');

const _ = require('underscore');

let app = express();

const Categoria = require('../models/categoria');


//=================================
//   Mostrar Todas las Categorias
//=================================
app.get('/categoria', verificaToken, (req, res) => {

    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categoriaDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            return res.json({
                ok: true,
                categoriaDB
            });
        });
});

//=================================
//  Mostrar Una Categoria por Id
//=================================
app.get('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        return res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

//=================================
//   Crear una nueva Categoria
//=================================
app.post('/categoria', verificaToken, (req, res) => {
    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        return res.json({
            ok: true,
            usuario: req.usuario._id,
            categoria: categoriaDB
        });

    });
});

//=================================
//   Actualizar una Categoria
//=================================
app.put('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['descripcion', 'usuario']);

    Categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, categoriaDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        return res.json({
            ok: true,
            categoria: categoriaDB
        });


    });
});

//=================================
//   Eliminar una Categoria
//=================================
app.delete('/categoria/:id', [verificaToken, verificaTokenAdminRole], (req, res) => {
    let id = req.params.id;

    Categoria.findByIdAndDelete(id, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                error: err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Categoria no encontrada.'
                }
            });
        }

        return res.json({
            ok: true,
            message: 'Categoria Borrada'
        });

    });
});



module.exports = {
    app
};