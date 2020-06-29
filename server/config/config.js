/*********************************
 ***************PUERTO************
 *********************************/
process.env.PORT = process.env.PORT || 3000;


/*********************************
 ************ENTORNO**************
 *********************************/

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


//=================================
//            BASE DE DATOS
//=================================
let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb+srv://cursoiot:092712@cluster0-cakz3.mongodb.net/cursoiotMondoDB?retryWrites=true&w=majority';
}

process.env.URLDB = urlDB;