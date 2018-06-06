'use strict';

var LoginController = function ($scope, $state, LoginApiService, AuthService, $rootScope, $http, $uibModal) {

    $scope.alerts = [];
    $scope.$on('alert', function (event, opt) {
        $scope.alerts.push({
            msg: opt.msg,
            type: opt.type
        });
    });

    $scope.user = {
        username: '',
        password: ''
    };


    $scope.login = function (user) {
        LoginApiService.login(user).then(function (res) {
            if (res.token) {
                AuthService.setToken('inventory-web-client-' + res.token);
                AuthService.setUser(res.user);
                localStorage.setItem('token', AuthService.getToken());
                localStorage.setItem('user', JSON.stringify(AuthService.getUser()));

                $http.defaults.headers.common['Authorization'] = AuthService.getToken();
                $state.go('/');
            } else {
                $rootScope.$broadcast('alert', {msg: "Ошибка аунтификации", type: "danger"});
            }
        }, function (reason) {
            $rootScope.$broadcast('alert', {msg: "Логин или пароль введены неверно", type: "danger"});
        });
    };

    $scope.UserAddClick = function () {
        $scope.usersNewEdit = {
            name: '',
            username: '',
        };
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'userRegistration.html',
            controller: 'UsersAddCtrl',
            size: 'm',
            resolve: {
                users: function () {
                    return $scope.usersNewEdit;
                }
            }
        }).result.then(function () {
        }, function (res) {
        });  // Избовляет от ошибки в консоли "Possibly unhandled rejection: backdrop click"
    };
    $scope.$on('logon', function (event, opt) {
        $scope.login(opt)
    });
};
app.controller('LoginController', LoginController);

app.controller('UsersAddCtrl', function ($rootScope, $scope, $uibModalInstance, LoginApiService, users) {
    $scope.usersNewEdit = users;
    $scope.ok = function (usersNewEdit) {
        LoginApiService.registration(usersNewEdit).then(function (usersNewModel) {
            if (usersNewModel != null) {
                $rootScope.$broadcast('datasetUpdate');
                $rootScope.$broadcast('alert', {msg: "Регистрация прошла успешно!", type: "success"});
                $rootScope.$broadcast('logon', usersNewEdit);
                $uibModalInstance.close(false);
            } else {
                $rootScope.$broadcast('alert', {
                    msg: "Пользователь с таким логином уже существует",
                    type: "danger"
                });
            }
        }, function (reason) {
            var message = reason.data.error + " " + reason.data.status;
            $rootScope.$broadcast('alert', {msg: message, type: "danger"});
        });
    };
    $scope.cancel = function () {
        $uibModalInstance.close(false);
    };
});

