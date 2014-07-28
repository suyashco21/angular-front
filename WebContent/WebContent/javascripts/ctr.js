//define module
var myApp = angular.module('myApp', ['ngRoute']);

//configure routes
myApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
	when('/home', {templateUrl: 'partials/home.html', controller: 'HomeController'}).
	when('/partners', {templateUrl: 'partials/partners.html', controller: 'PartnerListController'}).
	when('/issuers', {templateUrl: 'partials/issuers.html', controller: 'IssuerController'}).
	when('/accounts', {templateUrl: 'partials/accounts.html', controller: 'AccountController'}).
	when('/reports', {templateUrl: 'partials/reports.html', controller: 'ReportController'}).
	otherwise({redirectTo: '/home'});
}]);

//-------------------------------controllers--------------------
//home controller
myApp.controller('HomeController', function HomeController($scope){
	$scope.message = {
	'm': 'welcome message'};
 });
 //define controller to fetch partner data
myApp.controller('PartnerListController', ['$scope', '$http', function($scope, $http) {
  $http.get('js/partnerData.json').success(function(data) {
    $scope.partners = data;
	});
  }]);
  //issuer controller
myApp.controller('IssuerController', ['$scope', '$http', function($scope, $http) {
  $http.get('js/partnerData.json').success(function(data) {
    $scope.p = data;
	});
  }]); 
//accounts controller
myApp.controller('AccountController', function AccountController($scope){
	$scope.account = {
	'a': 'Account info here'};
 });
 //reports controller
myApp.controller('ReportController', function ReportController($scope){
	$scope.report = {
	'r': 'Generate reports here'};
 });


