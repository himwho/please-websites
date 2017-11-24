var app = angular.module('iOS8Poems', ['infinite-scroll']);
app.controller('PoemCtrl', function($scope, $http, $location) {
    $scope.temp = null;
    $scope.poems = [];

    $scope.limit = 25;
    $scope.offset = 0;
    $scope.page = 0;
    $scope.skip = 0;
    $scope.total = 0;
    $scope.hasNextPage = true;
    $scope.host = 'http://' + $location.host() + ':5984';

    $scope.loadPoems = function() {
        var config = {params: {limit: $scope.limit, skip: $scope.skip}};

        if($scope.hasNextPage) {
            $http.get($scope.host + '/poems/_design/poems/_view/basic', config).
                success(function(data, status, headers, config) {
                    // Update paging variables
                    $scope.offset = data.offset;
                    $scope.page = ($scope.offset / $scope.limit) + 1;
                    $scope.skip = $scope.page * $scope.limit;

                    for(var i = 0; i < data.rows.length; i++) {
                        row = data.rows[i];
                        var poem = {title: row.key, text: row.value}
                        $scope.poems.push(poem);
                    }
                    $scope.temp = null;
                    $scope.hasNextPage = ($scope.page != Math.floor($scope.total / $scope.limit) + ($scope.total % $scope.limit));
                    console.log($scope.poems);
                }).
                error(function(data, status, headers, config) {
                    console.log("ERROR", data, status, headers, config);
                });
        }
    };

    $scope.insertPoem = function() {
        $http.post($scope.host + '/poems/', $scope.temp).
            success(function(data, status, headers, config) {
                //$scope.loadPoems();
            }).
            error(function(data, status, headers, config) {
                console.log("ERROR", data, status, headers, config);
            });
    };
});