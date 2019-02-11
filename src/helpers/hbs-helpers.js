const moment = require('moment');

const hbsHelpers = {};


hbsHelpers.formateaFecha = (fecha) => {
    moment.locale('es');
    return moment(fecha).format('L');
}


hbsHelpers.esValido = (inputName, errors) => {
    if (errors) {
        errors.forEach(error => {
            if (error.param === inputName) {
                console.log('invalido');
                return "form-control is-invalid";
            } 
        });
    }
    else {
        return "form-control is-valid";
    }
}

hbsHelpers.seleccionaShow = (elementPath, path) => {
    if (path) {
        return elementPath === path ? 'show' : '';
    }
    return '';
}

hbsHelpers.esActivo = (elementPath, path) => {
    if (path) {
        return elementPath === path ? 'active' : '';
    }
    return '';
}

module.exports = hbsHelpers;