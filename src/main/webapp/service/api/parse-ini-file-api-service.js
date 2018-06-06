'use strict';

var ParseIniFileApiService = function (Restangular) {

    this.getParsingIniFile = function () {
        return Restangular.all('parseIniFile').customGET();
    };

    this.add = function (item) {
        return Restangular.one('parseIniFile').customPOST(item);
    };
    return this;
};

app.service('ParseIniFileApiService', ParseIniFileApiService);
ParseIniFileApiService.$inject = ['Restangular'];
