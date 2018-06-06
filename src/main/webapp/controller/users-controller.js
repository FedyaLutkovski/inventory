'use strict';

var UsersController = function ($scope, UsersApiService, UsersDataService, $rootScope, NgTableParams, $uibModal) {
    $scope.getAllUsers = function () {
        UsersApiService.getAll().then(function (result) {
            UsersDataService.setModels(result);
            $scope.users = UsersDataService.getModels();
            $scope.newUsers = 0;
            $scope.users.forEach(function (user) {
                user.roles.forEach(function (role) {
                    if (role === "WITHOUTRIGHTS") {
                        $scope.newUsers++;
                    }
                })
            });
            if ($scope.newUsers > 0) {
                $rootScope.$broadcast('alert', {
                    msg: "Новых пользователей: " + $scope.newUsers,
                    type: "info"
                });
            }
            $scope.table = new NgTableParams({
                sorting: {surname: "asc"},
                count: 25
            }, {counts: [25, 50, 100], dataset: $scope.users});
        }, function (reason) {
            var message = reason.data.error + " " + reason.data.status;
            $rootScope.$broadcast('alert', {msg: message, type: "danger"});
        });
    };

    $scope.UserTrClick = function (user) {
        $scope.usersNewEdit = {
            id: user.id,
            name: user.name,
            username: user.username,
            roles: user.roles
        };
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'usersEditView.html',
            controller: 'UsersAddEditCtrl',
            size: 'm',
            resolve: {
                users: function () {
                    return $scope.usersNewEdit;
                },
                action: function () {
                    return "update";
                }
            }
        }).result.then(function () {
        }, function (res) {
        });  // Избовляет от ошибки в консоли "Possibly unhandled rejection: backdrop click"
    };

    $scope.UserAddClick = function () {
        $scope.usersNewEdit = {
            name: '',
            username: '',
            roles: ''
        };
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'usersEditView.html',
            controller: 'UsersAddEditCtrl',
            size: 'm',
            resolve: {
                users: function () {
                    return $scope.usersNewEdit;
                },
                action: function () {
                    return "add";
                }
            }
        }).result.then(function () {
        }, function (res) {
        });  // Избовляет от ошибки в консоли "Possibly unhandled rejection: backdrop click"
    };

    $scope.UserDeleteClick = function (user) {
        $scope.usersNewEdit = {
            id: user.id,
            name: user.name,
            username: user.username,
            roles: user.roles
        };
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'usersDeleteView.html',
            controller: 'UsersDeleteCtrl',
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
    $scope.$on('datasetUpdate', function () {
        $scope.table.reload();
    });
    $scope.getAllUsers();
};

app.controller('UsersController', UsersController);

app.controller('UsersAddEditCtrl', function ($rootScope, $scope, $uibModalInstance, UsersApiService, users,
                                             UsersDataService, action, AuthService) {
    $scope.usersNewEdit = users;
    var username = null;
    if (action === "update") {
        $scope.showcheck = true;
        username = $scope.usersNewEdit.username;
    } else {
        $scope.changepass = true;
    }
    $scope.showSpan = function () {
        return ($scope.showcheck && username !== $scope.usersNewEdit.username)
    };
    $scope.ok = function (usersNewEdit) {
        if (usersNewEdit.id > 0) {
            UsersApiService.update(usersNewEdit).then(function (usersNewModel) {
                if (usersNewModel != null) {
                    UsersDataService.update(usersNewEdit);
                    $rootScope.$broadcast('datasetUpdate');
                    $rootScope.$broadcast('alert', {msg: "Сохранено успешно!", type: "success"});
                    if (AuthService.getUser().username === username && username !== usersNewEdit.username) {
                        $rootScope.$broadcast('logout');
                        $uibModalInstance.close(false);
                    } else {
                        $rootScope.$broadcast('datasetUpdate');
                        $uibModalInstance.close(false);
                    }
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
        } else {
            UsersApiService.add(usersNewEdit).then(function (usersNewModel) {
                if (usersNewModel != null) {
                    UsersDataService.add(usersNewModel);
                    $rootScope.$broadcast('datasetUpdate');
                    $rootScope.$broadcast('alert', {msg: "Сохранено успешно!", type: "success"});
                    $rootScope.$broadcast('datasetUpdate');
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
        }
    };
    $scope.cancel = function () {
        $uibModalInstance.close(false);
    };
});

app.controller('UsersDeleteCtrl', function ($scope, $rootScope, $uibModalInstance, UsersApiService, users, UsersDataService) {
    $scope.usersNewEdit = users;

    $scope.ok = function (id) {
        UsersApiService.delete(id).then(function () {
            UsersDataService.delete(id);
            $rootScope.$broadcast('datasetUpdate');
            $rootScope.$broadcast('alert', {msg: "Удаление прошло успешно!", type: "success"});
            $uibModalInstance.close(false);
        }, function (reason) {
            var message = reason.data.error + " " + reason.data.status;
            $rootScope.$broadcast('alert', {msg: message, type: "danger"});
        });
    };

    $scope.cancel = function () {
        $uibModalInstance.close(false);
    };
});