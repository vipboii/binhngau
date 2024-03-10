var app = angular.module("myapp", ['ngRoute'])

app.run(function ($rootScope, $http) {
    $rootScope.isLogin = sessionStorage.getItem('isLogin');
    
    $rootScope.user = JSON.parse(sessionStorage.getItem('user'));
    console.log($rootScope.user)
    $rootScope.allProduct = []

    // $rootScope.newArrivals = []
    // $rootScope.bestSeller = []


    $http.get("http://localhost:3000/products").then(
        function (d) {
            $rootScope.allProduct = d.data;
            // $rootScope.newArrivals = d.data.filter(p => p.status == "New Arrivals")
            // $rootScope.bestSeller = d.data.filter(p => p.status == "Best Seller")
        },
        function (e) {
            alert("Lỗi" + e.statusText);
        }
    );

    $rootScope.Logout = () => {
        sessionStorage.setItem('isLogin', false)
        $rootScope.isLogin = false;
        
        console.log("out")
    }
    $rootScope.signUp = () => {
        sessionStorage.setItem('isLogin', false)
        $rootScope.isLogin = false;
        console.log("out")
    }

})

app.filter('productStatusFilter', function () {
    return function (items, search) {
        if (!search) {
            return items;
        }

        return items.filter(function (item) {
            if (item.status != null)
                return item.status.toLowerCase().indexOf(search.toLowerCase()) > -1;
        });
    };
});

app.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: './pages/home.html',
            controller: "homeController"
        })
        // .when('/product-details/:id', {
        //     templateUrl: '../pages/details.html',
        //     controller: 'ProductDetailsController'
        // })
        .when('/details/:id', {
            templateUrl: './pages/details.html',
            controller: "detailController"
        })
        .when('/login', {
            templateUrl: './pages/login.html',
            controller: "loginController"
        })
        .when('/signup', {
            templateUrl: './pages/signup.html',
            controller: "signupController"
        })
        .when('/test', {
            templateUrl: '../pages/signup.html',
            
        })
        .when('/changepass/:userId', {
            templateUrl: './pages/changepass.html',
            controller: "changePassController"
        })

        .otherwise({
            redirectTo: '/'
        });
});
app.controller("homeController", function ($scope, $http) {


})

app.controller("detailController", function ($scope, $routeParams, $rootScope) {
    // $scope.ProductId = $routeParams.id
    $scope.detailProduct = $rootScope.allProduct.find(p => p.id == $routeParams.id)
    console.log($scope.detailProduct)
})

app.controller("loginController", function ($scope, $http, $rootScope, $window) {
    $scope.Login = () => {
        if (!$scope.usernameForLogin || !$scope.passwordForLogin) {
            $scope.bug1=true;
            $scope.bug=false;
            // alert("Username and password cannot be empty.");
            return; 
        }else{
            $scope.bug1=false;
        }
        $http.get("http://localhost:3000/users").then(
            function (d) {
                var loginUser = d.data.filter(a => a.username == $scope.usernameForLogin && a.password == $scope.passwordForLogin)
                // console.log(user)
                // if (user == undefined) {
                //     console.log("login failed")
                // } else {
                //     console.log("$scope.passwordForLogin")
                //     if (user.password == $scope.passwordForLogin) {
                //         $rootScope.isLogin = true;
                //         $window.location.href = "/"
                //     } else {
                //         alert("Wrong username or password")
                //     }
                // }

                console.log(loginUser)
                if (loginUser.length != 0) {
                    sessionStorage.setItem('isLogin', true)
                    sessionStorage.setItem('user', JSON.stringify(loginUser[0]))
                    $rootScope.isLogin = true;
                    $scope.bug = false
                    $rootScope.user = loginUser[0]
                    $window.location.href = "/"
                }
                else {
                    // alert("Wrong username or password")
                    $scope.bug = true
                }
            },
            function (e) {
                alert("Lỗi" + e.statusText);
            }
        );
    }
})

app.controller("signupController", function ($scope, $http, $window) {
    $scope.signUp = () => {
        $scope.signUpSuccess = true;
        if ($scope.passwordForSignUp != $scope.passwordConfirmForSignUp) {
            $scope.signUpSuccess = false;

            console.log("u're frucking stup*d")
        }

        if ($scope.signUpSuccess == true) {
            var user = {
                "username": $scope.usernameForSignUp,
                "password": $scope.passwordForSignUp
            }
            $http.post("http://localhost:3000/users", user).then(function (response) {
                console.log('Product added:', response.data);
                // Optionally clear the form or give feedback to the user
              
                alert("signup successfully")
                
                
                $window.location.href = "#!/login"
            }).catch(function (error) {
                console.error('Error adding product:', error);
            });
        }

    }
})

app.controller("changePassController", function ($rootScope, $scope, $http, $routeParams,$window) {
    $scope.bug = false
    $scope.changePass = () => {

        if ($scope.currentPassword == $rootScope.user.password) {
            $rootScope.user.password = $scope.newPassword
            console.log($rootScope.user.password)
            $http.put("http://localhost:3000/users/" + $routeParams.userId, $rootScope.user);
            sessionStorage.setItem('user', JSON.stringify($rootScope.user))
   $window.location.href = "/"
        } else {
            $scope.bug = true
           
        }







        // $scope.newPassword
        // $scope.confirmNewPassword
    }
})

