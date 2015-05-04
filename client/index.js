require('../node_modules/bootstrap/dist/css/bootstrap.css');
require('./styles/site.less');
require('./styles/fontello.css');

setTimeout(function(){
  require('./mixpanel');
}, 0);
window.jQuery = require('jQuery');

var angular = require('angular');
require('bootstrap');
require('angular-bootstrap');
require('angulartics');
require('angulartics-mixpanel');

var app = require('./app');
require('./templates');
app(angular);
