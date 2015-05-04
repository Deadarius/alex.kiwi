var marked = require('marked');
function init(angular){
  angular.module('alexlapa', ['angulartics', 'angulartics.mixpanel', 'ui.bootstrap', 'templates'])
  .directive('stopEvent', function () {
    return {
      restrict: 'A',
      link: function (scope, element, attr) {
        element.bind(attr.stopEvent, function (e) {
          e.stopPropagation();
        });
      }
    };
  })
  .directive('user', function() {
    return {
      restrict: 'E',
      scope: {
        userdata: '=ngModel'
      },
      controller: ['$scope', function($scope){
        $scope.stars = function(rating){
          var n = 0;
          if(rating>100)
            n = 1;

          if(rating>500)
            n = 2;

          if(rating>2000)
            n = 3;

          if(rating>5000)
            n = 4;

          if(rating>9000)
            n = 5;

          return new Array(n);
        };
      }],
      templateUrl: 'views/user.html',
      replace: true
    };
  })
  .controller('main',
    ['$scope', '$http', '$sce', '$analytics', '$modal',
    function ($scope, $http, $sce, $analytics, $modal) {
      $http.get('/api/listing/data')
        .success(function(data){
          angular.extend($scope, data);
        });

      $http.get('/api/listing/summary')
        .success(function(summaryMd){
          var summaryHtml = marked(summaryMd);
          $scope.listingBody = $sce.trustAsHtml(summaryHtml);
        });

      $http.get('/api/listing/views')
        .success(function(data){
          var views = '' + data.amount;
          if(views.length < 4){
            views = new Array(5-views.length).join('0') + views;
          }
          $scope.views = views;
        });

      $scope.openModal = function (title, message, img) {
        $analytics.eventTrack('Modal clicked', {  title: title });

        $modal.open({
          templateUrl: 'views/modal.html',
          controller: 'modal',
          resolve: {
            title: function(){return title;},
            message: function(){return message;},
            img: function(){return img;}
          }
        });
      };

      $scope.contactForm = function () {
        $analytics.eventTrack('Contact From');

        $modal.open({
          templateUrl: 'views/contact.html',
          controller: 'contactForm',
          resolve: {
            url: function(){
              return $scope.storeDetails.user.url;
            }
          }
        });
      };
  }])
  .controller('modal',
    ['$scope', 'title', 'message', 'img',
    function ($scope, title, message, img) {
      $scope.title = title;
      $scope.message = message;
      $scope.img = img;
    }])
  .controller('contactForm',
    ['$scope', '$sce', 'url',
    function ($scope, $sce, url) {
      $scope.url = $sce.trustAsResourceUrl(url);
  }]);
}

module.exports = init;
