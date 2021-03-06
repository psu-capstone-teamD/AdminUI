/* Copyright 2017 PSU Capstone Team D
This code is available under the "MIT License".
Please see the file LICENSE in this distribution for license terms.*/

// Define the ClientLiveStreamController on clientUI module
angular.module('clientUI')
  .controller('ClientLiveStreamController', ['$scope', function ($scope) {
    $scope.skipHlsCheck = false;
    $scope.loadVideo = function () {
      var ua = navigator.userAgent.toLowerCase();
      var isAndroid = ua.indexOf("android") > -1;

      if (isAndroid) {
        window.location = 'http://delta-1-yanexx65s8e5.live.elementalclouddev.com/out/p/15/it me.m3u8';
        return;
      }
      if (($scope.skipHlsCheck === false) || (Hls.isSupported() !== undefined)) {
        var video = document.getElementById('video');
        var hls = new Hls();
        hls.loadSource('http://delta-1-yanexx65s8e5.live.elementalclouddev.com/out/p/15/it me.m3u8');
        hls.attachMedia(video);
      }
      else {
        toastr.error("Your browswer does not support HLS streaming", "Error");
      }
    }
}]);