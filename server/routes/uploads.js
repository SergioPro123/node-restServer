const express = require('express');
const fileUpload = require('express-fileupload');
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const fs = require('fs');
const path = require('path');

const app = express();



// default options
app.use(fileUpload());

app.put('/upload/:tipo/:id', function(req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;

    //Revisamos si se encontro algun archivo
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningun archivo'
            }
        });
    }

    //Valida tipos 
    let tipoValidos = ['usuario', 'producto'];
    if (tipoValidos.indexOf(tipo) < 0) {
        return res.json({
            ok: false,
            err: {
                message: 'Tipo no permitido, los tipos permitidos son: ' + tipoValidos.join(', ')
            }
        });
    }

    //El nombre del campo de entrada (es decir, "sampleFile") se utiliza para recuperar el archivo cargado.
    let archivo = req.files.archivo;
    let nombreArray = archivo.name.split('.');
    let extension = nombreArray[nombreArray.length - 1];


    //Extensiones permitidas
    let extensionValida = ['png', 'jpg', 'gif', 'jpge'];

    if (extensionValida.indexOf(extension) < 0) {
        return res.json({
            ok: false,
            err: {
                message: 'Extensión no valida, extenciones permitidas : ' + extensionValida.join(', '),
                extensionRecibida: extension
            }
        });
    }

    //Cambiar nombre al archivo 

    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`




    // Use el método mv () para colocar el archivo en algún lugar de su servidor
    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        switch (tipo) {
            case 'usuario':
                imagenUsuario(id, res, nombreArchivo);
                break;
            case 'producto':
                imagenProducto(id, res, nombreArchivo);
                break;
        }
    });


});


let imagenProducto = (id, res, nombreArchivo) => {
    Producto.findById(id)
        .exec((err, productoDB) => {
            if (err) {
                borrarImg('producto', nombreArchivo);
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productoDB) {
                borrarImg('producto', nombreArchivo);
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'producto no existe'
                    }
                });
            } else {


                borrarImg('producto', productoDB.img);

                productoDB.img = nombreArchivo;

                productoDB.save((err, productoGuardado) => {
                    return res.json({
                        ok: true,
                        producto: productoGuardado,
                        img: nombreArchivo
                    });
                });
            }



        });
};


let imagenUsuario = (id, res, nombreArchivo) => {

    Usuario.findById(id)
        .exec((err, usuarioDB) => {
            if (err) {
                borrarImg('usuario', nombreArchivo);
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!usuarioDB) {
                borrarImg('usuario', nombreArchivo);
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Usuario no existe'
                    }
                });
            } else {


                borrarImg('usuario', usuarioDB.img);

                usuarioDB.img = nombreArchivo;

                usuarioDB.save((err, usuarioGuardado) => {
                    return res.json({
                        ok: true,
                        usuario: usuarioGuardado,
                        img: nombreArchivo
                    });
                });
            }



        });
};


let borrarImg = (tipo, nombreImg) => {
    let pathImg = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImg}`);

    if (fs.existsSync(pathImg)) {
        fs.unlinkSync(pathImg);
    }
};



module.exports = {
    app
};