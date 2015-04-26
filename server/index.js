var express =  require('express');
var morgan =   require('morgan');
var path =     require('path');
var Cacher = require('cacher');
var cacher = new Cacher();
var listing =  require('./listing');

var app = express();

app.use(cacher.cache('days', 1));
app.use(morgan('short'));
app.use('/api', listing);

app.use(express.static(path.resolve(__dirname, '../dist')));


app.use(function(error, req, res, next) {
  'use strict';

  console.error('Not good brah', error);
  next(error);
});

app.listen(process.env.PORT || 3000);
