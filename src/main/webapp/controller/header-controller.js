'use strict';
var HeaderController = function ($scope, $state, AuthService, $http) {
    //alerts=========================================================================
    $scope.alerts = [];
    $scope.$on('alert', function (event, opt) {
        $scope.alerts.push({
            msg: opt.msg,
            type: opt.type
        });
    });
    //alerts=========================================================================

    $scope.checkRole = function (stateName) {
        var flag = false;
        AuthService.getUser().roles.forEach(function (role) {
            if (role === $state.get(stateName).data) {
                flag = true;
            }
        });
        return flag;
    };
    $scope.$on('logout', function () {
        $scope.logout();
    });
    $scope.logout = function () {
        $http.defaults.headers.common['Authorization'] = null;
        $state.go('login');
        localStorage.clear();
    };

    $scope.isActive = function (viewLocation) {
        return viewLocation === $state.current.name;
    };
    $scope.SubUnitClick = function () {
        $state.go('/.subUnits');
    };
    $scope.WorkersClick = function () {
        $state.go('/.workers');
    };
    $scope.TypeOfStoragePlaceClick = function () {
        $state.go('/.typeOfStoragePlace');
    };
    $scope.PlaceOfStorageClick = function () {
        $state.go('/.placeOfStorage');
    };
    $scope.NomenclatureTypeClick = function () {
        $state.go('/.nomenclatureType');
    };
    $scope.NomenclatureClick = function () {
        $state.go('/.nomenclature');
    };
    $scope.UploadFileClick = function () {
        $state.go('/.uploadFile');
    };
    $scope.ParseIniFile = function () {
        $state.go('/.parseIniFile');
    };
    $scope.InventoryClick = function () {
        $state.go('/.inventory');
    };
    $scope.MoveOperationClick = function () {
        $state.go('/.moveOperation');
    };
    $scope.WriteOffOperationClick = function () {
        $state.go('/.writeOffOperation');
    };
    $scope.UsersClick = function () {
        $state.go('/.users');
    };
    $scope.NomenclatureCardReportClick = function () {
        $state.go('/.nomenclatureCardReport');
    };
    $scope.PlaceOfStorageReportClick = function () {
        $state.go('/.placeOfStorageReport');
    };
    $scope.TypeOfStoragePlaceReportClick = function () {
        $state.go('/.typeOfStoragePlaceReport');
    };
    $scope.Reload = function () {
        $state.reload();
    }

};

app.controller('HeaderController', HeaderController);