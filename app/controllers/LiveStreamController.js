/* Copyright 2017 PSU Capstone Team D
This code is available under the "MIT License".
Please see the file LICENSE in this distribution for license terms.*/

// Define the LiveStreamController on the adminUI module
angular.module('adminUI')
  .controller('LiveStreamController', ['$scope', 'schedulerService', function ($scope, schedulerService) {
    $scope.skipHlsCheck = false;
    $scope.loadVideo = function () {
      var ua = navigator.userAgent.toLowerCase();
      var isAndroid = ua.indexOf("android") > -1;
      
      if(isAndroid) {
        window.location = 'http://delta-1-yanexx65s8e5.live.elementalclouddev.com/out/p/15/it me.m3u8';
        return;
      }
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