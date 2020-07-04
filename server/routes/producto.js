const express = require('express');

const { verificaToken } = require('../middlewares/autenticacion');

let app = express();
let Producto = require('../models/producto');

const _ = require('underscore');



//================================
//        Obtener Productos
//================================
app.get('/productos', verificaToken, (req, res) => {
    //Trae todos los productos
    //populate: usuario categoria
    //paginado
    //disponible : true

    let desde = Number(req.query.desde) || 0;
    let hasta = Number(req.query.hasta) || 16;

    Producto.find({ disponible: true })
        .sort('disponible')
        .skip(desde)
        .limit(hasta)
        .populate('usuario')
        .populate('categoria')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            return res.json({
                ok: true,
                producto: productoDB
            });

        });
});

//================================
//     Obtener Producto por ID
//================================
app.get('/productos/:id', verificaToken, (req, res) => {
    //populate: usuario categoria
    //paginado
    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario')
        .populate('categoria')
        .exec((err, productoDB) => {
            if (err) {
                return res.json({
                    ok: false,
                    err
                });
            }

            return res.json({
                ok: true,
                producto: productoDB
            });
        });
})

//================================
//     Obtener Producto por ID
//================================
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {
    //populate: usuario categoria
    //paginado
    let termino = req.params.termino;

    let regex = RegExp(termino, 'i');


    Producto.find({ disponible: true, nombre: regex })
        .populate('usuario')
        .populate('categoria')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            return res.json({
                ok: true,
                producto: productoDB
            });

        });

});
//================================
//         Crear Productos
//================================
app.post('/productos', verificaToken, (req, res) => {
    //grabar el usuario
    //grabar una categoria del listado de categoria que ya existe
    let body = req.body;
    let productos = new Producto({
        nombre: body.nombre,
        precioUni: Number(body.precioUni),
        descripcion: body.descripcion,
        disponible: true,
        categoria: body.categoria,
        usuario: req.usuario._id

    });

    productos.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        return res.status(201).json({
            ok: true,
            producto: productoDB
        });
    });

});

//================================
//      Actualizar Productos
//================================
app.put('/productos/:id', (req, res) => {
    //Actualizar producto por medio de ID
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'precioUni', 'descripcion', 'usuario', 'categoria']);

    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        return res.status(201).json({
            ok: true,
            producto: productoDB
        });
    });

});

//================================
//        Borrar Productos
//================================
app.delete('/productos/:id', (req, res) => {
    /*
        Al realizar ua petición DELETE, el servicio no lo puede eliminar
        fisicamente, sino que se cambia el el campo *disponible* a false.
    */
    let id = req.body.id;

    const cambiaData = {
        disponible: false
    };

    let condiciones = {
        id,
        disponible: true
    };
    Producto.findOneAndUpdate(condiciones, cambiaData, (err, productoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: {
                    err,
                    message: 'No se pudo eliminar el Producto.'
                }
            });
        }

        if (productoDB === null) {
            return res.json({
                ok: false,
                message: 'Producto no Encontrado.'
            });
        }
        return res.json({
            ok: true,
            message: 'Producto Eliminado con Exito.'
        });
    });

});





module.exports = {
    app
};