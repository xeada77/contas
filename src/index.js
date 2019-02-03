const path = require('path');

const express = require('express');
const exphbs = require('express-handlebars');
const expvalidator = require('express-validator');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');

const customValidators = require('./utils/custom-validators');


// Initialization
const app = express();
require('./database');


// Settings
app.set('port', process.env.PORT || 3005);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./helpers/hbs-helpers'),
}));
app.set('view engine', '.hbs');

// Middlewares

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(expvalidator({
    customValidators: customValidators.customValidators,
}));
app.use(session({
    secret: 'mysecretapp',
    resave: true,
    saveUninitialized: true,
}));
app.use(flash());


// Global Variables
app.use((req, res, next) => {
   
    res.locals.success_msg = req.flash('success_msg');
    res.locals.errors_msg = req.flash('errors_msg');

    next();
});





// Routes
app.use(require('./routes/anos'));
app.use(require('./routes/movimientos'));
app.use(require('./routes/categorias'));

// Static Files
app.use(express.static(path.join(__dirname, 'public')));

// Server Listen
app.listen(app.get('port'), () => {
    console.log('Servidor escuchando en puerto', app.get('port'));
});