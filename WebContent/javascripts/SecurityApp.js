var app = angular.module('securityApp', ["ui.router"]);
app.config(function($stateProvider, $urlRouterProvider){
    
    // For any unmatched url, send to /home
    $urlRouterProvider.otherwise("/login")
    
    $stateProvider.state('login', {
        url: "/login",
        templateUrl: "templates/login.html",
		controller: "LoginController"
    })
      .state('home', {
          url: "/home",
          templateUrl: "templates/home.html",
			controller: "Home", resolve: {
	            auth: function ($q, authenticationSvc) {
	                var userInfo = authenticationSvc.getUserInfo();
	                if (userInfo) {
	                    return $q.when(userInfo);
	                } else {
	                    return $q.reject({ authenticated: false });
	                }
	            }
	        }
      })
		.state('partner', {
          url: "/partner",
          templateUrl: "templates/partners.html",
			controller: "PartnerListController", resolve: {
	            auth: function ($q, authenticationSvc) {
	                var userInfo = authenticationSvc.getUserInfo();
	                if (userInfo) {
	                    return $q.when(userInfo);
	                } else {
	                    return $q.reject({ authenticated: false });
	                }
	            }
	        }
      })
		.state('issuer', {
          url: "/issuer",
          templateUrl: "templates/issuers.html",
			controller: "IssuerController", resolve: {
	            auth: function ($q, authenticationSvc) {
	                var userInfo = authenticationSvc.getUserInfo();
	                if (userInfo) {
	                    return $q.when(userInfo);
	                } else {
	                    return $q.reject({ authenticated: false });
	                }
	            }
	        }
      })
      .state('account', {
          url: "/account",
          templateUrl: "templates/accounts.html" , resolve: {
              auth: function ($q, authenticationSvc) {
                  var userInfo = authenticationSvc.getUserInfo();
                  if (userInfo) {
                      return $q.when(userInfo);
                  } else {
                      return $q.reject({ authenticated: false });
                  }
              }
          }
      })
        .state('account.list', {
            url: "/list",
            templateUrl: "templates/account.list.html",
            controller: "AccountController"
        })
        
      .state('report', {
          url: "/report",
          templateUrl: "templates/reports.html", resolve: {
              auth: function ($q, authenticationSvc) {
                  var userInfo = authenticationSvc.getUserInfo();
                  if (userInfo) {
                      return $q.when(userInfo);
                  } else {
                      return $q.reject({ authenticated: false });
                  }
              }
          }
      })
        .state('report.report1', {
            url: "/report",
            templateUrl: "templates/report.report1.html",
            controller: "Report1Controller"
        })
		  .state('report.report2', {
            url: "/report",
            templateUrl: "templates/report.report2.html",
            controller: function($scope){
              $scope.stuffs = ["some", "other", "list", "Of", "stuff"];
            }
        })
		  .state('report.report3', {
            url: "/report",
            templateUrl: "templates/report.report3.html",
            controller: function($scope){
              $scope.objects = ["can", "not", "think", "Of", "anything"];
            }
        })
  })




/**app.config(["$routeProvider",function ($routeProvider) {
    $routeProvider.when("/", {
        templateUrl: "templates/home.html",
        controller: "HomeController",
        resolve: {
            auth: function ($q, authenticationSvc) {
                var userInfo = authenticationSvc.getUserInfo();
                if (userInfo) {
                    return $q.when(userInfo);
                } else {
                    return $q.reject({ authenticated: false });
                }
            }
        }
    }).when('/message', {templateUrl: 'templates/mesaage.html', controller: 'Home',resolve: {
            auth: function ($q, authenticationSvc) {
                var userInfo = authenticationSvc.getUserInfo();
                if (userInfo) {
                    return $q.when(userInfo);
                } else {
                    return $q.reject({ authenticated: false });
                }
            }
        }}).
	when('/partners', {templateUrl: 'templates/partners.html', controller: 'PartnerListController',resolve: {
            auth: function ($q, authenticationSvc) {
                var userInfo = authenticationSvc.getUserInfo();
                if (userInfo) {
                    return $q.when(userInfo);
                } else {
                    return $q.reject({ authenticated: false });
                }
            }
        }}).
	when('/issuers', {templateUrl: 'templates/issuers.html', controller: 'IssuerController',resolve: {
            auth: function ($q, authenticationSvc) {
                var userInfo = authenticationSvc.getUserInfo();
                if (userInfo) {
                    return $q.when(userInfo);
                } else {
                    return $q.reject({ authenticated: false });
                }
            }
        }}).
	when('/accounts', {templateUrl: 'templates/accounts.html', controller: 'AccountController',resolve: {
            auth: function ($q, authenticationSvc) {
                var userInfo = authenticationSvc.getUserInfo();
                if (userInfo) {
                    return $q.when(userInfo);
                } else {
                    return $q.reject({ authenticated: false });
                }
            }
        }}).
	when('/reports', {templateUrl: 'templates/reports.html', controller: 'ReportController',resolve: {
            auth: function ($q, authenticationSvc) {
                var userInfo = authenticationSvc.getUserInfo();
                if (userInfo) {
                    return $q.when(userInfo);
                } else {
                    return $q.reject({ authenticated: false });
                }
            }
        }}).
	when("/login", {
        templateUrl: "templates/login.html",
        controller: "LoginController",
    });
	
}]);*/

app.run(["$rootScope", "$location", function ($rootScope, $location) {

    $rootScope.$on("$routeChangeSuccess", function (userInfo) {
        console.log(userInfo);
    });

    $rootScope.$on("$routeChangeError", function (event, current, previous, eventObj) {
        if (eventObj.authenticated === false) {
            $location.path("/login");
        }
    });
}]);

app.factory("authenticationSvc", ["$http","$q","$window",function ($http, $q, $window) {
    var userInfo;

    function login(userName, password) {
        var deferred = $q.defer();

        $http.post("http://localhost:3000/api/login", { userName: userName, password: password })
            .then(function (result) {
                userInfo = {
                    accessToken: result.data.access_token,
                    userName: result.data.userName
                };
                $window.sessionStorage["userInfo"] = JSON.stringify(userInfo);
                deferred.resolve(userInfo);
            }, function (error) {
                deferred.reject(error);
            });

        return deferred.promise;
    }

    function logout() {
        var deferred = $q.defer();

        $http({
            method: "POST",
            url: "http://localhost:3000/api/logout",
            headers: {
                "access_token": userInfo.accessToken
            }
        }).then(function (result) {
            userInfo = null;
            $window.sessionStorage["userInfo"] = null;
            deferred.resolve(result);
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    }

    function getUserInfo() {
        return userInfo;
    }

    function init() {
        if ($window.sessionStorage["userInfo"]) {
            userInfo = JSON.parse($window.sessionStorage["userInfo"]);
        }
    }
    init();

    return {
        login: login,
        logout: logout,
        getUserInfo: getUserInfo
    };
}]);

app.controller("LoginController", ["$scope", "$location", "$window", "authenticationSvc",function ($scope, $location, $window, authenticationSvc) {
    $scope.userInfo = null;
    $scope.login = function () {
        authenticationSvc.login($scope.userName, $scope.password)
            .then(function (result) {
                $scope.userInfo = result;
                $location.path("/home");
            }, function (error) {
                $window.alert("Invalid credentials");
                console.log(error);
            });
    };

    $scope.cancel = function () {
        $scope.userName = "";
        $scope.password = "";
    };
}]);

app.controller("HomeController", ["$scope", "$location", "authenticationSvc", "auth",function ($scope, $location, authenticationSvc, auth) {
    $scope.userInfo = auth;

    $scope.logout = function () {

        authenticationSvc.logout()
            .then(function (result) {
                $scope.userInfo = null;
                $location.path("/login");
            }, function (error) {
                console.log(error);
            });
    };
}]);

app.controller('Home', function HomeController($scope){
	$scope.message = {
	'm': 'welcome message'};
 });
 //define controller to fetch partner data
app.controller('PartnerListController', ['$scope', '$http', function($scope, $http) {
  $http.get('javascripts/ctr.json').success(function(data) {
    $scope.partners = data;
	});
  }]);
  //issuer controller
app.controller('IssuerController', ['$scope', '$http', function($scope, $http) {
  $http.get('javascripts/ctr.json').success(function(data) {
    $scope.p = data;
	});
  }]); 
//accounts controller
app.controller('AccountController', function AccountController($scope){
	$scope.account = {
	'a': 'Account info here'};
 });
 //reports controller
app.controller('Report1Controller', function ReportController($scope){
	$scope.report = {
	'r': 'Generate reports here'};
 });


