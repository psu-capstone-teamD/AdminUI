// Define the AdminUI module
var adminUI = angular.module('adminUI', []);

// Define the PlaylistController on the adminUI module
adminUI.controller('PlaylistController', function PlaylistController($scope) {
    $scope.videos = [

    ];
});

// Define the MediaAssetsController on the adminUI module
adminUI.controller('MediaAssetsController', function MediaAssetsController($scope) {
    $scope.config = [

    ];
});

// Define the ConfigController on the adminUI module
adminUI.controller('ConfigController', function ConfigController($scope) {
    $scope.config = [

    ];
});

// Define the LiveStreamController on the adminUI module
adminUI.controller('LiveStreamController', function ConfigController($scope) {
    $scope.config = [

    ];
});