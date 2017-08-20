'use strict';

// Define the AdminUI module
var app = angular.module('adminUI', [    
	'ngRoute',
	'angular-uuid',
    'ui.sortable'
]).config(function ($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "views/playlist.html",
            controller: 'PlaylistController'
        })
        .when("/livestream", {
            templateUrl: "views/livestream.html",
            controller: 'LiveStreamController'
        })
        .when("/mediaassets", {
            templateUrl: "views/mediaassets.html",
            controller: 'MediaAssetsController'
        })
        .when("/config", {
            templateUrl: "views/config.html",
            controller: 'ConfigController'
        })
});
