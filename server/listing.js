var express =  require('express');
var _ = require('lodash');
var request = require('request-promise');
var MixpanelExport = require('mixpanel-data-export');

var router = express.Router();
var panel = new MixpanelExport({
  api_key: '9fd6bd44ba429e12842ec06c802e7a04',
  api_secret: '2333f4bfcb79aecd9ac5c839f9d045e5'
});

router.get('/listing/views', function(req, res, next){
  'use strict';

  panel.events({
    event: ['Page Viewed'],
    type: 'unique',
    unit: 'month',
    interval: 60,
  })
  .then(function(data) {
    var views = data.data.values['Page Viewed'];
    var amount = _.chain(views)
                  .values()
                  .reduce(function(sum, cur){
                    return sum + cur;
                  })
                  .value();

    res.send({amount: amount});
  })
  .catch(next);
});

router.get('/listing/data', function(req, res, next){
  'use strict';

  request('https://www.dropbox.com/s/1d9xq9gjuwe8rv3/listing.json?dl=1')
    .then(function(data){
      var model = JSON.parse(data);
      res.send(model);
    })
    .catch(next);
});

router.get('/listing/summary', function(req, res, next){
  'use strict';

  request('https://www.dropbox.com/s/vkt4ijeq2x4fod4/summary.md?dl=1')
    .then(function(text){
      res.send(text);
    })
    .catch(next);
});

module.exports = router;
