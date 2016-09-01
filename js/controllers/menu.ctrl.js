/**
 * menu.ctrl.js
 */
(function () {
    'use strict';

    var app = angular.module('app');
    app.controller('MenuCtrl', function($scope) {
        $scope.custom = false;
        $scope.toggleMenu = function () {
            $scope.custom = !$scope.custom;
        };
    });
}());

