'use strict';

// Define the AdminUI module
var app = angular.module('adminUI', [
    'controllers',
    'directives',
    'ngRoute'
]).config(function ($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "views/playlist.html"
        })
        .when("/livestream", {
            templateUrl: "views/livestream.html"
        })
        .when("/mediaassets", {
            templateUrl: "views/mediaassets.html"
        })
});

var controllers = angular.module('controllers', '$routeProvider', [$routeProvider]);