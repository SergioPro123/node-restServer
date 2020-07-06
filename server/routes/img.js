const express = require('express');
const path = require('path');
const fs = require('fs');

const { verificaTokenImg } = require('../middlewares/autenticacion');
const app = express();


app.get('/imagen/:tipo/:img', verificaTokenImg, (req, res) => {

    let tipo = req.params.tipo;
    let img = req.params.img;

    let pathImg = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);
    if (fs.existsSync(pathImg)) {
        res.sendFile(pathImg);
    } else {
        let noImagePath = path.resolve(__dirname, '../assets/img/no-image.jpg');
        res.sendfile(noImagePath);
    }




});









module.exports = {
    app
};