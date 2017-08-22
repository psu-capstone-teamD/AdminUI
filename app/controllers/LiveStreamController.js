/* Copyright 2017 PSU Capstone Team D
This code is available under the "MIT License".
Please see the file LICENSE in this distribution for license terms.*/

// Define the LiveStreamController on the adminUI module
angular.module('adminUI')
  .controller('LiveStreamController', ['$scope', 'schedulerService', function ($scope, schedulerService) {
    $scope.skipHlsCheck = false;
    $scope.loadVideo = function () {
      if (schedulerService.livestreamURL === '') {
        toastr.error("Please enter an output URL in config.", "Error")
      }
      else {
        if (($scope.skipHlsCheck === false) || (Hls.isSupported() !== undefined)) {
          var video = document.getElementById('video');
          var hls = new Hls();
          hls.loadSource(schedulerService.livestreamURL);
          hls.attachMedia(video);
        }
        else {
          toastr.error("Your browser does not support HLS streaming", "Error");
        }
      }
    }
}]);