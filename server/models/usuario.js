const mongoose = require('mongoose');
const uniqueValitor = require('mongoose-unique-validator');

const Schema = mongoose.Schema;


let usuarioShema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    email: {
        unique: true,
        type: String,
        required: [true, 'El correo es necesario']
    },
    password: {
        type: String,
        required: [true, 'Password es Obligatoria']
    },
    img: {
        type: String,
        required: false
    }, // No es obligatorio
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: {
            values: ['ADMIN_ROLE', 'USER_ROLE'],
            message: '{VALUE} no es un rol valido.'
        }
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

usuarioShema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
};

usuarioShema.plugin(uniqueValitor, '{PATH} debe ser único');
module.exports = mongoose.model('Usuario', usuarioShema);