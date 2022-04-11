const express = require('express');
const path = require('path')
const multer = require('multer')
const { v4: uuidv4 } = require('uuid');
var mysql = require('mysql');
var bodyParser = require('body-parser')

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'imagenes_up'
});

connection.connect(function (err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }

    console.log('connected as id ' + connection.threadId);
});

const storage = multer.diskStorage({
    destination: path.join(__dirname + '/views', 'public/uploads'),
    filename: (req, file, cb) => {
        cb(null, uuidv4() + path.extname(file.originalname));
    }
})
const upload = multer({
    storage, dest: 'public/uploads',
    limits: { fieldSize: 8000000 },
    fileFilter: (req, file, cb) => {
        const filetypes = /jpg|jpeg|png/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname));
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb("Error: Archivo debe ser una imagen valida")
    }
})
//Server initializations
const app = express();


//Settings
app.set('port', 3000);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname + '/views'));
app.use(express.static(__dirname + '/views'));
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }))

//middlewares

//Routes
app.get('/', (req, res) => {
    res.render('index')
})

app.post('/upload', upload.single("image"), (req, res, next) => {
    console.log(req.file)
    let file_name=req.file.filename;
    connection.query(`INSERT INTO imagenes (file_name) VALUES ("${file_name}")`, function (error, results, fields) {
        if (error) throw error;
        // Callback de error
      });
    res.redirect('/uploads')
})

app.get('/uploads', (req, res) => {
    res.render('uploads')
})


app.listen(app.get('port'), () => {
    console.log(`Server listen on port ${app.get('port')}`)
})