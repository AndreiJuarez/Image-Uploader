const express = require('express');
const path = require('path')

const app= express();

app.set('port', 3000);
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/views'));

app.get('/',(req,res)=>{
    res.render('index')
})

app.get('/uploads',(req,res)=>{
    res.render('uploads')
})

app.listen(app.get('port'),()=>{
    console.log(`Server listen on port ${app.get('port')}`)
})