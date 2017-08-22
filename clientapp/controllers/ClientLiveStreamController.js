/* Copyright 2017 PSU Capstone Team D
This code is available under the "MIT License".
Please see the file LICENSE in this distribution for license terms.*/

// Define the ClientLiveStreamController on clientUI module
angular.module('clientUI')
	.controller('ClientLiveStreamController', ['$scope', function ($scope) {
        $scope.skipHlsCheck = false;
        $scope.loadVideo = function() {
              if(($scope.skipHlsCheck === false) || (Hls.isSupported() !== undefined)) {
                var video = document.getElementById('video');
                var hls = new Hls();
                hls.loadSource('http://delta-1-yanexx65s8e5.live.elementalclouddev.com/in_put/testoutput.m3u8');
                hls.attachMedia(video);
                hls.on(Hls.Events.MANIFEST_PARSED,function() {
                  video.play();
              });
            }
            else {
              toastr.error("Your browswer does not support HLS streaming", "Error");
            }
        }
}]);