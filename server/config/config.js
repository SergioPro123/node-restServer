/*********************************
 ***************PUERTO************
 *********************************/
process.env.PORT = process.env.PORT || 3000;


/*********************************
 ************ENTORNO**************
 *********************************/

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//=================================
//      Vencimiento del Token
//=================================
// 60 segundos * 60 minutos * 24 horas * 30 dias

process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30 * 100;

//=================================
//        SEED de autenticación
//=================================

process.env.SEED = process.env.SEED || 'SEED-DESARROLLO';

//=================================
//            BASE DE DATOS
//=================================
let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

//=================================
//         Google Client ID
//=================================

process.env.CLIENT_ID = process.env.CLIENT_ID || '818399681399-gs7v9cbpn9hrkfe2ad8u3ggom3mk24fa.apps.googleusercontent.com';