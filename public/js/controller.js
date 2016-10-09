var app = angular.module('hashtag', []);
app.controller('home',function($scope, $http) {
    var getreq = 'http://localhost:3000/api/latest';
    $scope.loadData = function () {
        $http.get(getreq).success(function (response) {
            $scope.messages = response;
            //console.log($scope.battles);
        });
    }
    $scope.searchByTag = function() {
    	if (! $scope.searchQuery) {
    		alert ("you asked me to search " + $scope.searchQuery);
    	}
    }
    $scope.save = function() {
    	var message = $scope.message;
    	var userID = $scope.userID;
    	if (userID.charAt(0) !== '_' || message.length() > 160)
    		alert("user id must begin with _ and message length must be less than 160 chars");
    	else {
    		$http.post('http://localhost:3000/api/store').success(function (response) {
            $scope.messages = response;
            //console.log($scope.battles);
        });
    }
});