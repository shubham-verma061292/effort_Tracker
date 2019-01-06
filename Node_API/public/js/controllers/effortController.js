angular.module('empeffort', ['ngMaterial','ngMessages','effortController','effortService'])
  .controller('empeffortController', ['$scope', '$http', '$location', 'Efforts', function ($scope, $http, $location, Efforts)
  {
      $scope.work_order_track = [{"name":"API"},{"name":"Core"},{"name":"P2P8"},{"name":"HELOC"},{"name":"TestNet"},{"name":"RBADT"},{"name":"RICA"}];
      $scope.select_wot = function() {
          console.log('Hell------' +$scope.select_w_o_t);
            var work_order_track = $scope.select_w_o_t;
        }

  }
]);
