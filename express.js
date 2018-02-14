var express = require('express'),
    routes = require('./routes'),
    user = require('./routes/user'),
    http = require('http'),
    path = require('path'),
    fs = require('fs');

var app = express();

app.use(express.static('public'));
app.use(express.static('views'));
app.use(express.static('routes'));
app.use(express.static('server'));

