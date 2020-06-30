require('./config/config');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();



const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//Habilitamos la carpeta public
app.use(express.static(path.resolve(__dirname, '../public')));
//Configuracion global de rutas
app.use(require('./routes/index').app);

let conectarDB = async() => {
    await mongoose.connect(process.env.URLDB, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).then((msj) => {
            console.log('Conexion Exitosa a la base de datos');
        })
        .catch((err) => {
            console.log(err);
        });
    return;
};

conectarDB();


app.listen(process.env.PORT, () => console.log('Escuchando en el puerto ', process.env.PORT));